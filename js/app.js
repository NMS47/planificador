document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO GLOBAL (Variables mantenidas según pedido) ---
    let projects = [];
    let dayTasks = {};
    let idCounter = 0;
    
    // --- SELECTORES ---
    const projectNameInput = document.getElementById('project-name');
    const projectListContainer = document.getElementById('project-list');
    const addProjectBtn = document.getElementById('add-project-btn');

    // --- INICIALIZACIÓN ---
    const init = () => {
        setupEventListeners();
        syncData();
        renderCalendar(); // Asumiendo que esta función existe en tu lógica original
    };

    // --- LÓGICA DE SINCRONIZACIÓN ---
    function syncData() {
        listenToFirebase((data) => {
            if (data) {
                projects = data.projects || [];
                dayTasks = data.dayTasks || {};
                idCounter = data.idCounter || 0;
                refreshUI();
            }
        });
    }

    function persist() {
        persistToFirebase({
            projects,
            dayTasks,
            idCounter
        });
    }

    // --- GESTIÓN DE PROYECTOS ---
    function addProject() {
        const name = projectNameInput.value.trim();
        if (!name) return;

        const newProject = {
            id: ++idCounter,
            name: name,
            color: '#e8ff47' // Color por defecto
        };

        projects.push(newProject);
        projectNameInput.value = '';
        persist();
        refreshUI();
    }

    // --- REFRESCO DE UI ---
    function refreshUI() {
        renderSideCards();
        // Llamar aquí a todas tus funciones de renderizado actuales
    }

    function renderSideCards() {
        projectListContainer.innerHTML = projects.map(p => `
            <div class="project-card" style="border-left: 4px solid ${p.color}">
                <span>${p.name}</span>
            </div>
        `).join('');
    }

    // --- EVENTOS ---
    function setupEventListeners() {
        addProjectBtn.addEventListener('click', addProject);
        
        // Manejo del menú hamburguesa
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('main-menu').classList.toggle('open');
        });

        // Cerrar menús al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.hamburger-wrap')) {
                document.getElementById('main-menu').classList.remove('open');
            }
        });
    }

    init();
});