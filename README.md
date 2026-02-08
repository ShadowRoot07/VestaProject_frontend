# 🏺 Vesta - E-commerce Platform

**Vesta** es una plataforma de comercio electrónico moderna, rápida y segura, diseñada para ofrecer una experiencia de usuario fluida tanto para clientes como para administradores. El proyecto nace bajo el alias de desarrollo **ShadowRoot07** y busca integrar un backend robusto en Python con una interfaz reactiva en React.

---

## 🚀 Tecnologías Principales

El proyecto utiliza un stack de tecnologías de alto rendimiento:

* **Frontend:** React.js (Vite) + Tailwind CSS + Lucide Icons.
* **Backend:** FastAPI (Python) + SQLModel (SQLAlchemy + Pydantic).
* **Base de Datos:** PostgreSQL (Alojada en **Neon.tech**).
* **Autenticación:** JWT (JSON Web Tokens).
* **Despliegue sugerido:** Vercel (Frontend) y Render (Backend).

---

## ✨ Características (Features)

### 👤 Para Usuarios
* **Autenticación Completa:** Registro e inicio de sesión seguro.
* **Feed de Productos:** Exploración de catálogos con carga optimizada.
* **Sistema de Interacción:** * Dar "Like" a productos favoritos.
    * Comentar en productos para feedback de la comunidad.
* **Gestión de Carrito:** Añadir, ver y eliminar productos en tiempo real.
* **Sistema de Compra:** Validación de saldo (Balance) y generación de historial de compras.
* **Perfil Personalizado:** Control de saldo, visualización de favoritos e historial detallado de pedidos.

### 🛠️ Para Administradores
* **Dashboard de Control:** Interfaz exclusiva para la gestión del inventario.
* **Gestión de Productos:** Crear, editar y eliminar productos directamente desde la interfaz.
* **Seguridad:** Rutas protegidas a nivel de frontend y backend mediante roles.

---

## 🛠️ Estructura del Proyecto

```txt
vesta-project/
├── backend/               # FastAPI + SQLModel
│   ├── app/
│   │   ├── models/        # Modelos de base de datos
│   │   ├── routers/       # Endpoints (users, products, interactions)
│   │   └── core/          # Seguridad y configuración
│   └── main.py
└── frontend/              # React + Vite
    ├── src/
    │   ├── components/    # Componentes reutilizables (Modales, Navbar, Cards)
    │   ├── pages/         # Vistas principales (Dashboard, Shop, Profile)
    │   ├── services/      # Cliente Axios para la API
    │   └── context/       # Estado Global (AuthContext)
    └── App.jsx
```

## Configuración Local

1. Clonar el repositorio:

```bash
git clone [https://github.com/tu-usuario/vesta.git](https://github.com/tu-usuario/vesta.git)
```

2. Backend:
* Crear entorno virtual: python -m venv venv
* Instalar dependencias: pip install -r requirements.txt
* Configurar .env con tu DATABASE_URL de Neon.tech.
* Ejecutar: uvicorn app.main:app --reload

3. Frontend:
* Instalar dependencias: npm install
* Configurar .env con la URL de la API.
* Ejecutar: npm run dev

## Futuras Actualizaciones
* [ ] Implementación de Bots y Automatizaciones con Python para actualización de stock inteligente.
* [ ] Integración de pasarelas de pago reales.
* [ ] Notificaciones en tiempo real.

### Desarrollado con ❤️ por ShadowRoot07.

## Todo hecho desde Termux
