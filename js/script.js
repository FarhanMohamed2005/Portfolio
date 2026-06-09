/* ========================================
   PORTFOLIO WEBSITE - INTERACTIVITY
   ======================================== */

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
    // Update ARIA attribute
    const isActive = nav.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isActive);
  });

  // Close menu when link is clicked
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('section, article, .card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(el);
});

// Form Validation & Submission
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  // Real-time validation
  const inputs = contactForm.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  // Form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    // Submit form using Formspree
    const formData = new FormData(contactForm);
    
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showSuccessMessage();
        contactForm.reset();
        inputs.forEach(input => input.classList.remove('error'));
      } else {
        showErrorMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      showErrorMessage('An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  });
}

// Field validation function
function validateField(field) {
  const errorElement = field.parentElement.querySelector('.form-error');
  let isValid = true;
  let errorMessage = '';

  // Check if field is empty
  if (field.value.trim() === '') {
    isValid = false;
    errorMessage = `${field.getAttribute('aria-label') || field.name} is required`;
  } 
  // Email validation
  else if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(field.value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }
  // Phone validation (optional, only if filled)
  else if (field.name === 'phone' && field.value.trim() !== '') {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(field.value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }
  }
  // Minimum length for message
  else if (field.name === 'message' && field.value.trim().length < 10) {
    isValid = false;
    errorMessage = 'Message must be at least 10 characters long';
  }

  // Update UI
  if (isValid) {
    field.classList.remove('error');
    if (errorElement) errorElement.classList.remove('show');
  } else {
    field.classList.add('error');
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
    }
  }

  return isValid;
}

// Show success message
function showSuccessMessage() {
  const successElement = document.querySelector('.form-success');
  if (successElement) {
    successElement.classList.add('show');
    // Hide after 5 seconds
    setTimeout(() => {
      successElement.classList.remove('show');
    }, 5000);
  }
}

// Show error message
function showErrorMessage(message) {
  const successElement = document.querySelector('.form-success');
  if (successElement) {
    successElement.textContent = message;
    successElement.style.background = 'var(--danger)';
    successElement.classList.add('show');
    setTimeout(() => {
      successElement.classList.remove('show');
      successElement.style.background = 'var(--success)';
    }, 5000);
  }
}

// Accessibility: Skip to main content
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
    }
  });
}

// Keyboard navigation for cards
document.querySelectorAll('.card, .project-card').forEach(card => {
  card.addEventListener('keydown', (e) => {
    // Allow cards to be focused and accessed via keyboard
    if (e.key === 'Enter' || e.key === ' ') {
      const link = card.querySelector('a');
      if (link) {
        link.click();
      }
    }
  });
});

// Active navigation link highlighting
window.addEventListener('load', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
      link.style.color = 'var(--accent)';
    }
  });
});

// Lazy load images (if added later)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Print functionality
window.addEventListener('beforeprint', () => {
  document.body.style.fontSize = '12pt';
});

window.addEventListener('afterprint', () => {
  document.body.style.fontSize = '';
});

// Accessibility announcement for dynamic content
function announceToScreenReaders(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio website loaded successfully');
  
  // Ensure mobile menu button has proper ARIA attributes
  if (mobileMenuBtn) {
    mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }
});
