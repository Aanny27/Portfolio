/**
 * ============================================================================
 * SOFT CYBER — PORTFOLIO INTERACTION & CONFIGURATION SCRIPT (js/main.js)
 * Pure Vanilla JavaScript — No external dependencies or build steps required.
 * ============================================================================
 */

/* ----------------------------------------------------------------------------
   1. CENTRAL PORTFOLIO CONFIGURATION (Editable Placeholders)
   Edit the values below to update your name, role, email, and social URLs
   across the entire website automatically.
   ---------------------------------------------------------------------------- */
const PORTFOLIO_CONFIG = {
  ownerName: "Phạm Quân",
  rolePlaceholder: "Cybersecurity student ",
  email: "phamquan270306@gmail.com",
  socials: {
    github: "https://github.com/Aanny27",
    linkedin: "https://www.linkedin.com/in/qu%C3%A2n-ph%E1%BA%A1m-ba1164371",
    facebook: "https://www.facebook.com/quanka27/"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------------------
     2. APPLY CENTRAL CONFIGURATION & COPYRIGHT YEAR
     -------------------------------------------------------------------------- */
  function applyPortfolioConfig() {
    // Update text nodes bound to data-config
    document.querySelectorAll("[data-config='ownerName']").forEach((el) => {
      el.textContent = PORTFOLIO_CONFIG.ownerName;
    });

    document.querySelectorAll("[data-config='rolePlaceholder']").forEach((el) => {
      el.textContent = PORTFOLIO_CONFIG.rolePlaceholder;
    });

    document.querySelectorAll("[data-config='emailDisplay']").forEach((el) => {
      el.textContent = PORTFOLIO_CONFIG.email;
    });

    // Update social links bound to data-social
    document.querySelectorAll("[data-social='github']").forEach((el) => {
      el.setAttribute("href", PORTFOLIO_CONFIG.socials.github);
    });

    document.querySelectorAll("[data-social='linkedin']").forEach((el) => {
      el.setAttribute("href", PORTFOLIO_CONFIG.socials.linkedin);
    });

    document.querySelectorAll("[data-social='facebook']").forEach((el) => {
      el.setAttribute("href", PORTFOLIO_CONFIG.socials.facebook);
    });

    document.querySelectorAll("[data-social='email']").forEach((el) => {
      el.setAttribute("href", `mailto:${PORTFOLIO_CONFIG.email}`);
    });

    const copyBtn = document.getElementById("copy-email-btn");
    if (copyBtn) {
      copyBtn.setAttribute("data-email", PORTFOLIO_CONFIG.email);
    }

    // Dynamic Copyright Year
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  applyPortfolioConfig();

  /* --------------------------------------------------------------------------
     3. OPENING INTRO — CINEMATIC SOC VIDEO & FALLBACK CONTROLLER
     -------------------------------------------------------------------------- */
  const introOverlay = document.getElementById("intro-overlay");
  const introVideo = document.getElementById("intro-video");
  const enterBtn = document.getElementById("enter-portfolio-btn");
  const skipBtn = document.getElementById("skip-intro-btn");
  const skipTopBtn = document.getElementById("skip-intro-top");
  const replayBtn = document.getElementById("replay-intro-btn");
  const videoStatusNote = document.getElementById("video-status-note");
  const introTimecode = document.getElementById("intro-timecode");
  let timecodeInterval = null;

  function formatTimecode(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 24);
    const pad = (n) => String(n).padStart(2, "0");
    return `00:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  }

  function startHudTimecode() {
    stopHudTimecode();
    let startTime = performance.now();
    timecodeInterval = window.setInterval(() => {
      if (!introTimecode) return;
      if (introVideo && !introVideo.paused && !isNaN(introVideo.currentTime)) {
        introTimecode.textContent = formatTimecode(introVideo.currentTime);
      } else {
        const elapsed = (performance.now() - startTime) / 1000;
        introTimecode.textContent = formatTimecode(elapsed);
      }
    }, 100);
  }

  function stopHudTimecode() {
    if (timecodeInterval) {
      clearInterval(timecodeInterval);
      timecodeInterval = null;
    }
  }

  function activateVideoFallback() {
    if (introVideo) {
      introVideo.classList.add("video-fallback-active");
    }
    if (videoStatusNote) {
      videoStatusNote.hidden = false;
    }
  }

  function attemptVideoPlayback() {
    if (!introVideo) return;

    // Respect prefers-reduced-motion: pause video and show calm pastel SOC backdrop
    if (prefersReducedMotion) {
      introVideo.pause();
      introVideo.classList.add("video-fallback-active");
      return;
    }

    introVideo.muted = true;
    const playPromise = introVideo.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          introVideo.classList.remove("video-fallback-active");
          if (videoStatusNote) videoStatusNote.hidden = true;
        })
        .catch(() => {
          // Autoplay blocked or video file missing — show graceful fallback
          activateVideoFallback();
        });
    }
  }

  function dismissIntro() {
    if (!introOverlay) return;
    introOverlay.classList.add("is-hidden");
    document.body.classList.remove("intro-active");
    stopHudTimecode();

    if (introVideo && !introVideo.paused) {
      introVideo.pause();
    }

    // Move keyboard focus smoothly to main content
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus({ preventScroll: true });
    }
  }

  function replayIntro() {
    if (!introOverlay) return;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    introOverlay.classList.remove("is-hidden");
    document.body.classList.add("intro-active");

    if (introVideo) {
      introVideo.currentTime = 0;
      attemptVideoPlayback();
    }

    startHudTimecode();
    if (enterBtn) {
      enterBtn.focus();
    }
  }

  if (introVideo) {
    introVideo.addEventListener("error", activateVideoFallback);
    const videoSource = introVideo.querySelector("source");
    if (videoSource) {
      videoSource.addEventListener("error", activateVideoFallback);
    }
  }

  // Initialize intro on page load
  attemptVideoPlayback();
  startHudTimecode();

  if (enterBtn) enterBtn.addEventListener("click", dismissIntro);
  if (skipBtn) skipBtn.addEventListener("click", dismissIntro);
  if (skipTopBtn) skipTopBtn.addEventListener("click", dismissIntro);
  if (replayBtn) replayBtn.addEventListener("click", replayIntro);

  // Allow Escape key to skip intro immediately
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && introOverlay && !introOverlay.classList.contains("is-hidden")) {
      dismissIntro();
    }
  });

  /* --------------------------------------------------------------------------
     4. RESPONSIVE MOBILE NAVIGATION & ACTIVE SECTION TRACKING
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById("site-header");
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const primaryNav = document.getElementById("primary-nav");
  const navLinks = document.querySelectorAll(".nav-link");

  function closeMobileMenu() {
    if (!mobileMenuToggle || !primaryNav) return;
    mobileMenuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("nav-open");
  }

  if (mobileMenuToggle && primaryNav) {
    mobileMenuToggle.addEventListener("click", () => {
      const isExpanded = mobileMenuToggle.getAttribute("aria-expanded") === "true";
      mobileMenuToggle.setAttribute("aria-expanded", String(!isExpanded));
      primaryNav.classList.toggle("nav-open", !isExpanded);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMobileMenu();
    });
  }

  // Subtle header shadow on scroll
  window.addEventListener("scroll", () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }, { passive: true });

  // Active Section Highlighting via IntersectionObserver
  const sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window && sections.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              const isMatch = link.getAttribute("href") === `#${id}`;
              link.classList.toggle("active", isMatch);
            });
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach((sec) => navObserver.observe(sec));
  }

  /* --------------------------------------------------------------------------
     5. SKILLS FILTERING (ALL / PRACTICED / LEARNING)
     -------------------------------------------------------------------------- */
  const skillFilterBtns = document.querySelectorAll("[data-skill-filter]");
  const skillTags = document.querySelectorAll(".skill-tag");

  skillFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-skill-filter");

      skillFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      skillTags.forEach((tag) => {
        const status = tag.getAttribute("data-status");
        if (filter === "all" || status === filter) {
          tag.classList.remove("is-filtered-out");
        } else {
          tag.classList.add("is-filtered-out");
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     6. PROJECTS CATEGORY FILTERING (ALL / BLUE / RED / PURPLE)
     -------------------------------------------------------------------------- */
  const projectFilterBtns = document.querySelectorAll("[data-project-filter]");
  const projectCards = document.querySelectorAll(".project-card");

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-project-filter");

      projectFilterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      projectCards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        if (category === "all" || cardCat === category) {
          card.classList.remove("is-hidden-card");
        } else {
          card.classList.add("is-hidden-card");
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     7. COPY EMAIL BUTTON WITH ACCESSIBLE CONFIRMATION
     -------------------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const copyEmailText = document.getElementById("copy-email-text");

  if (copyEmailBtn && copyEmailText) {
    copyEmailBtn.addEventListener("click", async () => {
      const emailToCopy = copyEmailBtn.getAttribute("data-email") || PORTFOLIO_CONFIG.email;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement("textarea");
          tempInput.value = emailToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
        }

        const originalLabel = copyEmailText.textContent;
        copyEmailText.textContent = "Copied to Clipboard!";
        copyEmailBtn.classList.add("btn-primary");

        setTimeout(() => {
          copyEmailText.textContent = originalLabel;
          copyEmailBtn.classList.remove("btn-primary");
        }, 2400);
      } catch (err) {
        copyEmailText.textContent = emailToCopy;
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. SCROLL REVEAL ANIMATIONS
     -------------------------------------------------------------------------- */
  const revealItems = document.querySelectorAll(".reveal-item");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }
});