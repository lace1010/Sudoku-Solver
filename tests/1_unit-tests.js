const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  test("Logic handles a valid puzzle string of 81 characters", (done) => {
    let input =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.equal(solver.validate(input), "correct puzzle");
    done();
  });

  test("Logic handles a puzzle string with invalid characters", (done) => {
    let input =
      "j?9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.deepEqual(solver.validate(input), {
      error: "Invalid characters in puzzle",
    });
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
    let input = "..9..5.1.85.";
    assert.deepEqual(solver.validate(input), {
      error: "Expected puzzle to be 81 characters long",
    });
    done();
  });

  test("Logic handles a valid row placement", (done) => {
    let input =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.isArray(solver.filterRow(input));
    done();
  });

  test("Logic handles an invalid row placement", (done) => {
    let input =
      "999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.equal(solver.filterRow(input), "invalid rows");
    done();
  });

  test("Logic handles a valid column placement", (done) => {
    let input =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.isArray(solver.filterColumn(input));
    done();
  });

  test("Logic handles an invalid column placement", (done) => {
    let input =
      "..9..5.1.8594....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.equal(solver.filterColumn(input), "invalid columns");
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", (done) => {
    let input =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.isArray(solver.filterRegion(input));
    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", (done) => {
    let input =
      ".99..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.equal(solver.filterRegion(input), "invalid regions");
    done();
  });

  test("Valid puzzle strings pass the solver", (done) => {
    let input =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

    let board = solver.stringToBoard(input);
    assert.equal(solver.sudokuSolver(board), true);
    done();
  });

  test("Valid puzzle strings pass the solver", (done) => {
    // Make input pass all requirements but still unsolveable but placing a random number in . that could be one of many solutions.
    let input =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62471...9......1945....4.37.4.3..6..";
    let board = solver.stringToBoard(input);
    assert.equal(solver.sudokuSolver(board), false);
    done();
  });

  test("Solver returns the the expected solution for an incomplete puzzzle", (done) => {
    // Make input pass all requirements but still unsolveable but placing a random number in . that could be one of many solutions.
    let input =
      "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let board = solver.stringToBoard(input);
    solver.sudokuSolver(board); // changes board to solve board.
    let solvedString = solver.boardToString(board);
    assert.notInclude(solvedString, ".");
    done();
  });
});
