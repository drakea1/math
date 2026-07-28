// MathAround Division Engine - 20 Units with Dimensional & Real-World Units
export function generateDivisionProblem(unit, level) {
  // Scaling factors based on 20 units curriculum structure
  const scale = Math.pow(1.2, unit - 1) * (1 + (level - 1) * 0.15);
  
  let num1, num2, answer, unitLabel = '', context = '';

  // Unit-based thematic scaling for division with actual units
  if (unit <= 5) {
    // Units 1-5: Basic integer division with fundamental units (e.g., items, apples, candies)
    const divisorMax = Math.min(12, Math.floor(4 + scale));
    num2 = Math.floor(Math.random() * (divisorMax - 2)) + 2;
    const multiplier = Math.floor(Math.random() * (10 + unit * 2)) + 2;
    num1 = num2 * multiplier; // Ensures clean division
    answer = num1 / num2;
    
    const labels = [
      { item: 'candies', group: 'bags' },
      { item: 'apples', group: 'baskets' },
      { item: 'pencils', group: 'boxes' },
      { item: 'books', group: 'shelves' }
    ];
    const selected = labels[Math.floor(Math.random() * labels.length)];
    unitLabel = selected.item;
    context = `distributing ${num1} ${selected.item} equally into ${num2} ${selected.group}`;
  } 
  else if (unit <= 10) {
    // Units 6-10: Moderate numbers with currency, time, or weight units
    const divisorMax = Math.min(25, Math.floor(5 + scale * 1.2));
    num2 = Math.floor(Math.random() * divisorMax) + 3;
    const multiplier = Math.floor(Math.random() * 20) + 5;
    num1 = num2 * multiplier;
    answer = num1 / num2;

    const categories = [
      { unit: 'dollars ($)', action: 'shared evenly among' },
      { unit: 'minutes', action: 'split equally across' },
      { unit: 'grams', action: 'divided into portions of' },
      { unit: 'meters', action: 'cut into sections of' }
    ];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    unitLabel = cat.unit;
    context = `${num1} ${cat.unit} ${cat.action} ${num2} groups`;
  } 
  else if (unit <= 15) {
    // Units 11-15: Advanced multi-digit division with scientific or speed/rate units
    num2 = Math.floor(Math.random() * 40) + 10;
    const multiplier = Math.floor(Math.random() * 50) + 10;
    num1 = num2 * multiplier;
    answer = num1 / num2;

    const advancedUnits = [
      { unit: 'kilometers', context: 'travelled over hours' },
      { unit: ' milliliters', context: 'dispensed across containers' },
      { unit: 'kilograms', context: 'distributed into shipments' },
      { unit: 'Megabytes', context: 'allocated across folders' }
    ];
    const adv = advancedUnits[Math.floor(Math.random() * advancedUnits.length)];
    unitLabel = adv.unit;
    context = `${num1} ${adv.unit} ${adv.context} (${num2} intervals)`;
  } 
  else {
    // Units 16-20: Expert decimal/scaling division with physics and engineering units
    num2 = Math.floor(Math.random() * 75) + 15;
    const multiplier = Math.floor(Math.random() * 100) + 25;
    num1 = num2 * multiplier;
    answer = num1 / num2;

    const expertUnits = [
      { unit: 'Joules of energy', context: 'released across cycles' },
      { unit: 'Volts', context: 'stepped down through resistors' },
      { unit: 'RPM rotational speed', context: 'geared down across ratios' },
      { unit: 'Metric Tons', context: 'freighted across cargo bays' }
    ];
    const exp = expertUnits[Math.floor(Math.random() * expertUnits.length)];
    unitLabel = exp.unit;
    context = `System metrics: ${num1} ${exp.unit} processed over ${num2} nodes`;
  }

  // Generate close distractor choices for the gamified engine
  const choices = generateDistractors(answer);

  return {
    question: `Calculate the rate: ${context}. What is the value per unit?`,
    num1,
    num2,
    answer,
    unit: unitLabel,
    choices,
    displayString: `${num1} ${unitLabel} ÷ ${num2} = ?`
  };
}

function generateDistractors(correctAnswer) {
  const set = new Set([correctAnswer]);
  while (set.size < 4) {
    const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1);
    const distractor = correctAnswer + offset;
    if (distractor > 0) {
      set.add(distractor);
    }
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}