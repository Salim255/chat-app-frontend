import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapDirective } from './tap/tap.directive';


@NgModule({
  declarations: [TapDirective ],
  imports: [
    CommonModule
  ],
  exports: [TapDirective]
})
export class DirectivesModule { }
