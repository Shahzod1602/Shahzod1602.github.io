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
        resume: 'Resume.txt'
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
