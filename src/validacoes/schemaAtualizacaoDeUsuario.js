const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const schemaAtualizacaoDeUsuario = yup.object().shape({
    nome: yup.string().required(),
    senha: yup.string().required(),
    email: yup.string().email().required(),
    nome_loja: yup.string().required()
    }); 

module.exports = schemaAtualizacaoDeUsuario;