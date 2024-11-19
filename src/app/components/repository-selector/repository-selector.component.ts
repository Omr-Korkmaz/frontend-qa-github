
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GithubRepository } from '../../model/github.model';

  @Component({
    selector: 'app-repository-selector',
    standalone: true,
    imports: [],
    templateUrl: './repository-selector.component.html',
    styleUrl: './repository-selector.component.scss',
  template: `
    <div class="repo-selector">
      <label for="repo-select">Filter by Repository:</label>
      <select id="repo-select" (change)="onRepoChange($event.target.value)">
        <option value="">All Repositories</option>
        <option *ngFor="let repo of repositories" [value]="repo.name">
          {{ repo.name }}
        </option>
      </select>
    </div>
  `,
})
export class RepositorySelectorComponent {
  @Input() repositories: GithubRepository[] = [];
  @Output() repositorySelected = new EventEmitter<string>();

  onRepoChange(selectedRepo: string) {
    this.repositorySelected.emit(selectedRepo);
  }
}
