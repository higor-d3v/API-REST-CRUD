const knex = require("../bancoDeDados/conexao");

const validarDisponibilidadeDeEmail = async (email) => {
    const emailsEncontrados = await knex("usuarios").where({email});
    return emailsEncontrados.length; 
};

module.exports = validarDisponibilidadeDeEmail;
