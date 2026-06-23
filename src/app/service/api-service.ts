import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RestApiResponse, AdminLogInRequest, CompanyProfile,
  LiftingEquipmentInspectionRecord, PressureVesselCertificate,
  PowerPress
} from "../model/models.model";

@Injectable({ providedIn: 'root' })
export class ApiService {

  private base       = 'https://ess-backend-10.onrender.com/api/admin';
  private publicBase = 'https://ess-backend-10.onrender.com/api/public';

//  private base       = 'http://54.252.191.186:8080/api/admin';
//  private publicBase = 'http://54.252.191.186:8080/api/public';

//  http://54.252.191.186:8080/
  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('ess_token') || '';
    return new HttpHeaders({
      TOKEN: token,
      'Content-Type': 'application/json'
    });
  }

  // ── AUTH ──────────────────────────────────────────────────────────────────
  login(req: AdminLogInRequest): Observable<RestApiResponse> {
    return this.http.post<RestApiResponse>(`${this.base}/login`, req);
  }
  logout(): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/logout`, { headers: this.headers() });
  }

  // ── PUBLIC VERIFY (no token) ──────────────────────────────────────────────
  getCompanyByIdPublic(id: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.publicBase}/company/${id}`);
  }
  getLiftingPublic(companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.publicBase}/lifting/${companyId}`);
  }
  getPressurePublic(companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.publicBase}/pressure-vessel/${companyId}`);
  }
  getPowerPressPublic(companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.publicBase}/power-press/${companyId}`);
  }
  getSafetyBeltsPublic(companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.publicBase}/safety-belt/${companyId}`);
  }

  // ── COMPANY ───────────────────────────────────────────────────────────────
  createCompany(c: CompanyProfile): Observable<RestApiResponse> {
    return this.http.post<RestApiResponse>(`${this.base}/company`, c, { headers: this.headers() });
  }
  updateCompany(id: number, c: CompanyProfile): Observable<RestApiResponse> {
    return this.http.put<RestApiResponse>(`${this.base}/company/${id}`, c, { headers: this.headers() });
  }
  getCompanyById(id: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/company/${id}`, { headers: this.headers() });
  }
  getAllCompanies(): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/company`, { headers: this.headers() });
  }
  deleteCompany(id: number): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(`${this.base}/company/${id}`, { headers: this.headers() });
  }

  // ── LIFTING EQUIPMENT ─────────────────────────────────────────────────────
  createLiftingRecord(r: LiftingEquipmentInspectionRecord): Observable<RestApiResponse> {
    return this.http.post<RestApiResponse>(`${this.base}/lifting-equipment`, r, { headers: this.headers() });
  }
  updateLiftingRecord(id: number, r: LiftingEquipmentInspectionRecord): Observable<RestApiResponse> {
    return this.http.put<RestApiResponse>(`${this.base}/lifting-equipment/${id}`, r, { headers: this.headers() });
  }
  getLiftingRecordById(id: number, companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/lifting-equipment/${id}?companyId=${companyId}`, { headers: this.headers() });
  }
  getAllLiftingByCompany(companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/lifting-equipment/company/${companyId}`, { headers: this.headers() });
  }
  deleteLiftingRecord(id: number, companyId: number): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(`${this.base}/lifting-equipment/${id}?companyId=${companyId}`, { headers: this.headers() });
  }
  filterLiftingByOccupier(companyId: number, name: string): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/lifting-equipment/filter/occupier?companyId=${companyId}&name=${name}`, { headers: this.headers() });
  }
  filterLiftingByMarks(companyId: number, marks: string): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/lifting-equipment/filter/marks?companyId=${companyId}&marks=${marks}`, { headers: this.headers() });
  }
  filterLiftingByYear(companyId: number, year: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/lifting-equipment/filter/year?companyId=${companyId}&year=${year}`, { headers: this.headers() });
  }

  // ── PRESSURE VESSEL ───────────────────────────────────────────────────────
  createPressureCertificate(c: PressureVesselCertificate): Observable<RestApiResponse> {
    return this.http.post<RestApiResponse>(`${this.base}/pressure-vessel`, c, { headers: this.headers() });
  }
  updatePressureCertificate(id: number, c: PressureVesselCertificate): Observable<RestApiResponse> {
    return this.http.put<RestApiResponse>(`${this.base}/pressure-vessel/${id}`, c, { headers: this.headers() });
  }
  getPressureCertificateById(id: number, companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/pressure-vessel/${id}?companyId=${companyId}`, { headers: this.headers() });
  }
  getAllPressureByCompany(companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/pressure-vessel/company/${companyId}`, { headers: this.headers() });
  }
  deletePressureCertificate(id: number, companyId: number): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(`${this.base}/pressure-vessel/${id}?companyId=${companyId}`, { headers: this.headers() });
  }

  // ── POWER PRESS ───────────────────────────────────────────────────────────
  createPowerPress(r: PowerPress): Observable<RestApiResponse> {
    return this.http.post<RestApiResponse>(`${this.base}/power-press`, r, { headers: this.headers() });
  }
  updatePowerPress(id: number, r: PowerPress): Observable<RestApiResponse> {
    return this.http.put<RestApiResponse>(`${this.base}/power-press/${id}`, r, { headers: this.headers() });
  }
  getPowerPressById(id: number, companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/power-press/${id}?companyId=${companyId}`, { headers: this.headers() });
  }
  getAllPowerPressByCompany(companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/power-press/company/${companyId}`, { headers: this.headers() });
  }
  deletePowerPress(id: number, companyId: number): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(`${this.base}/power-press/${id}?companyId=${companyId}`, { headers: this.headers() });
  }
  filterPowerPressByOccupier(companyId: number, name: string): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/power-press/filter/occupier?companyId=${companyId}&name=${name}`, { headers: this.headers() });
  }
  filterPowerPressByMachine(companyId: number, type: string): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/power-press/filter/machine?companyId=${companyId}&type=${type}`, { headers: this.headers() });
  }
  filterPowerPressByYear(companyId: number, year: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/power-press/filter/year?companyId=${companyId}&year=${year}`, { headers: this.headers() });
  }

  // ── SAFETY BELT ───────────────────────────────────────────────────────────
  createSafetyBelt(data: any): Observable<RestApiResponse> {
    return this.http.post<RestApiResponse>(`${this.base}/safety-belt`, data, { headers: this.headers() });
  }
  updateSafetyBelt(id: number, data: any): Observable<RestApiResponse> {
    return this.http.put<RestApiResponse>(`${this.base}/safety-belt/${id}`, data, { headers: this.headers() });
  }
  getSafetyBeltById(id: number, companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/safety-belt/${id}?companyId=${companyId}`, { headers: this.headers() });
  }
  getAllSafetyBelts(companyId: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/safety-belt/company/${companyId}`, { headers: this.headers() });
  }
  deleteSafetyBelt(id: number, companyId: number): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(`${this.base}/safety-belt/${id}?companyId=${companyId}`, { headers: this.headers() });
  }
  filterSafetyBeltByOccupier(companyId: number, name: string): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/safety-belt/filter/occupier?companyId=${companyId}&name=${name}`, { headers: this.headers() });
  }
  filterSafetyBeltBySerial(companyId: number, serial: string): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/safety-belt/filter/serial?companyId=${companyId}&serial=${serial}`, { headers: this.headers() });
  }
  filterSafetyBeltByYear(companyId: number, year: number): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/safety-belt/filter/year?companyId=${companyId}&year=${year}`, { headers: this.headers() });
  }



// ── SAFETY VALVE ─────────────────────────────────────────────────────────
createSafetyValve(data: any): Observable<RestApiResponse> {
  return this.http.post<RestApiResponse>(`${this.base}/safety-valve`, data, { headers: this.headers() });
}
updateSafetyValve(id: number, data: any): Observable<RestApiResponse> {
  return this.http.put<RestApiResponse>(`${this.base}/safety-valve/${id}`, data, { headers: this.headers() });
}
getSafetyValveById(id: number): Observable<RestApiResponse> {
  return this.http.get<RestApiResponse>(`${this.base}/safety-valve/${id}`, { headers: this.headers() });
}
getAllSafetyValvesByCompany(companyId: number): Observable<RestApiResponse> {
  return this.http.get<RestApiResponse>(`${this.base}/safety-valve/company/${companyId}`, { headers: this.headers() });
}
deleteSafetyValve(id: number): Observable<RestApiResponse> {
  return this.http.delete<RestApiResponse>(`${this.base}/safety-valve/${id}`, { headers: this.headers() });
}


}