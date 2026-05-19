import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSafetyBelt } from './bulk-safety-belt';

describe('BulkSafetyBelt', () => {
  let component: BulkSafetyBelt;
  let fixture: ComponentFixture<BulkSafetyBelt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkSafetyBelt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkSafetyBelt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
