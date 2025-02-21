import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckersLessMoreBoardComponent } from './checkers-less-more-board/checkers-less-more-board.component';

const routes: Routes = [
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  { path: 'board', component: CheckersLessMoreBoardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckersLessMoreRoutingModule { }
