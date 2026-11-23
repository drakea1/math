'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
export default function BottomNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Hide the bottom nav bar on landing, login/signup, forgot-password, and reset-password pages
  if (
    pathname === '/' ||
    pathname.startsWith('/login-signup') ||
    pathname.includes('forgot-password') ||
    pathname.includes('reset-password')
  ) {
    return null;
  }

  const isLoggedOut = !loading && !user;

  const navItems = [
    {
      name: 'Home',
      path: '/home',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1"></rect>
          <rect x="14" y="3" width="7" height="5" rx="1"></rect>
          <rect x="14" y="12" width="7" height="9" rx="1"></rect>
          <rect x="3" y="16" width="7" height="5" rx="1"></rect>
        </svg>
      ),
    },
    {
      name: 'Board',
      path: '/leaderboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
        </svg>
      ),
    },
    {
      name: 'Learn',
      path: '/learn',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
    },
    {
      name: 'Sub',
      path: '/subscription',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      ),
    },
    {
      name: 'Helper',
      path: '/helper',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z"></path>
          <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"></path>
        </svg>
      ),
    },
    isLoggedOut
      ? {
          name: 'Log In',
          path: '/login-signup',
          isAuthCTA: true,
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          ),
        }
      : {
          name: 'Profile',
          path: '/profile',
          icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          ),
        },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: 'var(--card-bg)',
        borderTop: '1px solid var(--surface-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: '0 0.15rem env(safe-area-inset-bottom)',
        minHeight: '60px',
        zIndex: 1000,
        boxSizing: 'border-box',
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);
        const highlightNeon = isActive || item.isAuthCTA;

        return (
          <Link
            href={item.path}
            key={item.path}
            style={{
              textDecoration: 'none',
              flex: 1,
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                width: '100%',
                height: '100%',
                padding: '0.45rem 0.1rem',
                color: highlightNeon ? 'var(--text-main)' : 'var(--text-muted)',
                transition: 'color 0.2s ease',
              }}
            >
              <span
                style={{
                  color: highlightNeon ? 'var(--accent-neon)' : 'inherit',
                  filter: highlightNeon ? 'drop-shadow(0 0 6px var(--accent-neon-glow))' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: '0.58rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  color: item.isAuthCTA ? 'var(--accent-neon)' : 'inherit',
                }}
              >
                {item.name}
              </span>
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '18%',
                    right: '18%',
                    height: '3px',
                    borderRadius: '0 0 4px 4px',
                    backgroundColor: 'var(--accent-neon)',
                    boxShadow: '0 0 10px var(--accent-neon-glow)',
                  }}
                />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}