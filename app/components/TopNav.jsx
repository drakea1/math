'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const pathname = usePathname();

  // Hide the top nav bar on the login/signup screen if desired
  if (pathname === '/') return null;

  const navItems = [
    { name: 'Command', path: '/home' },
    { name: 'Ranks', path: '/leaderboard' },
    { name: 'Learn', path: '/learn' },
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