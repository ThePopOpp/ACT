import { Outlet } from 'react-router';
import { Toaster } from 'sonner';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';

function LoadingGuard({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e8eef5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#1a2d5a]/20 border-t-[#1a2d5a] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function Root() {
  return (
    <AuthProvider>
      <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test', currency: 'USD', intent: 'capture' }}>
        <AppProvider>
          <LoadingGuard>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Outlet />
              </main>
              <Footer />
              <Toaster position="bottom-right" richColors closeButton />
            </div>
          </LoadingGuard>
        </AppProvider>
      </PayPalScriptProvider>
    </AuthProvider>
  );
}
