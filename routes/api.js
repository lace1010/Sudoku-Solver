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

    let checkPlacement = solver.checkPlacement(
      puzzle,
      coordinate[0],
      coordinate[1],
      value
    );

    // // If validateResponse has an error value then respond with res.json()
    if (validateResponse) return res.json(validateResponse);
    // If puzzle coordinate or value is not filled out
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }
    // If the coordinate given is not valid
    else if (!coordinateRegex.test(coordinate) || coordinate.length > 2) {
      return res.json({ error: "Invalid coordinate" });
    }
    // If the value given is invalid
    else if (!numberRegex.test(value)) {
      return res.json({ error: "Invalid value" });
    }
    // If all things given are valid and
    // CHECK ROW COLUMN AND REGION PLACEMENT TO SEE IF A VALUE CAN GO HERE
    else if (checkPlacement) {
      return res.json({ valid: checkPlacement });
    } else res.json({ puzzle: puzzle, coordinate: coordinate, value: value });
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

    // set up array board from puzzle string given
    let board = solver.stringToBoard(puzzle);
    // solve board.  this changes board so solvedString uses a solved board
    solver.sudokuSolver(board);
    let solvedString = solver.boardToString(board);

    if (solvedString.indexOf(".") == -1) {
      console.log(solvedString, "<= solved board as a string");
      return res.json({ solution: solvedString });
    } else console.log("the puzzle given is unsolveable");

    //let solvedStringFromMine = solver.solve(puzzle, puzzle);
  });
};
