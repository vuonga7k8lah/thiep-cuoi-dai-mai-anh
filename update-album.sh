#!/bin/bash
# Script tự động cập nhật danh sách ảnh album
# Chạy: ./update-album.sh (hoặc bash update-album.sh)

cd "$(dirname "$0")"
ls image/album/ | grep -iE '\.(jpg|jpeg|png|webp)$' | sort | python3 -c "
import sys, json
files = ['image/album/' + l.strip() for l in sys.stdin]
print(json.dumps(files, indent=2))
" > image/album/images.json

echo "✅ Đã cập nhật $(python3 -c "import json; print(len(json.load(open('image/album/images.json'))))" ) ảnh vào image/album/images.json"
