// statistics.js - AP Statistics Generator (Units 1-20, Levels 1-20)

const STATISTICS_UNITS = {
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
};

function createRng(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pickOne(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function roundTo(num, decimals) {
  const factor = Math.pow(10, decimals);
  return Number((Math.round(num * factor) / factor).toFixed(decimals));
}

function normalCdf(z) {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

function nCr(n, r) {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  const k = Math.min(r, n - r);
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - k + i)) / i;
  }
  return Math.round(res);
}

function buildNumericChoices(rng, ansStr) {
  const base = Number(ansStr);
  if (!Number.isFinite(base)) {
    return [ansStr, "0", "1", "0.5"];
  }
  const decimals = ansStr.includes(".") ? ansStr.split(".")[1].length : 0;
  const step =
    decimals > 0
      ? Math.max(Math.pow(10, -decimals), roundTo(Math.abs(base) * 0.15 || 0.25, decimals))
      : Math.max(1, Math.round(Math.abs(base) * 0.2));

  const set = new Set([ansStr]);
  const multipliers = [-2, -1, 1, 2, 3, -3];
  for (const m of multipliers) {
    if (set.size >= 4) break;
    const candidate = roundTo(base + m * step, decimals).toFixed(decimals);
    const normalized = decimals > 0 ? String(Number(candidate)) : candidate;
    if (normalized !== ansStr) {
      set.add(normalized);
    }
  }
  let extra = 4;
  while (set.size < 4) {
    const candidate = roundTo(base + extra * step, decimals);
    set.add(String(candidate));
    extra++;
  }

  const arr = Array.from(set);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateStatistics(unit, level, problemIndex = 0) {
  const u = Number.isInteger(unit) && STATISTICS_UNITS[unit] ? unit : 1;
  const lvl = Math.min(20, Math.max(1, Math.floor(Number(level) || 1)));
  const idx = Math.max(0, Math.floor(Number(problemIndex) || 0));

  const seed = (u * 1000003 + lvl * 37019 + idx * 9719 + 1337) >>> 0;
  const rng = createRng(seed);
  const archetype = (idx + lvl - 1) % 8;

  let prob;
  switch (u) {
    case 1: prob = unit1Categorical(lvl, rng, archetype); break;
    case 2: prob = unit2QuantitativeDisplays(lvl, rng, archetype); break;
    case 3: prob = unit3CenterAndSpread(lvl, rng, archetype); break;
    case 4: prob = unit4NormalAndEmpirical(lvl, rng, archetype); break;
    case 5: prob = unit5ScatterplotsAndR(lvl, rng, archetype); break;
    case 6: prob = unit6LsrlAndResiduals(lvl, rng, archetype); break;
    case 7: prob = unit7Transformations(lvl, rng, archetype); break;
    case 8: prob = unit8SamplingAndBias(lvl, rng, archetype); break;
    case 9: prob = unit9ExperimentalDesign(lvl, rng, archetype); break;
    case 10: prob = unit10ProbabilityRules(lvl, rng, archetype); break;
    case 11: prob = unit11ConditionalAndIndependence(lvl, rng, archetype); break;
    case 12: prob = unit12DiscreteRandomVariables(lvl, rng, archetype); break;
    case 13: prob = unit13Binomial(lvl, rng, archetype); break;
    case 14: prob = unit14Geometric(lvl, rng, archetype); break;
    case 15: prob = unit15SamplingDistProportions(lvl, rng, archetype); break;
    case 16: prob = unit16SamplingDistMeansClt(lvl, rng, archetype); break;
    case 17: prob = unit17CiSingleProportion(lvl, rng, archetype); break;
    case 18: prob = unit18CiSingleMean(lvl, rng, archetype); break;
    case 19: prob = unit19TestProportions(lvl, rng, archetype); break;
    case 20: prob = unit20TestMeansChiSquareSlope(lvl, rng, archetype); break;
    default: prob = unit1Categorical(lvl, rng, archetype); break;
  }

  const finalAnswer = String(prob.answer);
  return {
    unit: u,
    unitName: STATISTICS_UNITS[u],
    level: lvl,
    question: prob.question,
    answer: finalAnswer,
    correctAnswer: finalAnswer,
    explanation: prob.explanation,
    choices: buildNumericChoices(rng, finalAnswer)
  };
}

// 1. Categorical Data and Displaying Distributions (Bar charts, pie charts)
function unit1Categorical(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 3);
  switch (arch) {
    case 0: {
      const c1 = randInt(rng, 12, 35) * scale;
      const c2 = randInt(rng, 15, 40) * scale;
      const c3 = randInt(rng, 10, 30) * scale;
      const total = c1 + c2 + c3;
      const pct = roundTo((c1 / total) * 100, 1);
      return {
        question: `Counts — Bus: ${c1}, Bike: ${c2}, Walk: ${c3}. Percent who take the Bus (1 dec)?`,
        answer: String(pct),
        explanation: `${c1} / ${total} × 100 = ${pct}%.`
      };
    }
    case 1: {
      const pct = randInt(rng, 8, 45) + (lvl > 10 ? 0.5 : 0);
      const deg = roundTo(pct * 3.6, 1);
      return {
        question: `Pie chart slice is ${pct}%. Central angle in degrees (1 dec)?`,
        answer: String(deg),
        explanation: `(${pct}/100) × 360° = ${deg}°.`
      };
    }
    case 2: {
      const deg = randInt(rng, 24, 162);
      const pct = roundTo((deg / 360) * 100, 1);
      return {
        question: `Pie chart angle is ${deg}°. Percent of total (1 dec)?`,
        answer: String(pct),
        explanation: `(${deg}/360) × 100 = ${pct}%.`
      };
    }
    case 3: {
      const a = randInt(rng, 15, 45) * scale;
      const b = randInt(rng, 10, 35) * scale;
      const c = randInt(rng, 15, 40) * scale;
      const d = randInt(rng, 10, 35) * scale;
      const condPct = roundTo((a / (a + b)) * 100, 1);
      return {
        question: `Table — Morning: On-time ${a}, Late ${b}; Night: On-time ${c}, Late ${d}. % of Morning on-time (1 dec)?`,
        answer: String(condPct),
        explanation: `${a} / ${a + b} × 100 = ${condPct}%.`
      };
    }
    case 4: {
      const a = randInt(rng, 15, 45) * scale;
      const b = randInt(rng, 10, 35) * scale;
      const c = randInt(rng, 15, 40) * scale;
      const d = randInt(rng, 10, 35) * scale;
      const total = a + b + c + d;
      const jointPct = roundTo((c / total) * 100, 1);
      return {
        question: `Table — Morning: On-time ${a}, Late ${b}; Night: On-time ${c}, Late ${d}. % of all who are Night & On-time (1 dec)?`,
        answer: String(jointPct),
        explanation: `${c} / ${total} × 100 = ${jointPct}%.`
      };
    }
    case 5: {
      const a = randInt(rng, 15, 45) * scale;
      const b = randInt(rng, 10, 35) * scale;
      const c = randInt(rng, 15, 40) * scale;
      const d = randInt(rng, 10, 35) * scale;
      const total = a + b + c + d;
      const margPct = roundTo(((b + d) / total) * 100, 1);
      return {
        question: `Table — Morning: On-time ${a}, Late ${b}; Night: On-time ${c}, Late ${d}. Overall % Late (1 dec)?`,
        answer: String(margPct),
        explanation: `${b + d} / ${total} × 100 = ${margPct}%.`
      };
    }
    case 6: {
      const p1 = randInt(rng, 18, 38);
      const p2 = randInt(rng, 20, 42);
      const rem = 100 - p1 - p2;
      return {
        question: `Bar segments: ${p1}% A, ${p2}% B, rest C. Percent in C?`,
        answer: String(rem),
        explanation: `100 - ${p1} - ${p2} = ${rem}%.`
      };
    }
    default: {
      const n = randInt(rng, 120, 400) * scale;
      const p = randInt(rng, 15, 65);
      const count = roundTo((n * p) / 100, 1);
      return {
        question: `Bar chart total n = ${n}; Cat D is ${p}%. Count in Cat D?`,
        answer: String(count),
        explanation: `${n} × ${p / 100} = ${count}.`
      };
    }
  }
}

