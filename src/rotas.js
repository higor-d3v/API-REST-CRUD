const express = require("express");
const rotas = express();
const validaToken = require("./filtros/validaToken");
const usuarios = require("./controladores/usuarios");
const login = require("./controladores/login"); 
const produtos = require("./controladores/produtos");

rotas.post("/usuario", usuarios.cadastrarUsuario);
rotas.post("/login", login.login);

rotas.use(validaToken);

rotas.get("/usuario", usuarios.detalharUsuario);
rotas.put("/usuario", usuarios.atualizarUsuario); 

rotas.post("/produtos", produtos.cadastrarProduto);
rotas.get("/produtos", produtos.obterProdutos);
rotas.get("/produtos/:id", produtos.obterProduto);
rotas.put("/produtos/:id", produtos.atualizarProduto);
rotas.delete("/produtos/:id", produtos.excluirProduto);

module.exports = rotas;
