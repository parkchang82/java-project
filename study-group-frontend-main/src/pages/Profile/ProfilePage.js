import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; 

function ProfilePage() {
  const navigate = useNavigate();


  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const [profileImage, setProfileImage] = useState('[https://via.placeholder.com/150](https://via.placeholder.com/150)');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
       
        const response = await api.get('/api/profile'); 
        setUser(response.data); 
        
      } catch (err) {
        console.error("프로필 정보 불러오기 실패:", err);
        setError("정보를 불러오는데 실패했습니다.");
      
        if (err.response && err.response.status === 401) {
            alert("로그인 세션이 만료되었습니다.");
            navigate('/login');
        }
      } finally {
        setLoading(false); 
      }
    };

    fetchProfile();
  }, [navigate]);


  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
     
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 토큰 삭제
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };
  
  const handlePasswordSubmit = async (e) => { // async 추가
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
        // 실제 비밀번호 변경 API 호출 예시
        await api.post('/api/change-password', {
            currentPassword,
            newPassword
        });
        alert('비밀번호가 성공적으로 변경되었습니다!');
        setIsModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    } catch (err) {
        alert(err.response?.data?.message || '비밀번호 변경 실패');
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (!user) return <div>사용자 정보가 없습니다.</div>;

  return (
    <div className="profile-container">
      <h1>내 프로필</h1>
      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-image-wrapper">
            <img src={profileImage} alt="프로필" className="profile-image" />
            <label htmlFor="profileImageUpload" className="image-upload-button">
              ✏️
            </label>
            <input 
              id="profileImageUpload"
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
            />
          </div>

          <div className="info-text">
            {/* 받아온 user 데이터 표시 */}
            <p><strong>이름:</strong> {user.name}</p>
            <p><strong>이메일:</strong> {user.email}</p>
            {/* 생년월일, 성별 등 추가 정보가 있다면 여기에 표시 */}
            {user.birthDate && <p><strong>생년월일:</strong> {user.birthDate}</p>}
            {user.gender && <p><strong>성별:</strong> {user.gender}</p>}
             {/* <p><strong>가입일:</strong> {user.joinDate}</p> */}
          </div>
        </div>
        <div className="profile-actions">
          <button className="action-button" onClick={() => setIsModalOpen(true)}>
            비밀번호 변경
          </button>
          <button className="action-button logout" onClick={handleLogout}>
            로그아웃
          </button>
          <button className="action-button delete" onClick={() => navigate('/delete-account')}>
            회원 탈퇴
          </button>
        </div>
      </div>

      {/* 모달 UI는 기존과 동일 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>비밀번호 변경</h2>
            <form onSubmit={handlePasswordSubmit}>
              <input 
                type="password" 
                placeholder="현재 비밀번호" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required 
              />
              <input 
                type="password" 
                placeholder="새 비밀번호" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
              />
              <input 
                type="password" 
                placeholder="새 비밀번호 확인" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
              <div className="modal-actions">
                <button type="submit" className="action-button">변경</button>
                <button type="button" className="action-button cancel" onClick={() => setIsModalOpen(false)}>취소</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;