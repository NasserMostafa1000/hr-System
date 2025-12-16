namespace HrSystem.API.Models;

public class Employee
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
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public int CompanyId { get; set; }
    public Company Company { get; set; } = null!;
    
    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
    public ICollection<Leave> Leaves { get; set; } = new List<Leave>();
}

