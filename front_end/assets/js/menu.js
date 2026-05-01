// assets/js/menu.js
document.addEventListener("DOMContentLoaded", function() {
    const navHTML = `
        <div class="logo">PetTalk 🐾</div>
        <ul>
            <li><a href="../site/principal.html">Início</a></li>
            <li><a href="../site/blog.html">Blog</a></li>
            <li><a href="../site/cuidados.html">Cuidados</a></li>
            <li><a href="../site/dicas.html">Dicas Pet</a></li>
            <li><a href="../site/alimentacao.html">Alimentação Pet</a></li>
        </ul>
        <button class="btn-chat" onclick="location.href='../chat/index.html'">Abrir Chat</button>
    `;

    const navElement = document.querySelector("nav");
    if (navElement) {
        navElement.innerHTML = navHTML;
    }
});