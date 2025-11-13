// Aguarda o carregamento completo do DOM antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM - obtém referências para os elementos HTML
    const cookieContainer = document.getElementById('cookieContainer');
    const fortuneCookie = document.getElementById('fortuneCookie');
    const fortuneContainer = document.getElementById('fortuneContainer');
    const fortuneText = document.getElementById('fortuneText');
    const fortuneAuthor = document.getElementById('fortuneAuthor');
    const breakBtn = document.getElementById('breakBtn');
    const newCookieBtn = document.getElementById('newCookieBtn');
    const loading = document.getElementById('loading');
    
    // URL da API para buscar frases zen
    const apiUrl = 'https://zenquotes.io/api/random';
    
    // Estado da aplicação - controla se o biscoito já foi quebrado
    let isCookieBroken = false;
    
    // Função para quebrar o biscoito
    function breakCookie() {
        // Verifica se o biscoito já foi quebrado
        if (isCookieBroken) return;
        
        // Adiciona classe para animação de quebra
        cookieContainer.classList.add('breaking');
        // Desabilita o botão para evitar múltiplos cliques
        breakBtn.disabled = true;
        
        // Reproduz som de quebra
        playCrackSound();
        
        // Após um tempo, completa a quebra do biscoito
        setTimeout(() => {
            cookieContainer.classList.remove('breaking');
            cookieContainer.classList.add('broken');
            
            // Mostra o loading e busca uma frase da API
            loading.classList.add('show');
            fetchQuote();
        }, 800);
    }
    
    // Função para buscar uma frase da API
    function fetchQuote() {
        // Faz requisição para a API
        fetch(apiUrl)
            .then(response => {
                // Verifica se a resposta foi bem sucedida
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then(data => {
                // A API ZenQuotes retorna um array com um objeto
                const quote = data[0];
                
                // Exibe a frase e o autor no pergaminho
                fortuneText.textContent = `"${quote.q}"`;
                fortuneAuthor.textContent = `- ${quote.a}`;
                
                // Após um tempo, mostra o pergaminho com a mensagem
                setTimeout(() => {
                    loading.classList.remove('show');
                    fortuneContainer.classList.add('show');
                    newCookieBtn.style.display = 'block';
                    breakBtn.style.display = 'none';
                    isCookieBroken = true;
                }, 1000);
            })
            .catch(error => {
                // Em caso de erro, usa frases de fallback
                console.error('Erro ao buscar frase:', error);
                useFallbackQuote();
            });
    }
    
    // Função para usar frases de fallback caso a API falhe
    function useFallbackQuote() {
        // Lista de frases zen de fallback
        const fallbackQuotes = [
            { q: "A jornada de mil milhas começa com um único passo.", a: "Lao Tzu" },
            { q: "A simplicidade é o último grau de sofisticação.", a: "Leonardo da Vinci" },
            { q: "Quem olha para fora sonha, quem olha para dentro desperta.", a: "Carl Jung" },
            { q: "A paciência é uma virtude, e eu estou aprendendo a praticá-la. É uma lição difícil.", a: "Leonardo da Vinci" },
            { q: "A mente é tudo. Você se torna aquilo que você pensa.", a: "Buda" },
            { q: "A verdadeira viagem de descobrimento não consiste em procurar novas paisagens, mas em ter novos olhos.", a: "Marcel Proust" },
            { q: "A natureza não se apressa, e ainda assim tudo é realizado.", a: "Lao Tzu" },
            { q: "Quem não encontra felicidade em si mesmo, é inútil procurá-la em outro lugar.", a: "La Rochefoucauld" },
            { q: "O silêncio é a melhor resposta para a estupidez.", a: "Einstein" },
            { q: "Aprenda a ouvir. Oportunidades batem à porta com muita frequência, mas você não as ouve.", a: "Provérbio Zen" }
        ];
        
        // Seleciona uma frase aleatória da lista
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        const quote = fallbackQuotes[randomIndex];
        
        // Exibe a frase e o autor
        fortuneText.textContent = `"${quote.q}"`;
        fortuneAuthor.textContent = `- ${quote.a}`;
        
        // Mostra o pergaminho com a mensagem
        loading.classList.remove('show');
        fortuneContainer.classList.add('show');
        newCookieBtn.style.display = 'block';
        breakBtn.style.display = 'none';
        isCookieBroken = true;
    }
    
    // Função para reproduzir som de quebra do biscoito
    function playCrackSound() {
        try {
            // Cria contexto de áudio
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Cria oscilador para gerar o som
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Conecta os nós de áudio
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Configura o som - frequência e volume
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            // Toca o som
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            // Caso o áudio não seja suportado pelo navegador
            console.log('Áudio não suportado ou bloqueado pelo navegador');
        }
    }
    
    // Função para reiniciar o biscoito (abrir outro)
    function resetCookie() {
        // Remove classes de estado quebrado
        cookieContainer.classList.remove('broken');
        fortuneContainer.classList.remove('show');
        
        // Mostra botão de quebrar e esconde botão de novo biscoito
        newCookieBtn.style.display = 'none';
        breakBtn.style.display = 'block';
        breakBtn.disabled = false;
        
        // Reseta o estado do biscoito
        isCookieBroken = false;
    }
    
    // Event listeners - escuta eventos de clique nos elementos
    
    // Quebra o biscoito ao clicar no botão
    breakBtn.addEventListener('click', breakCookie);
    
    // Quebra o biscoito ao clicar diretamente nele
    cookieContainer.addEventListener('click', breakCookie);
    
    // Reseta o biscoito para abrir outro
    newCookieBtn.addEventListener('click', resetCookie);
    
    // Mensagem inicial no console
    console.log('✨ Clique no biscoito ou no botão para quebrá-lo e revelar sua mensagem zen!');
});