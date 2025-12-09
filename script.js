// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const loadingScreen = document.getElementById('loadingScreen');
const currentYear = document.getElementById('currentYear');

// App State
let visitorCount = 0;
let messages = JSON.parse(localStorage.getItem('messages') || '[]');
let counter = parseInt(localStorage.getItem('demoCounter') || '0');

// Initialize App
function initApp() {
    // Set current year
    currentYear.textContent = new Date().getFullYear();
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }
    
    // Initialize visitor count
    const savedVisitorCount = parseInt(localStorage.getItem('visitorCount') || '0');
    visitorCount = savedVisitorCount + 1;
    localStorage.setItem('visitorCount', visitorCount.toString());
    updateVisitorCount();
    
    // Initialize counter
    updateCounter();
    
    // Initialize messages
    updateMessages();
    
    // Start real-time clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1500);
    
    // Initialize all event listeners
    initEventListeners();
    
    // Log initialization
    console.log('✨ Beautiful Website Initialized!');
    console.log('🚀 Features loaded:');
    console.log('   • Dark/Light theme toggle');
    console.log('   • Mobile responsive navigation');
    console.log('   • Interactive demo sections');
    console.log('   • Real-time clock and counters');
    console.log('   • LocalStorage persistence');
    console.log('   • Smooth animations');
}

// Update Functions
function updateVisitorCount() {
    document.getElementById('visitorCount').textContent = visitorCount.toLocaleString();
}

function updateCounter() {
    document.getElementById('demoCounter').textContent = counter;
}

function updateClock() {
    const timezone = document.getElementById('timezoneSelect').value;
    const now = new Date();
    let time;
    
    switch(timezone) {
        case 'utc':
            time = now.toUTCString().split(' ')[4];
            break;
        case 'est':
            time = now.toLocaleString('en-US', { 
                timeZone: 'America/New_York',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            break;
        case 'pst':
            time = now.toLocaleString('en-US', { 
                timeZone: 'America/Los_Angeles',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            break;
        default:
            time = now.toLocaleTimeString('en-US', { hour12: false });
    }
    
    document.getElementById('realTimeClock').textContent = time;
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function updateMessages() {
    const messagesList = document.getElementById('messagesList');
    const messageCount = document.getElementById('messageCount');
    
    // Clear current messages
    messagesList.innerHTML = '';
    
    // Add messages
    messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.textContent = msg.text;
        messagesList.appendChild(messageDiv);
    });
    
    // Update count
    messageCount.textContent = `${messages.length} message${messages.length !== 1 ? 's' : ''}`;
    
    // Scroll to bottom
    messagesList.scrollTop = messagesList.scrollHeight;
}

// Event Listeners
function initEventListeners() {
    // Theme Toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.querySelector('i').className = navLinks.classList.contains('active') 
            ? 'fas fa-times' 
            : 'fas fa-bars';
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').className = 'fas fa-bars';
        });
    });
    
    // Back to Top
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hero Buttons
    document.getElementById('getStartedBtn').addEventListener('click', () => {
        showNotification('Getting started guide opened!', 'success');
        document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('viewDemoBtn').addEventListener('click', () => {
        showNotification('Live demo activated!', 'success');
        document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Demo Section
    document.getElementById('incrementBtn').addEventListener('click', () => {
        counter++;
        localStorage.setItem('demoCounter', counter.toString());
        updateCounter();
        showNotification('Visitor added!', 'success');
    });
    
    document.getElementById('resetCounterBtn').addEventListener('click', () => {
        counter = 0;
        localStorage.setItem('demoCounter', '0');
        updateCounter();
        showNotification('Counter reset!', 'info');
    });
    
    document.getElementById('timezoneSelect').addEventListener('change', updateClock);
    
    // Message Board
    document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    document.getElementById('clearMessagesBtn').addEventListener('click', () => {
        if (messages.length > 0) {
            if (confirm('Are you sure you want to clear all messages?')) {
                messages = [];
                localStorage.setItem('messages', JSON.stringify(messages));
                updateMessages();
                showNotification('All messages cleared!', 'info');
            }
        }
    });
    
    // Gallery Filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Contact Form
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('nameInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();
        const message = document.getElementById('messageTextarea').value.trim();
        
        if (!name || !email || !message) {
            showFormResponse('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormResponse('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate form submission
        showFormResponse('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Log to console (in a real app, this would go to a backend)
        console.log('Contact Form Submission:');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);
    });
    
    // Newsletter
    document.getElementById('subscribeBtn').addEventListener('click', () => {
        const email = document.getElementById('newsletterEmail').value.trim();
        
        if (!email || !isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        document.getElementById('newsletterEmail').value = '';
        
        // Log subscription
        console.log('Newsletter subscription:', email);
    });
    
    // Footer Links
    document.getElementById('viewSourceBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Source code would open in a new tab.', 'info');
        window.open('https://github.com', '_blank');
    });
    
    document.getElementById('netlifyGuideBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Netlify deployment guide would open.', 'info');
        window.open('https://docs.netlify.com', '_blank');
    });
    
    document.getElementById('docsBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Documentation would open.', 'info');
    });
    
    // Floating cards hover effect
    document.querySelectorAll('.floating-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Theme Functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
        showNotification('Switched to light theme', 'info');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
        showNotification('Switched to dark theme', 'info');
    }
}

// Message Functions
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) {
        showNotification('Please enter a message first!', 'error');
        return;
    }
    
    // Add message
    messages.push({
        text: message,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem('messages', JSON.stringify(messages));
    
    // Update UI
    updateMessages();
    
    // Clear input
    input.value = '';
    
    // Show confirmation
    showNotification('Message added!', 'success');
    
    // Log to console
    console.log('New message:', message);
}

// Notification Functions
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // Add CSS for notification if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                color: #333;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                z-index: 9999;
                transform: translateX(150%);
                transition: transform 0.3s ease;
                max-width: 350px;
            }
            
            [data-theme="dark"] .notification {
                background: var(--dark-color);
                color: var(--text-color);
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left: 4px solid #4CAF50;
            }
            
            .notification-error {
                border-left: 4px solid #f44336;
            }
            
            .notification-info {
                border-left: 4px solid var(--primary-color);
            }
            
            .notification-close {
                background: transparent;
                border: none;
                color: inherit;
                font-size: 1.5rem;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }
}

function showFormResponse(message, type) {
    const responseDiv = document.getElementById('formResponse');
    responseDiv.textContent = message;
    responseDiv.style.display = 'block';
    responseDiv.style.color = type === 'success' ? '#4CAF50' : '#f44336';
    responseDiv.style.borderLeft = `4px solid ${type === 'success' ? '#4CAF50' : '#f44336'}`;
    
    setTimeout(() => {
        responseDiv.style.display = 'none';
    }, 5000);
}

// Utility Functions
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);