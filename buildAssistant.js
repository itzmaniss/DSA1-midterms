/*
 * buildAssistant.js
 * Builds the Poetry Assistant data structures from a word list
 * Based on ALGORITHM 7 from pseudocode
 */

/**
 * Builds three data structures for the Poetry Assistant:
 * 1. RhymeTable - Hash table indexed by word suffixes for rhyme lookup
 * 2. PhoneticTable - Hash table indexed by phonetic suffixes for pronunciation-based rhymes
 * 3. AlliterationTable - Array of 26 word lists for first-letter lookup
 *
 * Algorithm from pseudocode BUILD-POETRY-ASSISTANT (lines 1-41)
 * Time Complexity: Θ(w · m) where w = number of words, m = avg word length
 * Space Complexity: Θ(w · m) for storing all three structures
 *
 * @param {string} wordlistText - The complete text content of the word list (one word per line)
 * @param {number} suffixLength - Number of characters to use for suffix matching
 * @returns {Object} Object containing { rhymeTable, phoneticTable, alliterationTable, stats }
 */
function buildPoetryAssistant(wordlistText, suffixLength) {
  // Initialize three data structures (pseudocode lines 1-6)
  const tableSize = 6577; // Prime number for ~3290 suffixes (load factor ~0.5)

  // Create hash tables for rhyme and phonetic matching
  const rhymeTable = new HashTable(tableSize);
  const phoneticTable = new HashTable(tableSize);

  // Create alliteration table - 26 arrays, one for each letter (a-z)
  // Note: Using 0-indexed (a=0, b=1, ..., z=25) instead of pseudocode's 1-indexed
  const alliterationTable = [];
  for (let i = 0; i < 26; i++) {
    alliterationTable[i] = [];
  }

  // Process word list (pseudocode lines 7-32)
  // Split text into lines
  const lines = wordlistText.split("\n");
  let wordCount = 0;

  // Process each line (pseudocode lines 13-31)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle empty lines (pseudocode line 15-16)
    if (!line) {
      continue;
    }

    // Remove whitespace (pseudocode line 17)
    const word = line.trim();

    // Validate word: non-empty and alphabetic only (pseudocode line 19)
    if (word.length > 0 && isAlphabetic(word)) {
      // Insert into rhyme hash table (pseudocode lines 20-22)
      const suffix = extractSuffix(word, suffixLength);
      insertHash(rhymeTable, suffix, word);

      // Insert into alliteration index (pseudocode lines 23-26)
      const firstLetter = word[0].toLowerCase(); // Convert from 1-indexed to 0-indexed
      const letterIndex = firstLetter.charCodeAt(0) - "a".charCodeAt(0);
      alliterationTable[letterIndex].push(word);

      // Insert into phonetic hash table (pseudocode lines 27-30)
      const phoneticKey = computePhoneticKey(word);
      const phoneticSuffix = extractSuffix(phoneticKey, suffixLength);
      insertHash(phoneticTable, phoneticSuffix, word);

      wordCount++;
    }
  }

  // Print statistics (pseudocode lines 33-39)
  console.log(`Loaded ${wordCount} words`);
  console.log(`Rhyme table - Unique suffixes: ${rhymeTable.count}`);
  console.log(`Rhyme table - Probe steps: ${rhymeTable.probeSteps}`);
  console.log(
    `Rhyme table - Load factor: ${(rhymeTable.count / rhymeTable.size).toFixed(4)}`,
  );
  console.log(`Phonetic table - Unique keys: ${phoneticTable.count}`);
  console.log(`Phonetic table - Probe steps: ${phoneticTable.probeSteps}`);

  // Return all three structures (pseudocode line 41)
  return {
    rhymeTable: rhymeTable,
    phoneticTable: phoneticTable,
    alliterationTable: alliterationTable,
    stats: {
      wordCount: wordCount,
      rhymeTableCount: rhymeTable.count,
      rhymeTableProbeSteps: rhymeTable.probeSteps,
      rhymeTableLoadFactor: rhymeTable.count / rhymeTable.size,
      phoneticTableCount: phoneticTable.count,
      phoneticTableProbeSteps: phoneticTable.probeSteps,
    },
  };
}

/**
 * Helper function to load word list from a file URL (for use in browser).
 * Uses fetch API to load the word list file, then calls buildPoetryAssistant.
 *
 * @param {string} wordlistUrl - URL or path to the word list file
 * @param {number} suffixLength - Number of characters to use for suffix matching
 * @returns {Promise<Object>} Promise that resolves to the poetry assistant data structures
 */
async function buildPoetryAssistantFromFile(wordlistUrl, suffixLength) {
  try {
    // Fetch the word list file
    const response = await fetch(wordlistUrl);

    if (!response.ok) {
      console.error(`Error: Could not open file ${wordlistUrl}`);
      return null;
    }

    // Read file content as text
    const wordlistText = await response.text();

    // Build and return the poetry assistant
    return buildPoetryAssistant(wordlistText, suffixLength);
  } catch (error) {
    console.error(`Error loading word list: ${error.message}`);
    return null;
  }
}
