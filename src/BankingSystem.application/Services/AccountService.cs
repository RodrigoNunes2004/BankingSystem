using AutoMapper;
using BankingSystem.application.DTOs;
using BankingSystem.Domain.Entities;
using BankingSystem.Domain.Interfaces;

namespace BankingSystem.application.Services;

/// <summary>
/// Service implementation for Account operations
/// </summary>
public class AccountService : IAccountService
{
    private readonly IAccountRepository _accountRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public AccountService(IAccountRepository accountRepository, IUserRepository userRepository, IMapper mapper)
    {
        _accountRepository = accountRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<AccountDto?> GetByIdAsync(int id)
    {
        var account = await _accountRepository.GetByIdAsync(id);
        return account != null ? _mapper.Map<AccountDto>(account) : null;
    }

    public async Task<AccountDto?> GetByAccountNumberAsync(string accountNumber)
    {
        var account = await _accountRepository.GetByAccountNumberAsync(accountNumber);
        return account != null ? _mapper.Map<AccountDto>(account) : null;
    }

    public async Task<IEnumerable<AccountDto>> GetByUserIdAsync(int userId)
    {
        var accounts = await _accountRepository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<AccountDto>>(accounts);
    }

    public async Task<IEnumerable<AccountDto>> GetAllAsync()
    {
        var accounts = await _accountRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<AccountDto>>(accounts);
    }

    public async Task<AccountDto> CreateAsync(CreateAccountDto createAccountDto)
    {
        // Verify user exists
        if (!await _userRepository.ExistsAsync(createAccountDto.UserId))
        {
            throw new InvalidOperationException("User not found.");
        }

        var account = _mapper.Map<Account>(createAccountDto);
        account.AccountNumber = await GenerateAccountNumberAsync();
        account.Balance = 0;
        account.AvailableBalance = 0;

        var createdAccount = await _accountRepository.CreateAsync(account);
        return _mapper.Map<AccountDto>(createdAccount);
    }

    public async Task<AccountDto> UpdateAsync(int id, UpdateAccountDto updateAccountDto)
    {
        var existingAccount = await _accountRepository.GetByIdAsync(id);
        if (existingAccount == null)
        {
            throw new InvalidOperationException("Account not found.");
        }

        _mapper.Map(updateAccountDto, existingAccount);
        var updatedAccount = await _accountRepository.UpdateAsync(existingAccount);
        return _mapper.Map<AccountDto>(updatedAccount);
    }

    public async Task DeleteAsync(int id)
    {
        if (!await _accountRepository.ExistsAsync(id))
        {
            throw new InvalidOperationException("Account not found.");
        }

        await _accountRepository.DeleteAsync(id);
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _accountRepository.ExistsAsync(id);
    }

    public async Task<bool> AccountNumberExistsAsync(string accountNumber)
    {
        return await _accountRepository.AccountNumberExistsAsync(accountNumber);
    }

    public async Task<string> GenerateAccountNumberAsync()
    {
        string accountNumber;
        do
        {
            // Generate a 10-digit account number
            accountNumber = Random.Shared.NextInt64(1000000000, 9999999999).ToString();
        } while (await _accountRepository.AccountNumberExistsAsync(accountNumber));

        return accountNumber;
    }
}

