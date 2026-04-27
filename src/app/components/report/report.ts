import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { ApiService } from '../../service/api-service';
import { CompanyProfile } from '../../model/models.model';

/* =========================================================
   PRESSURE VESSEL CERTIFICATE
========================================================= */
export interface PressureVesselCertificate {
  id?: number;
  companyId: number;
  certificateNo: string;
  formNo: string;
  ruleNumber: string;
  nameOfOccupier: string;
  addressOfFactory: string;
  vesselDescription: string;
  vesselCapacity: string;
  vesselSrNo: string;
  vesselIdNo: string;
  vesselLocation: string;
  manufacturerName: string;
  natureOfProcess: string;
  dateOfConstruction: string;
  thicknessOfWalls: string;
  dateFirstTakenIntoUse: string;
  maxPermissibleWorkingPressureByManufacturer: string;
  designPressure: string;
  previousHistoryAndLastReportSeen: string;
  dateOfLastHydrostaticTest: string;
  pressureAppliedLastHydrostatic: string;
  exposedToWeather: string;
  partsInaccessible: string;
  examinationAndTestsMade: string;
  conditionExternal: string;
  conditionInternal: string;
  fittingsProvided: string;
  fittingsMaintainedAndChecked: string;
  repairsRequired: string;
  maxPermissibleWorkingPressureCalculated: string;
  beforeExpirationPeriod: string;
  afterExpirationIfNotCompleted: string;
  afterCompletionOfRepairs: string;
  otherObservations: string;
  dateOfExamination: string;
  nextDueDateForExamination: string;
  competentPersonName: string;
  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   LIFTING RECORD MODEL
========================================================= */
export interface LiftingRecord {
  id?: number;
  companyId: number;
  testName: string;
  certificateNo: string;
  dateOfExamination: string;
  sectionRule: string;
  nameOfOccupier: string;
  addressOfFactory: string;
  distinguishingMarksDescription: string;
  srNo: string;
  modelNumber: string;
  equipmentName: string;
  idNumber: string;
  capacity: string;
  manufacturerName: string;
  manufacturerYear: string;
  safeWorkingLoad: string;
  equipmentLocation: string;
  yearFirstTakenIntoUse: string;
  previousCertificateDetails: string;
  periodicalExaminationDetails: string;
  hydraulicSystemStatus: string;
  frameAndForkCondition: string;
  overallResult: string;
  annealingOrHeatTreatmentDetails: string;
  defectsParticulars: string;
  safeWorkingLoadAssessed: string;
  remarks: string;
  certifiedDate: string;
  inspectorName: string;
  nextDueDate: string;
  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   POWER PRESS MODEL
========================================================= */
export interface PowerPress {
  id?: number;
  companyId: number;
  certificateNo: string;
  dateOfExamination: string;        // maps to LocalDate
  // Factory
  occupierName: string;
  factoryAddress: string;
  // Machine
  machineType: string;
  serialNo: string;
  modelNo: string;
  capacity: string;
  manufacturerName: string;
  yearOfManufacture: string;
  location: string;
  dateFirstUse: string;             // maps to LocalDate
  // Examination
  lastExaminedBy: string;
  lastExaminationDate: string;      // maps to LocalDate
  defectsObservation: string;
  // Certification
  certifiedBy: string;
  designation: string;
  licenseNo: string;
  approvalDetails: string;
  // Schedule
  nextDueDate: string;              // maps to LocalDate
  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   TOGGLE FIELD KEYS
========================================================= */
type ToggleFieldKey =
  | 'nameOfOccupier' | 'addressOfFactory' | 'distinguishingMarksDescription'
  | 'modelNumber' | 'srNo' | 'idNumber' | 'manufacturerName' | 'manufacturerYear'
  | 'capacity' | 'safeWorkingLoad' | 'equipmentLocation' | 'yearFirstTakenIntoUse'
  | 'previousCertificateDetails' | 'periodicalExaminationDetails'
  | 'hydraulicSystemStatus' | 'frameAndForkCondition' | 'overallResult'
  | 'annealingOrHeatTreatmentDetails' | 'defectsParticulars'
  | 'safeWorkingLoadAssessed' | 'certifiedDate';

const ALL_TOGGLE_FIELDS: ToggleFieldKey[] = [
  'nameOfOccupier', 'addressOfFactory', 'distinguishingMarksDescription',
  'modelNumber', 'srNo', 'idNumber', 'manufacturerName', 'manufacturerYear',
  'capacity', 'safeWorkingLoad', 'equipmentLocation', 'yearFirstTakenIntoUse',
  'previousCertificateDetails', 'periodicalExaminationDetails',
  'hydraulicSystemStatus', 'frameAndForkCondition', 'overallResult',
  'annealingOrHeatTreatmentDetails', 'defectsParticulars',
  'safeWorkingLoadAssessed', 'certifiedDate'
];

export const liftingEquipmentList: string[] = [
  'EOT Crane', 'HOT Crane', 'Fork Lift', 'Hydraulic Hand Pallet Truck',
  'Hydraulic Lifter', 'Scissor Lift', 'Dock Leveller', 'Rack Stability',
  'Electric Stacker', 'Electric Hoist', 'Wire Rope Hoist', 'HMT Rope',
  'Die Loader', 'Hand Lifter', 'Life Line Rope', 'Wire Rope Sling',
  'Web Sling', 'To Track', 'Balancer', 'Spring Balancer',
  'Pneumatic Balancer', 'Hoist and Lift', 'Fall Arrester'
];

export const powerPressMachineList: string[] = [
  'Power Press', 'Hydraulic Press', 'Pneumatic Press', 'Eccentric Press',
  'Knuckle Joint Press', 'Friction Screw Press', 'Toggle Press',
  'Fly Press', 'Punch Press', 'Stamping Press', 'Blanking Press',
  'Deep Drawing Press', 'Forging Press', 'Coining Press',
  'Centrifugal Machine', 'Grinding Machine', 'Milling Machine',
  'Shearing Machine', 'Bending Machine', 'Broaching Machine'
];

@Component({
  selector: 'app-company-report',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './report.html',
  styleUrls: ['./report.css']
})
export class CompanyReport implements OnInit {

