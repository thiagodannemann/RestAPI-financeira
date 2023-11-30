const { encontrarContaPeloNumero, gerarExtratoOperacao } = require('../helpers/helpers');


const depositarQuantia = (req, res) => {

  const { numero_conta, valor } = req.body;

  let contaEncontrada = encontrarContaPeloNumero(numero_conta);

  const valorDepositado = Number(valor);

  contaEncontrada.saldo = contaEncontrada.saldo + valorDepositado;

  gerarExtratoOperacao('deposito', numero_conta, valor);

  res.status(200).json({ mensagem: "Depósito realizado com sucesso" });
};

const sacarQuantia = (req, res) => {
  const { numero_conta, valor } = req.body;
  gerarExtratoOperacao('saque', numero_conta, valor);
  res.status(200).json({ mensagem: "Saque realizado com sucesso!" });
};

const transferirQuantia = (req, res) => {
  const { numero_conta_origem, numero_conta_destino, valor } = req.body;

  let contaOrigem = encontrarContaPeloNumero(numero_conta_origem);
  let contaDestino = encontrarContaPeloNumero(numero_conta_destino);

  contaOrigem.saldo = contaOrigem.saldo - (Number(valor));
  contaDestino.saldo = contaDestino.saldo + (Number(valor));

  gerarExtratoOperacao('transferencia', numero_conta_origem, valor, numero_conta_destino);

  return res.status(200).json({ mensagem: "Transferência realizada com sucesso!" });
};

module.exports = {
  depositarQuantia,
  sacarQuantia,
  transferirQuantia
}

//2021-08-10 23:40:35