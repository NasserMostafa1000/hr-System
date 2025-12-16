import { useState } from 'react'
import axios from 'axios'
import StatisticsDetailsModal from './StatisticsDetailsModal'

const API_BASE_URL = 'http://localhost:5000/api'

function Statistics({ statistics }) {
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalData, setModalData] = useState(null)
  const [loading, setLoading] = useState(false)

  if (!statistics) return null

  const fetchDetails = async (endpoint, title, useStatisticsEndpoint = true) => {
    setLoading(true)
    setModalTitle(title)
    try {
      const token = localStorage.getItem('token')
      const url = useStatisticsEndpoint 
        ? `${API_BASE_URL}/statistics/${endpoint}`
        : `${API_BASE_URL}/${endpoint}`
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setModalData(response.data)
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching details:', error)
      alert('حدث خطأ أثناء جلب البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleStatClick = (statType) => {
    switch (statType) {
      case 'companies':
        fetchDetails('companies', 'إجمالي الشركات', false)
        break
      case 'employees':
        fetchDetails('employees', 'إجمالي الموظفين', false)
        break
      case 'expiring-passports':
        fetchDetails('employees/expiring-passports', 'جوازات سفر قاربت على الانتهاء')
        break
      case 'expiring-ids':
        fetchDetails('employees/expiring-ids', 'هويات قاربت على الانتهاء')
        break
      case 'expiring-licenses':
        fetchDetails('companies/expiring-licenses', 'شركات قاربت على انتهاء الرخصة')
        break
      case 'today-present':
        fetchDetails('attendance/today-present', 'حضور اليوم')
        break
      case 'today-absent':
        fetchDetails('attendance/today-absent', 'غياب اليوم')
        break
      case 'pending-leaves':
        fetchDetails('leaves/pending', 'إجازات قيد الانتظار')
        break
      case 'approved-leaves':
        fetchDetails('leaves/approved-today', 'إجازات معتمدة (اليوم)')
        break
      default:
        break
    }
  }

  const stats = [
    {
      title: 'إجمالي الشركات',
      value: statistics.TotalCompanies || statistics.totalCompanies,
      color: 'bg-blue-500',
      statType: 'companies',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'إجمالي الموظفين',
      value: statistics.TotalEmployees || statistics.totalEmployees,
      color: 'bg-green-500',
      statType: 'employees',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'حضور اليوم',
      value: statistics.TodayPresentEmployees || statistics.todayPresentEmployees,
      color: 'bg-purple-500',
      statType: 'today-present',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'غياب اليوم',
      value: statistics.TodayAbsentEmployees || statistics.todayAbsentEmployees,
      color: 'bg-gray-500',
      statType: 'today-absent',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    {
      title: 'إجازات قيد الانتظار',
      value: statistics.PendingLeaves || statistics.pendingLeaves,
      color: 'bg-yellow-500',
      statType: 'pending-leaves',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'إجازات معتمدة (اليوم)',
      value: statistics.ApprovedLeaves || statistics.approvedLeaves,
      color: 'bg-indigo-500',
      statType: 'approved-leaves',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'جوازات سفر قاربت على الانتهاء',
      value: statistics.EmployeesWithExpiringPassports || statistics.employeesWithExpiringPassports,
      color: 'bg-yellow-600',
      statType: 'expiring-passports',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'هويات قاربت على الانتهاء',
      value: statistics.EmployeesWithExpiringIds || statistics.employeesWithExpiringIds,
      color: 'bg-orange-500',
      statType: 'expiring-ids',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
    },
    {
      title: 'شركات قاربت على انتهاء الرخصة',
      value: statistics.CompaniesWithExpiringLicenses || statistics.companiesWithExpiringLicenses,
      color: 'bg-red-500',
      statType: 'expiring-licenses',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
  ]

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">الإحصائيات العامة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <button
              key={index}
              onClick={() => handleStatClick(stat.statType)}
              className={`${stat.color} text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center hover:opacity-90 transition-opacity cursor-pointer`}
            >
              <div className="mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-center">{stat.title}</div>
            </button>
          ))}
        </div>

        {(statistics.CompanyEmployeeCounts || statistics.companyEmployeeCounts) && 
         (statistics.CompanyEmployeeCounts || statistics.companyEmployeeCounts).length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">عدد الموظفين في كل شركة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(statistics.CompanyEmployeeCounts || statistics.companyEmployeeCounts).map((company) => (
                <div
                  key={company.CompanyId || company.companyId}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="font-semibold text-gray-800">{company.CompanyName || company.companyName}</div>
                  <div className="text-blue-600 text-lg font-bold mt-2">
                    {company.EmployeeCount || company.employeeCount} موظف
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <StatisticsDetailsModal
          title={modalTitle}
          data={modalData}
          loading={loading}
          onClose={() => {
            setShowModal(false)
            setModalData(null)
          }}
        />
      )}
    </>
  )
}

export default Statistics

