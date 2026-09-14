import {
  AcademicSession,
  Executive,
  Committee,
  EventItem,
  Article,
  GalleryItem,
  FAQItem,
  DonationCause,
  DonationRecord,
  Member,
  AdminUser,
  ActivityLog,
  SiteContent,
  HeroSlide,
  ELibraryItem
} from '../types';

export const FUD_FACULTIES = [
  {
    name: 'Faculty of Agriculture',
    departments: [
      'B. Agricultural Science',
      'B. Fisheries and Aquaculture',
      'B. Forestry and Wildlife Management',
      'B. Food Science and Technology'
    ]
  },
  {
    name: 'Faculty of Arts and Social Sciences',
    departments: [
      'B.A. Arabic',
      'B.Sc. Criminology and Security Studies',
      'B.Sc. Economics',
      'B.A. English Language',
      'B. Library and Information Science',
      'B.A. Linguistics (Arabic)',
      'B.A. Linguistics (English)',
      'B.Sc. Political Science'
    ]
  },
  {
    name: 'Faculty of Basic Medical Sciences',
    departments: [
      'B.Sc. Environmental Health Sciences',
      'B.Sc. Human Anatomy',
      'B.Sc. Human Physiology',
      'B.NSc. Nursing Science',
      'B.Sc. Public Health'
    ]
  },
  {
    name: 'Faculty of Clinical Sciences',
    departments: [
      'MBBS (Medicine and Surgery)'
    ]
  },
  {
    name: 'Faculty of Computing',
    departments: [
      'B.Sc. Computer Science',
      'B.Sc. Cyber Security',
      'B.Sc. Information Technology',
      'B.Sc. Software Engineering'
    ]
  },
  {
    name: 'Faculty of Education',
    departments: [
      'B.(Ed) Islamic Studies',
      'B.Ed. Primary Education'
    ]
  },
  {
    name: 'Faculty of Management Sciences',
    departments: [
      'B.Sc. Accounting',
      'B.Sc. Actuarial Science',
      'B.Sc. Banking and Finance',
      'B.Sc. Business Administration',
      'B.Sc. Insurance',
      'B.Sc. Taxation'
    ]
  },
  {
    name: 'Faculty of Life Sciences',
    departments: [
      'B.Sc. Biochemistry',
      'B.Sc. Biology',
      'B.Sc. Biotechnology',
      'B.Sc. Botany',
      'B.Sc. Microbiology',
      'B.Sc. Zoology'
    ]
  },
  {
    name: 'Faculty of Physical Sciences',
    departments: [
      'B.Sc. Chemistry',
      'B.Sc. Environmental Management and Toxicology',
      'B.Sc. Industrial Chemistry',
      'B.Sc. Industrial Mathematics',
      'B.Sc. Mathematics',
      'B.Sc. Physics'
    ]
  }
];

export const INITIAL_SESSIONS: AcademicSession[] = [
  {
    id: 'session-2026-2027',
    name: '2026/2027',
    isCurrent: true,
    theme: 'Steadfastness in Faith, Excellence in Scholarship',
    startYear: 2026,
    endYear: 2027
  },
  {
    id: 'session-2025-2026',
    name: '2025/2026',
    isCurrent: false,
    theme: 'Reviving the Prophetic Legacy on Campus',
    startYear: 2025,
    endYear: 2026
  },
  {
    id: 'session-2024-2025',
    name: '2024/2025',
    isCurrent: false,
    theme: 'Building a Resilient Generation of Du\'at',
    startYear: 2024,
    endYear: 2025
  },
  {
    id: 'session-2023-2024',
    name: '2023/2024',
    isCurrent: false,
    theme: 'Cultivating Leadership and Moral Uprightness',
    startYear: 2023,
    endYear: 2024
  }
];

