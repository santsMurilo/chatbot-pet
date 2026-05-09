// assets/js/admin.js

const SUPABASE_URL = 'https://waurfborqleagomxueta.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Vu-A0zHKCPcidCvLFnOwGA_BVnVbJMA';

const form = document.getElementById('form-post');
const btn = document.getElementById('btn-publicar');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede a página de recarregar
    
    // Altera o estado do botão para o usuário saber que está enviando
    btn.innerText = "Enviando...";
    btn.disabled = true;

    // Captura os dados do formulário
    const novoArtigo = {
        titulo: document.getElementById('titulo').value,
        resumo: document.getElementById('resumo').value,
        categoria: document.getElementById('categoria').value,
        imagem_url: document.getElementById('imagem_url').value,
        conteudo: document.getElementById('conteudo').value
    };

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/artigos`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal' // Diz ao banco para ser rápido e não retornar o dado inserido
            },
            body: JSON.stringify(novoArtigo)
        });

        if (response.ok) {
            alert('Sucesso! Seu artigo já está disponível no mundo pet. 🐶');
            form.reset(); // Limpa o formulário
        } else {
            throw new Error('Erro ao salvar no banco');
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Ops! Algo deu errado ao publicar.');
    } finally {
        btn.innerText = "Publicar no Blog 🐾";
        btn.disabled = false;
    }
});