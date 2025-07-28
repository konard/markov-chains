# Markov Chains with Link-CLI (clink)

## Research Questions

How much we can predict using the links (Doublets from LinksPlatform) and markov chains?

What if we will make them recursive?

At the same time links can provide a universal way to flattern all network/recursion. And a way to tokenize everything.

Inspired by https://www.youtube.com/watch?v=KZeIEiBrT_w and https://moebio.com/mind

What if we learn probabilities of markov chains and just add additional layer of random choices. Would we end with something similar to GPT?

Do we need addtional attention mechanism, or it is just and optimization trick that was required to make GPTs parallelazible?

Is it possible to just `download` the weights of the neural network into markov chains using large dataset of words (prompts) by setting temperature to zero?

* https://en.wikipedia.org/wiki/Probabilistic_logic
* https://en.wikipedia.org/wiki/Bayesian_probability
* https://en.wikipedia.org/wiki/Markov_logic_network
* https://en.wikipedia.org/wiki/Statistical_relational_learning

## Implementation

This project demonstrates using link-cli as a database for storing and retrieving Markov chain transition probabilities.

### Overview

The system:
1. Parses text into vowel (V) and consonant (C) states
2. Counts transitions between states
3. Stores transition counts in clink database
4. Generates new text based on learned probabilities

### Files

- `clink-wrapper.mjs` - Basic wrapper functions for clink operations
- `vowel-consonant-parser.mjs` - Parses text into V/C states
- `probability-calculator.mjs` - Calculates transition probabilities
- `markov-clink-storage.mjs` - Stores/retrieves Markov data in clink
- `text-generator.mjs` - Generates text using stored probabilities
- `simple-example.mjs` - Simple demonstration script
- `markov-demo.mjs` - Full demo with detailed output

### Prerequisites

1. Install link-cli globally:
```bash
dotnet tool install --global clink
```

2. Install bun (for running JavaScript files)

### Usage

Run the simple example:
```bash
./simple-example.mjs
```

Or run the detailed demo:
```bash
bun markov-demo.mjs
```

### How it Works

#### Data Storage Format

Markov transitions are stored in clink as links:
- Source: `markov{from}{to}` (e.g., `markovVC` for V→C transition)
- Target: `count{number}` (e.g., `count10` for 10 occurrences)

#### Example

Training text: "hello"
- States: CVCCV
- Transitions: C→V, V→C, C→C, C→V
- Stored in clink:
  - `(markovCV count2)` - C to V happened 2 times
  - `(markovVC count1)` - V to C happened 1 time
  - `(markovCC count1)` - C to C happened 1 time

### Testing

Run all tests:
```bash
bun test
```

Run specific test:
```bash
bun test vowel-consonant-parser.test.mjs
```
