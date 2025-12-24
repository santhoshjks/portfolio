// Portfolio Interactive Features
class PortfolioApp {
    constructor() {
        this.setupEventListeners();
        this.setupCursorGlow();
        this.setupScrollAnimations();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Smooth scrolling
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Resume download button
        const resumeBtn = document.getElementById('downloadResume');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleResumeDownload();
            });
        }
    }

    setupCursorGlow() {
        const cursorGlow = document.querySelector('.cursor-glow');
        if (!cursorGlow) return;

        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;

            cursorGlow.style.left = currentX + 'px';
            cursorGlow.style.top = currentY + 'px';

            requestAnimationFrame(animateCursor);
        };
        animateCursor();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // Observe project cards
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    handleResumeDownload() {
        // Get the resume button reference
        const resumeBtn = document.getElementById('downloadResume');
        if (!resumeBtn) return;


        // Path to your resume PDF file - relative path works better
        const resumePath = 'SANTHOSH-J-Resume.pdf';

        // Show loading feedback
        const originalText = resumeBtn.innerHTML;
        resumeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

        // Handle file protocol (local filesystem) where fetch is blocked by CORS
        const checkFile = window.location.protocol === 'file:'
            ? Promise.resolve({ ok: true })
            : fetch(resumePath, { method: 'HEAD' });

        checkFile
            .then(response => {
                if (response.ok) {
                    const a = document.createElement('a');
                    a.href = resumePath;
                    a.download = 'SANTHOSH-J-Resume.pdf';
                    a.target = '_blank';

                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    // Show animated success alert
                    this.showAnimatedAlert('Resume downloaded successfully!', 'success');

                    // Show success feedback on button
                    setTimeout(() => {
                        resumeBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
                        resumeBtn.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
                        resumeBtn.style.color = 'white';
                        resumeBtn.style.borderColor = '#48bb78';

                        setTimeout(() => {
                            resumeBtn.innerHTML = originalText;
                            resumeBtn.style.background = '';
                            resumeBtn.style.color = '';
                            resumeBtn.style.borderColor = '';
                        }, 2000);
                    }, 500);
                } else {
                    // File doesn't exist
                    throw new Error('File not found');
                }
            })
            .catch(error => {
                // Show error alert
                this.showAnimatedAlert('Resume file not found.', 'error');

                // Show error feedback on button
                resumeBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> File Not Found';
                resumeBtn.style.background = 'linear-gradient(135deg, #f56565, #e53e3e)';
                resumeBtn.style.color = 'white';
                resumeBtn.style.borderColor = '#f56565';

                setTimeout(() => {
                    resumeBtn.innerHTML = originalText;
                    resumeBtn.style.background = '';
                    resumeBtn.style.color = '';
                    resumeBtn.style.borderColor = '';
                }, 3000);
            });
    }

    showAnimatedAlert(message, type = 'success') {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.animated-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create alert element
        const alert = document.createElement('div');
        alert.className = `animated-alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to body
        document.body.appendChild(alert);

        // Animate in
        setTimeout(() => {
            alert.classList.add('show');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.parentNode.removeChild(alert);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
