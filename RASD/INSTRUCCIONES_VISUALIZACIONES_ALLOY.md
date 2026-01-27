# Instrucciones para Capturar Visualizaciones de Alloy

## Objetivo

Este documento proporciona instrucciones paso a paso para capturar las visualizaciones del modelo de Alloy y reemplazar los placeholders en el documento PDF.

## Paso 1: Instalar Alloy Analyzer

1. Visita: https://alloytools.org/download.html
2. Descarga la última versión de Alloy Analyzer
3. Asegúrate de tener Java instalado (Alloy requiere Java)
4. Ejecuta el instalador o descomprime el archivo

## Paso 2: Abrir el Modelo

1. Inicia Alloy Analyzer
2. Abre el archivo `BestBikePaths.als` desde el menú File → Open
3. El modelo se cargará en el editor

## Qué Esperar en las Visualizaciones

### Características de las Visualizaciones de Alloy

Las visualizaciones generadas por Alloy Analyzer mostrarán:

1. **Todas las entidades generadas:** No solo las relacionadas directamente con el predicado, sino TODAS las instancias creadas para satisfacer los constraints del modelo.

2. **Entidades "sueltas" o sin referencias directas:** Pueden aparecer nodos que no están directamente conectados al flujo principal del escenario. Esto es normal y muestra que Alloy está generando un mundo completo que satisface todos los facts.

