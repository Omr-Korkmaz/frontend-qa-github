import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommitStatsComponent } from './commit-stats.component';
import { By } from '@angular/platform-browser';

describe('CommitStatsComponent', () => {
  let component: CommitStatsComponent;
  let fixture: ComponentFixture<CommitStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitStatsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommitStatsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the total commits', () => {
    component.totalCommits = 123;
    fixture.detectChanges();

    const totalCommitsElement = fixture.debugElement.query(By.css('[data-testid="total-commits"]'));
    expect(totalCommitsElement.nativeElement.textContent).toContain('Total commits across all repositories: 123');
  });

  it('should handle zero commits gracefully', () => {
    component.totalCommits = 0;
    fixture.detectChanges();

    const totalCommitsElement = fixture.debugElement.query(By.css('[data-testid="total-commits"]'));
    expect(totalCommitsElement.nativeElement.textContent).toContain('Total commits across all repositories: 0');
  });
});
