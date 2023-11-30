const express = require('express');
const routes = express();

const { validarSenhaBanco, validacaoParaExtratos, validacaoParaExibirSaldo, validacaoParaCriarConta, validacaoParaEditarConta, validacaoParaDeletarConta } = require('./middlewares/middlewares.contas');
const { listarContas, exibirExtrato, exibirSaldoEmConta, criarConta, editarConta, deletarConta } = require('./controllers/contas');
const { validacaoParaDepositos, validacaoParaSaques, validacaoParaTransferir } = require('./middlewares/middlewares.transacoes');
const { depositarQuantia, sacarQuantia, transferirQuantia } = require('./controllers/transacoes');

routes.get('/contas', validarSenhaBanco, listarContas);
routes.get('/contas/extrato', validacaoParaExtratos, exibirExtrato);
routes.get('/contas/saldo', validacaoParaExibirSaldo, exibirSaldoEmConta);
routes.post('/contas', validacaoParaCriarConta, criarConta);
routes.put('/contas/:numeroConta/usuario', validacaoParaEditarConta, editarConta);
routes.delete('/contas/:numeroConta', validacaoParaDeletarConta, deletarConta);

routes.post('/transacoes/depositar', validacaoParaDepositos, depositarQuantia);
routes.post('/transacoes/sacar', validacaoParaSaques, sacarQuantia);
routes.post('/transacoes/transferir', validacaoParaTransferir, transferirQuantia);


module.exports = routes;