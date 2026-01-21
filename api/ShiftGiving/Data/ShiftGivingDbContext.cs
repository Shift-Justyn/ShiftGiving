using Microsoft.EntityFrameworkCore;
using ShiftGiving.Models;

namespace ShiftGiving.Data;

public class ShiftGivingDbContext : DbContext
{
    public ShiftGivingDbContext(DbContextOptions<ShiftGivingDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Campaign> Campaigns { get; set; }
    public DbSet<CampaignImage> CampaignImages { get; set; }
    public DbSet<CampaignProgram> CampaignPrograms { get; set; }
    public DbSet<Donation> Donations { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<UserOrganizationLink> UserOrganizationLinks { get; set; }
    public DbSet<PaymentMethod> PaymentMethods { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Payout> Payouts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureUserEntity(modelBuilder);
        ConfigureOrganizationEntity(modelBuilder);
        ConfigureCampaignEntity(modelBuilder);
        ConfigureCampaignImageEntity(modelBuilder);
        ConfigureCampaignProgramEntity(modelBuilder);
        ConfigureDonationEntity(modelBuilder);
        ConfigureMessageEntity(modelBuilder);
        ConfigureUserOrganizationLinkEntity(modelBuilder);
        ConfigurePaymentMethodEntity(modelBuilder);
        ConfigureAuditLogEntity(modelBuilder);
        ConfigureNotificationEntity(modelBuilder);
        ConfigurePayoutEntity(modelBuilder);
    }

    private void ConfigureUserEntity(ModelBuilder builder)
    {
        builder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
            entity.Property(e => e.FirstName).HasColumnName("first_name").HasMaxLength(100).IsRequired();
            entity.Property(e => e.LastName).HasColumnName("last_name").HasMaxLength(100).IsRequired();
            entity.Property(e => e.DateOfBirth).HasColumnName("date_of_birth");
            entity.Property(e => e.UserType).HasColumnName("user_type").HasMaxLength(20).IsRequired()
                .HasConversion(
                    v => ConvertUserTypeToDb(v),
                    v => ConvertDbToUserType(v));
            entity.Property(e => e.OrganizationId).HasColumnName("organization_id");
            entity.Property(e => e.AvatarUrl).HasColumnName("avatar_url").HasMaxLength(500);
            entity.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            entity.Property(e => e.EmailVerified).HasColumnName("email_verified").HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.Email).HasDatabaseName("idx_users_email");
            entity.HasIndex(e => e.OrganizationId).HasDatabaseName("idx_users_organization");

            entity.HasOne(e => e.Organization)
                .WithMany(o => o.Admins)
                .HasForeignKey(e => e.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureOrganizationEntity(ModelBuilder builder)
    {
        builder.Entity<Organization>(entity =>
        {
            entity.ToTable("organizations");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Description).HasColumnName("description").HasColumnType("text");
            entity.Property(e => e.LogoUrl).HasColumnName("logo_url").HasMaxLength(500);
            entity.Property(e => e.WebsiteUrl).HasColumnName("website_url").HasMaxLength(500);
            entity.Property(e => e.OrganizationCode).HasColumnName("organization_code").HasMaxLength(10);
            entity.Property(e => e.ContactEmail).HasColumnName("contact_email").HasMaxLength(255);
            entity.Property(e => e.ContactPhone).HasColumnName("contact_phone").HasMaxLength(20);
            entity.Property(e => e.AddressLine1).HasColumnName("address_line1").HasMaxLength(255);
            entity.Property(e => e.AddressLine2).HasColumnName("address_line2").HasMaxLength(255);
            entity.Property(e => e.City).HasColumnName("city").HasMaxLength(100);
            entity.Property(e => e.State).HasColumnName("state").HasMaxLength(50);
            entity.Property(e => e.PostalCode).HasColumnName("postal_code").HasMaxLength(20);
            entity.Property(e => e.Country).HasColumnName("country").HasMaxLength(50).HasDefaultValue("USA");
            entity.Property(e => e.TaxId).HasColumnName("tax_id").HasMaxLength(20);
            entity.Property(e => e.Latitude).HasColumnName("latitude").HasPrecision(10, 6);
            entity.Property(e => e.Longitude).HasColumnName("longitude").HasPrecision(10, 6);
            entity.Property(e => e.Category).HasColumnName("category").HasMaxLength(50);
            entity.Property(e => e.DisplayOrder).HasColumnName("display_order").HasDefaultValue(0);
            entity.Property(e => e.IsVerified).HasColumnName("is_verified").HasDefaultValue(false);
            entity.Property(e => e.IsActive).HasColumnName("is_active").HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.OrganizationCode).HasDatabaseName("idx_organizations_code");
            entity.HasIndex(e => e.Name).HasDatabaseName("idx_organizations_name");
        });
    }

    private void ConfigureCampaignEntity(ModelBuilder builder)
    {
        builder.Entity<Campaign>(entity =>
        {
            entity.ToTable("campaigns");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrganizationId).HasColumnName("organization_id").IsRequired();
            entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Description).HasColumnName("description").HasColumnType("text");
            entity.Property(e => e.ShortDescription).HasColumnName("short_description").HasMaxLength(500);
            entity.Property(e => e.GoalAmount).HasColumnName("goal_amount").HasPrecision(12, 2).IsRequired();
            entity.Property(e => e.RaisedAmount).HasColumnName("raised_amount").HasPrecision(12, 2).HasDefaultValue(0);
            entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).IsRequired()
                .HasConversion(
                    v => ConvertCampaignStatusToDb(v),
                    v => ConvertDbToCampaignStatus(v))
                .HasDefaultValue(CampaignStatus.Draft);
            entity.Property(e => e.Category).HasColumnName("category").HasMaxLength(20).IsRequired().HasConversion<string>();
            entity.Property(e => e.StartDate).HasColumnName("start_date").IsRequired();
            entity.Property(e => e.EndDate).HasColumnName("end_date").IsRequired();
            entity.Property(e => e.FeaturedImageUrl).HasColumnName("featured_image_url").HasMaxLength(500);
            entity.Property(e => e.VideoUrl).HasColumnName("video_url").HasMaxLength(500);
            entity.Property(e => e.SocialFacebook).HasColumnName("social_facebook").HasMaxLength(500);
            entity.Property(e => e.SocialTwitter).HasColumnName("social_twitter").HasMaxLength(500);
            entity.Property(e => e.SocialInstagram).HasColumnName("social_instagram").HasMaxLength(500);
            entity.Property(e => e.SocialLinkedin).HasColumnName("social_linkedin").HasMaxLength(500);
            entity.Property(e => e.StoryContent).HasColumnName("story_content").HasColumnType("text");
            entity.Property(e => e.Location).HasColumnName("location").HasMaxLength(255);
            entity.Property(e => e.Latitude).HasColumnName("latitude").HasPrecision(10, 6);
            entity.Property(e => e.Longitude).HasColumnName("longitude").HasPrecision(10, 6);
            entity.Property(e => e.UnitLabel).HasColumnName("unit_label").HasMaxLength(100);
            entity.Property(e => e.UnitPrice).HasColumnName("unit_price").HasPrecision(12, 2);
            entity.Property(e => e.ImpactLabel).HasColumnName("impact_label").HasMaxLength(255);
            entity.Property(e => e.IsFeatured).HasColumnName("is_featured").HasDefaultValue(false);
            entity.Property(e => e.DisplayOrder).HasColumnName("display_order").HasDefaultValue(0);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.OrganizationId).HasDatabaseName("idx_campaigns_organization");
            entity.HasIndex(e => e.Status).HasDatabaseName("idx_campaigns_status");
            entity.HasIndex(e => new { e.StartDate, e.EndDate }).HasDatabaseName("idx_campaigns_dates");

