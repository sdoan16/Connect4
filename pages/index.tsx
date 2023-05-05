import React, { useState } from "react";
import Tile from "../components/tile";
import {Chip} from "../components/chip";
import boardStyles from "styles/board.module.css";
import {
  Dialog,
  Pane,
  majorScale, Button
} from "evergreen-ui";
import DropArrow from "../components/dropArrow";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const NEW_BOARD = [
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
  ["", "", "", "", "", "", ""],
];

export const ChipTypes = {
  RED: 'red',
  YELLOW: 'yellow',
}
const ROWS = 6;
const COL = 7;

export default function Connect4() {
  const [board, setBoard] = useState( NEW_BOARD);
  const [turn, setTurn] = useState(true);
  const [count, setCount] = useState(0);
  const [winner, setWinner] = useState("");
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const onClick = (j: number) => {
    if (winner || board[0][j]) {
      return;
    }
    let row = board.length - 1;
    let player = turn ? "1" : "2";
    let boardCopy = [...board];
    while (row >= 0) {
      if (board[row][j]) {
        row--;
        continue;
      }
      boardCopy[row][j] = player;
      setBoard(boardCopy);
      setCount(count + 1);
      break;
    }
    let hasWinner;
    if (count > 4) {
      hasWinner = checkForWinner(player, row, j, boardCopy);
    }
    if (hasWinner) {
      setWinner(player);
      setTimeout(() => {
        setShowWinnerDialog(true);
      }, 1000);
      return;
    }
    if (count === 41) {
      setGameOver(true);
      return;
    }
    setTurn((turn) => {
      return !turn;
    });
  };

  const resetBoard = () => {
    setWinner("");
    setGameOver(false);
    setBoard([
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
      ["", "", "", "", "", "", ""],
    ]);
    setTurn(true);
    setCount(0);
    setShowWinnerDialog(false);
  };

  const checkNegativeDiagonal = (value: string, rowNumber: number, j: number, copy: string[][]) => {
    let min = Math.min(rowNumber, j);
    let x = rowNumber - min;
    let y = j -min;
    let count = 0;
    while(x < ROWS  && y < COL ) {
      if(copy[x][y] !== value && count > 0) {
        return false;
      }
      if(copy[x][y] !== value && count === 0) {
        x++; y++;
        continue;
      }
      count++;
      if(count === 4) {
        return true;
      }
      x++; y++;
    }
    return false;
  };

  const checkPositiveDiagonal = (value: string, rowNumber: number, j: number) => {
    let count = 1;
    let i;
    let k;
    if (rowNumber > 0 && j > 0) {
      i = rowNumber - 1;
      k = j + 1;
      while (i < ROWS && k >= 0) {
        if (board[i][k] !== value) {
          break;
        }
        count = count + 1;
        if (count === 4) {
          setWinner(value);
          return true;
        }
        i = i - 1;
        k = k + 1;
      }
    }
    i = rowNumber + 1;
    k = j - 1;
    while (i < ROWS && k >= 0) {
      if (board[i][k] !== value) {
        break;
      }
      count = count + 1;
      if (count === 4) {
        setWinner(value);
        return true;
      }
      i = i + 1;
      k = k - 1;
    }
    return false;
  };

  const checkVertical = (value: string, rowNumber: number, j: number) => {
    let count = 1;
    for (let i = rowNumber + 1; i < board.length; i++) {
      if (board[i][j] !== value) {
        break;
      }
      count = count + 1;
      if (count === 4) {
        return true;
      }
    }
    return false;
  };

  const checkHorizontal = (value: string, rowNumber: number, j: number, copy:string[][]) => {
    let count = 0;
    const row = copy[rowNumber];
    let i =0;
    while ( i< row.length) {
      if(row[i] !== value && count > 0) {
          return false;
      }
      if(row[i] !== value && count === 0) {
        i++;
        continue;
        }
      count++;
      if(count === 4) {
        return true;
      }
      i++;
    }
    return false;
  };

  const checkForWinner = (letter: string, i: number, j: number, boardCopy: string[][]) => {
    return (
      checkVertical(letter, i, j) ||
      checkHorizontal(letter, i, j, boardCopy) ||
      checkNegativeDiagonal(letter, i, j, boardCopy) ||
      checkPositiveDiagonal(letter, i, j) 
    );
  };
  return (
   < DndProvider backend={HTML5Backend}>
    <div className={boardStyles.container}>
      <div className={boardStyles.game}>
        <div className={boardStyles.header}>
          <div className={boardStyles.currentPlayer}>
            {!winner && !gameOver && (
              <div className={boardStyles.row}>
              <div >
              {`Player ${turn ? 1 : 2}'s turn:`}&nbsp;&nbsp;&nbsp;
              </div> 
              <Chip id={turn ? '1' : '2'} type={turn ? ChipTypes.YELLOW : ChipTypes.RED} handleDrop={onClick}></Chip>
              <div className={boardStyles.instructions}>Drag chip over arrow and drop into column</div>
              </div>
            )}
            {gameOver && <div>Game Over</div>}
            {winner && <div>{`Winner: Player ${winner}!!`}</div>}
          </div>
          <Button className={boardStyles.reset} onClick={() => resetBoard()}>
            Reset Board
          </Button>
        </div>
        <div className="board">
          <div className={boardStyles.row}>
            {Array(7)
              .fill("")
              .map((arrow, i) => (
                  <DropArrow j={i} dropChip={onClick}></DropArrow>
              ))}
          </div>
          {board.map((row, i) => (
            <div className={boardStyles.row}>
              {row.map((tile, j) => (
                <Tile key={`T${i}${j}`} value={tile}/>
              ))}
            </div>
          ))}
        </div>
      </div>
      <Pane>
        <Dialog
          isShown={showWinnerDialog}
          onConfirm={() => resetBoard()}
          hasCancel={false}
          confirmLabel="Play Again"
          title={`Player ${winner} won!!!`}
          onCloseComplete={() => setShowWinnerDialog(false)}
          hasFooter={true}
        ></Dialog>
      </Pane>
      <Pane>
        <Dialog
          isShown={gameOver}
          onConfirm={() => resetBoard()}
          hasCancel={false}
          confirmLabel="Play Again"
          title={`Game Over!`}
          onCloseComplete={() => setGameOver(false)}
          hasFooter={true}
        ></Dialog>
      </Pane>
    </div>
   </DndProvider>
  );
}
