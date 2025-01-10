@echo off
chcp 65001
set /p id="请输入文档ID: "
set /p title="请输入标题: "
set /p authors="请输入作者(默认为your_name): "
set /p tags="请输入标签(用逗号分隔): "

if "%authors%"=="" set authors=your_name

(
echo ---
echo id: %id%
echo slug: %id%
echo title: %title%
echo date: %date:~0,4%-%date:~5,2%-%date:~8,2%
echo authors: %authors%
echo tags: [%tags%]
echo keywords: [%tags%]
echo ---
echo.
) > "docs/%id%.md"
:: 换成你的Typora安装路径路径
start "" "D:\workSoftWare\Typora\Typora.exe" "docs/%id%.md"