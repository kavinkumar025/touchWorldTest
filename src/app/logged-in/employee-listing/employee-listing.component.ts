import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataStoreService } from 'src/app/data-store.service';

@Component({
  selector: 'app-employee-listing',
  templateUrl: './employee-listing.component.html',
  styleUrls: ['./employee-listing.component.scss']
})
export class EmployeeListingComponent {

  public data: any[] = [];
  public filteredData: any[] = [];
  public paginatedData: any[] = [];
  public currentPage = 1;
  public pageSize = 10;
  public totalPages = 0;
  public totalRecords = 0;
  public sortColumn: string | null = null;
  public sortDirection: 'asc' | 'desc' | null = null;
  public searchForm: FormGroup;

  constructor(
    private dataService: DataStoreService,
    private fb: FormBuilder,
    public router: Router
  ) {
    this.searchForm = this.fb.group({
      name: [''],
      contact: [''],
      email: [''],
      address: ['']
    });
  }

  ngOnInit() {
    this.dataService.getData().subscribe((data) => {
      this.data = data;
      this.filteredData = [...this.data];
      this.updatePagination();
    });
  }

  public sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.filteredData.sort((a, b) => {
      const aValue = column === 'date' ? new Date(a[column]) : a[column];
      const bValue = column === 'date' ? new Date(b[column]) : b[column];
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.updatePagination();
  }

  public updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.filteredData.slice(start, end);
    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  public onPageChange(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  get visiblePages(): number[] {
    const pages = [];
    const maxButtons = 3;
    const start = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
    const end = Math.min(this.totalPages, start + maxButtons - 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  public onSearch() {
    const { name, contact, email, address } = this.searchForm.value;
    this.filteredData = this.data.filter((item) => {
      return (
        (name ? item?.name?.toLowerCase()?.includes(name?.toLowerCase()) : true) &&
        (contact ? String(item?.contact).includes(contact) : true) &&
        (email ? item?.email?.toLowerCase()?.includes(email?.toLowerCase()) : true) &&
        (address ? item?.address?.toLowerCase()?.includes(address?.toLowerCase()) : true)
      );
    });
    if (this.filteredData.length === 0) {
      this.paginatedData = [];
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  public sortIndicator(column: string): string {
    if (this.sortColumn === column) {
      return this.sortDirection === 'asc' ? '▲' : '▼';
    }
    return '';
  }

  public clearSearch() {
    this.searchForm.reset();
    this.filteredData = [...this.data];
    this.updatePagination();
  }

  public deleteRow(id: number) {
    this.data = this.data.filter((item) => item.id !== id);
    this.filteredData = [...this.data];
    this.updatePagination();
  }

  public add() {
    this.router.navigate(['/api-data-table']);
  }

}