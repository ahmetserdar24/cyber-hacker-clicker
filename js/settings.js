/**
 * CYBER HACKER CLICKER: DEEP WEB EDITION
 * Settings Modülü - Sistem Ayarları
 */

// Varsayılan ayarlar
const defaultSettings = {
    volume: {
        master: 50,
        ambient: 30,
        sfx: 70
    },
    visuals: {
        crt: true,
        scanlines: true,
        glitch: true,
        glow: true
    },
    game: {
        username: 'Unknown_Hacker',
        autosave: true
    }
};

// Mevcut ayarlar
let gameSettings = { ...defaultSettings };

// Ayarları yükle
function loadSettings() {
    const saved = localStorage.getItem('cyberHackerSettings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Ayarları birleştir (yeni eklenen ayarları koru)
            gameSettings = {
                volume: { ...defaultSettings.volume, ...parsed.volume },
                visuals: { ...defaultSettings.visuals, ...parsed.visuals },
                game: { ...defaultSettings.game, ...parsed.game }
            };
        } catch (e) {
            console.error('Ayarlar yüklenirken hata:', e);
            gameSettings = { ...defaultSettings };
        }
    }
    
    // UI'ı güncelle
    applySettingsToUI();
    
    // Ses ayarlarını uygula
    updateVolume('master', gameSettings.volume.master);
    updateVolume('ambient', gameSettings.volume.ambient);
    updateVolume('sfx', gameSettings.volume.sfx);
    
    // Görsel ayarları uygula
    toggleOption('crt', gameSettings.visuals.crt);
    toggleOption('scanlines', gameSettings.visuals.scanlines);
    toggleOption('glitch', gameSettings.visuals.glitch);
    toggleOption('glow', gameSettings.visuals.glow);
    
    // Oyun ayarlarını uygula
    toggleOption('autosave', gameSettings.game.autosave);
    
    const usernameInput = document.getElementById('setting-username');
    if (usernameInput) {
        usernameInput.value = gameSettings.game.username;
    }
}

// UI'a ayarları uygula
function applySettingsToUI() {
    // Ses slider'ları
    const masterSlider = document.getElementById('volume-master');
    const ambientSlider = document.getElementById('volume-ambient');
    const sfxSlider = document.getElementById('volume-sfx');
    
    if (masterSlider) masterSlider.value = gameSettings.volume.master;
    if (ambientSlider) ambientSlider.value = gameSettings.volume.ambient;
    if (sfxSlider) sfxSlider.value = gameSettings.volume.sfx;
    
    // Ses değerlerini göster
    updateVolumeDisplay('master', gameSettings.volume.master);
    updateVolumeDisplay('ambient', gameSettings.volume.ambient);
    updateVolumeDisplay('sfx', gameSettings.volume.sfx);
    
    // Görsel toggle'ları
    const crtToggle = document.getElementById('opt-crt');
    const scanlinesToggle = document.getElementById('opt-scanlines');
    const glitchToggle = document.getElementById('opt-glitch');
    const glowToggle = document.getElementById('opt-glow');
    
    if (crtToggle) crtToggle.checked = gameSettings.visuals.crt;
    if (scanlinesToggle) scanlinesToggle.checked = gameSettings.visuals.scanlines;
    if (glitchToggle) glitchToggle.checked = gameSettings.visuals.glitch;
    if (glowToggle) glowToggle.checked = gameSettings.visuals.glow;
    
    // Oyun toggle'ları
    const autosaveToggle = document.getElementById('opt-autosave');
    if (autosaveToggle) autosaveToggle.checked = gameSettings.game.autosave;
    
    // Kullanıcı adı
    const usernameInput = document.getElementById('setting-username');
    if (usernameInput) usernameInput.value = gameSettings.game.username;
}

// Ses seviyesini güncelle
function updateVolume(type, value) {
    const numValue = parseInt(value);
    gameSettings.volume[type] = numValue;
    
    // Ses seviyesini göster
    updateVolumeDisplay(type, numValue);
    
    // Ana ses kontrolü
    if (type === 'master' && volumes) {
        volumes.master = numValue;
    }
    
    // Oynat
    playSound('success');
}

// Ses seviyesi göstergesini güncelle
function updateVolumeDisplay(type, value) {
    const display = document.getElementById(`volume-${type}-val`);
    if (display) {
        display.textContent = `${value}%`;
    }
}

