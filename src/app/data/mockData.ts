export interface PledgeTier {
  id: string;
  title: string;
  amount: number;
  description: string;
  perks: string[];
  claimed: number;
  limit?: number;
  eta: string;
}

export interface Campaign {
  id: string;
  title: string;
  tagline: string;
  story: string;
  category: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  image: string;
  tags: string[];
  featured: boolean;
  status: 'active' | 'funded' | 'ending_soon';
  createdAt: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    campaignsCreated: number;
    location: string;
  };
  pledgeTiers: PledgeTier[];
  updates: { id: string; date: string; title: string; content: string }[];
  faqs: { question: string; answer: string }[];
  studentId?: string;
}

export const CATEGORIES = [
  'PreSchools',
  'Elementary Schools',
  'Middle Schools',
  'High Schools',
  'Trade Schools',
  'Private Schools',
  'STEM',
  'Vocational',
  'Scholarships',
  'Business Schools',
  'Music School',
  'All Grades',
];

export const CAMPAIGNS: Campaign[] = [
  // ── 1. PRESCHOOL ──────────────────────────────────────────────────────────
  {
    id: '1',
    title: 'Sunshine Christian Preschool — Early Childhood Scholarship Fund',
    tagline: 'Giving 50 Arizona toddlers their very first step into a faith-based education.',
    story: `**Who We Are**\nSunshine Christian Preschool is a licensed, NAEYC-affiliated preschool in Mesa, AZ serving children ages 2–5. Our curriculum blends play-based learning with Biblical foundations, preparing little hearts and minds for a lifetime of faith and learning.\n\n**The Need**\nQuality early childhood education is expensive. Many Christian families in our community deeply want their youngest children in a faith-centered environment but cannot afford the tuition without assistance.\n\n**Your Impact**\n$300 funds one month of preschool for a child in need. Our $55,000 goal will provide 50 full-year scholarships for the 2026–27 school year.\n\n**Arizona Tax Credit**\nThis campaign qualifies for Arizona's Private School Tax Credit (A.R.S. § 43-1089). Donors receive every dollar back on their AZ state taxes.`,
    category: 'PreSchools',
    goal: 55000,
    raised: 38400,
    backers: 284,
    daysLeft: 22,
    image: 'https://images.unsplash.com/photo-1763310225537-f7161d5c93e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['Preschool', 'Early Childhood', 'Tax Credit', 'Mesa, AZ'],
    featured: true,
    status: 'active',
    createdAt: '2026-02-20',
    creator: {
      id: 'u1', name: 'Sunshine Christian Preschool', avatar: 'https://i.pravatar.cc/150?img=47',
      bio: 'NAEYC-affiliated Christian preschool in Mesa, AZ. Building faith foundations from day one.',
      campaignsCreated: 2, location: 'Mesa, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Little Learner Friend', amount: 300, description: 'Fund one month of preschool for one child.', perks: ['Tax credit receipt', 'Thank-you card from class', 'Program newsletter'], claimed: 162, eta: 'Aug 2026' },
      { id: 't2', title: 'Semester Sponsor', amount: 900, description: 'Fund one child\'s full semester of preschool.', perks: ['Tax credit receipt', 'Named on Classroom Wall', 'Quarterly impact update', 'Open house invite'], claimed: 88, eta: 'Aug 2026' },
      { id: 't3', title: 'Full Year Scholar', amount: 1800, description: 'Fully fund one child\'s preschool year.', perks: ['Tax credit receipt', 'Named scholarship', 'Child\'s year-end portfolio', 'Graduation ceremony invite'], claimed: 24, limit: 50, eta: 'Aug 2026' },
    ],
    updates: [
      { id: 'u1', date: '2026-03-10', title: '70% Funded — 35 Spots Secured!', content: 'Thanks to 284 generous Arizona donors, 35 preschool scholarships are confirmed. Help us reach all 50!' },
    ],
    faqs: [
      { question: 'What ages does Sunshine Preschool serve?', answer: 'We serve children ages 2–5 in our half-day and full-day programs.' },
      { question: 'Is this donation eligible for the AZ tax credit?', answer: 'Yes. All donations qualify for Arizona\'s Private School Tax Credit — you get every dollar back on your state return.' },
    ],
  },

  // ── 2. ELEMENTARY SCHOOLS ────────────────────────────────────────────────
  {
    id: '2',
    title: 'Grace Christian Academy — Elementary Tuition Scholarship',
    tagline: 'Helping 40 K–6 students in Phoenix access a Christ-centered elementary education.',
    story: `**About Grace Christian Academy**\nFounded in 1994, Grace Christian Academy serves over 340 students in grades K–6 in Phoenix. Accredited by ACSI, GCA consistently ranks among Arizona's top private elementary schools for academic outcomes and character development.\n\n**The Challenge**\nMore than 200 families apply for tuition assistance each year. Limited funding means many are turned away. Your Arizona tax credit donation changes that.\n\n**What Every Dollar Does**\n$1,000 covers one month of tuition for a scholarship student. Our $85,000 goal fully funds 40 scholarships for the 2026–27 school year.\n\n**Tax Credit**\nDonations qualify for Arizona's Private School Tax Credit. Singles can redirect up to $1,459 and married couples up to $2,918 — dollar for dollar.`,
    category: 'Elementary Schools',
    goal: 85000,
    raised: 68200,
    backers: 312,
    daysLeft: 18,
    image: 'https://images.unsplash.com/photo-1769201153045-98827f62996b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['Elementary', 'K-6', 'Tax Credit', 'Phoenix'],
    featured: true,
    status: 'active',
    createdAt: '2026-02-15',
    creator: {
      id: 'u2', name: 'Grace Christian Academy', avatar: 'https://i.pravatar.cc/150?img=12',
      bio: 'K–6 ACSI-accredited Christian school in Phoenix, AZ. Nurturing faith, character, and academic excellence since 1994.',
      campaignsCreated: 3, location: 'Phoenix, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Friend of GCA', amount: 200, description: 'Help cover one month of a student\'s tuition.', perks: ['Tax credit receipt', 'Thank-you card from students', 'Annual impact report'], claimed: 148, eta: 'Aug 2026' },
      { id: 't2', title: 'Semester Sponsor', amount: 500, description: 'Fund half a school year for one student.', perks: ['Tax credit receipt', 'Named on Donor Wall', 'Quarterly updates', 'School newsletter'], claimed: 102, eta: 'Aug 2026' },
      { id: 't3', title: 'Full Year Sponsor', amount: 1000, description: 'Fully cover one student\'s annual tuition.', perks: ['Tax credit receipt', 'Letter from sponsored student', 'School visit invitation', 'Named scholarship'], claimed: 48, limit: 80, eta: 'Aug 2026' },
      { id: 't4', title: 'Legacy Partner', amount: 2500, description: 'Fund multiple students and transform families.', perks: ['All above perks', 'Named Endowment Fund', 'Board recognition', 'Annual scholarship ceremony invite'], claimed: 14, limit: 20, eta: 'Aug 2026' },
    ],
    updates: [
      { id: 'u1', date: '2026-03-10', title: '80% Funded — 32 Students Secured!', content: 'Thanks to 312 donors, 32 scholarships are confirmed for next fall. Just 8 more to go!' },
    ],
    faqs: [
      { question: 'Do I get a tax credit?', answer: 'Yes! Arizona\'s Private School Tax Credit lets you redirect up to $1,459 (single) or $2,918 (married) of your AZ state taxes.' },
    ],
  },

  // ── 3. MIDDLE SCHOOLS ───────────────────────────────────────────────────
  {
    id: '3',
    title: 'Maranatha Christian School — Middle School Pathfinders Program',
    tagline: 'Mentorship, faith, and academic excellence for 60 at-risk 6th–8th graders in Tucson.',
    story: `**The Critical Window**\nMiddle school is one of the most decisive periods in a student's life. Maranatha's Pathfinders Program wraps around 60 at-risk 6th–8th graders with mentorship, tutoring, college-prep exposure, and character formation in a Christian community.\n\n**Program Components**\n- Weekly one-on-one mentoring\n- After-school academic tutoring\n- Monthly leadership workshops\n- Annual college campus visits\n- Spiritual formation through chapel and small groups\n\n**Proven Results**\nPathfinders graduates are 3× more likely to complete high school than peers from similar backgrounds.`,
    category: 'Middle Schools',
    goal: 78000,
    raised: 34200,
    backers: 418,
    daysLeft: 40,
    image: 'https://images.unsplash.com/photo-1578402027070-0f5ebd84ec9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['Middle School', 'Mentorship', 'At-Risk', 'Tax Credit'],
    featured: true,
    status: 'active',
    createdAt: '2026-03-01',
    creator: {
      id: 'u3', name: 'Maranatha Christian School', avatar: 'https://i.pravatar.cc/150?img=25',
      bio: 'Serving grades K–8 in Tucson\'s Southside since 1988. Transforming generations through faith and education.',
      campaignsCreated: 3, location: 'Tucson, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Pathfinder Friend', amount: 150, description: 'Fund one month of Pathfinders programming per student.', perks: ['Tax credit receipt', 'Program newsletter', 'Annual impact report'], claimed: 248, eta: 'Sep 2026' },
      { id: 't2', title: 'Mentor Sponsor', amount: 500, description: 'Fund one student\'s full Pathfinders year.', perks: ['Tax credit receipt', 'Named on Mentor Wall', 'Graduate recognition card', 'Program visit invite'], claimed: 128, eta: 'Sep 2026' },
      { id: 't3', title: 'Cohort Champion', amount: 1300, description: 'Fund a full cohort of 8 students.', perks: ['All above', 'Named cohort group', 'Ceremony recognition', 'Board appreciation'], claimed: 30, limit: 50, eta: 'Aug 2026' },
    ],
    updates: [],
    faqs: [
      { question: 'How are at-risk students identified?', answer: 'Referrals come from local churches, school counselors, and community organizations. Students qualify based on household income and educational need.' },
    ],
  },

  // ── 4. HIGH SCHOOLS ─────────────────────────────────────────────────────
  {
    id: '4',
    title: 'Covenant Christian High School — College-Prep Scholarship Program',
    tagline: 'Funding 45 need-based scholarships at Arizona\'s top-ranked Christian high school.',
    story: `**The Opportunity**\nCovenant Christian High School is consistently ranked among Arizona's top 10 private high schools for academic outcomes and college placement. Yet many of the families who most value Covenant's faith-integrated education cannot afford its tuition.\n\n**Our Scholarship Model**\nAll scholarships are needs-based, awarded through a rigorous application process. Recipients maintain a minimum GPA, participate in community service, and attend chapel — building the whole student.\n\n**College Outcomes**\n98% of Covenant graduates are accepted to 4-year colleges. Last year's class earned over $4.2M in merit scholarships. Your investment multiplies.`,
    category: 'High Schools',
    goal: 180000,
    raised: 156000,
    backers: 1284,
    daysLeft: 10,
    image: 'https://images.unsplash.com/photo-1632834380561-d1e05839a33a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['High School', 'College Prep', 'Scholarship', 'Tax Credit'],
    featured: true,
    status: 'funded',
    createdAt: '2026-01-10',
    creator: {
      id: 'u4', name: 'Covenant Christian High School', avatar: 'https://i.pravatar.cc/150?img=68',
      bio: 'Arizona\'s premier college-preparatory Christian high school in Tempe, AZ. 98% college acceptance rate.',
      campaignsCreated: 5, location: 'Tempe, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Academic Investor', amount: 300, description: 'Fund one month of tuition for a scholarship student.', perks: ['Tax credit receipt', 'Named in scholarship directory', 'Graduate announcement card'], claimed: 720, eta: 'Sep 2026' },
      { id: 't2', title: 'Semester Champion', amount: 900, description: 'Fund one semester for a deserving student.', perks: ['Tax credit receipt', 'Named in Scholarship Hall', 'Commencement ceremony invite'], claimed: 420, eta: 'Sep 2026' },
      { id: 't3', title: 'Full Year Scholar', amount: 1800, description: 'Fully sponsor one student\'s high school year.', perks: ['All above', 'Personal letter from your scholar', 'Named scholarship', 'Campus tour and lunch'], claimed: 98, limit: 120, eta: 'Aug 2026' },
    ],
    updates: [
      { id: 'u1', date: '2026-03-20', title: 'FULLY FUNDED — 45 Scholars Secured! 🎉', content: 'We reached 100% of our goal, securing all 45 scholarships! We\'re now pursuing a stretch goal of 10 additional awards.' },
    ],
    faqs: [
      { question: 'How are recipients selected?', answer: 'A blind review committee evaluates financial need, academic standing, character references, and a student essay.' },
    ],
  },

  // ── 5. TRADE SCHOOLS ────────────────────────────────────────────────────
  {
    id: '5',
    title: 'Southwest Christian Trade Institute — Hands-On Scholarship Fund',
    tagline: 'Training the next generation of Christian tradespeople — welding, plumbing, and electrical.',
    story: `**The Trade Gap**\nArizona has a critical shortage of skilled tradespeople. Southwest Christian Trade Institute prepares young men and women with the technical skills and Biblical work ethic to serve with excellence and integrity in the trades.\n\n**Our Programs**\nWelding, plumbing, electrical, HVAC, and construction management — all taught by certified Christian instructors who model vocation as calling.\n\n**Certification & Career Outcomes**\n94% of SCTI graduates receive job offers before completing their program. Average starting wage: $28/hour. Every student is discipled alongside their trade training.`,
    category: 'Trade Schools',
    goal: 95000,
    raised: 52800,
    backers: 376,
    daysLeft: 28,
    image: 'https://images.unsplash.com/photo-1690356107486-0796de806f63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['Trade School', 'Welding', 'Skilled Trades', 'Tax Credit'],
    featured: true,
    status: 'active',
    createdAt: '2026-02-18',
    creator: {
      id: 'u5', name: 'SW Christian Trade Institute', avatar: 'https://i.pravatar.cc/150?img=33',
      bio: 'Faith-based trade school in Glendale, AZ training skilled Christian tradespeople since 2005.',
      campaignsCreated: 2, location: 'Glendale, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Tools Sponsor', amount: 250, description: 'Fund one student\'s tools and materials for a course.', perks: ['Tax credit receipt', 'Named donor recognition', 'Annual newsletter'], claimed: 220, eta: 'Sep 2026' },
      { id: 't2', title: 'Apprentice Sponsor', amount: 750, description: 'Fund one student\'s full semester of trade training.', perks: ['Tax credit receipt', 'Named on Workshop Wall', 'Graduation invite', 'Quarterly updates'], claimed: 116, eta: 'Sep 2026' },
      { id: 't3', title: 'Master Craftsman Partner', amount: 2500, description: 'Full annual scholarship for one trade student.', perks: ['All above', 'Named scholarship', 'Business partner dinner', 'Board recognition'], claimed: 18, limit: 30, eta: 'Aug 2026' },
    ],
    updates: [],
    faqs: [
      { question: 'What trades are offered?', answer: 'Welding, plumbing, electrical, HVAC, and construction management — all 12–24 month programs with industry certifications.' },
    ],
  },

  // ── 6. PRIVATE SCHOOLS ──────────────────────────────────────────────────
  {
    id: '6',
    title: 'Heritage Hall Christian Academy — Private School Access Fund',
    tagline: 'Opening the doors of Arizona\'s finest Christian private school to families who qualify but can\'t afford tuition.',
    story: `**A World-Class Education, Faith-Centered**\nHeritage Hall Christian Academy is a boutique private school serving grades 1–12 in Scottsdale. Small class sizes (12:1 ratio), a Great Books curriculum, Socratic seminars, and a rigorous college-prep track make Heritage Hall unique in the valley.\n\n**Why a Scholarship Fund?**\nHeritage Hall's tuition reflects the cost of its exceptional programming. Our scholarship fund ensures that financial limitations never determine which students have access to this level of education.\n\n**The Difference It Makes**\n100% of Heritage Hall graduates are accepted to 4-year universities. Many earn full college scholarships of their own — making your investment multiply dramatically.`,
    category: 'Private Schools',
    goal: 220000,
    raised: 148400,
    backers: 892,
    daysLeft: 14,
    image: 'https://images.unsplash.com/photo-1685458454444-4f19c5a76c0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['Private School', 'College Prep', 'Scholarship', 'Scottsdale'],
    featured: false,
    status: 'active',
    createdAt: '2026-02-05',
    creator: {
      id: 'u6', name: 'Heritage Hall Christian Academy', avatar: 'https://i.pravatar.cc/150?img=60',
      bio: 'Boutique K–12 private school in Scottsdale, AZ. Small class sizes, Great Books curriculum, 100% college placement.',
      campaignsCreated: 4, location: 'Scottsdale, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Access Donor', amount: 400, description: 'Fund one month of tuition for a scholarship student.', perks: ['Tax credit receipt', 'Annual fund recognition', 'School newsletter'], claimed: 520, eta: 'Aug 2026' },
      { id: 't2', title: 'Semester Partner', amount: 1200, description: 'Fund one student\'s full semester at Heritage Hall.', perks: ['Tax credit receipt', 'Named on Donor Honor Roll', 'Campus event invitations'], claimed: 280, eta: 'Aug 2026' },
      { id: 't3', title: 'Legacy Donor', amount: 3000, description: 'Full annual scholarship for one student.', perks: ['All above', 'Named plaque in main hall', 'Legacy dinner invitation', 'Board recognition'], claimed: 74, limit: 100, eta: 'Jun 2026' },
    ],
    updates: [],
    faqs: [
      { question: 'How small are Heritage Hall\'s class sizes?', answer: 'We maintain a maximum 12:1 student-to-teacher ratio across all grades.' },
    ],
  },

  // ── 7. STEM ─────────────────────��───────────────────────────────────────
  {
    id: '7',
    title: 'Desert Christian Academy — STEM Innovation Lab',
    tagline: 'Building Arizona\'s next generation of Christian engineers, scientists, and innovators.',
    story: `**The Vision**\nDesert Christian Academy is building a state-of-the-art STEM Innovation Lab — complete with 3D printers, robotics kits, coding stations, and hands-on engineering challenges rooted in a Biblical worldview of stewardship.\n\n**Why STEM + Faith?**\nWe believe science reveals God's handiwork. Our STEM curriculum integrates biblical creation care with technical excellence, preparing students to lead with both competence and integrity.\n\n**Budget Breakdown**\n- Equipment & materials: 60%\n- Curriculum development: 20%\n- Teacher training: 10%\n- Student scholarships: 10%`,
    category: 'STEM',
    goal: 65000,
    raised: 41800,
    backers: 294,
    daysLeft: 32,
    image: 'https://images.unsplash.com/photo-1766297247194-9b635e9eea56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['STEM', 'Robotics', 'Engineering', 'Tax Credit'],
    featured: false,
    status: 'active',
    createdAt: '2026-02-20',
    creator: {
      id: 'u7', name: 'Desert Christian Academy', avatar: 'https://i.pravatar.cc/150?img=9',
      bio: 'Grades 4–12 in Chandler, AZ. Preparing students to think Christianly about science, technology, and creation.',
      campaignsCreated: 2, location: 'Chandler, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Lab Contributor', amount: 100, description: 'Fund supplies for one student\'s lab projects.', perks: ['Tax credit receipt', 'Lab dedication contribution', 'Impact updates'], claimed: 156, eta: 'Aug 2026' },
      { id: 't2', title: 'Equipment Sponsor', amount: 500, description: 'Fund one major piece of lab equipment.', perks: ['Tax credit receipt', 'Equipment nameplate', 'Grand opening invite', 'Quarterly updates'], claimed: 98, eta: 'Aug 2026' },
      { id: 't3', title: 'Lab Founding Partner', amount: 2000, description: 'Major contributor to the full lab buildout.', perks: ['All above', 'Named station in lab', 'Ribbon-cutting invite', 'Board recognition'], claimed: 20, limit: 30, eta: 'Jul 2026' },
    ],
    updates: [],
    faqs: [
      { question: 'Which grades will use the Innovation Lab?', answer: 'Initially grades 6–12, with an elementary track launching in year two.' },
    ],
  },

  // ── 8. VOCATIONAL ───────────────────────────────────────────────────────
  {
    id: '8',
    title: 'Valley Christian School — Vocational & Career Readiness Track',
    tagline: 'Equipping Christian students with in-demand skills in healthcare, culinary, and entrepreneurship.',
    story: `**Vocation as Calling**\nValley Christian's Career Readiness Track partners with local Christian business owners to offer hands-on training in healthcare, culinary arts, automotive technology, and entrepreneurship — all taught through a biblical lens of vocation as calling.\n\n**Apprenticeship Model**\nStudents spend 40% of their time in real workplace settings with Christian mentors. This model produces graduates who are job-ready, mission-minded, and deeply rooted in their faith.\n\n**Placement Rate**\n92% of program completers receive job or college offers within 30 days of graduation.`,
    category: 'Vocational',
    goal: 72000,
    raised: 29600,
    backers: 312,
    daysLeft: 45,
    image: 'https://images.unsplash.com/photo-1570616969692-54d6ba3d0397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['Vocational', 'Career', 'Healthcare', 'Tax Credit'],
    featured: false,
    status: 'active',
    createdAt: '2026-03-05',
    creator: {
      id: 'u8', name: 'Valley Christian School', avatar: 'https://i.pravatar.cc/150?img=5',
      bio: 'Preparing the whole student — mind, body, and spirit — for a life of vocation and service in Gilbert, AZ.',
      campaignsCreated: 2, location: 'Gilbert, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Skills Investor', amount: 175, description: 'Fund one student\'s materials and equipment for a course.', perks: ['Tax credit receipt', 'Program donor recognition', 'Annual newsletter'], claimed: 180, eta: 'Sep 2026' },
      { id: 't2', title: 'Career Mentor Sponsor', amount: 500, description: 'Fund one student\'s full Career Track semester.', perks: ['Tax credit receipt', 'Named mentor recognition', 'Business partner dinner invite'], claimed: 98, eta: 'Sep 2026' },
      { id: 't3', title: 'Vocation Champion', amount: 1500, description: 'Full-year scholarship for one vocational student.', perks: ['All above', 'Named scholarship', 'Graduation ceremony invite', 'Board recognition'], claimed: 22, limit: 40, eta: 'Aug 2026' },
    ],
    updates: [],
    faqs: [],
  },

  // ── 9. SCHOLARSHIPS ──────────────────────────────────────────────────────
  {
    id: '9',
    title: 'ACT General Scholarship Fund — Any Qualifying Arizona Christian School',
    tagline: 'A flexible scholarship fund that families can direct to any ACT-certified school of their choice.',
    story: `**Maximum Flexibility for Families**\nNot every family knows which school is right for their child. ACT's General Scholarship Fund allows donors to contribute to a shared pool that is distributed as need-based awards to students at any ACT-certified school in Arizona.\n\n**How It Works**\n1. Families apply for a scholarship through ACT\n2. A review committee awards funds based on financial need and school enrollment\n3. Funds go directly to the school\n4. Donors receive full Arizona tax credit\n\n**The Impact So Far**\nACT's General Scholarship Fund has distributed over $2.4M to 1,200 students at 48 Arizona Christian schools since 2019.`,
    category: 'Scholarships',
    goal: 300000,
    raised: 214000,
    backers: 2108,
    daysLeft: 20,
    image: 'https://images.unsplash.com/photo-1757143137392-0b1e1a27a7de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['Scholarship', 'Any School', 'General Fund', 'Tax Credit'],
    featured: true,
    status: 'active',
    createdAt: '2026-01-15',
    creator: {
      id: 'u9', name: 'Arizona Christian Tuition (ACT)', avatar: 'https://i.pravatar.cc/150?img=44',
      bio: 'ACT is Arizona\'s leading Certified School Tuition Organization, serving families and schools statewide since 2010.',
      campaignsCreated: 12, location: 'Phoenix, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Scholarship Contributor', amount: 200, description: 'Help fund a portion of one student\'s tuition at any ACT school.', perks: ['Tax credit receipt', 'Annual General Fund report', 'ACT newsletter'], claimed: 1240, eta: 'Ongoing' },
      { id: 't2', title: 'Student Sponsor', amount: 750, description: 'Fully fund one semester for a scholarship student.', perks: ['Tax credit receipt', 'Named on ACT Donor Honor Roll', 'Student impact story'], claimed: 620, eta: 'Ongoing' },
      { id: 't3', title: 'Legacy Donor', amount: 2000, description: 'Full annual scholarship for one deserving student.', perks: ['All above', 'Named scholarship recognition', 'Annual gala invitation', 'Board acknowledgment'], claimed: 142, limit: 200, eta: 'Jun 2026' },
    ],
    updates: [
      { id: 'u1', date: '2026-03-01', title: '$2.4M Distributed Since 2019', content: 'The ACT General Scholarship Fund has now distributed over $2.4M to 1,200+ students. Thank you for making this possible!' },
    ],
    faqs: [
      { question: 'Can I direct my donation to a specific school?', answer: 'Through the General Fund, donations are pooled and distributed equitably. If you want to direct funds to a specific school, find that school\'s individual campaign.' },
    ],
  },

  // ── 10. BUSINESS SCHOOLS ────────────────────────────────────────────────
  {
    id: '10',
    title: 'Charis Academy — Kingdom Business & Entrepreneurship Program',
    tagline: 'Raising up the next generation of Christian business leaders, entrepreneurs, and marketplace ministers.',
    story: `**Business as Mission**\nCharis Academy's Kingdom Business Program is a two-year upper-school elective track where students study economics, entrepreneurship, marketing, and finance through a biblical worldview of stewardship, service, and generosity.\n\n**Real-World Application**\nStudents launch real micro-businesses during the program, mentored by Christian entrepreneurs from the Phoenix business community. Many go on to launch ventures in college.\n\n**College & Career Outcomes**\n82% of program graduates pursue business-related college majors. Last year's cohort collectively earned $280,000 in business-related college scholarships.`,
    category: 'Business Schools',
    goal: 56000,
    raised: 44200,
    backers: 712,
    daysLeft: 20,
    image: 'https://images.unsplash.com/photo-1565689157206-0fddef7589a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['Business', 'Entrepreneurship', 'Leadership', 'Tax Credit'],
    featured: false,
    status: 'active',
    createdAt: '2026-02-25',
    creator: {
      id: 'u10', name: 'Charis Academy', avatar: 'https://i.pravatar.cc/150?img=15',
      bio: 'A classical Christian high school in Peoria, AZ dedicated to raising servant leaders for every sphere of society.',
      campaignsCreated: 3, location: 'Peoria, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Business Investor', amount: 200, description: 'Fund one student\'s curriculum and materials for the program.', perks: ['Tax credit receipt', 'Program recognition', 'Annual impact report'], claimed: 420, eta: 'Sep 2026' },
      { id: 't2', title: 'Mentor Sponsor', amount: 600, description: 'Fund one student\'s two-semester program.', perks: ['Tax credit receipt', 'Named mentor recognition', 'Student business pitch invite', 'Graduation invite'], claimed: 220, eta: 'Sep 2026' },
      { id: 't3', title: 'Kingdom Partner', amount: 1500, description: 'Full scholarship for one student\'s two-year track.', perks: ['All above', 'Named scholarship', 'Mentorship dinner', 'Board recognition'], claimed: 52, limit: 80, eta: 'Aug 2026' },
    ],
    updates: [],
    faqs: [],
  },

  // ── 11. MUSIC SCHOOL ────────────────────────────────────────────────────
  {
    id: '11',
    title: 'Cornerstone Classical School — Music & Fine Arts Conservatory',
    tagline: 'Sustaining choral, orchestral, and performing arts programs for 180 students who create beauty for God\'s glory.',
    story: `**Beauty as Worship**\nCornerstone Classical School's Music Conservatory has produced award-winning choirs, orchestras, and theater productions for over a decade. We believe creativity is a gift from God, and the arts are a vehicle for worship and community.\n\n**What We're Funding**\n- Instrument purchases and maintenance\n- Performance space rental\n- Visiting artist residencies\n- Full tuition scholarships for musically gifted students with financial need\n\n**Recognition**\nOur choir placed 1st at the Arizona State Christian School Choral Competition three years running. Our theater productions regularly sell out 400-seat venues.`,
    category: 'Music School',
    goal: 42000,
    raised: 38600,
    backers: 241,
    daysLeft: 6,
    image: 'https://images.unsplash.com/photo-1546957221-37816b007052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['Music', 'Arts', 'Choir', 'Tax Credit'],
    featured: false,
    status: 'funded',
    createdAt: '2026-01-20',
    creator: {
      id: 'u11', name: 'Cornerstone Classical School', avatar: 'https://i.pravatar.cc/150?img=22',
      bio: 'A classical Christian school serving grades 6–12 in Scottsdale, AZ. Truth. Goodness. Beauty.',
      campaignsCreated: 2, location: 'Scottsdale, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Art Patron', amount: 150, description: 'Fund supplies for one student artist for the year.', perks: ['Tax credit receipt', 'Digital Spring Concert program', 'Name in program'], claimed: 120, eta: 'Sep 2026' },
      { id: 't2', title: 'Instrument Sponsor', amount: 400, description: 'Fund a shared instrument for the ensemble.', perks: ['Tax credit receipt', 'Instrument dedication plaque', 'Concert VIP invite'], claimed: 85, eta: 'Sep 2026' },
      { id: 't3', title: 'Music Scholarship', amount: 900, description: 'Full arts tuition scholarship for one gifted student.', perks: ['All above', 'Personal meeting with student', 'Named scholarship recognition'], claimed: 36, limit: 50, eta: 'Aug 2026' },
    ],
    updates: [
      { id: 'u1', date: '2026-03-20', title: 'Campaign Funded! Arts Programs Secured 🎶', content: 'We did it! 241 generous donors have fully funded all arts programs through 2026–27. We\'re now pursuing a stretch goal: a new grand piano.' },
    ],
    faqs: [
      { question: 'Are donations eligible for the AZ tax credit?', answer: 'Yes. Cornerstone Classical is ACT-certified, making all donations eligible for Arizona\'s Private School Tax Credit.' },
    ],
  },

  // ── 12. ALL GRADES ──────────────────────────────────────────────────────
  {
    id: '12',
    title: 'Trinity Lutheran Academy — K–12 Annual Fund & Tuition Assistance',
    tagline: 'Keeping K–12 Christian Lutheran education affordable for 520 Tucson families — preschool through senior year.',
    story: `**Who We Are**\nTrinity Lutheran Academy is one of Southern Arizona's oldest continuously operating Christian schools, founded in 1952. We serve 520 students in preschool through 12th grade with a fully integrated Lutheran and evangelical Christian curriculum.\n\n**The Challenge**\nRising operational costs — energy, insurance, staffing — are pricing out the families we most want to serve. TLA's Annual Fund bridges the gap, allowing us to keep tuition 18% below the market average.\n\n**All Grades, All Needs**\nFrom potty-trained preschoolers to college-bound seniors, TLA serves families through every stage of a child's education — in one Christ-centered community.\n\n**Your Impact**\nEvery dollar donated keeps our doors open and our tuition affordable for another generation of Arizona Christian families.`,
    category: 'All Grades',
    goal: 220000,
    raised: 148400,
    backers: 2108,
    daysLeft: 14,
    image: 'https://images.unsplash.com/photo-1767353461394-7dce69402122?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    tags: ['All Grades', 'K-12', 'Lutheran', 'Tax Credit'],
    featured: false,
    status: 'active',
    createdAt: '2026-02-05',
    creator: {
      id: 'u12', name: 'Trinity Lutheran Academy', avatar: 'https://i.pravatar.cc/150?img=60',
      bio: 'K–12 Lutheran Christian school in Tucson, AZ. Serving Arizona families since 1952.',
      campaignsCreated: 7, location: 'Tucson, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Annual Fund Donor', amount: 100, description: 'Support TLA\'s operational mission.', perks: ['Tax credit receipt', 'Annual fund recognition', 'School newsletter'], claimed: 1240, eta: 'Jul 2026' },
      { id: 't2', title: 'Friend of TLA', amount: 400, description: 'Meaningful contribution to keep tuition affordable.', perks: ['Tax credit receipt', 'Named on donor honor roll', 'Campus event invitations'], claimed: 620, eta: 'Jul 2026' },
      { id: 't3', title: 'Legacy Donor', amount: 1000, description: 'Sustaining gift ensuring TLA\'s long-term mission.', perks: ['All above', 'Named plaque in main hall', 'Legacy dinner invitation', 'Board recognition'], claimed: 142, limit: 200, eta: 'Jun 2026' },
    ],
    updates: [],
    faqs: [],
  },

  // ── 13. JEREMY WATERS ───────────────────────────────────────────────────
  {
    id: '13',
    title: 'Support Jace Waters at Valley Christian School',
    tagline: 'Help fund a vibrant, Christ-centered 5th grade education for this young leader.',
    story: `**About Jace**\nThe Waters family is committed to raising their children with a strong foundation of faith, character, and purpose. Their son, Jace, is currently in 5th grade at Valley Christian School, where he is growing both academically and spiritually in a Christ-centered environment.\n\n**Valley Christian's Impact**\nValley Christian has been an incredible blessing for Jace, providing not only a high level of education but also reinforcing the values that are taught at home. Through daily faith integration, meaningful relationships, and a supportive community, Jace is developing into a young leader with a heart for others.\n\n**The Challenge**\nLike many families, the cost of private Christian education can be a challenge. Through the Arizona Christian Tuition Organization, you have the opportunity to directly support students like Jace and help make this life-changing education possible.\n\n**How Your Support Helps**\nYour donation will go toward tuition assistance, helping Jace continue his education at Valley Christian School. Every contribution makes a meaningful impact and helps ease the financial burden on the family.\n\n**Thank You**\nThank you for considering a donation and for supporting families who value faith-based education. Your generosity helps shape the next generation.`,
    category: 'Elementary Schools',
    goal: 15000,
    raised: 0,
    backers: 0,
    daysLeft: 90,
    image: 'https://arizonachristiantuition.com/wp-content/uploads/2026/03/vcs_photo_2.avif',
    tags: ['Valley Christian', '5th Grade', 'Elementary', 'Tax Credit'],
    featured: false,
    status: 'active',
    createdAt: '2026-03-26',
    creator: {
      id: 'jeremy_waters', name: 'Jeremy Waters', avatar: 'https://arizonachristiantuition.com/wp-content/uploads/2025/12/JW1-150x150.png',
      bio: 'Proud parent at Valley Christian School. Committed to providing a Christ-centered education for Jace.',
      campaignsCreated: 1, location: 'Phoenix, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Faith Friend', amount: 250, description: 'Support one month of Jace\'s education.', perks: ['Tax credit receipt', 'Thank-you note from family', 'Campaign updates'], claimed: 0, eta: 'Aug 2026' },
      { id: 't2', title: 'Semester Sponsor', amount: 1500, description: 'Fund one semester of tuition.', perks: ['Tax credit receipt', 'Named recognition', 'Family update letter', 'End-of-year report'], claimed: 0, limit: 10, eta: 'Aug 2026' },
      { id: 't3', title: 'Year-Long Partner', amount: 3750, description: 'Fully fund one academic year.', perks: ['All above perks', 'Named scholarship', 'Family dinner invitation', 'Annual impact letter'], claimed: 0, limit: 4, eta: 'Aug 2026' },
    ],
    updates: [],
    faqs: [
      { question: 'How will the funds be used?', answer: 'All funds go directly to Valley Christian School as tuition assistance for the Waters family. The school will apply the donation to reduce family tuition payments.' },
      { question: 'Is this tax-deductible?', answer: 'Yes! Your donation qualifies for Arizona\'s Private School Tax Credit under A.R.S. § 43-1089. You can redirect up to $1,459 (single) or $2,918 (married) annually.' },
    ],
  },

  // ── 14. CHRIS LEAVITT ───────────────────────────────────────────────────
  {
    id: '14',
    title: 'Invest in the Future of the Leavitt Family',
    tagline: 'Supporting a generational investment in Christ-centered education at Valley Christian School.',
    story: `**The Leavitt Family Vision**\nThe Leavitt family believes deeply in the importance of providing their children with a Christ-centered education—one that builds strong character, faith, and academic excellence. Valley Christian School has been a vital part of that journey, creating an environment where their children can thrive both in the classroom and in their spiritual walk.\n\n**Valley Christian's Difference**\nWith a focus on leadership, integrity, and purpose, Valley Christian is helping shape the next generation to stand firm in their beliefs while pursuing excellence in all areas of life.\n\n**The Financial Reality**\nHowever, the investment in private Christian education can be significant. Through ACTSTO, families like the Leavitts are able to receive support that makes this opportunity attainable.\n\n**How Your Support Helps**\nYour contribution directly supports tuition assistance for the Leavitt family, helping ensure their children can continue receiving a Christ-centered education at Valley Christian School.\n\n**Join Us in This Mission**\nEvery donation, big or small, makes a difference. Thank you for partnering with the Leavitt family and investing in the future of their children. Together, we're building generations of faithful, excellent leaders.`,
    category: 'Elementary Schools',
    goal: 15000,
    raised: 0,
    backers: 0,
    daysLeft: 90,
    image: 'https://arizonachristiantuition.com/wp-content/uploads/2026/03/vcs_photo_4-1536x864.jpg',
    tags: ['Valley Christian', 'Multiple Children', 'Elementary', 'Tax Credit'],
    featured: false,
    status: 'active',
    createdAt: '2026-03-26',
    creator: {
      id: 'chris_leavitt', name: 'Chris Leavitt', avatar: 'https://arizonachristiantuition.com/wp-content/uploads/2025/12/SS1-150x150.png',
      bio: 'Passionate about providing our children with a faith-based, academically rigorous education at Valley Christian.',
      campaignsCreated: 1, location: 'Phoenix, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Blessing Partner', amount: 250, description: 'Support one month of education for the Leavitt children.', perks: ['Tax credit receipt', 'Family thank-you note', 'Campaign updates'], claimed: 0, eta: 'Aug 2026' },
      { id: 't2', title: 'Legacy Sponsor', amount: 1500, description: 'Fund one semester of tuition for all children.', perks: ['Tax credit receipt', 'Named recognition', 'Family letter', 'Year-end impact update'], claimed: 0, limit: 10, eta: 'Aug 2026' },
      { id: 't3', title: 'Generational Partner', amount: 3750, description: 'Fully fund one academic year for the entire family.', perks: ['All above perks', 'Named family scholarship', 'Family gathering invitation', 'Annual recognition'], claimed: 0, limit: 4, eta: 'Aug 2026' },
    ],
    updates: [],
    faqs: [
      { question: 'How many children are in the family?', answer: 'The Leavitt family has multiple children at Valley Christian School, all benefiting from tuition assistance made possible through your support.' },
      { question: 'Is my donation tax-credited?', answer: 'Yes! Your donation qualifies for the Arizona Private School Tax Credit under A.R.S. § 43-1089, allowing you to redirect up to $1,459 (single) or $2,918 (married) of your state taxes.' },
    ],
  },

  // ── 15. SCOTT SPAULDING ─────────────────────────────────────────────────
  {
    id: '15',
    title: 'Help the Spaulding Family Continue Christian Education',
    tagline: 'Bridging the gap so the Spaulding children can thrive at Valley Christian School.',
    story: `**A Foundation Built on Faith**\nFor the Spaulding family, choosing Valley Christian School means choosing an education rooted in faith, purpose, and excellence. Their children are being equipped not only with strong academics, but also with the values and principles that will guide them throughout their lives.\n\n**The Valley Christian Experience**\nValley Christian provides a unique environment where students are encouraged to grow spiritually, build meaningful relationships, and develop into confident, faith-driven individuals. Every aspect of the day—from classes to chapel to extracurricular activities—reinforces biblical values alongside academic rigor.\n\n**Making It Possible**\nWhile the impact of this education is invaluable, the financial commitment can be challenging. Through ACTSTO, generous donors have the opportunity to come alongside families like the Spauldings to help make this possible.\n\n**How Your Support Helps**\nYour donation provides direct tuition assistance, helping the Spaulding family continue their children's education at Valley Christian School. This support reduces financial stress on the family and allows them to focus on what matters most: their children's growth and development.\n\n**Thank You**\nWe are grateful for your support and partnership. Together, we can help provide a strong foundation for the next generation. Your generosity is more than a donation—it's an investment in young lives shaped by faith, integrity, and excellence.`,
    category: 'Elementary Schools',
    goal: 15000,
    raised: 0,
    backers: 0,
    daysLeft: 90,
    image: 'https://arizonachristiantuition.com/wp-content/uploads/2026/03/vcs_photo_7.jpg',
    tags: ['Valley Christian', 'Multiple Children', 'Elementary', 'Tax Credit'],
    featured: false,
    status: 'active',
    createdAt: '2026-03-26',
    creator: {
      id: 'scott_spaulding', name: 'Scott Spaulding', avatar: 'https://arizonachristiantuition.com/wp-content/uploads/2025/12/SS1-150x150.png',
      bio: 'Committed to a Christ-centered education for my family at Valley Christian School in Phoenix.',
      campaignsCreated: 1, location: 'Phoenix, AZ',
    },
    pledgeTiers: [
      { id: 't1', title: 'Growth Partner', amount: 250, description: 'Support one month of the Spaulding children\'s education.', perks: ['Tax credit receipt', 'Family gratitude note', 'Campaign updates'], claimed: 0, eta: 'Aug 2026' },
      { id: 't2', title: 'Impact Sponsor', amount: 1500, description: 'Fund one semester of tuition assistance.', perks: ['Tax credit receipt', 'Named in family appreciation', 'Thank-you letter from children', 'Year-end report'], claimed: 0, limit: 10, eta: 'Aug 2026' },
      { id: 't3', title: 'Covenant Partner', amount: 3750, description: 'Fully fund one academic year for the family.', perks: ['All above perks', 'Named family scholarship', 'Family appreciation dinner', 'Annual impact recognition'], claimed: 0, limit: 4, eta: 'Aug 2026' },
    ],
    updates: [],
    faqs: [
      { question: 'What makes Valley Christian special?', answer: 'Valley Christian integrates faith with academics, creating an environment where students grow spiritually and intellectually. Small class sizes, experienced faculty, and a biblical worldview are hallmarks of the school.' },
      { question: 'Will I receive a tax credit?', answer: 'Absolutely! Your donation qualifies for Arizona\'s Private School Tax Credit under A.R.S. § 43-1089. Redirect up to $1,459 (single) or $2,918 (married) of your state tax liability.' },
    ],
  },
];

export const MOCK_USER = {
  id: 'u_current',
  name: 'Sarah Mitchell',
  email: 'sarah@arizonachristiantuition.com',
  avatar: 'https://i.pravatar.cc/150?img=47',
  bio: 'Arizona Christian Tuition donor and advocate. Redirecting my taxes to fund Christian education since 2021.',
  location: 'Scottsdale, AZ',
  joinedDate: 'January 2021',
  totalBacked: 4,
  totalPledged: 1750,
  campaignsCreated: 0,
};

export const MOCK_PLEDGES = [
  { campaignId: '2', tierId: 't2', amount: 500, date: '2026-03-01', status: 'confirmed' as const },
  { campaignId: '4', tierId: 't2', amount: 900, date: '2026-02-20', status: 'confirmed' as const },
  { campaignId: '7', tierId: 't1', amount: 100, date: '2026-03-10', status: 'confirmed' as const },
  { campaignId: '9', tierId: 't1', amount: 200, date: '2026-03-15', status: 'confirmed' as const },
];
