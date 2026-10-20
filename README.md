# HTTP e API REST — esercitazione Angular

Soluzione pratica della dispensa **03.15 — HTTP e API REST** (modulo 03, quarta Informatica). L'app usa Angular 22 e l'API pubblica [JSONPlaceholder](https://jsonplaceholder.typicode.com/).

## Avvio

Serve Node.js compatibile con Angular 22 (per esempio Node 24.15 o successivo nella serie 24).

```bash
npm install
npm start
```

Apri l'indirizzo mostrato dal terminale, normalmente `http://localhost:4200/`. Per verificare la compilazione: `npm run build`.

## Esercizi svolti

| Azione nell'app | Richiesta HTTP | Cosa osservare |
| --- | --- | --- |
| Apri l'app oppure scegli utente 1 o 2 | `GET /todos?userId=1` oppure `2` | Elenco, contatore delle attività completate, stato di caricamento. |
| Scegli utente 99 | `GET /todos?userId=99` | `200 OK`, lista vuota: nessuna attività, non un errore. |
| Premi «Prova GET /todos/999» | `GET /todos/999` | `404 Not Found`: la singola risorsa non esiste. |
| Scrivi un titolo e premi «Invia» | `POST /todos` con JSON | `201 Created` e JSON della risposta con l'ID assegnato. |
| Premi «Elimina» accanto a un'attività | `DELETE /todos/:id` | La riga sparisce dopo la risposta; il signal viene aggiornato con `update` e `filter`. |

Apri **F12 → Network → Fetch/XHR** prima di usare i pulsanti per controllare metodo, URL, codice di stato, payload e risposta. Se la rete fallisce, l'app mostra un messaggio e offre di riprovare.

JSONPlaceholder simula POST e DELETE senza modificare i dati sul server: ricaricando l'elenco le attività tornano e quella inviata non viene aggiunta. Per questo la risposta POST viene mostrata a parte. Nessuna chiave API è necessaria.

## Struttura

- `src/app/modelli/todo.ts`: interfaccia TypeScript della risposta JSON.
- `src/app/services/todo-service.ts`: GET, POST e DELETE tipizzate con `HttpClient`.
- `src/app/todos/`: componente con `subscribe`, signal per dati/caricamento/errori e template.
- `src/app/app.config.ts`: `provideHttpClient()`.
- `docs/risposte.md`: soluzioni delle 12 domande di verifica e spiegazione delle prove pratiche.

Il servizio è `@Injectable({ providedIn: 'root' })` (la dispensa riporta `@Service()`, che non è un decorator Angular valido).
