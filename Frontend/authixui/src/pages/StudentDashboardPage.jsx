import { useEffect, useState } from 'react';
import SidebarLayout from '../components/layout/SidebarLayout';
import Button from '../components/ui/Button';
import { apiFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

function StudentDashboardPage() {
  const [tab, setTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState([]);
  const [myMentors, setMyMentors] = useState([]);
  const [subscribedMentorIds, setSubscribedMentorIds] = useState(() => new Set());
  const [myContent, setMyContent] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [activeMentorId, setActiveMentorId] = useState(null);
  
  const [submissionText, setSubmissionText] = useState({});

  const { user } = useAuth();
  const currentUserId = user?.userId;

  // Chat thread state (assignment-specific)
  const [activeChat, setActiveChat] = useState(null); // { assignmentId, mentorId }
  const [chatMessages, setChatMessages] = useState([]);
  const [chatDraft, setChatDraft] = useState('');

  async function refreshMyMentors() {
    const list = await apiFetch('/api/student/mentors/subscribed');
    setMyMentors(list);
    setSubscribedMentorIds(new Set(list.map((m) => m._id)));
  }

  useEffect(() => {
    if (tab === 'search') {
      apiFetch(`/api/student/mentors/search?query=${searchQuery}`)
        .then(setMentors).catch(console.error);
    } else if (tab === 'mentors') {
      refreshMyMentors().catch(console.error);
    } else if (tab === 'submissions') {
      apiFetch('/api/student/submissions')
        .then(setSubmissions).catch(console.error);
    }
  }, [tab, searchQuery]);

  useEffect(() => {
    // Always keep subscriptions in memory so Search and My Mentors stay synchronized.
    refreshMyMentors().catch(() => {});
  }, []);

  async function handleSubscribe(mentorId) {
    await apiFetch(`/api/student/mentors/${mentorId}/subscribe`, { method: 'POST' });
    // Update global subscription state so Search UI updates immediately.
    await refreshMyMentors();
  }

  async function loadMentorContent(mentorId) {
    setActiveMentorId(mentorId);
    setTab('assignments');
    const content = await apiFetch(`/api/student/content/${mentorId}`);
    setMyContent(content);
  }

  async function handleSubmitAssignment(contentId, mentorId) {
    if (!submissionText[contentId]) return;
    await apiFetch(`/api/student/content/${contentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers: submissionText[contentId], mentorId })
    });
    alert('Submitted successfully!');
    setSubmissionText(prev => ({ ...prev, [contentId]: '' }));
    setTab('submissions');
  }

  async function fetchChatMessages(assignmentId, mentorId) {
    const data = await apiFetch(`/api/student/chats/threads/${assignmentId}/${mentorId}`);
    setChatMessages(data.messages || []);
  }

  // Poll near-real-time while chat is open on the assignment tab.
  useEffect(() => {
    if (tab !== 'assignments') return;
    if (!activeChat?.assignmentId || !activeChat?.mentorId) return;

    let cancelled = false;

    async function poll() {
      try {
        if (cancelled) return;
        await fetchChatMessages(activeChat.assignmentId, activeChat.mentorId);
      } catch (e) {
        // ignore transient errors; polling will try again
      }
    }

    poll();
    const id = setInterval(poll, 2500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, activeChat?.assignmentId, activeChat?.mentorId]);

  return (
    <SidebarLayout title="Student Learning Hub">
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', overflowX: 'auto' }}>
        <button className={`button ${tab === 'search' ? '' : 'secondary'}`} onClick={() => setTab('search')} style={{ borderRadius: '99px' }}>Discover Mentors</button>
        <button className={`button ${tab === 'mentors' ? '' : 'secondary'}`} onClick={() => setTab('mentors')} style={{ borderRadius: '99px' }}>My Mentors</button>
        <button className={`button ${tab === 'submissions' ? '' : 'secondary'}`} onClick={() => setTab('submissions')} style={{ borderRadius: '99px' }}>Performance Reports</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {tab === 'search' && (
          <section>
            <input 
              className="field" 
              placeholder="Search by name or expertise (e.g. System Design)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: '400px', marginBottom: '24px' }}
            />
            <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {mentors.map((m) => (
                <div className="glass-panel" key={m._id} style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{m.profile.name || 'Unnamed Mentor'}</h4>
                  <p className="muted" style={{ marginBottom: '16px', flex: 1 }}>{m.profile.expertise || 'General Expert'}</p>
                  {subscribedMentorIds.has(m._id) ? (
                    <Button disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                      Subscribed
                    </Button>
                  ) : (
                    <Button onClick={() => handleSubscribe(m._id)}>Subscribe</Button>
                  )}
                </div>
              ))}
            </div>
            {mentors.length === 0 && <p className="muted">No mentors found. Try a different search.</p>}
          </section>
        )}

        {tab === 'mentors' && (
          <section>
            <h3 style={{ marginBottom: '24px' }}>Your Subscribed Mentors</h3>
            <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {myMentors.map((m) => (
                <div className="glass-panel" key={m._id} style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{m.profile.name || m.email}</h4>
                  <p className="muted" style={{ marginBottom: '16px' }}>{m.profile.expertise}</p>
                  <Button onClick={() => loadMentorContent(m._id)}>View Assignments</Button>
                </div>
              ))}
            </div>
            {myMentors.length === 0 && <p className="muted">You aren't subscribed to anyone yet.</p>}
          </section>
        )}

        {tab === 'assignments' && (
          <section>
            <Button className="secondary" onClick={() => setTab('mentors')} style={{ marginBottom: '24px' }}>&larr; Back to Mentors</Button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {myContent.length === 0 ? <p className="muted">This mentor hasn't uploaded any content yet.</p> : null}
              {myContent.map((c) => (
                <div className="glass-panel" key={c._id} style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{c.title}</h4>
                  <a href={c.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', marginBottom: '16px', display: 'inline-block' }}>View Material ({c.url})</a>
                  
                  {c.assignment && c.assignment.description && (
                    <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>Assignment Task (Max Score: {c.assignment.totalScore})</strong>
                      <p style={{ whiteSpace: 'pre-wrap', marginBottom: '16px' }}>{c.assignment.description}</p>
                      
                      <textarea 
                        className="field" 
                        rows="4" 
                        placeholder="Type your answers here..."
                        value={submissionText[c._id] || ''}
                        onChange={(e) => setSubmissionText(prev => ({ ...prev, [c._id]: e.target.value }))}
                      ></textarea>
                      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                         <Button onClick={() => handleSubmitAssignment(c._id, activeMentorId)}>Submit Answers</Button>
                      </div>
                    </div>
                  )}

                  {/* Assignment-specific chat thread (one unique thread per assignment x mentor x student). */}
                  <div style={{ marginTop: '18px' }}>
                    <Button
                      variant="secondary"
                      style={{ marginBottom: '12px' }}
                      onClick={async () => {
                        const next = { assignmentId: c._id, mentorId: activeMentorId };
                        const same =
                          activeChat?.assignmentId === next.assignmentId && activeChat?.mentorId === next.mentorId;

                        if (same) {
                          setActiveChat(null);
                          setChatMessages([]);
                          setChatDraft('');
                        } else {
                          setActiveChat(next);
                          setChatMessages([]);
                          setChatDraft('');
                          await fetchChatMessages(next.assignmentId, next.mentorId);
                        }
                      }}
                    >
                      {activeChat?.assignmentId === c._id && activeChat?.mentorId === activeMentorId
                        ? 'Close Chat'
                        : 'Open Assignment Chat'}
                    </Button>

                    {activeChat?.assignmentId === c._id && activeChat?.mentorId === activeMentorId && (
                      <div className="glass-panel" style={{ padding: '16px', background: 'rgba(15,23,42,0.35)' }}>
                        <div
                          style={{
                            maxHeight: '260px',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            paddingRight: '6px',
                          }}
                        >
                          {chatMessages.length === 0 && (
                            <p className="muted">No messages yet. Ask the mentor a question about this assignment.</p>
                          )}

                          {chatMessages.map((m, idx) => {
                            const mine = currentUserId && String(m.senderId) === String(currentUserId);
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
                                <div
                                  style={{
                                    fontSize: '0.82rem',
                                    color: 'var(--text-muted)',
                                    fontWeight: 700,
                                    marginBottom: 4,
                                  }}
                                >
                                  {mine ? 'You' : 'Mentor'}
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap' }}>{m.messageText}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
                                  {m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ''}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                          <input
                            className="field"
                            value={chatDraft}
                            onChange={(e) => setChatDraft(e.target.value)}
                            placeholder="Type your question..."
                            style={{ flex: 1 }}
                          />
                          <Button
                            onClick={async () => {
                              if (!chatDraft.trim()) return;
                              await apiFetch(
                                `/api/student/chats/threads/${c._id}/${activeMentorId}/messages`,
                                {
                                  method: 'POST',
                                  body: JSON.stringify({ messageText: chatDraft }),
                                }
                              );
                              setChatDraft('');
                              await fetchChatMessages(c._id, activeMentorId);
                            }}
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'submissions' && (
          <section>
            <h3 style={{ marginBottom: '24px' }}>Performance Reports</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {submissions.map((sub) => (
                <div className="glass-panel" key={sub._id} style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '1.1rem' }}>{sub.contentId?.title || 'Unknown Content'}</h4>
                    <span style={{ padding: '4px 12px', borderRadius: '4px', background: sub.status === 'evaluated' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)', color: sub.status === 'evaluated' ? '#4ade80' : '#facc15' }}>
                      {sub.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="muted" style={{ marginBottom: '16px' }}>Mentor: {sub.mentorId?.profile?.name || 'Mentor'}</p>
                  
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                    <strong style={{ display: 'block', marginBottom: '8px' }}>Your Answers:</strong>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{sub.answers}</p>
                  </div>

                  {sub.status === 'evaluated' && (
                    <div style={{ marginTop: '16px', padding: '16px', borderLeft: '4px solid var(--primary)', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0 8px 8px 0' }}>
                      <strong style={{ display: 'block', marginBottom: '8px' }}>Instructor Feedback (Score: {sub.evaluation.score})</strong>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{sub.evaluation.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
              {submissions.length === 0 && <p className="muted">You haven't submitted any assignments yet.</p>}
            </div>
          </section>
        )}
      </div>
    </SidebarLayout>
  );
}

export default StudentDashboardPage;