export const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Mal. Nasirudeen Albany',
    email: 'amir@mssnfud.org',
    role: 'super_admin',
    portfolio: 'Amir (President) & Chief Administrator',
    avatarUrl: '/amir.jpg'
  },
  {
    id: 'admin-2',
    name: 'Br. Abubakar Kabir',
    email: 'secretary@mssnfud.org',
    role: 'executive',
    portfolio: 'General Secretary',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'admin-3',
    name: 'Br. Ahmad Tukur',
    email: 'pro@mssnfud.org',
    role: 'pro_editor',
    portfolio: 'Public Relations Officer (PRO)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  },
  {
    id: 'admin-4',
    name: 'Sr. Fatima Umar Farouq',
    email: 'amirah@mssnfud.org',
    role: 'executive',
    portfolio: 'Amirah (Sisters Coordinator)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_COMMITTEES: Committee[] = [
  {
    id: 'comm-dawah',
    name: "Da'wah & Tarbiyyah Committee",
    slug: 'dawah-tarbiyyah',
    iconName: 'BookOpen',
    shortDescription: "Oversees spiritual development, weekly Halqahs, Tahajjud nights, and campus Islamic orientation.",
    fullDescription: "The Da'wah & Tarbiyyah Committee serves as the spiritual heartbeat of MSSN FUD. It coordinates structured learning circles, campus Da'wah outreach, inter-hostel visitations, public lectures by visiting scholars, and moral mentoring for freshmen.",
    objectives: [
      "Conduct weekly campus Usrah and Tajweed classes for students.",
      "Organize the Annual Orientation Week and Islamic Vacation Course (IVC).",
      "Produce spiritual reminders and Friday sermon bullet points.",
      "Manage new Muslim reversion support and mentorship."
    ],
    meetingSchedule: 'Wednesdays after Asr Prayer @ FUD Central Mosque',
    headName: 'Br. Usman Bello',
    headMatric: 'FUD/22/FAS/038',
    headPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    secretaryName: 'Br. Haruna Salisu',
    activeSession: '2026/2027'
  },
  {
    id: 'comm-welfare',
    name: 'Welfare & Humanitarian Committee',
    slug: 'welfare-humanitarian',
    iconName: 'HeartHandshake',
    shortDescription: "Supports indigent Muslim students, handles hostel distress calls, food relief, and hospital visitation.",
    fullDescription: "Dedicated to living the Prophetic virtue of compassion. This committee ensures no Muslim student drops out or starves on campus due to financial strain, organizing emergency relief packages and hospital visits.",
    objectives: [
      "Coordinate Friday Jum'ah free food packages for needy students.",
      "Manage emergency medical and hostel accommodation relief funds.",
      "Host bi-monthly visits to Dutse General Hospital and orphanages.",
      "Facilitate clothes and textbook swap drives."
    ],
    meetingSchedule: 'Fridays after Jum\'ah @ Secretariat Lounge',
    headName: 'Br. Zakariyya Idris',
    headMatric: 'FUD/21/AGR/019',
    headPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    secretaryName: 'Sr. Zainab Abdullahi',
    activeSession: '2026/2027'
  },
  {
    id: 'comm-academic',
    name: 'Academic Excellence & Tutorial Committee',
    slug: 'academic-excellence',
    iconName: 'GraduationCap',
    shortDescription: "Organizes free campus tutorials, past question archives, research clinics, and CGPA enhancement programs.",
    fullDescription: "Ensures that Muslim students in Federal University Dutse consistently lead in academic excellence. Coordinates weekly tutorials for 100L–300L courses across faculties and provides mentoring by First Class scholars.",
    objectives: [
      "Run free weekend tutorials in General Studies (GST), MTH101, PHY101, CHM101, and BIO101.",
      "Maintain a digitized archive of past exams and lecture summaries.",
      "Host the Annual 'Academic Summit & First Class Scholar Honors'.",
      "Provide one-on-one academic counseling for struggling students."
    ],
    meetingSchedule: 'Saturdays 9:00 AM @ Twin Lecture Theatre B',
    headName: 'Br. Hamza Shehu',
    headMatric: 'FUD/21/SCI/007',
    headPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    secretaryName: 'Br. Sadiq Mustapha',
    activeSession: '2026/2027'
  },
  {
    id: 'comm-sisters',
    name: "Sisters' Affairs Wing (Ummahatul Mu'mineen)",
    slug: 'sisters-affairs',
    iconName: 'Sparkles',
    shortDescription: "Caters exclusively to Muslim sisters' spiritual growth, modesty, vocational skills, and welfare on campus.",
    fullDescription: "The Sisters' Wing fosters a supportive, dignified sisterhood on campus. It provides safe spaces for discussions on Islamic womanhood, career balance, modest fashion, mental wellness, and entrepreneurship.",
    objectives: [
      "Organize the landmark Annual Sisters' Seminar & Hijab Day Rally.",
      "Host weekly Sisters' Usrah and Fiqh of Taharah/Salah sessions in the female hostels.",
      "Coordinate vocational masterclasses (baking, tailoring, digital design, henna).",
      "Provide mentorship for freshmen female students."
    ],
    meetingSchedule: 'Sundays 4:00 PM @ Female Hostel Common Hall',
    headName: 'Sr. Fatima Umar Farouq',
    headMatric: 'FUD/21/SCI/044',
    headPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    secretaryName: 'Sr. Maryam Garba',
    activeSession: '2026/2027'
  },
  {
    id: 'comm-publicity',
    name: 'Publicity, Media & ICT Committee',
    slug: 'publicity-media-ict',
    iconName: 'Megaphone',
    shortDescription: "Manages digital media, graphic designs, live streams, website/ID portal, and public announcements.",
    fullDescription: "The voice and digital engine of MSSN FUD. Responsible for high-impact social media coverage, audio-visual recording of lectures, broadcast management, and maintenance of the digital student ID portal.",
    objectives: [
      "Design flyers, infographics, and documentary reels for all chapter events.",
      "Livestream Friday Khutbahs and guest lectures on official channels.",
      "Manage student registration records and digital e-ID card dispatch.",
      "Produce digital bulletins and event photography."
    ],
    meetingSchedule: 'Thursdays 5:00 PM @ ICT Resource Hub',
    headName: 'Br. Ahmad Tukur',
    headMatric: 'FUD/22/FAS/081',
    headPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    secretaryName: 'Br. Bilal Sanusi',
    activeSession: '2026/2027'
  },
  {
    id: 'comm-program',
    name: 'Program, Protocol & Events Committee',
    slug: 'program-protocol',
    iconName: 'CalendarCheck',
    shortDescription: "Plans, coordinates, and executes major chapter gatherings, logistics, venue setups, and VIP hospitality.",
    fullDescription: "The operational engine behind mega-programs such as Jihad Week, Annual Ramadan Iftar, Send-off Ceremonies, and Inter-University Islamic Conferences.",
    objectives: [
      "Secure university facility approvals and audio/visual setup.",
      "Handle protocol, guest speaker lodging, and dignitary reception.",
      "Develop comprehensive minute-by-minute event itineraries.",
      "Manage ushering and crowd logistics during peak programs."
    ],
    meetingSchedule: 'Mondays 5:30 PM @ MSSN Secretariat',
    headName: 'Br. Abdulrahman Sani',
    headMatric: 'FUD/21/FMS/022',
    headPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    secretaryName: 'Br. Mahmud Yahaya',
    activeSession: '2026/2027'
  },
  {
    id: 'comm-sports',
    name: 'Sports & Social Activities Committee',
    slug: 'sports-social',
    iconName: 'Trophy',
    shortDescription: "Promotes physical fitness in line with the Sunnah through tournaments, health walks, and halal recreation.",
    fullDescription: "Champions physical wellness and brotherhood among students through structured sports activities, inter-faculty Islamic games, and healthy living campaigns.",
    objectives: [
      "Host the Annual MSSN Inter-Faculty Halal Football Cup.",
      "Organize Saturday morning physical fitness & endurance walks.",
      "Host table tennis, badminton, and archery workshops.",
      "Educate students on healthy dietary Sunnah and fitness habits."
    ],
    meetingSchedule: 'Saturdays 7:00 AM @ University Sports Complex',
    headName: 'Br. Mukhtar Adamu',
    headMatric: 'FUD/22/FMS/055',
    headPhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    secretaryName: 'Br. Bashir Musa',
    activeSession: '2026/2027'
  },
  {
    id: 'comm-discipline',
    name: "Discipline & Shari'ah Advisory Committee",
    slug: 'discipline-shariah',
    iconName: 'Scale',
    shortDescription: "Provides guidance on Islamic conduct, ethical ethics on campus, and resolution of student disputes.",
    fullDescription: "Works closely with the Council of Elders and Staff Advisers to preserve the pristine reputation of the Society and mediate disputes between Muslim students.",
    objectives: [
      "Maintain code of conduct guidelines during all MSSN programs.",
      "Mediate interpersonal misunderstandings among members amicably.",
      "Advocate for student religious rights before university management.",
      "Provide confidential Islamic guidance on student ethical challenges."
    ],
    meetingSchedule: 'Bi-weekly Tuesdays after Maghrib @ Central Mosque',
    headName: 'Br. Al-Amin Dahiru',
    headMatric: 'FUD/21/FAS/012',
    headPhoto: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80',
    secretaryName: 'Br. Kamilu Ibrahim',
    activeSession: '2026/2027'
  },
  {
    id: 'comm-finance',
    name: 'Finance & Treasury Committee',
    slug: 'finance-treasury',
    iconName: 'Coins',
    shortDescription: "Oversees transparent budgeting, financial accountability, member dues, and investment initiatives.",
    fullDescription: "Custodians of the Society's treasury. Prepares transparent semester financial statements, manages donations, and ensures Shari'ah compliance in all monetary transactions.",
    objectives: [
      "Prepare and publish comprehensive semester financial balance sheets.",
      "Manage Friday Sadaqah collections with dual-custody verification.",
      "Issue official electronic receipts for all incoming contributions.",
      "Develop halal endowment (Waqf) projects for long-term sustainability."
    ],
    meetingSchedule: 'Sundays 11:00 AM @ Secretariat Boardroom',
    headName: 'Br. Mustapha Aliyu',
    headMatric: 'FUD/22/FAS/015',
    headPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    secretaryName: 'Sr. Hafsat Kabir',
    activeSession: '2026/2027'
  }
];

export const INITIAL_EXECUTIVES: Executive[] = [
  // 2026/2027 Session (Current Active Council)
  {
    id: 'exec-26-1',
    name: 'Mal. Nasirudeen Albany',
    portfolio: 'Amir (President)',
    arabicTitle: 'الرئيس',
    session: '2026/2027',
    department: 'Clinical Sciences',
    level: '500L',
    photoUrl: '/amir.jpg',
    phone: '+234 803 123 4567',
    email: 'amir@mssnfud.org',
    bio: '500L Clinical Sciences scholar dedicated to servant leadership, community health outreaches, spiritual tarbiyyah, and academic distinction across campus.',
    order: 1
  },
  {
    id: 'exec-26-2',
    name: 'Sister Fatima Umar Farouq',
    portfolio: 'Amirah (Sisters\' Coordinator)',
    arabicTitle: 'أميرة الأخوات',
    session: '2026/2027',
    department: 'Microbiology',
    level: '400L',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    phone: '+234 806 234 5678',
    email: 'amirah@mssnfud.org',
    bio: 'Passionate about empowering Muslim sisters through Islamic knowledge, modesty, and academic excellence.',
    order: 2
  },
  {
    id: 'exec-26-3',
    name: 'Brother Abdulrahman Sani',
    portfolio: 'Naibul Amir (Administration)',
    arabicTitle: 'نائب الرئيس للشؤون الإدارية',
    session: '2026/2027',
    department: 'Accounting',
    level: '400L',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    phone: '+234 802 345 6789',
    email: 'admin.naib@mssnfud.org',
    bio: 'Supervises administrative operations, committee synergy, and executive protocols.',
    order: 3
  },
  {
    id: 'exec-26-4',
    name: 'Brother Usman Bello',
    portfolio: 'Naibul Amir (Da\'wah & Tarbiyyah)',
    arabicTitle: 'نائب الرئيس لشؤون الدعوة',
    session: '2026/2027',
    department: 'Islamic Studies',
    level: '400L',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    phone: '+234 809 456 7890',
    email: 'dawah@mssnfud.org',
    bio: 'Oversees campus Usrah, guest lectures, and spiritual development curricula.',
    order: 4
  },
  {
    id: 'exec-26-5',
    name: 'Brother Abubakar Kabir',
    portfolio: 'General Secretary',
    arabicTitle: 'الأمين العام',
    session: '2026/2027',
    department: 'Software Engineering',
    level: '400L',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    phone: '+234 808 567 8901',
    email: 'secretary@mssnfud.org',
    bio: 'Custodian of records, official correspondence, minutes, and executive documentation.',
    order: 5
  },
  {
    id: 'exec-26-6',
    name: 'Sister Maryam Garba',
    portfolio: 'Naibatul Amirah (Administration)',
    arabicTitle: 'نائبة الأميرة',
    session: '2026/2027',
    department: 'Nursing Science',
    level: '400L',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    phone: '+234 805 678 9012',
    email: 'sisters.admin@mssnfud.org',
    bio: 'Assists in coordinating female student welfare, health outreaches, and sisterhood circles.',
    order: 6
  },
  {
    id: 'exec-26-7',
    name: 'Brother Mustapha Aliyu',
    portfolio: 'Financial Secretary',
    arabicTitle: 'الأمين المالي',
    session: '2026/2027',
    department: 'Economics',
    level: '400L',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    phone: '+234 814 789 0123',
    email: 'finance@mssnfud.org',
    bio: 'Manages chapter bookkeeping, budget transparency, and donation reconciliations.',
    order: 7
  },
  {
    id: 'exec-26-8',
    name: 'Brother Ahmad Tukur',
    portfolio: 'Public Relations Officer (PRO)',
    arabicTitle: 'مسؤول العلاقات العامة والإعلام',
    session: '2026/2027',
    department: 'Political Science',
    level: '400L',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    phone: '+234 813 890 1234',
    email: 'pro@mssnfud.org',
    bio: 'Leads public communications, press releases, media broadcasts, and community engagement.',
    order: 8
  },
  {
    id: 'exec-26-9',
    name: 'Brother Zakariyya Idris',
    portfolio: 'Welfare Secretary',
    arabicTitle: 'أمين شؤون الرعاية',
    session: '2026/2027',
    department: 'Agronomy',
    level: '500L',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    phone: '+234 810 901 2345',
    email: 'welfare@mssnfud.org',
    bio: 'Coordinates emergency assistance, hostel distress responses, and feeding drives for students.',
    order: 9
  },
  {
    id: 'exec-26-10',
    name: 'Brother Hamza Shehu',
    portfolio: 'Director of Studies (Academic)',
    arabicTitle: 'مدير الدراسات الأكاديمية',
    session: '2026/2027',
    department: 'Mathematics',
    level: '400L',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    phone: '+234 816 012 3456',
    email: 'academic@mssnfud.org',
    bio: 'Championing academic excellence, free departmental tutorials, and research mentoring.',
    order: 10
  },

  // 2024/2025 Session (Past Council)
  {
    id: 'exec-24-1',
    name: 'Brother Ibrahim Muhammad Danjuma',
    portfolio: 'Amir (President)',
    arabicTitle: 'الرئيس السابق',
    session: '2024/2025',
    department: 'Computer Science',
    level: 'Alumni',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    phone: '+234 803 123 4567',
    email: 'ibrahim.past@mssnfud.org',
    bio: 'Dedicated to student leadership, spiritual revival, and technology integration in Da\'wah.',
    order: 1
  },

  // 2023/2024 Session (Past Council)
  {
    id: 'exec-23-1',
    name: 'Brother Mansur Abdullahi Garki',
    portfolio: 'Amir (President)',
    arabicTitle: 'الرئيس السابق',
    session: '2023/2024',
    department: 'Biochemistry',
    level: 'Alumni',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    bio: 'Led the landmark construction of the MSSN Resource Center Annex during the 2023/2024 tenure.',
    order: 1
  },
  {
    id: 'exec-23-2',
    name: 'Sister Aisha Dahiru Ringim',
    portfolio: 'Amirah (Sisters\' Coordinator)',
    arabicTitle: 'أميرة الأخوات السابقة',
    session: '2023/2024',
    department: 'English Language',
    level: 'Alumni',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    bio: 'Expanded the Sisters\' Vocational Training Center and launched the Hijab Mentorship Series.',
    order: 2
  },
  {
    id: 'exec-23-3',
    name: 'Brother Nura Lawan',
    portfolio: 'General Secretary',
    arabicTitle: 'الأمين العام السابق',
    session: '2023/2024',
    department: 'Political Science',
    level: 'Alumni',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    bio: 'Instituted the first digitized general archive of MSSN FUD executive meeting minutes.',
    order: 3
  },

  // 2022/2023 Session (Past Council)
  {
    id: 'exec-22-1',
    name: 'Brother Sanusi Rabiu Hadejia',
    portfolio: 'Amir (President)',
    arabicTitle: 'الرئيس الأسبق',
    session: '2022/2023',
    department: 'Accounting',
    level: 'Alumni',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    bio: 'Spearheaded the chapter\'s historic post-lockdown spiritual re-orientation programs.',
    order: 1
  },
  {
    id: 'exec-22-2',
    name: 'Sister Khadija Mukhtar',
    portfolio: 'Amirah (Sisters\' Coordinator)',
    arabicTitle: 'أميرة الأخوات الأسبق',
    session: '2022/2023',
    department: 'Medicine & Surgery',
    level: 'Alumni',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    bio: 'Established the Medical Health Clinic outreach during Jihad Week 2023.',
    order: 2
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    membershipId: 'MSSNFUD/2026/001',
    fullName: 'Mal. Nasirudeen Albany',
    matricNumber: 'FUD/21/MED/002',
    faculty: 'College of Medicine & Allied Health',
    department: 'Clinical Sciences',
    level: '500L',
    phone: '08031234567',
    email: 'amir@mssnfud.org',
    stateOfOrigin: 'Jigawa',
    photoUrl: '/amir.jpg',
    committeePreference: "Da'wah & Tarbiyyah Committee",
    secondaryCommittee: 'Academic Excellence & Tutorial Committee',
    session: '2026/2027',
    registrationDate: '2026-08-10T10:30:00.000Z',
    status: 'active',
    securityHash: 'FUD-SEC-9841-A2B'
  },
  {
    id: 'mem-2',
    membershipId: 'MSSNFUD/2026/002',
    fullName: 'Fatima Umar Farouq',
    matricNumber: 'FUD/21/SCI/044',
    faculty: 'Faculty of Science',
    department: 'Microbiology',
    level: '400L',
    phone: '08062345678',
    email: 'fatima.farouq@fud.edu.ng',
    stateOfOrigin: 'Kano',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    committeePreference: "Sisters' Affairs Wing (Ummahatul Mu'mineen)",
    secondaryCommittee: 'Welfare & Humanitarian Committee',
    session: '2026/2027',
    registrationDate: '2026-08-12T14:15:00.000Z',
    status: 'active',
    securityHash: 'FUD-SEC-3321-K8P'
  },
  {
    id: 'mem-3',
    membershipId: 'MSSNFUD/2026/003',
    fullName: 'Abubakar Kabir Salisu',
    matricNumber: 'FUD/22/SCI/018',
    faculty: 'Faculty of Computing',
    department: 'Software Engineering',
    level: '400L',
    phone: '08085678901',
    email: 'abubakar.kabir@fud.edu.ng',
    stateOfOrigin: 'Kaduna',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    committeePreference: 'Publicity, Media & ICT Committee',
    secondaryCommittee: 'Academic Excellence & Tutorial Committee',
    session: '2026/2027',
    registrationDate: '2026-08-15T09:45:00.000Z',
    status: 'active',
    securityHash: 'FUD-SEC-7712-M4Z'
  },
  {
    id: 'mem-4',
    membershipId: 'MSSNFUD/2026/004',
    fullName: 'Zainab Abdullahi Shehu',
    matricNumber: 'FUD/23/MED/009',
    faculty: 'College of Medicine & Allied Health',
    department: 'Nursing Science',
    level: '300L',
    phone: '08123456789',
    email: 'zainab.shehu@fud.edu.ng',
    stateOfOrigin: 'Katsina',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    committeePreference: 'Welfare & Humanitarian Committee',
    secondaryCommittee: "Sisters' Affairs Wing (Ummahatul Mu'mineen)",
    session: '2026/2027',
    registrationDate: '2026-08-18T16:20:00.000Z',
    status: 'active',
    securityHash: 'FUD-SEC-1290-X9Q'
  },
  {
    id: 'mem-5',
    membershipId: 'MSSNFUD/2026/005',
    fullName: 'Hamza Shehu Aliyu',
    matricNumber: 'FUD/21/SCI/007',
    faculty: 'Faculty of Science',
    department: 'Mathematics',
    level: '400L',
    phone: '08160123456',
    email: 'hamza.shehu@fud.edu.ng',
    stateOfOrigin: 'Bauchi',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    committeePreference: 'Academic Excellence & Tutorial Committee',
    secondaryCommittee: "Da'wah & Tarbiyyah Committee",
    session: '2026/2027',
    registrationDate: '2026-08-20T11:10:00.000Z',
    status: 'active',
    securityHash: 'FUD-SEC-4491-T3V'
  },
  {
    id: 'mem-6',
    membershipId: 'MSSNFUD/2026/006',
    fullName: 'Maryam Garba Ringim',
    matricNumber: 'FUD/22/MED/031',
    faculty: 'College of Medicine & Allied Health',
    department: 'Medical Laboratory Science',
    level: '400L',
    phone: '08056789012',
    email: 'maryam.garba@fud.edu.ng',
    stateOfOrigin: 'Jigawa',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    committeePreference: "Sisters' Affairs Wing (Ummahatul Mu'mineen)",
    secondaryCommittee: 'Program, Protocol & Events Committee',
    session: '2026/2027',
    registrationDate: '2026-08-22T13:40:00.000Z',
    status: 'active',
    securityHash: 'FUD-SEC-6619-R2D'
  },
  {
    id: 'mem-7',
    membershipId: 'MSSNFUD/2026/007',
    fullName: 'Mukhtar Adamu Dutse',
    matricNumber: 'FUD/22/FMS/055',
    faculty: 'Faculty of Management Sciences',
    department: 'Business Administration',
    level: '400L',
    phone: '08098765432',
    email: 'mukhtar.adamu@fud.edu.ng',
    stateOfOrigin: 'Jigawa',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    committeePreference: 'Sports & Social Activities Committee',
    secondaryCommittee: 'Finance & Treasury Committee',
    session: '2026/2027',
    registrationDate: '2026-08-25T15:00:00.000Z',
    status: 'active',
    securityHash: 'FUD-SEC-5503-L7N'
  },
  {
    id: 'mem-8',
    membershipId: 'MSSNFUD/2026/008',
    fullName: 'Aisha Bello Kazaure',
    matricNumber: 'FUD/24/FAS/012',
    faculty: 'Faculty of Arts and Social Sciences',
    department: 'Economics',
    level: '200L',
    phone: '08145678901',
    email: 'aisha.kazaure@fud.edu.ng',
    stateOfOrigin: 'Jigawa',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    committeePreference: "Sisters' Affairs Wing (Ummahatul Mu'mineen)",
    secondaryCommittee: 'Academic Excellence & Tutorial Committee',
    session: '2026/2027',
    registrationDate: '2026-09-01T08:30:00.000Z',
    status: 'active',
    securityHash: 'FUD-SEC-8820-C1W'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    title: 'MSSN FUD Annual Jihad Week 2026: The Resilient Muslim Scholar',
    category: 'dawah',
    session: '2026/2027',
    date: '2026-11-18',
    time: '9:00 AM - 5:00 PM Daily',
    venue: 'Convocation Arena & Twin Lecture Theatres, Federal University Dutse',
    flyerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80'
    ],
    summary: 'A 7-day flagship Islamic conference featuring renowned scholars across Northern Nigeria, Quran recitations, debate contests, and exhibitions.',
    fullDetails: 'The Annual Jihad Week is the single largest Islamic gathering at Federal University Dutse. It brings together over 3,000 students and academics for 7 days of spiritual upliftment, leadership masterclasses, book fairs, and inter-university Quran competitions.',
    speakers: ['Sheikh Dr. Isa Ali Pantami', 'Prof. Salisu Shehu', 'Dr. Mansur Ibrahim Sokoto', 'Dr. Bashir Aliyu Umar', 'Amir Mal. Nasirudeen Albany'],
    status: 'upcoming',
    featured: true
  },
  {
    id: 'event-2',
    title: 'Free Semester Academic Bootcamp (100L–500L GST & Core Courses)',
    category: 'academic',
    session: '2026/2027',
    date: '2026-10-08',
    time: '8:30 AM - 1:00 PM (Saturdays & Sundays)',
    venue: 'Twin Lecture Theatre A & Faculty of Science Labs',
    flyerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    summary: 'Intensive peer tutoring by First Class scholars covering MTH101, PHY101, CHM101, BIO101, GST courses, and clinical sciences mentoring.',
    fullDetails: 'Organized by the Directorate of Studies. Handouts, previous examination question breakdowns, and simulated CBT mock tests are provided free of charge for all participants.',
    speakers: ['Br. Hamza Shehu (Overall Best Student in Math)', 'Br. Abubakar Kabir (First Class Software Eng.)'],
    status: 'upcoming',
    featured: true
  },
  {
    id: 'event-3',
    title: 'National Sisters\' Hijab & Modesty Summit (Ummahatul Mu\'mineen)',
    category: 'sisters',
    session: '2026/2027',
    date: '2026-10-22',
    time: '10:00 AM - 3:00 PM',
    venue: 'ETF Auditorium, Federal University Dutse',
    flyerUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    summary: 'A celebrated gathering of Muslim women discussing spiritual resilience, breaking stereotypes in medicine & tech, and vocational enterprise.',
    fullDetails: 'Features interactive panel sessions, modest fashion demonstrations, free health screenings (BP & blood sugar checks), and a hands-on tech craft workshop for sisters.',
    speakers: ['Dr. Halima Abubakar (Consultant FMC Dutse)', 'Ustadha Maryam Lemu', 'Sr. Fatima Umar Farouq'],
    status: 'upcoming',
    featured: false
  },
  {
    id: 'event-4',
    title: 'Annual Ramadan Iftar Feeding & Tahajjud Program 1448 AH',
    category: 'ramadan',
    session: '2026/2027',
    date: '2027-02-15',
    time: 'Daily from 6:00 PM - 8:30 PM',
    venue: 'FUD Central Mosque Courtyard',
    flyerUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80',
    summary: 'Daily communal fast-breaking meals (Iftar & Sahoor packs) for over 500 staying students, plus Qiyamul Layl in the last ten days.',
    fullDetails: 'Supported by benevolent staff, alumni, and donors. Ensures every fasting student on campus receives a nutritious meal, dates, and water during the blessed month of Ramadan.',
    speakers: ['Chief Imam FUD Central Mosque', 'Amir Mal. Nasirudeen Albany'],
    status: 'upcoming',
    featured: true
  },
  {
    id: 'event-5',
    title: 'Freshmen Islamic Orientation & Matriculation Welcome Dinner',
    category: 'orientation',
    session: '2026/2027',
    date: '2026-09-28',
    time: '4:00 PM - 7:00 PM',
    venue: 'FUD Student Center Hall',
    flyerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    summary: 'Welcoming the new intake with essential guidance on navigating university academics, campus hostels, and preserving Islamic values.',
    fullDetails: 'Attended by over 800 newly admitted 100L and Direct Entry Muslim students. Free handbook "The Muslim Student Guide to FUD" distributed.',
    speakers: ['Prof. Abdulkarim Sabo Mohammed (Vice Chancellor Representative)', 'Sheikh Dr. Haruna Sani', 'Amir Mal. Nasirudeen Albany'],
    status: 'completed',
    featured: false
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Balancing Deen and High Academic Excellence in University',
    slug: 'balancing-deen-and-academics',
    author: 'Mal. Nasirudeen Albany',
    authorRole: 'Amir, MSSN FUD (500L Clinical Sciences)',
    category: 'Academic & Spiritual Growth',
    readTime: '6 min read',
    publishedAt: '2026-08-14',
    session: '2026/2027',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    summary: 'A practical framework for Muslim university students on structuring prayer times, deep work study blocks, and barakah in academic pursuits.',
    content: `### The Myth of Separation
Many students mistakenly believe that spiritual devotion and academic excellence are competing priorities. In truth, seeking knowledge in computing, medicine, agriculture, or sciences with a sincere intention is an act of Ibadah (worship).

### 1. Structure Your Timetable Around the Five Daily Prayers
Instead of trying to fit Salah into your study schedule, anchor your daily blocks around Salah.
- **Fajr to 8:00 AM:** The golden hour of Barakah. Research shows memory consolidation is peak after dawn. Dedicate this quiet window to challenging quantitative subjects.
- **Dhuhr & Asr:** Natural breaks for reflection, hydration, and short review.
- **Maghrib to Isha:** Halqah and light reading.
- **Post-Isha:** Focused revision before restful sleep.

### 2. Sincerity of Intention (Ikhlas)
Begin every semester, assignment, and exam preparation with the Du'a:
*"Rabbi zidnee 'ilman"* (My Lord, increase me in knowledge). When you study to uplift the Ummah and benefit humanity, Allah opens doors of understanding that sheer intelligence alone cannot unlock.

### 3. Leverage the MSSN Peer Study Networks
Join the MSSN Academic Tutorials at the Twin Lecture Theatres. Teaching a junior colleague solidifies your own mastery and invites divine assistance into your endeavors.`,
    tags: ['Academics', 'Spiritual Growth', 'Time Management', 'Student Life'],
    featured: true
  },
  {
    id: 'art-2',
    title: 'The Muslim Woman in STEM: Navigating Dignity and Innovation at FUD',
    slug: 'muslim-woman-in-stem-fud',
    author: 'Sr. Fatima Umar Farouq',
    authorRole: 'Amirah, MSSN FUD (400L Microbiology)',
    category: 'Sisters\' Perspectives',
    readTime: '5 min read',
    publishedAt: '2025-01-28',
    session: '2024/2025',
    coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    summary: 'Reflections and actionable advice for female Muslim scholars excelling across science, technology, medicine, and research with modesty.',
    content: `### Standing Firm with Pride
Our Islamic history is rich with phenomenal female pioneers—from Fatima al-Fihri, who founded the world's oldest degree-granting university (University of al-Qarawiyyin), to Rufaida al-Aslamiyyah, the first female Muslim nurse and surgeon.

Today at Federal University Dutse, sisters are breaking boundaries in Medical Laboratory Science, Cybersecurity, Microbiology, and Agronomy.

### Three Guiding Principles:
1. **Modesty (Haya') is Your Strength:** Your Hijab and dignified demeanor are your professional identity and protection. Never feel the need to compromise your Islamic identity to fit in.
2. **Excellence in the Laboratory:** Strive to be the most thorough, punctual, and innovative researcher in your department.
3. **Sisterhood Networks:** Stay connected with the Sisters' Affairs Wing for mentorship, study partnerships, and mental health support.`,
    tags: ['Sisters', 'STEM', 'Modesty', 'Leadership'],
    featured: true
  },
  {
    id: 'art-3',
    title: 'Ramadan on Campus: Making the Most of the Blessed Month in Hostels',
    slug: 'ramadan-on-campus-fud',
    author: 'Br. Usman Bello',
    authorRole: 'Naibul Amir Da\'wah (300L Islamic Studies)',
    category: 'Fiqh & Worship',
    readTime: '4 min read',
    publishedAt: '2025-02-10',
    session: '2024/2025',
    coverImage: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80',
    summary: 'Essential guidelines for fasting students living in university dormitories, communal Sahoor strategies, and maximizing Quran recitation during exams.',
    content: `Ramadan brings a special serenity to the Federal University Dutse campus. The Central Mosque fills with brothers and sisters united in prayer.

Here is your survival and revival roadmap:
- **Participate in MSSN Communal Iftar:** Relieve financial stress and enjoy the brotherhood at the Central Mosque.
- **Form a Room Quran Circle:** Target completing at least one Khatmah (full recitation) of the Noble Quran by reciting 4 pages after every obligatory Salah.
- **Maintain High Energy for Lectures:** Prioritize complex carbohydrates and dates during Sahoor to avoid fatigue in midday lectures.`,
    tags: ['Ramadan', 'Fasting', 'Hostel Life', 'Worship'],
    featured: false
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Jihad Week 2024 Opening Ceremony at Convocation Arena',
    category: 'Jihad Week',
    session: '2023/2024',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    date: '2024-05-14',
    caption: 'Cross-section of over 2,500 students and dignitaries during the opening lecture.'
  },
  {
    id: 'gal-2',
    title: 'Academic Excellence Free Tutorial Session at Twin Lecture Theatre',
    category: 'Academics',
    session: '2024/2025',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    date: '2024-12-07',
    caption: '100L science students engaged during the Calculus & Physics revision clinic.'
  },
  {
    id: 'gal-3',
    title: 'Sisters\' Annual Hijab Day Seminar & Exhibition',
    category: 'Sisters Wing',
    session: '2023/2024',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    date: '2024-02-01',
    caption: 'Muslim sisters gathered for the interactive panel on career and modest enterprise.'
  },
  {
    id: 'gal-4',
    title: 'Campus Mosque Environmental Sanitation & Tree Planting',
    category: 'Welfare & Da\'wah',
    session: '2024/2025',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    date: '2024-11-23',
    caption: 'Volunteers participating in the Saturday morning campus clean-up exercise.'
  },
  {
    id: 'gal-5',
    title: 'MSSN FUD Inter-Faculty Halal Football Championship Final',
    category: 'Sports & Social',
    session: '2023/2024',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    date: '2024-06-20',
    caption: 'Faculty of Computing team celebrating victory after the sports tournament final.'
  },
  {
    id: 'gal-6',
    title: 'Freshmen Welcome Usrah & Islamic Orientation Gathering',
    category: 'Orientation',
    session: '2024/2025',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    date: '2024-11-28',
    caption: 'Orientation session presenting handbook packs to new student intakes.'
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who is eligible to join MSSN Federal University Dutse Chapter?',
    answer: 'Every Muslim student enrolled in any undergraduate, postgraduate, diploma, or remedial program across all faculties and departments at Federal University Dutse is automatically eligible. Membership is free, inclusive, and requires only completing our one-time registration form to receive your official digital e-ID card.',
    category: 'Membership',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'How do I obtain my official MSSNFUD Digital e-ID Card?',
    answer: 'Simply visit the "Register as Member" tab on this platform. Fill out your details (name, matric number, faculty, department, level, photo, and committee preference). Once submitted, the system automatically generates your unique e-ID card (format: MSSNFUD/year/number) complete with a verification QR code. You can download it as an image or print the high-resolution badge immediately.',
    category: 'Registration & ID Card',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'Do I need a password or login account to register as a student member?',
    answer: 'No! The student registration process is completely friction-free without any login or passwords. You fill the form once, receive your e-ID card instantly, and can always verify or retrieve your digital badge using your Matric Number or Membership ID.',
    category: 'Registration & ID Card',
    order: 3
  },
  {
    id: 'faq-4',
    question: 'What happens if I submit my registration but already registered before?',
    answer: 'The system prevents duplicate registrations by checking your Matric Number and Email. If you are already registered, it will alert you and instantly provide a direct link to view and re-download your existing e-ID card.',
    category: 'Registration & ID Card',
    order: 4
  },
  {
    id: 'faq-5',
    question: 'How can I join an MSSN Committee (e.g. Da\'wah, Academic, Welfare, Publicity)?',
    answer: 'During registration, select your preferred committee in the dropdown. You can also visit our "Committees" page to explore meeting schedules and connect directly with the Committee Chairman or Secretary. All active members are warmly invited to join weekly committee activities.',
    category: 'Committees',
    order: 5
  },
  {
    id: 'faq-6',
    question: 'Are the weekend academic tutorials really 100% free?',
    answer: 'Yes, absolutely. The Academic Excellence & Tutorial Committee coordinates free lectures and past-question clinics in GST, Mathematics, Physics, Chemistry, and Biology every weekend at the Twin Lecture Theatres as part of our Da\'wah to support student success.',
    category: 'Academics',
    order: 6
  },
  {
    id: 'faq-7',
    question: 'What special activities exist for Muslim sisters on campus?',
    answer: 'The Sisters\' Affairs Wing (Ummahatul Mu\'mineen) coordinates dedicated weekly Usrah, modesty and Hijab symposiums, craft/vocational workshops (baking, graphic design, sewing), counseling circles in the female hostels, and the Annual Sisters\' Seminar.',
    category: 'Sisters Wing',
    order: 7
  },
  {
    id: 'faq-8',
    question: 'How are donations and Sadaqah managed transparently?',
    answer: 'All contributions are channeled into dedicated, audited MSSN FUD bank accounts with dual-custody verification by the Financial Secretary and Amir. Financial statements are audited and presented each semester. Donors can also submit their transfer reference on our Donations page to receive instant acknowledgment.',
    category: 'Donations',
    order: 8
  }
];

