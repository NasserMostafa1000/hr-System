import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

function Attendance() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [attendances, setAttendances] = useState([])
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchAttendances()
      fetchTodayAttendance()
    }
  }, [selectedEmployeeId, dateFilter])

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('Employees fetched:', response.data)
      if (response.data && Array.isArray(response.data)) {
        setEmployees(response.data)
        if (response.data.length > 0) {
          setSelectedEmployeeId((response.data[0].Id || response.data[0].id).toString())
        }
      } else {
        console.error('Invalid employees data:', response.data)
        setEmployees([])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendances = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${API_BASE_URL}/attendance/employee/${selectedEmployeeId}`,
        {
          params: {
            startDate: dateFilter.startDate,
            endDate: dateFilter.endDate
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setAttendances(response.data)
    } catch (error) {
      console.error('Error fetching attendances:', error)
    }
  }

  const fetchTodayAttendance = async () => {
    try {
      const token = localStorage.getItem('token')
      const today = new Date().toISOString().split('T')[0]
      const response = await axios.get(
        `${API_BASE_URL}/attendance/employee/${selectedEmployeeId}`,
        {
          params: {
            startDate: today,
            endDate: today
          },
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data.length > 0) {
        setTodayAttendance(response.data[0])
      } else {
        setTodayAttendance(null)
      }
    } catch (error) {
      console.error('Error fetching today attendance:', error)
    }
  }

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/attendance/checkin`, {
        employeeId: parseInt(selectedEmployeeId),
        type: 'CheckIn'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTodayAttendance()
      fetchAttendances()
      alert('تم تسجيل الحضور بنجاح')
    } catch (error) {
      alert(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الحضور')
    }
  }

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/attendance/checkout`, {
        employeeId: parseInt(selectedEmployeeId),
        type: 'CheckOut'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchTodayAttendance()
      fetchAttendances()
      alert('تم تسجيل الانصراف بنجاح')
    } catch (error) {
      alert(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الانصراف')
    }
  }

  const formatTime = (dateTime) => {
    if (!dateTime) return '-'
    try {
      const date = new Date(dateTime)
      return date.toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    } catch (error) {
      console.error('Error formatting time:', error)
      return '-'
    }
  }

  const formatHours = (attendance) => {
    if (!attendance) return '-'
    
    // Use server-calculated work hours string (most accurate)
    const workHoursString = attendance.workHoursString || attendance.WorkHoursString
    if (workHoursString) {
      // Format: HH:MM:SS, show as HH:MM
      const parts = workHoursString.split(':')
      if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`
      }
      return workHoursString
    }
    
    // Fallback: Calculate from check in/out times (client-side calculation)
    const checkIn = attendance.checkInTime || attendance.CheckInTime
    const checkOut = attendance.checkOutTime || attendance.CheckOutTime
    
    if (checkIn && checkOut) {
      try {
        const checkInTime = new Date(checkIn)
        const checkOutTime = new Date(checkOut)
        const diffMs = checkOutTime - checkInTime
        
        if (diffMs > 0) {
          const hours = Math.floor(diffMs / (1000 * 60 * 60))
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
          return `${hours}:${minutes.toString().padStart(2, '0')}`
        }
      } catch (error) {
        console.error('Error calculating work hours:', error)
      }
    }
    
    return '-'
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>
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
              <h1 className="text-2xl font-bold text-gray-800">تسجيل الحضور والانصراف</h1>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              اختر الموظف
            </label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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

          {selectedEmployeeId && (
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h2 className="text-xl font-bold mb-4">تسجيل اليوم</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">وقت الحضور</div>
                  <div className="text-lg font-semibold">
                    {(todayAttendance?.checkInTime || todayAttendance?.CheckInTime)
                      ? formatTime(todayAttendance.checkInTime || todayAttendance.CheckInTime)
                      : 'لم يتم التسجيل'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">وقت الانصراف</div>
                  <div className="text-lg font-semibold">
                    {(todayAttendance?.checkOutTime || todayAttendance?.CheckOutTime)
                      ? formatTime(todayAttendance.checkOutTime || todayAttendance.CheckOutTime)
                      : 'لم يتم التسجيل'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">ساعات العمل</div>
                  <div className="text-lg font-semibold">
                    {formatHours(todayAttendance)}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleCheckIn}
                  disabled={(todayAttendance?.checkInTime || todayAttendance?.CheckInTime) != null}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  تسجيل الحضور
                </button>
                <button
                  onClick={handleCheckOut}
                  disabled={
                    !(todayAttendance?.checkInTime || todayAttendance?.CheckInTime) || 
                    (todayAttendance?.checkOutTime || todayAttendance?.CheckOutTime) != null
                  }
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  تسجيل الانصراف
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex flex-col md:flex-row gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                من تاريخ
              </label>
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, startDate: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                إلى تاريخ
              </label>
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) =>
                  setDateFilter({ ...dateFilter, endDate: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">سجل الحضور والانصراف</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وقت الحضور
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وقت الانصراف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ساعات العمل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendances.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      لا توجد سجلات
                    </td>
                  </tr>
                ) : (
                  attendances.map((attendance) => {
                    const attendanceId = attendance.Id || attendance.id
                    const attendanceDate = attendance.Date || attendance.date
                    const checkInTime = attendance.checkInTime || attendance.CheckInTime
                    const checkOutTime = attendance.checkOutTime || attendance.CheckOutTime
                    const status = attendance.status || attendance.Status
                    
                    return (
                      <tr key={attendanceId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(attendanceDate).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(checkInTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTime(checkOutTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatHours(attendance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              status === 'Present' || status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : status === 'Absent' || status === 'absent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {status === 'Present' || status === 'present'
                              ? 'حاضر'
                              : status === 'Absent' || status === 'absent'
                              ? 'غائب'
                              : status}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Attendance

