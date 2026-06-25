import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface InspectionRecord {
  id: number;
  company: string;
  equipmentType: string;
  date: Date;
  status: 'Completed' | 'Pending' | 'Overdue';
  certificateNumber?: string;
}
 
interface CompanyDueInfo {
  name: string;
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
 
  // ─── TIME SELECTORS ────────────────────────────────
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  
  availableYears: number[] = [];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
 
  // ─── DATA ──────────────────────────────────────────
  inspectionData: InspectionRecord[] = [];
  companiesDueData: CompanyDueInfo[] = [];
 
  // ─── COMPUTED ──────────────────────────────────────
  get isCustomPeriod(): boolean {
    return this.selectedYear !== this.currentYear || 
           this.selectedMonth !== this.currentMonth;
  }
 
  get periodLabel(): string {
    return `${this.months[this.selectedMonth]} ${this.selectedYear}`;
  }
 
  constructor(private cdr: ChangeDetectorRef) {}
 
  ngOnInit(): void {
    this.initializeData();
    this.generateYears();
  }
 
  // ─────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────
 
  private initializeData(): void {
    // Sample inspection data across multiple months/years
    this.inspectionData = [
      // Current month (June 2026)
      {
        id: 1,
        company: 'IOCL Lalkuan',
        equipmentType: 'Safety Valve',
        date: new Date(2026, 5, 15),
        status: 'Completed',
        certificateNumber: 'ESS/IOL/260615/SV/001'
      },
      {
        id: 2,
        company: 'IOCL Bijnor',
        equipmentType: 'Lifting Equipment',
        date: new Date(2026, 5, 20),
        status: 'Completed',
        certificateNumber: 'ESS/IOB/260620/BPL/001'
      },
      {
        id: 3,
        company: 'HPCL Mathura',
        equipmentType: 'Pressure Vessel',
        date: new Date(2026, 5, 10),
        status: 'Pending'
      },
      {
        id: 4,
        company: 'BPCL Kochi',
        equipmentType: 'Power Press',
        date: new Date(2026, 5, 25),
        status: 'Pending'
      },
      // Previous month (May 2026)
      {
        id: 5,
        company: 'IOCL Lalkuan',
        equipmentType: 'Safety Belt',
        date: new Date(2026, 4, 18),
        status: 'Completed',
        certificateNumber: 'ESS/IOL/260518/BPSB/001'
      },
      {
        id: 6,
        company: 'IndianOil Vadodara',
        equipmentType: 'Lifting Equipment',
        date: new Date(2026, 4, 22),
        status: 'Completed'
      },
      // Next month (July 2026)
      {
        id: 7,
        company: 'HPCL Mathura',
        equipmentType: 'Safety Valve',
        date: new Date(2026, 6, 8),
        status: 'Overdue'
      },
      {
        id: 8,
        company: 'BPCL Kochi',
        equipmentType: 'Pressure Vessel',
        date: new Date(2026, 6, 12),
        status: 'Pending'
      },
      // Previous year sample data
      {
        id: 9,
        company: 'IOCL Lalkuan',
        equipmentType: 'Pressure Vessel',
        date: new Date(2025, 5, 10),
        status: 'Completed',
        certificateNumber: 'ESS/IOL/250610/BPPV/005'
      },
      {
        id: 10,
        company: 'HPCL Mathura',
        equipmentType: 'Lifting Equipment',
        date: new Date(2025, 5, 15),
        status: 'Completed'
      }
    ];
 
    // Sample companies with due renewals
    this.companiesDueData = [
      {
        name: 'IOCL Lalkuan Haldwani',
        city: 'Haldwani',
        state: 'Uttarakhand',
        count: 3,
        equipmentTypes: ['Safety Valve', 'Pressure Vessel'],
        dueDate: new Date(2026, 5, 30)
      },
      {
        name: 'IOCL Bijnor Terminal',
        city: 'Bijnor',
        state: 'Uttar Pradesh',
        count: 2,
        equipmentTypes: ['Lifting Equipment', 'Safety Belt'],
        dueDate: new Date(2026, 6, 15)
      },
      {
        name: 'HPCL Mathura Refinery',
        city: 'Mathura',
        state: 'Uttar Pradesh',
        count: 4,
        equipmentTypes: ['Power Press', 'Pressure Vessel', 'Safety Valve'],
        dueDate: new Date(2026, 6, 20)
      },
      {
        name: 'BPCL Kochi Terminal',
        city: 'Kochi',
        state: 'Kerala',
        count: 1,
        equipmentTypes: ['Lifting Equipment'],
        dueDate: new Date(2026, 7, 10)
      },
      {
        name: 'IndianOil Vadodara',
        city: 'Vadodara',
        state: 'Gujarat',
        count: 2,
        equipmentTypes: ['Safety Belt', 'Pressure Vessel'],
        dueDate: new Date(2026, 5, 25)
      }
    ];
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
      return recordDate.getFullYear() === this.selectedYear &&
             recordDate.getMonth() === this.selectedMonth;
    });
  }
 
  getInspectionCount(): number {
    return this.getFilteredData().length;
  }
 
  getCertificateCount(): number {
    return this.getFilteredData().filter(r => r.status === 'Completed').length;
  }
 
  getPendingCount(): number {
    return this.getFilteredData().filter(r => r.status === 'Pending').length;
  }
 
  getCompaniesDueInPeriod(): CompanyDueInfo[] {
    return this.companiesDueData.filter(company => {
      const dueDate = new Date(company.dueDate);
      return dueDate.getFullYear() === this.selectedYear &&
             dueDate.getMonth() === this.selectedMonth;
    });
  }
 
  // ─────────────────────────────────────────────────────
  // DATA FILTERING — CURRENT PERIOD
  // ─────────────────────────────────────────────────────
 
  getCurrentData(): InspectionRecord[] {
    return this.inspectionData.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getFullYear() === this.currentYear &&
             recordDate.getMonth() === this.currentMonth;
    });
  }
 
  getCurrentInspectionCount(): number {
    return this.getCurrentData().length;
  }
 
  getCurrentCertificateCount(): number {
    return this.getCurrentData().filter(r => r.status === 'Completed').length;
  }
 
  getCurrentPendingCount(): number {
    return this.getCurrentData().filter(r => r.status === 'Pending').length;
  }
 
  getCurrentCompaniesDue(): CompanyDueInfo[] {
    return this.companiesDueData.filter(company => {
      const dueDate = new Date(company.dueDate);
      return dueDate.getFullYear() === this.currentYear &&
             dueDate.getMonth() === this.currentMonth;
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
}