// ===== State =====
const openWindows = {};
let highestZ = 10;
let dragData = null;

// ===== Boot Sequence =====
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('bootScreen').classList.add('hidden');
        document.getElementById('desktop').classList.add('visible');
        document.getElementById('taskbar').classList.add('visible');
    }, 3000);

    updateClock();
    setInterval(updateClock, 1000);
    updateGreeting();
});

// ===== Clock & Date =====
function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('trayClock').textContent = h + ':' + m;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    document.getElementById('trayDate').textContent = day + ' ' + date + ' ' + month;
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting;
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    document.getElementById('smGreeting').textContent = greeting + ', Shahzod!';
}

// ===== Window Management =====
function openWindow(name) {
    const win = document.getElementById('window-' + name);
    if (!win) return;

    if (openWindows[name] && openWindows[name].minimized) {
        win.style.display = 'flex';
        win.classList.add('open');
        openWindows[name].minimized = false;
        focusWindow(name);
        updateTaskbar();
        return;
    }

    if (openWindows[name]) {
        focusWindow(name);
        return;
    }

    const offset = Object.keys(openWindows).length * 30;
    win.style.top = (50 + offset) + 'px';
    win.style.left = (140 + offset) + 'px';

    win.classList.add('open');
    openWindows[name] = { minimized: false, maximized: false };
    focusWindow(name);
    updateTaskbar();
}

function closeWindow(name) {
    const win = document.getElementById('window-' + name);
    if (!win) return;
    win.classList.remove('open', 'focused', 'maximized');
    win.style.display = 'none';
    delete openWindows[name];
    updateTaskbar();
}

function minimizeWindow(name) {
    const win = document.getElementById('window-' + name);
    if (!win) return;
    win.classList.remove('open', 'focused');
    win.style.display = 'none';
    if (openWindows[name]) openWindows[name].minimized = true;
    updateTaskbar();
}

function maximizeWindow(name) {
    const win = document.getElementById('window-' + name);
    if (!win) return;
    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        if (openWindows[name]) openWindows[name].maximized = false;
    } else {
        win.classList.add('maximized');
        if (openWindows[name]) openWindows[name].maximized = true;
    }
    focusWindow(name);
}

function focusWindow(name) {
    document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
    const win = document.getElementById('window-' + name);
    if (win) {
        highestZ++;
        win.style.zIndex = highestZ;
        win.classList.add('focused');
    }
    updateTaskbar();
}

// ===== Taskbar =====
function updateTaskbar() {
    const container = document.getElementById('taskbarItems');
    container.innerHTML = '';

    const titleMap = {
        about: 'About Me',
        projects: 'My Projects',
        skills: 'Skills',
        contact: 'Contact',
        resume: 'Resume.txt',
        music: 'Music Player',
        gallery: 'Pictures',
        csgo: 'CS 1.6'
    };

    for (const name in openWindows) {
        const item = document.createElement('div');
        item.className = 'taskbar-item';
        const win = document.getElementById('window-' + name);
        if (win && win.classList.contains('focused') && !openWindows[name].minimized) {
            item.classList.add('active');
        }

        item.textContent = titleMap[name] || name;

        item.onclick = () => {
            if (openWindows[name] && openWindows[name].minimized) {
                openWindow(name);
            } else {
                const w = document.getElementById('window-' + name);
                if (w && w.classList.contains('focused')) {
                    minimizeWindow(name);
                } else {
                    focusWindow(name);
                    w.style.display = 'flex';
                    w.classList.add('open');
                }
            }
        };

        container.appendChild(item);
    }
}

// ===== Dragging =====
function startDrag(e, windowId) {
    if (e.target.closest('.window-controls')) return;
    const win = document.getElementById(windowId);
    if (!win || win.classList.contains('maximized')) return;

    const name = windowId.replace('window-', '');
    focusWindow(name);

    dragData = {
        win: win,
        startX: e.clientX - win.offsetLeft,
        startY: e.clientY - win.offsetTop
    };
    e.preventDefault();
}

