import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-signin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="signin-page">
      <h1>Sign In</h1>
      @if (error) {
        <p class="error" role="alert">{{ errorMessage }}</p>
      }
      <a href="/api/auth/google" class="btn-google">Sign in with Google</a>
    </div>
  `,
  styles: [`
    .signin-page { padding: 3rem 1rem; text-align: center; max-width: 400px; margin: 0 auto; }
    .error { color: var(--color-error); margin-bottom: 1rem; }
    .btn-google { display: inline-block; padding: 0.75rem 1.5rem; background: #4285f4; color: white; text-decoration: none; border-radius: 0.375rem; font-weight: 600; }
    .btn-google:hover { background: #3367d6; }
  `],
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
