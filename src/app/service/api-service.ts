// src/app/shared/services/api.service.ts
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
  private base = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

 private headers(): HttpHeaders {
  const token = localStorage.getItem('ess_token') || '';

  console.log('Sending Token:', token);

  return new HttpHeaders({
    TOKEN: token,
    'Content-Type': 'application/json'
  });
}

  // Auth
  login(req: AdminLogInRequest): Observable<RestApiResponse> {
    return this.http.post<RestApiResponse>(`${this.base}/login`, req);
  }
  logout(): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/logout`, { headers: this.headers() });
  }

  // Company
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

  // Lifting Equipment
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

  // Pressure Vessel
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

  // ══════════════════════════════════════════════════════════
// ADD THESE METHODS TO: src/app/shared/service/api-service.ts
// (import PowerPress from models.model first)
// ══════════════════════════════════════════════════════════

  // Power Press
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
}