document.addEventListener('mousemove', (e) => {
    if (!dragData) return;
    dragData.win.style.left = Math.max(0, e.clientX - dragData.startX) + 'px';
    dragData.win.style.top = Math.max(0, e.clientY - dragData.startY) + 'px';
});

document.addEventListener('mouseup', () => { dragData = null; });

document.addEventListener('mousedown', (e) => {
    const win = e.target.closest('.window');
    if (win && win.id) focusWindow(win.id.replace('window-', ''));
});

// ===== Start Menu =====
function toggleStartMenu() {
    document.getElementById('startMenu').classList.toggle('open');
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('startMenu');
    const btn = document.getElementById('startBtn');
    if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove('open');
    }
});

// ===== Projects =====
const projects = [
    {
        name: 'Multilevel',
        desc: 'Multilevel marketing platformasi. Ko\'p bosqichli tizim bilan ishlash imkoniyati.',
        tags: ['Web', 'Platform'],
        github: '#', demo: '#',
        images: [
            'projects/Multilevel/multilevel-1.png',
            'projects/Multilevel/multilevel-2.png',
            'projects/Multilevel/multilevel-3.png',
            'projects/Multilevel/multilevel-4.png',
            'projects/Multilevel/multilevel-5.png',
            'projects/Multilevel/multilevel-6.png'
        ]
    },
    {
        name: 'IELTS Peak',
        desc: 'IELTS imtihoniga tayyorlanish platformasi. Speaking, Writing, Reading va Listening bo\'limlari.',
        tags: ['Education', 'IELTS', 'Platform'],
        github: '#', demo: '#',
        images: [
            'projects/ieltspeak/ieltspeak-1.png',
            'projects/ieltspeak/ieltspeak-2.png',
            'projects/ieltspeak/ieltspeak-3.png',
            'projects/ieltspeak/ieltspeak-4.png',
            'projects/ieltspeak/ieltspeak-5.png',
            'projects/ieltspeak/ieltspeak-6.png',
            'projects/ieltspeak/ieltspeak-7.png'
        ]
    },
    {
        name: 'Identify',
        desc: 'Identifikatsiya va autentifikatsiya tizimi. Foydalanuvchilarni aniqlash va tasdiqlash.',
        tags: ['Auth', 'Security'],
        github: '#', demo: '#',
        images: [
            'projects/identify/identify-1.png',
            'projects/identify/identify-2.png',
            'projects/identify/identify-3.png',
            'projects/identify/identify-photo-1.jpg',
            'projects/identify/identify-photo-2.jpg',
            'projects/identify/identify-photo-3.jpg'
        ]
    },
    {
        name: 'AutPlatform',
        desc: 'Avtomatlashtirish platformasi. Jarayonlarni avtomatlashtirish va boshqarish tizimi.',
        tags: ['Automation', 'Platform'],
        github: '#', demo: '#',
        images: [
            'projects/autplatform/autplatform-1.png',
            'projects/autplatform/autplatform-2.png',
            'projects/autplatform/autplatform-3.png',
            'projects/autplatform/autplatform-4.png'
        ]
    }
];

function openProjectDetail(i) {
    const p = projects[i];
    if (!p) return;
    let imagesHtml = '';
    if (p.images && p.images.length > 0) {
        imagesHtml = '<div class="project-images">' +
            p.images.map(src => '<img src="' + src + '" alt="' + p.name + '" onclick="window.open(this.src)">').join('') +
            '</div>';
    }
    document.getElementById('detailContent').innerHTML =
        '<h3>' + p.name + '</h3>' +
        '<p>' + p.desc + '</p>' +
        '<div class="detail-tags">' + p.tags.map(t => '<span>' + t + '</span>').join('') + '</div>' +
        imagesHtml +
        '<div class="detail-links"><a href="' + p.github + '" target="_blank">View Code</a><a href="' + p.demo + '" target="_blank">Live Demo</a></div>';
    document.getElementById('projectDetail').classList.add('show');
}

