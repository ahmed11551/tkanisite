# 🔄 Инструкция по переименованию файлов

## ⚠️ Проблема
Файлы экспортированы с оригинальными именами из Figma, но код ожидает стандартные имена.

## ✅ Решение

### ШАГ 1: Определите, какие файлы что содержат

Оригинальные файлы в `public/images/placeholders/`:
- `Rectangle 40176.png` - вероятно карточки товаров
- `Frame 2147227031.png` - вероятно баннеры или важные элементы
- `Hero Image Left.png` и `Hero Image Right.png` - могут быть баннеры
- Остальные Frame-ы - элементы интерфейса

### ШАГ 2: Проверьте размеры и назначение

Откройте файлы и определите:
- **Баннеры** (16:9 или близко, горизонтальные, большие)
  → Переместите в `hero/` если это героические изображения
  
- **Карточки товаров** (вертикальные, 4:5, квадратные)
  → Переименуйте в `product-1.jpg`, `product-2.jpg` и т.д.
  
- **Скидки** (вертикальные, с текстом или акциями)
  → Переименуйте в `sale-1.jpg`, `sale-2.jpg` и т.д.
  
- **Работы** (квадратные или вертикальные)
  → Переименуйте в `work-1.jpg`, `work-2.jpg` и т.д.

### ШАГ 3: Переименуйте файлы

#### Вариант A: Через PowerShell (автоматически)

Откройте PowerShell в папке проекта и выполните:

```powershell
cd "C:\Users\Dev-Ops\Desktop\centertkani.ru\public\images\placeholders"

# Пример: переименовать первые 4 прямоугольника в product-X
# Адаптируйте под ваши файлы!

# Найдите и переименуйте карточки товаров
Get-ChildItem -Filter "Rectangle 40176*.png" | ForEach-Object {
    $counter = 1
    if ($_.Name -match "Rectangle 40176-(\d+)") {
        $counter = [int]$matches[1]
    }
    Rename-Item $_.FullName -NewName "product-$counter.jpg"
}

# Найдите вторые изображения для hover
Get-ChildItem -Filter "Rectangle 40160*.png" | ForEach-Object {
    $counter = 1
    if ($_.Name -match "Rectangle 40160-(\d+)") {
        $counter = [int]$matches[1]
    }
    Rename-Item $_.FullName -NewName "product-$counter-alt.jpg"
}
```

#### Вариант B: Вручную (безопаснее)

1. Откройте папку `public/images/placeholders/`
2. Откройте каждый файл и определите его назначение
3. Переименуйте вручную:
   - `Rectangle 40176.png` → `product-1.jpg`
   - `Rectangle 40176-1.png` → `product-1-alt.jpg`
   - `Rectangle 40160.png` → `product-2.jpg`
   - И так далее...

### ШАГ 4: Проверьте, что получилось

Структура должна быть:
```
public/images/placeholders/
├── product-1.jpg        ← Основное изображение товара 1
├── product-1-alt.jpg    ← Hover изображение товара 1
├── product-2.jpg        ← Основное изображение товара 2
├── product-2-alt.jpg    ← Hover изображение товара 2
├── product-3.jpg
├── product-3-alt.jpg
├── product-4.jpg
├── product-4-alt.jpg
├── sale-1.jpg           ← Изображение скидки 1
├── sale-2.jpg           ← Изображение скидки 2
├── sale-3.jpg
├── sale-4.jpg
├── work-1.jpg           ← Работа 1
├── work-2.jpg
├── work-3.jpg
└── work-4.jpg
```

---

## 🎯 Быстрый способ (рекомендуется)

**Я могу создать автоматический скрипт для переименования!**

Скажите, какие файлы это:
1. **Баннеры** (для hero слайдера) → нужно переместить в `hero/`
2. **Карточки товаров** (четырехугольные карточки) → `product-1.jpg`, `product-1-alt.jpg` и т.д.
3. **Работы** (фото работ из тканей) → `work-1.jpg`, `work-2.jpg` и т.д.
4. **Скидки** (товары со скидками) → `sale-1.jpg`, `sale-2.jpg` и т.д.

**Напишите: "создай скрипт для переименования"** и я создам автоматический PowerShell скрипт! 🚀

