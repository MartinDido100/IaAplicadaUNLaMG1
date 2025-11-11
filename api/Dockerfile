# Etapa de construcción
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY src ./src

# Compilar TypeScript a JavaScript especificando directorio de salida
RUN npx tsc --outDir dist

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Copiar archivos compilados desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# Copiar archivo de clave de servicio de Firebase
COPY sa-key.json ./

# Exponer el puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]
