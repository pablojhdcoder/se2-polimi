# Análisis Formal con Alloy - Best Bike Paths

Este documento explica cómo utilizar el modelo formal de Alloy creado para el proyecto Best Bike Paths (BBP).

## Archivos Creados

1. **BestBikePaths.als** - El modelo completo de Alloy que puede ejecutarse en el Alloy Analyzer
2. **Chapters/cap04_analisis_formal_alloy.tex** - La sección del documento RASD con la especificación y análisis completo

## Cómo Usar el Modelo de Alloy

### Requisitos Previos

1. Descargar e instalar [Alloy Analyzer](https://alloytools.org/download.html)
2. Tener Java instalado en tu sistema

### Ejecución del Modelo

1. Abre el archivo `BestBikePaths.als` con Alloy Analyzer
2. El modelo incluye varios comandos que puedes ejecutar:

#### Comandos Básicos

- **`run {} for 5`** - Genera una instancia básica del sistema con hasta 5 entidades de cada tipo

#### Verificación de Assertions (Checks)

Ejecuta cada uno de estos comandos para verificar las propiedades del sistema:

```alloy
check AllTripsHaveOwners for 5
check PublishedPathsHaveConfirmers for 5
check NoDuplicateRatings for 5
check ConfirmedObstaclesOnValidPaths for 5
check ValidTripTimes for 5
check NoSelfRatingUnpublished for 5
check AllRatingsHaveUsers for 5
```

**Resultado esperado:** Todos los checks deben mostrar "No counterexample found", lo que significa que las assertions son válidas.

#### Escenarios (Predicates)

Ejecuta estos predicados para ver escenarios específicos del sistema:

```alloy
run UserRecordsTripWithWeather for 5
run MultipleUsersConfirmPath for 5
run ObstacleDetectionAndConfirmation for 5
run UserRatesPublishedPath for 5
run PathWithMultipleObstacles for 5
run MultipleTripsOnSamePath for 5
```

**Resultado esperado:** Cada escenario generará una instancia válida que visualiza el comportamiento del sistema en esa situación específica.

## Estructura del Modelo

### Entidades Principales

1. **User** (abstracto)
   - RegisteredUser: Usuarios registrados que pueden grabar viajes y publicar rutas
   - NonRegisteredUser: Usuarios no registrados que solo pueden navegar rutas

2. **Trip**: Viajes de ciclismo con estadísticas y datos meteorológicos opcionales

3. **Path**: Rutas de bicicleta con estado, obstáculos y características

4. **Obstacle**: Obstáculos o baches en las rutas

5. **WeatherData**: Información meteorológica que enriquece los viajes

6. **Rating**: Valoraciones de rutas por parte de usuarios

### Facts y Constraints Importantes

- **UserIDsAreUnique**: Todos los IDs de usuario son únicos
- **TripOwnership**: Cada viaje pertenece exactamente a un usuario registrado
- **PathOwnership**: Las rutas publicadas tienen un propietario
- **ObstaclePathRelationship**: Los obstáculos están asociados con rutas específicas
- **UniqueRatingsPerUserPath**: Un usuario no puede valorar la misma ruta múltiples veces
- **ValidTripTimes**: El tiempo de fin del viaje es posterior al tiempo de inicio

## Captura de Pantallas para el Documento

Para completar el documento RASD con las visualizaciones de Alloy:

1. Ejecuta cada uno de los 6 escenarios en Alloy Analyzer
2. Para cada escenario, haz clic en "Show" para visualizar el grafo
3. Captura una imagen de la visualización
4. Guarda las imágenes en `Images/Alloy/` con los siguientes nombres:
   - `scenario1_trip_weather.png`
   - `scenario2_multiple_confirm.png`
   - `scenario3_obstacle_detection.png`
   - `scenario4_rating.png`
   - `scenario5_multiple_obstacles.png`
   - `scenario6_multiple_trips.png`

5. También genera 3 instancias base ejecutando `run {} for 5` y captura:
   - `base_world_1.png`
   - `base_world_2.png`
   - `base_world_3.png`

6. Actualiza las referencias en el archivo LaTeX para usar las imágenes reales en lugar de los placeholders

## Interpretación de Resultados

### Checks Exitosos

Si todos los checks pasan sin contraejemplos, significa que:
- El modelo es consistente
- Las reglas de negocio están correctamente especificadas
- No hay contradicciones en los requisitos

### Contraejemplos

Si algún check encuentra un contraejemplo:
- Revisa la especificación del requisito correspondiente
- Analiza el contraejemplo generado por Alloy
- Ajusta los facts o las assertions según sea necesario

## Mapeo a Requisitos del RASD

El modelo formal valida los siguientes requisitos funcionales:

- **F1**: User Management (RegisteredUser, NonRegisteredUser)
- **F2**: Trip Recording (Trip, WeatherData)
- **F3**: Path Information Management (Path, PathStatus)
- **F4**: Automated Path Detection (Obstacle, isConfirmed)
- **F5**: Path Search and Visualization (Path ranking basado en status)
- **F6**: Information Merging (confirmedBy, lastUpdated)

## Contacto

Para preguntas sobre el modelo de Alloy:
- José Martínez Estévez
- Pablo Jesús Herrero Díaz

---

**Última actualización:** 23 de Diciembre de 2025
**Versión del modelo:** 1.0

