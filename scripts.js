// --- Lógica del Demo Chat ---
function simulateSend() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    const message = input.value.trim();
    if (message === '') return;

    const chatHistory = document.getElementById('chat-history');
    
    // Mensaje de usuario
    const userMsg = document.createElement('div');
    userMsg.className = 'message msg-user';
    userMsg.textContent = message;
    chatHistory.appendChild(userMsg);
    
    input.value = '';
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Respuesta IA simulada
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message msg-ai';
        aiMsg.textContent = "Mensaje recibido. En la versión real, el orquestador n8n enviará esto al agente Mistral, que podrá consultar PostgreSQL y agendar tu reserva en Google Calendar de forma autónoma.";
        chatHistory.appendChild(aiMsg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 1000);
}

// Permitir enviar con la tecla Enter
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && document.getElementById('chat-input')) {
        simulateSend();
    }
});

// --- Lógica de la Documentación (Pestañas interactivo) ---
function showDoc(docId, element) {
    const panes = document.querySelectorAll('.doc-pane');
    panes.forEach(pane => pane.classList.remove('active'));
    
    const links = document.querySelectorAll('.docs-sidebar a');
    links.forEach(link => link.classList.remove('active'));

    document.getElementById(docId).classList.add('active');
    element.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- LÓGICA LOGIN DESARROLLADOR ---
function checkDevLogin() {
    const user = document.getElementById('dev-user').value;
    const pass = document.getElementById('dev-pass').value;
    const errorMsg = document.getElementById('login-error');

    if (user === 'Manolo' && pass === 'Skibidi1234') {
        sessionStorage.setItem('dev_logged', 'true');
        window.location.href = 'dashboard-dev.html';
    } else {
        errorMsg.style.display = 'block';
    }
}

function logoutDev() {
    sessionStorage.removeItem('dev_logged');
    window.location.href = 'login-dev.html';
}

// --- LÓGICA DASHBOARD (Fetch a BBDD) ---
let lastDataString = ""; // Variable para evitar redibujar si no hay cambios

async function fetchReservas() {
    try {
        const response = await fetch('reservas.php');
        if (!response.ok) throw new Error(`Servidor devolvió error: ${response.status}`);
        
        const textData = await response.text();
        
        // CHIVATO: Esto imprimirá en la consola oculta exactamente qué manda PHP
        console.log("Recibido de PHP:", textData); 
        
        if (textData !== lastDataString) {
            // Intentamos convertir el texto a JSON
            const reservas = JSON.parse(textData);
            lastDataString = textData; 
            renderTable(reservas);
        }

    } catch (error) {
        console.error("🛑 Error detectado en JavaScript:", error);
        
        if (lastDataString === "") {
            const mockData =[
                { id_reserva: 101, fecha_hora: '2026-03-15T21:00:00.000Z', cliente_nombre: 'Laura', cliente_apellido: 'Gómez', telefono: '600123456', local_ciudad: 'Barcelona', menu_nombre: 'Menú Degustación', numero_personas: 4 },
                { id_reserva: 102, fecha_hora: '2026-03-16T14:30:00.000Z', cliente_nombre: 'Carlos', cliente_apellido: 'Ruiz', telefono: '611987654', local_ciudad: 'Madrid', menu_nombre: 'Menú Ejecutivo', numero_personas: 2 }
            ];
            lastDataString = "mocked";
            renderTable(mockData);
        }
    }
}

// La función renderTable(reservas) se queda EXACTAMENTE igual a la que ya tenías
function renderTable(reservas) {
    const tbody = document.getElementById('reservas-body');
    tbody.innerHTML = ''; 

    if(reservas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:2rem;">No hay reservas actualmente.</td></tr>`;
        return;
    }

    reservas.forEach(r => {
        const dateObj = new Date(r.fecha_hora);
        const fechaFormat = dateObj.toLocaleDateString('es-ES') + ' - ' + dateObj.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'});
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-family: var(--ai-font-mono); color: #a855f7;">#${r.id_reserva}</td>
            <td style="font-weight: bold;">${fechaFormat}</td>
            <td>${r.cliente_nombre} ${r.cliente_apellido}</td>
            <td style="color: var(--ai-muted);">${r.telefono}</td>
            <td>📍 ${r.local_ciudad}</td>
            <td>${r.menu_nombre ? '🍽️ '+r.menu_nombre : '<i style="color:#666;">Sin menú</i>'}</td>
            <td><span class="badge-personas">👤 ${r.numero_personas}</span></td>
            <td><span class="badge-status">Confirmada</span></td>
        `;
        tbody.appendChild(tr);
    });
}
