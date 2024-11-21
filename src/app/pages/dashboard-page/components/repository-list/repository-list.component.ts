import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GithubRepository } from '../../../../model/github.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repository-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss'],
})
export class RepositoryListComponent {
  @Input() repositories: GithubRepository[] = [];
  @Input() errorMessage: string = ''; // Add errorMessage as an input property
  @Output() repositorySelected = new EventEmitter<GithubRepository>();

  selectRepo(repo: GithubRepository) {
    this.repositorySelected.emit(repo);
  }
}
