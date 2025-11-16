// src/pages/ChangePasswordPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"; // Axios 인스턴스 import

function ChangePasswordPage() {
    // 1. 필요한 상태 정의
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            alert("새 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        if (newPassword.length < 6) { // 최소 길이 검사
            alert("새 비밀번호는 6자 이상이어야 합니다.");
            return;
        }

        try {
            // 2. 백엔드에 요청 전송 (로그인 후이므로 사용자 ID는 쿠키/세션/토큰으로 전달된다고 가정)
            await api.post("/api/changepassword", {
                currentPassword: currentPassword, // 백엔드 DTO 필드명과 일치시켜야 합니다.
                newPassword: newPassword
            });

            alert("✅ 비밀번호가 성공적으로 변경되었습니다.");
            navigate("/profile");
 
        } catch (err) {
            console.error(err);
            alert("❌ 비밀번호 변경에 실패했습니다. 현재 비밀번호를 다시 확인해주세요.");
        }
    };

    return (
        <div className="auth-container">
            <h1>비밀번호 변경</h1>
            <form onSubmit={handleChangePassword} className="auth-form">
                <div className="auth-form-group">
                    <label>현재 비밀번호</label>
                    <input type="password" value={currentPassword} 
                           onChange={(e) => setCurrentPassword(e.target.value)} required />
                </div>
                <div className="auth-form-group">
                    <label>새 비밀번호</label>
                    <input type="password" value={newPassword} 
                           onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div className="auth-form-group">
                    <label>새 비밀번호 확인</label>
                    <input type="password" value={confirmNewPassword} 
                           onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                </div>
                <button className="auth-button" type="submit">비밀번호 변경</button>
            </form>
        </div>
    );
}

export default ChangePasswordPage;