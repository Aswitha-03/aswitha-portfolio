/* ==========================================================================
   ASWITHA B - PORTFOLIO INTERACTIVE APPLICATION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initThemeToggle();
  initNavigation();
  initSkillFilters();
  initProjectDemos();
  initResumeModals();
  initContactForm();
});

/* ==========================================================================
   1. PARTICLE CONSTELLATION BACKGROUND CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let particles = [];
  const particleCount = Math.min(Math.floor(width / 15), 70);

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#8b5cf6' : '#06b6d4';
    }

    update() {
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      this.x += this.vx;
      this.y += this.vy;

      // Mouse attraction / bounce
      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          this.x -= dx * 0.02;
          this.y -= dy * 0.02;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.5;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = '#8b5cf6';
          ctx.globalAlpha = (1 - dist / 130) * 0.15;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. THEME TOGGLE (DARK / LIGHT ACCENT)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    toggleBtn.innerHTML = newTheme === 'light' 
      ? '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>' 
      : '<i class="fa-solid fa-moon"></i>';

    showToast(`Switched to ${newTheme.toUpperCase()} theme mode!`);
  });
}

/* ==========================================================================
   3. NAVIGATION LOGIC & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Navbar Blur
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Highlighting
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }
}

/* ==========================================================================
   4. SKILL MATRIX FILTERING
   ========================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE PROJECT DEMO MODALS
   ========================================================================== */
function initProjectDemos() {
  const demoModal = document.getElementById('demo-modal');
  const demoTitle = document.getElementById('demo-modal-title');
  const demoBody = document.getElementById('demo-modal-body');
  const closeBtn = document.getElementById('btn-close-demo-modal');
  const demoBtns = document.querySelectorAll('.btn-demo');

  demoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const demoType = btn.getAttribute('data-demo');
      openDemoModal(demoType);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      demoModal.classList.remove('active');
    });
  }

  function openDemoModal(type) {
    demoModal.classList.add('active');

    if (type === 'deepfake') {
      demoTitle.innerText = 'Deepfake Audio Detection Simulator';
      demoBody.innerHTML = `
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Simulate acoustic feature extraction (MFCC & Mel Spectrogram) through CNN spatial filtering and BiLSTM attention feature classification.
        </p>

        <div class="demo-sandbox">
          <label style="font-weight: 600; font-size: 0.85rem;">Select Audio Sample:</label>
          <select id="audio-sample-select" class="form-input" style="margin-top: 0.4rem; margin-bottom: 1rem;">
            <option value="fake">Sample 1: AI Generated Voice Clone (Deepfake Candidate)</option>
            <option value="real">Sample 2: Authentic Human Speech Recording</option>
          </select>

          <button class="btn btn-primary btn-sm" id="btn-run-audio-analysis" style="width: 100%;">
            <i class="fa-solid fa-microchip"></i> Run CNN-BiLSTM Feature Analysis
          </button>

          <div class="audio-waveform-visualizer" id="wave-container">
            ${Array(35).fill(0).map(() => `<div class="wave-bar"></div>`).join('')}
          </div>

          <div id="audio-result-box" style="display: none; padding: 1rem; border-radius: var(--radius-sm); text-align: center; margin-top: 1rem;">
          </div>
        </div>
      `;

      document.getElementById('btn-run-audio-analysis').addEventListener('click', runAudioDemo);

    } else if (type === 'fakenews') {
      demoTitle.innerText = 'Fake News Credibility Classifier';
      demoBody.innerHTML = `
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Test TF-IDF text vectorization and Logistic Regression / Random Forest classification model.
        </p>

        <div class="demo-sandbox">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.8rem;">
            <button class="btn btn-outline btn-sm" id="preset-real">Sample Real News</button>
            <button class="btn btn-outline btn-sm" id="preset-fake">Sample Fake Headline</button>
          </div>

          <textarea id="news-text-input" class="form-textarea" placeholder="Paste news headline or paragraph here..."></textarea>

          <button class="btn btn-primary btn-sm" id="btn-run-news-nlp" style="width: 100%; margin-top: 1rem;">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Classify Article Credibility
          </button>

          <div id="news-result-box" style="display: none; padding: 1rem; border-radius: var(--radius-sm); margin-top: 1rem;">
          </div>
        </div>
      `;

      document.getElementById('preset-real').addEventListener('click', () => {
        document.getElementById('news-text-input').value = "NASA satellite mission successfully transmits ocean temperature and climate dataset to ground control servers.";
      });
      document.getElementById('preset-fake').addEventListener('click', () => {
        document.getElementById('news-text-input').value = "Breaking: Secret lunar base confirmed after scientists find alien technology inside volcano!";
      });
      document.getElementById('btn-run-news-nlp').addEventListener('click', runNewsNLP);

    } else if (type === 'flashcard') {
      demoTitle.innerText = 'Smart AI Flashcard Generator';
      demoBody.innerHTML = `
        <p style="color: var(--text-muted); font-size: 0.95rem;">
          Auto-summarize study notes into active recall flashcards. Click the card below to flip!
        </p>

        <div class="demo-sandbox">
          <div class="flashcard-3d" id="interactive-card">
            <div class="flashcard-inner">
              <div class="flashcard-front">
                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--secondary); font-weight: 700;">Question (Click to Flip)</span>
                <h4 style="font-size: 1.15rem; margin-top: 0.8rem;" id="card-q">What is the advantage of using CNN combined with BiLSTM for audio analysis?</h4>
              </div>
              <div class="flashcard-back">
                <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--primary); font-weight: 700;">Answer</span>
                <p style="font-size: 0.95rem; margin-top: 0.5rem;" id="card-a">CNN extracts local spatial acoustic spectral features (MFCCs), while BiLSTM captures long-term temporal sequence patterns across time frames.</p>
              </div>
            </div>
          </div>

          <button class="btn btn-secondary btn-sm" id="btn-next-card" style="width: 100%; margin-top: 1rem;">
            <i class="fa-solid fa-forward"></i> Generate Next Sample Card
          </button>
        </div>
      `;

      const card = document.getElementById('interactive-card');
      card.addEventListener('click', () => card.classList.toggle('flipped'));

      const cardsData = [
        { q: "What is TF-IDF in Natural Language Processing?", a: "Term Frequency-Inverse Document Frequency reflects how important a word is to a document relative to a corpus." },
        { q: "What role does MongoDB play in the Flashcard app?", a: "MongoDB stores user credentials, upload note histories, and generated flashcard document collections." },
        { q: "Why use Attention Mechanisms in Deepfake Detection?", a: "Attention highlights key acoustic frequency frames that contain synthetic artifacts or deepfake anomalies." }
      ];
      let cardIdx = 0;

      document.getElementById('btn-next-card').addEventListener('click', () => {
        cardIdx = (cardIdx + 1) % cardsData.length;
        card.classList.remove('flipped');
        setTimeout(() => {
          document.getElementById('card-q').innerText = cardsData[cardIdx].q;
          document.getElementById('card-a').innerText = cardsData[cardIdx].a;
        }, 200);
      });
    }
  }
}

