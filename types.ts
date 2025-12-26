
export interface GridConfig {
  spacing: number; // in mm
  lineColor: string;
  lineWidth: number; // in mm
  showCenterLine: boolean;
  margin: number; // in mm
  pageCount: number; // number of pages
  orientation: 'landscape' | 'portrait';
}

export enum PaperSize {
  A4 = 'A4'
}
