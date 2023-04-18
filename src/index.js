const express = require('express');
const { validarToken } = require('./intermediarios/validacoes_segurança');
const autenticacaoRotas = require('./rotas/autenticacao');
const categoriasRotas = require('./rotas/categorias');
const transacoesRotas = require('./rotas/transacoes');
const { usuariosRotas, usuariosRotasProt } = require('./rotas/usuarios');
require('dotenv').config();
console.log(__dirname)

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.use(autenticacaoRotas);
app.use(usuariosRotas);
app.use(validarToken);
app.use(usuariosRotasProt)
app.use(categoriasRotas);
app.use(transacoesRotas);


app.listen(PORT, console.log(`Servidor iniciado na porta ${PORT}`));