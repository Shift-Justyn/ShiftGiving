-- Seed data for Shift Giving production database
-- Run this via bastion host to populate initial data

-- Create tables if not exist

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    user_type VARCHAR(20) NOT NULL DEFAULT 'individual',
    organization_id UUID,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    organization_code VARCHAR(10),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    tax_id VARCHAR(20),
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    category VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_code ON organizations(organization_code);
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    goal_amount DECIMAL(12, 2) NOT NULL,
    raised_amount DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    category VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    featured_image_url VARCHAR(500),
    video_url VARCHAR(500),
    social_facebook VARCHAR(500),
    social_twitter VARCHAR(500),
    social_instagram VARCHAR(500),
    social_linkedin VARCHAR(500),
    story_content TEXT,
    location VARCHAR(255),
    unit_label VARCHAR(100),
    unit_price DECIMAL(12, 2),
    impact_label VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_organization ON campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(start_date, end_date);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    campaign_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    payment_method VARCHAR(50),
    payment_intent_id VARCHAR(255),
    is_anonymous BOOLEAN DEFAULT FALSE,
    donor_message TEXT,
    receipt_sent BOOLEAN DEFAULT FALSE,
    transaction_fee DECIMAL(12, 2) DEFAULT 0,
    platform_fee DECIMAL(12, 2) DEFAULT 0,
    donor_covers_fees BOOLEAN DEFAULT FALSE,
    net_amount DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_campaign ON donations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_donations_organization ON donations(organization_id);
CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);

-- Campaign Images table
CREATE TABLE IF NOT EXISTS campaign_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_images_campaign ON campaign_images(campaign_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    data TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Audit Log table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record ON audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_organization ON messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- User Organization Links table
CREATE TABLE IF NOT EXISTS user_organization_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL,
    linked_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_user_org_links_user ON user_organization_links(user_id);
CREATE INDEX IF NOT EXISTS idx_user_org_links_org ON user_organization_links(organization_id);

-- Payment Methods table
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    stripe_payment_method_id VARCHAR(255) NOT NULL,
    card_brand VARCHAR(20),
    card_last_four VARCHAR(4),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);

-- Campaign Programs table
CREATE TABLE IF NOT EXISTS campaign_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    allocation_percentage DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_programs_campaign ON campaign_programs(campaign_id);

