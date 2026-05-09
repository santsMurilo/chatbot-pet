// assets/js/blog.js

const SUPABASE_URL = 'https://waurfborqleagomxueta.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Vu-A0zHKCPcidCvLFnOwGA_BVnVbJMA';

async function buscarArtigos() {
    const container = document.getElementById('container-artigos');

    try {
        // Faz a requisição para a API automática do Supabase
        const response = await fetch(`${SUPABASE_URL}/rest/v1/artigos?select=*&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) throw new Error('Erro ao buscar dados');

        const artigos = await response.json();

        // Se não houver artigos no banco ainda
        if (artigos.length === 0) {
            container.innerHTML = '<p>Ainda não temos histórias publicadas. Volte em breve! 🐾</p>';
            return;
        }

        // Limpa o "Carregando..." e renderiza os cards
        container.innerHTML = artigos.map(artigo => `
            <article class="post-card" onclick="alert('Em breve: Página completa do artigo!')">
                <img src="${artigo.imagem_url || 'https://via.placeholder.com/500x300'}" alt="${artigo.titulo}">
                <div class="post-content">
                    <span class="data">${new Date(artigo.created_at).toLocaleDateString('pt-BR')}</span>
                    <h4>${artigo.titulo}</h4>
                    <p>${artigo.resumo}</p>
                </div>
            </article>
        `).join('');

    } catch (error) {
        console.error('Erro:', error);
        container.innerHTML = '<p>Ops! Tivemos um problema ao carregar o blog. Tente novamente mais tarde.</p>';
    }
}

// Inicia a função assim que o script é carregado
buscarArtigos();