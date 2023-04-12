const pool = require('../config/pool');

const validarCamposCadUser = (req, res, next) => {
    try {
        const { nome, email, senha } = req.body
        if (!nome) return res.status(400).json("É obrigatório o preenchimento do campo nome");
        if (!email) return res.status(400).json("É obrigatório o preenchimento do campo email");
        if (!senha) return res.status(400).json("É obrigatório o preenchimento do campo senha");
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    };
};

const validarCamposCadTransacao = (req, res, next) => {
    try {
        const { descricao, valor, data, categoria_id, tipo } = req.body
        if (!descricao) return res.status(400).json("É obrigatório o preenchimento do campo descricao");
        if (!valor) return res.status(400).json("É obrigatório o preenchimento do campo valor");
        if (!data) return res.status(400).json("É obrigatório o preenchimento do campo data");
        if (!categoria_id) return res.status(400).json("É obrigatório o preenchimento do campo categoria_id");
        if (!tipo) return res.status(400).json("É obrigatório o preenchimento do campo tipo");
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    };
};

const validarCamposLogUser = (req, res, next) => {
    try {
        const { email, senha } = req.body
        if (!email.trim()) return res.status(400).json("É obrigatório o preenchimento do campo email");
        if (!senha.trim()) return res.status(400).json("É obrigatório o preenchimento do campo senha");
        next();
    } catch (error) {
        return res.status(500).json({ mensagemm: 'Erro interno do servidor' });
    };
};

const verificarEmailexiste = async (req, res, next) => {
    try {
        const { email } = req.body;
        const query = 'select * from usuarios where email = $1';
        const consulta = await pool.query(query, [email]);
        if (req.url == '/login') {
            if (consulta.rowCount != 0) {
                req.usuario = consulta.rows[0];
                next();
            } else {
                return res.status(400).json("Email ou senha inválida, verfique e tente novamente!");
            }
        };
        if (req.url == '/usuario') {
            if (consulta.rowCount != 0) {
                return res.status(400).json("O email informado já existe em nossa base de dados!");
            } else {
                req.usuario = consulta.rows;
                next();
            }
        };
    } catch (error) {
        return res.status(500).json({ mensagemm: 'Erro interno do servidor' });
    };
};

const verificarNovoEmailexiste = async (req, res, next) => {
    try {
        const { email } = req.body;
        const { id } = req.usuario;
        const query = 'select * from usuarios where email = $1 AND id != $2';
        const consulta = await pool.query(query, [email, id]);
        if (consulta.rowCount != 0) {
            return res.status(400).json({ mensagem: 'Não é possível atualizar, pois o email informado já consta em nossa base de dados' });
        };
        next();
    } catch (error) {
        return res.status(500).json({ mensagemm: 'Erro interno do servidor' });
    };
}
const verificarExisteTransacaoPertenceLogin = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: user_id } = req.usuario;
        const query = 'select * from transacoes where id = $1 AND usuario_id = $2';
        const transacao = (await pool.query(query, [id, user_id])).rows[0];
        if (!transacao) {
            return res.status(400).json({ mensagem: 'A transação solicitada não pertence ao usuário logado! Impossível continuar!' });
        };
        req.transacao = transacao;
        next();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    };
};
const verificaTipoTransacao = (req, res, next) => {
    try {
        const { tipo } = req.body;
        if (tipo != "entrada" && tipo != "saida") {
            return res.status(400).json({ mensagem: "O valor do campo tipo deve ser ENTRADA ou SAíDA" });
        }
        next()
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}
module.exports = {
    validarCamposCadUser,
    validarCamposLogUser,
    validarCamposCadTransacao,
    verificarEmailexiste,
    verificarNovoEmailexiste,
    verificarExisteTransacaoPertenceLogin,
    verificaTipoTransacao
}
