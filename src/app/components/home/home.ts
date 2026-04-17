import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../auth/auth-service';
import { ApiService } from '../../service/api-service';

type StatKey = 'companies' | 'lifting' | 'pressure' | 'completed';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class LayoutComponent implements OnInit {
  stats: Record<StatKey, number> = {
    companies: 0,
    lifting: 0,
    pressure: 0,
    completed: 0
  };

  cards: {
    key: StatKey;
    label: string;
    route: string;
    color: string;
    icon: string;
  }[] = [
    { key: 'companies', label: 'Companies', route: '/dashboard/companies', color: 'blue', icon: 'building' },
    { key: 'lifting', label: 'Lifting Equipment', route: '/dashboard/lifting-equipment', color: 'green', icon: 'lifting' },
    { key: 'pressure', label: 'Pressure Vessels', route: '/dashboard/pressure-vessel', color: 'orange', icon: 'pressure' },
    { key: 'completed', label: 'Completed', route: '/dashboard', color: 'purple', icon: 'check' }
  ];

  sidebarOpen = true;
  mobileOpen = false;
  currentRoute = '';
  admin: any;
  currentTime = new Date();

  loading = false;
  companies: any[] = [];

  recentActivity = [
    { action: 'Added', entity: 'New Company', time: '2 min ago', type: 'success' },
    { action: 'Updated', entity: 'Lifting Equipment', time: '10 min ago', type: 'info' },
    { action: 'Approved', entity: 'Pressure Vessel', time: '1 hour ago', type: 'warning' }
  ];

  navItems = [
    { path: '/dashboard', label: 'Overview', icon: 'overview', exact: true },
    { path: '/dashboard/companies', label: 'Companies', icon: 'companies', exact: false },
    { path: '/dashboard/lifting-equipment', label: 'Lifting Equipment', icon: 'lifting', exact: false },
    { path: '/dashboard/pressure-vessel', label: 'Pressure Vessels', icon: 'pressure', exact: false }
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
        this.stats.companies = this.companies.length;
        this.loading = false;
      },
      error: (err) => {
        console.error('Load Company Error:', err);
        this.loading = false;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event): void {
    const width = (e.target as Window).innerWidth;

    if (width >= 1024) {
      this.sidebarOpen = true;
      this.mobileOpen = false;
    } else {
      this.sidebarOpen = false;
    }
  }

  isActive(path: string, exact: boolean): boolean {
    return exact ? this.currentRoute === path : this.currentRoute.startsWith(path);
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
}
