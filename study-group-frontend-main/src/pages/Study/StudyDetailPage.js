import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Study.css';

function StudyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('studyPosts')) || [];
    const currentPost = posts.find(p => p.id === Number(id));
    if (currentPost) {
      setPost(currentPost);
      setComments(currentPost.comments || []);
    }
  }, [id]);

  if (!post) return <p>존재하지 않는 글입니다.</p>;

  const handleJoin = () => {
    if (post.isJoined) { alert("이미 참여한 스터디입니다."); return; }
    const posts = JSON.parse(localStorage.getItem('studyPosts')) || [];
    const updatedPosts = posts.map(p =>
      p.id === post.id ? { ...p, joinedCount: (p.joinedCount || 0) + 1, isJoined: true } : p
    );
    localStorage.setItem('studyPosts', JSON.stringify(updatedPosts));
    setPost(updatedPosts.find(p => p.id === post.id));
    alert('참여 신청 완료!');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    const posts = JSON.parse(localStorage.getItem('studyPosts')) || [];
    const updatedPosts = posts.map(p => p.id === post.id ? { ...p, comments: updatedComments } : p);
    localStorage.setItem('studyPosts', JSON.stringify(updatedPosts));
    setPost(updatedPosts.find(p => p.id === post.id));
    setNewComment("");
  };

  const handleDeleteComment = (index) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    setComments(updatedComments);
    const posts = JSON.parse(localStorage.getItem('studyPosts')) || [];
    const updatedPosts = posts.map(p => p.id === post.id ? { ...p, comments: updatedComments } : p);
    localStorage.setItem('studyPosts', JSON.stringify(updatedPosts));
    setPost(updatedPosts.find(p => p.id === post.id));
  };

  const handleDelete = () => {
    if (!window.confirm("정말 이 글을 삭제하시겠습니까?")) return;
    const posts = JSON.parse(localStorage.getItem('studyPosts')) || [];
    const updatedPosts = posts.filter(p => p.id !== post.id);
    localStorage.setItem('studyPosts', JSON.stringify(updatedPosts));
    const schedules = JSON.parse(localStorage.getItem('schedule')) || [];
    const updatedSchedules = schedules.filter(s => s.studyId !== post.id);
    localStorage.setItem('schedule', JSON.stringify(updatedSchedules));
    alert("게시글이 삭제되었습니다.");
    navigate('/study');
  };

  return (
    <div className="study-page-container">
      <h1 className="study-detail-title">{post.title}</h1>
      <p style={{ whiteSpace: 'pre-line', marginBottom: '20px' }}>{post.content}</p>
      <p>참여자 수: {post.joinedCount || 0}</p>

      <div className="button-group">
        {post.isJoined ? (
          <span style={{ color: 'green', fontWeight: 'bold' }}>이미 참여한 스터디</span>
        ) : (
          <button className="study-page-button" onClick={handleJoin}>참여하기</button>
        )}
        <button className="study-page-button cancel" onClick={() => navigate('/study')}>뒤로가기</button>
        <button className="study-page-button delete" onClick={handleDelete}>삭제하기</button>
      </div>

      <div className="comment-section">
        <h3>댓글</h3>
        <ul>
          {comments.map((c, i) => (
            <li key={i} className="comment-item">
              <span>{c}</span>
              <button className="comment-delete" onClick={() => handleDeleteComment(i)}>❌</button>
            </li>
          ))}
        </ul>
        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요" />
        <button className="comment-register" onClick={handleAddComment}>등록</button>
      </div>
    </div>
  );
}

export default StudyDetailPage;
