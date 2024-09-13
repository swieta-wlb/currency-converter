import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { combineLatest, firstValueFrom, map, Observable, tap } from 'rxjs';
import { Currency } from '../models/currency';
import { CurrencyResponse, CurrencyTableResponse } from '../models/currency-table-reponse';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  readonly http = inject(HttpClient);

  #_list: WritableSignal<Currency[]> = signal([]);
  readonly list: Signal<Currency[]> = this.#_list.asReadonly();

  #_allCurrentRates: WritableSignal<Currency[]> = signal([]);
  readonly allCurrentRates: Signal<Currency[]> = this.#_allCurrentRates.asReadonly();

  #_todayList: WritableSignal<Currency[]> = signal([]);
  readonly todayList: Signal<Currency[]> = this.#_todayList.asReadonly();

  getAllCurrentRates(): Promise<void> {
    return firstValueFrom(combineLatest([
      this.http.get<CurrencyTableResponse[]>(`https://api.nbp.pl/api/exchangerates/tables/A/`),
      this.http.get<CurrencyTableResponse[]>(`https://api.nbp.pl/api/exchangerates/tables/B/`)
    ]).pipe(map(([tableA, tableB]) => {
      const allData: Currency[] = [
        ...tableA[0]?.rates?.map((item) => ({ ...item, table: tableA[0].table })),
        ...tableB[0]?.rates?.map((item) => ({ ...item, table: tableB[0].table }))
      ].sort(
        (a: Currency, b: Currency) => a.currency.toUpperCase() < b.currency.toUpperCase() ? -1 : 1)
      this.#_allCurrentRates.set(allData);
    })));
  }

  getCurrencyTodayList(params: { table: string }): Promise<Currency[]> {
    const table = params.table;
    return firstValueFrom(this.http.get<CurrencyTableResponse[]>(`https://api.nbp.pl/api/exchangerates/tables/${table}/`).pipe(
      map((res: CurrencyTableResponse[]) => res[0].rates),
      tap((res: Currency[]) => {
        this.#_list.set(res);
      })
    ));
  }

  getCurrencyList(params: any): Promise<Currency[]> {
    const table = params.table;
    const date = params.date;
    return firstValueFrom(this.http.get<CurrencyTableResponse[]>(`https://api.nbp.pl/api/exchangerates/tables/${table}/${date}/`).pipe(
      map((res: CurrencyTableResponse[]) => res[0].rates),
      tap((res: Currency[]) => {
        this.#_list.set(res);
      })
    ));
  }

  getCurrencyRate(params: any): Observable<CurrencyResponse> {
    const table = params.table;
    const code = params.code;
    return this.http.get<CurrencyResponse>(`https://api.nbp.pl/api/exchangerates/rates/${table}/${code}/`);
  }
}
