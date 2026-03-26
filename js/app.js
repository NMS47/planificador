document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO ---
    let projects = [];
    let dayTasks = {};
    let idCounter = 0;
    let currentYear = 2026;
    let dayModalState = { open: false, y: 0, m: 0, d: 0 };

    // --- ELEMENTOS ---
    const monthsGrid = document.getElementById('months-grid');
    const projectList = document.getElementById('project-list');
    const addProjectBtn = document.getElementById('add-project-btn');
    const downloadBtn = document.getElementById('btn-download-json');

    // --- INICIO ---
    async function init() {
        await loadData();
        renderAll();
        setupEventListeners();
    }

    // Cargar datos desde el JSON estático de tu repo
    async function loadData() {
        try {
            // Agregamos timestamp para evitar caché de GitHub Pages
            const resp = await fetch(`data.json?t=${Date.now()}`);
            if (resp.ok) {
                const data = await resp.json();
                projects = data.projects || [];
                dayTasks = data.dayTasks || {};
                idCounter = data.idCounter || 0;
            }
        } catch (e) {
            console.error("Error al cargar data.json:", e);
        }
    }

    // Función exclusiva para ti (Editor): Descarga el JSON para subirlo a GitHub
    function downloadUpdatedJSON() {
        const dataStr = JSON.stringify({ projects, dayTasks, idCounter }, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "data.json";
        link.click();
    }

    // --- LÓGICA DE CALENDARIO ---
    function renderCalendar() {
        monthsGrid.innerHTML = '';
        const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                             "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        for (let m = 0; m < 12; m++) {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'month-container';
            
            let html = `<div class="month-name">${nombresMeses[m]}</div>`;
            html += `<div class="days-grid">`;
            
            const daysInMonth = new Date(currentYear, m + 1, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                const key = `${currentYear}-${m}-${d}`;
                const hasTasks = dayTasks[key] && dayTasks[key].length > 0;
                html += `<div class="day-cell ${hasTasks ? 'has-tasks' : ''}" onclick="openModal(${currentYear},${m},${d})">
                            ${d}
                         </div>`;
            }
            html += `</div>`;
            monthDiv.innerHTML = html;
            monthsGrid.appendChild(monthDiv);
        }
    }

    // --- GESTIÓN DE PROYECTOS ---
    function renderProjects() {
        projectList.innerHTML = projects.map(p => `
            <div class="project-card" style="border-left: 4px solid ${p.color}">
                <span>${p.name}</span>
                <button class="delete-btn" onclick="deleteProject(${p.id})">×</button>
            </div>
        `).join('');
    }

    window.deleteProject = (id) => {
        projects = projects.filter(p => p.id !== id);
        renderAll();
    };

    function addProject() {
        const input = document.getElementById('project-name');
        if (!input.value.trim()) return;
        projects.push({
            id: ++idCounter,
            name: input.value.trim(),
            color: '#e8ff47'
        });
        input.value = '';
        renderAll();
    }

    // --- UI Y EVENTOS ---
    function renderAll() {
        renderCalendar();
        renderProjects();
    }

    function setupEventListeners() {
        addProjectBtn.addEventListener('click', addProject);
        downloadBtn.addEventListener('click', downloadUpdatedJSON);
        
        document.getElementById('menu-toggle').addEventListener('click', () => {
            document.getElementById('main-menu').classList.toggle('open');
        });

        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('day-modal').classList.remove('active');
        });
        
        // Exportar PDF (Ejemplo básico)
        document.getElementById('btn-export-pdf').addEventListener('click', () => {
            window.print(); 
        });
    }

    // Modal (Simplificado)
    window.openModal = (y, m, d) => {
        dayModalState = { open: true, y, m, d };
        document.getElementById('modal-title').innerText = `${d} de Enero (2026)`; // Ajustar mes dinámico
        document.getElementById('day-modal').classList.add('active');
        // Aquí cargarías las tareas de dayTasks[`${y}-${m}-${d}`]
    };

    init();
});
