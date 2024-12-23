import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataStoreService } from '../data-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public loginForm: FormGroup;
  public errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public dataService: DataStoreService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.noWhitespaceValidator]],
      password: ['', [Validators.required]]
    });
  }

  public noWhitespaceValidator(control: any) {
    if (control.value && control.value.indexOf(' ') !== -1) {
      return { 'whitespace': true };
    }
    return null;
  }

  public onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }
    const { email, password } = this.loginForm.value;
    if (email === 'admin@touchworld.com' && password === 'admin123') {
      this.dataService.fetchData();
      localStorage.setItem('user', JSON.stringify({ role: 'admin' }));
      this.router.navigate(['/employee-listing']);
    } else if (email === 'user@touchworld.com' && password === 'user123') {
      localStorage.setItem('user', JSON.stringify({ role: 'user' }));
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Invalid credentials';
    }
  }

  public onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  public onSignUp() {
    this.router.navigate(['/signup']);
  }
}
