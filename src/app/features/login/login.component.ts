import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Health RAG AI</h1>
          <p class="text-gray-600 text-sm">Connexion Sécurisée</p>
        </div>
        
        <!-- Toggle Login / Register -->
        <div class="flex justify-center mb-6 space-x-4">
          <button (click)="mode='login'" 
                  [class.text-blue-600]="mode === 'login'" 
                  class="font-semibold hover:underline">Connexion</button>
          <span class="text-gray-300">|</span>
          <button (click)="mode='register'" 
                  [class.text-blue-600]="mode === 'register'" 
                  class="font-semibold hover:underline">Inscription</button>
        </div>

        @if (errorMessage) {
          <div class="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {{ errorMessage }}
          </div>
        }

        <form (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-sm font-bold text-gray-700 mb-2">Nom d'utilisateur</label>
            <input 
              [(ngModel)]="username" 
              name="username" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
            <input 
              [(ngModel)]="password" 
              name="password" 
              type="password" 
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
          </div>
          
          <button 
            type="submit" 
            [disabled]="isSubmitting"
            class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            @if (isSubmitting) { Traitement... } @else { {{ mode === 'login' ? 'Se connecter' : "S'inscrire" }} }
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  mode: 'login' | 'register' = 'login';
  errorMessage = '';
  isSubmitting = false;

  private auth = inject(AuthService);
  private router = inject(Router);

  onSubmit() {
    this.isSubmitting = true;
    this.errorMessage = '';

    const call = this.mode === 'login' 
      ? this.auth.login(this.username, this.password) 
      : this.auth.register(this.username, this.password);

    call.subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.errorMessage = err.error.detail || 'Une erreur est survenue';
        this.isSubmitting = false;
      }
    });
  }
}