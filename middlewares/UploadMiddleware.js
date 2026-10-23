import multer from "multer";
import { randomUUID } from "crypto";
import { mkdirSync } from "fs";
import { extname, resolve } from "path";

// garante que o diretório de uploads exista
const DIRETORIO_UPLOAD = resolve("uploads/produtos");
mkdirSync(DIRETORIO_UPLOAD, { recursive: true });

// tipos de arquivos permitidos
const MIME_TYPES_VALIDOS = ["image/jpeg", "image/png", "image/webp"];
    
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, DIRETORIO_UPLOAD);
    },
    filename: (req, file, callback) => {
        const extensao = extname(file.originalname).toLocaleLowerCase();
        callback(null, `${randomUUID()}${extensao}`);
    }
});

const upload = multer({
    storage,
    limits: {fileSize: 2 * 1024 * 1024}, // 2MB
    fileFilter: (_req, file, callback) => {
        if(!MIME_TYPES_VALIDOS.includes(file.mimetype)){
            const erro = new Error("Tipo de arquivo inválido. Apenas JPEG, PNG e WEBP são permitidos.");
            erro.status = 415;
            return callback(erro);
        }
        return callback(null, true);
    }
});

export function uploadImagem(req, res, next){
    upload.single("imagem")(req, res, (erro) => {
        if(erro instanceof multer.MulterError && erro.code === "LIMIT_FILE_SIZE"){
            return res.status(413).json({sucesso: false, mensagem: "O tamanho do arquivo excede o limite de 2MB."});
        }
        if(erro && erro.status === 415){
            return res.status(415).json({sucesso: false, mensagem: erro.message});
        }
        if(erro){
            return next(erro);
        }
        if(!req.file){
            return res.status(400).json({sucesso: false, mensagem: "Nenhum arquivo foi enviado"});
        }
        return next();
    });
}