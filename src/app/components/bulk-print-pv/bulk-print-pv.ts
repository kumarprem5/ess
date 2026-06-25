import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bulk-print-pv',
  imports: [CommonModule],
  templateUrl: './bulk-print-pv.html',
  styleUrl: './bulk-print-pv.css',
})
export class BulkPrintPv {
  @Input() pvItems: { type: 'pv'; data: any }[] = [];
  @Input() companyId = 0;
  @Input() safeDateFormat!: (d: string | null | undefined) => string;
  @Input() generateQrSvg!: (raw: string) => string;
  @Input() getSectionText!: () => string;
  @Input() getApprovalText!: () => string;
  @Input() getShellValue!: (t: string) => string;
  @Input() getDishValue!: (t: string) => string;
  @Input() watermarkImageUrl: string = '';
  @Input() getPressureVesselRule!: () => string;
    // ── Stamp / Signature inputs ──
  @Input() showStamp: boolean = true;
  @Input() signatureImageUrl: string = '';
  @Input() stampImageUrl: string = '';
  @Input() counterSignImageUrl: string = '';

}