-- Payouts table
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    transaction_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payouts_organization ON payouts(organization_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_scheduled_date ON payouts(scheduled_date);

-- =========================================
-- SEED DATA
-- =========================================

-- Clear existing data (be careful in production!)
DELETE FROM donations;
DELETE FROM campaign_images;
DELETE FROM campaign_programs;
DELETE FROM campaigns;
DELETE FROM user_organization_links;
DELETE FROM notifications;
DELETE FROM messages;
DELETE FROM payment_methods;
DELETE FROM users;
DELETE FROM organizations;

-- Insert Organizations
INSERT INTO organizations (id, name, description, logo_url, is_verified, is_active, city, state, latitude, longitude, category) VALUES
('11111111-1111-1111-1111-111111111111', 'Lutheran Church Of Hope - WDM', 'Hope''s Missions Team partners locally and globally to coordinate service projects, mission trips, and outreach opportunities.', '/images/organizations/org-hope-wdm-logo.svg', true, true, 'West Des Moines', 'IA', 41.5772, -93.7113, 'Community'),
('22222222-2222-2222-2222-222222222222', 'Paws Rescue Foundation', 'Dedicated to rescuing and rehoming abandoned animals. 501(c)(3) nonprofit.', '/images/organizations/org-1-paws-rescue-v3.png', true, true, 'Portland', 'OR', 45.5152, -122.6784, 'Animals'),
('33333333-3333-3333-3333-333333333333', 'Grace Community Church', 'Faith-based organization serving the local community. 501(c)(3) nonprofit.', '/images/organizations/org-2-grace-church-v3.jpg', true, true, 'Austin', 'TX', 30.2672, -97.7431, 'Community'),
('44444444-4444-4444-4444-444444444444', 'City Food Bank', 'Fighting food insecurity and hunger in our community. 501(c)(3) nonprofit.', '/images/organizations/org-3-food-bank-v3.png', true, true, 'Seattle', 'WA', 47.6062, -122.3321, 'Community'),
('55555555-5555-5555-5555-555555555555', 'Future Leaders Youth Program', 'Empowering youth through education and mentorship. 501(c)(3) nonprofit.', '/images/organizations/org-4-future-leaders-v2.png', true, true, 'Chicago', 'IL', 41.8781, -87.6298, 'Education'),
('66666666-6666-6666-6666-666666666666', 'Disaster Relief International', 'Providing emergency aid to disaster-affected communities. 501(c)(3) nonprofit.', '/images/organizations/org-5-disaster-relief.png', true, true, 'Miami', 'FL', 25.7617, -80.1918, 'Health'),
('77777777-7777-7777-7777-777777777777', 'Cancer Screen Iowa', 'Dedicated to cancer prevention through community screening programs.', '/images/organizations/org-6-cancer-screen-iowa.png', true, true, 'Des Moines', 'IA', 41.5868, -93.625, 'Health'),
('88888888-8888-8888-8888-888888888888', 'Ocean Restoration Coalition', 'Dedicated to revitalizing marine ecosystems through cutting-edge restoration projects. 501(c)(3) nonprofit.', '/images/campaigns/kelp/kelp-forest-main.png', true, true, 'Newport', 'OR', 44.6, -124.5, 'Environment'),
('99999999-9999-9999-9999-999999999999', 'Amazon Conservation Trust', 'Working with indigenous communities to protect the Amazon rainforest through sustainable conservation and community empowerment. 501(c)(3) nonprofit.', '/images/campaigns/amazon/amazon-featured.png', true, true, 'Manaus', 'Brazil', -3.4653, -62.2159, 'Environment');

-- Insert Users (passwords hashed with BCrypt for 'Password123!')
-- BCrypt hash for 'Password123!' = $2a$11$cDe5fADbtVDJH.mgpr0KnufSqJSyfOzTDa99Zk6UHFKvTYDR2oQkW
INSERT INTO users (id, email, password_hash, first_name, last_name, user_type, avatar_url, is_active, email_verified) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'justyn@justyn.com', '$2a$11$cDe5fADbtVDJH.mgpr0KnufSqJSyfOzTDa99Zk6UHFKvTYDR2oQkW', 'Justyn', 'Miller', 'site_admin', '/images/avatars/avatar-justyn.png', true, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'donor@example.com', '$2a$11$cDe5fADbtVDJH.mgpr0KnufSqJSyfOzTDa99Zk6UHFKvTYDR2oQkW', 'Sarah', 'Johnson', 'individual', '/images/avatars/avatar-sarah.jpg', true, true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'orgadmin@example.com', '$2a$11$cDe5fADbtVDJH.mgpr0KnufSqJSyfOzTDa99Zk6UHFKvTYDR2oQkW', 'Michael', 'Chen', 'organization_admin', '/images/avatars/avatar-michael.jpg', true, true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'siteadmin@example.com', '$2a$11$cDe5fADbtVDJH.mgpr0KnufSqJSyfOzTDa99Zk6UHFKvTYDR2oQkW', 'Jennifer', 'Williams', 'site_admin', '/images/avatars/avatar-jennifer.jpg', true, true);

