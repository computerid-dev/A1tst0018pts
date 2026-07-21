// script.js
async function getUserInfo() {
    try {
        const res = await fetch('https://ip-api.com/json/');
        const data = await res.json();
        if (data.status === 'success') {
            document.getElementById('userCountry').textContent = data.country || '-';
        } else {
            document.getElementById('userCountry').textContent = 'Tidak terdeteksi';
        }
    } catch {
        document.getElementById('userCountry').textContent = 'Tidak terdeteksi';
    }

    const ua = navigator.userAgent;
    let device = 'Desktop';
    let brand = '';
    if (/iPhone/i.test(ua)) { device = 'Mobile'; brand = 'iPhone'; }
    else if (/iPad/i.test(ua)) { device = 'Tablet'; brand = 'iPad'; }
    else if (/Samsung|SM-|Galaxy/i.test(ua)) { device = 'Mobile'; brand = 'Samsung'; }
    else if (/Xiaomi|Redmi|POCO/i.test(ua)) { device = 'Mobile'; brand = 'Xiaomi'; }
    else if (/Oppo|Realme|OnePlus/i.test(ua)) { device = 'Mobile'; brand = 'Oppo'; }
    else if (/Vivo|iQOO/i.test(ua)) { device = 'Mobile'; brand = 'Vivo'; }
    else if (/Google Pixel/i.test(ua)) { device = 'Mobile'; brand = 'Google Pixel'; }
    else if (/Nokia/i.test(ua)) { device = 'Mobile'; brand = 'Nokia'; }
    else if (/Huawei|Honor/i.test(ua)) { device = 'Mobile'; brand = 'Huawei'; }
    else if (/ASUS|ZenFone|ROG/i.test(ua)) { device = 'Mobile'; brand = 'ASUS'; }
    else if (/Lenovo|Moto/i.test(ua)) { device = 'Mobile'; brand = 'Lenovo'; }
    else if (/Android/i.test(ua)) { device = 'Mobile'; brand = 'Android'; }
    document.getElementById('userDevice').textContent = brand ? `${brand}` : device;

    let browser = 'Unknown';
    if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
    else if (ua.includes('UCBrowser')) browser = 'UC Browser';
    else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
    document.getElementById('userBrowser').textContent = browser;
    document.getElementById('userStatus').textContent = '● Online';

    if (navigator.getBattery) {
        try {
            const battery = await navigator.getBattery();
            const level = Math.round(battery.level * 100);
            document.getElementById('batteryFill').style.width = level + '%';
            document.getElementById('batteryPercent').textContent = level + '%';
        } catch {}
    }
}
getUserInfo();

