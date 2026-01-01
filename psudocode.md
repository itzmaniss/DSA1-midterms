================================================================================
QUESTION 3: CORRECTED PSEUDOCODE FOR ORIGINAL ALGORITHMS
================================================================================


================================================================================
DATA STRUCTURES
================================================================================

// Data Structure 1 (Original): Suffix Hash Table for Rhymes
// Stores words indexed by their last k characters

STRUCTURE HashEntry:
    suffix: STRING                      // the suffix key (e.g., "at")
    words: LinkedList                   // list of words with this suffix


STRUCTURE HashTable:
    table: ARRAY[1..size] of HashEntry
    size: INTEGER                       // prime number for better distribution
    count: INTEGER                      // number of unique suffixes stored
    probeSteps: INTEGER                 // total probe steps for analysis (renamed for clarity)


// Data Structure 2: Alliteration Index
// Array-based index for finding words by first letter

AlliterationTable: ARRAY[1..26] of LinkedList
// Index 1 = 'a', Index 2 = 'b', ..., Index 26 = 'z'
// Each entry contains list of words starting with that letter


// Data Structure 3: Phonetic Suffix Hash Table
// Same structure as HashTable, but keys are phonetic suffixes
// Built from phonetic representations of words

PhoneticHashTable: HashTable
// Handles spelling/pronunciation mismatches (e.g., "through"/"blue")


================================================================================
ALGORITHM 1 : POLYNOMIAL ROLLING HASH FUNCTION (DONE)
================================================================================

COMPUTE-HASH(string, tableSize)
1  hash ← 0
2  prime ← 31                           // prime number for distribution
3  for i ← 1 to string.length
4      do hash ← (hash · prime + ASCII(string[i])) mod tableSize
5  return hash + 1                      // convert to 1-indexed for Cormen convention

// Time Complexity: Θ(m) where m = |string|
// Space Complexity: Θ(1)
// Original contribution: Application of polynomial rolling hash to suffix-based 
//                        rhyme indexing with optimal prime selection
// Note: Negative check removed - modulo operation ensures hash ∈ [0, tableSize-1]


================================================================================
ALGORITHM 2: EXTRACT SUFFIX (DONE)
================================================================================

EXTRACT-SUFFIX(word, length)
1  word ← TO-LOWERCASE(word)
2  n ← word.length
3  if n ≤ length
4      then return word                 // word shorter than suffix length
5  startIndex ← n - length + 1
6  // Use array-based construction to avoid O(k²) string concatenation
7  suffixChars ← CREATE-ARRAY(length)
8  for i ← 1 to length
9      do suffixChars[i] ← word[startIndex + i - 1]
10 return ARRAY-TO-STRING(suffixChars)

// Time Complexity: Θ(k) where k = min(length, |word|)
// Space Complexity: Θ(k)


================================================================================
ALGORITHM 3: SUFFIX HASH TABLE INSERTION WITH LINEAR PROBING (DONE)
================================================================================

HASH-INSERT(T, suffix, word)
1  index ← COMPUTE-HASH(suffix, T.size)
2  attempts ← 0
3  while attempts < T.size
4      do if T.table[index] = NIL                    // empty slot found
5             then T.table[index].suffix ← suffix
6                  T.table[index].words ← CREATE-LIST()
7                  APPEND(T.table[index].words, word)
8                  T.count ← T.count + 1
9                  return TRUE
10         else if T.table[index].suffix = suffix    // matching suffix found
11             then APPEND(T.table[index].words, word)
12                  return TRUE
13         else T.probeSteps ← T.probeSteps + 1      // count probe step (not initial collision)
14              index ← (index mod T.size) + 1       // linear probing (fixed: simplified formula)
15              attempts ← attempts + 1
16 return FALSE                                       // table full

// Time Complexity: O(1) average case, O(n) worst case (n = table size when nearly full)
// Space Complexity: Θ(1) per insertion
// Note: This is a hybrid design using linear probing for slots and 
//       separate chaining (linked lists) within slots


