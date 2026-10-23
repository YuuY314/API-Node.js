import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "chave-padrao-desenvolvimento";

// gera um token JWT de desenvolvimento para testar o middleware
function gerarTokenInicial(){
    const payload = {
        sub: 1, // id de usuário de exemplo
        perfil: "admin" // perfil de administrador de exemplo
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    console.log(token);
}

gerarTokenInicial();