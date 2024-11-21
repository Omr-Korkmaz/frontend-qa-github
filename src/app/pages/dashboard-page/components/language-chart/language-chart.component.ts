import { Component, Input } from '@angular/core';
import { ChartComponent } from '../../../../shared/components/chart/chart.component';

@Component({
  selector: 'app-language-chart',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './language-chart.component.html',
  styleUrls: ['./language-chart.component.scss']
})
export class LanguageChartComponent {
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
}
