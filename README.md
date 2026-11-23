# The School Times

O‘zbekcha maktab raqamli gazetasi. Tailwind CSS, modulli JavaScript, Cloudflare Worker va D1 ma’lumotlar bazasi. Boshlang‘ich bazada maqola, foydalanuvchi, so‘rovnoma, ovoz va arxiv yozuvlari yo‘q.

## Ishga tushirish

`npm ci`, `npm run build`, `npm run dev`. Lokal Node 24 kerak. Preview bazasi `.data/preview.sqlite` da saqlanadi va Gitga kirmaydi. Production D1 alohida bazadir. `npm test` izolyatsiyalangan xotira bazasida autentifikatsiya, sessiya, admin ruxsati, CSRF va rate-limitni tekshiradi. Test yozuvlari saytga yuklanmaydi.

## Hisoblar va admin

Email va kamida 12 belgili parol bilan ro‘yxatdan o‘tiladi. Barcha yangi hisoblar `reader`. Parollar tuzlangan PBKDF2-SHA256 bilan xeshlanadi, sessiya tokenlarining faqat SHA256 xeshi bazada saqlanadi. Sessiya 7 kunlik HttpOnly, Secure, SameSite=Strict cookie. Har bir maqola POST so‘rovida rol bazadan qayta tekshiriladi. Client yuborgan role e’tiborsiz qoldiriladi. Origin tekshiruvi va autentifikatsiya urinishlari cheklovi bor.

Birinchi admin: ro‘yxatdan o‘tish → Hisobim → Admin huquqini faollashtirish → sayt egasiga berilgan maxfiy kod. Kod production `ADMIN_SETUP_CODE` secret sifatida saqlanadi. `admin_claims` jadvalidagi yagona yozuv orqali bir marta ishlatiladi; takroriy yoki parallel claim tranzaksiyada rad etiladi. Kodni ochiq tarqatmang. Keyingi adminlarni faqat baza egasi boshqaradi; ommaviy rol o‘zgartirish endpointi yo‘q.

Email tasdiqlash va parolni unutish/email orqali tiklash hozircha kiritilmagan. Emailga qarab admin huquqi avtomatik berilmaydi. Saytning tashqi kirish ruxsatlari ilova ichidagi hisobdan alohida: avvalgi owner-private holati saqlangan.

## API

GET `/api/auth/me`; POST `/api/auth/signup` `{name,email,password}`; POST `/api/auth/login` `{email,password}`; POST `/api/auth/logout`; POST `/api/auth/claim-admin` `{code}`.

GET `/api/articles`; GET `/api/articles/:id`; POST `/api/articles/:id/like` (kirish shart). POST `/api/submissions` faqat admin: `{title,content,category,type,consent:true}`. Muallif sessiyadan olinadi va maqola haqiqiy bazaga yozilgach chop etiladi.

GET `/api/breaking-news`, GET `/api/archive`, GET `/api/polls/active`, POST `/api/polls/vote` `{pollId,optionId}` (kirish shart, har foydalanuvchiga bitta ovoz). Bo‘sh natijalar bazadan `[]` yoki `null` bo‘lib qaytadi. Mazkur nashrda e’lon, arxiv va so‘rovnoma boshqaruv paneli yo‘q; bu yozuvlar bazaga haqiqiy tahririyat ma’lumotlari bilan kiritiladi.

`public/config.js`: logo, Telegram va tahririyat matni. Maqola HTML sifatida bajarilmaydi, tashqi havolalar http/https bilan cheklangan. `public/` asosiy frontend manbasi, `worker/index.js` server manbasi; build statik fayllarni Workerga birlashtiradi. SQL migratsiya `drizzle/` ichida. Production deploydan oldin migratsiya qo‘llanadi.
