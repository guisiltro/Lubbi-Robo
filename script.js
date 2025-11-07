// Inicializar AOS
AOS.init({ duration: 1200, once: true });

// Elementos do DOM
const loginContainer = document.getElementById("loginContainer");
const btnLogin = document.getElementById("btnLogin");
const scrollProgress = document.getElementById("scrollProgress");
const trafficLightLinks = document.querySelectorAll('.traffic-light-nav a');
const ratingStars = document.querySelectorAll('.rating-star');
const submitRating = document.getElementById('submitRating');
const reviewsContainer = document.getElementById('reviewsContainer');
const navToggle = document.getElementById('navToggle');
const topNav = document.querySelector('.top-nav');
const colorBlindBtn = document.getElementById('colorBlindBtn');
const resetThemeBtn = document.getElementById('resetThemeBtn');

// Configurações
const API_BASE_URL = 'http://localhost:3008/api';

// Contador de visitantes
let visitorCount = localStorage.getItem('visitorCount') || 0;
visitorCount = parseInt(visitorCount) + 1;
localStorage.setItem('visitorCount', visitorCount);
document.getElementById('stat-visitors').textContent = visitorCount.toLocaleString();

// ===== SISTEMA DE LOGIN =====

if (btnLogin) {
    btnLogin.addEventListener('click', function() {
        const username = document.getElementById('username').value.trim();
        
        if (username === '') {
            showNotification('Por favor, digite seu nome para continuar', 'error');
            return;
        }
        
        // Salvar informações de login
        localStorage.setItem('hasLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('loginTime', new Date().toISOString());
        
        // Esconder o overlay de login com animação
        loginContainer.style.opacity = '0';
        loginContainer.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            loginContainer.style.display = 'none';
            showNotification(`Bem-vindo(a), ${username}! Sistema LUBBI inicializado.`, 'success');
        }, 500);
    });

    // Também permitir login com Enter
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            btnLogin.click();
        }
    });
}

// ===== BARRA DE PROGRESSO E NAVEGAÇÃO =====

window.addEventListener('scroll', function() {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = scrolled + '%';
    }
    
    // Header scroll effect
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Atualizar navegação semáforo
    updateTrafficLightNav();
    updateNavbarActive();
});

// Atualizar navegação semáforo baseada na posição do scroll
function updateTrafficLightNav() {
    const sections = document.querySelectorAll('section, .hero, .team-section');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id') || 'top';
        }
    });
    
    trafficLightLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Atualizar navbar ativo baseado na posição do scroll
