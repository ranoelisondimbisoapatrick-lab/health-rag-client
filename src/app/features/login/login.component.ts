import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  mode: 'login' | 'register' = 'login';
  errorMessage = '';
  isSubmitting = false;

  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  onSubmit() {
    if (!this.username.trim() || !this.password) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const call =
      this.mode === 'login'
        ? this.auth.login(this.username, this.password)
        : this.auth.register(this.username, this.password);

    call.subscribe({
      next: () => {
        this.snack.open(
          this.mode === 'login' ? 'Connexion réussie ✅' : 'Compte créé ✅',
          'OK',
          { duration: 2000 }
        );
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.detail || 'Une erreur est survenue';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
