DevBox Static PWA
=================
این نسخه React/Vite/npm ندارد.

تست مستقیم:
1) فایل index.html را دوبارکلیک کنید. رابط برنامه باید باز شود.
2) Service Worker روی file:// ثبت نمی‌شود؛ این رفتار طبیعی مرورگر است.

برای PWA و PWABuilder:
1) کل محتویات این پوشه را بدون تغییر ساختار روی یک آدرس HTTPS قرار دهید.
2) URL خود سایت را در PWABuilder وارد کنید، نه فایل ZIP و نه GitHub repository.
3) مطمئن شوید این آدرس‌ها با HTTP 200 باز می‌شوند:
   /manifest.json
   /sw.js
   /icons/icon-192.png
   /icons/icon-512.png

اگر در زیرپوشه منتشر می‌کنید، همه مسیرها relative هستند و نیازی به تغییر کد نیست.
