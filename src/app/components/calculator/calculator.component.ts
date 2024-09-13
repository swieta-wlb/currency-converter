import { Component, inject, input, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../models/currency';
import { combineLatest, firstValueFrom, map, Observable, of } from 'rxjs';
import { calculate } from '../../utils/calculator';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent implements OnInit {
  readonly currencyService = inject(CurrencyService);
  selectedTable = input.required();
  readonly fb = inject(FormBuilder);
  currencyCodes: Signal<Currency[]> = this.currencyService.allCurrentRates;

  result$: Observable<number>;
  result: WritableSignal<string> = signal('');

  resultDisplayFn = (
    amount: number, code1: string, code2: string, res: number
  ): string => `${amount} ${code1} = ${res} ${code2}`;

  form: FormGroup = this.fb.group({
    amount: null,
    currency1: null,
    currency2: null,
  });

  async ngOnInit(): Promise<void> {
    await this.currencyService.getAllCurrentRates();
  }

  async calculate(): Promise<void> {
    const c1 = JSON.parse(this.form.value.currency1);
    const c2 = JSON.parse(this.form.value.currency2);
    const rate1 = c1.code === 'PLN' ? of(1) : this.currencyService
      .getCurrencyRate({ table: c1.table, code: c1.code })
      .pipe(map((res) => res.rates[0].mid));

    const rate2 = c2.code === 'PLN' ? of(1) : this.currencyService
      .getCurrencyRate({ table: c2.table, code: c2.code })
      .pipe(map((res) => res.rates[0].mid));

    this.result$ = combineLatest([
      rate1,
      rate2
    ]).pipe(map(([rate1, rate2]) => {
      return calculate(this.form.value.amount, rate1, rate2);
    }));
    const res = await firstValueFrom(this.result$);
    this.result.set(this.resultDisplayFn(this.form.value.amount, c1.code, c2.code, Math.round(res * 100) / 100));
  }
}
