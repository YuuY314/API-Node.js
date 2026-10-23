import express from "express";
import { resolve } from "node:path"
import { produtoRouter} from "./routes/ProdutoRoutes.js";

export const app = express();

// middleware: "ensina" o express a ler json no corpo da requisição
app.use(express.json());

// Permite acessar as fotos pelo navegador: http://localhost:3000/uploads/produtos/...
app.use("/uploads", express.static(resolve("uploads")));

// log de requisições no console
app.use((req, res, next) => {
    const inicio = performance.now();
    res.once("finish", () => {
        const duracao = Math.round(performance.now() - inicio);
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} [${duracao}ms]`)
    });
    next();
})

// rotas da API
app.get("/api/check", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/produto", produtoRouter);

// fallback 404 (rota não encontrada)
app.use((req, res) => {
    res.status(404).json({ sucesso: false, erro: `A rota ${req.method} ${req.originalUrl} não existe.` });
});

// tratador global de erros
app.use((erro, req, res, _next) => {
    console.error(`Erro de sistema: ${erro.message}`);
    res.status(erro.status || 500).json({ sucesso: false, erro: erro.message || "Falha interna do servidor"});
});