const conexao = require("../bancoDeDados/conexao");
const schemaCadastroProduto = require("../validacoes/schemaCadastroProduto");
const schemaAtualizacaoProduto = require("../validacoes/schemaAtualizacaoProduto");

const cadastrarProduto = async (req, res) => {
    const { id } = req.usuario;
    const { nome, quantidade, preco, descricao, categoria, imagem } = req.body;

    try {
        await schemaCadastroProduto.validate(req.body);
        const query =
         `INSERT INTO produtos (nome, quantidade, preco, descricao, categoria, imagem, usuario_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        const { rowCount } = await conexao.query(query, [nome, quantidade, preco, descricao, categoria, imagem, id]);

        if (!rowCount) {
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

    if (categoria) {
        try {
            const query = "SELECT * FROM produtos WHERE usuario_id = $1 AND UPPER(categoria) = $2";
            const { rowCount, rows } = await conexao.query(query, [id, categoria.toUpperCase()]);
    
            if (!rowCount) {
                return res.status(404).json({
                    mensagem: "Não existem produtos para este usuário nesta categoria."
                });
            }
    
            return res.status(200).json({
                produtos: rows
            });
        } catch (error) {
            return res.status(400).json({
                mensagem: "Não foi possível obter os produtos."
            });
        }
    }

    try {
        const query = "SELECT * FROM produtos WHERE usuario_id = $1";
        const { rowCount, rows } = await conexao.query(query, [id]);

        if (!rowCount) {
            return res.status(404).json({
                mensagem: "Não existem produtos para este usuário."
            });
        }

        return res.status(200).json({
            produtos: rows
        });
    } catch (error) {
        return res.status(400).json({
            mensagem: error.message
        });
    }
};

const obterProduto = async (req, res) => {
    const { id } = req.usuario;
    const { id: produto_id } = req.params;

    try {
        const query = "SELECT * FROM produtos WHERE id = $1";
        const { rowCount, rows } = await conexao.query(query, [produto_id]);

        if (!rowCount) {
            return res.status(404).json({
                mensagem: "O produto buscado não existe."
            });
        }

        if (rows[0].usuario_id !== id) {
            return res.status(403).json({
                mensagem: "Este usuário não tem acesso ao produto."
            });
        }

        return res.status(200).json({
            produto: rows[0]
        });
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

        let query = "SELECT * FROM produtos WHERE id = $1";
        const { rowCount, rows } = await conexao.query(query, [id]);

        if (!rowCount) {
            return res.status(404).json({
                mensagem: "O produto buscado não existe."
            });
        }

        if (rows[0].usuario_id !== usuario_id) {
            return res.status(403).json({
                mensagem: "Este usuário não tem acesso ao produto."
            });
        }
        if (!categoria && !imagem) {
            query = 
            `UPDATE produtos SET nome = $1,
            preco = $2,
            quantidade = $3,
            descricao = $4
            WHERE id = $5`;

            const { rowCount: atualizacaoSemCamposObrigatorios } = await conexao.query(query, [nome, preco, quantidade, descricao, id]);
            if (!atualizacaoSemCamposObrigatorios) {
                return res.status(400).json({
                    mensagem: "Não foi possível atualizar o produto"
                });
            }

            return res.status(204).json();
        }

        if (!imagem) {
            query = 
            `UPDATE produtos SET nome = $1,
            preco = $2,
            quantidade = $3,
            descricao = $4,
            categoria = $5
            WHERE id = $6`;

            const { rowCount } = await conexao.query(query, [nome, preco, quantidade, descricao, categoria, id]);
            if (!rowCount) {
                return res.status(400).json({
                    mensagem: "Não foi possível atualizar o produto"
                });
            }

            return res.status(204).json();
        }

        if (!categoria) {
            query = 
            `UPDATE produtos SET nome = $1,
            preco = $2,
            quantidade = $3,
            descricao = $4,
            imagem = $5
            WHERE id = $6`;

            const { rowCount: atualizacaoSemCategoria } = await conexao.query(query, [nome, preco, quantidade, descricao, imagem, id]);
            if (!atualizacaoSemCategoria) {
                return res.status(400).json({
                    mensagem: "Não foi possível atualizar o produto"
                });
            }

            return res.status(204).json();
        }
            query = 
            `UPDATE produtos SET nome = $1,
            preco = $2,
            quantidade = $3,
            descricao = $4,
            categoria = $5,
            imagem = $6
            WHERE id = $7`;

            const { rowCount: atualizacaoTodosCampos } = await conexao.query(query, [nome, preco, quantidade, descricao, categoria, imagem, id]);
            if (!atualizacaoTodosCampos) {
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
        let query = "SELECT * FROM produtos WHERE id = $1";
        const { rowCount, rows } = await conexao.query(query, [id]);

        if (!rowCount) {
            return res.status(404).json({
                mensagem: "O produto buscado não existe."
            });
        }

        if (rows[0].usuario_id !== usuario_id) {
            return res.status(403).json({
                mensagem: "Este usuário não tem acesso ao produto."
            });
        }

        query = "DELETE FROM produtos WHERE id = $1";
        const { rowCount: delecaoProduto } = await conexao.query(query, [id]);

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
