import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from '../service/api-service';
import { AdminLogInRequest, RestApiResponse } from '../model/models.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'ess_token';
  private readonly ADMIN_KEY = 'ess_admin';

  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(req: AdminLogInRequest): Observable<RestApiResponse> {
    return this.api.login(req).pipe(
      tap((res: RestApiResponse) => {

        console.log('Login Response:', res);

        const token = res?.data?.authentication?.token;
        const profile = res?.data?.profile;

        if (res?.status === 'SUCCESS' && token) {
console.log(res.status);

          localStorage.setItem(this.TOKEN_KEY, token);
          localStorage.setItem(this.ADMIN_KEY, JSON.stringify(profile || {}));

          this._isLoggedIn$.next(true);

          // Optional auto redirect after login
          this.router.navigate(['/dashboard']);
        } else {
          console.warn('Login successful response but token missing');
        }
      })
    );
  }

  logout(): void {
    this.api.logout().subscribe({
      error: err => console.warn('Logout API failed:', err)
    });

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_KEY);

    this._isLoggedIn$.next(false);

    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getAdmin(): any {
    const admin = localStorage.getItem(this.ADMIN_KEY);
    return admin ? JSON.parse(admin) : null;
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }
}