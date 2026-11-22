import 'katex/dist/katex.min.css';
import { Space_Grotesk } from 'next/font/google';
import './global.css';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata = {
  title: 'MathAround',
  description: 'Gamified Command Center',
};

const spaceFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-futuristic',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceFont.variable}>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div
              className="mobile-view"
              style={{
                padding: 0,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100dvh',
                width: '100%',
                overflowX: 'clip',
              }}
            >
              {/* 1. TOP NAV (Hidden on mobile, sticky on desktop) */}
              <TopNav />

              {/* 2. MAIN CONTENT AREA */}
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  width: '100%',
                  overflowX: 'clip',
                  display: 'flex',
                  flexDirection: 'column',
                  paddingBottom: '5.5rem',
                }}
              >
                {children}
              </div>

              {/* 3. BOTTOM NAV (Visible on mobile, hidden on desktop via CSS) */}
              <div className="mobile-bottom-nav-container">
                <BottomNav />
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}