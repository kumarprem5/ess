import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../service/api-service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-component.html',
  styleUrls: ['./verify-component.css']
})
export class VerifyComponent implements OnInit {
  certNo   = '';
  recType  = '';
  companyId = 0;

  record: any = null;
  company: any = null;
  loading = true;
  error   = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.certNo    = this.route.snapshot.queryParamMap.get('cert') || '';
    this.recType   = this.route.snapshot.queryParamMap.get('type') || '';
    this.companyId = Number(this.route.snapshot.queryParamMap.get('cid') || 0);

    if (!this.certNo || !this.companyId) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.loadRecord();
  }

  loadRecord(): void {
    this.api.getCompanyById(this.companyId).subscribe({
      next: (res: any) => {
        this.company = res?.data ?? null;

        if (this.recType === 'lifting') {
          this.api.getAllLiftingByCompany(this.companyId).subscribe({
            next: (r: any) => {
              this.record  = (r?.data ?? []).find((x: any) => x.certificateNo === this.certNo) ?? null;
              this.error   = !this.record;
              this.loading = false;
              if (this.record) setTimeout(() => window.print(), 600);
            },
            error: () => { this.error = true; this.loading = false; }
          });
        } else {
          this.api.getAllPressureByCompany(this.companyId).subscribe({
            next: (r: any) => {
              this.record  = (r?.data ?? []).find((x: any) => x.certificateNo === this.certNo) ?? null;
              this.error   = !this.record;
              this.loading = false;
              if (this.record) setTimeout(() => window.print(), 600);
            },
            error: () => { this.error = true; this.loading = false; }
          });
        }
      },
      error: () => { this.error = true; this.loading = false; }
    });
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
      case 'uttar pradesh': return 'Approved by the Dir. Fac. Kanpur Vide Lic. No.155/F/C.P.U.P./Org.2025 DT. 22.01.2025';
      case 'delhi':         return 'Approved by the CIF Haryana Vide Lic. No. 2968 Dated 27.06.2019';
      case 'haryana':       return 'Approved by CIF Haryana Vide Lic. No. 2968 dated 27.06.2019';
      case 'punjab':        return 'Approved by DOF/CIF Punjab Vide Lic. No. LC-FG-1024/1/2021-Factory';
      default:              return 'Approved by CIF&B, Jaipur Lic No: CMP-883/2025 Dt: 22.12.2025';
    }
  }


   printPage(): void {
    window.print();
  }
}