// Audio Demo Simulation Logic
function runAudioDemo() {
  const sampleVal = document.getElementById('audio-sample-select').value;
  const bars = document.querySelectorAll('.wave-bar');
  const resultBox = document.getElementById('audio-result-box');

  bars.forEach(b => b.classList.add('active'));
  resultBox.style.display = 'block';
  resultBox.className = 'glass-card';
  resultBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Extracting MFCC Spectral Features...`;

  setTimeout(() => {
    bars.forEach(b => b.classList.remove('active'));
    if (sampleVal === 'fake') {
      resultBox.style.background = 'rgba(236, 72, 153, 0.15)';
      resultBox.style.border = '1px solid var(--accent)';
      resultBox.innerHTML = `
        <h4 style="color: var(--accent);"><i class="fa-solid fa-triangle-exclamation"></i> DEEPFAKE AUDIO DETECTED</h4>
        <p style="font-size: 0.85rem; margin-top: 0.3rem;">AI Voice Clone Confidence: <strong>98.7%</strong></p>
        <span style="font-size: 0.75rem; color: var(--text-muted);">BiLSTM Attention anomaly spotted in high-frequency spectral phase transitions.</span>
      `;
    } else {
      resultBox.style.background = 'rgba(16, 185, 129, 0.15)';
      resultBox.style.border = '1px solid var(--success)';
      resultBox.innerHTML = `
        <h4 style="color: var(--success);"><i class="fa-solid fa-circle-check"></i> AUTHENTIC HUMAN SPEECH</h4>
        <p style="font-size: 0.85rem; margin-top: 0.3rem;">Real Recording Confidence: <strong>99.2%</strong></p>
        <span style="font-size: 0.75rem; color: var(--text-muted);">Natural pitch variations and human vocal tract resonances verified.</span>
      `;
    }
  }, 1800);
}

// News NLP Demo Simulation Logic
function runNewsNLP() {
  const text = document.getElementById('news-text-input').value.trim();
  const resultBox = document.getElementById('news-result-box');

  if (!text) {
    alert("Please enter text or select a preset sample.");
    return;
  }

  resultBox.style.display = 'block';
  resultBox.className = 'glass-card';
  resultBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Vectorizing Text with TF-IDF & Running Random Forest Classifier...`;

  setTimeout(() => {
    const isFake = text.toLowerCase().includes('lunar') || text.toLowerCase().includes('secret') || text.toLowerCase().includes('alien') || text.toLowerCase().includes('flight');
    if (isFake) {
      resultBox.style.background = 'rgba(236, 72, 153, 0.15)';
      resultBox.style.border = '1px solid var(--accent)';
      resultBox.innerHTML = `
        <h4 style="color: var(--accent);"><i class="fa-solid fa-circle-xmark"></i> Flagged as FAKE / UNVERIFIED NEWS</h4>
        <p style="font-size: 0.85rem; margin-top: 0.3rem;">Fake Score Probability: <strong>94.5%</strong></p>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">
          Extracted TF-IDF Key Vectors: <em>lunar, secret, confirmed, alien</em>
        </div>
      `;
    } else {
      resultBox.style.background = 'rgba(16, 185, 129, 0.15)';
      resultBox.style.border = '1px solid var(--success)';
      resultBox.innerHTML = `
        <h4 style="color: var(--success);"><i class="fa-solid fa-circle-check"></i> Classified as REAL NEWS</h4>
        <p style="font-size: 0.85rem; margin-top: 0.3rem;">Real Article Confidence: <strong>96.8%</strong></p>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.4rem;">
          Extracted TF-IDF Key Vectors: <em>nasa, satellite, ocean, temperature</em>
        </div>
      `;
    }
  }, 1200);
}

