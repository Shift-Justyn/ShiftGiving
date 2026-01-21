# Local Database Setup - GivingApp

This guide explains how to set up and manage the local PostgreSQL database for development.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose V2 (included with Docker Desktop)

## Quick Start

### 1. Start the Database

```bash
./scripts/start_local_db.sh
```

This will:
- Start PostgreSQL 16 in a Docker container
- Create the `givingapp` database
- Apply the schema and seed data automatically
- Wait for the database to be healthy

### 2. Connect to the Database

Use these connection details in your API configuration:

```
Host: localhost
Port: 5432
Database: givingapp
Username: givingapp
Password: givingapp_local_dev

Connection String:
postgresql://givingapp:givingapp_local_dev@localhost:5432/givingapp
```

### 3. Stop the Database

```bash
./scripts/stop_local_db.sh
```

This stops the container but preserves your data.

## Advanced Usage

### Start with Fresh Data

To drop all data and recreate the database from scratch:

```bash
./scripts/start_local_db.sh --fresh
```

This is useful when:
- Schema has changed significantly
- You want to reset to clean seed data
- Testing from a known state

### Stop and Clean All Data

To stop the database and remove all volumes:

```bash
./scripts/stop_local_db.sh --clean
```

This completely removes the database data. Next start will recreate everything.

## Test Accounts

The seed data includes three test accounts. All use the password: `Password123!`

### Individual Donor
- Email: `donor@test.com`
- Name: Sarah Johnson
- Type: Individual donor
- Has made 10 donations across multiple campaigns

### Hope Foundation Admin
- Email: `admin.hope@test.com`
- Name: Michael Chen
- Type: Organization Administrator
- Organization: Hope Foundation (Code: HOPE2024)
- Manages 3 campaigns

### Green Earth Alliance Admin
- Email: `admin.green@test.com`
- Name: Emily Rodriguez
- Type: Organization Administrator
- Organization: Green Earth Alliance (Code: GREEN24)
- Manages 2 campaigns

## Seeded Data

### Organizations (2)
1. **Hope Foundation** - Education-focused nonprofit
   - Code: `HOPE2024`
   - 3 campaigns

2. **Green Earth Alliance** - Environmental conservation
   - Code: `GREEN24`
   - 2 campaigns

### Campaigns (5)
1. Build Schools in Rural Communities - Active, $35,750 / $50,000
2. Emergency Relief Fund - Closing Soon, $87,500 / $100,000
3. Save the Amazon Rainforest - Active, $198,250 / $250,000
4. Ocean Cleanup Initiative - Completed, $75,000 / $75,000
5. Scholarship Program 2026 - Active, $24,500 / $120,000

### Donations (10)
- Total donated: $3,125
- All donations are completed
- Mix of anonymous and public donations
- Various donation amounts from $50 to $1,000

## Database Schema

The complete schema is documented in [DATA_MODELS.md](./DATA_MODELS.md).

Key tables:
- `users` - Donors and organization administrators
- `organizations` - Nonprofit organizations
- `campaigns` - Fundraising campaigns
- `donations` - Individual donation transactions
- `campaign_images` - Additional campaign images
- `campaign_programs` - Program allocation within campaigns
- `messages` - Organization communications
- `user_organization_links` - Donor-organization relationships
- `payment_methods` - Saved payment methods
- `audit_log` - Change tracking

## Database Access

### Using psql CLI

```bash
docker exec -it givingapp-postgres psql -U givingapp -d givingapp
```

### Using a GUI Tool

Connect using your preferred database tool (pgAdmin, DBeaver, etc.) with the connection details above.

### View Container Logs

```bash
docker compose logs -f postgres
```

## Troubleshooting

### Port 5432 Already in Use

If you have another PostgreSQL instance running:

```bash
# Find what's using port 5432
lsof -i :5432

# Stop the conflicting service or change the port in docker-compose.yml
```

### Container Won't Start

Check Docker Desktop is running:

```bash
docker ps
```

View container status:

```bash
docker compose ps
```

View detailed logs:

```bash
docker compose logs postgres
```

### Data Persistence Issues

The database data is stored in a Docker volume named `postgres_data`. To completely remove:

```bash
./scripts/stop_local_db.sh --clean
```

Or manually:

```bash
docker compose down -v
docker volume rm giving-app_postgres_data
```

## Updating Seed Data

Edit `/api/GivingApp/Data/seed_data.sql` and restart the database with `--fresh`:

```bash
./scripts/start_local_db.sh --fresh
```

## CI/CD Integration

The GitHub Actions workflow uses this setup for integration tests. See `.github/workflows/build_test_deploy.yml`.

## Production Differences

Local development differs from production:

| Aspect | Local | Production |
|--------|-------|------------|
| Host | Docker container | AWS RDS |
| SSL | Not required | Required |
| Backups | Manual snapshots | Automated daily |
| High Availability | Single instance | Writer + Read replica |
| Access | Direct connection | Via bastion host |
| Credentials | In docker-compose.yml | AWS Secrets Manager |

See [infrastructure/](../infrastructure/) for production configuration.
