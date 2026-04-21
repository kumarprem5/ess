import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ApiService } from '../../service/api-service';
import {
  CompanyProfile,
  PressureVesselCertificate
} from '../../model/models.model';

/* =========================================================
   LIFTING RECORD MODEL — mirrors LiftingEquipmentInspectionRecord entity
========================================================= */


export interface LiftingRecord {
  id?: number;
  
  companyId: number;

  testName: string;
  certificateNo: string;
  dateOfExamination: string;

  // 1
  nameOfOccupier: string;
  // 2
  addressOfFactory: string;
  // 3
  distinguishingMarksDescription: string;

  srNo: string;
  modelNumber: string;
  equipmentName: string;
  idNumber: string;
  capacity: string;
  manufacturerName: string;
  manufacturerYear: string;
  safeWorkingLoad: string;
  location: string;

  // 4
  yearFirstTakenIntoUse: string;
  // 5
  previousCertificateDetails: string;
  // 6
  periodicalExaminationDetails: string;
  hydraulicSystemStatus: string;
  frameAndForkCondition: string;
  overallResult: string;
  // 7
  annealingOrHeatTreatmentDetails: string;
  // 8
  defectsParticulars: string;
  // 9
  safeWorkingLoadAssessed: string;
  // 10
  remarks: string;

  // Footer
  certifiedDate: string;
  inspectorName: string;
  nextDueDate: string;

  createdAt?: string;
  updatedAt?: string;
}




/* =========================================================
   TOGGLE FIELD KEYS
   Default: TRUE (Yes) — all fields start enabled
========================================================= */
type ToggleFieldKey =
  | 'nameOfOccupier'
  | 'addressOfFactory'
  | 'distinguishingMarksDescription'
  | 'modelNumber'
  | 'srNo'
  | 'idNumber'
  | 'manufacturerName'
  | 'manufacturerYear'
  | 'capacity'
  | 'safeWorkingLoad'
  | 'location'
  | 'yearFirstTakenIntoUse'
  | 'previousCertificateDetails'
  | 'periodicalExaminationDetails'
  | 'hydraulicSystemStatus'
  | 'frameAndForkCondition'
  | 'overallResult'
  | 'annealingOrHeatTreatmentDetails'
  | 'defectsParticulars'
  | 'safeWorkingLoadAssessed'
  | 'certifiedDate';

const ALL_TOGGLE_FIELDS: ToggleFieldKey[] = [
  'nameOfOccupier',
  'addressOfFactory',
  'distinguishingMarksDescription',
  'modelNumber',
  'srNo',
  'idNumber',
  'manufacturerName',
  'manufacturerYear',
  'capacity',
  'safeWorkingLoad',
  'location',
  'yearFirstTakenIntoUse',
  'previousCertificateDetails',
  'periodicalExaminationDetails',
  'hydraulicSystemStatus',
  'frameAndForkCondition',
  'overallResult',
  'annealingOrHeatTreatmentDetails',
  'defectsParticulars',
  'safeWorkingLoadAssessed',
  'certifiedDate'
];

export const liftingEquipmentList: string[] = [
  'EOT Crane',
  'HOT Crane',
  'Fork Lift',
  'Hand Pallet Truck',
  'Hydraulic Lifter',
  'Scissor Lift',
  'Dock Leveller',
  'Rack',
  'Electric Stacker',
  'Electric Hoist',
  'Wire Rope Hoist',
  'HHT Rope',
  'Die Loader',
  'Hand Lifter',
  'Life Line Rope',
  'Wire Rope',
  'Web Sling',
  'Toe Jack',
  'PO Balancer',
  'Spring Balancer',
  'Pneumatic Balancer',
  'Hoist and Lift',
  'Hoist & Lifts'
];

@Component({
  selector: 'app-company-report',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './report.html',
  styleUrls: ['./report.css']
})
export class CompanyReport implements OnInit {


  selectedItem: any;

  /* =========================================================
     FILTER DROPDOWN
  ========================================================= */
  selectedTestName = '';

