function proposition(word) {
  const first = word[0];
  const vowels = ["a", "e", "i", "o", "u"];
  if (vowels.indexOf(first) >= 0) return ` an ${word}`;
  return ` a ${word}`;
}

module.exports = function listize(arr) {
  const proposed = arr.map(function(item) {
    return proposition(item);
  });
  const last = proposed.pop();
  if (arr.length > 1) {
    return `${proposed.join(", ")}, and ${last}`;
  }
  return last;
};