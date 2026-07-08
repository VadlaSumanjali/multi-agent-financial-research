import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Lock theme to light mode as requested
  const [theme] = useState('light');
  
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [documents, setDocuments] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Agents status stub to avoid breaking existing imports/views (e.g. Navbar)
  const [agents, setAgents] = useState([
    { id: 'doc-agent', name: 'Document Agent', status: 'idle' },
    { id: 'extraction-agent', name: 'Extraction Agent', status: 'idle' },
    { id: 'redflag-agent', name: 'Red Flag Agent', status: 'idle' },
    { id: 'comparison-agent', name: 'Comparison Agent', status: 'idle' },
    { id: 'research-agent', name: 'Research Agent', status: 'idle' },
    { id: 'report-agent', name: 'Report Agent', status: 'idle' }
  ]);

  // Apply light theme explicitly
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  // Notifications manager
  const addNotification = (text, type = 'info') => {
    const newNotif = {
      id: Date.now().toString(),
      text,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || null;

  // Modify active session notes
  const updateSessionNotes = (notesText) => {
    if (!activeSessionId) return;
    setSessions(prev =>
      prev.map(s => (s.id === activeSessionId ? { ...s, notes: notesText } : s))
    );
  };

  // Add message to workspace conversation
  const addMessageToSession = (text) => {
    if (!text.trim() || !activeSessionId) return;
    
    const userMsg = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text
    };

    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, userMsg]
          };
        }
        return s;
      })
    );

    // Static assistant reply stating that analysis is unavailable before backend integration
    setTimeout(() => {
      const assistantMsg = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        agent: 'System Agent',
        content: 'Analysis is unavailable. Connect the backend to enable financial research.'
      };

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, assistantMsg]
            };
          }
          return s;
        })
      );
      addNotification('System response ready', 'success');
    }, 800);
  };

  // Create new research session
  const createNewSession = (title, company = 'General', ticker = 'GEN') => {
    const newId = `sess-${Date.now()}`;
    const newSession = {
      id: newId,
      title: title || `${company} (${ticker.toUpperCase()}) Analysis`,
      company: company || 'General',
      ticker: ticker?.toUpperCase() || 'GEN',
      date: new Date().toISOString().split('T')[0],
      status: 'idle',
      progress: 0,
      documents: [],
      messages: [],
      notes: `# Notes for ${company}\n*Waiting for document analysis...*`,
      summary: ''
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    addNotification(`Session initialized for ${company}`, 'success');
    return newSession;
  };

  // Delete session
  const deleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
      } else {
        setActiveSessionId('');
      }
    }
    addNotification('Research session removed', 'info');
  };

  // Local state document adding
  const addDocument = (fileObj, targetSessionId = null) => {
    const fileId = `doc-${Date.now()}`;
    const newDoc = {
      id: fileId,
      name: fileObj.name,
      size: `${(fileObj.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setDocuments(prev => [newDoc, ...prev]);

    // Attach to session
    const sessId = targetSessionId || activeSessionId;
    if (sessId) {
      setSessions(prev =>
        prev.map(s => {
          if (s.id === sessId) {
            return {
              ...s,
              documents: [...(s.documents || []), newDoc]
            };
          }
          return s;
        })
      );
    }

    addNotification(`Document ${fileObj.name} added locally`, 'success');
    return newDoc;
  };

  const loginUser = (email, password) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    addNotification(`Signed in successfully as ${email}`, 'success');
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
    addNotification('Signed out', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        sessions,
        setSessions,
        activeSessionId,
        setActiveSessionId,
        activeSession,
        documents,
        setDocuments,
        agents,
        setAgents,
        notifications,
        addNotification,
        clearNotification,
        markAllNotificationsRead,
        sidebarCollapsed,
        setSidebarCollapsed,
        globalSearchQuery,
        setGlobalSearchQuery,
        updateSessionNotes,
        addMessageToSession,
        createNewSession,
        deleteSession,
        addDocument,
        isAuthenticated,
        setIsAuthenticated,
        loginUser,
        logoutUser,
        reports,
        setReports
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
