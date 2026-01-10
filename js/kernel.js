/**
 * CYBER HACKER CLICKER: DEEP WEB EDITION
 * Ana Çekirdek (Kernel) - Oyun Durumu Yönetimi
 */

// ===== GLOBAL DEĞİŞKENLER =====
let highestZ = 100;
let gameStarted = false;
let gamePaused = false;

// ===== OYUN STATE =====
const gameState = {
    wallet: 0.000,
    totalEarned: 0,
    xp: 0,
    level: 1,
    rank: 'Script Kiddie',
    playTime: 0,
    totalHacks: 0,
    systemsHacked: 0,
    maxThreat: 0,
    username: 'Unknown_Hacker',
    
    // Mining
    miningPower: 0.001,
    isMining: false,
    miningInterval: null,
    
    // Manuel hack
    clickPower: 0.001,
    criticalChance: 0.05,
    
    // Threat
    threatLevel: 0,
    threatStatus: 'DÜŞÜK',
    lastThreatCheck: Date.now(),
    
    // VPN
    vpnEnabled: false,
    vpnProtection: 0,
    
    // Inventory
    inventory: {},
    
    // Upgrades
    upgrades: {},
    
    // Settings
    settings: {
        soundEnabled: true,
        volumeMaster: 50,
        volumeAmbient: 30,
        volumeSfx: 70,
        showCrt: true,
        showScanlines: true,
        showGlitch: true,
        showGlow: true,
        autoSave: true
    },
    
    // Timestamps
    lastSaveTime: Date.now(),
    lastAutoSave: Date.now()
};

// ===== RÜTBELER =====
const ranks = [
    { name: 'Script Kiddie', minLevel: 1, color: '#00ff41' },
    { name: 'White Hat', minLevel: 5, color: '#00cc33' },
    { name: 'Grey Hat', minLevel: 10, color: '#00aa00' },
    { name: 'Black Hat', minLevel: 20, color: '#ffaa00' },
    { name: 'Elite', minLevel: 35, color: '#ff6600' },
    { name: 'Legend', minLevel: 50, color: '#ff3300' },
    { name: 'Cyber God', minLevel: 75, color: '#ff00ff' }
];

// ===== SEVİYE BAŞINA XP =====
function getXpForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
}

function getNextLevelXp() {
    return getXpForLevel(gameState.level + 1);
}

// ===== AĞLAR (HEDEF SİSTEMLER) =====
const networks = [
    { id: 0, name: 'Komşu WiFi', ssid: 'NEIGHBOR_WIFI', signal: 70, hacked: false, reward: 0.1, difficulty: 1, description: 'Basit şifreli ev ağı' },
    { id: 1, name: 'Kafe Ağı', ssid: 'STARBUCKS_FREE', signal: 40, hacked: false, reward: 0.25, difficulty: 2, description: 'Halka açık WiFi noktası' },
    { id: 2, name: 'Kurumsal Sunucu', ssid: 'CORP_SERVER_01', signal: 95, hacked: false, reward: 1.0, difficulty: 3, description: 'Orta ölçekli şirket sunucusu' },
    { id: 3, name: 'Devlet Veritabanı', ssid: 'GOV_SECURE_NET', signal: 30, hacked: false, reward: 5.0, difficulty: 5, description: 'Yüksek güvenlikli devlet sistemi' },
    { id: 4, name: 'Banka Sistemi', ssid: 'BANK_MAINFRAME', signal: 15, hacked: false, reward: 25.0, difficulty: 8, description: 'Uluslararası banka anaframe' },
    { id: 5, name: 'FBI Database', ssid: 'FBI_NETCENTER', signal: 5, hacked: false, reward: 100.0, difficulty: 12, description: 'Federal araştırma veritabanı' }
];

// ===== BAŞLANGIÇ =====
document.addEventListener('DOMContentLoaded', () => {
    loadGameFromStorage();
    initBootSequence();
    initTerminal();
    initMarket();
    initAchievements();
    initMissions();
    initLeaderboard();
    
    // Oyun döngüsü
    setInterval(gameLoop, 1000);
    
    // Threat kontrolü
    setInterval(updateThreatSystem, 500);
    
    // Saat
    setInterval(updateClock, 1000);
    
    // Save
    if (gameState.settings.autoSave) {
        setInterval(autoSave, 30000); // Her 30 saniye
    }
});

