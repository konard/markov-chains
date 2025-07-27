const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);

export function isVowel(char) {
  return VOWELS.has(char);
}

export function parseTextToStates(text) {
  const states = [];
  
  for (const char of text) {
    if (/[a-zA-Z]/.test(char)) {
      states.push(isVowel(char) ? 'V' : 'C');
    }
  }
  
  return states;
}

export function getTransitions(states) {
  const transitions = [];
  
  for (let i = 0; i < states.length - 1; i++) {
    transitions.push({
      from: states[i],
      to: states[i + 1]
    });
  }
  
  return transitions;
}

export function countTransitions(transitions) {
  const counts = {};
  
  for (const { from, to } of transitions) {
    const key = `${from}_${to}`;
    counts[key] = (counts[key] || 0) + 1;
  }
  
  return counts;
}