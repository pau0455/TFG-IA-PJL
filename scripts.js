// --- LÓGICA DASHBOARD (Fetch a BBDD) ---
let lastDataString = ""; // Variable para evitar redibujar si no hay cambios

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
        console.error("🛑 Error detectado en JavaScript:", error);
        
        // MOCK DATA actualizado con la nueva estructura
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

// NUEVA FUNCIÓN RENDER: Pinta de forma estructurada los pedidos
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
        
        // Construimos la columna de pedidos lógicamente
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