// ===== BOOT SEQUENCE =====
function initBootSequence() {
    const bootLog = document.getElementById('boot-log');
    const bootProgress = document.getElementById('boot-progress');
    
    const bootSteps = [
        { msg: 'BIOS Date: 01/15/2024 14:30:22 Ver: 3.0', delay: 100 },
        { msg: 'CPU: Quantum Core @ 5.4GHz', delay: 200 },
        { msg: 'RAM: 64TB Virtual Memory... OK', delay: 150 },
        { msg: 'Initializing Neural Network...', delay: 300 },
        { msg: 'Loading Kernel Modules...', delay: 250 },
        { msg: 'Mounting Deep Web File System...', delay: 200 },
        { msg: 'Establishing Tor Connection...', delay: 400 },
        { msg: 'Connecting to Exit Nodes...', delay: 350 },
        { msg: 'Anonymity Protocol: ACTIVE', delay: 150 },
        { msg: 'Loading Security Bypass Tools...', delay: 300 },
        { msg: 'Initializing Mining Algorithms...', delay: 250 },
        { msg: 'Loading Darknet Market Data...', delay: 200 },
        { msg: 'Compiling Exploit Database...', delay: 400 },
        { msg: 'Finalizing System Configuration...', delay: 300 },
        { msg: 'DEEP OS v3.0 Ready.', delay: 200 }
    ];
    
    let currentStep = 0;
    let progress = 0;
    
    function runNextStep() {
        if (currentStep < bootSteps.length) {
            const step = bootSteps[currentStep];
            
            setTimeout(() => {
                const p = document.createElement('p');
                p.textContent = `> ${step.msg}`;
                bootLog.appendChild(p);
                bootLog.scrollTop = bootLog.scrollHeight;
                
                progress = ((currentStep + 1) / bootSteps.length) * 100;
                bootProgress.style.width = `${progress}%`;
                
                currentStep++;
                runNextStep();
            }, step.delay);
        } else {
            setTimeout(() => {
                showWelcomeScreen();
            }, 1000);
        }
    }
    
    runNextStep();
}

// ===== WELCOME SCREEN =====
function showWelcomeScreen() {
    document.getElementById('boot-sequence').style.display = 'none';
    document.getElementById('welcome-screen').classList.add('visible');
}

function startGame() {
    console.log('startGame() called - attempting to connect to Deep Web...');
    
    try {
        initAudio();
        playSound('success');
        
        console.log('Hiding welcome screen...');
        
        // Welcome screen'i gizle - CSS class kullanarak
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
            console.log('Welcome screen hidden successfully');
        } else {
            console.error('Welcome screen element not found!');
        }
        
        // CRT ve scanline efektlerini ayarla
        const crtOverlay = document.querySelector('.crt-overlay');
        const scanlines = document.querySelector('.scanlines');
        
        if (crtOverlay) {
            crtOverlay.style.display = gameState.settings.showCrt ? 'block' : 'none';
        }
        if (scanlines) {
            scanlines.style.display = gameState.settings.showScanlines ? 'block' : 'none';
        }
        
        // Desktop'u göster - CSS class kullanarak
        const desktop = document.getElementById('desktop');
        if (desktop) {
            desktop.classList.add('visible');
            console.log('Desktop displayed');
        }
        
        // THREAT SİSTEMİNİ SIFIRLA - BUSTED sorunu için düzeltme
        gameState.threatLevel = 0;
        gameState.threatStatus = 'DÜŞÜK';
        updateThreatDisplay();
        
        gameStarted = true;
        console.log('Game started successfully!');
        
        // İlk bildirim
        showNotification('Sisteme bağlandı!', 'success');
        
        // Terminal mesajları
        setTimeout(() => {
            if (typeof printLine === 'function') {
                printLine('═══════════════════════════════════════', 'system');
                printLine('   DEEP OS v3.0 YÜKLENDİ', 'success');
                printLine('   Hoş geldin, hacker!', 'info');
                printLine('═══════════════════════════════════════', 'system');
                printLine('Yardım için "help" yazın.', 'info');
            }
        }, 500);
        
        // Mining başlat
        setTimeout(() => {
            startMining();
            console.log('Mining started');
        }, 1000);
        
        // Açılış görevi
        setTimeout(() => {
            startTutorial();
        }, 3000);
        
    } catch (error) {
        console.error('Error in startGame():', error);
        alert('Bir hata oluştu: ' + error.message);
    }
}

