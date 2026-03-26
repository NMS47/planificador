// Configuración extraída de tu URL de error
const firebaseConfig = {
    databaseURL: "https://calendario-div-ec-capac-anf-default-rtdb.firebaseio.com"
};

// Inicialización
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

/**
 * Persistencia Global
 * @param {Object} data - Objeto con proyectos, tareas e idCounter
 */
function persistToFirebase(data) {
    db.ref('planner_data').set(data)
        .catch(err => console.error("Error al guardar en Firebase:", err));
}

/**
 * Escucha en tiempo real
 */
function listenToFirebase(callback) {
    db.ref('planner_data').on('value', (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}