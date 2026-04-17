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

export interface PressureVesselCertificate {
  id?: number;
  companyId: number;
  vesselName: string;
  serialNumber: string;
  manufacturer: string;
  capacity: string;
  workingPressure: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  inspectorName: string;
  status: string;
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