  liftingTestOptions = [
    'REPORT OF EXAMINATION OF DANGEROUS MACHINES / POWER PRESS CENTRIFUGAL MACHINES (Under Section 21 (2) of Factories Act 1948)',
    'REPORTS OF EXAMINATION OF HOIST & LIFT (Under Section 28 of Factories Act 1948)',
    'REPORTS OF EXAMINATION OF LIFTING MACHINES/TACKLES (Under Section 29 of Factories Act 1948)',
    'REPORT OF EXAMINATION OR TEST OF PRESSURE VESSEL OR PLANT (Under Section 31 of Factories Act 1948)',
    'REPORTS OF EXAMINATION OF SAFETY BELTS',
    'REPORT OF HYDRAULIC EXAMINATION OF PRESSURE VESSEL OR PLANT (Under Section 31 of Factories Act 1948)',
  ];
  

  equipmentList = liftingEquipmentList;
  allLiftingReports: LiftingRecord[] = [];

  /* =========================================================
     MAIN DATA
  ========================================================= */
  company: CompanyProfile | null = null;
  liftingReports: LiftingRecord[] = [];
  pressureReports: PressureVesselCertificate[] = [];

  loading = true;
  error = false;
  companyId = 0;

  /* =========================================================
     MODAL
  ========================================================= */
  showLiftingModal = false;
  liftingModalMode: 'add' | 'update' = 'add';
  selectedLifting: LiftingRecord | null = null;
  liftingForm: LiftingRecord = this.emptyLiftingForm();

  /* =========================================================
     NEXT DUE DATE — DURATION SELECTOR
  ========================================================= */
  selectedDuration: '6months' | '1year' | '2years' | '' = '';

  /* =========================================================
     YES/NO TOGGLES  (default = true → Yes → field enabled)
  ========================================================= */
  fieldToggles: Record<ToggleFieldKey, boolean | null> = this.defaultToggles();