function updateNavbarActive() {
    const sections = document.querySelectorAll('section, .hero');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id') || 'top';
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== SISTEMA DE INTERAÇÃO DO ROBÔ LUBBI CORRIGIDO =====

function initRobotInteractionSystem() {
    const featureCards = document.querySelectorAll('.feature-card-circle');
    const actionIndicator = document.getElementById('actionIndicator');
    const indicatorText = document.getElementById('indicatorText');
    
    let activeCard = null;
    let animationTimeout = null;
    
    console.log('Inicializando sistema do robô...');
    console.log('Cards encontrados:', featureCards.length);
    
    // Configurações de animação
    const animations = {
        'sensor-temp': {
            elements: ['rightHand', 'rightSensor', 'rightArm'],
            action: () => activateTemperatureSensor(),
            text: 'Sensor de Temperatura Ativo'
        },
        'sensor-bpm': {
            elements: ['leftHand', 'leftSensor', 'leftArm'],
            action: () => activateHeartbeatSensor(),
            text: 'Sensor Cardíaco Ativo'
        },
        'touchscreen': {
            elements: ['touchScreen', 'robotBody'],
            action: () => activateTouchScreen(),
            text: 'Tela Touchscreen Ativa'
        },
        'wheels': {
            elements: ['leftWheel', 'rightWheel', 'leftWheelCover', 'rightWheelCover'],
            action: () => activateWheels(),
            text: 'Sistema de Locomoção Ativo'
        },
        'ai-diagnosis': {
            elements: ['robotHead'],
            action: () => activateAIDiagnosis(),
            text: 'Diagnóstico por IA Ativo'
        },
        'communication': {
            elements: ['robotHead'],
            action: () => activateCommunication(),
            text: 'Sistema de Comunicação Ativo'
        }
    };
    
    // Event listeners para os cards
    featureCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            const feature = this.getAttribute('data-feature');
            
            console.log('Card clicado:', feature);
            
            // Se o card já está ativo, desativa
            if (this.classList.contains('active')) {
                console.log('Desativando card:', feature);
                deactivateCard();
                return;
            }
            
            // Em mobile, fechar outros cards primeiro
            if (window.innerWidth <= 768 && activeCard) {
                deactivateCard();
            }
            
            // Ativa o card clicado
            activateCard(this, feature);
        });
        
        // Adicionar feedback visual no hover
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'scale(1)';
            }
        });
    });
    
    // Fechar card ativo ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.feature-card-circle') && activeCard) {
            deactivateCard();
        }
    });
    
    // Ativar card
    function activateCard(card, feature) {
        console.log('Ativando card:', feature);
        
        // Desativa card anterior se houver (apenas em desktop)
        if (activeCard && window.innerWidth > 768) {
            deactivateCard();
        }
        
        // Limpa timeout anterior
        if (animationTimeout) {
            clearTimeout(animationTimeout);
        }
        
        // Ativa o novo card
        card.classList.add('active');
        activeCard = card;
        
        // Em mobile, adiciona overlay
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
        
        // Ativa a animação correspondente
        if (animations[feature]) {
            console.log('Executando animação para:', feature);
            animations[feature].action();
            
            // Atualiza indicador
            indicatorText.textContent = animations[feature].text;
            actionIndicator.classList.add('active');
            
            // Auto-desativação após 5 segundos
            animationTimeout = setTimeout(() => {
                if (activeCard === card) {
                    deactivateCard();
                }
            }, 5000);
        } else {
            console.error('Animação não encontrada para:', feature);
        }
    }
    
    // Desativar card
    function deactivateCard() {
        console.log('Desativando card ativo');
        
        if (activeCard) {
            activeCard.classList.remove('active');
            activeCard = null;
            
            // Remove overflow hidden no mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = '';
            }
            
            // Desativa indicador
            actionIndicator.classList.remove('active');
            
            // Reseta animações do robô
            resetRobotAnimations();
            
            // Reseta status da tela
            const screenStatus = document.getElementById('screenStatus');
            if (screenStatus) {
                screenStatus.textContent = 'AGUARDANDO COMANDO';
                screenStatus.className = 'screen-status';
            }
        }
        
        // Limpa timeout
        if (animationTimeout) {
            clearTimeout(animationTimeout);
            animationTimeout = null;
        }
    }
    
    // ===== FUNÇÕES ESPECÍFICAS DOS SENSORES =====
    
    function activateTemperatureSensor() {
        console.log('Ativando sensor de temperatura');
        
        const rightArm = document.getElementById('rightArm');
        const rightHand = document.getElementById('rightHand');
        const rightSensor = document.getElementById('rightSensor');
        const tempValue = document.getElementById('tempValue');
        const screenStatus = document.getElementById('screenStatus');
        
        // Animação do braço direito
        if (rightArm) {
            rightArm.classList.add('animate');
            console.log('Braço direito animado');
        }
        
        // Efeito no sensor
        if (rightSensor) {
            rightSensor.classList.add('sensor-active');
            rightSensor.innerHTML = '<i class="fas fa-thermometer-full"></i>';
        }
        
        // Efeito na mão
        if (rightHand) {
            rightHand.style.background = '#ff6b35';
            rightHand.style.boxShadow = '0 0 20px rgba(255, 107, 53, 0.8)';
        }
        
        // Atualiza valores na tela
        if (tempValue) {
            // Simula variação de temperatura
            const baseTemp = 36.5;
            const variation = (Math.random() * 0.4 - 0.2).toFixed(1);
            const finalTemp = (parseFloat(baseTemp) + parseFloat(variation)).toFixed(1);
            tempValue.textContent = `${finalTemp}°C`;
            tempValue.style.color = '#ff6b35';
            tempValue.style.fontWeight = 'bold';
        }
        
        if (screenStatus) {
            screenStatus.textContent = 'MEDIÇÃO DE TEMPERATURA';
            screenStatus.className = 'screen-status active';
        }
        
        // Reset após 1 segundo
        setTimeout(() => {
            if (rightArm) rightArm.classList.remove('animate');
        }, 1000);
    }
    
    function activateHeartbeatSensor() {
        console.log('Ativando sensor cardíaco');
        
        const leftArm = document.getElementById('leftArm');
        const leftHand = document.getElementById('leftHand');
        const leftSensor = document.getElementById('leftSensor');
        const bpmValue = document.getElementById('bpmValue');
        const screenStatus = document.getElementById('screenStatus');
        
        // Animação do braço esquerdo
        if (leftArm) {
            leftArm.classList.add('animate');
            console.log('Braço esquerdo animado');
        }
        
        // Efeito no sensor
        if (leftSensor) {
            leftSensor.classList.add('sensor-active');
            leftSensor.innerHTML = '<i class="fas fa-heartbeat"></i>';
        }
        
        // Efeito na mão
        if (leftHand) {
            leftHand.style.background = '#4CAF50';
            leftHand.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.8)';
        }
        
        // Atualiza valores na tela com animação de batimento
        if (bpmValue) {
            let bpm = 72;
            bpmValue.textContent = bpm;
            bpmValue.style.color = '#4CAF50';
            bpmValue.style.fontWeight = 'bold';
            
            // Simula variação do batimento cardíaco
            const interval = setInterval(() => {
                const variation = Math.floor(Math.random() * 5) - 2;
                bpm = Math.max(60, Math.min(100, bpm + variation));
                bpmValue.textContent = bpm;
            }, 800);
            
            // Para a simulação quando o sensor for desativado
            setTimeout(() => {
                clearInterval(interval);
            }, 5000);
        }
        
        if (screenStatus) {
            screenStatus.textContent = 'MONITORAMENTO CARDÍACO';
            screenStatus.className = 'screen-status active';
        }
        
        // Reset após 1 segundo
        setTimeout(() => {
            if (leftArm) leftArm.classList.remove('animate');
        }, 1000);
    }
    
    function activateTouchScreen() {
        console.log('Ativando touchscreen');
        
        const touchScreen = document.getElementById('touchScreen');
        const screenStatus = document.getElementById('screenStatus');
        const tempValue = document.getElementById('tempValue');
        const bpmValue = document.getElementById('bpmValue');
        
        if (touchScreen) {
            touchScreen.classList.add('active');
            touchScreen.style.background = 'linear-gradient(135deg, #1e3c72, #2a5298)';
            touchScreen.style.boxShadow = 'inset 0 0 30px rgba(255, 255, 255, 0.3)';
        }
        
        if (screenStatus) {
            screenStatus.textContent = 'INTERFACE ATIVA - TOQUE PARA NAVEGAR';
            screenStatus.className = 'screen-status active';
        }
        
        // Efeito de dados variando
        if (tempValue && bpmValue) {
            const interval = setInterval(() => {
                // Pequenas variações nos valores para simular dados em tempo real
                const temp = parseFloat(tempValue.textContent);
                const newTemp = (temp + (Math.random() * 0.2 - 0.1)).toFixed(1);
                tempValue.textContent = `${newTemp}°C`;
                
                const bpm = parseInt(bpmValue.textContent);
                const newBpm = Math.max(60, Math.min(100, bpm + (Math.random() * 4 - 2)));
                bpmValue.textContent = Math.round(newBpm);
            }, 1500);
            
            setTimeout(() => {
                clearInterval(interval);
            }, 5000);
        }
        
        // Reset após 5 segundos
        setTimeout(() => {
            if (touchScreen) {
                touchScreen.classList.remove('active');
                touchScreen.style.background = '';
                touchScreen.style.boxShadow = '';
            }
        }, 5000);
    }
    
    function activateWheels() {
        console.log('Ativando sistema de locomoção');
        
        const leftWheel = document.getElementById('leftWheel');
        const rightWheel = document.getElementById('rightWheel');
        const leftWheelCover = document.getElementById('leftWheelCover');
        const rightWheelCover = document.getElementById('rightWheelCover');
        const robot = document.getElementById('robot');
        const screenStatus = document.getElementById('screenStatus');
        
        if (leftWheel) leftWheel.classList.add('rotate');
        if (rightWheel) rightWheel.classList.add('rotate');
        
        if (leftWheelCover) leftWheelCover.style.background = '#ff6b35';
        if (rightWheelCover) rightWheelCover.style.background = '#ff6b35';
        
        if (robot) {
            robot.style.animation = 'gentle-float 1s ease-in-out infinite';
        }
        
        if (screenStatus) {
            screenStatus.textContent = 'NAVEGAÇÃO AUTÔNOMA ATIVA';
            screenStatus.className = 'screen-status active';
        }
        
        // Reset após 3 segundos
        setTimeout(() => {
            if (leftWheel) leftWheel.classList.remove('rotate');
            if (rightWheel) rightWheel.classList.remove('rotate');
            if (leftWheelCover) leftWheelCover.style.background = '';
            if (rightWheelCover) rightWheelCover.style.background = '';
            if (robot) robot.style.animation = 'gentle-float 6s ease-in-out infinite';
        }, 3000);
    }
    
    function activateAIDiagnosis() {
        console.log('Ativando diagnóstico por IA');
        
        const eyes = document.querySelectorAll('.eye');
        const mouth = document.querySelector('.mouth');
        const screenStatus = document.getElementById('screenStatus');
        
        // Animação dos olhos
        eyes.forEach(eye => {
            eye.style.animation = 'blink 0.3s infinite';
            eye.style.background = '#2196F3';
        });
        
        // Animação da boca
        if (mouth) {
            mouth.style.background = '#2196F3';
            mouth.style.height = '20px';
            mouth.style.borderRadius = '10px';
            mouth.style.animation = 'pulse 0.5s infinite';
        }
        
        if (screenStatus) {
            screenStatus.textContent = 'PROCESSANDO DIAGNÓSTICO...';
            screenStatus.className = 'screen-status active';
        }
        
        // Simulação de processamento
        setTimeout(() => {
            if (screenStatus) {
                screenStatus.textContent = 'DIAGNÓSTICO CONCLUÍDO - SEM ANOMALIAS';
            }
            
            // Reset das animações faciais
            setTimeout(() => {
                eyes.forEach(eye => {
                    eye.style.animation = 'blink 4s infinite';
                    eye.style.background = '#5d6afb';
                });
                
                if (mouth) {
                    mouth.style.background = 'var(--accent)';
                    mouth.style.height = '25px';
                    mouth.style.borderRadius = '0 0 30px 30px';
                    mouth.style.animation = 'smile 5s ease-in-out infinite';
                }
            }, 2000);
        }, 3000);
    }
    
    function activateCommunication() {
        console.log('Ativando sistema de comunicação');
        
        const head = document.querySelector('.head');
        const screenStatus = document.getElementById('screenStatus');
        
        if (head) {
            head.style.animation = 'gentle-float 0.8s ease-in-out infinite';
            head.style.borderColor = '#9C27B0';
        }
        
        if (screenStatus) {
            screenStatus.textContent = 'TRANSMITINDO DADOS PARA CENTRAL...';
            screenStatus.className = 'screen-status active';
        }
        
        // Efeito de transmissão
        const transmissionInterval = setInterval(() => {
            if (screenStatus) {
                const dots = ['.', '..', '...'];
                const randomDots = dots[Math.floor(Math.random() * dots.length)];
                screenStatus.textContent = `TRANSMITINDO DADOS${randomDots}`;
            }
        }, 500);
        
        // Reset após 4 segundos
        setTimeout(() => {
            clearInterval(transmissionInterval);
            
            if (head) {
                head.style.animation = '';
                head.style.borderColor = '';
            }
            
            if (screenStatus) {
                screenStatus.textContent = 'TRANSMISSÃO CONCLUÍDA';
            }
        }, 4000);
    }
    
    // Reset de todas as animações do robô
    function resetRobotAnimations() {
        console.log('Resetando animações do robô');
        
        // Braços
        const leftArm = document.getElementById('leftArm');
        const rightArm = document.getElementById('rightArm');
        if (leftArm) leftArm.classList.remove('animate');
        if (rightArm) rightArm.classList.remove('animate');
        
        // Mãos
        const leftHand = document.getElementById('leftHand');
        const rightHand = document.getElementById('rightHand');
        if (leftHand) {
            leftHand.style.background = '';
            leftHand.style.boxShadow = '';
        }
        if (rightHand) {
            rightHand.style.background = '';
            rightHand.style.boxShadow = '';
        }
        
        // Sensores
        const leftSensor = document.getElementById('leftSensor');
        const rightSensor = document.getElementById('rightSensor');
        if (leftSensor) {
            leftSensor.classList.remove('sensor-active');
            leftSensor.innerHTML = '<i class="fas fa-heartbeat"></i>';
        }
        if (rightSensor) {
            rightSensor.classList.remove('sensor-active');
            rightSensor.innerHTML = '<i class="fas fa-thermometer-half"></i>';
        }
        
        // Rodas
        const leftWheel = document.getElementById('leftWheel');
        const rightWheel = document.getElementById('rightWheel');
        if (leftWheel) leftWheel.classList.remove('rotate');
        if (rightWheel) rightWheel.classList.remove('rotate');
        
        // Capas das rodas
        const leftWheelCover = document.getElementById('leftWheelCover');
        const rightWheelCover = document.getElementById('rightWheelCover');
        if (leftWheelCover) leftWheelCover.style.background = '';
        if (rightWheelCover) rightWheelCover.style.background = '';
        
        // Tela
        const touchScreen = document.getElementById('touchScreen');
        if (touchScreen) {
            touchScreen.classList.remove('active');
            touchScreen.style.background = '';
            touchScreen.style.boxShadow = '';
        }
        
        // Cabeça
        const eyes = document.querySelectorAll('.eye');
        eyes.forEach(eye => {
            eye.style.animation = 'blink 4s infinite';
            eye.style.background = '#5d6afb';
        });
        
        const mouth = document.querySelector('.mouth');
        if (mouth) {
            mouth.style.background = 'var(--accent)';
            mouth.style.height = '25px';
            mouth.style.borderRadius = '0 0 30px 30px';
            mouth.style.animation = 'smile 5s ease-in-out infinite';
        }
        
        const head = document.querySelector('.head');
        if (head) {
            head.style.animation = '';
            head.style.borderColor = '';
        }
        
        // Robô
        const robot = document.getElementById('robot');
        if (robot) robot.style.animation = 'gentle-float 6s ease-in-out infinite';
        
        // Reset dos valores na tela
        const tempValue = document.getElementById('tempValue');
        const bpmValue = document.getElementById('bpmValue');
        if (tempValue) {
            tempValue.textContent = '36.5°C';
            tempValue.style.color = '';
            tempValue.style.fontWeight = '';
        }
        if (bpmValue) {
            bpmValue.textContent = '72';
            bpmValue.style.color = '';
            bpmValue.style.fontWeight = '';
        }
    }
}

