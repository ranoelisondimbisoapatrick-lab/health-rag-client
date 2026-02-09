import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface AnswerResponse {
  answer: string;
  sources: { content_preview: string }[];
}

export interface IngestResponse {
  message: string;
  chunks: number;
}

@Injectable({ providedIn: 'root' })
export class RagService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/v1';

  // --- STATE (Signals) ---
  messages = signal<ChatMessage[]>([
    { sender: 'bot', text: 'Bonjour ! Connectez-vous et ingérez un médicament pour commencer.' }
  ]);
  isLoading = signal<boolean>(false);
  ingestStatus = signal<string>('');

  addUserQuestion(text: string) {
    this.messages.update(prev => [...prev, { sender: 'user', text }]);
  }

  addBotAnswer(text: string) {
    this.messages.update(prev => [...prev, { sender: 'bot', text }]);
  }

  ingestDrug(drugName: string): Observable<IngestResponse> {
    const name = drugName.trim();
    if (!name) {
      this.ingestStatus.set('❌ Veuillez saisir un médicament.');
      return throwError(() => new Error('drugName empty'));
    }

    this.isLoading.set(true);
    this.ingestStatus.set('⏳ Chargement des données...');

    return this.http.post<IngestResponse>(`${this.apiUrl}/ingest`, { drug_name: name }).pipe(
      tap((res) => {
        this.ingestStatus.set(`✅ ${res.message} (${res.chunks} fragments indexés).`);
      }),
      catchError((err) => {
        const msg = err?.error?.detail ?? 'Erreur lors de l’ingestion.';
        this.ingestStatus.set(`❌ ${msg}`);
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  askQuestion(question: string): Observable<AnswerResponse> {
    const q = question.trim();
    if (!q) {
      return throwError(() => new Error('question empty'));
    }

    this.isLoading.set(true);
    this.addUserQuestion(q);

    return this.http.post<AnswerResponse>(`${this.apiUrl}/ask`, { question: q }).pipe(
      tap((res) => {
        const sourceText = (res.sources ?? [])
          .map(s => s.content_preview)
          .filter(Boolean)
          .join('\n- ');

        const fullAnswer =
          sourceText.length > 0
            ? `${res.answer}\n\n📚 Sources utilisées :\n- ${sourceText}`
            : res.answer;

        this.addBotAnswer(fullAnswer);
      }),
      catchError((err) => {
        const msg = err?.error?.detail ?? "⚠️ Je n'ai pas pu répondre. Vérifiez votre connexion ou vos données.";
        this.addBotAnswer(msg);
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false))
    );
  }
}
