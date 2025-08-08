# EmpregoAki - Portal de Empregos

## Overview

EmpregoAki is a Brazilian job portal platform that connects employers with job seekers. The application serves as a marketplace for employment opportunities, featuring job listings, company profiles, and detailed job information. Built as a static website with dynamic content loading, it focuses on simplifying the recruitment process in Brazil by providing a user-friendly interface for both job seekers and employers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application is built as a **static website** using vanilla HTML, CSS, and JavaScript. The architecture follows a simple multi-page application (MPA) pattern where each page serves a specific purpose:

- **index.html** - Homepage with hero section and introduction
- **jobs.html** - Job listings with search and filter functionality
- **companies.html** - Company directory and profiles
- **about.html** - Company information and mission
- **contact.html** - Contact information and forms
- **job-detail.html** - Individual job posting details
- **company-profile.html** - Individual company profile pages

### Data Management
The application uses a **JSON-based data storage** approach with static files:
- **data/jobs.json** - Contains job listings with detailed information including requirements, benefits, and company details
- **data/companies.json** - Stores company profiles with comprehensive information including mission, values, benefits, and social media links

### CSS Architecture
Styling is centralized in a single **css/style.css** file that implements:
- Modern CSS with CSS Grid and Flexbox layouts
- Responsive design patterns for mobile-first approach
- CSS custom properties for consistent theming
- Component-based styling approach

### JavaScript Architecture
The JavaScript is modular with separate files for different functionalities:
- **js/main.js** - Core functionality, navigation handling, and initialization
- **js/jobs.js** - Job-specific features including filtering, search, pagination, and sorting

Key features implemented:
- Dynamic content loading from JSON files
- Client-side search and filtering
- Pagination for job listings
- Responsive navigation with mobile toggle
- URL parameter handling for deep linking

### UI/UX Design Patterns
- **Component-based design** with reusable elements
- **Progressive enhancement** approach for JavaScript functionality
- **Mobile-first responsive design** using CSS media queries
- **Accessibility considerations** with semantic HTML and ARIA labels

## External Dependencies

### Frontend Libraries
- **Google Fonts (Inter)** - Typography system for consistent font rendering
- **Font Awesome 6.0.0** - Icon library for UI elements and visual indicators

### Development Dependencies
- **Modern browsers** - Requires ES6+ support for JavaScript features
- **HTTP server** - Needed for proper AJAX requests and JSON file loading due to CORS restrictions

### Content Dependencies
- **Static JSON files** - Self-contained data storage requiring no external database
- **Local asset management** - All images and resources served locally

The application is designed to be **deployment-ready** for static hosting services and requires no server-side processing or database connections.