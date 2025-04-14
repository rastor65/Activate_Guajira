// static/js/notificaciones.js

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/static/service-worker.js')
        .then(function(swReg) {
            console.log('✅ Service Worker registrado:', swReg);
            // Aquí luego agregaremos la suscripción
        })
        .catch(function(error) {
            console.error('❌ Error al registrar Service Worker:', error);
        });
}