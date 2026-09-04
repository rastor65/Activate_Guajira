// Entorno de desarrollo. En los builds de produccion este archivo se
// reemplaza por environment.prod.ts (ver fileReplacements en angular.json).
//
// El despliegue de Railway (https://activate-guajira.up.railway.app) responde
// "Application not found": el servicio no esta activo. Mientras tanto se apunta
// al backend Django local.
export const environment = {
  production: false,
  API_URI: 'http://localhost:8000'
  // API_URI: 'https://activate-guajira.up.railway.app'
};
