# دليل البدء السريع

## خطوات التشغيل السريعة

### 1. تشغيل Backend (ASP.NET Core API)

افتح Terminal في مجلد المشروع وقم بتنفيذ:

```bash
cd HrSystem.API
dotnet restore
dotnet run
```

انتظر حتى ترى رسالة:
```
Now listening on: http://localhost:5000
```

### 2. تشغيل Frontend (React)

افتح Terminal جديد وقم بتنفيذ:

```bash
cd frontend
npm install
npm run dev
```

سيتم فتح المتصفح تلقائياً على `http://localhost:5173`

### 3. تسجيل الدخول

استخدم البيانات التالية:
- **اسم المستخدم:** `admin`
- **كلمة المرور:** `admin123`

## ملاحظات مهمة

1. **قاعدة البيانات:** يتم إنشاؤها تلقائياً عند أول تشغيل
2. **المستخدم الافتراضي:** يتم إنشاؤه تلقائياً إذا لم يكن موجوداً
3. **المجلدات:** يتم إنشاء مجلدات رفع الملفات تلقائياً
4. **البورتات:** 
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:5173`

## استكشاف الأخطاء

### مشكلة في الاتصال بقاعدة البيانات
- تأكد من تثبيت SQL Server LocalDB
- أو قم بتغيير Connection String في `appsettings.json`

### مشكلة في CORS
- تأكد من أن Backend يعمل على البورت 5000
- تأكد من أن Frontend يعمل على البورت 5173

### مشكلة في رفع الملفات
- تأكد من وجود مجلد `wwwroot` في `HrSystem.API`
- تأكد من الصلاحيات على المجلد

## الميزات المتاحة

✅ تسجيل الدخول  
✅ إضافة شركة جديدة  
✅ إضافة موظف جديد  
✅ عرض الإحصائيات العامة  
✅ عرض إحصائيات شركة محددة  
✅ رفع الصور (شخصية، جواز سفر، هوية)  

## البنية

```
HrSystem/
├── HrSystem.API/        # Backend
│   ├── Controllers/     # API Endpoints
│   ├── Models/          # Database Models
│   ├── Services/        # Business Logic
│   └── wwwroot/         # Static Files
│
└── frontend/            # Frontend
    └── src/
        ├── components/  # React Components
        └── pages/      # Pages
```

## الدعم

إذا واجهت أي مشاكل، تأكد من:
1. تثبيت جميع المتطلبات (.NET 8.0, Node.js 18+)
2. تشغيل Backend قبل Frontend
3. التحقق من البورتات المستخدمة

