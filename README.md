# 🛒 TecnoPoint - TP Integrador Programación III

**TecnoPoint** es un sistema de autoservicio web que permite a los clientes comprar productos tecnológicos en dos categorías. La aplicación incluye un frontend responsive y un backend completo con API REST, vistas EJS para administración, y conexión a base de datos con Sequelize.

---

## 🚀 Tecnologías utilizadas

- Node.js + Express
- Sequelize (con MySQL)
- EJS (vistas para administración)
- HTML, CSS, Bootstrap (frontend)
- JavaScript (frontend y backend)
- SweetAlert2 (modales)
- Multer (subida de imágenes)
- PDFMake (para generación de tickets)

---

## 📦 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/TomasFernandez123/TecnoPoint.TP.git
cd TecnoPoint.TP
npm install
```

2. Instalar dependencias:

```bash
npm install
```

Crear la base de datos en MySQL manualmente (ej: tecnopoint_db)

3. Configurar conexión en config/db.js:

```bash
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tecnopoint_db', 'usuario_mysql', 'clave_mysql', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});
```
module.exports = sequelize;

5. Crear las tablas:

```bash
npm run init-db
```

Esto sincroniza los modelos con la base de datos.

6. ▶️ Ejecutar la aplicación

```bash
npm run dev
```
Servidor corriendo en http://localhost:3000

