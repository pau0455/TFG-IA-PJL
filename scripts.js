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
    // 1. Ocultar todos los paneles de documentación
    const panes = document.querySelectorAll('.doc-pane');
    panes.forEach(pane => pane.classList.remove('active'));
    
    // 2. Quitar la clase 'active' de todos los enlaces del sidebar
    const links = document.querySelectorAll('.docs-sidebar a');
    links.forEach(link => link.classList.remove('active'));

    // 3. Mostrar el panel solicitado y marcar el enlace como activo
    document.getElementById(docId).classList.add('active');
    element.classList.add('active');
    
    // 4. Subir el scroll arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}