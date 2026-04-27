// src/app/shared/models/models.ts

export interface Admin {
  id?: number;
  adminName: string;
  password?: string;
  email: string;
  phone: string;
  role: string;
  permissions: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyProfile {
  id?: number;
  companyName: string;
  factoryAddress: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  gstNumber: string;
  factoryLicenseNo: string;
  state: string;
  city: string;
  pincode: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LiftingEquipmentInspectionRecord {
  
  id?: number;

  companyId: number;

  certificateNo?: string;
  dateOfExamination?: string;

  // 1
  nameOfOccupier?: string;

  // 2
  addressOfFactory?: string;

  // 3
  distinguishingMarksDescription?: string;
  srNo?: string;
  modelNumber?: string;
  equipmentName?: string;
  idNumber?: string;
  capacity?: string;
  manufacturerName?: string;
  manufacturerYear?: string;
  capcity?: string; // remove if typo fixed in backend
  safeWorkingLoad?: string;
  location?: string;

  // 4
  yearFirstTakenIntoUse?: string;

  // 5
  previousCertificateDetails?: string;

  // 6
  periodicalExaminationDetails?: string;
  hydraulicSystemStatus?: string;
  frameAndForkCondition?: string;
  overallResult?: string;

  // 7
  annealingOrHeatTreatmentDetails?: string;

  // 8
  defectsParticulars?: string;

  // 9
  safeWorkingLoadAssessed?: string;

  // 10
  remarks?: string;

  // Footer
  certifiedDate?: string;
  inspectorName?: string;
  nextDueDate?: string;
}

/* =========================================================
   PRESSURE VESSEL CERTIFICATE — full model matching API
========================================================= */
export interface PressureVesselCertificate {
  id?: number;

  /* =========================================================
     COMMON FIELDS
  ========================================================= */
  companyId: number;

  /* =========================================================
     HEADER DETAILS
  ========================================================= */
  certificateNo: string;
  formNo: string;
  ruleNumber: string;

  /* =========================================================
     1. Name of Occupier (or Factory)
  ========================================================= */
  nameOfOccupier: string;

  /* =========================================================
     2. Situation & Address of the Factory
  ========================================================= */
  addressOfFactory: string;

  /* =========================================================
     3. Name, Description and Distinctive Number
        of Pressure Vessel
  ========================================================= */
  vesselDescription: string;
  vesselCapacity: string;
  vesselIdNo: string;
  vesselLocation: string;

  /* =========================================================
     4. Name and Address of Manufacturer
  ========================================================= */
  manufacturerName: string;

  /* =========================================================
     5. Nature of Process
  ========================================================= */
  natureOfProcess: string;

  /* =========================================================
     6. Particulars of Pressure Vessel or Plant
  ========================================================= */
  dateOfConstruction: string;
  thicknessOfWalls: string;
  dateFirstTakenIntoUse: string;
  maxPermissibleWorkingPressureByManufacturer: string;
  designPressure: string;
  previousHistoryAndLastReportSeen: string;

  /* =========================================================
     7. Hydrostatic Test Details
  ========================================================= */
  dateOfLastHydrostaticTest: string;
  pressureAppliedLastHydrostatic: string;

  /* =========================================================
     8. Exposed to Weather
  ========================================================= */
  exposedToWeather: string;

  /* =========================================================
     9. Parts Inaccessible
  ========================================================= */
  partsInaccessible: string;

  /* =========================================================
     10. Examination and Tests Made
  ========================================================= */
  examinationAndTestsMade: string;

  /* =========================================================
     11. Condition of Pressure Vessel
  ========================================================= */
  conditionExternal: string;
  conditionInternal: string;

  /* =========================================================
     12. Fittings Provided
  ========================================================= */
  fittingsProvided: string;

  /* =========================================================
     13. Fittings Maintained and Checked
  ========================================================= */
  fittingsMaintainedAndChecked: string;

  /* =========================================================
     14. Repairs Required
  ========================================================= */
  repairsRequired: string;

  /* =========================================================
     15. Maximum Permissible Working Pressure Calculated
  ========================================================= */
  maxPermissibleWorkingPressureCalculated: string;

  /* =========================================================
     16. Repairs Affecting Working Pressure
  ========================================================= */
  beforeExpirationPeriod: string;
  afterExpirationIfNotCompleted: string;
  afterCompletionOfRepairs: string;

  /* =========================================================
     17. Other Observations
  ========================================================= */
  otherObservations: string;

  /* =========================================================
     CERTIFICATION DETAILS
  ========================================================= */
  dateOfExamination: string;
  nextDueDateForExamination: string;
  competentPersonName: string;

  /* =========================================================
     SYSTEM FIELDS
  ========================================================= */
  createdAt?: string;
  updatedAt?: string;
}


export interface RestApiResponse {
  code: string;
  status: string;
  message: string;
  data?: {
    authentication?: {
      token: string;
      adminName: string;
    };
    profile?: {
      adminName: string;
      email: string;
      phone: string;
      role: string;
    };
  };
}

export interface AdminLogInRequest {
  email: string;
  password: string;
}

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