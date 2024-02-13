import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cotacao } from './cotacao';
import { CotacaoDolarService } from './cotacaodolar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  cotacaoAtual: Cotacao = new Cotacao(0,0,"","");
  cotacaoPorPeriodoLista: Cotacao[] = [];

  constructor(
    private cotacaoDolarService: CotacaoDolarService,
    private dateFormat: DatePipe
  ) {}

  public getCotacaoPorPeriodo(
    dataInicialString: string,
    dataFinalString: string
  ): void {
    this.cotacaoPorPeriodoLista = [];

    const dataInicial = this.dateFormat.transform(dataInicialString, "MM-dd-yyyy") || '';
    const dataFinal = this.dateFormat.transform(dataFinalString, "MM-dd-yyyy") || '';

    if (dataInicial && dataFinal) {
      this.cotacaoDolarService.getCotacaoPorPeriodoFront(dataInicial, dataFinal).subscribe(cotacoes => {
        this.cotacaoPorPeriodoLista = cotacoes;
      })
    } else {
      //ALERTA DE ERRO POÍS DATA INICIAL E FINAL SÃO OBRIGATÓRIAS
    }
  }

  ngOnInit() {
    this.cotacaoDolarService.getCotacaoAtual().subscribe(cotacao => {
      this.cotacaoAtual = cotacao;
    })
  }
}