================================================================================
ALGORITHM 4: SUFFIX HASH TABLE SEARCH (DONE)
================================================================================

HASH-SEARCH(T, suffix)
1  results ← CREATE-EMPTY-LIST()
2  index ← COMPUTE-HASH(suffix, T.size)
3  attempts ← 0
4  while attempts < T.size
5      do if T.table[index] = NIL                    // suffix not in table
6             then return results
7         else if T.table[index].suffix = suffix     // found matching suffix
8             then return T.table[index].words       // return entire list
9         else index ← (index mod T.size) + 1        // continue probing (fixed: simplified)
10             attempts ← attempts + 1
11 return results                                     // not found after full probe

// Time Complexity: O(1) average case, O(n) worst case (n = table size when nearly full)
// Space Complexity: Θ(k) where k = number of matching words


================================================================================
ALGORITHM 5 : RHYME QUALITY SCORING (DONE)
================================================================================

SCORE-RHYME(word1, word2)
1  if word1 = word2
2      then return 0                                  // same word, not a rhyme
3  score ← 0
4  i ← word1.length
5  j ← word2.length
6  matchingChars ← 0
7  // Count matching characters from end (suffix matching)
8  while i ≥ 1 and j ≥ 1 and word1[i] = word2[j]
9      do matchingChars ← matchingChars + 1
10        i ← i - 1
11        j ← j - 1
12 // Award points for matching suffix (max 60 points)
13 charScore ← matchingChars · 15
14 if charScore > 60
15     then charScore ← 60
16 score ← score + charScore
17 // Bonus for different first letters (avoids alliteration) (20 points)
18 if word1[1] ≠ word2[1]
19     then score ← score + 20
20 // Bonus for similar length (max 20 points)
21 lengthDiff ← |word1.length - word2.length|
22 if lengthDiff = 0
23     then score ← score + 20
24 else if lengthDiff = 1
25     then score ← score + 15
26 else if lengthDiff = 2
27     then score ← score + 10
28 else if lengthDiff ≤ 4
29     then score ← score + 5
30 return score

// Time Complexity: Θ(min(m,n)) where m = |word1|, n = |word2|
// Space Complexity: Θ(1)
// Original contribution: Multi-factor scoring system with weighted criteria
//                        for ranking rhyme quality beyond binary matching
// Note: Maximum possible score is exactly 100 (60 + 20 + 20), no cap needed


================================================================================
ALGORITHM 6: FIND RHYMES WITH RANKING (DONE)
================================================================================

FIND-RHYMES(RhymeTable, inputWord, suffixLength, maxResults)
1  suffix ← EXTRACT-SUFFIX(inputWord, suffixLength)
2  candidates ← HASH-SEARCH(RhymeTable, suffix)
3  candidateCount ← LIST-LENGTH(candidates)          // explicit O(n) traversal for linked list
4  scoredRhymes ← CREATE-EMPTY-ARRAY(candidateCount)
5  count ← 0
6  // Score each candidate rhyme
7  current ← candidates.head
8  while current ≠ NIL
9      do score ← SCORE-RHYME(inputWord, current.word)
10        if score > 0                                // exclude input word itself
11           then count ← count + 1
12                scoredRhymes[count].word ← current.word
13                scoredRhymes[count].score ← score
14        current ← current.next
15 // Sort by score (descending) using merge sort
16 MERGE-SORT-BY-SCORE(scoredRhymes, 1, count)
17 // Return top N results
18 results ← CREATE-EMPTY-ARRAY(min(maxResults, count))
19 for i ← 1 to min(maxResults, count)
20     do results[i] ← scoredRhymes[i].word
21 return results

// Time Complexity: O(k) for scoring + O(k log k) for sorting
//                  where k = number of candidates
// Space Complexity: Θ(k)


================================================================================
HELPER FUNCTION: IS-ALPHABETIC (DONE)
================================================================================