  /* ── Single-record print targets ── */
  selectedItem: any = null;
  selectedPvItem: PressureVesselCertificate | null = null;
  selectedPpItem: PowerPress | null = null;

  /* ── Vessel dropdown ── */
  vesselDescriptionOptions: string[] = [
    'Air Receiver / Compressed Air Vessel',
    'Steam Boiler',
    'Hot Water Generator',
    'Autoclave',
    'Heat Exchanger',
    'Hydraulic Accumulator',
    'Pressure Filter',
    'Deaerator',
    'Flash Vessel',
    'Surge Vessel',
    'Vacuum Vessel',
    'LPG / Gas Cylinder Storage Vessel',
    'Nitrogen Pressure Vessel',
    'Oxygen Pressure Vessel',
    'Chemical Reactor Vessel',
    'Storage Tank (Pressurised)',
    'Expansion Vessel',
    'Condenser',
    'Evaporator',
    'Pressure Cooker (Industrial)',
  ];

  /* ── Machine type options for Power Press ── */
  machineTypeOptions: string[] = [
    'Mechanical', 'Hydraulic', 'Pneumatic', 'Electric', 'Manual'
  ];

  powerPressMachineList = powerPressMachineList;

  /* ── Lifting filter ── */
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

  /* ── Main data ── */
  company: CompanyProfile | null = null;
  liftingReports: LiftingRecord[] = [];
  pressureReports: PressureVesselCertificate[] = [];
  powerPressReports: PowerPress[] = [];

  loading = true;
  error   = false;
  companyId = 0;

  /* ── Lifting modal ── */
  showLiftingModal   = false;
  liftingModalMode: 'add' | 'update' = 'add';
  selectedLifting: LiftingRecord | null = null;
  liftingForm!: LiftingRecord;

  selectedDuration: '6months' | '1year' | '2years' | '' = '';
  fieldToggles!: Record<ToggleFieldKey, boolean | null>;

  /* ── Legacy print modal state ── */
  showPrintModal = false;
  printItem: LiftingRecord | null = null;

  /* ── Pressure vessel modal ── */
  showPressureModal  = false;
  pressureModalMode: 'add' | 'update' = 'add';
  selectedPressure: PressureVesselCertificate | null = null;
  pvForm!: PressureVesselCertificate;
  pvDuration: '6months' | '1year' | '2years' | '' = '';

  /* ── Power Press modal ── */
  showPowerPressModal  = false;
  powerPressModalMode: 'add' | 'update' = 'add';
  selectedPowerPress: PowerPress | null = null;
  ppForm!: PowerPress;
  ppDuration: '6months' | '1year' | '2years' | '' = '';

  /* ── Shared lists ── */
  inspectorList: string[] = ['Brijesh Kumar', 'Aditya Kaushik'];

  sectionRuleOptions: string[] = [
    'Section 21 (2) – Dangerous Machines',
    'Section 28 – Hoist & Lift',
    'Section 29 – Lifting Machines & Tackles',
    'Section 31 – Pressure Vessel',
    'Safety Belts Rule',
    'Hydraulic Test Rule'
  ];

  /* =========================================================
     BULK PRINT
  ========================================================= */
  selectedLiftingIds: Set<number> = new Set();
  selectedPvIds: Set<number> = new Set();
  selectedPpIds: Set<number> = new Set();