// ===== MENU MOBILE =====

function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const topNav = document.querySelector('.top-nav');

    if (navToggle && topNav) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            topNav.classList.toggle('active');
            navToggle.innerHTML = topNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                topNav.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && topNav.classList.contains('active')) {
                topNav.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// ===== SISTEMA DE AVALIAÇÕES =====

let currentRating = 0;

// Adicionar evento às estrelas
if (ratingStars.length > 0) {
    ratingStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            currentRating = rating;
            
            ratingStars.forEach(s => {
                if (parseInt(s.getAttribute('data-rating')) <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
}

// Enviar avaliação
if (submitRating) {
    submitRating.addEventListener('click', function() {
        if (currentRating === 0) {
            showNotification('Por favor, selecione uma avaliação antes de enviar.', 'error');
            return;
        }
        
        const comment = document.getElementById('ratingComment').value.trim();
        const date = new Date().toLocaleDateString('pt-BR');
        
        const review = {
            rating: currentRating,
            comment: comment,
            date: date
        };
        
        let reviews = JSON.parse(localStorage.getItem('lubbiReviews') || '[]');
        reviews.push(review);
        localStorage.setItem('lubbiReviews', JSON.stringify(reviews));
        
        loadReviews();
        
        currentRating = 0;
        ratingStars.forEach(star => star.classList.remove('active'));
        document.getElementById('ratingComment').value = '';
        
        showNotification('Obrigado pela sua avaliação!', 'success');
    });
}

// Carregar avaliações
function loadReviews() {
    if (!reviewsContainer) return;
    
    const reviews = JSON.parse(localStorage.getItem('lubbiReviews') || '[]');
    reviewsContainer.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>';
        return;
    }
    
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-item';
        
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= review.rating ? '★' : '☆';
        }
        
        reviewElement.innerHTML = `
            <div class="review-header">
                <div class="review-stars">${stars}</div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-text">${review.comment || 'Sem comentário'}</div>
        `;
        
        reviewsContainer.appendChild(reviewElement);
    });
}

