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

# -e filename  如果 filename存在，则为真  [ -e /var/log/syslog ]
# -d filename  如果 filename为目录，则为真  [ -d /tmp/mydir ]
# -f filename  如果 filename为常规文件，则为真  [ -f /usr/bin/grep ]
# -L filename  如果 filename为符号链接，则为真  [ -L /usr/bin/grep ]
# -r filename  如果 filename可读，则为真  [ -r /var/log/syslog ]
# -w filename  如果 filename可写，则为真  [ -w /var/mytmp.txt ]
# -x filename  如果 filename可执行，则为真  [ -L /usr/bin/grep ]
# filename1 -nt filename2  如果 filename1比 filename2新，则为真  [ /tmp/install/etc/services -nt /etc/services ]
# filename1 -ot filename2  如果 filename1比 filename2旧，则为真  [ /boot/bzImage -ot arch/i386/boot/bzImage ]