  /** Ordered array built just before window.print() is called */
  selectedItemsForPrint: { type: 'lifting' | 'pv' | 'pp'; data: any }[] = [];

  get totalSelected(): number {
    return this.selectedLiftingIds.size + this.selectedPvIds.size + this.selectedPpIds.size;
  }

  toggleLiftingSelection(id: number): void {
    if (this.selectedLiftingIds.has(id)) { this.selectedLiftingIds.delete(id); }
    else { this.selectedLiftingIds.add(id); }
    this.selectedLiftingIds = new Set(this.selectedLiftingIds);
  }

  togglePvSelection(id: number): void {
    if (this.selectedPvIds.has(id)) { this.selectedPvIds.delete(id); }
    else { this.selectedPvIds.add(id); }
    this.selectedPvIds = new Set(this.selectedPvIds);
  }

  togglePpSelection(id: number): void {
    if (this.selectedPpIds.has(id)) { this.selectedPpIds.delete(id); }
    else { this.selectedPpIds.add(id); }
    this.selectedPpIds = new Set(this.selectedPpIds);
  }

  selectAllLifting(): void {
    if (this.selectedLiftingIds.size === this.liftingReports.length) {
      this.selectedLiftingIds = new Set();
    } else {
      this.selectedLiftingIds = new Set(this.liftingReports.filter(r => r.id != null).map(r => r.id!));
    }
  }

  selectAllPv(): void {
    if (this.selectedPvIds.size === this.pressureReports.length) {
      this.selectedPvIds = new Set();
    } else {
      this.selectedPvIds = new Set(this.pressureReports.filter(r => r.id != null).map(r => r.id!));
    }
  }

  selectAllPp(): void {
    if (this.selectedPpIds.size === this.powerPressReports.length) {
      this.selectedPpIds = new Set();
    } else {
      this.selectedPpIds = new Set(this.powerPressReports.filter(r => r.id != null).map(r => r.id!));
    }
  }

  clearAllSelections(): void {
    this.selectedLiftingIds = new Set();
    this.selectedPvIds = new Set();
    this.selectedPpIds = new Set();
  }

  getLiftingCount(): number { return this.selectedItemsForPrint.filter(i => i.type === 'lifting').length; }
  getPvCount(): number      { return this.selectedItemsForPrint.filter(i => i.type === 'pv').length; }
  getPpCount(): number      { return this.selectedItemsForPrint.filter(i => i.type === 'pp').length; }

  printSelected(): void {
    const liftingItems = this.liftingReports
      .filter(r => r.id != null && this.selectedLiftingIds.has(r.id!))
      .map(r => ({
        type: 'lifting' as const,
        data: { ...r, qrCodeUrl: this.generateQrSvg(r.certificateNo + '|' + this.companyId + '|lifting') }
      }));

    const pvItems = this.pressureReports
      .filter(r => r.id != null && this.selectedPvIds.has(r.id!))
      .map(r => ({
        type: 'pv' as const,
        data: { ...r, qrCodeUrl: this.generateQrSvg(r.certificateNo + '|' + this.companyId + '|pv') }
      }));

    const ppItems = this.powerPressReports
      .filter(r => r.id != null && this.selectedPpIds.has(r.id!))
      .map(r => ({
        type: 'pp' as const,
        data: { ...r, qrCodeUrl: this.generateQrSvg(r.certificateNo + '|' + this.companyId + '|pp') }
      }));

    this.selectedItem   = null;
    this.selectedPvItem = null;
    this.selectedPpItem = null;
    this.selectedItemsForPrint = [...liftingItems, ...pvItems, ...ppItems];
    setTimeout(() => window.print(), 300);
  }

  /* =========================================================
     CONSTRUCTOR / INIT
  ========================================================= */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.companyId) { this.goBack(); return; }

    this.liftingForm  = this.emptyLiftingForm();
    this.pvForm       = this.emptyPvForm();
    this.ppForm       = this.emptyPpForm();
    this.fieldToggles = this.defaultToggles();

    this.loadAllData();
  }

