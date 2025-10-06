using AutoMapper;
using BankingSystem.application.DTOs;
using BankingSystem.Domain.Entities;

namespace BankingSystem.application.Mappings;

/// <summary>
/// AutoMapper profile for entity to DTO mappings
/// </summary>
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName));
        CreateMap<CreateUserDto, User>();
        CreateMap<UpdateUserDto, User>();

        // Account mappings
        CreateMap<Account, AccountDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FullName));
        CreateMap<CreateAccountDto, Account>();
        CreateMap<UpdateAccountDto, Account>();

        // Transaction mappings
        CreateMap<Transaction, TransactionDto>()
            .ForMember(dest => dest.AccountNumber, opt => opt.MapFrom(src => src.Account.AccountNumber))
            .ForMember(dest => dest.ToAccountNumber, opt => opt.MapFrom(src => src.ToAccount != null ? src.ToAccount.AccountNumber : null));
        CreateMap<CreateTransactionDto, Transaction>();
    }
}


