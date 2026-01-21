-- Update campaigns with coordinates, story content, and locations
-- Run this via bastion host to add missing data

-- Hope WDM Campaigns (West Des Moines, IA)
UPDATE campaigns SET
    latitude = 41.5772,
    longitude = -93.7113,
    location = 'West Des Moines, IA',
    story_content = 'The Pantry at Hope is a resource for neighbors who need help putting food on the table.

Your donation keeps shelves stocked with pantry staples and everyday essentials, and it supports volunteers who welcome guests with dignity and care.

Every Pantry Bundle helps provide consistent, practical support so families can focus on what matters most: stability, health, and hope.'
WHERE id = 'c1111111-1111-1111-1111-111111111111';

UPDATE campaigns SET
    latitude = 41.5772,
    longitude = -93.7113,
    location = 'West Des Moines, IA',
    story_content = 'Café Hope is a welcoming place to meet, work, and connect over coffee and food.

Every purchase supports mission partners, turning everyday moments into meaningful impact.

Meal Sponsors help keep the doors open and extend Hope''s reach through local and global partnerships.'
WHERE id = 'c2222222-2222-2222-2222-222222222222';

UPDATE campaigns SET
    latitude = 32.5149,
    longitude = -117.0382,
    location = 'Tijuana, Mexico',
    story_content = 'Homes of Hope partners with Youth With A Mission to build a home alongside a family in need.

Support covers materials, logistics, and team preparation so the work is safe, organized, and focused on relationship as much as construction.

Each Build Day moves a family closer to a stable home and a stronger future.'
WHERE id = 'c3333333-3333-3333-3333-333333333333';

UPDATE campaigns SET
    latitude = 41.5772,
    longitude = -93.7113,
    location = 'West Des Moines, IA',
    story_content = 'Thanksgiving Meal Packaging brings volunteers together to assemble meal kits for families facing hunger during the holiday season.

Meal Kits sponsor ingredients, packaging supplies, and distribution through trusted partners.

Your support helps families experience care and community when it matters most.'
WHERE id = 'c4444444-4444-4444-4444-444444444444';

UPDATE campaigns SET
    latitude = 41.5772,
    longitude = -93.7113,
    location = 'West Des Moines, IA',
    story_content = 'Souper Bowl season is a chance to rally together and stock local pantries with food and essential items.

Each Bag of Groceries helps provide practical support for neighbors, from pantry staples to household essentials.

Together, we can turn a simple drive into steady help for families across our community.'
WHERE id = 'c5555555-5555-5555-5555-555555555555';

UPDATE campaigns SET
    latitude = 41.5772,
    longitude = -93.7113,
    location = 'West Des Moines, IA',
    story_content = 'Back-to-School Drive helps students start the year prepared with supplies, snacks, and support.

Supply Kits fund practical items that remove barriers for students and help classrooms stay stocked through the year.

Your support helps students walk into school with confidence and the tools they need to learn.'
WHERE id = 'c6666666-6666-6666-6666-666666666666';

-- Paws Rescue Foundation (Portland, OR)
UPDATE campaigns SET
    latitude = 45.5152,
    longitude = -122.6784,
    location = 'Portland, OR',
    story_content = 'Paws Rescue Foundation is building a new emergency shelter wing to accommodate more animals in crisis.

Our current facility is at capacity with over 200 animals in care. With your support, we can expand our capacity to rescue and rehabilitate even more animals in need.

Every contribution helps provide shelter, medical care, and a path to a forever home for animals who have nowhere else to turn.'
WHERE id = 'c7777777-7777-7777-7777-777777777777';

UPDATE campaigns SET
    latitude = 45.5152,
    longitude = -122.6784,
    location = 'Portland, OR',
    story_content = 'As temperatures drop, outdoor and stray animals face critical danger from exposure.

Winter Warming Station provides heated shelters, warm bedding, and emergency care for animals caught in the cold.