  /* =========================================================
     LOAD DATA
  ========================================================= */
  loadAllData(): void {
    this.loading = true;
    forkJoin({
      company:    this.api.getCompanyById(this.companyId),
      lifting:    this.api.getAllLiftingByCompany(this.companyId),
      pressure:   this.api.getAllPressureByCompany(this.companyId),
      powerPress: this.api.getAllPowerPressByCompany(this.companyId)
    }).subscribe({
      next: (res: any) => {
        this.company           = res.company?.data  ?? null;
        this.allLiftingReports = res.lifting?.data  ?? [];
        this.liftingReports    = [...this.allLiftingReports];
        this.pressureReports   = res.pressure?.data   ?? [];
        this.powerPressReports = res.powerPress?.data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Load Error:', err);
        this.loading = false;
        this.error   = true;
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
     SINGLE LIFTING PRINT
  ========================================================= */
  printReport(): void { window.print(); }

  openPrintModal(item: LiftingRecord): void {
    this.selectedItemsForPrint = [];
    this.selectedPvItem        = null;
    this.selectedPpItem        = null;
    this.selectedItem          = item;
    setTimeout(() => window.print(), 200);
  }

  closePrintModal(): void {
    this.printItem      = null;
    this.showPrintModal = false;
  }

  /* =========================================================
     SINGLE PV PRINT
  ========================================================= */
  openPrintPressure(item: PressureVesselCertificate): void {
    this.selectedItemsForPrint = [];
    this.selectedItem          = null;
    this.selectedPpItem        = null;
    this.selectedPvItem        = item;
    setTimeout(() => window.print(), 200);
  }

  /* =========================================================
     SINGLE POWER PRESS PRINT
  ========================================================= */
  openPrintPowerPress(item: PowerPress): void {
    this.selectedItemsForPrint = [];
    this.selectedItem          = null;
    this.selectedPvItem        = null;
    this.selectedPpItem        = item;
    setTimeout(() => window.print(), 200);
  }

  /* =========================================================
     EMPTY FORM HELPERS
  ========================================================= */
  emptyLiftingForm(): LiftingRecord {
    return {
      companyId: this.companyId,
      testName: '', sectionRule: '', certificateNo: '',
      dateOfExamination: '', nameOfOccupier: '', addressOfFactory: '',
      distinguishingMarksDescription: '', srNo: '', modelNumber: '',
      equipmentName: '', idNumber: '', capacity: '', manufacturerName: '',
      manufacturerYear: '', safeWorkingLoad: '', equipmentLocation: '',
      yearFirstTakenIntoUse: '', previousCertificateDetails: '',
      periodicalExaminationDetails: '', hydraulicSystemStatus: '',
      frameAndForkCondition: '', overallResult: '',
      annealingOrHeatTreatmentDetails: '', defectsParticulars: '',
      safeWorkingLoadAssessed: '', remarks: '',
      certifiedDate: '', inspectorName: '', nextDueDate: ''
    };
  }

  emptyPvForm(): PressureVesselCertificate {
    return {
      companyId: this.companyId,
      certificateNo: '',
      formNo: 'Form No. 8',
      ruleNumber: 'Rule 61',
      nameOfOccupier: '',
      addressOfFactory: '',
      vesselDescription: '',
      vesselCapacity: '',
      vesselSrNo: '',
      vesselIdNo: '',
      vesselLocation: '',
      manufacturerName: 'NA',
      natureOfProcess: 'For storage of compressed Air',
      dateOfConstruction: '',
      thicknessOfWalls: 'Shell: 8.1 mm, 8.3 mm | Dish: 10.0 mm, 10.5 mm',
      dateFirstTakenIntoUse: '',
      maxPermissibleWorkingPressureByManufacturer: '7.0 Kg/cm²',
      designPressure: 'NA',
      previousHistoryAndLastReportSeen: 'NA',
      dateOfLastHydrostaticTest: '',
      pressureAppliedLastHydrostatic: '10.0 Kg/cm²',
      exposedToWeather: 'Yes',
      partsInaccessible: 'Internal inaccessible',
      examinationAndTestsMade: 'Through visual examination of the shell plate. Examination/testing of safety Fittings & Ultrasonic thickness test.',
      conditionExternal: 'OK',
      conditionInternal: 'Inaccessible',
      fittingsProvided: 'Yes',
      fittingsMaintainedAndChecked: 'Safety Valve, Pressure Gauge & Drain Valve: O.K',
      repairsRequired: 'Nil',
      maxPermissibleWorkingPressureCalculated: 'RSWP: 7.0 Kg/cm²',
      beforeExpirationPeriod: 'Nill',
      afterExpirationIfNotCompleted: 'Nill',
      afterCompletionOfRepairs: 'Nill',
      otherObservations: 'Pressure Safety Valve and Pressure Gauge must be calibrated on time',
      dateOfExamination: '',
      nextDueDateForExamination: '',
      competentPersonName: '',
    };
  }

  emptyPpForm(): PowerPress {
  return {
    companyId: this.companyId,
    certificateNo: '',
    dateOfExamination: '',
    occupierName: '',
    factoryAddress: '',
    machineType: 'Mechanical',
    serialNo: '',
    modelNo: 'N/A',
    capacity: '',
    manufacturerName: 'NA',
    yearOfManufacture: '',
    location: '',
    dateFirstUse: '',
    lastExaminedBy: '',
    lastExaminationDate: '',
    defectsObservation: 'Nil',
    certifiedBy: '',
    designation: 'Competent Person U/s 21(2), 28, 29, 31',
    licenseNo: '',
    approvalDetails: '',
    nextDueDate: '',
  };
}

  defaultToggles(): Record<ToggleFieldKey, boolean | null> {
    const obj = {} as Record<ToggleFieldKey, boolean | null>;
    ALL_TOGGLE_FIELDS.forEach(key => (obj[key] = true));
    return obj;
  }

  private initTogglesFromRecord(record: LiftingRecord): void {
    ALL_TOGGLE_FIELDS.forEach(key => {
      const val = (record as any)[key];
      this.fieldToggles[key] = (val !== '' && val !== null && val !== undefined) ? true : false;
    });
  }

  /* =========================================================
     LIFTING — NEXT DUE DATE
  ========================================================= */
  onExaminationDateChange(): void {
    if (this.selectedDuration) { this.calculateDueDate(); }
    this.updatePeriodicalDetails();
    this.generateCertificateNo();
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
      case '6months': due.setMonth(due.getMonth() + 6);       break;
      case '1year':   due.setFullYear(due.getFullYear() + 1); break;
      case '2years':  due.setFullYear(due.getFullYear() + 2); break;
    }
    this.liftingForm.nextDueDate = this.toDateStr(due);
  }

  /* =========================================================
     LIFTING — TOGGLE LOGIC
  ========================================================= */
  setFieldToggle(field: ToggleFieldKey, value: boolean): void {
    this.fieldToggles[field] = value;
    if (!value) { (this.liftingForm as any)[field] = ''; }
  }

  /* =========================================================
     LIFTING MODAL
  ========================================================= */
  openAddLifting(): void {
    this.liftingModalMode = 'add';
    this.selectedLifting  = null;
    this.selectedDuration = '';

    this.liftingForm = {
      companyId: this.companyId,
      testName:          'REPORTS OF EXAMINATION OF LIFTING MACHINES/TACKLES (Under Section 29 of Factories Act 1948)',
      equipmentName:     'EOT Crane',
      certificateNo:     '',
      dateOfExamination: '2026-04-07',
      sectionRule:       'Section 29 – Lifting Machines & Tackles',
      nextDueDate:       '',
      inspectorName:     'Brijesh Kumar',
      nameOfOccupier:    this.company?.companyName    ?? '',
      addressOfFactory:  this.company?.factoryAddress ?? '',
      distinguishingMarksDescription: 'EOT CRANE\nMake: N.A., ID No. EOT-01\nSWL: 2.8 ton   Wire Rope Dia- 10 MM, Fall: 4\nLocation: Shop Floor-1',
      modelNumber:      'N.A.',
      srNo:             '',
      idNumber:         'EOT-01',
      capacity:         '2.8 ton',
      manufacturerName: 'N.A.',
      manufacturerYear: '2012',
      safeWorkingLoad:  '2.8 ton',
      equipmentLocation: 'Shop Floor-1',
      yearFirstTakenIntoUse: '2012',
      previousCertificateDetails: 'First time tested by us',
      periodicalExaminationDetails: '',
      hydraulicSystemStatus:
        'Limit Switches: Upper & lower limits functional\n' +
        'Brake Functionality: Operational and holds load properly\n' +
        'Rope: Normal 12.0 mm No kinks, broken strands,\n' +
        'Hooks & Safety Latches: No wear; safety lock not functional',
      frameAndForkCondition: 'N.A.',
      overallResult:         'Hoist found in good working condition',
      annealingOrHeatTreatmentDetails: 'N.A.',
      defectsParticulars: 'Load test was conducted at 1.25 times the safe working load. The machine was thoroughly examined and found to be in satisfactory condition, and is safe for use and operations',
      safeWorkingLoadAssessed: 'Load Test done on 1.25 times of Safe Working. Safe to Use.',
      remarks: 'All components and safety features shall be checked regularly before operation.',
      certifiedDate: '2026-04-07',
    };

    this.updatePeriodicalDetails();
    this.generateCertificateNo();
    this.selectedDuration = '1year';
    this.calculateDueDate();
    this.fieldToggles = this.defaultToggles();
    this.showLiftingModal = true;
  }

  openEditLifting(item: LiftingRecord): void {
    this.liftingModalMode = 'update';
    this.selectedLifting  = item;
    this.liftingForm      = { ...item };
    this.initTogglesFromRecord(item);
    this.selectedDuration = '';
    this.showLiftingModal = true;
  }

  closeLiftingModal(): void {
    this.showLiftingModal = false;
    this.selectedLifting  = null;
  }

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
     CERTIFICATE NUMBER GENERATOR — LIFTING
  ========================================================= */
  generateCertificateNo(): void {
    if (!this.company || !this.liftingForm.testName || !this.liftingForm.equipmentName) return;
    const companyCode = (this.company.companyName || '').replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase();
    const examDate = this.liftingForm.dateOfExamination ? new Date(this.liftingForm.dateOfExamination) : new Date();
    const dateCode = `${String(examDate.getDate()).padStart(2,'0')}${String(examDate.getMonth()+1).padStart(2,'0')}${String(examDate.getFullYear()).slice(-2)}`;
    const equipWords = this.liftingForm.equipmentName.trim().split(/\s+/);
    const equipCode = ((equipWords[0]?.charAt(0) || '') + (equipWords[1]?.charAt(0) || equipWords[0]?.charAt(1) || '')).toUpperCase();
    const serial = String(this.allLiftingReports.length + 1).padStart(3, '0');
    this.liftingForm.certificateNo = `ESS/${companyCode}/${dateCode}/${equipCode}/${serial}`;
  }

  /* =========================================================
     CERTIFICATE NUMBER GENERATOR — POWER PRESS
  ========================================================= */
  generatePpCertificateNo(): void {
    if (!this.company) return;
    const companyCode = (this.company.companyName || '').replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase();
    const now = this.ppForm.dateOfExamination ? new Date(this.ppForm.dateOfExamination) : new Date();
    const dateCode = `${String(now.getDate()).padStart(2,'0')}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getFullYear()).slice(-2)}`;
    const serial = String((this.powerPressReports?.length ?? 0) + 1).padStart(3, '0');
    this.ppForm.certificateNo = `ESS/${companyCode}/${dateCode}/PP/${serial}`;
  }

  /* =========================================================
     STATE-BASED TEXT HELPERS
  ========================================================= */
  getSectionText(): string {
    switch ((this.company?.state || '').toLowerCase().trim()) {
      case 'rajasthan':      return 'U/s 21(2), 28, 29, 31 & Rule 65C';
      case 'punjab':         return 'U/S 21(2), 28, 29';
      case 'haryana':        return 'U/s 21(2), 28, 29, 31, 87 & 102';
      case 'delhi':          return 'U/S 21(2), 28, 29, 31 & 87';
      case 'madhya pradesh': return 'U/s 21(2), 28, 29, 31';
      case 'uttar pradesh':  return 'U/S 21(2), 28, 29, 31';
      default:               return 'U/s 21(2), 28, 29, 31 & 87';
    }
  }

  getApprovalText(): string {
    switch ((this.company?.state || '').toLowerCase().trim()) {
      case 'rajasthan':      return 'Approved by CIF&B, Jaipur Lic No: CMP-883/2025 Dt: 22.12.2025';
      case 'punjab':         return 'Approved by DOF/CIF Punjab Vide Lic. No. LC-FG-1024/1/2021-Factory (I770814/2024) dt.29.01.2024';
      case 'haryana':        return 'Approved by CIF Haryana Vide Lic. No. 2968 dated 27.06.2019';
      case 'delhi':          return 'Approved by the CIF Haryana Vide Lic. No. 2968 Dated 27.06.2019 Memo No. 957-997 dt. 26.03.2021 & 3449-89 dt. 17.08.21';
      case 'madhya pradesh': return 'Approved by CIF Madhya Pradesh Vide Lic. No. CMI2110221 dated 16.09.2023';
      case 'uttar pradesh':  return 'Approved by the Dir. Fac. Kanpur Vide Lic. No.155/F/C.P.U.P./Org.2025 DT. 22.01.2025';
      default:               return 'Approved by CIF&B, Jaipur Lic No: CMP-883/2025 Dt: 22.12.2025';
    }
  }

  updatePeriodicalDetails(): void {
    const inspector = this.liftingForm.inspectorName || 'Inspector';
    const dateRaw   = this.liftingForm.dateOfExamination;
    let dateStr = dateRaw;
    if (dateRaw) {
      const d = new Date(dateRaw);
      if (!isNaN(d.getTime())) {
        dateStr = `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
      }
    }
    this.liftingForm.periodicalExaminationDetails =
      `Tested by ${inspector} - Competent Person on dated ${dateStr}`;
  }

  /* =========================================================
     PRESSURE VESSEL MODAL
  ========================================================= */
  openAddPressure(): void {
    this.pressureModalMode = 'add';
    this.selectedPressure  = null;
    this.pvDuration        = '';
    this.onManufacturerPressureChange(this.pvForm.maxPermissibleWorkingPressureByManufacturer);

    this.pvForm = {
      ...this.emptyPvForm(),
      nameOfOccupier:   this.company?.companyName    ?? '',
      addressOfFactory: this.company?.factoryAddress ?? '',
      vesselDescription: 'Air Receiver / Compressed Air Vessel',
      vesselCapacity: '5000 Ltr',
      vesselSrNo: 'SR-001',
      vesselIdNo: 'PV-01',
      vesselLocation: 'Plant outside DG area',
      dateOfConstruction: new Date().getFullYear().toString(),
      dateFirstTakenIntoUse: new Date().getFullYear().toString(),
      dateOfExamination: this.toDateStr(new Date()),
      competentPersonName: 'Brijesh Kumar',
      thicknessOfWalls: 'Shell: 8.1 mm, 8.3 mm | Dish: 10.0 mm, 10.5 mm',
      maxPermissibleWorkingPressureByManufacturer: '7.0 Kg/cm²',
      maxPermissibleWorkingPressureCalculated: 'RSWP: 7.0 Kg/cm² | Thickness: Shell: 8.1 mm, 8.3 mm | Dish: 10.0 mm, 10.5 mm',
    };

    this.generatePvCertificateNo();
    this.pvDuration = '1year';
    this.calculatePvDueDate();
    this.showPressureModal = true;
  }

  openEditPressure(item: PressureVesselCertificate): void {
    this.pressureModalMode = 'update';
    this.selectedPressure  = item;
    this.pvForm            = { ...item };
    this.pvDuration        = '';
    this.showPressureModal = true;
  }

  closePressureModal(): void {
    this.showPressureModal = false;
    this.selectedPressure  = null;
  }

  savePressure(): void {
    this.pvForm.maxPermissibleWorkingPressureCalculated = this.computedMaxWorkingPressure;
    if (this.pressureModalMode === 'add') {
      this.api.createPressureCertificate(this.pvForm).subscribe({
        next: () => { this.reloadPressure(); this.closePressureModal(); },
        error: err => console.error('PV Create Error:', err)
      });
    } else {
      if (!this.selectedPressure?.id) return;
      this.api.updatePressureCertificate(this.selectedPressure.id, this.pvForm).subscribe({
        next: () => { this.reloadPressure(); this.closePressureModal(); },
        error: err => console.error('PV Update Error:', err)
      });
    }
  }

  reloadPressure(): void {
    this.api.getAllPressureByCompany(this.companyId).subscribe({
      next: (res: any) => { this.pressureReports = res?.data ?? []; },
      error: err => console.error('PV Reload Error:', err)
    });
  }

  /* =========================================================
     POWER PRESS MODAL
  ========================================================= */
openAddPowerPress(): void {
  this.powerPressModalMode = 'add';
  this.selectedPowerPress  = null;
  this.ppDuration          = '';

  this.ppForm = {
    ...this.emptyPpForm(),
    occupierName:      this.company?.companyName    ?? '',
    factoryAddress:    this.company?.factoryAddress ?? '',
    machineType:       'Mechanical',
    location:          'Shop Floor-1',
    capacity:          '100 Ton',
    yearOfManufacture: new Date().getFullYear().toString(),
    dateFirstUse:      new Date().getFullYear().toString(),
    dateOfExamination: this.toDateStr(new Date()),
    lastExaminationDate: this.toDateStr(new Date()),
    certifiedBy:       'Brijesh Kumar',
    designation:       'Competent Person U/s 21(2), 28, 29, 31',
    licenseNo:         '2986',
    defectsObservation: 'No defects affecting the safe working of the dangerous machine / power press / centrifugal machine or its safety devices were observed during the thorough examination. The machine was tested and found to be in satisfactory condition for safe operation.',
  };

  this.generatePpCertificateNo();
  this.ppDuration = '1year';
  this.calculatePpDueDate();
  this.showPowerPressModal = true;
}
  openEditPowerPress(item: PowerPress): void {
    this.powerPressModalMode = 'update';
    this.selectedPowerPress  = item;
    this.ppForm              = { ...item };
    this.ppDuration          = '';
    this.showPowerPressModal = true;
  }

  closePowerPressModal(): void {
    this.showPowerPressModal = false;
    this.selectedPowerPress  = null;
  }

  savePowerPress(): void {
    if (this.powerPressModalMode === 'add') {
      this.api.createPowerPress(this.ppForm as any).subscribe({
        next: () => { this.reloadPowerPress(); this.closePowerPressModal(); },
        error: err => console.error('PP Create Error:', err)
      });
    } else {
      if (!this.selectedPowerPress?.id) return;
      this.api.updatePowerPress(this.selectedPowerPress.id, this.ppForm as any).subscribe({
        next: () => { this.reloadPowerPress(); this.closePowerPressModal(); },
        error: err => console.error('PP Update Error:', err)
      });
    }
  }

  reloadPowerPress(): void {
    this.api.getAllPowerPressByCompany(this.companyId).subscribe({
      next: (res: any) => { this.powerPressReports = res?.data ?? []; },
      error: err => console.error('PP Reload Error:', err)
    });
  }

  /* =========================================================
     POWER PRESS — NEXT DUE DATE
  ========================================================= */
  setPpDuration(duration: '6months' | '1year' | '2years'): void {
    this.ppDuration = duration;
    this.calculatePpDueDate();
  }

private calculatePpDueDate(): void {
  if (!this.ppForm.dateOfExamination) return;
  const base = new Date(this.ppForm.dateOfExamination);
  if (isNaN(base.getTime())) return;
  const due = new Date(base);
  switch (this.ppDuration) {
    case '6months': due.setMonth(due.getMonth() + 6);       break;
    case '1year':   due.setFullYear(due.getFullYear() + 1); break;
    case '2years':  due.setFullYear(due.getFullYear() + 2); break;
  }
  this.ppForm.nextDueDate = this.toDateStr(due);
}
  /* =========================================================
     PRESSURE VESSEL — NEXT DUE DATE
  ========================================================= */
  setPvDuration(duration: '6months' | '1year' | '2years'): void {
    this.pvDuration = duration;
    this.calculatePvDueDate();
  }

  private calculatePvDueDate(): void {
    if (!this.pvForm.dateOfExamination) return;
    const base = new Date(this.pvForm.dateOfExamination);
    if (isNaN(base.getTime())) return;
    const due = new Date(base);
    switch (this.pvDuration) {
      case '6months': due.setMonth(due.getMonth() + 6);       break;
      case '1year':   due.setFullYear(due.getFullYear() + 1); break;
      case '2years':  due.setFullYear(due.getFullYear() + 2); break;
    }
    this.pvForm.nextDueDateForExamination = this.toDateStr(due);
  }

  /* =========================================================
     CERTIFICATE NUMBER GENERATOR — PV
  ========================================================= */
  generatePvCertificateNo(): void {
    if (!this.company) return;
    const companyCode = (this.company.companyName || '').replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase();
    const now = new Date();
    const dateCode = `${String(now.getDate()).padStart(2,'0')}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getFullYear()).slice(-2)}`;
    const serial = String((this.pressureReports?.length ?? 0) + 1).padStart(3, '0');
    this.pvForm.certificateNo = `ESS/${companyCode}/${dateCode}/PV/${serial}`;
  }

  /* =========================================================
     UTILITY
  ========================================================= */
  private toDateStr(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  formatDateForAngular(dateStr: string): string {
    if (!dateStr) return '';
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 4) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  }

  safeDateFormat(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    const normalized = this.formatDateForAngular(dateStr);
    try {
      const date = new Date(normalized);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
    } catch (e) {
      console.warn('Invalid date:', dateStr);
    }
    const parts = dateStr.split('-');
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2) return dateStr;
    return dateStr || '—';
  }

  generateQrSvg(rawText: string): string {
    const parts   = rawText.split('|');
    const certNo  = parts[0] || '';
    const recType = (parts[2] || '').toLowerCase();
    const baseUrl = 'https://yourdomain.com/verify';
    const verifyUrl = `${baseUrl}?cert=${certNo}&type=${recType}&cid=${this.companyId}`;
    const encoded = encodeURIComponent(verifyUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encoded}&margin=4&color=000000&bgcolor=ffffff`;
  }

  get computedMaxWorkingPressure(): string {
    const swp = this.pvForm?.maxPermissibleWorkingPressureByManufacturer || '';
    if (!swp) return '';
    return `RSWP: ${swp} | Shell: 8.1 mm, 8.3 mm | Dish: 10.0 mm, 10.5 mm`;
  }

  onManufacturerPressureChange(value: string): void {
    const match = value?.match(/[\d.]+/);
    if (match) {
      const num = parseFloat(match[0]);
      const result = (num * 1.5).toFixed(1);
      const unit = value.replace(/[\d.]+/, '').trim();
      this.pvForm.pressureAppliedLastHydrostatic = `${result} ${unit} By- manufacturer`;
    }
    this.pvForm.maxPermissibleWorkingPressureCalculated = this.computedMaxWorkingPressure;
  }

  getShellValue(thickness: string): string {
    if (!thickness) return '—';
    const match = thickness.match(/Shell[:\s]*([\d.,\s]+mm)/i);
    return match ? match[1].trim() : '—';
  }

  getDishValue(thickness: string): string {
    if (!thickness) return '—';
    const match = thickness.match(/Dish[:\s]*([\d.,\s]+mm)/i);
    return match ? match[1].trim() : '—';
  }
}