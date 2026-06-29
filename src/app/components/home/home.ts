import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth-service';
import { ApiService } from '../../service/api-service';
import { CompanyProfile } from '../../model/models.model';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact: boolean;
  badge?: number;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class LayoutComponent implements OnInit, OnDestroy {

  // ── Navigation (Companies only) ────────────────────────
navItems: NavItem[] = [
  { path: '/dashboard',           label: 'Overview',  icon: 'ti-layout-dashboard',    exact: true  },
  { path: '/dashboard/companies', label: 'Companies', icon: 'ti-building-skyscraper', exact: false }
];
  // ── UI State ───────────────────────────────────────────
  sidebarOpen  = true;
  mobileOpen   = false;
  currentRoute = '';
  loading      = false;
  currentTime  = new Date();

  adminName: string = '';

  // ── Data ───────────────────────────────────────────────
  admin: any;
  companies: any[]    = [];
  filteredCompanies: any[] = [];
  searchTerm          = '';

  // ── Add Company Form ───────────────────────────────────
  showAddForm   = false;
  formLoading   = false;
  formSuccess   = false;
  formError     = '';
  editingId: number | null = null;

  newCompany: Partial<CompanyProfile> = this.blankCompany();

  private blankCompany(): Partial<CompanyProfile> {
    return {
      companyName:        '',
      factoryAddress:     '',
      contactPerson:      '',
      mobileNumber:       '',
      email:              '',
      gstNumber:          '',
      factoryLicenseNo:   '',
      state:              '',
      city:               '',
      pincode:            ''
    };
  }

  private timerSub!: ReturnType<typeof setInterval>;
  private routerSub!: Subscription;

  constructor(
    private auth:   AuthService,
    private router: Router,
    private api:    ApiService,
    private cdr:    ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.admin        = this.auth.getAdmin();
    this.currentRoute = this.router.url;

    this.loadCompanies();

    this.timerSub = setInterval(() => {
      this.currentTime = new Date();
      this.cdr.markForCheck();
    }, 1000);

    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.currentRoute = e.urlAfterRedirects;
        if (window.innerWidth < 768) this.mobileOpen = false;
        this.cdr.markForCheck();
      });

    if (window.innerWidth < 1024) this.sidebarOpen = false;

    // ── Restore admin name from localStorage ──────────────
    const adminData = localStorage.getItem('ess_admin');

    if (adminData) {
      const admin = JSON.parse(adminData);
      this.adminName = admin.adminName;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerSub);
    this.routerSub?.unsubscribe();
  }

  // ── Data Loading ───────────────────────────────────────
  loadCompanies(): void {
    this.loading = true;
    this.api.getAllCompanies().subscribe({
      next: (res: any) => {
        this.companies         = res.data ?? [];
        this.filteredCompanies = [...this.companies];
        this.loading           = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load Companies Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ── Search ─────────────────────────────────────────────
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredCompanies = term
      ? this.companies.filter(c =>
          c.companyName?.toLowerCase().includes(term)     ||
          c.email?.toLowerCase().includes(term)           ||
          c.contactPerson?.toLowerCase().includes(term)   ||
          c.mobileNumber?.toLowerCase().includes(term)    ||
          c.city?.toLowerCase().includes(term)            ||
          c.state?.toLowerCase().includes(term)           ||
          c.gstNumber?.toLowerCase().includes(term)
        )
      : [...this.companies];
  }

  // ── Add / Edit Company ─────────────────────────────────
  openAddForm(): void {
    this.editingId   = null;
    this.newCompany  = this.blankCompany();
    this.formError   = '';
    this.formSuccess = false;
    this.showAddForm = true;
  }

  openEditForm(company: any): void {
    this.editingId  = company.id;
    this.newCompany = {
      companyName:       company.companyName       ?? '',
      factoryAddress:    company.factoryAddress     ?? '',
      contactPerson:     company.contactPerson      ?? '',
      mobileNumber:      company.mobileNumber       ?? '',
      email:             company.email              ?? '',
      gstNumber:         company.gstNumber          ?? '',
      factoryLicenseNo:  company.factoryLicenseNo   ?? '',
      state:             company.state              ?? '',
      city:              company.city               ?? '',
      pincode:           company.pincode            ?? ''
    };
    this.formError   = '';
    this.formSuccess = false;
    this.showAddForm = true;
  }

  cancelForm(): void {
    this.showAddForm = false;
    this.formError   = '';
    this.formSuccess = false;
    this.editingId   = null;
    this.newCompany  = this.blankCompany();
  }

  submitCompany(): void {
    if (!this.newCompany.companyName?.trim()) {
      this.formError = 'Company name is required.';
      return;
    }
    this.formLoading = true;
    this.formError   = '';

    const payload = this.newCompany as CompanyProfile;
    const call = this.editingId
      ? this.api.updateCompany(this.editingId, payload)
      : this.api.createCompany(payload);

    call.subscribe({
      next: () => {
        this.formLoading = false;
        this.formSuccess = true;
        this.showAddForm = false;
        this.newCompany  = this.blankCompany();
        this.editingId   = null;
        this.loadCompanies();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.formLoading = false;
        this.formError   = err?.error?.message ?? 'Something went wrong. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  // ── Delete ─────────────────────────────────────────────
  deleteCompany(id: number): void {
    if (!confirm('Delete this company? This action cannot be undone.')) return;
    this.api.deleteCompany(id).subscribe({
      next: () => this.loadCompanies(),
      error: (err) => console.error('Delete error:', err)
    });
  }

  // ── Helpers ────────────────────────────────────────────
  isActive(path: string, exact: boolean): boolean {
    return exact
      ? this.currentRoute === path
      : this.currentRoute.startsWith(path);
  }

  trackByPath(_: number, item: NavItem): string { return item.path; }
  trackByIdx (i: number): number               { return i;          }

  // ── Actions ────────────────────────────────────────────
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleMobile (): void { this.mobileOpen  = !this.mobileOpen;  }
  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  closeMobile  (): void { this.mobileOpen  = false;             }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event): void {
    const w = (e.target as Window).innerWidth;
    if (w >= 1024) { this.sidebarOpen = true;  this.mobileOpen = false; }
    else           { this.sidebarOpen = false; }
  }
}