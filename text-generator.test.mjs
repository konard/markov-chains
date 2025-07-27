import { expect, test, describe, beforeAll } from "bun:test";
import { getNextState, generateSequence, sequenceToString } from './text-generator.mjs';
import { storeAllTransitionCounts, clearMarkovData } from './markov-clink-storage.mjs';

describe("text generator", () => {
  beforeAll(() => {
    clearMarkovData();
    // Set up test data with predictable probabilities
    storeAllTransitionCounts({
      'V_C': 8,  // 80% chance V->C
      'V_V': 2,  // 20% chance V->V
      'C_V': 9,  // 90% chance C->V
      'C_C': 1   // 10% chance C->C
    });
  });

  test("getNextState selects based on probabilities", () => {
    const probabilities = {
      'V_C': 0.8,
      'V_V': 0.2,
      'C_V': 0.9,
      'C_C': 0.1
    };
    
    // Test multiple times to check randomness
    const results = { C: 0, V: 0 };
    for (let i = 0; i < 100; i++) {
      const next = getNextState('V', probabilities);
      results[next]++;
    }
    
    // With 80% V->C probability, we expect mostly C
    expect(results.C).toBeGreaterThan(results.V);
  });

  test("generateSequence creates valid sequences", () => {
    const sequence = generateSequence('V', 10);
    
    expect(sequence[0]).toBe('V');
    expect(sequence.length).toBeLessThanOrEqual(10);
    
    // All elements should be V or C
    for (const state of sequence) {
      expect(['V', 'C']).toContain(state);
    }
  });

  test("sequenceToString converts to letters", () => {
    const sequence = ['V', 'C', 'V', 'C'];
    const result = sequenceToString(sequence);
    
    expect(result.length).toBe(4);
    expect(result[0]).toMatch(/[aeiou]/);
    expect(result[1]).toMatch(/[bcdfghjklmnpqrstvwxyz]/);
    expect(result[2]).toMatch(/[aeiou]/);
    expect(result[3]).toMatch(/[bcdfghjklmnpqrstvwxyz]/);
  });
});