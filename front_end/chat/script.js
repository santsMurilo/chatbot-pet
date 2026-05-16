let conversas = JSON.parse(localStorage.getItem("conversas")) || [];

let conversaAtual = null;

const chatBox = document.getElementById("chat-box");
const historico = document.querySelector(".history");
const botaoNova = document.querySelector(".new-chat");

/* INICIAR */

renderHistorico();

if(conversas.length > 0){

    abrirConversa(conversas[0].id);

}else{

    criarNovaConversa();

}

/* NOVA CONVERSA */

botaoNova.addEventListener("click", () => {

    criarNovaConversa();

});

function criarNovaConversa(){

    const nova = {
        id: Date.now(),
        titulo: "Nova conversa",
        mensagens: [
            {
                tipo:"bot",
                texto:"Olá! 🦜 Como posso ajudar você hoje?"
            }
        ]
    };

    conversas.unshift(nova);

    salvar();

    renderHistorico();

    abrirConversa(nova.id);
}

/* ENVIAR */

async function enviarMensagem(){

    const input = document.getElementById("mensagem");

    const texto = input.value.trim();

    if(!texto) return;

    adicionarMensagem("user", texto);

    input.value = "";

    adicionarMensagem("bot", "Digitando...");

    try{

        const resposta = await fetch("http://localhost:3000/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                mensagem:texto
            })

        });

        const data = await resposta.json();

        removerUltimaMensagem();

        adicionarMensagem("bot", data.resposta);

    }catch{

        removerUltimaMensagem();

        adicionarMensagem(
            "bot",
            "⚠️ Erro ao conectar com o servidor."
        );
    }
}

/* ADICIONAR MENSAGEM */

function adicionarMensagem(tipo, texto){

    const div = document.createElement("div");

    div.className = `message ${tipo}`;

    div.innerHTML = texto;

    chatBox.appendChild(div);

    conversaAtual.mensagens.push({
        tipo,
        texto
    });

    /* TITULO */

    if(
        conversaAtual.titulo === "Nova conversa"
        && tipo === "user"
    ){

        conversaAtual.titulo = texto.substring(0, 20);

        renderHistorico();
    }

    salvar();

    chatBox.scrollTop = chatBox.scrollHeight;
}

/* REMOVER */

function removerUltimaMensagem(){

    chatBox.removeChild(chatBox.lastChild);

    conversaAtual.mensagens.pop();

    salvar();
}

/* ABRIR CONVERSA */

function abrirConversa(id){

    conversaAtual = conversas.find(c => c.id === id);

    renderMensagens();
}

/* RENDER MENSAGENS */

function renderMensagens(){

    chatBox.innerHTML = "";

    conversaAtual.mensagens.forEach(msg => {

        const div = document.createElement("div");

        div.className = `message ${msg.tipo}`;

        div.innerHTML = msg.texto;

        chatBox.appendChild(div);

    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

/* RENDER HISTORICO */

function renderHistorico(){

    historico.innerHTML = "<p>Conversas</p>";

    conversas.forEach(conversa => {

        const item = document.createElement("div");

        item.className = "chat-item";

        item.innerText = conversa.titulo;

        item.onclick = () => abrirConversa(conversa.id);

        historico.appendChild(item);

    });
}

/* SALVAR */

function salvar(){

    localStorage.setItem(
        "conversas",
        JSON.stringify(conversas)
    );
}