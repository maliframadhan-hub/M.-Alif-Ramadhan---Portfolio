// ============================================
// Typing effect
// ============================================
const roles = [
    "IT Student",
    "Full Stack Developer",
    "Software Engineer",
    "Development Operations",
    "Mobile App Builder"
];

const typingEl = document.querySelector(".typing");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
    if (!typingEl) return;

    const current = roles[roleIndex];

    if (!deleting) {
        charIndex++;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
            deleting = true;
            setTimeout(typeLoop, 1400);
            return;
        }
    } else {
        charIndex--;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeLoop, deleting ? 40 : 80);
}

typeLoop();

// ============================================
// Mobile / global nav toggle (slide-out panel)
// ============================================
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navScrim = document.getElementById("navScrim");

function openNav() {
    navMenu.classList.add("open");
    navToggle.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    navScrim.hidden = false;
    requestAnimationFrame(() => navScrim.classList.add("open"));
}

function closeNav() {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navScrim.classList.remove("open");
    setTimeout(() => { navScrim.hidden = true; }, 300);
}

if (navToggle && navMenu && navScrim) {
    navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.contains("open");
        if (isOpen) {
            closeNav();
        } else {
            openNav();
        }
    });

    navScrim.addEventListener("click", closeNav);

    navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeNav();
    });
}

// ============================================
// Sticky nav background on scroll
// ============================================
const nav = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 12);
});

// ============================================
// Security & Compliance modal
// ============================================
const secureBadge = document.getElementById("secureBadge");
const secureModalScrim = document.getElementById("secureModalScrim");
const secureModalClose = document.getElementById("secureModalClose");

function openSecureModal() {
    secureModalScrim.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => secureModalScrim.classList.add("open"));
}

function closeSecureModal() {
    secureModalScrim.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { secureModalScrim.hidden = true; }, 250);
}

if (secureBadge && secureModalScrim && secureModalClose) {
    secureBadge.addEventListener("click", openSecureModal);
    secureModalClose.addEventListener("click", closeSecureModal);

    secureModalScrim.addEventListener("click", (e) => {
        if (e.target === secureModalScrim) closeSecureModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && secureModalScrim.classList.contains("open")) {
            closeSecureModal();
        }
    });
}

// ============================================
// Light / dark theme toggle
// ============================================
const THEME_KEY = "alif-portfolio-theme";
const themeToggle = document.getElementById("themeToggle");
const rootEl = document.documentElement;

function applyTheme(theme) {
    if (theme === "light") {
        rootEl.setAttribute("data-theme", "light");
    } else {
        rootEl.removeAttribute("data-theme");
    }
}

function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

applyTheme(getPreferredTheme());

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLight = rootEl.getAttribute("data-theme") === "light";
        const next = isLight ? "dark" : "light";
        applyTheme(next);
        localStorage.setItem(THEME_KEY, next);
    });
}

// ============================================
// Skills section — "Detail Lanjutan" opens a modal
// ============================================
const skillModalScrim = document.getElementById("skillModalScrim");
const skillModal = document.getElementById("skillModal");
const skillModalClose = document.getElementById("skillModalClose");
const skillModalIcon = document.getElementById("skillModalIcon");
const skillModalTitle = document.getElementById("skillModalTitle");
const skillModalBody = document.getElementById("skillModalBody");

function openSkillModal(card) {
    if (!skillModalScrim) return;

    const accent = card.dataset.accent || "violet";
    const title = card.querySelector("h3")?.textContent?.trim() || "";
    const desc = card.querySelector(".skill-card__desc")?.innerHTML?.trim() || "";
    const detail = card.querySelector(".skill-card__detail p")?.innerHTML?.trim() || "";
    const iconMarkup = card.querySelector(".skill-card__icon")?.innerHTML || "";

    skillModalIcon.className = `skill-modal__icon skill-modal__icon--${accent}`;
    skillModalIcon.innerHTML = iconMarkup;
    skillModalTitle.textContent = title;
    skillModalBody.innerHTML = "";

    [desc, detail].forEach((html) => {
        if (!html) return;
        const p = document.createElement("p");
        p.innerHTML = html;
        skillModalBody.appendChild(p);
    });

    skillModalScrim.hidden = false;
    requestAnimationFrame(() => skillModalScrim.classList.add("open"));
}

function closeSkillModal() {
    if (!skillModalScrim) return;
    skillModalScrim.classList.remove("open");
    setTimeout(() => { skillModalScrim.hidden = true; }, 250);
}

const skillToggles = document.querySelectorAll(".skill-card__toggle");

skillToggles.forEach((toggle) => {
    const card = toggle.closest(".skill-card");
    if (!card) return;

    toggle.setAttribute("aria-haspopup", "dialog");

    toggle.addEventListener("click", () => openSkillModal(card));
});

if (skillModalScrim && skillModal && skillModalClose) {
    skillModalClose.addEventListener("click", closeSkillModal);

    skillModalScrim.addEventListener("click", (e) => {
        if (e.target === skillModalScrim) closeSkillModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && skillModalScrim.classList.contains("open")) {
            closeSkillModal();
        }
    });
}

