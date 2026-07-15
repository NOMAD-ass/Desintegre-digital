import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Pasta física onde os PDFs enviados pelo admin ficam salvos
export const PASTA_UPLOADS = path.join(__dirname, "..", "uploads", "certificados");

if (!fs.existsSync(PASTA_UPLOADS)) {
    fs.mkdirSync(PASTA_UPLOADS, { recursive: true });
}

const armazenamento = multer.diskStorage({
    destination: (req, file, cb) => cb(null, PASTA_UPLOADS),
    filename: (req, file, cb) => {
        const pedidoId = req.params.pedidoId;
        const carimbo = Date.now();
        cb(null, `certificado_pedido${pedidoId}_${carimbo}.pdf`);
    },
});

function filtroPdf(req, file, cb) {
    if (file.mimetype !== "application/pdf") {
        return cb(new Error("Só é permitido enviar arquivos PDF."));
    }
    cb(null, true);
}

const uploadCertificado = multer({
    storage: armazenamento,
    fileFilter: filtroPdf,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export default uploadCertificado;