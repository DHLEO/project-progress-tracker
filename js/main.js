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
    
    // Initialize the modal for update details
    initUpdateDetailsModal();

    // 尝试加载marked库
    tryLoadMarkedLibrary();
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

// Modal and Markdown handling
function initUpdateDetailsModal() {
    const modal = document.getElementById('update-modal');
    const closeBtn = document.querySelector('.close-modal');
    const markdownContainer = document.getElementById('markdown-content');
    const updateItems = document.querySelectorAll('.update-item');
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    
    // Close modal when clicking the close button
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Add click event to update items
    updateItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Get the markdown content from the data attribute
            const markdownText = this.getAttribute('data-markdown');
            
            // Render the markdown
            renderMarkdown(markdownText, markdownContainer);
            
            // Display the modal
            modal.style.display = 'block';
        });
    });
    
    // Add click event to view details buttons
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Prevent the click from propagating to the parent update item
            e.stopPropagation();
            
            // Get the parent update item
            const updateItem = this.closest('.update-item');
            
            // Get the markdown content from the data attribute
            const markdownText = updateItem.getAttribute('data-markdown');
            
            // Render the markdown
            renderMarkdown(markdownText, markdownContainer);
            
            // Display the modal
            modal.style.display = 'block';
        });
    });
}

// 渲染markdown的函数
function renderMarkdown(markdownText, container) {
    try {
        // 首先尝试使用marked库
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: false,
                mangle: false
            });
            container.innerHTML = marked.parse(markdownText);
            console.log('Markdown rendered with marked');
        } else {
            // 如果marked不可用，使用备选函数
            console.warn('Marked library not found, using simple markdown parser');
            container.innerHTML = simpleMarkdownToHtml(markdownText);
        }
    } catch (error) {
        console.error('Error rendering markdown with marked:', error);
        // 出错时也使用备选函数
        console.warn('Falling back to simple markdown parser');
        container.innerHTML = simpleMarkdownToHtml(markdownText);
    }
}

// 备选markdown解析函数
function simpleMarkdownToHtml(markdown) {
    if (!markdown) return '';
    
    // 替换标题
    let html = markdown.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    
    // 替换列表项
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>)(\s*<li>)/g, '$1<li>');
    html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    
    // 替换代码块
    html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    
    // 替换段落（必须在最后执行）
    html = html.replace(/^(?!(<h|<ul|<pre))(.*?)$/gm, function(match) {
        if (match.trim() === '') return '';
        return '<p>' + match + '</p>';
    });
    
    // 处理空行
    html = html.replace(/\n\n+/g, '<br><br>');
    
    return html;
}

// 尝试加载marked库
function tryLoadMarkedLibrary() {
    if (typeof marked === 'undefined') {
        console.log('Trying to load marked library dynamically');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js';
        script.integrity = 'sha256-6XxHEqxknBzVlgMoIoZnxwVQR9b/wKHh82LRqDCz0DY=';
        script.crossOrigin = 'anonymous';
        script.onload = function() {
            console.log('Marked library loaded successfully');
        };
        script.onerror = function() {
            console.error('Failed to load marked library');
        };
        document.head.appendChild(script);
    }
}
