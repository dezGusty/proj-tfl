import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <div class="privacy-page">
      <h1>Privacy Policy</h1>
      <p>TFL collects your Google account email and profile photo to identify you within the app. No data is shared with third parties.</p>
    </div>
  `,
  styles: [`.privacy-page { padding: 2rem; max-width: 600px; margin: 0 auto; }`]
})
export class PrivacyComponent {}
