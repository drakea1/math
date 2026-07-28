import { Space_Grotesk } from 'next/font/google';
import './global.css'; 
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'MathAround',
  description: 'Gamified Command Center',
};

const spaceFont = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-futuristic' 
});

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: 'no',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceFont.variable}>
      <body>
        <AuthProvider>
          <div className="mobile-view" style={{ padding: 0, position: 'relative' }}>
            
            {/* 1. TOP NAV (Visible ONLY on Desktop/Tablet/PC) */}
            <TopNav />

            {/* 2. THE SCROLL ZONE */}
            <div style={{ 
              flex: 1,           
              minHeight: 0,      
              width: '100%', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column' 
            }}>
              {children}
            </div>
            
            {/* 3. BOTTOM NAV (Visible ONLY on Mobile) */}
            <div className="mobile-bottom-nav-container">
              <BottomNav />
            </div>
            
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}