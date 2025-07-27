#!/usr/bin/env bun

import { parseTextToStates, getTransitions, countTransitions } from './vowel-consonant-parser.mjs';
import { storeAllTransitionCounts, clearMarkovData } from './markov-clink-storage.mjs';
import { generateSequence, sequenceToString } from './text-generator.mjs';

// Clear any existing data
console.log('Clearing existing Markov data...');
clearMarkovData();

// Simple training text
const trainingText = "hello world";
console.log(`\nTraining with: "${trainingText}"`);

// Parse and count transitions
const states = parseTextToStates(trainingText);
console.log(`Parsed states: ${states.join('')}`);

const transitions = getTransitions(states);
const counts = countTransitions(transitions);
console.log('Transition counts:', counts);

// Store in clink
storeAllTransitionCounts(counts);
console.log('\nStored in clink database!');

// Generate some text
console.log('\nGenerating new text:');
for (let i = 0; i < 5; i++) {
  const startState = Math.random() < 0.5 ? 'V' : 'C';
  const sequence = generateSequence(startState, 15);
  const text = sequenceToString(sequence);
  console.log(`  ${i + 1}. Starting with ${startState}: ${text}`);
}