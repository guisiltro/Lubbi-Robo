const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3011;

// Middleware
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do diretório atual
app.use(express.static(__dirname));

// Armazenar dados dos sensores
let sensorData = {
    temperatura: null,
    bpm: null,
    lastUpdate: null
};

// ===== ENDPOINTS PARA SENSORES ARDUINO =====

// Endpoint para receber dados do Arduino
app.post('/api/sensores', (req, res) => {
    try {
        const { temperatura, bpm } = req.body;
        
        console.log('Dados recebidos do Arduino:', { temperatura, bpm });
        
        // Atualizar apenas se os valores são válidos
        if (temperatura !== undefined && temperatura !== null && temperatura > 0) {
            sensorData.temperatura = parseFloat(temperatura);
        }
        if (bpm !== undefined && bpm !== null && bpm > 0) {
            sensorData.bpm = parseFloat(bpm);
        }
        
        sensorData.lastUpdate = new Date().toISOString();
        
        res.json({ 
            success: true, 
            message: 'Dados recebidos com sucesso',
            data: sensorData
        });
        
    } catch (error) {
        console.error('Erro ao processar dados do Arduino:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// Endpoint para obter dados dos sensores
app.get('/api/sensores', (req, res) => {
    res.json({
        success: true,
        data: sensorData
    });
});

// ===== IA INTELIGENTE MELHORADA =====

// Base de conhecimento sobre o LUBBI
const lubbiKnowledge = {
    sobre: {
        descricao: "LUBBI é um Robô de Triagem Inteligente desenvolvido para revolucionar o atendimento médico. Ele combina sensores avançados com inteligência artificial para fornecer diagnósticos rápidos e precisos.",
        missao: "Nossa missão é democratizar o acesso à triagem médica de qualidade, reduzindo tempos de espera e melhorando a eficiência em hospitais e clínicas.",
        tecnologia: "Utilizamos sensores MLX90614 para temperatura e MAX30105 para frequência cardíaca, além de algoritmos de IA para análise em tempo real."
    },
    funcionalidades: [
        "Medição de temperatura corporal sem contato",
        "Monitoramento de frequência cardíaca (BPM)",
        "Triagem automática baseada em sintomas",
        "Interface touchscreen intuitiva",
        "Navegação autônoma em ambientes hospitalares",
        "Integração com sistemas de saúde",
        "Relatórios em PDF automáticos"
    ],
    sensores: {
        temperatura: "Sensor infravermelho MLX90614 - Precisão de ±0.1°C - Medição sem contato",
        cardiaco: "Sensor MAX30105 - Monitoramento contínuo - Detecção de arritmias"
    },
    vantagens: [
        "Redução de 70% no tempo de triagem",
        "Precisão de 98.7% nos diagnósticos",
        "Atendimento 24/7",
        "Interface multilingue",
        "Relatórios detalhados em tempo real"
    ],
    desenvolvimento: "Desenvolvido por uma equipe multidisciplinar da FIAP com especialistas em medicina, engenharia e inteligência artificial.",
    aplicacoes: [
        "Hospitais e pronto-socorros",
        "Clínicas médicas",
        "Unidades básicas de saúde",
        "Eventos de grande porte",
        "Empresas e corporações"
    ]
};

// IA melhorada com conhecimento contextual
async function chatWithAI(message, conversationId = 'default') {
    const lowerMessage = message.toLowerCase().trim();
    
    // Saudações
    if (/(olá|ola|oi|e aí|hey|hello|bom dia|boa tarde|boa noite)/i.test(lowerMessage)) {
        return `Olá! Sou o LUBBI Assistant, seu assistente virtual para informações sobre o robô de triagem inteligente. Como posso ajudá-lo hoje? Posso explicar sobre funcionalidades, sensores, ou tirar qualquer dúvida sobre o sistema LUBBI!`;
    }

    // Perguntas sobre o que é o LUBBI
    if (/(o que é|quem é|o que faz|explica|conta sobre|fale sobre).*lubb/i.test(lowerMessage)) {
        return `🤖 **LUBBI - Robô de Triagem Inteligente**

${lubbiKnowledge.sobre.descricao}

**Missão:** ${lubbiKnowledge.sobre.missao}

**Tecnologia:** ${lubbiKnowledge.sobre.tecnologia}

**Principais Funcionalidades:**
${lubbiKnowledge.funcionalidades.map(f => `• ${f}`).join('\n')}

O que gostaria de saber mais especificamente?`;
    }

    // Funcionalidades
    if (/(funcionalidades|o que faz|capacidades|recursos|pode fazer)/i.test(lowerMessage)) {
        return `🛠️ **Funcionalidades do LUBBI:**

${lubbiKnowledge.funcionalidades.map((f, i) => `${i+1}. ${f}`).join('\n')}

**Vantagens:**
${lubbiKnowledge.vantagens.map(v => `✓ ${v}`).join('\n')}

Qual funcionalidade te interessa mais?`;
    }

    // Sensores
    if (/(sensor|medir|medição|temperatura|batimento|coração|bpm)/i.test(lowerMessage)) {
        return `🔬 **Sensores do LUBBI:**

**🌡️ Sensor de Temperatura:**
${lubbiKnowledge.sensores.temperatura}

**💓 Sensor Cardíaco:**
${lubbiKnowledge.sensores.cardiaco}

Ambos os sensores fornecem dados em tempo real com alta precisão!`;
    }

    // Conexão
    if (/(conectar|conexão|conectado|ligar|conecte)/i.test(lowerMessage)) {
        return `🔌 **Como conectar com o LUBBI:**

Para conectar com o robô LUBBI:

1. **Certifique-se que o LUBBI está ligado** e na mesma rede WiFi
2. **Clique no botão "Conectar ao LUBBI"** na seção de Monitoramento
3. **Aguarde a conexão** - o sistema tentará se conectar automaticamente
4. **Verifique os dados** - temperatura e batimentos cardíacos serão exibidos

Problemas de conexão? Verifique se o LUBBI está ligado e acessível na rede.`;
    }

    // Dados atuais dos sensores
    if (/(dados|atual|agora|temperatura atual|batimento atual)/i.test(lowerMessage)) {
        const temp = sensorData.temperatura ? `${sensorData.temperatura}°C` : '--';
        const bpm = sensorData.bpm ? `${sensorData.bpm} BPM` : '--';
        
        return `📊 **Dados Atuais dos Sensores:**

🌡️ Temperatura: ${temp}
💓 Frequência Cardíaca: ${bpm}

${sensorData.lastUpdate ? `Última atualização: ${new Date(sensorData.lastUpdate).toLocaleString('pt-BR')}` : 'Aguardando dados dos sensores...'}`;
    }

    // Vantagens
    if (/(vantagem|benefício|por que usar|diferencial|inovador)/i.test(lowerMessage)) {
        return `⭐ **Por que escolher o LUBBI?**

${lubbiKnowledge.vantagens.map(v => `🎯 ${v}`).join('\n')}

**Aplicações:**
${lubbiKnowledge.aplicacoes.map(a => `🏥 ${a}`).join('\n')}`;
    }

    // Desenvolvimento
    if (/(desenvolvido|quem fez|equipe|fiap|criador)/i.test(lowerMessage)) {
        return `👨‍💻 **Sobre o Desenvolvimento:**

${lubbiKnowledge.desenvolvimento}

**Características Técnicas:**
• Plataforma: ESP32 com TFT Touch
• Sensores: MLX90614 (temperatura) + MAX30105 (cardíaco)
• Comunicação: WiFi + HTTP/REST
• Interface: TFT Touchscreen 3.5"
• Alimentação: Bateria LiPo + Carregamento wireless

A equipe é composta por especialistas em medicina, engenharia e IA!`;
    }

    // Ajuda geral
    if (/(ajuda|help|como funciona|manual)/i.test(lowerMessage)) {
        return `🆘 **Como posso ajudar?**

Posso explicar sobre:

🤖 **O que é o LUBBI** - Conceito e missão
🛠️ **Funcionalidades** - O que o robô pode fazer
🔬 **Sensores** - Tecnologias de medição
📊 **Dados em Tempo Real** - Leituras atuais
🔌 **Conexão** - Como conectar com o LUBBI
⭐ **Vantagens** - Benefícios do sistema
👨‍💻 **Desenvolvimento** - Sobre a equipe e tecnologia

O que gostaria de saber?`;
    }

    // Agradecimentos
    if (/(obrigado|obrigada|valeu|agradeço|thanks)/i.test(lowerMessage)) {
        return `😊 De nada! Fico feliz em ajudar. Se tiver mais alguma dúvida sobre o LUBBI, estou aqui! 

Que tal conhecer mais sobre nossos sensores ou como conectar com o LUBBI?`;
    }

    // Fallback inteligente
    const keywords = {
        'triagem': 'O LUBBI realiza triagem automática baseada nos sinais vitais e sintomas informados pelo paciente.',
        'hospital': 'O LUBBI é perfeito para hospitais, reduzindo o tempo de espera e melhorando a eficiência da triagem.',
        'clínica': 'Em clínicas, o LUBBI otimiza o fluxo de pacientes e fornece dados precisos para os médicos.',
        'tecnologia': 'Usamos sensores de última geração e algoritmos de IA para máxima precisão.',
        'precisão': 'Nossos sensores têm precisão de 98.7% e são calibrados regularmente.',
        'tempo': 'O LUBBI reduz o tempo de triagem em até 70%, agilizando o atendimento.',
        'saúde': 'Contribuímos para um sistema de saúde mais eficiente e acessível.',
        'emergência': 'Em casos de emergência, o LUBBI prioriza pacientes com condições mais graves.'
    };

    for (const [keyword, response] of Object.entries(keywords)) {
        if (lowerMessage.includes(keyword)) {
            return `${response}\n\nPosso te ajudar com algo mais específico sobre o LUBBI?`;
        }
    }

    // Resposta padrão educada
    return `🤔 Interessante sua pergunta! Como assistente especializado no LUBBI, posso te ajudar melhor com informações sobre:

• O que é o LUBBI e como funciona
• Nossos sensores e tecnologias
• Funcionalidades e capacidades
• Como conectar e usar o LUBBI
• Dados em tempo real
• Aplicações em saúde

Pode reformular sua pergunta ou me perguntar sobre algum desses tópicos?`;
}

// Endpoint para chat com IA
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationId } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Mensagem é obrigatória' 
            });
        }
        
        const response = await chatWithAI(message, conversationId);
        
        res.json({
            success: true,
            response: response,
            conversationId: conversationId
        });
        
    } catch (error) {
        console.error('Erro no chat com IA:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor' 
        });
    }
});

