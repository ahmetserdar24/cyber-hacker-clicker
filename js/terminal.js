/**
 * DEEP OS - Terminal UI ve Komut İşleyici
 */

const termInput = document.getElementById('term-input');
const termOut = document.getElementById('terminal-out');

if (termInput) {
    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = termInput.value.trim();
            const args = val.toLowerCase().split(' ');
            const cmd = args[0];
            const subCmd = args[1]; // Alt komut için
            
            // Kullanıcı komutunu göster
            printLine(`> ${val}`, "user-cmd");
            
            switch(cmd) {
                // ========== HELP KOMUTU ==========
                case 'help':
                    printLine("╔═══════════════════════════════════════════════════════╗", "info");
                    printLine("║          DEEP OS v3.0 - KOMUT LISTESI                 ║", "success");
                    printLine("╚═══════════════════════════════════════════════════════╝", "info");
                    
                    printLine("", "info");
                    printLine("📁 SISTEM KOMUTLARI:", "section-header");
                    printLine("   help        - Bu menuyu gosterir", "info");
                    printLine("   clear       - Ekrani temizler", "info");
                    printLine("   reboot      - Sistemi yeniden baslat", "info");
                    printLine("   save        - Oyunu kaydet", "info");
                    
                    printLine("", "info");
                    printLine("💰 PARA ISLEMLERI:", "section-header");
                    printLine("   wallet      - Cuzdan durumunu goster", "info");
                    
                    printLine("", "info");
                    printLine("📊 ISTATISTIKLER:", "section-header");
                    printLine("   stats       - Detayli istatistikler", "info");
                    printLine("   xp          - XP durumu", "info");
                    printLine("   rank        - Rutbe ve seviye", "info");
                    
                    printLine("", "info");
                    printLine("🔧 HACKING (ZORUNLU ADIMLAR):", "section-header");
                    printLine("   scan        - Ağları tara (Rastgele 3 ağ)", "warn");
                    printLine("   connect [ID]- Taranan ağa sız", "info");
                    printLine("   netinfo [ID]- Ağ hakkında detaylı bilgi", "info");
                    
                    printLine("", "info");
                    printLine("⛏️ MINING:", "section-header");
                    printLine("   mining -start  - Madenciligi baslat", "info");
                    printLine("   mining -stop   - Madenciligi durdur", "info");
                    
                    printLine("", "info");
                    printLine("─────────────────────────────────────────────────────────", "dim");
                    printLine("ÖNCE scan YAPMALISIN! Sonra connect [ID] ile sız.", "err");
                    break;
                    
                // ========== CLEAR KOMUTU ==========
                case 'clear':
                    termOut.innerHTML = '';
                    printLine("✓ Ekran temizlendi.", "success");
                    break;
                    
                // ========== REBOOT KOMUTU ==========
                case 'reboot':
                    printLine("Sistem yeniden baslatiliyor...", "warn");
                    setTimeout(() => {
                        if (confirm('Sistem yeniden baslatilicak. Emin misiniz?')) {
                            location.reload();
                        }
                    }, 500);
                    break;
                    
                // ========== SAVE KOMUTU ==========
                case 'save':
                    saveGame();
                    break;
                    
                // ========== WALLET KOMUTU ==========
                case 'wallet':
                    const w = getWalletStatus();
                    printLine("╔═══════════════════════════════════════════════════════╗", "info");
                    printLine("║                    💰 CUZDAN 💰                        ║", "success");
                    printLine("╚═══════════════════════════════════════════════════════╝", "info");
                    printLine("", "info");
                    printLine(`   💵 DC (DarkCoin)    : ${w.dc.padEnd(15)}`, "success");
                    printLine(`   💴 USD (Dollar)     : $${w.usd.padEnd(14)}`, "success");
                    printLine(`   ₿ BTC (Bitcoin)    : ${w.btc.padEnd(15)}`, "success");
                    printLine("", "info");
                    printLine("   ════════════════════════════════════════════════════", "dim");
                    printLine(`   📊 TOPLAM SERVET    : $${w.netWorth.padEnd(14)}`, "warn");
                    printLine("   ════════════════════════════════════════════════════", "dim");
                    break;
                    
                // ========== XP KOMUTU ==========
                case 'xp':
                    const currentXP = Math.floor(gameState.xp);
                    const nextXP = getNextLevelXp();
                    const progress = ((currentXP / nextXP) * 100).toFixed(1);
                    const progressBar = createProgressBar(progress, 20);
                    
                    printLine("╔═══════════════════════════════════════════════════════╗", "info");
                    printLine("║                    ⚡ XP DURUMU ⚡                     ║", "success");
                    printLine("╚═══════════════════════════════════════════════════════╝", "info");
                    printLine("", "info");
                    printLine(`   📊 MEVCUT XP   : ${currentXP}`, "info");
                    printLine(`   🎯 GEREKLI XP : ${nextXP}`, "info");
                    printLine(`   📈 ILERLEME   : [${progressBar}] ${progress}%`, "info");
                    printLine("", "info");
                    printLine(`   💡 Bir sonraki seviyaya ${nextXP - currentXP} XP kaldi!`, "dim");
                    break;
                    
                // ========== RANK KOMUTU ==========
                case 'rank':
                    printLine("╔═══════════════════════════════════════════════════════╗", "info");
                    printLine("║                   🏆 RUTBE BILGI 🏆                   ║", "success");
                    printLine("╚═══════════════════════════════════════════════════════╝", "info");
                    printLine("", "info");
                    printLine(`   👤 KULLANICI   : ${gameState.username}`, "info");
                    printLine(`   📊 SEVIYE      : ${gameState.level}`, "info");
                    printLine(`   🏆 RUTBE       : ${gameState.rank}`, "warn");
                    printLine("", "info");
                    printLine("   ════════════════════════════════════════════════════", "dim");
                    
                    // Progress to next rank
                    let nextRank = null;
                    for (let i = 0; i < ranks.length; i++) {
                        if (ranks[i].minLevel > gameState.level) {
                            nextRank = ranks[i];
                            break;
                        }
                    }
                    
                    if (nextRank) {
                        const xpNeeded = getXpForLevel(gameState.level + 1);
                        printLine(`   ⬆️ SONRAKI RUTBE: ${nextRank.name} (Lv.${nextRank.minLevel})`, "info");
                        printLine(`   📈 GEREKLI XP  : ${xpNeeded}`, "info");
                    } else {
                        printLine(`   🌟 EN YUKSEK RUTBEYE ULASTINIZ!`, "warn");
                    }
                    break;
                    
                // ========== STATS KOMUTU (BIRLESIK) ==========
                case 'stats':
                    const ws = getWalletStatus();
                    const playTimeFormatted = formatTime(gameState.playTime);
                    
                    printLine("╔═══════════════════════════════════════════════════════╗", "info");
                    printLine("║               📊 DETAYLI ISTATISTIKLER 📊            ║", "success");
                    printLine("╚═══════════════════════════════════════════════════════╝", "info");
                    printLine("", "info");
                    
                    // Cüzdan Bölümü
                    printLine("   ┌─────────────────────────────────────┐", "dim");
                    printLine("   │           💰 CUZDAN 💰               │", "success");
                    printLine("   ├─────────────────────────────────────┤", "dim");
                    printLine(`   │  DC  : ${ws.dc.padEnd(27)}│`, "info");
                    printLine(`   │  USD : $${ws.usd.padEnd(26)}│`, "info");
                    printLine(`   │  BTC : ${ws.btc.padEnd(27)}│`, "info");
                    printLine(`   │  NW  : $${ws.netWorth.padEnd(26)}│`, "warn");
                    printLine("   └─────────────────────────────────────┘", "dim");
                    printLine("", "info");
                    
                    // İstatistikler Bölümü
                    printLine("   ┌─────────────────────────────────────┐", "dim");
                    printLine("   │         📈 HACK ISTATISTIKLERI      │", "info");
                    printLine("   ├─────────────────────────────────────┤", "dim");
                    printLine(`   │  Toplam Hack Sayisi    : ${String(gameState.totalHacks).padEnd(12)}│`, "info");
                    printLine(`   │  Sistem Hacklendi      : ${String(gameState.systemsHacked).padEnd(12)}│`, "info");
                    printLine(`   │  Max Tehdit            : ${String(gameState.maxThreat.toFixed(1) + '%').padEnd(12)}│`, "info");
                    printLine(`   │  Oyun Suresi           : ${playTimeFormatted.padEnd(12)}│`, "info");
                    printLine("   └─────────────────────────────────────┘", "dim");
                    break;
                    
                // ========== SCAN KOMUTU ==========
                case 'scan':
                    printLine("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░", "dim");
                    printLine("📡 Yerel ağ taraması başlatılıyor...", "warn");
                    printLine("   Kablosuz adaptör: ACTIVE", "dim");
                    printLine("   Tarama modu: PASSIVE", "dim");
                    
                    setTimeout(() => {
                        printLine("   SSID'ler toplanıyor...", "dim");
                        
                        setTimeout(() => {
                            // Rastgele 3 ağ seç
                            const shuffled = [...networks].sort(() => 0.5 - Math.random());
                            const selectedNetworks = shuffled.slice(0, 3);
                            
                            // Scan sonuçlarını kaydet
                            gameState.hasScanned = true;
                            gameState.scannedNetworks = selectedNetworks.map(n => n.id);
                            
                            printLine("", "info");
                            printLine("╔══════════════════════════════════════════════════════════════════════╗", "info");
                            printLine("║                    📡 BULUNAN AĞLAR / SİSTEMLER 📡                   ║", "success");
                            printLine("╚══════════════════════════════════════════════════════════════════════╝", "info");
                            printLine("", "info");
                            
                            // Header
                            printLine("   ID   TİP        AD                        SİNYAL  GÜVENLİK    ÖDÜL      DURUM", "dim");
                            printLine("   ───  ────  ──────────────────────────────  ──────  ────────   ───────   ─────", "dim");
                            
                            selectedNetworks.forEach((net) => {
                                const status = net.hacked ? '✅ HACKED' : '🔒 GÜVENLİ';
                                const icon = getNetworkIcon(net.type);
                                const signalBar = '▓'.repeat(Math.ceil(net.signal / 10)) + '░'.repeat(10 - Math.ceil(net.signal / 10));
                                const typeStr = icon + ' ' + net.type;
                                
                                const idStr = String(net.id).padStart(3, ' ');
                                const typeStrPadded = typeStr.substring(0, 10).padEnd(10, ' ');
                                const nameStr = net.name.substring(0, 27).padEnd(27, ' ');
                                const signalStr = signalBar.substring(0, 10);
                                const securityStr = `${net.difficulty}/10`.padStart(8, ' ');
                                const rewardStr = net.reward.toFixed(2).toString().padStart(8, ' ');
                                
                                printLine(`   ${idStr}  ${typeStrPadded}  ${nameStr}  ${signalStr}  ${securityStr}  ${rewardStr} DC  ${status}`, 
                                          net.hacked ? 'success' : getSecurityColor(net.difficulty));
                            });
                            
                            printLine("", "info");
                            printLine("   ════════════════════════════════════════════════════════════════════", "dim");
                            printLine("   💡 Kullanım:", "dim");
                            printLine("   scan        - Yeniden tara (3 yeni ağ)", "info");
                            printLine("   connect [ID]- Ağa sızmaya çalış", "info");
                            printLine("   netinfo [ID]- Ağ hakkında detaylı bilgi", "info");
                            printLine("", "dim");
                            printLine("   ⚠️  Önce TARAMA yapmalısın!", "warn");
                            
                        }, 1000);
                    }, 800);
                    break;
                    
                // ========== NETINFO KOMUTU ==========
                case 'netinfo':
                    const infoId = parseInt(args[1]);
                    
                    if (isNaN(infoId)) {
                        printLine("❌ Kullanım: netinfo [ID]", "err");
                        printLine("   Örnek: netinfo 0", "dim");
                        break;
                    }
                    
                    // Önce tarama yapılmış mı kontrol et
                    if (!gameState.hasScanned) {
                        printLine("❌ Önce TARAMA yapmalısın!", "err");
                        printLine("   Kullanım: scan", "warn");
                        break;
                    }
                    
                    // Taranan ağlar içinde mi kontrol et
                    if (!gameState.scannedNetworks.includes(infoId)) {
                        printLine("❌ Bu ağ tarananlar arasında yok!", "err");
                        printLine(`   Mevcut ağlar: ${gameState.scannedNetworks.join(', ')}`, "warn");
                        printLine("   Yeniden taramak için: scan", "dim");
                        break;
                    }
                    
                    const targetNet = networks.find(n => n.id === infoId);
                    
                    if (!targetNet) {
                        printLine(`❌ Geçersiz ağ ID: ${infoId}`, "err");
                        break;
                    }
                    
                    printLine("╔═══════════════════════════════════════════════════════╗", "info");
                    printLine("║              📡 AĞ BİLGİLERİ 📡                       ║", "success");
                    printLine("╚═══════════════════════════════════════════════════════╝", "info");
                    printLine("", "info");
                    
                    printLine(`   🏷️  Ad         : ${targetNet.name}`, "info");
                    printLine(`   📶 SSID       : ${targetNet.ssid}`, "info");
                    printLine(`   📡 Tip        : ${getNetworkIcon(targetNet.type)} ${targetNet.type}`, "info");
                    printLine(`   💻 İşletim Sistemi : ${targetNet.os}`, "info");
                    printLine(`   🔒 Şifreleme  : ${targetNet.encryption}`, "info");
                    printLine(`   📊 Güvenlik   : ${targetNet.difficulty}/10`, getSecurityColor(targetNet.difficulty));
                    printLine(`   📈 Sinyal     : ${targetNet.signal}%`, "info");
                    printLine(`   🔌 Portlar    : ${targetNet.ports.join(', ')}`, "info");
                    printLine(`   💰 Ödül       : ${targetNet.reward.toFixed(2)} DC`, "success");
                    printLine("", "info");
                    printLine(`   📝 Açıklama   : ${targetNet.description}`, "dim");
                    
                    if (targetNet.hasLoot) {
                        printLine("", "info");
                        printLine(`   🎁 Loot Şansı : ${Math.round(targetNet.lootChance * 100)}%`, "warn");
                    }
                    
                    if (targetNet.hacked) {
                        printLine("", "warn");
                        printLine("   ⚠️  Bu sistem ZATEN HACKLANMIŞ!", "err");
                    }
                    break;
                    
                // ========== CONNECT KOMUTU ==========
                case 'connect':
                    const targetId = parseInt(args[1]);
                    
                    if (isNaN(targetId)) {
                        printLine("❌ Kullanım: connect [ID]", "err");
                        printLine("   Örnek: connect 0", "dim");
                        break;
                    }
                    
                    // Önce tarama yapılmış mı kontrol et
                    if (!gameState.hasScanned) {
                        printLine("❌ Önce TARAMA yapmalısın!", "err");
                        printLine("   Kullanım: scan", "warn");
                        break;
                    }
                    
                    // Taranan ağlar içinde mi kontrol et
                    if (!gameState.scannedNetworks.includes(targetId)) {
                        printLine("❌ Bu ağ tarananlar arasında yok!", "err");
                        printLine(`   Mevcut ağlar: ${gameState.scannedNetworks.join(', ')}`, "warn");
                        printLine("   Yeniden taramak için: scan", "dim");
                        break;
                    }
                    
                    const target = networks.find(n => n.id === targetId);
                    
                    if (!target) {
                        printLine(`❌ Geçersiz ağ ID: ${targetId}`, "err");
                        break;
                    }
                    
                    if (target.hacked) {
                        printLine(`⚠️ ${target.name} zaten hacklendi!`, "warn");
                        printLine("   Bu sistemden tekrar veri çekilemez.", "dim");
                        break;
                    }
                    
                    // Hack süreci
                    printLine("", "info");
                    printLine(`🔐 ${target.name} hedef alınıyor...`, "warn");
                    printLine(`   └─ ${target.ssid}`, "dim");
                    printLine(`   └─ Güvenlik: ${target.difficulty}/10 | Ödül: ${target.reward.toFixed(2)} DC`, "dim");
                    
                    // İlerleme göstergesi
                    const steps = [
                        { msg: "Firewall taraması yapılıyor...", delay: 400 },
                        { msg: "Açık portlar belirleniyor...", delay: 300 },
                        { msg: "Exploit hazırlanıyor...", delay: 350 },
                        { msg: "Bağlantı kuruluyor...", delay: 400 }
                    ];
                    
                    let totalDelay = 0;
                    steps.forEach((step, i) => {
                        totalDelay += step.delay;
                        setTimeout(() => {
                            printLine(`   └─ ${step.msg}`, "dim");
                        }, totalDelay);
                    });
                    
                    setTimeout(() => {
                        // Başarı hesapla
                        const baseChance = 0.95 - (target.difficulty * 0.06);
                        const vpnBonus = gameState.vpnEnabled ? 0.15 : 0;
                        const successChance = Math.max(0.15, Math.min(0.98, baseChance + vpnBonus));
                        const success = Math.random() < successChance;
                        
                        if (success) {
                            target.hacked = true;
                            const earned = target.reward;
                            addDC(earned);
                            gameState.xp += earned * 50;
                            gameState.systemsHacked++;
                            
                            // Threat artışı
                            const threatIncrease = target.difficulty * 2;
                            gameState.threatLevel = Math.min(100, gameState.threatLevel + threatIncrease);
                            updateThreatDisplay();
                            
                            printLine("", "info");
                            printLine("╔═══════════════════════════════════════════════════════╗", "success");
                            printLine("║              ✅ HACK BAŞARILI! ✅                     ║", "success");
                            printLine("╚═══════════════════════════════════════════════════════╝", "success");
                            printLine("", "info");
                            printLine(`   🎯 Hedef    : ${target.name}`, "info");
                            printLine(`   💰 Kazanç   : +${earned.toFixed(2)} DC`, "success");
                            printLine(`   ⚡ XP       : +${Math.floor(earned * 50)}`, "info");
                            printLine(`   📈 Yükselen Tehdit: +${threatIncrease}%`, "warn");
                            
                            // Loot bulma şansı
                            if (target.hasLoot && Math.random() < target.lootChance) {
                                const foundLoot = target.loot[Math.floor(Math.random() * target.loot.length)];
                                printLine("", "info");
                                printLine("   🎁 BONUS VERİ BULUNDU!", "warn");
                                printLine(`   📄 ${foundLoot.name}: ${foundLoot.value}`, "info");
                                addKeyToInventory(foundLoot);
                            }
                            
                            playSound('success');
                            updateWalletDisplay();
                            updateLeaderboard();
                        } else {
                            printLine("", "info");
                            printLine("╔═══════════════════════════════════════════════════════╗", "err");
                            printLine("║              ❌ HACK BAŞARISIZ ❌                     ║", "err");
                            printLine("╚═══════════════════════════════════════════════════════╝", "err");
                            printLine("", "info");
                            printLine(`   🔴 Güvenlik engeli aşılamadı!`, "err");
                            printLine(`   📊 Başarı şansı: ${(successChance * 100).toFixed(1)}%`, "dim");
                            
                            // Daha fazla threat artışı başarısız olunca
                            const threatPenalty = target.difficulty * 3;
                            gameState.threatLevel = Math.min(100, gameState.threatLevel + threatPenalty);
                            updateThreatDisplay();
                            printLine(`   ⚠️ Tehdit artışı: +${threatPenalty}% (Başarısız girişim!)`, "err");
                            
                            playSound('error');
                        }
                    }, totalDelay + 500);
                    break;
                    
                // ========== MINING KOMUTU ==========
                case 'mining':
                    if (!subCmd) {
                        printLine("❌ Kullanım: mining -start | mining -stop", "err");
                        printLine("", "info");
                        printLine("   mining -start   - Madenciligi baslat", "success");
                        printLine("   mining -stop    - Madenciligi durdur", "warn");
                        break;
                    }
                    
                    if (subCmd === 'start' || subCmd === '-start') {
                        if (gameState.isMining) {
                            printLine("⚠️ Madencilik zaten aktif!", "warn");
                        } else {
                            startMining();
                            printLine("⛏️ Madencilik başlatıldı!", "success");
                            printLine(`   ⛏️ Güç: ${gameState.miningPower.toFixed(4)} DC/sn`, "info");
                        }
                    } else if (subCmd === 'stop' || subCmd === '-stop') {
                        if (!gameState.isMining) {
                            printLine("⚠️ Madencilik zaten durduruldu!", "warn");
                        } else {
                            stopMining();
                            printLine("⛏️ Madencilik durduruldu.", "warn");
                        }
                    } else {
                        printLine("❌ Bilinmeyen parametre: " + subCmd, "err");
                        printLine("   Kullanım: mining -start | mining -stop", "dim");
                    }
                    break;
                    
                // ========== BOS KOMUT ==========
                case '':
                    break;
                    
                // ========== BILINMEYEN KOMUT ==========
                default:
                    printLine(`❌ Bilinmeyen komut: ${cmd}`, "err");
                    printLine(`   Yardım için 'help' yazın.`, "dim");
            }
            
            // Input alanını temizle
            termInput.value = '';
            if (termOut) termOut.scrollTop = termOut.scrollHeight;
        }
    });
}

// Progress bar oluştur
function createProgressBar(percentage, width) {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

// Satır yazdır
function printLine(text, type = "") {
    if (!termOut) return;
    
    const div = document.createElement('div');
    div.className = `term-line ${type}`;
    div.innerText = text;
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
}
