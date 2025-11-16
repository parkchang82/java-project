// SchedulePage.jsx
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Schedule.css';

function SchedulePage() {
  const [joinedStudies, setJoinedStudies] = useState([]);
  const [selectedStudyId, setSelectedStudyId] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [note, setNote] = useState('');

  const loadJoinedStudies = () => {
    const allStudies = JSON.parse(localStorage.getItem('studyPosts')) || [];
    const joined = allStudies.filter(s => s.isJoined);
    setJoinedStudies(joined);

    if (joined.length > 0) {
      setSelectedStudyId(prev => joined.find(s => s.id === prev)?.id ?? joined[0].id);
    } else {
      setSelectedStudyId(null);
    }
  };

  useEffect(() => {
    loadJoinedStudies();
  }, []);

  useEffect(() => {
    if (selectedStudyId === null) {
      setSchedule([]);
      return;
    }

    const savedSchedules = JSON.parse(localStorage.getItem('schedule')) || [];
    const studySchedule = savedSchedules.find(s => s.studyId === selectedStudyId);

    setSchedule(studySchedule && Array.isArray(studySchedule.events) ? [...studySchedule.events] : []);
  }, [selectedStudyId]);

  const handleAdd = () => {
    if (!note.trim() || selectedStudyId === null) return;

    const savedSchedules = JSON.parse(localStorage.getItem('schedule')) || [];
    const studyIndex = savedSchedules.findIndex(s => s.studyId === selectedStudyId);

    const newEvent = { date: selectedDate.toISOString().slice(0, 10), note };
    let updatedSchedules;

    if (studyIndex > -1) {
      const updatedEvents = [...(savedSchedules[studyIndex].events || []), newEvent];
      updatedSchedules = [...savedSchedules];
      updatedSchedules[studyIndex] = { studyId: selectedStudyId, events: updatedEvents };
    } else {
      updatedSchedules = [...savedSchedules, { studyId: selectedStudyId, events: [newEvent] }];
    }

    localStorage.setItem('schedule', JSON.stringify(updatedSchedules));
    setSchedule([...updatedSchedules.find(s => s.studyId === selectedStudyId).events]);
    setNote('');
  };

  const handleDelete = (index) => {
    if (selectedStudyId === null) return;

    const savedSchedules = JSON.parse(localStorage.getItem('schedule')) || [];
    const studyIndex = savedSchedules.findIndex(s => s.studyId === selectedStudyId);
    if (studyIndex === -1) return;

    const updatedEvents = savedSchedules[studyIndex].events.filter((_, i) => i !== index);
    const updatedSchedules = [...savedSchedules];
    updatedSchedules[studyIndex] = { studyId: selectedStudyId, events: updatedEvents };

    localStorage.setItem('schedule', JSON.stringify(updatedSchedules));
    setSchedule([...updatedEvents]);
  };

  return (
    <div className="schedule-container">
      <h1>스터디 일정 관리</h1>

      {joinedStudies.length === 0 ? (
        <p>현재 참여중인 스터디가 없습니다.</p>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label>참여중인 스터디 선택: </label>
            <select
                className="schedule-select"
                value={selectedStudyId}
                onChange={e => setSelectedStudyId(Number(e.target.value))}
              >
                {joinedStudies.map(s => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
          </div>

          <div className="schedule-input">
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
            />
            <input
              type="text"
              placeholder="일정 내용을 입력하세요"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
            <button onClick={handleAdd} className="schedule-add-button">추가</button>
          </div>

          <ul className="schedule-list">
            {schedule.map((item, index) => (
              <li key={index} className="schedule-item">
                <span>{item.date}</span> - <span>{item.note}</span>
                <button className="schedule-delete-button" onClick={() => handleDelete(index)}>삭제</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default SchedulePage;
