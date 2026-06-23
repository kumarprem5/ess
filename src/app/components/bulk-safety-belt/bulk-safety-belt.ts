import { Component, Input } from '@angular/core';
import { SafetyBeltInspection } from '../report/report';
import { CommonModule } from '@angular/common';
import { CertificateFooter } from "../../shared/certificate-footer/certificate-footer";

@Component({
  selector: 'app-bulk-safety-belt',
  imports: [CommonModule],
  templateUrl: './bulk-safety-belt.html',
  styleUrl: './bulk-safety-belt.css',
})
export class BulkSafetyBelt {

  
  /** Array of SB items prepared by parent before window.print() */
  @Input() sbItems: { type: 'sb'; data: SafetyBeltInspection & { qrCodeUrl?: string } }[] = [];
 
  /** Company ID — used to build QR URLs */
  @Input() companyId: number = 0;
 
  /** Bound methods passed from parent (same pattern as BulkPrintPv) */
  @Input() safeDateFormat!: (d: string | null | undefined) => string;
  @Input() generateQrSvg!:  (raw: string) => string;
  @Input() getSectionText!:  () => string;
  @Input() getApprovalText!: () => string;

   // ── Stamp / Signature inputs ──
  @Input() showStamp: boolean = true;
  @Input() signatureImageUrl: string = '';
  @Input() stampImageUrl: string = '';
  @Input() counterSignImageUrl: string = '';
  @Input() watermarkImageUrl: string = '';
  


}
