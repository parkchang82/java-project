package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    /**
     * React/Vue/Angular 같은 SPA (Single Page Application)의 기본 페이지인
     * 'index.html'을 서빙하기 위한 컨트롤러입니다.
     * 프론트엔드의 라우팅 경로를 포함하여 모든 요청을 'index.html'로 포워딩합니다.
     */
    @GetMapping(value = {"/", "/{path:[^\\.]*}", "/{path:home|about|posts|login|signup}"})
    public String index() {
        // "index"를 반환하면 Spring Boot의 뷰 리졸버가 정적 리소스 경로(static/index.html)에서 파일을 찾습니다.
        return "build/index";
    }
}
