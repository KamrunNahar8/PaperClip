/**
 * Client-side DOM Orchestration & Theming Module
 * Manages route transitions, scroll-linked animations, and granular theme toggling.
 */

/**
 * Normalizes top-level route active states across desktop and mobile navigation elements.
 */
function updateActiveNav() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';
    
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        link.classList.remove('active');
    });

    let activeId = 'home-link';
    if (page === 'analyze.html') activeId = 'analyze-link';
    if (page === 'cgpa.html') activeId = 'cgpa-link';
    if (page === 'attendance.html') activeId = 'attendance-link';
    if (page === 'about.html') activeId = 'about-link';
    if (page === 'how-it-works.html') activeId = 'how-link';

    const desktopLink = document.getElementById(activeId);
    const mobileLink = document.getElementById('mobile-' + activeId);
    
    if (desktopLink) desktopLink.classList.add('active');
    if (mobileLink) mobileLink.classList.add('active');
}

/**
 * Instantiates IntersectionObserver pipelines to trigger component entrance animations upon entering the viewport.
 */
function handleReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

/**
 * Mutates asset endpoints based on the active color scheme mode.
 */
function updateLogo() {
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.src = 'Logos/PaperClip-Logo.png';
    }
}

/**
 * Handles explicit user theme toggling via DOM dataset/class injection and local storage persistence.
 */
function toggleTheme() {
    const body = document.body;
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    
    if (html.classList.contains('dark-theme') || body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        html.classList.remove('dark-theme');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        html.classList.add('dark-theme');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
    updateLogo();
}

/**
 * Controls the off-canvas mobile navigation and associated backdrop overlay states.
 */
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const icon = document.querySelector('.hamburger-menu i');
    if (!mobileNav) return;

    mobileNav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    if (mobileNav.classList.contains('active')) {
        if (icon) icon.className = 'fas fa-times';
    } else {
        if (icon) icon.className = 'fas fa-bars';
    }
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const icon = document.querySelector('.hamburger-menu i');
    if (!mobileNav) return;

    mobileNav.classList.remove('active');
    document.body.classList.remove('menu-open');
    if (icon) icon.className = 'fas fa-bars';
}

document.addEventListener('click', function(event) {
    const mobileNav = document.getElementById('mobile-nav');
    const header = document.querySelector('.header');
    
    if (mobileNav && mobileNav.classList.contains('active')) {
        if (header && !header.contains(event.target)) {
            closeMobileMenu();
        }
    }
});

/**
 * Throttles and dispatches window scroll events for dynamic header scaling and progress bar interpolation.
 */
function handleScroll() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const header = document.querySelector('.header');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";
        
        if (header) {
            if (winScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        if (backToTop) {
            if (winScroll > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Application Entry Point
 * Bootstraps initial state, DOM bindings, and visual orchestrators directly from cache or default layout profiles.
 */
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
    } else {
        document.body.classList.add('dark-theme');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }

    updateActiveNav();
    updateLogo();

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    handleReveal();
    handleScroll();
    
    document.body.style.opacity = '1';
});