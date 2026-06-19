# Premam

کلاینت HTTP مشابه Postman با Next.js، React و TypeScript.

## اجرا

```cmd
cd c:\Users\Asus\Documents\premam
npm install
npm run dev
```

برنامه روی `http://127.0.0.1:3000` اجرا می‌شود.

## بخش‌های پیاده‌سازی‌شده

1. **رابط کاربری** — چیدمان واکنش‌گرا، چند تب، حالت تاریک
2. **انتخاب متد HTTP** — GET, POST, PUT, PATCH, DELETE
3. **URL و اعتبارسنجی** — بررسی خالی نبودن و ساختار http/https
4. **مدیریت پارامترها** — افزودن/حذف/ویرایش و همگام‌سازی با URL
5. **مدیریت هدرها** — لیست کلید-مقدار با اعمال هنگام ارسال
6. **بدنه درخواست** — ویرایشگر متنی خام/JSON برای POST, PUT, PATCH, DELETE
7. **نمایش کد وضعیت** — نمایش واضح status با رنگ‌بندی (موفق/خطای کاربر/خطای سرور)
8. **مدیریت خطاها** — خطاهای شبکه، CORS، timeout، اعتبارسنجی JSON
9. **پاک کردن فیلدها** — بازنشانی URL، پارامترها، هدرها و بدنه
10. **Local Storage** — ذخیره تب‌ها، مجموعه‌ها و تاریخچه
11. **ورود/خروج مجموعه‌ها** — import/export فایل JSON
12. **چند تب** — مدیریت همزمان چند درخواست با state مستقل

## ساختار پروژه

```
src/
├── app/              # Next.js App Router
├── components/       # کامپوننت‌های UI
├── contexts/         # State management (Theme, Tabs)
├── lib/              # توابع کمکی (URL validation)
└── types/            # TypeScript types
```
