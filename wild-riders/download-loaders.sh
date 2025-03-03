#!/bin/bash

# 創建lib目錄
mkdir -p wild-riders/js/lib

# 下載Three.js加載器
echo "下載Three.js加載器..."

# 下載OBJLoader
echo "下載OBJLoader..."
curl -L "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/loaders/OBJLoader.js" -o wild-riders/js/lib/OBJLoader.js

# 下載MTLLoader
echo "下載MTLLoader..."
curl -L "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/loaders/MTLLoader.js" -o wild-riders/js/lib/MTLLoader.js

# 下載GLTFLoader (如果尚未存在)
if [ ! -f "wild-riders/js/lib/GLTFLoader.js" ]; then
    echo "下載GLTFLoader..."
    curl -L "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/loaders/GLTFLoader.js" -o wild-riders/js/lib/GLTFLoader.js
fi

echo "所有加載器下載完成！" 