3. **Múltiples instancias de cada tipo:** Por ejemplo, varios `RegisteredUser`, varios `Path`, múltiples `Obstacle` con diferentes severidades (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`).

4. **Todos los valores de enumeraciones:** Aparecerán los valores como:
   - PathStatus: `OPTIMAL`, `MEDIUM`, `SUFFICIENT`, `REQUIRES_MAINTENANCE`
   - Severity: `LOW`, `MODERATE`, `HIGH`, `CRITICAL`
   - WeatherCondition: `SUNNY`, `CLOUDY`, `RAINY`, `WINDY`, `SNOWY`
   - Bool: `TRUE`, `FALSE`
   - DateTime: `JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`

5. **Relaciones complejas:** Muchas flechas de diferentes colores conectando las entidades, cada color representa un tipo de relación diferente (trips, publishedPaths, obstacles, ratings, confirmedBy, etc.).

### Ejemplo Visual Esperado

Tu visualización debería verse similar a la imagen de referencia proporcionada, con:
- 📦 Nodos amarillos para entidades principales (Users, Trips, Paths, Obstacles, etc.)
- 🔵 Flechas de diferentes colores para las relaciones
- 🏷️ Etiquetas mostrando el tipo de cada entidad
- 📊 Una estructura de grafo compleja y densa con muchas entidades interconectadas

**Esto es correcto y esperado.** No intentes simplificar demasiado el grafo - Alloy está mostrando una instancia completa y válida del sistema. La complejidad visual demuestra que el modelo puede generar mundos consistentes que satisfacen todas las restricciones.

### Opciones de Simplificación (Opcional)

Si las visualizaciones son demasiado complejas para capturar, puedes:

1. **Ocultar tipos específicos:**
   - En la ventana de visualización, busca los checkboxes a la derecha
   - Desmarca tipos que no sean relevantes para ese escenario específico
   - Por ejemplo, en "UserRecordsTripWithWeather", puedes ocultar `NonRegisteredUser` si no aparece relacionado

2. **Enfocarse en un subgrafo:**
   - Click derecho en un nodo → "Show only this and neighbors"
   - Útil para destacar las entidades principales del escenario

3. **Ajustar el scope:**
   - Si hay demasiadas entidades, prueba con scope 3 o 4 en lugar de 5
   - Ejemplo: `run UserRecordsTripWithWeather for 3`
   - Esto generará instancias más pequeñas y manejables

4. **Usar diferentes layouts:**
   - View → Layout → Tree / Horizontal Tree / Vertical Tree
   - Experimenta para encontrar la mejor visualización para cada escenario

**Importante:** No es necesario que la visualización sea "limpia" - es perfectamente válido (y hasta preferible) mostrar el grafo completo tal como Alloy lo genera, ya que demuestra la riqueza y completitud del modelo.

## Paso 3: Capturar Escenarios

Para cada uno de los siguientes predicates, sigue estos pasos:

### Escenario 1: User Records Trip With Weather

1. En Alloy, busca la línea: `run UserRecordsTripWithWeather for 5`
2. Haz clic en "Execute" → "Run UserRecordsTripWithWeather"
3. Espera a que se genere una instancia
4. Haz clic en el botón "Show" cuando aparezca
5. Se abrirá una ventana con la visualización gráfica
6. Ajusta la vista si es necesario (Theme → Options)
7. Captura la pantalla (Windows: Win+Shift+S, Mac: Cmd+Shift+4)
8. Guarda la imagen como: `Images/Alloy/scenario1_trip_weather.png`

### Escenario 2: Multiple Users Confirm Path

1. Busca: `run MultipleUsersConfirmPath for 5`
2. Execute → Run MultipleUsersConfirmPath
3. Click "Show"
4. Captura la visualización
5. Guarda como: `Images/Alloy/scenario2_multiple_confirm.png`

### Escenario 3: Obstacle Detection And Confirmation

1. Busca: `run ObstacleDetectionAndConfirmation for 5`
2. Execute → Run ObstacleDetectionAndConfirmation
3. Click "Show"
4. Captura la visualización
5. Guarda como: `Images/Alloy/scenario3_obstacle_detection.png`

### Escenario 4: User Rates Published Path

1. Busca: `run UserRatesPublishedPath for 5`
2. Execute → Run UserRatesPublishedPath
3. Click "Show"
4. Captura la visualización
5. Guarda como: `Images/Alloy/scenario4_rating.png`

### Escenario 5: Path With Multiple Obstacles

1. Busca: `run PathWithMultipleObstacles for 5`
2. Execute → Run PathWithMultipleObstacles
3. Click "Show"
4. Captura la visualización
5. Guarda como: `Images/Alloy/scenario5_multiple_obstacles.png`

### Escenario 6: Multiple Trips On Same Path

1. Busca: `run MultipleTripsOnSamePath for 5`
2. Execute → Run MultipleTripsOnSamePath
3. Click "Show"
4. Captura la visualización
5. Guarda como: `Images/Alloy/scenario6_multiple_trips.png`

## Paso 4: Capturar Mundos Base

1. Busca la línea: `run {} for 5`
2. Execute → Run
3. Click "Show"
4. Captura la primera visualización
5. Guarda como: `Images/Alloy/base_world_1.png`
6. Click en "Next" para ver otra instancia
7. Captura y guarda como: `Images/Alloy/base_world_2.png`
8. Click en "Next" nuevamente
9. Captura y guarda como: `Images/Alloy/base_world_3.png`

## Paso 5: Actualizar el Documento LaTeX

Una vez que tengas todas las imágenes capturadas, necesitas actualizar el archivo LaTeX para usar las imágenes reales en lugar de los placeholders.

Abre `Chapters/cap04_analisis_formal_alloy.tex` y busca las secciones con placeholders como:

```latex
\begin{figure}[H]
    \centering
    \fbox{\parbox{0.95\linewidth}{\centering
        \vspace{2cm}
        \textit{[Alloy Instance Visualization: User Records Trip With Weather]}\\
        ...
        \vspace{2cm}
    }}
    \caption{Alloy Instance for Scenario 1: User Records Trip With Weather.}
    \label{fig:scenario1_trip_weather}
\end{figure}
```

Reemplázalas con:

```latex
\begin{figure}[H]
    \centering
    \includegraphics[width=0.95\linewidth]{Images/Alloy/scenario1_trip_weather.png}
    \caption{Alloy Instance for Scenario 1: User Records Trip With Weather.}
    \label{fig:scenario1_trip_weather}
\end{figure}
```

Repite este proceso para todas las figuras:
- `scenario1_trip_weather.png`
- `scenario2_multiple_confirm.png`
- `scenario3_obstacle_detection.png`
- `scenario4_rating.png`
- `scenario5_multiple_obstacles.png`
- `scenario6_multiple_trips.png`
- `base_world_1.png`
- `base_world_2.png`
- `base_world_3.png`

## Paso 6: Recompilar el Documento

1. Abre PowerShell en el directorio `RASD_Doc`
2. Ejecuta: `powershell -ExecutionPolicy Bypass -File compile.ps1`
3. Verifica que el PDF se genera correctamente con las nuevas imágenes
4. Abre `DocumentoRASD.pdf` y verifica que todas las figuras aparecen correctamente

## Consejos Adicionales para Mejores Visualizaciones

### Opciones de Visualización en Alloy

1. **Mejorar la legibilidad:**
   - Theme → Options → Font Size (aumentar si es necesario)
   - Theme → Options → Node Spacing (ajustar para mejor distribución)

2. **Reorganizar el grafo:**
   - Arrastra los nodos para mejorar la disposición manualmente
   - Usa las opciones de layout (Tree, Vertical Tree, etc.)

3. **Exportar directamente:**
   - File → Export to PNG (directamente desde Alloy)
   - Esto puede dar mejor calidad que capturas de pantalla
   - Asegúrate de capturar en alta resolución

### Tamaño Recomendado de Imágenes

- Ancho: 1200-1600 píxeles
- Formato: PNG para mejor calidad
- Si las imágenes son demasiado grandes, puedes reducirlas con herramientas como:
  - Windows: Paint, IrfanView
  - Online: TinyPNG, Squoosh
  - Mac: Preview

## Verificación Final

Antes de considerar el trabajo completamente terminado, verifica:

- ✅ Las 9 imágenes están en `Images/Alloy/`
- ✅ El archivo LaTeX ha sido actualizado con las rutas correctas
- ✅ El documento compila sin errores
- ✅ Todas las figuras aparecen en el PDF
- ✅ Las figuras tienen buena resolución y son legibles
- ✅ Los captions coinciden con el contenido de las figuras

## Solución de Problemas

### Alloy no ejecuta el modelo

- Verifica que Java está instalado: `java -version`
- Aumenta la memoria disponible en Alloy: Options → Maximum Memory

### Las visualizaciones están vacías

- Verifica que el predicado tiene instancias válidas
- Prueba con un scope mayor: `run ... for 6` o `run ... for 7`
- Revisa los facts que pueden estar sobre-restringiendo el modelo

### El PDF no muestra las imágenes

- Verifica que las rutas son correctas (case-sensitive)
- Asegúrate de que las imágenes están en formato PNG
- Verifica que no hay espacios en los nombres de archivos
- Recompila con `compile.ps1` dos veces para resolver referencias

## Tiempo Estimado

- Instalación de Alloy: 10-15 minutos
- Ejecución y captura de escenarios: 20-30 minutos
- Actualización del LaTeX: 10-15 minutos
- Recompilación y verificación: 5-10 minutos

**Total: ~45-70 minutos**

---

**Nota:** Los placeholders actuales en el documento son perfectamente válidos para la entrega. Las visualizaciones reales son opcionales pero recomendadas para una presentación más profesional y completa.

