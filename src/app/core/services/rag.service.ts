import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface AnswerResponse {
  answer: string;
  sources: { content_preview: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class RagService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/v1';

  // --- STATE MANAGEMENT avec SIGNALS ---
  messages = signal<ChatMessage[]>([
    { sender: 'bot', text: 'Bonjour ! Connectez-vous et ingérez un médicament pour commencer.' }
  ]);
  isLoading = signal<boolean>(false);
  ingestStatus = signal<string>('');

  ingestDrug(drugName: string): Observable<any> {
    this.isLoading.set(true);
    return this.http.post(`${this.apiUrl}/ingest`, { drug_name: drugName });
  }

  askQuestion(question: string): Observable<AnswerResponse> {
    this.isLoading.set(true);
    // Ajout immédiat de la question utilisateur (Optimistic UI)
    this.messages.update(prev => [...prev, { sender: 'user', text: question }]);
    
    return this.http.post<AnswerResponse>(`${this.apiUrl}/ask`, { question: question });
  }

  addBotAnswer(answer: string) {
    this.messages.update(prev => [...prev, { sender: 'bot', text: answer }]);
    this.isLoading.set(false);
  }
}