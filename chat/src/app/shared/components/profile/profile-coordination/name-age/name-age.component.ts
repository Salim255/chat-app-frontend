import { Component, Input } from '@angular/core';
import { TabsService } from 'src/app/tabs/services/tabs/tabs.service';
import { ProfileViewerService } from 'src/app/features/profile-viewer/services/profile-viewer.service';
import { DateUtils } from 'src/app/shared/utils/date-utils';

@Component({
  selector: 'app-name-age',
  templateUrl: './name-age.component.html',
  styleUrls: ['./name-age.component.scss'],
  standalone: false,
})
export class NameAgeComponent {
  @Input() profile: any;

  constructor(
    private tabsService: TabsService,
    private profileViewerService: ProfileViewerService
  ) {}

  onViewProfile(): void {
    this.tabsService.setTapHidingStatus('hide');
    // TODO:
    this.profileViewerService.openProfileViewerModal(this.profile);
  }

  calculateAge(): number{
    const birthDate = this.profile.birth_date;
    return DateUtils.calculateAge( birthDate );
  }
}
