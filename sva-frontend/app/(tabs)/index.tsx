import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

const Index: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [responseData, setResponseData] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [calendarEvents, setCalendarEvents] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  const startListening = () => {
    setIsListening(true);
    recognition.start();
  };

  recognition.onresult = (event: any) => {
    const speechText = event.results[0][0].transcript;
    setInputText(speechText);
    setIsListening(false);
  };

  recognition.onerror = (event: any) => {
    console.error("Speech Recognition Error:", event.error);
    setIsListening(false);
  };

  const handleProcessText = async () => {
    if (!inputText.trim()) {
      setResponseData("⚠️ Please enter or speak text before processing.");
      return;
    }

    setIsProcessing(true);
    const url = `${API_BASE_URL}/nlp/process/?text=${encodeURIComponent(inputText)}`;

    try {
      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      if (data.status === "success") {
        setResponseData(`
          ✅ ${data.message}
          🗣️ Transcription: ${data.transcription}
          📌 Action Items: ${data.action_items.length ? data.action_items.join(", ") : "None"}
          📅 Meeting Dates: ${data.meeting_details.dates.length ? data.meeting_details.dates.join(", ") : "None"}
          📝 Key Points: ${data.meeting_details.key_points.length ? data.meeting_details.key_points.join(". ") : "None"}
          📄 Summary: ${data.summary}
        `);
        setCalendarEvents(data.calendar_events || []);
        setTasks(data.tasks || []);
      } else {
        setResponseData("⚠️ Unexpected response format.");
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
      setResponseData("❌ Error fetching data. Please check the server.");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div style={styles.container}>
      <div style={styles.glassPanel}>
        <div style={styles.header}>
          <h1 style={styles.title}>Smart Voice Assistant</h1>
          <p style={styles.subtitle}>Your AI-powered conversation partner</p>
        </div>

        <div style={styles.inputSection}>
          <div style={styles.textareaWrapper}>
            <textarea
              style={styles.inputField}
              placeholder="Enter or speak your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              style={{
                ...styles.micButton,
                ...(isListening ? styles.micButtonListening : {}),
                ...(isListening ? { animation: 'pulse 2s infinite' } : {})
              }}
              onClick={startListening}
              disabled={isListening}
            >
              <span style={styles.micIcon}>🎤</span>
            </button>
          </div>

          <button
            style={{
              ...styles.processButton,
              ...(isProcessing ? styles.processingButton : {}),
              ...(!inputText.trim() ? styles.disabledButton : {})
            }}
            onClick={handleProcessText}
            disabled={!inputText.trim() || isProcessing}
          >
            {isProcessing ? (
              <div style={styles.loader}>Processing...</div>
            ) : (
              'Process Text'
            )}
          </button>
        </div>

        <div style={styles.responseSection}>
          <h2 style={styles.responseTitle}>Response</h2>
          <div style={styles.responseContent}>
            {responseData ? (
              <pre style={styles.responseText}>{responseData}</pre>
            ) : (
              <p style={styles.placeholderText}>Waiting for input...</p>
            )}
          </div>
        </div>
        <div style={styles.actionSection}>
          <h2 style={styles.actionTitle}>Calendar Events</h2>
          <ul style={styles.actionList}>
            {calendarEvents.length ? (
              calendarEvents.map((event, index) => (
                <li key={index} style={styles.actionItem}>{event}</li>
              ))
            ) : (
              <li style={styles.noActionItem}>No calendar events found.</li>
            )}
          </ul>

          <h2 style={styles.actionTitle}>Tasks</h2>
          <ul style={styles.actionList}>
            {tasks.length ? (
              tasks.map((task, index) => (
                <li key={index} style={styles.actionItem}>{task}</li>
              ))
            ) : (
              <li style={styles.noActionItem}>No tasks found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(89, 108, 182, 0.8)',
    padding: '2rem',
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    perspective: '1000px',
  } as React.CSSProperties,

  glassPanel: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px) saturate(180%)',
    borderRadius: '24px',
    padding: '3rem',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 8px 24px -12px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    transform: 'rotateX(0deg)',
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    '&:hover': {
      transform: 'rotateX(2deg) translateY(-5px)',
    },
  } as React.CSSProperties,

  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    animation: 'fadeIn 0.8s ease-out',
  } as React.CSSProperties,

  title: {
    fontSize: '3rem',
    fontWeight: 800,
    letterSpacing: '-0.025em',
    marginBottom: '0.75rem',
    background: 'linear-gradient(135deg,rgb(73, 68, 177),rgb(0, 0, 0))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,

  subtitle: {
    color: '#6B7280',
    fontSize: '1.25rem',
    margin: 0,
    fontWeight: 500,
  },

  inputSection: {
    marginBottom: '2.5rem',
  },

  textareaWrapper: {
    position: 'relative',
    marginBottom: '1.5rem',
  } as React.CSSProperties,

  inputField: {
    width: '100%',
    minHeight: '140px',
    padding: '1.25rem',
    border: '2px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '16px',
    fontSize: '1.125rem',
    color: '#1F2937',
    background: 'rgba(255, 255, 255, 0.9)',
    resize: 'vertical',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    outline: 'none',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    letterSpacing: '0.5px',
    lineHeight: '1.7',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '&:focus': {
      border: '2px solid #4F46E5',
      boxShadow: '0 0 0 4px rgba(79, 70, 229, 0.1)',
      background: '#ffffff',
    },
    '&::placeholder': {
      color: '#9CA3AF',
    },
  } as React.CSSProperties,

  micButton: {
    position: 'absolute',
    bottom: '1.25rem',
    right: '1.25rem',
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 20px -3px rgba(79, 70, 229, 0.4)',
    },
  } as React.CSSProperties,

  micButtonListening: {
    background: 'linear-gradient(135deg, #DC2626, #EF4444)',
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },

  micIcon: {
    fontSize: '1.75rem',
  },

  processButton: {
    width: '100%',
    padding: '1.25rem',
    border: 'none',
    borderRadius: '16px',
    background: 'black',
    color: 'white',
    fontWeight: 600,
    fontSize: '1.125rem',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 20px -3px rgba(79, 70, 229, 0.4)',
    },
  } as React.CSSProperties,

  processingButton: {
    opacity: 0.8,
    cursor: 'wait',
    transform: 'none',
    boxShadow: '0 5px 10px -3px rgba(79, 70, 229, 0.2)',
  },

  disabledButton: {
    background: 'rgba(79, 70, 229, 0.2)', 
    cursor: 'not-allowed',
    boxShadow: 'none',
    '&:hover': {
      transform: 'none',
      boxShadow: 'none',
    },
  },

  loader: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.125rem',
  },

  responseSection: {
    background: 'rgba(89, 108, 182, 0.8)',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },

  responseTitle: {
    color: '#111827',
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.25rem',
    letterSpacing: '-0.025em',
  },

  responseContent: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '1.75rem',
    maxHeight: '400px',
    overflowY: 'auto',
    border: '2px solid rgba(99, 102, 241, 0.1)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    scrollbarWidth: 'thin',
    scrollbarColor: '#CBD5E1 transparent',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#CBD5E1',
      borderRadius: '3px',
      '&:hover': {
        background: '#94A3B8',
      },
    },
  } as React.CSSProperties,

  responseText: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#1F2937',
    letterSpacing: '0.3px',
  } as React.CSSProperties,

  placeholderText: {
    color: '#6B7280',
    fontStyle: 'italic',
    margin: 0,
    fontSize: '1.125rem',
    textAlign: 'center',
    padding: '2rem 0',
  },

  actionSection: {
    marginTop: '2rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },

  actionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
    color: '#111827',
  },

  actionList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },

  actionItem: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #E5E7EB',
    color: '#1F2937',
  },

  noActionItem: {
    padding: '0.5rem 0',
    color: '#6B7280',
    fontStyle: 'italic',
  },
} as const;

export default Index;