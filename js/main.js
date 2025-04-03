// Main JavaScript for Project Progress Tracker

document.addEventListener('DOMContentLoaded', function() {
    // Navigation highlighting
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Update active link
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 100)) {
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
    
    // Update filtering in the updates section
    const filterButtons = document.querySelectorAll('.filter');
    const updateItems = document.querySelectorAll('.update-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter update items
            updateItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'flex';
                } else {
                    if (item.classList.contains(filterValue)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });

    // Initialize collapsible sections
    initCollapsible();
    
    // Ensure expand/collapse buttons display correctly
    fixButtonsDisplay();
});

function fixButtonsDisplay() {
    // Force buttons to display correctly based on section state
    document.querySelectorAll('.expand-btn').forEach(button => {
        const target = button.getAttribute('data-target');
        let container, prefix;
        
        if (target === 'timeline') {
            container = document.querySelector('.timeline');
            prefix = 'timeline';
        } else if (target === 'deliverables') {
            container = document.querySelector('.deliverables-list');
            prefix = 'deliverables';
        }
        
        if (container) {
            const expandText = button.querySelector('.expand-text');
            const collapseText = button.querySelector('.collapse-text');
            
            if (container.classList.contains(`${prefix}-collapsed`)) {
                expandText.style.display = 'inline-block';
                collapseText.style.display = 'none';
            } else {
                expandText.style.display = 'none';
                collapseText.style.display = 'inline-block';
            }
        }
    });
}

function initCollapsible() {
    // Hide items beyond the first 3 for each section
    const sections = [
        { container: '.timeline', items: '.timeline-item', prefix: 'timeline' },
        { container: '.deliverables-list', items: '.deliverable-item', prefix: 'deliverables' }
    ];

    sections.forEach(section => {
        const container = document.querySelector(section.container);
        if (!container) return;

        const items = container.querySelectorAll(section.items);
        
        // Hide items beyond the first 3
        items.forEach((item, index) => {
            if (index >= 3) {
                item.classList.add('hidden');
            }
        });
        
        // Add collapsed class
        container.classList.add(`${section.prefix}-collapsed`);
    });

    // Set up expand/collapse button click handlers
    const expandButtons = document.querySelectorAll('.expand-btn');
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            let container, items, prefix;
            
            if (target === 'timeline') {
                container = document.querySelector('.timeline');
                items = container.querySelectorAll('.timeline-item');
                prefix = 'timeline';
            } else if (target === 'deliverables') {
                container = document.querySelector('.deliverables-list');
                items = container.querySelectorAll('.deliverable-item');
                prefix = 'deliverables';
            }
            
            if (container) {
                const isCollapsed = container.classList.contains(`${prefix}-collapsed`);
                const expandText = this.querySelector('.expand-text');
                const collapseText = this.querySelector('.collapse-text');
                
                // Toggle collapsed class
                container.classList.toggle(`${prefix}-collapsed`);
                
                // Toggle visibility of items
                items.forEach((item, index) => {
                    if (index >= 3) {
                        if (isCollapsed) {
                            item.classList.remove('hidden');
                            expandText.style.display = 'none';
                            collapseText.style.display = 'inline-block';
                        } else {
                            item.classList.add('hidden');
                            expandText.style.display = 'inline-block';
                            collapseText.style.display = 'none';
                        }
                    }
                });
            }
        });
    });
} 
