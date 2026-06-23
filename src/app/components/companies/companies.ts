import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ApiService } from '../../service/api-service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class Companies implements OnInit, OnDestroy {

  currentTime = new Date();
  private timerSub!: ReturnType<typeof setInterval>;

  showDeleteConfirm = false;
  companyToDelete: any = null;

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

  // Modal state
  showModal = false;
  modalMode: 'add' | 'update' = 'add';
  selectedCompany: any = null;
  isSaving = false;

  // Toast notifications
  toasts: Toast[] = [];
  private toastCounter = 0;

  // Reactive form
  companyForm!: FormGroup;

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCompanies();

    this.timerSub = setInterval(() => {
      this.currentTime = new Date();
      this.cdr.markForCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerSub);
  }

  // ── Form Setup ────────────────────────────────────────
  buildForm(): void {
    this.companyForm = this.fb.group({
      companyName:      ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      factoryAddress:   [''],
      contactPerson:    [''],
      mobileNumber:     ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      email:            ['', [Validators.email]],
      gstNumber:        ['', [Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      factoryLicenseNo: [''],
      city:             ['', [Validators.required]],
      state:            ['', [Validators.required]],
      pincode:          ['', [Validators.pattern(/^[1-9][0-9]{5}$/)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.companyForm.controls;
  }

  isInvalid(field: string): boolean {
    const ctrl = this.companyForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  isValid(field: string): boolean {
    const ctrl = this.companyForm.get(field);
    return !!(ctrl && ctrl.valid && (ctrl.dirty || ctrl.touched));
  }

  getError(field: string): string {
    const ctrl = this.companyForm.get(field);
    if (!ctrl || !ctrl.errors || !(ctrl.dirty || ctrl.touched)) return '';

    if (ctrl.errors['required'])   return 'This field is required.';
    if (ctrl.errors['minlength'])  return `Minimum ${ctrl.errors['minlength'].requiredLength} characters.`;
    if (ctrl.errors['maxlength'])  return `Maximum ${ctrl.errors['maxlength'].requiredLength} characters.`;
    if (ctrl.errors['email'])      return 'Enter a valid email address.';
    if (ctrl.errors['pattern']) {
      if (field === 'mobileNumber') return 'Enter a valid 10-digit Indian mobile number.';
      if (field === 'gstNumber')    return 'Enter a valid 15-character GST number.';
      if (field === 'pincode')      return 'Enter a valid 6-digit pincode.';
    }
    return 'Invalid value.';
  }

  // ── Toast ─────────────────────────────────────────────
  showToast(type: 'success' | 'error', message: string): void {
    const id = ++this.toastCounter;
    this.toasts.push({ id, type, message });
    this.cdr.detectChanges();
    setTimeout(() => this.dismissToast(id), 4000);
  }

  dismissToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.cdr.detectChanges();
  }

  // ── Data ──────────────────────────────────────────────
  loadCompanies(): void {
    this.api.getAllCompanies().subscribe({
      next: (res: any) => {
        this.companies = res.data || [];
        this.filteredCompanies = [...this.companies];
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        this.showToast('error', 'Failed to load companies. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    this.filteredCompanies = this.companies.filter(c =>
      c.companyName?.toLowerCase().includes(this.filters.companyName.toLowerCase()) &&
      c.contactPerson?.toLowerCase().includes(this.filters.contactPerson.toLowerCase()) &&
      c.city?.toLowerCase().includes(this.filters.city.toLowerCase()) &&
      c.state?.toLowerCase().includes(this.filters.state.toLowerCase()) &&
      (c.gstNumber || '').toLowerCase().includes(this.filters.gstNumber.toLowerCase()) &&
      (c.factoryLicenseNo || '').toLowerCase().includes(this.filters.factoryLicenseNo.toLowerCase())
    );
  }

  // ── Modal Helpers ─────────────────────────────────────
  openAdd(): void {
    this.modalMode = 'add';
    this.selectedCompany = null;
    this.companyForm.reset();
    this.showModal = true;
    this.cdr.detectChanges();
  }

  openUpdate(company: any): void {
    this.modalMode = 'update';
    this.selectedCompany = company;
    this.companyForm.reset();
    this.companyForm.patchValue({
      companyName:      company.companyName      || '',
      factoryAddress:   company.factoryAddress   || '',
      contactPerson:    company.contactPerson    || '',
      mobileNumber:     company.mobileNumber     || '',
      email:            company.email            || '',
      gstNumber:        company.gstNumber        || '',
      factoryLicenseNo: company.factoryLicenseNo || '',
      city:             company.city             || '',
      state:            company.state            || '',
      pincode:          company.pincode          || ''
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCompany = null;
    this.isSaving = false;
    this.companyForm.reset();
  }

  // ── Navigate to Report ────────────────────────────────
  openReport(company: any): void {
    this.router.navigate(['/dashboard/report', company.id]);
  }

  // ── Save / Update ─────────────────────────────────────
  saveCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.isSaving = true;
    const payload = this.companyForm.value;

    if (this.modalMode === 'add') {
      this.api.createCompany(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.loadCompanies();
          this.closeModal();
          this.showToast('success', 'Company added successfully.');
          this.cdr.detectChanges();
        },
        error: err => {
          this.isSaving = false;
          console.error(err);
          this.showToast('error', 'Failed to add company. Please try again.');
          this.cdr.detectChanges();
        }
      });
    } else {
      this.api.updateCompany(this.selectedCompany.id, payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.loadCompanies();
          this.closeModal();
          this.showToast('success', 'Company updated successfully.');
          this.cdr.detectChanges();
        },
        error: err => {
          this.isSaving = false;
          console.error(err);
          this.showToast('error', 'Failed to update company. Please try again.');
          this.cdr.detectChanges();
        }
      });
    }
  }

  // ── Delete ────────────────────────────────────────────
  openDeleteConfirm(company: any): void {
    this.companyToDelete = company;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.companyToDelete = null;
    this.showDeleteConfirm = false;
  }

  confirmDelete(): void {
    if (!this.companyToDelete) return;
    this.api.deleteCompany(this.companyToDelete.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.companyToDelete = null;
        this.loadCompanies();
        this.showToast('success', 'Company deleted successfully.');
        this.cdr.detectChanges();
      },
      error: err => {
        this.showDeleteConfirm = false;
        this.companyToDelete = null;
        console.error(err);
        this.showToast('error', 'Failed to delete company. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }
}