    import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
    import { ActivatedRoute, Router } from '@angular/router';
    import { CommonModule } from '@angular/common';
    import { FormsModule, ReactiveFormsModule } from '@angular/forms';
    import { catchError, forkJoin, of } from 'rxjs';
    import { ApiService } from '../../service/api-service';
    import { CompanyProfile } from '../../model/models.model';
    import { BulkPrintLifting } from "../bulk-print-lifting/bulk-print-lifting";
    import { BulkPrintPv } from '../bulk-print-pv/bulk-print-pv';
    import { BulkPrintPp } from '../bulk-print-pp/bulk-print-pp';
    import { BulkSafetyBelt } from '../bulk-safety-belt/bulk-safety-belt';
    import { BulkPrintSv } from "../bulk-print-sv/bulk-print-sv";

    /* =========================================================
      PRESSURE VESSEL CERTIFICATE
    ========================================================= */
    export interface PressureVesselCertificate {
      id?: number;
      companyId: number;
      testName: string;
      certificateNo: string;
      formNo: string;
      ruleNumber: string;
      nameOfOccupier: string;
      addressOfFactory: string;
      vesselDescription: string;
      vesselCapacity: string;

      vesselIdNo: string;
      // ADD this:
    serialNo: string;   // ← maps to entity serialNo
    modelNo: string;    // ← already present, keep it
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

    export interface SafetyValve {
      id?: number;
      companyId: number;
      certificateNo: string;
      dateOfExamination: string;
      nextDueDate: string;
      occupierName: string;
      factoryAddress: string;
      equipmentName: string;
      valveType: string;
      idNumber: string; 
      size: string;
      modelNo: string;
      serialNo: string;
      location: string;
      pressureSetting: string;
      safeWorkingPressure: string;
      manufacturerName: string;
      manufacturingYear: number | string;
      manufacturerAddress: string;
      natureOfProcess: string;
      lastHydraulicPressureApplied: string;
      examinationTestsMade: string;
      recommendation: string;
      createdAt?: string;
      updatedAt?: string;
    }

    export const valveTypeList: string[] = [
      'Spring Loaded', 'Safety Release Valve', 'Pressure Vacuum Valve',
      'Pressure Release Valve', 'Thermal Safety Valve', 'Air Release Valve','SRV','PRV','TSV'
    ];


    /* =========================================================
      POWER PRESS MODEL
    ========================================================= */
    export interface PowerPress {
      id?: number;
      companyId: number;
      certificateNo: string;
      dateOfExamination: string;
      // Factory
      occupierName: string;
      factoryAddress: string;
      // Machine
      machineType: string;
      serialNo: string;
      modelNo: string;
      capacity: string;
      manufacturerName: string;
      yearOfManufacture: number | string;   // ← backend is Integer
      location: string;
      idNumber?: string;
      dateFirstUse: string;
      // Examination
      lastExaminedBy: string;
      lastExaminationDate: string;          // ← sent as LocalDate string (yyyy-MM-dd)
      defectsObservation: string;
      // Certification
      certifiedBy: string;
      designation: string;
      licenseNo: string;
      approvalDetails: string;
      // Schedule
      nextDueDate: string;
      createdAt?: string;
      updatedAt?: string;
    }

    /* =========================================================
      SAFETY BELT MODEL  ← NEW
    ========================================================= */
    export interface SafetyBeltInspection {
      id?: number;
      companyId: number;
      certificateNumber: string;  
      dateOfExamination: string;
      nextDueDate: string;
      occupierName: string;
      factoryAddress: string;
      beltType: string;
      classOfBelt: string;
      serialNo: string;
      modelNo: string;
      idNumber: string;
      make: string;
      batchNo: string;
      yearOfManufacture: string;
      location: string;
      dateFirstUse: string;
      lastExaminedBy: string;
      lastExaminationDate: string;
      webbing: string;
      buckles: string;
      dRings: string;
      lanyardCondition: string;
      stitching: string;
      hooks: string;
      overallCondition: string;
      defectsObservation: string;
      certifiedBy: string;
      designation: string;
      licenseNo: string;
      approvalDetails: string;
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
      // Cranes
      'EOT Crane',
      'HOT Crane',
      'Jib Crane',
      'Gantry Crane',
      'Hydra Crane',
      // Hoists & Lifts
      'Electric Hoist',
      'Wire Rope Hoist',
      'Monorail With Chain Block',
      'Chain Pulley Block',
      'Hoist and Lift',
      // Forklifts & Stackers
      'Fork Lift',
      'Electric Stacker',
      'Hydraulic Hand Pallet Truck',
      'Hydraulic Lifter',
      // Platforms & Loaders
      'Scissor Lift',
      'Dock Leveller',
      'Dia Loader',
      // 'Hand Lifter',
      // Ropes & Slings
      'Wire Rope Sling',
      'Chain Sling',
      'Web Sling',
      'Fiber/Synthetic Sling',
      'Life Line Rope',
      'High Mast Tower Hoist Fitted with Winch',
      'To Track',
      // Hardware
      'Eye Bolt',
      'D-Shackle',
      'Hook',
      'D-Ring',
      'Master Link',
      // Balancers & Arresters
      'Balancer',
      'Spring Balancer',
      'Pneumatic Balancer',
      'Fall Arrester',
      'Rack Stability',
      'Goods Lift',
      'Material Lift',
      'Passenger Lift',
      // 'Life Line Rope',
      'Retractable Fall Arrester with Life Line Rope',
      'Rectractable Fall Arrester'
    ];

    export const powerPressMachineList: string[] = [
      'Mechanical Power Press',
      'Power Press',
      'Hydraulic Press',
      'Pneumatic Press',
      'Eccentric Press',
      'Knuckle Joint Press',
      'Friction Screw Press',
      'Toggle Press',
      'Fly Press',
      'Punch Press',
      'Stamping Press',
      'Blanking Press',
      'Deep Drawing Press',
      'Forging Press',
      'Coining Press',
      'Centrifugal Machine Press',
      'Grinding Machine Press',
      'Milling Machine Press',
      'Shearing Machine Press',
      'Bending Machine Press',
      'Broaching Machine Press',
      'Injection Moulding Machine Press',
    ];


    export const safetyBeltTypeList: string[] = [
      'Full Body Harness',
      'Safety Belt (Waist Belt)',
      'Lineman Belt',
      'Fall Arrest Harness',
      'Rescue Harness',
      'Work Positioning Belt',
      'Suspension Harness',
      'Rope Access Harness',
      'Sit Harness',
      'Chest Harness',
    ];
    @Component({
      selector: 'app-company-report',
      standalone: true,
      imports: [CommonModule, FormsModule, ReactiveFormsModule, BulkPrintLifting,
        BulkPrintPv, // ← add
        BulkPrintPp, BulkSafetyBelt, BulkPrintSv],
      templateUrl: './report.html',
      styleUrls: ['./report.css']
    })
    export class CompanyReport implements OnInit {

      watermarkBase64 = '';
      barMenuOpen = false;
      isHidden = true;

    liftingSortBy: 'serial' | 'equipment' | 'date' = 'serial';
    liftingGroupBy: 'equipment' | 'none' = 'none';
    pvSortBy: 'serial' | 'vessel' | 'date' = 'serial';
    ppSortBy: 'serial' | 'machine' | 'date' = 'serial';
    sbSortBy: 'serial' | 'belt' | 'date' = 'serial';

    svSortBy: 'serial' | 'valve' | 'date' = 'serial';
    selectedSvItem: SafetyValve | null = null;
    svItemsForPrint: { type: 'sv'; data: any }[] = [];
    safetyValveReports: SafetyValve[] = [];
    selectedSvIds: Set<number> = new Set();
    showSafetyValveModal = false;
    safetyValveModalMode: 'add' | 'update' = 'add';
    selectedSafetyValve: SafetyValve | null = null;
    svForm!: SafetyValve;
    svDuration: '6months' | '1year' | '2years' | '' = '';
    valveTypeList = valveTypeList;

    // ── Renew Modal State ──────────────────────────────────────────
    showRenewModal    = false;
    renewRecordType:  'lifting' | 'pv' | 'pp' | 'sb' | 'sv' | null = null;
    renewRecordId:    number | null = null;
    renewRecordLabel  = '';
    renewIsBulk       = false;
    isRenewing        = false;
    renewDuration: '6months' | '1year' | '2years' | '' = '';
    renewForm = { dateOfExamination: '', nextDueDate: '' };
    bulkRenewIds: { lifting: number[]; pv: number[]; pp: number[]; sb: number[]; sv: number[] } =
      { lifting: [], pv: [], pp: [], sb: [], sv: [] };

    // ── Delete Confirm Modal ──
    showDeleteConfirm   = false;
    deleteRecordType:   'lifting' | 'pv' | 'pp' | 'sb' | 'sv' | null = null;
    deleteRecordId:     number | null = null;
    deleteRecordLabel   = '';
    isDeleting          = false;

    computedMaxWorkingPressureValue = '';
    signatureBase64    = '';
    stampBase64        = '';
    counterSignBase64  = '';
    showStampOnPrint   = true;
    selectedDueMonth: string = '';

    activeTab: 'lifting' | 'pv' | 'pp' | 'sb' | 'sv' = 'lifting';
      
      [x: string]: any;

    toastVisible = false;
    toastMessage = '';
    toastType: 'success' | 'error' = 'success';
      /* ── Single-record print targets ── */
      selectedItem: any = null;
      selectedPvItem: PressureVesselCertificate | null = null;
      selectedPpItem: PowerPress | null = null;
      selectedSbItem: SafetyBeltInspection | null = null;

      /* ── Vessel dropdown ── */
    vesselDescriptionOptions: string[] = [
      'Air Receiver / Compressed Air Vessel',
      'Vertical Pressure Vessel / Air Receiver',
      'Horizontal Pressure Vessel / Air Receiver',
      'Air Boostor/ Pressure Vessel',
      'Air Compressor with Reciever',
      'Steam Boiler',
      'Hot Water Generator',
      'Autoclave',
      'Heat Exchanger',
      'Hydraulic Accumulator',
      'Surge Vessel',
      'Vacuum Vessel',
      'LPG / Gas Cylinder Storage Vessel',
      'Nitrogen Pressure Vessel',
      'Oxygen Pressure Vessel',
      'Chemical Reactor Vessel',
      'Storage Tank (Pressurised)',
      'Expansion Vessel',
      'Condenser',
      'Compressor Tank',
      'Air Compressor with Oil Separator',
      'Air Dryer',
      'Hydrant Air Vessel',
      'Horizontal Air Header',
      'Air Pipe Line / Pressure Plant',
      'Water Pipe Line / Pressure Plant',
      'Hydrant Pipe Line/ Pressure Plant',
      'LPG Pipe Line / Pressure Plant',
      'PNG Pipe Line / Pressure Plant',
      'Softner Vessel',
      'DM Vessel',
      'Water Vessel',
      'Foam Module Tank',
      'Softner Water Tank',
      'Domestic Water Tank',
      'Pressure Vessel/Oil Seperator',
      'Water Storage Tank',
      'Underground Storage Tank',
      'FOAM Tank', 
      'Water Oil Seperation'
    ];

      pvTestOptions: string[] = [
      'REPORT OF EXAMINATION OF PRESSURE VESSEL OR PLANT',
      'REPORT OF HYDRO-STATIC EXAMINATION OF PRESSURE VESSEL OR PLANT',
    ];

    private loadImageAsBase64(url: string): Promise<string> {
      return fetch(url)
        .then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.blob();
        })
        .then(blob => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror  = reject;
          reader.readAsDataURL(blob);
        }));
    }

      /* ── Machine type options for Power Press ── */
      machineTypeOptions: string[] = [
        'Mechanical Press', 'Hydraulic Press', 'Pneumatic Press', 'Electric Press', 'Manual Press'
      ];



      powerPressMachineList = powerPressMachineList;
      safetyBeltTypeList = safetyBeltTypeList;

      /* ── Lifting filter ── */
      selectedTestName = '';

      liftingTestOptions = [
        // 'REPORT OF EXAMINATION OF DANGEROUS MACHINES / POWER PRESS CENTRIFUGAL MACHINES (Under Section 21 (2) of Factories Act 1948)',
        'REPORT OF EXAMINATION OF HOIST & LIFT (Under Section 28 of Factories Act 1948)',
        'REPORT OF EXAMINATION OF LIFTING MACHINES/TACKLES (Under Section 29 of Factories Act 1948)',
        // 'REPORT OF EXAMINATION OR TEST OF PRESSURE VESSEL OR PLANT (Under Section 31 of Factories Act 1948)',
        // 'REPORTS OF EXAMINATION OF SAFETY BELTS',
        // 'REPORT OF HYDRAULIC EXAMINATION OF PRESSURE VESSEL OR PLANT (Under Section 31 of Factories Act 1948)',
      ];

      equipmentList = liftingEquipmentList;
      allLiftingReports: LiftingRecord[] = [];

      /* ── Main data ── */
      company: CompanyProfile | null = null;
      liftingReports: LiftingRecord[] = [];
      pressureReports: PressureVesselCertificate[] = [];
      powerPressReports: PowerPress[] = [];
      safetyBeltReports: SafetyBeltInspection[] = [];
      

      liftingItemsForPrint: { type: 'lifting'; data: any }[] = [];
      pvItemsForPrint:      { type: 'pv';      data: any }[] = [];
      ppItemsForPrint:      { type: 'pp';      data: any }[] = [];
      sbItemsForPrint:      { type: 'sb';      data: any }[] = [];

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

      /* ── Safety Belt modal ── NEW ── */
      showSafetyBeltModal  = false;
      safetyBeltModalMode: 'add' | 'update' = 'add';
      selectedSafetyBelt: SafetyBeltInspection | null = null;
      sbForm!: SafetyBeltInspection;
      sbDuration: '6months' | '1year' | '2years' | '' = '';

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




      // Bulk Print New 
      
        get selectedItemsForPrint(): { type: 'lifting' | 'pv' | 'pp'; data: any }[] {
        return [...this.liftingItemsForPrint, ...this.pvItemsForPrint, ...this.ppItemsForPrint];
      }

      /* =========================================================
        BULK PRINT
      ========================================================= */
      selectedLiftingIds: Set<number> = new Set();
      selectedPvIds: Set<number> = new Set();
      selectedPpIds: Set<number> = new Set();
      selectedSbIds: Set<number> = new Set();

      /** Ordered array built just before window.print() is called */
      // selectedItemsForPrint: { type: 'lifting' | 'pv' | 'pp'; data: any }[] = [];

    get totalSelected(): number {
      return this.selectedLiftingIds.size + this.selectedPvIds.size +
            this.selectedPpIds.size + this.selectedSbIds.size + this.selectedSvIds.size;
    }

    toggleSvSelection(id: number): void {
      if (this.selectedSvIds.has(id)) { this.selectedSvIds.delete(id); }
      else { this.selectedSvIds.add(id); }
      this.selectedSvIds = new Set(this.selectedSvIds);
    }


    selectAllSv(): void {
      if (this.selectedSvIds.size === this.safetyValveReports.length) {
        this.selectedSvIds = new Set();
      } else {
        this.selectedSvIds = new Set(this.safetyValveReports.filter(r => r.id != null).map(r => r.id!));
      }
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

      selectAllSb(): void {
        if (this.selectedSbIds.size === this.safetyBeltReports.length) {
          this.selectedSbIds = new Set();
        } else {
          this.selectedSbIds = new Set(this.safetyBeltReports.filter(r => r.id != null).map(r => r.id!));
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


      toggleSbSelection(id: number): void {
        if (this.selectedSbIds.has(id)) { this.selectedSbIds.delete(id); }
        else { this.selectedSbIds.add(id); }
        this.selectedSbIds = new Set(this.selectedSbIds);
      }



  clearAllSelections(): void {
    this.selectedLiftingIds = new Set();
    this.selectedPvIds = new Set();
    this.selectedPpIds = new Set();
    this.selectedSbIds = new Set();
    this.selectedSvIds = new Set();   // ← add this line
  }

printSelected(): void {
  // Lifting
  this.liftingItemsForPrint = this.liftingReports
    .filter(r => r.id != null && this.selectedLiftingIds.has(r.id!))
    .sort((a, b) => this.compareCertificateNumbers(a.certificateNo, b.certificateNo))
    .map(r => ({
      type: 'lifting' as const,
      data: { ...r, qrCodeUrl: this.generateQrSvg(r.certificateNo + '|' + this.companyId + '|lifting') }
    }));
 
  // PV
  this.pvItemsForPrint = this.pressureReports
    .filter(r => r.id != null && this.selectedPvIds.has(r.id!))
    .sort((a, b) => this.compareCertificateNumbers(a.certificateNo, b.certificateNo))
    .map(r => ({
      type: 'pv' as const,
      data: { ...r, qrCodeUrl: this.generateQrSvg(r.certificateNo + '|' + this.companyId + '|pv') }
    }));
 
  // PP
  this.ppItemsForPrint = this.powerPressReports
    .filter(r => r.id != null && this.selectedPpIds.has(r.id!))
    .sort((a, b) => this.compareCertificateNumbers(a.certificateNo, b.certificateNo))
    .map(r => ({
      type: 'pp' as const,
      data: { ...r, qrCodeUrl: this.generateQrSvg(r.certificateNo + '|' + this.companyId + '|pp') }
    }));
 
  // SB
  this.sbItemsForPrint = this.safetyBeltReports
    .filter(r => r.id != null && this.selectedSbIds.has(r.id!))
    .sort((a, b) => this.compareCertificateNumbers(a.certificateNumber, b.certificateNumber))
    .map(r => ({
      type: 'sb' as const,
      data: { ...r, qrCodeUrl: this.generateQrSvg(r.certificateNumber + '|' + this.companyId + '|sb') }
    }));
 
  // SV
  this.svItemsForPrint = this.safetyValveReports
    .filter(r => r.id != null && this.selectedSvIds.has(r.id!))
    .sort((a, b) => this.compareCertificateNumbers(a.certificateNo, b.certificateNo))
    .map(r => ({
      type: 'sv' as const,
      data: { ...r, qrCodeUrl: this.generateQrSvg(r.certificateNo + '|' + this.companyId + '|sv') }
    }));
 
  // Clear single-record targets
  this.selectedItem   = null;
  this.selectedPvItem = null;
  this.selectedPpItem = null;
  this.selectedSbItem = null;
  this.selectedSvItem = null;
 
  setTimeout(() => window.print(), 300);
}
      /* =========================================================
        CONSTRUCTOR / INIT
      ========================================================= */
      constructor(
        private route: ActivatedRoute,
        private router: Router,
        private api: ApiService,
        private cdr: ChangeDetectorRef,

      ) {}

    ngOnInit(): void {
      this.companyId = Number(this.route.snapshot.paramMap.get('id'));
      if (!this.companyId) { this.goBack(); return; }

      this.liftingForm  = this.emptyLiftingForm();
      this.pvForm       = this.emptyPvForm();
      this.ppForm       = this.emptyPpForm();
      this.sbForm       = this.emptySbForm();
      this.svForm       = this.emptySvForm();   // ← ADD
      this.fieldToggles = this.defaultToggles();

      this.loadImageAsBase64('/sign.png')
        .then(b64 => { this.signatureBase64 = b64; this.cdr.detectChanges(); })
        .catch(() => console.warn('sign.png not found'));

      this.loadImageAsBase64('/stamp.png')
        .then(b64 => { this.stampBase64 = b64; this.cdr.detectChanges(); })
        .catch(() => console.warn('stamp.jpg not found'));

      this.loadImageAsBase64('/sign.png')
        .then(b64 => { this.counterSignBase64 = b64; this.cdr.detectChanges(); })
        .catch(() => console.warn('sign.jpg not found'));

      this.loadAllData();

      
    this.loadImageAsBase64('/bg_logo.png')
      .then(b64 => { this.watermarkBase64 = b64; this.cdr.detectChanges(); })
      .catch(() => console.warn('bg_logo.png not found'));
    }
      /* =========================================================
        LOAD DATA
      ========================================================= */


    loadAllData(): void {
      this.loading = true;
      forkJoin({
        company:     this.api.getCompanyById(this.companyId),
        lifting:     this.api.getAllLiftingByCompany(this.companyId),
        pressure:    this.api.getAllPressureByCompany(this.companyId),
        powerPress:  this.api.getAllPowerPressByCompany(this.companyId),
        safetyBelt:  this.api.getAllSafetyBelts(this.companyId),
        safetyValve: this.api.getAllSafetyValvesByCompany(this.companyId).pipe(
          catchError(err => {
            console.warn('Safety Valve load failed, continuing without it:', err);
            return of({ data: [] });
          })
        ),
      }).subscribe({
    next: (res: any) => {

  this.company = res.company?.data ?? null;


  this.allLiftingReports = (res.lifting?.data ?? [])
    .sort((a:any, b:any) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );

  this.liftingReports = [...this.allLiftingReports];


  this.pressureReports = (res.pressure?.data ?? [])
    .sort((a:any, b:any) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );


  this.powerPressReports = (res.powerPress?.data ?? [])
    .sort((a:any, b:any) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );


  this.safetyBeltReports = (res.safetyBelt?.data ?? [])
    .sort((a:any, b:any) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );


  this.safetyValveReports = (res.safetyValve?.data ?? [])
    .sort((a:any, b:any) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );

  this.loading = false;
  this.cdr.detectChanges();
},
        error: (err) => {
          console.error('Load Error:', err);
          this.loading = false;
          this.error   = true;
          this.cdr.detectChanges();
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
        this.liftingItemsForPrint = [];
    this.pvItemsForPrint = [];
    this.sbItemsForPrint = []; 
    this.ppItemsForPrint = [];
        this.selectedPvItem        = null;
        this.selectedPpItem        = null;
        this.selectedItem          = item;
        this.selectedSbItem       = null;
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
        this.liftingItemsForPrint = [];
    this.pvItemsForPrint = [];
    this.ppItemsForPrint = [];
        this.selectedItem          = null;
        this.selectedPpItem        = null;
        this.selectedPvItem        = item;
        console.log(this.selectedPvItem);
        setTimeout(() => window.print(), 200);
      }

      /* =========================================================
        SINGLE POWER PRESS PRINT
      ========================================================= */
      openPrintPowerPress(item: PowerPress): void {
        this.liftingItemsForPrint = [];
    this.pvItemsForPrint = [];
    this.ppItemsForPrint = [];
        this.selectedItem          = null;
        this.selectedPvItem        = null;
        this.selectedPpItem        = item;
        setTimeout(() => window.print(), 200);
      }

      /* =========================================================
        SINGLE SAFETY BELT PRINT  ← NEW
      ========================================================= */
      openPrintSafetyBelt(item: SafetyBeltInspection): void {
        this.liftingItemsForPrint = [];
        this.pvItemsForPrint      = [];
        this.ppItemsForPrint      = [];
        this.sbItemsForPrint      = [];
        this.selectedItem         = null;
        this.selectedPvItem       = null;
        this.selectedPpItem       = null;
        this.selectedSbItem       = item;
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
          testName: 'REPORT OF EXAMINATION OF PRESSURE VESSEL OR PLANT', // ← ADD THIS
          formNo: 'Form No. 9',
          ruleNumber: 'Rule 56',
          nameOfOccupier: '',
          addressOfFactory: '',
          vesselDescription: '',
          vesselCapacity: '',
          vesselIdNo: '',
          // ADD:
          serialNo: '',     // ← matches entity 
          modelNo: '',      // ← already present, keep it  // ← matches entity
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
          exposedToWeather: 'Open',
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
        idNumber: '', 
        machineType: 'Mechanical Press',
        serialNo: '',
        modelNo: 'N/A',
        capacity: '',
        manufacturerName: 'NA',
        yearOfManufacture: new Date().getFullYear(),  // ← number, not string
        location: '',
        dateFirstUse: '',
        lastExaminedBy: '',
        lastExaminationDate: '',                       // ← keep as date string
        defectsObservation: 'Nil',
        certifiedBy: '',
        designation: 'Competent Person U/s 21(2), 28, 29, 31',
        licenseNo: '',
        approvalDetails: '',
        nextDueDate: '',
      };
    }
    /* ── Safety Belt empty form ── NEW ── */
      emptySbForm(): SafetyBeltInspection {
        return {
          companyId: this.companyId,
          certificateNumber: '', dateOfExamination: '', nextDueDate: '',
          occupierName: '', factoryAddress: '',classOfBelt: 'Anti-Static', 
          beltType: 'Full Body Harness', serialNo: 'SB-01', modelNo: 'N/A',
          make: '', idNumber:'', batchNo: '', yearOfManufacture: '', location: '',
          dateFirstUse: '', lastExaminedBy: '', lastExaminationDate: '',
          webbing: 'OK', buckles: 'OK', dRings: 'Normal',
          lanyardCondition: 'OK', stitching: 'OK', hooks: 'OK',
          overallCondition: 'Satisfactory',
          defectsObservation: 'Safe to use As per IS:3521',
          certifiedBy: '', designation: 'Competent Person U/s 21(2), 28, 29, 31',
          licenseNo: '', approvalDetails: '',
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
  if (this.liftingModalMode === 'update') {
    this.liftingForm.certificateNo =
      this.updateCertNoDate(this.liftingForm.certificateNo, this.liftingForm.dateOfExamination);
  }

  if (this.selectedDuration) {
    this.calculateDueDate();
  }

  this.updatePeriodicalDetails();
  this.generatelifCertificateNo();
}


onPpExaminationDateChange(): void {
  if (this.powerPressModalMode === 'update') {
    this.ppForm.certificateNo =
      this.updateCertNoDate(this.ppForm.certificateNo, this.ppForm.dateOfExamination);
  }

  this.generatePpCertificateNo();   // guarded — no-op in update mode
  if (this.ppDuration) this.calculatePpDueDate();
}

onSbExaminationDateChange(): void {
  if (this.safetyBeltModalMode === 'update') {
    this.sbForm.certificateNumber =
      this.updateCertNoDate(this.sbForm.certificateNumber, this.sbForm.dateOfExamination);
  }

  this.generateSbCertificateNo();   // guarded — no-op in update mode
  if (this.sbDuration) this.calculateSbDueDate();
}

onSvExaminationDateChange(): void {
  if (this.safetyValveModalMode === 'update') {
    this.svForm.certificateNo =
      this.updateCertNoDate(this.svForm.certificateNo, this.svForm.dateOfExamination);
  }

  this.generateSvCertificateNo();       // guarded — no-op in update mode
  if (this.svDuration) this.calculateSvDueDate();
}

      setDuration(duration: '6months' | '1year' | '2years'): void {
        this.selectedDuration = duration;
        this.calculateDueDate();
      }

    private calculateDueDate(): void {
      if (!this.liftingForm.dateOfExamination) return;
      const base = this.parseLocalDate(this.liftingForm.dateOfExamination);
      if (isNaN(base.getTime())) return;
      const due = new Date(base);
      switch (this.selectedDuration) {
        case '6months': due.setMonth(due.getMonth() + 6);       break;
        case '1year':   due.setFullYear(due.getFullYear() + 1); break;
        case '2years':  due.setFullYear(due.getFullYear() + 2); break;
      }
      due.setDate(due.getDate() - 1);  // ← subtract 1 day
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
          // Default current date
          dateOfExamination: this.toDateStr(new Date()),
          
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
        this.generatelifCertificateNo();
        this.updatePeriodicalDetails();
        this.generatelifCertificateNo();
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

    /* ── LIFTING ── */
    saveLifting(): void {
      if (this.liftingModalMode === 'add') {

        const saveData = { ...this.liftingForm };
        console.log('Saving Data:', saveData);

        this.api.createLiftingRecord(saveData as any).subscribe({
          next: (res: any) => {
            this.reloadLifting(() => {
              this.showToast('Lifting record added successfully!');

              // ── Capture EVERYTHING we want to carry forward ──
              const prev = {
                equipmentName:     saveData.equipmentName,
                testName:          saveData.testName,
                inspectorName:     saveData.inspectorName,
                dateOfExamination: saveData.dateOfExamination,
                sectionRule:       saveData.sectionRule,
                nameOfOccupier:    saveData.nameOfOccupier,
               addressOfFactory:  saveData.addressOfFactory,
                // Rich default fields the user likely wants unchanged
                distinguishingMarksDescription: saveData.distinguishingMarksDescription,
                modelNumber:                    saveData.modelNumber,
                idNumber:                       saveData.idNumber,
                capacity:                       saveData.capacity,
                
                manufacturerName:               saveData.manufacturerName,
                manufacturerYear:               saveData.manufacturerYear,
                safeWorkingLoad:                saveData.safeWorkingLoad,
                equipmentLocation:              saveData.equipmentLocation,
                yearFirstTakenIntoUse:          saveData.yearFirstTakenIntoUse,
                previousCertificateDetails:     saveData.previousCertificateDetails,
                hydraulicSystemStatus:          saveData.hydraulicSystemStatus,
                frameAndForkCondition:          saveData.frameAndForkCondition,
                overallResult:                  saveData.overallResult,
                annealingOrHeatTreatmentDetails: saveData.annealingOrHeatTreatmentDetails,
                defectsParticulars:             saveData.defectsParticulars,
                safeWorkingLoadAssessed:        saveData.safeWorkingLoadAssessed,
                remarks:                        saveData.remarks,
                certifiedDate:                  saveData.certifiedDate,
              };
              const prevDuration = this.selectedDuration;

              // ── Reset modal for next record, carrying forward all fields ──
              this.liftingModalMode = 'add';
              this.selectedLifting  = null;

              this.liftingForm = {
                companyId:         this.companyId,
                certificateNo:     '',          // ← will be regenerated
                nextDueDate:       '',          // ← will be recalculated
                periodicalExaminationDetails: '', // ← will be regenerated
                srNo:              '',          // ← unique per record, clear it
                ...prev,                        // ← carry everything else forward
              };

              // Regenerate cert no with updated list
              this.generatelifCertificateNo();

              // Restore duration & recalculate due date
              if (prevDuration) {
                this.selectedDuration = prevDuration;
                this.calculateDueDate();
              }

              // Regenerate periodical details with carried-over inspector + date
              this.updatePeriodicalDetails();

              // Keep toggles all-on for next record
              this.fieldToggles = this.defaultToggles();

              this.cdr.detectChanges();
            });
          },
          error: err => {
            console.error('Create Error:', err);
            this.showToast('Failed to add lifting record.', 'error');
          }
        });

      } else {
        if (!this.selectedLifting?.id) return;
        this.api.updateLiftingRecord(this.selectedLifting.id, this.liftingForm as any).subscribe({
          next: () => {
            this.reloadLifting(() => {
              this.closeLiftingModal();
              this.showToast('Lifting record updated successfully!');
            });
          },
          error: err => {
            console.error('Update Error:', err);
            this.showToast('Failed to update lifting record.', 'error');
          }
        });
      }
    }
    reloadLifting(onDone?: () => void): void {
      this.api.getAllLiftingByCompany(this.companyId).subscribe({
        next: (res: any) => {
          this.allLiftingReports = res?.data ?? [];
          this.liftingReports    = [...this.allLiftingReports];
          this.filterByTestName();
          this.cdr.detectChanges();
          onDone?.();
        },
        error: err => console.error('Reload Error:', err)
      });
    }
      /* =========================================================
        CERTIFICATE NUMBER GENERATOR — LIFTING
      ========================================================= */
    generatelifCertificateNo(): void {
      if (!this.company) return;
      if (this.liftingModalMode === 'update') return;

      const companyCode = this.getCompanyCode();

      const now = this.liftingForm.dateOfExamination
        ? new Date(this.liftingForm.dateOfExamination)
        : new Date();
      const dateCode =
        `${String(now.getDate()).padStart(2, '0')}` +
        `${String(now.getMonth() + 1).padStart(2, '0')}` +
        `${String(now.getFullYear()).slice(-2)}`;

      const typeCode = (this.liftingForm.equipmentName || 'LT')
        .split(/\s+/)
        .filter(w => /[A-Za-z]/.test(w))
        .slice(0, 2)
        .map(w => w.charAt(0).toUpperCase())
        .join('') || 'LT';

      let maxSerial = 0;
      (this.liftingReports || []).forEach(r => {
        if (!r.certificateNo) return;
        const parts = r.certificateNo.split('/');
        const num = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(num) && num > maxSerial) maxSerial = num;
      });

      const serial = String(maxSerial + 1).padStart(3, '0');
      this.liftingForm.certificateNo =
        `${this.companyId}/${companyCode}/${dateCode}/LT/${serial}`;  // ← companyId

      this.cdr.detectChanges();
    }
      /* =========================================================
        CERTIFICATE NUMBER GENERATOR — POWER PRESS 
      ========================================================= */
    generatePpCertificateNo(): void {
      if (!this.company) return;
      if (this.powerPressModalMode === 'update') return;

      const companyCode = this.getCompanyCode();  // ← use getCompanyCode() like PV

      const now = this.ppForm.dateOfExamination
        ? new Date(this.ppForm.dateOfExamination)
        : new Date();
      const dateCode =
        `${String(now.getDate()).padStart(2, '0')}` +
        `${String(now.getMonth() + 1).padStart(2, '0')}` +
        `${String(now.getFullYear()).slice(-2)}`;

      let maxSerialPp = 0;
      this.powerPressReports.forEach(r => {
        if (!r.certificateNo) return;
        const parts = r.certificateNo.split('/');
        const num = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(num) && num > maxSerialPp) maxSerialPp = num;
      });

      const serial = String(maxSerialPp + 1).padStart(3, '0');
      this.ppForm.certificateNo =
        `${this.companyId}/${companyCode}/${dateCode}/PP/${serial}`;  // ← companyId
    }

      // CompanyCodeFirst 3 letters (alpha only) of company name, uppercased"Rajasthan Steel Ltd" → RSL

      /* =========================================================
        CERTIFICATE NUMBER GENERATOR — SAFETY BELT  ← NEW
      ========================================================= */
    generateSbCertificateNo(): void {
      if (!this.company) return;
      if (this.safetyBeltModalMode === 'update') return;

      const companyCode = this.getCompanyCode();  // ← use getCompanyCode() like PV

      const now = this.sbForm.dateOfExamination
        ? new Date(this.sbForm.dateOfExamination)
        : new Date();
      const dateCode =
        `${String(now.getDate()).padStart(2, '0')}` +
        `${String(now.getMonth() + 1).padStart(2, '0')}` +
        `${String(now.getFullYear()).slice(-2)}`;

      let maxSerialSb = 0;
      this.safetyBeltReports.forEach(r => {
        if (!r.certificateNumber) return;
        const parts = r.certificateNumber.split('/');
        const num = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(num) && num > maxSerialSb) maxSerialSb = num;
      });

      const serial = String(maxSerialSb + 1).padStart(3, '0');
      this.sbForm.certificateNumber =
        `${this.companyId}/${companyCode}/${dateCode}/SB/${serial}`;  // ← companyId
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
          case 'uttarakhand':    return 'U/s 21(2), 28, 29, 31';   // ← ADD
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
          case 'uttarakhand':    return 'Approved by the Dir. Fac. Haldwani Vide <br> Lic. No.114/F/C.P.U.K./Org.2025 DT.11.02.2025';  // ← ADD (fill in real details)
          default:               return 'Approved by CIF&B, Jaipur Lic No: CMP-883/2025 Dt: 22.12.2025';
        }
      }

    updatePeriodicalDetails(): void {
      const inspector = this.liftingForm.inspectorName || 'Inspector';
      const dateRaw   = this.liftingForm.dateOfExamination;
      let dateStr = dateRaw;

      if (dateRaw) {
        const d = this.parseLocalDate(dateRaw);
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
      this.pvForm = {
        ...this.emptyPvForm(),
        nameOfOccupier:   this.company?.companyName    ?? '',
        addressOfFactory: this.company?.factoryAddress ?? '',
        vesselDescription: 'Air Receiver / Compressed Air Vessel',
        vesselCapacity: '5000 Ltr',
        // ADD:
        serialNo: 'SR-001',    // ← matches entity
        modelNo: 'N/A',        // ← keep as is
        vesselIdNo: 'PV-01',
        vesselLocation: 'Plant outside DG area',
        dateOfConstruction: new Date().getFullYear().toString(),
        dateFirstTakenIntoUse: new Date().getFullYear().toString(),
        dateOfExamination: this.toDateStr(new Date()),
        competentPersonName: 'Brijesh Kumar',
        thicknessOfWalls: 'Shell: 8.1 mm, 8.3 mm | Dish: 10.0 mm, 10.5 mm',
        maxPermissibleWorkingPressureByManufacturer: '7.0 Kg/cm²',
        maxPermissibleWorkingPressureCalculated: '',
      };

      // ← Call AFTER pvForm is ready so it reads the correct value
      this.onManufacturerPressureChange(this.pvForm.maxPermissibleWorkingPressureByManufacturer);

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

    /* ── PRESSURE VESSEL ── */
    savePressure(): void {
      this.pvForm.maxPermissibleWorkingPressureCalculated = this.computedMaxWorkingPressure;
      if (this.pressureModalMode === 'add') {
      this.api.createPressureCertificate(this.pvForm).subscribe({
      next: () => {
        this.reloadPressure(() => {
          this.showToast('Pressure vessel record added successfully!');
          // ── Reset for next record: carry forward EVERYTHING from the
          //    just-saved form. Only clear/regenerate fields that must
          //    be unique per record (certificateNo, serialNo) ──
          this.pvForm = {
            ...this.pvForm,
            // serialNo:      '',   // clear for next — unique per record
            certificateNo: '',   // will be regenerated below
          };
          this.generatePvCertificateNo();   // ← key fix
          if (this.pvDuration) this.calculatePvDueDate();
          this.cdr.detectChanges();
        });
      },
      error: err => {
        console.error('PV Create Error:', err);
        this.showToast('Failed to add pressure vessel record.', 'error');
      }
    });
      } else {
        // update branch unchanged
        if (!this.selectedPressure?.id) return;
        this.api.updatePressureCertificate(this.selectedPressure.id, this.pvForm).subscribe({
          next: () => {
            this.reloadPressure(() => {
              this.closePressureModal();
              this.showToast('Pressure vessel record updated successfully!');
            });
          },
          error: err => {
            console.error('PV Update Error:', err);
            this.showToast('Failed to update pressure vessel record.', 'error');
          }
        });
      }
    }

    reloadPressure(onDone?: () => void): void {
      this.api.getAllPressureByCompany(this.companyId).subscribe({
        next: (res: any) => {
          this.pressureReports = res?.data ?? [];
          this.cdr.detectChanges();
          onDone?.();
        },
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
        occupierName:        this.company?.companyName    ?? '',
        factoryAddress:      this.company?.factoryAddress ?? '',
        machineType:         'Mechanical Press',
        location:            'Shop Floor-1',
        idNumber:            ''   ,   
        capacity:            '100 Ton',
        yearOfManufacture:   new Date().getFullYear(),   // ← number
        dateFirstUse:        String(new Date().getFullYear()),
        dateOfExamination:   this.toDateStr(new Date()),
        lastExaminationDate: this.toDateStr(new Date()), // ← proper date string
        certifiedBy:         'Brijesh Kumar',
        lastExaminedBy:      'Brijesh Kumar',
        designation:         'Competent Person U/s 21(2), 28, 29, 31',
        licenseNo:           '2986',
        defectsObservation:  'No defects affecting the safe operation of the dangerous machine/power press or its safety devices were observed during the thorough examination. The machine was tested and found to be in satisfactory condition for safe operation.',
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
    /* ── POWER PRESS ── */
  savePowerPress(): void {
    if (this.powerPressModalMode === 'add') {
      // STEP 1: Capture ALL current form data BEFORE API call
      const savedFormData = { ...this.ppForm };      // ← full copy
      const savedDuration = this.ppDuration;         // ← save duration too
  
      this.api.createPowerPress(this.ppForm as any).subscribe({
        next: () => {
          this.reloadPowerPress(() => {
            this.showToast('Power press record added successfully!');
  
            // STEP 2: Restore saved data, clearing ONLY unique fields
            this.ppForm = {
              ...savedFormData,                       // ← restore EVERYTHING
              certificateNo:       '',                // ← only clear unique fields
              // serialNo:            '',                // ← only clear unique fields
              // nextDueDate:         '',                // ← recalculated below
            };
  
            // STEP 3: Regenerate certificate with updated records list
            this.generatePpCertificateNo();
  
            // STEP 4: Restore duration & recalculate due date
            if (savedDuration) {
              this.ppDuration = savedDuration;
              this.calculatePpDueDate();
            }
  
            this.cdr.detectChanges();
          });
        },
        error: err => {
          console.error('PP Create Error:', err);
          this.showToast('Failed to add power press record.', 'error');
        }
      });
    } else {
      // UPDATE BRANCH (unchanged)
      if (!this.selectedPowerPress?.id) return;
      this.api.updatePowerPress(this.selectedPowerPress.id, this.ppForm as any).subscribe({
        next: () => {
          this.reloadPowerPress(() => {
            this.closePowerPressModal();
            this.showToast('Power press record updated successfully!');
          });
        },
        error: err => {
          console.error('PP Update Error:', err);
          this.showToast('Failed to update power press record.', 'error');
        }
      });
    }
  }
  
    reloadPowerPress(onDone?: () => void): void {
      this.api.getAllPowerPressByCompany(this.companyId).subscribe({
        next: (res: any) => {
          this.powerPressReports = res?.data ?? [];
          this.cdr.detectChanges();
          onDone?.();
        },
        error: err => console.error('PP Reload Error:', err)
      });
    }

        /* =========================================================
        SAFETY BELT MODAL  ← NEW
      ========================================================= */
      openAddSafetyBelt(): void {
        this.safetyBeltModalMode = 'add';
        this.selectedSafetyBelt  = null;
        this.sbDuration          = '';
        this.sbForm = {
          ...this.emptySbForm(),
          occupierName:      this.company?.companyName    ?? '',
          factoryAddress:    this.company?.factoryAddress ?? '',
          location:          'Shop Floor-1',
          yearOfManufacture: new Date().getFullYear().toString(),
          dateFirstUse:      new Date().getFullYear().toString(),
          dateOfExamination: this.toDateStr(new Date()),
          lastExaminationDate: this.toDateStr(new Date()),
          lastExaminedBy:    'Brijesh Kumar',
          certifiedBy:       'Brijesh Kumar',
          designation:       'Competent Person U/s 21(2), 28, 29, 31',
          licenseNo:         '2986',
        };
    
        this.generateSbCertificateNo();
        this.sbDuration = '6months';
        this.calculateSbDueDate();
        this.showSafetyBeltModal = true;
      }
    
      openEditSafetyBelt(item: SafetyBeltInspection): void {
        this.safetyBeltModalMode = 'update';
        this.selectedSafetyBelt  = item;
        this.sbForm              = { ...item };
        this.sbDuration          = '';
        this.showSafetyBeltModal = true;
      }
    
      closeSafetyBeltModal(): void { this.showSafetyBeltModal = false; this.selectedSafetyBelt = null; }
    
    /* ── SAFETY BELT ── */
  saveSafetyBelt(): void {

    if (this.safetyBeltModalMode === 'add') {

      this.api.createSafetyBelt(this.sbForm as any).subscribe({

        next: () => {

          this.reloadSafetyBelt(() => {

            this.showToast('Safety belt record added successfully!');


            // Keep existing data, only regenerate certificate number
            const previousData = {
              ...this.sbForm
            };


            this.sbForm = {
              ...previousData,

              // keep company details
              occupierName: this.company?.companyName ?? previousData.occupierName,
              factoryAddress: this.company?.factoryAddress ?? previousData.factoryAddress,


              // only clear new unique fields
              certificateNumber: '',
              // serialNo: ''
            };


            // Generate only new certificate number
            this.generateSbCertificateNo();


            // recalculate due date if required
            if (this.sbDuration) {
              this.calculateSbDueDate();
            }


            this.cdr.detectChanges();

          });

        },


        error: err => {

          console.error('SB Create Error:', err);

          this.showToast(
            'Failed to add safety belt record.',
            'error'
          );

        }

      });

    } else {


      if (!this.selectedSafetyBelt?.id) return;


      this.api.updateSafetyBelt(
        this.selectedSafetyBelt.id,
        this.sbForm as any

      ).subscribe({

        next: () => {

          this.reloadSafetyBelt(() => {

            this.closeSafetyBeltModal();

            this.showToast(
              'Safety belt record updated successfully!'
            );

          });

        },


        error: err => {

          console.error('SB Update Error:', err);

          this.showToast(
            'Failed to update safety belt record.',
            'error'
          );

        }

      });

    }

  }

    reloadSafetyBelt(onDone?: () => void): void {
      this.api.getAllSafetyBelts(this.companyId).subscribe({
        next: (res: any) => {
          this.safetyBeltReports = res?.data ?? [];
          this.cdr.detectChanges();
          onDone?.();
        },
        error: err => console.error('SB Reload Error:', err)
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
      const base = this.parseLocalDate(this.ppForm.dateOfExamination);
      if (isNaN(base.getTime())) return;
      const due = new Date(base);
      switch (this.ppDuration) {
        case '6months': due.setMonth(due.getMonth() + 6);       break;
        case '1year':   due.setFullYear(due.getFullYear() + 1); break;
        case '2years':  due.setFullYear(due.getFullYear() + 2); break;
      }
      due.setDate(due.getDate() - 1);  // ← subtract 1 day
      this.ppForm.nextDueDate = this.toDateStr(due);
    }

    /* =========================================================
        SAFETY BELT — NEXT DUE DATE  ← NEW
      ========================================================= */
      setSbDuration(duration: '6months' | '1year' | '2years'): void {
        this.sbDuration = duration;
        this.calculateSbDueDate();
      }
      /* =========================================================
        PRESSURE VESSEL — NEXT DUE DATE
      ========================================================= */
      setPvDuration(duration: '6months' | '1year' | '2years'): void {
        this.pvDuration = duration;
        this.calculatePvDueDate();
      }
    private calculateSbDueDate(): void {
      if (!this.sbForm.dateOfExamination) return;
      const base = this.parseLocalDate(this.sbForm.dateOfExamination);
      if (isNaN(base.getTime())) return;
      const due = new Date(base);
      switch (this.sbDuration) {
        case '6months': due.setMonth(due.getMonth() + 6);       break;
        case '1year':   due.setFullYear(due.getFullYear() + 1); break;
        case '2years':  due.setFullYear(due.getFullYear() + 2); break;
      }
      due.setDate(due.getDate() - 1);  // ← subtract 1 day
      this.sbForm.nextDueDate = this.toDateStr(due);
    }
    private calculatePvDueDate(): void {
      if (!this.pvForm.dateOfExamination) return;
      const base = this.parseLocalDate(this.pvForm.dateOfExamination);
      if (isNaN(base.getTime())) return;
      const due = new Date(base);
      switch (this.pvDuration) {
        case '6months': due.setMonth(due.getMonth() + 6);       break;
        case '1year':   due.setFullYear(due.getFullYear() + 1); break;
        case '2years':  due.setFullYear(due.getFullYear() + 2); break;
      }
      due.setDate(due.getDate() - 1);  // ← subtract 1 day
      this.pvForm.nextDueDateForExamination = this.toDateStr(due);
    }




      /* =========================================================
        CERTIFICATE NUMBER GENERATOR — PV
      ========================================================= */
      // generatePvCertificateNo(): void {
      //   if (!this.company) return;
      //   const companyCode = (this.company.companyName || '').replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase();
      //   const now = new Date();
      //   const dateCode = `${String(now.getDate()).padStart(2,'0')}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getFullYear()).slice(-2)}`;
      //   const serial = String((this.pressureReports?.length ?? 0) + 1).padStart(3, '0');
      //   this.pvForm.certificateNo = `ESS/${companyCode}/${dateCode}/PV/${serial}`;
      // }

      private getCompanyCode(): string {
      return (this.company?.companyName || '')
        .replace(/^[Mm]\/[Ss]\s*/, '')        // strip "M/s "
        .split(/\s+/)                          // split into words
        .filter(w => /[A-Za-z]/.test(w))       // keep only words with letters
        .map(w => w.replace(/[^A-Za-z]/g, '').charAt(0).toUpperCase())
        .join('');                             // → "IOCL"
    }

    // generatePvCertificateNo(): void {
    //   if (!this.company) return;
    //   const companyCode = (this.company.companyName || '')
    //   .replace(/^[Mm]\/[Ss]\s*/,'')   // ← strip leading "M/s "
    //   .replace(/[^A-Za-z]/g, '')
    //   .substring(0, 3)
    //   .toUpperCase();
    //   const now = this.pvForm.dateOfExamination ? new Date(this.pvForm.dateOfExamination) : new Date();
    //   const dateCode = `${String(now.getDate()).padStart(2,'0')}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getFullYear()).slice(-2)}`;

    //   // Extract the highest serial number from existing PV certificates
    //   let maxSerial = 0;
    //   this.pressureReports.forEach(r => {
    //     if (!r.certificateNo) return;
    //     const parts = r.certificateNo.split('/');
    //     const lastPart = parts[parts.length - 1];
    //     const num = parseInt(lastPart, 10);
    //     if (!isNaN(num) && num > maxSerial) maxSerial = num;
    //   });

    //   const serial = String(maxSerial + 1).padStart(3, '0');
    //   this.pvForm.certificateNo = `ESS/${companyCode}/${dateCode}/PV/${serial}`;
    // }


    generatePvCertificateNo(): void {
      if (!this.company) return;
      if (this.pressureModalMode === 'update') return;  // ← ADD THIS
      const companyCode = this.getCompanyCode();  // ← IOCL
      const now = this.pvForm.dateOfExamination ? new Date(this.pvForm.dateOfExamination) : new Date();
      const dateCode = `${String(now.getDate()).padStart(2,'0')}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getFullYear()).slice(-2)}`;
      let maxSerial = 0;
      this.pressureReports.forEach(r => {
        if (!r.certificateNo) return;
        const parts = r.certificateNo.split('/');
        const num = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(num) && num > maxSerial) maxSerial = num;
      });
      const serial = String(maxSerial + 1).padStart(3, '0');
      this.pvForm.certificateNo = `${this.companyId}/${companyCode}/${dateCode}/PV/${serial}`;
    }

      /* =========================================================
        UTILITY
      ========================================================= */
      private toDateStr(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      }

      
    private parseLocalDate(dateStr: string): Date {
      const normalized = this.formatDateForAngular(dateStr);
      const [yr, mo, dy] = normalized.split('-').map(Number);
      return new Date(yr, mo - 1, dy);
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
      try {
        const date = this.parseLocalDate(dateStr);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
      } catch (e) {
        console.warn('Invalid date:', dateStr);
      }
      return dateStr || '—';
    }

      // generateQrSvg(rawText: string): string {
      //   const parts   = rawText.split('|');
      //   const certNo  = parts[0] || '';
      //   const recType = (parts[2] || '').toLowerCase();
      //   const baseUrl = 'https://yourdomain.com/verify';
      //   const verifyUrl = `${baseUrl}?cert=${certNo}&type=${recType}&cid=${this.companyId}`;
      //   const encoded = encodeURIComponent(verifyUrl);
      //   return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encoded}&margin=4&color=000000&bgcolor=ffffff`;
      // }
    /* =========================================================
      CERTIFICATE NUMBER GENERATOR — LIFTING
    ========================================================= */
    generateLiftingCertificateNo(): void {
      if (!this.company) return;

      const companyCode = this.getCompanyCode(); // ← same as PV

      const examDate =
        this.liftingForm.dateOfExamination
          ? new Date(this.liftingForm.dateOfExamination)
          : new Date();

      const dateCode =
        `${String(examDate.getDate()).padStart(2, '0')}` +
        `${String(examDate.getMonth() + 1).padStart(2, '0')}` +
        `${String(examDate.getFullYear()).slice(-2)}`;

      // Find highest existing serial
      let maxSerial = 0;

      (this.liftingReports || []).forEach(r => {
        if (!r?.certificateNo) return;

        const parts = r.certificateNo.split('/');
        const serialPart = parts[parts.length - 1];

        const serial = parseInt(serialPart, 10);

        if (!isNaN(serial) && serial > maxSerial) {
          maxSerial = serial;
        }
      });

      const nextSerial =
        String(maxSerial + 1).padStart(3, '0');

      this.liftingForm.certificateNo =
        `${this.companyId}/${companyCode}/${dateCode}/LT/${nextSerial}`;

      this.cdr.detectChanges();
    }


    // In parent component class — replace the method with an arrow function
    generateQrSvg = (rawText: string): string => {
      const parts    = rawText.split('|');
      const certNo   = encodeURIComponent(parts[0] || '');
      const recType  = (parts[2] || '').toLowerCase();
      const baseUrl  = 'https://blog-app-dc4e7.web.app/verify';
      const verifyUrl = `${baseUrl}?cert=${certNo}&type=${recType}&cid=${this.companyId}`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verifyUrl)}&margin=4&color=000000&bgcolor=ffffff`;
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
        this.computedMaxWorkingPressureValue = this.computedMaxWorkingPressure; // ← ADD THIS
      this.cdr.detectChanges(); // ← A
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

    showToast(message: string, type: 'success' | 'error' = 'success'): void {
      this.toastMessage = message;
      this.toastType    = type;
      this.toastVisible = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.toastVisible = false;
        this.cdr.detectChanges();
      }, 3000);
    }


    getDueAlertMonths(): {
      monthKey: string; monthLabel: string; overdue: boolean; daysLeft: number;
      items: { type: string; name: string; certNo: string; dueDate: string }[];
    }[] {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sixMonthsOut = new Date(today);
      sixMonthsOut.setMonth(sixMonthsOut.getMonth() + 6);

      const allItems: { type: string; name: string; certNo: string; dueRaw: Date; dueDate: string }[] = [];

    this.liftingReports.forEach(r => {
      if (!r.nextDueDate) return;
      const d = this.parseLocalDate(r.nextDueDate);
        if (isNaN(d.getTime()) || d > sixMonthsOut) return;
        allItems.push({ type: 'Lifting', name: r.equipmentName || 'Lifting', certNo: r.certificateNo || '', dueRaw: d, dueDate: this.safeDateFormat(r.nextDueDate) });
      });

    this.pressureReports.forEach(r => {
      if (!r.nextDueDateForExamination) return;
      const d = this.parseLocalDate(r.nextDueDateForExamination);
        if (isNaN(d.getTime()) || d > sixMonthsOut) return;
        allItems.push({ type: 'PV', name: r.vesselDescription || 'Vessel', certNo: r.certificateNo || '', dueRaw: d, dueDate: this.safeDateFormat(r.nextDueDateForExamination) });
      });

    this.powerPressReports.forEach(r => {
      if (!r.nextDueDate) return;
      const d = this.parseLocalDate(r.nextDueDate);
        if (isNaN(d.getTime()) || d > sixMonthsOut) return;
        allItems.push({ type: 'PP', name: r.machineType || 'Machine', certNo: r.certificateNo || '', dueRaw: d, dueDate: this.safeDateFormat(r.nextDueDate) });
      });

    this.safetyBeltReports.forEach(r => {
      if (!r.nextDueDate) return;
      const d = this.parseLocalDate(r.nextDueDate);
        if (isNaN(d.getTime()) || d > sixMonthsOut) return;
        allItems.push({ type: 'SB', name: r.beltType || 'Safety Belt', certNo: r.certificateNumber || '', dueRaw: d, dueDate: this.safeDateFormat(r.nextDueDate) });
      });

      const monthMap = new Map<string, typeof allItems>();
      allItems.forEach(item => {
        const key = `${item.dueRaw.getFullYear()}-${String(item.dueRaw.getMonth() + 1).padStart(2, '0')}`;
        if (!monthMap.has(key)) monthMap.set(key, []);
        monthMap.get(key)!.push(item);
      });

      const result = Array.from(monthMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, items]) => {
          const [yr, mo] = key.split('-').map(Number);
          const firstDay = new Date(yr, mo - 1, 1);
          const monthLabel = firstDay.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
          const daysLeft = Math.ceil((firstDay.getTime() - today.getTime()) / 86400000);
          return { monthKey: key, monthLabel, overdue: daysLeft < 0, daysLeft, items };
        });

      // Auto-select current month or nearest upcoming month on first load
      if (result.length > 0 && !this.selectedDueMonth) {
        const currentKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
        const currentExists = result.find(r => r.monthKey === currentKey);
        this.selectedDueMonth = currentExists ? currentKey : result[0].monthKey;
      }

      // If previously selected month no longer exists, reset to first
      if (this.selectedDueMonth && !result.find(r => r.monthKey === this.selectedDueMonth)) {
        this.selectedDueMonth = result.length > 0 ? result[0].monthKey : '';
      }

      return result;
    }

    isDueOverdue(dateStr: string | null | undefined): boolean {
      if (!dateStr) return false;
      const d = this.parseLocalDate(dateStr);
      if (isNaN(d.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return d < today;
    }
    
    /**
     * Returns true when the date is within the next 60 days (but not overdue).
     */
    isDueWarning(dateStr: string | null | undefined): boolean {
      if (!dateStr) return false;
      const d = this.parseLocalDate(dateStr);
      if (isNaN(d.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sixtyDays = new Date(today);
      sixtyDays.setDate(sixtyDays.getDate() + 60);
      return d >= today && d <= sixtyDays;
    }
    /**
     * Returns true when the date is more than 60 days away (upcoming / safe).
     */
    isDueUpcoming(dateStr: string | null | undefined): boolean {
      if (!dateStr) return false;
      const d = this.parseLocalDate(dateStr);
      if (isNaN(d.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sixtyDays = new Date(today);
      sixtyDays.setDate(sixtyDays.getDate() + 60);
      return d > sixtyDays;
    }


    openDeleteConfirm(type: 'lifting' | 'pv' | 'pp' | 'sb' | 'sv', id: number, label: string): void {
      this.deleteRecordType  = type;
      this.deleteRecordId    = id;
      this.deleteRecordLabel = label;
      this.showDeleteConfirm = true;
    }

    cancelDelete(): void {
      this.showDeleteConfirm  = false;
      this.deleteRecordType   = null;
      this.deleteRecordId     = null;
      this.deleteRecordLabel  = '';
      this.isDeleting         = false;
    }

    confirmDelete(): void {
      if (!this.deleteRecordId || !this.deleteRecordType) return;
      this.isDeleting = true;

      const id        = this.deleteRecordId;
      const type      = this.deleteRecordType;  // ← capture BEFORE cancelDelete clears it
      const companyId = this.companyId;

    const req$ =
      type === 'lifting' ? this.api.deleteLiftingRecord(id, companyId)       :
      type === 'pv'      ? this.api.deletePressureCertificate(id, companyId) :
      type === 'pp'      ? this.api.deletePowerPress(id, companyId)          :
      type === 'sb'      ? this.api.deleteSafetyBelt(id, companyId)          :
                            this.api.deleteSafetyValve(id);

      req$.subscribe({
        next: () => {
          this.isDeleting = false;
          this.cancelDelete();             // ← now safe, type already captured
          switch (type) {                  // ← use local variable, not this.deleteRecordType
            case 'lifting': this.reloadLifting();    break;
            case 'pv':      this.reloadPressure();   break;
            case 'pp':      this.reloadPowerPress(); break;
            case 'sb':      this.reloadSafetyBelt(); break;
            case 'sv':      this.reloadSafetyValve(); break;   // ← ADD
          }
          this.showToast('Record deleted successfully!');
          this.cdr.detectChanges();
        },
        error: err => {
          this.isDeleting = false;
          console.error('Delete Error:', err);
          this.showToast('Failed to delete record. Please try again.', 'error');
          this.cancelDelete();
          this.cdr.detectChanges();
        }
      });
    }


get sortedLiftingReports(): LiftingRecord[] {
  const reports = [...this.liftingReports];
  switch (this.liftingSortBy) {
    case 'serial':
      // NOW uses full cert number comparison instead of just last segment
      return reports.sort((a, b) =>
        this.compareCertificateNumbers(a.certificateNo, b.certificateNo)
      );
    case 'equipment':
      return reports.sort((a, b) =>
        (a.equipmentName || '').localeCompare(b.equipmentName || ''));
    case 'date':
      return reports.sort((a, b) =>
        (a.dateOfExamination || '').localeCompare(b.dateOfExamination || ''));
    default:
      return reports;
  }
}

    get equipmentGroups(): { name: string; count: number; records: LiftingRecord[] }[] {
      const grouped = new Map<string, LiftingRecord[]>();
      this.sortedLiftingReports.forEach(r => {
        const name = r.equipmentName || 'Unknown';
        if (!grouped.has(name)) grouped.set(name, []);
        grouped.get(name)!.push(r);
      });
      return Array.from(grouped.entries())
        .map(([name, records]) => ({ name, count: records.length, records }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    toggleGroupSelection(records: LiftingRecord[]): void {
      const ids = records.filter(r => r.id != null).map(r => r.id!);
      const allSelected = ids.every(id => this.selectedLiftingIds.has(id));
      if (allSelected) {
        ids.forEach(id => this.selectedLiftingIds.delete(id));
      } else {
        ids.forEach(id => this.selectedLiftingIds.add(id));
      }
      this.selectedLiftingIds = new Set(this.selectedLiftingIds);
    }

    isGroupFullySelected(records: LiftingRecord[]): boolean {
      return records.filter(r => r.id != null).every(r => this.selectedLiftingIds.has(r.id!));
    }

    isGroupPartiallySelected(records: LiftingRecord[]): boolean {
      const ids = records.filter(r => r.id != null).map(r => r.id!);
      const selectedCount = ids.filter(id => this.selectedLiftingIds.has(id)).length;
      return selectedCount > 0 && selectedCount < ids.length;
    }


   get sortedPressureReports(): PressureVesselCertificate[] {
  const reports = [...this.pressureReports];
  switch (this.pvSortBy) {
    case 'serial':
      return reports.sort((a, b) =>
        this.compareCertificateNumbers(a.certificateNo, b.certificateNo)
      );
    case 'vessel':
      return reports.sort((a, b) =>
        (a.vesselDescription || '').localeCompare(b.vesselDescription || ''));
    case 'date':
      return reports.sort((a, b) =>
        (a.dateOfExamination || '').localeCompare(b.dateOfExamination || ''));
    default:
      return reports;
  }
}

 get sortedPowerPressReports(): PowerPress[] {
  const reports = [...this.powerPressReports];
  switch (this.ppSortBy) {
    case 'serial':
      return reports.sort((a, b) =>
        this.compareCertificateNumbers(a.certificateNo, b.certificateNo)
      );
    case 'machine':
      return reports.sort((a, b) =>
        (a.machineType || '').localeCompare(b.machineType || ''));
    case 'date':
      return reports.sort((a, b) =>
        (a.dateOfExamination || '').localeCompare(b.dateOfExamination || ''));
    default:
      return reports;
  }
}
 
    get machineGroups(): { name: string; count: number }[] {
      const map = new Map<string, number>();
      this.powerPressReports.forEach(r => {
        const name = r.machineType || 'Unknown';
        map.set(name, (map.get(name) || 0) + 1);
      });
      return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

 get sortedSafetyBeltReports(): SafetyBeltInspection[] {
  const reports = [...this.safetyBeltReports];
  switch (this.sbSortBy) {
    case 'serial':
      // NOTE: Safety Belt uses 'certificateNumber' not 'certificateNo'
      return reports.sort((a, b) =>
        this.compareCertificateNumbers(a.certificateNumber, b.certificateNumber)
      );
    case 'belt':
      return reports.sort((a, b) =>
        (a.beltType || '').localeCompare(b.beltType || ''));
    case 'date':
      return reports.sort((a, b) =>
        (a.dateOfExamination || '').localeCompare(b.dateOfExamination || ''));
    default:
      return reports;
  }
}
    get beltGroups(): { name: string; count: number }[] {
      const map = new Map<string, number>();
      this.safetyBeltReports.forEach(r => {
        const name = r.beltType || 'Unknown';
        map.set(name, (map.get(name) || 0) + 1);
      });
      return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

    get vesselGroups() {
      const map = new Map<string, PressureVesselCertificate[]>();

      this.pressureReports.forEach(item => {
        const key = item.vesselDescription?.trim() || 'Unknown Vessel';

        if (!map.has(key)) {
          map.set(key, []);
        }

        map.get(key)!.push(item);
      });

      return Array.from(map.entries()).map(([name, records]) => ({
        name,
        count: records.length,
        records
      }));
    }

onPvExaminationDateChange(): void {
  if (this.pressureModalMode === 'update') {
    this.pvForm.certificateNo =
      this.updateCertNoDate(this.pvForm.certificateNo, this.pvForm.dateOfExamination);
  }

  this.generatePvCertificateNo();       // guarded — no-op in update mode
  if (this.pvDuration) this.calculatePvDueDate();
}
    /* =========================================================
      RENEW MODAL
    ========================================================= */
    openRenewSingle(
      type: 'lifting' | 'pv' | 'pp' | 'sb' | 'sv',
      id: number,
      label: string,
      currentDateOfExam: string,
      currentNextDue: string
    ): void {
      this.renewRecordType  = type;
      this.renewRecordId    = id;
      this.renewRecordLabel = label;
      this.renewIsBulk      = false;
      this.renewDuration    = '';
      this.renewForm = {
        dateOfExamination: currentDateOfExam || this.toDateStr(new Date()),
        nextDueDate:       currentNextDue    || '',
      };
      this.showRenewModal = true;
    }

    openRenewBulk(): void {
      if (this.totalSelected === 0) return;
      this.renewIsBulk      = true;
      this.renewRecordType  = null;
      this.renewRecordId    = null;
      this.renewRecordLabel = `${this.totalSelected} selected record(s)`;
      this.renewDuration    = '';
      this.renewForm = {
        dateOfExamination: this.toDateStr(new Date()),
        nextDueDate:       '',
      };
      this.bulkRenewIds = {
        lifting: [...this.selectedLiftingIds],
        pv:      [...this.selectedPvIds],
        pp:      [...this.selectedPpIds],
        sb:      [...this.selectedSbIds],
        sv:      [...this.selectedSvIds],   // ← ADD
      };
      this.showRenewModal = true;
    }

    closeRenewModal(): void {
      this.showRenewModal   = false;
      this.renewRecordType  = null;
      this.renewRecordId    = null;
      this.renewRecordLabel = '';
      this.isRenewing       = false;
      this.renewIsBulk      = false;
      this.bulkRenewIds = { lifting: [], pv: [], pp: [], sb: [], sv: [] };
    }

    setRenewDuration(duration: '6months' | '1year' | '2years'): void {
      this.renewDuration = duration;
      this.calculateRenewDueDate();
    }

    onRenewDateChange(): void {
      if (this.renewDuration) this.calculateRenewDueDate();
    }

    private calculateRenewDueDate(): void {
      if (!this.renewForm.dateOfExamination) return;
      const base = this.parseLocalDate(this.renewForm.dateOfExamination);
      if (isNaN(base.getTime())) return;
      const due = new Date(base);
      switch (this.renewDuration) {
        case '6months': due.setMonth(due.getMonth() + 6);       break;
        case '1year':   due.setFullYear(due.getFullYear() + 1); break;
        case '2years':  due.setFullYear(due.getFullYear() + 2); break;
      }
      due.setDate(due.getDate() - 1);
      this.renewForm.nextDueDate = this.toDateStr(due);
    }

    confirmRenew(): void {
      if (!this.renewForm.dateOfExamination || !this.renewForm.nextDueDate) {
        this.showToast('Please fill both date fields.', 'error');
        return;
      }
      this.isRenewing = true;
      if (this.renewIsBulk) {
        this.executeBulkRenew();
      } else {
        this.executeSingleRenew();
      }
    }

    private executeSingleRenew(): void {
      const type = this.renewRecordType!;
      const id   = this.renewRecordId!;
      const obs$ = this.buildRenewObservable(type, id);
      if (!obs$) { this.isRenewing = false; return; }

      obs$.subscribe({
        next: () => {
          this.isRenewing = false;
          this.closeRenewModal();
          this.reloadByType(type);
          this.showToast('Record renewed successfully!');
        },
        error: (err: any) => {
          console.error('Renew Error:', err);
          this.isRenewing = false;
          this.showToast('Failed to renew record.', 'error');
        }
      });
    }

    private executeBulkRenew(): void {
      const calls: { type: 'lifting' | 'pv' | 'pp' | 'sb' | 'sv'; obs: any }[] = [];

      this.bulkRenewIds.lifting.forEach(id =>
        calls.push({ type: 'lifting', obs: this.buildRenewObservable('lifting', id) }));
      this.bulkRenewIds.pv.forEach(id =>
        calls.push({ type: 'pv', obs: this.buildRenewObservable('pv', id) }));
      this.bulkRenewIds.pp.forEach(id =>
        calls.push({ type: 'pp', obs: this.buildRenewObservable('pp', id) }));
      this.bulkRenewIds.sb.forEach(id =>
        calls.push({ type: 'sb', obs: this.buildRenewObservable('sb', id) }));
      this.bulkRenewIds.sv.forEach(id =>
        calls.push({ type: 'sv', obs: this.buildRenewObservable('sv', id) }));   // ← ADD

      if (calls.length === 0) { this.isRenewing = false; return; }

      const run = (index: number): Promise<void> => {
        if (index >= calls.length) return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
          calls[index].obs.subscribe({ next: () => resolve(), error: (e: any) => reject(e) });
        }).then(() => run(index + 1));
      };

      run(0).then(() => {
        this.isRenewing = false;
        this.closeRenewModal();
        this.clearAllSelections();
        const types = new Set(calls.map(c => c.type));
        types.forEach(t => this.reloadByType(t));
        this.showToast(`${calls.length} record(s) renewed successfully!`);
      }).catch((err: any) => {
        console.error('Bulk Renew Error:', err);
        this.isRenewing = false;
        this.showToast('Some records failed to renew.', 'error');
      });
    }

  private buildRenewObservable(type: 'lifting' | 'pv' | 'pp' | 'sb' | 'sv', id: number): any {
    const newDate = this.renewForm.dateOfExamination;

    switch (type) {
      case 'lifting': {
        const rec = this.liftingReports.find(r => r.id === id);
        if (!rec) return null;
        return this.api.updateLiftingRecord(id, {
          ...rec,
          dateOfExamination: newDate,
          nextDueDate:       this.renewForm.nextDueDate,
          certificateNo:     this.updateCertNoDate(rec.certificateNo, newDate),
        } as any);
      }
      case 'pv': {
        const rec = this.pressureReports.find(r => r.id === id);
        if (!rec) return null;
        return this.api.updatePressureCertificate(id, {
          ...rec,
          dateOfExamination:         newDate,
          nextDueDateForExamination: this.renewForm.nextDueDate,
          certificateNo:             this.updateCertNoDate(rec.certificateNo, newDate),
        } as any);
      }
      case 'pp': {
        const rec = this.powerPressReports.find(r => r.id === id);
        if (!rec) return null;
        return this.api.updatePowerPress(id, {
          ...rec,
          dateOfExamination: newDate,
          nextDueDate:       this.renewForm.nextDueDate,
          certificateNo:     this.updateCertNoDate(rec.certificateNo, newDate),
        } as any);
      }
      case 'sb': {
        const rec = this.safetyBeltReports.find(r => r.id === id);
        if (!rec) return null;
        return this.api.updateSafetyBelt(id, {
          ...rec,
          dateOfExamination:  newDate,
          nextDueDate:        this.renewForm.nextDueDate,
          certificateNumber:  this.updateCertNoDate(rec.certificateNumber, newDate),
        } as any);
      }
      case 'sv': {
        const rec = this.safetyValveReports.find(r => r.id === id);
        if (!rec) return null;
        return this.api.updateSafetyValve(id, {
          ...rec,
          dateOfExamination: newDate,
          nextDueDate:       this.renewForm.nextDueDate,
          certificateNo:     this.updateCertNoDate(rec.certificateNo, newDate),
        } as any);
      }
      default: return null;
    }
  }

    private reloadByType(type: 'lifting' | 'pv' | 'pp' | 'sb' | 'sv'): void {
      switch (type) {
        case 'lifting': this.reloadLifting();    break;
        case 'pv':      this.reloadPressure();   break;
        case 'pp':      this.reloadPowerPress(); break;
        case 'sb':      this.reloadSafetyBelt(); break;
        case 'sv':      this.reloadSafetyValve(); break;
      }
    }

    openPrintSafetyValve(item: SafetyValve): void {
      this.liftingItemsForPrint = [];
      this.pvItemsForPrint      = [];
      this.ppItemsForPrint      = [];
      this.sbItemsForPrint      = [];
      this.svItemsForPrint      = [];
      this.selectedItem         = null;
      this.selectedPvItem       = null;
      this.selectedPpItem       = null;
      this.selectedSbItem       = null;
      this.selectedSvItem       = item;
      setTimeout(() => window.print(), 200);
    }

    emptySvForm(): SafetyValve {
      return {
        companyId: this.companyId,
        certificateNo: '', dateOfExamination: '', nextDueDate: '',
        occupierName: '', factoryAddress: '', idNumber: '',
        equipmentName: 'Safety Release Valve', valveType: '',
        modelNo: 'N/A',
        size: '3/4 Inch', serialNo: 'SV-01', location: '',
        pressureSetting: '', safeWorkingPressure: '',
        manufacturerName: 'NA', manufacturingYear: new Date().getFullYear(),
        manufacturerAddress: 'NA', natureOfProcess: 'For Releasing Over Pressure',
        lastHydraulicPressureApplied: 'As per Manufacturer Certificate.',
        examinationTestsMade: 'Visual Inspection, Hydraulic Test, Seat Leakage Test, Pressure Setting (Calibration), Functional Lift Test and Reseating Test',
      recommendation: `The Safety Relief Valve has been tested, calibrated and found satisfactory. Safe for operation at a set pressure of 11 kg/cm²(g).`,    };
    }

    openAddSafetyValve(): void {
      this.safetyValveModalMode = 'add';
      this.selectedSafetyValve  = null;
      this.svDuration           = '';
      this.svForm = {
        ...this.emptySvForm(),
        occupierName:   this.company?.companyName    ?? '',
        factoryAddress: this.company?.factoryAddress ?? '',
        location:       'Fitted on Air Receiver',
        dateOfExamination: this.toDateStr(new Date()),
      };
      this.generateSvCertificateNo();
      this.svDuration = '1year';
      this.calculateSvDueDate();
      this.showSafetyValveModal = true;
    }

    openEditSafetyValve(item: SafetyValve): void {
      this.safetyValveModalMode = 'update';
      this.selectedSafetyValve  = item;
      this.svForm               = { ...item };
      this.svDuration           = '';
      this.showSafetyValveModal = true;
    }

    closeSafetyValveModal(): void {
      this.showSafetyValveModal = false;
      this.selectedSafetyValve  = null;
    }

    generateSvCertificateNo(): void {
      if (!this.company) return;
      if (this.safetyValveModalMode === 'update') return;

      const companyCode = this.getCompanyCode();
      const now = this.svForm.dateOfExamination ? new Date(this.svForm.dateOfExamination) : new Date();
      const dateCode =
        `${String(now.getDate()).padStart(2, '0')}` +
        `${String(now.getMonth() + 1).padStart(2, '0')}` +
        `${String(now.getFullYear()).slice(-2)}`;

      let maxSerial = 0;
      this.safetyValveReports.forEach(r => {
        if (!r.certificateNo) return;
        const parts = r.certificateNo.split('/');
        const num = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(num) && num > maxSerial) maxSerial = num;
      });

      const serial = String(maxSerial + 1).padStart(3, '0');
      this.svForm.certificateNo = `${this.companyId}/${companyCode}/${dateCode}/SV/${serial}`;
    }

    setSvDuration(duration: '6months' | '1year' | '2years'): void {
      this.svDuration = duration;
      this.calculateSvDueDate();
    }

    private calculateSvDueDate(): void {
      if (!this.svForm.dateOfExamination) return;
      const base = this.parseLocalDate(this.svForm.dateOfExamination);
      if (isNaN(base.getTime())) return;
      const due = new Date(base);
      switch (this.svDuration) {
        case '6months': due.setMonth(due.getMonth() + 6);       break;
        case '1year':   due.setFullYear(due.getFullYear() + 1); break;
        case '2years':  due.setFullYear(due.getFullYear() + 2); break;
      }
      due.setDate(due.getDate() - 1);
      this.svForm.nextDueDate = this.toDateStr(due);
    }

  saveSafetyValve(): void {
    if (this.safetyValveModalMode === 'add') {
      this.api.createSafetyValve(this.svForm as any).subscribe({
        next: () => {
          this.reloadSafetyValve(() => {
            this.showToast('Safety valve record added successfully!');

            // Capture fields to carry forward
            const prev = {
              occupierName:        this.svForm.occupierName,
              factoryAddress:      this.svForm.factoryAddress,
              equipmentName:       this.svForm.equipmentName,
              valveType:           this.svForm.valveType,
              size:                this.svForm.size,
              idNumber:            this.svForm.idNumber,
              location:            this.svForm.location,
              manufacturerName:    this.svForm.manufacturerName,
              manufacturingYear:   this.svForm.manufacturingYear,
              manufacturerAddress: this.svForm.manufacturerAddress,
              natureOfProcess:     this.svForm.natureOfProcess,
              dateOfExamination:   this.svForm.dateOfExamination,
              examinationTestsMade: this.svForm.examinationTestsMade,
              recommendation:      this.svForm.recommendation,
              pressureSetting:     this.svForm.pressureSetting,
              safeWorkingPressure: this.svForm.safeWorkingPressure,
              modelNo:            this.svForm.modelNo,
              lastHydraulicPressureApplied: this.svForm.lastHydraulicPressureApplied,
            };
            const prevDuration = this.svDuration;

            // Reset only unique fields, keep everything else
            this.svForm = {
              companyId:           this.companyId,
              certificateNo:       '',          // will be regenerated
              nextDueDate:         '',          // will be recalculated ✅
              serialNo:            '',          // unique per record, clear it
              ...prev,                          // carry forward all other fields
            };

            // Regenerate certificate number with updated list
            this.generateSvCertificateNo();

            // Restore duration & recalculate due date
            if (prevDuration) {
              this.svDuration = prevDuration;
              this.calculateSvDueDate();
            }

            this.cdr.detectChanges();
          });
        },
        error: err => {
          console.error('SV Create Error:', err);
          this.showToast('Failed to add safety valve record.', 'error');
        }
      });
    } else {
      // Update branch unchanged
      if (!this.selectedSafetyValve?.id) return;
      this.api.updateSafetyValve(this.selectedSafetyValve.id, this.svForm as any).subscribe({
        next: () => {
          this.reloadSafetyValve(() => {
            this.closeSafetyValveModal();
            this.showToast('Safety valve record updated successfully!');
          });
        },
        error: err => {
          console.error('SV Update Error:', err);
          this.showToast('Failed to update safety valve record.', 'error');
        }
      });
    }
  }
    reloadSafetyValve(onDone?: () => void): void {
      this.api.getAllSafetyValvesByCompany(this.companyId).subscribe({
        next: (res: any) => {
          this.safetyValveReports = res?.data ?? [];
          this.cdr.detectChanges();
          onDone?.();
        },
        error: err => console.error('SV Reload Error:', err)
      });
    }
    
get sortedSafetyValveReports(): SafetyValve[] {
  const reports = [...this.safetyValveReports];
  switch (this.svSortBy) {
    case 'serial':
      return reports.sort((a, b) =>
        this.compareCertificateNumbers(a.certificateNo, b.certificateNo)
      );
    case 'valve':
      return reports.sort((a, b) =>
        (a.valveType || '').localeCompare(b.valveType || ''));
    case 'date':
      return reports.sort((a, b) =>
        (a.dateOfExamination || '').localeCompare(b.dateOfExamination || ''));
    default:
      return reports;
  }
}
 
    get valveGroups(): { name: string; count: number }[] {
      const map = new Map<string, number>();
      this.safetyValveReports.forEach(r => {
        const name = r.valveType || 'Unknown';
        map.set(name, (map.get(name) || 0) + 1);
      });
      return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }

  calculatePressureSetting() {
    const input = this.svForm.safeWorkingPressure?.trim();

    if (input) {
      // Extract numeric value and optional unit
      const match = input.match(/^([\d.]+)\s*(.*)$/);

      if (match) {
        const value = parseFloat(match[1]);
        const unit = match[2] || "";

        const calculated = (value * 1.1).toFixed(2);

        this.svForm.pressureSetting = unit
          ? `${calculated} ${unit}`
          : calculated;

        this.svForm.recommendation =
          `The Safety Relief Valve has been tested, calibrated and found satisfactory. Safe for operation at a set pressure of ${this.svForm.pressureSetting}.`;
      } else {
        this.svForm.pressureSetting = "";
        this.svForm.recommendation = "";
      }
    } else {
      this.svForm.pressureSetting = "";
      this.svForm.recommendation = "";
    }
  }
  equipmentNameList = [
    'Safety Release Valve',
    'Safety Relief Valve',
    'Pressure Relief Valve',
    'Steam Safety Valve',
    'Air Receiver Safety Valve',
    'Pressure Vacuum Valve',
    'Pressure Release Valve', 
    'Thermal Safety Valve', 
    'Air Release Valve',
    'SRV','PRV','TSV'
  ];



  /* =========================================================
    RENEW — Update only the date segment of certificateNo
    Format: {companyId}/{companyCode}/{DDMMYY}/{TYPE}/{serial}
  ========================================================= */
  private updateCertNoDate(certificateNo: string | undefined | null, newDateStr: string): string {
    if (!certificateNo) return certificateNo || '';
    const parts = certificateNo.split('/');
    if (parts.length !== 5) return certificateNo; // unexpected format, leave untouched

    const d = this.parseLocalDate(newDateStr);
    if (isNaN(d.getTime())) return certificateNo;

    const dateCode =
      `${String(d.getDate()).padStart(2, '0')}` +
      `${String(d.getMonth() + 1).padStart(2, '0')}` +
      `${String(d.getFullYear()).slice(-2)}`;

    parts[2] = dateCode; // only the date segment changes
    return parts.join('/');
  }

private compareCertificateNumbers(certA: string | undefined, certB: string | undefined): number {
  if (!certA && !certB) return 0;
  if (!certA) return 1;   // undefined goes to end
  if (!certB) return -1;
 
  const partsA = certA.split('/');
  const partsB = certB.split('/');
 
  // Compare each segment in order
  const maxLen = Math.max(partsA.length, partsB.length);
 
  for (let i = 0; i < maxLen; i++) {
    const pA = partsA[i] ?? '';
    const pB = partsB[i] ?? '';
 
    // If both segments are fully numeric, compare as numbers
    if (/^\d+$/.test(pA) && /^\d+$/.test(pB)) {
      const numA = parseInt(pA, 10);
      const numB = parseInt(pB, 10);
      if (numA !== numB) return numA - numB;
    }
    // Otherwise compare as strings (case-sensitive, alphabetic)
    else {
      const cmp = pA.localeCompare(pB);
      if (cmp !== 0) return cmp;
    }
  }
  return 0;
}
 



    }