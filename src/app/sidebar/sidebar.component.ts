import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public isAdmin: boolean = false;
  public isLoggedIn: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.isAdmin = user.role === 'admin' || user.role === 'super admin';
    this.isLoggedIn = !!user.role;
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
