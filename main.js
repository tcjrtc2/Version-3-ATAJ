document.addEventListener("DOMContentLoaded", () => {
  const parallaxLayers = document.querySelectorAll("[data-parallax-layer]");
  const cursorGlow = document.getElementById("cursor-glow");
  const countdownEl = document.querySelector("[data-countdown]");
  const yearEl = document.querySelector("[data-year]");
  const siteHeader = document.querySelector(".site-header");

  const handleParallax = () => {
    const scrollY = window.scrollY;
    parallaxLayers.forEach((layer) => {
      const depth = parseFloat(layer.dataset.parallaxLayer) || 0;
      const translateY = scrollY * depth;
      layer.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
  };

  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  };

  const updateCountdown = () => {
    if (!countdownEl) return;
    const targetDate = new Date(countdownEl.dataset.countdown);
    if (Number.isNaN(targetDate.getTime())) {
      countdownEl.textContent = "Set a valid countdown target.";
      return;
    }

    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      countdownEl.textContent = "Tax Day is here.";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const primeCountdown = () => {
    if (!countdownEl) return;
    updateCountdown();
    setInterval(updateCountdown, 1000);
  };

  const activateCursorGlow = () => {
    if (!cursorGlow) return;
    let glowVisible = false;

    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
      if (!glowVisible) {
        glowVisible = true;
        cursorGlow.style.opacity = "1";
      }
    });

    document.querySelectorAll("a, button, .service-card, .faq-panel, .review-card, .panel, input, select, textarea").forEach((node) => {
      node.addEventListener("pointerenter", () => {
        cursorGlow.style.transition = "opacity 0.25s ease, width 0.25s ease, height 0.25s ease";
        cursorGlow.style.opacity = "0.85";
        cursorGlow.style.width = "180px";
        cursorGlow.style.height = "180px";
      });
      node.addEventListener("pointerleave", () => {
        cursorGlow.style.transition = "opacity 0.4s ease, width 0.4s ease, height 0.4s ease";
        cursorGlow.style.opacity = "1";
        cursorGlow.style.width = "140px";
        cursorGlow.style.height = "140px";
      });
    });
  };

  const enableButtonRipples = () => {
    document.querySelectorAll(".btn").forEach((button) => {
      button.addEventListener("pointerdown", (event) => {
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        button.appendChild(ripple);
        ripple.addEventListener("animationend", () => {
          ripple.remove();
        });
      });
    });
  };

  const manageFaqPanels = () => {
    const panels = document.querySelectorAll(".faq-panel");
    panels.forEach((panel) => {
      panel.addEventListener("toggle", () => {
        if (panel.open) {
          panels.forEach((other) => {
            if (other !== panel) other.open = false;
          });
        }
      });
    });
  };

  const stampYear = () => {
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  };

  const animateOnScroll = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".service-card, .review-card, .panel, .faq-panel").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  };

  window.addEventListener("scroll", () => {
    handleParallax();
    handleHeaderScroll();
  }, { passive: true });
  
  handleParallax();
  handleHeaderScroll();
  primeCountdown();
  activateCursorGlow();
  enableButtonRipples();
  manageFaqPanels();
  stampYear();
  animateOnScroll();
});
