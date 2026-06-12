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

El login y registro devuelven:

```json
{
  "token": "jwt",
  "usuario": {
    "id": 1,
    "nombre": "Usuario",
    "email": "usuario@mail.com"
  }
}
```

Redux guarda solo `id`, `nombre`, `email` y `token`. La password no se guarda.
