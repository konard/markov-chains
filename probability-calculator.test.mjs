import { expect, test, describe } from "bun:test";
import { calculateProbabilities, formatProbabilitiesForDisplay } from './probability-calculator.mjs';

describe("probability calculator", () => {
  test("calculateProbabilities computes correct probabilities", () => {
    const counts = {
      'V_C': 10,
      'V_V': 5,
      'C_V': 8,
      'C_C': 4
    };
    
    const probabilities = calculateProbabilities(counts);
    
    // V transitions: 10 + 5 = 15 total
    expect(probabilities['V_C']).toBeCloseTo(10/15, 5);
    expect(probabilities['V_V']).toBeCloseTo(5/15, 5);
    
    // C transitions: 8 + 4 = 12 total
    expect(probabilities['C_V']).toBeCloseTo(8/12, 5);
    expect(probabilities['C_C']).toBeCloseTo(4/12, 5);
  });

  test("formatProbabilitiesForDisplay formats output correctly", () => {
    const probabilities = {
      'V_C': 0.6667,
      'C_V': 0.75
    };
    
    const formatted = formatProbabilitiesForDisplay(probabilities);
    
    expect(formatted).toEqual([
      { from: 'V', to: 'C', probability: '0.6667', percentage: '66.67%' },
      { from: 'C', to: 'V', probability: '0.7500', percentage: '75.00%' }
    ]);
  });
});