# Poetry Assistant

A JavaScript-based poetry writing assistant that helps poets find rhymes, count syllables, and discover alliterative words. Built using advanced data structures and algorithms including hash tables with linear probing, phonetic matching, and multi-factor rhyme quality scoring.

## Features

- **Rhyme Finding**: Fast suffix-based rhyme lookup with quality scoring
- **Phonetic Matching**: Handles pronunciation-based rhymes (e.g., "through" and "blue")
- **Syllable Counting**: Estimates syllables using vowel cluster heuristics
- **Alliteration Lookup**: Quickly finds words starting with the same letter
- **Intelligent Ranking**: Multi-factor scoring system ranks rhymes by quality

## Project Structure

```
├── index.html              # Main HTML interface
├── index.js               # Main query processor
├── buildAssistant.js      # Builds data structures from word list
├── hashTable.js           # Hash table implementation with linear probing
├── rhymeScorer.js         # Rhyme scoring and finding algorithms
├── allliteration.js       # Alliteration lookup functionality
├── utils.js               # Utility functions (suffix extraction, syllable counting, phonetic keys)
├── wordlist.txt           # Dictionary of ~224,000 English words
└── psudocode.md          # Complete algorithm pseudocode
```

## Data Structures

The Poetry Assistant uses three specialized data structures for optimal performance:

### 1. Rhyme Hash Table
- **Purpose**: Fast O(1) rhyme lookup by word suffix
- **Implementation**: Hash table with linear probing and separate chaining
- **Key**: Last k characters of each word (default k=3)
- **Collision Resolution**: Hybrid approach using linear probing for slots and linked lists within slots

### 2. Phonetic Hash Table
- **Purpose**: Handles spelling/pronunciation mismatches
- **Implementation**: Same structure as rhyme table, but indexed by phonetic representations
- **Key**: Phonetic suffix generated using custom phonetic encoding
- **Examples**: Finds "blue" when searching for rhymes of "through"

### 3. Alliteration Table
- **Purpose**: Fast O(1) lookup by first letter
- **Implementation**: Array of 26 word lists (one per letter a-z)
- **Index**: Direct array access (a=0, b=1, ..., z=25)

## Algorithms

### Core Algorithms

1. **Polynomial Rolling Hash** - O(m) where m = string length
2. **Suffix Extraction** - O(k) where k = suffix length
3. **Hash Insert with Linear Probing** - O(1) average, O(n) worst case
4. **Hash Search** - O(1) average, O(n) worst case
5. **Rhyme Quality Scoring** - O(min(m,n)) for comparing two words
6. **Find Rhymes with Ranking** - O(k log k) where k = candidates
7. **Build Poetry Assistant** - O(w·m) where w = words, m = avg length
8. **Count Syllables** - O(m) using vowel cluster heuristic
9. **Find Alliteration** - O(k) where k = results returned
10. **Compute Phonetic Key** - O(m) with phonetic transformations
11. **Phonetic Rhyme Search** - O(k log k) for scoring and sorting

### Rhyme Scoring System

Maximum score: 100 points

- **Up to 60 points**: Matching suffix characters (15 points per character, capped at 60)
- **20 points bonus**: Different first letters (avoids alliteration)
- **Up to 20 points**: Similar word lengths
  - Same length: 20 points
  - Off by 1 character: 15 points
  - Off by 2 characters: 10 points
  - Off by 3-4 characters: 5 points

### Syllable Counting Rules

- Count vowel groups (consecutive vowels = 1 syllable)
- 'y' is considered a vowel when not at the start and not after another vowel
- Silent 'e' at the end is not counted (for words 3+ letters)
- Minimum syllable count is 1
- Note: This is a heuristic method, adequate for poetry but not phonetically exact

### Phonetic Key Generation

Transformations applied to normalize pronunciation:
- Common patterns: `ough→O`, `augh→AF`, `tion→SHUN`, `sion→ZHUN`
- Silent letters removed: `gh`, `wr→R`, `kn→N`, `gn→N`, `mb→M`
- `ph→F`, `ck→K`, `wh→W`
- All vowel groups collapsed to `V`
- Duplicate consonants collapsed to single character
- Soft 'c' (before e/i) → `S`, hard 'c' → `K`

## Usage

### Basic Setup

1. Open `index.html` in a web browser
2. The system automatically loads the word list and builds all data structures
3. Enter a word to find rhymes, syllables, and alliterations

