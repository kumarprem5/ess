import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-certificate-footer',
  imports: [CommonModule],
  templateUrl: './certificate-footer.html',
  styleUrl: './certificate-footer.css',
})
export class CertificateFooter implements OnChanges {

  @Input() name: string = '';
  @Input() leftLines: string[] = [];          // e.g. ['License No.: X', 'Designation', 'Approval details']
  @Input() statement: string = '';            // optional: full certification sentence
  @Input() nextDueDate: string | Date = '';  // optional: shown above signature
  @Input() disclaimer: string =
    'DISCLAIMER: This report reflects conditions as observed on the date of examination. ' +
    'No liability accepted for accidents/mishaps after examination date. ' +
    'Equipment must be inspected before each use.';

  filteredLeftLines: string[] = [];

  ngOnChanges(): void {
    // Strip blank/undefined lines so no empty rows render
    this.filteredLeftLines = (this.leftLines || [])
      .map(l => (l || '').trim())
      .filter(l => l && l !== 'undefined' && l !== 'null' && l !== ': ');
  }
}