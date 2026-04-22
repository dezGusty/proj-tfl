import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="about-page">
      <h1>Thursday Football League</h1>
      <p>TFL is a weekly football league organiser. Track player ratings, manage game day registrations, and balance teams fairly.</p>
      <p>Use the navigation to access players, matches, game events, and the draft tool.</p>
    </div>
  `,
  styles: [`.about-page { padding: 2rem; max-width: 600px; margin: 0 auto; }`]
})
export class AboutComponent {}
