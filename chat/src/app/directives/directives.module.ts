import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TapDirective } from './tap/tap.directive';
import { PressDirective } from './press/press.directive';


@NgModule({
  declarations: [TapDirective, PressDirective ],
  imports: [
    CommonModule
  ],
  exports: [TapDirective, PressDirective]
})
export class DirectivesModule { }
