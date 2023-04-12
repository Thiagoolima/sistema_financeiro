const pool = require('../config/pool');

async function listarTransacao(req, res) {
    try {
        const { id } = req.usuario;
        const { filtro } = req.query;
        const existeQuery = Object.keys(req.query);
        if (existeQuery.length != 0) {
            const queryCategoria = 'select array_agg(id) as "listaId" from categorias where descricao = ANY($1)';
            const idCategoria = (await pool.query(queryCategoria, [filtro])).rows[0];
            const { listaId } = idCategoria;
            const query = `select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes t join categorias c on t.categoria_id = c.id where usuario_id = ${id} AND categoria_id = ANY($1)`;
            const consulta = (await pool.query(query, [listaId])).rows;
            return res.status(200).json(consulta);
        }
        const query = `select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes t join categorias c on t.categoria_id = c.id where usuario_id = ${id}`;
        const consulta = (await pool.query(query)).rows;
        return res.status(200).json(consulta);
    } catch (error) {
        return res.status(500).json({ mensagemm: 'Erro interno do servidor' });
    }
}

async function detalharTransacao(req, res) {
    try {
        const id = req.params.id;
        const queryCategoria = `select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome from transacoes t join categorias c on t.categoria_id = c.id where t.id = $1`;
        const consulta = await pool.query(queryCategoria, [id]);
        if (consulta.rowCount === 0) {
            return res.status(404).json({ mensagemm: 'Transação não existente' });
        }
        return res.status(200).json(consulta.rows[0]);
    } catch (error) {
        return res.status(500).json({ mensagemm: 'Erro interno do servidor' });
    }
}

async function cadatraTransacao(req, res) {
    const { id: usuario_id } = req.usuario;
    const { descricao, valor, data, categoria_id, tipo } = req.body;
    try {
        const query = `
        insert into transacoes (descricao, valor,data,categoria_id,tipo,usuario_id)
        values ($1,$2,$3,$4,$5,$6) returning id, tipo, descricao, valor, data, usuario_id, categoria_id, (select descricao as categoria_nome from categorias where id = $4)`;
        const transacoes = await pool.query(query, [descricao, valor, data, categoria_id, tipo, usuario_id]);
        return res.status(201).json(transacoes.rows[0]);
    } catch (error) {
        if (error.code == 23503) {
            return res.status(404).json({ mensagem: 'A categoria informada não existe.' });
        }
        if (error.code == '22P02') {
            return res.status(404).json({ mensagem: 'A entrada de valor deve ser um número!' });
        }
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

async function atualizarTransacao(req, res) {
    try {
        const { id } = req.params;
        const { descricao, valor, data, categoria_id, tipo } = req.body;
        const query = `
        update transacoes set
        descricao = $1,
        valor = $2,
        data = $3,
        categoria_id = $4,
        tipo = $5
        where id = $6`;
        await pool.query(query, [descricao, valor, data, categoria_id, tipo, id]);
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagemm: "Erro interno do servidor" });
    }
}

async function excluirTransacao(req, res) {
    try {
        const { id } = req.params;
        const query = 'delete from transacoes where id = $1';
        await pool.query(query, [id]);
        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagemm: 'Erro interno do servidor' });
    }
}

const obterExtrato = async (req, res) => {
    try {
        const { id } = req.usuario;
        const query = `select
        coalesce(sum(valor) filter (where tipo = 'entrada'), 0) as entrada,
        coalesce(SUM(valor) filter (where tipo = 'saida'), 0) as saida
        from transacoes where usuario_id = $1;`;
        const consulta = await pool.query(query, [id]);
        return res.status(200).json(consulta.rows[0]);
    } catch (error) {
        return res.status(500).json({ mensagemm: 'Erro interno do servidor' });
    }

}

module.exports = {
    listarTransacao,
    detalharTransacao,
    cadatraTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato
}