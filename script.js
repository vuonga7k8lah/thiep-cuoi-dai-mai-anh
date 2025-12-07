// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-24WP7GNL8X');

// ==========================================
// DYNAMIC DATA LOADING - Based on URL parameter
// ==========================================
let weddingData = null;
let currentType = 'chu_re'; // Default to groom's side

// Get URL parameter
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Load wedding data from JSON
async function loadWeddingData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Get type from URL, default to mac_dinh in JSON or 'chu_re'
        const typeParam = getUrlParam('type');
        currentType = typeParam || data.mac_dinh || 'chu_re';
        
        // Get the data for current type
        weddingData = data[currentType];
        
        if (!weddingData) {
            console.log('Type not found in data.json, using chu_re');
            currentType = 'chu_re';
            weddingData = data['chu_re'];
        }
        
        console.log('Loaded wedding data for:', currentType, weddingData);
        
        // Apply data to page
        applyWeddingData();
        
        return weddingData;
    } catch (error) {
        console.error('Error loading wedding data:', error);
        return null;
    }
}

// Apply wedding data to page elements
function applyWeddingData() {
    if (!weddingData) return;
    
    // Update page title based on type
    const titleSuffix = currentType === 'co_dau' ? ' - Nhà Gái' : ' - Nhà Trai';
    document.title = document.title.replace(/ - Nhà.*$/, '') + titleSuffix;
    
    // DOM element mappings - data-node-id -> JSON field path
    const fieldMappings = {
        // Nhà Trai/Nhà Gái label - update based on current type
        'hkBC0wNsbm': 'ten_nha',
        
        // Venue information
        'venue_dia_diem': 'hon_le.dia_diem',
        'venue_dia_chi': 'hon_le.dia_chi',
        'venue_ngay_cuoi': 'hon_le.ngay_cuoi',
        'venue_gio_cuoi': 'hon_le.gio_cuoi'
    };
    
    // Helper function to get nested value from object
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }
    
    // Update text content for mapped elements
    Object.keys(fieldMappings).forEach(function(nodeId) {
        const fieldPath = fieldMappings[nodeId];
        const value = getNestedValue(weddingData, fieldPath);
        
        if (value) {
            const element = document.querySelector('[data-node-id="' + nodeId + '"]');
            if (element) {
                // Find the innermost text container (div with contenteditable)
                const textContainer = element.querySelector('[contenteditable="false"]');
                if (textContainer) {
                    textContainer.textContent = value;
                    console.log('Updated', nodeId, 'to:', value);
                }
            }
        }
    });
    
    console.log('Wedding data applied for:', weddingData.ten_nha);
}

// Get current bank info for QR code
function getCurrentBankInfo() {
    if (!weddingData || !weddingData.ngan_hang) {
        return null;
    }
    return {
        BANK_ID: weddingData.ngan_hang.bank_id,
        BANK_NAME: weddingData.ngan_hang.bank_name,
        ACCOUNT_NO: weddingData.ngan_hang.account_no,
        ACCOUNT_NAME: weddingData.ngan_hang.account_name,
        DESCRIPTION: weddingData.ngan_hang.description,
        AMOUNT: '',
        TEMPLATE: 'compact2'
    };
}

// Get current venue info
function getCurrentVenueInfo() {
    if (!weddingData || !weddingData.hon_le) {
        return null;
    }
    return weddingData.hon_le;
}

// Initialize data loading
loadWeddingData();

// Import PhotoSwipe ES modules
import PhotoSwipeLightbox from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.3/dist/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.3/dist/photoswipe.esm.min.js';

