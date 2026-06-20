
const ADMIN_CREDENTIALS = {
    username: 'gtechadmin',
    password: 'gtech@2026'
};

const GOOGLE_SHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyUovtK0UOGuvTJQymJE-bHwi92gIgiyCiCmmoRNRwNpuCQhLSu5eJpInOLp7PT5WLu/exec';

const SERVICE_LABELS = {
    web_design: 'Web Design',
    development: 'Frontend & Backend',
    portfolio_websites: 'Portfolio Websites',
    student_projects: 'Student Projects',
    digital_marketing: 'Digital Marketing',
    logo_design: 'Logo Design'
};

const DEFAULT_PROJECTS = {
    web_design: [
        { id: 'w1', title: 'TechNova Solutions', description: 'Responsive corporate website with modern hero section and service flow.', client: 'Business Website', sample: true },
        { id: 'w2', title: 'EduLearn Platform', description: 'Clean educational interface designed to present courses and student features.', client: 'Learning Platform', sample: true },
        { id: 'w3', title: 'FitTrack Landing Page', description: 'Single-page product landing experience with clear conversion-focused structure.', client: 'Landing Page', sample: true }
    ],
    development: [
        { id: 'd1', title: 'Business Dashboard', description: 'Frontend & backend admin workflow for content and lead management.', client: 'Admin Dashboard', sample: true },
        { id: 'd2', title: 'Booking Web App', description: 'Functional project structure for enquiry flow, data handling and user actions.', client: 'Web App', sample: true }
    ],
    portfolio_websites: [
        { id: 'p1', title: 'Developer Resume Site', description: 'Personal website built for skills, projects and contact presentation.', client: 'Portfolio Website', sample: true },
        { id: 'p2', title: 'Creative Freelancer Profile', description: 'Showcase layout for personal branding, service listing and contact flow.', client: 'Personal Brand', sample: true }
    ],
    student_projects: [
        { id: 's1', title: 'Library Management System', description: 'Student project with modules, records and interface structure for academic use.', client: 'Student Project', sample: true },
        { id: 's2', title: 'StudyBuddy Portal', description: 'College-oriented project with student access flow and presentation support.', client: 'Academic System', sample: true }
    ],
    digital_marketing: [
        { id: 'm1', title: 'Digital Boost Campaign', description: 'Creative promotional content and campaign support for online growth.', client: 'Campaign', sample: true },
        { id: 'm2', title: 'Brand Reach Plan', description: 'Social content system and online activity plan for a growing brand.', client: 'Marketing Support', sample: true }
    ],
    logo_design: [
        { id: 'l1', title: 'Cafe Aroma Identity', description: 'Brand mark and visual direction for a cafe-style business identity.', client: 'Logo Design', sample: true },
        { id: 'l2', title: 'GreenLife Branding', description: 'Minimal logo exploration and brand visuals for a professional identity.', client: 'Branding', sample: true }
    ]
};

const menuButton = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuButton && navMenu) {
    menuButton.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => {
    revealObserver.observe(element);
});

