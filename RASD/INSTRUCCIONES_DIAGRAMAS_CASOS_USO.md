# Guía para Crear Diagramas de Casos de Uso en MagicDraw
## Best Bike Paths (BBP) System

## Resumen de Casos de Uso

### Casos de Uso Identificados:
1. **UC1: User Registration** - Actor: User, Email Provider
2. **UC2: Record Personal Trip** - Actor: Registered User
3. **UC3: Insert Path Information (Manual Mode)** - Actor: Registered User
4. **UC4: Insert Path Information (Automated Mode)** - Actor: Registered User, Mobile Device Sensors
5. **UC5: View Trip Statistics** - Actor: Registered User
6. **UC6: Search and Visualize Paths Between Two Points** - Actor: User (Registered or Non-Registered)
7. **UC7: Publish Path Information** - Actor: Registered User
8. **UC8: Merge Information from Multiple Users** - Actor: System

---

## DIAGRAMA 1: Use Cases Diagram for Non-Registered Users

### Actores:
- **Non-Registered User** (Actor principal - stick figure)

### Casos de Uso:
1. **Search and Visualize Paths Between Two Points**
   - Descripción: Permite a usuarios no registrados buscar y visualizar rutas entre dos puntos
   - Relación: Asociación directa con Non-Registered User

### Actores Externos (si aplica):
- **Map Service API** (Actor externo - puede ser representado como sistema externo)
  - Relación: <<include>> o <<extend>> con "Search and Visualize Paths"

### Estructura del Diagrama:
```
[Non-Registered User] ────── Search and Visualize Paths Between Two Points
                                    │
                                    │ <<include>>
                                    ▼
                            [Map Service API]
```

### Pasos en MagicDraw:
1. Crear nuevo diagrama UML: Use Case Diagram
2. Agregar Actor: "Non-Registered User" (lado izquierdo)
3. Agregar Use Case: "Search and Visualize Paths Between Two Points" (centro)
4. Conectar Actor con Use Case usando Association (línea sólida)
5. Opcional: Agregar Actor externo "Map Service API" y conectar con <<include>> stereotype
6. Agregar Boundary del sistema "BBP System" (rectángulo grande que contiene los casos de uso)

---

## DIAGRAMA 2: Use Cases Diagram for Registered Users

### Actores:
- **Registered User** (Actor principal - stick figure)
- **Email Provider** (Actor externo)
- **Mobile Device Sensors** (Actor externo - para UC4)
- **Weather API Service** (Actor externo - para UC2)
- **Map Service API** (Actor externo - para UC6)

### Casos de Uso:
1. **User Registration**
   - Actor: Registered User, Email Provider
   - Relación: Registered User ──► User Registration ──► Email Provider

2. **Record Personal Trip**
   - Actor: Registered User
   - Relación: Registered User ──► Record Personal Trip
   - Include: Weather API Service (para enriquecer datos)

3. **Insert Path Information (Manual Mode)**
   - Actor: Registered User
   - Relación: Registered User ──► Insert Path Information (Manual Mode)

4. **Insert Path Information (Automated Mode)**
   - Actor: Registered User, Mobile Device Sensors
   - Relación: Registered User ──► Insert Path Information (Automated Mode) ──► Mobile Device Sensors

5. **View Trip Statistics**
   - Actor: Registered User
   - Relación: Registered User ──► View Trip Statistics

6. **Search and Visualize Paths Between Two Points**
   - Actor: Registered User
   - Relación: Registered User ──► Search and Visualize Paths Between Two Points
   - Include: Map Service API

7. **Publish Path Information**
   - Actor: Registered User
   - Relación: Registered User ──► Publish Path Information

8. **Merge Information from Multiple Users**
   - Actor: System (proceso automático)
   - Nota: Este caso de uso puede estar relacionado indirectamente con Registered User ya que los usuarios contribuyen información que luego se fusiona

### Relaciones entre Casos de Uso:
- **<<include>>**: 
  - "Record Personal Trip" <<include>> "Weather API Service"
  - "Search and Visualize Paths" <<include>> "Map Service API"
  - "User Registration" <<include>> "Email Provider"

- **<<extend>>**: (si aplica)
  - Puede haber extensiones opcionales

### Estructura del Diagrama (Boceto):

