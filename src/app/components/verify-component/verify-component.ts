import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../service/api-service';
import { retry } from 'rxjs/operators';

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

  // ── Stamp / Sign ──
  showStamp           = false;
  stampImageUrl       = '';
  counterSignImageUrl = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.certNo    = decodeURIComponent(this.route.snapshot.queryParamMap.get('cert') || '').trim();
    this.recType   = this.route.snapshot.queryParamMap.get('type') || '';
    this.companyId = Number(this.route.snapshot.queryParamMap.get('cid') || 0);

    if (!this.certNo || !this.recType || !this.companyId) {
      this.error   = true;
      this.loading = false;
      return;
    }
    this.loadRecord();
  }

  // ── Step 1: load company → stamp/sign ──
  loadRecord(): void {
    this.api.getCompanyByIdPublic(this.companyId)
      .pipe(retry({ count: 3, delay: 1500 }))
      .subscribe({
        next: (res: any) => {
          this.company = res?.data ?? null;

          if (this.company?.stampImageUrl) {
            this.stampImageUrl       = this.company.stampImageUrl;
            this.counterSignImageUrl = this.company.counterSignImageUrl || '';
            this.showStamp           = true;
          }

          this.fetchByType();
        },
        error: () => {
          this.error   = true;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // ── Step 2: fetch records by type, find by cert number ──
  private fetchByType(): void {

    // Generic record finder
    const handler = (r: any, certKey = 'certificateNo') => {
      this.record  = (r?.data ?? []).find(
        (x: any) => x[certKey]?.trim() === this.certNo?.trim()
      ) ?? null;
      this.error   = !this.record;
      this.loading = false;
      this.cdr.detectChanges();
    };

    const errHandler = () => {
      this.error   = true;
      this.loading = false;
      this.cdr.detectChanges();
    };

    switch (this.recType) {
      case 'lifting':
        this.api.getLiftingPublic(this.companyId)
          .pipe(retry({ count: 3, delay: 1500 }))
          .subscribe({ next: r => handler(r), error: errHandler });
        break;

      case 'pv':
        this.api.getPressurePublic(this.companyId)
          .pipe(retry({ count: 3, delay: 1500 }))
          .subscribe({ next: r => handler(r), error: errHandler });
        break;

      case 'pp':
        this.api.getPowerPressPublic(this.companyId)
          .pipe(retry({ count: 3, delay: 1500 }))
          .subscribe({ next: r => handler(r), error: errHandler });
        break;

      case 'sb':
        this.api.getSafetyBeltsPublic(this.companyId)
          .pipe(retry({ count: 3, delay: 1500 }))
          // SB uses 'certificateNumber' (not 'certificateNo')
          .subscribe({ next: r => handler(r, 'certificateNumber'), error: errHandler });
        break;

      default:
        this.error   = true;
        this.loading = false;
        this.cdr.detectChanges();
    }
  }

  // ── Actions ──
  downloadPdf(): void { window.print(); }
  printPage():   void { window.print(); }

  // ── Date helper ── (mirrors bulk components)
  safeDateFormat(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
      }
    } catch { /* ignore */ }
    return dateStr || '—';
  }

  // ── Section text — state-based (mirrors bulk components) ──
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

  // ── Approval text — state-based (mirrors bulk components) ──
  getApprovalText(): string {
    switch ((this.company?.state || '').toLowerCase().trim()) {
      case 'rajasthan':
        return 'Approved by CIF&B, Jaipur Lic No: CMP-883/2025 Dt: 22.12.2025';
      case 'punjab':
        return 'Approved by DOF/CIF Punjab Vide Lic. No. LC-FG-1024/1/2021-Factory (I770814/2024) dt.29.01.2024';
      case 'haryana':
        return 'Approved by CIF Haryana Vide Lic. No. 2968 dated 27.06.2019';
      case 'delhi':
        return 'Approved by the CIF Haryana Vide Lic. No. 2968 Dated 27.06.2019';
      case 'madhya pradesh':
        return 'Approved by CIF Madhya Pradesh Vide Lic. No. CMI2110221 dated 16.09.2023';
      case 'uttar pradesh':
        return 'Approved by the Dir. Fac. Kanpur Vide Lic. No.155/F/C.P.U.P./Org.2025 DT. 22.01.2025';
      default:
        return 'Approved by CIF&B, Jaipur Lic No: CMP-883/2025 Dt: 22.12.2025';
    }
  }
}