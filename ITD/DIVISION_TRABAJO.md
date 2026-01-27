# División de Trabajo - ITD Implementation
## Best Bike Paths (BBP)

**Equipo:** José Martínez Estévez, Pablo Jesús Herrero Díaz

---

## Resumen Visual de Responsabilidades

```
┌─────────────────────────────────────────────────────────────────┐
│                    ITD IMPLEMENTATION                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌───────────────────┐                    ┌───────────────────┐
│   JOSÉ MARTÍNEZ   │                    │  PABLO HERRERO    │
│   ESTÉVEZ         │                    │  DÍAZ             │
└───────────────────┘                    └───────────────────┘
        │                                           │
        │                                           │
        ▼                                           ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│   BACKEND & INFRASTRUCTURE   │        │   CLIENT & END-TO-END        │
└──────────────────────────────┘        └──────────────────────────────┘
```

---

## Detalle de Responsabilidades

### 👤 José Martínez Estévez - Backend & Infrastructure

#### Áreas de Responsabilidad:

1. **Data Layer Integration**
   - PostgreSQL DBMS
   - Redis Cache Layer
   - Repositorios y abstracciones
   - Migraciones y seed data

2. **Backend Services Integration**
   - User Management Service
   - Trip Management Service
   - Path Management Service
   - Sensor Data Processing Service
   - Path Search Service
   - Rating Service
   - Information Merging Service

3. **Infrastructure Integration**
   - API Gateway (routing, auth, validation)
   - Message Queue (RabbitMQ)
   - External Services (Weather API, Map API, Email)

4. **Backend Integration Test Cases**
   - Test cases para todos los servicios backend
   - Test cases para Data Layer
   - Test cases para API Gateway
   - Test cases para servicios externos

5. **Backend Sequence Diagrams**
   - Diagramas de flujos entre servicios
   - Diagramas de flujos con DBMS
   - Diagramas de flujos con Message Queue
   - Diagramas de manejo de errores backend

#### Fases Asignadas:
- ✅ Fase 0: Fundamentos (conjunta)
- ✅ Fase 1: Estrategia (conjunta)
- ✅ Fase 2: Data Layer Integration
- ✅ Fase 3: Backend Services Integration - Parte 1
- ✅ Fase 4: Backend Services Integration - Parte 2
- ✅ Fase 5: API Gateway y Servicios Externos
- ✅ Fase 9: Diagramas de Secuencia (backend)
- ✅ Fase 10: Herramientas y Entorno (conjunta)
- ✅ Fase 11: Revisión y Finalización (conjunta)

#### Estimación de Horas: 136-176 horas

---

### 👤 Pablo Jesús Herrero Díaz - Client & End-to-End

#### Áreas de Responsabilidad:

1. **Mobile Application Integration**
   - User Interface Module
   - Client API
   - Local Storage
   - Sensor Manager (GPS, Accelerometer, Gyroscope)
   - Trip Detection Engine
   - Obstacle Detection Module

2. **Client-Server Integration**
   - Comunicación HTTPS/JSON
   - Manejo de sesiones
   - Sincronización offline/online
   - Manejo de errores cliente

3. **End-to-End Integration**
   - Todos los casos de uso (UC1-UC12)
   - Flujos completos de usuario
   - Escenarios de error complejos
   - Sincronización de datos

4. **Service-to-Service Integration**
   - Comunicación REST entre servicios
   - Comunicación asíncrona vía Message Queue
   - Manejo de errores entre servicios

5. **Client Integration Test Cases**
   - Test cases para componentes móviles
   - Test cases End-to-End
   - Test cases Service-to-Service
   - Test cases de sincronización

6. **Client Sequence Diagrams**
   - Diagramas de flujos móvil-servidor
   - Diagramas de flujos End-to-End
   - Diagramas de detección automática
   - Diagramas de manejo de errores cliente

#### Fases Asignadas:
- ✅ Fase 0: Fundamentos (conjunta)
- ✅ Fase 1: Estrategia (conjunta)
- ✅ Fase 6: Mobile Application Integration - Parte 1
- ✅ Fase 7: Mobile Application Integration - Parte 2 y Cliente-Servidor
- ✅ Fase 8: Casos de Uso Avanzados
- ✅ Fase 9: Diagramas de Secuencia (cliente y End-to-End)
- ✅ Fase 10: Herramientas y Entorno (conjunta)
- ✅ Fase 11: Revisión y Finalización (conjunta)

#### Estimación de Horas: 124-164 horas

---

## Matriz de Responsabilidades por Componente

