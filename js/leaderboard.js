/**
 * CYBER HACKER CLICKER: DEEP WEB EDITION
 * Leaderboard Modülü - Global Sıralama
 */

// Mock leaderboard data
const leaderboardData = [
    { id: 1, name: 'DarkLord', avatar: '👺', totalEarnedDC: 15420, totalEarnedUSD: 500, hacks: 3452, level: 75, rank: 'Cyber God', netWorthUSD: 565.42 },
    { id: 2, name: 'GhostRunner', avatar: '👻', totalEarnedDC: 12850, totalEarnedUSD: 250, hacks: 2890, level: 68, rank: 'Legend', netWorthUSD: 263.85 },
    { id: 3, name: 'ZeroCool', avatar: '💀', totalEarnedDC: 11200, totalEarnedUSD: 100, hacks: 2540, level: 62, rank: 'Legend', netWorthUSD: 112.20 },
    { id: 4, name: 'Neo', avatar: '🕶️', totalEarnedDC: 9800, totalEarnedUSD: 75, hacks: 2100, level: 55, rank: 'Elite', netWorthUSD: 109.55 },
    { id: 5, name: 'Trinity', avatar: '👩‍💻', totalEarnedDC: 8500, totalEarnedUSD: 50, hacks: 1890, level: 50, rank: 'Elite', netWorthUSD: 98.50 },
    { id: 6, name: 'Morpheus', avatar: '🦁', totalEarnedDC: 7200, totalEarnedUSD: 25, hacks: 1650, level: 45, rank: 'Black Hat', netWorthUSD: 97.20 },
    { id: 7, name: 'Cipher', avatar: '🔐', totalEarnedDC: 6100, totalEarnedUSD: 10, hacks: 1420, level: 40, rank: 'Black Hat', netWorthUSD: 86.10 },
    { id: 8, name: 'Anonymous', avatar: '🎭', totalEarnedDC: 5200, totalEarnedUSD: 5, hacks: 1200, level: 35, rank: 'Grey Hat', netWorthUSD: 97.20 },
    { id: 9, name: 'Hacktivist', avatar: '✊', totalEarnedDC: 4300, totalEarnedUSD: 0, hacks: 980, level: 30, rank: 'Grey Hat', netWorthUSD: 84.30 },
    { id: 10, name: 'CyberNinja', avatar: '🥷', totalEarnedDC: 3500, totalEarnedUSD: 0, hacks: 820, level: 25, rank: 'White Hat', netWorthUSD: 83.50 },
    { id: 11, name: 'ScriptKiddie', avatar: '🧒', totalEarnedDC: 2500, totalEarnedUSD: 0, hacks: 600, level: 18, rank: 'White Hat', netWorthUSD: 82.50 },
    { id: 12, name: 'Newbie', avatar: '👶', totalEarnedDC: 1500, totalEarnedUSD: 0, hacks: 350, level: 12, rank: 'Script Kiddie', netWorthUSD: 81.50 },
    { id: 13, name: 'NoobMaster', avatar: '🎮', totalEarnedDC: 800, totalEarnedUSD: 0, hacks: 180, level: 8, rank: 'Script Kiddie', netWorthUSD: 80.80 },
    { id: 14, name: 'Rookie', avatar: '🐣', totalEarnedDC: 400, totalEarnedUSD: 0, hacks: 90, level: 5, rank: 'Script Kiddie', netWorthUSD: 80.40 },
    { id: 15, name: 'Beginner', avatar: '🌱', totalEarnedDC: 150, totalEarnedUSD: 0, hacks: 35, level: 2, rank: 'Script Kiddie', netWorthUSD: 80.15 }
];

let currentLeaderboardFilter = 'total';

// Leaderboard initialization
function initLeaderboard() {
    renderLeaderboard();
}

// Leaderboard render et
function renderLeaderboard(filter = 'total') {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;
    
    currentLeaderboardFilter = filter;
    
    // Oyuncuyu ekle (eğer yoksa)
    addPlayerToLeaderboard();
    
    // Sırala
    let sortedData = [...leaderboardData];
    
    switch(filter) {
        case 'total':
            sortedData.sort((a, b) => b.totalEarnedDC - a.totalEarnedDC);
            break;
        case 'networth':
            sortedData.sort((a, b) => b.netWorthUSD - a.netWorthUSD);
            break;
        case 'hacks':
            sortedData.sort((a, b) => b.hacks - a.hacks);
            break;
        case 'level':
            sortedData.sort((a, b) => b.level - a.level);
            break;
    }
    
    // Oyuncu ID'sini al
    const playerId = getPlayerId();
    
    list.innerHTML = sortedData.map((entry, index) => {
        const rank = index + 1;
        let rankClass = '';
        if (rank === 1) rankClass = 'top-1';
        else if (rank === 2) rankClass = 'top-2';
        else if (rank === 3) rankClass = 'top-3';
        
        const isCurrentUser = entry.id === playerId;
        
        return `
            <div class="lb-entry ${rankClass} ${isCurrentUser ? 'current-user' : ''}">
                <span class="lb-rank">#${rank}</span>
                <div class="lb-avatar">${entry.avatar}</div>
                <span class="lb-name">${entry.name}</span>
                <span class="lb-value">${formatValue(entry, filter)}</span>
            </div>
        `;
    }).join('');
}

