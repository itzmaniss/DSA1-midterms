/**
 * Hash table implementation using linear probing for collision resolution.
 * Each bucket stores a suffix and an array of words associated with that suffix.
 */
class HashTable {
  /**
   * Creates a new hash table.
   * @param {number} size - The size of the hash table
   */
  constructor(size) {
    this.size = size;
    this.table = Array(size).fill(null); // Initialize table with null values
    this.count = 0; // Number of unique suffixes stored
    this.probeSteps = 0; // Counter for tracking collision resolution steps
  }
}

/**
 * Computes a hash value for a given string using polynomial rolling hash.
 * Uses prime number 31 as the base for hash calculation.
 * @param {string} string - The string to hash
 * @param {number} tableSize - The size of the hash table (for modulo operation)
 * @returns {number} Hash value in range [0, tableSize-1]
 */
function computeHash(string, tableSize) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = (hash * 31 + string.charCodeAt(i)) % tableSize;
  }
  return hash;
}

/**
 * Inserts a word with its associated suffix into the hash table.
 * Uses linear probing to handle collisions.
 * @param {HashTable} T - The hash table to insert into
 * @param {string} suffix - The suffix key
 * @param {string} word - The word to associate with the suffix
 * @returns {boolean} True if insertion successful, false if table is full
 */
function insertHash(T, suffix, word) {
  let index = computeHash(suffix, T.size);
  let attempts = 0;

  while (attempts < T.size) {
    if (T.table[index] === null) {
      // Empty slot found - insert new entry
      T.table[index] = { suffix, words: [word] };
      T.count++;
      return true;
    } else if (T.table[index].suffix === suffix) {
      // Suffix already exists - add word to existing entry
      T.table[index].words.push(word);
      return true;
    } else {
      // Collision - probe next slot (linear probing)
      index = (index + 1) % T.size;
      attempts++;
    }
  }

  // Table is full
  return false;
}

/**
 * Searches for a suffix in the hash table and returns associated words.
 * Uses linear probing to resolve collisions during search.
 * @param {HashTable} T - The hash table to search in
 * @param {string} suffix - The suffix key to search for
 * @returns {Array<string>} Array of words associated with the suffix, or empty array if not found
 */
function searchHash(T, suffix) {
  let index = computeHash(suffix, T.size);
  let attempts = 0;

  while (attempts < T.size) {
    if (T.table[index] === null) {
      // Empty slot encountered - suffix not in table
      return [];
    } else if (T.table[index].suffix === suffix) {
      // Suffix found - return associated words
      return T.table[index].words;
    } else {
      // Collision - continue probing
      T.probeSteps++;
      index = (index + 1) % T.size;
      attempts++;
    }
  }

  // Searched entire table without finding suffix
  return [];
}
