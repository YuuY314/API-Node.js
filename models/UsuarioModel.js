import * as dbModule from "../config/database.js";

const pool = typeof dbModule.criarPool === "function" ? dbModule.criarPool() : dbModule.pool;

export async function buscarPorEmail(email){
    const [linhas] = await pool.query(
        "SELECT id, nome, email, senha_hash, perfil FROM usuarios WHERE email = ?",
        [email]
    );
    
    return linhas[0] || null;
}

export async function criar({ nome, email, senhaHash, perfil = "usuario"}){
    const sql ="INSERT INTO usuarios(nome, email, senha_hash, perfil) VALUES(?, ?, ?, ?)";
    const [resultado] = await pool.query(sql, [nome, email, senhaHash, perfil]);
    return {
        id: resultado.insertId,
        nome,
        email,
        perfil
    };
}