// Initialize PhotoSwipe - wait for all content to load
function initPhotoSwipe() {
    console.log('Initializing PhotoSwipe...');
    
    // Collect all images from the page for PhotoSwipe (only Cloudinary images)
    const galleryImages = [];
    const CLOUDINARY_PREFIX = 'https://res.cloudinary.com';
    
    // Helper function to get high-res Cloudinary URL
    function getHighResUrl(originalUrl) {
        // If it's a Cloudinary URL, try to get the highest quality version
        if (originalUrl.includes('cloudinary.com')) {
            // Remove any existing transformations and request original quality
            // Cloudinary URL pattern: .../upload/v12345/image.jpg
            // We can add transformation like q_auto:best,f_auto for best quality
            return originalUrl.replace('/upload/', '/upload/q_auto:best,f_auto/');
        }
        return originalUrl;
    }
    
    // Find the Album of Love gallery
    const albumGalleryDiv = document.querySelector('.photo-gallery-wrapper');
    if (albumGalleryDiv) {
        const images = albumGalleryDiv.querySelectorAll('.image-gallery-slide img');
        console.log('Found album images:', images.length);
        images.forEach(function (img) {
            // Only add Cloudinary images to PhotoSwipe gallery
            if (img.src && img.src.startsWith(CLOUDINARY_PREFIX)) {
                galleryImages.push({
                    src: getHighResUrl(img.src),
                    // Use larger default dimensions for high-res display
                    width: 4000,
                    height: 3000,
                    alt: img.alt || 'Photo'
                });
            }
        });
    }

    // Collect individual photo components
    const photoComponents = document.querySelectorAll('.photo-bg-wrap');
    console.log('Found photo components:', photoComponents.length);
    photoComponents.forEach(function (photo) {
        // Skip if already in album gallery
        if (photo.closest('.photo-gallery-wrapper')) return;

        // Extract background image URL
        const bgImage = photo.style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const imageUrl = bgImage.slice(4, -1).replace(/"/g, "");
            // Only add Cloudinary images to PhotoSwipe gallery
            if (imageUrl && imageUrl.startsWith(CLOUDINARY_PREFIX)) {
                galleryImages.push({
                    src: getHighResUrl(imageUrl),
                    // Use larger default dimensions for high-res display
                    width: 4000,
                    height: 3000,
                    alt: 'Photo'
                });
            }
        }
    });

    console.log('Total gallery images:', galleryImages.length);

    // Initialize PhotoSwipe Lightbox
    if (galleryImages.length > 0) {
        console.log('Initializing PhotoSwipe with', galleryImages.length, 'images...');
        
        // Create a hidden gallery container with data attributes
        const galleryContainer = document.createElement('div');
        galleryContainer.id = 'photoswipe-gallery';
        galleryContainer.style.display = 'none';
        
        galleryImages.forEach(function (item, index) {
            const link = document.createElement('a');
            link.href = item.src;
            link.setAttribute('data-pswp-width', item.width);
            link.setAttribute('data-pswp-height', item.height);
            link.setAttribute('target', '_blank');
            
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt;
            
            link.appendChild(img);
            galleryContainer.appendChild(link);
        });
        
        document.body.appendChild(galleryContainer);

        // Initialize PhotoSwipe Lightbox on the container
        const lightbox = new PhotoSwipeLightbox({
            gallery: '#photoswipe-gallery',
            children: 'a',
            pswpModule: PhotoSwipe,
            showHideAnimationType: 'fade',
            bgOpacity: 0.95,
            spacing: 0.1,
            allowPanToNext: true,
            zoom: true,
            close: true,
            counter: true,
            arrowKeys: true,
            pinchToClose: true,
            clickToCloseNonZoomable: false,
            imageClickAction: 'zoom',
            tapAction: 'toggle-controls',
            // Enable max zoom for sharp viewing
            maxZoomLevel: 4,
            // Preload adjacent slides for smoother navigation
            preload: [1, 2]
        });
        
        // Load actual image dimensions dynamically for better quality
        lightbox.on('itemData', (e) => {
            const img = new Image();
            img.src = e.itemData.src;
            img.onload = function() {
                e.itemData.width = this.naturalWidth || 4000;
                e.itemData.height = this.naturalHeight || 3000;
            };
        });
        
        lightbox.init();
        console.log('PhotoSwipe initialized successfully!');

        // Add click handlers to album gallery images (only for Cloudinary images)
        if (albumGalleryDiv) {
            const albumImages = albumGalleryDiv.querySelectorAll('.image-gallery-slide img');
            let cloudinaryIndex = 0;
            albumImages.forEach(function (img) {
                // Only add click handler for Cloudinary images
                if (img.src && img.src.startsWith(CLOUDINARY_PREFIX)) {
                    img.style.cursor = 'pointer';
                    const slideElement = img.closest('.image-gallery-slide');
                    if (slideElement) {
                        const currentIndex = cloudinaryIndex;
                        slideElement.addEventListener('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Opening Cloudinary image at index:', currentIndex);
                            lightbox.loadAndOpen(currentIndex);
                        });
                    }
                    cloudinaryIndex++;
                }
            });

            // Also add click handlers to the thumbnails (only for Cloudinary images)
            const thumbnailImages = albumGalleryDiv.querySelectorAll('.image-gallery-thumbnail img');
            let thumbCloudinaryIndex = 0;
            thumbnailImages.forEach(function (thumb) {
                // Only add click handler for Cloudinary images
                if (thumb.src && thumb.src.startsWith(CLOUDINARY_PREFIX)) {
                    thumb.style.cursor = 'pointer';
                    const thumbElement = thumb.closest('.image-gallery-thumbnail');
                    if (thumbElement) {
                        const currentIndex = thumbCloudinaryIndex;
                        thumbElement.addEventListener('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Opening Cloudinary image from thumbnail at index:', currentIndex);
                            lightbox.loadAndOpen(currentIndex);
                        });
                    }
                    thumbCloudinaryIndex++;
                }
            });
        }

        // Add click handlers for individual photo components (only for Cloudinary images)
        let photoIndex = albumGalleryDiv ? 
            Array.from(albumGalleryDiv.querySelectorAll('.image-gallery-slide img'))
                .filter(img => img.src && img.src.startsWith(CLOUDINARY_PREFIX)).length : 0;
        photoComponents.forEach(function (photo) {
            // Skip if already in album gallery
            if (photo.closest('.photo-gallery-wrapper')) return;

            const bgImage = photo.style.backgroundImage;
            if (bgImage && bgImage !== 'none') {
                const imageUrl = bgImage.slice(4, -1).replace(/"/g, "");
                // Only add click handler for Cloudinary images
                if (imageUrl && imageUrl.startsWith(CLOUDINARY_PREFIX)) {
                    const container = photo.closest('[data-node-id]');
                    if (container && !container.classList.contains('component-locked')) {
                        container.style.cursor = 'pointer';
                        const currentIndex = photoIndex;
                        container.addEventListener('click', function (e) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Opening individual Cloudinary photo at index:', currentIndex);
                            lightbox.loadAndOpen(currentIndex);
                        });
                        photoIndex++;
                    }
                }
            }
        });
    } else {
        console.error('No images found for PhotoSwipe gallery');
    }
}

