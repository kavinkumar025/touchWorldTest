import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataStoreService } from 'src/app/data-store.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-api-data-table',
  templateUrl: './api-data-table.component.html',
  styleUrls: ['./api-data-table.component.scss']
})

export class ApiDataTableComponent {

  public addEmployeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataStoreService
  ) {
    this.addEmployeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z]+$'),],],
      contact: ['', [Validators.required, Validators.pattern('^[0-9]{10}$'), Validators.maxLength(10),],],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100),],],
      address: ['', [Validators.required, Validators.maxLength(200)],],
    });
  }

  get f() {
    return this.addEmployeeForm.controls;
  }

  public onSubmit() {
    if (this.addEmployeeForm.invalid) {
      return;
    }
    const employeeDetails = this.addEmployeeForm.value;
    this.dataService.addEmployee(employeeDetails);
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `The employee "${employeeDetails.name}" has been added successfully.`,
      confirmButtonText: 'OK',
    }).then(() => {
      this.router.navigate(['/employee-listing']);
    });
  }
}
