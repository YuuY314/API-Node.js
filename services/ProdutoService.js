import Produto from "../models/Produto.js";
import * as ProdutoModel from "../models/ProdutoModel.js";

function validarId(idRecebido){
    const id = Number(idRecebido);

    if(!Number.isInteger(id) || id <= 0){
        throw new TypeError("ID deve ser um número inteiro positivo");
    }

    return id;
}

export async function listar({ pagina = 1, limite = 10 } = {}){
    const paginaNum = Number(pagina);
    const limiteNum = Number(limite);

    if(!Number.isInteger(paginaNum) || paginaNum <= 0){
        throw new TypeError("Página deve ser um número inteiro positivo");
    }

    if(!Number.isInteger(limiteNum) || limiteNum < 1 || limiteNum > 100){
        throw new TypeError("Limite deve ser um inteiro entre 1 e 100");
    }

    const offset = (paginaNum - 1) * limiteNum;
    const { produtos, total } = await ProdutoModel.listar({ limite: limiteNum, offset });

    return {
        produtos,
        paginacao: {
            pagina: paginaNum,
            limite: limiteNum,
            total,
            totalPaginas: Math.ceil(total / limiteNum)
        }
    };
}

export async function buscarPorId(idRecebido){
    const id = validarId(idRecebido);
    const produto = await ProdutoModel.buscarPorId(id);
    
    if(!produto){
        throw new Error(`Produto ${id} não encontrado`);
    }

    return produto;
}

export async function criar(dados){
    const produtoDominio = new Produto({ id: 1,  ...dados});
    return await ProdutoModel.criar(produtoDominio);
}

export async function atualizar(idRecebido, dados){
    const id = validarId(idRecebido);
    const produtoDominio = new Produto({ id, ...dados });
    const atualizou = await ProdutoModel.atualizar(id, produtoDominio);

    if(!atualizou){
        throw new Error(`Produto ${id} não encontrado`);
    }

    return await ProdutoModel.buscarPorId(id);
}

export async function salvarImagem(idRecebido, imagemUrl){
    const id = validarId(idRecebido);
    const atualizou = await ProdutoModel.atualizarImagem(id, imagemUrl);

    if(!atualizou){
        throw new Error(`Produto ${id} não encontrado`);
    }

    return await ProdutoModel.buscarPorId(id);
}

// hmmmmmmm
export async function excluir(idRecebido){
    const id = validarId(idRecebido);
    const removeu = await ProdutoModel.excluir(id);

    if(!removeu){
        throw new Error(`Produto ${id} não encontrado`);
    }
}