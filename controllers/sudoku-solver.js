class SudokuSolver {
  validate(puzzleString) {
    let notNumberOrPeriodRegex = /[^\.0-9]/;
    // Add invalid characters condition
    if (notNumberOrPeriodRegex.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    } else if (puzzleString.length !== 81) {
      return {
        error: "Expected puzzle to be 81 characters long",
      };
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let doubleNumberRegex = /([1-9]).*\1/;
    // split string up into 9 rows using regex and match
    let puzzleArrayInRows = puzzleString.match(/.{9}/g);

    let filterdRowArray = puzzleArrayInRows.filter((i) => {
      return !doubleNumberRegex.test(i);
    });

    return filterdRowArray;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let doubleNumberRegex = /([1-9]).*\1/;
    let puzzleArrayInColumns = [];
    let columnArray = [];
    for (let i = 0; i < 9; i++) {
      columnArray.push(puzzleString[i]); // need to push in initial value
      // for each index we cycle through valid 81 character string to get column
      for (let j = 0; j < 81; j += 9) {
        columnArray.push(puzzleString.slice(i + j + 9, i + 1 + j + 9));
      }
    }

    // We join all of the columns characters together to make one big string then match for every 9 characters to form array of columns
    puzzleArrayInColumns = columnArray.join("").match(/.{9}/g);

    let filteredColumnArray = puzzleArrayInColumns.filter((i) => {
      return !doubleNumberRegex.test(i);
    });
    return filteredColumnArray;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let doubleNumberRegex = /([1-9]).*\1/;
    let splitArrayInThree = puzzleString.match(/.{3}/g);
    let puzzleArray = [];

    // regions for top
    for (let i = 0; i < 3; i++) {
      puzzleArray.push(
        splitArrayInThree[i],
        splitArrayInThree[i + 3],
        splitArrayInThree[i + 6]
      );
    }

    // regions for middle
    for (let i = 9; i < 12; i++) {
      puzzleArray.push(
        splitArrayInThree[i],
        splitArrayInThree[i + 3],
        splitArrayInThree[i + 6]
      );
    }

    // regions for bottom
    for (let i = 18; i < 21; i++) {
      puzzleArray.push(
        splitArrayInThree[i],
        splitArrayInThree[i + 3],
        splitArrayInThree[i + 6]
      );
    }

    // Split the regions in groups of 3 so the first 3 sets is the first region. So on and so on.
    let puzzleArrayInRegionsSplit = [];
    for (var i = 0, end = puzzleArray.length / 3; i < end; ++i) {
      puzzleArrayInRegionsSplit.push(puzzleArray.slice(i * 3, (i + 1) * 3));
    }

    // Map through each region and join the three split mini regions to form whole regions.
    let puzzleArrayInRegions = puzzleArrayInRegionsSplit.map((item) => {
      return item.join("");
    });

    // Now that we have an array of 9 regions as strings filter to see if one has a number twice.
    let filteredRegionArray = puzzleArrayInRegions.filter((item) => {
      return !doubleNumberRegex.test(item);
    });

    // Return the filtered array and handle it with condition statement in api.js in route("/api/solve")
    return filteredRegionArray;
  }

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
