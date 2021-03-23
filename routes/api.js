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
    let object = { puzzle: puzzle, coordinate: coordinate, value: value }; // need this to pass a test

    // // If validateResponse has an error value then respond with res.json()
    if (validateResponse !== "correct puzzle")
      return res.json(validateResponse);
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
    else {
      let checkPlacement = solver.checkPlacement(
        puzzle,
        coordinate[0],
        coordinate[1],
        value
      );
      if (checkPlacement == "input is same as value in coordinate") {
        return res.json({ valid: true });
      } else if (checkPlacement == "can't replace number") {
        return res.json(checkPlacement);
      } else res.json(checkPlacement);
    }
  });

  app.route("/api/solve").post((req, res) => {
    let puzzle = req.body.puzzle;

    if (!puzzle) return res.json({ error: "Required field missing" });

    let validateResponse = solver.validate(puzzle);
    // If validateResponse has an error value then respond with res.json()
    if (validateResponse !== "correct puzzle") {
      return res.json(validateResponse);
    }

    // Create arrays with all forms of sudoku needed.
    let filteredRowArray = solver.filterRow(puzzle);
    if (filteredRowArray == "invalid rows") {
      return res.json({ error: "Puzzle cannot be solved" });
    }
    let filteredColumnArray = solver.filterColumn(puzzle);
    if (filteredColumnArray == "invalid columns") {
      return res.json({ error: "Puzzle cannot be solved" });
    }

    // Check region placement
    let filteredRegionArray = solver.filterRegion(puzzle);
    if (filteredRegionArray == "invalid regions") {
      return res.json({ error: "Puzzle cannot be solved" });
    }
    // set up array board from puzzle string given
    let board = solver.stringToBoard(puzzle);
    // solve board.  this changes board so solvedString uses a solved board
    solver.sudokuSolver(board);
    let solvedString = solver.boardToString(board);

    if (solvedString.indexOf(".") == -1) {
      return res.json({ solution: solvedString });
    } else return res.json({ error: "Puzzle cannot be solved" });
  });
};
