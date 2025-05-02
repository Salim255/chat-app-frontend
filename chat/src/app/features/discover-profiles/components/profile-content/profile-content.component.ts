import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DisableProfileSwipe } from '../../services/discover.service';
import { Discover } from '../../model/discover.model';

@Component({
  selector: 'app-profile-content',
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss'],
  standalone: false,
})
export class ProfileContentComponent implements OnChanges {
  @Input() profile!: Discover;
  @Input() profileToView: DisableProfileSwipe | null = null;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log();
  }
  testconst() {
    console.log('Hello coentner');
  }

  onCollapseProfileDetails(profileToView: DisableProfileSwipe | null) {
    if (this.profile.id === profileToView?.profile?.id && profileToView.disableSwipe) {
      return 'profile-details profile-details__expand';
    }
    return 'profile-details profile-details__collapse';
  }
}
