import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RestApiResponse,
  CompanyResponse,
  LiftingEquipmentResponse,
  PressureVesselResponse,
  PowerPressResponse,
  SafetyBeltResponse,
  SafetyValveResponse,
  AdminLogInRequest,
  CompanyProfile,
  LiftingEquipmentInspectionRecord,
  PressureVesselCertificate,
  PowerPress,
  SafetyBeltInspection,
  SafetyValve,
} from '../model/models.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'https://ess-backend-10.onrender.com/api/admin';
  private publicBase = 'https://ess-backend-10.onrender.com/api/public';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    const token = localStorage.getItem('ess_token') || '';
    return new HttpHeaders({
      TOKEN: token,
      'Content-Type': 'application/json',
    });
  }

  // ── AUTH ──────────────────────────────────────────────────────────────────
  login(req: AdminLogInRequest): Observable<RestApiResponse> {
    return this.http.post<RestApiResponse>(`${this.base}/login`, req);
  }

  logout(): Observable<RestApiResponse> {
    return this.http.get<RestApiResponse>(`${this.base}/logout`, {
      headers: this.headers(),
    });
  }

  // ── PUBLIC VERIFY (no token) ──────────────────────────────────────────────
  getCompanyByIdPublic(id: number): Observable<RestApiResponse<CompanyProfile>> {
    return this.http.get<RestApiResponse<CompanyProfile>>(
      `${this.publicBase}/company/${id}`
    );
  }

  getLiftingPublic(companyId: number): Observable<LiftingEquipmentResponse> {
    return this.http.get<LiftingEquipmentResponse>(
      `${this.publicBase}/lifting/${companyId}`
    );
  }

  getPressurePublic(companyId: number): Observable<PressureVesselResponse> {
    return this.http.get<PressureVesselResponse>(
      `${this.publicBase}/pressure-vessel/${companyId}`
    );
  }

  getPowerPressPublic(companyId: number): Observable<PowerPressResponse> {
    return this.http.get<PowerPressResponse>(
      `${this.publicBase}/power-press/${companyId}`
    );
  }

  getSafetyBeltsPublic(companyId: number): Observable<SafetyBeltResponse> {
    return this.http.get<SafetyBeltResponse>(
      `${this.publicBase}/safety-belt/${companyId}`
    );
  }

  // ── COMPANY ───────────────────────────────────────────────────────────────
  createCompany(c: CompanyProfile): Observable<RestApiResponse<CompanyProfile>> {
    return this.http.post<RestApiResponse<CompanyProfile>>(
      `${this.base}/company`,
      c,
      { headers: this.headers() }
    );
  }

  updateCompany(
    id: number,
    c: CompanyProfile
  ): Observable<RestApiResponse<CompanyProfile>> {
    return this.http.put<RestApiResponse<CompanyProfile>>(
      `${this.base}/company/${id}`,
      c,
      { headers: this.headers() }
    );
  }

  getCompanyById(id: number): Observable<RestApiResponse<CompanyProfile>> {
    return this.http.get<RestApiResponse<CompanyProfile>>(
      `${this.base}/company/${id}`,
      { headers: this.headers() }
    );
  }

  getAllCompanies(): Observable<CompanyResponse> {
    return this.http.get<CompanyResponse>(`${this.base}/company`, {
      headers: this.headers(),
    });
  }

  deleteCompany(id: number): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(`${this.base}/company/${id}`, {
      headers: this.headers(),
    });
  }

  // ── LIFTING EQUIPMENT ─────────────────────────────────────────────────────
  createLiftingRecord(
    r: LiftingEquipmentInspectionRecord
  ): Observable<RestApiResponse<LiftingEquipmentInspectionRecord>> {
    return this.http.post<RestApiResponse<LiftingEquipmentInspectionRecord>>(
      `${this.base}/lifting-equipment`,
      r,
      { headers: this.headers() }
    );
  }

  updateLiftingRecord(
    id: number,
    r: LiftingEquipmentInspectionRecord
  ): Observable<RestApiResponse<LiftingEquipmentInspectionRecord>> {
    return this.http.put<RestApiResponse<LiftingEquipmentInspectionRecord>>(
      `${this.base}/lifting-equipment/${id}`,
      r,
      { headers: this.headers() }
    );
  }

  getLiftingRecordById(
    id: number,
    companyId: number
  ): Observable<RestApiResponse<LiftingEquipmentInspectionRecord>> {
    return this.http.get<RestApiResponse<LiftingEquipmentInspectionRecord>>(
      `${this.base}/lifting-equipment/${id}?companyId=${companyId}`,
      { headers: this.headers() }
    );
  }

  getAllLiftingByCompany(companyId: number): Observable<LiftingEquipmentResponse> {
    return this.http.get<LiftingEquipmentResponse>(
      `${this.base}/lifting-equipment/company/${companyId}`,
      { headers: this.headers() }
    );
  }

  deleteLiftingRecord(
    id: number,
    companyId: number
  ): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(
      `${this.base}/lifting-equipment/${id}?companyId=${companyId}`,
      { headers: this.headers() }
    );
  }

  filterLiftingByOccupier(
    companyId: number,
    name: string
  ): Observable<LiftingEquipmentResponse> {
    return this.http.get<LiftingEquipmentResponse>(
      `${this.base}/lifting-equipment/filter/occupier?companyId=${companyId}&name=${name}`,
      { headers: this.headers() }
    );
  }

  filterLiftingByMarks(
    companyId: number,
    marks: string
  ): Observable<LiftingEquipmentResponse> {
    return this.http.get<LiftingEquipmentResponse>(
      `${this.base}/lifting-equipment/filter/marks?companyId=${companyId}&marks=${marks}`,
      { headers: this.headers() }
    );
  }

  filterLiftingByYear(
    companyId: number,
    year: number
  ): Observable<LiftingEquipmentResponse> {
    return this.http.get<LiftingEquipmentResponse>(
      `${this.base}/lifting-equipment/filter/year?companyId=${companyId}&year=${year}`,
      { headers: this.headers() }
    );
  }

  // ── PRESSURE VESSEL ───────────────────────────────────────────────────────
  createPressureCertificate(
    c: PressureVesselCertificate
  ): Observable<RestApiResponse<PressureVesselCertificate>> {
    return this.http.post<RestApiResponse<PressureVesselCertificate>>(
      `${this.base}/pressure-vessel`,
      c,
      { headers: this.headers() }
    );
  }

  updatePressureCertificate(
    id: number,
    c: PressureVesselCertificate
  ): Observable<RestApiResponse<PressureVesselCertificate>> {
    return this.http.put<RestApiResponse<PressureVesselCertificate>>(
      `${this.base}/pressure-vessel/${id}`,
      c,
      { headers: this.headers() }
    );
  }

  getPressureCertificateById(
    id: number,
    companyId: number
  ): Observable<RestApiResponse<PressureVesselCertificate>> {
    return this.http.get<RestApiResponse<PressureVesselCertificate>>(
      `${this.base}/pressure-vessel/${id}?companyId=${companyId}`,
      { headers: this.headers() }
    );
  }

  getAllPressureByCompany(companyId: number): Observable<PressureVesselResponse> {
    return this.http.get<PressureVesselResponse>(
      `${this.base}/pressure-vessel/company/${companyId}`,
      { headers: this.headers() }
    );
  }

  deletePressureCertificate(
    id: number,
    companyId: number
  ): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(
      `${this.base}/pressure-vessel/${id}?companyId=${companyId}`,
      { headers: this.headers() }
    );
  }

  // ── POWER PRESS ───────────────────────────────────────────────────────────
  createPowerPress(r: PowerPress): Observable<RestApiResponse<PowerPress>> {
    return this.http.post<RestApiResponse<PowerPress>>(
      `${this.base}/power-press`,
      r,
      { headers: this.headers() }
    );
  }

  updatePowerPress(
    id: number,
    r: PowerPress
  ): Observable<RestApiResponse<PowerPress>> {
    return this.http.put<RestApiResponse<PowerPress>>(
      `${this.base}/power-press/${id}`,
      r,
      { headers: this.headers() }
    );
  }

  getPowerPressById(
    id: number,
    companyId: number
  ): Observable<RestApiResponse<PowerPress>> {
    return this.http.get<RestApiResponse<PowerPress>>(
      `${this.base}/power-press/${id}?companyId=${companyId}`,
      { headers: this.headers() }
    );
  }

  getAllPowerPressByCompany(companyId: number): Observable<PowerPressResponse> {
    return this.http.get<PowerPressResponse>(
      `${this.base}/power-press/company/${companyId}`,
      { headers: this.headers() }
    );
  }

  deletePowerPress(
    id: number,
    companyId: number
  ): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(
      `${this.base}/power-press/${id}?companyId=${companyId}`,
      { headers: this.headers() }
    );
  }

  filterPowerPressByOccupier(
    companyId: number,
    name: string
  ): Observable<PowerPressResponse> {
    return this.http.get<PowerPressResponse>(
      `${this.base}/power-press/filter/occupier?companyId=${companyId}&name=${name}`,
      { headers: this.headers() }
    );
  }

  filterPowerPressByMachine(
    companyId: number,
    type: string
  ): Observable<PowerPressResponse> {
    return this.http.get<PowerPressResponse>(
      `${this.base}/power-press/filter/machine?companyId=${companyId}&type=${type}`,
      { headers: this.headers() }
    );
  }

  filterPowerPressByYear(
    companyId: number,
    year: number
  ): Observable<PowerPressResponse> {
    return this.http.get<PowerPressResponse>(
      `${this.base}/power-press/filter/year?companyId=${companyId}&year=${year}`,
      { headers: this.headers() }
    );
  }

  // ── SAFETY BELT ───────────────────────────────────────────────────────────
  createSafetyBelt(
    data: SafetyBeltInspection
  ): Observable<RestApiResponse<SafetyBeltInspection>> {
    return this.http.post<RestApiResponse<SafetyBeltInspection>>(
      `${this.base}/safety-belt`,
      data,
      { headers: this.headers() }
    );
  }

  updateSafetyBelt(
    id: number,
    data: SafetyBeltInspection
  ): Observable<RestApiResponse<SafetyBeltInspection>> {
    return this.http.put<RestApiResponse<SafetyBeltInspection>>(
      `${this.base}/safety-belt/${id}`,
      data,
      { headers: this.headers() }
    );
  }

  getSafetyBeltById(
    id: number,
    companyId: number
  ): Observable<RestApiResponse<SafetyBeltInspection>> {
    return this.http.get<RestApiResponse<SafetyBeltInspection>>(
      `${this.base}/safety-belt/${id}?companyId=${companyId}`,
      { headers: this.headers() }
    );
  }

  getAllSafetyBelts(companyId: number): Observable<SafetyBeltResponse> {
    return this.http.get<SafetyBeltResponse>(
      `${this.base}/safety-belt/company/${companyId}`,
      { headers: this.headers() }
    );
  }

  deleteSafetyBelt(
    id: number,
    companyId: number
  ): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(
      `${this.base}/safety-belt/${id}?companyId=${companyId}`,
      { headers: this.headers() }
    );
  }

  filterSafetyBeltByOccupier(
    companyId: number,
    name: string
  ): Observable<SafetyBeltResponse> {
    return this.http.get<SafetyBeltResponse>(
      `${this.base}/safety-belt/filter/occupier?companyId=${companyId}&name=${name}`,
      { headers: this.headers() }
    );
  }

  filterSafetyBeltBySerial(
    companyId: number,
    serial: string
  ): Observable<SafetyBeltResponse> {
    return this.http.get<SafetyBeltResponse>(
      `${this.base}/safety-belt/filter/serial?companyId=${companyId}&serial=${serial}`,
      { headers: this.headers() }
    );
  }

  filterSafetyBeltByYear(
    companyId: number,
    year: number
  ): Observable<SafetyBeltResponse> {
    return this.http.get<SafetyBeltResponse>(
      `${this.base}/safety-belt/filter/year?companyId=${companyId}&year=${year}`,
      { headers: this.headers() }
    );
  }

  // ── SAFETY VALVE ──────────────────────────────────────────────────────────
  createSafetyValve(
    data: SafetyValve
  ): Observable<RestApiResponse<SafetyValve>> {
    return this.http.post<RestApiResponse<SafetyValve>>(
      `${this.base}/safety-valve`,
      data,
      { headers: this.headers() }
    );
  }

  updateSafetyValve(
    id: number,
    data: SafetyValve
  ): Observable<RestApiResponse<SafetyValve>> {
    return this.http.put<RestApiResponse<SafetyValve>>(
      `${this.base}/safety-valve/${id}`,
      data,
      { headers: this.headers() }
    );
  }

  getSafetyValveById(
    id: number
  ): Observable<RestApiResponse<SafetyValve>> {
    return this.http.get<RestApiResponse<SafetyValve>>(
      `${this.base}/safety-valve/${id}`,
      { headers: this.headers() }
    );
  }

  getAllSafetyValvesByCompany(companyId: number): Observable<SafetyValveResponse> {
    return this.http.get<SafetyValveResponse>(
      `${this.base}/safety-valve/company/${companyId}`,
      { headers: this.headers() }
    );
  }

  deleteSafetyValve(id: number): Observable<RestApiResponse> {
    return this.http.delete<RestApiResponse>(
      `${this.base}/safety-valve/${id}`,
      { headers: this.headers() }
    );
  }
}