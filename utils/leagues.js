const getLeague = (xp) => {
  const leagues = [
    { name: 'Bronze', threshold: 0, color: '#cd7f32' },
    { name: 'Silver', threshold: 750, color: '#c0c0c0' },
    { name: 'Gold', threshold: 1500, color: '#ffd700' },
    { name: 'Platinum', threshold: 2250, color: '#6ae4ff' },
    { name: 'Diamond', threshold: 3000, color: '#0043fc' },
    { name: 'Master', threshold: 3750, color: '#9d00ff' },
    { name: 'Grandmaster', threshold: 4500, color: '#ff5500' },
    { name: 'Champion', threshold: 5250, color: '#00ffaa' },
    { name: 'Legend', threshold: 6000, color: '#ff00ff' },
    { name: 'GOAT', threshold: 100000, color: '#ff0000' },
  ];

  // Find the highest league the user qualifies for safely using a copied reverse
  return [...leagues].reverse().find(l => xp >= l.threshold) || leagues[0];
};