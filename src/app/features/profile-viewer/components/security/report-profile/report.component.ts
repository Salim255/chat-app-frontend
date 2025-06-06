import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DiscoverService } from 'src/app/features/discover/services/discover.service';

@Component({
  selector: 'app-report-profile',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  standalone: false,
})
export class ReportComponent implements OnInit, OnDestroy {
  @Input() profile: any;
  private viewedProfileSubscription!: Subscription;
  constructor(private discoverService: DiscoverService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('Hello from report profile');
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if (this.viewedProfileSubscription) {
      this.viewedProfileSubscription.unsubscribe();
    }
  }
}
