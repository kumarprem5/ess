import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiService } from '../../service/api-service';
import { CompanyProfile } from '../../model/models.model';


interface InspectionRecord {
  id: number;
  company: string;
  division: string;
   companyId: number; 
  equipmentType: string;
  date: Date;
  status: 'Completed' | 'Pending' | 'Overdue';
  certificateNumber?: string;
}




interface DueGroup {
  companyId: number;
  companies: CompanyDueInfo[]; // usually just 1, but keeps shape consistent
  hasOverdue: boolean;


}

interface EquipmentTypeCount {
  type: string;
  count: number;
}


// interface InspectionGroup {
//   companyId: number;
//   companyName: string;
//   records: InspectionRecord[];
//   completedCount: number;
//   pendingOverdueCount: number;
//   hasOverdue: boolean;
// }

interface InspectionGroup {
  companyId: number;
  companyName: string;
  division: string;
  records: InspectionRecord[];
  completedCount: number;
  pendingOverdueCount: number;
  hasOverdue: boolean;
  equipmentCounts: EquipmentTypeCount[];   // ← added
}


// interface InspectionGroup {
//   companyId: number;
//   companyName: string;
//   records: InspectionRecord[];
//   completedCount: number;
//   pendingOverdueCount: number;
//   hasOverdue: boolean;
// }

interface CompanyDueInfo {
  name: string;
  companyId: number;
  city: string;
  state: string;
  count: number;
  equipmentTypes: string[];
  dueDate: Date;
}

@Component({
  selector: 'app-overview-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './overview-dashboard.html',
  styleUrl: './overview-dashboard.css',
})
export class OverviewDashboard implements OnInit {
  // ─── TIME SELECTORS ────────────────────────────────────
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();


expandedInspectionGroups: Set<number> = new Set();
expandedDueGroups: Set<number> = new Set();

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();

  availableYears: number[] = [];
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // ─── DATA ──────────────────────────────────────────
  inspectionData: InspectionRecord[] = [];
  companiesDueData: CompanyDueInfo[] = [];
  loading: boolean = true;

  // ─── COMPUTED ──────────────────────────────────────
  get isCustomPeriod(): boolean {
    return (
      this.selectedYear !== this.currentYear ||
      this.selectedMonth !== this.currentMonth
    );
  }

  get periodLabel(): string {
    return `${this.months[this.selectedMonth]} ${this.selectedYear}`;
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.generateYears();
    this.loadDynamicData();
  }

  // ─────────────────────────────────────────────────────
  // DATA LOADING FROM API
  // ─────────────────────────────────────────────────────

  private loadDynamicData(): void {
    this.loading = true;

    // Step 1: Get all companies
    this.apiService.getAllCompanies().pipe(
      catchError(err => {
        console.error('Error loading companies:', err);
        this.loading = false;
        return of({ status: false, data: [] });
      })
    ).subscribe(response => {
      if (response.status && response.data && Array.isArray(response.data)) {
        const companies = response.data; // ← TypeScript now knows this is CompanyProfile[]
        this.loadEquipmentForAllCompanies(companies);
      } else {
        this.loading = false;
      }
    });
  }

  private loadEquipmentForAllCompanies(companies: CompanyProfile[]): void {
    const equipmentRequests: any[] = [];

    // For each company, fetch all equipment types
    companies.forEach(company => {
      equipmentRequests.push(
        this.apiService
          .getAllLiftingByCompany(company.id!)
          .pipe(catchError(() => of({ status: false, data: [] }))),
        this.apiService
          .getAllPressureByCompany(company.id!)
          .pipe(catchError(() => of({ status: false, data: [] }))),
        this.apiService
          .getAllPowerPressByCompany(company.id!)
          .pipe(catchError(() => of({ status: false, data: [] }))),
        this.apiService
          .getAllSafetyBelts(company.id!)
          .pipe(catchError(() => of({ status: false, data: [] }))),
        this.apiService
          .getAllSafetyValvesByCompany(company.id!)
          .pipe(catchError(() => of({ status: false, data: [] })))
      );
    });

    forkJoin(equipmentRequests).subscribe({
      next: results => {
        this.processEquipmentData(companies, results);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('Error loading equipment data:', err);
        this.loading = false;
      },
    });
  }

