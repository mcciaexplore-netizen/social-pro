
import React, { useState, useEffect } from 'react';
import { BrandContext, HistoryItem, View } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Tools from './components/Tools';
import ContentHub from './components/ContentHub';
import PostGenerator from './components/PostGenerator';
import OfferGenerator from './components/OfferGenerator';
import ReplyAssistant from './components/ReplyAssistant';
import BroadcastHelper from './components/BroadcastHelper';
import ImagePromptGenerator from './components/ImagePromptGenerator';
import MonthlyPlanner from './components/MonthlyPlanner';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import {
  saveUserProfile,
  getUserProfile,
  addHistoryToCloud,
  getHistoryFromCloud,
  deleteHistoryItem
} from './firebase';

type ContentSegment = 'content' | 'activity';

const App: React.FC = () => {
  const [brand, setBrand] = useState<BrandContext | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  // Returning visitors (a saved profile exists) land on the Dashboard;
  // Business Profile only opens standalone on true first-run (see below,
  // where `!brand` is checked) or when Settings is opened explicitly.
  const [view, setView] = useState<View>('dashboard');
  const [contentSegment, setContentSegment] = useState<ContentSegment>('content');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const cloudBrand = await getUserProfile();
        if (cloudBrand) setBrand(cloudBrand);

        const cloudHistory = await getHistoryFromCloud();
        setHistory(cloudHistory);
      } catch (e) {
        console.error("Initialization failed", e);
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  const handleSaveBrand = async (newBrand: BrandContext) => {
    setIsSyncing(true);
    setBrand(newBrand);
    await saveUserProfile(newBrand);
    setIsSyncing(false);
    setView('dashboard');
    window.scrollTo(0, 0);
  };

  const addToHistory = async (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    setIsSyncing(true);
    const newId = await addHistoryToCloud(item);
    const newItem: HistoryItem = {
      ...item,
      id: newId,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
    setIsSyncing(false);
  };

  const handleDeleteHistory = async (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    await deleteHistoryItem(id);
  };

  const exportToCSV = () => {
    if (history.length === 0) return;
    const headers = ["ID", "Date", "Time", "Type", "Content"];
    const rows = history.map(item => {
      const d = new Date(item.timestamp);
      const cleanContent = `"${item.content.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      return [item.id, d.toLocaleDateString(), d.toLocaleTimeString(), item.type, cleanContent].join(",");
    });
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `MCCIA_Socials_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const navigate = (nextView: View, segment?: ContentSegment) => {
    setView(nextView);
    if (segment) setContentSegment(segment);
    setSearchQuery('');
    window.scrollTo(0, 0);
  };

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Syncing Cloud</p>
    </div>
  );

  if (!brand) return <Onboarding onSave={handleSaveBrand} />;

  // Settings replaces the whole screen with the same standalone profile page
  // used on first run - no header/nav around it, just the form.
  if (view === 'settings') {
    return <Onboarding onSave={handleSaveBrand} initialData={brand} onCancel={() => navigate('dashboard')} />;
  }

  const renderView = () => {
    switch (view) {
      case 'tools': return <Tools setView={navigate} searchQuery={searchQuery} />;
      case 'content': return (
        <ContentHub
          history={history}
          segment={contentSegment}
          onSegmentChange={setContentSegment}
          onExport={exportToCSV}
          onDelete={handleDeleteHistory}
        />
      );
      case 'post': return <PostGenerator brand={brand} history={history} onSave={addToHistory} />;
      case 'offer': return <OfferGenerator brand={brand} onSave={addToHistory} />;
      case 'reply': return <ReplyAssistant brand={brand} onSave={addToHistory} />;
      case 'broadcast': return <BroadcastHelper brand={brand} onSave={addToHistory} />;
      case 'prompt': return <ImagePromptGenerator brand={brand} onSave={addToHistory} />;
      case 'planner': return <MonthlyPlanner brand={brand} />;
      default: return <Dashboard setView={navigate} brand={brand} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar view={view} contentSegment={contentSegment} onNavigate={navigate} />
      <div className="flex-1 flex flex-col min-w-0 pb-24 md:pb-0">
        <TopBar
          view={view}
          brand={brand}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBack={() => navigate('dashboard')}
          onOpenSettings={() => navigate('settings')}
          isSyncing={isSyncing}
        />
        <main className="flex-1 p-6">{renderView()}</main>
      </div>
      <BottomNav view={view} contentSegment={contentSegment} onNavigate={navigate} />
    </div>
  );
};

export default App;
