import { useState, useEffect } from 'react';
import SidebarLayout from '../components/layout/SidebarLayout';
import Button from '../components/ui/Button';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

function MentorContentPage() {
  const [tab, setTab] = useState('upload');
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const { user } = useAuth();
  const mentorUserId = user?.userId;

  // Chat tab state
  const [chatAssignments, setChatAssignments] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [mentorThreads, setMentorThreads] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [mentorChatMessages, setMentorChatMessages] = useState([]);
  const [mentorChatDraft, setMentorChatDraft] = useState('');
  
  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [score, setScore] = useState(100);

  // Evaluation State
  const [evalScores, setEvalScores] = useState({});
  const [evalFeedbacks, setEvalFeedbacks] = useState({});

  useEffect(() => {
    if (tab === 'students') {
      apiFetch('/api/mentor/students').then(setStudents).catch(console.error);
    } else if (tab === 'evaluations') {
      refreshSubmissions();
    } else if (tab === 'chats') {
      apiFetch('/api/mentor/content').then((list) => {
        setChatAssignments(list);
        if (list?.length) setSelectedAssignmentId(list[0]._id);
      }).catch(console.error);
    }
  }, [tab]);

  // Poll near-real-time while chat is open.
  useEffect(() => {
    if (tab !== 'chats') return;
    if (!selectedAssignmentId || !selectedStudentId) return;

    let cancelled = false;

    async function poll() {
      try {
        const data = await apiFetch(
          `/api/mentor/chats/threads/${selectedAssignmentId}/${selectedStudentId}/messages`
        );
        if (!cancelled) setMentorChatMessages(data.messages || []);
      } catch {
        // ignore transient errors
      }
    }

    poll();
    const id = setInterval(poll, 2500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [tab, selectedAssignmentId, selectedStudentId]);

  // Load thread summaries when assignment changes (so the student list is always up to date).
  useEffect(() => {
    if (tab !== 'chats') return;
    if (!selectedAssignmentId) return;

    setSelectedStudentId('');
    setMentorChatMessages([]);

    apiFetch(`/api/mentor/chats/threads?assignmentId=${selectedAssignmentId}`)
      .then(setMentorThreads)
      .catch(console.error);
  }, [tab, selectedAssignmentId]);

  function refreshSubmissions() {
      apiFetch('/api/mentor/submissions').then(setSubmissions).catch(console.error);
  }

  async function handleUpload(e) {
    e.preventDefault();
    await apiFetch('/api/mentor/content', {
      method: 'POST',
      body: JSON.stringify({ title, url, assignmentDescription: description, totalScore: score })
    });
    alert('Content & Assignment Uploaded!');
    setTitle(''); setUrl(''); setDescription('');
  }

  async function handleEvaluate(subId) {
    await apiFetch(`/api/mentor/submissions/${subId}/evaluate`, {
      method: 'PUT',
      body: JSON.stringify({ score: evalScores[subId], feedback: evalFeedbacks[subId] })
    });
    alert('Evaluation saved!');
    refreshSubmissions();
  }

  return (
    <SidebarLayout title="Mentor Workspace">
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', overflowX: 'auto' }}>
        <button className={`button ${tab === 'upload' ? '' : 'secondary'}`} onClick={() => setTab('upload')} style={{ borderRadius: '99px' }}>Create Assignment</button>
        <button className={`button ${tab === 'students' ? '' : 'secondary'}`} onClick={() => setTab('students')} style={{ borderRadius: '99px' }}>My Students</button>
        <button className={`button ${tab === 'evaluations' ? '' : 'secondary'}`} onClick={() => setTab('evaluations')} style={{ borderRadius: '99px' }}>Evaluate Submissions</button>
        <button className={`button ${tab === 'chats' ? '' : 'secondary'}`} onClick={() => setTab('chats')} style={{ borderRadius: '99px' }}>Assignment Chats</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {tab === 'upload' && (
          <form className="glass-panel" style={{ padding: '32px', maxWidth: '600px' }} onSubmit={handleUpload}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Distribute Curriculum & Tasks</h3>
            <p className="muted" style={{ marginBottom: '24px' }}>Upload study materials and attach assignment instructions for your enrolled students.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input className="field" placeholder="Content Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
              <input className="field" placeholder="Video/PDF URL" value={url} onChange={(e)=>setUrl(e.target.value)} required />
              
              <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                 <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Assignment (Optional)</label>
                 <textarea className="field" rows="5" placeholder="List questions or tasks for the student to complete..." value={description} onChange={(e)=>setDescription(e.target.value)}></textarea>
              </div>
              
              <div>
                 <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Max Score</label>
                 <input type="number" className="field" value={score} onChange={(e)=>setScore(e.target.value)} style={{ maxWidth: '100px' }} />
              </div>
              
              <Button type="submit" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>Publish to Students</Button>
            </div>
          </form>
        )}

        {tab === 'students' && (
          <section>
            <h3 style={{ marginBottom: '24px' }}>Subscribed Roster</h3>
            <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {students.map((st) => (
                <div className="glass-panel" key={st._id} style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{st.profile?.name || st.email}</h4>
                  <p className="muted" style={{ fontSize: '0.9rem' }}>{st.email}</p>
                </div>
              ))}
            </div>
            {students.length === 0 && <p className="muted">No students have subscribed to you yet.</p>}
          </section>
        )}

        {tab === 'evaluations' && (
          <section>
            <h3 style={{ marginBottom: '24px' }}>Pending Evaluations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {submissions.map((sub) => (
                <div className="glass-panel" key={sub._id} style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '1.25rem' }}>{sub.contentId?.title || 'Assignment'}</h4>
                    <span className="muted" style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                       Student: {sub.studentId?.email}
                    </span>
                  </div>

                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '16px' }}>
                    <strong style={{ display: 'block', marginBottom: '8px' }}>Student's Answers:</strong>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{sub.answers}</p>
                  </div>

                  {sub.status === 'pending' ? (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <textarea className="field" rows="3" placeholder="Provide feedback..." value={evalFeedbacks[sub._id] || ''} onChange={(e) => setEvalFeedbacks(prev => ({...prev, [sub._id]: e.target.value}))}></textarea>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                           <input type="number" className="field" placeholder="Score (0-100)" style={{ width: '120px' }} value={evalScores[sub._id] || ''} onChange={(e) => setEvalScores(prev => ({...prev, [sub._id]: e.target.value}))} />
                           <Button onClick={() => handleEvaluate(sub._id)}>Submit Grade</Button>
                        </div>
                     </div>
                  ) : (
                     <p style={{ color: '#4ade80' }}>✔ Evaluated (Score: {sub.evaluation.score})</p>
                  )}
                </div>
              ))}
              {submissions.length === 0 && <p className="muted">No submissions require grading.</p>}
            </div>
          </section>
        )}

        {tab === 'chats' && (
          <section>
            <h3 style={{ marginBottom: '16px' }}>Chats (Assignment-wise)</h3>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch' }}>
              <div className="glass-panel" style={{ padding: '16px', width: '360px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                      Select Assignment
                    </div>
                    <select
                      className="field"
                      value={selectedAssignmentId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedAssignmentId(id);
                        setSelectedStudentId('');
                        setMentorChatMessages([]);

                        if (!id) return;
                        apiFetch(`/api/mentor/chats/threads?assignmentId=${id}`)
                          .then(setMentorThreads)
                          .catch(console.error);
                      }}
                      style={{ appearance: 'none' }}
                    >
                      {chatAssignments.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                      Subscribed Students
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {mentorThreads.length === 0 && (
                        <p className="muted">No chat threads yet for this assignment. Open a thread by sending the first message.</p>
                      )}

                      {mentorThreads.map((t) => (
                        <button
                          key={t.studentId}
                          className="sidebar-link"
                          style={{
                            textAlign: 'left',
                            border: '1px solid var(--border)',
                            background:
                              String(selectedStudentId) === String(t.studentId) ? 'rgba(59,130,246,0.15)' : 'transparent',
                          }}
                          onClick={() => {
                            setSelectedStudentId(String(t.studentId));
                          }}
                        >
                          <div style={{ fontWeight: 800 }}>{t.studentName}</div>
                          <div className="muted" style={{ fontSize: '0.75rem', marginTop: 4 }}>
                            {t.lastMessageText ? `Last: ${t.lastMessageText}` : 'No messages yet'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="muted" style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 10 }}>
                  {selectedStudentId ? 'Conversation' : 'Choose a student'}
                </div>

                <div
                  style={{
                    flex: 1,
                    minHeight: '340px',
                    maxHeight: '460px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    paddingRight: '6px',
                  }}
                >
                  {mentorChatMessages.length === 0 ? (
                    <p className="muted">Select a student to view messages.</p>
                  ) : (
                    mentorChatMessages.map((m, idx) => {
                      const mine = mentorUserId && String(m.senderId) === String(mentorUserId);
                      return (
                        <div
                          key={`${m.timestamp || idx}-${idx}`}
                          style={{
                            alignSelf: mine ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            borderRadius: '12px',
                            padding: '10px 12px',
                            border: '1px solid var(--border)',
                            background: mine ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)',
                          }}
                        >
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: 4 }}>
                            {mine ? 'You' : 'Student'}
                          </div>
                          <div style={{ whiteSpace: 'pre-wrap' }}>{m.messageText}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
                            {m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ''}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <input
                    className="field"
                    value={mentorChatDraft}
                    onChange={(e) => setMentorChatDraft(e.target.value)}
                    placeholder="Reply to the student's doubts..."
                    style={{ flex: 1 }}
                    disabled={!selectedAssignmentId || !selectedStudentId}
                  />
                  <Button
                    disabled={!mentorChatDraft.trim() || !selectedAssignmentId || !selectedStudentId}
                    onClick={async () => {
                      if (!mentorChatDraft.trim() || !selectedAssignmentId || !selectedStudentId) return;
                      await apiFetch(`/api/mentor/chats/threads/${selectedAssignmentId}/${selectedStudentId}/messages`, {
                        method: 'POST',
                        body: JSON.stringify({ messageText: mentorChatDraft }),
                      });
                      setMentorChatDraft('');
                      // immediate refresh (poller will keep it updated)
                      const data = await apiFetch(`/api/mentor/chats/threads/${selectedAssignmentId}/${selectedStudentId}/messages`);
                      setMentorChatMessages(data.messages || []);
                    }}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </SidebarLayout>
  );
}

export default MentorContentPage;