IS-ALPHABETIC(word)
1  for i ← 1 to word.length
2      do c ← word[i]
3         if NOT ((c ≥ 'a' and c ≤ 'z') or (c ≥ 'A' and c ≤ 'Z'))
4            then return FALSE
5  return TRUE

// Time Complexity: Θ(n) where n = |word|
// Space Complexity: Θ(1)


================================================================================
HELPER FUNCTION: LIST-LENGTH (DONE)
================================================================================

LIST-LENGTH(list)
1  count ← 0
2  current ← list.head
3  while current ≠ NIL
4      do count ← count + 1
5         current ← current.next
6  return count

// Time Complexity: Θ(n) where n = number of elements
// Space Complexity: Θ(1)


================================================================================
ALGORITHM 7: BUILD POETRY ASSISTANT (DONE)
================================================================================

BUILD-POETRY-ASSISTANT(wordlistFile, suffixLength)
1  // Initialize three data structures
2  tableSize ← 319993                                // prime number for hashing
3  RhymeTable ← CREATE-HASH-TABLE(tableSize)
4  PhoneticTable ← CREATE-HASH-TABLE(tableSize)
5  for i ← 1 to 26
6      do AlliterationTable[i] ← CREATE-EMPTY-LIST()
7  // Open and process word file
8  file ← OPEN-FILE(wordlistFile)
9  if file = NIL
10     then PRINT "Error: Could not open file", wordlistFile
11          return NIL
12 wordCount ← 0
13 while NOT-END-OF-FILE(file)
14     do line ← READ-LINE(file)
15        if line = NIL                              // handle read errors
16           then continue
17        word ← TRIM(line)
18        // Validate word (alphabetic only, no hyphens/apostrophes)
19        if word.length > 0 and IS-ALPHABETIC(word)
20           then // Insert into rhyme hash table
21                suffix ← EXTRACT-SUFFIX(word, suffixLength)
22                HASH-INSERT(RhymeTable, suffix, word)
23                // Insert into alliteration index
24                firstLetter ← TO-LOWERCASE(word[1])
25                letterIndex ← ASCII(firstLetter) - ASCII('a') + 1
26                APPEND(AlliterationTable[letterIndex], word)
27                // Insert into phonetic hash table
28                phoneticKey ← COMPUTE-PHONETIC-KEY(word)
29                phoneticSuffix ← EXTRACT-SUFFIX(phoneticKey, suffixLength)
30                HASH-INSERT(PhoneticTable, phoneticSuffix, word)
31                wordCount ← wordCount + 1
32 CLOSE-FILE(file)
33 // Print statistics
34 PRINT "Loaded", wordCount, "words"
35 PRINT "Rhyme table - Unique suffixes:", RhymeTable.count
36 PRINT "Rhyme table - Probe steps:", RhymeTable.probeSteps
37 PRINT "Rhyme table - Load factor:", RhymeTable.count / RhymeTable.size
38 PRINT "Phonetic table - Unique keys:", PhoneticTable.count
39 PRINT "Phonetic table - Probe steps:", PhoneticTable.probeSteps
40 // Return all three structures
41 return (RhymeTable, PhoneticTable, AlliterationTable)

// Time Complexity: Θ(w · m) where w = number of words, m = avg word length
// Space Complexity: Θ(w · m) for storing all three structures


================================================================================
ALGORITHM 8: COUNT SYLLABLES (VOWEL CLUSTER HEURISTIC) (DONE)
================================================================================

