using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HrSystem.API.Data;
using HrSystem.API.DTOs;
using HrSystem.API.Helpers;

namespace HrSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StatisticsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private const int ExpiringDaysThreshold = 30;

    public StatisticsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<StatisticsDto>> GetStatistics()
    {
        var today = DateTimeHelper.GetUaeDate();
        var expiringDate = today.AddDays(ExpiringDaysThreshold);

        var totalCompanies = await _context.Companies.CountAsync();
        var totalEmployees = await _context.Employees.CountAsync();

        var employeesWithExpiringPassports = await _context.Employees
            .Where(e => e.PassportExpiryDate <= expiringDate && e.PassportExpiryDate >= today)
            .CountAsync();

        var employeesWithExpiringIds = await _context.Employees
            .Where(e => e.IdExpiryDate <= expiringDate && e.IdExpiryDate >= today)
            .CountAsync();

        // Companies with licenses expiring within threshold (convert to UTC for comparison)
        var companiesWithExpiringLicenses = await _context.Companies
            .Where(c => c.LicenseExpiryDate.Date <= expiringDate && c.LicenseExpiryDate.Date >= today)
            .CountAsync();

        // Attendance statistics
        var todayAttendances = await _context.Attendances
            .Where(a => a.Date == today)
            .ToListAsync();

        var todayPresentEmployees = todayAttendances
            .Count(a => a.CheckInTime.HasValue);

        var todayAbsentEmployees = totalEmployees - todayPresentEmployees;

        // Leave statistics
        var pendingLeaves = await _context.Leaves
            .Where(l => l.Status == "Pending")
            .CountAsync();

        var approvedLeaves = await _context.Leaves
            .Where(l => l.Status == "Approved" && 
                       l.StartDate <= today && 
                       l.EndDate >= today)
            .CountAsync();

        var companyEmployeeCounts = await _context.Companies
            .Include(c => c.Employees)
            .Select(c => new CompanyEmployeeCountDto
            {
                CompanyId = c.Id,
                CompanyName = c.Name,
                EmployeeCount = c.Employees.Count
            })
            .ToListAsync();

        var statistics = new StatisticsDto
        {
            TotalCompanies = totalCompanies,
            TotalEmployees = totalEmployees,
            EmployeesWithExpiringPassports = employeesWithExpiringPassports,
            EmployeesWithExpiringIds = employeesWithExpiringIds,
            CompaniesWithExpiringLicenses = companiesWithExpiringLicenses,
            TodayPresentEmployees = todayPresentEmployees,
            TodayAbsentEmployees = todayAbsentEmployees,
            PendingLeaves = pendingLeaves,
            ApprovedLeaves = approvedLeaves,
            CompanyEmployeeCounts = companyEmployeeCounts
        };

        return Ok(statistics);
    }

    [HttpGet("company/{companyId}")]
    public async Task<ActionResult<CompanyStatisticsDto>> GetCompanyStatistics(int companyId)
    {
        var company = await _context.Companies
            .Include(c => c.Employees)
            .FirstOrDefaultAsync(c => c.Id == companyId);

        if (company == null)
            return NotFound();

        var today = DateTimeHelper.GetUaeDate();
        var expiringDate = today.AddDays(ExpiringDaysThreshold);

        var employeesWithExpiringPassports = company.Employees
            .Count(e => e.PassportExpiryDate <= expiringDate && e.PassportExpiryDate >= today);

        var employeesWithExpiringIds = company.Employees
            .Count(e => e.IdExpiryDate <= expiringDate && e.IdExpiryDate >= today);

        var isLicenseExpiringSoon = company.LicenseExpiryDate <= expiringDate && 
                                     company.LicenseExpiryDate >= today;

        var statistics = new CompanyStatisticsDto
        {
            CompanyId = company.Id,
            CompanyName = company.Name,
            TotalEmployees = company.Employees.Count,
            EmployeesWithExpiringPassports = employeesWithExpiringPassports,
            EmployeesWithExpiringIds = employeesWithExpiringIds,
            LicenseExpiryDate = company.LicenseExpiryDate,
            IsLicenseExpiringSoon = isLicenseExpiringSoon
        };

        return Ok(statistics);
    }

    [HttpGet("employees/expiring-passports")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployeesWithExpiringPassports()
    {
        var today = DateTimeHelper.GetUaeDate();
        var expiringDate = today.AddDays(ExpiringDaysThreshold);

        var employees = await _context.Employees
            .Include(e => e.Company)
            .Where(e => e.PassportExpiryDate <= expiringDate && e.PassportExpiryDate >= today)
            .OrderBy(e => e.PassportExpiryDate)
            .Select(e => new EmployeeDto
            {
                Id = e.Id,
                Name = e.Name,
                JobTitle = e.JobTitle,
                MonthlySalary = e.MonthlySalary,
                PassportNumber = e.PassportNumber,
                PassportExpiryDate = e.PassportExpiryDate,
                PassportPhotoPath = e.PassportPhotoPath,
                PersonalPhotoPath = e.PersonalPhotoPath,
                IdExpiryDate = e.IdExpiryDate,
                IdPhotoPath = e.IdPhotoPath,
                CompanyId = e.CompanyId,
                CompanyName = e.Company.Name
            })
            .ToListAsync();

        return Ok(employees);
    }

    [HttpGet("employees/expiring-ids")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployeesWithExpiringIds()
    {
        var today = DateTimeHelper.GetUaeDate();
        var expiringDate = today.AddDays(ExpiringDaysThreshold);

        var employees = await _context.Employees
            .Include(e => e.Company)
            .Where(e => e.IdExpiryDate <= expiringDate && e.IdExpiryDate >= today)
            .OrderBy(e => e.IdExpiryDate)
            .Select(e => new EmployeeDto
            {
                Id = e.Id,
                Name = e.Name,
                JobTitle = e.JobTitle,
                MonthlySalary = e.MonthlySalary,
                PassportNumber = e.PassportNumber,
                PassportExpiryDate = e.PassportExpiryDate,
                PassportPhotoPath = e.PassportPhotoPath,
                PersonalPhotoPath = e.PersonalPhotoPath,
                IdExpiryDate = e.IdExpiryDate,
                IdPhotoPath = e.IdPhotoPath,
                CompanyId = e.CompanyId,
                CompanyName = e.Company.Name
            })
            .ToListAsync();

        return Ok(employees);
    }

    [HttpGet("companies/expiring-licenses")]
    public async Task<ActionResult<IEnumerable<CompanyDto>>> GetCompaniesWithExpiringLicenses()
    {
        var today = DateTimeHelper.GetUaeDate();
        var expiringDate = today.AddDays(ExpiringDaysThreshold);

        var companies = await _context.Companies
            .Include(c => c.Employees)
            .Where(c => c.LicenseExpiryDate.Date <= expiringDate && c.LicenseExpiryDate.Date >= today)
            .OrderBy(c => c.LicenseExpiryDate)
            .Select(c => new CompanyDto
            {
                Id = c.Id,
                Name = c.Name,
                Location = c.Location,
                CompanyNumber = c.CompanyNumber,
                LicenseExpiryDate = c.LicenseExpiryDate,
                EmployeeCount = c.Employees.Count
            })
            .ToListAsync();

        return Ok(companies);
    }

    [HttpGet("attendance/today-present")]
    public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetTodayPresentEmployees()
    {
        var today = DateTimeHelper.GetUaeDate();

        var attendances = await _context.Attendances
            .Include(a => a.Employee)
            .Where(a => a.Date == today && a.CheckInTime.HasValue)
            .OrderBy(a => a.CheckInTime)
            .Select(a => new AttendanceDto
            {
                Id = a.Id,
                EmployeeId = a.EmployeeId,
                EmployeeName = a.Employee.Name,
                Date = a.Date,
                CheckInTime = a.CheckInTime,
                CheckOutTime = a.CheckOutTime,
                WorkHours = a.WorkHours,
                WorkHoursString = a.WorkHours.HasValue 
                    ? $"{(int)a.WorkHours.Value.TotalHours}:{a.WorkHours.Value.Minutes:D2}:{a.WorkHours.Value.Seconds:D2}"
                    : null,
                Status = a.Status,
                Notes = a.Notes
            })
            .ToListAsync();

        return Ok(attendances);
    }

    [HttpGet("attendance/today-absent")]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetTodayAbsentEmployees()
    {
        var today = DateTimeHelper.GetUaeDate();

        var presentEmployeeIds = await _context.Attendances
            .Where(a => a.Date == today && a.CheckInTime.HasValue)
            .Select(a => a.EmployeeId)
            .ToListAsync();

        var absentEmployees = await _context.Employees
            .Include(e => e.Company)
            .Where(e => !presentEmployeeIds.Contains(e.Id))
            .Select(e => new EmployeeDto
            {
                Id = e.Id,
                Name = e.Name,
                JobTitle = e.JobTitle,
                MonthlySalary = e.MonthlySalary,
                PassportNumber = e.PassportNumber,
                PassportExpiryDate = e.PassportExpiryDate,
                PassportPhotoPath = e.PassportPhotoPath,
                PersonalPhotoPath = e.PersonalPhotoPath,
                IdExpiryDate = e.IdExpiryDate,
                IdPhotoPath = e.IdPhotoPath,
                CompanyId = e.CompanyId,
                CompanyName = e.Company.Name
            })
            .ToListAsync();

        return Ok(absentEmployees);
    }

    [HttpGet("leaves/pending")]
    public async Task<ActionResult<IEnumerable<LeaveDto>>> GetPendingLeaves()
    {
        var leaves = await _context.Leaves
            .Include(l => l.Employee)
            .Where(l => l.Status == "Pending")
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new LeaveDto
            {
                Id = l.Id,
                EmployeeId = l.EmployeeId,
                EmployeeName = l.Employee.Name,
                StartDate = l.StartDate,
                EndDate = l.EndDate,
                DaysCount = l.DaysCount,
                LeaveType = l.LeaveType,
                Status = l.Status,
                Reason = l.Reason,
                RejectionReason = l.RejectionReason,
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();

        return Ok(leaves);
    }

    [HttpGet("leaves/approved-today")]
    public async Task<ActionResult<IEnumerable<LeaveDto>>> GetApprovedLeavesToday()
    {
        var today = DateTimeHelper.GetUaeDate();

        var leaves = await _context.Leaves
            .Include(l => l.Employee)
            .Where(l => l.Status == "Approved" && 
                       l.StartDate <= today && 
                       l.EndDate >= today)
            .OrderBy(l => l.StartDate)
            .Select(l => new LeaveDto
            {
                Id = l.Id,
                EmployeeId = l.EmployeeId,
                EmployeeName = l.Employee.Name,
                StartDate = l.StartDate,
                EndDate = l.EndDate,
                DaysCount = l.DaysCount,
                LeaveType = l.LeaveType,
                Status = l.Status,
                Reason = l.Reason,
                RejectionReason = l.RejectionReason,
                CreatedAt = l.CreatedAt
            })
            .ToListAsync();

        return Ok(leaves);
    }
}

