import { expect, test, describe, beforeEach } from "bun:test";
import { 
  clearMarkovData, 
  storeTransitionCount, 
  getTransitionCounts,
  storeAllTransitionCounts 
} from './markov-clink-storage.mjs';

describe("markov clink storage", () => {
  beforeEach(() => {
    clearMarkovData();
  });

  test("storeTransitionCount stores a transition", () => {
    storeTransitionCount('V', 'C', 10);
    const counts = getTransitionCounts();
    expect(counts['V_C']).toBe(10);
  });

  test("storeTransitionCount updates existing transition", () => {
    storeTransitionCount('V', 'C', 10);
    storeTransitionCount('V', 'C', 15);
    const counts = getTransitionCounts();
    expect(counts['V_C']).toBe(15);
    expect(Object.keys(counts).length).toBe(1);
  });

  test("getTransitionCounts retrieves all transitions", () => {
    storeTransitionCount('V', 'C', 10);
    storeTransitionCount('C', 'V', 8);
    storeTransitionCount('V', 'V', 3);
    
    const counts = getTransitionCounts();
    expect(counts).toEqual({
      'V_C': 10,
      'C_V': 8,
      'V_V': 3
    });
  });

  test("storeAllTransitionCounts replaces all data", () => {
    // Store some initial data
    storeTransitionCount('V', 'C', 5);
    
    // Store new data
    const newCounts = {
      'C_C': 12,
      'C_V': 7,
      'V_V': 4
    };
    storeAllTransitionCounts(newCounts);
    
    const counts = getTransitionCounts();
    expect(counts).toEqual(newCounts);
    expect(counts['V_C']).toBeUndefined();
  });

  test("clearMarkovData removes all markov links", () => {
    storeTransitionCount('V', 'C', 10);
    storeTransitionCount('C', 'V', 8);
    
    clearMarkovData();
    
    const counts = getTransitionCounts();
    expect(counts).toEqual({});
  });
});