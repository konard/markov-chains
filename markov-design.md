# Markov Chain Design for Clink

## Data Structure

For a simple vowel/consonant Markov chain, we'll store:

1. **States**: V (vowel) or C (consonant)
2. **Transitions**: From state -> To state with count

## Storage Format in Clink

We'll use a naming convention:
- Link source: `markov_<from_state>_<to_state>`
- Link target: `<count>`

Example links:
- `(markov_V_C 15)` - Vowel to Consonant happened 15 times
- `(markov_C_V 12)` - Consonant to Vowel happened 12 times
- `(markov_V_V 3)` - Vowel to Vowel happened 3 times
- `(markov_C_C 8)` - Consonant to Consonant happened 8 times

## Operations

1. **Initialize**: Clear all markov_* links
2. **Train**: Parse text and increment counts
3. **Normalize**: Convert counts to probabilities
4. **Generate**: Use probabilities to generate new sequences