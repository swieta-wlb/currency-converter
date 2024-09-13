import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Currency } from '../../models/currency';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  @Input()
  data: Currency[];

}
