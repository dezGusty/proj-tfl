import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersApiService } from '../../../core/api/users-api.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-management">
      <h2>User Management</h2>
      @if (usersApi.users().length === 0) {
        <p>No users found.</p>
      } @else {
        <table>
          <thead><tr><th>Email</th><th>Roles</th><th>Approved</th><th>Actions</th></tr></thead>
          <tbody>
            @for (user of usersApi.users(); track user.id) {
              <tr>
                <td>{{ user.email }}</td>
                <td>{{ user.roles.join(', ') }}</td>
                <td>{{ user.approved ? 'Yes' : 'No' }}</td>
                <td>
                  <button (click)="toggleApprove(user.id, !user.approved)">
                    {{ user.approved ? 'Revoke' : 'Approve' }}
                  </button>
                  <button (click)="deactivate(user.id)">Deactivate</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `,
  styles: [`.user-management { padding: 1rem; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; } button { margin: 0 0.2rem; padding: 0.25rem 0.5rem; font-size: 0.85rem; }`]
})
export class UserManagementComponent implements OnInit {
  usersApi = inject(UsersApiService);

  ngOnInit() { this.usersApi.loadUsers(); }

  async toggleApprove(id: string, approved: boolean) {
    await this.usersApi.approve(id, approved);
    await this.usersApi.loadUsers();
  }

  async deactivate(id: string) {
    await this.usersApi.deactivate(id);
    await this.usersApi.loadUsers();
  }
}
