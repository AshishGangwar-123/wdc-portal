/* ==========================================================================
   CodeFuel v2 — Code Gates Data
   Expression → 3 answer options (one correct, two wrong)
   Replaces MCQ questions — these are the obstacles you fly through
   ========================================================================== */

const codeGates = [
  // ═══════════════════════════════════════════════════════════════════════
  // TIER 1 — ROOKIE (Basic expressions)
  // ═══════════════════════════════════════════════════════════════════════
  { tier: 1, expr: '2 + 3',           correct: '5',       wrongs: ['23', '6'] },
  { tier: 1, expr: '10 - 4',          correct: '6',       wrongs: ['14', '4'] },
  { tier: 1, expr: '3 * 7',           correct: '21',      wrongs: ['10', '37'] },
  { tier: 1, expr: '8 / 2',           correct: '4.0',     wrongs: ['4', '16'] },
  { tier: 1, expr: '10 // 3',         correct: '3',       wrongs: ['3.33', '4'] },
  { tier: 1, expr: '10 % 3',          correct: '1',       wrongs: ['3', '0'] },
  { tier: 1, expr: '2 ** 3',          correct: '8',       wrongs: ['6', '23'] },
  { tier: 1, expr: '5 > 3',           correct: 'True',    wrongs: ['False', '5'] },
  { tier: 1, expr: '4 == 4',          correct: 'True',    wrongs: ['False', '4'] },
  { tier: 1, expr: '7 != 7',          correct: 'False',   wrongs: ['True', '0'] },
  { tier: 1, expr: 'len("hi")',       correct: '2',       wrongs: ['3', '1'] },
  { tier: 1, expr: 'len("code")',     correct: '4',       wrongs: ['3', '5'] },
  { tier: 1, expr: 'type(42).__name__', correct: 'int',   wrongs: ['float', 'str'] },
  { tier: 1, expr: 'type(3.14).__name__', correct: 'float', wrongs: ['int', 'double'] },
  { tier: 1, expr: '"a" + "b"',       correct: '"ab"',    wrongs: ['"a b"', 'Error'] },
  { tier: 1, expr: '"ha" * 3',        correct: '"hahaha"', wrongs: ['"ha3"', 'Error'] },
  { tier: 1, expr: 'bool(0)',         correct: 'False',   wrongs: ['True', '0'] },
  { tier: 1, expr: 'bool(1)',         correct: 'True',    wrongs: ['False', '1'] },
  { tier: 1, expr: 'bool("")',        correct: 'False',   wrongs: ['True', '""'] },
  { tier: 1, expr: 'int("42")',       correct: '42',      wrongs: ['"42"', 'Error'] },
  { tier: 1, expr: 'str(100)',        correct: '"100"',   wrongs: ['100', 'Error'] },
  { tier: 1, expr: 'abs(-7)',         correct: '7',       wrongs: ['-7', '0'] },
  { tier: 1, expr: 'max(1, 5)',       correct: '5',       wrongs: ['1', '6'] },
  { tier: 1, expr: 'min(3, 9)',       correct: '3',       wrongs: ['9', '6'] },
  { tier: 1, expr: 'not True',        correct: 'False',   wrongs: ['True', 'None'] },
  { tier: 1, expr: 'not False',       correct: 'True',    wrongs: ['False', 'None'] },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 2 — CODER (Strings, lists, slicing)
  // ═══════════════════════════════════════════════════════════════════════
  { tier: 2, expr: '"hello"[0]',      correct: '"h"',     wrongs: ['"e"', '"o"'] },
  { tier: 2, expr: '"hello"[-1]',     correct: '"o"',     wrongs: ['"h"', '"l"'] },
  { tier: 2, expr: '"Python"[1:4]',   correct: '"yth"',   wrongs: ['"Pyt"', '"ytho"'] },
  { tier: 2, expr: '"abc".upper()',    correct: '"ABC"',   wrongs: ['"Abc"', '"abc"'] },
  { tier: 2, expr: '"ABC".lower()',    correct: '"abc"',   wrongs: ['"Abc"', '"ABC"'] },
  { tier: 2, expr: '[1,2,3][1]',      correct: '2',       wrongs: ['1', '3'] },
  { tier: 2, expr: '[1,2,3][-1]',     correct: '3',       wrongs: ['1', '-1'] },
  { tier: 2, expr: 'len([1,2,3,4])',  correct: '4',       wrongs: ['3', '5'] },
  { tier: 2, expr: '[1,2,3]+[4]',     correct: '[1,2,3,4]', wrongs: ['[5,2,3]', 'Error'] },
  { tier: 2, expr: '[0]*3',           correct: '[0,0,0]', wrongs: ['[3]', '[0,3]'] },
  { tier: 2, expr: 'sum([1,2,3])',    correct: '6',       wrongs: ['3', '123'] },
  { tier: 2, expr: 'max([3,1,4])',    correct: '4',       wrongs: ['3', '1'] },
  { tier: 2, expr: 'min([3,1,4])',    correct: '1',       wrongs: ['3', '4'] },
  { tier: 2, expr: '"a" in "apple"',  correct: 'True',    wrongs: ['False', '"a"'] },
  { tier: 2, expr: '"z" in "hello"',  correct: 'False',   wrongs: ['True', 'None'] },
  { tier: 2, expr: '"a,b".split(",")', correct: "['a','b']", wrongs: ["['a,b']", "'a b'"] },
  { tier: 2, expr: '"-".join(["a","b"])', correct: '"a-b"', wrongs: ['"ab"', '"a, b"'] },
  { tier: 2, expr: '"hello".count("l")', correct: '2',    wrongs: ['1', '3'] },
  { tier: 2, expr: '"hello".replace("l","L",1)', correct: '"heLlo"', wrongs: ['"heLLo"', '"Hello"'] },
  { tier: 2, expr: 'list(range(4))',   correct: '[0,1,2,3]', wrongs: ['[1,2,3,4]', '[0,1,2,3,4]'] },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 3 — HACKER (Functions, comprehensions, dict)
  // ═══════════════════════════════════════════════════════════════════════
  { tier: 3, expr: 'sorted([3,1,2])', correct: '[1,2,3]', wrongs: ['[3,2,1]', '[3,1,2]'] },
  { tier: 3, expr: 'sorted([3,1,2], reverse=True)', correct: '[3,2,1]', wrongs: ['[1,2,3]', '[2,1,3]'] },
  { tier: 3, expr: '[x**2 for x in range(3)]', correct: '[0,1,4]', wrongs: ['[1,4,9]', '[0,2,4]'] },
  { tier: 3, expr: '[x for x in range(6) if x%2==0]', correct: '[0,2,4]', wrongs: ['[1,3,5]', '[2,4,6]'] },
  { tier: 3, expr: 'list(map(str,[1,2]))', correct: "['1','2']", wrongs: ['[1,2]', "['str']"] },
  { tier: 3, expr: 'list(filter(lambda x:x>2,[1,2,3,4]))', correct: '[3,4]', wrongs: ['[1,2]', '[2,3,4]'] },
  { tier: 3, expr: '(lambda x:x*2)(5)', correct: '10', wrongs: ['25', '7'] },
  { tier: 3, expr: 'dict(a=1,b=2)["b"]', correct: '2', wrongs: ['1', '"b"'] },
  { tier: 3, expr: '{1,2,2,3}', correct: '{1,2,3}', wrongs: ['{1,2,2,3}', '{2}'] },
  { tier: 3, expr: 'len(set([1,1,2,3]))', correct: '3', wrongs: ['4', '2'] },
  { tier: 3, expr: '(1,2)+(3,)', correct: '(1,2,3)', wrongs: ['(1,2,3,)', '6'] },
  { tier: 3, expr: 'all([True,True])', correct: 'True', wrongs: ['False', '[True]'] },
  { tier: 3, expr: 'any([False,True])', correct: 'True', wrongs: ['False', 'None'] },
  { tier: 3, expr: 'all([])', correct: 'True', wrongs: ['False', 'None'] },
  { tier: 3, expr: 'any([])', correct: 'False', wrongs: ['True', 'None'] },
  { tier: 3, expr: '"hello"[::-1]', correct: '"olleh"', wrongs: ['"hello"', '"oellh"'] },
  { tier: 3, expr: 'list(zip([1,2],[3,4]))', correct: '[(1,3),(2,4)]', wrongs: ['[(1,2),(3,4)]', '[1,3,2,4]'] },
  { tier: 3, expr: '{x:x**2 for x in range(3)}[2]', correct: '4', wrongs: ['2', '9'] },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 4 — ARCHITECT (OOP, advanced)
  // ═══════════════════════════════════════════════════════════════════════
  { tier: 4, expr: 'isinstance(True, int)', correct: 'True', wrongs: ['False', 'Error'] },
  { tier: 4, expr: 'type(True).__name__', correct: 'bool', wrongs: ['int', 'True'] },
  { tier: 4, expr: 'round(3.567, 1)', correct: '3.6', wrongs: ['3.5', '4.0'] },
  { tier: 4, expr: 'divmod(17, 5)', correct: '(3, 2)', wrongs: ['(3, 5)', '3.4'] },
  { tier: 4, expr: 'bin(10)', correct: "'0b1010'", wrongs: ["'1010'", "'10'"] },
  { tier: 4, expr: 'hex(255)', correct: "'0xff'", wrongs: ["'ff'", "'255'"] },
  { tier: 4, expr: 'chr(65)', correct: "'A'", wrongs: ["'a'", "'65'"] },
  { tier: 4, expr: 'ord("A")', correct: '65', wrongs: ['97', '41'] },
  { tier: 4, expr: '2 << 3', correct: '16', wrongs: ['8', '6'] },
  { tier: 4, expr: '16 >> 2', correct: '4', wrongs: ['8', '14'] },
  { tier: 4, expr: '5 & 3', correct: '1', wrongs: ['7', '5'] },
  { tier: 4, expr: '5 | 3', correct: '7', wrongs: ['1', '8'] },
  { tier: 4, expr: '5 ^ 3', correct: '6', wrongs: ['8', '2'] },
  { tier: 4, expr: 'sum(range(1,5))', correct: '10', wrongs: ['15', '6'] },

  // ═══════════════════════════════════════════════════════════════════════
  // TIER 5 — LEGENDARY (Tricky edge cases)
  // ═══════════════════════════════════════════════════════════════════════
  { tier: 5, expr: '0.1 + 0.2 == 0.3', correct: 'False', wrongs: ['True', '0.3'] },
  { tier: 5, expr: 'bool(" ")', correct: 'True', wrongs: ['False', '" "'] },
  { tier: 5, expr: 'bool("0")', correct: 'True', wrongs: ['False', '0'] },
  { tier: 5, expr: 'type((1,)).__name__', correct: 'tuple', wrongs: ['int', 'list'] },
  { tier: 5, expr: 'type((1)).__name__', correct: 'int', wrongs: ['tuple', 'list'] },
  { tier: 5, expr: '{True:"a",1:"b"}[True]', correct: '"b"', wrongs: ['"a"', 'Error'] },
  { tier: 5, expr: 'len(range(10**6))', correct: '1000000', wrongs: ['Error', '10'] },
  { tier: 5, expr: '(-1) ** 0.5', correct: 'Error*', wrongs: ['1', '-1'] },
  { tier: 5, expr: '"abc"[::-1][::-1]', correct: '"abc"', wrongs: ['"cba"', '"bca"'] },
  { tier: 5, expr: 'sum(range(11))', correct: '55', wrongs: ['50', '10'] },
  { tier: 5, expr: '3 * "0" == "000"', correct: 'True', wrongs: ['False', '0'] },
  { tier: 5, expr: '[*[1,2], *[3,4]]', correct: '[1,2,3,4]', wrongs: ['[[1,2],[3,4]]', 'Error'] },
];

/**
 * Get a random gate for the given max tier.
 * Returns { tier, expr, options: [{value, isCorrect}, ...] }
 * Options are shuffled across 3 lanes.
 */
export function getRandomGate(maxTier, recentExprs = []) {
  const eligible = codeGates.filter(g => g.tier <= maxTier && !recentExprs.includes(g.expr));
  const pool = eligible.length > 0 ? eligible : codeGates.filter(g => g.tier <= maxTier);

  // Weighted toward higher tiers
  const weighted = pool.flatMap(g => Array(g.tier).fill(g));
  const gate = weighted[Math.floor(Math.random() * weighted.length)];

  // Build 3 options (1 correct + 2 wrong), assign to random lanes
  const allValues = [gate.correct, ...gate.wrongs];
  // Shuffle
  for (let i = allValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allValues[i], allValues[j]] = [allValues[j], allValues[i]];
  }

  const options = allValues.map(v => ({
    value: v,
    isCorrect: v === gate.correct,
  }));

  return {
    tier: gate.tier,
    expr: gate.expr,
    options,
  };
}

export default codeGates;