  /* =========================================================
     PRINT
  ========================================================= */
  showPrintModal = false;
  printItem: LiftingRecord | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.companyId) { this.goBack(); return; }
    this.loadAllData();
  }

  /* =========================================================
     LOAD DATA
  ========================================================= */
  loadAllData(): void {
    this.loading = true;
    forkJoin({


      company: this.api.getCompanyById(this.companyId),
      lifting: this.api.getAllLiftingByCompany(this.companyId),
      pressure: this.api.getAllPressureByCompany(this.companyId)
    }).subscribe({
      next: (res: any) => {
        this.company          = res.company?.data ?? null;
        this.allLiftingReports = res.lifting?.data ?? [];
        this.liftingReports   = [...this.allLiftingReports];
        this.pressureReports  = res.pressure?.data ?? [];
        console.log(this.liftingReports);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Load Error:', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  /* =========================================================
     FILTER
  ========================================================= */
  filterByTestName(): void {
    if (!this.selectedTestName) {
      this.liftingReports = [...this.allLiftingReports];
      return;
    }
    this.liftingReports = this.allLiftingReports.filter(
      item => item.testName === this.selectedTestName
    );
  }

  /* =========================================================
     NAVIGATION
  ========================================================= */
  goBack(): void { this.router.navigate(['/dashboard/companies']); }

  /* =========================================================
     PRINT
  ========================================================= */
  printReport(): void { window.print(); }

  openPrintModal(item: LiftingRecord): void {
  this.selectedItem = item;

  setTimeout(() => {
    window.print();
  }, 200);
}

  closePrintModal(): void {
    this.printItem = null;
    this.showPrintModal = false;
  }

  inspectorList: string[] = ['Brijesh Kumar',
  'Mr. Santosh'
];

sectionRuleOptions: string[] = [
  'Section 21 (2) – Dangerous Machines',
  'Section 28 – Hoist & Lift',
  'Section 29 – Lifting Machines & Tackles',
  'Section 31 – Pressure Vessel',
  'Safety Belts Rule',
  'Hydraulic Test Rule'
];

  /* =========================================================
     EMPTY HELPERS
  ========================================================= */
  emptyLiftingForm(): LiftingRecord {
    return {
      companyId: this.companyId,
      testName: '',
      certificateNo: '',
      dateOfExamination: '',
      nameOfOccupier: '',
      addressOfFactory: '',
      distinguishingMarksDescription: '',
      srNo: '',
      modelNumber: '',
      equipmentName: '',
      idNumber: '',
      capacity: '',
      manufacturerName: '',
      manufacturerYear: '',
      safeWorkingLoad: '',
      location: '',
      yearFirstTakenIntoUse: '',
      previousCertificateDetails: '',
      periodicalExaminationDetails: '',
      hydraulicSystemStatus: '',
      frameAndForkCondition: '',
      overallResult: '',
      annealingOrHeatTreatmentDetails: '',
      defectsParticulars: '',
      safeWorkingLoadAssessed: '',
      remarks: '',
      certifiedDate: '',
      inspectorName: '',
      nextDueDate: ''
    };
  }

  /** ALL fields default to YES (true) = enabled */
  defaultToggles(): Record<ToggleFieldKey, boolean | null> {
    const obj = {} as Record<ToggleFieldKey, boolean | null>;
    ALL_TOGGLE_FIELDS.forEach(key => (obj[key] = true));
    return obj;
  }

  /** Edit mode: Yes if field has a value, No if empty */
  private initTogglesFromRecord(record: LiftingRecord): void {
    ALL_TOGGLE_FIELDS.forEach(key => {
      const val = (record as any)[key];
      this.fieldToggles[key] = (val !== undefined && val !== null && val !== '') ? true : false;
    });
  }

  /* =========================================================
     NEXT DUE DATE — DURATION LOGIC
  ========================================================= */
  onExaminationDateChange(): void {
    if (this.selectedDuration) { this.calculateDueDate(); }
  }

  setDuration(duration: '6months' | '1year' | '2years'): void {
    this.selectedDuration = duration;
    this.calculateDueDate();
  }

  private calculateDueDate(): void {
    if (!this.liftingForm.dateOfExamination) return;
    const base = new Date(this.liftingForm.dateOfExamination);
    if (isNaN(base.getTime())) return;
    const due = new Date(base);

    switch (this.selectedDuration) {
      case '6months': due.setMonth(due.getMonth() + 6);         break;
      case '1year':   due.setFullYear(due.getFullYear() + 1);   break;
      case '2years':  due.setFullYear(due.getFullYear() + 2);   break;
    }

    const yyyy = due.getFullYear();
    const mm   = String(due.getMonth() + 1).padStart(2, '0');
    const dd   = String(due.getDate()).padStart(2, '0');
    this.liftingForm.nextDueDate = `${yyyy}-${mm}-${dd}`;
  }

  /* =========================================================
     YES/NO TOGGLE LOGIC
  ========================================================= */
  setFieldToggle(field: ToggleFieldKey, value: boolean): void {
    this.fieldToggles[field] = value;
    if (!value) { (this.liftingForm as any)[field] = ''; }
  }

  /* =========================================================
     MODAL ACTIONS
  ========================================================= */
openAddLifting(): void {
  this.liftingModalMode = 'add';
  this.selectedLifting  = null;
  this.selectedDuration = '';

  this.liftingForm = {
    companyId: this.companyId,

    // ── Always-on fields ──
    testName:          'REPORTS OF EXAMINATION OF LIFTING MACHINES/TACKLES (Under Section 29 of Factories Act 1948)',
    equipmentName:     'EOT Crane',
    certificateNo:     '',                        // auto-generated below
    dateOfExamination: '2026-04-07',              // 07.04.2026
    nextDueDate:       '',                        // will be set by setDuration below
    inspectorName:     'Brijesh Kumar',

    // ── 1. Name of Occupier ──
    nameOfOccupier: this.company?.companyName
      ?? 'M/s Somemiya Corporation Pvt. Ltd.,',

    // ── 2. Address of Factory ──
    addressOfFactory: this.company?.factoryAddress
      ?? 'SP2-65 Majrakath New Industrial Complex, Neemrana, Alwar Rajasthan-301705, India',

    // ── 3. Distinguishing Marks ──
    distinguishingMarksDescription:
      'EOT CRANE\nMake: N.A., ID No. EOT-01\nSWL: 2.8 ton   Wire Rope Dia- 10 MM, Fall: 4\nLocation: Shop Floor-1',
    modelNumber:      'N.A.',
    srNo:             '',
    idNumber:         'EOT-01',
    capacity:         '2.8 ton',
    manufacturerName: 'N.A.',
    manufacturerYear: '2012',
    safeWorkingLoad:  '2.8 ton',
    location:         'Shop Floor-1',

    // ── 4. Year First Taken Into Use ──
    yearFirstTakenIntoUse: '2012',

    // ── 5. Previous Certificate Details ──
    previousCertificateDetails: 'First time tested by us',

    // ── 6. Periodical Examination Details ──
    periodicalExaminationDetails:
      'Tested by Brijesh Kumar - Competent Person on 07.04.2026',
    hydraulicSystemStatus:
      'Limit Switches: Upper & lower limits functional\n' +
      'Brake Functionality: Operational and holds load properly\n' +
      'Rope: Normal 12.0 mm No kinks, broken strands,\n' +
      'Hooks & Safety Latches: No wear; safety lock not functional',
    frameAndForkCondition: 'N.A.',
    overallResult:         'Hoist found in good working condition',

    // ── 7. Annealing / Heat Treatment ──
    annealingOrHeatTreatmentDetails: 'N.A.',

    // ── 8. Defects Particulars ──
    defectsParticulars: 'N.A.',

    // ── 9. Safe Working Load Assessed ──
    safeWorkingLoadAssessed:
      'Load Test done on 1.25 times of Safe Working. Safe to Use.',

    // ── 10. Remarks ──
    remarks:
      'Hoist found in good working condition\nPeriodic lubrication advised',

    // ── Footer ──
    certifiedDate: '2026-04-07',
  };

  // Generate cert no (testName + equipmentName are now set)
  this.generateCertificateNo();

  // Pre-select 1 Year duration and calculate next due date from examination date
  this.selectedDuration = '1year';
  this.calculateDueDate(); // call private method directly

  // All toggles ON (Yes)
  this.fieldToggles = this.defaultToggles();

  this.showLiftingModal = true;
}
  openEditLifting(item: LiftingRecord): void {
    this.liftingModalMode = 'update';
    this.selectedLifting  = item;
    this.liftingForm      = { ...item };
    this.initTogglesFromRecord(item);               // ← Yes/No from stored data
    this.selectedDuration = '';
    this.showLiftingModal = true;
  }

  closeLiftingModal(): void {
    this.showLiftingModal = false;
    this.selectedLifting  = null;
  }

  /* =========================================================
     SAVE / UPDATE
  ========================================================= */
  saveLifting(): void {
    if (this.liftingModalMode === 'add') {
      this.api.createLiftingRecord(this.liftingForm as any).subscribe({
        next: () => { this.reloadLifting(); this.closeLiftingModal(); },
        error: err => console.error('Create Error:', err)
      });
    } else {
      if (!this.selectedLifting?.id) return;
      this.api.updateLiftingRecord(this.selectedLifting.id, this.liftingForm as any).subscribe({
        next: () => { this.reloadLifting(); this.closeLiftingModal(); },
        error: err => console.error('Update Error:', err)
      });
    }
  }

  /* =========================================================
     RELOAD TABLE
  ========================================================= */
  reloadLifting(): void {
    this.api.getAllLiftingByCompany(this.companyId).subscribe({
      next: (res: any) => {
        this.allLiftingReports = res?.data ?? [];
        this.filterByTestName();
      },
      error: err => console.error('Reload Error:', err)
    });
  }

  /* =========================================================
     CERTIFICATE NUMBER GENERATOR
     Format: ESS / <CompanyCode3> / <DDMMYY> / <EquipCode2> / <Serial3>
  ========================================================= */
  generateCertificateNo(): void {
    if (!this.company || !this.liftingForm.testName || !this.liftingForm.equipmentName) return;

    const prefix = 'ESS';

    const companyCode = (this.company.companyName || '')
      .replace(/[^A-Za-z]/g, '')
      .substring(0, 3)
      .toUpperCase();

    const now      = new Date();
    const dd       = String(now.getDate()).padStart(2, '0');
    const mm       = String(now.getMonth() + 1).padStart(2, '0');
    const yy       = String(now.getFullYear()).slice(-2);
    const dateCode = `${dd}${mm}${yy}`;

    const equipWords = this.liftingForm.equipmentName.trim().split(/\s+/);
    const equipCode  = (
      (equipWords[0]?.charAt(0) || '') +
      (equipWords[1]?.charAt(0) || equipWords[0]?.charAt(1) || '')
    ).toUpperCase();

    const serial = String(this.allLiftingReports.length + 1).padStart(3, '0');

    this.liftingForm.certificateNo =
      `${prefix}/${companyCode}/${dateCode}/${equipCode}/${serial}`;

    console.log(this.liftingForm.certificateNo);
  }



 
  
  
}