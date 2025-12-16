import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

function AddEmployeeModal({ onClose, onSuccess, companies: propCompanies }) {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    monthlySalary: '',
    passportNumber: '',
    passportExpiryDate: '',
    idExpiryDate: '',
    companyId: '',
  })
  const [personalPhoto, setPersonalPhoto] = useState(null)
  const [passportPhoto, setPassportPhoto] = useState(null)
  const [idPhoto, setIdPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [companies, setCompanies] = useState(propCompanies || [])

  useEffect(() => {
    // Always fetch companies to ensure we have the latest data
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/companies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('Companies fetched:', response.data)
      if (response.data && Array.isArray(response.data)) {
        setCompanies(response.data)
      } else {
        console.error('Invalid companies data:', response.data)
        setCompanies([])
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      setError('فشل في جلب قائمة الشركات: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('jobTitle', formData.jobTitle)
      formDataToSend.append('monthlySalary', formData.monthlySalary)
      formDataToSend.append('passportNumber', formData.passportNumber)
      formDataToSend.append(
        'passportExpiryDate',
        new Date(formData.passportExpiryDate).toISOString()
      )
      formDataToSend.append(
        'idExpiryDate',
        new Date(formData.idExpiryDate).toISOString()
      )
      formDataToSend.append('companyId', formData.companyId)

      if (personalPhoto) {
        formDataToSend.append('personalPhoto', personalPhoto)
      }
      if (passportPhoto) {
        formDataToSend.append('passportPhoto', passportPhoto)
      }
      if (idPhoto) {
        formDataToSend.append('idPhoto', idPhoto)
      }

      const token = localStorage.getItem('token')
      await axios.post(`${API_BASE_URL}/employees`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إضافة الموظف')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">إضافة موظف جديد</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              الشركة *
            </label>
            <select
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر الشركة</option>
              {companies && companies.length > 0 ? (
                companies.map((company) => (
                  <option key={company.Id || company.id} value={company.Id || company.id}>
                    {company.Name || company.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>لا توجد شركات متاحة</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              اسم الموظف *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              الوظيفة *
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              الراتب الشهري *
            </label>
            <input
              type="number"
              name="monthlySalary"
              value={formData.monthlySalary}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              رقم جواز السفر *
            </label>
            <input
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              تاريخ انتهاء جواز السفر *
            </label>
            <input
              type="date"
              name="passportExpiryDate"
              value={formData.passportExpiryDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              تاريخ انتهاء الهوية *
            </label>
            <input
              type="date"
              name="idExpiryDate"
              value={formData.idExpiryDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              الصورة الشخصية
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setPersonalPhoto)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              صورة جواز السفر
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setPassportPhoto)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              صورة الهوية
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setIdPhoto)}
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

export default AddEmployeeModal

