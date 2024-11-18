import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitStatsComponent } from './commit-stats.component';

describe('CommitStatsComponent', () => {
  let component: CommitStatsComponent;
  let fixture: ComponentFixture<CommitStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
