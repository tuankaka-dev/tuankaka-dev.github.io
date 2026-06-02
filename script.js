/* ============================================
   Student Portfolio — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Footer year ----
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---- Dark/Light Theme Toggle ----
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-moon';
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            themeIcon.className = next === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // ---- Typewriter ----
    const phrases = [
        'Engineering Student',
        'Hardware Engineer',
        'Problem Solver'
    ];
    const typewriterEl = document.getElementById('typewriter');
    let phraseIdx = 0, charIdx = 0, deleting = false;

    function typewrite() {
        const current = phrases[phraseIdx];
        if (!deleting) {
            typewriterEl.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) {
                deleting = true;
                setTimeout(typewrite, 1800);
                return;
            }
            setTimeout(typewrite, 80);
        } else {
            typewriterEl.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(typewrite, 400);
                return;
            }
            setTimeout(typewrite, 40);
        }
    }
    if (typewriterEl) typewrite();

    // ---- Navbar scroll ----
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const scrollIndicator = document.getElementById('scrollIndicator');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 50);
        if (backToTop) backToTop.classList.toggle('visible', y > 400);
        if (scrollIndicator) scrollIndicator.style.opacity = Math.max(0, 1 - y / 300);
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Mobile nav toggle ----
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    function updateActiveNav() {
        const y = window.scrollY + 100;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const h = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (y >= top && y < top + h) {
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.dataset.section === id);
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ---- Scroll animations (Intersection Observer) ----
    const animElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    animElements.forEach(el => observer.observe(el));

    // ---- Skill bar animation ----
    const skillItems = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    skillItems.forEach(el => skillObserver.observe(el));

    // ---- Cursor glow ----
    const glow = document.getElementById('cursorGlow');
    if (glow && window.matchMedia('(pointer:fine)').matches) {
        document.addEventListener('mousemove', e => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }

    // ---- Contact form (EmailJS) ----
    const form = document.getElementById('contactForm');
    if (form) {
        // Initialize EmailJS with public key only (never use private key in client code)
        emailjs.init('mt_-ZBR6eaIEuZz7h');

        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit');
            const btnText = btn.querySelector('span');
            const btnIcon = btn.querySelector('i');
            const origText = btnText.textContent;
            const origIcon = btnIcon.className;

            // Disable button & show loading state
            btn.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.className = 'fas fa-spinner fa-spin';

            emailjs.sendForm('service_2pwb8r1', 'template_or7bw4i', form)
                .then(() => {
                    btnText.textContent = 'Sent! ✓';
                    btnIcon.className = 'fas fa-check';
                    btn.classList.add('success');
                    form.reset();
                    setTimeout(() => {
                        btnText.textContent = origText;
                        btnIcon.className = origIcon;
                        btn.disabled = false;
                        btn.classList.remove('success');
                    }, 3000);
                })
                .catch((error) => {
                    console.error('EmailJS Error:', error);
                    btnText.textContent = 'Failed ✗';
                    btnIcon.className = 'fas fa-exclamation-triangle';
                    btn.classList.add('error');
                    setTimeout(() => {
                        btnText.textContent = origText;
                        btnIcon.className = origIcon;
                        btn.disabled = false;
                        btn.classList.remove('error');
                    }, 3000);
                });
        });
    }

    // ---- Particle canvas ----
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h, particles = [];
        const PARTICLE_COUNT = 60;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.r = Math.random() * 1.5 + 0.5;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.alpha = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(108,92,231,${this.alpha})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(108,92,231,${0.08 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            requestAnimationFrame(animate);
        }
        animate();
    }
});
