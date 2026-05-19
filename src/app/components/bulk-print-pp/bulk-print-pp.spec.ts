import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPrintPp } from './bulk-print-pp';

describe('BulkPrintPp', () => {
  let component: BulkPrintPp;
  let fixture: ComponentFixture<BulkPrintPp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkPrintPp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkPrintPp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
