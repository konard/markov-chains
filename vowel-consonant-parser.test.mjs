import { expect, test, describe } from "bun:test";
import { isVowel, parseTextToStates, getTransitions, countTransitions } from './vowel-consonant-parser.mjs';

describe("vowel-consonant parser", () => {
  test("isVowel correctly identifies vowels", () => {
    expect(isVowel('a')).toBe(true);
    expect(isVowel('E')).toBe(true);
    expect(isVowel('b')).toBe(false);
    expect(isVowel('Z')).toBe(false);
  });

  test("parseTextToStates converts text to V/C states", () => {
    expect(parseTextToStates("hello")).toEqual(['C', 'V', 'C', 'C', 'V']);
    expect(parseTextToStates("aeiou")).toEqual(['V', 'V', 'V', 'V', 'V']);
    expect(parseTextToStates("bcdfg")).toEqual(['C', 'C', 'C', 'C', 'C']);
    expect(parseTextToStates("a b c")).toEqual(['V', 'C', 'C']); // spaces ignored
  });

  test("getTransitions extracts state transitions", () => {
    const states = ['V', 'C', 'V', 'C'];
    const transitions = getTransitions(states);
    expect(transitions).toEqual([
      { from: 'V', to: 'C' },
      { from: 'C', to: 'V' },
      { from: 'V', to: 'C' }
    ]);
  });

  test("countTransitions counts transition occurrences", () => {
    const transitions = [
      { from: 'V', to: 'C' },
      { from: 'C', to: 'V' },
      { from: 'V', to: 'C' },
      { from: 'C', to: 'C' }
    ];
    const counts = countTransitions(transitions);
    expect(counts).toEqual({
      'V_C': 2,
      'C_V': 1,
      'C_C': 1
    });
  });
});