import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgStyle} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatToolbar} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgStyle, MatButton, MatCard, MatCardTitle, MatCardHeader, MatCardContent, MatCardSubtitle, MatToolbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  injectStyleTag(): void {
    const style = document.createElement('style');
    style.textContent = `.nonce-style { color: purple; }`;
    const nonce = this.getCspNonce();
    if (nonce) {
      (style as any).nonce = nonce;
    }
    document.head.appendChild(style);
    document.body.querySelectorAll('mat-card-title').forEach(el => el.classList.add('nonce-style'));
  }

  loadExternalScript(): void {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
    const nonce = this.getCspNonce();
    if (nonce) {
      (s as any).nonce = nonce;
    }
    document.body.appendChild(s);
  }

  onAngularClick(): void {
    alert('Angular (click) executed — works under strict CSP');
  }

  private getCspNonce(): string | null {
    const meta = document.querySelector('meta[name="CSP_NONCE"]') as HTMLMetaElement | null;
    return meta?.content || null;
  }
}