-- Insert Campaigns
INSERT INTO campaigns (id, organization_id, title, short_description, description, goal_amount, raised_amount, status, category, start_date, end_date, featured_image_url, is_featured) VALUES
-- Hope WDM Campaigns
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'The Pantry at Hope', 'Provide food and pantry staples for neighbors in need', 'The Pantry at Hope is an available resource for anyone in need of food assistance. Your support helps keep shelves stocked with food and household essentials while welcoming guests with dignity and care.', 25000, 16250, 'active', 'Community', CURRENT_DATE - 20, CURRENT_DATE + 60, '/images/campaigns/hope/pantry.jpg', true),
('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Cafe Hope', 'Support mission partners through every cup and every meal', 'Cafe Hope is a welcoming space for coffee, breakfast, lunch, and meetings. Every purchase supports Hope''s mission partners, turning everyday moments into lasting impact.', 15000, 9800, 'active', 'Community', CURRENT_DATE - 10, CURRENT_DATE + 45, '/images/campaigns/hope/cafe-hope.png', false),
('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Homes of Hope - YWAM (Tijuana, Mexico)', 'Help build a home with a family in need through a mission partnership', 'Join Hope and Youth With A Mission San Diego/Baja in building a home for (and with) a family in need. Support covers materials, logistics, and team preparation for a hands-on service experience.', 60000, 41250, 'active', 'Community', CURRENT_DATE - 35, CURRENT_DATE + 120, '/images/campaigns/hope/mission-trips.png', true),
('c4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Thanksgiving Meal Packaging', 'Pack meals for families facing hunger during the holiday season', 'Each year, volunteers gather to package meals so families facing hunger can have food during the Thanksgiving season.', 20000, 13750, 'active', 'Community', CURRENT_DATE - 5, CURRENT_DATE + 75, '/images/campaigns/hope/thanksgiving-turkey.jpg', false),
('c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Souper Bowl Food Drive', 'Stock local pantries with nonperishable food and essentials', 'Bring nonperishable food items and essential goods during Souper Bowl season to help stock local pantries.', 12000, 8350, 'active', 'Community', CURRENT_DATE - 2, CURRENT_DATE + 25, '/images/campaigns/hope/souper-bowl.jpg', false),
('c6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Back-to-School Drive', 'Help students start the year with supplies, snacks, and support', 'Help stock classrooms by donating school supplies and essentials.', 18000, 10900, 'active', 'Education', CURRENT_DATE - 8, CURRENT_DATE + 40, '/images/campaigns/hope/school-drive.jpg', false),

