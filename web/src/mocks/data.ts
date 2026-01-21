import {
  AuthUser,
  Campaign,
  CampaignDetail,
  Organization,
  Donation,
  MediaAsset,
  MediaGalleryItem,
} from '../api/types';

const users: Record<string, AuthUser & { password: string }> = {
  'justyn@justyn.com': {
    id: 'user-justyn',
    email: 'justyn@justyn.com',
    firstName: 'Justyn',
    lastName: 'Miller',
    userType: 'SiteAdmin',
    avatarUrl: '/images/avatars/avatar-justyn.png',
    password: 'Password123!',
  },
  'donor@example.com': {
    id: 'user-1',
    email: 'donor@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    userType: 'Donor',
    avatarUrl: '/images/avatars/avatar-sarah.jpg',
    password: 'Password123!',
  },
  'orgadmin@example.com': {
    id: 'user-2',
    email: 'orgadmin@example.com',
    firstName: 'Michael',
    lastName: 'Chen',
    userType: 'OrganizationAdmin',
    avatarUrl: '/images/avatars/avatar-michael.jpg',
    password: 'Password123!',
  },
  'siteadmin@example.com': {
    id: 'user-3',
    email: 'siteadmin@example.com',
    firstName: 'Jennifer',
    lastName: 'Williams',
    userType: 'SiteAdmin',
    avatarUrl: '/images/avatars/avatar-jennifer.jpg',
    password: 'Password123!',
  },
};

const organizations: Organization[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Lutheran Church Of Hope - WDM',
    description:
      "Hope's Missions Team partners locally and globally to coordinate service projects, mission trips, and outreach opportunities.",
    logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
    campaignCount: 6,
    latitude: 41.5772,
    longitude: -93.7113,
    category: 'Community',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Paws Rescue Foundation',
    description: 'Dedicated to rescuing and rehoming abandoned animals. 501(c)(3) nonprofit.',
    logoUrl: '/images/organizations/org-1-paws-rescue-v3.png',
    campaignCount: 2,
    latitude: 45.5152,
    longitude: -122.6784,
    category: 'Animals',
    locations: [
      { name: 'Portland, OR (Headquarters)', latitude: 45.5152, longitude: -122.6784 },
      { name: 'Dothan, AL', latitude: 31.2232, longitude: -85.3905 },
      { name: 'Cincinnati, OH', latitude: 39.1031, longitude: -84.512 },
      { name: 'Kansas City, MO', latitude: 39.0997, longitude: -94.5786 },
      { name: 'Fargo, ND', latitude: 46.8772, longitude: -96.7898 },
    ],
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    name: 'Ocean Restoration Coalition',
    description:
      'Dedicated to revitalizing marine ecosystems through cutting-edge restoration projects. 501(c)(3) nonprofit.',
    logoUrl: '/images/campaigns/kelp/kelp-forest-main.png',
    campaignCount: 1,
    latitude: 44.6,
    longitude: -124.5,
    category: 'Environment',
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Grace Community Church',
    description: 'Faith-based organization serving the local community. 501(c)(3) nonprofit.',
    logoUrl: '/images/organizations/org-2-grace-church-v3.jpg',
    campaignCount: 2,
    latitude: 30.2672,
    longitude: -97.7431,
    category: 'Community',
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'City Food Bank',
    description: 'Fighting food insecurity and hunger in our community. 501(c)(3) nonprofit.',
    logoUrl: '/images/organizations/org-3-food-bank-v3.png',
    campaignCount: 2,
    latitude: 47.6062,
    longitude: -122.3321,
    category: 'Community',
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Future Leaders Youth Program',
    description: 'Empowering youth through education and mentorship. 501(c)(3) nonprofit.',
    logoUrl: '/images/organizations/org-4-future-leaders-v2.png',
    campaignCount: 2,
    latitude: 41.8781,
    longitude: -87.6298,
    category: 'Education',
    locations: [
      { name: 'Chicago, IL (Headquarters)', latitude: 41.8781, longitude: -87.6298 },
      { name: 'Denver, CO', latitude: 39.7392, longitude: -104.9903 },
      { name: 'Las Vegas, NV', latitude: 36.1699, longitude: -115.1398 },
      { name: 'San Diego, CA', latitude: 32.7157, longitude: -117.1611 },
    ],
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Disaster Relief International',
    description: 'Providing emergency aid to disaster-affected communities. 501(c)(3) nonprofit.',
    logoUrl: '/images/organizations/org-5-disaster-relief.png',
    campaignCount: 2,
    latitude: 25.7617,
    longitude: -80.1918,
    category: 'Health',
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    name: 'Cancer Screen Iowa',
    description:
      'A statewide public-private partnership dedicated to increasing early cancer detection across Iowa. Early detection saves lives.',
    logoUrl: '/images/organizations/org-6-cancer-screen-iowa.png',
    campaignCount: 1,
    latitude: 41.5868,
    longitude: -93.625,
    category: 'Health',
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    name: 'Amazon Conservation Trust',
    description:
      'Working with indigenous communities to protect the Amazon rainforest through sustainable conservation and community empowerment. 501(c)(3) nonprofit.',
    logoUrl: '/images/campaigns/amazon/amazon-featured.png',
    campaignCount: 1,
    latitude: -3.4653,
    longitude: -62.2159,
    category: 'Environment',
  },
];

