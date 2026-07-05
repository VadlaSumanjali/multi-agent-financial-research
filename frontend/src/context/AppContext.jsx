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

const initialSessions = [
  {
    id: 'sess-1',
    title: 'Apple Inc. (AAPL) Q3 2026 Margin Analysis',
    company: 'Apple Inc.',
    ticker: 'AAPL',
    date: '2026-07-05',
    status: 'completed',
    progress: 100,
    metadata: {
      sector: 'Technology',
      marketCap: '$3.45T',
      peRatio: '28.4',
      revenue: '$94.8B (Q3)',
      grossMargin: '46.2%',
      netDebt: '-$55B (Net Cash)'
    },
    documents: [
      { id: 'doc-1', name: 'AAPL-10Q-Q3-2026.pdf', size: '2.8 MB', status: 'indexed', uploadedAt: '2026-07-05 10:14' },
      { id: 'doc-2', name: 'AAPL-Earnings-Call-Transcript-Q3-26.txt', size: '420 KB', status: 'indexed', uploadedAt: '2026-07-05 10:20' }
    ],
    timeline: [
      { name: 'Document Ingestion', status: 'completed', time: '10:14 AM', details: 'Parsed AAPL-10Q-Q3-2026.pdf. Generated 1,200 chunks.' },
      { name: 'Data Extraction', status: 'completed', time: '10:15 AM', details: 'Extracted income statement and cash flows. Identified 46.2% gross margin.' },
      { name: 'Risk Assessment', status: 'completed', time: '10:17 AM', details: 'Analyzed litigation updates and tax contingencies. No significant deviations.' },
      { name: 'Synthesis & Summary', status: 'completed', time: '10:18 AM', details: 'Research Agent cross-referenced Q2 performance. Ready for review.' }
    ],
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Give me a brief summary of Apple\'s Q3 2026 gross margin trends and highlight any red flags.'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        agent: 'Report Agent',
        content: `### Executive Summary: Apple Inc. Q3 2026 Gross Margin

Based on the parsed **Q3 2026 10-Q filing**, Apple reported a consolidated **Gross Margin of 46.2%**, which is at the upper end of company guidance. This performance is primarily driven by:

1. **Services Mix**: Services gross margin reached **74.1%**, contributing to overall margin expansion. Services now represent 27.3% of total revenues.
2. **Component Deflation**: Reduced input prices for memory and display panels offset elevated assembly rates in secondary sites.

#### Key Red Flags Identified:
- **Foreign Exchange Headwinds**: FX fluctuations adversely impacted international gross margins by **110 bps** year-over-year.
- **Inventory Commitments**: Purchase commitments for next-generation silicon increased by **18% YoY**, creating potential inventory obsolescence risks if consumer demand softens in the European sector.`
      }
    ],
    notes: `### Analysts Notes - Apple Q3 2026
- Services revenue remains the primary margin engine.
- Silcon commitments indicate high volume requirements for late 2026 releases.
- Risk area: FX volatility remains persistent. Need to check hedging ratios in next session.`,
    summary: 'Apple posted robust Q3 2026 margins of 46.2%, buoyed by a record 74.1% Services margin. Concerns revolve around rising capital commitments and FX pressures.'
  },
  {
    id: 'sess-2',
    title: 'Tesla Inc. (TSLA) Q1 2026 Footnotes Audit',
    company: 'Tesla Inc.',
    ticker: 'TSLA',
    date: '2026-07-04',
    status: 'completed',
    progress: 100,
    metadata: {
      sector: 'Automotive / Energy',
      marketCap: '$720B',
      peRatio: '68.1',
      revenue: '$21.3B (Q1)',
      grossMargin: '17.4%',
      netDebt: '-$14.2B (Net Cash)'
    },
    documents: [
      { id: 'doc-3', name: 'TSLA-10Q-Q1-2026.pdf', size: '3.4 MB', status: 'indexed', uploadedAt: '2026-07-04 14:02' }
    ],
    timeline: [
      { name: 'Document Ingestion', status: 'completed', time: '14:02 PM', details: 'Parsed TSLA-10Q-Q1-2026.pdf.' },
      { name: 'Footnotes Analysis', status: 'completed', time: '14:05 PM', details: 'Scanned warranty reserve and regulatory credit revenues.' }
    ],
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Check the regulatory credits contribution and warranty reserves.'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        agent: 'Red Flag Agent',
        content: `### Tesla Q1 2026 Footnotes Analysis:

1. **Regulatory Credits**: Tesla recognized **$480M** of regulatory credit revenue this quarter (up 12% YoY). Excluding credit sales, automotive gross margin drops to **15.2%** (down from the reported 17.4%). This represents a high dependence on credits for profitability.
2. **Warranty Reserves**: Warranty reserves per vehicle delivered decreased by **4%**. If actual warranty claim rates follow historic averages, this adjustment could artificially boost operating income by approximately **$35M**.`
      }
    ],
    notes: 'Credit reliance remains high. Warranty reserve changes need further investigation as they may be boosting operating income artificially.',
    summary: 'Warranty reserves are down 4% and regulatory credits contributed $480M (representing 2.2% of margins), showing potential earnings quality concerns.'
  },
  {
    id: 'sess-3',
    title: 'NVIDIA (NVDA) Blackwell Chip Forecast',
    company: 'NVIDIA Corp.',
    ticker: 'NVDA',
    date: '2026-06-25',
    status: 'failed',
    progress: 15,
    metadata: {
      sector: 'Semiconductors',
      marketCap: '$3.10T',
      peRatio: '52.3',
      revenue: '$26.0B (Q1)',
      grossMargin: '78.1%',
      netDebt: '-$22B'
    },
    documents: [
      { id: 'doc-4', name: 'NVDA-Blackwell-SupplyChain-Brief.pdf', size: '1.2 MB', status: 'failed', uploadedAt: '2026-06-25 09:30' }
    ],
    timeline: [
      { name: 'File Fetch', status: 'completed', time: '09:30 AM', details: 'Retrieved supply chain brief.' },
      { name: 'Security Check', status: 'failed', time: '09:31 AM', details: 'Decryption failed. Document is password protected or corrupted.' }
    ],
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Extract the Blackwell shipment estimates.'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        agent: 'Document Agent',
        content: 'Analysis failed. The uploaded document is encrypted and cannot be parsed. Please re-upload an unencrypted PDF.'
      }
    ],
    notes: 'Filing was corrupted or encrypted. Re-upload needed.',
    summary: 'Session failed due to PDF decryption error during ingestion.'
  }
];

