import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckersLessMoreRoutingModule } from './checkers-less-more-routing.module';
import { CheckersLessMoreBoardComponent } from './checkers-less-more-board/checkers-less-more-board.component';
import { ScatterFlowersComponent } from './scatter-flowers/scatter-flowers.component';


@NgModule({
  declarations: [
    CheckersLessMoreBoardComponent,
    ScatterFlowersComponent,
  ],
  imports: [
    CommonModule,
    CheckersLessMoreRoutingModule,
  ],
})
export class CheckersLessMoreModule { }
