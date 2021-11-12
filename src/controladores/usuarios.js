const knex = require("../bancoDeDados/conexao");
const schemaCadastroUsuario = require("../validacoes/schemaCadastroUsuario");
const schemaAtualizacaoUsuario = require("../validacoes/schemaAtualizacaoUsuario");
const validarDisponibilidadeDeEmail = require("../validacoes/validarDisponibilidadeEmail");
const criptografarSenha = require("../utilidades/criptografarSenha");

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    try {   
        await schemaCadastroUsuario.validate(req.body);
        if (await validarDisponibilidadeDeEmail(email)) {
            return res.status(400).json({
                mensagem: "email já cadastrado."
             });
        }
        
        const hash = await criptografarSenha(senha);
        const { rowCount: cadastroDoUsuario} = await knex("usuarios")
            .insert({nome, email, senha: hash, nome_loja});

        if (!cadastroDoUsuario) {
            return res.status(500).json({
                mensagem: "Não foi possível cadastrar o usuário."
            });
        }

        return res.status(201).json();

    } catch (error) {
        return res.status(500).json({
            mensagem: error.message
        });
    }
};

const detalharUsuario = async (req, res) => {
    res.status(200).json(req.usuario);
};

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
    const { id } = req.usuario;

    try {
        await schemaAtualizacaoUsuario.validate(req.body);
        
        if (email && await validarDisponibilidadeDeEmail(email)) {
            return res.status(400).json({
                mensagem: "email já cadastrado."
             });
        }
    
        const hash = senha ? await criptografarSenha(senha): undefined;
        
        const atualizacaoDeUsuario = await knex("usuarios")
            .where({id})
            .update({email, senha: hash, nome, nome_loja});

        if (!atualizacaoDeUsuario) {
            return res.status(500).json({
                mensagem: "Não foi possível atualizar o usuário."
            });
        }

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({
            mensagem: error.message
        });
    }
};

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
};
