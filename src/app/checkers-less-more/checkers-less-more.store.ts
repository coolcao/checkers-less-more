import { Injectable, signal } from "@angular/core";
import { Cell } from "./checkers-less-more.types";

@Injectable({
  providedIn: 'root'
})
export class Store {
  constructor() { }

  private _size = signal(7);
  private _virtualSize = signal(2);
  private _board = signal<Cell[][]>([]);

  readonly size = this._size.asReadonly();
  readonly board = this._board.asReadonly();


  initBoard(size?: number, virtualSize?: number) {
    if (size) {
      this._size.set(size);
    }
    if (virtualSize) {
      this._virtualSize.set(virtualSize);
    }
    const board: Cell[][] = new Array(this._size()).fill(0).map(() => new Array(this._size()).fill(null));

    for (let i = 0; i < this._size(); i++) {
      for (let j = 0; j < this._size(); j++) {
        if ((i < this._virtualSize() || i > this._size() - 1 - this._virtualSize()) && (j < this._virtualSize() || j > this._size() - 1 - this._virtualSize())) {
          // 虚拟节点
          board[i][j] = {
            x: i,
            y: j,
            empty: true,
            virtual: true,
          }
        } else {
          board[i][j] = {
            x: i,
            y: j,
            empty: false,
            virtual: false,
          }
        }

        if (i == (this._size() >>> 1) && j == (this._size() >>> 1)) {
          board[i][j].empty = true;
        }
      }
    }
    console.log(board);


    this._board.set(board);

  }

  updateCell(x: number, y: number, cell: Cell) {
    const board = this._board();
    for (let i = 0; i < this._size(); i++) {
      for (let j = 0; j < this._size(); j++) {
        if (i === x && j === y) {
          board[i][j] = { ...cell };
        }
      }
    }

    this._board.set([...board]);
  }

  updateCells(board: Cell[][]) {
    const newBoard = [];
    for (const cells of board) {
      newBoard.push([...cells]);
    }
    this._board.set(newBoard);
  }




}
