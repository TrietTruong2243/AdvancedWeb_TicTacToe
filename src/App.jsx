import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ backgroundColor: isWinningSquare ? 'yellow' : 'white' }}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i); // Pass the index of the move
  }

  const winner = calculateWinner(squares);
  let status;
  let winningSquares = [];

  if (winner) {
    status = "Result: Winner " + winner[0];
    winningSquares = winner[1]; // The indices of the winning squares
  } else if (squares.every(Boolean)) {
    status = "Result: Draw!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Create the board dynamically
  const boardRows = [];
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      rowSquares.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          isWinningSquare={winningSquares.includes(index)} // Highlight if it's a winning square
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), moveIndex: null }]); // Store squares and move index
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, moveIndex) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, moveIndex }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((entry, move) => {
    console.log(entry)
    const { moveIndex } = entry; // Get the move index from the entry
    const row = moveIndex !== null ? Math.floor(moveIndex / 3) : null; // Calculate row
    const col = moveIndex !== null ? moveIndex % 3 : null; // Calculate column
    const description = move
      ? `Go to move #${move} (${row}, ${col})`
      : "Go to game start";

    return (
      <li key={move}>
        {move === currentMove ? (
        <span>You are at move #{move} {(row !== null && col !== null) ? `(${row}, ${col})` : ''}</span>
    ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleSortOrder}>
          {isAscending ? "Sort: Descending" : "Sort: Ascending"}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]]; // Return the winner and the winning line
    }
  }
  return null;
}
