import { computed, Injectable, signal } from "@angular/core";
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
  // 记录每个位置实体棋子是否可以跳跃
  readonly canJump = computed(() => {
    const canJump: boolean[][] = new Array(this._size()).fill(null).map(() => new Array(this._size()).fill(false));
    const board = this._board();
    for (let i = 0; i < this._size(); i++) {
      for (let j = 0; j < this._size(); j++) {
        const cell = board[i][j];
        if (cell.empty || cell.virtual) {
          continue;
        }

        // 上方
        const up = i >= 2 &&
          !board[i - 2][j].virtual && board[i - 2][j].empty && // 距离2的位置是空白非虚拟格子
          !board[i - 1][j].virtual && !board[i - 1][j].empty;  // 距离1的位置是非空非虚拟格子

        // 下方
        const down = i <= this._size() - 3 &&
          !board[i + 2][j].virtual && board[i + 2][j].empty &&
          !board[i + 1][j].virtual && !board[i + 1][j].empty;

        // 左侧
        const left = j >= 2 &&
          !board[i][j - 2].virtual && board[i][j - 2].empty &&
          !board[i][j - 1].virtual && !board[i][j - 1].empty;

        // 右侧
        const right = j <= this._size() - 3 &&
          !board[i][j + 2].virtual && board[i][j + 2].empty &&
          !board[i][j + 1].virtual && !board[i][j + 1].empty;

        const result = up || down || left || right;
        canJump[i][j] = result;
      }
    }
    return canJump;
  });
  // 当所有位置的棋子都不能跳跃时，游戏结束
  readonly isComplete = computed(() => {
    const canJump = this.canJump();
    for (let i = 0; i < this._size(); i++) {
      for (let j = 0; j < this._size(); j++) {
        if (canJump[i][j]) {
          return false;
        }
      }
    }
    return true;
  });
  // 统计还剩实体棋子的数量
  readonly remain = computed(() => {
    let count = 0;
    const board = this._board();
    for (let i = 0; i < this._size(); i++) {
      for (let j = 0; j < this._size(); j++) {
        if (!board[i][j].virtual && !board[i][j].empty) {
          count++;
        }
      }
    }
    return count;
  });


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
