import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommitCardComponent } from '../commit-card/commit-card.component';
import { Commit } from '../../../model/github.model';

@Component({
  selector: 'app-commit-list',
  standalone: true,
  imports: [CommonModule, CommitCardComponent],
  templateUrl: './commit-list.component.html',
  styleUrls: ['./commit-list.component.scss'],
})
export class CommitListComponent {
  @Input() commits: { date: string; commits: Commit[] }[] = [];
}
