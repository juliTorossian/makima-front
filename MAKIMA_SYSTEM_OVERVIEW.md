# Sistema Makima - Vista General del Proyecto

Makima es una plataforma de gestión integral desarrollada con **Angular**, diseñada para centralizar la administración de eventos, usuarios, proyectos y documentación técnica. Su arquitectura está orientada a la modularidad y a una experiencia de usuario fluida mediante el uso de componentes dinámicos y estados reactivos.

## 🛠️ Stack Tecnológico

- **Framework:** Angular 18+ (Standalone Components).
- **UI & Componentes:** PrimeNG (Tablas, Diálogos, Drawers), Ngb-Bootstrap (Popovers, Tooltips).
- **Estilizado:** Vanilla CSS con preprocesador SCSS.
- **Iconografía:** Lucide Icons (`ng-icon`).
- **Estado & Reactividad:** RxJS (BehaviorSubjects para la gestión de Drawers y Notificaciones).
- **Seguridad:** Autenticación basada en tokens con Guards de Angular y gestión de permisos granular (RBAC).

---

## 🏗️ Módulos Principales

### 1. Gestión de Eventos (`/evento`)
Es el núcleo operativo del sistema.
- **Vista Detallada:** Presenta un historial de actividad cronológico (timeline).
- **Ciclo de Vida:** Los eventos pasan por distintas **Etapas** configurables.
- **Requisitos:** Cada etapa puede exigir el cumplimiento de requisitos específicos (archivos, textos, fechas).
- **Actividad:** Registro de comentarios, subida de archivos y cambios de estado.
- **Deep Linking:** El sistema permite navegar directamente a un comentario o archivo específico desde las notificaciones.

### 2. Panel de Control (`/dashboard`)
Visualización de alto nivel sobre el estado de los eventos y métricas operativas.

### 3. Notas Rápidas
Módulo para la creación de anotaciones personales o compartidas.
- **Markdown:** Soporte para renderizado de Markdown.
- **Colaboración:** Permite compartir notas con otros usuarios y definir permisos de edición/lectura.

### 4. Administración de Usuarios y Roles
- **RBAC:** Sistema de permisos basado en claves (`PermisoClave`) que controla el acceso a cada módulo y acción (Crear, Editar, Eliminar, Ver).
- **Perfiles:** Gestión de datos de usuario y visualización en el `UsuarioDrawer`.

### 5. Configuración de Maestro (Maestros)
Para estructurar los eventos, el sistema gestiona:
- **Entornos, Productos, Módulos y Clientes.**
- **Proyectos:** Agrupaciones de trabajo específicas por cliente.

### 6. Seguimiento de Tiempos (`/registroHora`)
Permite a los usuarios imputar horas a los distintos eventos o proyectos.

### 7. Base de Conocimiento (`/kb`)
Repositorio central de documentación técnica y procedimientos internos.

---

## ⚙️ Servicios Core y Arquitectura UI

### DrawerService
Gestiona la apertura y el estado de los contenedores laterales (Drawers) sin necesidad de recargar la página:
- `eventoDrawer`: Detalle de evento.
- `usuarioDrawer`: Perfil de usuario.
- `notaDrawer`: Interfaz de notas rápidas.

### Sistema de Notificaciones
Centralizado en el componente `NotificationDropdown`. 
- **Tipos de Notificación:** `EVENTO_ADICION` (nuevos comentarios/archivos), `NOTA` (notas compartidas), etc.
- **Acciones:** Marcar como leída, filtrar por no leídas y navegación inteligente al contenido (focus con efecto *blink*).

### Layout & UI
- **Topbar:** Acceso rápido a perfil, notificaciones, modo oscuro/claro y notas.
- **VerticalLayout:** Menú lateral de navegación con soporte para colapsado y temas personalizados.
- **Cards UI:** Uso extendido de `app-ui-card` para mantener una estética consistente.

---

## 📂 Estructura de Carpetas

- `src/app/views`: Contiene los componentes de página y sus rutas.
- `src/app/core/services`: Lógica de negocio e integración con la API.
- `src/app/core/interfaces`: Definiciones de modelos de datos.
- `src/app/components`: Componentes reutilizables de UI (spinners, cards, editores).
- `src/app/layouts`: Componentes estructurales (Topbar, Sidebars).

---
> [!NOTE]
> Este documento ha sido generado para proporcionar contexto a NotebookLM sobre la estructura y funcionalidad del frontend de Makima.
