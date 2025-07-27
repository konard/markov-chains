import { parseTextToStates, getTransitions, countTransitions } from './vowel-consonant-parser.mjs';
import { calculateProbabilities, formatProbabilitiesForDisplay } from './probability-calculator.mjs';
import { storeAllTransitionCounts, clearMarkovData, getTransitionCounts } from './markov-clink-storage.mjs';
import { generateSequence, sequenceToString } from './text-generator.mjs';

function trainMarkovChain(text) {
  console.log('Training Markov chain with text:', text);
  
  // Parse text to V/C states
  const states = parseTextToStates(text);
  console.log('Parsed states:', states.join(''));
  
  // Get transitions
  const transitions = getTransitions(states);
  console.log('Number of transitions:', transitions.length);
  
  // Count transitions
  const counts = countTransitions(transitions);
  console.log('Transition counts:', counts);
  
  // Store in clink
  clearMarkovData();
  storeAllTransitionCounts(counts);
  console.log('Stored in clink database');
  
  // Calculate and display probabilities
  const probabilities = calculateProbabilities(counts);
  const formatted = formatProbabilitiesForDisplay(probabilities);
  console.log('\nTransition probabilities:');
  formatted.forEach(({ from, to, percentage }) => {
    console.log(`  ${from} → ${to}: ${percentage}`);
  });
}

function generateText(startState, length) {
  console.log(`\nGenerating text starting with '${startState}', length ${length}:`);
  
  const sequence = generateSequence(startState, length);
  console.log('Generated sequence:', sequence.join(''));
  
  const text = sequenceToString(sequence);
  console.log('Generated text:', text);
  
  return text;
}

// Demo usage
const sampleText = "Hello world! This is a simple test of the Markov chain system.";

console.log('=== Markov Chain Demo ===\n');

// Train the model
trainMarkovChain(sampleText);

// Generate some text
console.log('\n=== Text Generation ===');
generateText('C', 20);
generateText('V', 20);
generateText('C', 30);

// Verify data is stored in clink
console.log('\n=== Verifying clink storage ===');
const storedCounts = getTransitionCounts();
console.log('Retrieved from clink:', storedCounts);