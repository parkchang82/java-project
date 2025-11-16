import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Study.css';

function StudyListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [bookmarked, setBookmarked] = useState(() => {
    const saved = localStorage.getItem('bookmarkedStudies');
    return saved ? JSON.parse(saved) : [];
  });

  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem('likedStudies');
    return saved ? JSON.parse(saved) : [];
  });

  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [sortOption, setSortOption] = useState('latest'); // latest, comments, bookmarks

  // 로컬스토리지에서 게시글 불러오기
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('studyPosts')) || [];
    setPosts(savedPosts);
  }, []);

  // 찜/좋아요 상태 저장
  useEffect(() => {
    localStorage.setItem('bookmarkedStudies', JSON.stringify(bookmarked));
  }, [bookmarked]);

  useEffect(() => {
    localStorage.setItem('likedStudies', JSON.stringify(liked));
  }, [liked]);

  const handleWriteClick = () => navigate('/study/write');

  const toggleBookmark = (postId) => {
    setBookmarked(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleLike = (postId) => {
    setLiked(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  // 필터링
  let filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showBookmarkedOnly) {
    filteredPosts = filteredPosts.filter(post => bookmarked.includes(post.id));
  }

  // 정렬
  filteredPosts.sort((a, b) => {
    if (sortOption === 'latest') return b.id - a.id;
    if (sortOption === 'comments') return (b.comments?.length || 0) - (a.comments?.length || 0);
    if (sortOption === 'bookmarks') return (bookmarked.includes(b.id) ? 1 : 0) - (bookmarked.includes(a.id) ? 1 : 0);
    return 0;
  });

  return (
    <div className="study-page-container">
      <h1>스터디 목록</h1>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="스터디 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '300px' }}
        />
        <button className="study-page-button" onClick={handleWriteClick}>글쓰기</button>
        <button className="study-page-button" onClick={() => setShowBookmarkedOnly(prev => !prev)}>
          {showBookmarkedOnly ? '전체보기' : '찜한 스터디만'}
        </button>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="latest">최신순</option>
          <option value="comments">댓글순</option>
          <option value="bookmarks">찜많은순</option>
        </select>
      </div>

      {filteredPosts.length === 0 ? (
        <p>조건에 맞는 글이 없습니다.</p>
      ) : (
        <ul className="study-list">
          {filteredPosts.map((post) => (
            <li key={post.id} className="study-item">
              <div className="study-item-content" onClick={() => navigate(`/study/${post.id}`)}>
                <div className="study-item-header">
                  <h3 className="study-item-title">{post.title}</h3>
                  <span className="study-item-status">{post.isJoined ? "참여중" : "모집중"}</span>
                </div>
                <p>{post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content}</p>
                <p>
                  참여자 수: {post.joinedCount || 0} | 댓글 수: {post.comments?.length || 0} | 좋아요: {liked.includes(post.id) ? 1 : 0}
                </p>
              </div>

              {/* 버튼 위치 통일 */}
              <div className="study-item-actions">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(post.id); }}
                  className="bookmark-button"
                >
                  {bookmarked.includes(post.id) ? '❤️ 찜 취소' : '🤍 찜하기'}
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                  className="bookmark-button"
                >
                  {liked.includes(post.id) ? '💖 좋아요 취소' : '🤍 좋아요'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudyListPage;