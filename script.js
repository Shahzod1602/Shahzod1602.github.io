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
        gallery: 'Pictures'
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
        name: 'Web App',
        desc: 'A modern web application built with React and Node.js. Features responsive design, authentication, and real-time data updates.',
        tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
        github: '#', demo: '#'
    },
    {
        name: 'API Server',
        desc: 'RESTful API server with authentication, rate limiting, and comprehensive documentation. Built with Express and PostgreSQL.',
        tags: ['Express', 'PostgreSQL', 'JWT', 'Swagger'],
        github: '#', demo: '#'
    },
    {
        name: 'CLI Tool',
        desc: 'A command-line tool that automates development workflows. Supports multiple configurations and plugin system.',
        tags: ['Python', 'Click', 'Open Source'],
        github: '#', demo: '#'
    }
];

function openProjectDetail(i) {
    const p = projects[i];
    if (!p) return;
    document.getElementById('detailContent').innerHTML =
        '<h3>' + p.name + '</h3>' +
        '<p>' + p.desc + '</p>' +
        '<div class="detail-tags">' + p.tags.map(t => '<span>' + t + '</span>').join('') + '</div>' +
        '<div class="detail-links"><a href="' + p.github + '" target="_blank">View Code</a><a href="' + p.demo + '" target="_blank">Live Demo</a></div>';
    document.getElementById('projectDetail').classList.add('show');
}

function closeProjectDetail() {
    document.getElementById('projectDetail').classList.remove('show');
}

// ===== Music Player =====
const musicPlaylist = [
    { title: 'Track 1', src: 'music/6438814619_1.mp3' },
    { title: 'Track 2', src: 'music/s6438814619_1.mp3' },
    { title: 'Track 3', src: 'music/6438814619s_1.mp3' },
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
    { src: 'images/2026-02-17 18.38.17.jpg', name: 'Study' },
    { src: 'images/2026-02-17 18.38.29.jpg', name: 'Presentation' },
    { src: 'images/2026-02-17 18.38.35.jpg', name: 'Friends' },
    { src: 'images/2026-02-17 18.38.58.jpg', name: 'Chill' },
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
