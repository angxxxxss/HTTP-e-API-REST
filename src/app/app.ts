import { Component } from '@angular/core';
import { Todos } from './todos/todos';

@Component({
  imports: [Todos],
  selector: 'app-root',
  template: '<app-todos />',
})
export class App {}
