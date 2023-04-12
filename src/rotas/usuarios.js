const express = require('express');
const { novoUsuario, detalharUsuario, atualizarUsuario } = require('../controladores/usuarios');
const { validarCamposCadUser, verificarEmailexiste, verificarNovoEmailexiste } = require('../intermediarios/validacoes.js');


const usuariosRotas = express.Router();
usuariosRotas.post('/usuario', validarCamposCadUser, verificarEmailexiste, novoUsuario);




const usuariosRotasProt = express.Router();
usuariosRotasProt.get('/usuario', detalharUsuario);
usuariosRotasProt.put('/usuario', validarCamposCadUser, verificarNovoEmailexiste, atualizarUsuario);


module.exports = {
    usuariosRotas,
    usuariosRotasProt
}