const toolsData = {
    downloader: [
        { id: 'instagram', icon: 'fa-brands fa-instagram', name: 'Instagram', desc: 'Download video & foto', badge: 'HD' },
        { id: 'tiktok', icon: 'fa-brands fa-tiktok', name: 'TikTok', desc: 'No watermark', badge: 'MP4' },
        { id: 'youtube', icon: 'fa-brands fa-youtube', name: 'YouTube', desc: 'Video & audio', badge: 'MP4/MP3' }
    ],
    maker: [
        { id: 'iqc', icon: 'fa-solid fa-image', name: 'IQC Generator', desc: 'Buat gambar IQC', badge: 'Custom' },
        { id: 'winquotes', icon: 'fa-brands fa-windows', name: 'Windows Quotes', desc: 'Quote ala Windows', badge: 'Meme' },
        { id: 'tanyaustadz', icon: 'fa-solid fa-user-tie', name: 'Tanya Ustadz', desc: 'Meme generator', badge: 'Lucu' }
    ],
    tools: [
        { id: 'qr', icon: 'fa-solid fa-qrcode', name: 'QR Generator', desc: 'Buat QR code', badge: 'Instant' },
        { id: 'calc', icon: 'fa-solid fa-calculator', name: 'Calculator', desc: 'Hitung cepat', badge: 'Math' },
        { id: 'pwgen', icon: 'fa-solid fa-key', name: 'Password Gen', desc: 'Password aman', badge: 'Secure' },
        { id: 'morse', icon: 'fa-solid fa-broadcast', name: 'Morse Code', desc: 'Konversi morse', badge: 'Audio' },
        { id: 'removebg', icon: 'fa-solid fa-eraser', name: 'Remove BG', desc: 'Hapus background', badge: 'AI' },
        { id: 'enhancer', icon: 'fa-solid fa-magic', name: 'Image Enhancer', desc: 'Tingkatkan kualitas', badge: 'HD' }
    ],
    vault: [
        { id: 'iqcgen', icon: 'fa-solid fa-qrcode', name: 'Iqc Generator', desc: 'QR & barcode tools', link: 'https://iqc-generator-bykz.netlify.app/' },
        { id: 'ttquote', icon: 'fa-brands fa-tiktok', name: 'Tiktok Quote', desc: 'Quote generator', link: 'https://tiktok-quote-chatbykz.netlify.app/' },
        { id: 'qrgen', icon: 'fa-solid fa-cube', name: 'Qr Generator', desc: 'QR code maker', link: 'https://qr-generator-bykz.netlify.app/' }
    ],
    external: [
        { id: 'fakeff', icon: 'fa-solid fa-fire', name: 'Fake FF', desc: 'Free Fire simulator', link: 'https://fakeff.netlify.app/' },
        { id: 'getcode', icon: 'fa-solid fa-code', name: 'Get Code HTML', desc: 'Extract & copy', link: 'https://kaze-extract.netlify.app/' },
        { id: 'zxvai', icon: 'fa-solid fa-robot', name: 'ZxVAI', desc: 'AI tools & APK', link: 'https://zxvaiapk.netlify.app/' },
        { id: 'fotolink', icon: 'fa-solid fa-image', name: 'Foto To Link', desc: 'Upload & share', link: 'https://pixvault-bykz.netlify.app/' }
    ]
};

const allTools = [
    ...toolsData.downloader,
    ...toolsData.maker,
    ...toolsData.tools,
    ...toolsData.vault,
    ...toolsData.external
];

function renderGrid(containerId, items, isExternal = false) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(item => {
        const clickAttr = isExternal || item.link ?
            `onclick="window.open('${item.link || '#'}','_blank')"` :
            `onclick="showTool('${item.id}')"`;
        return `
            <div class="tools-card" ${clickAttr}>
                <div class="icon"><i class="${item.icon}"></i></div>
                <h4>${item.name}</h4>
                <p>${item.desc}</p>
                ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
                <div class="arrow"><i class="fas fa-arrow-right"></i></div>
            </div>
        `;
    }).join('');
}

function renderAll() {
    renderGrid('allGrid', allTools);
    renderGrid('downloaderGrid', toolsData.downloader);
    renderGrid('makerGrid', toolsData.maker);
    renderGrid('toolsGrid', toolsData.tools);
    renderGrid('vaultGrid', toolsData.vault, true);
    renderGrid('externalGrid', toolsData.external, true);
}

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const target = this.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const targetEl = document.getElementById('tab-' + target);
        if (targetEl) targetEl.classList.add('active');
    });
});

function showTool(toolId) {
    const viewer = document.getElementById('toolViewer');
    const body = document.getElementById('toolViewerBody');
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';

    let tool = null;
    for (let cat of ['downloader', 'maker', 'tools']) {
        const found = toolsData[cat].find(t => t.id === toolId);
        if (found) { tool = found; break; }
    }
    if (!tool) { closeTool(); return; }

    switch (toolId) {
        case 'instagram': renderInstagram(body); break;
        case 'tiktok': renderTiktok(body); break;
        case 'youtube': renderYoutube(body); break;
        case 'iqc': renderIqc(body); break;
        case 'winquotes': renderWinquotes(body); break;
        case 'tanyaustadz': renderTanyaUstadz(body); break;
        case 'qr': renderQr(body); break;
        case 'calc': renderCalc(body); break;
        case 'pwgen': renderPwgen(body); break;
        case 'morse': renderMorse(body); break;
        case 'removebg': renderRemovebg(body); break;
        case 'enhancer': renderEnhancer(body); break;
        default: closeTool();
    }
}

