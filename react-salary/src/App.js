import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [grossSalaryInput, setGrossSalaryInput] = useState(998);
  const [dependentsInput, setDependentsInput] = useState(0);
  const [deductionInput, setDeductionInput] = useState(0);

  const [, setBaseSalary] = useState();
  const [netSalary, setNetSalary] = useState();
  const [inss, setInss] = useState();
  const [irrf, setIrrf] = useState();

  useEffect(() => {
    calculateNetSalary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateNetSalary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grossSalaryInput, dependentsInput, deductionInput]);

  function calculateNetSalary() {
    // Valida se o valor é maior que o salário mínimo ou os dependentes/dedução são negativos
    if (grossSalaryInput < 998 || dependentsInput < 0 || deductionInput < 0) {
      return;
    }

    const tempInss = handleInss(grossSalaryInput);
    const tempBasesalary = grossSalaryInput - tempInss;

    // Desconto de 189.59 no salário base para cada dependente
    const tempIrrf = handleIrrf(tempBasesalary - dependentsInput * 189.59);

    setNetSalary(
      Math.round((tempBasesalary - tempIrrf - deductionInput) * 100) / 100
    );
    setBaseSalary(tempBasesalary);
    setInss(tempInss);
    setIrrf(tempIrrf);
  }

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

  return (
    <div className="container d-flex justify-content-center">
      <div className="card">
        <div className="card-body">
          <form>
            <div className="form-group">
              <label>Salário Bruto (R$)</label>
              <input
                type="number"
                className="form-control"
                id="grossSalary"
                aria-describedby="grossSalary"
                min="998"
                value={grossSalaryInput}
                onChange={(e) => setGrossSalaryInput(e.target.value)}
              />
              {grossSalaryInput < 998 ? (
                <small className="mt-1 error" id="grossSalaryError">
                  Apenas valores maiores que 998
                </small>
              ) : null}
            </div>
            <div className="form-group">
              <label>Número de dependentes</label>
              <input
                type="number"
                className="form-control"
                id="dependents"
                aria-describedby="dependents"
                min="0"
                value={dependentsInput}
                onChange={(e) => setDependentsInput(e.target.value)}
              />
              {dependentsInput < 0 ? (
                <small className="mt-1 error" id="dependentsError">
                  Apenas valores positivos
                </small>
              ) : null}
            </div>
            <div className="form-group">
              <label>Outros descontos (R$)</label>
              <input
                type="number"
                className="form-control"
                id="deduction"
                aria-describedby="deduction"
                min="0"
                value={deductionInput}
                onChange={(e) => setDeductionInput(e.target.value)}
              />
              {deductionInput < 0 ? (
                <small className="mt-1 error" id="deductionError">
                  Apenas valores positivos
                </small>
              ) : null}
            </div>
          </form>
          <div className="row">
            <div className="col-md-6">
              <span>Salário Bruto:</span>
              <p id="grossSalaryLabel">R$ {grossSalaryInput} </p>
            </div>
            <div className="col-md-6">
              <span>INSS:</span>
              <p id="inssLabel">R$ {inss}</p>
            </div>
            <div className="col-md-6">
              <span>IRRF:</span>
              <p id="irrfLabel">R$ {irrf}</p>
            </div>
            <div className="col-md-6">
              <span>Descontos:</span>
              <p id="deductionLabel">R$ {deductionInput}</p>
            </div>
            <div className="col-12 text-center">
              <span>Salário Líquido:</span>
              <p id="netSalaryLabel" className="net-salary">
                R$ {netSalary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
