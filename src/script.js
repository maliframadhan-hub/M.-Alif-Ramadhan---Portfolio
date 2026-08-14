// ============================================================
// CATATAN PENTING (baca ini kalau ada fitur yang masih mati)
// ============================================================
// File ini sengaja dipecah jadi blok-blok try/catch terpisah.
// Kalau satu fitur error, fitur lain TETAP JALAN — tidak seperti
// sebelumnya di mana satu error di atas bisa mematikan semua
// script di bawahnya.
//
// Kalau setelah deploy ke Vercel ada fitur yang masih tidak
// jalan, buka DevTools (F12) -> tab Console, lalu cari log yang
// diawali "[nama-fitur]". Itu akan menunjukkan persis fitur mana
// yang error dan pesan errornya.
//
// PENYEBAB PALING SERING setelah deploy ke Vercel:
// 1. Nama file (gambar/PDF) di kode TIDAK SAMA PERSIS (huruf besar/
//    kecil, spasi) dengan nama file asli di folder public/.
//    Vercel (Linux) itu case-sensitive, komputer lokal biasanya tidak.
// 2. File tidak ada di dalam folder "public/" project Vite kamu,
//    sehingga tidak ikut ter-deploy.
// 3. Build/Output Directory setting di Vercel salah (harus "Vite"
//    preset, build command "vite build", output "dist").
// ============================================================

