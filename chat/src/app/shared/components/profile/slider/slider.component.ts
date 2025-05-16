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
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { ProfileViewerService } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { Profile } from 'src/app/features/discover/model/profile.model';

export enum PageName {
  Discover = 'discover',
  ProfileViewer =  'profile-viewer',
  DatingProfile = 'dating-profile',
};

@Component({
  selector: 'app-profile-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: false,
})
export class SliderComponent implements OnChanges, AfterViewInit {
  @Input() profile!: Profile;
  @Input() swipeDirection: any;
  @Input() pageName:PageName = PageName.Discover;
  @ViewChild('cardElement', { static: false }) cardElement!: ElementRef;
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  swiperModules = [IonicSlides];
  swiper!: Swiper; // Store Swiper instance
  swiperOptions = {
    pagination: { clickable: true },
    allowTouchMove: false, // Disable Swiper's internal swipe handling
  };


  sliderHeightStyle: string = '';
  imagesHeightStyle: string = '';
  detailsHeightStyle: string = '';

  currentIndex: number = 0;
  currentImage: string | null = null;

  profilePhotos: string [] = [];
  constructor(private profileViewerService: ProfileViewerService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes:', this.profile);
    if (changes['profile']) {
      const prev = changes['profile'].previousValue;
      const curr = changes['profile'].currentValue;

      // Only react if the profile actually changed
      if (JSON.stringify(prev) !== JSON.stringify(curr)) {
        this.profile = curr;
        this.currentIndex = 0;

        if (this.profile?.photos) {
          this.profilePhotos = this.setUserImages();
        }
      }
    }

    if(changes['pageName']) {
      const prev = changes['pageName'].previousValue;
      const curr = changes['pageName'].currentValue;
      // Only react if the swipeDirection actually changed
      if (prev !== curr) {
        this.setProfileDetailsStyle();
        this.setSwiperContainerHeight();
        this.setProfileImagesHeight();
      }
    }
  }


  ngAfterViewInit(): void {
    this.swiper = this.swiperContainer?.nativeElement.swiper;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  trackByIndex(index: number, _: any): number {
    return index;
  }

  setUserImages(): string[] {
    const imagesList = [
      StringUtils.getAvatarUrl(this.profile?.photos[0]),
      StringUtils.getAvatarUrl(this.profile?.photos[1]),
      StringUtils.getAvatarUrl(this.profile?.photos[2]),
      StringUtils.getAvatarUrl(this.profile?.photos[3])
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

setProfileDetailsStyle(): void {
    if (this.pageName === PageName.Discover || this.pageName === PageName.DatingProfile) {
      this.detailsHeightStyle = 'profile-summary profile-summary__show';
    } else if (this.pageName === PageName.ProfileViewer) {
      this.detailsHeightStyle =  'profile-summary profile-summary__hide';
    }
  }

  setSwiperContainerHeight(): void {
    if (this.pageName === PageName.Discover || this.pageName === PageName.DatingProfile) {
      this.sliderHeightStyle =  'swiper-container swiper-container__preview-disabled-height';
    } else {
      this.sliderHeightStyle =  'swiper-container swiper-container__preview-enabled-height';
    }
  }

  setProfileImagesHeight(): void {
    if (this.pageName === PageName.Discover){
      this.imagesHeightStyle =  'profile-img  profile-img__preview-disabled';
    } else {
      this.imagesHeightStyle =  'profile-img  profile-img__preview-enabled';
    }
  }

  onProfileView(): void {
    if (!this.profile || this.pageName === PageName.DatingProfile) return;
    this.profileViewerService.openProfileViewerModal(this.profile);
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
    if (this.currentIndex < this.profilePhotos.length - 1) {
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
