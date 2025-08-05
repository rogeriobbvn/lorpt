// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize tabs
  initTabs();
  
  // Initialize parallax effect
  initParallax();
  
  // Add scroll animations
  initScrollAnimations();
  
  // Initialize tournament selector
  initTournamentSelector();
});

// Tab functionality
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to current button and content
      button.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Parallax effect for hero section
function initParallax() {
  const parallaxBg = document.querySelector('.parallax-bg');
  const parallaxElements = document.querySelectorAll('.parallax-element');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Move background at a different speed than scroll
    if (parallaxBg) {
      parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Move each parallax element at different speeds
    parallaxElements.forEach((element, index) => {
      const speed = element.getAttribute('data-speed') || 0.2 + (index * 0.1);
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
  
  // Mouse move parallax effect
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    parallaxElements.forEach((element, index) => {
      const speed = element.getAttribute('data-mouse-speed') || 0.03 + (index * 0.01);
      const xPos = (window.innerWidth / 2 - mouseX) * speed;
      const yPos = (window.innerHeight / 2 - mouseY) * speed;
      
      element.style.transform = `translate(${xPos}px, ${yPos}px)`;
    });
  });
}

// Scroll animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  }
  
  // Add animation class when element is in viewport
  function checkVisibility() {
    animatedElements.forEach(element => {
      if (isInViewport(element)) {
        element.classList.add('visible');
      }
    });
  }
  
  // Initial check
  checkVisibility();
  
  // Check on scroll
  window.addEventListener('scroll', checkVisibility);
}

// Create SVG elements for parallax background
function createSVGElements() {
  const svgContainer = document.querySelector('.svg-parallax');
  if (!svgContainer) return;
  
  // Create random shapes
  const shapes = [
    { type: 'circle', count: 5 },
    { type: 'rect', count: 5 },
    { type: 'polygon', count: 3 }
  ];
  
  shapes.forEach(shape => {
    for (let i = 0; i < shape.count; i++) {
      createRandomShape(svgContainer, shape.type);
    }
  });
}

// Create a random SVG shape
function createRandomShape(container, type) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100');
  svg.setAttribute('height', '100');
  svg.classList.add('svg-element');
  
  let element;
  
  switch (type) {
    case 'circle':
      element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      element.setAttribute('cx', '50');
      element.setAttribute('cy', '50');
      element.setAttribute('r', Math.random() * 30 + 10);
      break;
    case 'rect':
      element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      element.setAttribute('x', '25');
      element.setAttribute('y', '25');
      element.setAttribute('width', Math.random() * 50 + 10);
      element.setAttribute('height', Math.random() * 50 + 10);
      break;
    case 'polygon':
      element = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      element.setAttribute('points', '50,10 90,90 10,90');
      break;
  }
  
  // Random styling
  element.setAttribute('fill', `rgba(255,255,255,${Math.random() * 0.2 + 0.1})`);
  element.setAttribute('stroke', 'rgba(255,255,255,0.3)');
  element.setAttribute('stroke-width', '1');
  
  svg.appendChild(element);
  
  // Random position
  svg.style.position = 'absolute';
  svg.style.left = `${Math.random() * 100}%`;
  svg.style.top = `${Math.random() * 100}%`;
  
  // Random animation
  const animationClasses = ['floating', 'floating-slow', 'floating-fast'];
  svg.classList.add(animationClasses[Math.floor(Math.random() * animationClasses.length)]);
  
  // Random data attributes for parallax
  svg.setAttribute('data-speed', Math.random() * 0.3 + 0.1);
  svg.setAttribute('data-mouse-speed', Math.random() * 0.05 + 0.01);
  
  container.appendChild(svg);
}

// Tournament selector functionality
function initTournamentSelector() {
  const tournamentSelect = document.getElementById('tournament-select');
  const julyHero = document.getElementById('july-hero');
  const augustHero = document.getElementById('august-hero');
  const julyTournament = document.getElementById('july-tournament');
  const augustTournament = document.getElementById('august-tournament');
  
  if (tournamentSelect) {
    tournamentSelect.addEventListener('change', function() {
      const selectedValue = this.value;
      
      if (selectedValue === 'july') {
        // Show July tournament content
        julyHero.classList.add('active');
        augustHero.classList.remove('active');
        julyTournament.classList.add('active');
        augustTournament.classList.remove('active');
      } else if (selectedValue === 'august') {
        // Show August tournament content
        julyHero.classList.remove('active');
        augustHero.classList.add('active');
        julyTournament.classList.remove('active');
        augustTournament.classList.add('active');
      }
    });
  }
}

// Call this function after DOM is loaded
window.addEventListener('load', createSVGElements);
