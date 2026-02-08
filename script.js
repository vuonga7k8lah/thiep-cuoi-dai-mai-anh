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
    // Ảnh từ thư mục image/album
    'image/album/PMN01376.JPG',
    'image/album/PMN01542.JPG',
    'image/album/PMN01559.JPG',
    'image/album/PMN01774.JPG',
    'image/album/PMN02008.JPG',
    'image/album/PMN02027.JPG',
    'image/album/PMN02091.JPG',
    'image/album/PMN02367.JPG',
    'image/album/PMN02572.JPG',
    'image/album/PMN02580.JPG',
    'image/album/PMN02685.JPG',
    'image/album/PMN02855.JPG',
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
    // Initialize album gallery from local images
    setTimeout(initAlbumGallery, 500);
    // Wait for dynamic content to load
    setTimeout(initPhotoSwipe, 2000);
    // Initialize mobile responsive scaling
    initMobileResponsive();
});

// ==========================================
// ALBUM GALLERY - Load images from image/album folder
// ==========================================
function initAlbumGallery() {
    const galleryWrapper = document.querySelector('.photo-gallery-wrapper');
    if (!galleryWrapper) {
        console.log('Gallery wrapper not found');
        return;
    }
    
    const albumUrls = getAlbumUrls();
    if (albumUrls.length === 0) {
        console.log('No album images found');
        return;
    }
    
    console.log('Initializing album gallery with', albumUrls.length, 'images');
    
    let currentIndex = 0;
    
    // Find or create main image container
    const mainImageContainer = galleryWrapper.querySelector('.relative.flex-1');
    if (!mainImageContainer) {
        console.log('Main image container not found');
        return;
    }
    
    // Find or create thumbnails container
    const thumbnailsScroller = galleryWrapper.querySelector('.flex.gap-2');
    
    // Update main image
    function updateMainImage(index) {
        const imageWrapper = mainImageContainer.querySelector('.absolute.inset-0');
        if (imageWrapper) {
            const img = imageWrapper.querySelector('img');
            if (img) {
                img.src = albumUrls[index];
                img.alt = 'Photo ' + (index + 1);
                img.style.imageRendering = 'auto';
                img.style.objectFit = 'contain';
                img.loading = 'eager';
            }
        }
        
        // Update thumbnail active state
        if (thumbnailsScroller) {
            const thumbnails = thumbnailsScroller.querySelectorAll('button');
            thumbnails.forEach((thumb, i) => {
                if (i === index) {
                    thumb.classList.add('border-blue-500', 'shadow-lg', 'shadow-blue-500/30');
                    thumb.classList.remove('border-transparent', 'hover:border-blue-400/60');
                } else {
                    thumb.classList.remove('border-blue-500', 'shadow-lg', 'shadow-blue-500/30');
                    thumb.classList.add('border-transparent', 'hover:border-blue-400/60');
                }
            });
        }
        
        currentIndex = index;
    }
    
    // Create thumbnails HTML
    if (thumbnailsScroller) {
        thumbnailsScroller.innerHTML = '';
        thumbnailsScroller.style.width = (albumUrls.length * 68) + 'px';
        
        albumUrls.forEach((url, index) => {
            const button = document.createElement('button');
            button.className = index === 0 
                ? 'relative rounded-md border transition-all duration-200 overflow-hidden flex-shrink-0 cursor-pointer border-blue-500 shadow-lg shadow-blue-500/30'
                : 'relative rounded-md border transition-all duration-200 overflow-hidden flex-shrink-0 cursor-pointer border-transparent hover:border-blue-400/60';
            button.style.cssText = 'width: 64px; min-width: 64px; height: 64px;';
            
            const img = document.createElement('img');
            img.alt = 'Photo ' + (index + 1);
            img.loading = 'eager';
            img.decoding = 'sync';
            img.className = 'object-cover';
            img.src = url;
            img.style.cssText = 'position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; object-fit: cover;';
            
            button.appendChild(img);
            
            // Click handler
            button.addEventListener('click', function() {
                updateMainImage(index);
            });
            
            thumbnailsScroller.appendChild(button);
        });
    }
    
    // Update first main image
    updateMainImage(0);
    
    // Add navigation button handlers
    const prevBtn = mainImageContainer.querySelector('button:first-of-type');
    const nextBtn = mainImageContainer.querySelector('button:nth-of-type(2)');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const newIndex = currentIndex > 0 ? currentIndex - 1 : albumUrls.length - 1;
            updateMainImage(newIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const newIndex = currentIndex < albumUrls.length - 1 ? currentIndex + 1 : 0;
            updateMainImage(newIndex);
        });
    }
    
    // Auto-slide every 4 seconds
    let autoSlideInterval = setInterval(function() {
        const newIndex = currentIndex < albumUrls.length - 1 ? currentIndex + 1 : 0;
        updateMainImage(newIndex);
    }, 4000);
    
    // Pause on hover
    galleryWrapper.addEventListener('mouseenter', function() {
        clearInterval(autoSlideInterval);
    });
    
    galleryWrapper.addEventListener('mouseleave', function() {
        autoSlideInterval = setInterval(function() {
            const newIndex = currentIndex < albumUrls.length - 1 ? currentIndex + 1 : 0;
            updateMainImage(newIndex);
        }, 4000);
    });
    
    console.log('Album gallery initialized successfully!');
}

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
        
        // Get invitation greeting element
        const invitationGreeting = document.getElementById('invitation-greeting');
        
        if (isOpen) {
            envelopeContainer.classList.remove('open');
            envelopeContainer.classList.add('close');
            // Hide invitation greeting
            if (invitationGreeting) {
                invitationGreeting.style.opacity = '0';
            }
            console.log('Envelope closed. Classes:', envelopeContainer.className);
        } else {
            envelopeContainer.classList.remove('close');
            envelopeContainer.classList.add('open');
            // Show invitation greeting with animation
            if (invitationGreeting) {
                setTimeout(function() {
                    invitationGreeting.style.opacity = '1';
                }, 500);
            }
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
    const musicToggle = document.getElementById('music-toggle');
    
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
            if (musicToggle) musicToggle.classList.add('playing');
            console.log('Music playing');
        }).catch(err => {
            console.log('Music play error:', err);
        });
    }
    
    // Function to pause music
    function pauseMusic() {
        audio.pause();
        musicPlaying = false;
        if (musicToggle) musicToggle.classList.remove('playing');
        console.log('Music paused');
    }
    
    // Function to toggle music
    function toggleMusic() {
        console.log('Toggle music called, currently playing:', musicPlaying);
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
        
        // Don't trigger on music toggle button (it has its own handler)
        const target = e.target;
        if (target && target.closest && target.closest('#music-toggle')) {
            return;
        }
        
        firstClickHandled = true;
        playMusic();
        console.log('First click - music started (event continues)');
        // Don't stop propagation - let the original click event continue
    }, false);
    
    // Music toggle button click
    if (musicToggle) {
        musicToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            firstClickHandled = true; // Mark as handled
            toggleMusic();
        });
        console.log('Music toggle button handler added');
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
    setTimeout(initGiftCardQRPopup, 1000);
    setTimeout(initMapNavigationButton, 1000);
});

