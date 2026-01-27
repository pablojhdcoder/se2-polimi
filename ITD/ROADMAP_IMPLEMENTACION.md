# Roadmap de Implementación - Integration Testing Document (ITD)
## Best Bike Paths (BBP) - Proyecto Software Engineering 2

**Equipo:** José Martínez Estévez, Pablo Jesús Herrero Díaz  
**Fecha de Creación:** Enero 2026  
**Versión:** 1.0

---

## Índice

1. [Visión General](#visión-general)
2. [Estructura del ITD](#estructura-del-itd)
3. [División de Trabajo](#división-de-trabajo)
4. [Fases de Implementación](#fases-de-implementación)
5. [Cronograma Detallado](#cronograma-detallado)
6. [Dependencias y Pre-requisitos](#dependencias-y-pre-requisitos)

---

## Visión General

Este roadmap define la estrategia completa para la implementación del **Integration Testing Document (ITD)** del sistema Best Bike Paths (BBP). El documento debe cubrir:

- **Estrategia de pruebas de integración** basada en el enfoque Bottom-Up descrito en el DD
- **Plan de integración de componentes** siguiendo la arquitectura de microservicios
- **Casos de prueba de integración** para cada interfaz entre componentes
- **Orden de integración** alineado con las fases de implementación del DD
- **Criterios de aceptación** para cada nivel de integración

El roadmap está diseñado para ser ejecutado por **dos miembros del equipo**, con tareas claramente distribuidas y puntos de sincronización definidos.

---

## Estructura del ITD

El documento ITD debe seguir la siguiente estructura (basada en estándares IEEE y el plan de implementación del DD):

### Capítulos Principales:

1. **Introduction**
   - Purpose
   - Scope
   - Definitions, Acronyms, Abbreviations
   - Revision History
   - Reference Documents
   - Document Structure

2. **Integration Strategy**
   - Integration Approach (Bottom-Up)
   - Integration Levels
   - Integration Order
   - Testing Strategy

3. **Component Integration Plan**
   - Data Layer Integration
   - Service Layer Integration
   - API Gateway Integration
   - Client Integration
   - External Services Integration

4. **Integration Test Cases**
   - Test Case Specifications
   - Test Data Requirements
   - Expected Results
   - Pass/Fail Criteria

5. **Integration Sequence Diagrams**
   - Component Interaction Flows
   - Error Handling Scenarios
   - Edge Cases

6. **Tools and Environment**
   - Testing Tools
   - Environment Setup
   - Test Data Management
   - Continuous Integration

7. **Effort Spent**
   - Time tracking por miembro del equipo

8. **References**

---

## División de Trabajo

### Miembro 1: José Martínez Estévez

**Responsabilidades Principales:**
- **Backend Services Integration** (Servicios del lado del servidor)
- **Data Layer Integration** (Base de datos y repositorios)
- **API Gateway Integration** (Rutas, autenticación, validación)
- **External Services Integration** (Weather API, Map API, Email Service)
- **Integration Test Cases** para servicios backend

**Componentes Asignados:**
- User Management Service
- Trip Management Service
- Path Management Service
- Sensor Data Processing Service
- Information Merging Service
- Rating Service
- Path Search Service
- API Gateway
- DBMS Integration
- Redis Cache Integration
- RabbitMQ Integration
- External APIs (Weather, Maps, Email)

### Miembro 2: Pablo Jesús Herrero Díaz

**Responsabilidades Principales:**
- **Client-Side Integration** (Aplicación móvil)
- **Service-to-Service Integration** (Comunicación entre microservicios)
- **End-to-End Integration** (Flujos completos de casos de uso)
- **Integration Test Cases** para flujos de usuario
- **Documentación de Interfaces** entre componentes

**Componentes Asignados:**
- Mobile Application (iOS/Android)
- User Interface Module
- Sensor Manager
- Trip Detection Engine
- Obstacle Detection Module
- Local Storage
- Client API
- End-to-End Use Cases (UC1-UC12)
- Service-to-Service Communication
- Message Queue Integration Testing

---

## Fases de Implementación

### Fase 0: Fundamentos del Proyecto
**Duración Estimada:** 2-3 días  
**Responsable:** Ambos (trabajo conjunto)

#### Tareas:
- [ ] Estructura del documento ITD (archivos LaTeX)
- [ ] Configuración del repositorio y estructura de carpetas
- [ ] Definición de convenciones y estándares de documentación
- [ ] Revisión de DD y RASD para extraer información relevante
- [ ] Creación de plantillas para casos de prueba
- [ ] Setup de herramientas de documentación

**Entregables:**
- Estructura completa del documento ITD
- Capítulo 1 (Introduction) completo
- Plantillas para casos de prueba

---

### Fase 1: Estrategia de Integración
**Duración Estimada:** 3-4 días  
**Responsable:** Ambos (trabajo conjunto con revisión cruzada)

#### Tareas Miembro 1 (José):
- [ ] Documentar estrategia Bottom-Up desde perspectiva backend
- [ ] Definir niveles de integración para servicios
- [ ] Especificar orden de integración de servicios backend
- [ ] Documentar estrategia de pruebas para Data Layer

#### Tareas Miembro 2 (Pablo):
- [ ] Documentar estrategia Bottom-Up desde perspectiva cliente
- [ ] Definir niveles de integración para aplicación móvil
- [ ] Especificar orden de integración cliente-servidor
- [ ] Documentar estrategia de pruebas End-to-End

**Entregables:**
- Capítulo 2 (Integration Strategy) completo
- Diagramas de niveles de integración
- Matriz de orden de integración

---

### Fase 2: Plan de Integración de Componentes - Capa de Datos
**Duración Estimada:** 4-5 días  
**Responsable:** Miembro 1 (José)

#### Tareas:
- [ ] Documentar integración DBMS (PostgreSQL)
  - [ ] Esquema de base de datos
  - [ ] Repositorios y abstracciones
  - [ ] Migraciones y seed data
- [ ] Documentar integración Cache Layer (Redis)
  - [ ] Configuración de Redis
  - [ ] Estrategias de cache
  - [ ] TTL y políticas de evicción
- [ ] Casos de prueba para Data Layer
  - [ ] Test cases para repositorios
  - [ ] Test cases para cache
  - [ ] Test cases para migraciones
- [ ] Diagramas de secuencia para operaciones de datos

**Entregables:**
- Sección 3.1 (Data Layer Integration) completa
- Casos de prueba para Data Layer (Sección 4.1)
- Diagramas de secuencia para operaciones de datos

---

### Fase 3: Plan de Integración de Componentes - Servicios Backend (Parte 1)
**Duración Estimada:** 5-6 días  
**Responsable:** Miembro 1 (José)

#### Tareas:
- [ ] Documentar integración User Management Service
  - [ ] Integración con DBMS
  - [ ] Integración con Mail Server
  - [ ] Autenticación y autorización
- [ ] Documentar integración Trip Management Service
  - [ ] Integración con DBMS
  - [ ] Integración con Sensor Data Processing Service
  - [ ] Integración con Weather API
- [ ] Documentar integración Path Management Service
  - [ ] Integración con DBMS
  - [ ] Integración con Sensor Data Processing Service
  - [ ] Integración con Information Merging Service
- [ ] Casos de prueba para servicios (Parte 1)
  - [ ] Test cases User Management
  - [ ] Test cases Trip Management
  - [ ] Test cases Path Management

**Entregables:**
- Sección 3.2.1-3.2.3 (Core Services Integration) completa
- Casos de prueba para servicios core (Sección 4.2.1-4.2.3)
- Diagramas de secuencia para flujos de servicios

---

### Fase 4: Plan de Integración de Componentes - Servicios Backend (Parte 2)
**Duración Estimada:** 5-6 días  
**Responsable:** Miembro 1 (José)

#### Tareas:
- [ ] Documentar integración Sensor Data Processing Service
  - [ ] Integración con Message Queue (RabbitMQ)
  - [ ] Integración con DBMS
  - [ ] Procesamiento de GPS y sensores
- [ ] Documentar integración Path Search Service
  - [ ] Integración con Path Management Service
  - [ ] Integración con DBMS
  - [ ] Algoritmos de búsqueda y scoring
- [ ] Documentar integración Rating Service
  - [ ] Integración con Path Management Service
  - [ ] Integración con DBMS
  - [ ] Cálculo de ratings agregados
- [ ] Documentar integración Information Merging Service
  - [ ] Integración con Path Management Service
  - [ ] Integración con DBMS
  - [ ] Lógica de resolución de conflictos
- [ ] Casos de prueba para servicios (Parte 2)
  - [ ] Test cases Sensor Data Processing
  - [ ] Test cases Path Search
  - [ ] Test cases Rating
  - [ ] Test cases Information Merging

**Entregables:**
- Sección 3.2.4-3.2.7 (Advanced Services Integration) completa
- Casos de prueba para servicios avanzados (Sección 4.2.4-4.2.7)
- Diagramas de secuencia para flujos complejos

---

### Fase 5: Plan de Integración - API Gateway y Servicios Externos
**Duración Estimada:** 4-5 días  
**Responsable:** Miembro 1 (José)

#### Tareas:
- [ ] Documentar integración API Gateway
  - [ ] Routing y versionado
  - [ ] Autenticación y autorización (JWT)
  - [ ] Validación de requests
  - [ ] Integración con todos los servicios backend
- [ ] Documentar integración External Services
  - [ ] Weather API integration
  - [ ] Map Service API integration
  - [ ] Email Service (SMTP) integration
  - [ ] Manejo de errores y fallbacks
- [ ] Documentar integración Message Queue (RabbitMQ)
  - [ ] Configuración de colas
  - [ ] Patrones de comunicación asíncrona
  - [ ] Manejo de mensajes
- [ ] Casos de prueba para API Gateway y servicios externos
  - [ ] Test cases API Gateway routing
  - [ ] Test cases autenticación/autorización
  - [ ] Test cases servicios externos
  - [ ] Test cases manejo de errores

**Entregables:**
- Sección 3.3 (API Gateway Integration) completa
- Sección 3.4 (External Services Integration) completa
- Casos de prueba para API Gateway y externos (Sección 4.3-4.4)
- Diagramas de secuencia para flujos con servicios externos

---

### Fase 6: Plan de Integración - Aplicación Móvil (Parte 1)
**Duración Estimada:** 5-6 días  
**Responsable:** Miembro 2 (Pablo)

#### Tareas:
- [ ] Documentar integración Mobile Application Core
  - [ ] User Interface Module
  - [ ] Client API
  - [ ] Local Storage
- [ ] Documentar integración Sensor Manager
  - [ ] Acceso a GPS
  - [ ] Acceso a Accelerometer
  - [ ] Acceso a Gyroscope
  - [ ] Permisos y manejo de errores
- [ ] Documentar integración Trip Detection Engine
  - [ ] Integración con Sensor Manager
  - [ ] Integración con Client API
  - [ ] Algoritmos de detección
- [ ] Documentar integración Obstacle Detection Module
  - [ ] Integración con Sensor Manager
  - [ ] Integración con Client API
  - [ ] Algoritmos de detección
- [ ] Casos de prueba para aplicación móvil (Parte 1)
  - [ ] Test cases UI Module
  - [ ] Test cases Sensor Manager
  - [ ] Test cases Trip Detection
  - [ ] Test cases Obstacle Detection

**Entregables:**
- Sección 3.5.1-3.5.4 (Mobile Application Core Integration) completa
- Casos de prueba para componentes móviles (Sección 4.5.1-4.5.4)
- Diagramas de secuencia para flujos móviles

---

### Fase 7: Plan de Integración - Aplicación Móvil (Parte 2) y Cliente-Servidor
**Duración Estimada:** 5-6 días  
**Responsable:** Miembro 2 (Pablo)

#### Tareas:
- [ ] Documentar integración Cliente-Servidor
  - [ ] Comunicación HTTPS
  - [ ] Formato JSON
  - [ ] Manejo de sesiones
  - [ ] Sincronización offline/online
- [ ] Documentar integración End-to-End para casos de uso críticos
  - [ ] UC1: User Registration
  - [ ] UC2: Login
  - [ ] UC3: Insert Path Information (Manual)
  - [ ] UC6: Search and Visualize Paths
- [ ] Casos de prueba End-to-End (Parte 1)
  - [ ] Test cases UC1-UC3, UC6
  - [ ] Test cases flujos de error
  - [ ] Test cases sincronización offline

**Entregables:**
- Sección 3.5.5 (Client-Server Integration) completa
- Sección 3.6.1 (End-to-End Critical Use Cases) completa
- Casos de prueba End-to-End críticos (Sección 4.6.1)
- Diagramas de secuencia End-to-End

---

### Fase 8: Plan de Integración - Casos de Uso Avanzados
**Duración Estimada:** 5-6 días  
**Responsable:** Miembro 2 (Pablo)

#### Tareas:
- [ ] Documentar integración End-to-End para casos de uso avanzados
  - [ ] UC4: Insert Path Information (Automated)
  - [ ] UC5: Publish Path Information
  - [ ] UC7: Post Review
  - [ ] UC8: Record Personal Trip
  - [ ] UC9: See Path Data
  - [ ] UC10: View Trip Statistics
  - [ ] UC11: Check Review
  - [ ] UC12: Merge Information from Multiple Users
- [ ] Documentar integración Service-to-Service
  - [ ] Comunicación REST entre servicios
  - [ ] Comunicación asíncrona vía Message Queue
  - [ ] Manejo de errores entre servicios
- [ ] Casos de prueba End-to-End (Parte 2)
  - [ ] Test cases UC4-UC5, UC7-UC12
  - [ ] Test cases Service-to-Service
  - [ ] Test cases escenarios de error complejos

**Entregables:**
- Sección 3.6.2 (End-to-End Advanced Use Cases) completa
- Sección 3.7 (Service-to-Service Integration) completa
- Casos de prueba End-to-End avanzados (Sección 4.6.2)
- Casos de prueba Service-to-Service (Sección 4.7)

---

### Fase 9: Diagramas de Secuencia y Flujos de Integración
**Duración Estimada:** 4-5 días  
**Responsable:** Ambos (trabajo conjunto)

#### Tareas Miembro 1 (José):
- [ ] Diagramas de secuencia para integración backend
  - [ ] Flujos de servicios con DBMS
  - [ ] Flujos con Message Queue
  - [ ] Flujos con servicios externos
  - [ ] Manejo de errores backend

#### Tareas Miembro 2 (Pablo):
- [ ] Diagramas de secuencia para integración cliente
  - [ ] Flujos móvil-servidor
  - [ ] Flujos de detección automática
  - [ ] Flujos offline/online
  - [ ] Manejo de errores cliente

#### Tareas Conjuntas:
- [ ] Diagramas de secuencia End-to-End
  - [ ] Flujos completos de casos de uso
  - [ ] Escenarios de error complejos
  - [ ] Flujos de sincronización

**Entregables:**
- Capítulo 5 (Integration Sequence Diagrams) completo
- Diagramas para todos los flujos principales
- Diagramas para escenarios de error

---

### Fase 10: Herramientas y Entorno de Pruebas
**Duración Estimada:** 3-4 días  
**Responsable:** Ambos (trabajo conjunto)

#### Tareas:
- [ ] Documentar herramientas de testing
  - [ ] Frameworks de testing (JUnit, Jest, etc.)
  - [ ] Herramientas de mocking
  - [ ] Herramientas de integración continua
- [ ] Documentar configuración de entorno
  - [ ] Docker y Docker Compose
  - [ ] Configuración de bases de datos de prueba
  - [ ] Configuración de servicios externos mock
- [ ] Documentar gestión de datos de prueba
  - [ ] Datasets de prueba
  - [ ] Fixtures y seed data
  - [ ] Estrategias de limpieza
- [ ] Documentar CI/CD para pruebas de integración
  - [ ] Pipeline de CI
  - [ ] Ejecución automática de tests
  - [ ] Reportes de cobertura

**Entregables:**
- Capítulo 6 (Tools and Environment) completo
- Configuraciones de ejemplo
- Scripts de setup

---

### Fase 11: Revisión, Integración y Finalización
**Duración Estimada:** 4-5 días  
**Responsable:** Ambos (trabajo conjunto)

#### Tareas:
- [ ] Revisión cruzada completa del documento
  - [ ] Revisión de coherencia
  - [ ] Revisión de completitud
  - [ ] Revisión de formato y estilo
- [ ] Integración de todas las secciones
  - [ ] Verificar referencias cruzadas
  - [ ] Verificar numeración de figuras y tablas
  - [ ] Verificar índice y tabla de contenidos
- [ ] Completar capítulo Effort Spent
  - [ ] Registro de horas por miembro
  - [ ] Desglose por fase
- [ ] Completar capítulo References
  - [ ] Referencias a DD
  - [ ] Referencias a RASD
  - [ ] Referencias a estándares y herramientas
- [ ] Compilación final y verificación
  - [ ] Compilar documento LaTeX
  - [ ] Verificar formato PDF
  - [ ] Verificar todas las referencias

**Entregables:**
- Documento ITD completo y revisado
- PDF final sin errores
- Capítulo Effort Spent completo
- Capítulo References completo

---

## Cronograma Detallado

### Timeline General (Estimado: 6-7 semanas)

| Fase | Duración | Responsable Principal | Dependencias |
|------|----------|----------------------|--------------|
| Fase 0: Fundamentos | 2-3 días | Ambos | Ninguna |
| Fase 1: Estrategia | 3-4 días | Ambos | Fase 0 |
| Fase 2: Data Layer | 4-5 días | José | Fase 1 |
| Fase 3: Backend Services (Parte 1) | 5-6 días | José | Fase 2 |
| Fase 4: Backend Services (Parte 2) | 5-6 días | José | Fase 3 |
| Fase 5: API Gateway y Externos | 4-5 días | José | Fase 4 |
| Fase 6: Mobile App (Parte 1) | 5-6 días | Pablo | Fase 1 |
| Fase 7: Mobile App (Parte 2) y Cliente-Servidor | 5-6 días | Pablo | Fase 6, Fase 5 |
| Fase 8: Casos de Uso Avanzados | 5-6 días | Pablo | Fase 7 |
| Fase 9: Diagramas de Secuencia | 4-5 días | Ambos | Fase 5, Fase 8 |
| Fase 10: Herramientas y Entorno | 3-4 días | Ambos | Fase 9 |
| Fase 11: Revisión y Finalización | 4-5 días | Ambos | Fase 10 |

**Nota:** Las fases 2-5 (José) y 6-8 (Pablo) pueden ejecutarse en paralelo después de la Fase 1.

---

## Dependencias y Pre-requisitos

### Dependencias entre Fases

1. **Fase 0 → Fase 1:** La estructura del documento debe estar lista antes de comenzar la estrategia
2. **Fase 1 → Fases 2-8:** La estrategia de integración debe estar definida antes de documentar planes específicos
3. **Fase 2 → Fase 3-4:** La integración de Data Layer debe estar documentada antes de servicios que la usan
4. **Fase 3-4 → Fase 5:** Los servicios backend deben estar documentados antes del API Gateway
5. **Fase 5 → Fase 7:** El API Gateway debe estar documentado antes de la integración cliente-servidor
6. **Fase 6 → Fase 7:** Los componentes móviles core deben estar documentados antes de la integración completa
7. **Fase 5, 8 → Fase 9:** Los planes de integración deben estar completos antes de crear diagramas de secuencia
8. **Fase 9 → Fase 10:** Los diagramas deben estar listos antes de documentar herramientas
9. **Todas → Fase 11:** Todas las fases anteriores deben estar completas antes de la revisión final

### Pre-requisitos Técnicos

- [ ] Acceso completo a DD y RASD
- [ ] Comprensión de la arquitectura del sistema
- [ ] Conocimiento de herramientas LaTeX
- [ ] Conocimiento de herramientas de diagramación (draw.io, PlantUML, etc.)
- [ ] Acceso a herramientas de testing mencionadas
- [ ] Entorno de desarrollo configurado

### Documentos de Referencia

- [ ] DD completo (especialmente Capítulo 2: Architectural Design, Capítulo 5: Implementation, Integration and Test Plan)
- [ ] RASD completo (especialmente Capítulo 3: Specific Requirements, casos de uso)
- [ ] Diagramas de arquitectura del DD
- [ ] Diagramas de secuencia del DD (Runtime View)
- [ ] Interfaces de componentes del DD (Component Interfaces)

---

## Puntos de Sincronización

Para asegurar coherencia y evitar conflictos, se establecen los siguientes puntos de sincronización:

1. **Después de Fase 1:** Reunión para revisar y alinear la estrategia de integración
2. **Después de Fase 2:** Revisión conjunta de la integración de Data Layer
3. **Después de Fase 5 y Fase 7:** Reunión para alinear integración cliente-servidor
4. **Durante Fase 9:** Reuniones diarias para coordinar diagramas de secuencia
5. **Durante Fase 11:** Reuniones de revisión cruzada

---

## Criterios de Éxito

El roadmap se considerará completado cuando:

- [ ] Todos los capítulos del ITD estén completos
- [ ] Todos los casos de prueba estén documentados
- [ ] Todos los diagramas de secuencia estén incluidos
- [ ] El documento compile sin errores
- [ ] Todas las referencias cruzadas estén correctas
- [ ] El capítulo Effort Spent esté completo
- [ ] El documento esté revisado por ambos miembros
- [ ] El PDF final esté generado y verificado

---

## Notas Finales

- Este roadmap es un documento vivo y puede ajustarse según necesidades del proyecto
- Las estimaciones de tiempo son aproximadas y pueden variar
- Se recomienda mantener comunicación constante entre miembros del equipo
- Los entregables de cada fase deben ser revisados antes de continuar
- Se debe mantener un registro de cambios y decisiones importantes

---

**Última Actualización:** Enero 2026  
**Versión del Roadmap:** 1.0
