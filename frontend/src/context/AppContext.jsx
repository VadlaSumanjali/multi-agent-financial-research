import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const initialAgents = [
  {
    id: 'doc-agent',
    name: 'Document Agent',
    description: 'Retrieves, parses, and indexes SEC filings, PDFs, and corporate reports.',
    status: 'idle',
    lastActivity: '2026-07-05 15:45',
    health: 98,
    progress: 100,
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'extraction-agent',
    name: 'Extraction Agent',
    description: 'Extracts tabular financial data, balance sheets, and key ratios.',
    status: 'idle',
    lastActivity: '2026-07-05 15:46',
    health: 100,
    progress: 100,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'redflag-agent',
    name: 'Red Flag Agent',
    description: 'Identifies accounting discrepancies, footnotes warnings, and legal risks.',
    status: 'idle',
    lastActivity: '2026-07-05 15:47',
    health: 95,
    progress: 100,
    gradient: 'from-rose-500 to-orange-600',
  },
  {
    id: 'comparison-agent',
    name: 'Comparison Agent',
    description: 'Runs cross-sectional valuation, multiples comparison, and peer analysis.',
    status: 'idle',
    lastActivity: '2026-07-05 15:42',
    health: 100,
    progress: 100,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'research-agent',
    name: 'Research Agent',
    description: 'Orchestrates search queries and gathers macroeconomic data.',
    status: 'idle',
    lastActivity: '2026-07-05 15:48',
    health: 97,
    progress: 100,
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'report-agent',
    name: 'Report Agent',
    description: 'Compiles professional, print-ready investment briefs and PDF summaries.',
    status: 'idle',
    lastActivity: '2026-07-05 15:49',
    health: 99,
    progress: 100,
    gradient: 'from-amber-500 to-yellow-600',
  }
];

const initialSessions = [];

const globalDocumentsList = [];