// Also try on window load
window.addEventListener('load', function() {
    setTimeout(initQRPopup, 800);
    setTimeout(initGiftCardQRPopup, 800);
    setTimeout(initMapNavigationButton, 800);
});

// ==========================================
// GIFT CARD QR CODE POPUP
// ==========================================
function initGiftCardQRPopup() {
    console.log('Initializing Gift Card QR Popup...');
    
    // QR Code information for Bride and Groom
    const QR_INFO = {
        bride: {
            title: '🌸 Mừng Cưới Cô Dâu 🌸',
            name: 'PHẠM THỊ HẠNH',
            bankId: 'SHB',
            bankName: 'SHB - Ngân hàng TMCP Sài Gòn - Hà Nội',
            accountNo: '0965479256',
            qrUrl: 'https://img.vietqr.io/image/SHB-0965479256-compact2.png?accountName=PHAM%20THI%20HANH&addInfo=Mung%20cuoi%20co%20dau'
        },
        groom: {
            title: '🤵 Mừng Cưới Chú Rể 🤵',
            name: 'LÊ HÙNG VƯƠNG',
            bankId: 'TCB',
            bankName: 'Techcombank',
            accountNo: '19072779357017',
            qrUrl: 'https://img.vietqr.io/image/TCB-19072779357017-compact2.png?accountName=LE%20HUNG%20VUONG&addInfo=Mung%20cuoi%20chu%20re'
        }
    };
    
    // Add click handler to Bride QR code (svg-yWe4uNa8eC)
    const brideQR = document.getElementById('svg-yWe4uNa8eC');
    if (brideQR) {
        brideQR.style.cursor = 'pointer';
        brideQR.addEventListener('click', function(e) {
            e.stopPropagation();
            showQRPopup(QR_INFO.bride);
        });
        console.log('✅ Bride QR code click handler added');
    }
    
    // Add click handler to Bride QR code box (svg-dT_KqdvFkj)
    const brideQRBox = document.getElementById('svg-dT_KqdvFkj');
    if (brideQRBox) {
        brideQRBox.style.cursor = 'pointer';
        brideQRBox.addEventListener('click', function(e) {
            e.stopPropagation();
            showQRPopup(QR_INFO.bride);
        });
        console.log('✅ Bride QR box click handler added');
    }
    
    // Add click handler to Groom QR code (svg-orOPfQQNM2)
    const groomQR = document.getElementById('svg-orOPfQQNM2');
    if (groomQR) {
        groomQR.style.cursor = 'pointer';
        groomQR.addEventListener('click', function(e) {
            e.stopPropagation();
            showQRPopup(QR_INFO.groom);
        });
        console.log('✅ Groom QR code click handler added');
    }
    
    function showQRPopup(info) {
        // Check if SweetAlert2 is loaded
        if (typeof Swal === 'undefined') {
            console.log('SweetAlert2 not loaded');
            alert(`${info.name}\n${info.bankName}\nSố TK: ${info.accountNo}`);
            return;
        }
        
        // Save current scroll position
        const scrollY = window.scrollY || window.pageYOffset;
        
        Swal.fire({
            title: info.title,
            html: `
                <div style="text-align: center;">
                    <img src="${info.qrUrl}" alt="VietQR" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: left; margin-bottom: 10px;">
                        <p style="margin: 8px 0;"><strong style="color: #d4617c;">💳 Ngân hàng:</strong> ${info.bankName}</p>
                        <p style="margin: 8px 0;"><strong style="color: #d4617c;">📱 Số TK:</strong> ${info.accountNo}</p>
                        <p style="margin: 8px 0;"><strong style="color: #d4617c;">👤 Chủ TK:</strong> ${info.name}</p>
                    </div>
                    <p style="margin-top: 15px; color: #666; font-size: 14px; font-style: italic;">Quét mã QR để chuyển khoản 💕</p>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            width: '400px',
            padding: '20px',
            background: '#fff',
            customClass: {
                popup: 'qr-popup gift-qr-popup'
            },
            scrollbarPadding: false,  // Prevent scrollbar padding manipulation
            heightAuto: false,         // Prevent body height manipulation
            willOpen: function() {
                // Prevent body scroll manipulation
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            },
            didOpen: function() {
                // Keep scroll position when popup opens
                setTimeout(() => window.scrollTo(0, scrollY), 0);
            },
            willClose: function() {
                // Prepare to restore scroll
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            },
            didClose: function() {
                // Restore scroll position when popup closes
                setTimeout(() => window.scrollTo(0, scrollY), 0);
            }
        });
    }
}

// Initialize Google Maps navigation button
function initMapNavigationButton() {
    // Helper function to open Google Maps with fallback
    function openGoogleMaps(mapLink, locationName) {
        if (!mapLink) {
            console.warn('⚠️ No map link found in data.json');
            return;
        }
        
        // Try to open in Google Maps app first (iOS/Android)
        // If it fails, browser will fallback to web version automatically
        console.log(`✅ Opening Google Maps for ${locationName}:`, mapLink);
        window.open(mapLink, '_blank');
    }
    
    // Groom's house button (Nhà Trai)
    const groomMapButton = document.getElementById('svg-_YLQhYsBhW');
    if (groomMapButton) {
        groomMapButton.style.cursor = 'pointer';
        groomMapButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Get groom's location from weddingData
            if (typeof weddingData !== 'undefined' && weddingData.chu_re && weddingData.chu_re.hon_le) {
                const mapLink = weddingData.chu_re.hon_le.link_chi_duong;
                openGoogleMaps(mapLink, 'Nhà Trai');
            } else {
                console.warn('⚠️ Wedding data not loaded');
            }
        });
        console.log('✅ Groom map navigation button initialized');
    } else {
        console.warn('⚠️ Groom map button not found (svg-_YLQhYsBhW)');
    }
    
    // Bride's house button (Nhà Gái)
    const brideMapButton = document.getElementById('svg-ujS95UZ_yB');
    if (brideMapButton) {
        brideMapButton.style.cursor = 'pointer';
        brideMapButton.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Get bride's location from weddingData
            if (typeof weddingData !== 'undefined' && weddingData.co_dau && weddingData.co_dau.hon_le) {
                const mapLink = weddingData.co_dau.hon_le.link_chi_duong;
                openGoogleMaps(mapLink, 'Nhà Gái');
            } else {
                console.warn('⚠️ Wedding data not loaded');
            }
        });
        console.log('✅ Bride map navigation button initialized');
    } else {
        console.warn('⚠️ Bride map button not found (svg-ujS95UZ_yB)');
    }
}

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
    
    // Directions button - show popup with both house addresses
    btnDirections.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Load addresses from data.json
        let groomInfo, brideInfo;
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            // Get groom house info (chu_re)
            groomInfo = {
                ten_nha: data.chu_re?.ten_nha || 'Nhà Trai',
                dia_diem: data.chu_re?.hon_le?.dia_diem || '',
                dia_chi: data.chu_re?.hon_le?.dia_chi || '',
                ngay_cuoi: data.chu_re?.hon_le?.ngay_cuoi || '',
                gio_cuoi: data.chu_re?.hon_le?.gio_cuoi || '',
                link_chi_duong: data.chu_re?.hon_le?.link_chi_duong || 'https://maps.google.com'
            };
            
            // Get bride house info (co_dau)
            brideInfo = {
                ten_nha: data.co_dau?.ten_nha || 'Nhà Gái',
                dia_diem: data.co_dau?.hon_le?.dia_diem || '',
                dia_chi: data.co_dau?.hon_le?.dia_chi || '',
                ngay_cuoi: data.co_dau?.hon_le?.ngay_cuoi || '',
                gio_cuoi: data.co_dau?.hon_le?.gio_cuoi || '',
                link_chi_duong: data.co_dau?.hon_le?.link_chi_duong || 'https://maps.google.com'
            };
            
            console.log('Loaded address info from data.json:', { groomInfo, brideInfo });
        } catch (error) {
            console.error('Error loading address info from data.json:', error);
            // Fallback defaults
            groomInfo = { ten_nha: 'Nhà Trai', dia_diem: '', dia_chi: '', ngay_cuoi: '', gio_cuoi: '', link_chi_duong: 'https://maps.google.com' };
            brideInfo = { ten_nha: 'Nhà Gái', dia_diem: '', dia_chi: '', ngay_cuoi: '', gio_cuoi: '', link_chi_duong: 'https://maps.google.com' };
        }
        
        // Check if SweetAlert2 is loaded
        if (typeof Swal === 'undefined') {
            console.log('SweetAlert2 not loaded');
            return;
        }
        
        Swal.fire({
            title: '📍 Địa Điểm Tiệc Cưới 📍',
            html: `
                <div style="text-align: center;">
                    <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
                        <!-- Nhà Trai -->
                        <div style="flex: 1; min-width: 280px; max-width: 350px;">
                            <h3 style="color: #2563eb; margin-bottom: 10px; font-size: 18px;">🏠 ${groomInfo.ten_nha}</h3>
                            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; text-align: left;">
                                <p style="margin: 6px 0; font-size: 14px;"><strong>📅 Ngày:</strong> ${groomInfo.ngay_cuoi}</p>
                                <p style="margin: 6px 0; font-size: 14px;"><strong>🕐 Giờ:</strong> ${groomInfo.gio_cuoi}</p>
                                <p style="margin: 6px 0; font-size: 14px;"><strong>🏛️ Địa điểm:</strong> ${groomInfo.dia_diem}</p>
                                <p style="margin: 6px 0; font-size: 14px;"><strong>📍 Địa chỉ:</strong> ${groomInfo.dia_chi}</p>
                            </div>
                            <button onclick="window.open('${groomInfo.link_chi_duong}', '_blank')" 
                                style="margin-top: 10px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; width: 100%;">
                                🗺️ Chỉ Đường Nhà Trai
                            </button>
                        </div>
                        <!-- Nhà Gái -->
                        <div style="flex: 1; min-width: 280px; max-width: 350px;">
                            <h3 style="color: #db2777; margin-bottom: 10px; font-size: 18px;">🏠 ${brideInfo.ten_nha}</h3>
                            <div style="background: #fdf2f8; padding: 15px; border-radius: 8px; text-align: left;">
                                <p style="margin: 6px 0; font-size: 14px;"><strong>📅 Ngày:</strong> ${brideInfo.ngay_cuoi}</p>
                                <p style="margin: 6px 0; font-size: 14px;"><strong>🕐 Giờ:</strong> ${brideInfo.gio_cuoi}</p>
                                <p style="margin: 6px 0; font-size: 14px;"><strong>🏛️ Địa điểm:</strong> ${brideInfo.dia_diem}</p>
                                <p style="margin: 6px 0; font-size: 14px;"><strong>📍 Địa chỉ:</strong> ${brideInfo.dia_chi}</p>
                            </div>
                            <button onclick="window.open('${brideInfo.link_chi_duong}', '_blank')" 
                                style="margin-top: 10px; padding: 10px 20px; background: #db2777; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; width: 100%;">
                                🗺️ Chỉ Đường Nhà Gái
                            </button>
                        </div>
                    </div>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            width: '750px',
            padding: '20px',
            background: '#fff',
            customClass: {
                popup: 'directions-popup'
            }
        });
        
        console.log('Directions popup shown with data from data.json!');
    });
    
    // Also add directions click to element with data-node-id="MXcj3JAluy" - trigger the same popup
    const chiDuongElement = document.querySelector('[data-node-id="MXcj3JAluy"]');
    if (chiDuongElement) {
        chiDuongElement.style.cursor = 'pointer';
        chiDuongElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Trigger the directions button click
            btnDirections.click();
        });
        console.log('Chi duong element click handler added');
    }
    
    // Gift button - show QR code popup with both bride and groom
    btnGift.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Trigger firework effect
        triggerFireworks();
        
        // Load bank info from data.json
        let groomBank, brideBank;
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            // Get groom bank info (chu_re)
            groomBank = {
                BANK_ID: data.chu_re?.ngan_hang?.bank_id || 'TCB',
                BANK_NAME: data.chu_re?.ngan_hang?.bank_name || 'Techcombank',
                ACCOUNT_NO: data.chu_re?.ngan_hang?.account_no || '',
                ACCOUNT_NAME: data.chu_re?.ngan_hang?.account_name || '',
                DESCRIPTION: data.chu_re?.ngan_hang?.description || 'Chuc mung hanh phuc'
            };
            
            // Get bride bank info (co_dau)
            brideBank = {
                BANK_ID: data.co_dau?.ngan_hang?.bank_id || 'SHB',
                BANK_NAME: data.co_dau?.ngan_hang?.bank_name || 'SHB',
                ACCOUNT_NO: data.co_dau?.ngan_hang?.account_no || '',
                ACCOUNT_NAME: data.co_dau?.ngan_hang?.account_name || '',
                DESCRIPTION: data.co_dau?.ngan_hang?.description || 'Chuc mung hanh phuc'
            };
            
            console.log('Loaded bank info from data.json:', { groomBank, brideBank });
        } catch (error) {
            console.error('Error loading bank info from data.json:', error);
            // Fallback defaults
            groomBank = { BANK_ID: 'TCB', BANK_NAME: 'Techcombank', ACCOUNT_NO: '', ACCOUNT_NAME: '', DESCRIPTION: 'Chuc mung hanh phuc' };
            brideBank = { BANK_ID: 'SHB', BANK_NAME: 'SHB', ACCOUNT_NO: '', ACCOUNT_NAME: '', DESCRIPTION: 'Chuc mung hanh phuc' };
        }
        
        // Build QR URLs
        let groomQrUrl = `https://img.vietqr.io/image/${groomBank.BANK_ID}-${groomBank.ACCOUNT_NO}-compact2.png`;
        groomQrUrl += `?addInfo=${encodeURIComponent(groomBank.DESCRIPTION)}`;
        groomQrUrl += `&accountName=${encodeURIComponent(groomBank.ACCOUNT_NAME)}`;
        
        let brideQrUrl = `https://img.vietqr.io/image/${brideBank.BANK_ID}-${brideBank.ACCOUNT_NO}-compact2.png`;
        brideQrUrl += `?addInfo=${encodeURIComponent(brideBank.DESCRIPTION)}`;
        brideQrUrl += `&accountName=${encodeURIComponent(brideBank.ACCOUNT_NAME)}`;
        
        // Check if SweetAlert2 is loaded
        if (typeof Swal === 'undefined') {
            console.log('SweetAlert2 not loaded');
            return;
        }
        
        Swal.fire({
            title: '💝 Gửi Quà Mừng Cưới 💝',
            html: `
                <div style="text-align: center;">
                    <div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center;">
                        <!-- Chú rể -->
                        <div style="flex: 1; min-width: 280px; max-width: 350px;">
                            <h3 style="color: #2563eb; margin-bottom: 10px; font-size: 18px;">🤵 Chú Rể</h3>
                            <img src="${groomQrUrl}" alt="QR Chú Rể" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;">
                            <div style="background: #eff6ff; padding: 12px; border-radius: 8px; text-align: left;">
                                <p style="margin: 4px 0; font-size: 14px;"><strong>Ngân hàng:</strong> ${groomBank.BANK_NAME}</p>
                                <p style="margin: 4px 0; font-size: 14px;"><strong>Số TK:</strong> ${groomBank.ACCOUNT_NO}</p>
                                <p style="margin: 4px 0; font-size: 14px;"><strong>Chủ TK:</strong> ${groomBank.ACCOUNT_NAME}</p>
                            </div>
                        </div>
                        <!-- Cô dâu -->
                        <div style="flex: 1; min-width: 280px; max-width: 350px;">
                            <h3 style="color: #db2777; margin-bottom: 10px; font-size: 18px;">👰 Cô Dâu</h3>
                            <img src="${brideQrUrl}" alt="QR Cô Dâu" style="max-width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px;">
                            <div style="background: #fdf2f8; padding: 12px; border-radius: 8px; text-align: left;">
                                <p style="margin: 4px 0; font-size: 14px;"><strong>Ngân hàng:</strong> ${brideBank.BANK_NAME}</p>
                                <p style="margin: 4px 0; font-size: 14px;"><strong>Số TK:</strong> ${brideBank.ACCOUNT_NO}</p>
                                <p style="margin: 4px 0; font-size: 14px;"><strong>Chủ TK:</strong> ${brideBank.ACCOUNT_NAME}</p>
                            </div>
                        </div>
                    </div>
                    <p style="margin-top: 15px; color: #666; font-size: 14px;">Quét mã QR để chuyển khoản 💕</p>
                </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
            width: '750px',
            padding: '20px',
            background: '#fff',
            customClass: {
                popup: 'qr-popup'
            }
        });
        
        console.log('Gift QR popup shown with data from data.json!');
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

// ==========================================
// GIFT SECTION - Dynamic QR Code from data.json
// ==========================================

async function initGiftSection() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Get groom bank info (chu_re)
        const groomBank = {
            name: data.chu_re?.ho_ten_chu_re || 'Chú rể',
            bank_name: data.chu_re?.ngan_hang?.bank_name || '',
            bank_id: data.chu_re?.ngan_hang?.bank_id || '',
            account_no: data.chu_re?.ngan_hang?.account_no || '',
            account_name: data.chu_re?.ngan_hang?.account_name || ''
        };
        
        // Get bride bank info (co_dau)
        const brideBank = {
            name: data.co_dau?.ho_ten_co_dau || 'Cô dâu',
            bank_name: data.co_dau?.ngan_hang?.bank_name || '',
            bank_id: data.co_dau?.ngan_hang?.bank_id || '',
            account_no: data.co_dau?.ngan_hang?.account_no || '',
            account_name: data.co_dau?.ngan_hang?.account_name || ''
        };
        
        // Build QR URLs
        const groomQrUrl = `https://img.vietqr.io/image/${groomBank.bank_id}-${groomBank.account_no}-compact2.png`;
        const brideQrUrl = `https://img.vietqr.io/image/${brideBank.bank_id}-${brideBank.account_no}-compact2.png`;
        
        // Update Bride section (Cô dâu) - lines around 2136-2200
        // Name element: data-node-id="iPjImtIlr4"
        const brideNameEl = document.querySelector('[data-node-id="iPjImtIlr4"] div[contenteditable]');
        if (brideNameEl) brideNameEl.textContent = brideBank.account_name || brideBank.name;
        
        // Bank info element: data-node-id="t0Ya66JrSt"
        const brideBankEl = document.querySelector('[data-node-id="t0Ya66JrSt"] div[contenteditable]');
        if (brideBankEl) brideBankEl.textContent = `${brideBank.bank_name} : ${brideBank.account_no}`;
        
        // QR code placeholder: data-node-id="yWe4uNa8eC"
        const brideQrEl = document.querySelector('[data-node-id="yWe4uNa8eC"] .svg-wrap');
        if (brideQrEl) {
            brideQrEl.innerHTML = `<img src="${brideQrUrl}" alt="QR Cô Dâu" style="width: 100%; height: 100%; border-radius: 8px; object-fit: contain;">`;
        }
        
        // Update Groom section (Chú rể) - lines around 2356-2420
        // Name element: data-node-id="vbVsmkFNC_"
        const groomNameEl = document.querySelector('[data-node-id="vbVsmkFNC_"] div[contenteditable]');
        if (groomNameEl) groomNameEl.textContent = groomBank.account_name || groomBank.name;
        
        // Bank info element: data-node-id="D5MLJCGR1T"
        const groomBankEl = document.querySelector('[data-node-id="D5MLJCGR1T"] div[contenteditable]');
        if (groomBankEl) groomBankEl.textContent = `${groomBank.bank_name} : ${groomBank.account_no}`;
        
        // QR code placeholder: data-node-id="zLOlfhyqjD"
        const groomQrEl = document.querySelector('[data-node-id="zLOlfhyqjD"] .svg-wrap');
        if (groomQrEl) {
            groomQrEl.innerHTML = `<img src="${groomQrUrl}" alt="QR Chú Rể" style="width: 100%; height: 100%; border-radius: 8px; object-fit: contain;">`;
        }
        
        console.log('Gift section updated with data from data.json!', { groomBank, brideBank });
    } catch (error) {
        console.error('Error loading gift section data:', error);
    }
}

// Initialize gift section when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initGiftSection, 1500);
});
