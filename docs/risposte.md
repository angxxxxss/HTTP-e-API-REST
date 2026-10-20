# Risposte — HTTP e API REST

## Le due prove «Prova tu»

- Aprendo `https://jsonplaceholder.typicode.com/todos/999` la risposta è **404 Not Found** (normalmente la pagina mostra `{}`): non esiste un'attività con quell'ID. Nell'app premi «Prova GET /todos/999» e controlla la richiesta in Network.
- Il pulsante «Elimina» chiama `DELETE /todos/:id`. Solo quando arriva una risposta positiva rimuove l'attività mostrata con `this.todos.update(todos => todos.filter(t => t.id !== id))`. JSONPlaceholder non persiste la cancellazione: ricaricando i dati, la riga ricompare.

## Domande di verifica

1. **Client-server e meteo.** L'app Angular nel browser è il client: richiede i dati meteo a un'API. Il server custodisce o recupera i dati e invia una risposta, per esempio in JSON. Il client li mostra sullo schermo.

2. **Richiesta e risposta.** Una richiesta ha metodo, URL, header e, se serve, body. Una risposta ha codice di stato, header e body. Di norma GET non ha body; POST, PUT e PATCH lo usano per inviare dati. DELETE normalmente non ne ha bisogno.

3. **CRUD per `libri`.** Creare: `POST /libri`; leggere tutti: `GET /libri`; leggere uno: `GET /libri/5`; sostituire completamente: `PUT /libri/5`; modificare alcuni campi: `PATCH /libri/5`; cancellare: `DELETE /libri/5`.

4. **Codici.** 201 significa risorsa creata; 204 successo senza contenuto; 403 accesso vietato; 404 risorsa non trovata; 500 errore interno del server. I 4xx indicano un problema nella richiesta o nei permessi del client; i 5xx un problema sul server.

5. **JSON e interfaccia.** Un esempio valido:

   ```json
   {"titolo":"Il barone rampante","autori":["Italo Calvino"],"anno":1957,"disponibile":true}
   ```

   ```ts
   interface Libro {
     titolo: string;
     autori: string[];
     anno: number;
     disponibile: boolean;
   }
   ```

6. **Configurazione.** In `app.config.ts` si importa `provideHttpClient` da `@angular/common/http` e si inserisce `provideHttpClient()` nei `providers`. Nelle versioni meno recenti, ometterlo poteva causare `NullInjectorError: No provider for HttpClient!`.

7. **Observable.** È una sorgente di valori asincroni. `http.get(...)` prepara la richiesta: la richiesta parte quando si chiama `subscribe`. Due chiamate a `subscribe` su quell'Observable producono due richieste HTTP indipendenti.

8. **`next` e `error`.** `next` riceve i dati quando la richiesta riesce. `error` riceve un errore HTTP 4xx/5xx oppure un errore di rete/CORS e permette di mostrare un messaggio all'utente.

9. **Signal.** La risposta HTTP arriva dopo l'evento iniziale. `todos`, `loading` ed `errore` come signal notificano Angular quando cambiano, aggiornando elenco, caricamento e messaggio d'errore anche in un'app zoneless. Una semplice proprietà modificata nella callback potrebbe non aggiornare la pagina.

10. **`get<Todo[]>`.** Dice a TypeScript che ci aspettiamo un array di `Todo`, offrendo controllo dei tipi e autocompletamento nel codice. Non valida il JSON reale: se il server restituisce dati diversi, serve una verifica a runtime.

11. **Stile moderno.** Con `private readonly http = inject(HttpClient)` si ottiene il servizio senza dichiararlo nel costruttore. Per la risposta:

    ```ts
    this.http.get<Todo[]>('/api/todos').subscribe({
      next: dati => this.todos.set(dati),
      error: err => this.errore.set(err.message),
    });
    ```

    Nel codice meno recente `getData = (d) => { this.data = d; }` era una arrow function perché, passata da sola a `subscribe`, conserva il `this` del componente. Qui le callback arrow fanno lo stesso.

12. **Chiavi API.** Per una chiave di esercitazione si usano file di ambiente locali ignorati da Git, e nel repository si mette solo un `environment.example.ts` con un segnaposto. Tuttavia Angular invia il codice al browser: chi usa l'app può leggere anche la chiave incorporata. Le chiavi veramente segrete vanno tenute su un server, che esegue la richiesta all'API per conto del browser. Questo progetto usa JSONPlaceholder e non richiede chiavi.