COUNT-SYLLABLES(word)
1  word ← TO-LOWERCASE(word)
2  n ← word.length
3  if n = 0
4      then return 0
5  syllables ← 0
6  previousWasVowel ← FALSE
7  vowels ← {'a', 'e', 'i', 'o', 'u'}              // 'y' removed - handled specially
8  // Count vowel clusters as syllables
9  for i ← 1 to n
10     do c ← word[i]
11        // Handle 'y': vowel only if not at start and preceded by consonant
12        if c = 'y'
13           then if i > 1 and NOT previousWasVowel
14                   then isVowel ← TRUE            // 'y' acts as vowel
15                   else isVowel ← FALSE           // 'y' at start or after vowel
16        else isVowel ← c ∈ vowels
17        if isVowel and NOT previousWasVowel
18           then syllables ← syllables + 1         // new vowel cluster
19        previousWasVowel ← isVowel
20 // Adjust for silent 'e' at end (but not for very short words)
21 if n ≥ 3 and word[n] = 'e'
22     then lastChar ← word[n - 1]
23          if lastChar ∉ vowels and lastChar ≠ 'y'
24             then syllables ← syllables - 1       // subtract silent 'e'
25 // Ensure at least 1 syllable
26 if syllables < 1
27     then syllables ← 1
28 return syllables

// Time Complexity: Θ(n) where n = |word|
// Space Complexity: Θ(1)
// Note: This is a heuristic method. Known limitations include:
//       - Compound words may be miscounted
//       - Some borrowed words don't follow English patterns
//       - Adequate for poetry assistance but not phonetically exact


================================================================================
ALGORITHM 9 : FIND ALLITERATION (DONE)
================================================================================

FIND-ALLITERATION(AlliterationTable, letter, maxResults)
1  letter ← TO-LOWERCASE(letter)
2  // Convert letter to array index (a=1, b=2, ..., z=26)
3  index ← ASCII(letter) - ASCII('a') + 1
4  // Validate index
5  if index < 1 or index > 26
6      then return CREATE-EMPTY-LIST()
7  results ← CREATE-EMPTY-LIST()
8  // Collect up to maxResults words from the list
9  current ← AlliterationTable[index].head
10 count ← 0
11 while current ≠ NIL and count < maxResults
12     do APPEND(results, current.word)
13        current ← current.next
14        count ← count + 1
15 return results

// Time Complexity: O(1) for array access + O(k) to collect k words
//                  = O(k) where k = min(maxResults, words starting with letter)
// Space Complexity: Θ(k)
// Fix: Now correctly uses the AlliterationTable array, not the suffix hash table


================================================================================
ALGORITHM 10 (Original): COMPUTE PHONETIC KEY (DONE)
================================================================================

COMPUTE-PHONETIC-KEY(word)
1  word ← TO-LOWERCASE(word)
2  n ← word.length
3  // Step 1: Apply phonetic substitutions FIRST (before vowel replacement)
4  // Handle common digraphs and letter combinations
5  word ← REPLACE-ALL(word, "ough", "O")           // placeholder for various sounds
6  word ← REPLACE-ALL(word, "augh", "AF")          // laugh → lAF
7  word ← REPLACE-ALL(word, "tion", "SHUN")        // nation → naSHUN
8  word ← REPLACE-ALL(word, "sion", "ZHUN")        // vision → viZHUN
9  word ← REPLACE-ALL(word, "ph", "F")             // phone → Fone
10 word ← REPLACE-ALL(word, "gh", "")              // silent gh (night → nit)
11 word ← REPLACE-ALL(word, "ck", "K")             // back → baK
12 word ← REPLACE-ALL(word, "wh", "W")             // what → Wat
13 word ← REPLACE-ALL(word, "wr", "R")             // write → Rite
14 word ← REPLACE-ALL(word, "kn", "N")             // know → Now
15 word ← REPLACE-ALL(word, "gn", "N")             // gnome → Nome
16 word ← REPLACE-ALL(word, "mb", "M")             // lamb → laM
17 // Step 2: Normalize remaining characters
18 n ← word.length
19 key ← ""
20 i ← 1
21 while i ≤ n
22     do c ← word[i]
23        // Replace vowels with generic 'V'
24        if c ∈ {'a', 'e', 'i', 'o', 'u'}
25           then // Skip consecutive vowels (diphthongs become single V)
26                key ← key + 'V'
27                while i + 1 ≤ n and word[i + 1] ∈ {'a', 'e', 'i', 'o', 'u'}
28                   do i ← i + 1
29        // Handle 'c' → 'S' before e/i, else 'K'
30        else if c = 'c'
31           then if i + 1 ≤ n and word[i + 1] ∈ {'e', 'i'}
32                   then key ← key + 'S'           // cent → Sent
33                   else key ← key + 'K'           // cat → Kat
34        // Skip duplicate consonants
35        else if i + 1 ≤ n and c = word[i + 1] and c ∉ {'a','e','i','o','u'}
36           then key ← key + c
37                i ← i + 1                         // skip the duplicate
38                while i + 1 ≤ n and word[i + 1] = c
39                   do i ← i + 1                   // skip any further duplicates
40        // Keep other consonants as-is
41        else key ← key + c
42        i ← i + 1
43 return key

