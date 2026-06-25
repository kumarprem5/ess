import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bulk-print-sv',
  imports: [CommonModule],
  templateUrl: './bulk-print-sv.html',
  styleUrl: './bulk-print-sv.css',
})
export class BulkPrintSv {
 @Input() svItems: { type: 'sv'; data: any }[] = [];
  @Input() companyId = 0;
 
  @Input() showStamp: boolean = true;
  @Input() signatureImageUrl: string = '';
  @Input() stampImageUrl: string = '';
  @Input() counterSignImageUrl: string = '';
  @Input() watermarkImageUrl: string = '';
  @Input() getPressureVesselRule!: () => string;
 
  @Input() safeDateFormat!: (dateStr: string | null | undefined) => string;
  @Input() generateQrSvg!: (raw: string) => string;
  @Input() getSectionText!: () => string;
  @Input() getApprovalText!: () => string;
 
  get count(): number {
    return this.svItems?.length ?? 0;
  }
}
