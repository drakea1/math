'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function TopNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Hide the top nav bar on landing, login/signup, forgot-password, and reset-password pages
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
    { name: 'Home', path: '/home' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Learn', path: '/learn' },
    { name: 'Subscription', path: '/subscription' },
    { name: 'Helper', path: '/helper' },
    ...(isLoggedOut ? [] : [{ name: 'Profile', path: '/profile' }]),
  ];

  return (
    <nav className="desktop-top-nav">
      <Link href="/" className="top-nav-logo" style={{ textDecoration: 'none' }}>
        MathAround
      </Link>
      <div className="top-nav-links" style={{ display: 'flex', alignItems: 'center' }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`top-nav-item ${isActive ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          );
        })}

        {isLoggedOut && (
          <Link
            href="/login-signup"
            className="btn-signin"
            style={{
              marginLeft: '0.65rem',
              padding: '7px 16px',
              fontSize: '0.85rem',
              fontWeight: '700',
              textDecoration: 'none',
              borderRadius: '10px',
            }}
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}