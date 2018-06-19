#!/bin/bash

# target folder: 与整个项目同级的clover
if [ ! -x "../scripts/pullClover.sh" ];then
echo 'please enter: sodu chmod 777 ../scripts/pullClover.sh'
fi

if [ ! -d "../clover" ];then
# 没有则创建文件夹，拉取github仓库
echo 'clover is not found, start to create clover files...'
mkdir ../clover
cd ../clover
git init
git remote add clover https://github.com/EvanLiu2968/clover.git
git fetch clover
git checkout master
else
cd ../clover
git pull
fi