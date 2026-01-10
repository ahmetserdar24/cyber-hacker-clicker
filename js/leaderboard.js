/**
 * CYBER HACKER CLICKER: DEEP WEB EDITION
 * Leaderboard Modülü - Global Sıralama
 */

// Mock leaderboard data
const leaderboardData = [
    { id: 1, name: 'DarkLord', avatar: '👺', totalEarned: 15420, hacks: 3452, level: 75, rank: 'Cyber God' },
    { id: 2, name: 'GhostRunner', avatar: '👻', totalEarned: 12850, hacks: 2890, level: 68, rank: 'Legend' },
    { id: 3, name: 'ZeroCool', avatar: '💀', totalEarned: 11200, hacks: 2540, level: 62, rank: 'Legend' },
    { id: 4, name: 'Neo', avatar: '🕶️', totalEarned: 9800, hacks: 2100, level: 55, rank: 'Elite' },
    { id: 5, name: 'Trinity', avatar: '👩‍💻', totalEarned: 8500, hacks: 1890, level: 50, rank: 'Elite' },
    { id: 6, name: 'Morpheus', avatar: '🦁', totalEarned: 7200, hacks: 1650, level: 45, rank: 'Black Hat' },
    { id: 7, name: 'Cipher', avatar: '🔐', totalEarned: 6100, hacks: 1420, level: 40, rank: 'Black Hat' },
    { id: 8, name: 'Anonymous', avatar: '🎭', totalEarned: 5200, hacks: 1200, level: 35, rank: 'Grey Hat' },
    { id: 9, name: 'Hacktivist', avatar: '✊', totalEarned: 4300, hacks: 980, level: 30, rank: 'Grey Hat' },
    { id: 10, name: 'CyberNinja', avatar: '🥷', totalEarned: 3500, hacks: 820, level: 25, rank: 'White Hat' },
    { id: 11, name: 'ScriptKiddie', avatar: '🧒', totalEarned: 2500, hacks: 600, level: 18, rank: 'White Hat' },
    { id: 12, name: 'Newbie', avatar: '👶', totalEarned: 1500, hacks: 350, level: 12, rank: 'Script Kiddie' },
    { id: 13, name: 'NoobMaster', avatar: '🎮', totalEarned: 800, hacks: 180, level: 8, rank: 'Script Kiddie' },
    { id: 14, name: 'Rookie', avatar: '🐣', totalEarned: 400, hacks: 90, level: 5, rank: 'Script Kiddie' },
    { id: 15, name: 'Beginner', avatar: '🌱', totalEarned: 150, hacks: 35, level: 2, rank: 'Script Kiddie' }
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
            sortedData.sort((a, b) => b.totalEarned - a.totalEarned);
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
            totalEarned: gameState.totalEarned,
            hacks: gameState.totalHacks,
            level: gameState.level,
            rank: gameState.rank
        };
        leaderboardData.push(playerEntry);
    } else {
        // Oyuncuyu güncelle
        playerEntry.name = gameState.username;
        playerEntry.totalEarned = gameState.totalEarned;
        playerEntry.hacks = gameState.totalHacks;
        playerEntry.level = gameState.level;
        playerEntry.rank = gameState.rank;
    }
}

// Değeri formatla
function formatValue(entry, filter) {
    switch(filter) {
        case 'total':
            return `${entry.totalEarned.toFixed(1)} DC`;
        case 'hacks':
            return `${entry.hacks} hack`;
        case 'level':
            return `Lv.${entry.level}`;
        default:
            return `${entry.totalEarned.toFixed(1)} DC`;
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
            sortedData.sort((a, b) => b.totalEarned - a.totalEarned);
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
