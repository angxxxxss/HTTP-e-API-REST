import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { Todo } from '../modelli/todo';
import { TodoService } from '../services/todo-service';

@Component({
  selector: 'app-todos',
  imports: [JsonPipe],
  templateUrl: './todos.html',
  styleUrl: './todos.css',
})
export class Todos implements OnInit, OnDestroy {
  private readonly todoService = inject(TodoService);
  private caricamento?: Subscription;

  readonly utente = signal(1);
  readonly todos = signal<Todo[]>([]);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);
  readonly erroreAzione = signal<string | null>(null);
  readonly creato = signal<Todo | null>(null);
  readonly rispostaProva = signal<string | null>(null);
  readonly eliminazioniInCorso = signal<ReadonlySet<number>>(new Set());
  readonly invioInCorso = signal(false);
  readonly completate = computed(() => this.todos().filter(todo => todo.completed).length);

  ngOnInit(): void {
    this.carica(1);
  }

  ngOnDestroy(): void {
    this.caricamento?.unsubscribe();
  }

  carica(userId: number): void {
    this.caricamento?.unsubscribe();
    this.utente.set(userId);
    this.todos.set([]);
    this.loading.set(true);
    this.errore.set(null);
    this.erroreAzione.set(null);
    this.creato.set(null);
    this.rispostaProva.set(null);

    this.caricamento = this.todoService.getTodos(userId).subscribe({
      next: (dati) => {
        this.todos.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(this.descriviErrore(err));
        this.loading.set(false);
      },
    });
  }

  aggiungi(campo: HTMLInputElement): void {
    const titolo = campo.value.trim();
    if (!titolo || this.invioInCorso()) return;

    const userId = this.utente();
    this.invioInCorso.set(true);
    this.erroreAzione.set(null);
    this.todoService.addTodo({ userId, title: titolo, completed: false }).subscribe({
      next: (risposta) => {
        this.creato.set(risposta);
        campo.value = '';
        this.invioInCorso.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.erroreAzione.set('Invio non riuscito. ' + this.descriviErrore(err));
        this.invioInCorso.set(false);
      },
    });
  }

  elimina(todo: Todo): void {
    if (this.eliminazioniInCorso().has(todo.id)) return;

    this.eliminazioniInCorso.update(ids => new Set([...ids, todo.id]));
    this.erroreAzione.set(null);
    this.todoService.deleteTodo(todo.id).subscribe({
      next: () => {
        if (this.utente() === todo.userId) {
          this.todos.update(todos => todos.filter(attivita => attivita.id !== todo.id));
        }
        this.fineEliminazione(todo.id);
      },
      error: (err: HttpErrorResponse) => {
        this.erroreAzione.set('Eliminazione non riuscita. ' + this.descriviErrore(err));
        this.fineEliminazione(todo.id);
      },
    });
  }

  prova404(): void {
    this.rispostaProva.set('Richiesta GET /todos/999 in corso…');
    this.todoService.getTodo(999).subscribe({
      next: (todo) => this.rispostaProva.set('Risposta 200: ' + todo.title),
      error: (err: HttpErrorResponse) =>
        this.rispostaProva.set('Risposta ' + err.status + ': attività inesistente (Not Found).'),
    });
  }

  private fineEliminazione(id: number): void {
    this.eliminazioniInCorso.update(ids => {
      const rimanenti = new Set(ids);
      rimanenti.delete(id);
      return rimanenti;
    });
  }

  private descriviErrore(err: HttpErrorResponse): string {
    return err.status === 0
      ? 'Errore di rete o richiesta bloccata dal browser. Riprova più tardi.'
      : 'Errore HTTP ' + err.status + ': ' + err.message;
  }
}
