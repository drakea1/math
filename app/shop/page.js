'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'next/navigation';

export default function ShopPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/');

      // 1. Fetch User Coins
      const { data: profile } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', user.id)
        .single();
      
      setCoins(profile?.coins || 0);

      // 2. Fetch Shop Items
      const { data: itemsData } = await supabase
        .from('items')
        .select('*');
      
      setItems(itemsData || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handlePurchase = async (itemId, cost) => {
    if (coins < cost) {
      setFeedback({ message: 'Insufficient funds.', type: 'error' });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    // Call the RPC function we created
    const { data, error } = await supabase.rpc('purchase_item', {
      p_user_id: user.id,
      p_item_id: itemId
    });

    if (error || !data.success) {
      setFeedback({ message: 'Purchase failed. Try again.', type: 'error' });
    } else {
      setFeedback({ message: 'Item acquired!', type: 'success' });
      setCoins(prev => prev - cost); // Optimistic update
    }

    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Loading Terminal...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>← Back</button>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-neon)' }}>💰 {coins} Credits</div>
      </div>

      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Black Market</h1>

      {feedback.message && (
        <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', textAlign: 'center', background: feedback.type === 'error' ? 'rgba(255,51,102,0.2)' : 'rgba(0,255,204,0.2)', border: feedback.type === 'error' ? '1px solid #ff3366' : '1px solid #00ffcc' }}>
          {feedback.message}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {items.map((item) => (
          <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--text-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>{item.description}</p>
            </div>
            <button 
              onClick={() => handlePurchase(item.id, item.cost)}
              disabled={coins < item.cost}
              style={{ padding: '0.8rem 1.2rem', borderRadius: '8px', background: coins >= item.cost ? 'var(--accent-neon)' : '#333', border: 'none', color: '#000', fontWeight: 'bold', cursor: coins >= item.cost ? 'pointer' : 'not-allowed' }}
            >
              {item.cost} Credits
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}