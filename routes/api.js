"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = (app) => {
  let solver = new SudokuSolver();
  let numberRegex = /\d/;
  let coordinateRegex = /^[a-i][1-9]/i; // can't use \d because 0 is not a coordinate option

  app.route("/api/check").post((req, res) => {
    let puzzle = req.body.puzzle;
    let coordinate = req.body.coordinate;
    let value = req.body.value;

    let validateResponse = solver.validate(req.body.puzzle);
    // If validateResponse has an error value then respond with res.json()
    if (validateResponse) return res.json(validateResponse);
    // If puzzle coordinate or value is not filled out
    else if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }
    // If the coordinate given is not valid
    else if (!coordinateRegex.test(coordinate)) {
      return res.json({ error: "Invalid coordinate" });
    }
    // If the value given is invalid
    else if (!numberRegex.test(value)) {
      return res.json({ error: "Invalid value" });
    }
    // If all things given are valid
    else res.json({ puzzle: puzzle, coordinate: coordinate, value: value });
  });

  app.route("/api/solve").post((req, res) => {
    let puzzle = req.body.puzzle;

    if (!puzzle) return res.json({ error: "Required field missing" });

    let validateResponse = solver.validate(puzzle);
    // If validateResponse has an error value then respond with res.json()
    if (validateResponse) return res.json(validateResponse);
    else console.log("correct length and characters");

    // Create arrays with all forms of sudoku needed.
    let filteredRowArray = solver.filterRow(puzzle);
    if (!filteredRowArray) {
      return res.json({ error: "Puzzle cannot be solved" });
    } else console.log("correct rows");

    let filteredColumnArray = solver.filterColumn(puzzle);
    if (!filteredColumnArray) {
      return res.json({ error: "Puzzle cannot be solved" });
    } else console.log("correct columns");

    // Check region placement
    let filteredRegionArray = solver.filterRegion(puzzle);
    if (!filteredRegionArray) {
      return res.json({ error: "Puzzle cannot be solved" });
    } else console.log("correct regions");

    /* 
    
    *** SIMPLY FILTERING THE STRING INTO row, column  and region ARRAYS *** 
    
    */

    let row = {
      A: filteredRowArray[0],
      B: filteredRowArray[1],
      C: filteredRowArray[2],
      D: filteredRowArray[3],
      E: filteredRowArray[4],
      F: filteredRowArray[5],
      G: filteredRowArray[6],
      H: filteredRowArray[7],
      I: filteredRowArray[8],
    };
    let column = {
      1: filteredColumnArray[0],
      2: filteredColumnArray[1],
      3: filteredColumnArray[2],
      4: filteredColumnArray[3],
      5: filteredColumnArray[4],
      6: filteredColumnArray[5],
      7: filteredColumnArray[6],
      8: filteredColumnArray[7],
      9: filteredColumnArray[8],
    };

    // console.log(row.A, "<= row.A");
    // console.log(row.B, "<= row.B");
    // console.log(row.C, "<= row.C");
    // console.log(filteredRowArray, "<=filteredRowArray");
    // console.log(column[1], "<= column.A");
    // console.log(column[2], "<= column.B");
    // console.log(column[3], "<= column.C");
    // console.log(filteredColumnArray, "<=filteredColumnArray");
    // console.log(filteredRegionArray, "<=filteredRegionArray");

    let checkRow = solver.checkRowPlacement(puzzle, row.A, column[1], 2);
    let solvedString = solver.solve(puzzle, puzzle);
    // console.log(solvedString, "<= solvedString");
  });
};