function closeProjectDetail() {
    document.getElementById('projectDetail').classList.remove('show');
}

// ===== Music Player =====
const musicPlaylist = [
    { title: 'Track 1', src: 'music/track1.mp3' },
    { title: 'Track 2', src: 'music/track2.mp3' },
    { title: 'Track 3', src: 'music/track3.mp3' },
];

let musicAudio = new Audio();
let musicCurrentIndex = -1;
let musicIsPlaying = false;

function musicInit() {
    const itemsEl = document.getElementById('playlistItems');
    if (musicPlaylist.length === 0) return;
    itemsEl.innerHTML = '';
    musicPlaylist.forEach((track, i) => {
        const div = document.createElement('div');
        div.className = 'playlist-item';
        div.innerHTML = '<span class="playlist-item-num">' + (i + 1) + '</span>' + track.title;
        div.onclick = () => musicPlayTrack(i);
        itemsEl.appendChild(div);
    });
}

function musicPlayTrack(index) {
    if (musicPlaylist.length === 0) return;
    musicCurrentIndex = index;
    const track = musicPlaylist[index];
    musicAudio.src = track.src;
    musicAudio.play();
    musicIsPlaying = true;
    document.getElementById('musicPlayBtn').textContent = '⏸';
    document.getElementById('musicTrackName').textContent = track.title;
    document.querySelector('.music-player').classList.add('playing');
    musicUpdatePlaylistUI();
}

function musicTogglePlay() {
    if (musicPlaylist.length === 0) return;
    if (musicCurrentIndex === -1) { musicPlayTrack(0); return; }
    if (musicIsPlaying) {
        musicAudio.pause();
        musicIsPlaying = false;
        document.getElementById('musicPlayBtn').textContent = '▶';
        document.querySelector('.music-player').classList.remove('playing');
    } else {
        musicAudio.play();
        musicIsPlaying = true;
        document.getElementById('musicPlayBtn').textContent = '⏸';
        document.querySelector('.music-player').classList.add('playing');
    }
}

function musicNext() {
    if (musicPlaylist.length === 0) return;
    const next = (musicCurrentIndex + 1) % musicPlaylist.length;
    musicPlayTrack(next);
}

function musicPrev() {
    if (musicPlaylist.length === 0) return;
    const prev = musicCurrentIndex <= 0 ? musicPlaylist.length - 1 : musicCurrentIndex - 1;
    musicPlayTrack(prev);
}

function musicSetVolume(val) {
    musicAudio.volume = val / 100;
}

function musicUpdatePlaylistUI() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, i) => {
        item.classList.toggle('active', i === musicCurrentIndex);
    });
}

function formatTime(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return m + ':' + s;
}

musicAudio.addEventListener('timeupdate', () => {
    const fill = document.getElementById('musicProgressFill');
    const cur = document.getElementById('musicCurrentTime');
    const dur = document.getElementById('musicDuration');
    if (musicAudio.duration) {
        fill.style.width = (musicAudio.currentTime / musicAudio.duration * 100) + '%';
        cur.textContent = formatTime(musicAudio.currentTime);
        dur.textContent = formatTime(musicAudio.duration);
    }
});

musicAudio.addEventListener('ended', () => musicNext());

