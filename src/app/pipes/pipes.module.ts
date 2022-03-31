import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchPopulationPipe } from './match-population.pipe';




@NgModule({
  declarations: [
    MatchPopulationPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MatchPopulationPipe,
  ]
})
export class PipesModule { }
