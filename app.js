// Interactive JavaScript for Thejus Pradeep Portfolio Website

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Header Styling ---
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check once on load

    // --- Mobile Navigation Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');

    const toggleMobileMenu = () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            // Allow display change to register before anims
            setTimeout(() => {
                mobileMenu.classList.remove('opacity-0', '-translate-y-4');
            }, 20);
            mobileMenuIcon.classList.replace('fa-bars-staggered', 'fa-xmark');
        } else {
            mobileMenu.classList.add('opacity-0', '-translate-y-4');
            const handleTransitionEnd = () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.removeEventListener('transitionend', handleTransitionEnd);
            };
            mobileMenu.addEventListener('transitionend', handleTransitionEnd);
            mobileMenuIcon.classList.replace('fa-xmark', 'fa-bars-staggered');
        }
    };

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking outer space
    document.addEventListener('click', (e) => {
        if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && e.target !== mobileMenuBtn) {
            toggleMobileMenu();
        }
    });

    // Close menu when clicking mobile links
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });


    // --- Intersection Observer for Active Section Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -40% 0px', // Triggers when section is centered
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                
                // Update Desktop Links
                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Update Mobile Links
                mobileNavLinks.forEach(link => {
                    if (link.getAttribute('data-section') === activeId) {
                        link.classList.add('text-accent-orange');
                        link.classList.remove('text-gray-400');
                    } else {
                        link.classList.remove('text-accent-orange');
                        link.classList.add('text-gray-400');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));


    // --- Scroll-to-Reveal Animation Triggering ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    // Add classes to sections dynamically if not already added to HTML
    sections.forEach((sec, idx) => {
        if (sec.id !== 'home') {
            sec.classList.add('reveal-on-scroll');
            // Stagger child elements optionally
            const children = sec.querySelectorAll('.grid > div, .max-w-3xl > div');
            children.forEach((child, cIdx) => {
                child.classList.add('reveal-on-scroll', `delay-${(cIdx + 1) * 100}`);
            });
        }
    });

    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve once revealed to maintain state
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.05
    });

    // Observe all elements with reveal classes
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        scrollRevealObserver.observe(el);
    });


    // --- Project Card Mobile / Tap Support ---
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Check if user is clicking on tech tags to prevent card tap triggers if needed
            if (e.target.tagName === 'SPAN') return;
            
            // Toggle active hover state on mobile
            const isActive = card.classList.contains('active-touch');
            
            projectCards.forEach(c => c.classList.remove('active-touch'));
            
            if (!isActive) {
                card.classList.add('active-touch');
            }
        });
    });


    // --- Interactive Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const successToast = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Inputs
            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');
            
            // Trigger Loading State
            submitBtn.disabled = true;
            btnText.textContent = "Sending...";
            btnIcon.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin text-xs text-accent-orange"></i>`;
            
            // Simulate API Request (1.8s duration)
            setTimeout(() => {
                // Success State Animation
                btnText.textContent = "Sent!";
                btnIcon.innerHTML = `<i class="fa-solid fa-check text-xs text-emerald-500"></i>`;
                submitBtn.classList.replace('bg-accent-orange', 'bg-emerald-500');
                submitBtn.classList.replace('hover:bg-accent-red', 'hover:bg-emerald-600');
                
                // Show Success Toast inside card
                successToast.classList.remove('hidden');
                setTimeout(() => {
                    successToast.classList.remove('scale-95', 'opacity-0');
                    successToast.classList.add('scale-100', 'opacity-100');
                }, 20);
                
                // Clear form inputs
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
                
                // Reset Button after 4 seconds
                setTimeout(() => {
                    successToast.classList.remove('scale-100', 'opacity-100');
                    successToast.classList.add('scale-95', 'opacity-0');
                    
                    setTimeout(() => {
                        successToast.classList.add('hidden');
                    }, 500);
                    
                    submitBtn.disabled = false;
                    btnText.textContent = "Send Message";
                    btnIcon.innerHTML = `<i class="fa-solid fa-arrow-right text-xs text-accent-orange"></i>`;
                    submitBtn.classList.replace('bg-emerald-500', 'bg-accent-orange');
                    submitBtn.classList.replace('hover:bg-emerald-600', 'hover:bg-accent-orange');
                }, 4000);
                
            }, 1800);
        });
    }

});
