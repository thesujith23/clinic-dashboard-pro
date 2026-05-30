import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider, SidebarTrigger } from "@/componentss/ui/sidebar";
import { AppSidebar } from "@/componentss/app-sidebar";
import { User } from "lucide-react";

import IndexPage from './routes/index';
import CallLogsPage from './routes/call-logs';
import DoctorsPage from './routes/doctors';
import ScheduleDummyPage from './routes/schedule-dummy';
import AppointmentsPage from './routes/appointments';
import LoginPage from './routes/login';

const queryClient = new QueryClient();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function AppLayout({ children, username, onLogout }: { children: React.ReactNode, username: string, onLogout: () => void }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          <header className="h-16 flex items-center justify-between border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-30 px-4 sm:px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>
              <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-semibold text-slate-700 leading-none">{username}</span>
                  <span className="text-xs text-slate-500 mt-1">Administrator</span>
                </div>
              </div>
              <button onClick={onLogout} className="text-xs font-medium text-slate-500 hover:text-slate-900 ml-2 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors">
                Log out
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  const [username, setUsername] = useState<string | null>(null);

  const handleLogin = (name: string) => {
    setUsername(name);
  };

  const handleLogout = () => {
    setUsername(null);
  };

  if (!username) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout username={username} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/call-logs" element={<CallLogsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/schedule" element={<ScheduleDummyPage />} />
            <Route path="*" element={<NotFoundComponent />} />
          </Routes>
        </AppLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