// Oyuncuyu leaderboard'a ekle
function addPlayerToLeaderboard() {
    const playerId = getPlayerId();
    
    // Oyuncuyu bul veya oluştur
    let playerEntry = leaderboardData.find(e => e.id === playerId);
    
    if (!playerEntry) {
        playerEntry = {
            id: playerId,
            name: gameState.username,
            avatar: getAvatarEmoji(),
            totalEarnedDC: gameState.wallet.dc,
            totalEarnedUSD: gameState.wallet.usd,
            hacks: gameState.totalHacks,
            level: gameState.level,
            rank: gameState.rank,
            netWorthUSD: getTotalNetWorthUSD()
        };
        leaderboardData.push(playerEntry);
    } else {
        // Oyuncuyu güncelle
        playerEntry.name = gameState.username;
        playerEntry.totalEarnedDC = gameState.wallet.dc;
        playerEntry.totalEarnedUSD = gameState.wallet.usd;
        playerEntry.hacks = gameState.totalHacks;
        playerEntry.level = gameState.level;
        playerEntry.rank = gameState.rank;
        playerEntry.netWorthUSD = getTotalNetWorthUSD();
    }
}

// Değeri formatla
function formatValue(entry, filter) {
    switch(filter) {
        case 'total':
            return `${entry.totalEarnedDC.toFixed(1)} DC`;
        case 'networth':
            return `$${entry.netWorthUSD.toFixed(2)}`;
        case 'hacks':
            return `${entry.hacks} hack`;
        case 'level':
            return `Lv.${entry.level}`;
        default:
            return `${entry.totalEarnedDC.toFixed(1)} DC`;
    }
}

// Sıralama değiştir
function switchLeaderboard(filter) {
    document.querySelectorAll('.lb-filter').forEach(f => {
        f.classList.remove('active');
    });
    event.target.classList.add('active');
    renderLeaderboard(filter);
}

// Oyuncuyu leaderboard'dan kaldır
function removePlayerFromLeaderboard() {
    const playerId = getPlayerId();
    const index = leaderboardData.findIndex(e => e.id === playerId);
    if (index !== -1) {
        leaderboardData.splice(index, 1);
    }
}

// Oyuncu ID'sini getir (benzersiz)
function getPlayerId() {
    let playerId = localStorage.getItem('cyberHackerPlayerId');
    if (!playerId) {
        playerId = 'player_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('cyberHackerPlayerId', playerId);
    }
    return playerId;
}

// Global sıralamada oyuncunun pozisyonu
function getPlayerPosition(filter = 'total') {
    addPlayerToLeaderboard();
    
    let sortedData = [...leaderboardData];
    switch(filter) {
        case 'total':
            sortedData.sort((a, b) => b.totalEarnedDC - a.totalEarnedDC);
            break;
        case 'networth':
            sortedData.sort((a, b) => b.netWorthUSD - a.netWorthUSD);
            break;
        case 'hacks':
            sortedData.sort((a, b) => b.hacks - a.hacks);
            break;
        case 'level':
            sortedData.sort((a, b) => b.level - a.level);
            break;
    }
    
    const playerId = getPlayerId();
    const position = sortedData.findIndex(e => e.id === playerId);
    
    return position + 1;
}

// Leaderboard'ı güncelle (oyun durumu değiştiğinde)
function updateLeaderboard() {
    addPlayerToLeaderboard();
    renderLeaderboard(currentLeaderboardFilter);
}

// Leaderboard'ı local storage'a kaydet
function saveLeaderboard() {
    localStorage.setItem('cyberHackerLeaderboard', JSON.stringify(leaderboardData));
}

// Leaderboard'ı local storage'dan yükle
function loadLeaderboard() {
    const saved = localStorage.getItem('cyberHackerLeaderboard');
    if (saved) {
        const data = JSON.parse(saved);
        // Oyuncunun verilerini koru
        addPlayerToLeaderboard();
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initLeaderboard();
});

window.initLeaderboard = initLeaderboard;
window.renderLeaderboard = renderLeaderboard;
window.switchLeaderboard = switchLeaderboard;
window.addPlayerToLeaderboard = addPlayerToLeaderboard;
window.getPlayerPosition = getPlayerPosition;
window.updateLeaderboard = updateLeaderboard;
window.saveLeaderboard = saveLeaderboard;
window.loadLeaderboard = loadLeaderboard;
