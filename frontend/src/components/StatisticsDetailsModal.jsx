const API_BASE_URL = 'http://localhost:5000'

function StatisticsDetailsModal({ title, data, loading, onClose }) {
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    } catch {
      return dateString
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      )
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return (
        <div className="text-center py-8 text-gray-600">
          لا توجد بيانات للعرض
        </div>
      )
    }

    // Handle companies data
    if (title.includes('شركات') || title.includes('الشركات')) {
      return (
        <div className="overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((company) => (
              <div
                key={company.Id || company.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {company.Name || company.name}
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">الموقع:</span> {company.Location || company.location || '-'}</p>
                  <p><span className="font-semibold">رقم الشركة:</span> {company.CompanyNumber || company.companyNumber || '-'}</p>
                  <p><span className="font-semibold">عدد الموظفين:</span> {company.EmployeeCount || company.employeeCount || 0}</p>
                  <p><span className="font-semibold">تاريخ انتهاء الرخصة:</span> {formatDate(company.LicenseExpiryDate || company.licenseExpiryDate)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // Handle employees data
    if (title.includes('موظفين') || title.includes('الموظفين') || title.includes('حضور') || title.includes('غياب')) {
      return (
        <div className="overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => {
              // Check if it's attendance data
              if (item.EmployeeName || item.employeeName) {
                return (
                  <div
                    key={item.Id || item.id}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {item.EmployeeName || item.employeeName}
                    </h3>
                    <div className="space-y-1 text-sm">
                      {item.CheckInTime && (
                        <p><span className="font-semibold">وقت الحضور:</span> {formatDateTime(item.CheckInTime || item.checkInTime)}</p>
                      )}
                      {item.CheckOutTime && (
                        <p><span className="font-semibold">وقت الانصراف:</span> {formatDateTime(item.CheckOutTime || item.checkOutTime)}</p>
                      )}
                      {item.WorkHoursString && (
                        <p><span className="font-semibold">ساعات العمل:</span> {item.WorkHoursString || item.workHoursString}</p>
                      )}
                      {item.Status && (
                        <p><span className="font-semibold">الحالة:</span> {item.Status || item.status}</p>
                      )}
                    </div>
                  </div>
                )
              }
              
              // Regular employee data
              return (
                <div
                  key={item.Id || item.id}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {item.Name || item.name}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">الشركة:</span> {item.CompanyName || item.companyName || '-'}</p>
                    <p><span className="font-semibold">المسمى الوظيفي:</span> {item.JobTitle || item.jobTitle || '-'}</p>
                    <p><span className="font-semibold">الراتب الشهري:</span> {item.MonthlySalary || item.monthlySalary || 0} درهم</p>
                    {item.PassportNumber && (
                      <p><span className="font-semibold">رقم الجواز:</span> {item.PassportNumber || item.passportNumber}</p>
                    )}
                    {item.PassportExpiryDate && (
                      <p><span className="font-semibold">انتهاء الجواز:</span> {formatDate(item.PassportExpiryDate || item.passportExpiryDate)}</p>
                    )}
                    {item.IdExpiryDate && (
                      <p><span className="font-semibold">انتهاء الهوية:</span> {formatDate(item.IdExpiryDate || item.idExpiryDate)}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    // Handle leaves data
    if (title.includes('إجاز') || title.includes('إجازات')) {
      return (
        <div className="overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((leave) => (
              <div
                key={leave.Id || leave.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {leave.EmployeeName || leave.employeeName}
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-semibold">تاريخ البداية:</span> {formatDate(leave.StartDate || leave.startDate)}</p>
                  <p><span className="font-semibold">تاريخ الانتهاء:</span> {formatDate(leave.EndDate || leave.endDate)}</p>
                  <p><span className="font-semibold">عدد الأيام:</span> {leave.DaysCount || leave.daysCount || 0}</p>
                  <p><span className="font-semibold">نوع الإجازة:</span> {leave.LeaveType || leave.leaveType || '-'}</p>
                  <p><span className="font-semibold">الحالة:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      (leave.Status || leave.status) === 'Approved' 
                        ? 'bg-green-100 text-green-800' 
                        : (leave.Status || leave.status) === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {(leave.Status || leave.status) === 'Approved' ? 'معتمدة' : 
                       (leave.Status || leave.status) === 'Rejected' ? 'مرفوضة' : 'قيد الانتظار'}
                    </span>
                  </p>
                  {leave.Reason && (
                    <p><span className="font-semibold">السبب:</span> {leave.Reason || leave.reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="text-center py-8 text-gray-600">
        نوع البيانات غير معروف
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-6 flex-1 overflow-hidden">
          {renderContent()}
        </div>
        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatisticsDetailsModal

