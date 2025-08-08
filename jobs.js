// Jobs page specific functionality
// Handles job filtering, sorting, pagination, and search

let allJobs = [];
let filteredJobs = [];
let currentPage = 1;
const jobsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    loadJobs();
    initializeFilters();
    handleURLParameters();
});

// Load jobs data
async function loadJobs() {
    try {
        const response = await fetch('jobs.json');
        if (!response.ok) throw new Error('Erro ao carregar vagas');
        
        allJobs = await response.json();
        filteredJobs = [...allJobs];
        
        displayJobs();
        updateResultsCount();
        generatePagination();
        
    } catch (error) {
        console.error('Erro ao carregar vagas:', error);
        displayError('Erro ao carregar vagas. Tente novamente mais tarde.');
    }
}

// Display jobs in the list
function displayJobs() {
    const jobsList = document.getElementById('jobs-list');
    if (!jobsList) return;
    
    if (filteredJobs.length === 0) {
        jobsList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Nenhuma vaga encontrada</h3>
                <p>Tente ajustar os filtros de busca ou procure por outros termos.</p>
            </div>
        `;
        return;
    }
    
    const startIndex = (currentPage - 1) * jobsPerPage;
    const endIndex = startIndex + jobsPerPage;
    const jobsToShow = filteredJobs.slice(startIndex, endIndex);
    
    jobsList.innerHTML = jobsToShow.map(job => createJobListItem(job)).join('');
}

// Create job list item HTML
function createJobListItem(job) {
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
                <span><i class="fas fa-calendar"></i> Publicado há ${job.postedDays} dias</span>
            </div>
            <p class="job-description">${job.description.substring(0, 200)}...</p>
            <div class="job-tags">
                <span class="job-tag">${job.category}</span>
                ${job.skills ? job.skills.slice(0, 3).map(skill => `<span class="job-tag">${skill}</span>`).join('') : ''}
            </div>
            <div class="job-card-actions">
                <a href="job-detail.html?id=${job.id}" class="view-job-btn">Ver Detalhes</a>
                <button class="apply-btn" onclick="EmpregoAki.applyToJob(${job.id})">Candidatar-se</button>
            </div>
        </div>
    `;
}

// Initialize filter event listeners
function initializeFilters() {
    // Search input
    const searchInput = document.getElementById('job-search-filter');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }
    
    // Location input
    const locationInput = document.getElementById('location-filter');
    if (locationInput) {
        locationInput.addEventListener('input', debounce(applyFilters, 300));
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }
    
    // Filter selects
    ['category-filter', 'contract-filter', 'experience-filter'].forEach(filterId => {
        const filterElement = document.getElementById(filterId);
        if (filterElement) {
            filterElement.addEventListener('change', applyFilters);
        }
    });
    
    // Sort select
    const sortSelect = document.getElementById('sort-filter');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortJobs(this.value);
            currentPage = 1;
            displayJobs();
            generatePagination();
        });
    }
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('job-search-filter')?.value.toLowerCase() || '';
    const locationTerm = document.getElementById('location-filter')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('category-filter')?.value || '';
    const contractFilter = document.getElementById('contract-filter')?.value || '';
    const experienceFilter = document.getElementById('experience-filter')?.value || '';
    
    filteredJobs = allJobs.filter(job => {
        const matchesSearch = !searchTerm || 
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm) ||
            job.description.toLowerCase().includes(searchTerm) ||
            (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchTerm)));
        
        const matchesLocation = !locationTerm || 
            job.location.toLowerCase().includes(locationTerm);
        
        const matchesCategory = !categoryFilter || 
            job.category.toLowerCase() === categoryFilter;
        
        const matchesContract = !contractFilter || 
            job.type.toLowerCase() === contractFilter;
        
        const matchesExperience = !experienceFilter || 
            job.level.toLowerCase() === experienceFilter;
        
        return matchesSearch && matchesLocation && matchesCategory && 
               matchesContract && matchesExperience;
    });
    
    // Sort filtered jobs
    const sortValue = document.getElementById('sort-filter')?.value || 'date';
    sortJobs(sortValue);
    
    currentPage = 1;
    displayJobs();
    updateResultsCount();
    generatePagination();
}

