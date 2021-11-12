const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const schemaCadastroProduto = yup.object().shape({
    nome: yup.string().strict().required(),
    quantidade: yup.number().min(1).strict().required(),
    preco: yup.number().min(1).required(),
    descricao: yup.string().strict().required(),
    imagem: yup.string().strict(),
    categoria: yup.string().strict(),
});

module.exports = schemaCadastroProduto;
