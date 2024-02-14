import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Cotacao } from './cotacao';
import { CotacaoDolarService } from './cotacaodolar.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    cotacaoAtual: Cotacao = new Cotacao(0, 0, "", "");
    cotacaoPorPeriodoLista: Cotacao[] = [];

    minDate: Date = new Date(1984, 0, 1);
    maxDateInicio: Date = new Date();
    maxDateFinal: Date = new Date();


    periodoForm = new FormGroup({
        inicioPeriodo: new FormControl(null, Validators.required),
        finalPeriodo: new FormControl(null, Validators.required)
    });

    constructor(
        private cotacaoDolarService: CotacaoDolarService,
        private dateFormat: DatePipe
    ) { }

    public getCotacaoPorPeriodo(): void {
        let dataInicialString = this.periodoForm.value.inicioPeriodo;
        let dataFinalString = this.periodoForm.value.finalPeriodo;

        this.cotacaoPorPeriodoLista = [];

        const dataInicial = this.dateFormat.transform(dataInicialString, "MM-dd-yyyy") || '';
        const dataFinal = this.dateFormat.transform(dataFinalString, "MM-dd-yyyy") || '';

        this.cotacaoDolarService.getCotacaoPorPeriodoFront(dataInicial, dataFinal).subscribe(cotacoes => {
            this.cotacaoPorPeriodoLista = cotacoes;
        })
    }

    ngOnInit() {
        this.cotacaoDolarService.getCotacaoAtual().subscribe(cotacao => {
            this.cotacaoAtual = cotacao;
        })

        this.periodoForm.get('finalPeriodo')?.valueChanges.subscribe((value: Date) => {
            this.maxDateInicio = value;
        });


        let hoje = new Date();
        let primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

        this.periodoForm.patchValue({
            inicioPeriodo: primeiroDiaMes,
            finalPeriodo: hoje
        });

        this.getCotacaoPorPeriodo();
    }

}