// Sort jobs
function sortJobs(sortBy) {
    switch (sortBy) {
        case 'date':
            filteredJobs.sort((a, b) => a.postedDays - b.postedDays);
            break;
        case 'salary':
            filteredJobs.sort((a, b) => {
                const salaryA = extractSalaryNumber(a.salary);
                const salaryB = extractSalaryNumber(b.salary);
                return salaryB - salaryA;
            });
            break;
        case 'relevance':
            // Sort by title length as a simple relevance metric
            filteredJobs.sort((a, b) => a.title.length - b.title.length);
            break;
        default:
            break;
    }
}

// Extract numeric value from salary string for sorting
function extractSalaryNumber(salaryString) {
    const matches = salaryString.match(/[\d.,]+/g);
    if (matches) {
        const numStr = matches[matches.length - 1].replace(/\./g, '').replace(',', '.');
        return parseFloat(numStr) || 0;
    }
    return 0;
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        const count = filteredJobs.length;
        if (count === 0) {
            resultsCount.textContent = 'Nenhuma vaga encontrada';
        } else if (count === 1) {
            resultsCount.textContent = '1 vaga encontrada';
        } else {
            resultsCount.textContent = `${count} vagas encontradas`;
        }
    }
}

// Generate pagination
function generatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i> Anterior
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
        paginationHTML += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Próxima <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayJobs();
    generatePagination();
    
    // Scroll to top of results
    document.getElementById('jobs-list')?.scrollIntoView({ behavior: 'smooth' });
}

// Handle URL parameters
function handleURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Handle search query
    const query = urlParams.get('q');
    if (query) {
        const searchInput = document.getElementById('job-search-filter');
        if (searchInput) {
            searchInput.value = query;
        }
    }
    
    // Handle location
    const location = urlParams.get('location');
    if (location) {
        const locationInput = document.getElementById('location-filter');
        if (locationInput) {
            locationInput.value = location;
        }
    }
    
    // Handle company filter
    const company = urlParams.get('company');
    if (company) {
        const searchInput = document.getElementById('job-search-filter');
        if (searchInput) {
            searchInput.value = company;
        }
    }
    
    // Apply filters if any URL parameters were set
    if (query || location || company) {
        // Wait for jobs to load before applying filters
        const checkJobsLoaded = setInterval(() => {
            if (allJobs.length > 0) {
                clearInterval(checkJobsLoaded);
                applyFilters();
            }
        }, 100);
    }
}

// Display error message
function displayError(message) {
    const jobsList = document.getElementById('jobs-list');
    if (jobsList) {
        jobsList.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro ao carregar vagas</h3>
                <p>${message}</p>
                <button class="cta-button" onclick="location.reload()">Tentar Novamente</button>
            </div>
        `;
    }
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for job tags if not already present
function addJobTagsCSS() {
    if (!document.getElementById('job-tags-css')) {
        const style = document.createElement('style');
        style.id = 'job-tags-css';
        style.textContent = `
            .job-tags {
                display: flex;
                gap: 0.5rem;
                margin: 1rem 0;
                flex-wrap: wrap;
            }
            
            .job-tag {
                background: #f0f9ff;
                color: #0369a1;
                padding: 0.25rem 0.75rem;
                border-radius: 1rem;
                font-size: 0.75rem;
                font-weight: 500;
            }
            
            .pagination-dots {
                display: flex;
                align-items: center;
                padding: 0.5rem;
                color: #6b7280;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize job tags CSS
document.addEventListener('DOMContentLoaded', addJobTagsCSS);

// Make functions globally available
window.changePage = changePage;
window.applyFilters = applyFilters;
