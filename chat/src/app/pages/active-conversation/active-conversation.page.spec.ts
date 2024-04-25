import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveConversationPage } from './active-conversation.page';

describe('ActiveConversationPage', () => {
  let component: ActiveConversationPage;
  let fixture: ComponentFixture<ActiveConversationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveConversationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
