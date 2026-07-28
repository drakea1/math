'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  // Hide the nav bar on the login/signup screen
  if (pathname === '/') return null;

  const navItems = [
    { name: 'Command', path: '/home', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1"></rect>
        <rect x="14" y="3" width="7" height="5" rx="1"></rect>
        <rect x="14" y="12" width="7" height="9" rx="1"></rect>
        <rect x="3" y="16" width="7" height="5" rx="1"></rect>
      </svg>
    )},
    { name: 'Ranks', path: '/leaderboard', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
      </svg>
    )},
    { name: 'Learn', path: '/learn', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
    )},
    { name: 'Profile', path: '/profile', icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    )}
  ];

  return (
    <nav style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'rgba(2, 5, 2, 0.85)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid var(--surface-border)',
      borderBottomLeftRadius: '40px',
      borderBottomRightRadius: '40px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '.5rem 0.5rem .5rem 0.5rem',
      zIndex: 50,
    }}>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.path);
        
        return (
          <Link href={item.path} key={item.name} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive ? 'var(--accent-neon)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              transform: isActive ? 'translateY(-2px)' : 'none',
            }}>
              {item.icon}
              <span style={{ 
                fontSize: '0.65rem', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                letterSpacing: '1px' 
              }}>
                {item.name}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}