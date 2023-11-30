const { contas } = require('../database');
const { encontrarContaPeloNumero } = require('../helpers/helpers');

const validacaoParaDepositos = (req, res, next) => {
  const { numero_conta, valor } = req.body;

  if (!numero_conta) {
    return res.status(400).json({ mensagem: "Por favor preencha o campo com número da conta." })
  };

  const valorDepositado = Number(valor);

  if (valorDepositado <= 0) {
    return res.status(400).json({ mensagem: `O valor para depósitos tem que ser maior que zero.` })
  };

  const indiceDaContaEncontrada = contas.findIndex((conta) => {
    return conta.numeroConta === Number(numero_conta);
  });

  if (indiceDaContaEncontrada === -1) {
    return res.status(404).json({ mensagem: "Esse número de conta não existe!" })
  }

  next();
};


const validacaoParaSaques = (req, res, next) => {
  const { numero_conta, valor, senha } = req.body;

  if (!(numero_conta && valor)) {
    return res.status(400).json({ mensagem: "Por favor preencha o campo com número da conta e o valor." })
  };

  const valorASerSacado = Number(valor);

  if (valorASerSacado <= 0) {
    return res.status(400).json({ mensagem: `O valor para saque tem que ser maior que zero.` })
  };

  const numeroDaConta = Number(numero_conta);

  const contaLocalizada = encontrarContaPeloNumero(numeroDaConta);

  if (!contaLocalizada) {
    return res.status(404).json({ mensagem: "Número de conta não localizado." })
  }

  const senhaDigitada = senha;
  const senhaCorreta = contaLocalizada.usuario.senha;

  if (senhaDigitada !== senhaCorreta) {
    return res.status(400).json({ mensagem: "Senha incorreta." })
  }

  const saldoSuficiente = contaLocalizada.saldo >= Number(valor);

  if (saldoSuficiente) {
    next();
  } else {
    return res.status(400).json({ mensagem: "Saldo insuficiente para realizar saque." })
  }
};

const validacaoParaTransferir = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  if (!numero_conta_origem) {
    return res.status(400).json({ mensagem: "Por favor preencha o campo com número da conta de origem." })
  };
  if (!numero_conta_destino) {
    return res.status(400).json({ mensagem: "Por favor preencha o campo com número da conta de destino." })
  };
  if (!valor || valor <= 0) {
    return res.status(400).json({ mensagem: `O valor para transferências tem que ser maior que zero.` })
  }

  let contaOrigem = encontrarContaPeloNumero(numero_conta_origem);
  let contaDestino = encontrarContaPeloNumero(numero_conta_destino);

  if (!contaOrigem) {
    return res.status(404).json({ mensagem: "O número de conta de origem não existe." })
  }
  if (!contaDestino) {
    return res.status(404).json({ mensagem: "O número de conta de destino não existe." })
  }
  if (contaOrigem === contaDestino) {
    return res.status(404).json({ mensagem: "Não é permitido realizar transferências para a mesma conta que a de origem." })

  }

  const saldoSuficiente = contaOrigem.saldo >= Number(valor);

  const senhaCorreta = contaOrigem.usuario.senha === senha;

  if (!senhaCorreta) {
    return res.status(400).json({ mensagem: "Senha incorreta." })
  }

  if (!saldoSuficiente) {
    return res.status(400).json({ mensagem: "Saldo insuficiente." })
  }

  next();
}

module.exports = {
  validacaoParaDepositos,
  validacaoParaSaques,
  validacaoParaTransferir
}