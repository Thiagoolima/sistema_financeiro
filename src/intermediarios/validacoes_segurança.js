require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = process.env

const validaSenhaCorreta = async (req, res, next) => {
    try {
        const { senha: senhaCriptografada } = req.usuario;
        const { senha } = req.body;
        if (!req.usuario) {
            return res.status(400).json({ mensagem: "Não existe usuário com o e-mail informado!" });
        };
        const validar = await bcrypt.compare(senha, senhaCriptografada);
        if (!validar) {
            return res.status(401).json({ mensagem: "Senha incorreta, favor verifique e tente novamente!" });
        };
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno no servidor' });
    }
}


const validarToken = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const tokenInformado = authorization.slice(7);
        const validacao = jwt.verify(tokenInformado, JWT_SECRET_KEY);
        req.usuario = validacao;
        next();

    } catch (error) {
        return res.status(401).json({ mensagem: "Token inválido ou expirado!" });
    }
}


module.exports = {
    validaSenhaCorreta,
    validarToken
}