// ===== SES SİSTEMİ =====
function initAudio() {
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    
    let volume = volumes.sfx / 100;
    if (type === 'ambient') volume = volumes.ambient / 100;
    
    gainNode.gain.value = volume * 0.3;
    
    const oscillator = audioCtx.createOscillator();
    oscillator.connect(gainNode);
    
    switch(type) {
        case 'hack':
            oscillator.frequency.value = 400 + Math.random() * 200;
            oscillator.type = 'square';
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.1);
            break;
        case 'success':
            oscillator.frequency.value = 880;
            oscillator.type = 'sine';
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.3);
            break;
        case 'error':
            oscillator.frequency.value = 100;
            oscillator.type = 'sawtooth';
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
            break;
        case 'warning':
            oscillator.frequency.value = 440;
            oscillator.type = 'square';
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.2);
            break;
        case 'upgrade':
            oscillator.frequency.value = 440;
            oscillator.type = 'sine';
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.5);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
            break;
        case 'achievement':
            oscillator.frequency.value = 523;
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(1047, audioCtx.currentTime + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
            break;
    }
}

// ===== OYUN DÖNGÜSÜ =====
function gameLoop() {
    if (!gameStarted || gamePaused) return;
    
    // Oyun süresi
    gameState.playTime++;
    updatePlayTime();
    
    // XP bar güncelleme
    updateXpBar();
    
    // Threat güncelleme - Dengelenmiş (oyuncuya zaman tanımak için)
    if (gameState.isMining) {
        const threatIncrease = gameState.vpnEnabled ? 0.02 : 0.05;
        gameState.threatLevel = Math.min(100, gameState.threatLevel + threatIncrease);
    } else if (gameState.vpnEnabled) {
        gameState.threatLevel = Math.max(0, gameState.threatLevel - 0.1);
    } else {
        gameState.threatLevel = Math.max(0, gameState.threatLevel - 0.05);
    }
    
    updateThreatDisplay();
    
    // Max threat güncelleme
    if (gameState.threatLevel > gameState.maxThreat) {
        gameState.maxThreat = gameState.threatLevel;
    }
    
    // Seviye kontrolü
    checkLevelUp();
    
    // Wallet güncelleme
    updateWalletDisplay();
}

// ===== TEHDİT SİSTEMİ =====
function updateThreatSystem() {
    if (!gameStarted) return;
    
    const threatDisplay = document.getElementById('tray-threat');
    
    if (gameState.threatLevel < 30) {
        gameState.threatStatus = 'DÜŞÜK';
        threatDisplay.className = 'tray-item threat-low';
    } else if (gameState.threatLevel < 70) {
        gameState.threatStatus = 'ORTA';
        threatDisplay.className = 'tray-item threat-medium';
        if (Math.random() > 0.95 && gameState.settings.showGlitch) {
            triggerGlitch(100);
            playSound('warning');
        }
    } else {
        gameState.threatStatus = 'YÜKSEK';
        threatDisplay.className = 'tray-item threat-high';
        
        // Trace uyarısı göster
        if (gameState.threatLevel >= 80) {
            document.getElementById('trace-warning').style.display = 'flex';
            document.getElementById('trace-fill').style.width = `${gameState.threatLevel}%`;
            document.getElementById('trace-percent').textContent = `${Math.floor(gameState.threatLevel)}%`;
        }
        
        if (Math.random() > 0.9 && gameState.settings.showGlitch) {
            triggerGlitch(200);
            playSound('warning');
        }
    }
    
    threatDisplay.textContent = `🛡️ ${gameState.threatStatus}`;
    
    // Oyun sonu kontrolü
    if (gameState.threatLevel >= 100) {
        gameOver();
    }
}

function triggerGlitch(duration) {
    if (!gameState.settings.showGlitch) return;
    
    const desktop = document.getElementById('desktop');
    if (desktop) {
        desktop.style.filter = 'invert(1) hue-rotate(90deg)';
        setTimeout(() => {
            desktop.style.filter = 'none';
        }, duration);
    }
}