// 2. Quantitative Data: Dot Plots, Stemplots, and Histograms
function unit2QuantitativeDisplays(lvl, rng, arch) {
  const spread = 1 + Math.floor((lvl - 1) / 2);
  switch (arch) {
    case 0: {
      const n = randInt(rng, 7, 13);
      const base = randInt(rng, 15, 50);
      const arr = Array.from({ length: n }, () => base + randInt(rng, 0, 12 * spread)).sort((x, y) => x - y);
      const mid = arr[Math.floor(n / 2)];
      return {
        question: `Dot plot (${n} pts): ${arr.join(", ")}. Median?`,
        answer: String(mid),
        explanation: `Middle value of ${n} sorted points is ${mid}.`
      };
    }
    case 1: {
      const stem = randInt(rng, 2, 8);
      const leaves = Array.from({ length: randInt(rng, 4, 7) }, () => randInt(rng, 0, 9)).sort((x, y) => x - y);
      const idx = randInt(rng, 0, leaves.length - 1);
      const val = stem * 10 + leaves[idx];
      return {
        question: `Stemplot (4|2 = 42): Stem ${stem} leaves [${leaves.join(", ")}]. Value of leaf #${idx + 1}?`,
        answer: String(val),
        explanation: `${stem} and ${leaves[idx]} → ${val}.`
      };
    }
    case 2: {
      const n = 10;
      const base = randInt(rng, 20, 60);
      const arr = Array.from({ length: n }, () => base + randInt(rng, 0, 10 * spread)).sort((x, y) => x - y);
      const med = roundTo((arr[4] + arr[5]) / 2, 1);
      return {
        question: `Dot plot (10 pts): ${arr.join(", ")}. Median (1 dec)?`,
        answer: String(med),
        explanation: `(${arr[4]} + ${arr[5]}) / 2 = ${med}.`
      };
    }
    case 3: {
      const q1 = randInt(rng, 15, 40) * spread;
      const iqr = randInt(rng, 8, 22) * spread;
      const q3 = q1 + iqr;
      const upperFence = roundTo(q3 + 1.5 * iqr, 1);
      return {
        question: `Q1 = ${q1}, Q3 = ${q3}. Upper outlier fence Q3 + 1.5(IQR)?`,
        answer: String(upperFence),
        explanation: `IQR = ${iqr}. ${q3} + 1.5(${iqr}) = ${upperFence}.`
      };
    }
    case 4: {
      const q1 = randInt(rng, 30, 60) * spread;
      const iqr = randInt(rng, 8, 20) * spread;
      const q3 = q1 + iqr;
      const lowerFence = roundTo(q1 - 1.5 * iqr, 1);
      return {
        question: `Q1 = ${q1}, Q3 = ${q3}. Lower outlier fence Q1 - 1.5(IQR)?`,
        answer: String(lowerFence),
        explanation: `IQR = ${iqr}. ${q1} - 1.5(${iqr}) = ${lowerFence}.`
      };
    }
    case 5: {
      const width = pickOne(rng, [5, 10, 20]);
      const start = pickOne(rng, [0, 10, 50]);
      const f1 = randInt(rng, 3, 15) * spread;
      const f2 = randInt(rng, 5, 25) * spread;
      const f3 = randInt(rng, 4, 20) * spread;
      const f4 = randInt(rng, 2, 12) * spread;
      const cutBin = randInt(rng, 1, 2);
      const countAbove = cutBin === 1 ? f2 + f3 + f4 : f3 + f4;
      const threshold = start + cutBin * width;
      return {
        question: `Histogram (width ${width} from ${start}): [${start}–${start + width}): ${f1}, [${start + width}–${start + 2 * width}): ${f2}, [${start + 2 * width}–${start + 3 * width}): ${f3}, [${start + 3 * width}–${start + 4 * width}): ${f4}. Count ≥ ${threshold}?`,
        answer: String(countAbove),
        explanation: `Sum bins from ${threshold} up: ${countAbove}.`
      };
    }
    case 6: {
      const width = pickOne(rng, [4, 5, 10]);
      const density = roundTo(randInt(rng, 2, 15) / 100, 2);
      const area = roundTo(width * density, 3);
      return {
        question: `Density histogram bar: width ${width}, height ${density}. Area of bar?`,
        answer: String(area),
        explanation: `${width} × ${density} = ${area}.`
      };
    }
    default: {
      const minVal = randInt(rng, 5, 25);
      const rangeVal = randInt(rng, 20, 60) * spread;
      const maxVal = minVal + rangeVal;
      return {
        question: `Stemplot min = ${minVal}, max = ${maxVal}. Range?`,
        answer: String(rangeVal),
        explanation: `${maxVal} - ${minVal} = ${rangeVal}.`
      };
    }
  }
}

// 3. Measuring Center (Mean, Median, Mode) and Spread (Variance, Standard Deviation)
function unit3CenterAndSpread(lvl, rng, arch) {
  const mScale = 1 + Math.floor((lvl - 1) / 2);
  switch (arch) {
    case 0: {
      const n = randInt(rng, 4, 7);
      const step = randInt(rng, 2, 6) * mScale;
      const center = randInt(rng, 10, 40) * mScale;
      const arr = [];
      for (let i = 0; i < n; i++) {
        arr.push(center + (i - Math.floor(n / 2)) * step);
      }
      const avg = roundTo(arr.reduce((a, b) => a + b, 0) / n, 2);
      return {
        question: `Mean of ${arr.join(", ")} (2 dec)?`,
        answer: String(avg),
        explanation: `(${arr.join(" + ")}) / ${n} = ${avg}.`
      };
    }
    case 1: {
      const m = randInt(rng, 15, 50) * mScale;
      const d = randInt(rng, 2, 9) * mScale;
      const arr = [m - 2 * d, m - d, m, m + d, m + 2 * d];
      const s2 = roundTo((10 * d * d) / 4, 2);
      return {
        question: `Sample variance s² for ${arr.join(", ")}?`,
        answer: String(s2),
        explanation: `Mean = ${m}. Sum of squared deviations = ${10 * d * d}; divide by 4 → ${s2}.`
      };
    }
    case 2: {
      const s = randInt(rng, 2, 12) * mScale;
      const s2 = s * s;
      return {
        question: `Sample variance s² = ${s2}. Standard deviation s?`,
        answer: String(s),
        explanation: `√${s2} = ${s}.`
      };
    }
    case 3: {
      const s = randInt(rng, 2, 10) * mScale;
      return {
        question: `Sample standard deviation s = ${s}. Variance s²?`,
        answer: String(s * s),
        explanation: `${s}² = ${s * s}.`
      };
    }
    case 4: {
      const meanVal = randInt(rng, 20, 80) * mScale;
      const sdVal = randInt(rng, 3, 12) * mScale;
      const mult = randInt(rng, 2, 5);
      const shift = randInt(rng, 5, 25) * mScale;
      const newMean = roundTo(meanVal * mult + shift, 2);
      return {
        question: `Mean = ${meanVal}, SD = ${sdVal}. Multiply each value by ${mult} and add ${shift}. New mean?`,
        answer: String(newMean),
        explanation: `${mult}(${meanVal}) + ${shift} = ${newMean}.`
      };
    }
    case 5: {
      const meanVal = randInt(rng, 20, 80) * mScale;
      const sdVal = randInt(rng, 3, 12) * mScale;
      const mult = randInt(rng, 2, 5);
      const shift = randInt(rng, 5, 25) * mScale;
      const newSd = roundTo(sdVal * mult, 2);
      return {
        question: `Mean = ${meanVal}, SD = ${sdVal}. Multiply each value by ${mult} and add ${shift}. New SD?`,
        answer: String(newSd),
        explanation: `Adding ${shift} doesn't change spread; ${mult} × ${sdVal} = ${newSd}.`
      };
    }
    case 6: {
      const n = randInt(rng, 4, 7);
      const targetMean = randInt(rng, 40, 90);
      const known = Array.from({ length: n - 1 }, () => targetMean + randInt(rng, -12, 12));
      const missing = n * targetMean - known.reduce((a, b) => a + b, 0);
      return {
        question: `Mean of ${n} scores is ${targetMean}. Known scores: ${known.join(", ")}. Missing score?`,
        answer: String(missing),
        explanation: `Sum = ${n * targetMean}; ${n * targetMean} - ${known.reduce((a, b) => a + b, 0)} = ${missing}.`
      };
    }
    default: {
      const modeVal = randInt(rng, 10, 50) * mScale;
      const other1 = modeVal - randInt(rng, 1, 5) * mScale;
      const other2 = modeVal + randInt(rng, 2, 6) * mScale;
      const other3 = modeVal + randInt(rng, 7, 12) * mScale;
      const dataset = [other1, modeVal, other2, modeVal, other3, modeVal].sort((a, b) => a - b);
      return {
        question: `Mode of ${dataset.join(", ")}?`,
        answer: String(modeVal),
        explanation: `${modeVal} appears 3 times.`
      };
    }
  }
}

// 4. Normal Distributions and the Empirical Rule (68-95-99.7)
function unit4NormalAndEmpirical(lvl, rng, arch) {
  const mu = randInt(rng, 50, 200) + lvl * 5;
  const sd = randInt(rng, 4, 25) + lvl;
  switch (arch) {
    case 0: {
      const z = pickOne(rng, [-2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5]);
      const x = roundTo(mu + z * sd, 2);
      return {
        question: `N(${mu}, ${sd}): z-score for x = ${x} (2 dec)?`,
        answer: String(roundTo(z, 2)),
        explanation: `(${x} - ${mu}) / ${sd} = ${roundTo(z, 2)}.`
      };
    }
    case 1: {
      const z = pickOne(rng, [-2, -1.5, -1, 0.5, 1, 1.5, 2, 2.5]);
      const x = roundTo(mu + z * sd, 2);
      return {
        question: `N(${mu}, ${sd}): value x for z = ${z} (2 dec)?`,
        answer: String(x),
        explanation: `${mu} + (${z})(${sd}) = ${x}.`
      };
    }
    case 2: {
      const ruleCases = [
        { pct: 68, desc: `between ${mu - sd} and ${mu + sd}` },
        { pct: 95, desc: `between ${mu - 2 * sd} and ${mu + 2 * sd}` },
        { pct: 99.7, desc: `between ${mu - 3 * sd} and ${mu + 3 * sd}` }
      ];
      const chosen = pickOne(rng, ruleCases);
      return {
        question: `Empirical Rule for N(${mu}, ${sd}): % ${chosen.desc}?`,
        answer: String(chosen.pct),
        explanation: `Empirical Rule gives ${chosen.pct}%.`
      };
    }
    case 3: {
      const k = pickOne(rng, [1, 2, 3]);
      const bandPct = k === 1 ? 68 : k === 2 ? 95 : 99.7;
      const tailPct = roundTo((100 - bandPct) / 2, 2);
      const upper = mu + k * sd;
      return {
        question: `Empirical Rule for N(${mu}, ${sd}): % above ${upper}?`,
        answer: String(tailPct),
        explanation: `(100 - ${bandPct}) / 2 = ${tailPct}%.`
      };
    }
    case 4: {
      const upper = mu + sd;
      return {
        question: `Empirical Rule for N(${mu}, ${sd}): % below ${upper}?`,
        answer: "84",
        explanation: `50% below ${mu} + 34% up to ${upper} = 84%.`
      };
    }
    case 5: {
      const z = roundTo(randInt(rng, 40, 240) / 100, 2) * (rng() < 0.5 ? -1 : 1);
      const x = roundTo(mu + z * sd, 2);
      const probBelow = roundTo(normalCdf(z), 4);
      return {
        question: `X ~ N(${mu}, ${sd}): P(X < ${x}) (4 dec)?`,
        answer: String(probBelow),
        explanation: `z = ${z} → P(Z < ${z}) ≈ ${probBelow}.`
      };
    }
    case 6: {
      const z = roundTo(randInt(rng, 50, 230) / 100, 2);
      const x = roundTo(mu + z * sd, 2);
      const probAbove = roundTo(1 - normalCdf(z), 4);
      return {
        question: `X ~ N(${mu}, ${sd}): P(X > ${x}) (4 dec)?`,
        answer: String(probAbove),
        explanation: `z = ${z} → 1 - Φ(${z}) ≈ ${probAbove}.`
      };
    }
    default: {
      return {
        question: `Empirical Rule for N(${mu}, ${sd}): % between ${mu - sd} and ${mu + 2 * sd}?`,
        answer: "81.5",
        explanation: `34% + 47.5% = 81.5%.`
      };
    }
  }
}