// ============================================
// Right-click / Copy protection guard
// ============================================
const guardModalScrim = document.getElementById("guardModalScrim");
const guardModalClose = document.getElementById("guardModalClose");
const guardModalReason = document.getElementById("guardModalReason");

function openGuardModal(reasonText) {
    if (!guardModalScrim) return;
    if (guardModalReason && reasonText) {
        guardModalReason.textContent = reasonText;
    }
    guardModalScrim.hidden = false;
    requestAnimationFrame(() => guardModalScrim.classList.add("open"));
}

function closeGuardModal() {
    if (!guardModalScrim) return;
    guardModalScrim.classList.remove("open");
    setTimeout(() => { guardModalScrim.hidden = true; }, 250);
}

if (guardModalScrim && guardModalClose) {
    guardModalClose.addEventListener("click", closeGuardModal);

    guardModalScrim.addEventListener("click", (e) => {
        if (e.target === guardModalScrim) closeGuardModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && guardModalScrim.classList.contains("open")) {
            closeGuardModal();
        }
    });

    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        openGuardModal("⚠ KLIK KANAN TERDETEKSI.");
    });

    document.addEventListener("copy", (e) => {
        e.preventDefault();
        openGuardModal("⚠ PERCOBAAN MENYALIN KONTEN TERDETEKSI.");
    });

    document.addEventListener("cut", (e) => {
        e.preventDefault();
        openGuardModal("⚠ PERCOBAAN MEMOTONG KONTEN TERDETEKSI.");
    });

    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        const isCopyShortcut = (e.ctrlKey || e.metaKey) && (key === "c" || key === "x" || key === "u" || key === "s");
        const isDevtoolsShortcut = e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(key));

        if (isCopyShortcut || isDevtoolsShortcut) {
            e.preventDefault();
            openGuardModal(isDevtoolsShortcut ? "⚠ AKSES DEVTOOLS TERDETEKSI." : "⚠ PINTASAN SALIN TERDETEKSI.");
        }
    });
}

// ============================================
// Footer real-time clock
// ============================================
const clockTimeEl = document.getElementById("clockTime");
const clockDateEl = document.getElementById("clockDate");

function updateClock() {
    const now = new Date();

    if (clockTimeEl) {
        clockTimeEl.textContent = now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        });
    }

    if (clockDateEl) {
        clockDateEl.textContent = now.toLocaleDateString("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short"
        });
    }
}

updateClock();
setInterval(updateClock, 1000);

// ============================================
// Scroll to top button
// ============================================
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
        scrollTopBtn.classList.toggle("visible", window.scrollY > 480);
    });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ============================================
// Active link + scroll reveal via IntersectionObserver
// ============================================
const sections = document.querySelectorAll("section, header[id]");
const navLinks = document.querySelectorAll("#navMenu a");

const revealTargets = document.querySelectorAll(
    ".about, .manifesto, .skill-card, .project-container .card, .timeline__item, .cert-card, .contact__card, .section-head"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");

                if (entry.target.tagName.toLowerCase() !== "article" &&
                    !entry.target.classList.contains("contact__card")) {
                    const id = entry.target.id;
                    navLinks.forEach((link) => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === `#${id}`
                        );
                    });
                }
            }
        });
    },
    { threshold: 0.35 }
);

sections.forEach((s) => observer.observe(s));

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// ============================================
// PDF CERTIFICATE THUMBNAILS
// CERT/04 dan CERT/05 TERPISAH
// ============================================

let pdfJsLoader = null;


// ============================================
// LOAD PDF.JS - SATU KALI SAJA
// ============================================

