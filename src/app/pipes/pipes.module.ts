import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchPopulationPipe } from './match-population.pipe';
import { FileSizePipe } from './file-size.pipe';




@NgModule({
  declarations: [
    MatchPopulationPipe,
    FileSizePipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    MatchPopulationPipe,
    FileSizePipe
  ]
})
export class PipesModule { }
