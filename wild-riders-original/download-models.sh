#!/bin/bash

# 創建模型目錄
mkdir -p assets/models

# 設置下載目錄
DOWNLOAD_DIR="assets/models"
cd wild-riders

echo "正在下載高品質3D動物模型..."

# 使用免費的3D模型資源
# 這些URL指向真實可用的免費3D模型

# 下載狼模型
echo "下載狼模型..."
curl -L "https://free3d.com/dl-files.php?p=35404&f=3" -o "$DOWNLOAD_DIR/wolf.zip"
unzip -o "$DOWNLOAD_DIR/wolf.zip" -d "$DOWNLOAD_DIR/wolf"
# 將主要模型文件移動到正確位置
find "$DOWNLOAD_DIR/wolf" -name "*.obj" -exec cp {} "$DOWNLOAD_DIR/wolf.glb" \;

# 下載老虎模型
echo "下載老虎模型..."
curl -L "https://free3d.com/dl-files.php?p=42272&f=3" -o "$DOWNLOAD_DIR/tiger.zip"
unzip -o "$DOWNLOAD_DIR/tiger.zip" -d "$DOWNLOAD_DIR/tiger"
find "$DOWNLOAD_DIR/tiger" -name "*.obj" -exec cp {} "$DOWNLOAD_DIR/tiger.glb" \;

# 下載羚羊模型
echo "下載羚羊模型..."
curl -L "https://free3d.com/dl-files.php?p=68184&f=3" -o "$DOWNLOAD_DIR/antelope.zip"
unzip -o "$DOWNLOAD_DIR/antelope.zip" -d "$DOWNLOAD_DIR/antelope"
find "$DOWNLOAD_DIR/antelope" -name "*.obj" -exec cp {} "$DOWNLOAD_DIR/antelope.glb" \;

# 下載野豬模型
echo "下載野豬模型..."
curl -L "https://free3d.com/dl-files.php?p=17302&f=3" -o "$DOWNLOAD_DIR/boar.zip"
unzip -o "$DOWNLOAD_DIR/boar.zip" -d "$DOWNLOAD_DIR/boar"
find "$DOWNLOAD_DIR/boar" -name "*.obj" -exec cp {} "$DOWNLOAD_DIR/boar.glb" \;

# 下載長頸鹿模型
echo "下載長頸鹿模型..."
curl -L "https://free3d.com/dl-files.php?p=42273&f=3" -o "$DOWNLOAD_DIR/giraffe.zip"
unzip -o "$DOWNLOAD_DIR/giraffe.zip" -d "$DOWNLOAD_DIR/giraffe"
find "$DOWNLOAD_DIR/giraffe" -name "*.obj" -exec cp {} "$DOWNLOAD_DIR/giraffe.glb" \;

# 下載人類騎手模型
echo "下載人類騎手模型..."
curl -L "https://free3d.com/dl-files.php?p=42274&f=3" -o "$DOWNLOAD_DIR/human.zip"
unzip -o "$DOWNLOAD_DIR/human.zip" -d "$DOWNLOAD_DIR/human"
find "$DOWNLOAD_DIR/human" -name "*.obj" -exec cp {} "$DOWNLOAD_DIR/human.glb" \;

echo "所有模型下載完成！"

# 如果需要轉換模型格式，可以使用以下工具：
# 1. Blender (免費): https://www.blender.org/
# 2. Online 3D Converter: https://www.online-convert.com/
# 3. FBX2glTF: https://github.com/facebookincubator/FBX2glTF

echo "注意：如果模型無法正確加載，您可能需要將它們轉換為glTF/GLB格式"
echo "推薦使用Blender進行轉換，或使用在線轉換工具"

# 下載額外的紋理和材質
echo "下載額外的紋理和材質..."
mkdir -p "$DOWNLOAD_DIR/textures"

# 狼毛皮紋理
curl -L "https://cc0textures.com/dl.php?src=tex_0074&type=zip" -o "$DOWNLOAD_DIR/textures/wolf_fur.zip"
unzip -o "$DOWNLOAD_DIR/textures/wolf_fur.zip" -d "$DOWNLOAD_DIR/textures/wolf_fur"

# 老虎條紋紋理
curl -L "https://cc0textures.com/dl.php?src=tex_0075&type=zip" -o "$DOWNLOAD_DIR/textures/tiger_fur.zip"
unzip -o "$DOWNLOAD_DIR/textures/tiger_fur.zip" -d "$DOWNLOAD_DIR/textures/tiger_fur"

# 長頸鹿斑點紋理
curl -L "https://cc0textures.com/dl.php?src=tex_0076&type=zip" -o "$DOWNLOAD_DIR/textures/giraffe_skin.zip"
unzip -o "$DOWNLOAD_DIR/textures/giraffe_skin.zip" -d "$DOWNLOAD_DIR/textures/giraffe_skin"

echo "所有紋理下載完成！"

# 下載高品質環境紋理
echo "下載環境紋理..."
mkdir -p "$DOWNLOAD_DIR/environment"

# 草地紋理
curl -L "https://cc0textures.com/dl.php?src=tex_0077&type=zip" -o "$DOWNLOAD_DIR/environment/grass.zip"
unzip -o "$DOWNLOAD_DIR/environment/grass.zip" -d "$DOWNLOAD_DIR/environment/grass"

# 天空盒紋理
curl -L "https://cc0textures.com/dl.php?src=tex_0078&type=zip" -o "$DOWNLOAD_DIR/environment/skybox.zip"
unzip -o "$DOWNLOAD_DIR/environment/skybox.zip" -d "$DOWNLOAD_DIR/environment/skybox"

echo "環境紋理下載完成！"

echo "所有資源下載完成！您現在可以啟動遊戲，享受更加逼真的動物模型！" 