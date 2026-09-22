import express from "express";
import { resolve } from "node:path";
import { criarCatalogoArquivo } from "../catalogo/catalogoArquivo.js";

const caminhoCatalogo = process.env.CATALOGO_ARQUIVO || resolve(import.meta.dirname, "../data/produtos.json");
const catalogo = criarCatalogoArquivo(caminhoCatalogo);

export const produtoRoutes = express.Router();

produtoRoutes.get("/", async (req, res, next) => {
    try {
        const produtos = await catalogo.listar();
        res.status(200).json({ sucesso: true, dados: produtos });
    } catch (erro) {
        next(erro); //envia para o middleware de erro (provisório)
    }
});

produtoRoutes.post("/", async (req, res) => {
    const { nome, preco, estoque, categoria } = req.body;
    const produto = await catalogo.criar({ nome, preco, estoque, categoria });
    res.status(201).json({ sucesso: true, dados: produto});
});

produtoRoutes.get("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if(!Number.isInteger(id)){
            return res.status(400).json({ erro: "ID deve ser inteiro" });
        }
        const produto = await catalogo.buscarPorId(id);
        res.status(200).json({ sucesso: true, dados: produto });
    } catch (erro) {
        if(erro.message.includes("não encontrado")){
            return res.status(404).json({ erro: erro.message });
        }
        next(erro);
    }
});