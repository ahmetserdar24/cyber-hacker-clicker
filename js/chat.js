/**
 * CYBER HACKER CLICKER: DEEP WEB EDITION
 * Chat Modülü - Global Hacker Chat
 */

// Chat mesajları
const chatMessages = [
    { user: 'System', text: 'Deep Web Chat odasına hoş geldiniz!', type: 'system' },
    { user: 'GhostRunner', text: 'Selamlar, yeni exploit satışta olan var mı?', type: 'normal' },
    { user: 'ZeroCool', text: 'GOV veritabanını kırdım, 100 DC kazandım!', type: 'normal' },
    { user: 'DarkKnight', text: 'Dikkatli olun, FBI son zamanlarda aktif.', type: 'warning' },
    { user: 'Anonymous', text: 'Operasyon yakında başlıyor, hazır olun.', type: 'important' },
    { user: 'ScriptKiddie', text: 'Nasıl başlamalıyım? Yardım edebilir misiniz?', type: 'question' },
    { user: 'EliteHacker', text: 'Log Wiper almayı unutmayın, çok önemli!', type: 'advice' },
    { user: 'CyberNinja', text: 'Anyone got a zero-day for sale?', type: 'normal' }
];

// Chat initialization
function initChat() {
    const chatBox = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    
    if (!chatBox || !chatInput) return;
    
    // Mevcut mesajları göster ve en alta kaydır
    renderChatMessages();
    
    // Chat penceresi açıldığında en alta kaydir
    const chatWindow = document.getElementById('win-chat');
    if (chatWindow) {
        chatWindow.addEventListener('open', () => {
            scrollChatToBottom();
        });
        // İlk açılışta da en alta kaydir
        setTimeout(() => scrollChatToBottom(), 100);
    }
    
    // Input event
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Rastgele mesajlar ekle
    setInterval(() => {
        if (Math.random() > 0.7) {
            addRandomChatMessage();
        }
    }, 5000);
}

// Chat'i en alta kaydir
function scrollChatToBottom() {
    const chatBox = document.getElementById('chat-messages');
    if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Chat mesajlarını render et
function renderChatMessages() {
    const chatBox = document.getElementById('chat-messages');
    if (!chatBox) return;
    
    chatBox.innerHTML = chatMessages.map(msg => createMessageHTML(msg)).join('');
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Mesaj HTML oluştur - Yeni Bubble Tasarımı
function createMessageHTML(msg) {
    const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    let messageClass = 'normal';
    if (msg.type === 'system') messageClass = 'system';
    else if (msg.type === 'warning') messageClass = 'warning';
    else if (msg.type === 'important') messageClass = 'important';
    else if (msg.type === 'question') messageClass = 'question';
    else if (msg.type === 'advice') messageClass = 'advice';
    
    // Kendi mesajımız mı kontrol et
    const isMyMessage = msg.user === gameState.username || msg.user === 'Siz';
    if (isMyMessage) {
        messageClass += ' my-message';
    }
    
    return `
        <div class="chat-message ${messageClass}">
            <span class="sender">${msg.user}</span>
            <span class="time">[${time}]</span>
            <span class="text">${escapeHtml(msg.text)}</span>
        </div>
    `;
}

// HTML escape fonksiyonu (XSS koruması)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Mesaj gönder
function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-messages');
    
    if (!chatInput || !chatBox) return;
    
    const text = chatInput.value.trim();
    if (!text) return;
    
    const msg = {
        user: gameState.username,
        text: text,
        type: 'normal',
        time: new Date()
    };
    
    chatMessages.push(msg);
    
    // Kendi mesajını göster
    const msgHTML = createMessageHTML(msg);
    chatBox.insertAdjacentHTML('beforeend', msgHTML);
    
    // Input temizle
    chatInput.value = '';
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Rastgele mesaj ekle
function addRandomChatMessage() {
    const randomMessages = [
        { user: 'HackerOne', text: 'Bug bounty programı başladı!', type: 'info' },
        { user: 'DarkWebDealer', text: 'Quality exploits, DM for prices.', type: 'normal' },
        { user: 'SecurityExpert', text: 'VPN kullanın arkadaşlar!', type: 'advice' },
        { user: 'Newbie', text: 'Bu oyun çok zor, nasıl kazanabilirim?', type: 'question' },
        { user: 'Veteran', text: 'Sabırlı olun, yavaş yavaş ilerleyin.', type: 'advice' },
        { user: 'CryptoTrader', text: 'Bitcoin fiyatı yükseliyor, kazancınızı artırın!', type: 'info' },
        { user: 'ThreatActor', text: 'Yeni ransomware satışa çıktı.', type: 'warning' },
        { user: 'WhiteHat', text: 'Ethical hacking her zaman kazandırır.', type: 'advice' },
        { user: 'BlackHat', text: 'Risk ne kadar yüksek, kazanç o kadar yüksek!', type: 'normal' },
        { user: 'Insider', text: 'Şirket sızıntısı yakında paylaşılacak.', type: 'important' }
    ];
    
    const randomMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    
    chatMessages.push(randomMsg);
    
    const chatBox = document.getElementById('chat-messages');
    if (chatBox) {
        const msgHTML = createMessageHTML(randomMsg);
        chatBox.insertAdjacentHTML('beforeend', msgHTML);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// Socket.io entegrasyonu (opsiyonel)
function initSocketChat() {
    // Socket.io mevcutsa kullan
    if (typeof io !== 'undefined') {
        const socket = io();
        
        socket.on('chat message', (msg) => {
            chatMessages.push(msg);
            const chatBox = document.getElementById('chat-messages');
            if (chatBox) {
                const msgHTML = createMessageHTML(msg);
                chatBox.insertAdjacentHTML('beforeend', msgHTML);
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initChat();
});

window.sendChatMessage = sendChatMessage;
window.initChat = initChat;
window.addRandomChatMessage = addRandomChatMessage;
window.createMessageHTML = createMessageHTML;
window.scrollChatToBottom = scrollChatToBottom;
