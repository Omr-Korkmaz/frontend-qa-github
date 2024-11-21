
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-commit-stats',
  standalone: true,
  templateUrl: './commit-stats.component.html',
  styleUrls: ['./commit-stats.component.scss']
})
export class CommitStatsComponent {
  @Input() totalCommits: number = 0;
}
