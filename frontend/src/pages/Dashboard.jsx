import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AddCompanyModal from '../components/AddCompanyModal'
import AddEmployeeModal from '../components/AddEmployeeModal'
import Statistics from '../components/Statistics'
import CompanyStatistics from '../components/CompanyStatistics'
import ChangePasswordModal from '../components/ChangePasswordModal'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [statistics, setStatistics] = useState(null)
  const [selectedCompanyId, setSelectedCompanyId] = useState(null)
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
    fetchCompanies()
  }, [])

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/statistics`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setStatistics(response.data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('Companies fetched in Dashboard:', response.data)
      if (response.data && Array.isArray(response.data)) {
        setCompanies(response.data)
      } else {
        console.error('Invalid companies data:', response.data)
        setCompanies([])
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setCompanies([])
    }
  }

  const handleCompanyAdded = () => {
    setShowCompanyModal(false)
    fetchStatistics()
    fetchCompanies()
  }

  const handleEmployeeAdded = () => {
    setShowEmployeeModal(false)
    fetchStatistics()
  }

  const handleCompanySelect = (companyId) => {
    setSelectedCompanyId(companyId === selectedCompanyId ? null : companyId)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              نظام إدارة الموارد البشرية
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowChangePasswordModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                تغيير كلمة المرور
              </button>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setShowCompanyModal(true)}
            className="bg-blue-600 text-white p-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex flex-col items-center justify-center"
          >
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="text-lg font-semibold">إضافة شركة</span>
          </button>

          <button
            onClick={() => setShowEmployeeModal(true)}
            className="bg-green-600 text-white p-6 rounded-lg shadow-lg hover:bg-green-700 transition-colors flex flex-col items-center justify-center"
          >
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-lg font-semibold">إضافة موظف</span>
          </button>

          <button
            onClick={() => navigate('/companies')}
            className="bg-indigo-600 text-white p-6 rounded-lg shadow-lg hover:bg-indigo-700 transition-colors flex flex-col items-center justify-center"
          >
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="text-lg font-semibold">إدارة الشركات</span>
          </button>

          <button
            onClick={() => navigate('/employees')}
            className="bg-teal-600 text-white p-6 rounded-lg shadow-lg hover:bg-teal-700 transition-colors flex flex-col items-center justify-center"
          >
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span className="text-lg font-semibold">إدارة الموظفين</span>
          </button>

          <button
            onClick={() => navigate('/attendance')}
            className="bg-purple-600 text-white p-6 rounded-lg shadow-lg hover:bg-purple-700 transition-colors flex flex-col items-center justify-center"
          >
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-lg font-semibold">الحضور والانصراف</span>
          </button>

          <button
            onClick={() => navigate('/leaves')}
            className="bg-orange-600 text-white p-6 rounded-lg shadow-lg hover:bg-orange-700 transition-colors flex flex-col items-center justify-center"
          >
            <svg
              className="w-12 h-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-lg font-semibold">الإجازات</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : (
          <>
            <Statistics statistics={statistics} />
            
            {selectedCompanyId && (
              <CompanyStatistics
                companyId={selectedCompanyId}
                onClose={() => setSelectedCompanyId(null)}
              />
            )}

            {companies.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">عرض إحصائيات شركة محددة</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {companies.map((company) => (
                    <button
                      key={company.Id}
                      onClick={() => handleCompanySelect(company.Id)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedCompanyId === company.Id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold">{company.Name}</div>
                      <div className="text-sm text-gray-600">
                        {company.EmployeeCount} موظف
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {showCompanyModal && (
          <AddCompanyModal
            onClose={() => setShowCompanyModal(false)}
            onSuccess={handleCompanyAdded}
          />
        )}

        {showEmployeeModal && (
          <AddEmployeeModal
            onClose={() => setShowEmployeeModal(false)}
            onSuccess={handleEmployeeAdded}
            companies={companies}
          />
        )}

        {showChangePasswordModal && (
          <ChangePasswordModal
            onClose={() => setShowChangePasswordModal(false)}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard

