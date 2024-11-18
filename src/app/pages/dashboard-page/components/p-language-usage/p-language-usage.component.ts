import { Component, Input } from '@angular/core';
import { ChartComponent } from '../../../../components/chart/chart.component';

@Component({
  selector: 'app-p-language-usage',
  standalone: true,
  styleUrl: './p-language-usage.component.scss',
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
export class PLanguageUsageComponent {
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
}
