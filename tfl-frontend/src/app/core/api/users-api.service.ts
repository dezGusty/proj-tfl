import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppUser, ApproveUserRequest, UpdateRolesRequest, LinkPlayerRequest } from '../models/app-user.model';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private http = inject(HttpClient);

  private _users = signal<AppUser[]>([]);
  readonly users = this._users.asReadonly();

  async loadUsers(): Promise<void> {
    const result = await firstValueFrom(this.http.get<AppUser[]>('/api/users'));
    this._users.set(result);
  }

  async approve(id: string, approved: boolean): Promise<AppUser> {
    return firstValueFrom(this.http.put<AppUser>(`/api/users/${id}/approve`, { approved } as ApproveUserRequest));
  }

  async updateRoles(id: string, roles: string[]): Promise<AppUser> {
    return firstValueFrom(this.http.put<AppUser>(`/api/users/${id}/roles`, { roles } as UpdateRolesRequest));
  }

  async deactivate(id: string): Promise<AppUser> {
    return firstValueFrom(this.http.put<AppUser>(`/api/users/${id}/deactivate`, {}));
  }

  async linkPlayer(id: string, playerId: number): Promise<AppUser> {
    return firstValueFrom(this.http.put<AppUser>(`/api/users/${id}/link-player`, { playerId } as LinkPlayerRequest));
  }
}
