exports.getCommonNumbers = (arr1, arr2) => {
  let commonNumbers = [];
  for (const num of arr1) {
    // console.log('num: ', num)
    if (arr2.includes(num)) {
      commonNumbers.push(num);
    }
  }

  return commonNumbers;
};
