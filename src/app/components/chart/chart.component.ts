import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() chartId: string = 'chart';
  @Input() chartType: string = 'bar'; // 'bar', 'pie', 'line', etc.
  @Input() chartData: number[] = [];
  @Input() chartLabels: string[] = [];
  @Input() chartTitle: string = 'Chart Title';

  private chart: Chart | null = null;

  constructor() {
    Chart.register(...registerables); // Register Chart.js plugins
  }

  ngOnInit(): void {
    this.renderChart(); // Initial render
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detect changes in chartData or chartLabels
    if (changes['chartData'] || changes['chartLabels']) {
      console.log('Data or Labels changed. Re-rendering chart...');
      this.renderChart(); // Re-render chart when inputs change
    }
  }

  private renderChart(): void {
    // Get the canvas element
    const ctx = document.getElementById(this.chartId) as HTMLCanvasElement;
    
    if (ctx) {
      // If chart already exists, destroy it before creating a new one
      if (this.chart) {
        this.chart.destroy();
      }

      // Create new chart instance
      this.chart = new Chart(ctx, {
        type: this.chartType as any, 
        data: {
          labels: this.chartLabels, 
          datasets: [
            {
              label: this.chartTitle,
              data: this.chartData, 
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], 
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
            },
            title: {
              display: true,
              text: this.chartTitle,
            },
          },
        },
      });
    }
  }
}
