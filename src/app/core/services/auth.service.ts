import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, throwError } from 'rxjs';
import { MOCK_USERS } from '../../mocks/users.mock';
import { PublicUser, User, UserRole } from '../models/user.model';

interface TokenPayload {
  userId: number;
  role: UserRole;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'inventory_app_token';
  private readonly currentUserSubject = new BehaviorSubject<PublicUser | null>(this.readUserFromToken());

  readonly currentUser$ = this.currentUserSubject.asObservable();

  login(email: string, password: string): Observable<{ user: PublicUser; token: string }> {
    const user = MOCK_USERS.find((candidate) => candidate.email === email && candidate.password === password);

    if (!user) {
      return throwError(() => new Error('Credenciales invalidas'));
    }

    const token = this.createToken(user);
    const publicUser = this.toPublicUser(user);

    localStorage.setItem(this.storageKey, token);
    this.currentUserSubject.next(publicUser);

    return of({ user: publicUser, token }).pipe(delay(180));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): PublicUser | null {
    if (this.currentUserSubject.value) {
      return this.currentUserSubject.value;
    }

    const fromToken = this.readUserFromToken();
    this.currentUserSubject.next(fromToken);
    return fromToken;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const role = this.getCurrentUser()?.role;
    return role ? roles.includes(role) : false;
  }

  private createToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      role: user.role,
      exp: Date.now() + 1000 * 60 * 60 * 8
    };

    return btoa(JSON.stringify(payload));
  }

  private toPublicUser(user: User): PublicUser {
    const { password, ...rest } = user;
    return rest;
  }

  private readUserFromToken(): PublicUser | null {
    const token = localStorage.getItem(this.storageKey);
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token)) as TokenPayload;
      if (payload.exp < Date.now()) {
        this.logout();
        return null;
      }

      const user = MOCK_USERS.find((candidate) => candidate.id === payload.userId);
      return user ? this.toPublicUser(user) : null;
    } catch {
      this.logout();
      return null;
    }
  }
}