  private processEquipmentData(companies: CompanyProfile[], results: any[]): void {
    const inspections: InspectionRecord[] = [];
    const dueCompanies: Map<number, CompanyDueInfo> = new Map();

    let resultIndex = 0;

    // Process results for each company
    companies.forEach(company => {
      const companyDueMap = new Map<string, string>();
      let earliestDueDate: Date | null = null;

      // Process each equipment type for this company
      const equipmentTypes = [
        'Lifting',
        'Pressure Vessel',
        'Power Press',
        'Safety Belt',
        'Safety Valve',
      ];

      equipmentTypes.forEach(type => {
        const result = results[resultIndex++];
        if (result?.status && result?.data && Array.isArray(result.data)) {
          result.data.forEach((equipment: any) => {
            // Create inspection record from examination date
            if (equipment.dateOfExamination || equipment.examinationDate) {
              const examDate = new Date(
                equipment.dateOfExamination || equipment.examinationDate
              );
              inspections.push({
                id: equipment.id,
                companyId: company.id!,     
                company: company.companyName,
                division:company.factoryLicenseNo,
                equipmentType: type,
                date: examDate,
                status: this.determineStatus(equipment),
                certificateNumber:
                  equipment.certificateNo || equipment.certificateNumber,
              });
            }

            // Track due dates for companies
            if (equipment.nextDueDate) {
              const dueDate = new Date(equipment.nextDueDate);
              if (!companyDueMap.has(type)) {
                companyDueMap.set(type, type);
              }
              // Keep the earliest due date
              if (!earliestDueDate || dueDate < earliestDueDate) {
                earliestDueDate = dueDate;
              }
            }
          });
        }
      });

      // Add company to due list if it has renewals
      if (companyDueMap.size > 0 && earliestDueDate) {
        dueCompanies.set(company.id!, {
          name: company.companyName,
          companyId: company.id!, 
          city: company.city || 'N/A',
          state: company.state || 'N/A',
          count: companyDueMap.size,
          equipmentTypes: Array.from(companyDueMap.values()),
          dueDate: earliestDueDate,
        });
      }
    });

    this.inspectionData = inspections;
    this.companiesDueData = Array.from(dueCompanies.values());
  }

  private determineStatus(
    equipment: any
  ): 'Completed' | 'Pending' | 'Overdue' {
    const today = new Date();

    // If nextDueDate exists
    if (equipment.nextDueDate) {
      const dueDate = new Date(equipment.nextDueDate);
      if (dueDate < today) {
        return 'Overdue';
      } else if (
        equipment.dateOfExamination ||
        equipment.examinationDate
      ) {
        return 'Completed';
      }
    }

    // If only examination date exists (no next due set yet)
    if (
      (equipment.dateOfExamination || equipment.examinationDate) &&
      !equipment.nextDueDate
    ) {
      return 'Completed';
    }

    return 'Pending';
  }

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    // Generate years: 3 years back to 3 years forward
    for (let i = currentYear - 3; i <= currentYear + 3; i++) {
      this.availableYears.push(i);
    }
  }

  // ─────────────────────────────────────────────────────
  // EVENT HANDLERS
  // ─────────────────────────────────────────────────────

  selectMonth(monthIndex: number): void {
    this.selectedMonth = monthIndex;
    this.cdr.markForCheck();
  }

  onYearChange(): void {
    this.cdr.markForCheck();
  }

  // ─────────────────────────────────────────────────────
  // DATA FILTERING — SELECTED PERIOD
  // ─────────────────────────────────────────────────────

  getFilteredData(): InspectionRecord[] {
    return this.inspectionData.filter(record => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getFullYear() === this.selectedYear &&
        recordDate.getMonth() === this.selectedMonth
      );
    });
  }

  getInspectionCount(): number {
    return this.getFilteredData().length;
  }

  getCertificateCount(): number {
    return this.getFilteredData().filter(r => r.status === 'Completed').length;
  }

  getPendingCount(): number {
    return this.getFilteredData().filter(
      r => r.status === 'Pending' || r.status === 'Overdue'
    ).length;
  }

  getCompaniesDueInPeriod(): CompanyDueInfo[] {
    return this.companiesDueData.filter(company => {
      const dueDate = new Date(company.dueDate);
      return (
        dueDate.getFullYear() === this.selectedYear &&
        dueDate.getMonth() === this.selectedMonth
      );
    });
  }

  // ─────────────────────────────────────────────────────
  // DATA FILTERING — CURRENT PERIOD
  // ─────────────────────────────────────────────────────

  getCurrentData(): InspectionRecord[] {
    return this.inspectionData.filter(record => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getFullYear() === this.currentYear &&
        recordDate.getMonth() === this.currentMonth
      );
    });
  }

  getCurrentInspectionCount(): number {
    return this.getCurrentData().length;
  }

  getCurrentCertificateCount(): number {
    return this.getCurrentData().filter(r => r.status === 'Completed').length;
  }

  getCurrentPendingCount(): number {
    return this.getCurrentData().filter(
      r => r.status === 'Pending' || r.status === 'Overdue'
    ).length;
  }

  getCurrentCompaniesDue(): CompanyDueInfo[] {
    return this.companiesDueData.filter(company => {
      const dueDate = new Date(company.dueDate);
      return (
        dueDate.getFullYear() === this.currentYear &&
        dueDate.getMonth() === this.currentMonth
      );
    });
  }

  // ─────────────────────────────────────────────────────
  // UTILITY
  // ─────────────────────────────────────────────────────

  getCompanyCount(): number {
    // Unique companies in current selection
    const companies = new Set(this.getFilteredData().map(r => r.company));
    return companies.size;
  }