```
                    [BBP System Boundary]
                    
[Email Provider] ────► [User Registration] ◄──── [Registered User]
                                                      │
                                                      │
                                                      ├───► [Record Personal Trip] ────► [Weather API]
                                                      │
                                                      ├───► [Insert Path Information (Manual Mode)]
                                                      │
                                                      ├───► [Insert Path Information (Automated Mode)] ────► [Mobile Device Sensors]
                                                      │
                                                      ├───► [View Trip Statistics]
                                                      │
                                                      ├───► [Search and Visualize Paths] ────► [Map Service API]
                                                      │
                                                      └───► [Publish Path Information]
                                                      
[Merge Information from Multiple Users] ◄──── [System]
```

### Pasos Detallados en MagicDraw:

#### Paso 1: Configuración Inicial
1. Abrir MagicDraw
2. Crear nuevo proyecto o abrir proyecto existente
3. Crear nuevo diagrama: **Use Case Diagram** (nombre: "UseCase_Registered")
4. Configurar página: A4 horizontal (landscape) para mejor visualización

#### Paso 2: Crear Boundary del Sistema
1. En la paleta, seleccionar **Package** o **System Boundary**
2. Dibujar un rectángulo grande que contendrá todos los casos de uso
3. Nombrarlo: **"BBP System"**
4. Ajustar tamaño para que contenga todos los elementos

#### Paso 3: Crear Actores
1. **Registered User** (lado izquierdo del boundary):
   - Seleccionar **Actor** de la paleta
   - Colocar en el lado izquierdo del diagrama
   - Nombrar: "Registered User"
   - Estilo: Stick figure (figura de palo)

2. **Email Provider** (exterior del boundary, arriba):
   - Actor externo
   - Nombrar: "Email Provider"
   - Colocar fuera del boundary, en la parte superior

3. **Mobile Device Sensors** (exterior del boundary, abajo):
   - Actor externo
   - Nombrar: "Mobile Device Sensors"
   - Colocar fuera del boundary, en la parte inferior izquierda

4. **Weather API Service** (exterior del boundary, derecha):
   - Actor externo
   - Nombrar: "Weather API Service"
   - Colocar fuera del boundary, en la parte superior derecha

5. **Map Service API** (exterior del boundary, derecha):
   - Actor externo
   - Nombrar: "Map Service API"
   - Colocar fuera del boundary, en la parte inferior derecha

6. **System** (opcional, para UC8):
   - Puede representarse como un actor o como un proceso automático
   - Si se usa actor, nombrar: "System"

#### Paso 4: Crear Casos de Uso (dentro del boundary)
Crear cada caso de uso como una elipse:

1. **User Registration**
   - Ubicación: Centro-izquierda
   - Nombre: "User Registration"

2. **Record Personal Trip**
   - Ubicación: Debajo de User Registration
   - Nombre: "Record Personal Trip"

3. **Insert Path Information (Manual Mode)**
   - Ubicación: Centro, fila media
   - Nombre: "Insert Path Information\n(Manual Mode)" (usar \n para salto de línea)

4. **Insert Path Information (Automated Mode)**
   - Ubicación: Centro, fila media, al lado del manual
   - Nombre: "Insert Path Information\n(Automated Mode)"

5. **View Trip Statistics**
   - Ubicación: Centro-derecha, fila superior
   - Nombre: "View Trip Statistics"

6. **Search and Visualize Paths Between Two Points**
   - Ubicación: Centro-derecha, fila media
   - Nombre: "Search and Visualize Paths\nBetween Two Points"

7. **Publish Path Information**
   - Ubicación: Centro-derecha, fila inferior
   - Nombre: "Publish Path Information"

8. **Merge Information from Multiple Users**
   - Ubicación: Parte inferior del boundary
   - Nombre: "Merge Information\nfrom Multiple Users"

#### Paso 5: Crear Asociaciones
1. **Registered User con todos los casos de uso principales:**
   - Seleccionar **Association** de la paleta
   - Conectar Registered User con:
     - User Registration
     - Record Personal Trip
     - Insert Path Information (Manual Mode)
     - Insert Path Information (Automated Mode)
     - View Trip Statistics
     - Search and Visualize Paths Between Two Points
     - Publish Path Information

