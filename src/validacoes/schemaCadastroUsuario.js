const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const schemaCadastroUsuario = yup.object().shape({
    nome: yup.string().strict().required(),
    senha: yup.string().strict().required(),
    email: yup.string().email().required(),
    nome_loja: yup.string().strict().required()
}); 

module.exports = schemaCadastroUsuario;