function gameOver() {
    gamePaused = true;
    if (gameState.isMining) stopMining();
    
    playSound('error');
    
    document.body.innerHTML = `
        <div style="
            background: #000; 
            color: #ff3333; 
            height: 100vh; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            font-family: 'VT323', monospace; 
            text-align: center;
            padding: 20px;
        ">
            <h1 style="
                font-size: 80px; 
                margin: 0; 
                text-shadow: 0 0 30px #ff3333;
                animation: glitch 0.5s infinite;
            ">BUSTED</h1>
            <p style="font-size: 24px; margin: 20px 0; color: #ffaa00;">
                POLICE TRACED YOUR IP ADDRESS
            </p>
            <div style="
                background: #111; 
                border: 2px solid #ff3333; 
                padding: 20px; 
                margin: 20px 0;
                max-width: 500px;
            ">
                <p style="font-size: 16px; color: #ccc;">
                    İstatistiklerin sıfırlanacak ve tüm kazancın elinden alınacak!
                </p>
                <p style="font-size: 14px; color: #00ff41;">
                    Toplam Kazanç: ${gameState.totalEarned.toFixed(3)} DC<br>
                    Hack Sayısı: ${gameState.totalHacks}<br>
                    Sistem Kırıldı: ${gameState.systemsHacked}
                </p>
            </div>
            <button onclick="location.reload()" style="
                background: #ff3333; 
                color: #000; 
                border: none; 
                padding: 15px 40px; 
                cursor: pointer; 
                font-family: 'VT323', monospace; 
                font-size: 24px; 
                margin-top: 20px; 
                font-weight: bold;
                transition: all 0.3s;
            " onmouseover="this.style.boxShadow='0 0 30px #ff3333'" 
               onmouseout="this.style.boxShadow='none'">
                YENİDEN BAĞLAN
            </button>
        </div>
    `;
}

// ===== MINING SİSTEMİ =====
function startMining() {
    if (gameState.isMining) return;
    
    gameState.isMining = true;
    gameState.miningInterval = setInterval(() => {
        if (!gamePaused) {
            const earning = gameState.miningPower;
            gameState.wallet += earning;
            gameState.totalEarned += earning;
            gameState.xp += earning * 10;
            updateWalletDisplay();
        }
    }, 1000);
    
    printLine('Mining modülü başlatıldı.', 'success');
}

function stopMining() {
    if (!gameState.isMining) return;
    
    gameState.isMining = false;
    clearInterval(gameState.miningInterval);
    gameState.miningInterval = null;
    
    printLine('Mining durduruldu.', 'warning');
}

// ===== HACK FONKSİYONU =====
function performHack() {
    if (!gameStarted) return;
    
    playSound('hack');
    
    let earned = gameState.clickPower;
    
    // Kritik vuruş
    const isCritical = Math.random() < gameState.criticalChance;
    if (isCritical) {
        earned *= 3;
        showFloatingText('CRITICAL!', '+' + earned.toFixed(3) + ' DC', '#ff00ff');
    } else {
        showFloatingText('HACKED', '+' + earned.toFixed(3) + ' DC', '#00ff41');
    }
    
    gameState.wallet += earned;
    gameState.totalEarned += earned;
    gameState.xp += earned * 20;
    gameState.totalHacks++;
    
    // Threat artışı
    gameState.threatLevel = Math.min(100, gameState.threatLevel + (gameState.vpnEnabled ? 0.2 : 0.5));
    
    updateWalletDisplay();
    checkAchievements();
}

