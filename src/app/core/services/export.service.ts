import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StockMovement } from '../models/movement.model';
import { Product, getStockLevel } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ExportService {
  exportProductsCsv(products: Product[]): void {
    const headers = ['ID', 'SKU', 'Nombre', 'Categoria', 'Stock', 'MinStock', 'Precio', 'Costo', 'Ubicacion', 'Estado', 'Nivel'];
    const rows = products.map((product) => [
      product.id,
      product.sku,
      product.name,
      product.category,
      product.stock,
      product.minStock,
      product.price.toFixed(2),
      product.cost.toFixed(2),
      product.location,
      product.status,
      getStockLevel(product)
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.map((item) => this.escapeCsv(item)).join(','))].join('\n');
    this.downloadFile(csv, this.buildFileName('inventario-productos', 'csv'), 'text/csv;charset=utf-8;');
  }

  exportMovementsCsv(movements: StockMovement[]): void {
    const headers = ['ID', 'ProductoID', 'Tipo', 'Cantidad', 'StockAnterior', 'StockNuevo', 'Motivo', 'Usuario', 'Fecha'];
    const rows = movements.map((movement) => [
      movement.id,
      movement.productId,
      movement.type,
      movement.quantity,
      movement.previousStock,
      movement.newStock,
      movement.reason,
      movement.userName,
      movement.date
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.map((item) => this.escapeCsv(item)).join(','))].join('\n');
    this.downloadFile(csv, this.buildFileName('inventario-movimientos', 'csv'), 'text/csv;charset=utf-8;');
  }

  exportInventoryPdf(products: Product[]): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const title = 'Reporte de Inventario';

    doc.setFontSize(16);
    doc.text(title, 40, 36);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 40, 54);

    const totalItems = products.reduce((acc, product) => acc + product.stock, 0);
    const totalValue = products.reduce((acc, product) => acc + product.stock * product.price, 0);
    const critical = products.filter((product) => {
      const level = getStockLevel(product);
      return level === 'critical' || level === 'out_of_stock';
    }).length;

    doc.text(`Total items: ${totalItems}`, 40, 74);
    doc.text(`Valor total: $${totalValue.toLocaleString()}`, 200, 74);
    doc.text(`Productos criticos: ${critical}`, 420, 74);

    autoTable(doc, {
      head: [['SKU', 'Nombre', 'Categoria', 'Stock', 'Min', 'Precio', 'Costo', 'Nivel', 'Ubicacion']],
      body: products.map((product) => [
        product.sku,
        product.name,
        product.category,
        String(product.stock),
        String(product.minStock),
        `$${product.price.toFixed(2)}`,
        `$${product.cost.toFixed(2)}`,
        getStockLevel(product),
        product.location
      ]),
      startY: 90,
      styles: { fontSize: 8 }
    });

    doc.save(this.buildFileName('reporte-inventario', 'pdf'));
  }

  exportMovementsPdf(movements: StockMovement[]): void {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

    doc.setFontSize(16);
    doc.text('Reporte de Movimientos de Stock', 40, 36);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 40, 54);

    autoTable(doc, {
      head: [['Fecha', 'ProductoID', 'Tipo', 'Cantidad', 'Anterior', 'Nuevo', 'Motivo', 'Usuario']],
      body: movements.map((movement) => [
        new Date(movement.date).toLocaleString(),
        String(movement.productId),
        movement.type,
        String(movement.quantity),
        String(movement.previousStock),
        String(movement.newStock),
        movement.reason,
        movement.userName
      ]),
      startY: 70,
      styles: { fontSize: 8 }
    });

    doc.save(this.buildFileName('reporte-movimientos', 'pdf'));
  }

  private buildFileName(prefix: string, extension: string): string {
    const date = new Date().toISOString().slice(0, 10);
    return `${prefix}-${date}.${extension}`;
  }

  private escapeCsv(value: unknown): string {
    const text = String(value ?? '');
    if (text.includes(',') || text.includes('"') || text.includes('\n')) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  }

  private downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }
}
