
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @Input() length = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 0;
  @Output() pageChanged = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent) {
    this.pageChanged.emit(event);
  }
}
