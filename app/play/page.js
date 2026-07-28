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

  // --- BUILD LEVEL SESSION (10 Randomized Mixed Questions with unique item indexing) ---
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

      if (type === 'multiple-choice') {
        const prob = getFreshProblem(subject, unit, level, i);
        questionsArray.push({
          type: 'multiple-choice',
          question: prob.question,
          correctAnswer: prob.correctAnswer,
          choices: prob.choices
        });
      } 
      else if (type === 'matching') {
        const p1 = getFreshProblem(subject, unit, level, i * 3);
        const p2 = getFreshProblem(subject, unit, level, i * 3 + 1);
        const p3 = getFreshProblem(subject, unit, level, i * 3 + 2);

        const leftItems = shuffleArray([
          { id: 1, text: p1.question, answer: p1.correctAnswer },
          { id: 2, text: p2.question, answer: p2.correctAnswer },
          { id: 3, text: p3.question, answer: p3.correctAnswer }
        ]);

        const rightItems = shuffleArray([
          { id: 1, text: String(p1.correctAnswer), answer: p1.correctAnswer },
          { id: 2, text: String(p2.correctAnswer), answer: p2.correctAnswer },
          { id: 3, text: String(p3.correctAnswer), answer: p3.correctAnswer }
        ]);

        questionsArray.push({
          type: 'matching',
          leftItems,
          rightItems,
          totalPairs: 3
        });
      } 
      else if (type === 'fill-in-the-blank') {
        const prob = getFreshProblem(subject, unit, level, i);
        questionsArray.push({
          type: 'fill-in-the-blank',
          question: prob.question,
          correctAnswer: prob.correctAnswer
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

  const handleAnswerSubmit = (choice) => {
    if (hasAnswered || finished || !currentQuestion) return;

    setSelectedAnswer(choice);
    setHasAnswered(true);

    if (String(choice).trim() === String(currentQuestion.correctAnswer).trim()) {
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

    if (String(trimmedInput).toLowerCase() === String(currentQuestion.correctAnswer).toLowerCase()) {
      setIsCorrect(true);
      setScore((s) => s + 10);
    } else {
      setIsCorrect(false);
    }
  };

  const processMatchingAttempt = (leftItem, rightItem) => {
    if (String(leftItem.answer).trim() === String(rightItem.answer).trim()) {
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
    if (subject === 'algebra2') return '/subjects/algebra-2';
    return `/subjects/${subject}`;
  };

  const progressPercent = ((count - 1) / totalProblemsPerLevel) * 100;

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // --- UI RENDER: END SCREEN ---
  if (finished) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', backgroundColor: 'var(--accent-glow)', color: '#fff' }}>
        <div style={{ padding: '3rem 2rem', background: 'rgba(255, 255, 255, 0.02)', border: '2px solid var(--text-main)', borderRadius: '32px', textAlign: 'center', maxWidth: '400px', width: '100%', backdropFilter: 'blur(10px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏆</div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--accent-neon)', textShadow: '0 0 20px var(--accent-neon-glow)', margin: '0 0 0.5rem 0' }}>+{score} XP</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2.5rem', fontSize: '1.2rem', fontWeight: '500' }}>Protocol Complete: Level Clear</p>
          <button 
            onClick={() => router.push(getMapRoute())} 
            style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', background: 'var(--accent-neon)', border: 'none', fontWeight: '800', color: '#000', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 0 15px var(--accent-neon-glow)', transition: 'transform 0.2s' }}
          >
            Return to Map
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: '#fff', backgroundColor: 'var(--accent-glow)', fontSize: '1.2rem', fontWeight: '700', letterSpacing: '2px' }}>INITIALIZING PROTOCOL...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '2rem 1.5rem 6rem 1.5rem', alignItems: 'center', justifyContent: 'flex-start', backgroundColor: 'var(--accent-glow)', color: '#fff', position: 'relative', overflowY: 'auto', boxSizing: 'border-box' }}>
      
      {/* TOP CONTROLS HUD */}
      <div style={{ width: '100%', maxWidth: '540px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, flexShrink: 0 }}>
        <button 
          onClick={() => setShowAbortModal(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--text-main)',
            borderRadius: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            padding: '0.6rem 1.2rem',
            fontSize: '0.85rem',
            fontWeight: '700',
            letterSpacing: '0.05rem',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
        >
          ← Abort
        </button>

        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--accent-neon)', textShadow: '0 0 8px var(--accent-neon-glow)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: '900' }}>
            {subject === 'algebra2' ? 'ALGEBRA 2' : subject.toUpperCase()}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: '600', marginTop: '0.1rem' }}>
            UNIT {unit} • LEVEL {level} • NODE {count}/{totalProblemsPerLevel}
          </div>
        </div>
      </div>

      {/* CENTER WORKSPACE FRAME */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', maxWidth: '540px', margin: '1.5rem 0', flex: '1 0 auto' }}>
        
        {/* PROGRESS MATRIX BAR */}
        <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginBottom: '3.5rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)', flexShrink: 0 }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, #00ffcc, var(--accent-neon))', boxShadow: '0 0 10px var(--accent-neon-glow)', transition: 'width 0.4s ease' }} />
        </div>

        {/* QUESTION FORMAT 1: MULTIPLE CHOICE */}
        {currentQuestion.type === 'multiple-choice' && (
          <>
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))',
              border: '1px solid var(--text-main)',
              borderRadius: '30px',
              padding: '2.5rem 2rem',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              marginBottom: '2rem',
              boxSizing: 'border-box'
            }}>
              <div style={{ 
                fontSize: currentQuestion.question.length > 50 ? '1.6rem' : '2.2rem', 
                fontWeight: '800', 
                lineHeight: '1.45',
                letterSpacing: '-0.02em',
                color: '#fff'
              }}>
                {currentQuestion.question}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', width: '100%', marginBottom: '2rem' }}>
              {currentQuestion.choices.map((choice, i) => {
                let btnBorder = 'var(--text-main)';
                let btnBg = 'rgba(255, 255, 255, 0.02)';
                let btnColor = '#fff';
                let btnGlow = 'none';
                
                if (hasAnswered) {
                  if (String(choice).trim() === String(currentQuestion.correctAnswer).trim()) {
                    btnBorder = '#00ffcc'; 
                    btnBg = 'rgba(0, 255, 204, 0.08)';
                    btnColor = '#00ffcc';
                    btnGlow = '0 0 15px rgba(0, 255, 204, 0.3)';
                  } else if (String(choice).trim() === String(selectedAnswer).trim()) {
                    btnBorder = '#ff3366'; 
                    btnBg = 'rgba(255, 51, 102, 0.08)';
                    btnColor = '#ff3366';
                    btnGlow = '0 0 15px rgba(255, 51, 102, 0.3)';
                  } else {
                    btnBg = 'rgba(255,255,255,0.005)'; 
                    btnColor = 'rgba(255,255,255,0.2)';
                    btnBorder = 'rgba(255,255,255,0.03)';
                  }
                }

                return (
                  <button 
                    key={i} 
                    disabled={hasAnswered}
                    onClick={() => handleAnswerSubmit(choice)}
                    style={{
                      padding: '1rem 0.8rem',
                      fontSize: '1.2rem',
                      fontWeight: '800',
                      background: btnBg,
                      border: `2px solid ${btnBorder}`,
                      borderRadius: '16px',
                      color: btnColor,
                      boxShadow: btnGlow,
                      cursor: hasAnswered ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      outline: 'none',
                      backdropFilter: 'blur(5px)'
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
          <div style={{ width: '100%', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: '0 0 0.3rem 0', color: 'var(--accent-neon)' }}>MATCHING MATRIX</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>Strikes: {matchingStrikes}/3 (Max 2 penalties before 0 XP)</p>
              {matchingPenaltyNotice && (
                <div style={{ color: '#ff3366', fontWeight: '800', fontSize: '0.85rem', marginTop: '0.5rem', textShadow: '0 0 8px rgba(255,51,102,0.4)' }}>
                  {matchingPenaltyNotice}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%' }}>
              {/* Left Column (Questions) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', textAlign: 'center' }}>EXPRESSIONS</div>
                {currentQuestion.leftItems.map((item) => {
                  const isMatched = matchingPairsMatched.includes(item.id);
                  const isSelected = matchingSelectedLeft?.id === item.id;
                  
                  let bg = 'rgba(255,255,255,0.02)';
                  let border = 'var(--text-main)';
                  let color = '#fff';

                  if (hasAnswered) {
                    border = '#00ffcc';
                    color = '#00ffcc';
                    bg = 'rgba(0, 255, 204, 0.05)';
                  } else if (isMatched) {
                    bg = 'rgba(0, 255, 204, 0.05)';
                    border = '#00ffcc';
                    color = '#00ffcc';
                  } else if (isSelected) {
                    bg = 'rgba(255, 255, 255, 0.1)';
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
                      {hasAnswered && <div style={{ fontSize: '0.75rem', color: '#00ffcc', marginTop: '4px' }}>→ {item.answer}</div>}
                    </button>
                  );
                })}
              </div>

              {/* Right Column (Answers) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', textAlign: 'center' }}>VALUES</div>
                {currentQuestion.rightItems.map((item) => {
                  const isMatched = matchingPairsMatched.includes(item.id);
                  const isSelected = matchingSelectedRight?.id === item.id;
                  
                  let bg = 'rgba(255,255,255,0.02)';
                  let border = 'var(--text-main)';
                  let color = '#fff';

                  if (hasAnswered) {
                    border = '#00ffcc';
                    color = '#00ffcc';
                    bg = 'rgba(0, 255, 204, 0.05)';
                  } else if (isMatched) {
                    bg = 'rgba(0, 255, 204, 0.05)';
                    border = '#00ffcc';
                    color = '#00ffcc';
                  } else if (isSelected) {
                    bg = 'rgba(255, 255, 255, 0.1)';
                    border = 'var(--accent-neon)';
                  } else if (matchingWrongPair) {
                    border = '#ff3366';
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
                      {item.text}
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
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))',
              border: '1px solid var(--text-main)',
              borderRadius: '30px',
              padding: '2.5rem 2rem',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
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
                color: '#fff',
                marginBottom: '1.5rem'
              }}>
                {currentQuestion.question} = ?
              </div>

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
                      background: 'rgba(0,0,0,0.3)',
                      border: hasAnswered 
                        ? `2px solid ${isCorrect ? '#00ffcc' : '#ff3366'}` 
                        : '2px solid var(--text-main)',
                      borderRadius: '14px',
                      color: '#fff',
                      outline: 'none',
                      width: '240px',
                      textAlign: 'center',
                      boxShadow: hasAnswered ? (isCorrect ? '0 0 15px rgba(0,255,204,0.3)' : '0 0 15px rgba(255,51,102,0.3)') : 'none',
                      transition: 'all 0.2s'
                    }}
                  />
                  {hasAnswered && (
                    <span style={{
                      position: 'absolute',
                      right: '14px',
                      fontSize: '1.3rem',
                      fontWeight: '900',
                      color: isCorrect ? '#00ffcc' : '#ff3366',
                      textShadow: isCorrect ? '0 0 8px rgba(0,255,204,0.5)' : '0 0 8px rgba(255,51,102,0.5)'
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

      </div>

      {/* BOTTOM FEEDBACK INTERACTION HUD */}
      <div style={{ width: '100%', maxWidth: '540px', minHeight: '110px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {hasAnswered && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', animation: 'fadeIn 0.2s ease-out' }}>
            
            {!isCorrect && currentQuestion.type !== 'matching' && (
              <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                CORRECT TARGET: <span style={{ color: '#00ffcc', fontWeight: '800', textShadow: '0 0 8px rgba(0,255,204,0.4)' }}>{currentQuestion.correctAnswer}</span>
              </div>
            )}

            <button
              onClick={handleNextQuestion}
              style={{
                width: '100%',
                padding: '1.1rem',
                borderRadius: '16px',
                background: isCorrect ? 'var(--accent-neon)' : '#fff',
                color: '#000',
                fontWeight: '900',
                border: 'none',
                fontSize: '1.05rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                boxShadow: isCorrect ? '0 0 20px var(--accent-neon-glow)' : '0 5px 15px rgba(255,255,255,0.2)',
                transition: 'transform 0.15s'
              }}
            >
              {count === totalProblemsPerLevel ? 'Compile Results' : 'Next Node →'}
            </button>
          </div>
        )}
      </div>

      {/* --- CUSTOM CYBERPUNK ABORT MODAL --- */}
      {showAbortModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 5, 8, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1.5rem',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: 'var(--accent-glow, #0e0e12)',
            border: '2px solid var(--text-main)',
            borderRadius: '28px',
            padding: '2.5rem 2rem',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 51, 102, 0.1)',
            boxSizing: 'border-box'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ff3366', textShadow: '0 0 15px rgba(255,51,102,0.4)' }}>⚠️</div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: '#fff', letterSpacing: '-0.02em' }}>Abort Simulation?</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 2rem 0', fontWeight: '500' }}>
              Terminating the link now will purge all active matrix scores and clear your current module node progress.
            </p>
            
           <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => setShowAbortModal(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--text-main)',
                  color: '#fff',
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
                  background: '#ff3366',
                  border: 'none',
                  color: '#fff',
                  fontWeight: '800',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 0 15px rgba(255, 51, 102, 0.4)'
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
    <Suspense fallback={<div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', color: '#fff', backgroundColor: 'var(--accent-glow)', fontSize: '1.2rem', fontWeight: '700', letterSpacing: '2px' }}>LOADING MATRIX...</div>}>
      <PlayContent />
    </Suspense>
  );
}