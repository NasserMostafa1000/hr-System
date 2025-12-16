using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HrSystem.API.Data;
using HrSystem.API.DTOs;
using HrSystem.API.Models;
using HrSystem.API.Services;

namespace HrSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly FileService _fileService;

    public EmployeesController(ApplicationDbContext context, FileService fileService)
    {
        _context = context;
        _fileService = fileService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployees()
    {
        var employees = await _context.Employees
            .Include(e => e.Company)
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

    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeDto>> GetEmployee(int id)
    {
        var employee = await _context.Employees
            .Include(e => e.Company)
            .Where(e => e.Id == id)
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
            .FirstOrDefaultAsync();

        if (employee == null)
            return NotFound();

        return Ok(employee);
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> CreateEmployee([FromForm] CreateEmployeeDto createDto,
        IFormFile? personalPhoto, IFormFile? passportPhoto, IFormFile? idPhoto)
    {
        var company = await _context.Companies.FindAsync(createDto.CompanyId);
        if (company == null)
            return BadRequest(new { message = "الشركة غير موجودة" });

        var employee = new Employee
        {
            Name = createDto.Name,
            JobTitle = createDto.JobTitle,
            MonthlySalary = createDto.MonthlySalary,
            PassportNumber = createDto.PassportNumber,
            PassportExpiryDate = createDto.PassportExpiryDate,
            IdExpiryDate = createDto.IdExpiryDate,
            CompanyId = createDto.CompanyId
        };

        if (personalPhoto != null)
            employee.PersonalPhotoPath = await _fileService.SaveFileAsync(personalPhoto, "personal");

        if (passportPhoto != null)
            employee.PassportPhotoPath = await _fileService.SaveFileAsync(passportPhoto, "passport");

        if (idPhoto != null)
            employee.IdPhotoPath = await _fileService.SaveFileAsync(idPhoto, "id");

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        var employeeDto = new EmployeeDto
        {
            Id = employee.Id,
            Name = employee.Name,
            JobTitle = employee.JobTitle,
            MonthlySalary = employee.MonthlySalary,
            PassportNumber = employee.PassportNumber,
            PassportExpiryDate = employee.PassportExpiryDate,
            PassportPhotoPath = employee.PassportPhotoPath,
            PersonalPhotoPath = employee.PersonalPhotoPath,
            IdExpiryDate = employee.IdExpiryDate,
            IdPhotoPath = employee.IdPhotoPath,
            CompanyId = employee.CompanyId,
            CompanyName = company.Name
        };

        return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employeeDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, [FromForm] CreateEmployeeDto updateDto,
        IFormFile? personalPhoto, IFormFile? passportPhoto, IFormFile? idPhoto)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
            return NotFound();

        employee.Name = updateDto.Name;
        employee.JobTitle = updateDto.JobTitle;
        employee.MonthlySalary = updateDto.MonthlySalary;
        employee.PassportNumber = updateDto.PassportNumber;
        employee.PassportExpiryDate = updateDto.PassportExpiryDate;
        employee.IdExpiryDate = updateDto.IdExpiryDate;
        employee.CompanyId = updateDto.CompanyId;

        if (personalPhoto != null)
        {
            _fileService.DeleteFile(employee.PersonalPhotoPath);
            employee.PersonalPhotoPath = await _fileService.SaveFileAsync(personalPhoto, "personal");
        }

        if (passportPhoto != null)
        {
            _fileService.DeleteFile(employee.PassportPhotoPath);
            employee.PassportPhotoPath = await _fileService.SaveFileAsync(passportPhoto, "passport");
        }

        if (idPhoto != null)
        {
            _fileService.DeleteFile(employee.IdPhotoPath);
            employee.IdPhotoPath = await _fileService.SaveFileAsync(idPhoto, "id");
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        var employee = await _context.Employees.FindAsync(id);
        if (employee == null)
            return NotFound();

        _fileService.DeleteFile(employee.PersonalPhotoPath);
        _fileService.DeleteFile(employee.PassportPhotoPath);
        _fileService.DeleteFile(employee.IdPhotoPath);

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

