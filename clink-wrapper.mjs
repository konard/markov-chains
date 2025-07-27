import { execSync } from 'child_process';

export function executeCliink(pattern) {
  try {
    const result = execSync(`clink '${pattern}' --changes --after`, { encoding: 'utf8' });
    return result.trim();
  } catch (error) {
    throw new Error(`clink error: ${error.message}`);
  }
}

export function createLink(source, target) {
  const pattern = `() ((${source} ${target}))`;
  return executeCliink(pattern);
}

export function readLink(index) {
  const pattern = `(((${index}: $s $t)) ((${index}: $s $t)))`;
  return executeCliink(pattern);
}

export function readAllLinks() {
  const pattern = '((($i: $s $t)) (($i: $s $t)))';
  return executeCliink(pattern);
}

export function updateLink(index, oldSource, oldTarget, newSource, newTarget) {
  const pattern = `((${index}: ${oldSource} ${oldTarget})) ((${index}: ${newSource} ${newTarget}))`;
  return executeCliink(pattern);
}

export function deleteLink(source, target) {
  const pattern = `((${source} ${target})) ()`;
  return executeCliink(pattern);
}

export function deleteLinkByIndex(index, source, target) {
  const pattern = `((${index}: ${source} ${target})) ()`;
  return executeCliink(pattern);
}