### API Usage

```javascript
// Build the Poetry Assistant from a word list
const tables = await buildPoetryAssistantFromFile('wordlist.txt', 3);

// Query for a word
const results = query(tables, 'cat', 3);

console.log(results.rhymes);         // ['bat', 'hat', 'mat', 'sat', ...]
console.log(results.syllables);      // 1
console.log(results.alliterations);  // ['cake', 'car', 'castle', ...]
```

### Query Function

```javascript
function query(tables, inputWord, suffixLength)
```

**Parameters:**
- `tables`: Object containing rhymeTable, phoneticTable, and alliterationTable
- `inputWord`: The word to find rhymes and information for
- `suffixLength`: Number of characters for suffix matching (typically 3)

**Returns:**
- `rhymes`: Array of up to 10 rhyming words, ranked by quality
- `syllables`: Estimated syllable count
- `alliterations`: Array of up to 5 words starting with the same letter

### Advanced Features

**Automatic Phonetic Fallback:**
If fewer than 3 exact rhymes are found, the system automatically searches for phonetic rhymes to provide better results.

**Custom Suffix Length:**
Adjust suffix length for stricter or looser rhyme matching:
- Shorter suffix (2): More rhymes, less strict
- Longer suffix (4-5): Fewer rhymes, more strict

## Performance Characteristics

### Time Complexity

| Operation | Average Case | Worst Case |
|-----------|-------------|------------|
| Hash Insert | O(1) | O(s) |
| Hash Search | O(1) | O(s) |
| Rhyme Scoring | O(m) | O(m) |
| Find Rhymes | O(k log k) | O(k log k) |
| Syllable Count | O(m) | O(m) |
| Alliteration Lookup | O(k) | O(k) |
| Phonetic Key | O(m) | O(m) |
| Phonetic Search | O(k log k) | O(k log k) |
| Build Assistant | O(w·m) | O(w·m) |
| Full Query | O(k log k) | O(k log k) |

Where:
- `s` = hash table size (worst case when nearly full)
- `m` = average word length
- `k` = number of rhyme candidates
- `w` = number of words in dictionary

### Space Complexity

- **Total**: O(3w·m) for three data structures
- **Trade-off**: 3x space cost vs. single structure justified by O(1) lookups across all features

### Hash Table Sizing

- **Dictionary size**: ~224,000 words
- **Unique suffixes**: ~3,300
- **Table size**: 6,577 (prime number)
- **Load factor**: ~0.5 (optimal balance)
- Prime number sizing reduces clustering and improves hash distribution

## Key Design Decisions

1. **Three Separate Data Structures**
   - Prioritizes speed for interactive poetry assistance
   - Memory cost acceptable on modern systems
   - Each structure optimized for its specific task

2. **Hybrid Collision Resolution**
   - Linear probing for slot selection (open addressing)
   - Separate chaining within slots for same suffix
   - Provides both speed and space efficiency

3. **Ranking Over Boolean Matching**
   - Multi-factor scoring provides best rhymes first
   - Better user experience than unranked results
   - Considers multiple quality factors

4. **Graceful Degradation**
   - Automatic fallback to phonetic search when exact rhymes < 3
   - Handles English spelling irregularities
   - Users never see "no results" for reasonable inputs

5. **Adaptive Hash Table Sizing**
   - Table size adjustable based on actual data
   - Maintains optimal load factor (~0.5)
   - Scales efficiently from small to large dictionaries

## Known Limitations

1. **Syllable Counting**: Heuristic-based, may miscount compound words or borrowed words
2. **Phonetic Matching**: Simplified system, not as comprehensive as Soundex or Metaphone
3. **Rhyme Quality**: Scoring is based on spelling patterns, not actual pronunciation
4. **Word List**: Limited to words in the dictionary file

## Future Enhancements

- Integration with professional phonetic algorithms (Double Metaphone)
- Support for multi-word phrases
- Rhyme scheme pattern detection
- Meter and rhythm analysis
- User-defined custom word lists

## Technical Details

- **Language**: JavaScript (ES6+)
- **Hash Function**: Polynomial rolling hash with prime base 31
- **Prime Table Size**: 6,577 for optimal distribution
- **Dictionary**: 224,000+ English words
- **Browser Compatibility**: Modern browsers with ES6 support

## License

Educational project for data structures and algorithms coursework.

## Authors

Data Structures and Algorithms Project - 2026
