import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

function CompanyStatistics({ companyId, onClose }) {
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [companyId])

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${API_BASE_URL}/statistics/company/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setStatistics(response.data)
    } catch (error) {
      console.error('Error fetching company statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="text-center py-4">جاري التحميل...</div>
      </div>
    )
  }

  if (!statistics) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          إحصائيات شركة: {statistics.CompanyName}
        </h2>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
        >
          إغلاق
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-gray-600 mb-1">إجمالي الموظفين</div>
          <div className="text-2xl font-bold text-blue-600">
            {statistics.TotalEmployees}
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-sm text-gray-600 mb-1">جوازات سفر قاربت على الانتهاء</div>
          <div className="text-2xl font-bold text-yellow-600">
            {statistics.EmployeesWithExpiringPassports}
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-sm text-gray-600 mb-1">هويات قاربت على الانتهاء</div>
          <div className="text-2xl font-bold text-orange-600">
            {statistics.EmployeesWithExpiringIds}
          </div>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            statistics.IsLicenseExpiringSoon
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
          }`}
        >
          <div className="text-sm text-gray-600 mb-1">تاريخ انتهاء الرخصة</div>
          <div
            className={`text-lg font-bold ${
              statistics.IsLicenseExpiringSoon ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {new Date(statistics.LicenseExpiryDate).toLocaleDateString('ar-SA')}
          </div>
          {statistics.IsLicenseExpiringSoon && (
            <div className="text-xs text-red-600 mt-1">⚠️ قاربت على الانتهاء</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyStatistics

