import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  grossSalaryInput = 998;
  dependentsInput = 0;
  deductionInput = 0;

  baseSalary: number;
  netSalary: number;
  inss: number;
  irrf: number;

  ngOnInit() {
    this.calculateNetSalary();
  }

  calculateNetSalary() {
    // Valida se o valor é maior que o salário mínimo ou os dependentes/dedução são negativos
    if (this.grossSalaryInput < 998 || this.dependentsInput < 0 || this.deductionInput < 0) {
      return;
    }

    this.inss = this.handleInss(this.grossSalaryInput);
    this.baseSalary = this.grossSalaryInput - this.inss;

    // Desconto de 189.59 no salário base para cada dependente
    this.irrf = this.handleIrrf(this.baseSalary - this.dependentsInput * 189.59);

    this.netSalary = Math.round((this.baseSalary - this.irrf - this.deductionInput) * 100) / 100;
  }

  private handleIrrf(salary) {
    // https://www.calculador.com.br/tabela/trabalhista/IRRF/2015
    return (
      Math.round(
        (salary < 1903.99
          ? 0
          : salary < 2826.66
          ? salary * 0.075 - 142.8
          : salary < 3751.06
          ? salary * 0.15 - 354.8
          : salary < 4664.68
          ? salary * 0.225 - 636.13
          : salary * 0.275 - 869.36) * 100
      ) / 100
    );
  }

  private handleInss(salary) {
    // https://www.calculador.com.br/tabela/trabalhista/INSS/2019
    return (
      Math.round(
        (salary < 1751.82
          ? salary * 0.08
          : salary < 2919.73
          ? salary * 0.09
          : salary < 5838.45
          ? salary * 0.11
          : 642.34) * 100
      ) / 100
    );
  }
}