// Try to initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded');
    // Wait for dynamic content to load
    setTimeout(initPhotoSwipe, 2000);
});

// Also try when everything is fully loaded
window.addEventListener('load', function () {
    console.log('Window Loaded');
    // Try again after full load if elements weren't found before
   setTimeout(function() {
        const galleryDiv = document.querySelector('.photo-gallery-wrapper');
        if (galleryDiv && galleryDiv.querySelectorAll('.image-gallery-slide img').length > 0) {
            console.log('Gallery found after window load, re-initializing...');
            initPhotoSwipe();
        }
    }, 1000);
});

// ==========================================
// COUNTDOWN TIMER - Wedding Date: 28/12/2025 16:00
// ==========================================
function initCountdown() {
    // Wedding date: December 28, 2025 at 16:00 (4:00 PM)
    const weddingDate = new Date('2025-12-28T16:00:00+07:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        // Get countdown elements
        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const secondsEl = document.getElementById('countdown-seconds');
        
        // Check if elements exist
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
            console.log('Countdown elements not found, retrying...');
            return;
        }
        
        // If countdown is over
        if (distance < 0) {
            daysEl.textContent = '0';
            hoursEl.textContent = '0';
            minutesEl.textContent = '0';
            secondsEl.textContent = '0';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update the display
        daysEl.textContent = days;
        hoursEl.textContent = hours < 10 ? '0' + hours : hours;
        minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }
    
    // Update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
    console.log('Countdown initialized!');
}

// Initialize countdown when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initCountdown, 2000);
});

// Also try on window load
window.addEventListener('load', function() {
    setTimeout(initCountdown, 1500);
});

