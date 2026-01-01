/*
 * utils.js
 * Utility functions for the Poetry Assistant
 * Includes suffix extraction, syllable counting, and validation
 */

/**
 * Extracts the last n characters (suffix) from a word.
 * If the word is shorter than the requested length, returns the entire word.
 * @param {string} word - The word to extract suffix from
 * @param {number} length - The number of characters to extract from the end
 * @returns {string} The suffix in lowercase
 */
function extractSuffix(word, length) {
  word = word.toLowerCase();
  let n = word.length;
  if (n <= length) {
    // Word is shorter than requested suffix length - return entire word
    return word;
  }
  // Extract the last 'length' characters using slice
  return word.slice(-length);
}

/**
 * Estimates the number of syllables in a word using vowel counting heuristics.
 * Rules applied:
 * - Count vowel groups (consecutive vowels = 1 syllable)
 * - 'y' is considered a vowel when not at the start or after another vowel
 * - Silent 'e' at the end is not counted as a syllable
 * - Minimum syllable count is 1
 * @param {string} word - The word to count syllables in
 * @returns {number} Estimated number of syllables
 */
function countSyllables(word) {
  word = word.toLowerCase();
  let n = word.length;
  if (n === 0) {
    return 0;
  }
  let syllables = 0;
  let previousWasVowel = false;
  let vowels = ["a", "e", "i", "o", "u"];

  // Count vowel groups as syllables
  for (let i = 0; i < n; i++) {
    let c = word[i];
    let isVowel;
    if (c == "y") {
      // 'y' acts as a vowel when not at start and not after another vowel
      if (i > 0 && previousWasVowel === false) {
        isVowel = true;
      } else {
        isVowel = false;
      }
    } else {
      isVowel = vowels.includes(c);
    }
    // Increment syllables only at the start of a new vowel group
    if (isVowel && !previousWasVowel) {
      syllables++;
    }
    previousWasVowel = isVowel;
  }
  // Handle silent 'e' at the end of words (3+ letters)
  if (n >= 3 && word[n - 1] === "e") {
    let lastChar = word[n - 2];
    if (!vowels.includes(lastChar) && lastChar !== "y") {
      syllables--; // Remove syllable for silent 'e'
    }
  }
  // Ensure at least 1 syllable
  if (syllables < 1) {
    syllables = 1;
  }
  return syllables;
}

/**
 * Generates a phonetic key for a word by normalizing spelling variations.
 * The key represents similar-sounding words with the same pattern.
 * Transformations include:
 * - Common phonetic patterns (ough, augh, tion, sion, etc.)
 * - Silent letters removed (gh after vowels, etc.)
 * - Vowel groups collapsed to 'V'
 * - Duplicate consonants collapsed to single character
 * - Context-dependent letter sounds (soft/hard 'c')
 * @param {string} word - The word to generate a phonetic key for
 * @returns {string} The phonetic key representing pronunciation pattern
 */
function computePhoneticKey(word) {
  word = word.toLowerCase();
  let vowels = new Set(["a", "e", "i", "o", "u"]);

  // Replace common phonetic patterns with simplified representations
  word = word.replaceAll("ough", "O");
  word = word.replaceAll("augh", "AF");
  word = word.replaceAll("tion", "SHUN");
  word = word.replaceAll("sion", "ZHUN");
  word = word.replaceAll("ph", "F");
  word = word.replaceAll("gh", ""); // Remove silent 'gh'
  word = word.replaceAll("ck", "K");
  word = word.replaceAll("wh", "W");
  word = word.replaceAll("wr", "R"); // Silent 'w' in 'wr'
  word = word.replaceAll("kn", "N"); // Silent 'k' in 'kn'
  word = word.replaceAll("gn", "N"); // Silent 'g' in 'gn'
  word = word.replaceAll("mb", "M"); // Silent 'b' in 'mb'

  let n = word.length;
  let key = "";
  let i = 0;
  while (i < n) {
    let c = word[i];
    if (vowels.has(c)) {
      // Collapse all consecutive vowels into single 'V'
      key += "V";
      i++;
      while (i < n && vowels.has(word[i])) {
        i++;
      }
    } else if (c === "c") {
      // Soft 'c' (before e, i) sounds like 'S', hard 'c' sounds like 'K'
      if (i + 1 < n && ["e", "i"].includes(word[i + 1])) {
        key += "S";
      } else {
        key += "K";
      }
      i++;
    } else {
      // Add consonant and skip duplicate consecutive consonants
      key += c;
      i++;
      while (i < n && word[i] === c) {
        i++;
      }
    }
  }
  return key;
}

/**
 * Checks if a word contains only alphabetic characters (a-z, A-Z).
 * @param {string} word - The word to validate
 * @returns {boolean} True if the word contains only letters, false otherwise
 */
function isAlphabetic(word) {
  // Test if the entire string contains only alphabetic characters
  return /^[a-zA-Z]+$/.test(word);
}

/**
 * Get length of a linked list or array
 * Helper function from pseudocode
 *
 * @param {Array|Object} list - Array or linked list
 * @returns {number} Length
 */
function listLength(list) {
  if (Array.isArray(list)) {
    return list.length;
  }
  // For linked list (if you implement one)
  let count = 0;
  let current = list.head;
  while (current !== null) {
    count++;
    current = current.next;
  }
  return count;
}