Your support helps us set up warming stations throughout the community and provide emergency rescue services during dangerous weather events.'
WHERE id = 'c8888888-8888-8888-8888-888888888888';

-- Grace Community Church (Austin, TX)
UPDATE campaigns SET
    latitude = 30.2672,
    longitude = -97.7431,
    location = 'Austin, TX',
    story_content = 'Grace Community Church is expanding its community outreach initiatives to serve more neighbors in need.

We provide meals, counseling, educational workshops, and support services to families facing challenges.

Your generosity helps us extend our reach and deepen our impact in the community we call home.'
WHERE id = 'c9999999-9999-9999-9999-999999999999';

-- Future Leaders Youth Program (Chicago, IL)
UPDATE campaigns SET
    latitude = 41.8781,
    longitude = -87.6298,
    location = 'Chicago, IL',
    story_content = 'Education opens doors that might otherwise remain closed.

Our Scholarship Fund provides full scholarships to deserving youth from low-income families, covering tuition, books, and essential supplies.

Every scholarship represents a life transformed—a young person empowered to pursue their dreams and contribute to their community.'
WHERE id = 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- City Food Bank (Seattle, WA)
UPDATE campaigns SET
    latitude = 47.6062,
    longitude = -122.3321,
    location = 'Seattle, WA',
    story_content = 'City Food Bank serves 5,000 families weekly, but demand continues to grow.

Our Emergency Food Distribution Network expands our reach to underserved neighborhoods and ensures no family goes hungry.

Your support helps us purchase food, maintain our fleet, and coordinate volunteers who make distribution possible.'
WHERE id = 'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

-- Disaster Relief International (Miami, FL)
UPDATE campaigns SET
    latitude = 25.7617,
    longitude = -80.1918,
    location = 'Miami, FL',
    story_content = 'When disasters strike, immediate access to medical supplies can mean the difference between life and death.

We respond rapidly to natural disasters with emergency medical supplies, clean water, and shelter materials.

Your contribution helps us pre-position supplies and deploy response teams when communities need them most.'
WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

-- Youth Tech Training (Chicago, IL)
UPDATE campaigns SET
    latitude = 41.8781,
    longitude = -87.6298,
    location = 'Chicago, IL',
    story_content = 'The jobs of tomorrow require digital skills that many young people lack access to learn.

Youth Tech Training Initiative teaches coding, cybersecurity, and digital literacy to underserved youth, preparing them for careers in technology.

Your support provides computers, curriculum, and mentors who help young people discover their potential.'
WHERE id = 'cddddddd-dddd-dddd-dddd-dddddddddddd';

-- Fresh Produce Community Gardens (Seattle, WA)
UPDATE campaigns SET
    latitude = 47.6062,
    longitude = -122.3321,
    location = 'Seattle, WA',
    story_content = 'Fresh, healthy food should be accessible to everyone, regardless of neighborhood.

We are establishing 10 community gardens across underserved areas, providing fresh produce and teaching sustainable gardening practices.

Your support helps us build gardens, provide seeds and tools, and train community members to grow their own food.'
WHERE id = 'ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';

-- Cancer Screen Iowa (Des Moines, IA)
UPDATE campaigns SET
    latitude = 41.5868,
    longitude = -93.625,
    location = 'Des Moines, IA',
    story_content = 'Early detection saves lives. Cancer Screen Iowa brings life-saving screening services directly to communities across our state.

Our "Every Birthday Matters" initiative encourages Iowans to schedule cancer screenings on their birthday—making prevention a celebration of life.

Your support funds mobile screening units, outreach coordinators, and follow-up care that helps catch cancer early when it''s most treatable.'
WHERE id = 'cfffffff-ffff-ffff-ffff-ffffffffffff';

-- Kelp Forest Restoration (Newport, OR)
UPDATE campaigns SET
    latitude = 44.6368,
    longitude = -124.0534,
    location = 'Newport, OR',
    story_content = 'OREGON COAST, USA — Along the wild and rugged Pacific shoreline, a quiet underwater revolution is taking place. Once-thriving kelp forests that had withered under the weight of warming oceans and sea urchin overpopulation are now being brought back to life through a cutting-edge restoration project fueled by carbon offset support.