// ==========================================
// CAROUSEL AUTO-SLIDE - Change slides every 2 seconds
// ==========================================
let carouselInitialized = false; // Prevent double initialization

function initCarousel() {
    // Prevent double initialization
    if (carouselInitialized) {
        console.log('Carousel already initialized, skipping...');
        return;
    }
    
    const gallery = document.querySelector('.photo-gallery-wrapper');
    if (!gallery) {
        console.log('Gallery not found for carousel');
        return;
    }
    
    const slides = gallery.querySelectorAll('.image-gallery-slide');
    if (slides.length === 0) {
        console.log('No slides found for carousel');
        return;
    }
    
    // Mark as initialized
    carouselInitialized = true;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    const slideInterval = 3000; // 2 seconds
    
    function updateSlides() {
        slides.forEach((slide, index) => {
            // Calculate position relative to current slide
            let position;
            const diff = index - currentIndex;
            
            if (diff === 0) {
                position = 0;
                slide.classList.add('image-gallery-center');
                slide.classList.remove('image-gallery-left', 'image-gallery-right');
            } else if (diff === -1 || (currentIndex === 0 && index === totalSlides - 1)) {
                position = -100;
                slide.classList.add('image-gallery-left');
                slide.classList.remove('image-gallery-center', 'image-gallery-right');
            } else if (diff === 1 || (currentIndex === totalSlides - 1 && index === 0)) {
                position = 100;
                slide.classList.add('image-gallery-right');
                slide.classList.remove('image-gallery-center', 'image-gallery-left');
            } else {
                position = diff * 100;
                slide.classList.remove('image-gallery-center', 'image-gallery-left', 'image-gallery-right');
            }
            
            slide.style.transform = `translate3d(${position}%, 0px, 0px)`;
            slide.style.transition = '450ms ease-out';
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlides();
    }
    
    // Start auto-sliding
    let autoSlideInterval = setInterval(nextSlide, slideInterval);
    
    // Pause on hover/touch
    gallery.addEventListener('mouseenter', function() {
        clearInterval(autoSlideInterval);
    });
    
    gallery.addEventListener('mouseleave', function() {
        autoSlideInterval = setInterval(nextSlide, slideInterval);
    });
    
    // Pause on touch for mobile
    gallery.addEventListener('touchstart', function() {
        clearInterval(autoSlideInterval);
    }, { passive: true });
    
    gallery.addEventListener('touchend', function() {
        // Resume after 5 seconds
        setTimeout(function() {
            autoSlideInterval = setInterval(nextSlide, slideInterval);
        }, 5000);
    }, { passive: true });
    
    console.log('Carousel initialized with', totalSlides, 'slides!');
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initCarousel, 2500);
});

// Also try on window load
window.addEventListener('load', function() {
    setTimeout(initCarousel, 2000);
});
// ==========================================
// ENVELOPE OPEN/CLOSE - Click to toggle
// ==========================================
let envelopeInitialized = false; // Prevent double initialization

function initEnvelope() {
    // Prevent double initialization
    if (envelopeInitialized) {
        console.log('Envelope already initialized, skipping...');
        return;
    }
    
    // Find the outer envelope component (first one with this data-node-id)
    const envelopeComponent = document.querySelector('.animated-envelope-component[data-node-id="FlIA12U-JR"]');
    
    if (!envelopeComponent) {
        console.log('Envelope component not found');
        return;
    }
    
    // Find the envelope-container inside it
    const envelopeContainer = envelopeComponent.querySelector('.envelope-container');
    
    if (!envelopeContainer) {
        console.log('Envelope container not found');
        return;
    }
    
    // Mark as initialized
    envelopeInitialized = true;
    
    console.log('Found envelope container:', envelopeContainer.className);
    
    // Make it clickable
    envelopeComponent.style.cursor = 'pointer';
    
    // Add click event on the whole component
    envelopeComponent.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        
        console.log('Envelope clicked!');
        
        // Always try to play music when envelope is clicked
        const audio = document.getElementById('bg-music');
        const audioToggle = document.querySelector('.audio-toggle');
        if (audio && audio.paused) {
            audio.volume = 0.5;
            audio.play().then(() => {
                musicPlaying = true;
                musicInitialized = true;
                if (audioToggle) audioToggle.classList.add('playing');
                console.log('Music started from envelope click');
            }).catch(err => {
                console.log('Music play error:', err);
            });
        }
        
        // Toggle between open and close
        const isOpen = envelopeContainer.classList.contains('open');
        
        if (isOpen) {
            envelopeContainer.classList.remove('open');
            envelopeContainer.classList.add('close');
            console.log('Envelope closed. Classes:', envelopeContainer.className);
        } else {
            envelopeContainer.classList.remove('close');
            envelopeContainer.classList.add('open');
            console.log('Envelope opened. Classes:', envelopeContainer.className);
        }
    });
    
    console.log('Envelope click handler initialized!');
}