document.getElementById('musicProgress').addEventListener('click', (e) => {
    if (!musicAudio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    musicAudio.currentTime = pct * musicAudio.duration;
});

musicAudio.volume = 0.8;
musicInit();

// ===== Photo Gallery =====
const galleryImages = [
    { src: 'images/study.jpg', name: 'Study' },
    { src: 'images/presentation.jpg', name: 'Presentation' },
    { src: 'images/friends.jpg', name: 'Friends' },
    { src: 'images/chill.jpg', name: 'Chill' },
];

let galleryCurrentIndex = 0;
let galleryZoom = 1;
let gallerySlideshowTimer = null;

function galleryInit() {
    const strip = document.getElementById('galleryThumbstrip');
    if (galleryImages.length === 0) return;
    document.getElementById('galleryEmpty').style.display = 'none';
    document.getElementById('galleryMainImg').style.display = 'block';
    strip.innerHTML = '';
    galleryImages.forEach((img, i) => {
        const thumb = document.createElement('img');
        thumb.className = 'gallery-thumb';
        thumb.src = img.src;
        thumb.alt = img.name;
        thumb.onclick = () => galleryShowImage(i);
        strip.appendChild(thumb);
    });
    galleryShowImage(0);
}

function galleryShowImage(index) {
    if (galleryImages.length === 0) return;
    galleryCurrentIndex = index;
    galleryZoom = 1;
    const img = galleryImages[index];
    const mainImg = document.getElementById('galleryMainImg');
    mainImg.src = img.src;
    mainImg.style.transform = 'scale(1)';
    document.getElementById('galleryFileName').textContent = img.name;
    document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });
}

function galleryNext() {
    if (galleryImages.length === 0) return;
    galleryShowImage((galleryCurrentIndex + 1) % galleryImages.length);
}

function galleryPrev() {
    if (galleryImages.length === 0) return;
    galleryShowImage(galleryCurrentIndex <= 0 ? galleryImages.length - 1 : galleryCurrentIndex - 1);
}

function galleryZoomIn() {
    galleryZoom = Math.min(galleryZoom + 0.25, 3);
    document.getElementById('galleryMainImg').style.transform = 'scale(' + galleryZoom + ')';
}

function galleryZoomOut() {
    galleryZoom = Math.max(galleryZoom - 0.25, 0.5);
    document.getElementById('galleryMainImg').style.transform = 'scale(' + galleryZoom + ')';
}

function galleryResetZoom() {
    galleryZoom = 1;
    document.getElementById('galleryMainImg').style.transform = 'scale(1)';
}

function gallerySlideshow() {
    if (galleryImages.length === 0) return;
    if (gallerySlideshowTimer) {
        clearInterval(gallerySlideshowTimer);
        gallerySlideshowTimer = null;
        document.getElementById('slideshowBtn').textContent = '▶';
    } else {
        gallerySlideshowTimer = setInterval(() => galleryNext(), 3000);
        document.getElementById('slideshowBtn').textContent = '⏹';
    }
}

galleryInit();

// ===== CS 1.6 Aim Trainer =====
let csGame = null;

