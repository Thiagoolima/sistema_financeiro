const express = require('express');
const { login } = require('../controladores/usuarios');
const { validarCamposLogUser, verificarEmailexiste } = require('../intermediarios/validacoes.js');
const { validaSenhaCorreta } = require('../intermediarios/validacoes_segurança');



const autenticacaoRotas = express.Router();
autenticacaoRotas.post('/login', validarCamposLogUser, verificarEmailexiste, validaSenhaCorreta, login);


module.exports = autenticacaoRotas