// ===== CHATBOT COM IA =====

function initializeAIChatbot() {
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const sendMessageBtn = document.getElementById('sendMessage');

    if (!chatbotMessages || !chatbotInput || !sendMessageBtn) return;

    let conversationId = `user-${Date.now()}`;

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        // Processar quebras de linha e formatação
        const formattedMessage = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
            
        messageDiv.innerHTML = `<p>${formattedMessage}</p>`;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function processUserMessage(message) {
        // Mostrar indicador de digitação
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.innerHTML = '<p><i class="fas fa-ellipsis-h"></i> LUBBI Assistant está digitando...</p>';
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        try {
            // Simular delay de rede
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
            
            // Remover indicador de digitação
            typingIndicator.remove();
            
            // Gerar resposta local
            const response = generateFallbackResponse(message);
            addMessage(response);
            
        } catch (error) {
            typingIndicator.remove();
            const fallbackResponse = generateFallbackResponse(message);
            addMessage(fallbackResponse);
        }
    }

    // Resposta de fallback local
    function generateFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Conhecimento sobre o LUBBI
        if (lowerMessage.includes('lubbi') || lowerMessage.includes('robô') || lowerMessage.includes('robot')) {
            return `🤖 **LUBBI - Robô de Triagem Inteligente**
            
O LUBBI é um robô de triagem médica avançado que utiliza sensores de última geração e inteligência artificial para fornecer diagnósticos rápidos e precisos.

**Principais Funcionalidades:**
• Medição de temperatura sem contato
• Monitoramento cardíaco em tempo real
• Interface touchscreen intuitiva
• Navegação autônoma

Posso te explicar mais sobre alguma funcionalidade específica?`;
        }
        
        if (lowerMessage.includes('temperatura') || lowerMessage.includes('febre')) {
            return `🌡️ **Sensor de Temperatura do LUBBI**
            
O LUBBI utiliza sensor infravermelho para medição de temperatura sem contato com precisão de ±0.1°C.

**Características:**
• Medição em 2 segundos
• Sem contato físico
• Precisão hospitalar
• Calibração automática`;
        }
        
        if (lowerMessage.includes('coração') || lowerMessage.includes('batimento') || lowerMessage.includes('bpm')) {
            return `💓 **Monitoramento Cardíaco**
            
O sensor do LUBBI monitora frequência cardíaca com tecnologia de fotopletismografia.

**Recursos:**
• Precisão de ±2 BPM
• Detecção de arritmias
• Monitoramento contínuo
• Análise em tempo real`;
        }
        
        if (lowerMessage.includes('conectar') || lowerMessage.includes('conexão')) {
            return `🔌 **Como conectar com o LUBBI:**

Para conectar com o robô LUBBI:

1. **Certifique-se que o LUBBI está ligado** e na mesma rede WiFi
2. **Clique no botão "Conectar ao LUBBI"** na seção de Monitoramento
3. **Aguarde a conexão** - o sistema tentará se conectar automaticamente
4. **Verifique os dados** - temperatura e batimentos cardíacos serão exibidos

Problemas de conexão? Verifique se o LUBBI está ligado e acessível na rede.`;
        }
        
        if (lowerMessage.includes('equipe') || lowerMessage.includes('desenvolvedor') || lowerMessage.includes('criador')) {
            return `👨‍💻 **Equipe de Desenvolvimento**
            
O LUBBI foi desenvolvido por uma equipe multidisciplinar da FIAP especializada em:
• Engenharia Biomédica
• Inteligência Artificial
• Desenvolvimento de Software
• Design UX/UI
• Medicina e Triagem

Clique no botão "Equipe" no menu para conhecer nossos integrantes!`;
        }
        
        // Resposta padrão educada
        return `Olá! Sou o LUBBI Assistant. Posso te ajudar com informações sobre:

🤖 **O que é o LUBBI** - Conceito e funcionalidades
🌡️ **Sensores** - Tecnologias de medição
📊 **Dados em Tempo Real** - Monitoramento atual
🔌 **Conexão** - Como conectar com o LUBBI
👨‍💻 **Equipe** - Desenvolvedores do projeto

Sobre o que gostaria de saber?`;
    }

    sendMessageBtn.addEventListener('click', async () => {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, true);
            chatbotInput.value = '';
            await processUserMessage(message);
        }
    });

    chatbotInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const message = chatbotInput.value.trim();
            if (message) {
                addMessage(message, true);
                chatbotInput.value = '';
                await processUserMessage(message);
            }
        }
    });

    // Mensagem de boas-vindas melhorada
    addMessage(`🤖 **Bem-vindo ao LUBBI Assistant!**

Sou seu assistente virtual especializado no Robô de Triagem Inteligente LUBBI. Posso te ajudar com:

• Informações sobre o projeto LUBBI
• Detalhes técnicos dos sensores
• Instruções de conexão
• Dúvidas sobre funcionalidades

O que gostaria de saber hoje?`);
}

