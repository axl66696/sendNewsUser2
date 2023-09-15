/* eslint-disable @typescript-eslint/no-inferrable-types */
export class ColorType {
  /** 應用程式類別
   * @type {string}
   * @memberof ColorType
   */
  type: string = '';

  /** 類別對應圖標顏色樣式
   * @type {string}
   * @memberof ColorType
   */
  colorClass: string = '';

  /** 類別對應預覽圖標顏色變數
   * @type {string}
   * @memberof ColorType
   */
  showColor: string = '';

  constructor(that?: Partial<ColorType>) {
    Object.assign(this, structuredClone(that));
  }
}
