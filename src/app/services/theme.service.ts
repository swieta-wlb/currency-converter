import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  #_highContrast: WritableSignal<boolean> = signal(false);
  readonly highContrast: Signal<boolean> = this.#_highContrast.asReadonly();

  setHighContrast(): void {
    this.#_highContrast.set(!this.highContrast());
  }
}
