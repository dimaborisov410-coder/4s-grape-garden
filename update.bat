@echo off
echo Сборка...
node build.js
if %errorlevel% neq 0 (
  echo ОШИБКА сборки! Деплой отменён.
  pause
  exit /b 1
)
echo Деплой...
git add -A
git commit -m "update: пересборка дашборда"
git push
echo Готово!
