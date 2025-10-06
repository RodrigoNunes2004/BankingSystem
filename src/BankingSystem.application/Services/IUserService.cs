using BankingSystem.application.DTOs;

namespace BankingSystem.application.Services;

/// <summary>
/// Service interface for User operations
/// </summary>
public interface IUserService
{
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto?> GetByEmailAsync(string email);
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto> CreateAsync(CreateUserDto createUserDto);
    Task<UserDto> UpdateAsync(int id, UpdateUserDto updateUserDto);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task<bool> EmailExistsAsync(string email);
}


