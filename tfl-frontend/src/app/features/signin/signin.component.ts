import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  template: `
    <div class="signin-page">
      <h1>Sign In</h1>
      @if (error) {
        <p class="error">{{ errorMessage }}</p>
      }
      <a href="/api/auth/google" class="btn-google">Sign in with Google</a>
    </div>
  `,
  styles: [`.signin-page { padding: 2rem; text-align: center; } .error { color: red; } .btn-google { display: inline-block; padding: 0.75rem 1.5rem; background: #4285f4; color: white; text-decoration: none; border-radius: 4px; }`]
})
export class SigninComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  error = false;
  errorMessage = '';

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const err = this.route.snapshot.queryParamMap.get('error');

    if (token) {
      this.authService.storeToken(token);
      this.router.navigate(['/players']);
    } else if (err) {
      this.error = true;
      this.errorMessage = `Sign-in failed: ${err.replace(/_/g, ' ')}`;
    }
  }
}
