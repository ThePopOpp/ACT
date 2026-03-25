import { Outlet } from 'react-router';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

export function Root() {
  return (
    <AuthProvider>
      <AppProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <Toaster position="bottom-right" richColors closeButton />
        </div>
      </AppProvider>
    </AuthProvider>
  );
}
