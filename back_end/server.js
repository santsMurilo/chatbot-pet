require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("API KEY carregada:", !!GEMINI_API_KEY);

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });


// 🎯 Classificação
function classificar(mensagem) {
    mensagem = mensagem.toLowerCase();

    if (mensagem.includes("pode comer")) return "alimentacao";
    if (mensagem.includes("vomitou") || mensagem.includes("doente")) return "saude";
    if (mensagem.includes("triste") || mensagem.includes("comportamento")) return "comportamento";

    return "geral";
}


// 🔥 Prompt inteligente
function montarPrompt(mensagem) {
    const tipo = classificar(mensagem);

    return `
Você é um assistente especializado em cuidados com pets, que te ajuda com perguntas sobre alimentação, saúde e comportamento de animais de estimação. você é direto, claro e sempre alerta sobre situações de saúde. Se a pergunta indicar emergência, responda com um alerta ⚠️ e recomende procurar um veterinário.

Tipo da pergunta: ${tipo}

REGRAS:
- Não seja genérico
- Máximo de 5 linhas
- Seja direto
- Use linguagem simples
- Se for saúde, alerte com ⚠️

FORMATO:
- Resposta direta
- Explicação curta
- Dica prática
- Para separar a resposta da explicação, pule a linha

OBSERVAÇÃO:
- Não escreva "** Resposta** ou **Explicação**", apenas entregue a resposta e a explicação de forma fluida.



Pergunta:
${mensagem}
`;
}


// 🚨 Emergência
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


// 🤖 Gemini
async function chamarGemini(mensagem) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: montarPrompt(mensagem),
        });

        if (!response || !response.text) {
            console.log("Resposta vazia:", response);
            return "⚠️ Não consegui gerar resposta.";
        }

        return response.text;

    } catch (error) {
        console.log("ERRO GEMINI:", error.message);
        return "⚠️ Erro ao acessar a IA.";
    }
}


// 🚀 Rota principal
app.post("/chat", async (req, res) => {
    const { mensagem } = req.body;

    if (!mensagem) {
        return res.status(400).json({ resposta: "Mensagem inválida." });
    }

    const alerta = filtroEmergencia(mensagem);
    if (alerta) {
        return res.json({ resposta: alerta });
    }

    const resposta = await chamarGemini(mensagem);

    res.json({ resposta });
});


// 🌐 Teste
app.get("/", (req, res) => {
    res.send("Servidor rodando 🚀");
});


// 🚀 Start
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});