export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark'; // Dark mode is default for premium financial feel
  });
  
  const [sessions, setSessions] = useState(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [documents, setDocuments] = useState(globalDocumentsList);
  const [reports, setReports] = useState([]);

  const [agents, setAgents] = useState(initialAgents);
  const [notifications, setNotifications] = useState([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Apply dark mode theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Modify active session notes
  const updateSessionNotes = (notesText) => {
    setSessions(prev =>
      prev.map(s => (s.id === activeSessionId ? { ...s, notes: notesText } : s))
    );
  };

  // Add message to workspace conversation
  const addMessageToSession = (text) => {
    if (!text.trim()) return;
    
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

    // Simulate Agent response based on question keywords
    simulateAgentResponse(text);
  };

  // Create new research session
  const createNewSession = (title, company, ticker) => {
    const newId = `sess-${Date.now()}`;
    const newSession = {
      id: newId,
      title: title || `${company} (${ticker}) Deep Dive Analysis`,
      company: company || 'Generic Corp',
      ticker: ticker?.toUpperCase() || 'GEN',
      date: new Date().toISOString().split('T')[0],
      status: 'idle',
      progress: 0,
      metadata: {
        sector: 'Assigned Analyst Sector',
        marketCap: '--',
        peRatio: '--',
        revenue: '--',
        grossMargin: '--',
        netDebt: '--'
      },
      documents: [],
      timeline: [],
      messages: [
        {
          id: `msg-${Date.now()}-init`,
          role: 'assistant',
          agent: 'Research Agent',
          content: `Initialized financial research session for **${company} (${ticker})**. 

Please upload filings or documents (10-K, 10-Q, earnings briefings) to trigger the AI analysis cycle, or input a research prompt below.`
        }
      ],
      notes: `# Notes for ${company}\n*Add details here...*`,
      summary: 'Research session initialized. Awaiting files.'
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    addNotification(`Session initialized for ${company} (${ticker})`, 'success');
  };

  // Delete session
  const deleteSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
      }
    }
    addNotification('Research session removed', 'info');
  };

  // Upload file (Simulated)
  const uploadFile = (fileObj) => {
    const fileId = `doc-${Date.now()}`;
    const newDoc = {
      id: fileId,
      name: fileObj.name,
      company: activeSession.company,
      size: `${(fileObj.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'indexing',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    // Add to global documents list
    setDocuments(prev => [newDoc, ...prev]);

    // Add to active session documents
    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            status: 'processing',
            progress: 10,
            documents: [...s.documents, newDoc],
            timeline: [
              ...s.timeline,
              { name: 'Upload Document', status: 'completed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), details: `Received ${fileObj.name}` }
            ]
          };
        }
        return s;
      })
    );

    addNotification(`Uploading ${fileObj.name}...`, 'info');

    // Simulate analysis workflow
    runAgentWorkflow(fileId, fileObj.name);
  };

  // Simulate complete Agent workflow (Document -> Extraction -> RedFlag -> Report)
  const runAgentWorkflow = (fileId, fileName) => {
    const steps = [
      { agent: 'doc-agent', label: 'Document Parsing', text: 'Indexing filing blocks and layout structures...', progress: 30 },
      { agent: 'extraction-agent', label: 'Metric Extraction', text: 'Pulling balance sheet, margin statements, and key variables...', progress: 60 },
      { agent: 'redflag-agent', label: 'Footnotes Scanned', text: 'Analyzing litigation files and accounting metrics...', progress: 85 },
      { agent: 'report-agent', label: 'Synthesis Summary', text: 'Drafting analyst reports and summarizing highlights...', progress: 100 }
    ];

    let currentStep = 0;

    const executeStep = () => {
      if (currentStep >= steps.length) {
        // Complete the document status and session status
        setDocuments(prev =>
          prev.map(d => (d.id === fileId ? { ...d, status: 'indexed' } : d))
        );
        setSessions(prev =>
          prev.map(s => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                status: 'completed',
                progress: 100,
                timeline: [
                  ...s.timeline,
                  {
                    name: 'Workflow Complete',
                    status: 'completed',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    details: 'AI Agent cascade finished analysis successfully.'
                  }
                ],
                messages: [
                  ...s.messages,
                  {
                    id: `msg-${Date.now()}-ai-complete`,
                    role: 'assistant',
                    agent: 'Research Agent',
                    content: `### Ingestion Analysis Complete for **${fileName}**
                    
I have successfully processed the document. Here are my primary findings:
- **Financial Metrics**: Successfully structured Q/Q and Y/Y financial templates.
- **Red Flags**: Scanned the footnotes section. Found **2 moderate warnings** (see Red Flag Agent log).
- **Summary**: Ready for deep comparison or report drafting.`
                  }
                ],
                summary: `Successfully indexed ${fileName} and compiled multi-agent summaries.`
              };
            }
            return s;
          })
        );
        
        // Reset all agents to idle
        setAgents(prev => prev.map(a => ({ ...a, status: 'idle', progress: 100 })));
        addNotification(`Analysis complete for ${fileName}`, 'success');
        return;
      }

      const step = steps[currentStep];

      // Set active agent
      setAgents(prev =>
        prev.map(a =>
          a.id === step.agent
            ? { ...a, status: 'active', progress: Math.floor(Math.random() * 40) + 40, lastActivity: new Date().toISOString().substring(0, 16).replace('T', ' ') }
            : { ...a, status: 'idle' }
        )
      );

      // Add to session timeline
      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              progress: step.progress,
              timeline: [
                ...s.timeline,
                {
                  name: step.label,
                  status: 'processing',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  details: step.text
                }
              ]
            };
          }
          return s;
        })
      );

      currentStep++;
      setTimeout(executeStep, 2500); // 2.5 seconds per agent step
    };

    // Start
    setTimeout(executeStep, 1000);
  };

  // Simulating an AI Agent answer in chat
  const simulateAgentResponse = (userPrompt) => {
    const lowercasePrompt = userPrompt.toLowerCase();
    let reply = "";
    let responseAgent = "Research Agent";

    if (lowercasePrompt.includes('debt') || lowercasePrompt.includes('cash') || lowercasePrompt.includes('balance')) {
      responseAgent = "Extraction Agent";
      reply = `### Balance Sheet Analysis (${activeSession.ticker})
      
Based on current filing data:
- **Cash & Equivs**: High Liquidity holding.
- **Debt Ratio**: Debt-to-Equity is well within risk tolerances.
- **Capital Structure**: Solid leverage. Let me know if you would like me to plot the debt maturity graph.`;
    } else if (lowercasePrompt.includes('red flag') || lowercasePrompt.includes('risk') || lowercasePrompt.includes('lawsuit')) {
      responseAgent = "Red Flag Agent";
      reply = `### Risk & Red Flag Scan (${activeSession.ticker})
      
I scanned the **Commitments & Contingencies** segment:
1. **Operating Leases**: Substantial right-of-use asset depreciation noted.
2. **Litigation**: Legal provisions have been augmented by 5% this cycle, indicating active litigation settlement preparations.
3. **Valuation Risks**: High dependency on specific global fabricators represents a concentrated supply-chain bottleneck.`;
    } else if (lowercasePrompt.includes('compare') || lowercasePrompt.includes('peer') || lowercasePrompt.includes('valuation')) {
      responseAgent = "Comparison Agent";
      reply = `### Relative Valuation Matrix

Comparing **${activeSession.ticker}** to sector peers:
- **P/E Multiples**: Trailing P/E is 12% higher than sector averages.
- **Margins**: EBITDA margin exceeds peer group by **420 bps**.
- **Efficiency**: Capital returns (ROIC) remain in the top decile of its category.`;
    } else {
      reply = `I have searched the active filings and documents for **${activeSession.company}** regarding: *"${userPrompt}"*.

Here is a summary of findings:
- **Operational Metrics**: Performing in line with guidance.
- **Key Themes**: Broad structural margins, solid operational cash flows, and manageable capital expenditures.

Would you like the **Report Agent** to compile these details into a formal markdown document?`;
    }

    // Set agents status temporarily
    setAgents(prev =>
      prev.map(a =>
        a.name === responseAgent
          ? { ...a, status: 'active', progress: 50, lastActivity: new Date().toISOString().substring(0, 16).replace('T', ' ') }
          : a
      )
    );

    setTimeout(() => {
      // Append assistant reply
      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [
                ...s.messages,
                {
                  id: `msg-${Date.now()}-ai-reply`,
                  role: 'assistant',
                  agent: responseAgent,
                  content: reply
                }
              ]
            };
          }
          return s;
        })
      );

      // Reset agents
      setAgents(prev => prev.map(a => ({ ...a, status: 'idle', progress: 100 })));
      addNotification(`Response received from ${responseAgent}`, 'success');
    }, 1500);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const loginUser = (email, password) => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    addNotification(`Signed in successfully as ${email}`, 'success');
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
    addNotification('Signed out of session', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        sessions,
        activeSessionId,
        setActiveSessionId,
        activeSession,
        documents,
        setDocuments,
        agents,
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
        uploadFile,
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
