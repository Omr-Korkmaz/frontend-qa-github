import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() chartId: string = 'chart';
  @Input() chartType: string = 'bar'; 
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
  @Input() chartTitle: string = 'Chart Title';
  @Input() backgroundColors: string[] = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']; // Default colors

  private chart: Chart | null = null;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartLabels']) {
      this.renderChart();
    }
  }

  private renderChart(): void {
    const ctx = document.getElementById(this.chartId) as HTMLCanvasElement;

    if (ctx) {
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: this.chartType as any,
        data: {
          labels: this.chartLabels,
          datasets: [{
            label: this.chartTitle,
            data: this.chartData,
            backgroundColor: this.backgroundColors,
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: this.chartType !== 'bar' 
            },
            title: {
              display: true,
              text: this.chartTitle,
            },
          },
          scales: this.chartType === 'bar' ? {
            x: { beginAtZero: true },
            y: { beginAtZero: true },
          } : undefined, 
        },
      });
    }
  }
}
