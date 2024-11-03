const { gannSquareDynamic } = require("./list/gannSquareDynamic");

exports.lineupMethood = (arr) => {
  let xyArr = [];
  for (const obj of gannSquareDynamic) {
    if (arr.includes(obj.position)) {
      xyArr.push({ x: obj.x, y: obj.y });
    }
  }

  // get all duplicate number in x coordinator
  const duplicateX = new Set();
  const xCounts = new Map();

  for (const { x, y } of xyArr) {
    if (!xCounts.has(x)) {
      xCounts.set(x, 1);
    } else {
      xCounts.set(x, xCounts.get(x) + 1);
      duplicateX.add(x);
    }
  }

  // get all xy number that x is duplicate
  let xyNumbers = [];
  for (let x = 0; x < Array.from(duplicateX).length; x++) {
    for (let i = 1; i <= 7; i++) {
      xyNumbers.push({ x: Array.from(duplicateX)[x], y: i });
    }
  }

  // get all duplicate number in y coordinator
  const duplicateY = new Set();
  const yCounts = new Map();

  for (const { x, y } of xyArr) {
    if (!yCounts.has(y)) {
      yCounts.set(y, 1);
    } else {
      yCounts.set(y, yCounts.get(y) + 1);
      duplicateY.add(y);
    }
  }

  // get all xy number that y is duplicate
  for (let y = 0; y < Array.from(duplicateY).length; y++) {
    for (let i = 1; i <= 7; i++) {
      xyNumbers.push({ x: i, y: Array.from(duplicateY)[y] });
    }
  }

  // get positon numbers
  let relatedPositions = [];
  for (const { x, y } of xyNumbers) {
    const position = gannSquareDynamic.find(
      (item) => item.x === x && item.y === y
    );
    if (position) {
      relatedPositions.push(position.position);
    }
  }

  // Remove duplicates
  let newRelatedPositions = [
    ...new Set(relatedPositions.map(JSON.stringify)),
  ].map(JSON.parse);

  // sorting
  return newRelatedPositions.sort((a, b) => a - b);
};
