exports.getRemainder = (dividend, divisor) => {
  /**
   * Calculates the remainder when the dividend is divided by the divisor.
   *
   * @param {number} dividend - The number to be divided.
   * @param {number} divisor - The number to divide the dividend by.
   * @returns {number} The remainder.
   */
  return dividend % divisor;
};

exports.findLeastRemainder = (dividend) => {
  /**
   * Finds the least remainder when dividing the given dividend.
   *
   * @param {number} dividend - The number to be divided.
   * @returns {number} The least remainder.
   */
  let leastRemainder = dividend;

  for (let divisor = 1; divisor <= dividend; divisor++) {
    const remainder = dividend % divisor;
    if (remainder < leastRemainder) {
      leastRemainder = remainder;
    }
  }

  return leastRemainder;
};
