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

  filterRow(puzzleString) {
    let doubleNumberRegex = /([1-9]).*\1/;
    // split string up into 9 rows using regex and match
    let puzzleArrayInRows = puzzleString.match(/.{9}/g);

    let filteredRowArray = puzzleArrayInRows.filter((i) => {
      return !doubleNumberRegex.test(i);
    });
    if (filteredRowArray.length == 9) return filteredRowArray;
  }

  filterColumn(puzzleString) {
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

    if (filteredColumnArray.length == 9) return filteredColumnArray;
  }

  filterRegion(puzzleString) {
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

    // Map through each region and join the three split mini regions to form the 9 whole regions.
    let puzzleArrayInRegions = puzzleArrayInRegionsSplit.map((item) => {
      return item.join("");
    });

    // Now that we have an array of 9 regions as strings filter to see if one has a number twice.
    let filteredRegionArray = puzzleArrayInRegions.filter((item) => {
      return !doubleNumberRegex.test(item);
    });

    // Return the filtered array and handle it with condition statement in api.js in route("/api/solve")
    if (filteredRegionArray.length == 9) return filteredRegionArray;
  }
  checkPlacement(puzzleString, row, col, value) {
    let board = this.stringToBoard(puzzleString);
    // set col and row to the array value thus col has to go back one for index starts at 1 and row we must convert letter to array index for column
    col = col - 1;
    console.log(col, "<= col");
    if (row == "a" || row == "A") {
      row = 0;
    } else if (row == "b" || row == "B") {
      row = 1;
    } else if (row == "c" || row == "C") {
      row = 2;
    } else if (row == "d" || row == "D") {
      row = 3;
    } else if (row == "e" || row == "E") {
      row = 4;
    } else if (row == "f" || row == "F") {
      row = 5;
    } else if (row == "g" || row == "G") {
      row = 6;
    } else if (row == "h" || row == "H") {
      row = 7;
    } else if (row == "i" || row == "I") {
      row = 8;
    }
    console.log(row, "<= row");
    console.log(board[1][1]);
    console.log(board[row][col], "<= board[row][col]");
    if (board[row][col] == value) {
      return "input is same as value in coordinate";
    } else if (board[row][col] !== "." && board[row][col] !== value) {
      return "can't replace number";
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  stringToBoard(puzzleString) {
    // split string up into 9 rows using regex and match
    let puzzleArrayInRows = puzzleString.match(/.{9}/g);
    return puzzleArrayInRows.map((i) => i.split(""));
  }

  boardToString(board) {
    return board.map((i) => i.join("")).reduce((a, b) => a + b);
  }

  isValid(board, row, col, k) {
    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(col / 3) + (i % 3);
      if (board[row][i] == k || board[i][col] == k || board[m][n] == k) {
        return false;
      }
    }
    return true;
  }

  sudokuSolver(data) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (data[i][j] == ".") {
          for (let k = 1; k <= 9; k++) {
            if (this.isValid(data, i, j, k)) {
              data[i][j] = `${k}`;
              if (this.sudokuSolver(data)) {
                return true;
              } else {
                data[i][j] = ".";
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  // recursiveSolve(puzzleString, original) {
  //   // Set up a function that replaces the . string with a value that can fill in sudoku spot correctly
  //   const replaceAt = (string, index, replacement) => {
  //     return (
  //       string.substring(0, index) + replacement + string.substring(index + 1)
  //     );
  //   };

  //   let originalString = original;
  //   let newPuzzleStringAfterAdding = [];
  //   let froArray = [];
  //   let fcArray = [];
  //   let freArray = [];
  //   let previousIndexAddOne;

  //   if (puzzleString.indexOf(".") == -1) {
  //     // console.log("solved bish");
  //     // console.log(puzzleString, "<= after all the mess");
  //     return puzzleString;
  //   } else {
  //     // dance is a label for the outer for loop so when we call break dance; in the nested loop it breaks out of both loops

  //     dance: for (let i = 0; i < puzzleString.length; i++) {
  //       // console.log(i, "index before conditions BEFORE");
  //       // console.log(puzzleString, "puzzleString before condition BEFORE");
  //       // console.log(
  //       //   newPuzzleStringAfterAdding[i],
  //       //   "<= newPuzzleStringAfterAdding[i] BEFORE"
  //       // );
  //       // console.log(
  //       //   parseInt(puzzleString[i]) + 1,
  //       //   "parseInt(puzzleString[i]) + 1 BEFORE"
  //       // );

  //       if (newPuzzleStringAfterAdding[i] == parseInt(puzzleString[i]) + 1) {
  //         puzzleString = newPuzzleStringAfterAdding;
  //         // console.log(puzzleString, "<= puzzleString after if condition");
  //       }

  //       // Only handles the .'s
  //       if (
  //         originalString[i].indexOf(".") !== -1 &&
  //         puzzleString[i].indexOf(".") !== -1
  //       ) {
  //         for (let j = 1; j < 10; j++) {
  //           froArray = this.filterRow(replaceAt(puzzleString, i, j));
  //           fcArray = this.filterColumn(replaceAt(puzzleString, i, j));
  //           freArray = this.filterRegion(replaceAt(puzzleString, i, j));

  //           if (froArray && fcArray && freArray) {
  //             // puzzleString = replaceAt(puzzleString, i, j);
  //             // console.log(puzzleString, "<= puzzleString");
  //             break;
  //           }

  //           // above this works. Now we are working out if none of the nubers work we want to go back
  //           //to the previous index with a . in original array and add that nuber by 1 and see if that string works. If not add one again and so on.
  //           else if (j == 9) {
  //             // Go back to the previous . index and add that number by one.
  //             // console.log(puzzleString, "puzzleString in else ");
  //             // console.log(
  //             //   parseInt(puzzleString[i - 1]) + 1,
  //             //   "<= parseInt(puzzleString[i-1]) + 1"
  //             // );

  //             previousIndexAddOne = parseInt(puzzleString[i - 1]) + 1;

  //             if (previousIndexAddOne !== 10 && previousIndexAddOne) {
  //               newPuzzleStringAfterAdding = replaceAt(
  //                 puzzleString,
  //                 i - 1,
  //                 previousIndexAddOne
  //               );

  //               // console.log(
  //               //   newPuzzleStringAfterAdding,
  //               //   "<= newPuzzleStringAfterAdding"
  //               // );

  //               i -= 2;
  //               break;
  //             } else if (previousIndexAddOne == 10) {
  //               // reset puzzle string and newPuzzleStringAfterAdding to string before

  //               puzzleString =
  //                 puzzleString.slice(0, i - 1) +
  //                 originalString.slice(i - 1, originalString.length);

  //               puzzleString = replaceAt(
  //                 puzzleString,
  //                 i - 2,
  //                 parseInt(puzzleString[i - 2]) + 1
  //               );

  //               // console.log(
  //               //   puzzleString,
  //               //   "<= puzzleString with slices and replacing weird index"
  //               // );
  //               break dance; // Breaks out of both loops
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   return this.recursiveSolve(puzzleString, originalString);
  // }

  // solve(puzzleString1) {
  //   let solvedString = this.recursiveSolve(puzzleString1, puzzleString1);
  //   console.log(solvedString, "<= solvedString in sudoku-solver.js");
  //   return solvedString;
  // }
}

module.exports = SudokuSolver;
