import express from "express";
import helmet from "helmet";
import cors from "cors";
import { resolve } from "node:path"

import { produtoRouter, configurarSegurancaProdutos } from "./routes/ProdutoRoutes.js";
import { authRouter } from "./routes/AuthRoutes.js";
import { autenticar, autorizarAdmin } from "./middlewares/AuthMiddleware.js";

export const app = express();

// 1 - defesas de borda: Helmet e CORS
app.use(helmet());

const origensPermitidas = (process.env.CORS_ORIGENS || 'http://localhost:3000,http://localhost:5500')
    .split(',')
    .map(o => o.trim());

app.use(cors({
    origin(origem, callback) {
        if (!origem || origensPermitidas.includes(origem)) {
            return callback(null, true);
        }

        return callback(new Error('Origem não permitida pelo CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// middleware: "ensina" o express a ler json no corpo da requisição
app.use(express.json());

// Permite acessar as fotos pelo navegador: http://localhost:3000/uploads/produtos/...
app.use("/uploads", express.static(resolve("uploads")));

// 2 - injeção de segurança nas rotas de produtos
configurarSegurancaProdutos(autenticar, autorizarAdmin);

// log de requisições no console
app.use((req, res, next) => {
    const inicio = performance.now();
    res.once("finish", () => {
        const duracao = Math.round(performance.now() - inicio);
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} [${duracao}ms]`)
    });
    next();
})

// 3 - rotas da API
app.get("/api/check", (req, res) => res.status(200).json({ status: "ok" }));
app.use('/api/auth', authRouter);
app.use("/api/produto", produtoRouter);

// 4 - fallback 404 (rota não encontrada)
app.use((req, res) => {
    res.status(404).json({ sucesso: false, erro: `A rota ${req.method} ${req.originalUrl} não existe.` });
});

// 5 - tratador global de erros
app.use((erro, req, res, _next) => {
    console.error(`Erro de sistema: ${erro.message}`);
    res.status(erro.status || 500).json({ sucesso: false, erro: erro.message || "Falha interna do servidor"});
});