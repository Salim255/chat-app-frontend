/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { Swiper } from 'swiper/types';
import {
  DisableProfileSwipe,
  DiscoverService,
} from 'src/app/features/discover/services/discover.service';
import { Profile } from 'src/app/features/discover/model/profile.model';
import { StringUtils } from 'src/app/shared/utils/string-utils';

type PageName = 'discover' | 'profile-viewer';

@Component({
  selector: 'app-profile-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: false,
})
export class SliderComponent implements OnChanges, AfterViewInit {
  @Input() profile!: Profile;
  @Input() profileToView: DisableProfileSwipe | null = null;
  @Input() swipeDirection: any;
  @Input() pageName: PageName | null = null;

  @ViewChild('cardElement', { static: false }) cardElement!: ElementRef;
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  swiperModules = [IonicSlides];
  swiper!: Swiper; // Store Swiper instance
  swiperOptions = {
    pagination: { clickable: true },
    allowTouchMove: false, // Disable Swiper's internal swipe handling
  };

  profileViewerIsActive: boolean = false;
  sliderHeight: string = '';

  currentIndex: number = 0;
  currentImage: string | null = null;

  constructor(private discoverService: DiscoverService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    this.currentIndex = 0;
    this.profileViewerIsActive = this.profileToView?.disableSwipe ?? false;
  }

  ngAfterViewInit(): void {
    this.swiper = this.swiperContainer?.nativeElement.swiper;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  trackByIndex(index: number, _: any): number {
    return index;
  }

  setUserImages(profile: Profile): string[] {
    const imagesList = [
      StringUtils.getAvatarUrl(profile?.photos[0]),
      StringUtils.getAvatarUrl(profile?.photos[1]),
      StringUtils.getAvatarUrl(profile?.photos[2]),
      StringUtils.getAvatarUrl(profile?.photos[3])
    ];
    return imagesList;
  }

  onSwipe(swipeDirection: string): void {
    if (swipeDirection === 'right') {
      this.swiperContainer.nativeElement.swiper.slideNext();
    } else if (swipeDirection === 'left') {
      this.swiperContainer.nativeElement.swiper.slidePrev();
    }
  }

  setProfileDetailsStyle(profileToView: DisableProfileSwipe | null): string {
    if (this.profile?.user_id !== profileToView?.profile.user_id)
      return 'profile-summary profile-summary__show';
    if (!profileToView?.disableSwipe) {
      return 'profile-summary profile-summary__show';
    } else {
      return 'profile-summary profile-summary__hide';
    }
  }

  setSwiperContainerHeight(profileToView: DisableProfileSwipe | null): string {
    if (this.profile?.user_id !== profileToView?.profile.user_id)
      return 'swiper-container swiper-container__preview-disabled-height';
    if (!profileToView?.disableSwipe) {
      return 'swiper-container swiper-container__preview-disabled-height';
    } else {
      return 'swiper-container swiper-container__preview-enabled-height';
    }
  }

  setProfileImagesHeight(profileToView: DisableProfileSwipe | null): string {
    if (this.profile?.user_id !== profileToView?.profile.user_id)
      return 'profile-img  profile-img__preview-disabled';
    if (!profileToView?.disableSwipe) {
      return 'profile-img  profile-img__preview-disabled';
    } else {
      return 'profile-img  profile-img__preview-enabled';
    }
  }

  onProfileView(): void {
    if (this.profileToView?.disableSwipe) return;
    this.discoverService.onDiscoverProfileToggle({ profile: this.profile, disableSwipe: true });
  }

  slideLeft(): void {
    this.slidePrev();
  }

  private slidePrev() {
    if (this.currentIndex > 0) {
      this.currentIndex = this.currentIndex - 1;
    } else {
      // this.currentIndex = this.setUserImages(this.profile).length - 1; // Loop back to last image
      console.log(this.currentIndex);
    }
  }

  private slideNext() {
    if (this.currentIndex < this.setUserImages(this.profile).length - 1) {
      this.currentIndex = this.currentIndex + 1;
      console.log(this.currentIndex);
    } else {
      //this.currentIndex = 0; // Loop back to last image
      console.log(this.currentIndex);
    }
  }
  slideRight(): void {
    console.log('From right');
    this.slideNext();
  }
}