function loadPdfJs() {

    if (pdfJsLoader) {
        return pdfJsLoader;
    }

    pdfJsLoader = new Promise((resolve, reject) => {

        if (window.pdfjsLib) {

            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

            resolve(window.pdfjsLib);
            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";

        script.onload = () => {

            if (!window.pdfjsLib) {
                reject(
                    new Error("PDF.js gagal dimuat.")
                );
                return;
            }

            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

            resolve(window.pdfjsLib);

        };

        script.onerror = () => {

            reject(
                new Error("Tidak dapat memuat PDF.js.")
            );

        };

        document.head.appendChild(script);

    });

    return pdfJsLoader;
}



// ============================================
// CERT/04
// Workshop Capacity Building
// ============================================

async function renderCert04() {

    const canvas =
        document.getElementById("cert04-pdf");

    if (!canvas) {
        console.warn("Canvas CERT/04 tidak ditemukan.");
        return;
    }

    const container =
        canvas.parentElement;

    try {

        const pdfjsLib =
            await loadPdfJs();


        const pdf =
            await pdfjsLib.getDocument({
                url: "/M.%20ALIF%20RAMADHAN.pdf"
            }).promise;


        // CERT/04 = halaman 1
        const page =
            await pdf.getPage(1);


        // ----------------------------------------
        // Ukuran frame
        // ----------------------------------------

        const frameWidth =
            container.clientWidth;

        const frameHeight =
            container.clientHeight;


        if (
            frameWidth <= 0 ||
            frameHeight <= 0
        ) {
            return;
        }


        // ----------------------------------------
        // Ukuran asli PDF
        // ----------------------------------------

        const originalViewport =
            page.getViewport({
                scale: 1
            });


        // ----------------------------------------
        // FIT INSIDE
        // Seluruh PDF masuk frame
        // ----------------------------------------

        const scaleX =
            frameWidth /
            originalViewport.width;

        const scaleY =
            frameHeight /
            originalViewport.height;

        const scale =
            Math.min(
                scaleX,
                scaleY
            );


        const viewport =
            page.getViewport({
                scale: scale
            });


        // ----------------------------------------
        // Retina / High DPI
        // ----------------------------------------

        const pixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        canvas.width =
            Math.round(
                viewport.width *
                pixelRatio
            );

        canvas.height =
            Math.round(
                viewport.height *
                pixelRatio
            );


        // Ukuran visual
        canvas.style.width =
            `${viewport.width}px`;

        canvas.style.height =
            `${viewport.height}px`;


        // ----------------------------------------
        // Posisi
        // ----------------------------------------

        canvas.style.position =
            "absolute";

        canvas.style.left =
            "50%";

        canvas.style.top =
            "50%";

        canvas.style.transform =
            "translate(-50%, -50%)";


        // ----------------------------------------
        // Render
        // ----------------------------------------

        const ctx =
            canvas.getContext("2d");


        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );


        ctx.clearRect(
            0,
            0,
            viewport.width,
            viewport.height
        );


        await page.render({

            canvasContext:
                ctx,

            viewport:
                viewport

        }).promise;


        console.log(
            "✓ CERT/04 berhasil"
        );

    } catch (error) {

        console.error(
            "✕ CERT/04 gagal:",
            error
        );

    }
}



// ============================================
// CERT/05
// Jambore Nasional TIK
// ============================================

async function renderCert05() {

    const canvas =
        document.getElementById("cert05-pdf");

    if (!canvas) {
        console.warn("Canvas CERT/05 tidak ditemukan.");
        return;
    }

    const container =
        canvas.parentElement;

    try {

        const pdfjsLib =
            await loadPdfJs();


        const pdf =
            await pdfjsLib.getDocument({
                url: "/M.%20ALIF%20RAMADHAN%20%282%29%20%281%29.pdf"
            }).promise;


        // CERT/05 = halaman 1
        const page =
            await pdf.getPage(1);


        // ----------------------------------------
        // Ukuran frame
        // ----------------------------------------

        const frameWidth =
            container.clientWidth;

        const frameHeight =
            container.clientHeight;


        if (
            frameWidth <= 0 ||
            frameHeight <= 0
        ) {
            return;
        }


        // ----------------------------------------
        // Ukuran asli PDF
        // ----------------------------------------

        const originalViewport =
            page.getViewport({
                scale: 1
            });


        // ----------------------------------------
        // FIT INSIDE
        // ----------------------------------------

        const scaleX =
            frameWidth /
            originalViewport.width;

        const scaleY =
            frameHeight /
            originalViewport.height;

        const scale =
            Math.min(
                scaleX,
                scaleY
            );


        const viewport =
            page.getViewport({
                scale: scale
            });


        // ----------------------------------------
        // High DPI
        // ----------------------------------------

        const pixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        canvas.width =
            Math.round(
                viewport.width *
                pixelRatio
            );

        canvas.height =
            Math.round(
                viewport.height *
                pixelRatio
            );


        canvas.style.width =
            `${viewport.width}px`;

        canvas.style.height =
            `${viewport.height}px`;


        // ----------------------------------------
        // Posisi
        // ----------------------------------------

        canvas.style.position =
            "absolute";

        canvas.style.left =
            "50%";

        canvas.style.top =
            "50%";

        canvas.style.transform =
            "translate(-50%, -50%)";


        // ----------------------------------------
        // Render
        // ----------------------------------------

        const ctx =
            canvas.getContext("2d");


        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );


        ctx.clearRect(
            0,
            0,
            viewport.width,
            viewport.height
        );


        await page.render({

            canvasContext:
                ctx,

            viewport:
                viewport

        }).promise;


        console.log(
            "✓ CERT/05 berhasil"
        );

    } catch (error) {

        console.error(
            "✕ CERT/05 gagal:",
            error
        );

    }
}



// ============================================
// INITIALIZE
// ============================================

function initCertificatePDFs() {

    renderCert04();
    renderCert05();

}


if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initCertificatePDFs
    );

} else {

    initCertificatePDFs();

}



// ============================================
// RESIZE CERT/04
// ============================================

let cert04ResizeTimer;

window.addEventListener("resize", () => {

    clearTimeout(cert04ResizeTimer);

    cert04ResizeTimer =
        setTimeout(() => {

            renderCert04();

        }, 300);

});



// ============================================
// RESIZE CERT/05
// ============================================

let cert05ResizeTimer;

window.addEventListener("resize", () => {

    clearTimeout(cert05ResizeTimer);

    cert05ResizeTimer =
        setTimeout(() => {

            renderCert05();

        }, 300);

});
