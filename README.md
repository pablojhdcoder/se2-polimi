# Documentos del Proyecto

Este repositorio contiene los documentos LaTeX del proyecto, incluyendo el **RASD** (Requirements Analysis and Specification Document) y el **DD** (Design Document).

## Estructura del Repositorio

```
PabloJose/
├── RASD_Doc/          # Documento RASD (Requirements Analysis and Specification Document)
│   ├── DocumentoRASD.tex
│   ├── compile.ps1    # Script de compilación
│   └── Chapters/      # Capítulos del documento
│
└── DD_Doc/            # Documento DD (Design Document)
    ├── DD.tex
    ├── compile.ps1    # Script de compilación
    └── Chapters/      # Capítulos del documento
```

## Requisitos Previos

Para compilar los documentos, necesitas tener instalado:

- **MiKTeX** o **TeX Live** (distribución de LaTeX)
  - MiKTeX: https://miktex.org/download
  - TeX Live: https://www.tug.org/texlive/

- **PowerShell** (incluido en Windows 10/11)

## Compilación de los Documentos

### Método 1: Usando los Scripts de Compilación (Recomendado)

Cada documento tiene su propio script de compilación que automatiza el proceso:

#### Compilar el Documento RASD

1. Abre PowerShell y navega al directorio del documento:
   ```powershell
   cd RASD_Doc
   ```

2. Ejecuta el script de compilación:
   ```powershell
   .\compile.ps1
   ```

3. El script:
   - Verificará que `pdflatex` esté instalado
   - Compilará el documento en múltiples pasadas (para resolver referencias)
   - Generará el PDF `DocumentoRASD.pdf` en el directorio raíz
   - Te preguntará si deseas abrir el PDF automáticamente

#### Compilar el Documento DD

1. Abre PowerShell y navega al directorio del documento:
   ```powershell
   cd DD_Doc
   ```

2. Ejecuta el script de compilación:
   ```powershell
   .\compile.ps1
   ```

3. El script:
   - Verificará que `pdflatex` esté instalado
   - Compilará el documento en múltiples pasadas (usando modo borrador para las primeras pasadas, más rápido)
   - Generará el PDF `DD.pdf` en el directorio raíz
   - Te preguntará si deseas abrir el PDF automáticamente

### Método 2: Compilación Manual

Si prefieres compilar manualmente, puedes usar `pdflatex` directamente:

#### Para el Documento RASD:
```powershell
cd RASD_Doc
pdflatex -interaction=nonstopmode -synctex=1 -output-directory=build DocumentoRASD.tex
pdflatex -interaction=nonstopmode -synctex=1 -output-directory=build DocumentoRASD.tex
pdflatex -interaction=nonstopmode -synctex=1 -output-directory=build DocumentoRASD.tex
```

#### Para el Documento DD:
```powershell
cd DD_Doc
pdflatex -interaction=nonstopmode -draftmode -synctex=1 -output-directory=build DD.tex
pdflatex -interaction=nonstopmode -draftmode -synctex=1 -output-directory=build DD.tex
pdflatex -interaction=nonstopmode -synctex=1 -output-directory=build DD.tex
```

**Nota:** Se requieren múltiples pasadas para resolver correctamente las referencias cruzadas, tablas de contenido, y listas de figuras.

## Limpieza de Archivos Auxiliares

Ambos directorios incluyen un script `clean.ps1` para eliminar los archivos auxiliares generados durante la compilación:

```powershell
.\clean.ps1
```

Esto eliminará los archivos `.aux`, `.log`, `.out`, `.toc`, etc., pero mantendrá el PDF y los archivos fuente.

## Solución de Problemas

### Error: "pdflatex no está instalado"

- Instala MiKTeX desde https://miktex.org/download
- Asegúrate de que MiKTeX esté en tu PATH del sistema
- El script intentará añadir automáticamente MiKTeX al PATH si está instalado en la ubicación predeterminada

### Error: "No se encuentra el archivo [Documento].tex"

- Asegúrate de ejecutar el script desde el directorio correcto
- Verifica que el archivo `.tex` principal exista en el directorio

### Errores de Compilación LaTeX

- Revisa el archivo de log (`build/[Documento].log`) para ver los errores detallados
- Asegúrate de que todos los paquetes LaTeX necesarios estén instalados
- Verifica que todos los archivos de capítulos estén presentes en el directorio `Chapters/`

## Archivos Generados

Durante la compilación, se generan varios archivos auxiliares en el directorio `build/`:

- `[Documento].aux` - Información de referencias cruzadas
- `[Documento].log` - Log de compilación
- `[Documento].out` - Información de hipervínculos
- `[Documento].toc` - Tabla de contenidos
- `[Documento].lof` - Lista de figuras
- `[Documento].lot` - Lista de tablas
- `[Documento].synctex.gz` - Archivo para sincronización con el editor

El PDF final se mueve automáticamente al directorio raíz del documento.

## Notas Adicionales

- Los scripts usan el modo `-draftmode` en las primeras pasadas para acelerar la compilación
- La última pasada genera el PDF final con todas las referencias resueltas
- Los archivos auxiliares se mantienen en `build/` para facilitar la depuración