// Initialize envelope when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initEnvelope, 1500);
});

// Also try on window load
window.addEventListener('load', function() {
    setTimeout(initEnvelope, 1000);
});

// ==========================================
// BACKGROUND MUSIC - Click to play, icon to toggle
// ==========================================
let musicInitialized = false;
let musicPlaying = false;

function initMusic() {
    if (musicInitialized) return;
    
    const audio = document.getElementById('bg-music');
    const musicIcon = document.querySelector('.music-icon');
    const audioToggle = document.querySelector('.audio-toggle');
    
    if (!audio) {
        console.log('Audio element not found');
        return;
    }
    
    musicInitialized = true;
    
    // Set initial volume
    audio.volume = 0.5;
    
    // Function to play music
    function playMusic() {
        audio.play().then(() => {
            musicPlaying = true;
            if (audioToggle) audioToggle.classList.add('playing');
            console.log('Music playing');
        }).catch(err => {
            console.log('Music play error:', err);
        });
    }
    
    // Function to pause music
    function pauseMusic() {
        audio.pause();
        musicPlaying = false;
        if (audioToggle) audioToggle.classList.remove('playing');
        console.log('Music paused');
    }
    
    // Function to toggle music
    function toggleMusic() {
        if (musicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }
    
    // First click anywhere on page starts the music (doesn't block the event)
    let firstClickHandled = false;
    document.addEventListener('click', function(e) {
        if (firstClickHandled) return;
        
        // Don't trigger on music icon (it has its own handler)
        const target = e.target;
        if (target && target.closest && (target.closest('.audio-toggle') || target.closest('.music-icon'))) {
            return;
        }
        
        firstClickHandled = true;
        playMusic();
        console.log('First click - music started (event continues)');
        // Don't stop propagation - let the original click event continue
    }, false);
    
    // Music icon click toggles music
    if (musicIcon) {
        musicIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            firstClickHandled = true; // Mark as handled
            toggleMusic();
        });
    }
    
    if (audioToggle) {
        audioToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            firstClickHandled = true; // Mark as handled
            toggleMusic();
        });
    }
    
    console.log('Music controller initialized!');
}

// Initialize music when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMusic, 500);
});

// Also try on window load
window.addEventListener('load', function() {
    setTimeout(initMusic, 300);
});

// ==========================================
// QR CODE POPUP - Show VietQR when clicking qr-box-component
// ==========================================
let qrInitialized = false;

