import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AddCompanyModal from '../components/AddCompanyModal'
import EditCompanyModal from '../components/EditCompanyModal'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

function Companies() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCompanies(response.data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (companyId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الشركة؟ سيتم حذف جميع الموظفين التابعين لها.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('تم حذف الشركة بنجاح')
      fetchCompanies()
    } catch (error) {
      alert(error.response?.data?.message || 'حدث خطأ أثناء حذف الشركة')
    }
  }

  const handleEdit = (company) => {
    setSelectedCompany(company)
    setShowEditModal(true)
  }

  const handleEditSuccess = () => {
    setShowEditModal(false)
    setSelectedCompany(null)
    fetchCompanies()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-800"
              >
                الرئيسية
              </button>
              <h1 className="text-2xl font-bold text-gray-800">إدارة الشركات</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                إضافة شركة جديدة
              </button>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">قائمة الشركات</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اسم الشركة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الموقع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الشركة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ انتهاء الرخصة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عدد الموظفين
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companies.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        لا توجد شركات
                      </td>
                    </tr>
                  ) : (
                    companies.map((company) => (
                      <tr key={company.Id || company.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.Name || company.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.Location || company.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.CompanyNumber || company.companyNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(company.LicenseExpiryDate || company.licenseExpiryDate).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {company.EmployeeCount || company.employeeCount} موظف
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(company)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDelete(company.Id || company.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchCompanies()
          }}
        />
      )}

      {showEditModal && selectedCompany && (
        <EditCompanyModal
          company={selectedCompany}
          onClose={() => {
            setShowEditModal(false)
            setSelectedCompany(null)
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}

export default Companies

