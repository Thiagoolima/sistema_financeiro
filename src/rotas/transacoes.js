const express = require('express');
const { listarTransacao, obterExtrato, detalharTransacao, cadatraTransacao, atualizarTransacao, excluirTransacao } = require("../controladores/transacao");
const { verificarExisteTransacaoPertenceLogin, validarCamposCadTransacao, verificaTipoTransacao } = require("../intermediarios/validacoes.js");

const transacoesRotas = express.Router();
transacoesRotas.get('/transacao', listarTransacao);
transacoesRotas.get('/transacao/extrato', obterExtrato);
transacoesRotas.get('/transacao/:id', verificarExisteTransacaoPertenceLogin, detalharTransacao);
transacoesRotas.post('/transacao', validarCamposCadTransacao, verificaTipoTransacao, cadatraTransacao);
transacoesRotas.put('/transacao/:id', validarCamposCadTransacao, verificarExisteTransacaoPertenceLogin, atualizarTransacao);
transacoesRotas.delete('/transacao/:id', verificarExisteTransacaoPertenceLogin, excluirTransacao);


module.exports = transacoesRotas;