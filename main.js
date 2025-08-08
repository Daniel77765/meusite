// Main JavaScript file for EmpregoAki
// Handles navigation, common functionality, and data loading

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
    
    // Load content based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
        case '':
            loadHomepageContent();
            break;
        case 'companies.html':
            // Companies page functionality is handled inline
            break;
        default:
            // Other pages handled by their specific scripts
            break;
    }
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// Homepage content loading
async function loadHomepageContent() {
    try {
        // Load featured jobs
        await loadFeaturedJobs();
        
        // Load featured companies
        await loadFeaturedCompanies();
        
    } catch (error) {
        console.error('Erro ao carregar conteúdo da homepage:', error);
    }
}

// Load featured jobs for homepage
async function loadFeaturedJobs() {
    try {
        const response = await fetch('jobs.json');
        if (!response.ok) throw new Error('Erro ao carregar vagas');
        
        const jobs = await response.json();
        const featuredJobs = jobs.slice(0, 6); // Show first 6 jobs as featured
        
        const grid = document.getElementById('featured-jobs-grid');
        if (grid) {
            if (featuredJobs.length === 0) {
                grid.innerHTML = `
                    <div class="no-jobs" style="grid-column: 1 / -1;">
                        <i class="fas fa-briefcase"></i>
                        <h3>Nenhuma vaga disponível</h3>
                        <p>Novas oportunidades serão publicadas em breve.</p>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = featuredJobs.map(job => createJobCard(job)).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar vagas em destaque:', error);
        const grid = document.getElementById('featured-jobs-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar vagas. Tente novamente mais tarde.</p>
                </div>
            `;
        }
    }
}

// Load featured companies for homepage
async function loadFeaturedCompanies() {
    try {
        const response = await fetch('companies.json');
        if (!response.ok) throw new Error('Erro ao carregar empresas');
        
        const companies = await response.json();
        const featuredCompanies = companies.slice(0, 8); // Show first 8 companies as featured
        
        const grid = document.getElementById('companies-grid');
        if (grid) {
            if (featuredCompanies.length === 0) {
                grid.innerHTML = `
                    <div class="no-results" style="grid-column: 1 / -1;">
                        <i class="fas fa-building"></i>
                        <h3>Nenhuma empresa encontrada</h3>
                        <p>Novas empresas parceiras serão adicionadas em breve.</p>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = featuredCompanies.map(company => createCompanyCard(company)).join('');
        }
    } catch (error) {
        console.error('Erro ao carregar empresas em destaque:', error);
        const grid = document.getElementById('companies-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message" style="grid-column: 1 / -1;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar empresas. Tente novamente mais tarde.</p>
                </div>
            `;
        }
    }
}

// Create job card HTML
function createJobCard(job) {
    return `
        <div class="job-card">
            <div class="job-card-header">
                <div>
                    <h3><a href="job-detail.html?id=${job.id}">${job.title}</a></h3>
                    <div class="job-company">${job.company}</div>
                </div>
                <div class="job-salary">${job.salary}</div>
            </div>
            <div class="job-card-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                <span><i class="fas fa-clock"></i> ${job.type}</span>
                <span><i class="fas fa-layer-group"></i> ${job.level}</span>
            </div>
            <p class="job-description">${job.description.substring(0, 120)}...</p>
            <div class="job-card-actions">
                <a href="job-detail.html?id=${job.id}" class="view-job-btn">Ver Detalhes</a>
                <button class="apply-btn" onclick="applyToJob(${job.id})">Candidatar-se</button>
            </div>
        </div>
    `;
}

// Create company card HTML
function createCompanyCard(company) {
    return `
        <div class="company-card">
            <div class="company-logo">
                <i class="fas fa-building"></i>
            </div>
            <div class="company-info">
                <h3>${company.name}</h3>
                <p class="company-sector">${company.sector}</p>
                <p class="company-description">${company.description.substring(0, 100)}...</p>
                <div class="company-stats">
                    <span><i class="fas fa-users"></i> ${company.employees} funcionários</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${company.location}</span>
                </div>
                <div class="company-actions">
                    <a href="company-profile.html?name=${encodeURIComponent(company.name)}" class="view-profile-btn">
                        Ver Perfil
                    </a>
                    <a href="jobs.html?company=${encodeURIComponent(company.name)}" class="view-jobs-btn">
                        Ver Vagas (${company.openJobs || 0})
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Search functionality from homepage
function searchJobs() {
    const jobQuery = document.getElementById('job-search')?.value || '';
    const locationQuery = document.getElementById('location-search')?.value || '';
    
    // Build query parameters
    const params = new URLSearchParams();
    if (jobQuery) params.append('q', jobQuery);
    if (locationQuery) params.append('location', locationQuery);
    
    // Redirect to jobs page with search parameters
    window.location.href = `jobs.html?${params.toString()}`;
}

// Apply to job functionality
function applyToJob(jobId) {
    // In a real application, this would handle the application process
    alert(`Funcionalidade de candidatura será implementada em breve. ID da vaga: ${jobId}`);
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'há 1 dia';
    if (diffDays < 7) return `há ${diffDays} dias`;
    if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
    return `há ${Math.floor(diffDays / 30)} mês${Math.floor(diffDays / 30) > 1 ? 'es' : ''}`;
}

function formatSalary(salary) {
    if (typeof salary === 'number') {
        return salary.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
    return salary;
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

// Add loading states for buttons
function addLoadingState(button, originalText) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Carregando...`;
    
    return function removeLoadingState() {
        button.disabled = false;
        button.innerHTML = originalText;
    };
}

// Error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
}, true);

// Initialize tooltips and other UI enhancements
function initializeUIEnhancements() {
    // Add hover effects to cards
    document.querySelectorAll('.job-card, .company-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize UI enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', initializeUIEnhancements);

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Erro global:', e.error);
});

// Handle form submissions with validation
function handleFormSubmission(form, onSuccess, onError) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                throw new Error('Por favor, preencha todos os campos obrigatórios.');
            }
            
            // Email validation
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value && !emailRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                }
            });
            
            if (!isValid) {
                throw new Error('Por favor, insira um email válido.');
            }
            
            if (onSuccess) {
                await onSuccess(data);
            }
            
        } catch (error) {
            if (onError) {
                onError(error);
            } else {
                alert(error.message);
            }
        }
    });
}

// Local storage utilities
const storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
        }
    },
    
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Erro ao ler do localStorage:', e);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Erro ao remover do localStorage:', e);
        }
    }
};

// Export functions for use in other scripts
window.EmpregoAki = {
    createJobCard,
    createCompanyCard,
    formatDate,
    formatSalary,
    addLoadingState,
    handleFormSubmission,
    storage,
    applyToJob
};