function readStore(key, fallback = []) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function writeStore(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function fileToDataUrl(file) {
    return new Promise((resolve) => {
        if (!file) {
            resolve('');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

async function filesToDataUrls(fileList) {
    const files = Array.from(fileList || []).slice(0, 10);
    const results = [];
    for (const file of files) {
        const data = await fileToDataUrl(file);
        if (data) {
            results.push(data);
        }
    }
    return results;
}

function getCustomProjects(category) {
    return readStore(`gtech_projects_${category}`, []);
}

function getAllProjects(category) {
    return [...(DEFAULT_PROJECTS[category] || []), ...getCustomProjects(category)];
}

function createProjectCard(project, category) {
    const card = document.createElement('article');
    card.className = 'project-card reveal show';
    card.setAttribute('data-tilt', '');

    const thumb = document.createElement('div');
    thumb.className = 'project-thumb';

    const galleryImages = project.images && project.images.length ? project.images : (project.image ? [project.image] : []);
    if (galleryImages.length) {
        const img = document.createElement('img');
        img.src = galleryImages[0];
        img.alt = project.title;
        thumb.appendChild(img);
    }

    const title = document.createElement('h3');
    title.textContent = project.title;

    const description = document.createElement('p');
    description.textContent = project.description;

    const meta = document.createElement('div');
    meta.className = 'project-meta';

    const service = document.createElement('span');
    service.className = 'category-pill';
    service.textContent = SERVICE_LABELS[category];

    const client = document.createElement('span');
    client.textContent = project.client || (project.sample ? 'Sample Project' : 'Custom Project');

    meta.appendChild(service);
    meta.appendChild(client);

    card.appendChild(thumb);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(meta);

    if (galleryImages.length > 1) {
        const gallery = document.createElement('div');
        gallery.className = 'project-gallery-strip';
        galleryImages.slice(0, 3).forEach((imageSrc) => {
            const mini = document.createElement('img');
            mini.src = imageSrc;
            mini.alt = `${project.title} preview`;
            gallery.appendChild(mini);
        });
        if (galleryImages.length > 3) {
            const count = document.createElement('div');
            count.className = 'gallery-count';
            count.textContent = `+${galleryImages.length - 3}`;
            gallery.appendChild(count);
        }
        card.appendChild(gallery);

        const note = document.createElement('p');
        note.className = 'project-note';
        note.textContent = `${galleryImages.length} project photos uploaded`;
        card.appendChild(note);
    }

    return card;
}

function renderPortfolioPage() {
    document.querySelectorAll('[data-portfolio-grid]').forEach((grid) => {
        const category = grid.dataset.portfolioGrid;
        const projects = getAllProjects(category);
        grid.innerHTML = '';

        if (!projects.length) {
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.textContent = 'No projects available in this section yet.';
            grid.appendChild(empty);
            return;
        }

        projects.forEach((project) => {
            grid.appendChild(createProjectCard(project, category));
        });
    });

    initTiltEffects();
}


function renderMessageCards(key, containerId) {
    const box = document.getElementById(containerId);
    if (!box) return;

    const messages = readStore(key, []).slice().reverse();
    box.innerHTML = '';

    const toolbar = document.createElement('div');
    toolbar.className = 'data-toolbar';

    const exportButton = document.createElement('button');
    exportButton.type = 'button';
    exportButton.className = 'btn-small btn-subtle';
    exportButton.textContent = 'Export CSV';
    exportButton.addEventListener('click', () => exportMessagesAsCSV(key));

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'btn-small btn-danger';
    clearButton.textContent = 'Clear Data';
    clearButton.addEventListener('click', () => {
        if (confirm('Clear all saved form data from this browser?')) {
            writeStore(key, []);
            renderMessageCards(key, containerId);
        }
    });

    toolbar.appendChild(exportButton);
    toolbar.appendChild(clearButton);
    box.appendChild(toolbar);

    if (!messages.length) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = 'No saved messages yet.';
        box.appendChild(empty);
        return;
    }

    messages.forEach((entry) => {
        const card = document.createElement('article');
        card.className = 'preview-card message-record';

        const title = document.createElement('h3');
        title.textContent = entry.data?.subject || entry.formName || 'Message';

        const id = document.createElement('small');
        id.textContent = `${entry.id || ''} • ${entry.createdAt || ''}`;

        const name = document.createElement('p');
        name.innerHTML = `<b>Name:</b> ${entry.data?.name || '-'}`;

        const email = document.createElement('p');
        email.innerHTML = `<b>Email:</b> ${entry.data?.email || '-'}`;

        const phone = document.createElement('p');
        phone.innerHTML = `<b>Phone:</b> ${entry.data?.phone || '-'}`;

        const message = document.createElement('p');
        message.innerHTML = `<b>Message:</b> ${entry.data?.message || '-'}`;

        card.appendChild(title);
        card.appendChild(id);
        card.appendChild(name);
        card.appendChild(email);
        card.appendChild(phone);
        card.appendChild(message);
        box.appendChild(card);
    });
}


function initStoreForms() {
    document.querySelectorAll('.store-form').forEach((form) => {
        const statusBox = form.querySelector('.form-status');
        const storageKey = form.dataset.storeKey || 'gtech_form_submissions';
        const formName = form.dataset.formName || 'Form Submission';

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const payload = {
                id: `MSG-${Date.now()}`,
                formName,
                page: document.body.dataset.page || document.title,
                createdAt: new Date().toLocaleString(),
                timestamp: new Date().toISOString(),
                data
            };

            const stored = readStore(storageKey, []);
            stored.push(payload);
            writeStore(storageKey, stored);

            const sheetData = new FormData();
            sheetData.append('id', payload.id);
            sheetData.append('formName', payload.formName);
            sheetData.append('page', payload.page);
            sheetData.append('createdAt', payload.createdAt);
            sheetData.append('timestamp', payload.timestamp);
            sheetData.append('name', data.name || '');
            sheetData.append('email', data.email || '');
            sheetData.append('phone', data.phone || '');
            sheetData.append('subject', data.subject || '');
            sheetData.append('message', data.message || '');

            if (statusBox) {
                statusBox.textContent = 'Sending message...';
            }

            try {
                await fetch(GOOGLE_SHEET_WEB_APP_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: sheetData
                });

                form.reset();

                if (statusBox) {
                    statusBox.textContent = 'Message sent successfully. Details saved in Google Sheet.';
                }
            } catch (error) {
                if (statusBox) {
                    statusBox.textContent = 'Internet issue. Message backup saved in this browser. Please try again.';
                }
            }
        });
    });
}

function escapeCSV(value) {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
}

function exportMessagesAsCSV(key) {
    const records = readStore(key, []);
    if (!records.length) {
        alert('No data available to export.');
        return;
    }

    const rows = [
        ['id', 'formName', 'page', 'createdAt', 'name', 'email', 'phone', 'subject', 'message']
    ];

    records.forEach((entry) => {
        rows.push([
            entry.id || '',
            entry.formName || '',
            entry.page || '',
            entry.createdAt || '',
            entry.data?.name || '',
            entry.data?.email || '',
            entry.data?.phone || '',
            entry.data?.subject || '',
            entry.data?.message || ''
        ]);
    });

    const csv = rows.map((row) => row.map(escapeCSV).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${key}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

function initAdminLogin() {
    const page = document.body.dataset.page;
    if (page !== 'admin-login') return;

    if (sessionStorage.getItem('gtech_admin_logged_in') === 'true') {
        window.location.href = 'admin-dashboard.html';
        return;
    }

    const form = document.getElementById('adminLoginForm');
    const status = document.getElementById('loginStatus');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const username = data.get('username');
        const password = data.get('password');

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            sessionStorage.setItem('gtech_admin_logged_in', 'true');
            status.textContent = 'Login successful. Redirecting to dashboard...';
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 700);
        } else {
            status.textContent = 'Invalid username or password.';
        }
    });
}

