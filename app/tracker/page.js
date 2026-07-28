'use client';

export default function PageTemplate() {
  return (
    <div className="mobile-view" style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '1rem' }}>
        Tracker.
      </h1>
      <p style={{ color: '#888', fontSize: '1.1rem', lineHeight: '1.5' }}>
        Futuristic UI elements and Supabase data will load here.
      </p>
    </div>
  );
}