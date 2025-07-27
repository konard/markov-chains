import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { parseTextToStates, getTransitions, countTransitions } from './vowel-consonant-parser.mjs';
import { calculateProbabilities } from './probability-calculator.mjs';
import { storeAllTransitionCounts, clearMarkovData, getTransitionCounts } from './markov-clink-storage.mjs';
import { generateSequence } from './text-generator.mjs';
import { execSync } from 'child_process';

function clearAllLinks() {
  try {
    execSync(`clink '(((\$i: \$s \$t)) ())'`, { encoding: 'utf8' });
  } catch (error) {
    // Ignore errors when clearing
  }
}

describe("markov chain integration", () => {
  beforeEach(() => {
    clearAllLinks();
    clearMarkovData();
  });

  afterEach(() => {
    clearAllLinks();
  });

  test("complete workflow from text to generation", () => {
    // Sample text
    const text = "hello world";
    
    // Parse and count
    const states = parseTextToStates(text);
    expect(states).toEqual(['C', 'V', 'C', 'C', 'V', 'C', 'V', 'C', 'C', 'C']);
    
    const transitions = getTransitions(states);
    const counts = countTransitions(transitions);
    expect(counts).toEqual({
      'C_V': 3,
      'V_C': 3,
      'C_C': 3
    });
    
    // Store in clink
    storeAllTransitionCounts(counts);
    
    // Verify storage
    const storedCounts = getTransitionCounts();
    expect(storedCounts).toEqual(counts);
    
    // Calculate probabilities
    const probabilities = calculateProbabilities(storedCounts);
    expect(probabilities['C_V']).toBeCloseTo(3/6, 5); // 3 out of 6 C transitions
    expect(probabilities['C_C']).toBeCloseTo(3/6, 5); // 3 out of 6 C transitions
    expect(probabilities['V_C']).toBeCloseTo(1, 5);   // All V transitions go to C
    
    // Generate sequence
    const sequence = generateSequence('C', 5);
    expect(sequence[0]).toBe('C');
    expect(sequence.every(s => s === 'V' || s === 'C')).toBe(true);
  });
});