function run() {

    // ============================================================
    // 1. Typing effect
    // ============================================================
    try {
        const roles = [
            "IT Student",
            "Full Stack Developer",
            "Software Engineer",
            "Development Operations",
            "Mobile App Builder"
        ];

        const typingEl = document.querySelector(".typing");

        if (typingEl) {
            let roleIndex = 0;
            let charIndex = 0;
            let deleting = false;

            const typeLoop = () => {
                try {
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
                } catch (err) {
                    console.error("[typing-effect] error di dalam loop:", err);
                }
            };

            typeLoop();
        } else {
            console.warn("[typing-effect] elemen .typing tidak ditemukan — dilewati.");
        }
    } catch (err) {
        console.error("[typing-effect] gagal diinisialisasi:", err);
    }

    // ============================================================
    // 2. Mobile / global nav toggle (hamburger slide-out panel)
    // ============================================================
    try {
        const navToggle = document.getElementById("navToggle");
        const navMenu = document.getElementById("navMenu");
        const navScrim = document.getElementById("navScrim");

        if (navToggle && navMenu && navScrim) {
            const openNav = () => {
                navMenu.classList.add("open");
                navToggle.classList.add("open");
                navToggle.setAttribute("aria-expanded", "true");
                navScrim.hidden = false;
                requestAnimationFrame(() => navScrim.classList.add("open"));
            };

            const closeNav = () => {
                navMenu.classList.remove("open");
                navToggle.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
                navScrim.classList.remove("open");
                setTimeout(() => { navScrim.hidden = true; }, 300);
            };

            navToggle.addEventListener("click", () => {
                const isOpen = navMenu.classList.contains("open");
                isOpen ? closeNav() : openNav();
            });

            navScrim.addEventListener("click", closeNav);

            navMenu.querySelectorAll("a").forEach((link) => {
                link.addEventListener("click", closeNav);
            });

            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape") closeNav();
            });

            console.log("[nav-toggle] OK — hamburger siap.");
        } else {
            console.warn("[nav-toggle] salah satu elemen (navToggle/navMenu/navScrim) tidak ditemukan.", {
                navToggle: !!navToggle, navMenu: !!navMenu, navScrim: !!navScrim
            });
        }
    } catch (err) {
        console.error("[nav-toggle] error:", err);
    }

    // ============================================================
    // 3. Sticky nav background on scroll
    // ============================================================
    try {
        const nav = document.getElementById("navbar");
        if (nav) {
            window.addEventListener("scroll", () => {
                nav.classList.toggle("scrolled", window.scrollY > 12);
            });
        } else {
            console.warn("[sticky-nav] elemen #navbar tidak ditemukan.");
        }
    } catch (err) {
        console.error("[sticky-nav] error:", err);
    }

    // ============================================================
    // 4. Security & Compliance modal
    // ============================================================
    try {
        const secureBadge = document.getElementById("secureBadge");
        const secureModalScrim = document.getElementById("secureModalScrim");
        const secureModalClose = document.getElementById("secureModalClose");

        if (secureBadge && secureModalScrim && secureModalClose) {
            const openSecureModal = () => {
                secureModalScrim.hidden = false;
                document.body.style.overflow = "hidden";
                requestAnimationFrame(() => secureModalScrim.classList.add("open"));
            };

            const closeSecureModal = () => {
                secureModalScrim.classList.remove("open");
                document.body.style.overflow = "";
                setTimeout(() => { secureModalScrim.hidden = true; }, 250);
            };

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
        } else {
            console.warn("[secure-modal] elemen tidak lengkap, dilewati.");
        }
    } catch (err) {
        console.error("[secure-modal] error:", err);
    }

    // ============================================================
    // 5. Light / dark theme toggle
    // ============================================================
    try {
        const THEME_KEY = "alif-portfolio-theme";
        const themeToggle = document.getElementById("themeToggle");
        const rootEl = document.documentElement;

        const applyTheme = (theme) => {
            if (theme === "light") {
                rootEl.setAttribute("data-theme", "light");
            } else {
                rootEl.removeAttribute("data-theme");
            }
        };

        const getPreferredTheme = () => {
            let saved = null;
            try {
                saved = localStorage.getItem(THEME_KEY);
            } catch (storageErr) {
                // localStorage bisa diblokir di beberapa browser/mode privat.
                console.warn("[theme-toggle] localStorage tidak bisa diakses:", storageErr);
            }
            if (saved === "light" || saved === "dark") return saved;
            return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        };

        applyTheme(getPreferredTheme());

        if (themeToggle) {
            themeToggle.addEventListener("click", () => {
                const isLight = rootEl.getAttribute("data-theme") === "light";
                const next = isLight ? "dark" : "light";
                applyTheme(next);
                try {
                    localStorage.setItem(THEME_KEY, next);
                } catch (storageErr) {
                    console.warn("[theme-toggle] gagal menyimpan preferensi tema:", storageErr);
                }
            });
            console.log("[theme-toggle] OK.");
        } else {
            console.warn("[theme-toggle] elemen #themeToggle tidak ditemukan.");
        }
    } catch (err) {
        console.error("[theme-toggle] error:", err);
    }

    // ============================================================
    // 6. Skills section — modal detail
    // ============================================================
    try {
        const skillModalScrim = document.getElementById("skillModalScrim");
        const skillModal = document.getElementById("skillModal");
        const skillModalClose = document.getElementById("skillModalClose");
        const skillModalIcon = document.getElementById("skillModalIcon");
        const skillModalTitle = document.getElementById("skillModalTitle");
        const skillModalBody = document.getElementById("skillModalBody");

        const openSkillModal = (card) => {
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
        };

        const closeSkillModal = () => {
            if (!skillModalScrim) return;
            skillModalScrim.classList.remove("open");
            setTimeout(() => { skillModalScrim.hidden = true; }, 250);
        };

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
    } catch (err) {
        console.error("[skill-modal] error:", err);
    }

    // ============================================================
    // 7. Right-click / Copy protection guard
    // ============================================================
    try {
        const guardModalScrim = document.getElementById("guardModalScrim");
        const guardModalClose = document.getElementById("guardModalClose");
        const guardModalReason = document.getElementById("guardModalReason");

        if (guardModalScrim && guardModalClose) {
            const openGuardModal = (reasonText) => {
                if (guardModalReason && reasonText) {
                    guardModalReason.textContent = reasonText;
                }
                guardModalScrim.hidden = false;
                requestAnimationFrame(() => guardModalScrim.classList.add("open"));
            };

            const closeGuardModal = () => {
                guardModalScrim.classList.remove("open");
                setTimeout(() => { guardModalScrim.hidden = true; }, 250);
            };

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
        } else {
            console.warn("[copy-guard] elemen guard modal tidak lengkap, dilewati.");
        }
    } catch (err) {
        console.error("[copy-guard] error:", err);
    }

    // ============================================================
    // 8. Footer real-time clock
    // ============================================================
    try {
        const clockTimeEl = document.getElementById("clockTime");
        const clockDateEl = document.getElementById("clockDate");

        if (clockTimeEl || clockDateEl) {
            const updateClock = () => {
                try {
                    const now = new Date();
                    if (clockTimeEl) {
                        clockTimeEl.textContent = now.toLocaleTimeString("id-ID", {
                            hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
                        });
                    }
                    if (clockDateEl) {
                        clockDateEl.textContent = now.toLocaleDateString("id-ID", {
                            weekday: "short", day: "2-digit", month: "short"
                        });
                    }
                } catch (err) {
                    console.error("[clock] error saat update:", err);
                }
            };

            updateClock();
            setInterval(updateClock, 1000);
            console.log("[clock] OK — jam real-time berjalan.");
        } else {
            console.warn("[clock] elemen #clockTime / #clockDate tidak ditemukan.");
        }
    } catch (err) {
        console.error("[clock] gagal diinisialisasi:", err);
    }

    // ============================================================
    // 9. Scroll to top button
    // ============================================================
    try {
        const scrollTopBtn = document.getElementById("scrollTopBtn");
        if (scrollTopBtn) {
            window.addEventListener("scroll", () => {
                scrollTopBtn.classList.toggle("visible", window.scrollY > 480);
            });
            scrollTopBtn.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    } catch (err) {
        console.error("[scroll-top] error:", err);
    }

    // ============================================================
    // 10. Active link + scroll reveal via IntersectionObserver
    // ============================================================
    try {
        const sections = document.querySelectorAll("section, header[id]");
        const navLinks = document.querySelectorAll("#navMenu a");

        const revealTargets = document.querySelectorAll(
            ".about, .manifesto, .skill-card, .project-container .card, .timeline__item, .cert-card, .contact__card, .section-head"
        );
        revealTargets.forEach((el) => el.classList.add("reveal"));

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("is-visible");
                            if (entry.target.tagName.toLowerCase() !== "article" &&
                                !entry.target.classList.contains("contact__card")) {
                                const id = entry.target.id;
                                navLinks.forEach((link) => {
                                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
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
        } else {
            // Browser lama tanpa IntersectionObserver: langsung tampilkan semuanya.
            revealTargets.forEach((el) => el.classList.add("is-visible"));
        }
    } catch (err) {
        console.error("[scroll-reveal] error:", err);
    }

    // ============================================================
    // 11. PDF CERTIFICATE THUMBNAILS (CERT/04 & CERT/05)
    // ============================================================
    try {
        let pdfJsLoader = null;
        const PDF_RENDER_MAX_ATTEMPTS = 15;

        const loadPdfJs = () => {
            if (pdfJsLoader) return pdfJsLoader;

            pdfJsLoader = new Promise((resolve, reject) => {
                if (window.pdfjsLib) {
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                    resolve(window.pdfjsLib);
                    return;
                }

                const script = document.createElement("script");
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";

                script.onload = () => {
                    if (!window.pdfjsLib) {
                        reject(new Error("PDF.js gagal dimuat (window.pdfjsLib tidak ada setelah script load)."));
                        return;
                    }
                    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                    resolve(window.pdfjsLib);
                };

                script.onerror = () => {
                    reject(new Error("Tidak dapat memuat PDF.js dari CDN (cek koneksi/CSP)."));
                };

                document.head.appendChild(script);
            });

            return pdfJsLoader;
        };

        // showFallback: kalau render gagal (mis. file PDF 404 karena
        // case-sensitivity nama file di server), tampilkan label PDF
        // saja daripada canvas kosong.
        const showThumbFallback = (canvas) => {
            const wrap = canvas?.closest(".cert-card__thumb");
            if (wrap) wrap.classList.add("cert-card__thumb--fallback");
        };

        const renderCertPdf = async ({ canvasId, pdfUrl, label, attempt = 0 }) => {
            const canvas = document.getElementById(canvasId);
            if (!canvas) {
                console.warn(`[${label}] canvas #${canvasId} tidak ditemukan.`);
                return;
            }

            const container = canvas.parentElement;

            try {
                const pdfjsLib = await loadPdfJs();

                let pdf;
                try {
                    pdf = await pdfjsLib.getDocument({ url: pdfUrl }).promise;
                } catch (fetchErr) {
                    console.error(
                        `[${label}] gagal memuat file PDF di "${pdfUrl}". ` +
                        `Kemungkinan besar: nama file di server TIDAK PERSIS SAMA (huruf besar/kecil, spasi) ` +
                        `dengan yang dipanggil di kode, atau file tidak ada di folder public/. Detail:`,
                        fetchErr
                    );
                    showThumbFallback(canvas);
                    return;
                }

                const page = await pdf.getPage(1);

                const frameWidth = container.clientWidth;
                const frameHeight = container.clientHeight;

                if (frameWidth <= 0 || frameHeight <= 0) {
                    if (attempt < PDF_RENDER_MAX_ATTEMPTS) {
                        requestAnimationFrame(() =>
                            renderCertPdf({ canvasId, pdfUrl, label, attempt: attempt + 1 })
                        );
                    } else {
                        console.warn(`[${label}] container tidak pernah memiliki ukuran, render dibatalkan.`);
                        showThumbFallback(canvas);
                    }
                    return;
                }

                const originalViewport = page.getViewport({ scale: 1 });
                const scale = Math.min(frameWidth / originalViewport.width, frameHeight / originalViewport.height);
                const viewport = page.getViewport({ scale });

                const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

                canvas.width = Math.round(viewport.width * pixelRatio);
                canvas.height = Math.round(viewport.height * pixelRatio);
                canvas.style.width = `${viewport.width}px`;
                canvas.style.height = `${viewport.height}px`;
                canvas.style.position = "absolute";
                canvas.style.left = "50%";
                canvas.style.top = "50%";
                canvas.style.transform = "translate(-50%, -50%)";

                const ctx = canvas.getContext("2d");
                ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                ctx.clearRect(0, 0, viewport.width, viewport.height);

                await page.render({ canvasContext: ctx, viewport }).promise;

                console.log(`[${label}] berhasil dirender.`);
            } catch (error) {
                console.error(`[${label}] gagal:`, error);
                showThumbFallback(canvas);
            }
        };

        const CERTS = [
            {
                canvasId: "cert04-pdf",
                // PASTIKAN nama file ini SAMA PERSIS (besar/kecil huruf,
                // spasi, tanda kurung) dengan nama file di folder public/.
                pdfUrl: "/M.%20ALIF%20RAMADHAN.pdf",
                label: "CERT/04"
            },
            {
                canvasId: "cert05-pdf",
                pdfUrl: "/M.%20ALIF%20RAMADHAN%20%282%29%20%281%29.pdf",
                label: "CERT/05"
            }
        ];

        const initCertificatePDFs = () => {
            CERTS.forEach((cert) => renderCertPdf(cert));
        };

        initCertificatePDFs();

        let certResizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(certResizeTimer);
            certResizeTimer = setTimeout(() => {
                CERTS.forEach((cert) => renderCertPdf(cert));
            }, 300);
        });
    } catch (err) {
        console.error("[cert-pdf] error di luar dugaan:", err);
    }
}

// ============================================================
// Jalankan semua fitur setelah DOM siap.
// Karena script ini dimuat sebagai type="module" di akhir <body>,
// DOM biasanya sudah siap — tapi kita cek eksplisit untuk aman
// di semua kondisi hosting/browser.
// ============================================================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
} else {
    run();
}
