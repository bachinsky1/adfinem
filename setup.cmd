@echo off
setlocal
cls

echo ========================================
echo Deleting mysql-data...
rmdir /s /q mysql-data

echo ========================================
echo Copying .env file...
copy /Y server\.env.example server\.env >nul

echo ========================================
echo Starting containers...
docker compose up -d --build

echo ========================================
echo Waiting for containers to be ready...
timeout /t 10 >nul
cls

echo ========================================
echo Installing Laravel dependencies...
echo ========================================
docker compose exec app composer install
cls

echo ========================================
echo Generating application key...
echo ========================================
docker compose exec app php artisan key:generate
cls

echo ========================================
echo Running migrations and seeders...
echo ========================================
docker compose exec app php artisan migrate --seed
cls

echo ========================================
echo Generating Swagger docs...
echo ========================================
docker compose exec app php artisan l5-swagger:generate
cls

echo ========================================
echo Installing frontend dependencies...
echo ========================================
cd client
call npm install
cls

echo ========================================
echo Building frontend...
echo ========================================
call npm run build
cd ..
cls

echo ========================================
echo All done!
echo Press any key to continue...
echo ========================================
pause >nul
