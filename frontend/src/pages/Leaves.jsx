import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

function Leaves() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [leaves, setLeaves] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEmployees()
    fetchLeaves()
  }, [filterStatus])

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('Employees fetched in Leaves:', response.data)
      if (response.data && Array.isArray(response.data)) {
        setEmployees(response.data)
      } else {
        console.error('Invalid employees data:', response.data)
        setEmployees([])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token')
      const params = filterStatus ? { status: filterStatus } : {}
      const response = await axios.get(`${API_BASE_URL}/leaves`, { 
        params,
        headers: { Authorization: `Bearer ${token}` }
      })
      setLeaves(response.data)
    } catch (error) {
      console.error('Error fetching leaves:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveReject = async (leaveId, status, rejectionReason = '') => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_BASE_URL}/leaves/${leaveId}/status`, {
        status,
        rejectionReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchLeaves()
      setShowReviewModal(false)
      setSelectedLeave(null)
      alert(`تم ${status === 'Approved' || status === 'approved' ? 'الموافقة' : 'الرفض'} على الإجازة بنجاح`)
    } catch (error) {
      alert(error.response?.data?.message || 'حدث خطأ')
    }
  }

  const handleDelete = async (leaveId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الإجازة؟')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/leaves/${leaveId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchLeaves()
      alert('تم حذف الإجازة بنجاح')
    } catch (error) {
      alert(error.response?.data?.message || 'حدث خطأ أثناء الحذف')
    }
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Dubai'
      })
    } catch (error) {
      return dateString
    }
  }
  
  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Dubai'
      })
    } catch (error) {
      return dateString
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800'
      case 'Rejected':
        return 'bg-red-100 text-red-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'Approved':
        return 'موافق عليها'
      case 'Rejected':
        return 'مرفوضة'
      case 'Pending':
        return 'قيد الانتظار'
      default:
        return status
    }
  }

  const getLeaveTypeText = (type) => {
    const types = {
      Annual: 'سنوية',
      Sick: 'مرضية',
      Emergency: 'طارئة',
      Unpaid: 'بدون راتب'
    }
    return types[type] || type
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
              <h1 className="text-2xl font-bold text-gray-800">إدارة الإجازات</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                طلب إجازة جديدة
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 items-center">
            <label className="text-gray-700 font-bold">فلترة حسب الحالة:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">الكل</option>
              <option value="Pending">قيد الانتظار</option>
              <option value="Approved">موافق عليها</option>
              <option value="Rejected">مرفوضة</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">جاري التحميل...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">قائمة الإجازات</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الموظف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نوع الإجازة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      من تاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إلى تاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عدد الأيام
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        لا توجد إجازات
                      </td>
                    </tr>
                  ) : (
                    leaves.map((leave) => {
                      const leaveId = leave.Id || leave.id
                      const employeeName = leave.EmployeeName || leave.employeeName
                      const leaveType = leave.LeaveType || leave.leaveType
                      const startDate = leave.StartDate || leave.startDate
                      const endDate = leave.EndDate || leave.endDate
                      const daysCount = leave.DaysCount || leave.daysCount
                      const status = leave.Status || leave.status
                      const rejectionReason = leave.RejectionReason || leave.rejectionReason
                      const createdAt = leave.CreatedAt || leave.createdAt
                      
                      return (
                        <tr key={leaveId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {employeeName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getLeaveTypeText(leaveType)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(startDate).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(endDate).toLocaleDateString('ar-SA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {daysCount} يوم
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                status
                              )}`}
                            >
                              {getStatusText(status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {status === 'Pending' || status === 'pending' ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedLeave(leave)
                                    setShowReviewModal(true)
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  مراجعة
                                </button>
                                <button
                                  onClick={() => handleDelete(leaveId)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  حذف
                                </button>
                              </div>
                            ) : null}
                            {(status === 'Rejected' || status === 'rejected') && rejectionReason && (
                              <div className="text-xs text-red-600 max-w-xs">
                                {rejectionReason}
                              </div>
                            )}
                            {createdAt && (
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(createdAt).toLocaleString('ar-SA', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  timeZone: 'Asia/Dubai'
                                })}
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddLeaveModal
          employees={employees}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchLeaves()
          }}
        />
      )}

      {showReviewModal && selectedLeave && (
        <ReviewLeaveModal
          leave={selectedLeave}
          onClose={() => {
            setShowReviewModal(false)
            setSelectedLeave(null)
          }}
          onApprove={(rejectionReason) =>
            handleApproveReject(selectedLeave.Id || selectedLeave.id, 'Approved', rejectionReason)
          }
          onReject={(rejectionReason) =>
            handleApproveReject(selectedLeave.Id || selectedLeave.id, 'Rejected', rejectionReason)
          }
        />
      )}
    </div>
  )
}

function AddLeaveModal({ employees, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    startDate: '',
    endDate: '',
    leaveType: 'Annual',
    reason: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/leaves`, {
        ...formData,
        employeeId: parseInt(formData.employeeId),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة الإجازة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">طلب إجازة جديدة</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              الموظف *
            </label>
            <select
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر الموظف</option>
              {employees && employees.length > 0 ? (
                employees.map((emp) => (
                  <option key={emp.Id || emp.id} value={emp.Id || emp.id}>
                    {emp.Name || emp.name} - {emp.CompanyName || emp.companyName}
                  </option>
                ))
              ) : (
                <option value="" disabled>لا توجد موظفين متاحين</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              نوع الإجازة *
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Annual">سنوية</option>
              <option value="Sick">مرضية</option>
              <option value="Emergency">طارئة</option>
              <option value="Unpaid">بدون راتب</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              من تاريخ *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              إلى تاريخ *
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              السبب
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ReviewLeaveModal({ leave, onClose, onApprove, onReject }) {
  const [rejectionReason, setRejectionReason] = useState('')

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Dubai'
      })
    } catch (error) {
      return dateString
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Dubai'
      })
    } catch (error) {
      return dateString
    }
  }

  const getLeaveTypeText = (type) => {
    const types = {
      Annual: 'سنوية',
      Sick: 'مرضية',
      Emergency: 'طارئة',
      Unpaid: 'بدون راتب'
    }
    return types[type] || type
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">مراجعة الإجازة</h2>

        <div className="space-y-4 mb-6">
          <div>
            <span className="font-bold">الموظف:</span> {leave.EmployeeName || leave.employeeName}
          </div>
          <div>
            <span className="font-bold">نوع الإجازة:</span> {getLeaveTypeText(leave.LeaveType || leave.leaveType)}
          </div>
          <div>
            <span className="font-bold">من:</span>{' '}
            {formatDate(leave.StartDate || leave.startDate)} إلى{' '}
            {formatDate(leave.EndDate || leave.endDate)}
          </div>
          <div>
            <span className="font-bold">عدد الأيام:</span> {leave.DaysCount || leave.daysCount} يوم
          </div>
          {(leave.Reason || leave.reason) && (
            <div>
              <span className="font-bold">السبب:</span> {leave.Reason || leave.reason}
            </div>
          )}
          {(leave.CreatedAt || leave.createdAt) && (
            <div>
              <span className="font-bold">تاريخ الطلب:</span>{' '}
              {formatDateTime(leave.CreatedAt || leave.createdAt)}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            سبب الرفض (في حالة الرفض)
          </label>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onApprove(rejectionReason)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            موافقة
          </button>
          <button
            onClick={() => onReject(rejectionReason)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            رفض
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  )
}

export default Leaves


