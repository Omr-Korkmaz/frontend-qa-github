import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { TegelModule } from '@scania/tegel-angular-17';

@Component({
  selector: 'app-filter-controls',
  standalone: true,
  imports: [CommonModule, FormsModule, TegelModule],
  templateUrl: './filter-controls.component.html',
  styleUrls: ['./filter-controls.component.scss'],
})
export class FilterControlsComponent {
  @Input() repositories: any[] = [];
  @Input() selectedRepository: string = '';
  @Output() selectedRepositoryChange = new EventEmitter<string>();
  @Output() filterChanged = new EventEmitter<{
    selectedRepository: string;
    searchTerm: string;
  }>();

  searchTerm = '';

  onFilterChange() {
    this.filterChanged.emit({
      selectedRepository: this.selectedRepository,
      searchTerm: this.searchTerm,
    });
    this.selectedRepositoryChange.emit(this.selectedRepository);
  }

  resetFilters() {
    this.selectedRepository = '';
    this.searchTerm = '';
    this.onFilterChange();
  }
}
