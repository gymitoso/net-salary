window.addEventListener("load", start);

let form, grossSalaryInput, dependentsInput, deductionInput;
let baseSalary, netSalary, inss, irrf;
let grossSalaryLabel,
  grossSalaryError,
  netSalaryLabel,
  deductionLabel,
  inssLabel,
  irrfLabel;

function start() {
  initInputs();
  initLabels();
  initEvents();

  grossSalary.value = 998.0;
  dependents.value = 0;
  deduction.value = 0;

  calculateNetSalary();
}

function initInputs() {
  form = document.querySelector("form");
  grossSalaryInput = document.querySelector("#grossSalary");
  dependentsInput = document.querySelector("#dependents");
  deductionInput = document.querySelector("#deduction");
}

function initLabels() {
  grossSalaryLabel = document.querySelector("#grossSalaryLabel");
  grossSalaryError = document.querySelector("#grossSalaryError");
  netSalaryLabel = document.querySelector("#netSalaryLabel");
  deductionLabel = document.querySelector("#deductionLabel");
  inssLabel = document.querySelector("#inssLabel");
  irrfLabel = document.querySelector("#irrfLabel");
}

function initEvents() {
  form.addEventListener("submit", handleSubmit);
  grossSalaryInput.addEventListener("keyup", handleGrossSalary);
  grossSalaryInput.addEventListener("change", handleGrossSalary);
  dependentsInput.addEventListener("keyup", handleDependents);
  dependentsInput.addEventListener("change", handleDependents);
  deductionInput.addEventListener("keyup", handleDeduction);
  deductionInput.addEventListener("change", handleDeduction);
}

function handleSubmit(event) {
  // Impede o refresh da página
  event.preventDefault();
}

function handleGrossSalary() {
  // Valida se o valor é maior que o salário mínimo
  if (grossSalaryInput.value < 998) {
    grossSalaryError.classList.add("error");
    return;
  }

  grossSalaryError.classList.remove("error");

  calculateNetSalary();
}

function handleDependents() {
  if (dependentsInput.value < 0) {
    dependentsInput.value = 0;
    return;
  }

  calculateNetSalary();
}

function handleDeduction() {
  if (deductionInput.value < 0) {
    deductionInput.value = 0;
    return;
  }

  calculateNetSalary();
}

function calculateNetSalary() {
  function handleIrrf(salary) {
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

  function handleInss(salary) {
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

  // Valida se o valor é maior que o salário mínimo
  if (grossSalaryInput.value < 998) {
    return;
  }

  inss = handleInss(grossSalaryInput.value);
  baseSalary = grossSalaryInput.value - inss;

  // Desconto de 189.59 no salário base para cada dependente
  irrf = handleIrrf(baseSalary - dependentsInput.value * 189.59);

  netSalary = Math.round((baseSalary - irrf - deduction.value) * 100) / 100;

  renderValues();
}

function renderValues() {
  inssLabel.textContent = "R$" + inss;
  irrfLabel.textContent = "R$" + irrf;
  netSalaryLabel.textContent = "R$" + netSalary;
  grossSalaryLabel.textContent = "R$" + grossSalaryInput.value;
  deductionLabel.textContent = "R$" + deductionInput.value;
}