// 5. Scatterplots and Correlation Coefficients (r)
function unit5ScatterplotsAndR(lvl, rng, arch) {
  const rMag = roundTo(randInt(rng, 15, 96) / 100, 2);
  const rVal = arch % 2 === 1 ? -rMag : rMag;
  switch (arch) {
    case 0:
    case 1: {
      const r2Pct = roundTo(rVal * rVal * 100, 1);
      return {
        question: `Correlation r = ${rVal}. % of variation in y explained by linear fit with x (1 dec)?`,
        answer: String(r2Pct),
        explanation: `r² = (${rVal})² = ${roundTo(rVal * rVal, 4)} → ${r2Pct}%.`
      };
    }
    case 2: {
      const r2 = roundTo(rMag * rMag, 4);
      return {
        question: `r² = ${r2} with a negative slope. Correlation r (2 dec)?`,
        answer: String(-rMag),
        explanation: `-√${r2} = ${-rMag}.`
      };
    }
    case 3: {
      const mult = roundTo(randInt(rng, 2, 8) + lvl * 0.25, 2);
      return {
        question: `r = ${rVal}. Multiply all x by ${mult}. New r (2 dec)?`,
        answer: String(rVal),
        explanation: `Positive rescaling of x does not change r (${rVal}).`
      };
    }
    case 4: {
      const negFactor = -randInt(rng, 2, 6);
      const newR = roundTo(-rVal, 2);
      return {
        question: `r = ${rVal}. Multiply all y by ${negFactor}. New r (2 dec)?`,
        answer: String(newR),
        explanation: `Multiplying y by a negative number flips the sign of r to ${newR}.`
      };
    }
    case 5: {
      return {
        question: `r = ${rVal}. Swap x and y axes. New r (2 dec)?`,
        answer: String(rVal),
        explanation: `Correlation stays ${rVal} when x and y are swapped.`
      };
    }
    case 6: {
      const r2 = roundTo(rMag * rMag, 4);
      return {
        question: `r² = ${r2} with a positive slope. Correlation r (2 dec)?`,
        answer: String(rMag),
        explanation: `+√${r2} = ${rMag}.`
      };
    }
    default: {
      const pctExplained = randInt(rng, 16, 81);
      const r2Dec = roundTo(pctExplained / 100, 2);
      return {
        question: `${pctExplained}% of variation in y is explained by the line. Value of r² (2 dec)?`,
        answer: String(r2Dec),
        explanation: `${pctExplained} / 100 = ${r2Dec}.`
      };
    }
  }
}

// 6. Least-Squares Regression Lines and Residuals
function unit6LsrlAndResiduals(lvl, rng, arch) {
  const a = randInt(rng, 10, 45) + lvl;
  const b = roundTo((randInt(rng, 12, 45) / 10) * (rng() < 0.4 ? -1 : 1), 1);
  const x = randInt(rng, 3, 18) + Math.floor(lvl / 2);
  const yHat = roundTo(a + b * x, 2);
  switch (arch) {
    case 0: {
      return {
        question: `LSRL: ŷ = ${a} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x. Predicted ŷ at x = ${x} (2 dec)?`,
        answer: String(yHat),
        explanation: `${a} + (${b})(${x}) = ${yHat}.`
      };
    }
    case 1: {
      const resid = roundTo(randInt(rng, -12, 12) + lvl * 0.25, 2);
      const actualY = roundTo(yHat + resid, 2);
      return {
        question: `LSRL: ŷ = ${a} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x. At x = ${x}, actual y = ${actualY}. Residual y - ŷ (2 dec)?`,
        answer: String(resid),
        explanation: `ŷ = ${yHat}; ${actualY} - ${yHat} = ${resid}.`
      };
    }
    case 2: {
      const r = pickOne(rng, [0.5, 0.6, 0.75, 0.8, -0.5, -0.75, -0.8]);
      const sx = randInt(rng, 2, 8) * (1 + Math.floor(lvl / 5));
      const sy = randInt(rng, 4, 20) * (1 + Math.floor(lvl / 5));
      const slope = roundTo(r * (sy / sx), 3);
      return {
        question: `r = ${r}, s_x = ${sx}, s_y = ${sy}. LSRL slope b = r(s_y/s_x) (3 dec)?`,
        answer: String(slope),
        explanation: `${r} × (${sy}/${sx}) = ${slope}.`
      };
    }
    case 3: {
      const slope = roundTo(((randInt(rng, 15, 45) / 10) * (rng() < 0.5 ? 1 : -1)), 1);
      const xBar = randInt(rng, 5, 25);
      const yBar = randInt(rng, 30, 120) + lvl * 2;
      const intercept = roundTo(yBar - slope * xBar, 2);
      return {
        question: `Slope b = ${slope}, x̄ = ${xBar}, ȳ = ${yBar}. y-intercept a = ȳ - bx̄ (2 dec)?`,
        answer: String(intercept),
        explanation: `${yBar} - (${slope})(${xBar}) = ${intercept}.`
      };
    }
    case 4: {
      const resid = roundTo(randInt(rng, -10, 10) * 0.5, 2);
      const actualY = roundTo(yHat + resid, 2);
      return {
        question: `Predicted ŷ = ${yHat}, residual = ${resid}. Actual y (2 dec)?`,
        answer: String(actualY),
        explanation: `ŷ + residual = ${yHat} + (${resid}) = ${actualY}.`
      };
    }
    case 5: {
      const actualY = roundTo(yHat + randInt(rng, -8, 8) * 0.5, 2);
      const resid = roundTo(actualY - yHat, 2);
      return {
        question: `Actual y = ${actualY}, residual = ${resid}. Predicted ŷ (2 dec)?`,
        answer: String(yHat),
        explanation: `y - residual = ${actualY} - (${resid}) = ${yHat}.`
      };
    }
    case 6: {
      const dx = randInt(rng, 2, 10);
      const changeY = roundTo(b * dx, 2);
      return {
        question: `ŷ = ${a} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x. Predicted change in y if x rises by ${dx} (2 dec)?`,
        answer: String(changeY),
        explanation: `${b} × ${dx} = ${changeY}.`
      };
    }
    default: {
      const xMean = randInt(rng, 5, 20) + lvl;
      const yMean = roundTo(a + b * xMean, 2);
      return {
        question: `ŷ = ${a} ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x. If x̄ = ${xMean}, find ȳ (2 dec)?`,
        answer: String(yMean),
        explanation: `Line passes through (x̄, ȳ): ${a} + (${b})(${xMean}) = ${yMean}.`
      };
    }
  }
}

// 7. Transformations to Achieve Linearity (Log and power transformations)
function unit7Transformations(lvl, rng, arch) {
  switch (arch) {
    case 0: {
      const intPart = randInt(rng, 1, 3);
      const xVal = randInt(rng, 1, 4);
      const ans = Math.pow(10, intPart + xVal);
      return {
        question: `log₁₀(ŷ) = ${intPart} + 1.0x. Predicted ŷ when x = ${xVal}?`,
        answer: String(ans),
        explanation: `log₁₀(ŷ) = ${intPart + xVal} → 10^${intPart + xVal} = ${ans}.`
      };
    }
    case 1: {
      const a = roundTo(randInt(rng, 2, 15) / 10, 1);
      const b = roundTo(randInt(rng, 1, 6) / 10, 1);
      const xVal = randInt(rng, 1, 8) + Math.floor(lvl / 4);
      const logY = roundTo(a + b * xVal, 2);
      return {
        question: `log₁₀(ŷ) = ${a} + ${b}x. Predicted log₁₀(ŷ) at x = ${xVal} (2 dec)?`,
        answer: String(logY),
        explanation: `${a} + ${b}(${xVal}) = ${logY}.`
      };
    }
    case 2: {
      const mult = randInt(rng, 2, 6);
      const exp = randInt(rng, 2, 4);
      const xVal = randInt(rng, 2, 5);
      const yPred = mult * Math.pow(xVal, exp);
      return {
        question: `log₁₀(ŷ) = log₁₀(${mult}) + ${exp}·log₁₀(x). Predicted ŷ at x = ${xVal}?`,
        answer: String(yPred),
        explanation: `${mult} × ${xVal}^${exp} = ${yPred}.`
      };
    }
    case 3: {
      const a = roundTo(randInt(rng, 5, 25) / 10, 1);
      const b = roundTo(randInt(rng, 2, 8) / 10, 1);
      const xVal = randInt(rng, 1, 6) + Math.floor(lvl / 5);
      const lnY = roundTo(a + b * xVal, 2);
      return {
        question: `ln(ŷ) = ${a} + ${b}x. Predicted ln(ŷ) at x = ${xVal} (2 dec)?`,
        answer: String(lnY),
        explanation: `${a} + ${b}(${xVal}) = ${lnY}.`
      };
    }
    case 4: {
      const expB = randInt(rng, 2, 5) + Math.floor((lvl - 1) / 6);
      const initA = randInt(rng, 2, 12);
      return {
        question: `Power model y = ${initA}x^${expB}. Slope of log₁₀(y) vs. log₁₀(x)?`,
        answer: String(expB),
        explanation: `log₁₀(y) = log₁₀(${initA}) + ${expB}·log₁₀(x) → slope is ${expB}.`
      };
    }
    case 5: {
      const initA = randInt(rng, 10, 80) * (1 + Math.floor(lvl / 5));
      const base = pickOne(rng, [2, 3, 0.5, 0.25]);
      return {
        question: `y = ${initA}(${base})^x. Constant multiplier y(x+1) / y(x)?`,
        answer: String(base),
        explanation: `Multiplier is base ${base}.`
      };
    }
    case 6: {
      const k = randInt(rng, 2, 7) + Math.floor(lvl / 4);
      const val = Math.pow(10, k);
      return {
        question: `Evaluate log₁₀(${val}).`,
        answer: String(k),
        explanation: `10^${k} = ${val}.`
      };
    }
    default: {
      const logY = roundTo(randInt(rng, 15, 40) / 10, 2);
      const logX = roundTo(randInt(rng, 5, 15) / 10, 2);
      const ratioLog = roundTo(logY - logX, 2);
      return {
        question: `log₁₀(y) = ${logY}, log₁₀(x) = ${logX}. Find log₁₀(y / x) (2 dec)?`,
        answer: String(ratioLog),
        explanation: `${logY} - ${logX} = ${ratioLog}.`
      };
    }
  }
}