export const INITIAL_CAUSES: DonationCause[] = [
  {
    id: 'cause-1',
    title: 'Indigent Muslim Student Emergency Welfare & Tuition Fund',
    description: 'Provides emergency financial relief for Muslim students facing severe hardship, tuition shortfall, food insecurity, or medical emergencies on campus.',
    targetAmount: 2500000,
    raisedAmount: 1680000,
    bankName: 'Jaiz Bank PLC',
    accountNumber: '0008472911',
    accountName: 'MSSN FUD Chapter (Welfare Account)',
    isActive: true,
    category: 'welfare',
    urgency: 'urgent'
  },
  {
    id: 'cause-2',
    title: 'FUD Campus Mosque Solar Inverter & Sound Enhancement Project',
    description: 'Upgrading the Central Mosque audio-visual system, continuous solar electricity for prayer lights and fans, and purchasing new carpets.',
    targetAmount: 1800000,
    raisedAmount: 1240000,
    bankName: 'TAJBank Ltd',
    accountNumber: '0019283746',
    accountName: 'MSSN FUD Chapter (Mosque Development)',
    isActive: true,
    category: 'infrastructure',
    urgency: 'high'
  },
  {
    id: 'cause-3',
    title: 'Ramadan 1446 AH Student Iftar & Sahoor Feeding Drive',
    description: 'Providing nutritious dates, hot meals, and drinking water daily for 500+ fasting students living in on-campus and off-campus hostels.',
    targetAmount: 3000000,
    raisedAmount: 2150000,
    bankName: 'Stanbic IBTC Bank',
    accountNumber: '9201847562',
    accountName: 'MSSN FUD Chapter (Ramadan Project)',
    isActive: true,
    category: 'welfare',
    urgency: 'high'
  },
  {
    id: 'cause-4',
    title: 'Free Quran, Hijab & Da\'wah Materials Distribution to Freshmen',
    description: 'Printing and distributing 1,000 copies of the Noble Quran with Hausa/English translation and modesty kits for incoming freshmen.',
    targetAmount: 1200000,
    raisedAmount: 790000,
    bankName: 'Jaiz Bank PLC',
    accountNumber: '0008472911',
    accountName: 'MSSN FUD Chapter (Da\'wah Outreach)',
    isActive: true,
    category: 'dawah',
    urgency: 'normal'
  }
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'don-1',
    donorName: 'Alhaji Bashir Tukur (Alumnus)',
    donorEmail: 'b.tukur@gmail.com',
    donorPhone: '08035551234',
    amount: 150000,
    causeId: 'cause-1',
    causeTitle: 'Indigent Muslim Student Emergency Welfare & Tuition Fund',
    paymentMethod: 'Bank Transfer (Jaiz Bank)',
    referenceNumber: 'JAIZ-TRF-98218491',
    status: 'verified',
    date: '2025-01-18',
    notes: 'Sadaqah Jariyah for student scholarship.'
  },
  {
    id: 'don-2',
    donorName: 'Dr. (Mrs.) Amina Garba (Academic Staff)',
    donorEmail: 'amina.garba@fud.edu.ng',
    donorPhone: '08027778899',
    amount: 50000,
    causeId: 'cause-3',
    causeTitle: 'Ramadan 1446 AH Student Iftar & Sahoor Feeding Drive',
    paymentMethod: 'Bank Transfer (Stanbic IBTC)',
    referenceNumber: 'STB-TRF-44102941',
    status: 'verified',
    date: '2025-01-22',
    notes: 'For Iftar feeding packs.'
  },
  {
    id: 'don-3',
    donorName: 'Anonymous Brother (400L Alumni)',
    amount: 25000,
    causeId: 'cause-2',
    causeTitle: 'FUD Campus Mosque Solar Inverter & Sound Enhancement Project',
    paymentMethod: 'Bank Transfer (TAJBank)',
    referenceNumber: 'TAJ-TRF-77319024',
    status: 'verified',
    date: '2025-02-01',
    notes: 'Mosque light support.'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    adminName: 'Br. Ibrahim Muhammad Danjuma',
    adminRole: 'super_admin',
    action: 'System Initialization',
    target: 'MSSNFUD Database',
    timestamp: '2025-01-10T08:00:00Z',
    details: 'Configured academic sessions, initial committee structures, and seed member databases.'
  },
  {
    id: 'log-2',
    adminName: 'Br. Ahmad Tukur',
    adminRole: 'pro_editor',
    action: 'Published Event',
    target: 'Jihad Week 2025 Conference',
    timestamp: '2025-01-15T12:30:00Z',
    details: 'Uploaded banner flyer and finalized guest speaker roster.'
  },
  {
    id: 'log-3',
    adminName: 'Br. Abubakar Kabir',
    adminRole: 'executive',
    action: 'Exported Member Roster',
    target: '2024/2025 Member Directory (CSV)',
    timestamp: '2025-01-20T16:45:00Z',
    details: 'Generated consolidated spreadsheet for Faculty of Science tutorial coordination.'
  },
  {
    id: 'log-4',
    adminName: 'Br. Mustapha Aliyu',
    adminRole: 'executive',
    action: 'Verified Donation Receipt',
    target: 'JAIZ-TRF-98218491 (₦150,000)',
    timestamp: '2025-01-23T11:15:00Z',
    details: 'Reconciled welfare fund bank transfer receipt.'
  }
];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    badge: "2026/2027 Academic Session",
    title: "Muslim Students' Society of Nigeria",
    subtitle: "Federal University Dutse Chapter • Jigawa State",
    description: "The official campus body representing Muslim students across all faculties at Federal University Dutse, fostering academic distinction, spiritual tarbiyyah, moral character, and student brotherhood.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80",
    primaryActionLabel: "Register as a New Member",
    primaryActionTarget: "register",
    secondaryActionLabel: "About Our Chapter",
    secondaryActionTarget: "about",
    order: 1,
    isActive: true
  },
  {
    id: 2,
    badge: "Academic Mentorship & E-Library",
    title: "Free Faculty Tutorials & Past Questions Hub",
    subtitle: "Empowering Academic Excellence Across All Departments",
    description: "Access curated exam past questions, revision lecture notes, and weekly tutorials for Science, Computing, Management Sciences, Agriculture, and College of Medicine.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80",
    primaryActionLabel: "Access E-Library & Past Questions",
    primaryActionTarget: "elibrary",
    secondaryActionLabel: "Tutorial Schedule",
    secondaryActionTarget: "events",
    order: 2,
    isActive: true
  },
  {
    id: 3,
    badge: "Da'wah & Spiritual Circles",
    title: "Central Halqahs, Usrah & Sisters' Circles",
    subtitle: "Grounded Islamic Knowledge & Moral Uprightness",
    description: "Participate in weekly Quranic recitation and Tajweed classes, Fiqh lessons, Sisters' circle forums, moral development sessions, and guest lectures at the FUD Central Mosque.",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1600&auto=format&fit=crop&q=80",
    primaryActionLabel: "Programs Calendar",
    primaryActionTarget: "events",
    secondaryActionLabel: "Islamic Articles",
    secondaryActionTarget: "blog",
    order: 3,
    isActive: true
  },
  {
    id: 4,
    badge: "Student Welfare & Relief",
    title: "Emergency Medical & Tuition Relief",
    subtitle: "Brotherhood & Mutual Support on Campus",
    description: "MSSN FUD operates an active welfare fund providing emergency health assistance, accommodation support, and exam clearance for indigent Muslim students on campus.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80",
    primaryActionLabel: "Support Welfare Fund",
    primaryActionTarget: "donations",
    secondaryActionLabel: "Verify Member e-ID",
    secondaryActionTarget: "verify",
    order: 4,
    isActive: true
  }
];

