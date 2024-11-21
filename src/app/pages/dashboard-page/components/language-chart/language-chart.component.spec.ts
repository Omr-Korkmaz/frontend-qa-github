import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageChartComponent } from './language-chart.component';
import { By } from '@angular/platform-browser';

describe('LanguageChartComponent', () => {
  let component: LanguageChartComponent;
  let fixture: ComponentFixture<LanguageChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageChartComponent], // Since it's a standalone component
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageChartComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should accept and set chartData input correctly', () => {
    const mockChartData = [40, 30, 20, 10];
    component.chartData = mockChartData;

    fixture.detectChanges();

    expect(component.chartData).toEqual(mockChartData);
  });

  it('should accept and set chartLabels input correctly', () => {
    const mockChartLabels = ['JavaScript', 'TypeScript', 'Python', 'Java'];
    component.chartLabels = mockChartLabels;

    fixture.detectChanges();

    expect(component.chartLabels).toEqual(mockChartLabels);
  });


});
