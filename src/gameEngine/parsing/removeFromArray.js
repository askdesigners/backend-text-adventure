module.exports = function(arr) {
  let what;
  const a = arguments;
  let L = a.length;
  let ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
};