# Guía Rápida para Compilar el RASD

## 🚀 Opción Rápida: Usar Overleaf (Recomendado para empezar)

**Sin instalación necesaria:**

1. Ve a https://www.overleaf.com
2. Crea una cuenta (gratis)
3. Crea un nuevo proyecto → "Upload Project"
4. Sube TODA la carpeta `RASD_Doc/` (arrastra y suelta)
5. Haz clic en "Recompile" (botón verde)
6. ¡Listo! Verás el PDF directamente

**Ventajas:**
- ✅ No necesitas instalar nada
- ✅ Funciona en cualquier navegador
- ✅ Compilación instantánea
- ✅ Colaboración en tiempo real

---

## 💻 Opción Local: Instalar MiKTeX

### Paso 1: Descargar e Instalar

1. **Descarga MiKTeX:**
   - https://miktex.org/download
   - Elige "Windows 64-bit Installer"
   - Ejecuta el instalador

2. **Durante la instalación:**
   - ✅ Marca "Install missing packages on-the-fly: Yes"
   - ✅ Marca "Add MiKTeX to PATH" (si aparece)
   - ✅ Acepta la ubicación por defecto

3. **Reinicia PowerShell/Terminal** después de instalar

### Paso 2: Compilar

**Opción A: Usar el script automático (Recomendado)**

1. **Abre PowerShell** (puedes buscarlo en el menú de inicio)

2. **Navega a la carpeta del proyecto:**
   ```powershell
   cd "C:\Users\pablo\Desktop\Informatica\3\Polimi\SoftwareEngineering2\Project\PabloJose\RASD_Doc"
   ```
   *(Ajusta la ruta según tu ubicación real)*
   
   **⚠️ IMPORTANTE:** 
   - La carpeta se llama `RASD_Doc` (con **guión bajo** `_`), **NO** `RASD Doc` (con espacio)
   - Verifica que estás en la carpeta correcta ejecutando:
     ```powershell
     ls compile.ps1
     ```
   - Si ves el archivo, estás en la carpeta correcta. Si no, verifica la ruta.

3. **Si es la primera vez ejecutando scripts en PowerShell, puede que necesites cambiar la política de ejecución:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   - Esto permite ejecutar scripts locales sin firmar
   - Presiona `S` cuando te pregunte

4. **Ejecuta el script de compilación:**
   ```powershell
   .\compile.ps1
   ```
   
   **⚠️ IMPORTANTE:** En PowerShell siempre usa `.\` (punto y barra invertida), **NO** `./` (punto y barra normal).

5. **El script automáticamente:**
   - ✅ Verifica que MiKTeX esté instalado
   - ✅ Compila el documento dos veces (necesario para referencias)
   - ✅ Genera el PDF `DocumentoRASD.pdf`
   - ✅ Te pregunta si quieres abrir el PDF automáticamente

**Opción B: Compilar manualmente**

Si prefieres compilar sin el script:

1. **Navega a la carpeta:**
   ```powershell
   cd "C:\Users\pablo\Desktop\Informatica\3\Polimi\SoftwareEngineering2\Project\PabloJose\RASD_Doc"
   ```

2. **Compila dos veces (necesario para referencias cruzadas):**
   ```powershell
   pdflatex DocumentoRASD.tex
   pdflatex DocumentoRASD.tex
   ```

El PDF se generará como `DocumentoRASD.pdf` en la misma carpeta.

---

## 📝 Notas Importantes

- El documento actualmente tiene el **Capítulo 1 (Introduction - Purpose)** completo
- Los demás capítulos son placeholders vacíos (el documento compilará pero estarán vacíos)
- El logo de Polimi está comentado (puedes descomentarlo cuando tengas la imagen)

---

## ❓ Problemas Comunes

**Error: "El término '.\compile.ps1' no se reconoce como nombre de un cmdlet..."**

Este error puede tener dos causas:

1. **Estás en la carpeta incorrecta:**
   - ❌ Estás en: `RASD Doc` (con espacio)
   - ✅ Debes estar en: `RASD_Doc` (con guión bajo)
   - Solución: Verifica tu ubicación actual:
     ```powershell
     pwd
     ```
   - Si estás en la carpeta incorrecta, navega a la correcta:
     ```powershell
     cd "C:\Users\pablo\Desktop\Informatica\3\Polimi\SoftwareEngineering2\Project\PabloJose\RASD_Doc"
     ```
   - Verifica que el archivo existe:
     ```powershell
     ls compile.ps1
     ```

2. **Sintaxis incorrecta:**
   - ❌ **INCORRECTO:** `./compile.ps1` (barra normal)
   - ✅ **CORRECTO:** `.\compile.ps1` (barra invertida)
   - En PowerShell siempre debes usar `.\` (punto y barra invertida) para ejecutar scripts en el directorio actual

**Error: "No se puede cargar el archivo porque la ejecución de scripts está deshabilitada"**
- PowerShell bloquea la ejecución de scripts por seguridad
- Solución: Ejecuta en PowerShell (como Administrador si es necesario):
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- Presiona `S` para confirmar
- Luego intenta ejecutar `.\compile.ps1` de nuevo

**Error: "pdflatex no se reconoce"**
- Asegúrate de haber reiniciado PowerShell después de instalar MiKTeX
- Verifica que MiKTeX esté en el PATH del sistema
- El script intenta encontrar MiKTeX automáticamente, pero si falla, verifica manualmente:
  ```powershell
  Get-Command pdflatex
  ```

**Error: "File not found" o "No se encuentra el archivo DocumentoRASD.tex"**
- Asegúrate de ejecutar el script desde la carpeta correcta:
  ```powershell
  cd "C:\Users\pablo\Desktop\Informatica\3\Polimi\SoftwareEngineering2\Project\PabloJose\RASD_Doc"
  ```
- Verifica que el archivo `DocumentoRASD.tex` esté presente:
  ```powershell
  ls DocumentoRASD.tex
  ```

**Error: "Missing packages"**
- MiKTeX debería descargarlos automáticamente durante la compilación
- Si no funciona, instala manualmente:
  ```powershell
  miktex packages install [nombre-del-paquete]
  ```

**El script se ejecuta pero no genera el PDF**
- Revisa los mensajes de error en la consola
- Puede que falten algunos archivos de capítulos (esto es normal si aún no están completos)
- El script mostrará advertencias pero debería generar el PDF de todas formas

