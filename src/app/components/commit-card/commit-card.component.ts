import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Commit } from '../../model/github.model';
import { TegelModule } from '@scania/tegel-angular-17';


@Component({
  selector: 'app-commit-card',
  standalone: true,
  imports: [CommonModule, TegelModule],
  templateUrl: './commit-card.component.html',
  styleUrls: ['./commit-card.component.scss'],
})
export class CommitCardComponent {
  @Input() commit!: Commit; 
}
