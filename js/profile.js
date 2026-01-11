/**
 * CYBER HACKER CLICKER: DEEP WEB EDITION
 * Profile Modülü - Kullanıcı Profili
 */

// Profili güncelle
function updateProfile() {
    // Avatar
    const avatar = document.getElementById('profile-avatar');
    if (avatar) {
        avatar.textContent = getAvatarEmoji();
    }
    
    // Level badge
    const levelBadge = document.getElementById('profile-level');
    if (levelBadge) {
        levelBadge.textContent = `Lv.${gameState.level}`;
    }
    
    // Name
    const profileName = document.getElementById('profile-name');
    if (profileName) {
        profileName.textContent = gameState.username;
    }
    
    // Rank
    const profileRank = document.getElementById('profile-rank');
    if (profileRank) {
        profileRank.textContent = gameState.rank;
    }
    
    // XP bar
    const xpFill = document.getElementById('profile-xp-fill');
    const currentXpEl = document.getElementById('current-xp');
    const nextXpEl = document.getElementById('next-level-xp');
    
    if (xpFill) {
        const currentXp = gameState.xp;
        const nextXp = getNextLevelXp();
        const percentage = Math.min(100, (currentXp / nextXp) * 100);
        xpFill.style.width = `${percentage}%`;
    }
    
    if (currentXpEl) currentXpEl.textContent = Math.floor(gameState.xp);
    if (nextXpEl) nextXpEl.textContent = getNextLevelXp();
    
    // Stats
    updateProfileStats();
}

// Profil istatistiklerini güncelle
function updateProfileStats() {
    // DC Balance
    const dcBalance = document.getElementById('dc-balance');
    if (dcBalance) dcBalance.textContent = `${gameState.wallet.dc.toFixed(4)} DC`;
    
    // USD Balance
    const usdBalance = document.getElementById('usd-balance');
    if (usdBalance) usdBalance.textContent = `$${gameState.wallet.usd.toFixed(2)}`;
    
    // BTC Balance
    const btcBalance = document.getElementById('btc-balance');
    if (btcBalance) btcBalance.textContent = `₿ ${gameState.wallet.btc.toFixed(8)}`;
    
    // Net Worth
    const netWorth = document.getElementById('net-worth');
    if (netWorth) netWorth.textContent = `$${getTotalNetWorthUSD().toFixed(2)}`;
    
    // Total hacks
    const totalHacks = document.getElementById('total-hacks');
    if (totalHacks) totalHacks.textContent = gameState.totalHacks;
    
    // Achievements
    const achievementsUnlocked = document.getElementById('achievements-unlocked');
    if (achievementsUnlocked) {
        const unlocked = getUnlockedAchievements();
        achievementsUnlocked.textContent = `${unlocked}/${achievements.length}`;
    }
    
    // Play time
    const playTime = document.getElementById('play-time');
    if (playTime) {
        playTime.textContent = formatTime(gameState.playTime);
    }
    
    // Systems hacked
    const systemsHacked = document.getElementById('systems-hacked');
    if (systemsHacked) systemsHacked.textContent = gameState.systemsHacked;
    
    // Max threat
    const maxThreat = document.getElementById('max-threat');
    if (maxThreat) maxThreat.textContent = `${gameState.maxThreat.toFixed(1)}%`;
}

// Avatar emoji getir
function getAvatarEmoji() {
    const avatars = ['👤', '👨‍💻', '🧑‍💻', '👩‍💻', '🤖', '🦹', '🕵️', '👺', '💀', '🎭'];
    
    // Seviyeye göre avatar değişsin
    const index = Math.floor(gameState.level / 10) % avatars.length;
    return avatars[index];
}

// Profili kaydet
function saveProfile() {
    localStorage.setItem('cyberHackerProfile', JSON.stringify({
        username: gameState.username,
        level: gameState.level,
        rank: gameState.rank
    }));
}

// Profili yükle
function loadProfile() {
    const saved = localStorage.getItem('cyberHackerProfile');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.username) gameState.username = data.username;
    }
    
    updateProfile();
}

// Profili sıfırla
function resetProfile() {
    if (confirm('Profil sıfırlanacak. Emin misiniz?')) {
        localStorage.removeItem('cyberHackerProfile');
        gameState.username = 'Unknown_Hacker';
        updateProfile();
        showNotification('Profil sıfırlandı!', 'info');
    }
}

// Profile initialization
function initProfile() {
    loadProfile();
}

// Quick stats güncelleme
function updateQuickStats() {
    const quickBtc = document.getElementById('quick-btc');
    const quickXp = document.getElementById('quick-xp');
    const quickRank = document.getElementById('quick-rank');
    
    if (quickBtc) quickBtc.textContent = gameState.wallet.toFixed(3);
    if (quickXp) quickXp.textContent = Math.floor(gameState.xp);
    if (quickRank) quickRank.textContent = gameState.rank;
}

// XP bar güncelleme
function updateXpBar() {
    const xpFill = document.getElementById('profile-xp-fill');
    const currentXpEl = document.getElementById('current-xp');
    const nextXpEl = document.getElementById('next-level-xp');
    
    if (xpFill) {
        const currentXp = gameState.xp;
        const nextXp = getNextLevelXp();
        const percentage = Math.min(100, (currentXp / nextXp) * 100);
        xpFill.style.width = `${percentage}%`;
    }
    
    if (currentXpEl) currentXpEl.textContent = Math.floor(gameState.xp);
    if (nextXpEl) nextXpEl.textContent = getNextLevelXp();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initProfile();
});

window.updateProfile = updateProfile;
window.updateProfileStats = updateProfileStats;
window.saveProfile = saveProfile;
window.loadProfile = loadProfile;
window.resetProfile = resetProfile;
window.updateQuickStats = updateQuickStats;
window.updateXpBar = updateXpBar;
