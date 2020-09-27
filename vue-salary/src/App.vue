<template>
  <div class="container d-flex justify-content-center">
    <div class="card">
      <div class="card-body">
        <form>
          <div class="form-group">
            <label for="grossSalary">Salário Bruto (R$)</label>
            <input
              type="number"
              class="form-control"
              id="grossSalary"
              aria-describedby="grossSalary"
              min="998"
              v-model="grossSalaryInput"
              v-on:input="calculateNetSalary"
            />
            <small
              class="mt-1 error"
              id="grossSalaryError"
              v-if="grossSalaryInput < 998"
              >Apenas valores maiores que 998</small
            >
          </div>
          <div class="form-group">
            <label for="dependents">Número de dependentes</label>
            <input
              type="number"
              class="form-control"
              id="dependents"
              aria-describedby="dependents"
              min="0"
              v-model="dependentsInput"
              v-on:input="calculateNetSalary"
            />
            <small class="mt-1 error" v-if="dependentsInput < 0"
              >Apenas valores positivos</small
            >
          </div>
          <div class="form-group">
            <label for="deduction">Outros descontos (R$)</label>
            <input
              type="number"
              class="form-control"
              id="deduction"
              aria-describedby="deduction"
              min="0"
              v-model="deductionInput"
              v-on:input="calculateNetSalary"
            />
            <small class="mt-1 error" v-if="deductionInput < 0"
              >Apenas valores positivos</small
            >
          </div>
        </form>
        <div class="row">
          <div class="col-md-6">
            <span>Salário Bruto:</span>
            <p id="grossSalaryLabel">R${{ grossSalaryInput }}</p>
          </div>
          <div class="col-md-6">
            <span>INSS:</span>
            <p id="inssLabel">R${{ inss }}</p>
          </div>
          <div class="col-md-6">
            <span>IRRF:</span>
            <p id="irrfLabel">R${{ irrf }}</p>
          </div>
          <div class="col-md-6">
            <span>Descontos:</span>
            <p id="deductionLabel">R${{ deductionInput }}</p>
          </div>
          <div class="col-12 text-center">
            <span>Salário Líquido:</span>
            <p id="netSalaryLabel" class="net-salary">R${{ netSalary }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      grossSalaryInput: 998,
      dependentsInput: 0,
      deductionInput: 0,
      netSalary: 0,
      inss: 0,
      irrf: 0,
    };
  },
  mounted() {
    this.calculateNetSalary();
  },
  methods: {
    calculateNetSalary() {
      // Valida se o valor é maior que o salário mínimo ou os dependentes/dedução são negativos
      if (
        this.grossSalaryInput < 998 ||
        this.dependentsInput < 0 ||
        this.deductionInput < 0
      ) {
        return;
      }

      this.inss = this.handleInss(this.grossSalaryInput);
      const baseSalary = this.grossSalaryInput - this.inss;

      // Desconto de 189.59 no salário base para cada dependente
      this.irrf = this.handleIrrf(baseSalary - this.dependentsInput * 189.59);

      this.netSalary =
        Math.round((baseSalary - this.irrf - this.deductionInput) * 100) / 100;
    },
    handleIrrf(salary) {
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
    },
    handleInss(salary) {
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
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: #2c3338;
}

.card {
  align-items: center;
  background: #1a2226;
  width: 100%;
  max-width: 500px;
  color: #fff;
}

.card-body {
  width: 100%;
}

.btn-primary {
  float: right;
}

span {
  font-weight: bold;
}

.error {
  color: red;
  display: block !important;
}

.net-salary {
  color: green;
  font-size: 24px;
}
</style>
