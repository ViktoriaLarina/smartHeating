import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMessageInputComponent } from './base-message-input.component';

describe('BaseMessageInputComponent', () => {
  let component: BaseMessageInputComponent;
  let fixture: ComponentFixture<BaseMessageInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaseMessageInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMessageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
