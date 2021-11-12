const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const schemaAtualizacaoProduto = yup.object().shape({
    nome: yup.string().strict(),
    quantidade: yup.number().min(1).strict(),
    preco: yup.number().min(1),
    descricao: yup.string().strict(),
    imagem: yup.string().strict(),
    categoria: yup.string().strict(),
});

module.exports = schemaAtualizacaoProduto;
