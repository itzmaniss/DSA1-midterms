function query(tables, inputWord, suffixLength) {
  let rhymes = findRhymes(tables.rhymeTable, inputWord, suffixLength, 10);
  let syllables = countSyllables(inputWord);

  let firstLetter = inputWord[0];
  let alliterations = findAlliteration(
    tables.alliterationTable,
    firstLetter,
    5,
  );

  if (rhymes.length < 3) {
    let phoneticRhymes = phoneticSearch(
      tables.phoneticTable,
      inputWord,
      suffixLength,
      7,
    );

    for (let i = 0; i < phoneticRhymes.length; i++) {
      if (!rhymes.includes(phoneticRhymes[i])) {
        rhymes.push(phoneticRhymes[i]);
      }
    }
  }

  return { rhymes, syllables, alliterations };
}
