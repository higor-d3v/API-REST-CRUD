const bcrypt = require("bcrypt");
const conexao = require("../bancoDeDados/conexao");
const schemaValidacaoUsuario = require("../validacoes/schemaValidacaoUsuario");
const validarDisponibilidadeDeEmail = require("../validacoes/validarDisponibilidadeEmail");

const detalharUsuario = async (req, res) => {
    const { usuario } = req;
    res.status(200).json({
        usuario: usuario
    });
};

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    try {   
        await schemaValidacaoUsuario.validate(req.body);
        if (await validarDisponibilidadeDeEmail(email)) {
            return res.status(400).json({
                mensagem: "email já cadastrado."
             });
        }
        
        const hash = await bcrypt.hash(senha, 10);
        let query = 
        `INSERT INTO usuarios (nome, email, senha, nome_loja)
        VALUES($1, $2, $3, $4)`;

        const { rowCount } = await conexao.query(query, [nome, email, hash, nome_loja]);

        if (!rowCount) {
            return res.status(400).json({
                mensagem: "Não foi possível cadastrar o usuário."
            });
        }

        return res.status(204).json();

    } catch (error) {
        return res.status(400).json({
            mensagem: error.message
        });
    }
};

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
    const { id } = req.usuario;

    try {
        await schemaValidacaoUsuario.validate(req.body);
        
        if (await validarDisponibilidadeDeEmail(email)) {
            return res.status(400).json({
                mensagem: "email já cadastrado."
             });
        }
    
        const hash = await bcrypt.hash(senha, 10);
        const query = 
        `UPDATE usuarios
        SET nome = $1,
        email = $2,
        senha = $3,
        nome_loja = $4
        WHERE id = $5`;
        
        const camposDoBodyMaisId = [nome, email, hash, nome_loja, id];
        const { rowCount: atualizacaoDeUsuario } = await conexao.query(query, camposDoBodyMaisId);

        if (!atualizacaoDeUsuario) {
            return res.status(400).json({
                mensagem: "Não foi possível atualizar o usuário."
            });
        }

        return res.status(204).json();

    } catch (error) {
        return res.status(400).json({
            mensagem: error.message
        });
    }
};

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
};
