# TpIaAplicada - Sistema de Diseño

## Paleta de Colores

### Modo Claro (Light Mode)

#### Colores Principales

- **Background**: `#ffffff` (oklch(1 0 0))
- **Foreground**: `#1f2937` (oklch(0.205 0 0))
- **Primary**: `#1f2937` (oklch(0.205 0 0))
- **Primary Foreground**: `#ffffff` (oklch(1 0 0))

#### Colores Secundarios

- **Secondary**: `#8b5cf6` (oklch(0.646 0.222 295.8)) - Violeta principal
- **Secondary Foreground**: `#ffffff` (oklch(1 0 0))
- **Accent**: `#8b5cf6` (oklch(0.646 0.222 295.8)) - Mismo que secondary

#### Colores de Superficie

- **Card**: `#f1f5f9` (oklch(0.97 0 0)) - Gris muy claro
- **Card Foreground**: `#1f2937` (oklch(0.205 0 0))
- **Muted**: `#f1f5f9` (oklch(0.97 0 0))
- **Muted Foreground**: `#6b7280` (oklch(0.556 0 0))

#### Colores de Estado

- **Destructive**: `#ea580c` (oklch(0.577 0.245 27.325)) - Naranja para errores
- **Destructive Foreground**: `#ffffff` (oklch(1 0 0))

#### Colores de Interfaz

- **Border**: `#e5e7eb` (oklch(0.922 0 0))
- **Input**: `#f1f5f9` (oklch(0.97 0 0))
- **Ring**: `#8b5cf6` (oklch(0.646 0.222 295.8)) - Para focus states

## Tipografía

### Fuentes Principales

- **Sans Serif**: `Geist Sans` - Fuente principal para texto
- **Monospace**: `Geist Mono` - Para código y elementos técnicos

### Configuración CSS

`css --font-sans: var(--font-geist-sans); --font-mono: var(--font-geist-mono); \`

### Clases Tailwind

- `font-sans` - Aplica Geist Sans
- `font-mono` - Aplica Geist Mono

### Jerarquía Tipográfica

- **Títulos principales**: `text-4xl md:text-6xl font-bold`
- **Subtítulos**: `text-xl md:text-2xl font-semibold`
- **Texto de cuerpo**: `text-base leading-relaxed`
- **Texto pequeño**: `text-sm text-muted-foreground`

## Espaciado y Layout

### Border Radius

- **Radius base**: `0.5rem` (8px)
- **Small**: `calc(0.5rem - 4px)` (4px)
- **Medium**: `calc(0.5rem - 2px)` (6px)
- **Large**: `0.5rem` (8px)
- **Extra Large**: `calc(0.5rem + 4px)` (12px)

### Espaciado Común

- **Gap pequeño**: `gap-2` (8px)
- **Gap medio**: `gap-4` (16px)
- **Gap grande**: `gap-6` (24px)
- **Padding contenedor**: `p-6` (24px)
- **Margin secciones**: `mb-8` (32px)

## Componentes Base

### Botones

- **Primario**: `bg-primary text-primary-foreground`
- **Secundario**: `bg-secondary text-secondary-foreground`
- **Outline**: `border border-input bg-background`

### Cards

- **Base**: `bg-card text-card-foreground border border-border`
- **Hover**: `hover:bg-accent/5`

### Inputs

- **Base**: `bg-input border border-border`
- **Focus**: `focus:ring-2 focus:ring-ring`

## Principios de Diseño

1. **Contraste**: Todos los colores cumplen WCAG AA (4.5:1 mínimo)
2. **Consistencia**: Uso de tokens de color semánticos
3. **Responsive**: Mobile-first con breakpoints estándar
4. **Accesibilidad**: Focus states visibles y navegación por teclado
5. **Tema cinematográfico**: Colores que evocan la experiencia del cine
