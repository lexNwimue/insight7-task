export const isValidWord = (word) => {
  const onlyAlphabets = /^[A-Za-z]+$/;

  // Check for sentences
  if (!word || word.trim().includes(" ") || !onlyAlphabets.test(word)) {
    return false;
  }

  return true;
};