function showFloatingText(title, amount, color) {
    const button = document.querySelector('.main-hack-button');
    const rect = button.getBoundingClientRect();
    
    const floater = document.createElement('div');
    floater.innerHTML = `<strong>${title}</strong><br>${amount}`;
    floater.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top}px;
        transform: translateX(-50%);
        color: ${color};
        font-family: 'VT323', monospace;
        font-size: 24px;
        text-shadow: 0 0 10px ${color};
        pointer-events: none;
        z-index: 100003;
        animation: floatUp 1s ease-out forwards;
        text-align: center;
    `;
    
    document.body.appendChild(floater);
    
    // Float animasyonu
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% { opacity: 1; transform: translateX(-50%) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) translateY(-100px); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        floater.remove();
        style.remove();
    }, 1000);
}

// ===== WALLET GÜNCELLEME =====
function updateWalletDisplay() {
    const walletElements = [
        document.getElementById('wallet-val'),
        document.getElementById('tray-wallet'),
        document.getElementById('quick-btc')
    ];
    
    walletElements.forEach(el => {
        if (el) el.textContent = gameState.wallet.toFixed(3) + ' DC';
    });
}

function updateXpBar() {
    const xpFill = document.getElementById('profile-xp-fill');
    const currentXpEl = document.getElementById('current-xp');
    const nextXpEl = document.getElementById('next-level-xp');
    const trayXp = document.getElementById('tray-xp');
    const quickXp = document.getElementById('quick-xp');
    
    const currentXp = gameState.xp;
    const nextXp = getNextLevelXp();
    const percentage = Math.min(100, (currentXp / nextXp) * 100);
    
    if (xpFill) xpFill.style.width = `${percentage}%`;
    if (currentXpEl) currentXpEl.textContent = Math.floor(currentXp);
    if (nextXpEl) nextXpEl.textContent = nextXp;
    if (trayXp) trayXp.textContent = `⚡ ${Math.floor(gameState.xp)} XP`;
    if (quickXp) quickXp.textContent = Math.floor(gameState.xp);
}

function updatePlayTime() {
    const playTimeEl = document.getElementById('play-time');
    if (playTimeEl) {
        const hours = Math.floor(gameState.playTime / 3600);
        const minutes = Math.floor((gameState.playTime % 3600) / 60);
        const seconds = gameState.playTime % 60;
        
        if (hours > 0) {
            playTimeEl.textContent = `${hours}s ${minutes}d ${seconds}sn`;
        } else if (minutes > 0) {
            playTimeEl.textContent = `${minutes}d ${seconds}sn`;
        } else {
            playTimeEl.textContent = `${seconds}sn`;
        }
    }
}

function updateClock() {
    const clockEl = document.getElementById('clock');
    const trayTime = document.getElementById('tray-time');
    
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0');
    
    if (clockEl) clockEl.textContent = timeStr;
    if (trayTime) trayTime.textContent = timeStr;
}

// ===== SEVİYE KONTROLÜ =====
function checkLevelUp() {
    const nextXp = getNextLevelXp();
    
    while (gameState.xp >= nextXp) {
        gameState.xp -= nextXp;
        gameState.level++;
        
        // Rütbe güncelleme
        updateRank();
        
        // Bildirim
        showNotification(`Seviye ${gameState.level}!`, 'success');
        playSound('upgrade');
        
        // Click power artış
        gameState.clickPower *= 1.2;
        gameState.miningPower *= 1.15;
        
        printLine(`SEVİYE ATLADIN! Şimdi Level ${gameState.level}`, 'success');
        printLine(`Rütbe: ${gameState.rank}`, 'info');
        printLine(`Tıklama gücü: ${gameState.clickPower.toFixed(4)} DC`, 'info');
    }
    
    // Quick stats güncelleme
    const quickRank = document.getElementById('quick-rank');
    if (quickRank) quickRank.textContent = gameState.rank;
}

function updateRank() {
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (gameState.level >= ranks[i].minLevel) {
            gameState.rank = ranks[i].name;
            break;
        }
    }
    
    const rankElements = [
        document.getElementById('profile-rank'),
        document.getElementById('quick-rank')
    ];
    
    rankElements.forEach(el => {
        if (el) el.textContent = gameState.rank;
    });
}

// ===== PENCERE YÖNETİMİ =====
function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    
    win.style.display = 'flex';
    highestZ++;
    win.style.zIndex = highestZ;
    win.classList.add('active');
    
    // Pencereyi absolute konuma al
    if (win.style.transform !== 'none') {
        win.style.transform = 'none';
        win.style.margin = '0';
    }
    
    updateTaskbar();
    
    // Terminal ise inputa odaklan
    if (id === 'win-terminal') {
        setTimeout(() => {
            const input = document.getElementById('terminal-input');
            if (input) input.focus();
        }, 100);
    }
    
    // Chat ise en alta kaydir
    if (id === 'win-chat') {
        setTimeout(() => {
            const chatBox = document.getElementById('chat-messages');
            if (chatBox) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        }, 150);
    }
    
    // Specific window initializations
    if (id === 'win-hack-game') {
        startHackGame();
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'none';
        win.classList.remove('active');
        // Minimized bayrağını temizle
        win.dataset.minimized = 'false';
    }
    updateTaskbar();
}

function minimizeWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        // Pencereyi gizle ama taskbar'da tut
        win.style.display = 'none';
        // Pencereyi minimized olarak işaretle
        win.dataset.minimized = 'true';
    }
    // Taskbar'ı güncelleme - pencereyi kapatmadığımız için taskbar'da kalmalı
    updateTaskbar();
}

function maximizeWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    
    if (win.dataset.maximized === 'true') {
        win.style.width = win.dataset.origWidth;
        win.style.height = win.dataset.origHeight;
        win.style.top = win.dataset.origTop;
        win.style.left = win.dataset.origLeft;
        win.dataset.maximized = 'false';
    } else {
        win.dataset.origWidth = win.style.width;
        win.dataset.origHeight = win.style.height;
        win.dataset.origTop = win.style.top;
        win.dataset.origLeft = win.style.left;
        win.style.width = '100%';
        win.style.height = 'calc(100% - 45px)';
        win.style.top = '0';
        win.style.left = '0';
        win.dataset.maximized = 'true';
    }
}

function updateTaskbar() {
    const container = document.getElementById('taskbar-apps');
    if (!container) return;
    
    container.innerHTML = '';
    
    document.querySelectorAll('.window').forEach(win => {
        // Pencere açık VEY minimized ise taskbar'da göster
        if ((win.style.display !== 'none' && win.style.display !== '') || win.dataset.minimized === 'true') {
            const btn = document.createElement('div');
            btn.className = 'taskbar-item';
            btn.textContent = win.getAttribute('data-title') || 'Uygulama';
            btn.onclick = () => {
                highestZ++;
                win.style.zIndex = highestZ;
                win.style.display = 'flex';
                win.dataset.minimized = 'false';
                win.classList.add('active');
                updateTaskbar();
            };
            container.appendChild(btn);
        }
    });
}

// ===== BİLDİRİM SİSTEMİ =====
function showNotification(message, type = 'info') {
    const area = document.getElementById('notification-area');
    if (!area) return;
    
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = `<strong>${message}</strong>`;
    
    area.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideIn 0.3s ease reverse forwards';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ===== AYARLAR =====
function openSettings() {
    openWindow('win-settings');
    loadSettingsToUI();
}

function loadSettingsToUI() {
    document.getElementById('volume-master').value = gameState.settings.volumeMaster;
    document.getElementById('volume-master-val').textContent = gameState.settings.volumeMaster + '%';
    document.getElementById('volume-ambient').value = gameState.settings.volumeAmbient;
    document.getElementById('volume-ambient-val').textContent = gameState.settings.volumeAmbient + '%';
    document.getElementById('volume-sfx').value = gameState.settings.volumeSfx;
    document.getElementById('volume-sfx-val').textContent = gameState.settings.volumeSfx + '%';
    
    document.getElementById('opt-crt').checked = gameState.settings.showCrt;
    document.getElementById('opt-scanlines').checked = gameState.settings.showScanlines;
    document.getElementById('opt-glitch').checked = gameState.settings.showGlitch;
    document.getElementById('opt-glow').checked = gameState.settings.showGlow;
    document.getElementById('opt-autosave').checked = gameState.settings.autoSave;
    
    document.getElementById('setting-username').value = gameState.username;
}

function updateVolume(type, value) {
    gameState.settings['volume' + type.charAt(0).toUpperCase() + type.slice(1)] = parseInt(value);
    document.getElementById(`volume-${type}-val`).textContent = value + '%';
}

function toggleOption(option, value) {
    gameState.settings['show' + option.charAt(0).toUpperCase() + option.slice(1)] = value;
    
    // Anında uygula
    if (option === 'crt') {
        document.querySelector('.crt-overlay').style.display = value ? 'block' : 'none';
    } else if (option === 'scanlines') {
        document.querySelector('.scanlines').style.display = value ? 'block' : 'none';
    }
}

function saveSettings() {
    gameState.username = document.getElementById('setting-username').value || 'Unknown_Hacker';
    showNotification('Ayarlar kaydedildi!', 'success');
    closeWindow('win-settings');
    
    // Profil güncelleme
    document.getElementById('profile-name').textContent = gameState.username;
}

// ===== OYUN KAYDETME/YÜKLEME =====
function saveGame() {
    const saveData = {
        state: gameState,
        networks: networks,
        inventory: gameState.inventory,
        upgrades: gameState.upgrades
    };
    
    localStorage.setItem('cyberHackerSave', JSON.stringify(saveData));
    gameState.lastSaveTime = Date.now();
    showNotification('Oyun kaydedildi!', 'success');
}

function loadGame() {
    const saved = localStorage.getItem('cyberHackerSave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            
            // State yükle
            Object.assign(gameState, data.state);
            
            // Networks yükle
            if (data.networks) {
                data.networks.forEach((net, i) => {
                    if (networks[i]) {
                        networks[i].hacked = net.hacked;
                    }
                });
            }
            
            // UI güncelle
            updateWalletDisplay();
            updateXpBar();
            updateRank();
            updateThreatDisplay();
            
            showNotification('Oyun yüklendi!', 'success');
            
            // Welcome screen'i gizle
            document.getElementById('welcome-screen').style.display = 'none';
            gameStarted = true;
            
            // Mining başlatma - kullanıcı kendisi başlatsın
            
        } catch (e) {
            showNotification('Kayıt yüklenemedi!', 'error');
        }
    } else {
        showNotification('Kayıtlı oyun bulunamadı!', 'error');
    }
}

function loadGameFromStorage() {
    // Auto-load if exists
    const saved = localStorage.getItem('cyberHackerSave');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            if (data.state) {
                Object.assign(gameState, data.state);
            }
        } catch (e) {
            console.log('No valid save found');
        }
    }
}

function autoSave() {
    if (gameState.settings.autoSave && gameStarted) {
        const now = Date.now();
        if (now - gameState.lastAutoSave >= 30000) {
            saveGame();
            gameState.lastAutoSave = now;
        }
    }
}

function resetGame() {
    if (confirm('Tüm ilerleme silinecek! Emin misin?')) {
        localStorage.removeItem('cyberHackerSave');
        location.reload();
    }
}

// ===== REHBER DOLDURMA =====
document.addEventListener('DOMContentLoaded', () => {
    const guideContent = document.getElementById('guide-content');
    if (guideContent) {
        guideContent.value = `
