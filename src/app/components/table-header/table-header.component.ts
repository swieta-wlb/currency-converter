import { Component, DestroyRef, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { distinctUntilChanged } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-header',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.scss'
})
export class TableHeaderComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  @Output()
  changeTable: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  changeDate: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  showToday: EventEmitter<void> = new EventEmitter<void>();

  selectedTable = input.required();
  selectedDate = input<string | Date>();

  dateControl = new FormControl();

  ngOnInit(): void {
    this.dateControl.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.changeDate.emit(value);
    });
  }

}
