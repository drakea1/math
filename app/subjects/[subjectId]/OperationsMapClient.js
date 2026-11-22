'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../supabaseClient';
import Link from 'next/link';

// Expanded Subject Unit Dictionaries for all 11 subjects
const SUBJECT_DATA = {
  'addition': { 
    title: 'Addition Mastery',
    units: {
      1: "Warmup", 2: "Easy Start", 3: "Getting Warm", 4: "Steady Pace",
      5: "Intermediate", 6: "Stepping Up", 7: "Solid Practice", 8: "Getting Tougher",
      9: "Advanced", 10: "Heavy Numbers", 11: "Hard Push", 12: "Serious Math",
      13: "Expert Level", 14: "Intense Scaling", 15: "Mastery", 16: "Elite Tier",
      17: "Brain Burner", 18: "Near Peak", 19: "Almost Limit", 20: "Maxed Out"
    }
  },
  'subtraction': { 
    title: 'Subtraction Quest',
    units: {
      1: "Warmup", 2: "Easy Start", 3: "Getting Warm", 4: "Steady Pace",
      5: "Intermediate", 6: "Stepping Up", 7: "Solid Practice", 8: "Getting Tougher",
      9: "Advanced", 10: "Heavy Numbers", 11: "Hard Push", 12: "Serious Math",
      13: "Expert Level", 14: "Intense Scaling", 15: "Mastery", 16: "Elite Tier",
      17: "Brain Burner", 18: "Near Peak", 19: "Almost Limit", 20: "Maxed Out"
    }
  },
  'multiplication': { 
    title: 'Multiplication Scaling',
    units: {
      1: "Warmup", 2: "Easy Start", 3: "Getting Warm", 4: "Steady Pace",
      5: "Intermediate", 6: "Stepping Up", 7: "Solid Practice", 8: "Getting Tougher",
      9: "Advanced", 10: "Heavy Numbers", 11: "Hard Push", 12: "Serious Math",
      13: "Expert Level", 14: "Intense Scaling", 15: "Mastery", 16: "Elite Tier",
      17: "Brain Burner", 18: "Near Peak", 19: "Almost Limit", 20: "Maxed Out"
    }
  },
  'division': { 
    title: 'Division Splitting',
    units: {
      1: "Warmup", 2: "Easy Start", 3: "Getting Warm", 4: "Steady Pace",
      5: "Intermediate", 6: "Stepping Up", 7: "Solid Practice", 8: "Getting Tougher",
      9: "Advanced", 10: "Heavy Numbers", 11: "Hard Push", 12: "Serious Math",
      13: "Expert Level", 14: "Intense Scaling", 15: "Mastery", 16: "Elite Tier",
      17: "Brain Burner", 18: "Near Peak", 19: "Almost Limit", 20: "Maxed Out"
    }
  },
  'pre-algebra': { 
    title: 'Pre-Algebra Bridge',
    units: {
      1: "Integers, Absolute Value, and Rational Numbers",
      2: "Operations with Fractions and Mixed Numbers",
      3: "Ratios, Rates, and Unit Rates",
      4: "Proportions and Scale Drawings",
      5: "Percentages, Discounts, and Simple Interest",
      6: "Algebraic Expressions and Combining Like Terms",
      7: "Solving One-Step and Two-Step Equations",
      8: "Solving Multi-Step Equations and Inequalities",
      9: "Introduction to Coordinate Plane and Graphing",
      10: "Proportional Relationships and Slope",
      11: "Systems of Linear Equations (Introduction)",
      12: "Exponents and Order of Operations",
      13: "Laws of Exponents (Multiplication and Division rules)",
      14: "Scientific Notation and Operations",
      15: "Square Roots, Cube Roots, and Irrational Numbers",
      16: "Pythagorean Theorem and Distance Formula",
      17: "Rigid Transformations (Translations, Reflections, Rotations)",
      18: "Dilations and Geometric Similarity",
      19: "Perimeter, Area, and Volume of 3D Solids",
      20: "Data Displays, Statistics, and Probability Basics"
    }
  },
  'algebra': { 
    title: 'Algebra 1',
    units: {
      1: "Foundations of Algebra and Real Number Properties",
      2: "Expressions, Equations, and Inequalities (Review & Deep Dive)",
      3: "Multi-Step Linear Equations and Literal Equations",
      4: "Linear Inequalities in One and Two Variables",
      5: "Introduction to Functions, Domain, and Range",
      6: "Function Notation and Evaluating Functions",
      7: "Rate of Change and Slope-Intercept Form (y = mx + b)",
      8: "Writing Linear Equations from Points and Graphs",
      9: "Systems of Linear Equations (Graphing and Substitution)",
      10: "Systems of Linear Equations (Elimination and Applications)",
      11: "Introduction to Exponential Growth and Decay",
      12: "Properties of Exponents in Algebraic Expressions",
      13: "Introduction to Polynomials (Adding, Subtracting, Multiplying)",
      14: "Factoring Quadratic Expressions (GCF and Grouping)",
      15: "Factoring Quadratic Trinomials (ax² + bx + c)",
      16: "Graphing Quadratic Functions (Vertex form and transformations)",
      17: "Solving Quadratic Equations by Factoring and Square Roots",
      18: "Solving Quadratic Equations by Completing the Square and Quadratic Formula",
      19: "Radical Expressions and Simplifying Square Roots",
      20: "One-Variable and Two-Variable Statistics (Data analysis and scatter plots)"
    }
  },
  'algebra2': { 
    title: 'Algebra 2',
    units: {
      1: "Equations and Inequalities Review (Absolute value and compound inequalities)",
      2: "Linear Relations and Functions",
      3: "Systems of Linear Equations and Inequalities in Three Variables",
      4: "Matrices and Matrix Multiplication",
      5: "Determinants and Cramer's Rule",
      6: "Quadratic Functions and Complex Numbers (i)",
      7: "Polynomial Functions and Higher-Degree Graphs",
      8: "Polynomial Operations and Division (Synthetic and Long Division)",
      9: "Rational Exponents and Radical Functions",
      10: "Exponential Functions and Equations",
      11: "Logarithmic Functions and Properties of Logarithms",
      12: "Exponential and Logarithmic Equations",
      13: "Rational Expressions and Complex Fractions",
      14: "Solving Rational Equations and Applications",
      15: "Quadratic Relations and Conic Sections (Circles, Parabolas, Ellipses, Hyperbolas)",
      16: "Sequences and Series (Arithmetic and Geometric)",
      17: "Probability, Permutations, and Combinations",
      18: "Statistics and Normal Distributions",
      19: "Trigonometric Functions and the Unit Circle",
      20: "Graphing Sine, Cosine, and Tangent Functions"
    }
  },
  'geometry': {
    title: 'Geometry',
    units: {
      1: "Tools of Geometry (Points, Lines, Planes, and Segments)",
      2: "Angles, Angle Bisectors, and Perpendicular Lines",
      3: "Logic, Conditional Statements, and Deductive Reasoning",
      4: "Rigid Transformations in the Coordinate Plane",
      5: "Triangle Classification and Interior/Exterior Angle Theorems",
      6: "Triangle Congruence (SSS, SAS, ASA, AAS, HL)",
      7: "Proofs with Congruent Triangles",
      8: "Relationships in Triangles (Midsegments, Medians, and Altitudes)",
      9: "Properties of Polygons and Quadrilaterals",
      10: "Similarity Ratios, Proportions, and Dilations",
      11: "Proving Triangles Similar (AA, SSS, SAS)",
      12: "Right Triangles and the Pythagorean Theorem",
      13: "Special Right Triangles (45°-45°-90° and 30°-60°-90°)",
      14: "Introduction to Trigonometric Ratios (Sine, Cosine, Tangent)",
      15: "Circles (Radii, Chords, Arcs, and Central/Inscribed Angles)",
      16: "Tangents, Secants, and Angle Relationships in Circles",
      17: "Equation of a Circle and Coordinate Geometry Proofs",
      18: "Area of Polygons and Circles",
      19: "Three-Dimensional Solids (Surface Area of Prisms, Pyramids, Cones, Cylinders, Spheres)",
      20: "Volume Formulas and Applications of 3D Figures"
    }
  },
  'pre-calc': {
    title: 'Pre-Calculus',
    units: {
      1: "Advanced Functions and Domain/Range Analysis",
      2: "Transformations of Functions and Piecewise Functions",
      3: "Polynomial and Rational Functions (Asymptotes and End Behavior)",
      4: "Exponential and Logarithmic Modeling",
      5: "Right Triangle Trigonometry and Radian Measure",
      6: "The Unit Circle and Trigonometric Values",
      7: "Graphing Trigonometric Functions and Transformations",
      8: "Inverse Trigonometric Functions",
      9: "Trigonometric Identities and Verifications",
      10: "Sum, Difference, Double-Angle, and Half-Angle Formulas",
      11: "Solving Trigonometric Equations",
      12: "Law of Sines and Law of Cosines",
      13: "Vectors in Two Dimensions and Applications",
      14: "Systems of Nonlinear Equations and Inequalities",
      15: "Matrices, Inverses, and Matrix Transformations",
      16: "Parametric Equations and Graphing",
      17: "Polar Coordinates and Polar Graphs",
      18: "Sequences, Series, and Mathematical Induction",
      19: "Introduction to Limits and Continuity",
      20: "Introduction to Derivatives (Slope of a curve preview)"
    }
  },
  'statistics': {
    title: 'Statistics ',
    units: {
      1: "Categorical Data and Displaying Distributions (Bar charts, pie charts)",
      2: "Quantitative Data: Dot Plots, Stemplots, and Histograms",
      3: "Measuring Center (Mean, Median, Mode) and Spread (Variance, Standard Deviation)",
      4: "Normal Distributions and the Empirical Rule (68-95-99.7)",
      5: "Scatterplots and Correlation Coefficients (r)",
      6: "Least-Squares Regression Lines and Residuals",
      7: "Transformations to Achieve Linearity (Log and power transformations)",
      8: "Sampling Methods and Sources of Bias in Surveys",
      9: "Experimental Design (Control, Randomization, Replication, Blocking)",
      10: "Probability Rules (Complement, Addition, Multiplication)",
      11: "Conditional Probability and Independence",
      12: "Discrete Random Variables and Probability Distributions",
      13: "Binomial Probability Distributions",
      14: "Geometric Probability Distributions",
      15: "Sampling Distributions for Proportions",
      16: "Sampling Distributions for Means and Central Limit Theorem",
      17: "Confidence Intervals for a Single Proportion",
      18: "Confidence Intervals for a Single Mean",
      19: "Significance Testing (Hypothesis Testing) for Proportions",
      20: "Significance Testing (Hypothesis Testing) for Means, Chi-Square, and Slope"
    }
  },
  'calculus': {
    title: 'Calculus',
    units: {
      1: "Limits and Intuitive Notion of Limits",
      2: "Finding Limits Analytically (Algebraic simplification and squeeze theorem)",
      3: "Continuity, Intermediate Value Theorem, and Asymptotic Behavior",
      4: "Definition of the Derivative and Tangent Line Problems",
      5: "Basic Differentiation Rules (Power, Constant, Sum, Difference)",
      6: "Product, Quotient, and Chain Rules",
      7: "Implicit Differentiation and Inverse Trigonometric Derivatives",
      8: "Related Rates of Change",
      9: "Extrema on an Interval and Mean Value Theorem",
      10: "First and Second Derivative Tests for Graph Shape (Concavity and Inflection Points)",
      11: "Optimization Problems and Applied Maximum/Minimum",
      12: "Linear Approximation and L'Hôpital's Rule",
      13: "Riemann Sums and Definite Integrals",
      14: "The Fundamental Theorem of Calculus (Parts 1 and 2)",
      15: "Integration Rules and U-Substitution",
      16: "Integration by Parts and Advanced Integration Techniques (BC)",
      17: "Differential Equations and Slope Fields",
      18: "Applications of Integration (Area between curves, Volume by disks/washers/shells)",
      19: "Parametric, Polar, and Vector Calculus (BC)",
      20: "Infinite Sequences, Series, and Taylor/Maclaurin Polynomials (BC)"
    }
  }
};

