// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

const JWTS_LOCAL_KEY = 'JWTS_LOCAL_KEY';

@Injectable({ providedIn: 'root' })
export class AuthService {
  url = environment.auth0.url;
  audience = environment.auth0.audience;
  clientId = environment.auth0.clientId;
  callbackURL = environment.auth0.callbackURL;

  token: string | null = null;
  payload: any = null;

  constructor() {}

  build_login_link(): string {
    const base = `https://${this.url}.auth0.com/authorize`;
    const params = [
      `audience=${encodeURIComponent(this.audience)}`,
      'response_type=token',
      `client_id=${encodeURIComponent(this.clientId)}`,
      `redirect_uri=${encodeURIComponent(this.callbackURL)}`,
      'scope=openid profile email',
      'prompt=login'
    ];
    return `${base}?${params.join('&')}`;
  }

  // Beim App-Start aufrufen
  check_token_fragment(): void {
    const raw = window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;

    if (!raw) return;

    const qs = new URLSearchParams(raw);
    const t = qs.get('access_token');
    if (t) {
      this.token = t;
      this.set_jwt();
      history.replaceState(null, '', window.location.pathname);
    }
  }

  set_jwt(): void {
    if (this.token) {
      localStorage.setItem(JWTS_LOCAL_KEY, this.token);
      this.decodeJWT(this.token);
    } else {
      localStorage.removeItem(JWTS_LOCAL_KEY);
      this.payload = null;
    }
  }

  load_jwts(): void {
    this.token = localStorage.getItem(JWTS_LOCAL_KEY);
    if (this.token) this.decodeJWT(this.token);
  }

  activeJWT(): string | null {
    return this.token;
  }

  decodeJWT(token: string): any {
    const helper = new JwtHelperService();
    this.payload = helper.decodeToken(token);
    return this.payload;
  }

  logout(): void {
    this.token = null;
    this.payload = null;
    this.set_jwt();
  }

  can(permission: string): boolean {
    return !!(
      this.payload &&
      Array.isArray(this.payload.permissions) &&
      this.payload.permissions.includes(permission)
    );
    }
}
