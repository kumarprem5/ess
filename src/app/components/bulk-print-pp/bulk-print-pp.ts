import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bulk-print-pp',
  imports: [CommonModule],
  templateUrl: './bulk-print-pp.html',
  styleUrl: './bulk-print-pp.css',
})
export class BulkPrintPp {

  
@Input() ppItems: { type: 'pp'; data: any }[] = [];
  @Input() companyId = 0;
  @Input() safeDateFormat!: (d: string | null | undefined) => string;
  @Input() generateQrSvg!: (raw: string) => string;
  @Input() getSectionText!:  () => string;
  @Input() getApprovalText!: () => string;
   @Input()  getPowerPressRule!: () => string;

   // ── Stamp / Signature inputs ──
  @Input() showStamp: boolean = true;
  @Input() signatureImageUrl: string = '';
  @Input() stampImageUrl: string = '';
  @Input() counterSignImageUrl: string = '';
  @Input() watermarkImageUrl: string = '';

}
