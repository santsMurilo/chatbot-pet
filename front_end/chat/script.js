async function enviarMensagem() {
    const input = document.getElementById("mensagem");
    const chatBox = document.getElementById("chat-box");

    const texto = input.value;

    if (!texto) return;

    chatBox.innerHTML += `<div class="mensagem usuario">${texto}</div>`;

    input.value = "";

    try {
        const resposta = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ mensagem: texto })
        });

        const data = await resposta.json();

        chatBox.innerHTML += `<div class="mensagem bot">${data.resposta}</div>`;

    } catch {
        chatBox.innerHTML += `<div class="mensagem bot">⚠️ Erro ao conectar com o servidor.</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}