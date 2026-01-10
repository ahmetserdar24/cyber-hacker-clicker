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
            
            printLine(`> ${val}`, "user-cmd");

            switch(cmd) {
                case 'help':
                    printLine("Komutlar:", "info");
                    printLine("  help        - Bu menuyu gosterir", "info");
                    printLine("  clear       - Ekrani temizler", "info");
                    printLine("  status      - Durumunu gosterir", "info");
                    printLine("  hack        - Manuel hack yap", "info");
                    printLine("  scan        - Aglari tarar", "info");
                    printLine("  networks    - Aglari listeler", "info");
                    printLine("  connect [id]- Aga baglan", "info");
                    printLine("  mine        - Mining ac/kapa", "info");
                    printLine("  power       - Gucu goster", "info");
                    printLine("  rank        - Rutbe goster", "info");
                    printLine("  xp          - XP durumu", "info");
                    printLine("  stats       - Istatistikler", "info");
                    printLine("  save        - Oyunu kaydet", "info");
                    printLine("  reboot      - Yeniden baslat", "info");
                    break;
                    
                case 'clear':
                    termOut.innerHTML = '';
                    printLine("Ekran temizlendi.", "success");
                    break;
                    
                case 'status':
                    printLine("═══════════════════════════════════", "info");
                    printLine(`💰 Cuzdan: ${gameState.wallet.toFixed(4)} DC`, "success");
                    printLine(`⚡ XP: ${Math.floor(gameState.xp)} / ${getNextLevelXp()}`, "info");
                    printLine(`📊 Seviye: ${gameState.level}`, "info");
                    printLine(`🏆 Rutbe: ${gameState.rank}`, "warn");
                    printLine(`☢️ Tıklama Gucu: ${gameState.clickPower.toFixed(4)} DC`, "info");
                    printLine(`⛏️ Mining Gucu: ${gameState.miningPower.toFixed(4)}/sn`, "info");
                    printLine(`🎯 Kritik Sans: ${(gameState.criticalChance * 100).toFixed(1)}%`, "info");
                    printLine(`⚠️ Tehdit: ${gameState.threatLevel.toFixed(1)}%`, gameState.threatLevel > 50 ? 'err' : 'success');
                    printLine('═══════════════════════════════════', "info");
                    break;
                    
                case 'hack':
                    performHack();
                    printLine("Hack islemi basarili!", "success");
                    break;
                    
                case 'scan':
                case 'networks':
                    printLine("Ag taramasi baslatiliyor...", "warn");
                    
                    setTimeout(() => {
                        printLine("═══════════════════════════════════", "info");
                        printLine("📡 BULUNAN AGLAR:", "info");
                        
                        networks.forEach((net, index) => {
                            const status = net.hacked ? '[HACKED]' : '';
                            printLine(`[${index}] ${net.name} ${status}`, "info");
                            printLine(`    Sinyal: ${net.signal}% | Zorluk: ${net.difficulty}`, "info");
                            printLine(`    Odul: ${net.reward} DC`, "success");
                        });
                        
                        printLine("═══════════════════════════════════", "info");
                        printLine("Baglanmak icin: connect [id]", "info");
                    }, 800);
                    break;
                    
                case 'connect':
                    const targetId = parseInt(args[1]);
                    
                    if (isNaN(targetId)) {
                        printLine("Kullanım: connect [id]", "err");
                        break;
                    }
                    
                    const target = networks.find(n => n.id === targetId);
                    
                    if (target) {
                        if (target.hacked) {
                            printLine(`Bu sistem zaten hacklendi!`, "warn");
                        } else {
                            printLine(`${target.name}'e siziliyor...`, "warn");
                            
                            setTimeout(() => {
                                const successChance = Math.min(0.95, 0.4 + (1 / target.difficulty) * 0.3);
                                const success = Math.random() < successChance;
                                
                                if (success) {
                                    target.hacked = true;
                                    const earned = target.reward;
                                    gameState.wallet += earned;
                                    gameState.totalEarned += earned;
                                    gameState.xp += earned * 50;
                                    gameState.systemsHacked++;
                                    
                                    printLine("═══════════════════════════════════", "success");
                                    printLine(`✅ BASARILI! +${earned} DC`, "success");
                                    printLine(`XP: +${Math.floor(earned * 50)}`, "success");
                                    printLine("═══════════════════════════════════", "success");
                                    
                                    playSound('success');
                                    updateWalletDisplay();
                                } else {
                                    printLine("═══════════════════════════════════", "err");
                                    printLine("❌ BASARISIZ! Guvenlik duvari.", "err");
                                    gameState.threatLevel = Math.min(100, gameState.threatLevel + 5);
                                    printLine(`Tehdit: ${gameState.threatLevel.toFixed(1)}%`, "warn");
                                    printLine("═══════════════════════════════════", "err");
                                    
                                    playSound('error');
                                }
                            }, 2000);
                        }
                    } else {
                        printLine("Gecersiz ağ ID!", "err");
                    }
                    break;
                    
                case 'mine':
                    if (gameState.isMining) {
                        stopMining();
                        printLine("Madencilik durduruldu.", "warn");
                    } else {
                        startMining();
                        printLine("Madencilik basladi!", "success");
                    }
                    break;
                    
                case 'power':
                    printLine("═══════════════════════════════════", "info");
                    printLine("⚡ GUC ISTATISTIKLERI", "info");
                    printLine(`Tıklama Gucu: ${gameState.clickPower.toFixed(4)} DC`, "info");
                    printLine(`Mining Gucu: ${gameState.miningPower.toFixed(4)}/sn`, "info");
                    printLine(`Kritik Sans: ${(gameState.criticalChance * 100).toFixed(1)}%`, "info");
                    printLine("═══════════════════════════════════", "info");
                    break;
                    
                case 'rank':
                    printLine("═══════════════════════════════════", "info");
                    printLine(`🏆 RUTBE: ${gameState.rank}`, "warn");
                    printLine(`📊 SEVIYE: ${gameState.level}`, "info");
                    printLine(`⚡ XP: ${Math.floor(gameState.xp)} / ${getNextLevelXp()}`, "info");
                    printLine("═══════════════════════════════════", "info");
                    break;
                    
                case 'xp':
                    printLine("═══════════════════════════════════", "info");
                    printLine(`⚡ MEVCUT XP: ${Math.floor(gameState.xp)}`, "info");
                    printLine(`📊 GEREKLI XP: ${getNextLevelXp()}`, "info");
                    printLine(`📈 ILERLEME: ${((gameState.xp / getNextLevelXp()) * 100).toFixed(1)}%`, "info");
                    printLine("═══════════════════════════════════", "info");
                    break;
                    
                case 'stats':
                    printLine("═══════════════════════════════════", "info");
                    printLine("📊 DETAYLI ISTATISTIKLER", "info");
                    printLine(`💰 Bakiye: ${gameState.wallet.toFixed(4)} DC`, "success");
                    printLine(`💵 Toplam Kazanc: ${gameState.totalEarned.toFixed(4)} DC`, "info");
                    printLine(`☢️ Hack Sayisi: ${gameState.totalHacks}`, "info");
                    printLine(`🎯 Sistem Hacklendi: ${gameState.systemsHacked}`, "info");
                    printLine(`⚠️ Max Tehdit: ${gameState.maxThreat.toFixed(1)}%`, "info");
                    printLine(`⏱️ Oyun Suresi: ${formatTime(gameState.playTime)}`, "info");
                    printLine("═══════════════════════════════════", "info");
                    break;
                    
                case 'save':
                    saveGame();
                    break;
                    
                case 'reboot':
                    if (confirm('Sistem yeniden baslatilicak. Emin misiniz?')) {
                        location.reload();
                    }
                    break;
                    
                case '':
                    break;
                    
                default:
                    printLine(`Bilinmeyen komut: ${cmd}. Yardim icin 'help' yaz.`, "err");
            }
            
            termInput.value = '';
            if (termOut) termOut.scrollTop = termOut.scrollHeight;
        }
    });
}

function printLine(text, type = "") {
    if (!termOut) return;
    
    const div = document.createElement('div');
    div.className = `term-line ${type}`;
    div.innerText = text;
    termOut.appendChild(div);
    termOut.scrollTop = termOut.scrollHeight;
}
