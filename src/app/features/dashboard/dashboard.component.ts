import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RagService } from '../../core/services/rag.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex h-screen bg-gray-50 text-gray-800 font-sans">
      
      <!-- Header -->
      <header class="absolute top-0 w-full bg-white border-b h-16 flex items-center justify-between px-6 z-10">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🩺</span>
          <h1 class="text-xl font-bold tracking-tight">Health RAG Assistant</h1>
        </div>
        <button (click)="logout()" class="text-sm text-red-600 font-medium hover:text-red-700">
          Déconnexion
        </button>
      </header>

      <!-- Main Content Layout -->
      <div class="flex flex-1 pt-16 overflow-hidden">
        
        <!-- Sidebar: Ingestion -->
        <aside class="w-80 bg-white border-r flex flex-col">
          <div class="p-6 border-b">
            <h2 class="text-sm font-bold uppercase text-gray-500 tracking-wider mb-2">Base de Connaissance</h2>
            <p class="text-xs text-gray-500">Chargez des notices médicales depuis OpenFDA.</p>
          </div>
          
          <div class="p-6">
            <form (ngSubmit)="ingest()" class="space-y-3">
              <label class="block text-xs font-semibold">Nom du médicament</label>
              <input 
                [(ngModel)]="drugName" 
                placeholder="ex: aspirin" 
                class="w-full px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-green-500 outline-none"
              >
              <button 
                type="submit" 
                [disabled]="ragService.isLoading() || !drugName"
                class="w-full bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Charger les données
              </button>
            </form>

            @if (ragService.ingestStatus()) {
              <div class="mt-4 p-3 bg-green-50 text-green-700 text-xs rounded animate-pulse">
                {{ ragService.ingestStatus() }}
              </div>
            }
          </div>
        </aside>

        <!-- Chat Area -->
        <main class="flex-1 flex flex-col relative">
          
          <!-- Messages List -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div class="space-y-4" *ngFor="let msg of ragService.messages(); track msg">
              <!-- User Message -->
              @if (msg.sender === 'user') {
                <div class="flex justify-end">
                  <div class="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[70%] shadow-sm">
                    <p class="text-sm">{{ msg.text }}</p>
                  </div>
                </div>
              } @else {
                <!-- Bot Message -->
                <div class="flex justify-start">
                  <div class="bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%] shadow-sm">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-bold text-green-600">AI Assistant</span>
                    </div>
                    <!-- Affichage simple du texte (attention au HTML si la réponse en contient) -->
                    <p class="text-sm whitespace-pre-line">{{ msg.text }}</p>
                  </div>
                </div>
              }
            </div>
            
            @if (ragService.isLoading()) {
              <div class="flex items-center gap-2 text-sm text-gray-500">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              </div>
            }
          </div>

          <!-- Input Area -->
          <div class="p-6 bg-white border-t">
            <form (ngSubmit)="ask()" class="relative">
              <input 
                [(ngModel)]="question" 
                name="question"
                placeholder="Posez une question sur vos données médicales..." 
                class="w-full pl-4 pr-12 py-3 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all"
                [disabled]="ragService.isLoading()"
              >
              <button 
                type="submit" 
                [disabled]="ragService.isLoading() || !question.trim()"
                class="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  `
})
export class DashboardComponent {
  drugName = '';
  question = '';
  
  protected auth = inject(AuthService);
  protected ragService = inject(RagService);

  ingest() {
    this.ragService.ingestDrug(this.drugName).subscribe({
      next: (res) => {
        this.ragService.ingestStatus.set(`✅ ${res.message} (${res.chunks} fragments indexés).`);
        this.drugName = ''; // Reset input
      },
      error: (err) => {
        this.ragService.ingestStatus.set(`❌ Erreur : ${err.error.detail}`);
      }
    });
  }

  ask() {
    if (!this.question.trim()) return;
    const currentQuestion = this.question;
    this.question = ''; 

    this.ragService.askQuestion(currentQuestion).subscribe({
      next: (res) => {
        const sourceText = res.sources.map(s => s.content_preview).join('\n- ');
        const fullAnswer = `${res.answer}\n\n📚 Sources utilisées :\n- ${sourceText}`;
        this.ragService.addBotAnswer(fullAnswer);
      },
      error: (err) => {
        this.ragService.addBotAnswer("⚠️ Je n'ai pas pu répondre. Vérifiez votre connexion ou vos données.");
      }
    });
  }

  logout() {
    this.auth.logout();
  }
}