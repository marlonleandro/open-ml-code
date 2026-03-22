# PROMPTS DE PRUEBA PARA MODO AGENT

## Prompt 1:

```
Crear una aplicación web en React para la recepción de facturas.
- Genera una arquitectura limpia utilizando las mejores prácticas.
- La aplicación debe mostrar una lista de facturas creadas que permita ver el detalle y editar los datos.
- Además, se debe permitir crear una nueva factura.
- Utiliza un estilo modelo enfocado a una mejor experiencia de usuario tanto en desktop como mobile.
```

### Prompt 1.1:

```
Agrega una página al proyecto que se utilice para registrar un nuevo proveedor.
- Crea/actualiza un menu superior para navegar entre páginas respetando el estilo actual.
- Utiliza los datos del formulario que se muestra en la imagen adjunta.
```

## Prompt 2:

```
Implementa la estructura de un panel de control (dashboard) moderno en Angular.
Debes crear los siguientes componentes:
- un menú lateral de navegación responsivo (sidebar)
- una tabla de datos de usuarios que soporte paginación simulada
- un área principal preparada para insertar gráficos.
Crea un servicio con datos mockeados (nombres, roles, estados) y haz que la tabla consuma y renderice estos datos correctamente.
Debes crear todos los archivos necesarios para poder ejecutar la aplicación sin problemas.
```

## Prompt 3:

```
Crear un proyecto web en React con arquitectura limpia con la siguiente funcionalidad:
- registro de empresas proveedores de materiales y servicios
- considerar que por cada empresa pueden existir mas de un contacto
- Utiliza un estilo modelo enfocado a una mejor experiencia de usuario tanto en desktop como mobile.
```

## Prompt 4:

```
Revisa mi aplicación y refactoriza lo necesario para tener una aplicación con una mejor experiencia de usuario.
```

## Prompt 5:

```
Construye un dashboard financiero moderno tipo fintech usando React.
Requisitos:
- Usar React + TypeScript
- UI moderna (inspirada en Stripe o Revolut)
- Crear layout con sidebar, header y contenido dinámico
- Mostrar:
  - balance general
  - gráficos de ingresos/gastos (Chart.js o Recharts)
  - lista de transacciones
- Datos completamente mockeados (JSON estructurado)
- Implementar filtros por fecha y categoría
- Estados: loading, empty, error
UX:
- Skeleton loaders
- Transiciones suaves
- Responsive (mobile-first)
- Dark mode
Modo agente:
1. Define estructura de carpetas
2. Diseña componentes reutilizables
3. Implementa mocks
4. Construye vistas
5. Mejora UX (microinteracciones)
```

## Prompt 6:

```
Construye un frontend en React para gestión de documentos empresariales.
Requisitos:
- Lista de documentos (tabla + vista tipo cards)
- Buscador y filtros
- Preview de documento (mock)
- Estados: aprobado, pendiente, rechazado
Datos:
- Generar documentos mock (nombre, fecha, estado, usuario)
UX:
- Cambio entre vista tabla/card
- Indicadores visuales de estado
- Acciones rápidas (ver, editar, eliminar)
- Confirmaciones modales
- Breadcrumb navigation
Extras:
- Simular subida de documentos (sin backend)
Modo agente:
1. Diseña estructura UI
2. Genera mocks
3. Implementa vistas
4. Maneja estado
5. Optimiza UX
```

## Prompt 7:

```
Crea un frontend en Angular para un catálogo e-commerce moderno.
Requisitos:
- Angular + standalone components
- Grid de productos con imágenes mock
- Filtros dinámicos (precio, categoría, rating)
- Vista de detalle de producto
- Simular carrito (local state)
Datos:
- Generar dataset mock de productos (mínimo 20)
UX:
- Hover effects
- Quick view modal
- Animaciones al agregar al carrito
- Lazy loading de imágenes
- Indicadores de carga
Modo agente:
1. Define arquitectura Angular (modules o standalone)
2. Genera mocks
3. Construye componentes
4. Implementa navegación
5. Optimiza UX
```

## Prompt 8:

```
Construye una aplicación web fullstack (frontend + backend) que permita a los usuarios crear formularios dinámicos tipo Google Forms, pero con asistencia de IA.
Requisitos:
- Frontend en React (con componentes reutilizables)
- Backend en FastAPI
- Base de datos PostgreSQL
- Permitir crear formularios con campos dinámicos (texto, número, fecha, archivo)
- Integrar un asistente IA que sugiera automáticamente campos basados en una descripción del usuario
- Guardar respuestas y permitir exportación a CSV
- Autenticación básica (login/registro)
- Generar estructura de carpetas, modelos, endpoints y servicios
Modo agente:
1. Define arquitectura
2. Genera backend
3. Genera frontend
4. Integra IA
5. Explica cómo ejecutar el proyecto
```

## Prompt 9:

```
Crea una aplicación web que permita subir archivos CSV y hacer análisis automático con IA.
Requisitos:
- Frontend en Angular
- Backend en Python (FastAPI)
- Subida de archivos CSV
- Generar automáticamente gráficos (usando Chart.js o similar)
- Integrar un chat tipo RAG para consultar los datos
- Permitir preguntas como: "¿Cuál es la tendencia de ventas?"
- Cachear embeddings en una base vectorial (puede ser Qdrant o FAISS)
Modo agente:
1. Diseña arquitectura de datos
2. Implementa pipeline de embeddings
3. Genera endpoints
4. Genera UI
5. Integra chat IA
```

## Prompt 10:

```
Desarrolla un e-commerce básico con recomendaciones inteligentes.
Requisitos:
- Frontend en React
- Backend en Node.js o FastAPI
- Catálogo de productos (CRUD)
- Carrito de compras
- Sistema de recomendaciones basado en comportamiento del usuario
- Simular motor de recomendación con IA (embeddings o reglas simples)
- UI moderna
Modo agente:
1. Diseña modelo de datos
2. Implementa backend
3. Implementa frontend
4. Agrega lógica de recomendaciones
5. Explica flujo completo
```

## Prompt 11:

```
Construye una aplicación web para subir documentos (PDF o imágenes) y extraer información automáticamente.
Requisitos:
- Backend en FastAPI
- Frontend simple en HTML o React
- Permitir subir documentos
- Simular integración con OCR (puede ser mock o real)
- Extraer campos como nombre, fecha, monto
- Mostrar resultados estructurados
- Guardar histórico
Modo agente:
1. Diseña flujo de procesamiento
2. Implementa endpoints de subida
3. Implementa parser de datos
4. Genera frontend
5. Explica cómo escalar el sistema
```
