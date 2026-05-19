import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateFooter } from './certificate-footer';

describe('CertificateFooter', () => {
  let component: CertificateFooter;
  let fixture: ComponentFixture<CertificateFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