// 8. Sampling Methods and Sources of Bias in Surveys
function unit8SamplingAndBias(lvl, rng, arch) {
  const mult = 1 + Math.floor((lvl - 1) / 2);
  switch (arch) {
    case 0: {
      const step = randInt(rng, 5, 25) * mult;
      const n = randInt(rng, 20, 80);
      const pop = step * n;
      return {
        question: `Systematic sample of n = ${n} from N = ${pop}. Step size k?`,
        answer: String(step),
        explanation: `${pop} / ${n} = ${step}.`
      };
    }
    case 1: {
      const start = randInt(rng, 1, 12);
      const k = randInt(rng, 6, 20);
      const itemNum = randInt(rng, 2, 6);
      const pos = start + (itemNum - 1) * k;
      return {
        question: `Systematic sample starts at #${start}, step k = ${k}. Index of ${itemNum}th item?`,
        answer: String(pos),
        explanation: `${start} + (${itemNum} - 1)(${k}) = ${pos}.`
      };
    }
    case 2: {
      const s1 = randInt(rng, 2, 5) * 100 * mult;
      const s2 = randInt(rng, 3, 7) * 100 * mult;
      const s3 = randInt(rng, 2, 6) * 100 * mult;
      const totalPop = s1 + s2 + s3;
      const n = 100;
      const alloc1 = roundTo((s1 / totalPop) * n, 1);
      return {
        question: `Strata sizes: ${s1}, ${s2}, ${s3}. Proportional sample of ${n}: count from stratum ${s1} (1 dec)?`,
        answer: String(alloc1),
        explanation: `(${s1} / ${totalPop}) × ${n} = ${alloc1}.`
      };
    }
    case 3: {
      const clusters = randInt(rng, 4, 12);
      const perCluster = randInt(rng, 15, 40) * mult;
      return {
        question: `Cluster sample: ${clusters} clusters, ${perCluster} units each. Sample size?`,
        answer: String(clusters * perCluster),
        explanation: `${clusters} × ${perCluster} = ${clusters * perCluster}.`
      };
    }
    case 4: {
      const sent = randInt(rng, 200, 800) * mult;
      const returned = randInt(rng, Math.floor(sent * 0.4), Math.floor(sent * 0.9));
      const nonRespPct = roundTo(((sent - returned) / sent) * 100, 1);
      return {
        question: `${returned} of ${sent} surveys returned. Nonresponse % (1 dec)?`,
        answer: String(nonRespPct),
        explanation: `(${sent - returned} / ${sent}) × 100 = ${nonRespPct}%.`
      };
    }
    case 5: {
      const pop = randInt(rng, 500, 3000) * mult;
      const maxTenPct = roundTo(pop * 0.1, 1);
      return {
        question: `Population N = ${pop}. Max n under the 10% condition?`,
        answer: String(maxTenPct),
        explanation: `0.10 × ${pop} = ${maxTenPct}.`
      };
    }
    case 6: {
      const samp = randInt(rng, 25, 120) * mult;
      const minPop = samp * 10;
      return {
        question: `Sample n = ${samp}. Minimum population N for the 10% condition?`,
        answer: String(minPop),
        explanation: `10 × ${samp} = ${minPop}.`
      };
    }
    default: {
      const pop = randInt(rng, 1000, 5000) * mult;
      const samp = randInt(rng, 50, 250) * mult;
      const fracPct = roundTo((samp / pop) * 100, 2);
      return {
        question: `Sample n = ${samp} from N = ${pop}. Sampling fraction % (2 dec)?`,
        answer: String(fracPct),
        explanation: `(${samp} / ${pop}) × 100 = ${fracPct}%.`
      };
    }
  }
}

// 9. Experimental Design (Control, Randomization, Replication, Blocking)
function unit9ExperimentalDesign(lvl, rng, arch) {
  const rScale = 1 + Math.floor((lvl - 1) / 3);
  switch (arch) {
    case 0: {
      const f1 = randInt(rng, 2, 4);
      const f2 = randInt(rng, 2, 5);
      const f3 = lvl >= 8 ? randInt(rng, 2, 3) : 1;
      const totalTreatments = f1 * f2 * f3;
      const desc = f3 > 1 ? `${f1} × ${f2} × ${f3} factors` : `${f1} × ${f2} factors`;
      return {
        question: `Factorial design with ${desc}. Total treatment combinations?`,
        answer: String(totalTreatments),
        explanation: `${desc.replace(" factors", "")} = ${totalTreatments}.`
      };
    }
    case 1: {
      const treatments = randInt(rng, 2, 5);
      const perGroup = randInt(rng, 8, 25) * rScale;
      const total = treatments * perGroup;
      return {
        question: `${total} subjects split equally into ${treatments} treatment groups. Subjects per group?`,
        answer: String(perGroup),
        explanation: `${total} / ${treatments} = ${perGroup}.`
      };
    }
    case 2: {
      const blocks = randInt(rng, 3, 6);
      const treatments = randInt(rng, 2, 4);
      const perCell = randInt(rng, 3, 10) * rScale;
      const total = blocks * treatments * perCell;
      return {
        question: `Block design: ${blocks} blocks, ${treatments} treatments, ${total} subjects evenly split. Subjects per treatment per block?`,
        answer: String(perCell),
        explanation: `${total} / (${blocks} × ${treatments}) = ${perCell}.`
      };
    }
    case 3: {
      const pairs = randInt(rng, 15, 60) * rScale;
      return {
        question: `Matched pairs with ${pairs} pairs (Treatment A vs. B). Subjects getting A?`,
        answer: String(pairs),
        explanation: `1 subject per pair → ${pairs}.`
      };
    }
    case 4: {
      const pairs = randInt(rng, 12, 45) * rScale;
      return {
        question: `Matched pairs: ${pairs} subjects each try 2 treatments. Total trials?`,
        answer: String(pairs * 2),
        explanation: `${pairs} × 2 = ${pairs * 2}.`
      };
    }
    case 5: {
      const blockA = randInt(rng, 20, 50) * rScale;
      const blockB = randInt(rng, 20, 50) * rScale;
      return {
        question: `Block A (${blockA}) and Block B (${blockB}) split 50/50 into Treatment and Control. Block A in Treatment?`,
        answer: String(blockA / 2),
        explanation: `0.5 × ${blockA} = ${blockA / 2}.`
      };
    }
    case 6: {
      const doses = randInt(rng, 2, 5);
      return {
        question: `Experiment has ${doses} active doses plus a placebo group. Total groups?`,
        answer: String(doses + 1),
        explanation: `${doses} + 1 = ${doses + 1}.`
      };
    }
    default: {
      const plots = randInt(rng, 16, 48) * rScale;
      const treatments = 4;
      return {
        question: `${plots} plots split evenly across ${treatments} treatments. Replicates per treatment?`,
        answer: String(plots / treatments),
        explanation: `${plots} / ${treatments} = ${plots / treatments}.`
      };
    }
  }
}

// 10. Probability Rules (Complement, Addition, Multiplication)
function unit10ProbabilityRules(lvl, rng, arch) {
  switch (arch) {
    case 0: {
      const pa = roundTo(randInt(rng, 12, 85) / 100, 2);
      const comp = roundTo(1 - pa, 2);
      return {
        question: `P(A) = ${pa}. Find P(A^c) (2 dec)?`,
        answer: String(comp),
        explanation: `1 - ${pa} = ${comp}.`
      };
    }
    case 1: {
      const pa = roundTo(randInt(rng, 25, 65) / 100, 2);
      const pb = roundTo(randInt(rng, 25, 65) / 100, 2);
      const maxJoint = Math.min(pa, pb);
      const pab = roundTo(randInt(rng, 5, Math.max(5, Math.floor(maxJoint * 100) - 2)) / 100, 2);
      const union = roundTo(pa + pb - pab, 2);
      return {
        question: `P(A) = ${pa}, P(B) = ${pb}, P(A ∩ B) = ${pab}. Find P(A ∪ B) (2 dec)?`,
        answer: String(union),
        explanation: `${pa} + ${pb} - ${pab} = ${union}.`
      };
    }
    case 2: {
      const pa = roundTo(randInt(rng, 15, 45) / 100, 2);
      const pb = roundTo(randInt(rng, 15, 45) / 100, 2);
      const union = roundTo(pa + pb, 2);
      return {
        question: `Disjoint events: P(A) = ${pa}, P(B) = ${pb}. Find P(A ∪ B) (2 dec)?`,
        answer: String(union),
        explanation: `${pa} + ${pb} = ${union}.`
      };
    }
    case 3: {
      const pa = roundTo(randInt(rng, 20, 80) / 100, 2);
      const pb = roundTo(randInt(rng, 20, 80) / 100, 2);
      const inter = roundTo(pa * pb, 4);
      return {
        question: `Independent events: P(A) = ${pa}, P(B) = ${pb}. Find P(A ∩ B) (4 dec)?`,
        answer: String(inter),
        explanation: `${pa} × ${pb} = ${inter}.`
      };
    }
    case 4: {
      const pa = roundTo(randInt(rng, 20, 70) / 100, 2);
      const pb = roundTo(randInt(rng, 20, 70) / 100, 2);
      const union = roundTo(pa + pb - pa * pb, 4);
      return {
        question: `Independent events: P(A) = ${pa}, P(B) = ${pb}. Find P(A ∪ B) (4 dec)?`,
        answer: String(union),
        explanation: `${pa} + ${pb} - (${pa} × ${pb}) = ${union}.`
      };
    }
    case 5: {
      const p = roundTo(randInt(rng, 10, 45) / 100, 2);
      const trials = randInt(rng, 2, 5) + Math.floor(lvl / 7);
      const atLeastOne = roundTo(1 - Math.pow(1 - p, trials), 4);
      return {
        question: `Independent trials with p = ${p}. P(at least 1 success in ${trials} trials) (4 dec)?`,
        answer: String(atLeastOne),
        explanation: `1 - (${roundTo(1 - p, 2)})^${trials} ≈ ${atLeastOne}.`
      };
    }
    case 6: {
      const pa = roundTo(randInt(rng, 40, 75) / 100, 2);
      const pab = roundTo(randInt(rng, 10, Math.floor((pa - 0.1) * 100)) / 100, 2);
      const onlyA = roundTo(pa - pab, 2);
      return {
        question: `P(A) = ${pa}, P(A ∩ B) = ${pab}. Find P(A ∩ B^c) (2 dec)?`,
        answer: String(onlyA),
        explanation: `${pa} - ${pab} = ${onlyA}.`
      };
    }
    default: {
      const p1 = roundTo(randInt(rng, 10, 30) / 100, 2);
      const p2 = roundTo(randInt(rng, 15, 35) / 100, 2);
      const p3 = roundTo(randInt(rng, 10, 25) / 100, 2);
      const p4 = roundTo(1 - p1 - p2 - p3, 2);
      return {
        question: `Disjoint probabilities: ${p1}, ${p2}, ${p3}, p₄. Find p₄ (2 dec)?`,
        answer: String(p4),
        explanation: `1 - (${p1} + ${p2} + ${p3}) = ${p4}.`
      };
    }
  }
}

