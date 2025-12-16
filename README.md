# نظام إدارة الموارد البشرية

نظام شامل لإدارة الشركات والموظفين مع تتبع انتهاء الجوازات والهويات والرخص.

## المميزات

- ✅ تسجيل الدخول
- ✅ إضافة وإدارة الشركات
- ✅ إضافة وإدارة الموظفين
- ✅ رفع الصور (الصورة الشخصية، جواز السفر، الهوية)
- ✅ إحصائيات شاملة:
  - عدد الموظفين في كل شركة
  - الموظفين الذين قاربت جوازات سفرهم على الانتهاء
  - الموظفين الذين قاربت هوياتهم على الانتهاء
  - الشركات التي قاربت رخصها على الانتهاء
- ✅ عرض إحصائيات شركة محددة

## التقنيات المستخدمة

### Backend
- ASP.NET Core 8.0 Web API
- Entity Framework Core
- SQL Server
- BCrypt للتحقق من كلمات المرور

### Frontend
- React.js 18
- Vite
- Tailwind CSS
- React Router
- Axios

## متطلبات التشغيل

- .NET 8.0 SDK
- Node.js 18+ و npm
- SQL Server (LocalDB أو SQL Server Express)

## خطوات التشغيل

### 1. تشغيل Backend

```bash
cd HrSystem.API
dotnet restore
dotnet run
```

سيتم تشغيل API على `http://localhost:5000`

### 2. تشغيل Frontend

```bash
cd frontend
npm install
npm run dev
```

سيتم تشغيل التطبيق على `http://localhost:5173`

## بيانات الدخول الافتراضية

- **اسم المستخدم:** admin
- **كلمة المرور:** admin123

## هيكل المشروع

```
HrSystem/
├── HrSystem.API/          # Backend API
│   ├── Controllers/       # API Controllers
│   ├── Models/            # Data Models
│   ├── DTOs/              # Data Transfer Objects
│   ├── Data/              # DbContext
│   ├── Services/          # Business Logic Services
│   └── wwwroot/           # Static Files (Uploads)
│
└── frontend/              # React Frontend
    ├── src/
    │   ├── components/    # React Components
    │   ├── pages/         # Page Components
    │   ├── context/       # React Context
    │   └── App.jsx        # Main App Component
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - إنشاء حساب جديد

### Companies
- `GET /api/companies` - الحصول على جميع الشركات
- `GET /api/companies/{id}` - الحصول على شركة محددة
- `POST /api/companies` - إضافة شركة جديدة
- `PUT /api/companies/{id}` - تحديث شركة
- `DELETE /api/companies/{id}` - حذف شركة

### Employees
- `GET /api/employees` - الحصول على جميع الموظفين
- `GET /api/employees/{id}` - الحصول على موظف محدد
- `POST /api/employees` - إضافة موظف جديد (مع رفع الملفات)
- `PUT /api/employees/{id}` - تحديث موظف
- `DELETE /api/employees/{id}` - حذف موظف

### Statistics
- `GET /api/statistics` - الحصول على الإحصائيات العامة
- `GET /api/statistics/company/{companyId}` - الحصول على إحصائيات شركة محددة

## ملاحظات

- يتم حفظ الملفات المرفوعة في `wwwroot/uploads/`
- قاعدة البيانات يتم إنشاؤها تلقائياً عند أول تشغيل
- يتم إنشاء مستخدم افتراضي تلقائياً إذا لم يكن موجوداً

## الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الحر.

