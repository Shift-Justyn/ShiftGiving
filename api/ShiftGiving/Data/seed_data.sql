-- GivingApp Local Development Seed Data
-- This script seeds the database with test data for local development

-- Create tables
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    organization_code VARCHAR(10) UNIQUE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    tax_id VARCHAR(20),
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_organizations_code ON organizations(organization_code);
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('individual', 'organization_admin')),
    organization_id UUID REFERENCES organizations(id),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);

CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    goal_amount DECIMAL(12, 2) NOT NULL,
    raised_amount DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'active', 'closing_soon', 'completed', 'cancelled')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    featured_image_url VARCHAR(500),
    video_url VARCHAR(500),
    social_facebook VARCHAR(500),
    social_twitter VARCHAR(500),
    social_instagram VARCHAR(500),
    social_linkedin VARCHAR(500),
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    CONSTRAINT chk_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_amounts CHECK (goal_amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_campaigns_organization ON campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(start_date, end_date);

CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    campaign_id UUID NOT NULL REFERENCES campaigns(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    payment_intent_id VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT false,
    donor_message TEXT,
    receipt_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_amount CHECK (amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_organization ON donations(organization_id);
CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);

CREATE TABLE IF NOT EXISTS campaign_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_images_campaign ON campaign_images(campaign_id);

CREATE TABLE IF NOT EXISTS campaign_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    allocation_percentage DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_programs_campaign ON campaign_programs(campaign_id);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('story', 'update', 'announcement')),
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'scheduled', 'sent')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_organization ON messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

CREATE TABLE IF NOT EXISTS user_organization_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_user_org_links_user ON user_organization_links(user_id);
CREATE INDEX IF NOT EXISTS idx_user_org_links_org ON user_organization_links(organization_id);

CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    stripe_payment_method_id VARCHAR(255) NOT NULL,
    card_brand VARCHAR(20),
    card_last_four VARCHAR(4),
    card_exp_month INT,
    card_exp_year INT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record ON audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);

