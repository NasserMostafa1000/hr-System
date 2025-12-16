import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AddEmployeeModal from '../components/AddEmployeeModal'
import EditEmployeeModal from '../components/EditEmployeeModal'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

function Employees() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [companies, setCompanies] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
    fetchCompanies()
  }, [])

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEmployees(response.data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/companies`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCompanies(response.data)
    } catch (error) {
      console.error('Error fetching companies:', error)
    }
  }

  const handleDelete = async (employeeId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الموظف؟ سيتم حذف جميع بياناته وسجلات الحضور والإجازات.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/employees/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('تم حذف الموظف بنجاح')
      fetchEmployees()
    } catch (error) {
      alert(error.response?.data?.message || 'حدث خطأ أثناء حذف الموظف')
    }
  }

  const handleEdit = (employee) => {
    setSelectedEmployee(employee)
    setShowEditModal(true)
  }

  const handleEditSuccess = () => {
    setShowEditModal(false)
    setSelectedEmployee(null)
    fetchEmployees()
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
              <h1 className="text-2xl font-bold text-gray-800">إدارة الموظفين</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                إضافة موظف جديد
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
            <h2 className="text-xl font-bold mb-4">قائمة الموظفين</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوظيفة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الشركة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الراتب الشهري
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الجواز
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        لا توجد موظفين
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee) => (
                      <tr key={employee.Id || employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.Name || employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.JobTitle || employee.jobTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.CompanyName || employee.companyName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.MonthlySalary || employee.monthlySalary} درهم
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.PassportNumber || employee.passportNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(employee)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => handleDelete(employee.Id || employee.id)}
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
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchEmployees()
          }}
          companies={companies}
        />
      )}

      {showEditModal && selectedEmployee && (
        <EditEmployeeModal
          employee={selectedEmployee}
          companies={companies}
          onClose={() => {
            setShowEditModal(false)
            setSelectedEmployee(null)
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
}

export default Employees

