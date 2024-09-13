import { Component, DestroyRef, effect, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { CalculatorComponent } from '../calculator/calculator.component';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../services/currency.service';
import { Currency } from '../../models/currency';
import { TableHeaderComponent } from '../table-header/table-header.component';
import { TableComponent } from '../table/table.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TableComponent, TableHeaderComponent, RouterLink, CalculatorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  readonly router = inject(Router);
  readonly currencyService = inject(CurrencyService);
  readonly themeService = inject(ThemeService);
  readonly route = inject(ActivatedRoute);
  data: Signal<Currency[]>;

  selectedTable: WritableSignal<string> = signal('A');
  selectedDate: WritableSignal<string> = signal('');

  constructor() {
    effect(() => {
      const table = this.selectedTable();
      const date = this.selectedDate();
      if (date) {
        this.currencyService.getCurrencyList({ table: table || 'A', date: date });
      } else {
        this.getToday();
      }
    });
  }

  ngOnInit(): void {
    this.data = this.currencyService.list;
  }

  setHighContrastMode() {
    this.themeService.setHighContrast();
  }

  getToday() {
    this.currencyService.getCurrencyTodayList({ table: this.selectedTable() });
  }

  changeTable(params: any) {
    this.selectedTable.set(params.table);
  }

  changeDate(params: any) {
    this.selectedDate.set(params.date);
  }
}
