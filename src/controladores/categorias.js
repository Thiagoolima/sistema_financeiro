const pool = require('../config/pool')
const listarCategorias = async (req, res) => {
    try {
        const query = 'select * from categorias';
        const consulta = (await pool.query(query)).rows;
        return res.status(200).json(consulta);
    } catch (error) {
        return res.status(500).json({ mensagem: 'erro interno no servidor' });
    }
}

module.exports = {
    listarCategorias
}