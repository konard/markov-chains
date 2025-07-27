import { createLink, readAllLinks, executeCliink } from './clink-wrapper.mjs';

// We'll use a simpler format: markov_{from}{to} linked to count{value}
// E.g., (markovVC count10) means V->C happened 10 times

export function clearMarkovData() {
  const allLinks = readAllLinks();
  const lines = allLinks.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    if (line.includes('markov')) {
      const match = line.match(/\((\d+): (markov\w+) (count\d+)\)/);
      if (match) {
        const [, index, source, target] = match;
        executeCliink(`((${index}: ${source} ${target})) ()`);
      }
    }
  }
}

export function storeTransitionCount(from, to, count) {
  const key = `markov${from}${to}`;
  const value = `count${count}`;
  
  // First check if link exists and delete it
  const allLinks = readAllLinks();
  const lines = allLinks.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const match = line.match(/\((\d+): (markov\w+) (count\d+)\)/);
    if (match && match[2] === key) {
      const [, index, , oldValue] = match;
      executeCliink(`((${index}: ${key} ${oldValue})) ()`);
      break;
    }
  }
  
  // Create new link with count
  return createLink(key, value);
}

export function getTransitionCounts() {
  const counts = {};
  const allLinks = readAllLinks();
  const lines = allLinks.split('\n').filter(line => line.trim());
  
  for (const line of lines) {
    const match = line.match(/\(\d+: markov(\w)(\w) count(\d+)\)/);
    if (match) {
      const [, from, to, count] = match;
      counts[`${from}_${to}`] = parseInt(count);
    }
  }
  
  return counts;
}

export function storeAllTransitionCounts(transitionCounts) {
  clearMarkovData();
  
  for (const [transition, count] of Object.entries(transitionCounts)) {
    const [from, to] = transition.split('_');
    storeTransitionCount(from, to, count);
  }
}