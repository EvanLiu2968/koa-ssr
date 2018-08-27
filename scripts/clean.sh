#!/bin/bash

if [ $1 ]
then
   BASE_DIR=$1
else
   BASE_DIR='../public'
fi
rm -rf $BASE_DIR/js/*
rm -rf $BASE_DIR/css/*
rm -rf $BASE_DIR/html/*
rm -rf $BASE_DIR/fonts/*
rm -rf $BASE_DIR/view/*