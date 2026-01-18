using Microsoft.EntityFrameworkCore;
using ShiftGiving.Data;
using ShiftGiving.DTOs;
using ShiftGiving.Models;

namespace ShiftGiving.Services;

public class DonationService
{
    private readonly ShiftGivingDbContext _db;

    public DonationService(ShiftGivingDbContext db)
    {
        _db = db;
    }

    public async Task<DonationResponse> CreateDonation(Guid userId, CreateDonationRequest request)
    {
        var donation = BuildDonationFromRequest(userId, request);
        _db.Donations.Add(donation);
        await _db.SaveChangesAsync();
        return await FetchDonationWithDetails(donation.Id);
    }

    public async Task<DonationResponse?> GetDonationById(Guid id)
    {
        return await FetchDonationWithDetails(id);
    }

    public async Task<(List<DonationResponse> donations, int totalCount)> GetDonationsByUser(Guid userId, int page, int pageSize)
    {
        var query = BuildUserDonationsQuery(userId);
        var totalCount = await query.CountAsync();
        var donations = await ExecuteDonationQuery(query, page, pageSize);
        return (donations, totalCount);
    }

    public async Task<(List<DonationResponse> donations, int totalCount)> GetDonationsByCampaign(Guid campaignId, int page, int pageSize)
    {
        var query = BuildCampaignDonationsQuery(campaignId);
        var totalCount = await query.CountAsync();
        var donations = await ExecuteDonationQuery(query, page, pageSize);
        return (donations, totalCount);
    }

    public async Task<DonationResponse?> UpdateDonationStatus(Guid id, DonationStatus status)
    {
        var donation = await _db.Donations.FindAsync(id);
        if (donation == null) return null;
        donation.Status = status;
        donation.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return await FetchDonationWithDetails(id);
    }

    public async Task<DonationSummary> GetDonationSummaryByCampaign(Guid campaignId)
    {
        var query = BuildCompletedDonationsQuery(campaignId);
        return await CalculateDonationSummary(query);
    }

    private Donation BuildDonationFromRequest(Guid userId, CreateDonationRequest request)
    {
        return new Donation
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CampaignId = request.CampaignId,
            OrganizationId = request.OrganizationId,
            Amount = request.Amount,
            Status = DonationStatus.Pending,
            PaymentMethod = request.PaymentMethod,
            IsAnonymous = request.IsAnonymous,
            DonorMessage = request.DonorMessage,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    private IQueryable<Donation> BuildUserDonationsQuery(Guid userId)
    {
        return _db.Donations
            .Include(d => d.Campaign)
            .Include(d => d.Organization)
            .Where(d => d.UserId == userId);
    }

    private IQueryable<Donation> BuildCampaignDonationsQuery(Guid campaignId)
    {
        return _db.Donations
            .Include(d => d.User)
            .Include(d => d.Organization)
            .Where(d => d.CampaignId == campaignId);
    }

    private IQueryable<Donation> BuildCompletedDonationsQuery(Guid campaignId)
    {
        return _db.Donations.Where(d => d.CampaignId == campaignId && d.Status == DonationStatus.Completed);
    }

    private async Task<List<DonationResponse>> ExecuteDonationQuery(IQueryable<Donation> query, int page, int pageSize)
    {
        return await query
            .OrderByDescending(d => d.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(d => MapToDonationResponse(d))
            .ToListAsync();
    }

    private async Task<DonationResponse> FetchDonationWithDetails(Guid id)
    {
        var donation = await _db.Donations
            .Include(d => d.User)
            .Include(d => d.Campaign)
            .Include(d => d.Organization)
            .FirstOrDefaultAsync(d => d.Id == id);
        return donation == null ? null! : MapToDonationResponse(donation);
    }

    private DonationResponse MapToDonationResponse(Donation d)
    {
        return new DonationResponse
        {
            Id = d.Id,
            UserId = d.UserId,
            CampaignId = d.CampaignId,
            OrganizationId = d.OrganizationId,
            Amount = d.Amount,
            Status = d.Status.ToString(),
            PaymentMethod = d.PaymentMethod,
            PaymentIntentId = d.PaymentIntentId,
            IsAnonymous = d.IsAnonymous,
            DonorMessage = d.DonorMessage,
            ReceiptSent = d.ReceiptSent,
            CreatedAt = d.CreatedAt,
            UpdatedAt = d.UpdatedAt
        };
    }

    private async Task<DonationSummary> CalculateDonationSummary(IQueryable<Donation> query)
    {
        var totalAmount = await query.SumAsync(d => d.Amount);
        var totalCount = await query.CountAsync();
        var averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;
        return BuildDonationSummary(totalAmount, totalCount, averageAmount);
    }

    private DonationSummary BuildDonationSummary(decimal totalAmount, int totalCount, decimal averageAmount)
    {
        return new DonationSummary
        {
            TotalAmount = totalAmount,
            TotalDonations = totalCount,
            AverageDonation = averageAmount
        };
    }
}
