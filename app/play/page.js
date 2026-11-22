'use client';
import { generateProblem as getFreshProblem } from '../../utils/mathGenerator';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../supabaseClient';

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const rawSubject = searchParams.get('subject') || 'addition';
  const subject = rawSubject.toLowerCase().replace(/[^a-z0-9]/g, ''); 
  const mission = parseInt(searchParams.get('mission')) || 1;
  const unit = parseInt(searchParams.get('unit')) || 1;
  const level = parseInt(searchParams.get('level')) || mission;

  const [showAbortModal, setShowAbortModal] = useState(false);

  // --- GAME STATE ---
  const [levelQuestions, setLevelQuestions] = useState([]);
  const [count, setCount] = useState(1); 
  const totalProblemsPerLevel = 10; 
  const [score, setScore] = useState(0); 
  const [finished, setFinished] = useState(false);

  // --- FEEDBACK STATES (Multiple Choice & Fill-in-the-blank) ---
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [textInputVal, setTextInputVal] = useState('');

  // --- MATCHING CARDS STATE (per-question XP tracking) ---
  const [matchingSelectedLeft, setMatchingSelectedLeft] = useState(null);
  const [matchingSelectedRight, setMatchingSelectedRight] = useState(null);
  const [matchingPairsMatched, setMatchingPairsMatched] = useState([]);
  const [matchingWrongPair, setMatchingWrongPair] = useState(false);
  const [matchingStrikes, setMatchingStrikes] = useState(0);
  const [matchingPenaltyNotice, setMatchingPenaltyNotice] = useState(null);

  // --- BUILD LEVEL SESSION (10 Randomized Mixed Questions with Level Scaling) ---
  useEffect(() => {
    let rawTypesPool = [
      'multiple-choice',
      'multiple-choice',
      'multiple-choice',
      'multiple-choice',
      'multiple-choice',
      'matching',
      'matching',
      'matching',
      'fill-in-the-blank',
      'fill-in-the-blank'
    ];

    const randomizedTypes = shuffleArray(rawTypesPool);

    let questionsArray = [];
    for (let i = 0; i < totalProblemsPerLevel; i++) {
      let type = randomizedTypes[i];
      const globalProblemIndex = level * 20 + i;

      if (type === 'multiple-choice') {
        const prob = getFreshProblem(subject, unit, level, globalProblemIndex);
        questionsArray.push({
          type: 'multiple-choice',
          question: prob.question,
          correctAnswer: String(prob.correctAnswer),
          choices: prob.choices || [prob.correctAnswer, '1', '2', '3'], // Fallback safety
          svg: prob.svg || null
        });
      } 
      else if (type === 'matching') {
        const p1 = getFreshProblem(subject, unit, level, globalProblemIndex * 3);
        const p2 = getFreshProblem(subject, unit, level, globalProblemIndex * 3 + 1);
        const p3 = getFreshProblem(subject, unit, level, globalProblemIndex * 3 + 2);

        const leftItems = shuffleArray([
          { id: 1, text: p1.question, answer: String(p1.correctAnswer) },
          { id: 2, text: p2.question, answer: String(p2.correctAnswer) },
          { id: 3, text: p3.question, answer: String(p3.correctAnswer) }
        ]);

        const rightItems = shuffleArray([
          { id: 1, text: String(p1.correctAnswer), answer: String(p1.correctAnswer) },
          { id: 2, text: String(p2.correctAnswer), answer: String(p2.correctAnswer) },
          { id: 3, text: String(p3.correctAnswer), answer: String(p3.correctAnswer) }
        ]);

        questionsArray.push({
          type: 'matching',
          leftItems,
          rightItems,
          totalPairs: 3
        });
      } 
      else if (type === 'fill-in-the-blank') {
        const prob = getFreshProblem(subject, unit, level, globalProblemIndex);
        questionsArray.push({
          type: 'fill-in-the-blank',
          question: prob.question,
          correctAnswer: String(prob.correctAnswer),
          svg: prob.svg || null
        });
      }
    }

    setLevelQuestions(questionsArray);
    setCount(1);
    setScore(0);
    setFinished(false);
  }, [subject, unit, level]);

  // Reset interactive sub-states on question node change
  useEffect(() => {
    setHasAnswered(false);
    setIsCorrect(false);
    setSelectedAnswer(null);
    setTextInputVal('');
    setMatchingSelectedLeft(null);
    setMatchingSelectedRight(null);
    setMatchingPairsMatched([]);
    setMatchingWrongPair(false);
    setMatchingStrikes(0);
    setMatchingPenaltyNotice(null);
  }, [count]);

  // --- SAVE PROGRESS TO SUPABASE ---
  useEffect(() => {
    async function saveXP() {
      if (finished) {
        const finalScore = Math.max(0, score);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('xp')
          .eq('id', user.id)
          .single();

        const newTotalXP = (profile?.xp || 0) + finalScore;

        await supabase
          .from('profiles')
          .update({ xp: newTotalXP })
          .eq('id', user.id);

        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            subject: subject,
            unit: parseInt(unit),
            level: parseInt(level),
            completed: true,
            score: finalScore,
            updated_at: new Date()
          }, {
            onConflict: 'user_id,subject,unit,level'
          });
      }
    }
    saveXP();
  }, [finished, score, subject, unit, level]);

  const currentQuestion = levelQuestions[count - 1];

  // Robust answer comparison helper (handles strings, numbers, fractions, and boolean "0"/"1" flags cleanly)
  const isAnswerMatching = (userVal, correctVal) => {
    if (userVal === null || userVal === undefined || correctVal === null || correctVal === undefined) return false;
    const uStr = String(userVal).trim();
    const cStr = String(correctVal).trim();

    if (uStr === cStr) return true;

    const parseNum = (str) => {
      if (str.includes('/')) {
        const parts = str.split('/');
        if (parts.length === 2 && parseFloat(parts[1]) !== 0) {
          return parseFloat(parts[0]) / parseFloat(parts[1]);
        }
      }
      return parseFloat(str);
    };

    const uNum = parseNum(uStr);
    const cNum = parseNum(cStr);

    if (!isNaN(uNum) && !isNaN(cNum)) {
      return Math.abs(uNum - cNum) < 0.0001;
    }

    return false;
  };

  // Helper to convert decimals back to clean fraction strings if appropriate
  const toFraction = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val).trim();
    if (str.includes('/')) return str; 

    const num = parseFloat(val);
    if (isNaN(num)) return str;
    if (Number.isInteger(num)) return String(num);

    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const precision = 10000;
    const numerator = Math.round(num * precision);
    const denominator = precision;
    const common = Math.abs(gcd(numerator, denominator));

    const simplifiedNum = numerator / common;
    const simplifiedDen = denominator / common;

    if (simplifiedDen <= 20) {
      return `${simplifiedNum}/${simplifiedDen}`;
    }
    return String(num);
  };

  const handleAnswerSubmit = (choice) => {
    if (hasAnswered || finished || !currentQuestion) return;

    setSelectedAnswer(choice);
    setHasAnswered(true);

    if (isAnswerMatching(choice, currentQuestion.correctAnswer)) {
      setIsCorrect(true);
      setScore((s) => s + 10);
    } else {
      setIsCorrect(false);
    }
  };

  const handleFillInSubmit = (e) => {
    e.preventDefault();
    if (hasAnswered || finished || !currentQuestion) return;

    const trimmedInput = textInputVal.trim();
    setSelectedAnswer(trimmedInput);
    setHasAnswered(true);

    if (isAnswerMatching(trimmedInput, currentQuestion.correctAnswer)) {
      setIsCorrect(true);
      setScore((s) => s + 10);
    } else {
      setIsCorrect(false);
    }
  };

  const processMatchingAttempt = (leftItem, rightItem) => {
    if (isAnswerMatching(leftItem.answer, rightItem.answer)) {
      const newMatched = [...matchingPairsMatched, leftItem.id];
      setMatchingPairsMatched(newMatched);
      setMatchingSelectedLeft(null);
      setMatchingSelectedRight(null);
      setMatchingPenaltyNotice(null);

      if (newMatched.length === currentQuestion.totalPairs) {
        setHasAnswered(true);
        setIsCorrect(true);

        let questionXP = 10;
        if (matchingStrikes === 1) questionXP = 7;
        else if (matchingStrikes === 2) questionXP = 4;
        
        setScore((s) => s + questionXP);
      }
    } else {
      const nextStrikes = matchingStrikes + 1;
      setMatchingStrikes(nextStrikes);
      setMatchingWrongPair(true);

      if (nextStrikes === 1) {
        setMatchingPenaltyNotice('Incorrect match! -3 XP penalty for this question.');
      } else if (nextStrikes === 2) {
        setMatchingPenaltyNotice('Incorrect match again! -6 XP cumulative penalty for this question.');
      } else if (nextStrikes >= 3) {
        setMatchingPenaltyNotice('3 strikes! 0 XP awarded for this question. Revealing answers.');
        setHasAnswered(true);
        setIsCorrect(false);
      }

      setTimeout(() => {
        setMatchingSelectedLeft(null);
        setMatchingSelectedRight(null);
        setMatchingWrongPair(false);
      }, 500);
    }
  };

  const handleMatchingSelectLeft = (item) => {
    if (hasAnswered || matchingPairsMatched.includes(item.id)) return;
    setMatchingSelectedLeft(item);
    setMatchingWrongPair(false);
    setMatchingPenaltyNotice(null);

    if (matchingSelectedRight) {
      processMatchingAttempt(item, matchingSelectedRight);
    }
  };

  const handleMatchingSelectRight = (item) => {
    if (hasAnswered || matchingPairsMatched.includes(item.id)) return;
    setMatchingSelectedRight(item);
    setMatchingWrongPair(false);
    setMatchingPenaltyNotice(null);

    if (matchingSelectedLeft) {
      processMatchingAttempt(matchingSelectedLeft, item);
    }
  };

  const handleNextQuestion = () => {
    if (count < totalProblemsPerLevel) {
      setCount((c) => c + 1); 
    } else {
      setFinished(true);
    }
  };

  const getMapRoute = () => {
    if (subject === 'algebra2' || subject === 'algebra-2') return '/subjects/algebra-2';
    if (subject === 'prealgebra' || subject === 'pre-algebra') return '/subjects/pre-algebra';
    if (subject === 'precalc' || subject === 'pre-calc') return '/subjects/pre-calc';
    return `/subjects/${subject}`;
  };

  const progressPercent = ((count - 1) / totalProblemsPerLevel) * 100;

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // --- UI RENDER: END SCREEN ---
  if (finished) {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div style={{ padding: '3rem 2rem', background: 'var(--surface-glass)', border: '1px solid var(--surface-border)', borderRadius: '32px', textAlign: 'center', maxWidth: '440px', width: '100%', backdropFilter: 'blur(10px)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>+{score} XP</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem', fontWeight: '500' }}>Complete: Level Clear</p>
          <button 
            onClick={() => router.push(getMapRoute())} 
            style={{ width: '100%', padding: '1.2rem', borderRadius: '20px', background: 'var(--accent-neon)', border: 'none', fontWeight: '800', color: '#000', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 8px 25px var(--accent-neon-glow)' }}
          >
            Return to Map
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '2px' }}>INITIALIZING PROTOCOL...</div>;
  }

  return (
    <div style={{ width: '100%', maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 5rem 1rem', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
      
      {/* TOP CONTROLS HUD */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setShowAbortModal(true)}
          style={{
            background: 'rgba(0, 0, 0, 0.03)',
            border: '1px solid var(--surface-border)',
            borderRadius: '14px',
            color: 'var(--text-muted)',
            padding: '0.6rem 1.2rem',
            fontSize: '0.8rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          ← Abort
        </button>

        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: '900' }}>
            {subject === 'algebra2' || subject === 'algebra-2' ? 'ALGEBRA 2' : subject.toUpperCase()}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '600', marginTop: '0.1rem' }}>
            UNIT {unit} • LEVEL {level} • QUESTION {count}/{totalProblemsPerLevel}
          </div>
        </div>
      </div>

      {/* PROGRESS MATRIX BAR */}
      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', marginBottom: '2.5rem', overflow: 'hidden', border: '1px solid var(--surface-border)' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--accent-neon)', transition: 'width 0.4s ease' }} />
      </div>

      {/* QUESTION FORMAT 1: MULTIPLE CHOICE */}
      {currentQuestion.type === 'multiple-choice' && (
        <>
          <div style={{ 
            background: 'var(--surface-glass)',
            border: '1px solid var(--surface-border)',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
            backdropFilter: 'blur(10px)',
            marginBottom: '1.5rem',
            boxSizing: 'border-box'
          }}>
            <div style={{ 
              fontSize: currentQuestion.question.length > 50 ? '1.4rem' : '1.9rem', 
              fontWeight: '800', 
              lineHeight: '1.45',
              color: 'var(--text-main)'
            }}>
              {currentQuestion.question}
            </div>

            {/* Render SVG Graph if present */}
            {currentQuestion.svg && (
              <div 
                style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}
                dangerouslySetInnerHTML={{ __html: currentQuestion.svg }} 
              />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', marginBottom: '1.5rem' }}>
            {(currentQuestion.choices || []).map((choice, i) => {
              let btnBorder = 'var(--surface-border)';
              let btnBg = 'rgba(0, 0, 0, 0.03)';
              let btnColor = 'var(--text-main)';
              
              if (hasAnswered) {
                if (isAnswerMatching(choice, currentQuestion.correctAnswer)) {
                  btnBorder = 'var(--accent-neon)'; 
                  btnBg = 'rgba(56, 255, 20, 0.12)';
                  btnColor = 'var(--text-main)';
                } else if (isAnswerMatching(choice, selectedAnswer)) {
                  btnBorder = 'var(--error-soft)'; 
                  btnBg = 'rgba(255, 59, 48, 0.08)';
                  btnColor = 'var(--error-soft)';
                } else {
                  btnBg = 'rgba(0,0,0,0.01)'; 
                  btnColor = 'var(--text-muted)';
                  btnBorder = 'rgba(0,0,0,0.03)';
                }
              }

              return (
                <button 
                  key={i} 
                  disabled={hasAnswered}
                  onClick={() => handleAnswerSubmit(choice)}
                  style={{
                    padding: '1.2rem 1rem',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    background: btnBg,
                    border: `1px solid ${btnBorder}`,
                    borderRadius: '20px',
                    color: btnColor,
                    cursor: hasAnswered ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* QUESTION FORMAT 2: MATCHING CARDS MINI-GAME */}
      {currentQuestion.type === 'matching' && (
        <div style={{ width: '100%', marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 0.3rem 0', color: 'var(--text-main)' }}>MATCHING CARDS</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, fontWeight: '700' }}>
              Matched: {matchingPairsMatched.length}/{currentQuestion.totalPairs} | Strikes: {matchingStrikes}/3
            </p>
            {matchingPenaltyNotice && (
              <div style={{ color: 'var(--error-soft)', fontWeight: '700', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                {matchingPenaltyNotice}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%' }}>
            {/* Left Column (Questions) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>EXPRESSIONS</div>
              {currentQuestion.leftItems.map((item) => {
                const isMatched = matchingPairsMatched.includes(item.id);
                const isSelected = matchingSelectedLeft?.id === item.id;
                
                let bg = 'rgba(0,0,0,0.02)';
                let border = 'var(--text-main)';
                let color = 'var(--text-main)';

                if (hasAnswered || isMatched) {
                  bg = 'rgba(56, 255, 20, 0.08)';
                  border = 'var(--accent-neon)';
                  color = 'var(--text-main)';
                } else if (isSelected) {
                  bg = 'rgba(56, 255, 20, 0.12)';
                  border = 'var(--accent-neon)';
                }

                return (
                  <button
                    key={item.id}
                    disabled={isMatched || hasAnswered}
                    onClick={() => handleMatchingSelectLeft(item)}
                    style={{
                      padding: '1.2rem 1rem',
                      background: bg,
                      border: `2px solid ${border}`,
                      borderRadius: '14px',
                      color: color,
                      fontSize: '1.1rem',
                      fontWeight: '800',
                      cursor: isMatched || hasAnswered ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isMatched && !hasAnswered ? 0.4 : 1
                    }}
                  >
                    {item.text}
                    {hasAnswered && <div style={{ fontSize: '0.75rem', color: 'var(--accent-neon)', marginTop: '4px' }}>→ {toFraction(item.answer)}</div>}
                  </button>
                );
              })}
            </div>

            {/* Right Column (Answers) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>VALUES</div>
              {currentQuestion.rightItems.map((item) => {
                const isMatched = matchingPairsMatched.includes(item.id);
                const isSelected = matchingSelectedRight?.id === item.id;
                
                let bg = 'rgba(0,0,0,0.02)';
                let border = 'var(--text-main)';
                let color = 'var(--text-main)';

                if (hasAnswered || isMatched) {
                  bg = 'rgba(56, 255, 20, 0.08)';
                  border = 'var(--accent-neon)';
                  color = 'var(--text-main)';
                } else if (isSelected) {
                  bg = 'rgba(56, 255, 20, 0.12)';
                  border = 'var(--accent-neon)';
                } else if (matchingWrongPair) {
                  border = 'var(--error-soft)';
                }

                return (
                  <button
                    key={item.id}
                    disabled={isMatched || hasAnswered}
                    onClick={() => handleMatchingSelectRight(item)}
                    style={{
                      padding: '1.2rem 1rem',
                      background: bg,
                      border: `2px solid ${border}`,
                      borderRadius: '14px',
                      color: color,
                      fontSize: '1.1rem',
                      fontWeight: '800',
                      cursor: isMatched || hasAnswered ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isMatched && !hasAnswered ? 0.4 : 1
                    }}
                  >
                    {toFraction(item.text)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* QUESTION FORMAT 3: FILL-IN-THE-BLANK */}
      {currentQuestion.type === 'fill-in-the-blank' && (
        <div style={{ width: '100%', marginBottom: '2rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0,0,0,0.02), rgba(0,0,0,0.005))',
            border: '1px solid var(--text-main)',
            borderRadius: '30px',
            padding: '2.5rem 2rem',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            marginBottom: '2rem',
            boxSizing: 'border-box'
          }}>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '800', 
              lineHeight: '1.45',
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
              marginBottom: '1.5rem'
            }}>
              {currentQuestion.question} = ?
            </div>

            {/* Render SVG Graph if present */}
            {currentQuestion.svg && (
              <div 
                style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}
                dangerouslySetInnerHTML={{ __html: currentQuestion.svg }} 
              />
            )}

            <form onSubmit={handleFillInSubmit} style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <input 
                  type="text"
                  disabled={hasAnswered}
                  value={textInputVal}
                  onChange={(e) => setTextInputVal(e.target.value)}
                  placeholder="Enter value..."
                  autoFocus
                  style={{
                    padding: '0.9rem 2.8rem 0.9rem 1.2rem',
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    background: 'rgba(0,0,0,0.03)',
                    border: hasAnswered 
                      ? `2px solid ${isCorrect ? 'var(--accent-neon)' : 'var(--error-soft)'}` 
                      : '2px solid var(--text-main)',
                    borderRadius: '14px',
                    color: 'var(--text-main)',
                    outline: 'none',
                    width: '240px',
                    textAlign: 'center',
                    boxShadow: hasAnswered ? (isCorrect ? '0 0 15px rgba(56,255,20,0.2)' : '0 0 15px rgba(255,59,48,0.2)') : 'none',
                    transition: 'all 0.2s'
                  }}
                />
                {hasAnswered && (
                  <span style={{
                    position: 'absolute',
                    right: '14px',
                    fontSize: '1.3rem',
                    fontWeight: '900',
                    color: isCorrect ? 'var(--accent-neon)' : 'var(--error-soft)',
                    textShadow: isCorrect ? '0 0 8px rgba(56,255,20,0.3)' : '0 0 8px rgba(255,59,48,0.3)'
                  }}>
                    {isCorrect ? '✓' : '✕'}
                  </span>
                )}
              </div>
              <button 
                type="submit"
                disabled={hasAnswered || !textInputVal.trim()}
                style={{
                  padding: '0.9rem 1.4rem',
                  background: 'var(--accent-neon)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '14px',
                  fontWeight: '900',
                  cursor: 'pointer',
                  boxShadow: '0 0 10px var(--accent-neon-glow)'
                }}
              >
                Verify
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM FEEDBACK INTERACTION HUD */}
      <div style={{ width: '100%', maxWidth: '640px', minHeight: '110px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {hasAnswered && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', animation: 'fadeIn 0.2s ease-out' }}>
            
            {!isCorrect && currentQuestion.type !== 'matching' && (
              <div style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                CORRECT TARGET: <span style={{ color: 'var(--text-main)', fontWeight: '800' }}>{toFraction(currentQuestion.correctAnswer)}</span>
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              style={{
                width: '100%',
                padding: '1.1rem',
                borderRadius: '16px',
                background: isCorrect ? 'var(--accent-neon)' : '#000',
                color: isCorrect ? '#000' : '#fff',
                fontWeight: '900',
                border: isCorrect ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '1.05rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: isCorrect ? '0 0 20px var(--accent-neon-glow)' : '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.15s'
              }}
            >
              {count === totalProblemsPerLevel ? 'Compile Results' : 'Next Level →'}
            </button>
          </div>
        )}
      </div>

      {/* --- ABORT MODAL --- */}
      {showAbortModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1.5rem',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: 'var(--app-bg-dark, #ffffff)',
            border: '2px solid var(--surface-border)',
            borderRadius: '28px',
            padding: '2.5rem 2rem',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
            boxSizing: 'border-box'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--error-soft)' }}>⚠️</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Abort Level?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 2rem 0', fontWeight: '500' }}>
              Terminating the level now will erase all active scores and clear your current level progress.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setShowAbortModal(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '14px',
                  background: 'rgba(0,0,0,0.03)',
                  border: '1px solid var(--surface-border)',
                  color: 'var(--text-main)',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Resume
              </button>
              <button 
                onClick={() => router.push(getMapRoute())}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '14px',
                  background: 'var(--error-soft)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(255, 59, 48, 0.3)'
                }}
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', minHeight: '100vh', width: '100vw', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', backgroundColor: 'var(--app-bg-dark, #ffffff)', fontSize: '1.2rem', fontWeight: '700', letterSpacing: '2px' }}>LOADING...</div>}>
      <PlayContent />
    </Suspense>
  );
}