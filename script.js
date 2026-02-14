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
});

// ===== Clock =====
function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('trayClock').textContent = h + ':' + m;
}

// ===== Window Management =====
function openWindow(name) {
    const win = document.getElementById('window-' + name);
    if (!win) return;

    if (openWindows[name] && openWindows[name].minimized) {
        // Restore from minimize
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

    // Position window
    const offset = Object.keys(openWindows).length * 30;
    win.style.top = (60 + offset) + 'px';
    win.style.left = (120 + offset) + 'px';

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
    if (openWindows[name]) {
        openWindows[name].minimized = true;
    }
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

    const iconMap = {
        about: 'icon-user-sm',
        projects: 'icon-folder-sm',
        skills: 'icon-terminal-sm',
        contact: 'icon-mail-sm',
        resume: 'icon-notepad-sm'
    };

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

        const icon = document.createElement('div');
        icon.className = 'taskbar-item-icon ' + (iconMap[name] || '');
        item.appendChild(icon);

        const text = document.createTextNode(titleMap[name] || name);
        item.appendChild(text);

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
    const x = e.clientX - dragData.startX;
    const y = e.clientY - dragData.startY;
    dragData.win.style.left = Math.max(0, x) + 'px';
    dragData.win.style.top = Math.max(0, y) + 'px';
});

document.addEventListener('mouseup', () => {
    dragData = null;
});

// Focus window on click
document.addEventListener('mousedown', (e) => {
    const win = e.target.closest('.window');
    if (win && win.id) {
        const name = win.id.replace('window-', '');
        focusWindow(name);
    }
});

// ===== Start Menu =====
function toggleStartMenu() {
    const menu = document.getElementById('startMenu');
    menu.classList.toggle('open');
}

// Close start menu when clicking elsewhere
document.addEventListener('click', (e) => {
    const menu = document.getElementById('startMenu');
    const btn = document.getElementById('startBtn');
    if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove('open');
    }
});

// ===== Projects Detail =====
const projects = [
    {
        name: 'Web App',
        desc: 'A modern web application built with React and Node.js. Features responsive design, authentication, and real-time data updates.',
        tags: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
        github: '#',
        demo: '#'
    },
    {
        name: 'API Server',
        desc: 'RESTful API server with authentication, rate limiting, and comprehensive documentation. Built with Express and PostgreSQL.',
        tags: ['Express', 'PostgreSQL', 'JWT', 'Swagger'],
        github: '#',
        demo: '#'
    },
    {
        name: 'CLI Tool',
        desc: 'A command-line tool that automates development workflows. Supports multiple configurations and plugin system.',
        tags: ['Python', 'Click', 'Open Source'],
        github: '#',
        demo: '#'
    }
];

function openProjectDetail(index) {
    const project = projects[index];
    if (!project) return;

    const content = document.getElementById('detailContent');
    content.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.desc}</p>
        <div class="detail-tags">
            ${project.tags.map(t => '<span>' + t + '</span>').join('')}
        </div>
        <div class="detail-links">
            <a href="${project.github}" target="_blank">View Code</a>
            <a href="${project.demo}" target="_blank">Live Demo</a>
        </div>
    `;

    document.getElementById('projectDetail').classList.add('show');
}

function closeProjectDetail() {
    document.getElementById('projectDetail').classList.remove('show');
}

// ===== Shut Down =====
function shutDown() {
    toggleStartMenu();
    const overlay = document.createElement('div');
    overlay.className = 'shutdown-overlay';
    overlay.innerHTML = '<p>Shutting down...</p>';
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.innerHTML = '<p style="color:#555">Click anywhere to restart</p>';
        overlay.onclick = () => location.reload();
    }, 2000);
}
