import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CertificateFooter } from "../../shared/certificate-footer/certificate-footer";

@Component({
  selector: 'app-bulk-print-lifting',
  imports: [CommonModule],
  templateUrl: './bulk-print-lifting.html',
  styleUrl: './bulk-print-lifting.css',
})
export class BulkPrintLifting {

  @Input() liftingItems: { type: 'lifting'; data: any }[] = [];
  @Input() companyId = 0;
  @Input() getSectionText!: () => string;
  @Input() getApprovalText!: () => string;
  @Input() generateQrSvg!: (raw: string) => string;
  
 // ── Stamp / Signature inputs ──
  @Input() showStamp: boolean = true;
  @Input() signatureImageUrl: string = '';    // Inspector signature (sign.png)
  @Input() stampImageUrl: string = '';        // Circular stamp (stamp.png)
  @Input() counterSignImageUrl: string = '';  // Counter sign image



}
