# APIs Definitivo

Proyecto e-commerce con backend Spring Boot y frontend React.

## Backend

```bash
cd backend
mvn spring-boot:run
```

El backend corre en `http://localhost:8080` y usa MySQL/XAMPP:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_definitivo?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`.

## Auth

El login y registro devuelven los datos publicos del usuario:

```json
{
  "usuario": {
    "id": 1,
    "nombre": "Usuario",
    "email": "usuario@mail.com"
  }
}
```

El JWT se envia en una cookie `access_token` con `HttpOnly`, por lo que React no
puede leerlo. Redux conserva `id`, `nombre` y `email` solo en memoria, y restaura
la sesion al recargar mediante `GET /api/usuarios/me`.

Las operaciones que modifican datos usan ademas el token de `GET
/api/usuarios/csrf`. La cookie `XSRF-TOKEN` no contiene credenciales; el JWT
permanece aislado en la cookie `HttpOnly`.
