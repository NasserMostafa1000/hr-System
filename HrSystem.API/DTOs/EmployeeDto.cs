namespace HrSystem.API.DTOs;

public class EmployeeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public decimal MonthlySalary { get; set; }
    public string PassportNumber { get; set; } = string.Empty;
    public DateTime PassportExpiryDate { get; set; }
    public string PassportPhotoPath { get; set; } = string.Empty;
    public string PersonalPhotoPath { get; set; } = string.Empty;
    public DateTime IdExpiryDate { get; set; }
    public string IdPhotoPath { get; set; } = string.Empty;
    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
}

public class CreateEmployeeDto
{
    public string Name { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public decimal MonthlySalary { get; set; }
    public string PassportNumber { get; set; } = string.Empty;
    public DateTime PassportExpiryDate { get; set; }
    public DateTime IdExpiryDate { get; set; }
    public int CompanyId { get; set; }
}