========================================
DEEP WEB SURVIVAL GUIDE v3.0
========================================

OYUNUN AMACI:
    Deep Web'de bir hacker olarak çeşitli 
    sistemlere sızmak, kripto para (DC) kazanmak
    ve polisten kaçmak. Tehdit seviyen 
    %100 olursa yakalanırsın!

RÜTBELER:
    Script Kiddie → White Hat → Grey Hat → 
    Black Hat → Elite → Legend → Cyber God

TEMEL KOMUTLAR (Terminal):
    help        - Komut listesi
    hack        - Manuel hack başlat
    mine        - Mining aç/kapa
    scan        - Ağ taraması yap
    connect [id]- Ağa bağlan
    buy [id]    - Marketten satın al
    status      - Durum göster
    missions    - Görevler
    clear       - Temizle

TEHDİT SİSTEMİ:
    Her hack işlemi tehdit seviyeni artırır.
    %100 olursa GAME OVER!
    
    Tehditi düşürmek için:
    - Mining durdur
    - Log Wiper satın al
    - VPN kullan

BAŞARIMLAR:
    Oyun içinde çeşitli başarımlar
    kazanabilirsin. Bunlar ekstra XP ve
    ödüller sağlar!

========================================
KOMUTUNU BEKLİYORUZ, HACKER...
========================================
`;
    }
});

// ===== DRAG & RESIZE =====
let isDragging = false;
let isResizing = false;
let activeWin = null;
let currentHandle = "";
let offset = { x: 0, y: 0 };
const edgeSize = 10;

document.querySelectorAll('.window').forEach(win => {
    const header = win.querySelector('.header');
    
    win.addEventListener('mousedown', () => {
        highestZ++;
        win.style.zIndex = highestZ;
        win.classList.add('active');
    });
    
    // Mouse tracking for resize cursor
    win.addEventListener('mousemove', (e) => {
        if (isResizing || isDragging) return;
        const rect = win.getBoundingClientRect();
        let h = '';
        if (e.clientY < rect.top + edgeSize) h += 'n';
        else if (e.clientY > rect.bottom - edgeSize) h += 's';
        if (e.clientX < rect.left + edgeSize) h += 'w';
        else if (e.clientX > rect.right - edgeSize) h += 'e';
        win.style.cursor = h ? h + '-resize' : 'default';
    });
    
    // Resize başlat
    win.addEventListener('mousedown', (e) => {
        const rect = win.getBoundingClientRect();
        let h = '';
        if (e.clientY < rect.top + edgeSize) h += 'n';
        else if (e.clientY > rect.bottom - edgeSize) h += 's';
        if (e.clientX < rect.left + edgeSize) h += 'w';
        else if (e.clientX > rect.right - edgeSize) h += 'e';
        
        if (h) {
            isResizing = true;
            currentHandle = h;
            activeWin = win;
            document.body.style.cursor = h + '-resize';
            e.preventDefault();
        }
    });
    
    // Drag başlat
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.control-btn') || isResizing) return;
        
        isDragging = true;
        activeWin = win;
        const rect = win.getBoundingClientRect();
        
        win.style.transform = 'none';
        win.style.margin = '0';
        win.style.left = rect.left + 'px';
        win.style.top = rect.top + 'px';
        
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;
        e.preventDefault();
    });
});

// Global mouse tracking
document.addEventListener('mousemove', (e) => {
    if (!activeWin) return;
    
    if (isDragging) {
        activeWin.style.left = (e.clientX - offset.x) + 'px';
        activeWin.style.top = (e.clientY - offset.y) + 'px';
    }
    
    if (isResizing) {
        const rect = activeWin.getBoundingClientRect();
        const minW = 300;
        const minH = 200;
        
        if (currentHandle.includes('e')) {
            let nw = e.clientX - rect.left;
            if (nw >= minW) activeWin.style.width = nw + 'px';
        }
        if (currentHandle.includes('s')) {
            let nh = e.clientY - rect.top;
            if (nh >= minH) activeWin.style.height = nh + 'px';
        }
        if (currentHandle.includes('w')) {
            let nw = rect.right - e.clientX;
            if (nw >= minW) {
                activeWin.style.width = nw + 'px';
                activeWin.style.left = e.clientX + 'px';
            }
        }
        if (currentHandle.includes('n')) {
            let nh = rect.bottom - e.clientY;
            if (nh >= minH) {
                activeWin.style.height = nh + 'px';
                activeWin.style.top = e.clientY + 'px';
            }
        }
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    isResizing = false;
    activeWin = null;
    document.body.style.cursor = 'default';
});

// ===== UPDATE THREAT DISPLAY =====
function updateThreatDisplay() {
    const threatVal = document.getElementById('threat-val');
    if (threatVal) {
        threatVal.textContent = gameState.threatStatus;
        threatVal.style.color = gameState.threatStatus === 'DÜŞÜK' ? '#000' : 
                                 gameState.threatStatus === 'ORTA' ? '#ffaa00' : '#ff3333';
    }
}

// ===== SHOW CREDITS =====
function showCredits() {
    const credits = `
