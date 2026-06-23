import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPrintSv } from './bulk-print-sv';

describe('BulkPrintSv', () => {
  let component: BulkPrintSv;
  let fixture: ComponentFixture<BulkPrintSv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkPrintSv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkPrintSv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