// 11. Conditional Probability and Independence
function unit11ConditionalAndIndependence(lvl, rng, arch) {
  const scale = 1 + Math.floor((lvl - 1) / 4);
  switch (arch) {
    case 0: {
      const pb = roundTo(randInt(rng, 30, 80) / 100, 2);
      const cond = roundTo(randInt(rng, 20, 85) / 100, 2);
      const joint = roundTo(pb * cond, 4);
      return {
        question: `P(A ∩ B) = ${joint}, P(B) = ${pb}. Find P(A | B) (4 dec)?`,
        answer: String(cond),
        explanation: `${joint} / ${pb} = ${cond}.`
      };
    }
    case 1: {
      const pa = roundTo(randInt(rng, 20, 75) / 100, 2);
      const condBA = roundTo(randInt(rng, 20, 85) / 100, 2);
      const joint = roundTo(pa * condBA, 4);
      return {
        question: `P(A) = ${pa}, P(B | A) = ${condBA}. Find P(A ∩ B) (4 dec)?`,
        answer: String(joint),
        explanation: `${pa} × ${condBA} = ${joint}.`
      };
    }
    case 2: {
      const a = randInt(rng, 12, 40) * scale;
      const b = randInt(rng, 10, 35) * scale;
      const c = randInt(rng, 12, 40) * scale;
      const d = randInt(rng, 10, 35) * scale;
      const pCond = roundTo(c / (c + d), 3);
      return {
        question: `G1: Yes ${a}, No ${b}; G2: Yes ${c}, No ${d}. Find P(Yes | G2) (3 dec)?`,
        answer: String(pCond),
        explanation: `${c} / ${c + d} ≈ ${pCond}.`
      };
    }
    case 3: {
      const pa = roundTo(randInt(rng, 20, 70) / 100, 2);
      const pb = roundTo(randInt(rng, 20, 70) / 100, 2);
      const reqJoint = roundTo(pa * pb, 4);
      return {
        question: `P(A) = ${pa}, P(B) = ${pb}. P(A ∩ B) needed for independence (4 dec)?`,
        answer: String(reqJoint),
        explanation: `${pa} × ${pb} = ${reqJoint}.`
      };
    }
    case 4: {
      const pa = roundTo(randInt(rng, 10, 40) / 100, 2);
      const pba = roundTo(randInt(rng, 60, 95) / 100, 2);
      const pbac = roundTo(randInt(rng, 5, 35) / 100, 2);
      const pb = roundTo(pa * pba + (1 - pa) * pbac, 4);
      return {
        question: `P(A) = ${pa}, P(B|A) = ${pba}, P(B|A^c) = ${pbac}. Find P(B) (4 dec)?`,
        answer: String(pb),
        explanation: `(${pa})(${pba}) + (${roundTo(1 - pa, 2)})(${pbac}) = ${pb}.`
      };
    }
    case 5: {
      const pa = roundTo(randInt(rng, 5, 30) / 100, 2);
      const pba = roundTo(randInt(rng, 70, 98) / 100, 2);
      const pbac = roundTo(randInt(rng, 5, 25) / 100, 2);
      const num = pa * pba;
      const den = num + (1 - pa) * pbac;
      const post = roundTo(num / den, 4);
      return {
        question: `P(A) = ${pa}, P(B|A) = ${pba}, P(B|A^c) = ${pbac}. Find P(A | B) (4 dec)?`,
        answer: String(post),
        explanation: `(${pa}×${pba}) / [(${pa}×${pba}) + (${roundTo(1 - pa, 2)}×${pbac})] ≈ ${post}.`
      };
    }
    case 6: {
      const red = randInt(rng, 4, 10);
      const blue = randInt(rng, 4, 10);
      const total = red + blue;
      const pSecondRedGivenFirstRed = roundTo((red - 1) / (total - 1), 4);
      return {
        question: `Bag has ${red} red, ${blue} blue. Draw 2 without replacement: P(2nd red | 1st red) (4 dec)?`,
        answer: String(pSecondRedGivenFirstRed),
        explanation: `${red - 1} / ${total - 1} ≈ ${pSecondRedGivenFirstRed}.`
      };
    }
    default: {
      const condAB = roundTo(randInt(rng, 25, 85) / 100, 2);
      const condAcB = roundTo(1 - condAB, 2);
      return {
        question: `P(A | B) = ${condAB}. Find P(A^c | B) (2 dec)?`,
        answer: String(condAcB),
        explanation: `1 - ${condAB} = ${condAcB}.`
      };
    }
  }
}

// 12. Discrete Random Variables and Probability Distributions
function unit12DiscreteRandomVariables(lvl, rng, arch) {
  const mult = 1 + Math.floor((lvl - 1) / 3);
  switch (arch) {
    case 0: {
      const x1 = 0;
      const x2 = randInt(rng, 2, 10) * mult;
      const x3 = x2 + randInt(rng, 2, 10) * mult;
      const p1 = roundTo(randInt(rng, 1, 4) / 10, 1);
      const p2 = roundTo(randInt(rng, 2, 5) / 10, 1);
      const p3 = roundTo(1 - p1 - p2, 1);
      if (p3 <= 0) {
        const ex = roundTo(x2 * 0.5 + x3 * 0.3, 2);
        return {
          question: `X values 0, ${x2}, ${x3} with probs 0.2, 0.5, 0.3. Mean E(X)?`,
          answer: String(ex),
          explanation: `0(0.2) + ${x2}(0.5) + ${x3}(0.3) = ${ex}.`
        };
      }
      const ex = roundTo(x1 * p1 + x2 * p2 + x3 * p3, 2);
      return {
        question: `X values ${x1}, ${x2}, ${x3} with probs ${p1}, ${p2}, ${p3}. Mean E(X)?`,
        answer: String(ex),
        explanation: `${x1}(${p1}) + ${x2}(${p2}) + ${x3}(${p3}) = ${ex}.`
      };
    }
    case 1: {
      const ex = randInt(rng, 5, 25) * mult;
      const varX = randInt(rng, 4, 36) * mult;
      const ex2 = ex * ex + varX;
      return {
        question: `E(X) = ${ex}, E(X²) = ${ex2}. Variance Var(X)?`,
        answer: String(varX),
        explanation: `${ex2} - ${ex}² = ${varX}.`
      };
    }
    case 2: {
      const ex = randInt(rng, 10, 50) * mult;
      const sd = randInt(rng, 2, 10) * mult;
      const c1 = randInt(rng, 2, 5);
      const c2 = randInt(rng, 3, 20) * mult;
      const eNew = c1 * ex + c2;
      return {
        question: `E(X) = ${ex}, SD(X) = ${sd}. Find E(${c1}X + ${c2})?`,
        answer: String(eNew),
        explanation: `${c1}(${ex}) + ${c2} = ${eNew}.`
      };
    }
    case 3: {
      const ex = randInt(rng, 10, 50) * mult;
      const sd = randInt(rng, 2, 10) * mult;
      const c1 = randInt(rng, 2, 6);
      const c2 = randInt(rng, 3, 20) * mult;
      const sdNew = c1 * sd;
      return {
        question: `E(X) = ${ex}, SD(X) = ${sd}. Find SD(${c1}X + ${c2})?`,
        answer: String(sdNew),
        explanation: `${c1} × ${sd} = ${sdNew}.`
      };
    }
    case 4: {
      const varX = randInt(rng, 5, 30) * mult;
      const varY = randInt(rng, 5, 30) * mult;
      return {
        question: `Independent X, Y: Var(X) = ${varX}, Var(Y) = ${varY}. Find Var(X + Y)?`,
        answer: String(varX + varY),
        explanation: `${varX} + ${varY} = ${varX + varY}.`
      };
    }
    case 5: {
      const sdX = randInt(rng, 3, 12);
      const sdY = randInt(rng, 3, 12);
      const sdDiff = roundTo(Math.sqrt(sdX * sdX + sdY * sdY), 2);
      return {
        question: `Independent X, Y: SD(X) = ${sdX}, SD(Y) = ${sdY}. Find SD(X - Y) (2 dec)?`,
        answer: String(sdDiff),
        explanation: `√(${sdX}² + ${sdY}²) ≈ ${sdDiff}.`
      };
    }
    case 6: {
      const varX = randInt(rng, 3, 15) * mult;
      const k = randInt(rng, 2, 4);
      return {
        question: `Var(X) = ${varX}. Find Var(${k}X)?`,
        answer: String(k * k * varX),
        explanation: `${k}² × ${varX} = ${k * k * varX}.`
      };
    }
    default: {
      const win = randInt(rng, 20, 100);
      const loss = randInt(rng, 2, 15);
      const pWin = pickOne(rng, [0.1, 0.2, 0.25, 0.4]);
      const pLoss = roundTo(1 - pWin, 2);
      const ev = roundTo(win * pWin - loss * pLoss, 2);
      return {
        question: `Win $${win} (p = ${pWin}) or lose $${loss} (p = ${pLoss}). Expected gain ($)?`,
        answer: String(ev),
        explanation: `${win}(${pWin}) - ${loss}(${pLoss}) = ${ev}.`
      };
    }
  }
}

