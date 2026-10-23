import express from "express";
import * as ProdutoController from "../controllers/ProdutoController.js";
import { uploadImagem } from "../middlewares/UploadMiddleware.js";

// middlewares de autenticação (serão ativados na sessão 2)
// inicialmente passam direto para não travar a sessão 1
let autenticar = (_req, _res, next) => next();
let autorizarAdmin = (_req, _res, next) => next();

export const produtoRouter = express.Router();

produtoRouter.get('/', ProdutoController.listar);
produtoRouter.get('/:id', ProdutoController.buscarPorId);
produtoRouter.post('/', (req, res, next) => autenticar(req, res, next), ProdutoController.criar);
produtoRouter.put('/:id', (req, res, next) => autenticar(req, res, next), ProdutoController.atualizar);
produtoRouter.patch('/:id/imagem', (req, res, next) => autenticar(req, res, next), uploadImagem, ProdutoController.enviarImagem);
produtoRouter.delete('/:id', (req, res, next) => autenticar(req, res, next), (req, res, next) => autorizarAdmin(req, res, next), ProdutoController.excluir);