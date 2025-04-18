import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appCustomSwiper]',
  standalone: false,
})
export class CustomSwiperDirective {
  @Output() profilePreview = new EventEmitter<void>();
  @Output() slideLeft = new EventEmitter<void>(); // images slider
  @Output() slideRight = new EventEmitter<void>(); // ==
  constructor() {}

  @HostListener('click', ['$event'])
  onClickProfile(event: MouseEvent) {
    const swiperContainer = event.target as HTMLElement;

    console.log(swiperContainer);

    if (!swiperContainer) return;

    const cardWidth = swiperContainer?.clientWidth;
    const cardHeight = swiperContainer?.clientHeight;
    const clientY = event.clientY;
    const clientX = event.clientX;

    if (!cardWidth || !cardHeight) return;

    const cardCenter = cardWidth / 2;
    const lastQuarterY = cardHeight * 0.75; // last quarter (3/4 of the height)

    // Check if click is in the last quarter of the card
    if (clientY > lastQuarterY) {
      console.log('Hello2');
      this.profilePreview.emit(); // Trigger profile preview
      return; // Exit to avoid sliding action
    }
    clientX < cardCenter ? this.slideLeft.emit() : this.slideRight.emit();
  }
}