function closeTool() {
    document.getElementById('toolViewer').classList.remove('active');
    document.body.style.overflow = 'auto';
}

document.getElementById('toolViewer').addEventListener('click', function(e) {
    if (e.target === this) closeTool();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeTool();
});

function renderInstagram(body) {
    body.innerHTML = `
        <h2><i class="fa-brands fa-instagram"></i> Instagram Downloader</h2>
        <p style="color:#8b7ab8;font-size:13px;margin-bottom:12px;">Download video, Reels, atau foto dari Instagram.</p>
        <input type="text" id="instaUrl" class="v-input" placeholder="Tempel link Instagram...">
        <button class="v-btn" id="instaBtn"><i class="fas fa-download"></i> Ambil Media</button>
        <div id="instaResult"></div>
    `;
    document.getElementById('instaBtn').onclick = async () => {
        const url = document.getElementById('instaUrl').value.trim();
        const target = document.getElementById('instaResult');
        if (!url) return alert('Masukkan link Instagram!');
        target.innerHTML = `<div class="result-box"><i class="fas fa-spinner spin"></i><br>Memproses...</div>`;
        try {
            const res = await fetch(`https://api.nexray.eu.cc/downloader/instagram?url=${encodeURIComponent(url)}`);
            const data = await res.json();
            let dl = data.result?.[0]?.url || data.result?.url || data.url;
            if (dl) {
                target.innerHTML = `
                    <div class="result-box">
                        <video controls style="width:100%;border-radius:8px;" src="${dl}"></video>
                        <br><br>
                        <a href="${dl}" target="_blank" download style="text-decoration:none;">
                            <button class="v-btn" style="background:rgba(168,85,247,0.12);">Download</button>
                        </a>
                    </div>
                `;
            } else {
                target.innerHTML = `<div class="result-box" style="color:#ef4444;">Gagal ambil media.</div>`;
            }
        } catch (e) {
            target.innerHTML = `<div class="result-box" style="color:#ef4444;">Error: ${e.message}</div>`;
        }
    };
}

function renderTiktok(body) {
    body.innerHTML = `
        <h2><i class="fa-brands fa-tiktok"></i> TikTok Downloader</h2>
        <p style="color:#8b7ab8;font-size:13px;margin-bottom:12px;">Download video TikTok tanpa watermark.</p>
        <input type="text" id="ttUrl" class="v-input" placeholder="Tempel link TikTok...">
        <button class="v-btn" id="ttBtn"><i class="fas fa-download"></i> Ekstrak</button>
        <div id="ttResult"></div>
    `;
    document.getElementById('ttBtn').onclick = async () => {
        const url = document.getElementById('ttUrl').value.trim();
        const target = document.getElementById('ttResult');
        if (!url) return alert('Masukkan URL!');
        target.innerHTML = `<div class="result-box"><i class="fas fa-spinner spin"></i> Memproses...</div>`;
        try {
            const res = await fetch('https://api-faa.my.id/faa/tiktok?url=' + encodeURIComponent(url));
            const data = await res.json();
            const video = data?.result?.data || data?.result?.video || data?.result?.url;
            if (video) {
                target.innerHTML = `
                    <div class="result-box">
                        <video controls style="width:100%;border-radius:8px;" src="${video}"></video>
                        <br><br>
                        <a href="${video}" target="_blank" style="text-decoration:none;">
                            <button class="v-btn" style="background:rgba(168,85,247,0.12);">Download</button>
                        </a>
                    </div>
                `;
            } else {
                target.innerHTML = `<div class="result-box">Gagal mengambil video.</div>`;
            }
        } catch (e) {
            target.innerHTML = `<div class="result-box">Error: ${e.message}</div>`;
        }
    };
}

