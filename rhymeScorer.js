/*
 * rhymeScorer.js
 * Implements rhyme quality scoring and rhyme finding algorithms
 * Based on ALGORITHM 5 (SCORE-RHYME), ALGORITHM 6 (FIND-RHYMES),
 * and ALGORITHM 11 (PHONETIC-SEARCH) from pseudocode
 */

/**
 * Scores the quality of a rhyme between two words using multi-factor analysis.
 * Maximum possible score is 100 points:
 * - Up to 60 points for matching suffix characters (15 points per character, capped at 60)
 * - 20 points bonus if first letters differ (avoids alliteration)
 * - Up to 20 points for similar word lengths
 *
 * Algorithm from pseudocode SCORE-RHYME (lines 1-30)
 *
 * @param {string} word1 - First word to compare
 * @param {string} word2 - Second word to compare
 * @returns {number} Rhyme quality score (0-100), 0 if same word
 */
function scoreRhyme(word1, word2) {
  // Same word is not a valid rhyme (pseudocode line 1-2)
  if (word1 === word2) {
    return 0;
  }

  let score = 0;
  // Start from end of each word (pseudocode lines 4-5)
  let i = word1.length - 1; // Convert from 1-indexed to 0-indexed
  let j = word2.length - 1;
  let matchingChars = 0;

  // Count matching characters from end working backwards (pseudocode lines 8-11)
  while (i >= 0 && j >= 0 && word1[i] === word2[j]) {
    matchingChars++;
    i--;
    j--;
  }

  // Award points for matching suffix (max 60 points) (pseudocode lines 13-16)
  let charScore = matchingChars * 15;
  if (charScore > 60) {
    charScore = 60;
  }
  score += charScore;

  // Bonus for different first letters - avoids alliteration (pseudocode lines 17-19)
  // 20 points if first characters differ
  if (word1[0] !== word2[0]) {
    score += 20;
  }

  // Bonus for similar length (max 20 points) (pseudocode lines 20-29)
  let lengthDiff = Math.abs(word1.length - word2.length);
  if (lengthDiff === 0) {
    score += 20; // Exact same length
  } else if (lengthDiff === 1) {
    score += 15; // Off by 1 character
  } else if (lengthDiff === 2) {
    score += 10; // Off by 2 characters
  } else if (lengthDiff <= 4) {
    score += 5; // Off by 3-4 characters
  }
  // lengthDiff > 4 gets 0 bonus points

  return score;
}

/**
 * Finds and ranks rhyming words based on suffix matching and rhyme quality scoring.
 *
 * Algorithm from pseudocode FIND-RHYMES (lines 1-21)
 * Time Complexity: O(k) for scoring + O(k log k) for sorting where k = number of candidates
 * Space Complexity: Θ(k)
 *
 * @param {HashTable} rhymeTable - The rhyme hash table containing suffix-indexed words
 * @param {string} inputWord - Word to find rhymes for
 * @param {number} suffixLength - Number of characters to use for suffix matching
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array<string>} Array of rhyming words ranked by quality (best first)
 */
function findRhymes(rhymeTable, inputWord, suffixLength, maxResults) {
  // Extract suffix from input word (pseudocode line 1)
  const suffix = extractSuffix(inputWord, suffixLength);

  // Search hash table for words with matching suffix (pseudocode line 2)
  const candidates = searchHash(rhymeTable, suffix);

  // Create array to store scored rhymes (pseudocode lines 3-5)
  const scoredRhymes = [];

  // Score each candidate rhyme (pseudocode lines 6-14)
  for (let i = 0; i < candidates.length; i++) {
    const candidateWord = candidates[i];

    // Calculate rhyme quality score (pseudocode line 9)
    const score = scoreRhyme(inputWord, candidateWord);

    // Exclude the input word itself (score = 0) (pseudocode line 10-13)
    if (score > 0) {
      scoredRhymes.push({
        word: candidateWord,
        score: score,
      });
    }
  }

  // Sort by score in descending order (best rhymes first) (pseudocode line 16)
  // JavaScript's sort is typically implemented as merge sort or quicksort
  scoredRhymes.sort((a, b) => b.score - a.score);

  // Return top N results (pseudocode lines 17-21)
  const limit = Math.min(maxResults, scoredRhymes.length);
  const results = [];

  for (let i = 0; i < limit; i++) {
    results.push(scoredRhymes[i].word);
  }

  return results;
}

/**
 * Searches for rhymes using phonetic matching to handle pronunciation-based rhymes.
 * This function finds words that rhyme based on how they sound, not just spelling.
 * Useful for finding rhymes like "through" and "blue" despite different spellings.
 *
 * Algorithm from pseudocode PHONETIC-SEARCH (lines 1-26)
 * Time Complexity: O(k log k) where k = number of candidates
 * Space Complexity: Θ(k)
 *
 * @param {HashTable} phoneticTable - The phonetic hash table (indexed by phonetic suffixes)
 * @param {string} inputWord - Word to find phonetic rhymes for
 * @param {number} suffixLength - Number of characters to use for phonetic suffix matching
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array<string>} Array of phonetically rhyming words ranked by quality (best first)
 */
function phoneticSearch(phoneticTable, inputWord, suffixLength, maxResults) {
  // Compute phonetic key for input word (pseudocode line 2)
  const phoneticKey = computePhoneticKey(inputWord);

  // Extract suffix from the phonetic key (pseudocode line 4)
  const phoneticSuffix = extractSuffix(phoneticKey, suffixLength);

  // Search the phonetic hash table (NOT the regular rhyme table) (pseudocode line 6)
  const candidates = searchHash(phoneticTable, phoneticSuffix);

  // Create array to store scored rhymes (pseudocode lines 8-10)
  const scoredRhymes = [];

  // Score each candidate rhyme (pseudocode lines 11-19)
  // Note: Score based on original words, not phonetic keys
  for (let i = 0; i < candidates.length; i++) {
    const candidateWord = candidates[i];

    // Calculate rhyme quality score using original words (pseudocode line 14)
    const score = scoreRhyme(inputWord, candidateWord);

    // Exclude the input word itself (score = 0) (pseudocode line 15-18)
    if (score > 0) {
      scoredRhymes.push({
        word: candidateWord,
        score: score,
      });
    }
  }

  // Sort by score in descending order (best rhymes first) (pseudocode line 21)
  scoredRhymes.sort((a, b) => b.score - a.score);

  // Return top N results (pseudocode lines 23-26)
  const limit = Math.min(maxResults, scoredRhymes.length);
  const results = [];

  for (let i = 0; i < limit; i++) {
    results.push(scoredRhymes[i].word);
  }

  return results;
}