Marine biologist Elena Torres leads the effort. Clad in a wetsuit and equipped with underwater monitoring gear, she dives daily into the chilly coastal waters, carefully planting strands of bull kelp and monitoring their growth. "Every blade we plant is like a breath for the ocean," she says. "It absorbs carbon, shelters sea life, and helps stabilize the marine ecosystem."

The project has revitalized over 100 acres of kelp forest so far, creating critical habitat for fish, sea otters, and other marine species. Importantly, it supports sustainable local fisheries by boosting populations of commercially important species like rockfish and abalone.

Local fisherman Carlos Mendez has noticed a remarkable change. "The kelp forests are returning, and so are the fish," he says. "My catch has improved, and I''m hopeful for the future of our fishing community."

This initiative goes beyond just planting kelp—it involves ongoing monitoring, community engagement, and scientific collaboration to ensure long-term success. Carbon offset funds are directly channeled into scaling up restoration efforts, training local volunteers, and investing in the scientific research needed to sustain these ecosystems for generations to come.'
WHERE id = 'd1111111-1111-1111-1111-111111111111';

-- Amazon Rainforest Conservation (Manaus, Brazil)
UPDATE campaigns SET
    latitude = -3.4653,
    longitude = -62.2159,
    location = 'Manaus, Brazil',
    story_content = 'Deep within the verdant heart of Brazil''s Amazon Basin lies the village of Santo Antônio, a community that has long called the rainforest home. For generations, families here have depended on the forest—its rivers, wildlife, and land—to sustain their way of life. But over the past decades, encroaching deforestation, illegal logging, and agricultural expansion have threatened not only their livelihoods but the irreplaceable biodiversity that makes this region one of Earth''s most critical ecosystems.

Today, Maria''s grandson, João Carvalho, leads the village conservation effort. A dynamic young leader with boundless energy, João works tirelessly alongside community members to patrol the forest boundaries, replant native trees, and educate neighboring villages about sustainable practices. Each day, João and his team carefully document wildlife sightings, monitor biodiversity, and remove illegal logging traps, knowing their efforts protect both their heritage and the planet''s future.

Crucially, the funding provided by carbon offset purchases is vital for sustaining these reforestation and conservation efforts. It allows the Santo Antônio community to access essential resources, training, and equipment necessary to protect and restore their beloved rainforest.

By supporting this project, contributors directly empower local guardians of the Amazon—helping them plant trees, monitor ecosystems, and safeguard biodiversity. Every contribution is a tangible step toward preserving the irreplaceable lungs of our planet and ensuring that communities like Santo Antônio can continue their vital stewardship for generations to come.'
WHERE id = 'd2222222-2222-2222-2222-222222222222';

-- Add donations for Justyn user
INSERT INTO donations (id, user_id, campaign_id, organization_id, amount, status, payment_method, is_anonymous, donor_message, receipt_sent, created_at, updated_at) VALUES
('f1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd1111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888888', 15000.00, 'Completed', 'credit_card', false, 'Proud to support ocean conservation!', true, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),
('f2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'd2222222-2222-2222-2222-222222222222', '99999999-9999-9999-9999-999999999999', 20000.00, 'Completed', 'credit_card', false, 'The Amazon needs our help!', true, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('f3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 5000.00, 'Completed', 'credit_card', false, 'Feeding families matters', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('f4444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555', 2500.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('f5555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c7777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', 1250.00, 'Completed', 'credit_card', false, 'Every animal deserves a home', true, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('f6666666-6666-6666-6666-666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 2000.00, 'Completed', 'credit_card', false, NULL, true, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Verify updates
SELECT title, latitude, longitude, location,
       CASE WHEN story_content IS NOT NULL AND LENGTH(story_content) > 50 THEN 'Yes' ELSE 'No' END as has_story
FROM campaigns;
