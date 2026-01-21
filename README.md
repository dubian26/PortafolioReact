# Arquitectura y Convenciones del Proyecto

## Estructura de Carpetas

- **`src/components`**: Componentes de UI reutilizables. Organizados por funcionalidad (ej., `components/login/`).
- **`src/pages`**: Páginas principales de la aplicación (ej., `LoginPage.tsx`). Nomenclatura: `[Nombre]Page.tsx`.
- **`src/requests`**: Acceso a datos y llamadas a API. Nomenclatura: `fetch[Acción].ts`.
- **`src/contexts`**: Proveedores de Contexto de React.

## Estándares de Código

### Exportaciones
- Usar **Exportaciones Nombradas** exclusivamente.
- **NO** se permiten Exportaciones por Defecto (Default Exports).

### Nomenclatura
- **Componentes**: PascalCase (ej., `LoginForm`).
- **Páginas**: PascalCase, con sufijo `Page` (ej., `LoginPage`).
- **Funciones/Hooks**: camelCase (ej., `fetchLogin`).