const campaigns: Campaign[] = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Kelp Forest Restoration',
    shortDescription:
      'Revitalizing underwater kelp forests to enhance marine biodiversity and carbon sequestration while supporting sustainable fisheries.',
    goalAmount: 375000,
    raisedAmount: 345000,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/kelp/kelp-forest-main.png',
    organization: {
      id: '88888888-8888-8888-8888-888888888888',
      name: 'Ocean Restoration Coalition',
      logoUrl: '/images/campaigns/kelp/kelp-forest-main.png',
    },
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Environment',
    location: 'Oregon Coast, USA',
    latitude: 44.6,
    longitude: -124.5,
    unitLabel: '1 ton CO₂ Offset',
    unitPrice: 25,
    impactLabel: 'Acres Protected',
    fundingPercentage: 92,
    mediaGallery: [
      {
        type: 'video',
        url: '/images/campaigns/kelp/kelp-forest-main.gif',
        caption: 'Kelp forest restoration in action',
      },
      {
        type: 'image',
        url: '/images/campaigns/kelp/kelp-diver-urchin.png',
        caption: 'Marine Life in Restored Kelp Forest',
      },
      {
        type: 'image',
        url: '/images/campaigns/kelp/kelp-elena-planting.png',
        caption: 'Underwater Kelp Restoration Work',
      },
      {
        type: 'image',
        url: '/images/campaigns/kelp/kelp-fish-ecosystem.png',
        caption: 'Thriving Kelp Forest Ecosystem',
      },
    ],
    storyContent: `OREGON COAST, USA — Along the wild and rugged Pacific shoreline, a quiet underwater revolution is taking place. Once-thriving kelp forests that had withered under the weight of warming oceans and sea urchin overpopulation are now being brought back to life through a cutting-edge restoration project fueled by carbon offset support.

Marine biologist Elena Torres leads the effort. Clad in a wetsuit and equipped with underwater monitoring gear, she dives daily into the chilly coastal waters, carefully planting strands of bull kelp and monitoring their growth. "Every blade we plant is like a breath for the ocean," she says. "It absorbs carbon, shelters sea life, and helps stabilize the marine ecosystem."

The project has revitalized over 100 acres of kelp forest so far, creating critical habitat for fish, sea otters, and other marine species. Importantly, it supports sustainable local fisheries by boosting populations of commercially important species like rockfish and abalone.

The initiative has also become an economic anchor for coastal communities. Fishermen like Jason Kim have joined the restoration workforce in the off-season, blending traditional ocean knowledge with new conservation training. "I never thought I'd be farming seaweed," Jason laughs, "but I know I'm helping the ocean and protecting my way of life."

Funding from carbon offset purchases has been key to scaling the project—supporting dive operations, research equipment, and community outreach. These investments not only restore biodiversity but actively remove carbon from the atmosphere, with kelp forests among the fastest natural carbon sequesters on the planet.

Back on shore, schoolchildren from nearby towns visit the project's education center, learning about ocean health and climate solutions. Their wide eyes and curious questions reflect a growing awareness of how connected their future is to the life below the waves.

As sunbeams pierce the water's surface and dance across rising strands of kelp, the forest comes alive once more—an underwater testament to nature's resilience and what's possible when communities, science, and sustainability unite.`,
  },
  {
    id: 'c7777777-7777-7777-7777-777777777777',
    title: 'Emergency Animal Shelter Expansion',
    shortDescription: 'Help us expand our shelter to rescue more animals in need',
    goalAmount: 50000,
    raisedAmount: 37500,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/campaign-1-animal-shelter.jpg',
    organization: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Paws Rescue Foundation',
      logoUrl: '/images/organizations/org-1-paws-rescue-v3.png',
    },
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Animals',
    location: 'Portland, OR',
    latitude: 45.5152,
    longitude: -122.6784,
    locations: [
      { name: 'Portland, OR (Headquarters)', latitude: 45.5152, longitude: -122.6784 },
      { name: 'Cincinnati, OH', latitude: 39.1031, longitude: -84.512 },
      { name: 'Kansas City, MO', latitude: 39.0997, longitude: -94.5786 },
      { name: 'Fargo, ND', latitude: 46.8772, longitude: -96.7898 },
    ],
    unitLabel: 'Help One Pet',
    unitPrice: 25,
    impactLabel: 'Animals Helped',
    storyContent: `Our shelter is bursting at the seams with rescued animals waiting for forever homes. With your support, we can build a new wing that will house 150 additional dogs, cats, and small animals.

Each rescued animal receives veterinary care, behavioral training, and endless love from our dedicated staff. The expansion includes a state-of-the-art medical facility, climate-controlled kennels, and a socialization area where shy animals can learn to trust again.

Last year alone, we turned away over 200 animals due to space constraints. This expansion means no more heartbreaking decisions about which animals we can save.

Every donation brings us closer to a future where no animal is turned away from safety and love.`,
  },
  {
    id: 'c8888888-8888-8888-8888-888888888888',
    title: 'Winter Warming Station',
    shortDescription: 'Provide shelter and warmth for animals during winter',
    goalAmount: 25000,
    raisedAmount: 18750,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/campaign-2-winter-warming.jpg',
    organization: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Paws Rescue Foundation',
      logoUrl: '/images/organizations/org-1-paws-rescue-v3.png',
    },
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Animals',
    location: 'Dothan, AL',
    latitude: 31.2232,
    longitude: -85.3905,
    unitLabel: 'Warming Station',
    unitPrice: 75,
    impactLabel: 'Pets Helped',
    storyContent: `When temperatures plummet below freezing, homeless and outdoor animals face life-threatening conditions. Our Winter Warming Station program deploys heated shelters, thermal blankets, and emergency food supplies to vulnerable animals across the Pacific Northwest.

Our rapid response teams work around the clock during winter storms, rescuing animals from dangerous conditions and providing immediate medical care for hypothermia and frostbite. Each warming station can protect up to 10 animals from the deadly cold.

We partner with local businesses and homeowners to create a network of safe havens. Your donation provides the heating equipment, insulated bedding, high-calorie food, and veterinary supplies that keep animals alive through the harshest months.`,
  },
  {
    id: 'c9999999-9999-9999-9999-999999999999',
    title: 'Community Outreach Program',
    shortDescription: 'Expand our outreach and community support services',
    goalAmount: 75000,
    raisedAmount: 52500,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/campaign-3-community-outreach.jpg',
    organization: {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Grace Community Church',
      logoUrl: '/images/organizations/org-2-grace-church-v3.jpg',
    },
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Community',
    location: 'Austin, TX',
    latitude: 30.2672,
    longitude: -97.7431,
    locations: [
      { name: 'Austin, TX (Headquarters)', latitude: 30.2672, longitude: -97.7431 },
      { name: 'Broken Arrow, OK', latitude: 36.0526, longitude: -95.7975 },
      { name: 'Tampa, FL', latitude: 27.9506, longitude: -82.4572 },
      { name: 'Cincinnati, OH', latitude: 39.1031, longitude: -84.512 },
    ],
    unitLabel: 'Help 5 People',
    unitPrice: 25,
    impactLabel: 'Families Helped',
    storyContent: `Grace Community Church has been a beacon of hope in Austin for over three decades, and now we are expanding our reach to serve more neighbors in need.

Our Community Outreach Program provides hot meals, professional counseling, job training workshops, and emergency financial assistance to families facing hardship. Every week, our dedicated volunteers prepare and serve over 500 nutritious meals in our community kitchen.

Our counseling center offers free sessions with licensed therapists, helping individuals navigate grief, addiction recovery, and family challenges. The job training program has helped 127 participants find stable employment in the past year alone.

With your support, we can open a new outreach center in East Austin, hire additional staff, and double the number of families we serve.`,
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/campaign-3-community-outreach.jpg',
        caption: 'Community Outreach Program',
      },
      {
        type: 'image',
        url: '/images/media/gallery-community-support.jpg',
        caption: 'Volunteers serving meals at our community kitchen',
      },
      {
        type: 'image',
        url: '/images/media/gallery-donation-collection.jpg',
        caption: 'Community members coming together for support',
      },
    ],
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Amazon Rainforest Conservation',
    shortDescription:
      'Protecting ancient rainforest ecosystems through community-led conservation efforts and sustainable land management practices.',
    goalAmount: 500000,
    raisedAmount: 420000,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/amazon/amazon-featured.png',
    organization: {
      id: '99999999-9999-9999-9999-999999999999',
      name: 'Amazon Conservation Trust',
      logoUrl: '/images/campaigns/amazon/amazon-featured.png',
    },
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Environment',
    location: 'Amazon Basin, Brazil',
    latitude: -3.4653,
    longitude: -62.2159,
    unitLabel: '1 ton CO₂ Offset',
    unitPrice: 20,
    impactLabel: 'Acres Protected',
    fundingPercentage: 84,
    mediaGallery: [
      {
        type: 'video',
        url: '/images/campaigns/amazon/amazon-main.gif',
        caption: 'Journey through the Amazon rainforest',
      },
      {
        type: 'image',
        url: '/images/campaigns/amazon/amazon-village.png',
        caption: 'Maria Carvalho shares stories with village children',
      },
      {
        type: 'image',
        url: '/images/campaigns/amazon/amazon-conservation.png',
        caption: 'João leads the community conservation patrol',
      },
      {
        type: 'image',
        url: '/images/campaigns/amazon/amazon-trees.jpg',
        caption: 'Ancient rainforest canopy in Santo Antônio',
      },
    ],
    storyContent: `Deep within the verdant heart of Brazil's Amazon Basin, nestled beside the gentle curves of the winding Rio Negro, lies the village of Santo Antônio. For generations, its indigenous inhabitants have lived in harmony with the ancient rainforest, relying on its vast resources while preserving its delicate balance. Maria Carvalho, a respected elder and natural storyteller, vividly remembers the lush forests of her childhood—echoing with the calls of toucans and the rustle of jaguars moving through the dense canopy.

Today, Maria's grandson, João Carvalho, leads the village conservation effort. A dynamic young leader with boundless energy, João works tirelessly alongside community members to patrol the forest boundaries, replant native trees, and educate neighboring villages about sustainable practices. Each day, João and his team carefully document wildlife sightings, monitor biodiversity, and remove illegal logging traps, knowing their efforts protect both their heritage and the planet's future.

Crucially, the funding provided by carbon offset purchases is vital for sustaining these reforestation and conservation efforts. It allows the Santo Antônio community to access essential resources, training, and equipment necessary to protect and restore their beloved rainforest.

Their mission not only safeguards countless endangered species but also maintains vital carbon storage, essential for global climate stability. Through a cooperative approach, the project has established thriving agroforestry plots, blending traditional knowledge with modern science, ensuring food security and income for Santo Antônio's families.

Local mother and artisan, Luciana Mendes, creates vibrant jewelry from sustainably sourced seeds, weaving economic resilience directly from nature's abundance. Luciana's smile beams with pride as her handmade crafts reach global audiences, sharing the story of their home and its conservation journey.

For Maria, João, Luciana, and the entire Santo Antônio community, this conservation initiative is more than a project—it's a testament to their unwavering bond with the Amazon. Their passion, wisdom, and dedication illuminate a hopeful path forward, one where humans and nature flourish together in mutual respect and abundance.`,
  },
  {
    id: 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    title: 'Scholarship Fund for Underprivileged Youth',
    shortDescription: 'Support education and development for youth in need',
    goalAmount: 100000,
    raisedAmount: 62000,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/campaign-4-scholarship.jpg',
    organization: {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'Future Leaders Youth Program',
      logoUrl: '/images/organizations/org-4-future-leaders-v2.png',
    },
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Education',
    location: 'Chicago, IL',
    latitude: 41.8781,
    longitude: -87.6298,
    locations: [
      { name: 'Chicago, IL (Headquarters)', latitude: 41.8781, longitude: -87.6298 },
      { name: 'Denver, CO', latitude: 39.7392, longitude: -104.9903 },
      { name: 'Las Vegas, NV', latitude: 36.1699, longitude: -115.1398 },
      { name: 'San Diego, CA', latitude: 32.7157, longitude: -117.1611 },
    ],
    unitLabel: 'Help 10 Kids',
    unitPrice: 50,
    impactLabel: 'Youth Helped',
    storyContent: `Education is the great equalizer, yet thousands of talented students in Chicago lack the financial resources to pursue their dreams. Our Scholarship Fund provides comprehensive support for underprivileged youth, covering not just tuition but books, laptops, transportation, and living expenses.

We currently have 25 exceptional students waiting to start college this fall—young people who have overcome tremendous obstacles and maintained outstanding academic records. Many are the first in their families to attend college.

Beyond financial support, our program pairs each scholar with a professional mentor who provides guidance on career paths, internship opportunities, and professional development. Last year, 94% of our scholars graduated on time, and 89% secured employment or graduate school placement within six months of graduation.`,
  },
  {
    id: 'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    title: 'Emergency Food Distribution Network',
    shortDescription: 'Expand food distribution to reach more families',
    goalAmount: 150000,
    raisedAmount: 105000,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/campaign-5-food-distribution.jpg',
    organization: {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'City Food Bank',
      logoUrl: '/images/organizations/org-3-food-bank-v3.png',
    },
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Community',
    location: 'Seattle, WA',
    latitude: 47.6062,
    longitude: -122.3321,
    unitLabel: 'Feed a Family',
    unitPrice: 35,
    impactLabel: 'Families Fed',
    storyContent: `Food insecurity affects one in eight families in the Seattle metro area, and demand at City Food Bank continues to surge. Currently serving 5,000 families weekly, we need to expand our distribution network to reach an additional 2,000 households in underserved neighborhoods.

Our plan includes three new mobile distribution points, a refrigerated delivery truck for perishables, and partnerships with 15 additional grocery stores for food rescue. Each family receives a week's worth of nutritious food including fresh produce, proteins, dairy, and pantry staples.

We also provide culturally appropriate foods, recognizing the diverse communities we serve. Our volunteer network of 200+ dedicated individuals ensures that food reaches families with dignity and respect. No family should have to choose between food and other basic necessities.`,
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    title: 'Disaster Relief Medical Supplies',
    shortDescription: 'Provide critical medical supplies to disaster victims',
    goalAmount: 200000,
    raisedAmount: 125000,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/campaign-6-disaster-relief.jpg',
    organization: {
      id: '66666666-6666-6666-6666-666666666666',
      name: 'Disaster Relief International',
      logoUrl: '/images/organizations/org-5-disaster-relief.png',
    },
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Health',
    location: 'Miami, FL',
    latitude: 25.7617,
    longitude: -80.1918,
    unitLabel: 'Medical Kit',
    unitPrice: 100,
    impactLabel: 'Lives Supported',
    storyContent: `When disaster strikes, every minute counts. Disaster Relief International maintains emergency stockpiles of life-saving medical supplies ready for immediate deployment anywhere in the world.

Our kits include trauma supplies, medications, surgical equipment, clean water purification systems, and portable medical shelters. In the past year alone, we've responded to 23 natural disasters across 15 countries, providing medical care to over 50,000 people.

Our trained medical teams can be on the ground within 48 hours of a disaster declaration. Your donation helps us replenish our stockpiles, maintain our fleet of emergency response vehicles, and train local volunteers who serve as first responders in their communities.

When hurricanes, earthquakes, or floods strike, we are ready—but only with your continued support.`,
  },
  {
    id: 'cddddddd-dddd-dddd-dddd-dddddddddddd',
    title: 'Youth Tech Training Initiative',
    shortDescription: 'Teach coding and tech skills to underserved youth',
    goalAmount: 80000,
    raisedAmount: 56000,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/campaign-7-youth-tech.jpg',
    organization: {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'Future Leaders Youth Program',
      logoUrl: '/images/organizations/org-4-future-leaders-v2.png',
    },
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Education',
    location: 'Denver, CO',
    latitude: 39.7392,
    longitude: -104.9903,
    unitLabel: 'Tech Training',
    unitPrice: 40,
    impactLabel: 'Students Trained',
    storyContent: `The tech industry is booming, but underserved youth often lack access to the training and resources needed to break into this high-paying field. Our Youth Tech Training Initiative provides free 12-week coding bootcamps, laptops, and mentorship to young people ages 16-24 from low-income families.

Students learn in-demand skills including JavaScript, Python, web development, and data analysis. But we go beyond technical skills—our program includes resume building, interview preparation, and direct connections to hiring partners.

Our graduates have been hired by companies including Google, Microsoft, and numerous local startups. With a 78% job placement rate and an average starting salary of $52,000, this program is transforming lives and breaking the cycle of poverty.

Your support provides equipment, curriculum materials, and instructor salaries.`,
  },
  {
    id: 'ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    title: 'Fresh Produce Community Gardens',
    shortDescription: 'Build community gardens to provide fresh produce',
    goalAmount: 60000,
    raisedAmount: 48000,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/campaign-8-community-gardens.jpg',
    organization: {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'City Food Bank',
      logoUrl: '/images/organizations/org-3-food-bank-v3.png',
    },
    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Environment',
    location: 'Tacoma, WA',
    latitude: 47.2529,
    longitude: -122.4443,
    locations: [
      { name: 'Tacoma, WA (Headquarters)', latitude: 47.2529, longitude: -122.4443 },
      { name: 'Baltimore, MD', latitude: 39.2904, longitude: -76.6122 },
      { name: 'Charlotte, NC', latitude: 35.2271, longitude: -80.8431 },
      { name: 'Boston, MA', latitude: 42.3601, longitude: -71.0589 },
    ],
    unitLabel: 'Garden Plot',
    unitPrice: 30,
    impactLabel: 'Gardens Created',
    storyContent: `In food deserts across Seattle, families often have to travel miles to find fresh vegetables and fruits. Our Community Gardens initiative is changing that by transforming vacant lots into thriving urban farms.

We are establishing 10 new gardens in underserved neighborhoods, each producing thousands of pounds of organic produce annually. Beyond providing fresh food, these gardens create green spaces where neighbors connect, children learn where food comes from, and community bonds strengthen.

Our job training program teaches sustainable agriculture skills, preparing participants for careers in urban farming and landscaping. Each garden plot is maintained by local volunteers who take home a share of the harvest.

Your donation funds seeds, soil amendments, irrigation systems, tools, and garden coordinator salaries.`,
  },
  {
    id: 'cfffffff-ffff-ffff-ffff-ffffffffffff',
    title: 'Every Birthday Matters Screening Initiative',
    shortDescription: 'Fund cancer screening outreach across Iowa communities',
    goalAmount: 75000,
    raisedAmount: 42000,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/campaign-9-cancer-screening.jpg',
    organization: {
      id: '77777777-7777-7777-7777-777777777777',
      name: 'Cancer Screen Iowa',
      logoUrl: '/images/organizations/org-6-cancer-screen-iowa.png',
    },
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Health',
    location: 'Phoenix, AZ',
    latitude: 33.4484,
    longitude: -112.074,
    unitLabel: 'Screening',
    unitPrice: 50,
    impactLabel: 'Screenings Funded',
    storyContent: `Early detection saves lives. Cancer Screen Iowa brings life-saving cancer screenings directly to underserved communities across the state through our mobile screening units.

Many Iowans lack access to regular healthcare due to distance, cost, or work schedules. Our "Every Birthday Matters" program provides free mammograms, colonoscopies, skin cancer checks, and lung cancer screenings to anyone who needs them, regardless of ability to pay.

We deploy our medical vans to rural communities, workplaces, and community centers, removing barriers that prevent people from getting screened. Each screening includes follow-up care coordination with local healthcare providers.

Last year, we performed over 3,000 screenings and detected 47 cancers at early, treatable stages. Your donation provides screening equipment, medical supplies, fuel for our mobile units, and salaries for our healthcare professionals.`,
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/campaign-9-cancer-screening.jpg',
        caption: 'Every Birthday Matters Screening Initiative',
      },
      {
        type: 'image',
        url: '/images/campaigns/cancer-screening/mobile-screening-unit.jpg',
        caption: 'Mobile cancer screening unit',
      },
      {
        type: 'image',
        url: '/images/campaigns/cancer-screening/medical-professional-screening.jpg',
        caption: 'Medical professional conducting screening',
      },
      {
        type: 'image',
        url: '/images/campaigns/cancer-screening/community-health-outreach.jpg',
        caption: 'Community health education outreach',
      },
    ],
  },
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    title: 'The Pantry at Hope',
    shortDescription: 'Provide food and pantry staples for neighbors in need',
    goalAmount: 25000,
    raisedAmount: 16250,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/hope/pantry.jpg',
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
    },
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Community',
    location: 'West Des Moines, IA',
    latitude: 41.5772,
    longitude: -93.7113,
    unitLabel: 'Pantry Bundle',
    unitPrice: 25,
    impactLabel: 'Families Served',
    fundingPercentage: 88,
    storyContent: `The Pantry at Hope serves as a lifeline for hundreds of families in the West Des Moines area who struggle to put food on the table. Open three days a week, our welcoming volunteers greet every guest with dignity and respect, helping them select from a wide variety of nutritious foods.

We offer fresh produce, proteins, dairy, and shelf-stable staples—everything a family needs for balanced meals. Last year, we distributed over 50,000 pounds of food to our neighbors in need. Each Pantry Bundle provides a week's worth of groceries for a family of four, carefully curated to include balanced nutrition and culturally appropriate options.

Beyond food, we also offer diapers, personal care items, and household essentials because we understand that food insecurity is just one piece of the puzzle. Many families come to us during unexpected crises—job loss, medical emergencies, or other hardships that can happen to anyone.

Your support keeps our shelves stocked and our doors open to anyone who walks through. Every donation, no matter the size, makes a tangible difference in the life of a neighbor.`,
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/pantry/pantry-2048.jpg',
        caption: 'The Pantry at Hope',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/pantry/pantry-volunteer-2048.jpg',
        caption: 'Volunteers serving with care',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/pantry/pantry-card.png',
        caption: 'The Pantry',
      },
    ],
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    title: 'Café Hope',
    shortDescription: 'Support mission partners through every cup and every meal',
    goalAmount: 15000,
    raisedAmount: 9800,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/hope/cafe-hope.png',
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
    },
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Community',
    location: 'West Des Moines, IA',
    latitude: 41.5772,
    longitude: -93.7113,
    unitLabel: 'Meal Sponsor',
    unitPrice: 15,
    impactLabel: 'Community Meals',
    storyContent: `Café Hope is more than just a coffee shop—it's a community gathering space where every latte and sandwich fuels meaningful change. Located in the heart of Lutheran Church of Hope's campus, our café welcomes neighbors for conversation, connection, and nourishment.

All proceeds support Hope's mission partners, both locally and around the world, making every purchase an act of generosity. From supporting clean water projects in developing nations to funding after-school programs for at-risk youth, your Meal Sponsor donation extends our reach far beyond West Des Moines.

Our trained baristas craft specialty drinks using ethically sourced beans, while our kitchen team prepares fresh, wholesome meals daily. Whether you're meeting a friend, working remotely, or just grabbing a quick bite, Café Hope invites you to be part of something bigger.

Every cup of coffee, every meal purchased, every Meal Sponsor donation creates ripples of positive change that touch lives across the globe. Join us in turning everyday moments into lasting impact.`,
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/cafe-hope.png',
        caption: 'Café Hope',
      },
    ],
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    title: 'Homes of Hope – YWAM (Tijuana, Mexico)',
    shortDescription: 'Help build a home with a family in need through a mission partnership',
    goalAmount: 60000,
    raisedAmount: 41250,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/hope/mission-trips.png',
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
    },
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Community',
    location: 'Tijuana, Mexico',
    latitude: 32.5149,
    longitude: -117.0382,
    unitLabel: 'Build Day',
    unitPrice: 100,
    impactLabel: 'Build Hours',
    fundingPercentage: 91,
    storyContent: `In the hills surrounding Tijuana, Mexico, thousands of families live in makeshift shelters cobbled together from pallets, tarps, and discarded materials. Through our partnership with Youth With A Mission (YWAM), teams from Hope travel to Mexico to build simple but sturdy homes alongside the families who will live in them.

In just two days, a team of 12 volunteers can construct a complete house—concrete floors, wooden frame, weatherproof roof, windows, and a door with a lock. For many families, it's the first time they've ever had a front door.

Beyond the physical structure, something profound happens when a family works shoulder-to-shoulder with volunteers from Iowa. Relationships form, prayers are shared, and hope is restored.

Your Build Day donation covers materials, tools, transportation, and team preparation, ensuring every volunteer is ready to serve safely and effectively.`,
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/homes-of-hope/hoh-1.jpg',
        caption: 'Serving side-by-side on the build site',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/homes-of-hope/hoh-2.jpg',
        caption: 'Framing a home together',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/homes-of-hope/hoh-3.jpg',
        caption: 'Raising roof trusses safely',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/homes-of-hope/hoh-4.jpg',
        caption: 'Building materials and framing in progress',
      },
    ],
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    title: 'Thanksgiving Meal Packaging',
    shortDescription: 'Pack meals for families facing hunger during the holiday season',
    goalAmount: 20000,
    raisedAmount: 13750,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/hope/thanksgiving-turkey.jpg',
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
    },
    endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Community',
    location: 'West Des Moines, IA',
    latitude: 41.5772,
    longitude: -93.7113,
    unitLabel: 'Meal Kit',
    unitPrice: 20,
    impactLabel: 'Meals Packed',
    storyContent: `The holiday season should be a time of warmth and togetherness, but for many families in central Iowa, Thanksgiving can highlight just how difficult times have become. Our Thanksgiving Meal Packaging event brings together hundreds of volunteers who assemble complete holiday meal kits for families facing food insecurity.

Each Meal Kit includes a turkey or ham, stuffing mix, mashed potatoes, gravy, green beans, cranberry sauce, rolls, and pumpkin pie—everything needed for a traditional feast. Last year, we packaged and distributed over 1,500 complete meals to families throughout the Des Moines metro area.

Beyond the food itself, each kit includes a note of encouragement and information about additional resources available through Hope. Your donation covers the cost of food, packaging supplies, and distribution logistics, ensuring that no family sits at an empty table this Thanksgiving.`,
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/thanksgiving-turkey.jpg',
        caption: 'Thanksgiving meal packaging',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/thanksgiving-meals/meal-1.jpg',
        caption: 'Creamy mashed potatoes with butter and gravy',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/thanksgiving-meals/meal-2.jpg',
        caption: 'Traditional Thanksgiving stuffing',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/thanksgiving-meals/meal-3.jpg',
        caption: 'Green bean casserole with crispy onions',
      },
    ],
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    title: 'Souper Bowl Food Drive',
    shortDescription: 'Stock local pantries with nonperishable food and essentials',
    goalAmount: 12000,
    raisedAmount: 8350,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/hope/souper-bowl.jpg',
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
    },
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Community',
    location: 'West Des Moines, IA',
    latitude: 41.5772,
    longitude: -93.7113,
    unitLabel: 'Bag of Groceries',
    unitPrice: 18,
    impactLabel: 'Pantry Donations',
    storyContent: `While millions gather to watch the big game, we're tackling a different kind of challenge: hunger in our community. The Souper Bowl Food Drive transforms football season into a season of giving by collecting nonperishable food items and essential goods for local pantries.

This friendly competition encourages families, small groups, and organizations to fill grocery bags with items like canned soups, vegetables, pasta, peanut butter, cereal, and toiletries. Last year's drive collected over 8,000 pounds of food, enough to stock multiple food pantries for weeks.

Each Bag of Groceries you sponsor provides practical help for a neighbor in need—someone who might be choosing between paying rent and buying food. The items go directly to The Pantry at Hope and partner organizations throughout the Des Moines metro.

It's a simple concept: score a touchdown against hunger, one can at a time.`,
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/souper-bowl.jpg',
        caption: 'Souper Bowl Food Drive',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/souper-bowl/soup-1.jpg',
        caption: 'Canned foods ready to donate',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/souper-bowl/soup-6.jpg',
        caption: 'Shelf-stable pantry items',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/souper-bowl/soup-5.jpg',
        caption: 'Pantry shelves stocked with essentials',
      },
    ],
  },
  {
    id: 'c6666666-6666-6666-6666-666666666666',
    title: 'Back-to-School Drive',
    shortDescription: 'Help students start the year with supplies, snacks, and support',
    goalAmount: 18000,
    raisedAmount: 10900,
    status: 'Active',
    featuredImageUrl: '/images/campaigns/hope/school-drive.jpg',
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
    },
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Education',
    location: 'West Des Moines, IA',
    latitude: 41.5772,
    longitude: -93.7113,
    unitLabel: 'Supply Kit',
    unitPrice: 30,
    impactLabel: 'Students Supported',
    storyContent: `Every child deserves to walk into their classroom on the first day of school feeling confident and prepared. Our Back-to-School Drive ensures that students from low-income families have the supplies they need to succeed.

Each Supply Kit contains grade-appropriate items including a quality backpack, notebooks, pencils, pens, crayons, markers, scissors, glue sticks, rulers, folders, and more. We also include healthy snacks and water bottles because learning is hard on an empty stomach.

Last year, we equipped over 600 students across a dozen schools in the West Des Moines and surrounding areas. Teachers tell us that students who receive these kits participate more actively in class and feel less anxiety about being different from their peers.

Your donation removes a barrier to learning and sends a powerful message to every child: you matter, and we believe in you.`,
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/back-to-school/school-1.jpg',
        caption: 'School supplies ready to donate',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/back-to-school/school-2.jpg',
        caption: 'Backpack and classroom essentials',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/back-to-school/school-3.jpg',
        caption: 'Notebooks, pencils, and stationery',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/back-to-school/school-4.jpg',
        caption: 'Preparing supplies for students',
      },
    ],
  },
];

