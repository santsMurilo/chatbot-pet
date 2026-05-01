console.log("API KEY:", process.env.GEMINI_API_KEY);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


// 🔥 Prompt inteligente
function montarPrompt(mensagem) {
    return `
Você é um assistente especializado em cuidados com pets, com conhecimento semelhante a um auxiliar veterinário.

Seu objetivo é ajudar de forma prática, clara e confiável.

REGRAS IMPORTANTES:
- Não dê respostas genéricas
- Seja direto e útil
- Explique o porquê das coisas
- Se for saúde, diga possíveis causas
- Se parecer grave, alerte com ⚠️
- Sempre sugira procurar veterinário em casos de risco
- Use linguagem simples
- Máximo de 5 linhas
- Seja objetivo

TIPOS DE PERGUNTA:
- Alimentação → diga o que pode e o que evitar
- Sintomas → possíveis causas + orientação
- Comportamento → explique o motivo

FORMATO:
- Resposta direta
- Explicação curta
- Dica prática no final


Pergunta:
${mensagem}
`;
}


// 🚨 Filtro de emergência
function filtroEmergencia(mensagem) {
    mensagem = mensagem.toLowerCase();

    if (
        mensagem.includes("convuls") ||
        mensagem.includes("morrendo") ||
        mensagem.includes("não respira")
    ) {
        return "🚨 Situação grave! Procure um veterinário imediatamente.";
    }

    return null;
}


// 🤖 IA GEMINI (SDK)
async function chamarGemini(mensagem) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: montarPrompt(mensagem),
        });

        if (!response || !response.text) {
            console.log("Resposta vazia:", response);
            return "⚠️ Não consegui gerar resposta agora.";
        }

        return response.text;

    } catch (error) {
        console.log("ERRO GEMINI:", error.message);
        return "⚠️ Erro ao acessar a IA.";
    }
}


// 🚀 ROTA PRINCIPAL
app.post("/chat", async (req, res) => {
    const { mensagem } = req.body;

    if (!mensagem) {
        return res.status(400).json({ resposta: "Mensagem inválida." });
    }

    // 1. Emergência
    const alerta = filtroEmergencia(mensagem);
    if (alerta) {
        return res.json({ resposta: alerta });
    }

    // 2. IA
    const resposta = await chamarGemini(mensagem);

    res.json({ resposta });
});


// 🌐 TESTE
app.get("/", (req, res) => {
    res.send("Servidor rodando 🚀");
});


// 🚀 START
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});