            entity.HasOne(e => e.Organization)
                .WithMany(o => o.Campaigns)
                .HasForeignKey(e => e.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureCampaignImageEntity(ModelBuilder builder)
    {
        builder.Entity<CampaignImage>(entity =>
        {
            entity.ToTable("campaign_images");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id").IsRequired();
            entity.Property(e => e.ImageUrl).HasColumnName("image_url").HasMaxLength(500).IsRequired();
            entity.Property(e => e.AltText).HasColumnName("alt_text").HasMaxLength(255);
            entity.Property(e => e.DisplayOrder).HasColumnName("display_order").HasDefaultValue(0);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.CampaignId).HasDatabaseName("idx_campaign_images_campaign");

            entity.HasOne(e => e.Campaign)
                .WithMany(c => c.Images)
                .HasForeignKey(e => e.CampaignId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureCampaignProgramEntity(ModelBuilder builder)
    {
        builder.Entity<CampaignProgram>(entity =>
        {
            entity.ToTable("campaign_programs");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id").IsRequired();
            entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Description).HasColumnName("description").HasColumnType("text");
            entity.Property(e => e.AllocationPercentage).HasColumnName("allocation_percentage").HasPrecision(5, 2);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.CampaignId).HasDatabaseName("idx_campaign_programs_campaign");

            entity.HasOne(e => e.Campaign)
                .WithMany(c => c.Programs)
                .HasForeignKey(e => e.CampaignId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureDonationEntity(ModelBuilder builder)
    {
        builder.Entity<Donation>(entity =>
        {
            entity.ToTable("donations");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(e => e.CampaignId).HasColumnName("campaign_id").IsRequired();
            entity.Property(e => e.OrganizationId).HasColumnName("organization_id").IsRequired();
            entity.Property(e => e.Amount).HasColumnName("amount").HasPrecision(12, 2).IsRequired();
            entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).IsRequired().HasConversion<string>().HasDefaultValue(DonationStatus.Pending);
            entity.Property(e => e.PaymentMethod).HasColumnName("payment_method").HasMaxLength(50);
            entity.Property(e => e.PaymentIntentId).HasColumnName("payment_intent_id").HasMaxLength(255);
            entity.Property(e => e.IsAnonymous).HasColumnName("is_anonymous").HasDefaultValue(false);
            entity.Property(e => e.DonorMessage).HasColumnName("donor_message").HasColumnType("text");
            entity.Property(e => e.ReceiptSent).HasColumnName("receipt_sent").HasDefaultValue(false);
            entity.Property(e => e.TransactionFee).HasColumnName("transaction_fee").HasPrecision(12, 2).HasDefaultValue(0);
            entity.Property(e => e.PlatformFee).HasColumnName("platform_fee").HasPrecision(12, 2).HasDefaultValue(0);
            entity.Property(e => e.DonorCoversFees).HasColumnName("donor_covers_fees").HasDefaultValue(false);
            entity.Property(e => e.NetAmount).HasColumnName("net_amount").HasPrecision(12, 2).HasDefaultValue(0);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.UserId).HasDatabaseName("idx_donations_user");
            entity.HasIndex(e => e.CampaignId).HasDatabaseName("idx_donations_campaign");
            entity.HasIndex(e => e.OrganizationId).HasDatabaseName("idx_donations_organization");
            entity.HasIndex(e => e.CreatedAt).HasDatabaseName("idx_donations_created");
            entity.HasIndex(e => e.Status).HasDatabaseName("idx_donations_status");

            entity.HasOne(e => e.User)
                .WithMany(u => u.Donations)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Campaign)
                .WithMany(c => c.Donations)
                .HasForeignKey(e => e.CampaignId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Organization)
                .WithMany(o => o.Donations)
                .HasForeignKey(e => e.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureMessageEntity(ModelBuilder builder)
    {
        builder.Entity<Message>(entity =>
        {
            entity.ToTable("messages");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrganizationId).HasColumnName("organization_id").IsRequired();
            entity.Property(e => e.SenderId).HasColumnName("sender_id").IsRequired();
            entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Content).HasColumnName("content").HasColumnType("text").IsRequired();
            entity.Property(e => e.MessageType).HasColumnName("message_type").HasMaxLength(20).IsRequired().HasConversion<string>();
            entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).IsRequired().HasConversion<string>().HasDefaultValue(MessageStatus.Draft);
            entity.Property(e => e.ScheduledAt).HasColumnName("scheduled_at");
            entity.Property(e => e.SentAt).HasColumnName("sent_at");
            entity.Property(e => e.ImageUrl).HasColumnName("image_url").HasMaxLength(500);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.OrganizationId).HasDatabaseName("idx_messages_organization");
            entity.HasIndex(e => e.Status).HasDatabaseName("idx_messages_status");

            entity.HasOne(e => e.Organization)
                .WithMany(o => o.Messages)
                .HasForeignKey(e => e.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureUserOrganizationLinkEntity(ModelBuilder builder)
    {
        builder.Entity<UserOrganizationLink>(entity =>
        {
            entity.ToTable("user_organization_links");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(e => e.OrganizationId).HasColumnName("organization_id").IsRequired();
            entity.Property(e => e.LinkedAt).HasColumnName("linked_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => new { e.UserId, e.OrganizationId }).IsUnique().HasDatabaseName("idx_user_org_unique");
            entity.HasIndex(e => e.UserId).HasDatabaseName("idx_user_org_links_user");
            entity.HasIndex(e => e.OrganizationId).HasDatabaseName("idx_user_org_links_org");

            entity.HasOne(e => e.User)
                .WithMany(u => u.OrganizationLinks)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Organization)
                .WithMany(o => o.UserLinks)
                .HasForeignKey(e => e.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigurePaymentMethodEntity(ModelBuilder builder)
    {
        builder.Entity<PaymentMethod>(entity =>
        {
            entity.ToTable("payment_methods");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(e => e.StripePaymentMethodId).HasColumnName("stripe_payment_method_id").HasMaxLength(255).IsRequired();
            entity.Property(e => e.CardBrand).HasColumnName("card_brand").HasMaxLength(20);
            entity.Property(e => e.CardLastFour).HasColumnName("card_last_four").HasMaxLength(4);
            entity.Property(e => e.CardExpMonth).HasColumnName("card_exp_month");
            entity.Property(e => e.CardExpYear).HasColumnName("card_exp_year");
            entity.Property(e => e.IsDefault).HasColumnName("is_default").HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.UserId).HasDatabaseName("idx_payment_methods_user");

            entity.HasOne(e => e.User)
                .WithMany(u => u.PaymentMethods)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigureAuditLogEntity(ModelBuilder builder)
    {
        builder.Entity<AuditLog>(entity =>
        {
            entity.ToTable("audit_log");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.TableName).HasColumnName("table_name").HasMaxLength(100).IsRequired();
            entity.Property(e => e.RecordId).HasColumnName("record_id").IsRequired();
            entity.Property(e => e.Action).HasColumnName("action").HasMaxLength(20).IsRequired();
            entity.Property(e => e.OldValues).HasColumnName("old_values").HasColumnType("jsonb");
            entity.Property(e => e.NewValues).HasColumnName("new_values").HasColumnType("jsonb");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.IpAddress).HasColumnName("ip_address").HasMaxLength(45);
            entity.Property(e => e.UserAgent).HasColumnName("user_agent").HasColumnType("text");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.TableName).HasDatabaseName("idx_audit_log_table");
            entity.HasIndex(e => e.RecordId).HasDatabaseName("idx_audit_log_record");
            entity.HasIndex(e => e.UserId).HasDatabaseName("idx_audit_log_user");
            entity.HasIndex(e => e.CreatedAt).HasDatabaseName("idx_audit_log_created");
        });
    }

    private static string ConvertCampaignStatusToDb(CampaignStatus status)
    {
        return status switch
        {
            CampaignStatus.Draft => "draft",
            CampaignStatus.Active => "active",
            CampaignStatus.ClosingSoon => "closing_soon",
            CampaignStatus.Completed => "completed",
            CampaignStatus.Cancelled => "cancelled",
            _ => "draft"
        };
    }

    private static CampaignStatus ConvertDbToCampaignStatus(string dbValue)
    {
        return dbValue switch
        {
            "draft" => CampaignStatus.Draft,
            "active" => CampaignStatus.Active,
            "closing_soon" => CampaignStatus.ClosingSoon,
            "completed" => CampaignStatus.Completed,
            "cancelled" => CampaignStatus.Cancelled,
            _ => CampaignStatus.Draft
        };
    }

    private static string ConvertUserTypeToDb(UserType userType)
    {
        return userType switch
        {
            UserType.Individual => "individual",
            UserType.OrganizationAdmin => "organization_admin",
            UserType.SiteAdmin => "site_admin",
            UserType.MarketingAdmin => "marketing_admin",
            UserType.Coordinator => "coordinator",
            _ => "individual"
        };
    }

    private static UserType ConvertDbToUserType(string dbValue)
    {
        return dbValue switch
        {
            "individual" => UserType.Individual,
            "organization_admin" => UserType.OrganizationAdmin,
            "site_admin" => UserType.SiteAdmin,
            "marketing_admin" => UserType.MarketingAdmin,
            "coordinator" => UserType.Coordinator,
            _ => UserType.Individual
        };
    }

    private void ConfigureNotificationEntity(ModelBuilder builder)
    {
        builder.Entity<Notification>(entity =>
        {
            entity.ToTable("notifications");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
            entity.Property(e => e.Title).HasColumnName("title").HasMaxLength(255).IsRequired();
            entity.Property(e => e.Body).HasColumnName("body").HasColumnType("text").IsRequired();
            entity.Property(e => e.Type).HasColumnName("type").HasMaxLength(20).IsRequired().HasConversion<string>();
            entity.Property(e => e.IsRead).HasColumnName("is_read").HasDefaultValue(false);
            entity.Property(e => e.Data).HasColumnName("data").HasColumnType("text");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");
            entity.Property(e => e.ReadAt).HasColumnName("read_at");

            entity.HasIndex(e => e.UserId).HasDatabaseName("idx_notifications_user");
            entity.HasIndex(e => e.Type).HasDatabaseName("idx_notifications_type");
            entity.HasIndex(e => e.IsRead).HasDatabaseName("idx_notifications_is_read");

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private void ConfigurePayoutEntity(ModelBuilder builder)
    {
        builder.Entity<Payout>(entity =>
        {
            entity.ToTable("payouts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrganizationId).HasColumnName("organization_id").IsRequired();
            entity.Property(e => e.Amount).HasColumnName("amount").HasPrecision(12, 2).IsRequired();
            entity.Property(e => e.Status).HasColumnName("status").HasMaxLength(20).IsRequired().HasConversion<string>();
            entity.Property(e => e.ScheduledDate).HasColumnName("scheduled_date").IsRequired();
            entity.Property(e => e.CompletedDate).HasColumnName("completed_date");
            entity.Property(e => e.TransactionReference).HasColumnName("transaction_reference").HasMaxLength(255);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("NOW()");

            entity.HasIndex(e => e.OrganizationId).HasDatabaseName("idx_payouts_organization");
            entity.HasIndex(e => e.Status).HasDatabaseName("idx_payouts_status");
            entity.HasIndex(e => e.ScheduledDate).HasDatabaseName("idx_payouts_scheduled_date");

            entity.HasOne(e => e.Organization)
                .WithMany()
                .HasForeignKey(e => e.OrganizationId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
