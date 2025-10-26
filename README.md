# Guía para levantar el proyecto localmente

## Requisitos
- Node.js (v18 o superior recomendado)
- npm
- Angular 20+
   ```sh
   npm i -g @angular/cli
   ```
---

## Backend (API)
1. Ir a la carpeta `api`:
   ```sh
   cd api
   ```
2. Instalar dependencias:
   ```sh
   npm install
   ```
3. Configurar variables de entorno:
   - Copiar el archivo `.env.template` a `.env`:
     ```sh
     cp .env.template .env
     ```
   - Editar `.env` con tus valores:
     ```env
     JWT_SECRET=tu_secreto_para_access_tokens
     JWT_REFRESH_SECRET=tu_secreto_para_refresh_tokens
     ACCESS_TOKEN_EXPIRATION=15m
     REFRESH_TOKEN_EXPIRATION=7d
     GEMINI_API_KEY=tu_api_key_de_gemini
     TMDB_TOKEN=tu_token_de_tmdb
     CORS_WHITELIST=http://localhost:4200,http://localhost:3000
     ```
   - Agregar el archivo de credenciales de Firebase `sa-key.json` en la carpeta `api/`

4. Ejecutar el servidor en modo desarrollo:
   ```sh
   npm run dev
   ```
   El backend estará disponible en `http://localhost:3000`.
   
5. Ver la documentación de la API:
   - Swagger UI: `http://localhost:3000/api-docs`

### Sistema de Autenticación

La API utiliza JWT con dos tipos de tokens:

- **Access Token**: Válido por 15 minutos, usado para acceder a recursos protegidos
- **Refresh Token**: Válido por 7 días, usado para obtener nuevos access tokens

#### Endpoints de autenticación:
- `POST /api/auth/signup/{email}` - Registrar nuevo usuario
- `POST /api/auth/login/{email}` - Iniciar sesión
- `POST /api/auth/verify` - Verificar validez del token
- `POST /api/auth/refresh` - Refrescar access token
- `POST /api/auth/logout` - Cerrar sesión

#### Flujo de uso:
1. Login/Signup → Recibe `accessToken` y `refreshToken`
2. Usar API → Enviar `accessToken` en header: `Authorization: Bearer <token>`
3. Token expira → Usar `/auth/refresh` con `refreshToken`
4. Logout → Llamar `/auth/logout` para invalidar `refreshToken`

### Endpoints de Recomendaciones

La API proporciona endpoints para obtener recomendaciones de películas y gestionar preferencias del usuario.

#### Endpoints disponibles:
- `POST /api/recommendations` - Obtener recomendaciones de películas basadas en preferencias (requiere autenticación)
- `PUT /api/recommendations/preferences` - Guardar una película en las preferencias del usuario (requiere autenticación)
- `GET /api/recommendations/preferences` - Obtener el historial de preferencias del usuario (requiere autenticación)

#### Ejemplo de solicitud de recomendación:
```json
POST /api/recommendations
Authorization: Bearer <accessToken>

{
  "textPrompt": "Quiero ver una película emocionante y épica",
  "genres": ["acción", "aventura"],
  "moods": ["EMOCIONADO", "EPIC"],
  "audiences": ["ADULTS", "TEENS"],
  "durations": ["LONG", "MEDIUM"]
}
```

#### Ejemplo de guardar preferencia:
```json
PUT /api/recommendations/preferences
Authorization: Bearer <accessToken>

{
  "tmdbId": "122",
  "name": "The Lord of the Rings: The Return of the King"
}
```

---

## Frontend (Angular)
1. Ir a la carpeta `frontend`:
   ```sh
   cd frontend
   ```
2. Instalar dependencias:
   ```sh
   npm install
   ```
3. Ejecutar la aplicación Angular:
   ```sh
   ng serve
   ```
   El frontend estará disponible en `http://localhost:4200`.

---