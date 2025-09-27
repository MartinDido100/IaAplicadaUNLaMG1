// src/firebase.ts
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import path from "path";

// Ruta relativa al root del proyecto
const serviceAccountPath = path.resolve("./sa-key.json");

// Leemos y parseamos el JSON
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

const app = initializeApp({
  credential: cert(serviceAccount),
});

export const auth = getAuth(app);
export const db = getFirestore(app);