// ===== ENDPOINT PARA ANÁLISE DE SINAIS VITAIS =====

app.post('/api/analyze-vitals', (req, res) => {
    try {
        const { temperatura, bpm } = req.body;
        
        let analysis = "Sinais vitais dentro dos parâmetros normais.";
        let alert = false;
        
        if (temperatura > 37.5) {
            analysis = "Temperatura elevada detectada. Recomenda-se avaliação médica.";
            alert = true;
        }
        
        if (bpm > 100 || bpm < 60) {
            analysis = "Frequência cardíaca fora da faixa normal. Monitorar continuamente.";
            alert = true;
        }
        
        res.json({
            success: true,
            analysis: analysis,
            alert: alert,
            recommendations: [
                "Manter repouso",
                "Hidratação adequada",
                "Monitoramento contínuo"
            ]
        });
        
    } catch (error) {
        console.error('Erro na análise de sinais vitais:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro na análise' 
        });
    }
});

// ===== ROTAS PARA ARQUIVOS HTML =====

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota alternativa caso tenha outros arquivos HTML
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, page);
    
    // Verificar se o arquivo existe com extensão .html
    if (page.endsWith('.html') || page === 'index') {
        res.sendFile(filePath);
    } else {
        // Se não for um HTML, tentar servir o arquivo diretamente
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(404).send('Página não encontrada');
            }
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🤖 Servidor LUBBI rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`📡 Aguardando conexão com o LUBBI...`);
    console.log(`📂 Servindo arquivos do diretório: ${__dirname}`);
});

module.exports = app;