2. **Email Provider con User Registration:**
   - Association desde Email Provider hacia User Registration
   - Agregar stereotype: **<<include>>**

3. **Mobile Device Sensors con Insert Path Information (Automated Mode):**
   - Association desde Mobile Device Sensors hacia el caso de uso
   - Agregar stereotype: **<<include>>**

4. **Weather API Service con Record Personal Trip:**
   - Association desde Weather API Service hacia el caso de uso
   - Agregar stereotype: **<<include>>**

5. **Map Service API con Search and Visualize Paths:**
   - Association desde Map Service API hacia el caso de uso
   - Agregar stereotype: **<<include>>**

6. **System con Merge Information:**
   - Association desde System hacia Merge Information
   - O representar como proceso automático sin actor

#### Paso 6: Agregar Stereotypes y Notas
1. Para cada relación <<include>>:
   - Click derecho en la asociación
   - Agregar stereotype: "include"
   - O usar la notación <<include>>

2. Agregar notas si es necesario:
   - Por ejemplo, explicar que "Merge Information" es un proceso automático

#### Paso 7: Organización y Formato
1. **Alinear elementos:**
   - Usar herramientas de alineación de MagicDraw
   - Mantener espaciado uniforme

2. **Agrupar casos de uso relacionados:**
   - Path Management: Insert Path (Manual), Insert Path (Automated), Publish Path
   - Trip Management: Record Trip, View Statistics
   - Search: Search and Visualize Paths

3. **Aplicar formato:**
   - Actores: Color azul claro o gris
   - Casos de uso: Color amarillo claro o blanco
   - Boundary: Línea punteada o sólida, color gris

4. **Verificar legibilidad:**
   - Nombres completos y claros
   - Tamaño de fuente adecuado (10-12pt)
   - Evitar superposiciones

#### Paso 8: Exportar
1. File → Export Diagram → Image
2. Formato: PNG (alta resolución) o PDF
3. Resolución: 300 DPI mínimo
4. Guardar como: `UseCase_Registered.png`

---

## DIAGRAMA 1 (Completo): Use Cases Diagram for Non-Registered Users

### Pasos en MagicDraw:

#### Paso 1: Configuración
1. Crear nuevo Use Case Diagram: "UseCase_NonRegistered"
2. Configurar página: A4 horizontal

#### Paso 2: Crear Boundary
1. Dibujar rectángulo grande: **"BBP System"**

#### Paso 3: Crear Actores
1. **Non-Registered User** (lado izquierdo)
2. **Map Service API** (exterior, lado derecho)

#### Paso 4: Crear Caso de Uso
1. **Search and Visualize Paths Between Two Points** (centro del boundary)

#### Paso 5: Crear Asociaciones
1. Non-Registered User ──► Search and Visualize Paths (Association)
2. Search and Visualize Paths ──► Map Service API (Association con <<include>>)

#### Paso 6: Exportar
1. Guardar como: `UseCase_NonRegistered.png`

---

## Convenciones y Mejores Prácticas

### Nomenclatura:
- **Actores**: PascalCase (ej: "Registered User")
- **Casos de Uso**: Title Case con palabras completas (ej: "Record Personal Trip")
- **Stereotypes**: lowercase con <<>> (ej: <<include>>)

