import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Account } from "src/app/features/account/models/account.model";
import { AccountService } from "src/app/features/account/services/account.service";
import { GeolocationService } from "src/app/core/services/geolocation/geolocation.service";
import { PhotoService } from "src/app/core/services/media/photo.service";

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})

export class AccountInfoComponent implements OnInit, OnDestroy {
  private accountInfoSource!: Subscription;
  private userLocationSource!: Subscription;
  accountData!: Account;
  userLocation: string = "";
  selectedPhotoString: string | null = null;
  photoPreview: string | ArrayBuffer | null = null;
  defaultImage = 'assets/images/default-profile.jpg';

  constructor (private router: Router, private accountService: AccountService,
    private geolocationService: GeolocationService, private photoService: PhotoService
   ) {}

  ngOnInit() {

    this.accountInfoSource = this.accountService.getAccount.subscribe(data => {
      if (data) this.accountData = data;
     })
     this.userLocationSource =  this.geolocationService.getLocation.subscribe(userLocation => {
        this.userLocation = userLocation
     })
  }

  onEditProfile(){
      this.router.navigate(['/tabs/edit-profile'])
  }

  async onTakePhoto() {
     const base64String =  await this.photoService.takePicture();

     if (base64String) {
       // Handle photo upload logic
       console.log('Photo captured:', base64String);
       // This Ensure the base64String is in the correct format for displaying in an image tag
       this.photoPreview  = `data:image/jpeg;base64,${base64String}`;
       this.selectedPhotoString = base64String;
      }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Check if a file is selected
    if (input.files && input.files[0]) {
      //this.selectedPhotoString = input.files[0];

      // Generate a preview using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreview = reader.result as string; // Assign the Data URL
        console.log("Photo preview generated successfully:", this.photoPreview);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      //reader.readAsDataURL(this.selectedPhoto); // Convert the file to Data URL
    } else {
      console.warn("No file selected.");
    }
  }

  onSubmit(): void {
    if (!this.selectedPhotoString) {
      return;
    }

    // Handle photo upload logic
    console.log('Photo uploaded:', this.selectedPhotoString);

    // Reset form
    this.selectedPhotoString = null;
    this.photoPreview = null;
  }

  setAccountImage() {
     if (this.accountData?.avatar?.length > 0) {
      const accountAvatar = `https://intimacy-s3.s3.eu-west-3.amazonaws.com/users/${this.accountData.avatar}`;
       return  accountAvatar;
     } else {
       return this.defaultImage;
     }
  }

  ngOnDestroy() {
    if (this.accountInfoSource) {
      this.accountInfoSource.unsubscribe()
    }

    if (this.userLocationSource) {
      this.userLocationSource.unsubscribe()
    }

  }
}