| Componente | Responsable | Tipo de Integración |
|------------|-------------|-------------------|
| **Data Layer** |
| PostgreSQL DBMS | José | Data Layer |
| Redis Cache | José | Data Layer |
| Repositorios | José | Data Layer |
| **Backend Services** |
| User Management Service | José | Service Integration |
| Trip Management Service | José | Service Integration |
| Path Management Service | José | Service Integration |
| Sensor Data Processing Service | José | Service Integration |
| Path Search Service | José | Service Integration |
| Rating Service | José | Service Integration |
| Information Merging Service | José | Service Integration |
| **Infrastructure** |
| API Gateway | José | Gateway Integration |
| RabbitMQ | José | Message Queue |
| Weather API | José | External Service |
| Map Service API | José | External Service |
| Email Service | José | External Service |
| **Mobile Application** |
| User Interface Module | Pablo | Client Integration |
| Client API | Pablo | Client Integration |
| Local Storage | Pablo | Client Integration |
| Sensor Manager | Pablo | Client Integration |
| Trip Detection Engine | Pablo | Client Integration |
| Obstacle Detection Module | Pablo | Client Integration |
| **Integration Flows** |
| Cliente-Servidor | Pablo | End-to-End |
| Service-to-Service | Pablo | End-to-End |
| UC1-UC12 | Pablo | End-to-End |

---

## Puntos de Sincronización

### Reuniones de Coordinación

1. **Después de Fase 1** (Estrategia)
   - Revisar y alinear estrategia de integración
   - Definir interfaces entre componentes
   - Establecer convenciones de documentación

2. **Después de Fase 2** (Data Layer)
   - Revisar integración de Data Layer
   - Validar que servicios backend pueden usar Data Layer
   - Asegurar que casos de prueba están alineados

3. **Después de Fase 5 y Fase 7** (API Gateway y Cliente-Servidor)
   - Revisar integración completa cliente-servidor
   - Validar flujos de autenticación
   - Asegurar coherencia en manejo de errores

4. **Durante Fase 9** (Diagramas de Secuencia)
   - Reuniones diarias para coordinar diagramas
   - Asegurar coherencia entre diagramas backend y cliente
   - Validar flujos End-to-End completos

5. **Durante Fase 11** (Revisión Final)
   - Reuniones de revisión cruzada
   - Validar completitud del documento
   - Asegurar coherencia global

---

## Dependencias entre Trabajos

### Dependencias de José (Backend)

```
Fase 1 (Estrategia)
    │
    ├─→ Fase 2 (Data Layer)
    │       │
    │       ├─→ Fase 3 (Backend Services - Parte 1)
    │       │       │
    │       │       └─→ Fase 4 (Backend Services - Parte 2)
    │       │               │
    │       │               └─→ Fase 5 (API Gateway y Externos)
    │       │                       │
    │       │                       └─→ [Espera Fase 7 de Pablo]
    │       │                               │
    │       └───────────────────────────────┘
    │                                           │
    └───────────────────────────────────────────┘
                                                    │
                                                    ▼
                                            Fase 9 (Diagramas)
```

### Dependencias de Pablo (Cliente)

```
Fase 1 (Estrategia)
    │
    ├─→ Fase 6 (Mobile App - Parte 1)
    │       │
    │       └─→ Fase 7 (Mobile App - Parte 2 y Cliente-Servidor)
    │               │
    │               ├─→ [Espera Fase 5 de José]
    │               │       │
    │               │       └─→ Fase 8 (Casos de Uso Avanzados)
    │               │               │
    │               └───────────────┘
    │                       │
    └───────────────────────┘
                            │
                            ▼
                    Fase 9 (Diagramas)
```

### Trabajo Conjunto

```
Fase 0 (Fundamentos) ──→ Fase 1 (Estrategia)
                            │
                            ├─→ [Trabajo Paralelo]
                            │   José: Fases 2-5
                            │   Pablo: Fases 6-8
                            │
                            └─→ Fase 9 (Diagramas - Conjunta)
                                    │
                                    └─→ Fase 10 (Herramientas - Conjunta)
                                            │
                                            └─→ Fase 11 (Revisión - Conjunta)
```

---

## Comunicación y Colaboración

### Canales de Comunicación

- **Reuniones de sincronización:** Según puntos definidos arriba
- **Comunicación diaria:** Para resolver dudas rápidas
- **Revisión cruzada:** Al final de cada fase individual
- **Revisión final:** Fase 11 completa

### Compartir Información

- **Repositorio compartido:** Todos los archivos en carpeta ITD/
- **Documentación común:** Referencias a DD y RASD
- **Plantillas compartidas:** Para casos de prueba y diagramas
- **Convenciones comunes:** Formato, estilo, nomenclatura

---

## Criterios de Calidad

### Para cada fase individual:

- [ ] Documentación completa según especificaciones
- [ ] Casos de prueba bien definidos
- [ ] Diagramas claros y completos
- [ ] Referencias cruzadas correctas
- [ ] Revisión propia realizada

### Para fases conjuntas:

- [ ] Revisión cruzada realizada
- [ ] Coherencia entre secciones
- [ ] Estilo consistente
- [ ] Referencias verificadas

---

## Notas Importantes

1. **Paralelización:** Las fases 2-5 (José) y 6-8 (Pablo) pueden ejecutarse en paralelo después de la Fase 1.

2. **Sincronización:** Es crítico sincronizarse antes de Fase 7 (Pablo necesita Fase 5 de José) y Fase 9 (ambos necesitan trabajar juntos).

3. **Calidad:** Cada miembro es responsable de la calidad de sus secciones antes de la revisión final.

4. **Flexibilidad:** El roadmap puede ajustarse según necesidades, pero debe comunicarse cualquier cambio.

---

**Última Actualización:** Enero 2026  
**Versión:** 1.0