// ===== ACESSIBILIDADE =====

function initializeAccessibility() {
    // Modo Daltonismo
    if (colorBlindBtn) {
        colorBlindBtn.addEventListener('click', () => {
            document.body.classList.remove('blue-theme');
            document.body.classList.add('color-blind-theme');
            localStorage.setItem('theme', 'color-blind');
            showNotification('Modo de alto contraste ativado', 'success');
        });
    }
    
    // Resetar Tema
    if (resetThemeBtn) {
        resetThemeBtn.addEventListener('click', () => {
            document.body.classList.remove('color-blind-theme', 'blue-theme');
            localStorage.setItem('theme', 'default');
            showNotification('Tema original restaurado', 'success');
        });
    }
    
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'blue') {
        document.body.classList.add('blue-theme');
    } else if (savedTheme === 'color-blind') {
        document.body.classList.add('color-blind-theme');
    }
}

// ===== FUNÇÕES UTILITÁRIAS =====

// Animação dos stats da home
function startStatsAnimation() {
    const timeStat = document.getElementById('stat-time');
    if (timeStat) {
        let current = 0;
        const target = 45;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            timeStat.textContent = Math.floor(current) + 'Seg';
        }, 16);
    }
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remover notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Função auxiliar para status de conexão
function updateConnectionStatus(message, status) {
    const screenStatus = document.getElementById('screenStatus');
    if (screenStatus) {
        screenStatus.textContent = message;
    }
}