function renderYoutube(body) {
    body.innerHTML = `
        <h2><i class="fa-brands fa-youtube"></i> YouTube Downloader</h2>
        <input type="text" id="ytUrl" class="v-input" placeholder="Tempel URL YouTube...">
        <select id="ytFormat" class="v-select" onchange="document.getElementById('resBox').style.display=this.value==='mp3'?'none':'block'">
            <option value="mp4">Video (MP4)</option>
            <option value="mp3">Audio (MP3)</option>
        </select>
        <div id="resBox">
            <select id="ytRes" class="v-select">
                <option value="360">360p</option>
                <option value="720" selected>720p</option>
                <option value="1080">1080p</option>
            </select>
        </div>
        <button class="v-btn" id="ytBtn"><i class="fas fa-play"></i> Proses</button>
        <div id="ytResult"></div>
    `;
    document.getElementById('ytBtn').onclick = async () => {
        const url = document.getElementById('ytUrl').value.trim();
        const fmt = document.getElementById('ytFormat').value;
        const resSel = document.getElementById('ytRes').value;
        const target = document.getElementById('ytResult');
        if (!url) return alert('Sertakan URL!');
        target.innerHTML = `<div class="result-box"><i class="fas fa-spinner spin"></i> Menghubungkan...</div>`;
        try {
            let apiUrl = fmt === 'mp3' ?
                `https://api.nexray.eu.cc/downloader/v1/ytmp3?url=${encodeURIComponent(url)}` :
                `https://api.nexray.eu.cc/downloader/ytmp4?url=${encodeURIComponent(url)}&resolusi=${resSel}`;
            const res = await fetch(apiUrl);
            const data = await res.json();
            if (data.status && data.result?.url) {
                let dl = data.result.url;
                let title = data.result.title || 'YouTube Media';
                target.innerHTML = `
                    <div class="result-box">
                        <p style="font-size:13px;font-weight:600;">${title}</p>
                        ${fmt === 'mp4' ? `<video controls style="width:100%;border-radius:8px;" src="${dl}"></video>` : `<audio controls style="width:100%;" src="${dl}"></audio>`}
                        <br><br>
                        <a href="${dl}" target="_blank" style="text-decoration:none;">
                            <button class="v-btn" style="background:rgba(168,85,247,0.12);">Download</button>
                        </a>
                    </div>
                `;
            } else {
                target.innerHTML = `<div class="result-box">Gagal memproses link YouTube.</div>`;
            }
        } catch (e) {
            target.innerHTML = `<div class="result-box">Error: ${e.message}</div>`;
        }
    };
}