// Time Complexity: Θ(n) where n = |word| (substitutions are O(n) each, constant number)
// Space Complexity: Θ(n) for the key string
// Original contribution: Phonetic encoding for rhyme matching
// Examples:
//   "cat"     → "KVt"
//   "phone"   → "FVnV"
//   "knight"  → "nVt"
//   "lamb"    → "lVM"
//   "letter"  → "lVtVr"
//   "blue"    → "blV"
// Note: This is a simplified phonetic system. For production use,
//       consider established algorithms like Soundex, Metaphone, or Double Metaphone.


================================================================================
ALGORITHM 11: PHONETIC RHYME SEARCH (DONE)
================================================================================

PHONETIC-SEARCH(PhoneticTable, inputWord, suffixLength, maxResults)
1  // Compute phonetic key for input word
2  phoneticKey ← COMPUTE-PHONETIC-KEY(inputWord)
3  // Extract suffix from phonetic key
4  phoneticSuffix ← EXTRACT-SUFFIX(phoneticKey, suffixLength)
5  // Search the phonetic hash table (NOT the regular rhyme table)
6  candidates ← HASH-SEARCH(PhoneticTable, phoneticSuffix)
7  // Score and rank results
8  candidateCount ← LIST-LENGTH(candidates)
9  scoredRhymes ← CREATE-EMPTY-ARRAY(candidateCount)
10 count ← 0
11 current ← candidates.head
12 while current ≠ NIL
13     do // Score based on original words, not phonetic keys
14        score ← SCORE-RHYME(inputWord, current.word)
15        if score > 0
16           then count ← count + 1
17                scoredRhymes[count].word ← current.word
18                scoredRhymes[count].score ← score
19        current ← current.next
20 // Sort by score
21 MERGE-SORT-BY-SCORE(scoredRhymes, 1, count)
22 // Return top results
23 results ← CREATE-EMPTY-ARRAY(min(maxResults, count))
24 for i ← 1 to min(maxResults, count)
25     do results[i] ← scoredRhymes[i].word
26 return results

// Time Complexity: O(k log k) where k = number of candidates
// Space Complexity: Θ(k)
// Fix: Now searches PhoneticTable which was built with phonetic keys


================================================================================
MAIN ALGORITHM: POETRY ASSISTANT QUERY PROCESSOR (DONE)
================================================================================

POETRY-ASSISTANT-QUERY(Tables, inputWord, suffixLength)
1  // Tables contains: RhymeTable, PhoneticTable, AlliterationTable
2  
3  // Find exact suffix-based rhymes
4  rhymes ← FIND-RHYMES(Tables.RhymeTable, inputWord, suffixLength, 10)
5  
6  // Count syllables for metre/rhythm assistance
7  syllables ← COUNT-SYLLABLES(inputWord)
8  
9  // Find alliterative words (same first letter)
10 firstLetter ← inputWord[1]
11 alliterations ← FIND-ALLITERATION(Tables.AlliterationTable, firstLetter, 5)
12 
13 // If few exact rhymes found, search phonetically
14 if rhymes.length < 3
15     then phoneticRhymes ← PHONETIC-SEARCH(Tables.PhoneticTable, 
16                                            inputWord, suffixLength, 7)
17          // Merge without duplicates
18          for i ← 1 to phoneticRhymes.length
19              do if phoneticRhymes[i] ∉ rhymes
20                    then APPEND(rhymes, phoneticRhymes[i])
21 
22 // Return comprehensive poetry assistance
23 return (rhymes, syllables, alliterations)