// Görsel seçeneği değiştir
function toggleOption(option, enabled) {
    gameSettings.visuals[option] = enabled;
    
    // UI'ı güncelle
    const toggle = document.getElementById(`opt-${option}`);
    if (toggle) {
        toggle.checked = enabled;
    }
    
    // Efektleri uygula
    applyVisualEffects();
}

// Görsel efektleri uygula
function applyVisualEffects() {
    // CRT efekti
    const crtOverlay = document.querySelector('.crt-overlay');
    if (crtOverlay) {
        crtOverlay.style.display = gameSettings.visuals.crt ? 'block' : 'none';
    }
    
    // Scanlines efekti
    const scanlines = document.querySelector('.scanlines');
    if (scanlines) {
        scanlines.style.display = gameSettings.visuals.scanlines ? 'block' : 'none';
    }
    
    // Glitch efektleri (sınıfları kontrol et)
    const glitchElements = document.querySelectorAll('.welcome-glitch, .btn-glitch');
    glitchElements.forEach(el => {
        if (gameSettings.visuals.glitch) {
            el.style.animation = '';
        } else {
            el.style.animation = 'none';
        }
    });
    
    // Glow efekti
    const glowText = document.querySelectorAll('.glow-text');
    glowText.forEach(el => {
        if (gameSettings.visuals.glow) {
            el.style.textShadow = '0 0 5px currentColor, 0 0 10px currentColor';
        } else {
            el.style.textShadow = 'none';
        }
    });
}

// Ayarları kaydet
function saveSettings() {
    // Kullanıcı adını güncelle
    const usernameInput = document.getElementById('setting-username');
    if (usernameInput) {
        const newUsername = usernameInput.value.trim();
        if (newUsername && newUsername !== gameSettings.game.username) {
            gameSettings.game.username = newUsername;
            gameState.username = newUsername;
            updateProfile();
            showNotification(`Kullanıcı adı "${newUsername}" olarak güncellendi!`, 'success');
        }
    }
    
    // Local storage'a kaydet
    localStorage.setItem('cyberHackerSettings', JSON.stringify(gameSettings));
    
    // Bildirim göster
    showNotification('Ayarlar başarıyla kaydedildi!', 'success');
    
    // Ses çal
    playSound('success');
    
    // Leaderboard'ı güncelle
    updateLeaderboard();
}

// Ayarları sıfırla
function resetSettings() {
    if (confirm('Tüm ayarları varsayılana sıfırlamak istediğinize emin misiniz?')) {
        gameSettings = { ...defaultSettings };
        localStorage.removeItem('cyberHackerSettings');
        applySettingsToUI();
        applyVisualEffects();
        updateVolume('master', gameSettings.volume.master);
        updateVolume('ambient', gameSettings.volume.ambient);
        updateVolume('sfx', gameSettings.volume.sfx);
        showNotification('Ayarlar varsayılana sıfırlandı!', 'info');
        playSound('warning');
    }
}

// Ayarlar penceresini aç
function openSettings() {
    const settingsWindow = document.getElementById('win-settings');
    if (settingsWindow) {
        openWindow('win-settings');
    } else {
        // Eğer pencere yoksa, welcome screen'den aç
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.classList.add('hidden');
        }
        // Oyun başlamışsa direkt pencereyi aç
        const desktop = document.getElementById('desktop');
        if (desktop && desktop.classList.contains('visible')) {
            openWindow('win-settings');
        }
    }
    
    // Ayarları yükle
    loadSettings();
}

// Settings initialization
function initSettings() {
    loadSettings();
}

// Hızlı ses ayarı
function setMasterVolume(value) {
    updateVolume('master', value);
}

function setAmbientVolume(value) {
    updateVolume('ambient', value);
}

function setSfxVolume(value) {
    updateVolume('sfx', value);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initSettings();
});

// Global fonksiyonları expose et
window.loadSettings = loadSettings;
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;
window.updateVolume = updateVolume;
window.toggleOption = toggleOption;
window.openSettings = openSettings;
window.applyVisualEffects = applyVisualEffects;
window.setMasterVolume = setMasterVolume;
window.setAmbientVolume = setAmbientVolume;
window.setSfxVolume = setSfxVolume;