function renderIqc(body) {
    let selectedProvider = 'Axis';
    let globalIqcBlob = '';
    body.innerHTML = `
        <h2><i class="fas fa-image"></i> IQC Generator</h2>
        <label>Pesan:</label>
        <input type="text" id="iqcText" class="v-input" value="Hai">
        <label>Pilih Operator:</label>
        <div class="provider-buttons">
            <button class="provider-btn active" onclick="window.setIqcProv(this,'Axis')">Axis</button>
            <button class="provider-btn" onclick="window.setIqcProv(this,'Telkomsel')">Telkomsel</button>
            <button class="provider-btn" onclick="window.setIqcProv(this,'Indosat')">Indosat</button>
            <button class="provider-btn" onclick="window.setIqcProv(this,'XL')">XL</button>
            <button class="provider-btn" onclick="window.setIqcProv(this,'Three')">Three</button>
            <button class="provider-btn" onclick="window.setIqcProv(this,'Smartfren')">Smartfren</button>
        </div>
        <div style="display:flex;gap:12px;">
            <div style="flex:1;"><label>Jam:</label><input type="number" id="iqcJam" class="v-input" value="12" min="0" max="23"></div>
            <div style="flex:1;"><label>Baterai (%):</label><input type="number" id="iqcBaterai" class="v-input" value="65" min="0" max="100"></div>
        </div>
        <button class="v-btn" id="iqcGenBtn">Generate</button>
        <div id="iqcResultDiv" style="display:none;">
            <div class="iqc-preview" id="iqcPreviewBox"></div>
            <div class="btn-group">
                <button class="v-btn" id="iqcDlBtn">Download PNG</button>
                <button class="v-btn" id="iqcCopyBtn">Copy URL</button>
            </div>
        </div>
    `;
    window.setIqcProv = (btn, prov) => {
        document.querySelectorAll('.provider-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedProvider = prov;
    };
    document.getElementById('iqcGenBtn').onclick = async () => {
        const text = document.getElementById('iqcText').value.trim() || 'Hai';
        const jam = document.getElementById('iqcJam').value || '12';
        const bat = document.getElementById('iqcBaterai').value || '65';
        const resDiv = document.getElementById('iqcResultDiv');
        const preview = document.getElementById('iqcPreviewBox');
        resDiv.style.display = 'block';
        preview.innerHTML = `<div style="color:#8b7ab8;">Menggambar...</div>`;
        try {
            const res = await fetch(`https://api.nexray.eu.cc/maker/v1/iqc?text=${encodeURIComponent(text)}&provider=${encodeURIComponent(selectedProvider)}&jam=${jam}&baterai=${bat}`);
            if (!res.ok) throw new Error('Server error.');
            const blob = await res.blob();
            if (globalIqcBlob) URL.revokeObjectURL(globalIqcBlob);
            globalIqcBlob = URL.createObjectURL(blob);
            preview.innerHTML = `<img src="${globalIqcBlob}" alt="IQC Result">`;
        } catch (e) {
            preview.innerHTML = `<span style="color:#ef4444;">Gagal: ${e.message}</span>`;
        }
    };
    document.getElementById('iqcDlBtn').onclick = () => { if (globalIqcBlob) { const a = document.createElement('a'); a.href = globalIqcBlob; a.download = `IQC_${Date.now()}.png`; a.click(); } };
    document.getElementById('iqcCopyBtn').onclick = () => { if (globalIqcBlob) { navigator.clipboard.writeText(globalIqcBlob); alert('URL disalin!'); } };
}

function renderWinquotes(body) {
    body.innerHTML = `
        <h2><i class="fa-brands fa-windows"></i> Windows Quotes</h2>
        <p style="color:#8b7ab8;font-size:13px;margin-bottom:12px;">Buat gambar kutipan ala notifikasi Windows.</p>
        <input type="text" id="wqText" class="v-input" placeholder="Masukkan kutipan...">
        <button class="v-btn" id="wqBtn"><i class="fas fa-magic"></i> Buat Gambar</button>
        <div id="wqResult"></div>
    `;
    document.getElementById('wqBtn').onclick = async () => {
        const text = document.getElementById('wqText').value.trim();
        const target = document.getElementById('wqResult');
        if (!text) return alert('Isi teks!');
        target.innerHTML = `<div class="result-box"><i class="fas fa-spinner spin"></i><br>Merender...</div>`;
        try {
            const res = await fetch(`https://api-nanzz.my.id/docs/api/maker/windows-quotes.php?text=${encodeURIComponent(text)}`);
            if (!res.ok) throw new Error('Gagal');
            const blob = await res.blob();
            const imgUrl = URL.createObjectURL(blob);
            target.innerHTML = `
                <div class="result-box">
                    <img src="${imgUrl}" style="width:100%;border-radius:8px;">
                    <br><br>
                    <a href="${imgUrl}" download="win_quotes_${Date.now()}.png" style="text-decoration:none;">
                        <button class="v-btn" style="background:rgba(168,85,247,0.12);">Download</button>
                    </a>
                </div>
            `;
        } catch (e) {
            target.innerHTML = `<div class="result-box" style="color:#ef4444;">Error: ${e.message}</div>`;
        }
    };
}

function renderTanyaUstadz(body) {
    body.innerHTML = `
        <h2><i class="fas fa-user-tie"></i> Meme Tanya Ustadz</h2>
        <p style="color:#8b7ab8;font-size:13px;margin-bottom:12px;">Buat meme kocak Tanya Ustadz.</p>
        <input type="text" id="tuText" class="v-input" placeholder="Masukkan pertanyaan...">
        <button class="v-btn" id="tuBtn"><i class="fas fa-magic"></i> Buat Meme</button>
        <div id="tuResult"></div>
    `;
    document.getElementById('tuBtn').onclick = async () => {
        const text = document.getElementById('tuText').value.trim();
        const target = document.getElementById('tuResult');
        if (!text) return alert('Isi pertanyaan!');
        target.innerHTML = `<div class="result-box"><i class="fas fa-spinner spin"></i><br>Merender...</div>`;
        try {
            const res = await fetch(`https://api-nanzz.my.id/docs/api/maker/tanyaustadz.php?text=${encodeURIComponent(text)}`);
            if (!res.ok) throw new Error('Gagal');
            const blob = await res.blob();
            const imgUrl = URL.createObjectURL(blob);
            target.innerHTML = `
                <div class="result-box">
                    <img src="${imgUrl}" style="width:100%;border-radius:8px;">
                    <br><br>
                    <a href="${imgUrl}" download="meme_ustadz_${Date.now()}.png" style="text-decoration:none;">
                        <button class="v-btn" style="background:rgba(168,85,247,0.12);">Download</button>
                    </a>
                </div>
            `;
        } catch (e) {
            target.innerHTML = `<div class="result-box" style="color:#ef4444;">Error: ${e.message}</div>`;
        }
    };
}

function renderQr(body) {
    body.innerHTML = `
        <h2><i class="fas fa-qrcode"></i> QR Code Generator</h2>
        <input type="text" id="qrText" class="v-input" placeholder="Masukkan teks atau URL...">
        <button class="v-btn" id="qrBtn"><i class="fas fa-qrcode"></i> Buat QR</button>
        <div id="qrResult"></div>
    `;
    document.getElementById('qrBtn').onclick = () => {
        const t = document.getElementById('qrText').value;
        if (!t) return alert('Input kosong!');
        const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(t)}&size=400`;
        document.getElementById('qrResult').innerHTML = `
            <div class="result-box">
                <img src="${qrUrl}" style="width:200px;border-radius:8px;background:white;padding:8px;">
                <br><br>
                <a href="${qrUrl}" download="qr-code.png" target="_blank" style="text-decoration:none;">
                    <button class="v-btn" style="background:rgba(168,85,247,0.12);">Download QR</button>
                </a>
            </div>
        `;
    };
}

function renderCalc(body) {
    body.innerHTML = `
        <h2><i class="fas fa-calculator"></i> Calculator</h2>
        <input type="text" id="calcInput" class="v-input" placeholder="Contoh: (50*2)+20">
        <button class="v-btn" id="calcBtn"><i class="fas fa-equals"></i> Hitung</button>
        <div id="calcResult"></div>
    `;
    document.getElementById('calcBtn').onclick = () => {
        try {
            const val = document.getElementById('calcInput').value;
            const res = Function('"use strict"; return (' + val + ')')();
            document.getElementById('calcResult').innerHTML = `<div class="result-box" style="font-weight:600;font-size:18px;color:#c084fc;">= ${res}</div>`;
        } catch {
            document.getElementById('calcResult').innerHTML = `<div class="result-box" style="color:#ef4444;">Format tidak valid.</div>`;
        }
    };
}

function renderPwgen(body) {
    body.innerHTML = `
        <h2><i class="fas fa-key"></i> Password Generator</h2>
        <label>Panjang: <span id="lengthVal" style="font-weight:bold;color:#c084fc;">14</span></label>
        <input type="range" id="pwLen" min="8" max="32" value="14" style="width:100%;margin:10px 0;accent-color:#7c3aed;" oninput="document.getElementById('lengthVal').innerText=this.value">
        <button class="v-btn" id="genPwBtn"><i class="fas fa-shield-alt"></i> Generate</button>
        <div id="pwResult"></div>
    `;
    document.getElementById('genPwBtn').onclick = () => {
        const len = parseInt(document.getElementById('pwLen').value);
        const pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let out = "";
        for (let i = 0; i < len; i++) out += pool.charAt(Math.floor(Math.random() * pool.length));
        document.getElementById('pwResult').innerHTML = `
            <div class="result-box">
                <input type="text" class="v-input" readonly value="${out}" style="text-align:center;font-family:monospace;font-size:16px;background:rgba(168,85,247,0.04);">
                <button class="v-btn" onclick="navigator.clipboard.writeText('${out}'); alert('Disalin!');" style="margin-top:8px;background:rgba(168,85,247,0.12);">Salin</button>
            </div>
        `;
    };
}

function renderMorse(body) {
    body.innerHTML = `
        <h2><i class="fas fa-broadcast"></i> Morse Converter</h2>
        <p style="color:#8b7ab8;font-size:13px;margin-bottom:12px;">Konversi teks ke sandi morse atau sebaliknya.</p>
        <select id="morseMode" class="v-select">
            <option value="t2m">Teks ➔ Morse</option>
            <option value="m2t">Morse ➔ Teks</option>
        </select>
        <textarea id="morseIn" class="v-textarea" style="height:80px;resize:none;" placeholder="Ketik di sini..."></textarea>
        <button class="v-btn" id="morseBtn"><i class="fas fa-exchange-alt"></i> Konversi</button>
        <div id="morseResult"></div>
    `;
    const dict = { 'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/' };
    const rev = {}; for (let k in dict) rev[dict[k]] = k;
    document.getElementById('morseBtn').onclick = () => {
        const mode = document.getElementById('morseMode').value;
        const val = document.getElementById('morseIn').value.trim().toUpperCase();
        let out = '';
        if (!val) return alert('Masukkan teks atau morse!');
        if (mode === 't2m') { let arr = []; for (let c of val) { if (dict[c]) arr.push(dict[c]); } out = arr.join(' '); }
        else { let tokens = val.split(' '); for (let t of tokens) { if (rev[t]) out += rev[t]; else if (t === '') out += ' '; } }
        document.getElementById('morseResult').innerHTML = `
            <div class="result-box">
                <p style="font-size:12px;color:#8b7ab8;">Hasil:</p>
                <p style="font-family:monospace;font-size:18px;margin-top:5px;font-weight:600;word-break:break-all;letter-spacing:2px;color:#c084fc;">${out}</p>
                ${mode === 't2m' ? `<button class="v-btn" onclick="playMorse('${out}')" style="margin-top:10px;width:auto;padding:6px 16px;font-size:12px;background:rgba(168,85,247,0.08);"><i class="fas fa-volume-up"></i> Putar</button>` : ''}
            </div>
        `;
    };
    window.playMorse = (morseCode) => {
        const ctx = new(window.AudioContext || window.webkitAudioContext)();
        let time = ctx.currentTime;
        const dot = 0.1, dash = dot * 3;
        morseCode.split('').forEach(char => {
            if (char === '.' || char === '-') {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, time);
                const dur = char === '.' ? dot : dash;
                osc.connect(gain);
                gain.connect(ctx.destination);
                gain.gain.setValueAtTime(0.15, time);
                gain.gain.setValueAtTime(0.15, time + dur);
                gain.gain.setTargetAtTime(0, time + dur, 0.01);
                osc.start(time);
                osc.stop(time + dur + 0.05);
                time += dur + dot;
            } else if (char === ' ') time += dash;
            else if (char === '/') time += dot * 7;
        });
    };
}

function renderRemovebg(body) {
    body.innerHTML = `
        <h2><i class="fas fa-eraser"></i> Remove Background</h2>
        <p style="color:#8b7ab8;font-size:13px;margin-bottom:12px;">Masukkan URL atau upload gambar.</p>
        <input type="text" id="removebgUrl" class="v-input" placeholder="URL Gambar (opsional)">
        <input type="file" id="removebgFile" accept="image/*" style="display:none">
        <label for="removebgFile" style="display:flex;justify-content:center;align-items:center;gap:8px;width:100%;padding:12px;margin:10px 0;background:rgba(168,85,247,0.04);border:1px solid rgba(168,85,247,0.06);border-radius:14px;cursor:pointer;font-size:13px;color:#8b7ab8;">
            <i class="fas fa-upload"></i> <span id="uploadText">Pilih Gambar</span>
        </label>
        <div id="fileName" style="text-align:center;color:#6a5a8a;font-size:12px;margin-bottom:12px;">Belum ada file</div>
        <button class="v-btn" id="removebgBtn"><i class="fas fa-magic"></i> Remove BG</button>
        <div id="removebgResult"></div>
    `;
    const fileInput = document.getElementById('removebgFile');
    fileInput.onchange = () => {
        const file = fileInput.files[0];
        document.getElementById('uploadText').textContent = file ? 'Ganti Gambar' : 'Pilih Gambar';
        document.getElementById('fileName').textContent = file ? file.name : 'Belum ada file';
    };
    document.getElementById('removebgBtn').onclick = async () => {
        const url = document.getElementById('removebgUrl').value.trim();
        const file = fileInput.files[0];
        const result = document.getElementById('removebgResult');
        if (!url && !file) return alert('Masukkan URL atau upload gambar!');
        result.innerHTML = `<div class="result-box"><i class="fas fa-spinner spin"></i><br>Memproses...</div>`;
        try {
            let img;
            if (url) img = 'https://api-nanzz.my.id/docs/api/tools/image/removebg.php?url=' + encodeURIComponent(url);
            else { const form = new FormData(); form.append('file', file); const res = await fetch('https://api-nanzz.my.id/docs/api/tools/image/removebg.php', { method: 'POST', body: form }); const blob = await res.blob(); img = URL.createObjectURL(blob); }
            result.innerHTML = `
                <div class="result-box">
                    <img src="${img}" style="width:100%;border-radius:8px;margin-bottom:12px;">
                    <a href="${img}" download="removebg.png" style="text-decoration:none;">
                        <button class="v-btn" style="background:rgba(168,85,247,0.12);">Download PNG</button>
                    </a>
                </div>
            `;
        } catch { result.innerHTML = `<div class="result-box">Gagal memproses gambar.</div>`; }
    };
}

function renderEnhancer(body) {
    body.innerHTML = `
        <h2><i class="fas fa-magic"></i> Image Enhancer</h2>
        <p style="color:#8b7ab8;font-size:13px;margin-bottom:12px;">Masukkan URL atau upload gambar.</p>
        <input type="text" id="enhancerUrl" class="v-input" placeholder="URL Gambar (opsional)">
        <input type="file" id="enhancerFile" accept="image/*" style="display:none">
        <label for="enhancerFile" style="display:flex;justify-content:center;align-items:center;gap:8px;width:100%;padding:12px;margin:10px 0;background:rgba(168,85,247,0.04);border:1px solid rgba(168,85,247,0.06);border-radius:14px;cursor:pointer;font-size:13px;color:#8b7ab8;">
            <i class="fas fa-upload"></i> <span id="enhancerUploadText">Pilih Gambar</span>
        </label>
        <div id="enhancerFileName" style="text-align:center;color:#6a5a8a;font-size:12px;margin-bottom:12px;">Belum ada file</div>
        <button class="v-btn" id="enhancerBtn"><i class="fas fa-magic"></i> Enhance</button>
        <div id="enhancerResult"></div>
    `;
    const fileInput = document.getElementById('enhancerFile');
    fileInput.onchange = () => {
        const file = fileInput.files[0];
        document.getElementById('enhancerUploadText').textContent = file ? 'Ganti Gambar' : 'Pilih Gambar';
        document.getElementById('enhancerFileName').textContent = file ? file.name : 'Belum ada file';
    };
    document.getElementById('enhancerBtn').onclick = async () => {
        const url = document.getElementById('enhancerUrl').value.trim();
        const file = fileInput.files[0];
        const result = document.getElementById('enhancerResult');
        if (!url && !file) return alert('Masukkan URL atau upload gambar!');
        result.innerHTML = `<div class="result-box"><i class="fas fa-spinner spin"></i><br>Memproses...</div>`;
        try {
            let img;
            if (url) img = 'https://api-nanzz.my.id/docs/api/tools/image/enhancer.php?url=' + encodeURIComponent(url);
            else { const form = new FormData(); form.append('file', file); const res = await fetch('https://api-nanzz.my.id/docs/api/tools/image/enhancer.php', { method: 'POST', body: form }); const blob = await res.blob(); img = URL.createObjectURL(blob); }
            result.innerHTML = `
                <div class="result-box">
                    <img src="${img}" style="width:100%;border-radius:8px;margin-bottom:12px;">
                    <a href="${img}" download="enhanced-image.png" style="text-decoration:none;">
                        <button class="v-btn" style="background:rgba(168,85,247,0.12);">Download HD</button>
                    </a>
                </div>
            `;
        } catch { result.innerHTML = `<div class="result-box">Gagal meningkatkan kualitas gambar.</div>`; }
    };
}

renderAll();