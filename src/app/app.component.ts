import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cotacao } from './cotacao';
import { CotacaoDolarService } from './cotacaodolar.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


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
        finalPeriodo: new FormControl(null, Validators.required),
        cotacoesMenores: new FormControl(false)
    });

    displayedColumns: string[] = ['data', 'hora', 'preco_compra', 'preco_venda', 'diferenca_compra', 'diferenca_venda'];
    dataSource: MatTableDataSource<Cotacao> = new MatTableDataSource<Cotacao>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private cotacaoDolarService: CotacaoDolarService,
        private dateFormat: DatePipe
    ) {

    }

    public getCotacaoPorPeriodo(): void {
        let dataInicialString = this.periodoForm.value.inicioPeriodo;
        let dataFinalString = this.periodoForm.value.finalPeriodo;

        const dataInicial = this.dateFormat.transform(dataInicialString, "MM-dd-yyyy") || '';
        const dataFinal = this.dateFormat.transform(dataFinalString, "MM-dd-yyyy") || '';

        if (this.periodoForm.value.cotacoesMenores) {
            this.cotacaoDolarService.getCotacoesMenores(dataInicial, dataFinal).subscribe(cotacoes => {
                this.dataSource = new MatTableDataSource(cotacoes);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            })
        } else {
            this.cotacaoDolarService.getCotacaoPorPeriodoFront(dataInicial, dataFinal).subscribe(cotacoes => {
                this.dataSource = new MatTableDataSource(cotacoes);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            })
        }
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

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getDiferencaAbsoluta(preco_compra: number = 0, cotacaoAtual: number = 0): string {
        return Math.abs(preco_compra - cotacaoAtual).toFixed(4);
    }
}
