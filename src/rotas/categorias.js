const express = require('express');
const { listarCategorias } = require('../controladores/categorias');




const categoriasRotas = express.Router();
categoriasRotas.get('/categoria', listarCategorias);



module.exports = categoriasRotas