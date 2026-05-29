import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider, SidebarTrigger } from "@/componentss/ui/sidebar";
import { AppSidebar } from "@/componentss/app-sidebar";
import { Search, User, Bell } from "lucide-react";

import IndexPage from './routes/index';
import CallLogsPage from './routes/call-logs';
import DoctorsPage from './routes/doctors';

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

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
          <header className="h-16 flex items-center justify-between border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-30 px-4 sm:px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search patients, doctors..."
                  className="h-10 w-64 lg:w-96 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm shadow-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>
              <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>
              <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="text-sm font-semibold text-slate-700 leading-none">Dr. Admin</span>
                  <span className="text-xs text-slate-500 mt-1">Administrator</span>
                </div>
              </div>
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
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/call-logs" element={<CallLogsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="*" element={<NotFoundComponent />} />
          </Routes>
        </AppLayout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
