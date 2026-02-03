// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-24WP7GNL8X');

// ==========================================
// SECURITY - Prevent viewing source code
// ==========================================
// (function() {
//     // Disable right-click
//     document.addEventListener('contextmenu', function(e) {
//         e.preventDefault();
//         return false;
//     });
    
//     // Disable keyboard shortcuts (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C)
//     document.addEventListener('keydown', function(e) {
//         // F12
//         if (e.keyCode === 123) {
//             e.preventDefault();
//             return false;
//         }
//         // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
//         if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
//             e.preventDefault();
//             return false;
//         }
//         // Ctrl+U (View Source)
//         if (e.ctrlKey && e.keyCode === 85) {
//             e.preventDefault();
//             return false;
//         }
//         // Ctrl+S (Save)
//         if (e.ctrlKey && e.keyCode === 83) {
//             e.preventDefault();
//             return false;
//         }
//     });
    
//     // Console warning
//     console.log('%c⚠️ CẢNH BÁO!', 'color: red; font-size: 40px; font-weight: bold;');
//     console.log('%cĐây là tính năng dành cho developers. Nếu ai đó yêu cầu bạn paste mã vào đây, đó có thể là lừa đảo!', 'color: red; font-size: 16px;');
    
//    // Clear console periodically
//     setInterval(function() {
//         console.clear();
//     }, 1000);
// })();

// ==========================================
// DYNAMIC DATA LOADING - Based on URL parameter
// ==========================================

// ⚠️ ALBUM IMAGES - Thay đổi mảng này để cập nhật ảnh trong Album
// 
// HƯỚNG DẪN SỬ DỤNG GOOGLE DRIVE:
// 1. Upload ảnh lên Google Drive
// 2. Click chuột phải -> Share -> Anyone with the link -> Copy link
// 3. Link phải có dạng: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
//    (KHÔNG dùng link drive-viewer vì nó không hoạt động!)
//
// Hoặc dùng URL ảnh trực tiếp từ: Cloudinary, Imgur, hoặc server của bạn
//
const ALBUM_IMAGES = [
    // Ảnh demo - thay thế bằng ảnh của bạn
    'https://assets.cinelove.me/templates/assets/5731de59-c0f3-4fa7-9860-e5e47b829ce3/86b9e00f-fe4b-468c-bc56-a5de1b4df1b6.jpg',
    'https://assets.cinelove.me/templates/assets/5731de59-c0f3-4fa7-9860-e5e47b829ce3/c4d45265-947c-414c-b53f-f291586faeea.jpg',
    'https://assets.cinelove.me/templates/assets/5731de59-c0f3-4fa7-9860-e5e47b829ce3/4f47af51-8e8a-4d7b-ac15-3ab24b0a79a5.jpg',
    // Thêm ảnh Google Drive (đúng format):
    // 'https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing',
];

// Helper function: Convert Google Drive sharing link to direct image URL
function convertToDirectUrl(url) {
    // Pattern 1: Standard sharing link
    // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    let driveMatch = url.match(/drive\.google\.com\/file\/d\/([^\/\?]+)/);
    if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }
    
    // Pattern 2: Open link
    // https://drive.google.com/open?id=FILE_ID
    driveMatch = url.match(/drive\.google\.com\/open\?id=([^&]+)/);
    if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    }
    
    // Pattern 3: Thumbnail link (already direct)
    if (url.includes('drive.google.com/thumbnail')) {
        return url;
    }
    
    // Pattern 4: uc?export link (already direct)
    if (url.includes('drive.google.com/uc')) {
        return url;
    }
    
    // Return original URL for non-Google Drive links
    return url;
}

// Get processed album URLs
function getAlbumUrls() {
    return ALBUM_IMAGES.filter(url => url && !url.includes('drive-viewer')).map(convertToDirectUrl);
}

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

