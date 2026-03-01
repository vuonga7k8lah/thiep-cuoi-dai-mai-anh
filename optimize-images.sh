#!/bin/bash
# Script tối ưu ảnh cho thiệp cưới
# Tạo 3 tầng chất lượng: thumb (200px), medium (800px), full (1600px)
# Sử dụng: ./optimize-images.sh

set -e
cd "$(dirname "$0")"

# Tạo thư mục output
mkdir -p image/optimized/thumb
mkdir -p image/optimized/medium
mkdir -p image/optimized/full

# Đếm số ảnh
total=0
processed=0

# Hàm xử lý 1 ảnh
optimize_image() {
    local input="$1"
    local filename=$(basename "$input")
    local name="${filename%.*}"
    local webp_name="${name}.webp"
    
    # Tạo ảnh tạm đã resize bằng sips (macOS built-in)
    local tmp_thumb="/tmp/opt_thumb_${filename}"
    local tmp_medium="/tmp/opt_medium_${filename}"
    local tmp_full="/tmp/opt_full_${filename}"
    
    # Lấy kích thước gốc
    local orig_width=$(sips -g pixelWidth "$input" | tail -1 | awk '{print $2}')
    
    # --- THUMB (200px width) ---
    if [ ! -f "image/optimized/thumb/${webp_name}" ]; then
        cp "$input" "$tmp_thumb"
        if [ "$orig_width" -gt 200 ]; then
            sips --resampleWidth 200 "$tmp_thumb" --out "$tmp_thumb" > /dev/null 2>&1
        fi
        cwebp -q 70 -resize 200 0 "$tmp_thumb" -o "image/optimized/thumb/${webp_name}" > /dev/null 2>&1
        rm -f "$tmp_thumb"
    fi
    
    # --- MEDIUM (800px width) ---
    if [ ! -f "image/optimized/medium/${webp_name}" ]; then
        cp "$input" "$tmp_medium"
        if [ "$orig_width" -gt 800 ]; then
            sips --resampleWidth 800 "$tmp_medium" --out "$tmp_medium" > /dev/null 2>&1
        fi
        cwebp -q 80 "$tmp_medium" -o "image/optimized/medium/${webp_name}" > /dev/null 2>&1
        rm -f "$tmp_medium"
    fi
    
    # --- FULL (1600px width) ---
    if [ ! -f "image/optimized/full/${webp_name}" ]; then
        cp "$input" "$tmp_full"
        if [ "$orig_width" -gt 1600 ]; then
            sips --resampleWidth 1600 "$tmp_full" --out "$tmp_full" > /dev/null 2>&1
        fi
        cwebp -q 85 "$tmp_full" -o "image/optimized/full/${webp_name}" > /dev/null 2>&1
        rm -f "$tmp_full"
    fi
    
    processed=$((processed + 1))
    echo "  [$processed/$total] ✅ $filename"
}

echo "🖼️  Bắt đầu tối ưu ảnh..."
echo ""

# Xử lý ảnh trong image/ (ảnh trang chính)
echo "📁 Xử lý ảnh trang chính (image/)..."
for img in image/*.jpg image/*.JPG image/*.jpeg image/*.png; do
    [ -f "$img" ] || continue
    total=$((total + 1))
done

# Xử lý ảnh album
echo "📁 Xử lý ảnh album (image/album/)..."
for img in image/album/*.jpg image/album/*.JPG image/album/*.jpeg image/album/*.png; do
    [ -f "$img" ] || continue
    total=$((total + 1))
done

echo "📊 Tổng số ảnh cần xử lý: $total"
echo ""

# Xử lý ảnh trang chính
for img in image/*.jpg image/*.JPG image/*.jpeg image/*.png; do
    [ -f "$img" ] || continue
    optimize_image "$img"
done

# Xử lý ảnh album  
for img in image/album/*.jpg image/album/*.JPG image/album/*.jpeg image/album/*.png; do
    [ -f "$img" ] || continue
    optimize_image "$img"
done

echo ""
echo "🎉 Hoàn thành tối ưu $processed ảnh!"
echo ""

# Hiển thị dung lượng
echo "📊 So sánh dung lượng:"
orig_size=$(du -sh image/*.jpg image/*.JPG image/album/*.jpg 2>/dev/null | tail -1 | awk '{print $1}')
echo "  Ảnh gốc:"
du -sh image/ 2>/dev/null | awk '{print "    Tổng: " $1}'
echo "  Ảnh tối ưu:"
du -sh image/optimized/thumb/ 2>/dev/null | awk '{print "    Thumb:  " $1}'
du -sh image/optimized/medium/ 2>/dev/null | awk '{print "    Medium: " $1}'
du -sh image/optimized/full/ 2>/dev/null | awk '{print "    Full:   " $1}'
du -sh image/optimized/ 2>/dev/null | awk '{print "    Tổng:   " $1}'

echo ""
echo "✅ Ảnh tối ưu đã lưu trong image/optimized/"
