# Guía de Instalación de LaTeX para Compilar el RASD

## Opción 1: Instalación Manual de MiKTeX (Recomendado)

### Pasos:

1. **Descargar MiKTeX:**
   - Ve a: https://miktex.org/download
   - Descarga el instalador para Windows (64-bit)
   - Ejecuta el instalador

2. **Durante la instalación:**
   - Acepta la licencia
   - Selecciona "Install missing packages on-the-fly: Yes"
   - Elige una carpeta de instalación (por defecto está bien)
   - Marca "Add MiKTeX to PATH" si está disponible

3. **Verificar la instalación:**
   - Abre PowerShell o CMD
   - Ejecuta: `pdflatex --version`
   - Deberías ver la versión instalada

## Opción 2: Usar Overleaf (Online - Sin instalación)

Si prefieres no instalar nada, puedes usar Overleaf:

1. Ve a: https://www.overleaf.com
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Sube todos los archivos de la carpeta `RASD Doc/PabloJose/`
5. Compila directamente en el navegador

## Opción 3: Instalación con Chocolatey (Si lo tienes instalado)

Si tienes Chocolatey instalado, ejecuta:
```powershell
choco install miktex
```

## Después de Instalar MiKTeX

Una vez instalado, para compilar el documento:

1. Abre PowerShell en la carpeta: `RASD_Doc/`
2. Ejecuta:
   ```powershell
   pdflatex DocumentoRASD.tex
   pdflatex DocumentoRASD.tex
   ```
   (Ejecuta dos veces para resolver referencias)

3. El PDF se generará como `DocumentoRASD.pdf` en la misma carpeta.

## Nota sobre Archivos Faltantes

El documento requiere algunos archivos que aún no existen:
- `Chapters/cap02_descripcion_general.tex`
- `Chapters/cap03_requisitos_especificos.tex`
- `Chapters/cap04_analisis_formal_alloy.tex`
- `Chapters/cap05_esfuerzo_dedicado.tex`
- `Chapters/cap06_referencias.tex`
- `Images/PolimiLogo.png`

Puedes crear archivos vacíos temporalmente para compilar, o comentar las líneas correspondientes en `DocumentoRASD.tex`.

