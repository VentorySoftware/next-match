# TODO: Corregir redirección de "Ver detalles" en torneos

## Información recopilada
- El botón "Ver Detalles" en TournamentCard redirige a `/tournament/${id}`.
- La ruta `/tournament/:id` está mapeada al componente Tournament.
- El componente Tournament usa datos mock hardcodeados en lugar de obtener el torneo por id.
- El contexto TournamentContext tiene la lista de torneos pero no un método para obtener por id.

## Plan de corrección
- [] Modificar src/pages/Tournament.tsx para usar el contexto TournamentContext.
- [] Obtener el torneo correspondiente al id de la URL usando useParams.
- [] Reemplazar los datos mock por los datos reales del torneo obtenido.
- [] Añadir manejo de error si no se encuentra el torneo (mostrar mensaje o redirigir).
- [] Probar la navegación desde la lista de torneos a la página de detalles.

## Archivos a modificar
- src/pages/Tournament.tsx (cambio principal)
- Posiblemente src/context/TournamentContext.tsx (si se añade método auxiliar)

## Pasos de implementación
- [] Leer el archivo Tournament.tsx actual.
- [] Importar useTournaments del contexto.
- [] Usar find() para obtener el torneo por id.
- [] Reemplazar el objeto mock por el torneo encontrado.
- [] Añadir condición para torneo no encontrado.
- [] Probar la funcionalidad.
