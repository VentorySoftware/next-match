# TODO: Implementar estado global para torneos

## Pasos a completar:
- [x] Crear TournamentContext.tsx para manejar el estado global de torneos
- [x] Actualizar App.tsx para envolver con TournamentProvider
- [x] Modificar CreateTournament.tsx para agregar torneos al contexto
- [x] Actualizar Tournaments.tsx para consumir torneos del contexto
- [x] Probar la creación y listado de torneos

## Resumen de cambios:
- Se creó un contexto global (TournamentContext) para manejar el estado de los torneos
- Se actualizó la aplicación para usar el contexto en lugar de datos estáticos
- Ahora los torneos creados aparecen inmediatamente en la lista
- La aplicación está corriendo en http://localhost:8081/
