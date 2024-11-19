import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitCardComponent } from './commit-card.component';

describe('CommitCardComponent', () => {
  let component: CommitCardComponent;
  let fixture: ComponentFixture<CommitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
