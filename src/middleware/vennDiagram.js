const { gannSquareDynamic } = require("./list/gannSquareDynamic");

exports.radiateMethood = (positionNumber) => {
  let currentX;
  let currentY;
  for (let i = 0; i < gannSquareDynamic.length; i++) {
    if (gannSquareDynamic[i].position == positionNumber) {
      currentX = gannSquareDynamic[i].x;
      currentY = gannSquareDynamic[i].y;
      break;
    }
  }

  let relatedPositions = [];

  // Add positions with the same x coordinate
  for (let i = 1; i <= 7; i++) {
    relatedPositions.push({ x: currentX, y: i });
  }

  // Add positions with the same y coordinate
  for (let i = 1; i <= 7; i++) {
    relatedPositions.push({ x: i, y: currentY });
  }

  // Add positions with the different x & y coordinate
  let index = 1;
  for (let x = currentX - 1; x > 1; x--) {
    // console.log("1", { x: x, y: currentY + index });
    relatedPositions.push({ x: x, y: currentY + index });
    index++;
  }
  // reset index
  index = 1;
  for (let y = currentY - 1; y <= 7; y--) {
    // console.log("2 ", { x: currentX + index, y: y });
    relatedPositions.push({ x: currentX + index, y: y });
    if (y == 1 || currentX + index == 7) {
      break;
    }
    index++;
  }
  // reset index
  index = 1;
  for (let x = currentX + 1; x <= 7; x++) {
    // console.log("3 ", { x: x, y: currentY + index });
    relatedPositions.push({ x: x, y: currentY + index });
    index++;
  }

  // reset index
  index = 1;
  for (let y = currentY - 1; y >= 1; y--) {
    // console.log("4 ", { x: currentX - index, y: y });
    relatedPositions.push({ x: currentX - index, y: y });
    index++;
    // if (y == 1) {
    //   break;
    // }
  }

  // Remove duplicates
  let newRelatedPositions = [
    ...new Set(relatedPositions.map(JSON.stringify)),
  ].map(JSON.parse);

  // sorting
  return newRelatedPositions
    .map((coord) => {
      // console.log("coord: ", coord);
      const position = gannSquareDynamic.find(
        (item) => item.x === coord.x && item.y === coord.y
      );
      // console.log("position: ", position);
      return position ? position.position : "";
    })
    .sort((a, b) => {
      if (a === "") return 1;
      if (b === "") return -1;
      return parseInt(a) - parseInt(b);
    });
};
