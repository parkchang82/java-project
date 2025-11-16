import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// 공통 컴포넌트
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Auth 관련
import SignUpPage from './pages/Auth/SignUpPage';
import LoginPage from './pages/Auth/LoginPage';

// Profile 관련
import ProfilePage from './pages/Profile/ProfilePage';
import ChangePasswordPage from './pages/Profile/ChangePasswordPage';
import DeleteAccountPage from './pages/Profile/DeleteAccountPage';

// Study 관련
import StudyListPage from './pages/Study/StudyListPage';
import StudyWritePage from './pages/Study/StudyWritePage';
import StudyDetailPage from './pages/Study/StudyDetailPage';

// Schedule 관련
import SchedulePage from './pages/Schedule/SchedulePage';

function App() {
  return (
    <Router>
      <Header />
      <main style={{ padding: '20px' }}>
        <Routes>

          {/* 기본 경로 → 로그인으로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* 인증 */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 프로필 */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/delete-account" element={<DeleteAccountPage />} />

          {/* 스터디 */}
          <Route path="/study" element={<StudyListPage />} />
          <Route path="/study/write" element={<StudyWritePage />} />
          <Route path="/study/:id" element={<StudyDetailPage />} />

          {/* 일정 */}
          <Route path="/schedule" element={<SchedulePage />} />

        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
