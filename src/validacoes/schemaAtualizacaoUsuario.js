const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const schemaAtualizacaoUsuario = yup.object().shape({
    nome: yup.string().strict(),
    senha: yup.string().strict(),
    email: yup.string().email(),
    nome_loja: yup.string().strict()
}); 

module.exports = schemaAtualizacaoUsuario;