function createAdminProjectCard(project, category) {
    const card = document.createElement('article');
    card.className = 'preview-card';

    const title = document.createElement('h3');
    title.textContent = project.title;

    const desc = document.createElement('p');
    const imageCount = project.images && project.images.length ? ` (${project.images.length} images)` : (project.image ? ' (1 image)' : '');
    desc.textContent = `${project.description}${imageCount}`;

    const meta = document.createElement('div');
    meta.className = 'project-meta';
    const pill = document.createElement('span');
    pill.className = 'category-pill';
    pill.textContent = SERVICE_LABELS[category];
    const type = document.createElement('span');
    type.textContent = project.sample ? 'Sample' : 'Custom';
    meta.appendChild(pill);
    meta.appendChild(type);

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(meta);

    if (!project.sample) {
        const actions = document.createElement('div');
        actions.className = 'project-actions';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn-small btn-danger';
        button.textContent = 'Delete';
        button.addEventListener('click', () => {
            const current = getCustomProjects(category).filter((item) => item.id !== project.id);
            writeStore(`gtech_projects_${category}`, current);
            renderAdminProjectLists();
            renderPortfolioPage();
        });
        actions.appendChild(button);
        card.appendChild(actions);
    }

    return card;
}

function renderAdminProjectLists() {
    const root = document.getElementById('adminProjectLists');
    if (!root) return;
    root.innerHTML = '';

    Object.keys(SERVICE_LABELS).forEach((category) => {
        const section = document.createElement('div');
        section.className = 'dashboard-card';

        const title = document.createElement('h3');
        title.textContent = SERVICE_LABELS[category];
        section.appendChild(title);

        const items = getAllProjects(category);
        const list = document.createElement('div');
        list.className = 'preview-list';

        items.forEach((project) => {
            list.appendChild(createAdminProjectCard(project, category));
        });

        section.appendChild(list);
        root.appendChild(section);
    });
}

function initAdminDashboard() {
    const page = document.body.dataset.page;
    if (page !== 'admin-dashboard') return;

    if (sessionStorage.getItem('gtech_admin_logged_in') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('gtech_admin_logged_in');
            window.location.href = 'admin-login.html';
        });
    }

    const form = document.getElementById('projectAdminForm');
    const status = document.getElementById('projectStatus');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const category = formData.get('category');
            const imageFiles = document.getElementById('project-image')?.files || [];
            const images = await filesToDataUrls(imageFiles);

            const project = {
                id: Date.now(),
                title: formData.get('title') || 'Untitled Project',
                description: formData.get('description') || 'Project description',
                client: formData.get('client') || 'Custom Project',
                image: images[0] || '',
                images,
                createdAt: new Date().toLocaleString(),
                sample: false
            };

            const current = getCustomProjects(category);
            current.push(project);
            writeStore(`gtech_projects_${category}`, current);
            form.reset();
            status.textContent = `Project added successfully${project.images.length ? ` with ${project.images.length} image(s)` : ''}.`; renderPortfolioPage();
            renderAdminProjectLists();
        });
    }

    renderAdminProjectLists();
    renderMessageCards('gtech_home_messages', 'homeMessageList');
    renderMessageCards('gtech_contact_messages', 'contactMessageList');
}

function initTiltEffects() {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
        if (card.dataset.tiltBound === 'true') return;
        card.dataset.tiltBound = 'true';

        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 12;
            const rotateX = ((0.5 - y / rect.height)) * 12;
            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

initStoreForms();
renderPortfolioPage();
initAdminLogin();
initAdminDashboard();
initTiltEffects();
