// src/app/services/drinks.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

export interface Drink {
  id?: number;
  title: string;
  recipe: any[];
}

@Injectable({ providedIn: 'root' })
export class DrinksService {
  private base = environment.apiServerUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  /** public endpoint (no auth header) */
  getDrinks(): Observable<any> {
    return this.http.get(`${this.base}/drinks`);
  }

  /** protected endpoint (requires get:drinks-detail) */
  getDrinksDetail(): Observable<any> {
    return this.http.get(`${this.base}/drinks-detail`, {
      headers: this.authHeader()
    });
  }

  /** protected endpoint (requires post:drinks) */
  createDrink(drink: Drink): Observable<any> {
    return this.http.post(`${this.base}/drinks`, drink, {
      headers: this.authHeader()
    });
  }

  /** protected endpoint (requires patch:drinks) */
  updateDrink(id: number, drink: Drink): Observable<any> {
    return this.http.patch(`${this.base}/drinks/${id}`, drink, {
      headers: this.authHeader()
    });
  }

  /** convenience for the form */
  saveDrink(drink: Drink): Observable<any> {
    return drink.id ? this.updateDrink(drink.id, drink) : this.createDrink(drink);
  }

  /** protected endpoint (requires delete:drinks) */
  deleteDrink(id: number): Observable<any> {
    return this.http.delete(`${this.base}/drinks/${id}`, {
      headers: this.authHeader()
    });
  }

  /** build Authorization header from current token */
  private authHeader(): HttpHeaders {
    const token = this.auth.activeJWT();
    return new HttpHeaders(
      token ? { Authorization: `Bearer ${token}` } : {}
    );
  }
}
