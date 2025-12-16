namespace HrSystem.API.DTOs;

public class CompanyDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string CompanyNumber { get; set; } = string.Empty;
    public DateTime LicenseExpiryDate { get; set; }
    public int EmployeeCount { get; set; }
}

public class CreateCompanyDto
{
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string CompanyNumber { get; set; } = string.Empty;
    public DateTime LicenseExpiryDate { get; set; }
}

