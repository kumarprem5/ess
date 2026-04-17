import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-companies',
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class Companies {

  companies: any[] = [];
  filteredCompanies: any[] = [];

  filters = {
    companyName: '',
    contactPerson: '',
    city: '',
    state: '',
    gstNumber: '',
    factoryLicenseNo: ''
  };

  // Modal state (Add / Update only)
  showModal = false;
  modalMode: 'add' | 'update' = 'add';
  selectedCompany: any = null;

  // Form model
  form: any = this.emptyForm();

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  // ── Data ──────────────────────────────────────────────

  loadCompanies(): void {
    this.api.getAllCompanies().subscribe({
      next: (res: any) => {
        this.companies = res.data || [];
        this.filteredCompanies = [...this.companies];
      },
      error: err => console.error(err)
    });
  }

  applyFilters(): void {
    this.filteredCompanies = this.companies.filter(c =>
      c.companyName?.toLowerCase().includes(this.filters.companyName.toLowerCase()) &&
      c.contactPerson?.toLowerCase().includes(this.filters.contactPerson.toLowerCase()) &&
      c.city?.toLowerCase().includes(this.filters.city.toLowerCase()) &&
      c.state?.toLowerCase().includes(this.filters.state.toLowerCase()) &&
      c.gstNumber?.toLowerCase().includes(this.filters.gstNumber.toLowerCase()) &&
      c.factoryLicenseNo?.toLowerCase().includes(this.filters.factoryLicenseNo.toLowerCase())
    );
  }

  // ── Modal Helpers (Add / Update) ──────────────────────

  emptyForm() {
    return {
      companyName: '',
      factoryAddress: '',
      contactPerson: '',
      mobileNumber: '',
      email: '',
      gstNumber: '',
      factoryLicenseNo: '',
      city: '',
      state: '',
      pincode: ''
    };
  }

  openAdd(): void {
    this.modalMode = 'add';
    this.form = this.emptyForm();
    this.showModal = true;
  }

  openUpdate(company: any): void {
    this.modalMode = 'update';
    this.selectedCompany = company;
    this.form = { ...company };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCompany = null;
  }

  // ── Navigate to Report Component ──────────────────────

openReport(company: any) {
  this.router.navigate(['/dashboard/report', company.id]);
}

  // ── Save / Update ─────────────────────────────────────

  saveCompany(): void {
    if (this.modalMode === 'add') {
      this.api.createCompany(this.form).subscribe({
        next: () => { this.loadCompanies(); this.closeModal(); },
        error: err => console.error(err)
      });
    } else if (this.modalMode === 'update') {
      this.api.updateCompany(this.selectedCompany.id, this.form).subscribe({
        next: () => { this.loadCompanies(); this.closeModal(); },
        error: err => console.error(err)
      });
    }
  }
}