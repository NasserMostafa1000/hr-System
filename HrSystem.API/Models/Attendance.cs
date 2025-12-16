namespace HrSystem.API.Models;

public class Attendance
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public DateTime Date { get; set; }
    public DateTime? CheckInTime { get; set; }
    public DateTime? CheckOutTime { get; set; }
    public TimeSpan? WorkHours { get; set; }
    public string Status { get; set; } = "Present"; // Present, Absent, Late, OnLeave
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Employee Employee { get; set; } = null!;
}

