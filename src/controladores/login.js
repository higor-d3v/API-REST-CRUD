const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const knex = require("../bancoDeDados/conexao");
const schemaLogin = require("../validacoes/schemaLogin");

const login = async (req, res) => {
    const { senha, email } = req.body;

    try {
        await schemaLogin.validate(req.body);
        const usuario = await knex("usuarios").where({email}).first();
        if (!usuario) {
            return res.status(400).json({
                mensagem: "Email ou senha inválidos."
            });
        }
        const validarSenha = await bcrypt.compare(senha, usuario.senha);

        if (!validarSenha) {
            return res.status(400).json({
                mensagem: "Email ou senha inválidos."
            });
        }

        const token = jwt
            .sign(
                {id: usuario.id},
                process.env.JWT_KEY,
                { expiresIn: "24h" }
            );

        return res.status(201).json({token});
    } catch (error) {
        return res.status(400).json({
            mensagem: error.message
        });
    }
};

module.exports = { login };
