import { Component, Input } from '@angular/core';
import { StringUtils } from '../../utils/string-utils';

@Component({
  selector: 'app-wave',
  templateUrl: './app-wave.component.html',
  styleUrls: ['./app-wave.component.scss'],
  standalone: false,
})
export class AppWaveComponent {
  @Input() accountAvatar!: string
  constructor() {}

  getAvatarUrl(): string{
    return StringUtils.getAvatarUrl(this.accountAvatar);
  }
}
