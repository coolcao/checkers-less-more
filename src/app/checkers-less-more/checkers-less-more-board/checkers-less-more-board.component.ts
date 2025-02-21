import { Component, inject, OnInit } from '@angular/core';
import { Store } from '../checkers-less-more.store';
import { Cell } from '../checkers-less-more.types';

@Component({
  selector: 'app-checkers-less-more-board',
  standalone: false,

  templateUrl: './checkers-less-more-board.component.html',
  styleUrl: './checkers-less-more-board.component.css'
})
export class CheckersLessMoreBoardComponent implements OnInit {

  store = inject(Store);

  board = this.store.board;
  canJumpArr = this.store.canJump;
  remain = this.store.remain;
  isComplete = this.store.isComplete;

  // 记录点击格子的坐标
  clickedCell: Cell | null = null;


  ngOnInit(): void {
    this.store.initBoard();
  }

  jump(from: Cell, to: Cell, midCell: Cell) {
    from.empty = true;
    from.clicked = false;

    to.empty = false;
    to.clicked = false;

    midCell.empty = true;
    midCell.clicked = false;

    this.store.updateCells(this.board());
  }

  // 判断是否可以跳跃
  // 如果可以，返回中间格子，否则返回null
  canJump(from: Cell, to: Cell): Cell | null {
    if (from.virtual || to.virtual) {
      return null;
    }
    // to 一定得是空白格子，否则不能进行跳跃
    if (!to.empty) {
      return null;
    }

    // 判断from和to之间的格子，一定得是非空白格子才能跳跃
    // 计算横向和纵向的距离
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);

    // 跳跃距离必须是2格
    if ((dx == 2 && dy == 0) || (dy == 2 && dx == 0)) {
      // 计算中间格子的坐标
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;

      // 获取中间格子
      const board = this.board();
      const midCell = board[midX][midY];
      // 中间格子必须是非空白格子
      if (midCell.empty) {
        return null;
      }
      return midCell;
    }

    return null;
  }

  clickCell(cell: Cell) {
    if (this.isComplete()) {
      return;
    }
    // 如果是虚拟格子，不做任何操作
    if (cell.virtual) {
      return;
    }

    // 如果是空白格子，需要判断第一次点击的格子以及能否进行跳跃
    if (cell.empty) {
      // 判断是否是第一次点击
      if (this.clickedCell == null) {
        // 第一次就点击空白格子，无效操作，直接返回
        return;
      }
      // 判断是否可以进行跳跃
      const from = this.clickedCell;
      const to = cell;
      const midCell = this.canJump(from, to);
      if (midCell) {
        // 进行跳跃
        this.jump(from, to, midCell);
        return;
      }

      return;
    }

    this.clickedCell = cell;

    const board = this.board();
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (i == cell.x && j == cell.y) {
          board[i][j].clicked = true;
        } else {
          board[i][j].clicked = false;
        }
      }
    }

    this.store.updateCells(board);
  }
}