export default function OperationsMapClient({ subjectId }) {
  const router = useRouter();
  
  const rawSubjectKey = subjectId?.toLowerCase() || 'addition';
const normalizedSubjectKey = rawSubjectKey.replace(/[^a-z0-9]/g, '');

const lookupKey = 
    normalizedSubjectKey === 'prealgebra' ? 'pre-algebra' :
    normalizedSubjectKey === 'precalc' ? 'pre-calc' :
    normalizedSubjectKey;

  const currentSubjectInfo = SUBJECT_DATA[lookupKey] || { 
    title: 'Math Mastery', 
    units: {}
  };

  const maxMissions = 10; 
  const [missionsLeft, setMissionsLeft] = useState(10); 
  const [isPro, setIsPro] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); 
  const [lastEnergyUpdate, setLastEnergyUpdate] = useState(null); 
  const [showEnergyModal, setShowEnergyModal] = useState(false); 
  const [mounted, setMounted] = useState(false);

  const [completedLevels, setCompletedLevels] = useState({});
  const [levelHighScores, setLevelHighScores] = useState({});
  const [expandedUnits, setExpandedUnits] = useState({ 1: true });

  const totalUnits = 20;
  const levelsPerUnit = 20;
  const secondsPerEnergy = 7200;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function syncUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('energy, last_energy_update, is_pro')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        const proStatus = !!profile.is_pro;
        setIsPro(proStatus);

        if (proStatus) {
          setMissionsLeft('∞');
        } else {
          const now = new Date();
          const lastUpdate = new Date(profile.last_energy_update || now);
          setLastEnergyUpdate(lastUpdate);
          const secondsPassed = Math.floor((now - lastUpdate) / 1000);
          
          const energyEarned = Math.floor(secondsPassed / secondsPerEnergy);
          let currentEnergy = profile.energy ?? maxMissions;
          let nextUpdate = lastUpdate;

          if (energyEarned > 0 && currentEnergy < maxMissions) {
            currentEnergy = Math.min(currentEnergy + energyEarned, maxMissions);
            const leftoverSeconds = secondsPassed % secondsPerEnergy;
            nextUpdate = new Date(now.getTime() - (leftoverSeconds * 1000));
            setLastEnergyUpdate(nextUpdate);

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
      } else {
        setMissionsLeft(maxMissions);
      }

      const { data: progressData } = await supabase
        .from('user_progress')
        .select('unit, level, score, completed')
        .eq('user_id', user.id)
        .eq('subject', normalizedSubjectKey);

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
  }, [normalizedSubjectKey]);

  useEffect(() => {
    if (isPro || missionsLeft >= maxMissions || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setMissionsLeft(m => {
            const nextVal = typeof m === 'number' ? Math.min(m + 1, maxMissions) : m;
            if (nextVal === maxMissions) {
              setLastEnergyUpdate(new Date());
            }
            return nextVal;
          });
          return secondsPerEnergy; 
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [missionsLeft, timeLeft, isPro]);

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

  const handleLevelClick = async (unitNum, levelNum) => {
    if (isPro) {
      router.push(`/play?subject=${normalizedSubjectKey}&unit=${unitNum}&level=${levelNum}`);
      return;
    }

    if (missionsLeft <= 0) {
      setShowEnergyModal(true); 
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newEnergy = Math.max(0, missionsLeft - 1);
    setMissionsLeft(newEnergy);

    let updateTimestamp = lastEnergyUpdate;
    if (!updateTimestamp || missionsLeft === maxMissions) {
      updateTimestamp = new Date();
      setLastEnergyUpdate(updateTimestamp);
    }

    await supabase
      .from('profiles')
      .update({ 
        energy: newEnergy, 
        last_energy_update: updateTimestamp.toISOString() 
      })
      .eq('id', user.id);

    router.push(`/play?subject=${normalizedSubjectKey}&unit=${unitNum}&level=${levelNum}`);
  };

  const modalContent = showEnergyModal && mounted ? createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999999
    }}>
      <div style={{
        background: 'var(--bg-card, #141414)',
        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
        borderRadius: '28px',
        padding: '2.5rem 2rem',
        width: '90%',
        maxWidth: '420px',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1.2rem',
        color: 'var(--text-main, #ffffff)'
      }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '20px', 
          background: 'rgba(24, 163, 0, 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '1.8rem',
          border: '1px solid rgba(24, 163, 0, 0.2)'
        }}>
          ⚡
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Energy Depleted
          </h3>
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-muted, #9a9a9a)', lineHeight: '1.5' }}>
            You've used all your active missions. Wait for the regeneration cycle or unlock Pro for unlimited access.
          </p>
        </div>
        <button
          onClick={() => setShowEnergyModal(false)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #18a300 0%, #128200 100%)',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '0.95rem',
            cursor: 'pointer',
            marginTop: '0.75rem',
            boxShadow: '0 8px 20px rgba(24, 163, 0, 0.35)'
          }}
        >
          Got It
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', padding: '2.5rem 2rem 6rem', alignItems: 'center', position: 'relative', maxWidth: '920px', width: '100%', margin: '0 auto', color: 'var(--text-main)' }}>
      
      {modalContent}

      {/* TOP NAVIGATION / ENERGY HUD */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Link href="/home" style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 22px',
          fontSize: '0.82rem',
          fontWeight: '700',
          color: 'var(--text-main)',
          background: 'var(--bg-card, rgba(128, 128, 128, 0.08))',
          border: '1px solid var(--border-color, rgba(128, 128, 128, 0.2))',
          borderRadius: '16px',
          textDecoration: 'none',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          cursor: 'pointer'
        }}>
          ← Back to Home
        </Link>

        <div style={{
          background: 'var(--bg-card, rgba(128, 128, 128, 0.08))',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--border-color, rgba(128, 128, 128, 0.2))',
          borderRadius: '24px',
          padding: '8px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '1.2rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: '700' }}>
            <span style={{ color: '#18a300', fontSize: '1.1rem', filter: 'drop-shadow(0 0 8px rgba(24,163,0,0.4))' }}>⚡</span>
            <span style={{ fontSize: '0.95rem' }}>
              {isPro ? <strong style={{ color: '#18a300' }}>∞</strong> : `${missionsLeft}/${maxMissions}`}
            </span>
          </div>
          
          {!isPro && missionsLeft < maxMissions && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>Next In</span>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: '600' }}>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      {/* HEADER */}
      <div style={{ marginBottom: '3rem', textAlign: 'center', width: '100%' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#18a300', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Curriculum Stream
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
          {currentSubjectInfo.title}
        </h1>
      </div>

      {/* UNITS ACCORDION CONTAINER */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
        {Array.from({ length: totalUnits }, (_, unitIndex) => {
          const unitNum = unitIndex + 1;
          const isExpanded = expandedUnits[unitNum];
          
          const unitDisplayText = currentSubjectInfo.units[unitNum] || `Unit ${unitNum}`;

          let completedCount = 0;
          for (let l = 1; l <= levelsPerUnit; l++) {
            if (completedLevels[`${unitNum}-${l}`]) completedCount++;
          }
          const unitPercent = Math.round((completedCount / levelsPerUnit) * 100);

          return (
            <div 
              key={unitNum}
              className="subject-card"
              style={{
                background: 'var(--bg-card, rgba(128, 128, 128, 0.05))',
                border: '1px solid var(--border-color, rgba(128, 128, 128, 0.2))',
                borderRadius: '24px',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'block',
                width: '100%',
                boxShadow: isExpanded ? '0 12px 40px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <div 
                onClick={() => toggleUnit(unitNum)}
                style={{
                  padding: '1.4rem 1.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? 'var(--bg-hover, rgba(128, 128, 128, 0.08))' : 'transparent',
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                  <span style={{ color: '#18a300', fontWeight: '800', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                    {unitNum < 10 ? `0${unitNum}` : unitNum}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                    <span style={{ fontWeight: '700', fontSize: '1.02rem', color: 'var(--text-main)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {unitDisplayText}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {completedCount} / {levelsPerUnit} Levels Completed ({unitPercent}%)
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Progress Pill Track */}
                  <div style={{
                    width: '44px',
                    height: '6px',
                    background: 'rgba(128, 128, 128, 0.2)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    display: 'flex'
                  }}>
                    <div style={{
                      width: `${unitPercent}%`,
                      background: '#18a300',
                      height: '100%',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)', fontWeight: '700' }}>
                    ▼
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '2rem 1rem 1.5rem', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  
                  {/* TRAIL CONNECTOR LINE */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    bottom: 0, 
                    left: '50%', 
                    width: '3px', 
                    background: 'linear-gradient(to bottom, rgba(24, 163, 0, 0.2), rgba(24, 163, 0, 0.5), rgba(24, 163, 0, 0.2))', 
                    zIndex: 0, 
                    transform: 'translateX(-50%)',
                    borderRadius: '4px'
                  }} />

                  {/* WINDING TRAIL LAYOUT */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%', position: 'relative', zIndex: 1 }}>
                    {Array.from({ length: levelsPerUnit }, (_, levelIndex) => {
                      const levelNum = levelIndex + 1;
                      const alignRight = levelNum % 2 === 0;
                      const isCompleted = completedLevels[`${unitNum}-${levelNum}`];
                      const highScore = levelHighScores[`${unitNum}-${levelNum}`];

                      return (
                        <div 
                          key={levelNum}
                          onClick={() => handleLevelClick(unitNum, levelNum)}
                          style={{
                            alignSelf: alignRight ? 'flex-end' : 'flex-start',
                            position: 'relative',
                            cursor: (isPro || missionsLeft > 0) ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            transform: alignRight ? 'translateX(-45px)' : 'translateX(45px)',
                            opacity: (isPro || missionsLeft > 0) ? 1 : 0.55,
                            transition: 'transform 0.2s ease, opacity 0.2s ease'
                          }}
                        >
                          <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '1.05rem',
                            fontWeight: '800',
                            backgroundColor: isCompleted ? '#18a300' : 'var(--bg-card, rgba(128, 128, 128, 0.1))',
                            color: isCompleted ? '#ffffff' : 'var(--text-main)',
                            border: isCompleted ? 'none' : '2px solid var(--border-color, rgba(128, 128, 128, 0.3))',
                            boxShadow: isCompleted ? '0 0 20px rgba(24, 163, 0, 0.4)' : '0 4px 12px rgba(0,0,0,0.08)',
                            transition: 'all 0.2s ease',
                          }}>
                            {levelNum}
                          </div>
                          
                          <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
                            <div style={{ fontSize: '0.62rem', fontWeight: '800', color: isCompleted ? '#18a300' : 'var(--text-muted)', letterSpacing: '0.06em', textAlign: 'center' }}>
                              {isCompleted ? 'COMPLETED' : `LVL ${levelNum}`}
                            </div>
                            {highScore !== undefined && (
                              <div style={{ fontSize: '0.6rem', fontWeight: '700', color: '#d39e00', letterSpacing: '0.04em' }}>
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