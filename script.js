// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-24WP7GNL8X');

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
