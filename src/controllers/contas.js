let { contas, contadorDeNumerosDaConta, depositos: registrosDepositos, saques: registrosSaques, transferencias: registrosTransferencias } = require('../database');
const { encontrarContaPeloNumero } = require('../helpers/helpers');

const listarContas = (req, res) => {
  res.status(200).send(contas);
};

const exibirExtrato = (req, res) => {
  const { numero_conta } = req.query;

  const numeroDaConta = Number(numero_conta);

  const depositos = registrosDepositos.filter((deposito) => {
    return deposito.numero_conta === numeroDaConta;
  });
  const saques = registrosSaques.filter((saque) => {
    return saque.numero_conta === numeroDaConta;
  });
  const transferenciasEnviadas = registrosTransferencias.filter((transferencia) => {
    return transferencia.numero_conta_origem === numeroDaConta;
  });
  const transferenciasRecebidas = registrosTransferencias.filter((transferencia) => {
    return transferencia.numero_conta_destino === numeroDaConta;
  });

  const extrato = {
    depositos,
    saques,
    transferenciasEnviadas,
    transferenciasRecebidas
  };

  res.status(200).json({ extrato });
}

const exibirSaldoEmConta = (req, res) => {
  const { numero_conta } = req.query;
  const contaEncontrada = encontrarContaPeloNumero(numero_conta);
  const saldoDaConta = contaEncontrada.saldo;

  const saldoExibido = { saldo: saldoDaConta };

  return res.status(200).json(saldoExibido);
};

const criarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const contaCriada = {
    numeroConta: contadorDeNumerosDaConta++,
    saldo: 0,
    usuario: {
      nome: nome.trim(),
      cpf,
      data_nascimento,
      telefone,
      email,
      senha
    }
  }

  contas.push(contaCriada);

  res.status(201).json();
};

const editarConta = (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
  const { numeroConta } = req.params;

  let contaAlterada = encontrarContaPeloNumero(numeroConta);

  if (nome) {
    contaAlterada.usuario.nome = nome.trim();
  }
  if (cpf) {
    contaAlterada.cpf = cpf;
  }
  if (data_nascimento) {
    contaAlterada.data_nascimento = data_nascimento;
  }
  if (telefone) {
    contaAlterada.telefone = telefone;
  }
  if (email) {
    contaAlterada.email = email;
  }
  if (senha) {
    contaAlterada.senha = senha;
  }
  return res.status(200).json({ mensagem: "Conta atualizada com sucesso" })
};

const deletarConta = (req, res) => {
  const { numeroConta } = req.params;
  const indiceDaConta = contas.findIndex((conta) => {
    return conta.numeroConta === Number(numeroConta);
  })

  contas.splice(indiceDaConta, 1);

  res.status(200).json({ mensagem: "Conta excluída com sucesso." })
};

module.exports = {
  listarContas,
  exibirExtrato,
  exibirSaldoEmConta,
  criarConta,
  editarConta,
  deletarConta
};