// ===== INICIALIZAÇÃO DA PÁGINA =====

window.onload = () => {
    // Verificar se já fez login anteriormente
    const hasLoggedIn = localStorage.getItem('hasLoggedIn');
    if (hasLoggedIn) {
        loginContainer.style.display = "none";
    } else {
        loginContainer.style.display = "flex";
    }
    
    updateTrafficLightNav();
    updateNavbarActive();
    startStatsAnimation();
    loadReviews();
    initializeAIChatbot();
    initializeAccessibility();
    initRobotInteractionSystem();
    initMobileMenu();
    
    // Inicializar com status desconectado
    updateConnectionStatus('Sistema LUBBI Pronto para Uso', 'ready');
};

// Scroll suave para links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
        e.preventDefault();
        const targetID = this.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetID);
        if(targetElement) {
            targetElement.scrollIntoView({behavior: 'smooth'});
        }
    });
});

// Adicionar CSS para notificações
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text);
        padding: 15px 20px;
        border-radius: 10px;
        border-left: 4px solid var(--accent);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 10000;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: #4CAF50;
    }
    
    .notification-error {
        border-left-color: #f44336;
    }

    .notification-info {
        border-left-color: var(--accent);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }

    @media (max-width: 768px) {
        .notification {
            top: 80px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(dynamicStyles);// Adicionar ao seu script.js existente

// Animação do robô quando cards são clicados
function animateRobot(feature) {
    const robot = document.getElementById('robot');
    const actionIndicator = document.getElementById('actionIndicator');
    const indicatorText = document.getElementById('indicatorText');
    
    // Reset de animações
    robot.style.animation = 'none';
    
    // Animação baseada na funcionalidade
    switch(feature) {
        case 'sensor-temp':
            indicatorText.textContent = 'Medindo Temperatura...';
            robot.classList.add('excited');
            break;
        case 'sensor-bpm':
            indicatorText.textContent = 'Monitorando Batimentos...';
            robot.classList.add('excited');
            break;
        case 'wheels':
            indicatorText.textContent = 'Movimentando...';
            robot.classList.add('excited');
            break;
        default:
            indicatorText.textContent = 'Funcionalidade Ativa';
    }
    
    // Mostrar indicador
    actionIndicator.classList.add('active');
    
    // Reset após animação
    setTimeout(() => {
        robot.classList.remove('excited');
        robot.style.animation = 'gentle-float 6s ease-in-out infinite';
    }, 2000);
}

// Atualizar dados em tempo real na tela do robô
function updateRobotScreen(temp, bpm) {
    const tempElement = document.getElementById('tempValue');
    const bpmElement = document.getElementById('bpmValue');
    const statusElement = document.getElementById('screenStatus');
    
    if (tempElement) tempElement.textContent = `${temp}°C`;
    if (bpmElement) bpmElement.textContent = bpm;
    
    // Atualizar status baseado nos valores
    if (temp > 37.5 || bpm > 100) {
        statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ATENÇÃO: Avaliação Necessária';
        statusElement.style.color = '#ff4444';
    } else {
        statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Sistema Pronto para Uso';
        statusElement.style.color = '#00ff88';
    }
}// Adicione esta função ao seu script.js existente

function initMobileLayout() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Configurações específicas para mobile
        document.body.classList.add('mobile-device');
        
        // Inicializar menu mobile
        initMobileMenu();
        
        // Inicializar interações touch para cards
        initMobileCardInteractions();
        
        // Otimizar performance para mobile
        optimizeMobilePerformance();
    }
}