function csStartGame() {
    const canvas = document.getElementById('csCanvas');
    const menu = document.getElementById('csMenu');
    const hud = document.getElementById('csHud');
    menu.style.display = 'none';
    canvas.style.display = 'block';
    hud.style.display = 'flex';

    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    function resize() {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight - 40;
    }
    resize();

    const state = {
        kills: 0,
        ammo: 30,
        hp: 100,
        armor: 100,
        money: 800,
        timeLeft: 30,
        round: 1,
        enemies: [],
        particles: [],
        muzzleFlash: 0,
        running: true,
        best: csGame ? csGame.best : 0,
        mouseX: 0,
        mouseY: 0
    };

    // Spawn enemy
    function spawnEnemy() {
        const size = 30 + Math.random() * 20;
        const speed = 0.3 + Math.random() * 0.7 + state.round * 0.1;
        const fromLeft = Math.random() > 0.5;
        state.enemies.push({
            x: fromLeft ? -size : canvas.width + size,
            y: 40 + Math.random() * (canvas.height - 120),
            w: size,
            h: size * 1.8,
            speed: fromLeft ? speed : -speed,
            alive: true,
            deathTimer: 0,
            type: Math.floor(Math.random() * 3) // 0=terrorist, 1=CT, 2=sniper
        });
    }

    // Draw background (de_dust2 style)
    function drawBg() {
        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.35);
        skyGrad.addColorStop(0, '#87a5c4');
        skyGrad.addColorStop(1, '#c4b99a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.35);

        // Walls
        ctx.fillStyle = '#b89f7a';
        ctx.fillRect(0, canvas.height * 0.35, canvas.width, canvas.height * 0.65);

        // Wall details
        ctx.fillStyle = '#a08860';
        for (let i = 0; i < canvas.width; i += 80) {
            ctx.fillRect(i, canvas.height * 0.35, 2, canvas.height * 0.65);
        }
        // Ground
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        ctx.fillStyle = '#7a6548';
        ctx.fillRect(0, canvas.height - 62, canvas.width, 3);

        // Boxes/crates
        ctx.fillStyle = '#6d5a3a';
        ctx.fillRect(30, canvas.height - 110, 60, 50);
        ctx.strokeStyle = '#4a3d28';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, canvas.height - 110, 60, 50);
        ctx.beginPath();
        ctx.moveTo(30, canvas.height - 110);
        ctx.lineTo(90, canvas.height - 60);
        ctx.moveTo(90, canvas.height - 110);
        ctx.lineTo(30, canvas.height - 60);
        ctx.stroke();

        ctx.fillStyle = '#6d5a3a';
        ctx.fillRect(canvas.width - 120, canvas.height - 130, 70, 70);
        ctx.strokeRect(canvas.width - 120, canvas.height - 130, 70, 70);
        ctx.fillRect(canvas.width - 110, canvas.height - 175, 50, 45);
        ctx.strokeRect(canvas.width - 110, canvas.height - 175, 50, 45);

        // Arch/door in middle
        ctx.fillStyle = '#3d3222';
        ctx.fillRect(canvas.width / 2 - 40, canvas.height * 0.35, 80, canvas.height * 0.3);
        ctx.fillStyle = '#2a2218';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height * 0.35 + canvas.height * 0.3, 40, Math.PI, 0);
        ctx.fill();
    }

    // Draw enemy (CT/T stick figure with CS 1.6 style)
    function drawEnemy(e) {
        const cx = e.x + e.w / 2;
        const headR = e.w * 0.3;
        const bodyTop = e.y + headR * 2;
        const bodyBot = e.y + e.h * 0.65;

        if (!e.alive) {
            ctx.globalAlpha = Math.max(0, 1 - e.deathTimer / 30);
            // death - fall over
            ctx.save();
            ctx.translate(cx, e.y + e.h);
            ctx.rotate(e.deathTimer * 0.05);
            ctx.translate(-cx, -(e.y + e.h));
        }

        // Body
        const colors = ['#5a7a3a', '#3a5a7a', '#6a5a3a']; // T, CT, sniper
        ctx.fillStyle = colors[e.type];
        ctx.fillRect(cx - e.w * 0.3, bodyTop, e.w * 0.6, bodyBot - bodyTop);

        // Head
        ctx.fillStyle = e.type === 1 ? '#2a4a6a' : '#4a5a2a';
        ctx.beginPath();
        ctx.arc(cx, e.y + headR, headR, 0, Math.PI * 2);
        ctx.fill();

        // Helmet line
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, e.y + headR - 2, headR + 1, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();

        // Gun
        ctx.fillStyle = '#333';
        const gunDir = e.speed > 0 ? 1 : -1;
        ctx.fillRect(cx + gunDir * e.w * 0.2, bodyTop + 10, gunDir * e.w * 0.5, 4);

        // Legs
        ctx.fillStyle = '#444';
        ctx.fillRect(cx - e.w * 0.2, bodyBot, 6, e.h * 0.3);
        ctx.fillRect(cx + e.w * 0.1, bodyBot, 6, e.h * 0.3);

        if (!e.alive) {
            ctx.restore();
            ctx.globalAlpha = 1;
        }
    }

    // Crosshair
    function drawCrosshair(x, y) {
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 1.5;
        const gap = 4, len = 12;
        ctx.beginPath();
        ctx.moveTo(x - gap - len, y); ctx.lineTo(x - gap, y);
        ctx.moveTo(x + gap, y); ctx.lineTo(x + gap + len, y);
        ctx.moveTo(x, y - gap - len); ctx.lineTo(x, y - gap);
        ctx.moveTo(x, y + gap); ctx.lineTo(x, y + gap + len);
        ctx.stroke();
    }

    // Particles
    function drawParticles() {
        for (let i = state.particles.length - 1; i >= 0; i--) {
            const p = state.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.3;
            p.life--;
            if (p.life <= 0) { state.particles.splice(i, 1); continue; }
            ctx.globalAlpha = p.life / p.maxLife;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }

    // Spawn particles on hit
    function spawnHitParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            state.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 1) * 5,
                life: 15 + Math.random() * 10,
                maxLife: 25,
                size: 2 + Math.random() * 3,
                color: Math.random() > 0.5 ? '#c00' : '#f44'
            });
        }
    }

    // Click handler
    function onCanvasClick(e) {
        if (!state.running) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        state.muzzleFlash = 3;

        if (state.ammo <= 0) return;
        state.ammo--;
        document.getElementById('csAmmo').textContent = state.ammo;

        let hit = false;
        for (let i = state.enemies.length - 1; i >= 0; i--) {
            const en = state.enemies[i];
            if (!en.alive) continue;
            if (mx >= en.x && mx <= en.x + en.w && my >= en.y && my <= en.y + en.h) {
                en.alive = false;
                en.deathTimer = 0;
                state.kills++;
                state.money += 300;
                document.getElementById('csKills').textContent = state.kills;
                document.getElementById('csMoney').textContent = state.money;
                spawnHitParticles(mx, my);
                hit = true;
                break;
            }
        }

        // Wall dust particles on miss
        if (!hit) {
            for (let i = 0; i < 4; i++) {
                state.particles.push({
                    x: mx, y: my,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    life: 10 + Math.random() * 5,
                    maxLife: 15,
                    size: 2 + Math.random() * 2,
                    color: '#b89f7a'
                });
            }
        }
    }

    function onCanvasMove(e) {
        const rect = canvas.getBoundingClientRect();
        state.mouseX = e.clientX - rect.left;
        state.mouseY = e.clientY - rect.top;
    }

    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('mousemove', onCanvasMove);

    // Timer
    const timerInterval = setInterval(() => {
        if (!state.running) return;
        state.timeLeft--;
        const m = Math.floor(state.timeLeft / 60);
        const s = state.timeLeft % 60;
        document.getElementById('csTimer').textContent = m + ':' + s.toString().padStart(2, '0');

        if (state.timeLeft <= 0) {
            // Next round or game over
            if (state.round < 3) {
                state.round++;
                state.timeLeft = 30;
                state.ammo = 30;
                state.hp = 100;
                document.getElementById('csRound').textContent = state.round;
                document.getElementById('csAmmo').textContent = state.ammo;
                document.getElementById('csHp').textContent = state.hp;
            } else {
                state.running = false;
                if (state.kills > state.best) state.best = state.kills;
            }
        }

        // Enemies can hurt player
        state.enemies.forEach(en => {
            if (en.alive && Math.random() < 0.03) {
                const dmg = 3 + Math.floor(Math.random() * 5);
                if (state.armor > 0) {
                    state.armor = Math.max(0, state.armor - dmg);
                    document.getElementById('csArmor').textContent = state.armor;
                } else {
                    state.hp = Math.max(0, state.hp - dmg);
                    document.getElementById('csHp').textContent = state.hp;
                    if (state.hp <= 0) {
                        state.running = false;
                        if (state.kills > state.best) state.best = state.kills;
                    }
                }
            }
        });
    }, 1000);

    // Spawn timer
    const spawnInterval = setInterval(() => {
        if (!state.running) return;
        if (state.enemies.filter(e => e.alive).length < 3 + state.round) {
            spawnEnemy();
        }
    }, 800);

    // Reload on R key
    function onKeyDown(e) {
        if (e.key === 'r' || e.key === 'R') {
            state.ammo = 30;
            document.getElementById('csAmmo').textContent = 30;
        }
    }
    document.addEventListener('keydown', onKeyDown);

    // Game loop
    let animId;
    function gameLoop() {
        resize();
        drawBg();

        // Move & draw enemies
        for (let i = state.enemies.length - 1; i >= 0; i--) {
            const en = state.enemies[i];
            if (en.alive) {
                en.x += en.speed;
                if (en.x > canvas.width + 60 || en.x < -80) {
                    state.enemies.splice(i, 1);
                    continue;
                }
            } else {
                en.deathTimer++;
                if (en.deathTimer > 40) {
                    state.enemies.splice(i, 1);
                    continue;
                }
            }
            drawEnemy(en);
        }

        drawParticles();

        // Muzzle flash
        if (state.muzzleFlash > 0) {
            ctx.fillStyle = 'rgba(255,200,50,0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            state.muzzleFlash--;
        }

        drawCrosshair(state.mouseX, state.mouseY);

        // Game over screen
        if (!state.running) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ff6600';
            ctx.font = 'bold 28px Consolas, monospace';
            ctx.textAlign = 'center';
            ctx.fillText(state.hp <= 0 ? 'YOU DIED' : 'GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
            ctx.fillStyle = '#fff';
            ctx.font = '18px Consolas, monospace';
            ctx.fillText('Kills: ' + state.kills, canvas.width / 2, canvas.height / 2);
            ctx.fillText('Best: ' + state.best, canvas.width / 2, canvas.height / 2 + 28);
            ctx.fillStyle = '#888';
            ctx.font = '14px Consolas, monospace';
            ctx.fillText('Click to return to menu', canvas.width / 2, canvas.height / 2 + 65);
            ctx.textAlign = 'start';

            // One-time click to go back to menu
            canvas.onclick = function returnToMenu() {
                canvas.onclick = null;
                clearInterval(timerInterval);
                clearInterval(spawnInterval);
                document.removeEventListener('keydown', onKeyDown);
                canvas.removeEventListener('mousemove', onCanvasMove);
                cancelAnimationFrame(animId);
                canvas.style.display = 'none';
                document.getElementById('csHud').style.display = 'none';
                document.getElementById('csMenu').style.display = 'flex';
                document.getElementById('csMenuBest').textContent = 'Best: ' + state.best + ' kills';
                csGame = { best: state.best };
            };
        }

        animId = requestAnimationFrame(gameLoop);
    }

    // Initial spawn
    for (let i = 0; i < 3; i++) spawnEnemy();
    gameLoop();

    csGame = {
        stop: () => {
            state.running = false;
            clearInterval(timerInterval);
            clearInterval(spawnInterval);
            document.removeEventListener('keydown', onKeyDown);
            canvas.removeEventListener('click', onCanvasClick);
            canvas.removeEventListener('mousemove', onCanvasMove);
            cancelAnimationFrame(animId);
        },
        best: state.best
    };
}

function csStopGame() {
    if (csGame && csGame.stop) csGame.stop();
    const canvas = document.getElementById('csCanvas');
    const menu = document.getElementById('csMenu');
    const hud = document.getElementById('csHud');
    if (canvas) canvas.style.display = 'none';
    if (hud) hud.style.display = 'none';
    if (menu) menu.style.display = 'flex';
}

// ===== Shut Down =====
function shutDown() {
    toggleStartMenu();
    const o = document.createElement('div');
    o.className = 'shutdown-overlay';
    o.innerHTML = '<div class="win-logo-boot" style="margin-bottom:24px"><div class="wl-quad wl-blue"></div><div class="wl-quad wl-blue"></div><div class="wl-quad wl-blue"></div><div class="wl-quad wl-blue"></div></div><p>Shutting down...</p>';
    document.body.appendChild(o);
    setTimeout(() => {
        o.innerHTML = '<p style="color:#555;cursor:pointer">Click anywhere to restart</p>';
        o.onclick = () => location.reload();
    }, 2500);
}
