using AutoMapper;
using BankingSystem.application.DTOs;
using BankingSystem.Domain.Entities;
using BankingSystem.Domain.Interfaces;

namespace BankingSystem.application.Services;

/// <summary>
/// Service implementation for User operations
/// </summary>
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user != null ? _mapper.Map<UserDto>(user) : null;
    }

    public async Task<UserDto?> GetByEmailAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        return user != null ? _mapper.Map<UserDto>(user) : null;
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<UserDto>>(users);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto createUserDto)
    {
        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(createUserDto.Email))
        {
            throw new InvalidOperationException("A user with this email already exists.");
        }

        var user = _mapper.Map<User>(createUserDto);
        var createdUser = await _userRepository.CreateAsync(user);
        return _mapper.Map<UserDto>(createdUser);
    }

    public async Task<UserDto> UpdateAsync(int id, UpdateUserDto updateUserDto)
    {
        var existingUser = await _userRepository.GetByIdAsync(id);
        if (existingUser == null)
        {
            throw new InvalidOperationException("User not found.");
        }

        _mapper.Map(updateUserDto, existingUser);
        var updatedUser = await _userRepository.UpdateAsync(existingUser);
        return _mapper.Map<UserDto>(updatedUser);
    }

    public async Task DeleteAsync(int id)
    {
        if (!await _userRepository.ExistsAsync(id))
        {
            throw new InvalidOperationException("User not found.");
        }

        await _userRepository.DeleteAsync(id);
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _userRepository.ExistsAsync(id);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _userRepository.EmailExistsAsync(email);
    }
}


