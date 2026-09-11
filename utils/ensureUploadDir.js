import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

export function ensureUploadDir(subDir) {
  const dir = subDir ? path.join(UPLOADS_DIR, subDir) : UPLOADS_DIR;
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}