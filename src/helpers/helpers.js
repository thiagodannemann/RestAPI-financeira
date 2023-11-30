const { contas, saques, depositos, transferencias } = require('../database')
const { format } = require('date-fns');

function encontrarContaPeloNumero(numeroConta) {
  const contaEncontrada = contas.find((conta) => {
    return conta.numeroConta === Number(numeroConta)
  });
  return contaEncontrada;
}

function verificarDigitosCPF(cpf) {
  const cpfNumber = Number(cpf);
  if (cpf.length === 11 && cpfNumber >= 0 && cpfNumber <= 99999999999) {
    return true
  } else {
    return false
  }
}

function encontrarContaPeloCPF(cpf) {
  const contaEncontrada = contas.find((conta) => conta.usuario.cpf === cpf);
  return contaEncontrada;
};

function encontrarContaPeloEmail(email) {
  const contaEncontrada = contas.find((conta) => {
    return conta.usuario.email === email
  });
  return contaEncontrada;
};

function gerarExtratoOperacao(tipoDeOperacao, numero_conta_origem, valor, numero_conta_destino = null) {
  if (tipoDeOperacao === "saque") {
    const comprovanteDeOperacao = {
      data: format(new Date(), "yyyy'-'MM'-'dd' 'k':'mm':'ss"),
      numero_conta: Number(numero_conta_origem),
      valor: Number(valor)
    };
    saques.push(comprovanteDeOperacao);
  }
  if (tipoDeOperacao === "deposito") {
    const comprovanteDeOperacao = {
      data: format(new Date(), "yyyy'-'MM'-'dd' 'k':'mm':'ss"),
      numero_conta: Number(numero_conta_origem),
      valor: Number(valor)
    };
    depositos.push(comprovanteDeOperacao);
  }
  if (tipoDeOperacao === "transferencia") {
    const comprovanteDeOperacao = {
      data: format(new Date(), "yyyy'-'MM'-'dd' 'k':'mm':'ss"),
      numero_conta_origem: Number(numero_conta_origem),
      numero_conta_destino: Number(numero_conta_destino),
      valor: Number(valor)
    };
    transferencias.push(comprovanteDeOperacao);
  }
}


module.exports = {
  encontrarContaPeloNumero,
  verificarDigitosCPF,
  encontrarContaPeloCPF,
  encontrarContaPeloEmail,
  gerarExtratoOperacao
}