const globalDocumentsList = [
  { id: 'doc-1', name: 'AAPL-10Q-Q3-2026.pdf', company: 'Apple Inc.', size: '2.8 MB', status: 'indexed', uploadedAt: '2026-07-05 10:14' },
  { id: 'doc-2', name: 'AAPL-Earnings-Call-Transcript-Q3-26.txt', company: 'Apple Inc.', size: '420 KB', status: 'indexed', uploadedAt: '2026-07-05 10:20' },
  { id: 'doc-3', name: 'TSLA-10Q-Q1-2026.pdf', company: 'Tesla Inc.', size: '3.4 MB', status: 'indexed', uploadedAt: '2026-07-04 14:02' },
  { id: 'doc-4', name: 'NVDA-Blackwell-SupplyChain-Brief.pdf', company: 'NVIDIA Corp.', size: '1.2 MB', status: 'failed', uploadedAt: '2026-06-25 09:30' },
  { id: 'doc-5', name: 'MSFT-10K-FY2025.pdf', company: 'Microsoft Corp.', size: '8.4 MB', status: 'indexed', uploadedAt: '2026-06-20 11:15' },
  { id: 'doc-6', name: 'AMZN-Q2-2026-Report.pdf', company: 'Amazon.com Inc.', size: '4.1 MB', status: 'indexing', uploadedAt: '2026-07-05 16:50' }
];

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark'; // Dark mode is default for premium financial feel
  });
  
  const [sessions, setSessions] = useState(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState('sess-1');
  const [documents, setDocuments] = useState(globalDocumentsList);
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
        logoutUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
