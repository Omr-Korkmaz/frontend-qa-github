import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GithubRepository } from '../../../model/github.model';

@Component({
  selector: 'app-repository-selector',
  standalone: true,
  imports: [],
  templateUrl: './repository-selector.component.html',
  styleUrls: ['./repository-selector.component.scss'],
})
export class RepositorySelectorComponent {
  @Input() repositories: GithubRepository[] = [];
  @Output() repositorySelected = new EventEmitter<string>();

  onRepoChange(selectedRepo: string) {
    this.repositorySelected.emit(selectedRepo);
  }
}
