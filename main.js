// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Navbar background opacity on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) navbar.style.background = 'rgba(10, 10, 10, 0.98)';
  else navbar.style.background = 'rgba(10, 10, 10, 0.95)';
});
// Server Rules Modal functionality
const rulesBtn = document.getElementById('rulesBtn');
const rulesModal = document.getElementById('rulesModal');
const closeRules = document.getElementById('closeRules');

// Open rules modal
if (rulesBtn && rulesModal) {
  rulesBtn.addEventListener('click', () => {
    rulesModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  });
}

// Close rules modal
if (closeRules && rulesModal) {
  closeRules.addEventListener('click', () => {
    rulesModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  });
}

// Close modal when clicking outside content
if (rulesModal) {
  rulesModal.addEventListener('click', (e) => {
    if (e.target === rulesModal) {
      rulesModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && rulesModal.classList.contains('active')) {
    rulesModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});
// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle && navLinks) {
  mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  });

  // Close mobile menu when clicking on links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    });
  });
}

// Scroll indicator functionality
const scrollIndicator = document.querySelector('.discover-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Gallery Carousel functionality - FIXED VERSION
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const thumbnails = document.querySelectorAll('.thumbnail');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateCarousel(slideIndex) {
  // Ensure valid slide index with proper wrapping
  if (slideIndex < 0) slideIndex = slides.length - 1;
  if (slideIndex >= slides.length) slideIndex = 0;

  // Remove active class from all elements
  slides.forEach(slide => slide.classList.remove('active', 'prev'));
  indicators.forEach(indicator => indicator.classList.remove('active'));
  thumbnails.forEach(thumbnail => thumbnail.classList.remove('active'));

  // Add active class to current elements
  if (slides[slideIndex]) slides[slideIndex].classList.add('active');
  if (indicators[slideIndex]) indicators[slideIndex].classList.add('active');
  if (thumbnails[slideIndex]) thumbnails[slideIndex].classList.add('active');

  currentSlide = slideIndex;
}

function nextSlide() { updateCarousel(currentSlide + 1); }
function prevSlide() { updateCarousel(currentSlide - 1); }

// Event listeners for carousel navigation buttons
if (nextBtn) {
  nextBtn.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    nextSlide(); stopAutoPlay(); startAutoPlay();
  });
}
if (prevBtn) {
  prevBtn.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    prevSlide(); stopAutoPlay(); startAutoPlay();
  });
}

// Event listeners for indicators
indicators.forEach((indicator, index) => {
  indicator.addEventListener('click', (e) => {
    e.preventDefault();
    updateCarousel(index); stopAutoPlay(); startAutoPlay();
  });
});

// Event listeners for thumbnails
thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener('click', (e) => {
    e.preventDefault();
    updateCarousel(index); stopAutoPlay(); startAutoPlay();
  });
});

// Auto-play carousel
let autoPlayInterval;
function startAutoPlay() {
  stopAutoPlay(); // Clear any existing interval
  if (slides.length > 1) autoPlayInterval = setInterval(nextSlide, 5000);
}
function stopAutoPlay() {
  if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; }
}

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', () => {
  if (slides.length > 0) { updateCarousel(0); startAutoPlay(); }
});

// Pause auto-play on hover
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
  carouselContainer.addEventListener('mouseenter', stopAutoPlay);
  carouselContainer.addEventListener('mouseleave', startAutoPlay);

  // Touch support for mobile swipe navigation
  let startX = 0, endX = 0, startY = 0, endY = 0;

  carouselContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    stopAutoPlay();
  }, { passive: true });

  carouselContainer.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
    endY = e.touches[0].clientY;
  }, { passive: true });

  carouselContainer.addEventListener('touchend', () => {
    const threshold = 50;
    const xDiff = startX - endX;
    const yDiff = Math.abs(startY - endY);

    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(xDiff) > threshold && Math.abs(xDiff) > yDiff) {
      if (xDiff > 0) nextSlide();     // Swipe left - next slide
      else prevSlide();               // Swipe right - previous slide
    }
    startAutoPlay();
  }, { passive: true });
}

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
  const carouselSection = document.querySelector('.gallery');
  const rect = carouselSection.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom > 0;

  if (isInView) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); stopAutoPlay(); startAutoPlay(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); nextSlide(); stopAutoPlay(); startAutoPlay(); }
  }
});

// Feature cards intersection observer for staggered animation
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Initialize feature cards animation
document.querySelectorAll('.feature-card').forEach((card, index) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(50px)';
  card.style.transition = `all 0.6s ease ${index * 0.2}s`;
  observer.observe(card);
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('.newsletter-input').value;

    if (email && email.includes('@')) {
      const btn = this.querySelector('.newsletter-btn');
      const originalText = btn.textContent;
      btn.textContent = 'Subscribed!';
      btn.style.background = '#28a745';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        this.reset();
      }, 3000);
    } else {
      const input = this.querySelector('.newsletter-input');
      input.style.borderColor = '#dc3545';
      input.placeholder = 'Please enter a valid email';

      setTimeout(() => {
        input.style.borderColor = '';
        input.placeholder = 'Enter your email...';
      }, 3000);
    }
  });
}

// Parallax effect for hero background
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  const rate = scrolled * -0.5;
  if (hero) hero.style.backgroundPosition = `center ${rate}px`;
});

// Initialize page animations
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }
  }, 100);
});
