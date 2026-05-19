import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api-service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-component.html',
  styleUrls: ['./verify-component.css']
})
export class VerifyComponent implements OnInit {
  certNo    = '';
  recType   = '';
  companyId = 0;

  record:  any = null;
  company: any = null;
  loading = true;
  error   = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.certNo    = this.route.snapshot.queryParamMap.get('cert') || '';
    this.recType   = this.route.snapshot.queryParamMap.get('type') || '';
    this.companyId = Number(this.route.snapshot.queryParamMap.get('cid') || 0);

    if (!this.certNo || !this.companyId) {
      this.error   = true;
      this.loading = false;
      return;
    }

    this.loadRecord();
  }

  loadRecord(): void {
    // First load company (for state-based text helpers)
    this.api.getCompanyById(this.companyId).subscribe({
      next: (res: any) => {
        this.company = res?.data ?? null;
        this.fetchByType();
      },
      error: () => { this.error = true; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  private fetchByType(): void {
    switch (this.recType) {

      case 'lifting':
        this.api.getAllLiftingByCompany(this.companyId).subscribe({
          next: (r: any) => {
            this.record  = (r?.data ?? []).find((x: any) => x.certificateNo === this.certNo) ?? null;
            this.error   = !this.record;
            this.loading = false;
            this.cdr.detectChanges();
            if (this.record) setTimeout(() => window.print(), 600);
          },
          error: () => { this.error = true; this.loading = false; this.cdr.detectChanges(); }
        });
        break;

      case 'pv':
        this.api.getAllPressureByCompany(this.companyId).subscribe({
          next: (r: any) => {
            this.record  = (r?.data ?? []).find((x: any) => x.certificateNo === this.certNo) ?? null;
            this.error   = !this.record;
            this.loading = false;
            this.cdr.detectChanges();
            if (this.record) setTimeout(() => window.print(), 600);
          },
          error: () => { this.error = true; this.loading = false; this.cdr.detectChanges(); }
        });
        break;

      case 'pp':
        this.api.getAllPowerPressByCompany(this.companyId).subscribe({
          next: (r: any) => {
            this.record  = (r?.data ?? []).find((x: any) => x.certificateNo === this.certNo) ?? null;
            this.error   = !this.record;
            this.loading = false;
            this.cdr.detectChanges();
            if (this.record) setTimeout(() => window.print(), 600);
          },
          error: () => { this.error = true; this.loading = false; this.cdr.detectChanges(); }
        });
        break;

      case 'sb':
        this.api.getAllSafetyBelts(this.companyId).subscribe({
          next: (r: any) => {
            // Safety belt uses certificateNumber not certificateNo
            this.record  = (r?.data ?? []).find((x: any) => x.certificateNumber === this.certNo) ?? null;
            this.error   = !this.record;
            this.loading = false;
            this.cdr.detectChanges();
            if (this.record) setTimeout(() => window.print(), 600);
          },
          error: () => { this.error = true; this.loading = false; this.cdr.detectChanges(); }
        });
        break;

      default:
        this.error   = true;
        this.loading = false;
        this.cdr.detectChanges();
    }
  }

  safeDateFormat(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
    } catch { /* ignore */ }
    return dateStr || '—';
  }

  getSectionText(): string {
    switch ((this.company?.state || '').toLowerCase().trim()) {
      case 'rajasthan':      return 'U/s 21(2), 28, 29, 31 & Rule 65C';
      case 'punjab':         return 'U/S 21(2), 28, 29';
      case 'haryana':        return 'U/s 21(2), 28, 29, 31, 87 & 102';
      case 'delhi':          return 'U/S 21(2), 28, 29, 31 & 87';
      case 'madhya pradesh': return 'U/s 21(2), 28, 29, 31';
      case 'uttar pradesh':  return 'U/S 21(2), 28, 29, 31';
      default:               return 'U/s 21(2), 28, 29, 31 & 87';
    }
  }

  getApprovalText(): string {
    switch ((this.company?.state || '').toLowerCase().trim()) {
      case 'rajasthan':      return 'Approved by CIF&B, Jaipur Lic No: CMP-883/2025 Dt: 22.12.2025';
      case 'punjab':         return 'Approved by DOF/CIF Punjab Vide Lic. No. LC-FG-1024/1/2021-Factory (I770814/2024) dt.29.01.2024';
      case 'haryana':        return 'Approved by CIF Haryana Vide Lic. No. 2968 dated 27.06.2019';
      case 'delhi':          return 'Approved by the CIF Haryana Vide Lic. No. 2968 Dated 27.06.2019';
      case 'madhya pradesh': return 'Approved by CIF Madhya Pradesh Vide Lic. No. CMI2110221 dated 16.09.2023';
      case 'uttar pradesh':  return 'Approved by the Dir. Fac. Kanpur Vide Lic. No.155/F/C.P.U.P./Org.2025 DT. 22.01.2025';
      default:               return 'Approved by CIF&B, Jaipur Lic No: CMP-883/2025 Dt: 22.12.2025';
    }
  }

  printPage(): void {
    window.print();
  }
}