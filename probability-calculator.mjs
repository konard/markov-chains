export function calculateProbabilities(transitionCounts) {
  const probabilities = {};
  const stateCounts = {};
  
  // First, count total transitions from each state
  for (const [transition, count] of Object.entries(transitionCounts)) {
    const [from] = transition.split('_');
    stateCounts[from] = (stateCounts[from] || 0) + count;
  }
  
  // Calculate probabilities
  for (const [transition, count] of Object.entries(transitionCounts)) {
    const [from] = transition.split('_');
    probabilities[transition] = count / stateCounts[from];
  }
  
  return probabilities;
}

export function formatProbabilitiesForDisplay(probabilities) {
  const formatted = [];
  
  for (const [transition, probability] of Object.entries(probabilities)) {
    const [from, to] = transition.split('_');
    formatted.push({
      from,
      to,
      probability: probability.toFixed(4),
      percentage: (probability * 100).toFixed(2) + '%'
    });
  }
  
  return formatted;
}