// ==========================================
// GOOGLE SHEETS GUEST NAME - Load guest name from Google Sheets
// ==========================================
// HƯỚNG DẪN SỬ DỤNG:
// 1. Tạo Google Sheet với cột A = ID, cột B = Tên khách mời
// 2. Chia sẻ Sheet ở chế độ "Anyone with the link can view"
// 3. Lấy Sheet ID từ URL: https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
// 4. Thay thế GOOGLE_SHEET_ID bên dưới bằng ID của bạn
// 5. Gửi link cho khách: yoursite.com/?guest=1 (1 là ID trong Sheet)

// ⚠️ THAY ĐỔI SHEET_ID NÀY BẰNG ID GOOGLE SHEET CỦA BẠN
const GOOGLE_SHEET_ID = '1TM2IW82oSgv9g1v4cv8WLGLBRhSbMrZ2ab8sflhwllk';
const GOOGLE_SHEET_NAME = 'Danh Sách Khách Mai Anh'; // Tên sheet (mặc định là Sheet1)

let guestName = null;

// Đọc dữ liệu khách mời từ Google Sheets
async function loadGuestFromGoogleSheets() {
    try {
        // Lấy guest ID từ URL parameter
        const guestId = getUrlParam('guest');
        
        if (!guestId) {
            console.log('No guest parameter in URL');
            return null;
        }
        
        console.log('Loading guest with ID:', guestId);
        
        // URL để lấy Google Sheets dưới dạng CSV
        // Format: https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet={SHEET_NAME}
        const sheetsUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(GOOGLE_SHEET_NAME)}`;
        
        const response = await fetch(sheetsUrl);
        const text = await response.text();
        
        // Parse Google Sheets JSON response (wrapped trong "google.visualization.Query.setResponse(...)")
        const jsonString = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
        if (!jsonString || !jsonString[1]) {
            console.error('Could not parse Google Sheets response');
            return null;
        }
        
        const data = JSON.parse(jsonString[1]);
        
        if (!data.table || !data.table.rows) {
            console.error('No data found in Google Sheets');
            return null;
        }
        
        // Tìm khách mời theo ID (cột A)
        // Row format: { c: [{ v: "ID" }, { v: "Tên" }, ...] }
        const rows = data.table.rows;
        
        console.log('Total rows in sheet:', rows.length);
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row.c || !row.c[0] || row.c[0].v === null || row.c[0].v === undefined) continue;
            
            // Lấy ID từ cell và xử lý cả số lẫn chuỗi
            const cellValue = row.c[0].v;
            const rowId = String(cellValue).trim();
            const searchId = String(guestId).trim();
            
            console.log(`Row ${i}: ID="${rowId}" comparing with "${searchId}"`);
            
            // So sánh flexible: cả string và number
            if (rowId === searchId || cellValue == guestId) {
                // Lấy tên từ cột B (index 1)
                guestName = row.c[1] ? row.c[1].v : null;
                console.log('Found guest:', guestName, 'at row', i);
                
                // Cập nhật giao diện
                updateGuestNameDisplay(guestName);
                return guestName;
            }
        }
        
        console.log('Guest ID not found in sheet. Searched for:', guestId);
        return null;
        
    } catch (error) {
        console.error('Error loading guest from Google Sheets:', error);
        return null;
    }
}

// Cập nhật hiển thị tên khách mời trên ảnh letter trong phong bì
function updateGuestNameDisplay(name) {
    if (!name) return;
    
    // Tìm phần letter trong phong bì
    const letterElement = document.querySelector('.letter');
    
    if (letterElement) {
        // Đảm bảo letter có position relative để overlay hoạt động
        letterElement.style.position = 'relative';
        
        // Kiểm tra xem đã có overlay chưa
        let guestOverlay = letterElement.querySelector('.guest-name-overlay');
        
        if (!guestOverlay) {
            // Tạo overlay cho tên khách mời
            guestOverlay = document.createElement('div');
            guestOverlay.className = 'guest-name-overlay';
            guestOverlay.style.cssText = `
                position: absolute;
                bottom: 13%;
                left: 40%;
                transform: translateX(-50%);
                color: rgb(58, 74, 58);
                font-size: 18px;
                font-family: "Dancing Script", "Great Vibes", cursive;
                font-weight: 500;
                text-align: center;
                white-space: nowrap;
                pointer-events: none;
                z-index: 10;
            `;
            letterElement.appendChild(guestOverlay);
        }
        
        // Cập nhật tên
        guestOverlay.textContent = name;
        console.log('Updated letter with guest name:', name);
    } else {
        console.log('Letter element not found');
    }
}

// Khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Đợi một chút để DOM load xong
    setTimeout(loadGuestFromGoogleSheets, 1000);
});

// Cũng thử khi window load hoàn tất
window.addEventListener('load', function() {
    setTimeout(function() {
        // Nếu chưa load được, thử lại
        if (!guestName && getUrlParam('guest')) {
            loadGuestFromGoogleSheets();
        }
    }, 1500);
});

// Import PhotoSwipe ES modules
import PhotoSwipeLightbox from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.3/dist/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from 'https://cdn.jsdelivr.net/npm/photoswipe@5.4.3/dist/photoswipe.esm.min.js';

// Initialize PhotoSwipe - wait for all content to load
function initPhotoSwipe() {
    console.log('Initializing PhotoSwipe...');
    
    // Collect all images for PhotoSwipe
    const galleryImages = [];
    
    // Helper function to get high-res URL
    function getHighResUrl(originalUrl) {
        // If it's a Cloudinary URL, get highest quality
        if (originalUrl.includes('cloudinary.com')) {
            return originalUrl.replace('/upload/', '/upload/q_auto:best,f_auto/');
        }
        // If it's a cinelove URL with resize params, remove them for full quality
        if (originalUrl.includes('img.cinelove.me')) {
            return originalUrl.replace(/\?resize=.*$/, '').replace('img.cinelove.me', 'assets.cinelove.me');
        }
        return originalUrl;
    }
    
    // PRIORITY 1: Use ALBUM_IMAGES config if defined and has images
    if (typeof ALBUM_IMAGES !== 'undefined' && ALBUM_IMAGES.length > 0) {
        console.log('Using ALBUM_IMAGES config with', ALBUM_IMAGES.length, 'images');
        const processedUrls = getAlbumUrls();
        processedUrls.forEach(function(url, index) {
            galleryImages.push({
                src: url,
                width: 2000,
                height: 1500,
                alt: 'Photo ' + (index + 1)
            });
        });
    }
    
    // PRIORITY 2: If no config images, collect from DOM
    if (galleryImages.length === 0) {
        const albumGalleryDiv = document.querySelector('.photo-gallery-wrapper');
        if (albumGalleryDiv) {
            // Get main display image
            const mainImages = albumGalleryDiv.querySelectorAll('.object-contain, .object-cover');
            console.log('Found main album images in DOM:', mainImages.length);
            
            // Use a Set to avoid duplicates
            const addedUrls = new Set();
            
            mainImages.forEach(function (img) {
                if (img.src && !addedUrls.has(img.src)) {
                    const highResUrl = getHighResUrl(img.src);
                    if (!addedUrls.has(highResUrl)) {
                        addedUrls.add(highResUrl);
                        addedUrls.add(img.src);
                        galleryImages.push({
                            src: highResUrl,
                            width: 2000,
                            height: 1500,
                            alt: img.alt || 'Photo'
                        });
                    }
                }
            });
            
            // Also get thumbnails if main images weren't found
            if (galleryImages.length === 0) {
                const thumbs = albumGalleryDiv.querySelectorAll('button img');
                thumbs.forEach(function (img) {
                    if (img.src && !addedUrls.has(img.src)) {
                        const highResUrl = getHighResUrl(img.src);
                        if (!addedUrls.has(highResUrl)) {
                            addedUrls.add(highResUrl);
                            addedUrls.add(img.src);
                            galleryImages.push({
                                src: highResUrl,
                                width: 2000,
                                height: 1500,
                                alt: img.alt || 'Photo'
                            });
                        }
                    }
                });
            }
        }
    }

    console.log('Total gallery images for PhotoSwipe:', galleryImages.length);

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
            maxZoomLevel: 4,
            preload: [1, 2]
        });
        
        // Load actual image dimensions dynamically
        lightbox.on('itemData', (e) => {
            const img = new Image();
            img.src = e.itemData.src;
            img.onload = function() {
                e.itemData.width = this.naturalWidth || 2000;
                e.itemData.height = this.naturalHeight || 1500;
            };
        });
        
        lightbox.init();
        console.log('PhotoSwipe initialized successfully!');
        
        // Store lightbox globally for access
        window.photoSwipeLightbox = lightbox;

        // Add click handlers to Album - main image area
        const galleryDiv = document.querySelector('.photo-gallery-wrapper');
        if (galleryDiv) {
            // Click on main display area opens lightbox
            const mainDisplayArea = galleryDiv.querySelector('.relative.flex-1');
            if (mainDisplayArea) {
                mainDisplayArea.style.cursor = 'pointer';
                mainDisplayArea.addEventListener('click', function(e) {
                    // Don't trigger on navigation buttons
                    if (e.target && e.target.closest && e.target.closest('button')) return;
                    
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // For ALBUM_IMAGES config, always start at 0 or use current slide index
                    let currentIndex = 0;
                    
                    // Try to get current slide index from thumbnail
                    const activeThumbnail = galleryDiv.querySelector('button.border-blue-500');
                    if (activeThumbnail) {
                        const allThumbs = galleryDiv.querySelectorAll('.flex.gap-2 button');
                        allThumbs.forEach((thumb, idx) => {
                            if (thumb === activeThumbnail) {
                                currentIndex = idx;
                            }
                        });
                    }
                    
                    console.log('Opening PhotoSwipe at index:', currentIndex);
                    lightbox.loadAndOpen(currentIndex);
                });
            }
            
            // Also add click to fullscreen button
            const fullscreenBtn = galleryDiv.querySelector('button.absolute.right-2.top-2');
            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    let currentIndex = 0;
                    const activeThumbnail = galleryDiv.querySelector('button.border-blue-500');
                    if (activeThumbnail) {
                        const allThumbs = galleryDiv.querySelectorAll('.flex.gap-2 button');
                        allThumbs.forEach((thumb, idx) => {
                            if (thumb === activeThumbnail) {
                                currentIndex = idx;
                            }
                        });
                    }
                    
                    console.log('Opening PhotoSwipe from fullscreen button at index:', currentIndex);
                    lightbox.loadAndOpen(currentIndex);
                });
            }
        }
    } else {
        console.log('No images found for PhotoSwipe in album gallery');
    }
}

// Try to initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded');
    // Wait for dynamic content to load
    setTimeout(initPhotoSwipe, 2000);
    // Initialize mobile responsive scaling
    initMobileResponsive();
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
    // Re-apply mobile scaling after full load
    initMobileResponsive();
});

// ==========================================
// MOBILE RESPONSIVE - Dynamic scaling
// ==========================================
function initMobileResponsive() {
    const container = document.getElementById('root-page-container');
    if (!container) return;
    
    const originalWidth = 500; // Original design width
    
    function applyScale() {
        const viewportWidth = window.innerWidth;
        
        // Only apply on mobile (< 520px)
        if (viewportWidth < 520) {
            const scaleFactor = viewportWidth / originalWidth;
            
            // Apply to container
            container.style.width = '100vw';
            container.style.maxWidth = '100vw';
            container.style.transform = 'none';
            container.style.left = '0';
            
            // Find the innermost content wrapper
            const innerWrapper = container.querySelector('.w-full.h-full');
            if (innerWrapper) {
                innerWrapper.style.transform = `scale(${scaleFactor})`;
                innerWrapper.style.transformOrigin = 'top left';
                innerWrapper.style.width = originalWidth + 'px';
            }
            
            console.log('Mobile responsive applied, scale:', scaleFactor);
        } else {
            // Reset on desktop
            container.style.width = '';
            container.style.maxWidth = '';
            container.style.transform = '';
            container.style.left = '';
            
            const innerWrapper = container.querySelector('.w-full.h-full');
            if (innerWrapper) {
                innerWrapper.style.transform = '';
                innerWrapper.style.transformOrigin = '';
                innerWrapper.style.width = '';
            }
        }
    }
    
    // Apply on load and resize
    applyScale();
    window.addEventListener('resize', applyScale);
}

// ==========================================
// COUNTDOWN TIMER - Wedding Date: 28/12/2025 16:00
// ==========================================
function initCountdown() {
    // Wedding date: December 28, 2025 at 23:00 (23:00 PM)
    const weddingDate = new Date('2025-12-28T23:00:00+07:00').getTime();
    
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
    const slideInterval = 5000; // 2 seconds
    
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
    
    // Find the envelope component - try multiple selectors
    let envelopeComponent = document.querySelector('.animated-envelope-component[data-node-id="rP4afTQMIg"]');
    
    // Fallback: find by class only
    if (!envelopeComponent) {
        envelopeComponent = document.querySelector('.animated-envelope-component');
    }
    
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
    
    // Find clickable elements inside envelope
    const waxSeal = envelopeComponent.querySelector('.wax-seal');
    const letter = envelopeComponent.querySelector('.letter');
    const flap = envelopeComponent.querySelector('.flap');
    const pocket = envelopeComponent.querySelector('.pocket');
    
    // Function to toggle envelope
    function toggleEnvelope(e) {
        e.stopPropagation();
        e.preventDefault();
        
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
    }
    
    // Add click event on the whole component
    envelopeComponent.addEventListener('click', toggleEnvelope);
    
    // Also add click to individual parts for better touch support
    if (waxSeal) {
        waxSeal.style.cursor = 'pointer';
        waxSeal.addEventListener('click', toggleEnvelope);
    }
    if (letter) {
        letter.style.cursor = 'pointer';
        letter.addEventListener('click', toggleEnvelope);
    }
    if (flap) {
        flap.style.cursor = 'pointer';
        flap.addEventListener('click', toggleEnvelope);
    }
    if (pocket) {
        pocket.style.cursor = 'pointer';
        pocket.addEventListener('click', toggleEnvelope);
    }
    
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
// FIREWORK EFFECT - Canvas Confetti
// ==========================================
function triggerFireworks() {
    if (typeof confetti === 'undefined') {
        console.log('Confetti library not loaded');
        return;
    }
    
    // Create multiple bursts for firework effect
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'];
    
    // Center burst
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.6 },
        colors: colors,
        startVelocity: 45,
        gravity: 1,
        scalar: 1.2
    });
    
    // Left burst
    setTimeout(function() {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors: colors
        });
    }, 150);
    
    // Right burst
    setTimeout(function() {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors: colors
        });
    }, 300);
    
    // Top burst
    setTimeout(function() {
        confetti({
            particleCount: 80,
            spread: 100,
            origin: { x: 0.5, y: 0.3 },
            colors: colors,
            startVelocity: 30
        });
    }, 450);
    
    console.log('Fireworks triggered!');
}

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
        
        // Trigger firework effect
        triggerFireworks();
        
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
        
        console.log('Gift QR popup shown with fireworks!');
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

// ==========================================
// RSVP FORM - Submit attendance to Google Sheets
// Sử dụng chung Google Sheet với danh sách khách mời ở trên
// Sheet ID: 135CDt4uSmH-HRrxicnsqSXuk3sW1N0eccLbynacM_mE
// Sheet Name: Danh Sách Khách Đại
// ==========================================

// ⚠️ URL Apps Script đã được cấu hình
// Vào Sheet > Extensions > Apps Script > Deploy > Web app
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz36Y6hzXT9kX2CiYzAgH9cGuNbusHzj4ViC4VNLiB4I9ZrfeQ24CtezzJMwFJI9D39/exec';

// Khởi tạo form RSVP
function initRSVPForm() {
    const rsvpForm = document.querySelector('.rsvp-form form');
    const nameInput = document.querySelector('input[name="rsvp-name"]');
    
    if (!rsvpForm) {
        console.log('RSVP form not found');
        return;
    }
    
    // Pre-fill tên khách nếu đã load từ Google Sheets
    if (guestName && nameInput) {
        nameInput.value = guestName;
        nameInput.setAttribute('readonly', 'readonly');
        nameInput.style.backgroundColor = '#f0f0f0';
        nameInput.style.cursor = 'not-allowed';
        console.log('Pre-filled guest name:', guestName);
    }
    
    // Handle form submit
    rsvpForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = nameInput ? nameInput.value.trim() : '';
        const attendanceRadio = document.querySelector('input[name="rsvp-attendance"]:checked');
        const attendance = attendanceRadio ? attendanceRadio.value : 'yes';
        const guestId = getUrlParam('guest');
        
        if (!name) {
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin',
                text: 'Vui lòng nhập họ tên của bạn!',
                confirmButtonColor: '#3a4a3a'
            });
            return;
        }
        
        // Kiểm tra URL Apps Script
        if (APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL') {
            Swal.fire({
                icon: 'info',
                title: 'Cảm ơn bạn!',
                text: attendance === 'yes' 
                    ? 'Chúng tôi rất vui được đón tiếp bạn!' 
                    : 'Cảm ơn bạn đã phản hồi. Hy vọng gặp bạn vào dịp khác!',
                confirmButtonColor: '#3a4a3a'
            });
            console.log('RSVP Data (Apps Script not configured):', { guestId, name, attendance });
            return;
        }
        
        // Hiển thị loading
        Swal.fire({
            title: 'Đang gửi...',
            text: 'Vui lòng đợi trong giây lát',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Gửi dữ liệu đến Apps Script
        try {
            await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Required for Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    guestId: guestId || '',
                    guestName: name,
                    attendance: attendance
                })
            });
            
            // Hiển thị thông báo thành công
            Swal.fire({
                icon: 'success',
                title: 'Cảm ơn bạn!',
                text: attendance === 'yes' 
                    ? 'Chúng tôi rất vui được đón tiếp bạn!' 
                    : 'Cảm ơn bạn đã phản hồi. Hy vọng gặp bạn vào dịp khác!',
                confirmButtonColor: '#3a4a3a'
            });
            
            console.log('RSVP submitted successfully:', { guestId, name, attendance });
            
        } catch (error) {
            console.error('RSVP submit error:', error);
            // Vẫn hiển thị thành công vì no-cors không trả về response
            Swal.fire({
                icon: 'success',
                title: 'Cảm ơn bạn!',
                text: attendance === 'yes' 
                    ? 'Chúng tôi rất vui được đón tiếp bạn!' 
                    : 'Cảm ơn bạn đã phản hồi. Hy vọng gặp bạn vào dịp khác!',
                confirmButtonColor: '#3a4a3a'
            });
        }
    });
    
    console.log('RSVP form initialized!');
}

// ==========================================
// RSVP AUTO POPUP - Hiển thị popup sau 10 giây
// ==========================================
const POPUP_STORAGE_KEY = 'rsvp_popup_dismissed';
const POPUP_DISMISS_DURATION = 24 * 60 * 60 * 1000; // 1 ngày = 24 giờ

function shouldShowRSVPPopup() {
    const dismissedTime = localStorage.getItem(POPUP_STORAGE_KEY);
    if (!dismissedTime) return true;
    
    const now = Date.now();
    const dismissed = parseInt(dismissedTime, 10);
    
    // Kiểm tra đã qua 1 ngày chưa
    if (now - dismissed > POPUP_DISMISS_DURATION) {
        localStorage.removeItem(POPUP_STORAGE_KEY);
        return true;
    }
    
    return false;
}

function dismissRSVPPopupFor1Day() {
    localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
}

function showRSVPPopup() {
    // Kiểm tra có nên hiển thị popup không
    if (!shouldShowRSVPPopup()) {
        console.log('RSVP popup was dismissed, not showing');
        return;
    }
    
    // Lấy tên khách nếu có
    const displayName = guestName || 'Quý khách';
    
    Swal.fire({
        title: `Xin chào ${displayName}!`,
        html: `
            <p style="margin-bottom: 16px; color: #4b5320;">Bạn có tham dự đám cưới của chúng mình không?</p>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="radio" name="popup-attendance" value="yes" checked style="width: 18px; height: 18px;">
                    <span style="color: #3a4a3a;">Có, tôi sẽ tham dự 💕</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="radio" name="popup-attendance" value="no" style="width: 18px; height: 18px;">
                    <span style="color: #3a4a3a;">Rất tiếc không thể tham dự</span>
                </label>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Gửi xác nhận',
        cancelButtonText: 'Để sau',
        confirmButtonColor: '#3a4a3a',
        cancelButtonColor: '#888',
        footer: `
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; color: #666;">
                <input type="checkbox" id="dont-show-again" style="width: 16px; height: 16px;">
                <span>Không hiển thị lại trong 1 ngày</span>
            </label>
        `,
        customClass: {
            popup: 'rsvp-popup',
            title: 'rsvp-popup-title'
        },
        preConfirm: () => {
            const selectedRadio = document.querySelector('input[name="popup-attendance"]:checked');
            return selectedRadio ? selectedRadio.value : 'yes';
        },
        willClose: () => {
            // Kiểm tra checkbox "không hiển thị lại"
            const dontShowCheckbox = document.getElementById('dont-show-again');
            if (dontShowCheckbox && dontShowCheckbox.checked) {
                dismissRSVPPopupFor1Day();
                console.log('RSVP popup dismissed for 1 day');
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const attendance = result.value;
            const guestId = getUrlParam('guest');
            const name = guestName || '';
            
            // Gửi đến Google Sheets nếu đã cấu hình
            if (APPS_SCRIPT_URL !== 'YOUR_APPS_SCRIPT_WEB_APP_URL') {
                fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ guestId, guestName: name, attendance })
                }).catch(err => console.error('Popup RSVP error:', err));
            }
            
            // Hiển thị cảm ơn
            Swal.fire({
                icon: 'success',
                title: 'Cảm ơn bạn!',
                text: attendance === 'yes' 
                    ? 'Chúng tôi rất vui được đón tiếp bạn!' 
                    : 'Cảm ơn bạn đã phản hồi!',
                confirmButtonColor: '#3a4a3a',
                timer: 3000,
                timerProgressBar: true
            });
            
            // Cập nhật form nếu có
            const formRadio = document.querySelector(`input[name="rsvp-attendance"][value="${attendance}"]`);
            if (formRadio) {
                formRadio.checked = true;
            }
            
            console.log('Popup RSVP submitted:', { guestId, name, attendance });
        }
    });
}

// Hiển thị popup sau 10 giây
function initRSVPPopup() {
    setTimeout(function() {
        showRSVPPopup();
    }, 15000); // 10 giây
}

// Khởi tạo RSVP form khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initRSVPForm, 2500);
});

// Also try on window load
window.addEventListener('load', function() {
    setTimeout(initRSVPForm, 2000);
    // Khởi tạo popup sau khi load xong
    initRSVPPopup();
});
