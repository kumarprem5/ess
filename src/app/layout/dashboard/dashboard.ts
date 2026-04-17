import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth-service';
import { Router, NavigationEnd, RouterModule, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../service/api-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
 imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {

  sidebarOpen = true;
  mobileOpen = false;
  currentRoute = '';
  admin: any;
  currentTime = new Date();

  loading = false;

  stats = {
    companies: 0,
    lifting: 25,
    pressure: 18,
    approved: 40
  };

  companies: any[] = [];

  recentActivity = [
    { action: 'Added', entity: 'New Company', time: '2 min ago', type: 'success' },
    { action: 'Updated', entity: 'Lifting Equipment', time: '10 min ago', type: 'info' },
    { action: 'Approved', entity: 'Pressure Vessel', time: '1 hour ago', type: 'warning' }
  ];

  cards = [
    {
      key: 'companies',
      label: 'Total Companies',
      icon: 'building',
      color: 'blue',
      route: '/dashboard/companies'
    },
    {
      key: 'lifting',
      label: 'Lifting Equipment',
      icon: 'lifting',
      color: 'green',
      route: '/dashboard/lifting-equipment'
    },
    {
      key: 'pressure',
      label: 'Pressure Vessels',
      icon: 'pressure',
      color: 'orange',
      route: '/dashboard/pressure-vessel'
    },
    {
      key: 'approved',
      label: 'Approved Items',
      icon: 'check',
      color: 'purple',
      route: '/dashboard/approved'
    }
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.admin = this.auth.getAdmin();
    this.currentRoute = this.router.url;

    this.loadCompanies();

    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.currentRoute = e.urlAfterRedirects;

        if (window.innerWidth < 768) {
          this.mobileOpen = false;
        }
      });

    if (window.innerWidth < 1024) {
      this.sidebarOpen = false;
    }
  }

  loadCompanies(): void {
    this.loading = true;

    this.api.getAllCompanies().subscribe({
      next: (res: any) => {
        this.companies = res.data ?? [];

        // Dynamic Count
        this.stats.companies = this.companies.length;

        console.log('Dynamic Companies:', this.companies);

        this.loading = false;
      },
      error: err => {
        console.error('Load Company Error:', err);
        this.loading = false;
      }
    });
  }

  isActive(path: string, exact: boolean): boolean {
    return exact
      ? this.currentRoute === path
      : this.currentRoute.startsWith(path);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeMobile(): void {
    this.mobileOpen = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const width = (event.target as Window).innerWidth;

    if (width >= 1024) {
      this.sidebarOpen = true;
      this.mobileOpen = false;
    } else {
      this.sidebarOpen = false;
    }
  }


goToCompanies() {
  this.router.navigate(['/dashboard/companies']);
}

}