const conexao = require("../bancoDeDados/conexao");

const validarDisponibilidadeDeEmail = async (email) => {
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rowCount: emailsEncontrados } = await conexao.query(query, [email]);
    
    return emailsEncontrados; 
};

module.exports = validarDisponibilidadeDeEmail;
