import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-export-button',
  standalone: true,
  templateUrl: './export-button.component.html',
  styleUrl: './export-button.component.scss'
})
export class ExportButtonComponent {
  @Input() label = 'Exportar';
  @Input() kind: 'csv' | 'pdf' = 'csv';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();
}
