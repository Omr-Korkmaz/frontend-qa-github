import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GithubRepository } from '../../../../model/github.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repository-list',
  standalone: true,
  imports: [CommonModule],
    template: `
    <div *ngIf="repositories.length">
      <h3>Repositories</h3>
      <ul>
        <li *ngFor="let repo of repositories" (click)="selectRepo(repo)">
          {{ repo.name }} - {{ repo.description || 'No description' }}
        </li>
      </ul>
    </div>
  `,
  styles: ['/* styles */']
})
export class RepositoryListComponent {
  @Input() repositories: GithubRepository[] = [];
  @Output() repositorySelected = new EventEmitter<GithubRepository>();

  selectRepo(repo: GithubRepository) {
    this.repositorySelected.emit(repo);
  }
}
