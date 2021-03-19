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
    else console.log("valid coordinate and value checked");
  });

  app.route("/api/solve").post((req, res) => {
    let puzzle = req.body.puzzle;

    if (!puzzle) return res.json({ error: "Required field missing" });

    let validateResponse = solver.validate(puzzle);
    // If validateResponse has an error value then respond with res.json()
    if (validateResponse) return res.json(validateResponse);
    else console.log("correct length and characters");

    // Begin working on solving sudoku
    let rows = solver.checkRowPlacement(puzzle);
    if (rows.length == 9) console.log("correct rows");
    else {
      console.log("row has a double");
      return res.json({ error: "Puzzle cannot be solved" });
    }

    let columns = solver.checkColPlacement(puzzle);
    if (columns.length == 9) console.log("correct columns");
    else {
      console.log("column has a double");
      return res.json({ error: "Puzzle cannot be solved" });
    }

    // Check region placement
    let regions = solver.checkRegionPlacement(puzzle);
    if (regions.length == 9) console.log("correct regions");
    else {
      console.log("region has a double");
      return res.json({ error: "Puzzle cannot be solved" });
    }
  });
};