function initQRPopup() {
    if (qrInitialized) return;
    
    const qrBoxes = document.querySelectorAll('.qr-box-component');
    
    if (qrBoxes.length === 0) {
        console.log('QR box component not found');
        return;
    }
    
    qrInitialized = true;
    
    // Get bank info from loaded data, or use fallback
    function getBankInfoForQR() {
        // Try to get from loaded wedding data first
        const dynamicInfo = getCurrentBankInfo();
        if (dynamicInfo) {
            return dynamicInfo;
        }
        
        // Fallback to default values if data not loaded
        return {
            BANK_ID: 'VPB',
            BANK_NAME: 'VPBank',
            ACCOUNT_NO: '99015012001',
            ACCOUNT_NAME: 'LE QUANG DAI',
            AMOUNT: '',
            DESCRIPTION: 'Chuc mung hanh phuc',
            TEMPLATE: 'compact2'
        };
    }
    
    // Build VietQR URL
    function buildVietQRUrl() {
        const BANK_INFO = getBankInfoForQR();
        let url = `https://img.vietqr.io/image/${BANK_INFO.BANK_ID}-${BANK_INFO.ACCOUNT_NO}-${BANK_INFO.TEMPLATE}.png`;
        const params = [];
        
        if (BANK_INFO.AMOUNT) {
            params.push(`amount=${BANK_INFO.AMOUNT}`);
        }
        if (BANK_INFO.DESCRIPTION) {
            params.push(`addInfo=${encodeURIComponent(BANK_INFO.DESCRIPTION)}`);
        }
        if (BANK_INFO.ACCOUNT_NAME) {
            params.push(`accountName=${encodeURIComponent(BANK_INFO.ACCOUNT_NAME)}`);
        }
        
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
        
        return url;
    }
    
    // Add click handler to all QR boxes
    qrBoxes.forEach(function(qrBox) {
        qrBox.style.cursor = 'pointer';
        
        qrBox.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const BANK_INFO = getBankInfoForQR();
            const qrUrl = buildVietQRUrl();
            
            // Check if SweetAlert2 is loaded
            if (typeof Swal === 'undefined') {
                console.log('SweetAlert2 not loaded');
                return;
            }
            
            Swal.fire({
                title: '💝 Mừng Cưới 💝',
                html: `
                    <div style="text-align: center;">
                        <img src="${qrUrl}" alt="VietQR" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: left;">
                            <p style="margin: 5px 0;"><strong>Ngân hàng:</strong> ${BANK_INFO.BANK_NAME}</p>
                            <p style="margin: 5px 0;"><strong>Số TK:</strong> ${BANK_INFO.ACCOUNT_NO}</p>
                            <p style="margin: 5px 0;"><strong>Chủ TK:</strong> ${BANK_INFO.ACCOUNT_NAME}</p>
                        </div>
                        <p style="margin-top: 15px; color: #666; font-size: 14px;">Quét mã QR để chuyển khoản 💕</p>
                    </div>
                `,
                showCloseButton: true,
                showConfirmButton: false,
                width: 'auto',
                padding: '20px',
                background: '#fff',
                customClass: {
                    popup: 'qr-popup'
                }
            });
        });
    });
    
    console.log('QR Popup initialized with', qrBoxes.length, 'QR boxes!');
}

// Initialize QR popup when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initQRPopup, 1000);
});

// Also try on window load
window.addEventListener('load', function() {
    setTimeout(initQRPopup, 800);
});

// ==========================================
// FLOATING TOOLBAR - Directions & Gift buttons
// ==========================================
let toolbarInitialized = false;

