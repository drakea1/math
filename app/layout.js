import 'katex/dist/katex.min.css';
import { Space_Grotesk } from 'next/font/google';
import './global.css';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata = {
  title: 'MathAround',
  description: 'Come MathAround',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'MathAround',
    description: 'Come MathAround',
    url: 'https://www.matharoundapp.com',
    siteName: 'MathAround',
    images: [
      {
        url: 'https://www.matharoundapp.com/logo.png',
        width: 1024,
        height: 1024,
        alt: 'MathAround Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MathAround',
    description: 'Come MathAround',
    images: ['https://www.matharoundapp.com/logo.png'],
  },
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
                className="main-content-area"
                style={{
                  flex: 1,
                  minHeight: 0,
                  width: '100%',
                  overflowX: 'clip',
                  display: 'flex',
                  flexDirection: 'column',
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