/*
 * allliteration.js
 * Implements alliteration lookup functionality
 * Based on ALGORITHM 9 from pseudocode
 */

/**
 * Finds words that start with the same letter (alliteration).
 * Uses an array-based index where each position corresponds to a letter (a-z).
 *
 * The AlliterationTable structure:
 * - Index 0 = 'a', Index 1 = 'b', ..., Index 25 = 'z'
 * - Each entry contains an array of words starting with that letter
 *
 * Algorithm from pseudocode FIND-ALLITERATION (lines 1-15)
 * Time Complexity: O(k) where k = min(maxResults, words starting with letter)
 * Space Complexity: Θ(k)
 *
 * @param {Array<Array<string>>} AlliterationTable - Array of 26 word lists, one per letter
 * @param {string} letter - The letter to find words for (case-insensitive)
 * @param {number} maxResults - Maximum number of words to return
 * @returns {Array<string>} Array of words starting with the specified letter
 */
function findAlliteration(AlliterationTable, letter, maxResults) {
  // Convert to lowercase for case-insensitive matching (pseudocode line 1)
  letter = letter.toLowerCase();

  // Convert letter to array index (a=0, b=1, ..., z=25) (pseudocode line 3)
  // Note: Pseudocode uses 1-indexed (a=1), but JavaScript uses 0-indexed (a=0)
  const index = letter.charCodeAt(0) - "a".charCodeAt(0);

  // Validate index is within valid range (pseudocode lines 4-6)
  if (index < 0 || index > 25) {
    return []; // Return empty array for invalid input
  }

  // Create results array (pseudocode line 7)
  const results = [];

  // Check if the table entry exists and has words
  if (!AlliterationTable[index] || AlliterationTable[index].length === 0) {
    return results;
  }

  // Collect up to maxResults words from the array (pseudocode lines 9-14)
  // In JavaScript arrays, we iterate directly rather than using linked list traversal
  const wordList = AlliterationTable[index];
  const limit = Math.min(maxResults, wordList.length);

  for (let i = 0; i < limit; i++) {
    results.push(wordList[i]);
  }

  return results;
}
