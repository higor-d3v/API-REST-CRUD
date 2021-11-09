const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const schemaAtualizacaoProduto = yup.object().shape({
    nome: yup.string(),
    quantidade: yup.number().min(1).strict(),
    preco: yup.number().min(1).strict(),
    descricao: yup.string(),
    imagem: yup.string(),
    categoria: yup.string(),
});

module.exports = schemaAtualizacaoProduto;
