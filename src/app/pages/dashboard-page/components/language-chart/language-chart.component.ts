// import { Component, Input } from '@angular/core';
// import { ChartComponent } from '../../../../components/chart/chart.component';

// @Component({
//   selector: 'app-language-chart',
//   standalone: true,
//   imports: [ChartComponent],
//   templateUrl: './language-chart.component.html',
//   styleUrls: ['./language-chart.component.scss']
// })
// export class LanguageChartComponent {
//   @Input() chartData: number[] = [];
//   @Input() chartLabels: string[] = [];
// }

import { Component, Input, OnInit } from '@angular/core';
import { ChartComponent } from '../../../../components/chart/chart.component';

@Component({
  selector: 'app-language-chart',
  standalone: true,
  imports: [ChartComponent],
  templateUrl: './language-chart.component.html',
  styleUrls: ['./language-chart.component.scss']
})
export class LanguageChartComponent implements OnInit {
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
  chartColors: string[] = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  ngOnInit(): void {
    if (this.chartData.length !== this.chartLabels.length) {
      console.error('Mismatch between chart data and labels.');
    }
  }
}
