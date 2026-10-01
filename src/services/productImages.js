import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase";

export function uploadProductImage(file, onProgress = () => {}) {
  const extensions = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  if (!extensions[file.type])
    throw new Error("Selecciona una imagen JPG, PNG o WebP.");
  if (!file.size || file.size > 5 * 1024 * 1024)
    throw new Error("La imagen debe pesar como máximo 5 MB.");
  const path = `products/${crypto.randomUUID()}.${extensions[file.type]}`;
  storage.maxUploadRetryTime = 30000;
  const task = uploadBytesResumable(ref(storage, path), file, {
    contentType: file.type,
    cacheControl: "public,max-age=31536000,immutable",
  });
  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot) =>
        onProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
        ),
      () =>
        reject(
          new Error(
            "No se pudo subir la imagen a Firebase. Revisa la conexión y los permisos de Storage.",
          ),
        ),
      async () => {
        try {
          resolve(await getDownloadURL(task.snapshot.ref));
        } catch {
          reject(
            new Error("La imagen se subió, pero no se pudo obtener su URL."),
          );
        }
      },
    );
  });
}
