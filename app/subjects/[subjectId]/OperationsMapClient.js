'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabaseClient';
import Link from 'next/link';

// Map your subject IDs to clean titles and metadata
const SUBJECT_DATA = {
  'addition': { title: 'Addition Mastery', opCode: '01' },
  'subtraction': { title: 'Subtraction Quest', opCode: '02' },
  'multiplication': { title: 'Multiplication Scaling', opCode: '03' },
  'division': { title: 'Division Splitting', opCode: '04' },
  'pre-algebra': { title: 'Pre-Algebra Bridge', opCode: '05' },
  'algebra': { title: 'Algebra Equations', opCode: '06' },
  'algebra2': { title: 'Algebra 2 Powers', opCode: '07' },
  'geometry': { title: 'Geometry Shapes', opCode: '08' },
  'pre-calc': { title: 'Pre-Calc Horizon', opCode: '09' },
  'statistics': { title: 'Statistics & Data', opCode: '10' },
  'calculus': { title: 'Calculus Limits', opCode: '11' }
};

const PREALGEBRA_UNIT_NAMES = {
  1: "Real Number Operations & Properties",
  2: "Integers & Absolute Value Applications",
  3: "Exponent Rules & Scientific Notation",
  4: "Square Roots & Radical Expressions",
  5: "Order of Operations with Grouping Symbols",
  6: "Algebraic Expressions & Multi-Variable Substitution",
  7: "Simplifying Polynomial Expressions & Combining Like Terms",
  8: "The Distributive Property & Binomial Multiplication",
  9: "Factoring Linear Expressions via Greatest Common Factor",
  10: "Solving Multi-Step Linear Equations",
  11: "Linear Equations with Variables on Both Sides",
  12: "Literal Equations & Formula Rearranging",
  13: "Linear Inequalities & Compound Inequalities",
  14: "Ratios, Rates, & Proportions",
  15: "Advanced Percents & Financial Applications",
  16: "The Coordinate Plane & Distance Formula",
  17: "Slope & Slope-Intercept Form of a Line",
  18: "Introduction to Functions & Function Notation",
  19: "Systems of Linear Equations",
  20: "Exponent Laws & Scientific Notation Operations"
};

const ALGEBRA_UNITS = {
  1: "Foundations of Algebra & Real Numbers",
  2: "Solving Linear Equations in One Variable",
  3: "Solving Linear Inequalities & Compound Inequalities",
  4: "Graphing Linear Equations & Functions",
  5: "Writing Linear Equations & Models",
  6: "Systems of Linear Equations & Inequalities",
  7: "Exponents, Radicals, & Scientific Notation",
  8: "Polynomial Operations & Special Products",
  9: "Factoring Polynomials Completely",
  10: "Quadratic Equations & Complex Numbers",
  11: "Solving Quadratics via Completing the Square & Formula",
  12: "Graphing Quadratic Functions & Transformations",
  13: "Radical Equations & Introduction to Rational Exponents",
  14: "Rational Expressions & Equations",
  15: "Exponential Functions, Growth, & Decay",
  16: "Sequences & Series (Arithmetic & Geometric)",
  17: "Statistics, Data Analysis, & Probability Distributions",
  18: "Absolute Value Equations, Inequalities, & Piecewise Functions",
  19: "Introduction to Trigonometric Ratios & Right Triangles",
  20: "Polynomial Functions & Fundamental Theorem of Algebra"
};

const ALGEBRA2_UNITS = {
  1: "Equations and Inequalities",
  2: "Linear Equations and Functions",
  3: "Systems of Linear Equations and Inequalities",
  4: "Matrices and Determinants",
  5: "Quadratic Functions and Equations",
  6: "Polynomial Functions and Operations",
  7: "Polynomial Equations and Factoring",
  8: "Rational Exponents and Radical Functions",
  9: "Exponential and Logarithmic Functions",
  10: "Rational Functions and Equations",
  11: "Sequences and Series",
  12: "Quadratic Relations and Conic Sections",
  13: "Counting Methods and Probability",
  14: "Data Analysis and Statistics",
  15: "Trigonometric Ratios and Right Triangles",
  16: "Trigonometric Functions and the Unit Circle",
  17: "Graphing Trigonometric Functions",
  18: "Trigonometric Identities and Equations",
  19: "Limits and Introduction to Calculus Concepts",
  20: "Advanced Polynomial and Complex Number Theorems"
};