export const INITIAL_ELIBRARY: ELibraryItem[] = [
  {
    id: 'elib-1',
    title: 'GST 111: Communication in English - 5-Year Past Questions & Solutions (2020-2025)',
    courseCode: 'GST 111',
    category: 'past_questions',
    faculty: 'General Studies Division',
    department: 'GST Unit',
    level: '100L',
    session: '2025/2026',
    semester: 'First Semester',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'pdf',
    fileSize: '3.4 MB',
    downloadCount: 842,
    description: 'Comprehensive compilation of GST 111 exam past questions, vocabulary tests, phonetics drill sheets, and reading comprehension model answers curated by MSSN Academic Committee.',
    authorOrLecturer: 'MSSN FUD Academic & Tutorial Committee',
    uploadedBy: 'Director of Studies (DOS)',
    uploadDate: '2025-01-15',
    featured: true
  },
  {
    id: 'elib-2',
    title: 'CSC 201: Computer Programming I (C++ / Python) - Comprehensive Lecture Notes & Lab Codes',
    courseCode: 'CSC 201',
    category: 'lecture_notes',
    faculty: 'Faculty of Computing',
    department: 'B.Sc. Computer Science',
    level: '200L',
    session: '2025/2026',
    semester: 'First Semester',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'pdf',
    fileSize: '4.8 MB',
    downloadCount: 512,
    description: 'Step-by-step algorithms, control flow, functions, OOP basics, and solved previous semester practical assignments for Computing and Software Engineering students.',
    authorOrLecturer: 'Computing Da\'wah Wing Mentors',
    uploadedBy: 'PRO / Content Editor',
    uploadDate: '2025-01-20',
    featured: true
  },
  {
    id: 'elib-3',
    title: 'MTH 101: Elementary Mathematics I (Algebra & Trigonometry) - Solved Exam Papers',
    courseCode: 'MTH 101',
    category: 'past_questions',
    faculty: 'Faculty of Physical Sciences',
    department: 'B.Sc. Mathematics',
    level: '100L',
    session: '2024/2025',
    semester: 'First Semester',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'pdf',
    fileSize: '5.1 MB',
    downloadCount: 1120,
    description: 'Complete breakdown of sets, quadratic equations, mathematical induction, binomial theorem, and trigonometry formulas with step-by-step solutions.',
    authorOrLecturer: 'Faculty of Physical Sciences Mentorship Cell',
    uploadedBy: 'Director of Studies (DOS)',
    uploadDate: '2024-12-10',
    featured: true
  },
  {
    id: 'elib-4',
    title: 'MSSN FUD Chapter Constitution & Operational Bye-Laws',
    courseCode: 'DOC-01',
    category: 'constitution',
    faculty: 'General Campus Body',
    department: 'All Departments',
    level: 'General',
    session: '2026/2027',
    semester: 'Both Semesters',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    downloadCount: 389,
    description: 'Official constitution, executive portfolio duties, shura council guidelines, and committee operational structures of the Muslim Students\' Society of Nigeria FUD Chapter.',
    authorOrLecturer: 'Secretariat & Judicial Advisory Committee',
    uploadedBy: 'General Secretary',
    uploadDate: '2025-01-05',
    featured: false
  },
  {
    id: 'elib-5',
    title: 'BIO 101: General Biology I - Botany & Zoology Revision Handout with Diagram Bank',
    courseCode: 'BIO 101',
    category: 'handouts',
    faculty: 'Faculty of Life Sciences',
    department: 'B.Sc. Biology',
    level: '100L',
    session: '2025/2026',
    semester: 'First Semester',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'pdf',
    fileSize: '6.2 MB',
    downloadCount: 670,
    description: 'Cell biology, taxonomy, plant anatomy, and animal physiology review notes with high-yield summary tables and microscope diagram labeling guides.',
    authorOrLecturer: 'Life Sciences Academic Team',
    uploadedBy: 'Director of Studies (DOS)',
    uploadDate: '2025-01-22',
    featured: false
  },
  {
    id: 'elib-6',
    title: 'ACC 201: Principles of Accounting I - Solved Past Questions & Ledger Templates',
    courseCode: 'ACC 201',
    category: 'past_questions',
    faculty: 'Faculty of Management Sciences',
    department: 'B.Sc. Accounting',
    level: '200L',
    session: '2025/2026',
    semester: 'First Semester',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'pdf',
    fileSize: '3.9 MB',
    downloadCount: 425,
    description: 'Trial balance preparations, bank reconciliations, final accounts of sole proprietorships, and correction of errors practice kits.',
    authorOrLecturer: 'Management Sciences Muslim Tutors',
    uploadedBy: 'PRO / Content Editor',
    uploadDate: '2025-01-28',
    featured: false
  },
  {
    id: 'elib-7',
    title: 'The Muslim Student on Campus: Balancing Academic Distinction & Spiritual Purity',
    courseCode: 'DAW-101',
    category: 'islamic_book',
    faculty: 'Da\'wah & Education Wing',
    department: 'All Departments',
    level: 'General',
    session: '2026/2027',
    semester: 'Both Semesters',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'pdf',
    fileSize: '2.1 MB',
    downloadCount: 780,
    description: 'Inspiring handbook on time management, keeping high moral standards, overcoming peer pressure, and seeking Barakah in university studies.',
    authorOrLecturer: 'MSSN National / FUD Da\'wah Directorate',
    uploadedBy: 'Amir / Chief Administrator',
    uploadDate: '2025-01-02',
    featured: true
  }
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  heroSlides: INITIAL_HERO_SLIDES,
  heroHeadline: "Muslim Students' Society of Nigeria",
  heroSubtitle: "Federal University Dutse Chapter • Jigawa State",
  aboutHistory: `The Muslim Students' Society of Nigeria (MSSN), Federal University Dutse (FUD) Chapter, was established concurrently with the inception of the university in 2011 to cater to the spiritual, moral, academic, and socio-cultural welfare of Muslim students.

Over the years, the chapter has grown into a vibrant, unified student body impacting thousands of undergraduate and postgraduate scholars. From modest gatherings at temporary lecture halls to our central role in coordinating the FUD Central Mosque activities, academic bootcamps, sisters' empowerment wings, and charitable outreach across Jigawa State, MSSN FUD continues to be a beacon of steadfastness, moral excellence, and academic distinction.`,
  vision: "To remain a world-class Islamic student body nurturing morally upright, spiritually conscious, and academically distinguished Muslim graduates who contribute positively to Nigeria and the global Ummah.",
  mission: "To foster the comprehensive development of Muslim students at Federal University Dutse through the pristine teachings of the Quran and Sunnah, champion academic excellence, provide compassionate welfare, and cultivate unity among students.",
  coreValues: [
    { title: "Tawheed & Sincerity (Ikhlas)", desc: "Anchoring every action, study session, and project in the pleasure of Allah alone." },
    { title: "Academic Distinction", desc: "Setting the gold standard in research, CGPA excellence, and professional integrity." },
    { title: "Brotherhood & Sisterhood (Ukhuwwah)", desc: "Cultivating unshakeable unity, mutual love, and empathy across ethnic and cultural lines." },
    { title: "Compassion & Service (Khidmah)", desc: "Caring for the needy, indigent students, and uplifting the broader university community." },
    { title: "Character & Modesty (Akhlaq & Haya')", desc: "Reflecting the pristine manners, dignity, and upright conduct of the Prophet (SAW)." }
  ],
  announcementTicker: "📢 Welcome to the 2026/2027 Academic Session! Free 100L-500L GST & Faculty Tutorials commence this Saturday 8:30 AM at Twin Lecture Theatre B • Register your student membership online to generate your official digital e-ID card instantly!",
  isAnnouncementActive: true,
  isRegistrationOpen: true,
  registrationNotice: "Membership registration for the 2026/2027 Academic Session is currently active. All Muslim students of Federal University Dutse are invited to register and obtain their verified digital membership e-ID card.",
  contactEmail: "info@mssnfud.org",
  contactPhone: "+234 803 123 4567 / +234 808 567 8901",
  secretariatAddress: "MSSN FUD Secretariat, Adjacent University Central Mosque, Federal University Dutse, PMB 7156, Dutse, Jigawa State, Nigeria",
  prayerTimes: {
    fajr: "05:18 AM",
    sunrise: "06:34 AM",
    dhuhr: "12:44 PM",
    asr: "04:06 PM",
    maghrib: "06:48 PM",
    isha: "07:58 PM",
    locationNotice: "Dutse, Jigawa State (FUD Campus Mosque Timetable)"
  },
  hadithOfTheDay: {
    arabic: "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    translation: "Whoever treads a path in pursuit of knowledge, Allah will facilitate for him a path to Paradise.",
    narratorOrSource: "Sahih Muslim 2699",
    theme: "Pursuit of Academic & Islamic Knowledge"
  },
  tiktokUrl: "https://www.tiktok.com/@mssnfud?_r=1&_t=ZS-991TmdMkNKz",
  facebookUrl: "https://www.facebook.com/share/1KTTAJr5az/",
  twitterUrl: "https://x.com/FudMssn",
  whatsappUrl: "https://wa.me/2348031234567?text=Assalamu%20Alaikum%20MSSN%20FUD%20Secretariat",
  instagramUrl: "https://instagram.com/mssnfud",
  youtubeUrl: "https://youtube.com/@mssnfud",
  telegramUrl: "https://t.me/mssnfud"
};
