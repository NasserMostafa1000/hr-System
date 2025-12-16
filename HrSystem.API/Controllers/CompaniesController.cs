using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HrSystem.API.Data;
using HrSystem.API.DTOs;
using HrSystem.API.Models;

namespace HrSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompaniesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CompaniesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompanyDto>>> GetCompanies()
    {
        var companies = await _context.Companies
            .Include(c => c.Employees)
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

    [HttpGet("{id}")]
    public async Task<ActionResult<CompanyDto>> GetCompany(int id)
    {
        var company = await _context.Companies
            .Include(c => c.Employees)
            .Where(c => c.Id == id)
            .Select(c => new CompanyDto
            {
                Id = c.Id,
                Name = c.Name,
                Location = c.Location,
                CompanyNumber = c.CompanyNumber,
                LicenseExpiryDate = c.LicenseExpiryDate,
                EmployeeCount = c.Employees.Count
            })
            .FirstOrDefaultAsync();

        if (company == null)
            return NotFound();

        return Ok(company);
    }

    [HttpPost]
    public async Task<ActionResult<CompanyDto>> CreateCompany([FromBody] CreateCompanyDto createDto)
    {
        var company = new Company
        {
            Name = createDto.Name,
            Location = createDto.Location,
            CompanyNumber = createDto.CompanyNumber,
            LicenseExpiryDate = createDto.LicenseExpiryDate
        };

        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        var companyDto = new CompanyDto
        {
            Id = company.Id,
            Name = company.Name,
            Location = company.Location,
            CompanyNumber = company.CompanyNumber,
            LicenseExpiryDate = company.LicenseExpiryDate,
            EmployeeCount = 0
        };

        return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, companyDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCompany(int id, [FromBody] CreateCompanyDto updateDto)
    {
        var company = await _context.Companies.FindAsync(id);
        if (company == null)
            return NotFound();

        company.Name = updateDto.Name;
        company.Location = updateDto.Location;
        company.CompanyNumber = updateDto.CompanyNumber;
        company.LicenseExpiryDate = updateDto.LicenseExpiryDate;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCompany(int id)
    {
        var company = await _context.Companies.FindAsync(id);
        if (company == null)
            return NotFound();

        _context.Companies.Remove(company);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