const campaignDetails: Record<string, CampaignDetail> = {
  'd1111111-1111-1111-1111-111111111111': {
    id: 'd1111111-1111-1111-1111-111111111111',
    title: 'Kelp Forest Restoration',
    name: 'Kelp Forest Restoration',
    shortDescription:
      'Revitalizing underwater kelp forests to enhance marine biodiversity and carbon sequestration while supporting sustainable fisheries.',
    description: `OREGON COAST, USA — Along the wild and rugged Pacific shoreline, a quiet underwater revolution is taking place. Once-thriving kelp forests that had withered under the weight of warming oceans and sea urchin overpopulation are now being brought back to life through a cutting-edge restoration project fueled by carbon offset support.

Marine biologist Elena Torres leads the effort. Clad in a wetsuit and equipped with underwater monitoring gear, she dives daily into the chilly coastal waters, carefully planting strands of bull kelp and monitoring their growth. "Every blade we plant is like a breath for the ocean," she says. "It absorbs carbon, shelters sea life, and helps stabilize the marine ecosystem."

The project has revitalized over 100 acres of kelp forest so far, creating critical habitat for fish, sea otters, and other marine species. Importantly, it supports sustainable local fisheries by boosting populations of commercially important species like rockfish and abalone.

The initiative has also become an economic anchor for coastal communities. Fishermen like Jason Kim have joined the restoration workforce in the off-season, blending traditional ocean knowledge with new conservation training. "I never thought I'd be farming seaweed," Jason laughs, "but I know I'm helping the ocean and protecting my way of life."

Funding from carbon offset purchases has been key to scaling the project—supporting dive operations, research equipment, and community outreach. These investments not only restore biodiversity but actively remove carbon from the atmosphere, with kelp forests among the fastest natural carbon sequesters on the planet.

Back on shore, schoolchildren from nearby towns visit the project's education center, learning about ocean health and climate solutions. Their wide eyes and curious questions reflect a growing awareness of how connected their future is to the life below the waves.

As sunbeams pierce the water's surface and dance across rising strands of kelp, the forest comes alive once more—an underwater testament to nature's resilience and what's possible when communities, science, and sustainability unite.`,
    goalAmount: 375000,
    raisedAmount: 345000,
    status: 'Active',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/kelp/kelp-forest-main.png',
    videoUrl: null,
    organization: {
      id: '88888888-8888-8888-8888-888888888888',
      name: 'Ocean Restoration Coalition',
      logoUrl: '/images/campaigns/kelp/kelp-forest-main.png',
      description:
        'Dedicated to revitalizing marine ecosystems through cutting-edge restoration projects. 501(c)(3) nonprofit.',
    },
    mediaGallery: [
      {
        type: 'video',
        url: '/images/campaigns/kelp/kelp-forest-main.gif',
        caption: 'Kelp forest restoration in action',
      },
      {
        type: 'image',
        url: '/images/campaigns/kelp/kelp-diver-urchin.png',
        caption: 'Marine Life in Restored Kelp Forest',
      },
      {
        type: 'image',
        url: '/images/campaigns/kelp/kelp-elena-planting.png',
        caption: 'Underwater Kelp Restoration Work',
      },
      {
        type: 'image',
        url: '/images/campaigns/kelp/kelp-fish-ecosystem.png',
        caption: 'Thriving Kelp Forest Ecosystem',
      },
    ],
  },
  'd2222222-2222-2222-2222-222222222222': {
    id: 'd2222222-2222-2222-2222-222222222222',
    title: 'Amazon Rainforest Conservation',
    name: 'Amazon Rainforest Conservation',
    shortDescription:
      'Protecting ancient rainforest ecosystems through community-led conservation efforts and sustainable land management practices.',
    description: `Deep within the verdant heart of Brazil's Amazon Basin, nestled beside the gentle curves of the winding Rio Negro, lies the village of Santo Antônio. For generations, its indigenous inhabitants have lived in harmony with the ancient rainforest, relying on its vast resources while preserving its delicate balance. Maria Carvalho, a respected elder and natural storyteller, vividly remembers the lush forests of her childhood—echoing with the calls of toucans and the rustle of jaguars moving through the dense canopy.

Today, Maria's grandson, João Carvalho, leads the village conservation effort. A dynamic young leader with boundless energy, João works tirelessly alongside community members to patrol the forest boundaries, replant native trees, and educate neighboring villages about sustainable practices. Each day, João and his team carefully document wildlife sightings, monitor biodiversity, and remove illegal logging traps, knowing their efforts protect both their heritage and the planet's future.

Crucially, the funding provided by carbon offset purchases is vital for sustaining these reforestation and conservation efforts. It allows the Santo Antônio community to access essential resources, training, and equipment necessary to protect and restore their beloved rainforest.

Their mission not only safeguards countless endangered species but also maintains vital carbon storage, essential for global climate stability. Through a cooperative approach, the project has established thriving agroforestry plots, blending traditional knowledge with modern science, ensuring food security and income for Santo Antônio's families.

Local mother and artisan, Luciana Mendes, creates vibrant jewelry from sustainably sourced seeds, weaving economic resilience directly from nature's abundance. Luciana's smile beams with pride as her handmade crafts reach global audiences, sharing the story of their home and its conservation journey.

For Maria, João, Luciana, and the entire Santo Antônio community, this conservation initiative is more than a project—it's a testament to their unwavering bond with the Amazon. Their passion, wisdom, and dedication illuminate a hopeful path forward, one where humans and nature flourish together in mutual respect and abundance.`,
    goalAmount: 500000,
    raisedAmount: 420000,
    status: 'Active',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/amazon/amazon-featured.png',
    videoUrl: null,
    organization: {
      id: '99999999-9999-9999-9999-999999999999',
      name: 'Amazon Conservation Trust',
      logoUrl: '/images/campaigns/amazon/amazon-featured.png',
      description:
        'Working with indigenous communities to protect the Amazon rainforest through sustainable conservation and community empowerment. 501(c)(3) nonprofit.',
    },
    mediaGallery: [
      {
        type: 'video',
        url: '/images/campaigns/amazon/amazon-main.gif',
        caption: 'Journey through the Amazon rainforest',
      },
      {
        type: 'image',
        url: '/images/campaigns/amazon/amazon-village.png',
        caption: 'Maria Carvalho shares stories with village children',
      },
      {
        type: 'image',
        url: '/images/campaigns/amazon/amazon-conservation.png',
        caption: 'João leads the community conservation patrol',
      },
      {
        type: 'image',
        url: '/images/campaigns/amazon/amazon-trees.jpg',
        caption: 'Ancient rainforest canopy in Santo Antônio',
      },
    ],
  },
  'c7777777-7777-7777-7777-777777777777': {
    id: 'c7777777-7777-7777-7777-777777777777',
    title: 'Emergency Animal Shelter Expansion',
    name: 'Emergency Animal Shelter Expansion',
    shortDescription: 'Help us expand our shelter to rescue more animals in need',
    description:
      'Paws Rescue Foundation is building a new emergency shelter wing to accommodate more animals. Our current facility is at capacity with over 200 animals in care. This expansion will allow us to rescue 150 additional animals annually. Funds will go toward construction, medical equipment, and care supplies.',
    goalAmount: 50000,
    raisedAmount: 37500,
    status: 'Active',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/campaign-1-animal-shelter.jpg',
    videoUrl: null,
    organization: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Paws Rescue Foundation',
      logoUrl: '/images/organizations/org-1-paws-rescue-v3.png',
      description: 'Dedicated to rescuing and rehoming abandoned animals. 501(c)(3) nonprofit.',
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/media/gallery-animal-care.jpg',
        caption: 'Animals receiving care at our current facility',
      },
      {
        type: 'image',
        url: '/images/media/gallery-volunteers.jpg',
        caption: 'Dedicated volunteers working with rescue animals',
      },
    ],
  },
  'c8888888-8888-8888-8888-888888888888': {
    id: 'c8888888-8888-8888-8888-888888888888',
    title: 'Winter Warming Station',
    name: 'Winter Warming Station',
    shortDescription: 'Provide shelter and warmth for animals during winter',
    description:
      'As temperatures drop, outdoor animals face critical danger. Help us set up heating stations and provide warm shelter, blankets, and food. Every donation supports our emergency response teams who work 24/7 during winter months.',
    goalAmount: 25000,
    raisedAmount: 18750,
    status: 'Active',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/campaign-2-winter-warming.jpg',
    videoUrl: null,
    organization: {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Paws Rescue Foundation',
      logoUrl: '/images/organizations/org-1-paws-rescue-v3.png',
      description: 'Dedicated to rescuing and rehoming abandoned animals. 501(c)(3) nonprofit.',
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/media/gallery-animal-care.jpg',
        caption: 'Providing warmth and comfort to animals during winter',
      },
    ],
  },
  'c9999999-9999-9999-9999-999999999999': {
    id: 'c9999999-9999-9999-9999-999999999999',
    title: 'Community Outreach Program',
    name: 'Community Outreach Program',
    shortDescription: 'Expand our outreach and community support services',
    description:
      'Grace Community Church is expanding its community outreach initiatives. We serve meals, provide counseling, and offer educational workshops to underserved populations. Your donation helps us reach more families and provide critical support services.',
    goalAmount: 75000,
    raisedAmount: 52500,
    status: 'Active',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/campaign-3-community-outreach.jpg',
    videoUrl: null,
    organization: {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Grace Community Church',
      logoUrl: '/images/organizations/org-2-grace-church-v3.jpg',
      description: 'Faith-based organization serving the local community. 501(c)(3) nonprofit.',
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/media/gallery-community-support.jpg',
        caption: 'Volunteers serving meals at our community kitchen',
      },
      {
        type: 'image',
        url: '/images/media/gallery-donation-collection.jpg',
        caption: 'Community members coming together for support',
      },
    ],
  },
  'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa': {
    id: 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    title: 'Scholarship Fund for Underprivileged Youth',
    name: 'Scholarship Fund for Underprivileged Youth',
    shortDescription: 'Support education and development for youth in need',
    description:
      'Help us provide full scholarships to deserving youth from low-income families. Each scholarship covers tuition, books, and mentoring. We have 25 students ready to attend college this fall who just need financial support.',
    goalAmount: 100000,
    raisedAmount: 62000,
    status: 'Active',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/campaign-4-scholarship.jpg',
    videoUrl: null,
    organization: {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'Future Leaders Youth Program',
      logoUrl: '/images/organizations/org-4-future-leaders-v2.png',
      description: 'Empowering youth through education and mentorship. 501(c)(3) nonprofit.',
    },
  },
  'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb': {
    id: 'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    title: 'Emergency Food Distribution Network',
    name: 'Emergency Food Distribution Network',
    shortDescription: 'Expand food distribution to reach more families',
    description:
      'City Food Bank serves 5,000 families weekly, but demand keeps growing. We need funds to expand our distribution network to reach an additional 2,000 families. With your help, no one in our community will go hungry.',
    goalAmount: 150000,
    raisedAmount: 105000,
    status: 'Active',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/campaign-5-food-distribution.jpg',
    videoUrl: null,
    organization: {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'City Food Bank',
      logoUrl: '/images/organizations/org-3-food-bank-v3.png',
      description: 'Fighting food insecurity and hunger in our community. 501(c)(3) nonprofit.',
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/campaign-5-food-distribution.jpg',
        caption: 'Volunteers packing food boxes for families in need',
      },
      {
        type: 'image',
        url: '/images/media/gallery-volunteers.jpg',
        caption: 'Our team distributing food to community members',
      },
      {
        type: 'image',
        url: '/images/media/gallery-fresh-produce.jpg',
        caption: 'Fresh produce from our community gardens',
      },
    ],
  },
  'cccccccc-cccc-cccc-cccc-cccccccccccc': {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    title: 'Disaster Relief Medical Supplies',
    name: 'Disaster Relief Medical Supplies',
    shortDescription: 'Provide critical medical supplies to disaster victims',
    description:
      'We respond to natural disasters with emergency medical supplies, clean water, and shelter. Your donation provides life-saving resources to disaster victims when they need it most. Help us maintain our emergency supply stockpile.',
    goalAmount: 200000,
    raisedAmount: 125000,
    status: 'Active',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/campaign-6-disaster-relief.jpg',
    videoUrl: null,
    organization: {
      id: '66666666-6666-6666-6666-666666666666',
      name: 'Disaster Relief International',
      logoUrl: '/images/organizations/org-5-disaster-relief.png',
      description: 'Providing emergency aid to disaster-affected communities. 501(c)(3) nonprofit.',
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/campaign-6-disaster-relief.jpg',
        caption: 'Medical supplies ready for disaster response deployment',
      },
    ],
  },
  'cddddddd-dddd-dddd-dddd-dddddddddddd': {
    id: 'cddddddd-dddd-dddd-dddd-dddddddddddd',
    title: 'Youth Tech Training Initiative',
    name: 'Youth Tech Training Initiative',
    shortDescription: 'Teach coding and tech skills to underserved youth',
    description:
      'Equip the next generation with in-demand tech skills. Our program provides free coding bootcamps, mentorship, and job placement assistance. Help us remove barriers to tech careers for underprivileged youth.',
    goalAmount: 80000,
    raisedAmount: 56000,
    status: 'Active',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/campaign-7-youth-tech.jpg',
    videoUrl: null,
    organization: {
      id: '55555555-5555-5555-5555-555555555555',
      name: 'Future Leaders Youth Program',
      logoUrl: '/images/organizations/org-4-future-leaders-v2.png',
      description: 'Empowering youth through education and mentorship. 501(c)(3) nonprofit.',
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/campaign-7-youth-tech.jpg',
        caption: 'Students learning coding skills at our bootcamp',
      },
    ],
  },
  'ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee': {
    id: 'ceeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    title: 'Fresh Produce Community Gardens',
    name: 'Fresh Produce Community Gardens',
    shortDescription: 'Build community gardens to provide fresh produce',
    description:
      "We are establishing 10 community gardens across underserved neighborhoods. These gardens will provide fresh produce, job training, and community building. Let's grow food security and green spaces together.",
    goalAmount: 60000,
    raisedAmount: 48000,
    status: 'Active',
    startDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/campaign-8-community-gardens.jpg',
    videoUrl: null,
    organization: {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'City Food Bank',
      logoUrl: '/images/organizations/org-3-food-bank-v3.png',
      description: 'Fighting food insecurity and hunger in our community. 501(c)(3) nonprofit.',
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/media/gallery-fresh-produce.jpg',
        caption: 'Fresh vegetables growing in our community gardens',
      },
      {
        type: 'image',
        url: '/images/media/gallery-community-support.jpg',
        caption: 'Volunteers working together in the garden',
      },
    ],
  },
  'c1111111-1111-1111-1111-111111111111': {
    id: 'c1111111-1111-1111-1111-111111111111',
    title: 'The Pantry at Hope',
    name: 'The Pantry at Hope',
    shortDescription: 'Provide food and pantry staples for neighbors in need',
    description:
      'The Pantry at Hope is an available resource for anyone in need of food assistance. Your support helps keep shelves stocked with food and household essentials while welcoming guests with dignity and care.',
    goalAmount: 25000,
    raisedAmount: 16250,
    status: 'Active',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/hope/pantry.jpg',
    videoUrl: null,
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
      description:
        "Hope's Missions Team partners locally and globally to coordinate service projects, mission trips, and outreach opportunities.",
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/pantry/pantry-2048.jpg',
        caption: 'The Pantry at Hope',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/pantry/pantry-volunteer-2048.jpg',
        caption: 'Volunteers serving with care',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/pantry/pantry-card.png',
        caption: 'The Pantry',
      },
    ],
  },
  'c2222222-2222-2222-2222-222222222222': {
    id: 'c2222222-2222-2222-2222-222222222222',
    title: 'Café Hope',
    name: 'Café Hope',
    shortDescription: 'Support mission partners through every cup and every meal',
    description:
      "Café Hope is a welcoming space for coffee, breakfast, lunch, and meetings. Every purchase supports Hope's mission partners, turning everyday moments into lasting impact.",
    goalAmount: 15000,
    raisedAmount: 9800,
    status: 'Active',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/hope/cafe-hope.png',
    videoUrl: null,
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
      description:
        "Hope's Missions Team partners locally and globally to coordinate service projects, mission trips, and outreach opportunities.",
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/cafe-hope.png',
        caption: 'Café Hope',
      },
    ],
  },
  'c3333333-3333-3333-3333-333333333333': {
    id: 'c3333333-3333-3333-3333-333333333333',
    title: 'Homes of Hope – YWAM (Tijuana, Mexico)',
    name: 'Homes of Hope – YWAM (Tijuana, Mexico)',
    shortDescription: 'Help build a home with a family in need through a mission partnership',
    description:
      'Join Hope and Youth With A Mission San Diego/Baja in building a home for (and with) a family in need. Support covers materials, logistics, and team preparation for a hands-on service experience.',
    goalAmount: 60000,
    raisedAmount: 41250,
    status: 'Active',
    startDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/hope/mission-trips.png',
    videoUrl: null,
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
      description:
        "Hope's Missions Team partners locally and globally to coordinate service projects, mission trips, and outreach opportunities.",
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/homes-of-hope/hoh-1.jpg',
        caption: 'Serving side-by-side on the build site',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/homes-of-hope/hoh-2.jpg',
        caption: 'Framing a home together',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/homes-of-hope/hoh-3.jpg',
        caption: 'Raising roof trusses safely',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/homes-of-hope/hoh-4.jpg',
        caption: 'Building materials and framing in progress',
      },
    ],
  },
  'c4444444-4444-4444-4444-444444444444': {
    id: 'c4444444-4444-4444-4444-444444444444',
    title: 'Thanksgiving Meal Packaging',
    name: 'Thanksgiving Meal Packaging',
    shortDescription: 'Pack meals for families facing hunger during the holiday season',
    description:
      'Each year, volunteers gather to package meals so families facing hunger can have food during the Thanksgiving season. Your donation sponsors ingredients, packaging supplies, and distribution through trusted partners.',
    goalAmount: 20000,
    raisedAmount: 13750,
    status: 'Active',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/hope/thanksgiving-turkey.jpg',
    videoUrl: null,
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
      description:
        "Hope's Missions Team partners locally and globally to coordinate service projects, mission trips, and outreach opportunities.",
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/thanksgiving-turkey.jpg',
        caption: 'Thanksgiving meal packaging',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/thanksgiving-meals/meal-1.jpg',
        caption: 'Creamy mashed potatoes with butter and gravy',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/thanksgiving-meals/meal-2.jpg',
        caption: 'Traditional Thanksgiving stuffing',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/thanksgiving-meals/meal-3.jpg',
        caption: 'Green bean casserole with crispy onions',
      },
    ],
  },
  'c5555555-5555-5555-5555-555555555555': {
    id: 'c5555555-5555-5555-5555-555555555555',
    title: 'Souper Bowl Food Drive',
    name: 'Souper Bowl Food Drive',
    shortDescription: 'Stock local pantries with nonperishable food and essentials',
    description:
      'Bring nonperishable food items and essential goods during Souper Bowl season to help stock local pantries. Donations support neighbors across our community with practical help and encouragement.',
    goalAmount: 12000,
    raisedAmount: 8350,
    status: 'Active',
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/hope/souper-bowl.jpg',
    videoUrl: null,
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
      description:
        "Hope's Missions Team partners locally and globally to coordinate service projects, mission trips, and outreach opportunities.",
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/souper-bowl.jpg',
        caption: 'Souper Bowl Food Drive',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/souper-bowl/soup-1.jpg',
        caption: 'Canned foods ready to donate',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/souper-bowl/soup-6.jpg',
        caption: 'Shelf-stable pantry items',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/souper-bowl/soup-5.jpg',
        caption: 'Pantry shelves stocked with essentials',
      },
    ],
  },
  'c6666666-6666-6666-6666-666666666666': {
    id: 'c6666666-6666-6666-6666-666666666666',
    title: 'Back-to-School Drive',
    name: 'Back-to-School Drive',
    shortDescription: 'Help students start the year with supplies, snacks, and support',
    description:
      'Help stock classrooms by donating school supplies and essentials. Your support helps students start the year prepared with practical items that make a real difference.',
    goalAmount: 18000,
    raisedAmount: 10900,
    status: 'Active',
    startDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    featuredImageUrl: '/images/campaigns/hope/school-drive.jpg',
    videoUrl: null,
    organization: {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Lutheran Church Of Hope - WDM',
      logoUrl: '/images/organizations/org-hope-wdm-logo.svg',
      description:
        "Hope's Missions Team partners locally and globally to coordinate service projects, mission trips, and outreach opportunities.",
    },
    mediaGallery: [
      {
        type: 'image',
        url: '/images/campaigns/hope/back-to-school/school-1.jpg',
        caption: 'School supplies ready to donate',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/back-to-school/school-2.jpg',
        caption: 'Backpack and classroom essentials',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/back-to-school/school-3.jpg',
        caption: 'Notebooks, pencils, and stationery',
      },
      {
        type: 'image',
        url: '/images/campaigns/hope/back-to-school/school-4.jpg',
        caption: 'Preparing supplies for students',
      },
    ],
  },
};

