@echo off
setlocal
@REM cls

@REM echo ========================================
@REM echo Deleting mysql-data...
@REM rmdir /s /q mysql-data

echo ========================================
echo Copying .env file...
copy /Y server\.env.example server\.env >nul

echo ========================================
echo Starting containers...
docker compose up -d --build

echo ========================================
echo Waiting for containers to be ready...
timeout /t 10 >nul
@REM cls

echo ========================================
echo Installing Laravel dependencies...
echo ========================================
docker compose exec app composer install
@REM cls

echo ========================================
echo Generating application key...
echo ========================================
docker compose exec app php artisan key:generate
@REM cls

echo ========================================
echo Running migrations and seeders...
echo ========================================
docker compose exec app php artisan migrate --seed
@REM cls

echo ========================================
echo Generating Swagger docs...
echo ========================================
docker compose exec app php artisan l5-swagger:generate
@REM cls

echo ========================================
echo Installing frontend dependencies...
echo ========================================
cd client
call npm install
@REM cls

echo ========================================
echo Building frontend...
echo ========================================
call npm run build
cd ..
xcopy /E /I /Y client\dist server\public\dist
@REM cls

echo ========================================
echo All done!
echo Press any key to continue...
echo ========================================
pause >nul
