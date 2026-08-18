# JWT Ejemplo — Node.js + Express

Proyecto de ejemplo que muestra cómo implementar autenticación con **JSON Web Tokens (JWT)** usando Node.js y Express: registro, login, rutas protegidas, refresh tokens y logout.

## Instalación

```bash
npm install
cp .env.example .env
```

Editá `.env` y cambiá los valores de `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` por cadenas aleatorias propias.

## Ejecutar

```bash
npm start
# o con recarga automática:
npm run dev
```

El servidor levanta en `http://localhost:3000`.

## Flujo de autenticación

1. **Registro** — crea un usuario con contraseña hasheada (`bcrypt`).
2. **Login** — valida credenciales y devuelve un `accessToken` (corta duración) y un `refreshToken` (larga duración).
3. **Ruta protegida** — se accede enviando el `accessToken` en el header `Authorization: Bearer <token>`.
4. **Refresh** — cuando el `accessToken` expira, se usa el `refreshToken` para obtener uno nuevo sin volver a loguearse.
5. **Logout** — revoca el `refreshToken` para que no pueda usarse de nuevo.

## Endpoints

### `POST /api/auth/register`
```json
{ "username": "juan", "password": "123456" }
```

### `POST /api/auth/login`
```json
{ "username": "juan", "password": "123456" }
```
Respuesta:
```json
{ "accessToken": "...", "refreshToken": "..." }
```

### `GET /api/profile` (protegida)
Header: `Authorization: Bearer <accessToken>`

### `POST /api/auth/refresh`
```json
{ "refreshToken": "..." }
```

### `POST /api/auth/logout`
```json
{ "refreshToken": "..." }
```

## Probar con Bruno

En la carpeta `bruno-collection/` hay una colección lista para [Bruno](https://www.usebruno.com/) con el environment `Local` (`baseUrl`, `username`, `password`).

1. Abrí Bruno → "Open Collection" → seleccioná la carpeta `bruno-collection`.
2. Elegí el environment `Local`.
3. Ejecutá las requests en orden: `1 - Register` → `2 - Login` → `3 - Profile (protegida)` → `4 - Profile sin token (401)` → `5 - Refresh` → `6 - Logout`.

Los pasos de Login y Refresh guardan automáticamente `accessToken`/`refreshToken` en las variables del environment mediante scripts post-response, así que no hace falta copiarlos a mano.

## Probar con curl

```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"juan","password":"123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"juan","password":"123456"}'

# Ruta protegida (reemplazar TOKEN)
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer TOKEN"

# Refresh
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"REFRESH_TOKEN"}'

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"REFRESH_TOKEN"}'
```

## Nota

Los usuarios y refresh tokens se guardan en memoria (arrays/sets), solo para fines didácticos. Al reiniciar el servidor se pierden. En un proyecto real usarías una base de datos.
