/* Premium Portfolio Javascript - A. Mahalakshmi */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Theme Management ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = themeToggleBtn.querySelector("i");
  const htmlElement = document.documentElement;

  // Retrieve cached theme or match system preference
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  // Apply theme
  htmlElement.setAttribute("data-theme", initialTheme);
  updateThemeIcon(initialTheme);

  // Theme Toggle Event
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.className = "fas fa-sun";
    } else {
      themeIcon.className = "fas fa-moon";
    }
  }

  // --- 2. Mobile Menu Toggle ---
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  mobileToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const icon = mobileToggle.querySelector("i");
    if (navMenu.classList.contains("active")) {
      icon.className = "fas fa-times";
    } else {
      icon.className = "fas fa-bars";
    }
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      mobileToggle.querySelector("i").className = "fas fa-bars";
    });
  });

  // --- 3. Typing Animation ---
  const typingTextElement = document.getElementById("typing-text");
  const roles = [
    "Java & Python Developer",
    "AI & Django Web Developer"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1500; // Pause at full text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next wave
    }

    setTimeout(typeEffect, typingSpeed);
  }
  // Start typing
  setTimeout(typeEffect, 1000);

  // --- 4. Interactive Connected Node Canvas (Circuit/ECE theme) ---
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  const numberOfParticles = 65;

  // Fit canvas to window sizes
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1; // particle size (1-3px)
      this.speedX = Math.random() * 0.8 - 0.4;
      this.speedY = Math.random() * 0.8 - 0.4;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce-back off canvas boundaries
      if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
      if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
    }

    draw() {
      // Find theme color for particles
      const isDark = htmlElement.getAttribute("data-theme") === "dark";
      ctx.fillStyle = isDark ? "rgba(34, 211, 238, 0.4)" : "rgba(37, 99, 235, 0.25)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Initialize Particles
  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }
  initParticles();

  // Animate Particles & draw circuit links
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = htmlElement.getAttribute("data-theme") === "dark";
    
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }

    // Connect dots with thin lines depending on distance
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          let alpha = (1 - (distance / 120)) * 0.15;
          ctx.strokeStyle = isDark 
            ? `rgba(34, 211, 238, ${alpha})` 
            : `rgba(29, 78, 216, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // Re-init particles on resize to redistributing them
  window.addEventListener("resize", () => {
    initParticles();
  });

  // --- 5. Scroll Reveals using IntersectionObserver ---
  const revealElements = document.querySelectorAll(".reveal");
  const skillBarContainer = document.querySelector(".skills-container");
  const statsSection = document.querySelector(".about-grid");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // Skill progress fill animation on reveal
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressFills = entry.target.querySelectorAll(".progress-fill");
        progressFills.forEach(fill => {
          const targetPercent = fill.getAttribute("data-percent");
          fill.style.width = targetPercent + "%";
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (skillBarContainer) {
    skillObserver.observe(skillBarContainer);
  }

  // Count up stats variables
  let statsTriggered = false;
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        const statNumbers = document.querySelectorAll(".stat-number");
        
        statNumbers.forEach(stat => {
          const targetValue = parseFloat(stat.getAttribute("data-target"));
          const duration = 1500; // ms
          const frameRate = 60;
          const totalFrames = (duration / 1000) * frameRate;
          let currentFrame = 0;
          
          let incrementValue = targetValue / totalFrames;
          let isDecimal = targetValue % 1 !== 0;

          const counterInterval = setInterval(() => {
            currentFrame++;
            let currentValue = incrementValue * currentFrame;

            if (currentFrame >= totalFrames) {
              clearInterval(counterInterval);
              stat.textContent = isDecimal ? targetValue.toFixed(2) : Math.round(targetValue);
            } else {
              stat.textContent = isDecimal ? currentValue.toFixed(2) : Math.round(currentValue);
            }
          }, 1000 / frameRate);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // --- 6. Active Nav Link Highlighting on Scroll ---
  const sections = document.querySelectorAll("section[id], #home");
  
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute("id");
      
      const link = document.querySelector(`.nav-link[href*="${sectionId}"]`);
      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
          link.classList.add("active");
        }
      }
    });

    // Toggle scroll top button visibility
    const scrollTopBtn = document.getElementById("scroll-top");
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  // --- 7. Scroll to Top Trigger ---
  const scrollTopBtn = document.getElementById("scroll-top");
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // --- 8. Dummy Form Submit alert ---
  const contactForm = document.getElementById("portfolio-contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for your message, Mahalakshmi will get back to you soon!");
      contactForm.reset();
    });
  }
});
