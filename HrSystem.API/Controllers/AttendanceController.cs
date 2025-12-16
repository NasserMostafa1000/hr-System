using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HrSystem.API.Data;
using HrSystem.API.DTOs;
using HrSystem.API.Models;
using HrSystem.API.Helpers;

namespace HrSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AttendanceController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetAttendances(
        [FromQuery] int? employeeId,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var query = _context.Attendances.Include(a => a.Employee).AsQueryable();

        if (employeeId.HasValue)
            query = query.Where(a => a.EmployeeId == employeeId.Value);

        if (startDate.HasValue)
            query = query.Where(a => a.Date >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(a => a.Date <= endDate.Value);

        var attendances = await query
            .OrderByDescending(a => a.Date)
            .ThenByDescending(a => a.CheckInTime)
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

    [HttpGet("employee/{employeeId}")]
    public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetEmployeeAttendances(
        int employeeId,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var query = _context.Attendances
            .Include(a => a.Employee)
            .Where(a => a.EmployeeId == employeeId);

        if (startDate.HasValue)
            query = query.Where(a => a.Date >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(a => a.Date <= endDate.Value);

        var attendances = await query
            .OrderByDescending(a => a.Date)
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

    [HttpPost("checkin")]
    public async Task<ActionResult<AttendanceDto>> CheckIn([FromBody] CheckInOutDto dto)
    {
        var today = DateTimeHelper.GetUaeDate();
        var employee = await _context.Employees.FindAsync(dto.EmployeeId);
        if (employee == null)
            return NotFound(new { message = "الموظف غير موجود" });

        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.EmployeeId == dto.EmployeeId && a.Date == today);

        if (attendance != null && attendance.CheckInTime.HasValue)
        {
            return BadRequest(new { message = "تم تسجيل الحضور بالفعل اليوم" });
        }

        var now = DateTimeHelper.GetUaeNow();

        if (attendance == null)
        {
            attendance = new Attendance
            {
                EmployeeId = dto.EmployeeId,
                Date = today,
                CheckInTime = now,
                Status = "Present"
            };
            _context.Attendances.Add(attendance);
        }
        else
        {
            attendance.CheckInTime = now;
            attendance.Status = "Present";
        }

        await _context.SaveChangesAsync();

        var attendanceDto = new AttendanceDto
        {
            Id = attendance.Id,
            EmployeeId = attendance.EmployeeId,
            EmployeeName = employee.Name,
            Date = attendance.Date,
            CheckInTime = attendance.CheckInTime,
            CheckOutTime = attendance.CheckOutTime,
            WorkHours = attendance.WorkHours,
            WorkHoursString = attendance.WorkHours.HasValue 
                ? $"{(int)attendance.WorkHours.Value.TotalHours}:{attendance.WorkHours.Value.Minutes:D2}:{attendance.WorkHours.Value.Seconds:D2}"
                : null,
            Status = attendance.Status
        };

        return Ok(attendanceDto);
    }

    [HttpPost("checkout")]
    public async Task<ActionResult<AttendanceDto>> CheckOut([FromBody] CheckInOutDto dto)
    {
        var today = DateTimeHelper.GetUaeDate();
        var employee = await _context.Employees.FindAsync(dto.EmployeeId);
        if (employee == null)
            return NotFound(new { message = "الموظف غير موجود" });

        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.EmployeeId == dto.EmployeeId && a.Date == today);

        if (attendance == null || !attendance.CheckInTime.HasValue)
        {
            return BadRequest(new { message = "يجب تسجيل الحضور أولاً" });
        }

        if (attendance.CheckOutTime.HasValue)
        {
            return BadRequest(new { message = "تم تسجيل الانصراف بالفعل اليوم" });
        }

        var now = DateTimeHelper.GetUaeNow();
        attendance.CheckOutTime = now;
        
        // Calculate work hours accurately
        if (attendance.CheckInTime.HasValue)
        {
            attendance.WorkHours = now - attendance.CheckInTime.Value;
        }

        await _context.SaveChangesAsync();

        var attendanceDto = new AttendanceDto
        {
            Id = attendance.Id,
            EmployeeId = attendance.EmployeeId,
            EmployeeName = employee.Name,
            Date = attendance.Date,
            CheckInTime = attendance.CheckInTime,
            CheckOutTime = attendance.CheckOutTime,
            WorkHours = attendance.WorkHours,
            WorkHoursString = attendance.WorkHours.HasValue 
                ? $"{(int)attendance.WorkHours.Value.TotalHours}:{attendance.WorkHours.Value.Minutes:D2}:{attendance.WorkHours.Value.Seconds:D2}"
                : null,
            Status = attendance.Status
        };

        return Ok(attendanceDto);
    }

    [HttpPost]
    public async Task<ActionResult<AttendanceDto>> CreateAttendance([FromBody] CreateAttendanceDto dto)
    {
        var employee = await _context.Employees.FindAsync(dto.EmployeeId);
        if (employee == null)
            return NotFound(new { message = "الموظف غير موجود" });

        var date = dto.Date.Date;
        var existing = await _context.Attendances
            .FirstOrDefaultAsync(a => a.EmployeeId == dto.EmployeeId && a.Date == date);

        if (existing != null)
            return BadRequest(new { message = "تم تسجيل الحضور لهذا اليوم بالفعل" });

        var attendance = new Attendance
        {
            EmployeeId = dto.EmployeeId,
            Date = date,
            CheckInTime = dto.CheckInTime,
            CheckOutTime = dto.CheckOutTime,
            Status = dto.CheckInTime.HasValue ? "Present" : "Absent",
            Notes = dto.Notes
        };

        if (attendance.CheckInTime.HasValue && attendance.CheckOutTime.HasValue)
        {
            attendance.WorkHours = attendance.CheckOutTime.Value - attendance.CheckInTime.Value;
        }

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();

        var attendanceDto = new AttendanceDto
        {
            Id = attendance.Id,
            EmployeeId = attendance.EmployeeId,
            EmployeeName = employee.Name,
            Date = attendance.Date,
            CheckInTime = attendance.CheckInTime,
            CheckOutTime = attendance.CheckOutTime,
            WorkHours = attendance.WorkHours,
            WorkHoursString = attendance.WorkHours.HasValue 
                ? $"{(int)attendance.WorkHours.Value.TotalHours}:{attendance.WorkHours.Value.Minutes:D2}:{attendance.WorkHours.Value.Seconds:D2}"
                : null,
            Status = attendance.Status,
            Notes = attendance.Notes
        };

        return CreatedAtAction(nameof(GetAttendances), new { id = attendance.Id }, attendanceDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAttendance(int id, [FromBody] CreateAttendanceDto dto)
    {
        var attendance = await _context.Attendances.FindAsync(id);
        if (attendance == null)
            return NotFound();

        attendance.CheckInTime = dto.CheckInTime;
        attendance.CheckOutTime = dto.CheckOutTime;
        attendance.Notes = dto.Notes;
        attendance.Status = dto.CheckInTime.HasValue ? "Present" : "Absent";

        if (attendance.CheckInTime.HasValue && attendance.CheckOutTime.HasValue)
        {
            attendance.WorkHours = attendance.CheckOutTime.Value - attendance.CheckInTime.Value;
        }
        else
        {
            attendance.WorkHours = null;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAttendance(int id)
    {
        var attendance = await _context.Attendances.FindAsync(id);
        if (attendance == null)
            return NotFound();

        _context.Attendances.Remove(attendance);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

