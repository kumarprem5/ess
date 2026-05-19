import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPrintLifting } from './bulk-print-lifting';

describe('BulkPrintLifting', () => {
  let component: BulkPrintLifting;
  let fixture: ComponentFixture<BulkPrintLifting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkPrintLifting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkPrintLifting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
