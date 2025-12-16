namespace HrSystem.API.DTOs;

public class StatisticsDto
{
    public int TotalCompanies { get; set; }
    public int TotalEmployees { get; set; }
    public int EmployeesWithExpiringPassports { get; set; }
    public int EmployeesWithExpiringIds { get; set; }
    public int CompaniesWithExpiringLicenses { get; set; }
    public int TodayPresentEmployees { get; set; }
    public int TodayAbsentEmployees { get; set; }
    public int PendingLeaves { get; set; }
    public int ApprovedLeaves { get; set; }
    public List<CompanyEmployeeCountDto> CompanyEmployeeCounts { get; set; } = new();
}

public class CompanyEmployeeCountDto
{
    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public int EmployeeCount { get; set; }
}

public class CompanyStatisticsDto
{
    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public int TotalEmployees { get; set; }
    public int EmployeesWithExpiringPassports { get; set; }
    public int EmployeesWithExpiringIds { get; set; }
    public DateTime LicenseExpiryDate { get; set; }
    public bool IsLicenseExpiringSoon { get; set; }
}

