// Permitir enviar con la tecla Enter
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && document.getElementById('chat-input')) {
        simulateSend();
    }
});

// --- Lógica de los docs  ---
function showDoc(docId, element) {
    const panes = document.querySelectorAll('.doc-pane');
    panes.forEach(pane => pane.classList.remove('active'));
    
    const links = document.querySelectorAll('.docs-sidebar a');
    links.forEach(link => link.classList.remove('active'));

    document.getElementById(docId).classList.add('active');
    element.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Login barato ---
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

// --- LÓGICA del dashbaord ---
let lastDataString = ""; // la santa variable

async function fetchReservas() {
    try {
        const response = await fetch('reservas.php');
        if (!response.ok) throw new Error(`Servidor devolvió error: ${response.status}`);
        
        const textData = await response.text();
        
        if (textData !== lastDataString) {
            const reservas = JSON.parse(textData);
            lastDataString = textData; 
            renderTable(reservas);
        }

    } catch (error) {
        console.error("Error detectado en JavaScript:", error);
        
        // mambo
        if (lastDataString === "") {
            const mockData =[
                { id_reserva: 101, fecha_hora: '2026-03-15T21:00:00.000Z', cliente_nombre: 'Laura', cliente_apellido: 'Gómez', telefono: '600123456', local_ciudad: 'Barcelona', menus_solicitados: 'Menú Degustación (x4)', platos_solicitados: null, numero_personas: 4 },
                { id_reserva: 102, fecha_hora: '2026-03-16T14:30:00.000Z', cliente_nombre: 'Carlos', cliente_apellido: 'Ruiz', telefono: '611987654', local_ciudad: 'Madrid', menus_solicitados: null, platos_solicitados: 'Croquetas de Jamón (x2), Solomillo (x2)', numero_personas: 2 }
            ];
            lastDataString = "mocked";
            renderTable(mockData);
        }
    }
}

// pedidos
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
        
        // columna de los pedidos actualizada con lo de los menus y los platos
        let pedidoHTML = '';
        if (r.menus_solicitados) {
            pedidoHTML += `<div style="margin-bottom: 4px; color: #e5e7eb;"><strong>📦 Menús:</strong> ${r.menus_solicitados}</div>`;
        }
        if (r.platos_solicitados) {
            pedidoHTML += `<div style="color: #cbd5e1;"><strong>🍽️ Carta:</strong> ${r.platos_solicitados}</div>`;
        }
        if (!r.menus_solicitados && !r.platos_solicitados) {
            pedidoHTML = '<i style="color:#666;">Sin pedido anticipado</i>';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-family: var(--ai-font-mono); color: #a855f7;">#${r.id_reserva}</td>
            <td style="font-weight: bold;">${fechaFormat}</td>
            <td>${r.cliente_nombre} ${r.cliente_apellido}</td>
            <td style="color: var(--ai-muted);">${r.telefono}</td>
            <td style="white-space: nowrap;">📍 ${r.local_ciudad}</td>
            <td>${pedidoHTML}</td>
            <td><span class="badge-personas">👤 ${r.numero_personas}</span></td>
            <td><span class="badge-status">Confirmada</span></td>
        `;
        tbody.appendChild(tr);
    });
}
