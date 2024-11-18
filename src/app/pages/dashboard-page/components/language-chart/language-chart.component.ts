import { Component, Input } from '@angular/core';
import { ChartComponent } from '../../../../components/chart/chart.component'; 

@Component({
  selector: 'app-language-chart',
  standalone: true,
  imports: [ChartComponent],
  template: `
    <app-chart
      [chartId]="'languageUsageChart'"
      [chartType]="'pie'"
      [chartData]="chartData"
      [chartLabels]="chartLabels"
      [chartTitle]="'Programming Language Usage'"
    ></app-chart>
  `,
  styles: ['/* styles */']
})
export class LanguageChartComponent {
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
}
