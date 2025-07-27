import { expect, test, describe } from "bun:test";
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
  const lines = result.split('\n');
  // The "after" state is typically the last line(s) after the pattern
  return lines.length > 1 ? lines.slice(1).join('\n') : '';
}

describe("clink basic operations", () => {
  test("create and read a link", () => {
    // Create a link
    const createResult = clinkGetAfter('() ((1 1))');
    expect(createResult).toBe('(1: 1 1)');
    
    // Read all links - should include our link
    const readResult = clink('((($i: $s $t)) (($i: $s $t)))');
    expect(readResult).toContain('1: 1 1');
  });

  test("update a link", () => {
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