export default function OperationsMapClient({ subjectId }) {
  const router = useRouter();
  const currentSubjectInfo = SUBJECT_DATA[subjectId] || { title: 'Math Mastery', opCode: '??' };

  const [missionsLeft, setMissionsLeft] = useState(0); 
  const maxMissions = 8;
  const [timeLeft, setTimeLeft] = useState(0); 

  const [completedLevels, setCompletedLevels] = useState({});
  const [levelHighScores, setLevelHighScores] = useState({});
  const [expandedUnits, setExpandedUnits] = useState({ 1: true });

  const totalUnits = 20;
  const levelsPerUnit = 20;

  useEffect(() => {
    async function syncUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('energy, last_energy_update')
        .eq('id', user.id)
        .single();

      if (profile) {
        const secondsPerEnergy = 14400;
        const now = new Date();
        const lastUpdate = new Date(profile.last_energy_update);
        const secondsPassed = Math.floor((now - lastUpdate) / 1000);
        
        const energyEarned = Math.floor(secondsPassed / secondsPerEnergy);
        let currentEnergy = profile.energy;
        let nextUpdate = lastUpdate;

        if (energyEarned > 0 && currentEnergy < maxMissions) {
          currentEnergy = Math.min(currentEnergy + energyEarned, maxMissions);
          const leftoverSeconds = secondsPassed % secondsPerEnergy;
          nextUpdate = new Date(now.getTime() - (leftoverSeconds * 1000));

          await supabase
            .from('profiles')
            .update({ energy: currentEnergy, last_energy_update: nextUpdate.toISOString() })
            .eq('id', user.id);
        }

        setMissionsLeft(currentEnergy);
        
        if (currentEnergy < maxMissions) {
          const nextEnergyTime = new Date(nextUpdate.getTime() + (secondsPerEnergy * 1000));
          const secondsUntilNext = Math.floor((nextEnergyTime - now) / 1000);
          setTimeLeft(secondsUntilNext > 0 ? secondsUntilNext : secondsPerEnergy);
        }
      }

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('unit, level, score, completed')
        .eq('user_id', user.id)
        .eq('subject', subjectId);

      if (progressData) {
        const completedMap = {};
        const scoreMap = {};
        progressData.forEach(p => {
          if (p.completed) {
            completedMap[`${p.unit}-${p.level}`] = true;
          }
          if (p.score !== undefined && p.score !== null) {
            scoreMap[`${p.unit}-${p.level}`] = p.score;
          }
        });
        setCompletedLevels(completedMap);
        setLevelHighScores(scoreMap);
      }
    }

    syncUserData();
  }, [subjectId]);

  useEffect(() => {
    if (missionsLeft >= maxMissions || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setMissionsLeft(m => Math.min(m + 1, maxMissions));
          return 14400; 
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [missionsLeft, timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleUnit = (unitNum) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitNum]: !prev[unitNum]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '280dvh', padding: '5rem 2rem 6rem', alignItems: 'center', position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
      
      {/* HUD: ENERGY STATUS */}
      <div style={{
        position: 'fixed',
        top: '7px',
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--surface-border)',
        borderRadius: '30px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
          <span style={{ color: 'var(--accent-neon)', fontSize: '1.2rem' }}>⚡</span>
          <span>{missionsLeft}/{maxMissions}</span>
        </div>
        
        {missionsLeft < maxMissions && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Next Mission In</span>
            <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#fff' }}>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* BACK TO HOME BUTTON */}
      <div style={{ marginBottom: '1rem', marginTop: '1.5rem', width: '100%' }}>
        <Link href="/home" style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 20px',
          fontSize: '0.85rem',
          fontWeight: '700',
          color: '#fff',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--surface-border)',
          borderRadius: '20px',
          textDecoration: 'none',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          cursor: 'pointer'
        }}>
          ← Back to Base
        </Link>
      </div>

      {/* DYNAMIC HEADER */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center', marginTop: '1rem', width: '100%' }}>
        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.2rem', textTransform: 'uppercase' }}>
          Operation {currentSubjectInfo.opCode}
        </h3>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>
          {currentSubjectInfo.title}
        </h1>
      </div>

      {/* UNITS ACCORDION CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        {Array.from({ length: totalUnits }, (_, unitIndex) => {
          const unitNum = unitIndex + 1;
          const isExpanded = expandedUnits[unitNum];
          
          const unitDisplayText = ((subjectId === 'pre-algebra' || subjectId === 'prealgebra') && PREALGEBRA_UNIT_NAMES[unitNum])
            ? PREALGEBRA_UNIT_NAMES[unitNum]
            : (subjectId === 'algebra' && ALGEBRA_UNITS[unitNum])
            ? ALGEBRA_UNITS[unitNum]
            : ((subjectId === 'algebra2' || subjectId === 'algebra-2') && ALGEBRA2_UNITS[unitNum])
            ? ALGEBRA2_UNITS[unitNum]
            : `Unit ${unitNum}`;

          return (
            <div 
              key={unitNum}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--surface-border)',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              <div 
                onClick={() => toggleUnit(unitNum)}
                style={{
                  padding: '1.2rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--accent-neon)', fontWeight: '800' }}>0{unitNum}</span>
                  <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff' }}>{unitDisplayText}</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  ▼
                </span>
              </div>

              {isExpanded && (
                <div style={{ padding: '2rem 1rem', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    bottom: 0, 
                    left: '50%', 
                    width: '2px', 
                    background: 'repeating-linear-gradient(to bottom, var(--surface-border) 0, var(--surface-border) 10px, transparent 10px, transparent 20px)', 
                    zIndex: 0, 
                    transform: 'translateX(-50%)' 
                  }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', width: '100%', position: 'relative', zIndex: 1 }}>
                    {Array.from({ length: levelsPerUnit }, (_, levelIndex) => {
                      const levelNum = levelIndex + 1;
                      const alignRight = levelNum % 2 === 0;
                      const isCompleted = completedLevels[`${unitNum}-${levelNum}`];
                      const highScore = levelHighScores[`${unitNum}-${levelNum}`];

                      return (
                        <div 
                          key={levelNum}
                          onClick={() => {
                            if (missionsLeft > 0) {
                              router.push(`/play?subject=${subjectId}&unit=${unitNum}&level=${levelNum}`);
                            } else {
                              alert("Out of Energy! Wait for regeneration.");
                            }
                          }}
                          style={{
                            alignSelf: alignRight ? 'flex-end' : 'flex-start',
                            position: 'relative',
                            cursor: missionsLeft > 0 ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            transform: alignRight ? 'translateX(-20px)' : 'translateX(20px)',
                            opacity: missionsLeft > 0 ? 1 : 0.6
                          }}
                        >
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '1.1rem',
                            fontWeight: '800',
                            backgroundColor: isCompleted ? 'var(--accent-neon)' : 'rgba(255,255,255,0.05)',
                            color: isCompleted ? '#000' : '#fff',
                            border: isCompleted ? 'none' : '2px solid rgba(255,255,255,0.2)',
                            boxShadow: isCompleted ? '0 0 20px var(--accent-neon-glow)' : 'none',
                            transition: 'all 0.2s',
                          }}>
                            {levelNum}
                          </div>
                          
                          <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: '600', color: isCompleted ? 'var(--accent-neon)' : 'var(--text-muted)', letterSpacing: '1px', textAlign: 'center' }}>
                              {isCompleted ? 'COMPLETED' : `LEVEL ${levelNum}`}
                            </div>
                            {highScore !== undefined && (
                              <div style={{ fontSize: '0.65rem', fontWeight: '700', color: '#ffcc00', letterSpacing: '0.5px', textShadow: '0 0 6px rgba(255, 204, 0, 0.4)' }}>
                                🏆 {highScore} XP
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}