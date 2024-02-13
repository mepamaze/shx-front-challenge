export class Cotacao {
  preco_compra: number;
  preco_venda: number;
  data: Date | string;
  hora: String;
  diferenca: String | null = '';
  precoTexto: String = '';
  dataTexto: string | null = '';

  constructor(preco_compra: number, preco_venda: number, data: string | Date, hora: String) {
    this.preco_compra = preco_compra;
    this.preco_venda = preco_venda;
    this.data = data;
    this.hora = hora;
  }
}
