const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const schemaAtualizacaoUsuario = yup.object().shape({
    nome: yup.string(),
    senha: yup.string(),
    email: yup.string().email(),
    nome_loja: yup.string()
}); 

module.exports = schemaAtualizacaoUsuario;