========================================
         CYBER HACKER CLICKER
        Deep Web Edition v3.0
========================================

GELİŞTİRME:
    MiniMax Agent
    
İLHAM:
    Welcome to the Game serisi
    Mr. Robot
    Hackers (1995)

TEŞEKKÜRLER:
    Tüm oyun test edenler
    
========================================
© 2024 Deep Web Studios
========================================
`;
    alert(credits);
}

// ===== TUTORIAL =====
function startTutorial() {
    setTimeout(() => {
        showNotification('İpucu: Terminalden "help" yazarak komutları öğren!', 'info');
    }, 2000);
    
    setTimeout(() => {
        showNotification('İpucu: Marketten donanım alarak güçlen!', 'info');
    }, 6000);
}

// ===== GLOBAL FONKSİYONLAR =====
window.openWindow = openWindow;
window.closeWindow = closeWindow;
window.minimizeWindow = minimizeWindow;
window.maximizeWindow = maximizeWindow;
window.startGame = startGame;
window.performHack = performHack;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetGame = resetGame;
window.openSettings = openSettings;
window.saveSettings = saveSettings;
window.showCredits = showCredits;
window.toggleSound = toggleSound;
window.updateVolume = updateVolume;
window.toggleOption = toggleOption;
window.startMining = startMining;
window.stopMining = stopMining;
