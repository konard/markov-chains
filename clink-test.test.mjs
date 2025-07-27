import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { execSync } from 'child_process';

function clink(pattern) {
  try {
    const result = execSync(`clink '${pattern}' --changes --after`, { encoding: 'utf8' });
    return result.trim();
  } catch (error) {
    throw new Error(`clink error: ${error.message}`);
  }
}

function clinkGetAfter(pattern) {
  const result = clink(pattern);
  const lines = result.split('\n').filter(line => line.trim());
  // Find the last line that contains actual link data (not the pattern)
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (line.match(/^\(\d+: .+ .+\)$/)) {
      return line;
    }
  }
  return '';
}

function clearAllLinks() {
  try {
    clink('((($i: $s $t)) ())');
  } catch (error) {
    // Ignore errors when clearing
  }
}

describe("clink basic operations", () => {
  beforeEach(() => {
    clearAllLinks();
  });

  afterEach(() => {
    clearAllLinks();
  });
  test("create and read a link", () => {
    // Create a link
    const createResult = clinkGetAfter('() ((1 1))');
    expect(createResult).toBe('(1: 1 1)');
    
    // Read all links - should include our link
    const readResult = clink('((($i: $s $t)) (($i: $s $t)))');
    expect(readResult).toContain('1: 1 1');
  });

  test("update a link", () => {
    // First create a link to update
    clinkGetAfter('() ((1 1))');
    
    // Update the link from (1 1) to (1 2)
    const updateResult = clinkGetAfter('((1: 1 1)) ((1: 1 2))');
    expect(updateResult).toBe('(1: 1 2)');
    
    // Verify the update
    const readResult = clink('((($i: $s $t)) (($i: $s $t)))');
    expect(readResult).toContain('1: 1 2');
    expect(readResult).not.toContain('1: 1 1');
  });

  test("delete a link", () => {
    // Delete the link
    const deleteResult = clinkGetAfter('((1: 1 2)) ()');
    expect(deleteResult).toBe('');
    
    // Verify deletion
    const readResult = clink('((($i: $s $t)) (($i: $s $t)))');
    expect(readResult).not.toContain('1: 1 2');
  });
});