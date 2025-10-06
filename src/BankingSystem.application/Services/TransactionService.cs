using AutoMapper;
using BankingSystem.application.DTOs;
using BankingSystem.Domain.Entities;
using BankingSystem.Domain.Interfaces;

namespace BankingSystem.application.Services;

/// <summary>
/// Service implementation for Transaction operations
/// </summary>
public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IAccountRepository _accountRepository;
    private readonly IMapper _mapper;

    public TransactionService(ITransactionRepository transactionRepository, IAccountRepository accountRepository, IMapper mapper)
    {
        _transactionRepository = transactionRepository;
        _accountRepository = accountRepository;
        _mapper = mapper;
    }

    public async Task<TransactionDto?> GetByIdAsync(int id)
    {
        var transaction = await _transactionRepository.GetByIdAsync(id);
        return transaction != null ? _mapper.Map<TransactionDto>(transaction) : null;
    }

    public async Task<IEnumerable<TransactionDto>> GetByAccountIdAsync(int accountId)
    {
        var transactions = await _transactionRepository.GetByAccountIdAsync(accountId);
        return _mapper.Map<IEnumerable<TransactionDto>>(transactions);
    }

    public async Task<IEnumerable<TransactionDto>> GetByUserIdAsync(int userId)
    {
        var transactions = await _transactionRepository.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<TransactionDto>>(transactions);
    }

    public async Task<IEnumerable<TransactionDto>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
    {
        var transactions = await _transactionRepository.GetByDateRangeAsync(startDate, endDate);
        return _mapper.Map<IEnumerable<TransactionDto>>(transactions);
    }

    public async Task<TransactionDto> CreateAsync(CreateTransactionDto createTransactionDto)
    {
        var transaction = _mapper.Map<Transaction>(createTransactionDto);
        transaction.ReferenceNumber = GenerateReferenceNumber();
        transaction.Status = "Pending";
        transaction.TransactionDate = DateTime.UtcNow;

        var createdTransaction = await _transactionRepository.CreateAsync(transaction);
        return _mapper.Map<TransactionDto>(createdTransaction);
    }

    public async Task<TransactionDto> ProcessDepositAsync(int accountId, decimal amount, string description)
    {
        var account = await _accountRepository.GetByIdAsync(accountId);
        if (account == null)
        {
            throw new InvalidOperationException("Account not found.");
        }

        if (account.IsLocked)
        {
            throw new InvalidOperationException("Account is locked.");
        }

        if (amount <= 0)
        {
            throw new InvalidOperationException("Amount must be greater than zero.");
        }

        // Create transaction
        var transaction = new Transaction
        {
            TransactionType = "Deposit",
            Amount = amount,
            AccountId = accountId,
            Description = description,
            Status = "Completed",
            ReferenceNumber = GenerateReferenceNumber(),
            TransactionDate = DateTime.UtcNow,
            Category = "Deposit"
        };

        // Update account balance
        account.Balance += amount;
        account.AvailableBalance += amount;
        account.LastTransactionDate = DateTime.UtcNow;

        await _accountRepository.UpdateAsync(account);
        var createdTransaction = await _transactionRepository.CreateAsync(transaction);

        return _mapper.Map<TransactionDto>(createdTransaction);
    }

    public async Task<TransactionDto> ProcessWithdrawalAsync(int accountId, decimal amount, string description)
    {
        var account = await _accountRepository.GetByIdAsync(accountId);
        if (account == null)
        {
            throw new InvalidOperationException("Account not found.");
        }

        if (account.IsLocked)
        {
            throw new InvalidOperationException("Account is locked.");
        }

        if (amount <= 0)
        {
            throw new InvalidOperationException("Amount must be greater than zero.");
        }

        if (account.AvailableBalance < amount)
        {
            throw new InvalidOperationException("Insufficient funds.");
        }

        // Create transaction
        var transaction = new Transaction
        {
            TransactionType = "Withdrawal",
            Amount = amount,
            AccountId = accountId,
            Description = description,
            Status = "Completed",
            ReferenceNumber = GenerateReferenceNumber(),
            TransactionDate = DateTime.UtcNow,
            Category = "Withdrawal"
        };

        // Update account balance
        account.Balance -= amount;
        account.AvailableBalance -= amount;
        account.LastTransactionDate = DateTime.UtcNow;

        await _accountRepository.UpdateAsync(account);
        var createdTransaction = await _transactionRepository.CreateAsync(transaction);

        return _mapper.Map<TransactionDto>(createdTransaction);
    }

    public async Task<TransactionDto> ProcessTransferAsync(TransferDto transferDto)
    {
        var fromAccount = await _accountRepository.GetByIdAsync(transferDto.FromAccountId);
        var toAccount = await _accountRepository.GetByIdAsync(transferDto.ToAccountId);

        if (fromAccount == null)
        {
            throw new InvalidOperationException("Source account not found.");
        }

        if (toAccount == null)
        {
            throw new InvalidOperationException("Destination account not found.");
        }

        if (fromAccount.IsLocked || toAccount.IsLocked)
        {
            throw new InvalidOperationException("One or both accounts are locked.");
        }

        if (transferDto.Amount <= 0)
        {
            throw new InvalidOperationException("Amount must be greater than zero.");
        }

        if (fromAccount.AvailableBalance < transferDto.Amount)
        {
            throw new InvalidOperationException("Insufficient funds.");
        }

        // Create outgoing transaction
        var outgoingTransaction = new Transaction
        {
            TransactionType = "Transfer",
            Amount = transferDto.Amount,
            AccountId = transferDto.FromAccountId,
            ToAccountId = transferDto.ToAccountId,
            Description = $"Transfer to {toAccount.AccountNumber}: {transferDto.Description}",
            Status = "Completed",
            ReferenceNumber = GenerateReferenceNumber(),
            TransactionDate = DateTime.UtcNow,
            Category = transferDto.Category
        };

        // Create incoming transaction
        var incomingTransaction = new Transaction
        {
            TransactionType = "Transfer",
            Amount = transferDto.Amount,
            AccountId = transferDto.ToAccountId,
            ToAccountId = transferDto.FromAccountId,
            Description = $"Transfer from {fromAccount.AccountNumber}: {transferDto.Description}",
            Status = "Completed",
            ReferenceNumber = outgoingTransaction.ReferenceNumber,
            TransactionDate = DateTime.UtcNow,
            Category = transferDto.Category
        };

        // Update account balances
        fromAccount.Balance -= transferDto.Amount;
        fromAccount.AvailableBalance -= transferDto.Amount;
        fromAccount.LastTransactionDate = DateTime.UtcNow;

        toAccount.Balance += transferDto.Amount;
        toAccount.AvailableBalance += transferDto.Amount;
        toAccount.LastTransactionDate = DateTime.UtcNow;

        await _accountRepository.UpdateAsync(fromAccount);
        await _accountRepository.UpdateAsync(toAccount);
        await _transactionRepository.CreateAsync(outgoingTransaction);
        var createdIncomingTransaction = await _transactionRepository.CreateAsync(incomingTransaction);

        return _mapper.Map<TransactionDto>(createdIncomingTransaction);
    }

    public async Task<TransactionDto> UpdateAsync(int id, CreateTransactionDto updateTransactionDto)
    {
        var existingTransaction = await _transactionRepository.GetByIdAsync(id);
        if (existingTransaction == null)
        {
            throw new InvalidOperationException("Transaction not found.");
        }

        _mapper.Map(updateTransactionDto, existingTransaction);
        var updatedTransaction = await _transactionRepository.UpdateAsync(existingTransaction);
        return _mapper.Map<TransactionDto>(updatedTransaction);
    }

    public async Task DeleteAsync(int id)
    {
        if (!await _transactionRepository.ExistsAsync(id))
        {
            throw new InvalidOperationException("Transaction not found.");
        }

        await _transactionRepository.DeleteAsync(id);
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _transactionRepository.ExistsAsync(id);
    }

    private string GenerateReferenceNumber()
    {
        return $"TXN{DateTime.UtcNow:yyyyMMddHHmmss}{Random.Shared.NextInt64(1000, 9999)}";
    }
}