// ─────────────────────────────────────────────────────
// GROUPING — INSPECTION RECORDS BY COMPANY
// ─────────────────────────────────────────────────────

private groupInspections(records: InspectionRecord[]): InspectionGroup[] {
  const map = new Map<number, InspectionGroup>();

  records.forEach(record => {
    if (!map.has(record.companyId)) {
       map.set(record.companyId, {
        companyId: record.companyId,
        division:   record.division,
        companyName: record.company,
        records: [],
        completedCount: 0,
        pendingOverdueCount: 0,
        hasOverdue: false,
        equipmentCounts: [],
      });
    }
    const group = map.get(record.companyId)!;
    group.records.push(record);
    if (record.status === 'Completed') {
      group.completedCount++;
    } else {
      group.pendingOverdueCount++;
    }
    if (record.status === 'Overdue') {
      group.hasOverdue = true;
    }
  });

  // Build equipment-type counts per company, then sort & finalize
  return Array.from(map.values())
    .map(group => {
      const typeTally = new Map<string, number>();
      group.records.forEach(r => {
        typeTally.set(r.equipmentType, (typeTally.get(r.equipmentType) || 0) + 1);
      });

      // Keep a consistent equipment order regardless of data order
      const typeOrder = ['Lifting', 'Pressure Vessel', 'Power Press', 'Safety Belt', 'Safety Valve'];
      const equipmentCounts: EquipmentTypeCount[] = typeOrder
        .filter(type => typeTally.has(type))
        .map(type => ({ type, count: typeTally.get(type)! }));

      return {
        ...group,
        records: group.records.sort((a, b) => b.date.getTime() - a.date.getTime()),
        equipmentCounts,
      };
    })
    .sort((a, b) => a.companyName.localeCompare(b.companyName));
}

getGroupedFilteredData(): InspectionGroup[] {
  return this.groupInspections(this.getFilteredData());
}

getGroupedCurrentData(): InspectionGroup[] {
  return this.groupInspections(this.getCurrentData());
}

toggleInspectionGroup(companyId: number): void {
  if (this.expandedInspectionGroups.has(companyId)) {
    this.expandedInspectionGroups.delete(companyId);
  } else {
    this.expandedInspectionGroups.add(companyId);
  }
}

isInspectionGroupExpanded(companyId: number): boolean {
  return this.expandedInspectionGroups.has(companyId);
}

// ─────────────────────────────────────────────────────
// GROUPING — RENEWALS DUE
// ─────────────────────────────────────────────────────

toggleDueGroup(companyId: number): void {
  if (this.expandedDueGroups.has(companyId)) {
    this.expandedDueGroups.delete(companyId);
  } else {
    this.expandedDueGroups.add(companyId);
  }
}

isDueGroupExpanded(companyId: number): boolean {
  return this.expandedDueGroups.has(companyId);
}

isOverdue(dueDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due <= today;
}


}