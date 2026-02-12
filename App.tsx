
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  LogOut, 
  PlayCircle,
  User as UserIcon,
  BarChart3
} from 'lucide-react';
import { User, Folder, ContentItem, Progress, UserReport, UserItemProgress } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FolderDetail from './components/FolderDetail';
import ContentPlayer from './components/ContentPlayer';
import AdminReports from './components/AdminReports';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fire_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('fire_folders');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Introdução ao Instituto Fire',
        description: 'Conheça nossa missão e visão.',
        items: [
          {
            id: 'v1',
            title: 'Boas Vindas',
            type: 'video',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            description: 'Vídeo inicial de apresentação.',
            quiz: [
              { id: 'q1', question: 'Qual a cor principal do Instituto Fire?', options: ['Azul', 'Laranja', 'Verde', 'Roxo'], correctAnswer: 1 }
            ]
          }
        ]
      }
    ];
  });

  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem('fire_progress');
    return saved ? JSON.parse(saved) : { userId: '', completedItems: [] };
  });

  // Global reports for admin view (Simulated Backend)
  const [allReports, setAllReports] = useState<UserReport[]>(() => {
    const saved = localStorage.getItem('fire_all_reports');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fire_folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem('fire_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('fire_all_reports', JSON.stringify(allReports));
  }, [allReports]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('fire_user', JSON.stringify(userData));
    setProgress(prev => ({ ...prev, userId: userData.id }));
    
    // Ensure user exists in reports
    setAllReports(prev => {
      if (prev.find(r => r.userId === userData.id)) return prev;
      return [...prev, { userId: userData.id, userName: userData.name, userEmail: userData.email, progress: [] }];
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fire_user');
  };

  const markComplete = (itemId: string, score?: number, maxScore?: number) => {
    if (!user) return;

    // Update local progress
    if (!progress.completedItems.includes(itemId)) {
      setProgress(prev => ({
        ...prev,
        completedItems: [...prev.completedItems, itemId]
      }));
    }

    // Update global report for admin
    const folder = folders.find(f => f.items.some(i => i.id === itemId));
    const item = folder?.items.find(i => i.id === itemId);

    if (folder && item) {
      setAllReports(prev => prev.map(report => {
        if (report.userId === user.id) {
          const existingProgressIdx = report.progress.findIndex(p => p.itemId === itemId);
          const newProgressItem: UserItemProgress = {
            itemId,
            itemTitle: item.title,
            folderName: folder.name,
            completed: true,
            score,
            maxScore,
            completedAt: new Date().toLocaleString('pt-BR')
          };

          const newProgress = [...report.progress];
          if (existingProgressIdx >= 0) {
            newProgress[existingProgressIdx] = newProgressItem;
          } else {
            newProgress.push(newProgressItem);
          }

          return { ...report, progress: newProgress };
        }
        return report;
      }));
    }
  };

  const addFolder = (name: string, description: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      description,
      items: []
    };
    setFolders([...folders, newFolder]);
  };

  const addItemToFolder = (folderId: string, item: Omit<ContentItem, 'id'>) => {
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          items: [...f.items, { ...item, id: Date.now().toString() }]
        };
      }
      return f;
    }));
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {user ? (
          <>
            <Header user={user} onLogout={handleLogout} />
            <main className="flex-1 container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard folders={folders} progress={progress} onAddFolder={addFolder} isAdmin={user.role === 'admin'} />} />
                <Route path="/folder/:id" element={<FolderDetail folders={folders} progress={progress} onAddItem={addItemToFolder} isAdmin={user.role === 'admin'} />} />
                <Route path="/content/:folderId/:contentId" element={<ContentPlayer folders={folders} onComplete={markComplete} progress={progress} />} />
                <Route path="/admin/reports" element={user.role === 'admin' ? <AdminReports reports={allReports} /> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </HashRouter>
  );
};

const Header: React.FC<{ user: User, onLogout: () => void }> = ({ user, onLogout }) => (
  <header className="bg-white shadow-md sticky top-0 z-50">
    <div className="container mx-auto px-4 h-20 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-14 h-14 logo-container overflow-hidden rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
          <img 
            src="https://r.jina.ai/i/6efbc6607e3848b598d197609f1875f5" 
            alt="Instituto Fire Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-gray-900 leading-none tracking-tighter">
            INSTITUTO <span className="text-orange-600">FIRE</span>
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Formação de Heróis</span>
        </div>
      </Link>
      
      <div className="flex items-center space-x-6">
        {user.role === 'admin' && (
          <Link 
            to="/admin/reports" 
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 font-bold transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span className="hidden md:inline">Relatórios</span>
          </Link>
        )}
        <div className="hidden md:flex flex-col items-end border-l pl-6 border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-800">
            <span className="font-bold">{user.name}</span>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border-2 border-orange-500">
              <UserIcon className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <span className="bg-orange-600 text-white text-[9px] px-2 py-0.5 rounded-full uppercase font-black mt-1">
            {user.role}
          </span>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center space-x-1 text-gray-400 hover:text-red-600 transition-all font-bold group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase hidden sm:inline">Desconectar</span>
        </button>
      </div>
    </div>
  </header>
);

export default App;
