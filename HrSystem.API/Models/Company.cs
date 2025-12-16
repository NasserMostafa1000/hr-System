namespace HrSystem.API.Models;

public class Company
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string CompanyNumber { get; set; } = string.Empty;
    public DateTime LicenseExpiryDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<Employee> Employees { get; set; } = new List<Employee>();
}

