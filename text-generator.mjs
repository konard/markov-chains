import { getTransitionCounts } from './markov-clink-storage.mjs';
import { calculateProbabilities } from './probability-calculator.mjs';

export function getNextState(currentState, probabilities) {
  const transitions = Object.entries(probabilities)
    .filter(([key]) => key.startsWith(`${currentState}_`))
    .map(([key, prob]) => ({
      to: key.split('_')[1],
      probability: prob
    }));
  
  if (transitions.length === 0) {
    return null;
  }
  
  // Generate random number between 0 and 1
  const rand = Math.random();
  let cumulative = 0;
  
  for (const transition of transitions) {
    cumulative += transition.probability;
    if (rand <= cumulative) {
      return transition.to;
    }
  }
  
  // Fallback (shouldn't happen with proper probabilities)
  return transitions[transitions.length - 1].to;
}

export function generateSequence(startState, length) {
  const counts = getTransitionCounts();
  const probabilities = calculateProbabilities(counts);
  
  if (Object.keys(probabilities).length === 0) {
    throw new Error('No transition data found in clink');
  }
  
  const sequence = [startState];
  let currentState = startState;
  
  for (let i = 1; i < length; i++) {
    const nextState = getNextState(currentState, probabilities);
    if (!nextState) {
      break; // No valid transition found
    }
    sequence.push(nextState);
    currentState = nextState;
  }
  
  return sequence;
}

export function sequenceToString(sequence) {
  // Convert V/C sequence back to readable format
  let result = '';
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
  
  for (const state of sequence) {
    if (state === 'V') {
      result += vowels[Math.floor(Math.random() * vowels.length)];
    } else if (state === 'C') {
      result += consonants[Math.floor(Math.random() * consonants.length)];
    }
  }
  
  return result;
}