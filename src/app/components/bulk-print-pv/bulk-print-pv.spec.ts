import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPrintPv } from './bulk-print-pv';

describe('BulkPrintPv', () => {
  let component: BulkPrintPv;
  let fixture: ComponentFixture<BulkPrintPv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkPrintPv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkPrintPv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
