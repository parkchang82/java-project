package com.example.demo;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;

// 실제 프로젝트에서는 User, UserRepository, JwtUtil, ChangePasswordRequest를 적절히 import 해야 합니다.
// (생략된 import 가정)

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserRepository repo; // DB 접근
    
    @Autowired
    private JwtUtil jwtUtil; // JWT 토큰 생성/관리를 위한 유틸리티 클래스
    
    // BCryptPasswordEncoder는 Bean으로 등록하여 주입받는 것이 좋습니다. (편의상 여기서 생성)
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // DTO 클래스는 별도 파일로 분리하는 것을 권장합니다.
    public static class LoginRequest {
        private String email; 
        private String password;
        
        // Getter/Setter 생략
        public String getEmail() { return email; }
        public String getPassword() { return password; }
    }
    
    // User 엔티티의 필드가 name, email, password, date(birthDate), gender 라고 가정


    /**
     * 🚪 회원가입 REST API
     * @param user 클라이언트에서 받은 사용자 정보 (email, password 등)
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (repo.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", "이미 존재하는 이메일입니다."));
        }
        
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        
        repo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "message", "회원가입이 완료되었습니다."));
    }


    
    /**
     * 🔑 로그인 REST API: JWT 토큰 발급이 추가되었습니다.
     * @param request 로그인 요청 정보 (email, password)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String email = request.getEmail();
        String rawPassword = request.getPassword();
        
        User user = repo.findByEmail(email);

        if (user == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            // 사용자 존재하지 않거나 비밀번호 불일치
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "아이디 또는 비밀번호 오류입니다."));
        }

        // 인증 성공 시: JWT 토큰 생성 (유저 고유 식별자, 즉 이메일 사용)
        String accessToken = jwtUtil.generateToken(user.getEmail());
        
        // 토큰을 프론트엔드에 응답 (프론트엔드는 이 토큰을 localStorage에 저장)
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "message", "로그인 성공",
            "accessToken", accessToken // <-- 프론트가 저장할 토큰
        ));
    }
    


    /**
     * 👤 프로필 정보 조회 API (로그인 유저 식별의 핵심)
     * 프론트엔드의 useEffect에서 호출하는 '/api/profile' 요청을 처리합니다.
     * @param userDetails JWT 검증을 통해 Spring Security Context에 저장된 현재 로그인 유저 정보
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
        @AuthenticationPrincipal UserDetails userDetails // <-- 로그인 유저 식별
    ) {
        String authenticatedEmail = userDetails.getUsername(); 
        User user = repo.findByEmail(authenticatedEmail);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "사용자 정보를 찾을 수 없습니다."));
        }
        
        // 보안을 위해 비밀번호는 제외하고 필요한 정보만 Map으로 반환
        Map<String, Object> profileData = Map.of(
            "email", user.getEmail(),
            "name", user.getName(), 
            "birthDate", user.getDate(), 
            "gender", user.getGender() 
        );

        // 프론트엔드가 기대하는 JSON 형식으로 응답
        return ResponseEntity.ok(profileData);
    }



    /**
     * 🔒 비밀번호 변경 API (유저 식별 및 검증)
     * @param request 현재/새 비밀번호 정보
     * @param authentication 현재 인증된 유저 정보 (JWT 필터를 통해 채워짐)
     */
    @Transactional
    @PostMapping("/changepassword")
    public ResponseEntity<?> changePassword(
        @RequestBody ChangePasswordRequest request,
        Authentication authentication // <-- 로그인 유저 식별
    ) {
        String authenticatedEmail = authentication.getName();
        User user = repo.findByEmail(authenticatedEmail);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "사용자 정보를 찾을 수 없습니다."));
        }
        
        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", "비밀번호 변경에 실패했습니다. 현재 비밀번호를 다시 확인해주세요."));
        }
        
        // 새 비밀번호 암호화 및 업데이트
        String newEncodedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(newEncodedPassword);
        
        // @Transactional에 의해 변경 내용이 DB에 반영됨
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("success", true, "message", "비밀번호가 성공적으로 변경되었습니다."));
    }



    /**
     * 🚪 안전한 로그아웃 API (토큰 블랙리스트 또는 만료 처리)
     * (이 예시에서는 토큰 블랙리스트 대신 성공 응답만 반환하고, 실제 무효화 로직은 JwtUtil 또는 별도 Service에서 처리해야 함)
     */
    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(
        @RequestHeader(name = "Authorization") String authorizationHeader
    ) {
        // 1. 헤더에서 토큰 추출
        String token = authorizationHeader.substring(7); // "Bearer " 제거
        
        // 2. 🚨 실제로는 여기서 토큰을 블랙리스트에 추가하는 로직(DB 저장)을 구현해야 합니다.
        //    (토큰의 만료 시간을 강제로 단축시키는 방식으로도 구현 가능)
        
        // 3. HttpOnly 쿠키 사용 시: 쿠키 만료 응답 헤더를 추가해야 함 (Response 객체 필요)
        
        return ResponseEntity.ok(Map.of("success", true, "message", "로그아웃 요청이 처리되었습니다."));
    }
}