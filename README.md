# Countries Explorer

Aplicación técnica para explorar países, desarrollada con React Native (Expo) y TypeScript.

## Requisitos

- Node.js v18.x o superior (recomendado v18 LTS)
- npm v9.x o superior
- Expo CLI v7.x o superior
- Expo SDK 54 (ver `package.json` y/o `eas.json`)

## Instalación y ejecución

1. Clona el repositorio:
   ```sh
   git clone <REPO_URL>
   cd countries-explorer-telecoming
   ```
2. Instala dependencias:
   ```sh
   npm install
   ```
3. Inicia el proyecto en modo desarrollo:
   ```sh
   npx expo start
   ```
4. Escanea el QR con la app Expo Go o ejecuta en emulador/simulador.

## Decisiones técnicas

- **Expo + React Native**: Permite desarrollo rápido multiplataforma y fácil testing.
- **TypeScript**: Tipado estricto para mayor robustez y mantenibilidad.
- **i18n propio**: Implementación simple de internacionalización (inglés/español) con persistencia y detección automática.
- **Componentes desacoplados**: Cada parte de la UI es un componente reutilizable y fácil de testear.
- **Diseño limpio**: Se priorizó claridad visual y experiencia de usuario sencilla.


## Pruebas

1. Instala las dependencias de desarrollo (si no lo hiciste antes):
   ```sh
   npm install
   ```
2. Ejecuta los tests (si tienes tests configurados):
   ```sh
   npm test
   ```
   > Nota: Si eliminaste los archivos de test para la entrega, este comando no ejecutará pruebas.

## Notas

- Si necesitas reproducibilidad exacta, revisa las versiones en `package.json` y/o `eas.json`.
- Para cualquier duda técnica, consulta los comentarios en el código o contacta al autor.
