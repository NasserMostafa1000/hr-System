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
public class LeavesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LeavesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LeaveDto>>> GetLeaves(
        [FromQuery] int? employeeId,
        [FromQuery] string? status)
    {
        var query = _context.Leaves.Include(l => l.Employee).AsQueryable();

        if (employeeId.HasValue)
            query = query.Where(l => l.EmployeeId == employeeId.Value);

        if (!string.IsNullOrEmpty(status))
            query = query.Where(l => l.Status == status);

        var leaves = await query
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

    [HttpGet("{id}")]
    public async Task<ActionResult<LeaveDto>> GetLeave(int id)
    {
        var leave = await _context.Leaves
            .Include(l => l.Employee)
            .Where(l => l.Id == id)
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
            .FirstOrDefaultAsync();

        if (leave == null)
            return NotFound();

        return Ok(leave);
    }

    [HttpPost]
    public async Task<ActionResult<LeaveDto>> CreateLeave([FromBody] CreateLeaveDto dto)
    {
        var employee = await _context.Employees.FindAsync(dto.EmployeeId);
        if (employee == null)
            return NotFound(new { message = "الموظف غير موجود" });

        if (dto.EndDate < dto.StartDate)
            return BadRequest(new { message = "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية" });

        var daysCount = (dto.EndDate.Date - dto.StartDate.Date).Days + 1;

        // Check for overlapping leaves
        var overlappingLeaves = await _context.Leaves
            .Where(l => l.EmployeeId == dto.EmployeeId &&
                       l.Status != "Rejected" &&
                       ((dto.StartDate >= l.StartDate && dto.StartDate <= l.EndDate) ||
                        (dto.EndDate >= l.StartDate && dto.EndDate <= l.EndDate) ||
                        (dto.StartDate <= l.StartDate && dto.EndDate >= l.EndDate)))
            .AnyAsync();

        if (overlappingLeaves)
            return BadRequest(new { message = "يوجد إجازة متداخلة في نفس الفترة" });

        var leave = new Leave
        {
            EmployeeId = dto.EmployeeId,
            StartDate = dto.StartDate.Date,
            EndDate = dto.EndDate.Date,
            DaysCount = daysCount,
            LeaveType = dto.LeaveType,
            Status = "Pending",
            Reason = dto.Reason
        };

        _context.Leaves.Add(leave);
        await _context.SaveChangesAsync();

        var leaveDto = new LeaveDto
        {
            Id = leave.Id,
            EmployeeId = leave.EmployeeId,
            EmployeeName = employee.Name,
            StartDate = leave.StartDate,
            EndDate = leave.EndDate,
            DaysCount = leave.DaysCount,
            LeaveType = leave.LeaveType,
            Status = leave.Status,
            Reason = leave.Reason,
            CreatedAt = leave.CreatedAt
        };

        return CreatedAtAction(nameof(GetLeave), new { id = leave.Id }, leaveDto);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateLeaveStatus(int id, [FromBody] UpdateLeaveStatusDto dto)
    {
        var leave = await _context.Leaves.FindAsync(id);
        if (leave == null)
            return NotFound();

        if (dto.Status != "Approved" && dto.Status != "Rejected")
            return BadRequest(new { message = "الحالة يجب أن تكون Approved أو Rejected" });

        leave.Status = dto.Status;
        leave.ReviewedAt = DateTimeHelper.GetUaeNow();

        if (dto.Status == "Rejected")
            leave.RejectionReason = dto.RejectionReason;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLeave(int id, [FromBody] CreateLeaveDto dto)
    {
        var leave = await _context.Leaves.FindAsync(id);
        if (leave == null)
            return NotFound();

        if (leave.Status != "Pending")
            return BadRequest(new { message = "لا يمكن تعديل إجازة تم الموافقة عليها أو رفضها" });

        if (dto.EndDate < dto.StartDate)
            return BadRequest(new { message = "تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية" });

        var daysCount = (dto.EndDate.Date - dto.StartDate.Date).Days + 1;

        // Check for overlapping leaves (excluding current leave)
        var overlappingLeaves = await _context.Leaves
            .Where(l => l.EmployeeId == dto.EmployeeId &&
                       l.Id != id &&
                       l.Status != "Rejected" &&
                       ((dto.StartDate >= l.StartDate && dto.StartDate <= l.EndDate) ||
                        (dto.EndDate >= l.StartDate && dto.EndDate <= l.EndDate) ||
                        (dto.StartDate <= l.StartDate && dto.EndDate >= l.EndDate)))
            .AnyAsync();

        if (overlappingLeaves)
            return BadRequest(new { message = "يوجد إجازة متداخلة في نفس الفترة" });

        leave.StartDate = dto.StartDate.Date;
        leave.EndDate = dto.EndDate.Date;
        leave.DaysCount = daysCount;
        leave.LeaveType = dto.LeaveType;
        leave.Reason = dto.Reason;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLeave(int id)
    {
        var leave = await _context.Leaves.FindAsync(id);
        if (leave == null)
            return NotFound();

        if (leave.Status == "Approved")
            return BadRequest(new { message = "لا يمكن حذف إجازة تم الموافقة عليها" });

        _context.Leaves.Remove(leave);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