/* ==========================================================================
   6. RESUME MODAL & DOWNLOAD LOGIC
   ========================================================================== */
function initResumeModals() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('btn-open-resume-modal');
  const closeBtn = document.getElementById('btn-close-resume-modal');
  const quickDlBtn = document.getElementById('btn-quick-download-resume');
  const printBtn = document.getElementById('btn-print-resume');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.add('active'));
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (quickDlBtn) {
    quickDlBtn.addEventListener('click', generateResumeDownload);
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function generateResumeDownload() {
  const resumeText = `==================================================================
ASWITHA B - SOFTWARE DEVELOPER
Email: aswithabalu03102006@gmail.com | Phone: +91 8778636779
Location: Tamil Nadu, India
==================================================================

PROFESSIONAL SUMMARY:
Aspiring Software Developer with a strong foundation in Java, Python, and Full Stack Web Development, backed by hands-on project experience in Machine Learning and Deep Learning. Proficient in building end-to-end applications from REST APIs to responsive frontends with a solid grasp of DSA and OOP.

EDUCATION:
- B.E. Computer Science and Engineering | Nandha College of Technology, Erode (2023 - 2027) | CGPA: 7.91
- HSC | Govt Girls HSS, Mettupalayam (2022 - 2023) | Percentage: 83%
- SSLC | Govt Girls HSS, Mettupalayam (2020 - 2021)

TECHNICAL SKILLS:
- Languages: Java, Python
- Web Tech: HTML, CSS, JavaScript, Flask REST APIs
- Tools & DB: Git, GitHub, Firebase, MongoDB
- Concepts: Data Structures & Algorithms, OOP, Machine Learning Basics, Deep Learning Basics

PROJECTS:
1. Deep Learning Deepfake Audio Detection System (Python, CNN, BiLSTM, Attention)
   - Built DL audio classifier (Real vs Deepfake) combining CNN & BiLSTM with Attention on MFCCs.
2. Fake News Detection System (Python, NLP, Scikit-learn, TF-IDF)
   - Developed ML NLP text classifier using Logistic Regression and Random Forest models.
3. Smart Flashcard Generator (HTML, CSS, JS, Flask, MongoDB)
   - AI-powered web app auto-generating study flashcards and quizzes from uploaded notes.

INTERNSHIPS:
- Azhizen Solutions (Jun 2025 - Jul 2025) | Full Stack Development Intern
- Training Trains, Erode (Jan 2025 - Feb 2025) | Full Stack Development Intern

CERTIFICATIONS:
- NPTEL Programming in Java (2024)
- NPTEL Cloud Computing (Elite - 2024)
- NPTEL DSA in Java (2025)
- NPTEL Intro to IoT (Elite + Silver - 2026)
- HackerRank Python, Java & JavaScript Badges
==================================================================`;

  const blob = new Blob([resumeText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ASWITHA_B_Resume.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Resume downloaded successfully!');
}

/* ==========================================================================
   7. CONTACT FORM SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('user-name').value;
    showToast(`Thank you ${name}! Your message has been sent successfully.`);
    form.reset();
  });
}

/* ==========================================================================
   8. TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast-notif');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.innerText = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
