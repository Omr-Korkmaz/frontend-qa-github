import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-commit-stats',
  standalone: true,
  template: `
    <div>
      <h3>Total Commits</h3>
      <p>Total commits across all repositories: {{ totalCommits }}</p>
    </div>
  `,
  styles: ['/* styles */']
})
export class CommitStatsComponent {
  @Input() totalCommits: number = 0;
}