-- Other Organization Campaigns
('c7777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 'Emergency Animal Shelter Expansion', 'Help us expand our shelter to rescue more animals in need', 'Paws Rescue Foundation is building a new emergency shelter wing to accommodate more animals. Our current facility is at capacity with over 200 animals in care.', 50000, 37500, 'active', 'Animals', CURRENT_DATE - 30, CURRENT_DATE + 30, '/images/campaigns/campaign-1-animal-shelter.jpg', true),
('c8888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 'Winter Warming Station', 'Provide shelter and warmth for animals during winter', 'As temperatures drop, outdoor animals face critical danger. Help us set up heating stations and provide warm shelter.', 25000, 18750, 'active', 'Animals', CURRENT_DATE - 15, CURRENT_DATE + 5, '/images/campaigns/campaign-2-winter-warming.jpg', false),
('c9999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 'Community Outreach Program', 'Expand our outreach and community support services', 'Grace Community Church is expanding its community outreach initiatives. We serve meals, provide counseling, and offer educational workshops.', 75000, 52500, 'active', 'Community', CURRENT_DATE - 45, CURRENT_DATE + 45, '/images/campaigns/campaign-3-community-outreach.jpg', false),
('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 'Scholarship Fund for Underprivileged Youth', 'Support education and development for youth in need', 'Help us provide full scholarships to deserving youth from low-income families.', 100000, 62000, 'active', 'Education', CURRENT_DATE - 60, CURRENT_DATE + 10, '/images/campaigns/campaign-4-scholarship.jpg', true),
('cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'Emergency Food Distribution Network', 'Expand food distribution to reach more families', 'City Food Bank serves 5,000 families weekly, but demand keeps growing.', 150000, 105000, 'active', 'Community', CURRENT_DATE - 30, CURRENT_DATE + 20, '/images/campaigns/campaign-5-food-distribution.jpg', true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666', 'Disaster Relief Medical Supplies', 'Provide critical medical supplies to disaster victims', 'We respond to natural disasters with emergency medical supplies, clean water, and shelter.', 200000, 125000, 'active', 'Health', CURRENT_DATE - 20, CURRENT_DATE + 60, '/images/campaigns/campaign-6-disaster-relief.jpg', false),
('cddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 'Youth Tech Training Initiative', 'Teach coding and tech skills to underserved youth', 'Equip the next generation with in-demand tech skills.', 80000, 56000, 'active', 'Education', CURRENT_DATE - 10, CURRENT_DATE + 6, '/images/campaigns/campaign-7-youth-tech.jpg', false),
('ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 'Fresh Produce Community Gardens', 'Build community gardens to provide fresh produce', 'We are establishing 10 community gardens across underserved neighborhoods.', 60000, 48000, 'active', 'Environment', CURRENT_DATE - 25, CURRENT_DATE + 35, '/images/campaigns/campaign-8-community-gardens.jpg', false),
('cfffffff-ffff-ffff-ffff-ffffffffffff', '77777777-7777-7777-7777-777777777777', 'Every Birthday Matters Screening Initiative', 'Fund cancer screening outreach across Iowa communities', 'Support cancer screening outreach for early detection and prevention.', 75000, 42000, 'active', 'Health', CURRENT_DATE - 30, CURRENT_DATE + 90, '/images/campaigns/campaign-9-cancer-screening.jpg', false),
('d1111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 'Kelp Forest Restoration', 'Revitalizing underwater kelp forests to enhance marine biodiversity', 'Along the wild and rugged Pacific shoreline, a quiet underwater revolution is taking place.', 375000, 345000, 'active', 'Environment', CURRENT_DATE - 60, CURRENT_DATE + 14, '/images/campaigns/kelp/kelp-forest-main.png', true),
('d2222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', 'Amazon Rainforest Conservation', 'Protecting ancient rainforest ecosystems through community-led conservation', 'Deep within the verdant heart of Brazil''s Amazon Basin lies the village of Santo Antonio.', 500000, 420000, 'active', 'Environment', CURRENT_DATE - 45, CURRENT_DATE + 21, '/images/campaigns/amazon/amazon-featured.png', true);

-- Insert Sample Donations
INSERT INTO donations (id, user_id, campaign_id, organization_id, amount, status, payment_method, is_anonymous, donor_message, receipt_sent, created_at, updated_at) VALUES
('e1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c7777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 500.00, 'Completed', 'credit_card', false, 'Keep up the amazing work!', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('e2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 250.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('e3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c9999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 150.00, 'Completed', 'credit_card', true, NULL, true, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('e4444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'c8888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 1000.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('e5555555-5555-5555-5555-555555555555', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 2500.00, 'Completed', 'credit_card', false, 'Investing in our youth!', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('e6666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666', 750.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('e7777777-7777-7777-7777-777777777777', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'c7777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 333.00, 'Completed', 'credit_card', true, NULL, true, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
('e8888888-8888-8888-8888-888888888888', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 1200.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('e9999999-9999-9999-9999-999999999999', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 400.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
('eaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 600.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('ebbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'c8888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', 850.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('eccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 2000.00, 'Completed', 'credit_card', false, 'Education changes lives!', true, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('eddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'c9999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', 500.00, 'Completed', 'credit_card', true, NULL, true, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666', 3000.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('efffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '44444444-4444-4444-4444-444444444444', 300.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days');

-- Insert Sample Notifications
INSERT INTO notifications (id, user_id, title, body, type, is_read, created_at) VALUES
('f1111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Thank you for your donation!', 'Your $500 donation to Emergency Animal Shelter Expansion has been received.', 'DonationReceived', false, NOW() - INTERVAL '10 days'),
('f2222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Campaign Update', 'Emergency Animal Shelter Expansion is now 75% funded!', 'CampaignUpdate', false, NOW() - INTERVAL '5 days'),
('f3333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Welcome to Shift Giving', 'Thank you for joining our community of givers!', 'Welcome', true, NOW() - INTERVAL '30 days'),
('f4444444-4444-4444-4444-444444444444', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'New Campaign Alert', 'Check out the new Kelp Forest Restoration campaign!', 'NewCampaign', false, NOW() - INTERVAL '2 days');

-- Verify data was inserted
SELECT 'Organizations' as table_name, COUNT(*) as count FROM organizations
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Campaigns', COUNT(*) FROM campaigns
UNION ALL
SELECT 'Donations', COUNT(*) FROM donations
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;