### Colores Recomendados:
- **Actores**: Azul claro (#E3F2FD)
- **Casos de Uso**: Amarillo claro (#FFF9C4) o Blanco
- **Boundary**: Gris claro con borde (#E0E0E0)
- **Líneas**: Negro (#000000)

### Tamaños:
- **Actores**: Altura ~40-50px
- **Casos de Uso**: Elipse ~120x60px (ajustar según texto)
- **Boundary**: Contener todos los elementos con margen de 20px

### Relaciones:
- **Association**: Línea sólida (Actor ──► Use Case)
- **Include**: Línea punteada con <<include>> (Use Case ──► Use Case o Actor externo)
- **Extend**: Línea punteada con <<extend>> (si aplica)

### Notas Adicionales:
- Si un caso de uso es muy largo, usar abreviaciones o dividir en múltiples líneas
- Mantener diagramas limpios y organizados
- Evitar cruces innecesarios de líneas
- Usar routing automático de MagicDraw para líneas cuando sea posible

---

## Checklist Final

Antes de exportar cada diagrama, verificar:

- [ ] Todos los actores están presentes
- [ ] Todos los casos de uso están incluidos
- [ ] Todas las asociaciones están conectadas correctamente
- [ ] Los stereotypes (<<include>>) están aplicados donde corresponde
- [ ] El boundary del sistema contiene los casos de uso
- [ ] Los nombres son claros y legibles
- [ ] No hay superposiciones de elementos
- [ ] El diagrama está bien organizado y balanceado
- [ ] La resolución de exportación es adecuada (300 DPI mínimo)

---

## Archivos a Generar

1. `UseCase_NonRegistered.png` - Diagrama para usuarios no registrados
2. `UseCase_Registered.png` - Diagrama para usuarios registrados

Ambos archivos deben guardarse en: `PabloJose/RASD_Doc/Images/Diagrams/`

---

# PARTE 2: DIAGRAMAS DE SECUENCIA

**IMPORTANTE**: Cada caso de uso debe tener asociado un **diagrama de secuencia** que muestre la interacción entre los actores y los componentes del sistema.

## Componentes del Sistema (Lifelines)

Para los diagramas de secuencia, necesitamos identificar los objetos/lifelines del sistema:

### Lifelines Principales:
- **User** (Actor - para UC1)
- **Registered User** (Actor - para UC2-UC7)
- **Non-Registered User** (Actor - para UC6)
- **BBP System** (Sistema principal)
- **Authentication Service** (Servicio de autenticación)
- **Trip Management Service** (Servicio de gestión de viajes)
- **Path Management Service** (Servicio de gestión de rutas)
- **Statistics Service** (Servicio de estadísticas)
- **Search Service** (Servicio de búsqueda)
- **Database** (Base de datos)
- **Email Provider** (Actor externo)
- **Weather API Service** (Servicio externo)
- **Map Service API** (Servicio externo)
- **Mobile Device Sensors** (Actor externo)

---

## DIAGRAMA DE SECUENCIA 1: User Registration

### Archivo: `Sequence_UserRegistration.png`

### Lifelines (de izquierda a derecha):
1. **User** (Actor)
2. **BBP System** (Sistema)
3. **Authentication Service** (Componente del sistema)
4. **Database** (Base de datos)
5. **Email Provider** (Actor externo)

### Mensajes (basados en Event Flow):

```
User → BBP System: accessRegistrationForm()
BBP System → User: displayRegistrationForm()

User → BBP System: enterUserInfo(username, email, password)
BBP System → Authentication Service: validateUserInfo(userInfo)
Authentication Service → Database: checkEmailExists(email)
Database → Authentication Service: emailExists (true/false)
Authentication Service → BBP System: validationResult

alt [Email already registered]
    BBP System → User: showError("Email already registered")
else [Email valid]
    BBP System → Authentication Service: createUserAccount(userInfo)
    Authentication Service → Database: saveUser(userInfo)
    Database → Authentication Service: userCreated
    Authentication Service → Email Provider: sendVerificationEmail(email, verificationLink)
    Email Provider → User: verificationEmail()
    BBP System → User: showMessage("Verification email sent")
    
    User → Email Provider: clickVerificationLink(link)
    Email Provider → BBP System: verifyEmail(verificationToken)
    BBP System → Authentication Service: activateAccount(token)
    Authentication Service → Database: updateUserStatus(userId, active)
    Database → Authentication Service: statusUpdated
    Authentication Service → BBP System: accountActivated
    BBP System → User: redirectToLogin()
end
```

### Pasos en MagicDraw:

1. **Crear Sequence Diagram**: "Sequence_UserRegistration"
2. **Configurar página**: A4 vertical (portrait) o horizontal según necesidad

3. **Crear Lifelines** (de izquierda a derecha):
   - User (Actor, lado izquierdo)
   - BBP System (Object, centro-izquierda)
   - Authentication Service (Object, centro)
   - Database (Object, centro-derecha)
   - Email Provider (Actor, lado derecho)

4. **Dibujar Activation Boxes** (rectángulos en las lifelines):
   - Activar cuando un objeto recibe un mensaje
   - Desactivar cuando termina su procesamiento

5. **Crear Mensajes** (en orden cronológico):
   - **Synchronous messages** (flecha sólida con punta llena): Para llamadas directas
   - **Return messages** (flecha punteada): Para respuestas
   - **Self messages** (flecha que vuelve al mismo objeto): Para operaciones internas

6. **Agregar Fragments**:
   - **alt** fragment para el flujo alternativo (email ya registrado vs. email válido)
   - Usar **guard conditions**: [Email already registered] y [Email valid]

7. **Agregar Notes** si es necesario para clarificar pasos complejos

8. **Exportar**: PNG, 300 DPI, guardar como `Sequence_UserRegistration.png`

---

## DIAGRAMA DE SECUENCIA 2: Record Personal Trip

### Archivo: `Sequence_RecordTrip.png`

### Lifelines:
1. **Registered User** (Actor)
2. **BBP System**
3. **Trip Management Service**
4. **Statistics Service**
5. **Database**
6. **Weather API Service** (Actor externo)

### Mensajes:

```
Registered User → BBP System: accessTripRecording()
BBP System → Registered User: displayTripEntryForm()

Registered User → BBP System: enterTripInfo(startLocation, endLocation, startTime, endTime, route)
BBP System → Trip Management Service: validateTripData(tripInfo)
Trip Management Service → BBP System: validationResult

alt [Invalid data]
    BBP System → Registered User: showValidationError()
else [Valid data]
    BBP System → Trip Management Service: createTrip(tripInfo)
    Trip Management Service → Statistics Service: calculateStatistics(tripInfo)
    Statistics Service → Trip Management Service: statistics(distance, avgSpeed, duration, elevation)
    
    Trip Management Service → Weather API Service: getWeatherData(location, time)
    Weather API Service → Trip Management Service: weatherData(conditions, temperature, windSpeed)
    
    Trip Management Service → Database: saveTrip(tripData, statistics, weatherData)
    Database → Trip Management Service: tripSaved
    
    Trip Management Service → BBP System: tripCreated
    BBP System → Registered User: displayTripSummary(statistics, weatherData)
end
```

### Pasos en MagicDraw:

1. Crear Sequence Diagram: "Sequence_RecordTrip"
2. Crear lifelines en orden
3. Agregar mensajes según el flujo
4. Usar fragment **alt** para manejar validación
5. Agregar activation boxes apropiadas
6. Exportar como `Sequence_RecordTrip.png`

---

## DIAGRAMA DE SECUENCIA 3: Insert Path Information (Manual Mode)

### Archivo: `Sequence_InsertPathManual.png`

### Lifelines:
1. **Registered User** (Actor)
2. **BBP System**
3. **Path Management Service**
4. **Database**

### Mensajes:

```
Registered User → BBP System: accessPathManagement()
BBP System → Registered User: displayPathCreationForm()

Registered User → BBP System: enterPathInfo(pathName, streetNames, origin, destination, status, obstacles)
BBP System → Path Management Service: validatePathInfo(pathInfo)
Path Management Service → Database: checkDuplicatePath(origin, destination)
Database → Path Management Service: duplicateExists (true/false)

alt [Duplicate found]
    Path Management Service → BBP System: duplicateDetected
    BBP System → Registered User: showExistingPath(offerUpdate)
else [No duplicate]
    Path Management Service → BBP System: validationResult
    
    Registered User → BBP System: choosePublishStatus(publishable/private)
    BBP System → Path Management Service: savePath(pathInfo, publishStatus)
    Path Management Service → Database: storePath(pathData)
    Database → Path Management Service: pathSaved
    Path Management Service → BBP System: pathCreated
    BBP System → Registered User: showConfirmationMessage()
end
```

### Pasos en MagicDraw:

1. Crear Sequence Diagram: "Sequence_InsertPathManual"
2. Crear lifelines
3. Agregar mensajes con fragment **alt** para manejar duplicados
4. Exportar como `Sequence_InsertPathManual.png`

---

## DIAGRAMA DE SECUENCIA 4: Insert Path Information (Automated Mode)

### Archivo: `Sequence_InsertPathAutomated.png`

### Lifelines:
1. **Registered User** (Actor)
2. **BBP System**
3. **Trip Detection Service**
4. **Path Management Service**
5. **Mobile Device Sensors** (Actor externo)
6. **Database**

### Mensajes:

```
Mobile Device Sensors → BBP System: monitorSpeed(GPS data)
BBP System → Trip Detection Service: analyzeSpeed(speedData)
Trip Detection Service → BBP System: cyclingDetected

BBP System → Trip Detection Service: startAutomaticRecording()
Trip Detection Service → Mobile Device Sensors: requestSensorData()
Mobile Device Sensors → Trip Detection Service: GPS coordinates (continuous)
Mobile Device Sensors → Trip Detection Service: accelerometerData (continuous)
Mobile Device Sensors → Trip Detection Service: gyroscopeData (continuous)

Trip Detection Service → Trip Detection Service: detectObstacles(accelerometerData, gyroscopeData)
Trip Detection Service → Trip Detection Service: recordObstacleLocations()

Registered User → BBP System: finishTrip()
BBP System → Trip Detection Service: stopRecording()
Trip Detection Service → Path Management Service: reconstructPath(GPS coordinates)
Path Management Service → Path Management Service: analyzeObstacles(obstacleData)

Path Management Service → BBP System: presentDetectedPath(path, obstacles)
BBP System → Registered User: displayDetectedPath(path, obstacles)

Registered User → BBP System: reviewAndConfirm(path, obstacles)
BBP System → Path Management Service: confirmPathInfo(confirmedPath, confirmedObstacles)

Registered User → BBP System: choosePublishStatus(publishable/private)
BBP System → Path Management Service: savePath(confirmedPath, publishStatus)
Path Management Service → Database: storePath(pathData)
Database → Path Management Service: pathSaved
Path Management Service → BBP System: pathCreated
BBP System → Registered User: showConfirmation()
```

### Pasos en MagicDraw:

1. Crear Sequence Diagram: "Sequence_InsertPathAutomated"
2. Nota: Este diagrama es más complejo debido a la interacción continua con sensores
3. Usar **loop** fragment para la recolección continua de datos de sensores
4. Agregar self-messages para procesamiento interno
5. Exportar como `Sequence_InsertPathAutomated.png`

---

## DIAGRAMA DE SECUENCIA 5: View Trip Statistics

### Archivo: `Sequence_ViewStatistics.png`

### Lifelines:
1. **Registered User** (Actor)
2. **BBP System**
3. **Statistics Service**
4. **Database**

### Mensajes:

```
Registered User → BBP System: accessStatisticsDashboard()
BBP System → Statistics Service: requestTripHistory(userId)
Statistics Service → Database: getTripHistory(userId)
Database → Statistics Service: tripHistory[]

Statistics Service → Statistics Service: calculateAggregateStatistics(tripHistory)
Statistics Service → BBP System: statistics(totalDistance, avgSpeed, totalTrips, totalTime)
BBP System → Registered User: displayStatistics(statistics)

opt [User filters by date range]
    Registered User → BBP System: filterByDateRange(startDate, endDate)
    BBP System → Statistics Service: filterTrips(userId, dateRange)
    Statistics Service → Database: getFilteredTrips(userId, dateRange)
    Database → Statistics Service: filteredTrips[]
    Statistics Service → BBP System: filteredStatistics
    BBP System → Registered User: displayFilteredStatistics()
end

opt [User views individual trip details]
    Registered User → BBP System: viewTripDetails(tripId)
    BBP System → Statistics Service: getTripDetails(tripId)
    Statistics Service → Database: getTrip(tripId)
    Database → Statistics Service: tripDetails
    Statistics Service → BBP System: tripDetails(distance, speed, duration, elevation, weather)
    BBP System → Registered User: displayTripDetails()
end
```

### Pasos en MagicDraw:

1. Crear Sequence Diagram: "Sequence_ViewStatistics"
2. Usar fragment **opt** (opcional) para las acciones opcionales del usuario
3. Exportar como `Sequence_ViewStatistics.png`

---

## DIAGRAMA DE SECUENCIA 6: Search and Visualize Paths Between Two Points

### Archivo: `Sequence_SearchPaths.png`

### Lifelines:
1. **User** (Actor - Registered or Non-Registered)
2. **BBP System**
3. **Search Service**
4. **Path Scoring Service**
5. **Database**
6. **Map Service API** (Actor externo)

### Mensajes:

```
User → BBP System: accessPathSearch()
BBP System → User: displaySearchInterface()

User → BBP System: specifyLocations(origin, destination)
BBP System → Search Service: validateLocations(origin, destination)
Search Service → BBP System: validationResult

alt [Invalid locations]
    BBP System → User: showError("Invalid location")
else [Valid locations]
    BBP System → Search Service: searchPaths(origin, destination)
    Search Service → Database: findPathsBetweenPoints(origin, destination)
    Database → Search Service: availablePaths[]
    
    Search Service → Path Scoring Service: computeScores(paths)
    Path Scoring Service → Path Scoring Service: calculatePathScore(path, status, effectiveness, obstacles)
    Path Scoring Service → Search Service: scoredPaths[]
    
    Search Service → BBP System: rankedPaths(scoredPaths)
    BBP System → Map Service API: requestMapVisualization(paths, origin, destination)
    Map Service API → BBP System: mapData
    
    BBP System → User: displayPathsOnMap(rankedPaths, mapData)
    
    opt [User views path details]
        User → BBP System: viewPathDetails(pathId)
        BBP System → Search Service: getPathDetails(pathId)
        Search Service → Database: getPath(pathId)
        Database → Search Service: pathDetails(status, obstacles, rating, distance)
        Search Service → BBP System: pathDetails
        BBP System → User: displayPathDetails()
    end
end
```

### Pasos en MagicDraw:

1. Crear Sequence Diagram: "Sequence_SearchPaths"
2. Usar fragment **alt** para validación
3. Usar fragment **opt** para acciones opcionales
4. Exportar como `Sequence_SearchPaths.png`

---

## DIAGRAMA DE SECUENCIA 7: Publish Path Information

### Archivo: `Sequence_PublishPath.png`

### Lifelines:
1. **Registered User** (Actor)
2. **BBP System**
3. **Path Management Service**
4. **Database**

### Mensajes:

```
Registered User → BBP System: accessPathManagement()
BBP System → Path Management Service: getUserPaths(userId)
Path Management Service → Database: getPathsByUser(userId)
Database → Path Management Service: userPaths[]
Path Management Service → BBP System: userPaths
BBP System → Registered User: displaySavedPaths(userPaths)

Registered User → BBP System: selectPath(pathId)
BBP System → Path Management Service: getPathDetails(pathId)
Path Management Service → Database: getPath(pathId)
Database → Path Management Service: pathDetails
Path Management Service → BBP System: pathDetails
BBP System → Registered User: displayPathDetails()

Registered User → BBP System: requestPublishPath(pathId)
BBP System → Path Management Service: validatePathCompleteness(pathId)
Path Management Service → Database: getPath(pathId)
Database → Path Management Service: pathData

alt [Incomplete path]
    Path Management Service → BBP System: incompletePath
    BBP System → Registered User: showError("Complete path information first")
else [Complete path]
    BBP System → Registered User: showConfirmationDialog()
    Registered User → BBP System: confirmPublication()
    BBP System → Path Management Service: publishPath(pathId)
    Path Management Service → Database: updatePathStatus(pathId, published)
    Database → Path Management Service: statusUpdated
    Path Management Service → BBP System: pathPublished
    BBP System → Registered User: showConfirmationMessage()
    BBP System → Database: addToPublicDatabase(pathId)
end
```

### Pasos en MagicDraw:

1. Crear Sequence Diagram: "Sequence_PublishPath"
2. Usar fragment **alt** para validación de completitud
3. Exportar como `Sequence_PublishPath.png`

---

## DIAGRAMA DE SECUENCIA 8: Merge Information from Multiple Users

### Archivo: `Sequence_MergeInformation.png`

### Lifelines:
1. **System** (Actor/Trigger automático)
2. **BBP System**
3. **Information Merging Service**
4. **Database**

### Mensajes:

```
System → BBP System: detectMultipleSources(pathId)
BBP System → Information Merging Service: collectPublishableInfo(pathId)
Information Merging Service → Database: getPathReports(pathId)
Database → Information Merging Service: pathReports[] (from multiple users)

Information Merging Service → Information Merging Service: analyzeFreshness(pathReports)
Information Merging Service → Information Merging Service: compareTimestamps(reports)
Information Merging Service → Information Merging Service: identifyMostRecent(reports)

Information Merging Service → Information Merging Service: countConfirmingData(pathReports)
Information Merging Service → Information Merging Service: groupSimilarStatus(reports)
Information Merging Service → Information Merging Service: countConsensus(statusGroups)

Information Merging Service → Information Merging Service: resolveConflicts(reports, consensus, freshness)

alt [Consensus exists]
    Information Merging Service → Information Merging Service: useMajorityStatus(consensus)
else [No clear consensus]
    Information Merging Service → Information Merging Service: useMostRecentInfo(freshness)
end

Information Merging Service → Information Merging Service: mergeObstacleInfo(obstacleReports)
Information Merging Service → Information Merging Service: removeDuplicates(obstacles)
Information Merging Service → Information Merging Service: prioritizeRecentReports(obstacles)

Information Merging Service → Database: updatePathStatus(pathId, mergedStatus, mergedObstacles)
Database → Information Merging Service: pathUpdated
Information Merging Service → BBP System: mergeCompleted
```

### Pasos en MagicDraw:

1. Crear Sequence Diagram: "Sequence_MergeInformation"
2. **Nota importante**: Este es un proceso automático del sistema
3. Usar muchos **self-messages** ya que es principalmente procesamiento interno
4. Usar fragment **alt** para lógica de decisión (consenso vs. más reciente)
5. Exportar como `Sequence_MergeInformation.png`

---

## Convenciones para Diagramas de Secuencia

### Elementos UML:

1. **Lifelines**:
   - Actores: Stick figures o rectángulos con <<actor>>
   - Objetos: Rectángulos con nombre del objeto
   - Nombre: `objectName : ClassName` o solo `objectName`

2. **Activation Boxes**:
   - Rectángulos delgados en las lifelines
   - Indican cuando un objeto está activo
   - Comienzan cuando recibe un mensaje
   - Terminan cuando completa su procesamiento

3. **Mensajes**:
   - **Synchronous** (→): Flecha sólida con punta llena
   - **Return** (--→): Flecha punteada
   - **Self** (↻): Flecha que vuelve al mismo objeto
   - **Asynchronous** (→→): Flecha con punta abierta (si aplica)

4. **Fragments**:
   - **alt**: Flujo alternativo (if-else)
   - **opt**: Flujo opcional
   - **loop**: Iteración
   - **par**: Paralelo
   - **guard conditions**: [condición] en la esquina superior izquierda

5. **Notes**:
   - Rectángulos con esquina doblada
   - Para aclaraciones adicionales

### Orden de Mensajes:

- Los mensajes deben seguir el orden cronológico del Event Flow
- Numerar si es necesario para claridad
- Agrupar mensajes relacionados

### Formato:

- **Nombres de mensajes**: camelCase (ej: `validateUserInfo`)
- **Nombres de objetos**: PascalCase (ej: `AuthenticationService`)
- **Guard conditions**: Entre corchetes [condición]

---

## Checklist para Diagramas de Secuencia

Antes de exportar cada diagrama, verificar:

- [ ] Todos los lifelines están presentes (actores y objetos del sistema)
- [ ] Todos los mensajes del Event Flow están representados
- [ ] Las activation boxes están correctamente posicionadas
- [ ] Los fragments (alt, opt, loop) están correctamente aplicados
- [ ] Las guard conditions están claramente etiquetadas
- [ ] Los mensajes están en orden cronológico
- [ ] Los nombres de mensajes son descriptivos
- [ ] No hay cruces innecesarios de líneas
- [ ] El diagrama es legible y bien organizado
- [ ] La resolución de exportación es adecuada (300 DPI mínimo)

---

## Archivos de Diagramas de Secuencia a Generar

1. `Sequence_UserRegistration.png`
2. `Sequence_RecordTrip.png`
3. `Sequence_InsertPathManual.png`
4. `Sequence_InsertPathAutomated.png`
5. `Sequence_ViewStatistics.png`
6. `Sequence_SearchPaths.png`
7. `Sequence_PublishPath.png`
8. `Sequence_MergeInformation.png`

Todos los archivos deben guardarse en: `PabloJose/RASD_Doc/Images/Diagrams/`

