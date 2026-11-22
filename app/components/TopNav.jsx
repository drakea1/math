'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const pathname = usePathname();

  // Hide the top nav bar on login/signup, forgot-password, and reset-password pages
  if (
    pathname === '/' || 
    pathname.includes('forgot-password') || 
    pathname.includes('reset-password')
  ) {
    return null;
  }

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Learn', path: '/learn' },
    { name: 'Subscription', path: '/subscription' },
    { name: 'Helper' , path: '/helper'},
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="desktop-top-nav">
      <div className="top-nav-logo">MathAround</div>
      <div className="top-nav-links">
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
      </div>
    </nav>
  );
}