// Menu mobile corrigido
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const topNav = document.querySelector('.top-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && topNav) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            topNav.classList.toggle('active');
            navToggle.innerHTML = topNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        // Fechar menu ao clicar nos links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                topNav.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && topNav.classList.contains('active')) {
                topNav.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Prevenir scroll quando menu está aberto
        document.addEventListener('touchmove', (e) => {
            if (topNav.classList.contains('active')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Interações de cards para mobile
function initMobileCardInteractions() {
    const featureCards = document.querySelectorAll('.feature-card-mobile');
    
    featureCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Fechar outros cards abertos
            featureCards.forEach(otherCard => {
                if (otherCard !== this && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                }
            });
            
            // Alternar estado do card clicado
            this.classList.toggle('active');
            
            // Se o card foi aberto, rolar para ele
            if (this.classList.contains('active')) {
                this.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        });
    });

    // Fechar cards ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.feature-card-mobile')) {
            featureCards.forEach(card => {
                card.classList.remove('active');
            });
        }
    });
}

// Otimizações de performance para mobile
function optimizeMobilePerformance() {
    // Reduzir animações pesadas em mobile
    const reduceAnimations = () => {
        document.body.style.setProperty('--transition', 'all 0.3s ease');
    };

    // Lazy loading para imagens
    const initLazyLoading = () => {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    };

    reduceAnimations();
    initLazyLoading();
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initMobileLayout();
    
    // Re-inicializar quando a janela for redimensionada
    window.addEventListener('resize', initMobileLayout);
});

// Scroll suave para links âncora em mobile
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Altura do header
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});