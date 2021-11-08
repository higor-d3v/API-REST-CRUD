const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const conexao = require("../bancoDeDados/conexao");

const login = async (req, res) => {
    const { senha, email } = req.body;
    if (!senha || !email) {
        return res.status(400).json({
            mensagem: "Por favor insira os campos Obrigatórios"
        });
    }
    try {
        const query = "SELECT * FROM usuarios WHERE email = $1";
        const { rows, rowCount } = await conexao.query(query, [email]);

        if (!rowCount) {
            return res.status(400).json({
                mensagem: "Email ou senha inválidos"
            });
        }
        const usuario = rows[0];
        const validarSenha = await bcrypt.compare(senha, usuario.senha);

        if (!validarSenha) {
            return res.status(400).json({
                mensagem: "Usuário e/ou senha inválido(s)."
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