const mediaAssets: MediaAsset[] = [
  {
    id: 'media-1',
    name: 'Charity Volunteers',
    url: '/images/media/gallery-volunteers.jpg',
    type: 'image',
    size: '2.4 MB',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-2',
    name: 'Donation Collection',
    url: '/images/media/gallery-donation-collection.jpg',
    type: 'image',
    size: '1.8 MB',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-3',
    name: 'Community Support',
    url: '/images/media/gallery-community-support.jpg',
    type: 'image',
    size: '3.1 MB',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-4',
    name: 'Food Distribution',
    url: '/images/campaigns/campaign-5-food-distribution.jpg',
    type: 'image',
    size: '2.7 MB',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-5',
    name: 'Animal Rescue',
    url: '/images/media/gallery-animal-care.jpg',
    type: 'image',
    size: '2.2 MB',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-6',
    name: 'Youth Education',
    url: '/images/campaigns/campaign-7-youth-tech.jpg',
    type: 'image',
    size: '1.9 MB',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-7',
    name: 'Medical Relief',
    url: '/images/campaigns/campaign-6-disaster-relief.jpg',
    type: 'image',
    size: '2.5 MB',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'media-8',
    name: 'Community Garden',
    url: '/images/media/gallery-fresh-produce.jpg',
    type: 'image',
    size: '3.3 MB',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const sampleGallery: MediaGalleryItem[] = [
  {
    type: 'image',
    url: '/images/media/gallery-volunteers.jpg',
    caption: 'Our dedicated volunteers making a difference in the community',
  },
  {
    type: 'image',
    url: '/images/campaigns/campaign-5-food-distribution.jpg',
    caption: 'Distributing essential supplies to families in need',
  },
  {
    type: 'image',
    url: '/images/media/gallery-donation-collection.jpg',
    caption: 'Community members coming together to support each other',
  },
];

// Justyn's donations (user-justyn): $45,750 total, 12 campaigns, 8 organizations
const donations: Donation[] = [
  {
    id: 'donation-j1',
    userId: 'user-justyn',
    campaignId: 'c1111111-1111-1111-1111-111111111111',
    organizationId: '11111111-1111-1111-1111-111111111111',
    amount: 5000,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    donorMessage: 'Supporting The Pantry at Hope!',
    receiptSent: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j2',
    userId: 'user-justyn',
    campaignId: 'c2222222-2222-2222-2222-222222222222',
    organizationId: '11111111-1111-1111-1111-111111111111',
    amount: 3500,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    receiptSent: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j3',
    userId: 'user-justyn',
    campaignId: 'c3333333-3333-3333-3333-333333333333',
    organizationId: '11111111-1111-1111-1111-111111111111',
    amount: 7500,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    donorMessage: 'Building homes, building hope!',
    receiptSent: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j4',
    userId: 'user-justyn',
    campaignId: 'c9999999-9999-9999-9999-999999999999',
    organizationId: '33333333-3333-3333-3333-333333333333',
    amount: 4000,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    receiptSent: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j5',
    userId: 'user-justyn',
    campaignId: 'cfffffff-ffff-ffff-ffff-ffffffffffff',
    organizationId: '77777777-7777-7777-7777-777777777777',
    amount: 5000,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    donorMessage: 'Early detection saves lives!',
    receiptSent: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j6',
    userId: 'user-justyn',
    campaignId: 'd1111111-1111-1111-1111-111111111111',
    organizationId: '88888888-8888-8888-8888-888888888888',
    amount: 6000,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    donorMessage: 'Restoring our oceans!',
    receiptSent: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j7',
    userId: 'user-justyn',
    campaignId: 'd2222222-2222-2222-2222-222222222222',
    organizationId: '99999999-9999-9999-9999-999999999999',
    amount: 4500,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    receiptSent: true,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j8',
    userId: 'user-justyn',
    campaignId: 'c7777777-7777-7777-7777-777777777777',
    organizationId: '22222222-2222-2222-2222-222222222222',
    amount: 2500,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    receiptSent: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j9',
    userId: 'user-justyn',
    campaignId: 'caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    organizationId: '55555555-5555-5555-5555-555555555555',
    amount: 3000,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    donorMessage: 'Education changes lives!',
    receiptSent: true,
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j10',
    userId: 'user-justyn',
    campaignId: 'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    organizationId: '44444444-4444-4444-4444-444444444444',
    amount: 1750,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    receiptSent: true,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j11',
    userId: 'user-justyn',
    campaignId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    organizationId: '66666666-6666-6666-6666-666666666666',
    amount: 1500,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    receiptSent: true,
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-j12',
    userId: 'user-justyn',
    campaignId: 'c4444444-4444-4444-4444-444444444444',
    organizationId: '11111111-1111-1111-1111-111111111111',
    amount: 1500,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    receiptSent: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Other users' donations for data variety
  {
    id: 'donation-1',
    userId: 'user-1',
    campaignId: 'c1111111-1111-1111-1111-111111111111',
    organizationId: '11111111-1111-1111-1111-111111111111',
    amount: 500,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    donorMessage: 'Keep up the amazing work!',
    receiptSent: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-2',
    userId: 'user-1',
    campaignId: 'cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    organizationId: '44444444-4444-4444-4444-444444444444',
    amount: 250,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: false,
    receiptSent: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'donation-3',
    userId: 'user-1',
    campaignId: 'c9999999-9999-9999-9999-999999999999',
    organizationId: '33333333-3333-3333-3333-333333333333',
    amount: 150,
    status: 'Completed',
    paymentMethod: 'credit_card',
    isAnonymous: true,
    receiptSent: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export { users, organizations, campaigns, campaignDetails, donations, mediaAssets, sampleGallery };
