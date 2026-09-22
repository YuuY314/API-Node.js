import Produto from "../models/Produto.js";
import { gravarJson, lerJson } from "../storage/arquivosJson.js";

export function criarCatalogoArquivo(caminho) {
    async function listar() {
        const dados = await lerJson(caminho);
        return dados.map((produto) => new Produto(produto));
    }

    async function buscarPorId(id) {
        const produto = (await listar()).find((item) => item.id === id);
        if(!produto){
            throw new Error(`Produto ${id} não encontrado`);
        }
        return produto;
    }

    async function listarCategorias() {
        const categorias = (await listar()).map(({categoria}) => categoria);
        return [...new Set(categorias)];
    }

    async function criar(dados) {
        const produtos = await listar();
        const proximoId = Math.max(0, ...produtos.map(({id}) => id)) + 1;
        const produto = new Produto({id: proximoId, ...dados});
        const atualizados = [...produtos, produto];
        await gravarJson(caminho, atualizados);
        return produto;
    }

    return {listar, buscarPorId, listarCategorias, criar};
}