// Time Complexity: O(k log k) dominated by sorting in FIND-RHYMES
//                  where k = number of candidate rhymes
// Space Complexity: Θ(k)


================================================================================
COMPLEXITY SUMMARY
================================================================================

OPERATION                  | AVERAGE CASE | WORST CASE  | SPACE
---------------------------|--------------|-------------|--------
Hash Insert                | O(1)         | O(s)        | Θ(1)
Hash Search                | O(1)         | O(s)        | Θ(k)
Rhyme Scoring              | Θ(m)         | Θ(m)        | Θ(1)
Find Rhymes                | O(k log k)   | O(k log k)  | Θ(k)
Syllable Count             | Θ(m)         | Θ(m)        | Θ(1)
Alliteration Lookup        | O(k)         | O(k)        | Θ(k)
Phonetic Key               | Θ(m)         | Θ(m)        | Θ(m)
Phonetic Search            | O(k log k)   | O(k log k)  | Θ(k)
Build Assistant            | Θ(w·m)       | Θ(w·m)      | Θ(w·m)
Full Query                 | O(k log k)   | O(k log k)  | Θ(k)

where: s = hash table size (worst case when table nearly full)
       m = average word length
       k = number of rhyme candidates
       w = number of words in dictionary (224,000)


================================================================================
KEY DESIGN DECISIONS AND STRENGTHS
================================================================================

1. THREE SEPARATE DATA STRUCTURES:
   - Suffix hash table: Fast O(1) rhyme lookup by word ending
   - Alliteration array: Fast O(1) lookup by first letter
   - Phonetic hash table: Handles spelling/pronunciation mismatches
   
   TRADE-OFF: Space O(3w·m) vs. single structure O(w·m)
   JUSTIFICATION: Prioritize speed for interactive poetry assistance
                  Memory cost is acceptable given modern systems

2. HYBRID COLLISION RESOLUTION:
   - Linear probing for slot selection (open addressing)
   - Separate chaining (linked lists) within slots for same suffix
   - Provides both speed (fewer wasted slots) and space efficiency (no empty chains)

3. ORIGINAL ALGORITHMS:
   - Application of polynomial rolling hash to suffix-based rhyme indexing
   - Multi-factor rhyme quality scoring (beyond binary yes/no matching)
   - Phonetic key generation for pronunciation-based matching
   - All adapted specifically for poetry assistance domain

4. RANKING OVER BOOLEAN MATCHING:
   - Rather than returning all rhymes equally, we score by quality
   - Considers suffix length, first letter, word length similarity
   - Provides best rhymes first (user experience optimization)

5. GRACEFUL DEGRADATION:
   - If exact rhymes < 3, automatically falls back to phonetic search
   - Handles English spelling irregularities (through/blue, rough/stuff)
   - User never sees "no results" for reasonable inputs

6. PERFORMANCE CHARACTERISTICS:
   - Query time: O(k log k) where k is typically small (< 100)
   - Build time: O(w·m) single pass through dictionary
   - Space: O(3w·m) for three indices vs. O(w·m) for single structure
   - Decision: 3x space cost justified by O(1) lookups across features

7. ADAPTIVE HASH TABLE SIZING:
   - Table size can be adjusted based on actual data characteristics
   - For a dictionary with ~3,300 unique suffixes, a table of ~6,600 slots 
     (prime number 6577) provides optimal space-time balance
   - Maintains load factor around 0.5, ensuring fast lookups with minimal memory waste
   - Prime number sizing reduces clustering and improves hash distribution
   - This flexibility allows the system to scale efficiently from small poetry 
     projects to comprehensive dictionaries without over-allocating memory
