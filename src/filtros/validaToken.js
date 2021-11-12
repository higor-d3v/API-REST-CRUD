const jwt = require('jsonwebtoken');
const knex = require('../bancoDeDados/conexao');

const validaToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            mensagem: 'É necessário autenticar-se para prosseguir.'
        });
    }

    try {
        const token = authorization.replace('Bearer', '').trim();
        const { id } = jwt.verify(token, process.env.JWT_KEY);

        const usuario = await knex("usuarios").where({id}).first();

        if (!usuario) {
            return res.status(401).json({
                mensagem: 'Não foi possível localizar o usuário.'
            })
        }

        const { nome, email, nome_loja } = usuario;
        const dadosUsuario = {id, nome, email, nome_loja};
        req.usuario = {...dadosUsuario};
        next();

    } catch (error) {
        return res.status(500).json({
            mensagem: error.message
        })
    }
    
}

module.exports = validaToken;
