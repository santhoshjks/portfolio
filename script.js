// Portfolio Interactive Features
class PortfolioApp {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.setupCursorGlow();
        this.setupScrollAnimations();
    }

    init() {
        this.modal = document.getElementById('addModal');
        this.addForm = document.getElementById('addForm');
        this.modalTitle = document.getElementById('modalTitle');
        this.closeModal = document.querySelector('.close-modal');
        this.currentSection = null;
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Add section buttons
        document.querySelectorAll('.add-section-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentSection = e.currentTarget.dataset.section;
                this.openModal(this.currentSection);
            });
        });

        // Modal close
        this.closeModal.addEventListener('click', () => this.closeModalFunc());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModalFunc();
        });

        // Form submission
        this.addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Smooth scrolling
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                targetSection.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Resume download button
        const resumeBtn = document.getElementById('downloadResume');
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleResumeDownload();
        });

        // Contact form
        const contactForm = document.querySelector('.contact-form');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactForm(e);
        });

        // Project view buttons
        document.querySelectorAll('.view-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.viewProjectDetails(e);
            });
        });
    }

    setupCursorGlow() {
        const cursorGlow = document.querySelector('.cursor-glow');
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

        // Observe skill items
        document.querySelectorAll('.skill-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });

        // Observe timeline items
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
            observer.observe(item);
        });
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const themeIcon = document.querySelector('.theme-toggle i');
        themeIcon.className = document.body.classList.contains('dark-mode') ? 'fas fa-sun' : 'fas fa-moon';
    }

    openModal(section) {
        this.modal.style.display = 'flex';
        this.generateFormContent(section);
    }

    closeModalFunc() {
        this.modal.style.display = 'none';
        this.addForm.innerHTML = '';
    }

    generateFormContent(section) {
        let formHTML = '';
        
        switch(section) {
            case 'about':
                this.modalTitle.textContent = 'Add About Information';
                formHTML = `
                    <div class="form-group">
                        <label for="aboutTitle">Title</label>
                        <input type="text" id="aboutTitle" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="aboutDescription">Description</label>
                        <textarea id="aboutDescription" name="description" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="aboutIcon">Icon (Font Awesome class)</label>
                        <input type="text" id="aboutIcon" name="icon" placeholder="fas fa-code">
                    </div>
                `;
                break;
                
            case 'projects':
                this.modalTitle.textContent = 'Add New Project';
                formHTML = `
                    <div class="form-group">
                        <label for="projectTitle">Project Title</label>
                        <input type="text" id="projectTitle" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="projectDescription">Description</label>
                        <textarea id="projectDescription" name="description" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="projectTags">Tags (comma-separated)</label>
                        <input type="text" id="projectTags" name="tags" placeholder="React, Node.js, MongoDB">
                    </div>
                    <div class="form-group">
                        <label for="projectImage">Image URL (optional)</label>
                        <input type="url" id="projectImage" name="image" placeholder="https://example.com/image.jpg">
                    </div>
                `;
                break;
                
            case 'skills':
                this.modalTitle.textContent = 'Add New Skill';
                formHTML = `
                    <div class="form-group">
                        <label for="skillName">Skill Name</label>
                        <input type="text" id="skillName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="skillCategory">Category</label>
                        <select id="skillCategory" name="category" required>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Tools">Tools</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="skillLevel">Proficiency Level (0-100)</label>
                        <input type="number" id="skillLevel" name="level" min="0" max="100" required>
                    </div>
                    <div class="form-group">
                        <label for="skillIcon">Icon (Font Awesome class)</label>
                        <input type="text" id="skillIcon" name="icon" placeholder="fab fa-react">
                    </div>
                `;
                break;
                
            case 'experience':
                this.modalTitle.textContent = 'Add Work Experience';
                formHTML = `
                    <div class="form-group">
                        <label for="expTitle">Job Title</label>
                        <input type="text" id="expTitle" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="expCompany">Company</label>
                        <input type="text" id="expCompany" name="company" required>
                    </div>
                    <div class="form-group">
                        <label for="expPeriod">Period</label>
                        <input type="text" id="expPeriod" name="period" placeholder="2020 - 2022" required>
                    </div>
                    <div class="form-group">
                        <label for="expDescription">Description</label>
                        <textarea id="expDescription" name="description" rows="3" required></textarea>
                    </div>
                `;
                break;
                
            case 'contact':
                this.modalTitle.textContent = 'Add Contact Information';
                formHTML = `
                    <div class="form-group">
                        <label for="contactType">Contact Type</label>
                        <select id="contactType" name="type" required>
                            <option value="email">Email</option>
                            <option value="phone">Phone</option>
                            <option value="location">Location</option>
                            <option value="social">Social Media</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="contactLabel">Label</label>
                        <input type="text" id="contactLabel" name="label" placeholder="Email, Phone, Address, etc." required>
                    </div>
                    <div class="form-group">
                        <label for="contactValue">Value</label>
                        <input type="text" id="contactValue" name="value" placeholder="email@example.com, +1234567890, etc." required>
                    </div>
                    <div class="form-group">
                        <label for="contactIcon">Icon (Font Awesome class)</label>
                        <input type="text" id="contactIcon" name="icon" placeholder="fas fa-envelope">
                    </div>
                `;
                break;
        }
        
        formHTML += '<button type="submit" class="btn-submit">Add Item</button>';
        this.addForm.innerHTML = formHTML;
    }

    handleFormSubmit() {
        const formData = new FormData(this.addForm);
        const data = Object.fromEntries(formData);
        
        switch(this.currentSection) {
            case 'about':
                this.addAboutItem(data);
                break;
            case 'projects':
                this.addProject(data);
                break;
            case 'skills':
                this.addSkill(data);
                break;
            case 'experience':
                this.addExperience(data);
                break;
            case 'contact':
                this.addContact(data);
                break;
        }
        
        this.closeModalFunc();
    }

    addAboutItem(data) {
        const aboutDetails = document.querySelector('.about-details');
        const newItem = document.createElement('div');
        newItem.className = 'detail-item';
        newItem.style.opacity = '0';
        newItem.innerHTML = `
            <i class="${data.icon || 'fas fa-star'}"></i>
            <span>${data.title}</span>
        `;
        aboutDetails.appendChild(newItem);
        
        setTimeout(() => {
            newItem.style.transition = 'opacity 0.5s ease';
            newItem.style.opacity = '1';
        }, 100);
    }

    addProject(data) {
        const projectsGrid = document.getElementById('projects-grid');
        const newProject = document.createElement('div');
        newProject.className = 'project-card';
        newProject.style.opacity = '0';
        
        const tags = data.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('');
        const imageUrl = data.image || `https://picsum.photos/seed/${Date.now()}/400/300.jpg`;
        
        newProject.innerHTML = `
            <div class="project-image" style="background-image: url('${imageUrl}')">
                <div class="project-overlay">
                    <button class="view-project">View Details</button>
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${data.title}</h3>
                <p class="project-description">${data.description}</p>
                <div class="project-tags">${tags}</div>
            </div>
        `;
        
        projectsGrid.appendChild(newProject);
        
        // Add event listener to new project
        newProject.querySelector('.view-project').addEventListener('click', (e) => {
            this.viewProjectDetails(e);
        });
        
        setTimeout(() => {
            newProject.style.transition = 'opacity 0.5s ease';
            newProject.style.opacity = '1';
        }, 100);
    }

    addSkill(data) {
        let category = null;
        const categories = document.querySelectorAll('.skill-category');
        
        // Find existing category by checking the title text
        categories.forEach(cat => {
            const title = cat.querySelector('.category-title');
            if (title && title.textContent.trim() === data.category) {
                category = cat;
            }
        });
        
        if (!category) {
            const skillsContainer = document.getElementById('skills-container');
            category = document.createElement('div');
            category.className = 'skill-category';
            category.innerHTML = `
                <h3 class="category-title">${data.category}</h3>
                <div class="skill-items"></div>
            `;
            skillsContainer.appendChild(category);
        }
        
        const skillItems = category.querySelector('.skill-items');
        const newSkill = document.createElement('div');
        newSkill.className = 'skill-item';
        newSkill.style.opacity = '0';
        
        newSkill.innerHTML = `
            <div class="skill-icon">
                <i class="${data.icon || 'fas fa-code'}"></i>
            </div>
            <div class="skill-info">
                <h4>${data.name}</h4>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: 0%"></div>
                </div>
            </div>
        `;
        
        skillItems.appendChild(newSkill);
        
        setTimeout(() => {
            newSkill.style.transition = 'opacity 0.5s ease';
            newSkill.style.opacity = '1';
            
            setTimeout(() => {
                const progressBar = newSkill.querySelector('.skill-progress');
                progressBar.style.transition = 'width 1s ease';
                progressBar.style.width = `${data.level}%`;
            }, 100);
        }, 100);
    }

    addExperience(data) {
        const timeline = document.getElementById('timeline');
        const newExperience = document.createElement('div');
        newExperience.className = 'timeline-item';
        newExperience.style.opacity = '0';
        
        newExperience.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h3 class="timeline-title">${data.title}</h3>
                <h4 class="timeline-company">${data.company}</h4>
                <p class="timeline-date">${data.period}</p>
                <p class="timeline-description">${data.description}</p>
            </div>
        `;
        
        timeline.appendChild(newExperience);
        
        setTimeout(() => {
            newExperience.style.transition = 'opacity 0.5s ease';
            newExperience.style.opacity = '1';
        }, 100);
    }

    addContact(data) {
        const contactInfo = document.querySelector('.contact-info');
        const newContact = document.createElement('div');
        newContact.className = 'contact-item';
        newContact.style.opacity = '0';
        
        newContact.innerHTML = `
            <i class="${data.icon || 'fas fa-envelope'}"></i>
            <div class="contact-details">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
            </div>
        `;
        
        contactInfo.appendChild(newContact);
        
        setTimeout(() => {
            newContact.style.transition = 'opacity 0.5s ease';
            newContact.style.opacity = '1';
        }, 100);
    }

    handleResumeDownload() {
        // Get the resume button reference
        const resumeBtn = document.getElementById('downloadResume');
        
        // Path to your resume PDF file - should be in the same directory as the HTML file
        const resumePath = './resume.pdf';
        
        // Show loading feedback
        const originalText = resumeBtn.innerHTML;
        resumeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Debug: log the path we're trying to access
        console.log('Attempting to download resume from:', resumePath);
        
        // Check if file exists before attempting download
        fetch(resumePath, { method: 'HEAD' })
            .then(response => {
                console.log('Response status:', response.status);
                if (response.ok) {
                    // File exists, proceed with download
                    console.log('File found, proceeding with download');
                    const a = document.createElement('a');
                    a.href = resumePath;
                    a.download = 'res.pdf';
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
                    console.log('File not found, response:', response);
                    throw new Error('File not found');
                }
            })
            .catch(error => {
                console.error('Resume download error:', error);
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

    handleContactForm(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Contact form submitted:', data);
        
        // Show success message
        const submitBtn = e.target.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
        
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            e.target.reset();
        }, 3000);
    }

    viewProjectDetails(e) {
        const projectCard = e.target.closest('.project-card');
        const projectTitle = projectCard.querySelector('.project-title').textContent;
        const projectDescription = projectCard.querySelector('.project-description').textContent;
        
        // Create a simple modal to show project details
        const detailsModal = document.createElement('div');
        detailsModal.className = 'modal';
        detailsModal.style.display = 'flex';
        detailsModal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${projectTitle}</h2>
                <p>${projectDescription}</p>
                <div style="margin-top: 2rem;">
                    <a href="#" class="btn-primary">View Live Demo</a>
                    <a href="#" class="btn-secondary" style="margin-left: 1rem;">View Code</a>
                </div>
            </div>
        `;
        
        document.body.appendChild(detailsModal);
        
        // Close modal functionality
        detailsModal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(detailsModal);
        });
        
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                document.body.removeChild(detailsModal);
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add smooth reveal animations for skill bars when they come into view
const observeSkillBars = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                setTimeout(() => {
                    entry.target.style.transition = 'width 1s ease';
                    entry.target.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
};

// Call this function when DOM is ready
document.addEventListener('DOMContentLoaded', observeSkillBars);
