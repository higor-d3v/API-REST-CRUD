const knex = require("../bancoDeDados/conexao");
const schemaCadastroProduto = require("../validacoes/schemaCadastroProduto");
const schemaAtualizacaoProduto = require("../validacoes/schemaAtualizacaoProduto");

const cadastrarProduto = async (req, res) => {
    const { id: usuario_id } = req.usuario;
    let { body } = req;
    body = {...body, usuario_id};

    try {
        await schemaCadastroProduto.validate(body);
        
        const { rowCount } = await knex("produtos").insert(body);

        if (!rowCount) {
            return res.status(500).json({
                mensagem: "Não foi possível cadastrar o produto."
            });
        }
        return res.status(201).json();

    } catch (error) {
        return res.status(500).json({
            mensagem: error.message
        });
    }
};

const obterProdutos = async (req, res) => {
    const { id: usuario_id } = req.usuario;
    const { categoria } = req.query;

    try {
        if (categoria) {
            const produtos = await knex("produtos")
                .where({usuario_id})
                .andWhere({categoria});

            return res.status(200).json({produtos});
        }

        const produtos = await knex("produtos").where({usuario_id});
        return res.status(200).json({produtos});
    } catch (error) {
        return res.status(500).json({
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
        return res.status(500).json({
            mensagem: error.message
        });
    }
};

const atualizarProduto = async (req, res) => {
    const { id } = req.params;
    const { id: usuario_id } = req.usuario;

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
            .update(req.body);

        if (!atualizacaoProduto) {
                return res.status(500).json({
                    mensagem: "Não foi possível atualizar o produto"
                });
            }
    
        return res.status(204).json();
        
    } catch(error) {
        return res.status(500).json({
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
        if (!delecaoProduto) {
            return res.status(500).json({
                mensagem: "Não foi possível excluir o produto."
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
    cadastrarProduto,
    obterProdutos,
    obterProduto,
    atualizarProduto,
    excluirProduto
};
