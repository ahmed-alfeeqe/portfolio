// ==========================================================================
// Ahmed Mohamed Zaki - High-End Interactive & Animated Portfolio Logic
// Features: Canvas Particle Network, Typewriter, Scroll Reveal, Number Counter,
// Spotlight Mouse Effect, 3D Card Tilt, and Chart.js BI Simulation
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Interactive Data Network Canvas in Hero
  initParticleNetwork();

  // 3. Dynamic Typewriter Effect for Hero Headline
  initTypewriter();

  // 4. Scroll Reveal Intersection Observer
  initScrollReveal();

  // 5. Dynamic Spotlight Cursor Follower on Cards
  initSpotlightEffect();

  // 6. Interactive 3D Card Tilt
  init3DTilt();

  // 7. Navbar Sticky Scroll Glass Effect
  initNavbarScroll();

  // 8. Mobile Menu Toggle
  initMobileMenu();

  // 9. Interactive Chart.js Simulation
  initChartSimulation();

  // 10. Contact Form & WhatsApp Handlers
  initContactHandlers();
});

// --------------------------------------------------------------------------
// 2. Particle Data Network (Nodes & Connections)
// --------------------------------------------------------------------------
function initParticleNetwork() {
  const canvas = document.getElementById('data-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.parentElement.offsetHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const particleCount = Math.floor(Math.min(width, 1200) / 22);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  let mouse = { x: null, y: null, maxDist: 120 };

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY <= rect.bottom) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.maxDist) {
          p.x += (dx / dist) * 0.3;
          p.y += (dy / dist) * 0.3;
        }
      }

      // Draw particle node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
      ctx.fill();

      // Connect nearby particles (Graph edges)
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const edgeAlpha = (1 - dist / 100) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${edgeAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// --------------------------------------------------------------------------
// 3. Dynamic Typewriter Effect
// --------------------------------------------------------------------------
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const phrases = [
    "Actionable Business Intelligence.",
    "Executive Power BI Dashboards.",
    "Star Schema & Scalable Data Models.",
    "Algorithmic Data Solutions."
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      target.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      typingSpeed = 2200; // Pause at end of sentence
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400; // Pause before new sentence
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// --------------------------------------------------------------------------
// 4. Scroll Reveal Intersection Observer & Counter Animation
// --------------------------------------------------------------------------
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // Animate any number counters inside this revealed block
        const counters = entry.target.querySelectorAll('.counter-val');
        counters.forEach(counter => {
          if (!counter.dataset.animated) {
            animateCounter(counter);
            counter.dataset.animated = 'true';
          }
        });

        // Animate any progress bars
        const bars = entry.target.querySelectorAll('.skill-bar-fill');
        bars.forEach(bar => {
          const targetWidth = bar.dataset.targetWidth || '80%';
          bar.style.width = targetWidth;
        });

        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// Counter Animator
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 1600;
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth easeOutCubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = easeProgress * target;

    el.textContent = `${prefix}${isDecimal ? currentVal.toFixed(1) : Math.floor(currentVal)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      el.textContent = `${prefix}${isDecimal ? target.toFixed(1) : target}${suffix}`;
    }
  }

  requestAnimationFrame(updateCount);
}

// --------------------------------------------------------------------------
// 5. Spotlight Cursor Follower on Cards
// --------------------------------------------------------------------------
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.spotlight-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// --------------------------------------------------------------------------
// 6. Interactive 3D Card Tilt
// --------------------------------------------------------------------------
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (-y / (rect.height / 2)) * 6;
      const rotateY = (x / (rect.width / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// --------------------------------------------------------------------------
// 7. Navbar Sticky Scroll Glass Effect
// --------------------------------------------------------------------------
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled-nav');
    } else {
      navbar.classList.remove('scrolled-nav');
    }
  });
}

// --------------------------------------------------------------------------
// 8. Mobile Menu Toggle
// --------------------------------------------------------------------------
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// --------------------------------------------------------------------------
// 9. Interactive Chart.js Simulation
// --------------------------------------------------------------------------
function initChartSimulation() {
  const ctx = document.getElementById('swvlChart');
  if (!ctx || !window.Chart) return;

  let currentChart = null;

  const revenueData = {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Net Sales ($K)',
          data: [210, 245, 280, 260, 310, 340, 385, 415, 395, 435, 480, 530],
          backgroundColor: 'rgba(16, 185, 129, 0.45)',
          borderColor: '#10b981',
          borderWidth: 2,
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Profit Margin (%)',
          data: [20.5, 21.8, 22.4, 21.9, 23.6, 24.2, 25.4, 26.1, 25.8, 26.9, 27.5, 28.3],
          type: 'line',
          borderColor: '#06b6d4',
          backgroundColor: '#06b6d4',
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
        easing: 'easeOutQuart'
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 12 }
          }
        },
        tooltip: {
          backgroundColor: '#0B0F19',
          borderColor: '#374151',
          borderWidth: 1,
          titleFont: { family: 'Outfit', size: 13, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 12 },
          padding: 10
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#64748b', font: { family: 'Fira Code', size: 10 } }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#10b981', font: { family: 'Fira Code', size: 10 } }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: {
            color: '#06b6d4',
            font: { family: 'Fira Code', size: 10 },
            callback: value => value + '%'
          }
        }
      }
    }
  };

  const regionalData = {
    type: 'doughnut',
    data: {
      labels: ['North America (US/CA)', 'Europe West', 'Middle East Metro', 'Australia & Pacific', 'Latin America'],
      datasets: [{
        data: [44, 25, 16, 9, 6],
        backgroundColor: [
          '#10b981',
          '#06b6d4',
          '#3b82f6',
          '#8b5cf6',
          '#f59e0b'
        ],
        borderWidth: 2,
        borderColor: '#0B0F19',
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 900
      },
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: '#cbd5e1',
            font: { family: 'Inter', size: 12 },
            padding: 16
          }
        },
        tooltip: {
          backgroundColor: '#0B0F19',
          borderColor: '#374151',
          borderWidth: 1,
          callbacks: {
            label: function(context) {
              return ` ${context.label}: ${context.raw}% of Territory Volume`;
            }
          }
        }
      }
    }
  };

  currentChart = new Chart(ctx, revenueData);

  const btnRevenue = document.getElementById('btn-revenue');
  const btnRegional = document.getElementById('btn-regional');
  const btnDax = document.getElementById('btn-dax');
  const chartView = document.getElementById('chart-view');
  const daxView = document.getElementById('dax-view');
  const tabs = [btnRevenue, btnRegional, btnDax];

  function setActiveTab(activeBtn) {
    tabs.forEach(tab => {
      tab.classList.remove('bg-emerald-500/20', 'text-emerald-400');
      tab.classList.add('text-slate-400');
    });
    activeBtn.classList.add('bg-emerald-500/20', 'text-emerald-400');
    activeBtn.classList.remove('text-slate-400');
  }

  if (btnRevenue) {
    btnRevenue.addEventListener('click', () => {
      setActiveTab(btnRevenue);
      chartView.classList.remove('hidden');
      daxView.classList.add('hidden');
      if (currentChart) currentChart.destroy();
      currentChart = new Chart(ctx, revenueData);
    });
  }

  if (btnRegional) {
    btnRegional.addEventListener('click', () => {
      setActiveTab(btnRegional);
      chartView.classList.remove('hidden');
      daxView.classList.add('hidden');
      if (currentChart) currentChart.destroy();
      currentChart = new Chart(ctx, regionalData);
    });
  }

  if (btnDax) {
    btnDax.addEventListener('click', () => {
      setActiveTab(btnDax);
      chartView.classList.add('hidden');
      daxView.classList.remove('hidden');
    });
  }
}

// --------------------------------------------------------------------------
// 10. Contact Form & WhatsApp Handlers
// --------------------------------------------------------------------------
function initContactHandlers() {
  const contactForm = document.getElementById('contact-form');
  const whatsappBtn = document.getElementById('whatsapp-btn');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      const subject = encodeURIComponent(`Data Analytics Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Ahmed,\n\nMy name is ${name} (${email}).\n\n${message}\n\nBest regards,\n${name}`);

      window.location.href = `mailto:ahmedzaki8545@gmail.com?subject=${subject}&body=${body}`;

      if (formSuccess) {
        formSuccess.classList.remove('hidden');
        setTimeout(() => {
          formSuccess.classList.add('hidden');
        }, 5000);
      }
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const name = document.getElementById('contact-name').value.trim() || 'Visitor';
      const message = document.getElementById('contact-message').value.trim() || 'Hi Ahmed, I saw your Data Analyst portfolio and would like to connect!';
      const text = encodeURIComponent(`Hello Ahmed! My name is ${name}.\n${message}`);
      window.open(`https://wa.me/201097175629?text=${text}`, '_blank');
    });
  }
}