// 13. Binomial Probability Distributions
function unit13Binomial(lvl, rng, arch) {
  switch (arch) {
    case 0: {
      const n = randInt(rng, 5, 12) + Math.floor(lvl / 3);
      const k = randInt(rng, 1, n - 1);
      const p = pickOne(rng, [0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
      const prob = roundTo(nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k), 4);
      return {
        question: `Binomial(n = ${n}, p = ${p}): P(X = ${k}) (4 dec)?`,
        answer: String(prob),
        explanation: `C(${n},${k})(${p})^${k}(${roundTo(1 - p, 2)})^${n - k} ≈ ${prob}.`
      };
    }
    case 1: {
      const n = randInt(rng, 4, 8);
      const k = randInt(rng, 1, n - 1);
      const p = pickOne(rng, [0.2, 0.25, 0.4, 0.5]);
      let cdf = 0;
      for (let i = 0; i <= k; i++) {
        cdf += nCr(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
      }
      const ans = roundTo(cdf, 4);
      return {
        question: `Binomial(n = ${n}, p = ${p}): P(X ≤ ${k}) (4 dec)?`,
        answer: String(ans),
        explanation: `Sum P(X = i) for i = 0..${k} ≈ ${ans}.`
      };
    }
    case 2: {
      const n = randInt(rng, 50, 400) * (1 + Math.floor(lvl / 5));
      const p = roundTo(randInt(rng, 15, 85) / 100, 2);
      const mu = roundTo(n * p, 2);
      return {
        question: `Binomial(n = ${n}, p = ${p}): Mean μ = np (2 dec)?`,
        answer: String(mu),
        explanation: `${n} × ${p} = ${mu}.`
      };
    }
    case 3: {
      const n = randInt(rng, 50, 400) * (1 + Math.floor(lvl / 5));
      const p = roundTo(randInt(rng, 15, 85) / 100, 2);
      const sd = roundTo(Math.sqrt(n * p * (1 - p)), 3);
      return {
        question: `Binomial(n = ${n}, p = ${p}): SD σ = √[np(1-p)] (3 dec)?`,
        answer: String(sd),
        explanation: `√[${n}(${p})(${roundTo(1 - p, 2)})] ≈ ${sd}.`
      };
    }
    case 4: {
      const p = pickOne(rng, [0.05, 0.1, 0.2, 0.25, 0.4]);
      const minN = Math.ceil(10 / p);
      return {
        question: `Binomial p = ${p}: smallest integer n for np ≥ 10?`,
        answer: String(minN),
        explanation: `${p}n ≥ 10 → n ≥ ${minN}.`
      };
    }
    case 5: {
      const p = pickOne(rng, [0.75, 0.8, 0.85, 0.9]);
      const q = roundTo(1 - p, 2);
      const minN = Math.ceil(10 / q);
      return {
        question: `Binomial p = ${p}: smallest integer n for n(1 - p) ≥ 10?`,
        answer: String(minN),
        explanation: `${q}n ≥ 10 → n ≥ ${minN}.`
      };
    }
    case 6: {
      const p = pickOne(rng, [0.2, 0.25, 0.4, 0.5]);
      const n = randInt(rng, 20, 100);
      const mu = n * p;
      return {
        question: `Binomial with p = ${p} has mean μ = ${mu}. Trials n?`,
        answer: String(n),
        explanation: `${mu} / ${p} = ${n}.`
      };
    }
    default: {
      const n = randInt(rng, 3, 7);
      const p = pickOne(rng, [0.2, 0.25, 0.5]);
      const pZeroPct = roundTo(Math.pow(1 - p, n) * 100, 2);
      return {
        question: `Binomial(n = ${n}, p = ${p}): % chance of 0 successes (2 dec)?`,
        answer: String(pZeroPct),
        explanation: `(${roundTo(1 - p, 2)})^${n} × 100 = ${pZeroPct}%.`
      };
    }
  }
}

// 14. Geometric Probability Distributions
function unit14Geometric(lvl, rng, arch) {
  switch (arch) {
    case 0: {
      const p = pickOne(rng, [0.05, 0.1, 0.125, 0.2, 0.25, 0.4, 0.5]);
      const ev = roundTo(1 / p, 2);
      return {
        question: `Geometric p = ${p}: expected trials to 1st success 1/p?`,
        answer: String(ev),
        explanation: `1 / ${p} = ${ev}.`
      };
    }
    case 1: {
      const p = pickOne(rng, [0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
      const k = randInt(rng, 2, 6) + Math.floor(lvl / 7);
      const prob = roundTo(Math.pow(1 - p, k - 1) * p, 4);
      return {
        question: `Geometric p = ${p}: P(X = ${k}) (1st success on trial ${k}, 4 dec)?`,
        answer: String(prob),
        explanation: `(${roundTo(1 - p, 2)})^${k - 1}(${p}) ≈ ${prob}.`
      };
    }
    case 2: {
      const p = pickOne(rng, [0.1, 0.2, 0.25, 0.3, 0.4]);
      const k = randInt(rng, 2, 5);
      const probMore = roundTo(Math.pow(1 - p, k), 4);
      return {
        question: `Geometric p = ${p}: P(X > ${k}) (4 dec)?`,
        answer: String(probMore),
        explanation: `(${roundTo(1 - p, 2)})^${k} ≈ ${probMore}.`
      };
    }
    case 3: {
      const p = pickOne(rng, [0.1, 0.2, 0.25, 0.3, 0.4]);
      const k = randInt(rng, 2, 5);
      const probWithin = roundTo(1 - Math.pow(1 - p, k), 4);
      return {
        question: `Geometric p = ${p}: P(X ≤ ${k}) (4 dec)?`,
        answer: String(probWithin),
        explanation: `1 - (${roundTo(1 - p, 2)})^${k} ≈ ${probWithin}.`
      };
    }
    case 4: {
      const p = pickOne(rng, [0.1, 0.2, 0.25, 0.4, 0.5]);
      const sd = roundTo(Math.sqrt(1 - p) / p, 3);
      return {
        question: `Geometric p = ${p}: SD σ = √(1-p)/p (3 dec)?`,
        answer: String(sd),
        explanation: `√${roundTo(1 - p, 2)} / ${p} ≈ ${sd}.`
      };
    }
    case 5: {
      const expectedTrials = randInt(rng, 4, 20) + lvl;
      const p = roundTo(1 / expectedTrials, 4);
      return {
        question: `Geometric mean is ${expectedTrials} trials. Success prob p (4 dec)?`,
        answer: String(p),
        explanation: `1 / ${expectedTrials} ≈ ${p}.`
      };
    }
    case 6: {
      const pMake = pickOne(rng, [0.6, 0.75, 0.8, 0.9]);
      const pMiss = roundTo(1 - pMake, 2);
      const expBeforeMiss = roundTo(1 / pMiss, 2);
      return {
        question: `${pMake * 100}% free-throw maker. Expected shots until 1st miss?`,
        answer: String(expBeforeMiss),
        explanation: `1 / ${pMiss} = ${expBeforeMiss}.`
      };
    }
    default: {
      const k = randInt(rng, 2, 5);
      const probAllMiss = roundTo(Math.pow(5 / 6, k), 4);
      return {
        question: `Fair die: prob of no 6 in first ${k} rolls (4 dec)?`,
        answer: String(probAllMiss),
        explanation: `(5/6)^${k} ≈ ${probAllMiss}.`
      };
    }
  }
}

// 15. Sampling Distributions for Proportions
function unit15SamplingDistProportions(lvl, rng, arch) {
  const nBase = randInt(rng, 80, 600) * (1 + Math.floor((lvl - 1) / 4));
  switch (arch) {
    case 0: {
      const p = roundTo(randInt(rng, 15, 85) / 100, 2);
      const se = roundTo(Math.sqrt((p * (1 - p)) / nBase), 4);
      return {
        question: `p = ${p}, n = ${nBase}. SD of p̂: √[p(1-p)/n] (4 dec)?`,
        answer: String(se),
        explanation: `√[${p}(${roundTo(1 - p, 2)})/${nBase}] ≈ ${se}.`
      };
    }
    case 1: {
      const p = roundTo(randInt(rng, 10, 90) / 100, 2);
      return {
        question: `p = ${p}, n = ${nBase}. Mean μ_p̂ of sampling distribution?`,
        answer: String(p),
        explanation: `μ_p̂ = p = ${p}.`
      };
    }
    case 2: {
      const p = pickOne(rng, [0.3, 0.4, 0.5, 0.6, 0.7]);
      const n = randInt(rng, 150, 800);
      const se = Math.sqrt((p * (1 - p)) / n);
      const offsetZ = roundTo(randInt(rng, 5, 22) / 10, 1);
      const cutoff = roundTo(p + offsetZ * se, 3);
      const tailProb = roundTo(1 - normalCdf(offsetZ), 4);
      return {
        question: `p = ${p}, n = ${n}: P(p̂ > ${cutoff}) (4 dec)?`,
        answer: String(tailProb),
        explanation: `z ≈ ${offsetZ} → 1 - Φ(${offsetZ}) ≈ ${tailProb}.`
      };
    }
    case 3: {
      const factor = pickOne(rng, [2, 3, 4]);
      return {
        question: `Multiply n by what factor to cut SD of p̂ by 1/${factor}?`,
        answer: String(factor * factor),
        explanation: `${factor}² = ${factor * factor}.`
      };
    }
    case 4: {
      const n1 = randInt(rng, 50, 200);
      const mult = pickOne(rng, [4, 9]);
      const se1 = roundTo(randInt(rng, 3, 12) / 100, 2);
      const se2 = roundTo(se1 / Math.sqrt(mult), 4);
      return {
        question: `n = ${n1} gives SD = ${se1}. New SD if n = ${n1 * mult} (4 dec)?`,
        answer: String(se2),
        explanation: `${se1} / √${mult} = ${se2}.`
      };
    }
    case 5: {
      const p1 = roundTo(randInt(rng, 30, 70) / 100, 2);
      const p2 = roundTo(randInt(rng, 30, 70) / 100, 2);
      const n1 = randInt(rng, 80, 250);
      const n2 = randInt(rng, 80, 250);
      const varDiff = roundTo((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2, 5);
      return {
        question: `p₁ = ${p1}, n₁ = ${n1}; p₂ = ${p2}, n₂ = ${n2}. Var(p̂₁ - p̂₂) (5 dec)?`,
        answer: String(varDiff),
        explanation: `${p1}(${roundTo(1 - p1, 2)})/${n1} + ${p2}(${roundTo(1 - p2, 2)})/${n2} ≈ ${varDiff}.`
      };
    }
    case 6: {
      const x1 = randInt(rng, 25, 90);
      const n1 = randInt(rng, 100, 250);
      const x2 = randInt(rng, 25, 90);
      const n2 = randInt(rng, 100, 250);
      const pooled = roundTo((x1 + x2) / (n1 + n2), 4);
      return {
        question: `x₁ = ${x1} of ${n1}, x₂ = ${x2} of ${n2}. Pooled p̂_c (4 dec)?`,
        answer: String(pooled),
        explanation: `(${x1} + ${x2}) / (${n1} + ${n2}) ≈ ${pooled}.`
      };
    }
    default: {
      const p = pickOne(rng, [0.02, 0.04, 0.05, 0.08, 0.1]);
      const minN = Math.ceil(10 / p);
      return {
        question: `p = ${p}: minimum n for np ≥ 10?`,
        answer: String(minN),
        explanation: `10 / ${p} = ${10 / p} → ${minN}.`
      };
    }
  }
}

// 16. Sampling Distributions for Means and Central Limit Theorem
function unit16SamplingDistMeansClt(lvl, rng, arch) {
  const mu = randInt(rng, 50, 250) + lvl * 3;
  const sigma = randInt(rng, 6, 40) + lvl;
  switch (arch) {
    case 0: {
      const n = pickOne(rng, [4, 9, 16, 25, 36, 49, 64, 100]);
      const se = roundTo(sigma / Math.sqrt(n), 3);
      return {
        question: `σ = ${sigma}, n = ${n}. SD of x̄: σ / √n (3 dec)?`,
        answer: String(se),
        explanation: `${sigma} / √${n} ≈ ${se}.`
      };
    }
    case 1: {
      const n = randInt(rng, 20, 200);
      return {
        question: `μ = ${mu}, σ = ${sigma}, n = ${n}. Mean μ_x̄ of x̄?`,
        answer: String(mu),
        explanation: `μ_x̄ = μ = ${mu}.`
      };
    }
    case 2: {
      const n = pickOne(rng, [25, 36, 49, 64, 100]);
      const se = sigma / Math.sqrt(n);
      const z = roundTo(randInt(rng, -22, 22) / 10, 1);
      const xBarCut = roundTo(mu + z * se, 2);
      const prob = roundTo(normalCdf(z), 4);
      return {
        question: `μ = ${mu}, σ = ${sigma}, n = ${n}: P(x̄ < ${xBarCut}) (4 dec)?`,
        answer: String(prob),
        explanation: `z ≈ ${z} → Φ(${z}) ≈ ${prob}.`
      };
    }
    case 3: {
      const targetSe = pickOne(rng, [1, 2, 2.5, 4, 5]);
      const reqN = Math.ceil(Math.pow(sigma / targetSe, 2));
      return {
        question: `σ = ${sigma}: smallest n so σ / √n ≤ ${targetSe}?`,
        answer: String(reqN),
        explanation: `(${sigma}/${targetSe})² = ${roundTo(Math.pow(sigma / targetSe, 2), 2)} → ${reqN}.`
      };
    }
    case 4: {
      const s1 = randInt(rng, 6, 18);
      const n1 = pickOne(rng, [9, 16, 25, 36]);
      const s2 = randInt(rng, 6, 18);
      const n2 = pickOne(rng, [9, 16, 25, 36]);
      const seDiff = roundTo(Math.sqrt((s1 * s1) / n1 + (s2 * s2) / n2), 3);
      return {
        question: `σ₁ = ${s1}, n₁ = ${n1}; σ₂ = ${s2}, n₂ = ${n2}. SD of (x̄₁ - x̄₂) (3 dec)?`,
        answer: String(seDiff),
        explanation: `√(${s1}²/${n1} + ${s2}²/${n2}) ≈ ${seDiff}.`
      };
    }
    case 5: {
      const nSmall = randInt(rng, 4, 16);
      const seSmall = roundTo(randInt(rng, 4, 20) / 2, 2);
      const popSd = roundTo(seSmall * Math.sqrt(nSmall), 2);
      return {
        question: `n = ${nSmall} has SD of x̄ equal to ${seSmall}. Population σ (2 dec)?`,
        answer: String(popSd),
        explanation: `${seSmall} × √${nSmall} ≈ ${popSd}.`
      };
    }
    case 6: {
      const mult = pickOne(rng, [4, 9, 16]);
      const origSe = roundTo(randInt(rng, 8, 32) / 2, 1);
      return {
        question: `After multiplying n by ${mult}, SD of x̄ is ${origSe}. Prior SD of x̄ (2 dec)?`,
        answer: String(roundTo(origSe * Math.sqrt(mult), 2)),
        explanation: `${origSe} × √${mult} = ${roundTo(origSe * Math.sqrt(mult), 2)}.`
      };
    }
    default: {
      const n = pickOne(rng, [25, 36, 49, 64]);
      const se = sigma / Math.sqrt(n);
      const z = roundTo(randInt(rng, 10, 28) / 10, 1) * (rng() < 0.5 ? 1 : -1);
      const xBarObs = roundTo(mu + z * se, 2);
      return {
        question: `μ = ${mu}, σ = ${sigma}, n = ${n}: z-score for x̄ = ${xBarObs} (2 dec)?`,
        answer: String(z),
        explanation: `(${xBarObs} - ${mu}) / (${sigma}/√${n}) ≈ ${z}.`
      };
    }
  }
}

// 17. Confidence Intervals for a Single Proportion
function unit17CiSingleProportion(lvl, rng, arch) {
  const zMap = { 90: 1.645, 95: 1.96, 99: 2.576 };
  switch (arch) {
    case 0: {
      const n = randInt(rng, 80, 1200) * (1 + Math.floor(lvl / 6));
      const pHat = roundTo(randInt(rng, 20, 80) / 100, 2);
      const conf = pickOne(rng, [90, 95, 99]);
      const zStar = zMap[conf];
      const me = roundTo(zStar * Math.sqrt((pHat * (1 - pHat)) / n), 4);
      return {
        question: `p̂ = ${pHat}, n = ${n}. Margin of error for ${conf}% CI (z* = ${zStar}, 4 dec)?`,
        answer: String(me),
        explanation: `${zStar} × √[${pHat}(${roundTo(1 - pHat, 2)})/${n}] ≈ ${me}.`
      };
    }
    case 1: {
      const lo = roundTo(randInt(rng, 15, 55) / 100, 2);
      const width = roundTo(randInt(rng, 6, 24) / 100, 2);
      const hi = roundTo(lo + width, 2);
      const pHat = roundTo((lo + hi) / 2, 3);
      return {
        question: `CI for p is (${lo}, ${hi}). Point estimate p̂ (3 dec)?`,
        answer: String(pHat),
        explanation: `(${lo} + ${hi}) / 2 = ${pHat}.`
      };
    }
    case 2: {
      const lo = roundTo(randInt(rng, 15, 55) / 100, 2);
      const width = roundTo(randInt(rng, 6, 24) / 100, 2);
      const hi = roundTo(lo + width, 2);
      const me = roundTo(width / 2, 3);
      return {
        question: `CI for p is (${lo}, ${hi}). Margin of error (3 dec)?`,
        answer: String(me),
        explanation: `(${hi} - ${lo}) / 2 = ${me}.`
      };
    }
    case 3: {
      const me = pickOne(rng, [0.02, 0.025, 0.04, 0.05]);
      const conf = pickOne(rng, [90, 95, 99]);
      const zStar = zMap[conf];
      const nReq = Math.ceil(Math.pow(zStar / me, 2) * 0.25);
      return {
        question: `Conservative n (p* = 0.5) for ME ≤ ${me} at ${conf}% (z* = ${zStar})?`,
        answer: String(nReq),
        explanation: `(${zStar}/${me})² × 0.25 → ${nReq}.`
      };
    }
    case 4: {
      const pilotP = pickOne(rng, [0.2, 0.25, 0.3, 0.4]);
      const zStar = 2;
      const me = pickOne(rng, [0.04, 0.05]);
      const nReq = Math.ceil(Math.pow(zStar / me, 2) * pilotP * (1 - pilotP));
      return {
        question: `Use p̂ = ${pilotP}, z* = ${zStar}, ME = ${me}: sample size n?`,
        answer: String(nReq),
        explanation: `(${zStar}/${me})²(${pilotP})(${roundTo(1 - pilotP, 2)}) = ${nReq}.`
      };
    }
    case 5: {
      const n = randInt(rng, 100, 600) * (1 + Math.floor(lvl / 6));
      const x = Math.round(n * (randInt(rng, 25, 75) / 100));
      const pHat = roundTo(x / n, 4);
      return {
        question: `${x} successes out of n = ${n}. Sample proportion p̂ (4 dec)?`,
        answer: String(pHat),
        explanation: `${x} / ${n} ≈ ${pHat}.`
      };
    }
    case 6: {
      const conf = pickOne(rng, [90, 95, 99]);
      return {
        question: `Critical value z* for a ${conf}% confidence interval (3 dec)?`,
        answer: String(zMap[conf]),
        explanation: `${conf}% CI uses z* = ${zMap[conf]}.`
      };
    }
    default: {
      const zStar = pickOne(rng, [1.645, 1.96, 2.576]);
      const se = roundTo(randInt(rng, 10, 45) / 1000, 3);
      const totalWidth = roundTo(2 * zStar * se, 5);
      return {
        question: `z* = ${zStar}, SE = ${se}. Full CI width (5 dec)?`,
        answer: String(totalWidth),
        explanation: `2 × ${zStar} × ${se} = ${totalWidth}.`
      };
    }
  }
}

// 18. Confidence Intervals for a Single Mean
function unit18CiSingleMean(lvl, rng, arch) {
  const xBar = randInt(rng, 40, 200) + lvl * 2;
  switch (arch) {
    case 0: {
      const n = randInt(rng, 8, 60) + lvl;
      return {
        question: `One-sample t-interval with n = ${n}. Degrees of freedom df?`,
        answer: String(n - 1),
        explanation: `${n} - 1 = ${n - 1}.`
      };
    }
    case 1: {
      const n = pickOne(rng, [9, 16, 25, 36, 49, 64]);
      const s = randInt(rng, 4, 24) * (1 + Math.floor(lvl / 6));
      const se = roundTo(s / Math.sqrt(n), 3);
      return {
        question: `s = ${s}, n = ${n}. Standard error s / √n (3 dec)?`,
        answer: String(se),
        explanation: `${s} / √${n} ≈ ${se}.`
      };
    }
    case 2: {
      const n = pickOne(rng, [9, 16, 25, 36, 49]);
      const s = randInt(rng, 5, 20);
      const tStar = roundTo(randInt(rng, 170, 280) / 100, 2);
      const me = roundTo(tStar * (s / Math.sqrt(n)), 3);
      return {
        question: `x̄ = ${xBar}, s = ${s}, n = ${n}, t* = ${tStar}. Margin of error (3 dec)?`,
        answer: String(me),
        explanation: `${tStar} × (${s}/√${n}) ≈ ${me}.`
      };
    }
    case 3: {
      const me = roundTo(randInt(rng, 15, 120) / 10, 1);
      const lo = roundTo(xBar - me, 1);
      const hi = roundTo(xBar + me, 1);
      return {
        question: `t-interval for μ is (${lo}, ${hi}). Sample mean x̄ (1 dec)?`,
        answer: String(roundTo(xBar, 1)),
        explanation: `(${lo} + ${hi}) / 2 = ${roundTo(xBar, 1)}.`
      };
    }
    case 4: {
      const me = roundTo(randInt(rng, 15, 120) / 10, 1);
      const lo = roundTo(xBar - me, 1);
      const hi = roundTo(xBar + me, 1);
      return {
        question: `t-interval for μ is (${lo}, ${hi}). Margin of error (1 dec)?`,
        answer: String(me),
        explanation: `(${hi} - ${lo}) / 2 = ${me}.`
      };
    }
    case 5: {
      const me = roundTo(randInt(rng, 20, 90) / 10, 1);
      const lo = roundTo(xBar - me, 1);
      const hi = roundTo(xBar + me, 1);
      return {
        question: `CI for μ is (${lo}, ${hi}). Interval width (1 dec)?`,
        answer: String(roundTo(hi - lo, 1)),
        explanation: `${hi} - ${lo} = ${roundTo(hi - lo, 1)}.`
      };
    }
    case 6: {
      const n = pickOne(rng, [9, 16, 25, 36]);
      const se = roundTo(randInt(rng, 2, 12) + lvl * 0.25, 2);
      const s = roundTo(se * Math.sqrt(n), 2);
      return {
        question: `n = ${n}, SE = ${se}. Sample SD s (2 dec)?`,
        answer: String(s),
        explanation: `${se} × √${n} = ${s}.`
      };
    }
    default: {
      const tStar = roundTo(randInt(rng, 180, 275) / 100, 2);
      const me = roundTo(randInt(rng, 30, 150) / 10, 1);
      const se = roundTo(me / tStar, 3);
      return {
        question: `ME = ${me}, t* = ${tStar}. Standard error SE (3 dec)?`,
        answer: String(se),
        explanation: `${me} / ${tStar} ≈ ${se}.`
      };
    }
  }
}

// 19. Significance Testing (Hypothesis Testing) for Proportions
function unit19TestProportions(lvl, rng, arch) {
  switch (arch) {
    case 0: {
      const p0 = pickOne(rng, [0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75]);
      const n = randInt(rng, 80, 1000) * (1 + Math.floor(lvl / 6));
      const pHat = roundTo(p0 + randInt(rng, -12, 12) / 100, 2);
      const clampedPHat = Math.min(0.95, Math.max(0.05, pHat));
      const se0 = Math.sqrt((p0 * (1 - p0)) / n);
      const zStat = roundTo((clampedPHat - p0) / se0, 2);
      return {
        question: `H₀: p = ${p0}, n = ${n}, p̂ = ${clampedPHat}. Test statistic z (2 dec)?`,
        answer: String(zStat),
        explanation: `SE₀ = √[${p0}(${roundTo(1 - p0, 2)})/${n}]; z ≈ ${zStat}.`
      };
    }
    case 1: {
      const z = roundTo(randInt(rng, 80, 310) / 100, 2) * (rng() < 0.5 ? 1 : -1);
      const pValTwo = roundTo(2 * (1 - normalCdf(Math.abs(z))), 4);
      return {
        question: `Two-sided test (Hₐ: p ≠ p₀) with z = ${z}. p-value (4 dec)?`,
        answer: String(pValTwo),
        explanation: `2 × [1 - Φ(${Math.abs(z)})] ≈ ${pValTwo}.`
      };
    }
    case 2: {
      const z = roundTo(randInt(rng, 80, 300) / 100, 2);
      const pValUpper = roundTo(1 - normalCdf(z), 4);
      return {
        question: `Right-tail test (Hₐ: p > p₀) with z = ${z}. p-value (4 dec)?`,
        answer: String(pValUpper),
        explanation: `1 - Φ(${z}) ≈ ${pValUpper}.`
      };
    }
    case 3: {
      const z = -roundTo(randInt(rng, 80, 300) / 100, 2);
      const pValLower = roundTo(normalCdf(z), 4);
      return {
        question: `Left-tail test (Hₐ: p < p₀) with z = ${z}. p-value (4 dec)?`,
        answer: String(pValLower),
        explanation: `Φ(${z}) ≈ ${pValLower}.`
      };
    }
    case 4: {
      const oneTailedP = roundTo(randInt(rng, 5, 450) / 10000, 4);
      const twoTailedP = roundTo(oneTailedP * 2, 4);
      return {
        question: `One-tailed p-value = ${oneTailedP}. Two-tailed p-value (4 dec)?`,
        answer: String(twoTailedP),
        explanation: `2 × ${oneTailedP} = ${twoTailedP}.`
      };
    }
    case 5: {
      const power = roundTo(randInt(rng, 65, 95) / 100, 2);
      const beta = roundTo(1 - power, 2);
      return {
        question: `Power = ${power}. Type II error prob β (2 dec)?`,
        answer: String(beta),
        explanation: `1 - ${power} = ${beta}.`
      };
    }
    case 6: {
      const beta = roundTo(randInt(rng, 5, 35) / 100, 2);
      const power = roundTo(1 - beta, 2);
      return {
        question: `Type II error prob β = ${beta}. Power (2 dec)?`,
        answer: String(power),
        explanation: `1 - ${beta} = ${power}.`
      };
    }
    default: {
      const p0 = pickOne(rng, [0.25, 0.4, 0.5, 0.6]);
      const n = pickOne(rng, [100, 225, 400]);
      const se0 = Math.sqrt((p0 * (1 - p0)) / n);
      const z = roundTo(randInt(rng, -25, 25) / 10, 1);
      const pHatObserved = roundTo(p0 + z * se0, 4);
      return {
        question: `H₀: p = ${p0}, n = ${n}, z = ${z}. Observed p̂ (4 dec)?`,
        answer: String(pHatObserved),
        explanation: `${p0} + (${z})(${roundTo(se0, 4)}) ≈ ${pHatObserved}.`
      };
    }
  }
}

// 20. Significance Testing (Hypothesis Testing) for Means, Chi-Square, and Slope
function unit20TestMeansChiSquareSlope(lvl, rng, arch) {
  switch (arch) {
    case 0: {
      const mu0 = randInt(rng, 40, 200) + lvl * 2;
      const n = pickOne(rng, [9, 16, 25, 36, 49]);
      const s = randInt(rng, 4, 20);
      const se = s / Math.sqrt(n);
      const tStat = roundTo(randInt(rng, -30, 30) / 10, 1);
      const xBar = roundTo(mu0 + tStat * se, 2);
      return {
        question: `H₀: μ = ${mu0}, n = ${n}, x̄ = ${xBar}, s = ${s}. Test stat t (2 dec)?`,
        answer: String(tStat),
        explanation: `(${xBar} - ${mu0}) / (${s}/√${n}) ≈ ${tStat}.`
      };
    }
    case 1: {
      const n1 = randInt(rng, 10, 30) + lvl;
      const n2 = randInt(rng, 10, 30) + lvl;
      const dfConservative = Math.min(n1 - 1, n2 - 1);
      return {
        question: `Two-sample t-test: n₁ = ${n1}, n₂ = ${n2}. Smaller df min(n₁-1, n₂-1)?`,
        answer: String(dfConservative),
        explanation: `min(${n1 - 1}, ${n2 - 1}) = ${dfConservative}.`
      };
    }
    case 2: {
      const rows = randInt(rng, 2, 5);
      const cols = randInt(rng, 2, 5);
      const df = (rows - 1) * (cols - 1);
      return {
        question: `Chi-square independence on ${rows} × ${cols} table. df?`,
        answer: String(df),
        explanation: `(${rows} - 1)(${cols} - 1) = ${df}.`
      };
    }
    case 3: {
      const cats = randInt(rng, 3, 8) + Math.floor(lvl / 5);
      return {
        question: `Chi-square GOF with ${cats} categories. df?`,
        answer: String(cats - 1),
        explanation: `${cats} - 1 = ${cats - 1}.`
      };
    }
    case 4: {
      const expCount = randInt(rng, 15, 60) * (1 + Math.floor(lvl / 6));
      const obsCount = expCount + randInt(rng, -12, 12);
      const comp = roundTo(Math.pow(obsCount - expCount, 2) / expCount, 3);
      return {
        question: `Observed O = ${obsCount}, Expected E = ${expCount}. Cell (O - E)² / E (3 dec)?`,
        answer: String(comp),
        explanation: `(${obsCount} - ${expCount})² / ${expCount} ≈ ${comp}.`
      };
    }
    case 5: {
      const rowTot = randInt(rng, 30, 120) * (1 + Math.floor(lvl / 6));
      const colTot = randInt(rng, 30, 120) * (1 + Math.floor(lvl / 6));
      const grandTot = rowTot + colTot + randInt(rng, 40, 200);
      const expected = roundTo((rowTot * colTot) / grandTot, 2);
      return {
        question: `Row total = ${rowTot}, Col total = ${colTot}, Grand total = ${grandTot}. Expected E (2 dec)?`,
        answer: String(expected),
        explanation: `(${rowTot} × ${colTot}) / ${grandTot} ≈ ${expected}.`
      };
    }
    case 6: {
      const nPairs = randInt(rng, 10, 45) + lvl;
      return {
        question: `Slope t-test with n = ${nPairs} pairs. df = n - 2?`,
        answer: String(nPairs - 2),
        explanation: `${nPairs} - 2 = ${nPairs - 2}.`
      };
    }
    default: {
      const slopeB = roundTo((randInt(rng, 5, 45) / 10) * (rng() < 0.4 ? -1 : 1), 1);
      const seB = roundTo(randInt(rng, 2, 15) / 10, 1);
      const tSlope = roundTo(slopeB / seB, 2);
      return {
        question: `Slope b = ${slopeB}, SE_b = ${seB}. Test stat t = b / SE_b (2 dec)?`,
        answer: String(tSlope),
        explanation: `${slopeB} / ${seB} ≈ ${tSlope}.`
      };
    }
  }
}

export { STATISTICS_UNITS, generateStatistics };