-- Seed Organizations
INSERT INTO organizations (id, name, description, logo_url, website_url, organization_code, contact_email, contact_phone, address_line1, city, state, postal_code, country, tax_id, is_verified, is_active)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Hope Foundation', 'A nonprofit organization dedicated to providing educational resources and opportunities to underprivileged children worldwide.', 'https://example.com/logos/hope.png', 'https://hopefoundation.org', 'HOPE2024', 'contact@hopefoundation.org', '555-0100', '123 Charity Lane', 'San Francisco', 'CA', '94102', 'USA', '94-1234567', true, true),
    ('22222222-2222-2222-2222-222222222222', 'Green Earth Alliance', 'Environmental conservation organization focused on protecting endangered species and restoring natural habitats.', 'https://example.com/logos/greenearth.png', 'https://greenearthalliance.org', 'GREEN24', 'info@greenearthalliance.org', '555-0200', '456 Nature Drive', 'Portland', 'OR', '97201', 'USA', '94-7654321', true, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Users
-- Password for all users: Password123! (bcrypt hash with cost 12)
INSERT INTO users (id, email, password_hash, first_name, last_name, date_of_birth, user_type, organization_id, is_active, email_verified)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'donor@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr.LhWqGu', 'Sarah', 'Johnson', '1990-05-15', 'individual', NULL, true, true),
    ('44444444-4444-4444-4444-444444444444', 'admin.hope@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr.LhWqGu', 'Michael', 'Chen', '1985-08-22', 'organization_admin', '11111111-1111-1111-1111-111111111111', true, true),
    ('55555555-5555-5555-5555-555555555555', 'admin.green@test.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr.LhWqGu', 'Emily', 'Rodriguez', '1988-12-03', 'organization_admin', '22222222-2222-2222-2222-222222222222', true, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Campaigns
INSERT INTO campaigns (id, organization_id, title, description, short_description, goal_amount, raised_amount, status, start_date, end_date, featured_image_url, is_featured, created_by)
VALUES
    ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Build Schools in Rural Communities', 'Help us construct three new schools in rural areas where children currently walk over 10 miles to attend class. Your donation will provide safe, modern learning environments for over 500 students.', 'Building schools for 500+ children in rural areas', 50000.00, 35750.00, 'active', '2026-01-01', '2026-06-30', 'https://example.com/campaigns/schools.jpg', true, '44444444-4444-4444-4444-444444444444'),
    ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Emergency Relief Fund', 'Natural disasters strike without warning. This fund ensures we can respond immediately with food, water, shelter, and medical supplies to communities in crisis.', 'Emergency response for disaster-affected communities', 100000.00, 87500.00, 'closing_soon', '2025-11-01', '2026-02-28', 'https://example.com/campaigns/relief.jpg', false, '44444444-4444-4444-4444-444444444444'),
    ('88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 'Save the Amazon Rainforest', 'Support our efforts to purchase and protect 10,000 acres of Amazon rainforest from deforestation. Every dollar helps preserve critical habitat for endangered species.', 'Protecting 10,000 acres of rainforest habitat', 250000.00, 198250.00, 'active', '2025-09-01', '2026-08-31', 'https://example.com/campaigns/amazon.jpg', true, '55555555-5555-5555-5555-555555555555'),
    ('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'Ocean Cleanup Initiative', 'Join us in removing plastic waste from our oceans. We deploy specialized vessels and technology to collect debris before it harms marine life.', 'Removing plastic waste from ocean ecosystems', 75000.00, 75000.00, 'completed', '2025-06-01', '2025-12-31', 'https://example.com/campaigns/ocean.jpg', false, '55555555-5555-5555-5555-555555555555'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Scholarship Program 2026', 'Provide full scholarships to 20 exceptional students from low-income families to attend university. Education transforms lives and breaks cycles of poverty.', 'Full university scholarships for 20 students', 120000.00, 24500.00, 'active', '2026-01-15', '2026-12-31', 'https://example.com/campaigns/scholarship.jpg', true, '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

-- Seed Donations
INSERT INTO donations (id, user_id, campaign_id, organization_id, amount, status, payment_method, payment_intent_id, is_anonymous, donor_message, receipt_sent, created_at)
VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 100.00, 'completed', 'card', 'pi_test_100', false, 'Education is the key to breaking the cycle of poverty. Keep up the great work!', true, NOW() - INTERVAL '30 days'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 250.00, 'completed', 'card', 'pi_test_101', false, 'Hoping this helps families in need.', true, NOW() - INTERVAL '25 days'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 500.00, 'completed', 'card', 'pi_test_102', false, 'The rainforest must be protected for future generations!', true, NOW() - INTERVAL '20 days'),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 150.00, 'completed', 'card', 'pi_test_103', true, NULL, true, NOW() - INTERVAL '15 days'),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 1000.00, 'completed', 'card', 'pi_test_104', false, 'Thank you for your dedication to environmental conservation.', true, NOW() - INTERVAL '10 days'),
    ('01010101-0101-0101-0101-010101010101', '33333333-3333-3333-3333-333333333333', '99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 75.00, 'completed', 'card', 'pi_test_105', false, 'Clean oceans are essential!', true, NOW() - INTERVAL '8 days'),
    ('02020202-0202-0202-0202-020202020202', '33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 200.00, 'completed', 'card', 'pi_test_106', false, NULL, true, NOW() - INTERVAL '5 days'),
    ('03030303-0303-0303-0303-030303030303', '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 500.00, 'completed', 'card', 'pi_test_107', false, 'Investing in education is investing in our future.', true, NOW() - INTERVAL '3 days'),
    ('04040404-0404-0404-0404-040404040404', '33333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 50.00, 'completed', 'card', 'pi_test_108', true, NULL, true, NOW() - INTERVAL '2 days'),
    ('05050505-0505-0505-0505-050505050505', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 300.00, 'completed', 'card', 'pi_test_109', false, 'Every acre saved matters!', true, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Seed User Organization Links
INSERT INTO user_organization_links (user_id, organization_id)
VALUES
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
    ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (user_id, organization_id) DO NOTHING;

-- Seed Campaign Programs
INSERT INTO campaign_programs (campaign_id, name, description, allocation_percentage)
VALUES
    ('66666666-6666-6666-6666-666666666666', 'Construction Materials', 'Lumber, concrete, roofing materials', 40.00),
    ('66666666-6666-6666-6666-666666666666', 'Labor Costs', 'Construction workers and skilled tradespeople', 35.00),
    ('66666666-6666-6666-6666-666666666666', 'School Supplies', 'Desks, books, teaching materials', 25.00),
    ('88888888-8888-8888-8888-888888888888', 'Land Acquisition', 'Purchase of forest land', 60.00),
    ('88888888-8888-8888-8888-888888888888', 'Conservation Management', 'Ongoing protection and monitoring', 30.00),
    ('88888888-8888-8888-8888-888888888888', 'Community Partnerships', 'Working with indigenous communities', 10.00)
ON CONFLICT (id) DO NOTHING;

-- Print completion message
DO $$
BEGIN
    RAISE NOTICE 'Seed data loaded successfully!';
    RAISE NOTICE '';
    RAISE NOTICE 'Test Accounts:';
    RAISE NOTICE '  Donor: donor@test.com / Password123!';
    RAISE NOTICE '  Hope Foundation Admin: admin.hope@test.com / Password123!';
    RAISE NOTICE '  Green Earth Admin: admin.green@test.com / Password123!';
    RAISE NOTICE '';
    RAISE NOTICE 'Organizations:';
    RAISE NOTICE '  Hope Foundation (Code: HOPE2024)';
    RAISE NOTICE '  Green Earth Alliance (Code: GREEN24)';
    RAISE NOTICE '';
    RAISE NOTICE 'Campaigns: 5 total (3 active, 1 closing_soon, 1 completed)';
    RAISE NOTICE 'Donations: 10 total ($3,125.00 total donated)';
END $$;
