import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from 'src/app/features/account/services/account.service';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { GeolocationService } from 'src/app/core/services/geolocation/geolocation.service';
import { Subscription } from 'rxjs';
import { MediaService } from 'src/app/core/services/media/media.service';

register();

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  private userLocationSubscription!: Subscription;
  constructor(
     private accountService: AccountService,
     private router: Router, private geolocationService: GeolocationService ,
     private mediaService: MediaService) { }

  ngOnInit(): void {
    this.accountService.fetchAccount().subscribe();

  }

  ionViewWillEnter () {
    this.mediaService.onTakePicture();
    this.geolocationService.getLocation.subscribe();
    this.accountService.fetchAccount().subscribe();
    this.currentUserLocation();
  }

  async currentUserLocation(){
    await this.geolocationService.getUserCurrentLocation();
  }

  onSettings() {
    this.router.navigate(["./tabs/settings"])
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.userLocationSubscription) {
        this.userLocationSubscription.unsubscribe();
    }
  }

}
