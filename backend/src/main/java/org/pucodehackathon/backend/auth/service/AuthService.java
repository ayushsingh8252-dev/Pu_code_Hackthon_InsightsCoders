package org.pucodehackathon.backend.auth.service;


import jakarta.servlet.http.HttpServletResponse;

import org.pucodehackathon.backend.auth.dto.LoginRequestDto;
import org.pucodehackathon.backend.auth.dto.SignupRequestDto;
import org.pucodehackathon.backend.auth.dto.ApiResponse;


public interface  AuthService {
     ApiResponse signup(SignupRequestDto requestDto);
     ApiResponse login(LoginRequestDto requestDto , HttpServletResponse response);
}