function initToolbar() {
    if (toolbarInitialized) return;
    
    const btnDirections = document.getElementById('btn-directions');
    const btnGift = document.getElementById('btn-gift');
    
    if (!btnDirections || !btnGift) {
        console.log('Toolbar buttons not found');
        return;
    }
    
    toolbarInitialized = true;
    
    // Directions button - open Google Maps
    btnDirections.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get directions link from wedding data
        let mapsUrl = 'https://maps.google.com';
        
        if (weddingData && weddingData.hon_le && weddingData.hon_le.link_chi_duong) {
            mapsUrl = weddingData.hon_le.link_chi_duong;
        }
        
        // Open in new tab/app
        window.open(mapsUrl, '_blank');
        console.log('Opening directions:', mapsUrl);
    });
    
    // Also add directions click to element with data-node-id="MXcj3JAluy"
    const chiDuongElement = document.querySelector('[data-node-id="MXcj3JAluy"]');
    if (chiDuongElement) {
        chiDuongElement.style.cursor = 'pointer';
        chiDuongElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            let mapsUrl = 'https://maps.google.com';
            if (weddingData && weddingData.hon_le && weddingData.hon_le.link_chi_duong) {
                mapsUrl = weddingData.hon_le.link_chi_duong;
            }
            
            window.open(mapsUrl, '_blank');
            console.log('Opening directions from chi duong element:', mapsUrl);
        });
        console.log('Chi duong element click handler added');
    }
    
    // Gift button - show QR code popup
    btnGift.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const BANK_INFO = getCurrentBankInfo() || {
            BANK_ID: 'VPB',
            BANK_NAME: 'VPBank',
            ACCOUNT_NO: '99015012001',
            ACCOUNT_NAME: 'LE QUANG DAI',
            DESCRIPTION: 'Chuc mung hanh phuc'
        };
        
        // Build QR URL
        let qrUrl = `https://img.vietqr.io/image/${BANK_INFO.BANK_ID}-${BANK_INFO.ACCOUNT_NO}-compact2.png`;
        qrUrl += `?addInfo=${encodeURIComponent(BANK_INFO.DESCRIPTION || 'Mung cuoi')}`;
        qrUrl += `&accountName=${encodeURIComponent(BANK_INFO.ACCOUNT_NAME)}`;
        
        // Check if SweetAlert2 is loaded
        if (typeof Swal === 'undefined') {
            console.log('SweetAlert2 not loaded');
            return;
        }
        
        Swal.fire({
            title: '💝 Gửi Quà Mừng Cưới 💝',
            html: `
                <div style="text-align: center;">
                    <img src="${qrUrl}" alt="VietQR" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px;">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: left;">
                        <p style="margin: 5px 0;"><strong>Ngân hàng:</strong> ${BANK_INFO.BANK_NAME || BANK_INFO.BANK_ID}</p>
                        <p style="margin: 5px 0;"><strong>Số TK:</strong> ${BANK_INFO.ACCOUNT_NO}</p>
                        <p style="margin: 5px 0;"><strong>Chủ TK:</strong> ${BANK_INFO.ACCOUNT_NAME}</p>
                    </div>
                    <p style="margin-top: 15px; color: #666; font-size: 14px;">Quét mã QR để chuyển khoản 💕</p>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            width: 'auto',
            padding: '20px',
            background: '#fff',
            customClass: {
                popup: 'qr-popup'
            }
        });
        
        console.log('Gift QR popup shown');
    });
    
    console.log('Toolbar initialized!');
}

// Initialize toolbar when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initToolbar, 500);
});

// Also try on window load
window.addEventListener('load', function() {
    setTimeout(initToolbar, 300);
});

// ==========================================
// CUSTOM SCROLL ANIMATION - Using Intersection Observer
// Works better with position:absolute elements than AOS
// ==========================================
function initScrollAnimations() {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
        console.log('IntersectionObserver not supported');
        return;
    }
    
    // Get all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (animatedElements.length === 0) {
        console.log('No elements with data-aos found');
        return;
    }
    
    // Add initial hidden state CSS
    animatedElements.forEach(function(element) {
        const animation = element.getAttribute('data-aos');
        const delay = element.getAttribute('data-aos-delay') || 0;
        
        // Set transition
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        element.style.transitionDelay = delay + 'ms';
        
        // Set initial hidden state based on animation type
        element.style.opacity = '0';
        
        if (animation === 'fade-left') {
            element.style.transform = 'translateX(50px)';
        } else if (animation === 'fade-right') {
            element.style.transform = 'translateX(-50px)';
        } else if (animation === 'fade-up') {
            element.style.transform = 'translateY(50px)';
        } else if (animation === 'fade-down') {
            element.style.transform = 'translateY(-50px)';
        } else if (animation === 'zoom-in') {
            element.style.transform = 'scale(0.8)';
        } else {
            element.style.transform = 'translateY(30px)';
        }
    });
    
    // Create Intersection Observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                // Animate to visible state
                el.style.opacity = '1';
                el.style.transform = 'translateX(0) translateY(0) scale(1)';
                
                // Add class for CSS reference
                el.classList.add('aos-animate');
                
                // Stop observing this element
                observer.unobserve(el);
                
                console.log('Animated element:', el.getAttribute('data-node-id') || 'unknown');
            }
        });
    }, {
        threshold: 0.1,      // Trigger when 10% visible
        rootMargin: '0px'    // No margin
    });
    
    // Observe all animated elements
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
    
    console.log('Custom scroll animation initialized!', animatedElements.length, 'elements');
}

// Initialize scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initScrollAnimations, 1000);
});

// Also try on window load
window.addEventListener('load', function() {
    setTimeout(initScrollAnimations, 500);
});
