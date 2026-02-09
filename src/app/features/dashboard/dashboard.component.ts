import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/services/auth.service';
import { RagService } from '../../core/services/rag.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LayoutModule,

    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  drugName = '';
  question = '';

  protected auth = inject(AuthService);
  protected ragService = inject(RagService);

  private bo = inject(BreakpointObserver);
  isHandset$ = this.bo.observe([Breakpoints.Handset]).pipe(
    map(r => r.matches),
    shareReplay(1)
  );

  trackMsg = (_: number, msg: any) => msg?.id ?? msg?.text; // adapte si tu as un id

  ingest() {
  const name = this.drugName.trim();
  if (!name) return;

  this.ragService.ingestDrug(name).subscribe({
    next: () => (this.drugName = '')
  });
}

  ask() {
  const q = this.question.trim();
  if (!q) return;

  this.question = '';
  this.ragService.askQuestion(q).subscribe(); // le service gère messages + loading + erreurs
}

  logout() {
    this.auth.logout();
  }
}
