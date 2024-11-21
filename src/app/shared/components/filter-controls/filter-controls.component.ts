
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-filter-controls',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
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
    startDate: string | null;
    endDate: string | null;
  }>();

  searchTerm = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  onFilterChange() {
    this.filterChanged.emit({
      selectedRepository: this.selectedRepository,
      searchTerm: this.searchTerm,
      startDate: this.startDate ? this.startDate.toISOString().split('T')[0] : null,
      endDate: this.endDate ? this.endDate.toISOString().split('T')[0] : null,
    });
    this.selectedRepositoryChange.emit(this.selectedRepository);
  }

  resetFilters() {
    this.selectedRepository = '';
    this.searchTerm = '';
    this.startDate = null;
    this.endDate = null;
    this.onFilterChange();
  }
}
