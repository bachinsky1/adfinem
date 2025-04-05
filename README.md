# 📘 AdFinem Test Task

## 📋 Опис

Застосунок для управління завданнями з авторизацією та розмежуванням прав доступу. Реалізовано на **Laravel + JWT + Vanilla JS + TailwindCSS**.  
Проект включає:

- CRUD для завдань
- Авторизацію та реєстрацію користувачів
- Ролі (адміністратор і користувач)
- API-документацію через Swagger
- Встановлення та запуск через `setup.cmd`

---

## 🧰 Технологічний стек

- **Backend:** Laravel 10 (REST API)
- **Аутентифікація:** JWT (tymon/jwt-auth)
- **Frontend:** Vanilla JS + TailwindCSS + Vite
- **Документація:** Swagger (L5-Swagger)
- **База даних:** MySQL
- **Контейнеризація:** Docker + Docker Compose

---

## 🚀 Встановлення та запуск

1. Клонувати репозиторій:

```bash
git clone https://github.com/bachinsky1/adfinem
cd adfinem
```

2. Запустити `setup.cmd` (Windows):

```cmd
setup.cmd
```

Скрипт виконує:

- Копіювання `.env` з `.env.example`
- Запуск Docker-контейнерів
- Встановлення PHP-залежностей
- Генерацію ключа додатку
- Міграції та наповнення початковими даними (сіди)
- Генерацію Swagger-документації
- Встановлення та збірку фронтенду

3. Перейти в браузері:

```
Інтерфейс:         http://localhost:8000
Swagger Docs:      http://localhost:8000/api/documentation
phpMyAdmin:        http://localhost:8080
```

---

## 👥 Ролі користувачів

- **Адміністратор:** бачить усі завдання, може керувати ними
- **Користувач:** бачить лише власні завдання

---

## 📂 Структура проекту

```
/client         — фронтенд (Vite + Tailwind)
/server         — бекенд (Laravel)
/mysql-data     — дані MySQL
/docker-compose.yml
/Dockerfile
/setup.cmd
```

---

## 📑 Документація API

Swagger доступний за адресою:  
📎 **http://localhost:8000/api/documentation**

---

## ⚠️ Примітки

- Laravel працює в середовищі `php:8.2-fpm`, залежності встановлюються через Composer всередині контейнера.
- Swagger реалізовано через `l5-swagger`, анотації прописані у контролерах.