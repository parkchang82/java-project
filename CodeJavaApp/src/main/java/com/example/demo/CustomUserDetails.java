package com.example.demo;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

// User 엔티티 정보를 Spring Security 컨텍스트에 담기 위한 클래스
public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    // 1. 권한 정보 반환 (단순화를 위해 현재는 ROLE_USER 권한 하나만 부여)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 실제 프로젝트에서는 user.getRoles() 등으로 권한 정보를 가져와야 합니다.
        // 현재는 토큰 인증만을 위해 단순하게 설정합니다.
        return Collections.emptyList();
    }

    // 2. 비밀번호 반환 (암호화된 비밀번호)
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // 3. 사용자 식별자 반환 (여기서는 이메일)
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    // 계정 만료 여부 (true = 만료 안됨)
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // 계정 잠금 여부 (true = 잠금 안됨)
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // 비밀번호 만료 여부 (true = 만료 안됨)
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // 계정 활성화 여부 (true = 활성화)
    @Override
    public boolean isEnabled() {
        return true;
    }
    
    // 필요하다면 User 엔티티 자체에 접근하는 getter를 추가할 수 있습니다.
    public User getUser() {
        return user;
    }
}
