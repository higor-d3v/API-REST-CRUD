const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const schemaCadastroProduto = yup.object().shape({
    nome: yup.string().required(),
    quantidade: yup.number().min(1).strict().required(),
    preco: yup.number().min(1).strict().required(),
    descricao: yup.string().required(),
    imagem: yup.string(),
    categoria: yup.string(),
});

module.exports = schemaCadastroProduto;
