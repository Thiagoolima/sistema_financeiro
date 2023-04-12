const pool = require('../config/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET_KEY } = process.env;

const novoUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const senhaEncript = await bcrypt.hash(senha, 10);
        const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *';
        const params = [nome, email, senhaEncript];
        const cadastrar = await pool.query(query, params);
        const { id } = cadastrar.rows[0];
        console.log(cadastrar.rows);
        return res.status(201).json(
            {
                id,
                nome,
                email
            }
        );
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

const login = async (req, res) => {
    try {
        const { id, nome, email } = req.usuario;
        const token = jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json(
            {
                usuario:
                {
                    id,
                    nome,
                    email
                },
                token
            }

        );
    } catch (error) {
        return res.status(500).json({ mensagemm: 'Erro interno do servidor' });
    }
}

const detalharUsuario = async (req, res) => {
    try {
        const { id } = req.usuario;
        const query = 'select * from usuarios where id = $1';
        const consulta = (await pool.query(query, [id])).rows[0];
        const { senha, ...resposta } = consulta;
        return res.status(200).json(resposta);
    } catch (error) {
        return res.status(500).json({ mensagemm: 'Erro interno do servidor' });
    }
}

const atualizarUsuario = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const { id } = req.usuario;
        const senhaEncript = await bcrypt.hash(senha, 10);
        const query = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4';
        await pool.query(query, [nome, email, senhaEncript, id]);
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagemm: 'Erro interno do servidor' });
    }
}

module.exports = {
    novoUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
}