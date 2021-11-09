const knex = require("../bancoDeDados/conexao");
const schemaCadastroProduto = require("../validacoes/schemaCadastroProduto");
const schemaAtualizacaoProduto = require("../validacoes/schemaAtualizacaoProduto");

const cadastrarProduto = async (req, res) => {
    const { id } = req.usuario;
    const { nome, quantidade, preco, descricao, categoria, imagem } = req.body;

    try {
        await schemaCadastroProduto.validate(req.body);
        
        const { rowCount: cadastroDoProduto } = await knex("produtos")
            .insert({
                usuario_id: id,
                nome,
                quantidade,
                preco,
                descricao,
                categoria,
                imagem
                });

        if (!cadastroDoProduto) {
            return res.status(400).json({
                mensagem: "'Não foi possível cadastrar o produto.'"
            });
        }
        return res.status(201).json();

    } catch (error) {
        return res.status(400).json({
            mensagem: error.message
        });
    }
};

const obterProdutos = async (req, res) => {
    const { id } = req.usuario;
    const { categoria } = req.query;

    try {
        if (categoria) {
            const produtos = await knex("produtos")
                .where({usuario_id: id})
                .andWhere({categoria});

            return res.status(200).json({produtos});
        }

        const produtos = await knex("produtos").where({usuario_id: id});
        
        if (!produtos.length) {
            return res.status(404).json({
                mensagem: "Não existem produtos para este usuário."
            });
        }

        return res.status(200).json({produtos});
    } catch (error) {
        return res.status(400).json({
            mensagem: error.message
        });
    }
};

const obterProduto = async (req, res) => {
    const { id: usuario_id } = req.usuario;
    const { id } = req.params;

    try {
        const produto = await knex("produtos")
        .where({id})
        .andWhere({usuario_id})
        .first();

        if (!produto) {
            return res.status(404).json({
                mensagem: "O produto buscado não existe."
            });
        }

        return res.status(200).json({produto});
    } catch (error) {
        return res.status(400).json({
            mensagem: error.message
        });
    }
};

const atualizarProduto = async (req, res) => {
    const { id } = req.params;
    const { id: usuario_id } = req.usuario;
    const { nome, quantidade, preco, descricao, categoria, imagem } = req.body;

    try {
        await schemaAtualizacaoProduto.validate(req.body);
       
        const produto = await knex("produtos")
            .where({id})
            .andWhere({usuario_id})
            .first();

        if (!produto) {
            return res.status(404).json({
                mensagem: "O produto buscado não existe."
            });
        }

        const atualizacaoProduto = await knex("produtos")
            .where({id})
            .update({
                nome,
                preco,
                quantidade,
                descricao,
                categoria,
                imagem
            });

        if (!atualizacaoProduto) {
                return res.status(400).json({
                    mensagem: "Não foi possível atualizar o produto"
                });
            }
    
        return res.status(204).json();
        
    } catch(error) {
        return res.status(400).json({
            mensagem: error.message
        });
    }
};

const excluirProduto = async (req, res) => {
    const { id } = req.params;
    const { id: usuario_id } = req.usuario;
    
    try {
        const delecaoProduto = await knex("produtos")
        .where({id})
        .andWhere({usuario_id})
        .del()
        console.log(delecaoProduto)
        if (!delecaoProduto) {
            return res.status(400).json({
                mensagem: "Não foi possível excluir o produto."
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
    cadastrarProduto,
    obterProdutos,
    obterProduto,
    atualizarProduto,
    excluirProduto
};
