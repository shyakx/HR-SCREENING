import mongoose from 'mongoose';
import { Job, Applicant } from '../models';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recruiter-os');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Job.deleteMany({});
    await Applicant.deleteMany({});
    console.log('Cleared existing data');

    // Create sample jobs
    const jobs = await Job.create([
      {
        title: 'Senior Frontend Developer',
        description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building modern React applications with TypeScript and Next.js.',
        department: 'Engineering',
        location: 'Kigali, Rwanda',
        experienceLevel: 'senior',
        employmentType: 'full-time',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux', 'GraphQL'],
        requirements: ['5+ years React experience', 'Strong TypeScript skills', 'Experience with Next.js', 'GraphQL knowledge'],
        salaryRange: { min: 80000, max: 120000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'Backend Engineer',
        description: 'Join our backend team to build scalable APIs and microservices using Node.js and Express. Experience with cloud platforms required.',
        department: 'Engineering',
        location: 'Kigali, Rwanda',
        experienceLevel: 'mid',
        employmentType: 'full-time',
        skills: ['Node.js', 'Express', 'MongoDB', 'TypeScript', 'Docker', 'AWS'],
        requirements: ['3+ years Node.js experience', 'MongoDB proficiency', 'API design knowledge', 'Cloud experience'],
        salaryRange: { min: 60000, max: 90000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'Product Manager',
        description: 'Lead product development and strategy for our core SaaS platform. Work closely with engineering and design teams.',
        department: 'Product',
        location: 'Kigali, Rwanda',
        experienceLevel: 'senior',
        employmentType: 'full-time',
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'Jira'],
        requirements: ['5+ years PM experience', 'SaaS product experience', 'Strong communication skills', 'Technical background'],
        salaryRange: { min: 90000, max: 130000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'UX Designer',
        description: 'Design intuitive user experiences for our web and mobile applications. Create wireframes, prototypes, and design systems.',
        department: 'Design',
        location: 'Kigali, Rwanda',
        experienceLevel: 'mid',
        employmentType: 'contract',
        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Adobe Creative Suite'],
        requirements: ['3+ years UX design', 'Portfolio demonstrating UI/UX work', 'Figma expertise', 'User research skills'],
        salaryRange: { min: 50000, max: 75000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'DevOps Engineer',
        description: 'Manage our cloud infrastructure and CI/CD pipelines. Implement automation and monitoring solutions.',
        department: 'Engineering',
        location: 'Kigali, Rwanda',
        experienceLevel: 'senior',
        employmentType: 'full-time',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Monitoring'],
        requirements: ['AWS certification preferred', 'Kubernetes experience', 'Infrastructure as Code', '5+ years DevOps'],
        salaryRange: { min: 85000, max: 115000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'Data Scientist',
        description: 'Apply machine learning and statistical analysis to solve business problems. Build predictive models and data pipelines.',
        department: 'Data',
        location: 'Nairobi, Kenya',
        experienceLevel: 'senior',
        employmentType: 'full-time',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'SQL', 'Data Visualization'],
        requirements: ['MS/PhD in relevant field', '3+ years ML experience', 'Strong Python skills', 'Statistics background'],
        salaryRange: { min: 95000, max: 140000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'Mobile App Developer',
        description: 'Develop native and cross-platform mobile applications for iOS and Android. Experience with React Native required.',
        department: 'Engineering',
        location: 'Lagos, Nigeria',
        experienceLevel: 'mid',
        employmentType: 'full-time',
        skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase', 'TypeScript'],
        requirements: ['3+ years mobile development', 'React Native experience', 'App store deployment', 'API integration'],
        salaryRange: { min: 65000, max: 95000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'Marketing Manager',
        description: 'Lead marketing campaigns and digital strategy. Manage social media, content marketing, and brand development.',
        department: 'Marketing',
        location: 'Kampala, Uganda',
        experienceLevel: 'mid',
        employmentType: 'full-time',
        skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Social Media', 'Analytics'],
        requirements: ['4+ years marketing experience', 'Digital marketing expertise', 'Campaign management', 'Creative skills'],
        salaryRange: { min: 55000, max: 80000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'Full Stack Developer',
        description: 'Build end-to-end web applications using modern JavaScript frameworks. Experience with both frontend and backend required.',
        department: 'Engineering',
        location: 'Dar es Salaam, Tanzania',
        experienceLevel: 'mid',
        employmentType: 'full-time',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'TypeScript'],
        requirements: ['3+ years full stack experience', 'React and Node.js proficiency', 'Database knowledge', 'API development'],
        salaryRange: { min: 60000, max: 85000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'QA Engineer',
        description: 'Ensure software quality through manual and automated testing. Develop test plans and execute test cases.',
        department: 'Engineering',
        location: 'Kigali, Rwanda',
        experienceLevel: 'entry',
        employmentType: 'full-time',
        skills: ['Testing', 'Selenium', 'Jest', 'CI/CD', 'Bug Tracking', 'Agile'],
        requirements: ['1+ years QA experience', 'Automated testing knowledge', 'Attention to detail', 'Communication skills'],
        salaryRange: { min: 40000, max: 60000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'Business Analyst',
        description: 'Analyze business requirements and translate them into technical specifications. Work with stakeholders to define project scope.',
        department: 'Product',
        location: 'Abuja, Nigeria',
        experienceLevel: 'mid',
        employmentType: 'full-time',
        skills: ['Business Analysis', 'Requirements Gathering', 'SQL', 'Excel', 'Documentation'],
        requirements: ['3+ years BA experience', 'Technical writing skills', 'Data analysis', 'Stakeholder management'],
        salaryRange: { min: 60000, max: 85000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'Cloud Architect',
        description: 'Design and implement cloud infrastructure solutions. Lead cloud migration projects and optimize cloud costs.',
        department: 'Engineering',
        location: 'Nairobi, Kenya',
        experienceLevel: 'executive',
        employmentType: 'full-time',
        skills: ['Cloud Architecture', 'AWS', 'Azure', 'DevOps', 'Security', 'Cost Optimization'],
        requirements: ['8+ years cloud experience', 'AWS/Azure certification', 'Architecture design', 'Leadership skills'],
        salaryRange: { min: 120000, max: 160000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'Content Writer',
        description: 'Create engaging content for websites, blogs, and marketing materials. Experience with tech writing preferred.',
        department: 'Marketing',
        location: 'Kigali, Rwanda',
        experienceLevel: 'entry',
        employmentType: 'part-time',
        skills: ['Writing', 'Content Creation', 'SEO', 'Editing', 'Research'],
        requirements: ['1+ years writing experience', 'Portfolio of work', 'English proficiency', 'Creative skills'],
        salaryRange: { min: 30000, max: 45000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'Cybersecurity Analyst',
        description: 'Monitor and protect company systems from security threats. Implement security measures and respond to incidents.',
        department: 'Engineering',
        location: 'Kampala, Uganda',
        experienceLevel: 'senior',
        employmentType: 'full-time',
        skills: ['Cybersecurity', 'Network Security', 'Risk Assessment', 'SIEM', 'Compliance'],
        requirements: ['5+ years cybersecurity experience', 'Security certifications', 'Incident response', 'Risk management'],
        salaryRange: { min: 80000, max: 110000, currency: 'USD' },
        status: 'active'
      },
      {
        title: 'HR Manager',
        description: 'Manage human resources functions including recruitment, employee relations, and performance management.',
        department: 'Human Resources',
        location: 'Lagos, Nigeria',
        experienceLevel: 'senior',
        employmentType: 'full-time',
        skills: ['HR Management', 'Recruitment', 'Employee Relations', 'Performance Management', 'HRIS'],
        requirements: ['5+ years HR experience', 'HR certification preferred', 'Leadership skills', 'Communication'],
        salaryRange: { min: 65000, max: 90000, currency: 'USD' },
        status: 'active'
      }
    ]);
    console.log(`Created ${jobs.length} jobs`);

    // Create sample applicants - Rwanda, Nigeria, and East Africa
    const applicants = await Applicant.create([
      // Rwanda-based applicants
      {
        name: 'Jean-Pierre Mugisha',
        email: 'jeanpierre.mugisha@gmail.com',
        phone: '+250-788-123-456',
        location: 'Kigali, Rwanda',
        experience: { years: 6, level: 'senior' },
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
        education: [
          { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'University of Rwanda', year: 2018 }
        ],
        workHistory: [
          { company: 'Andela Rwanda', position: 'Senior Developer', duration: '2020-Present', description: 'Led frontend team' },
          { company: 'Yego Innovision', position: 'Full Stack Developer', duration: '2018-2020', description: 'Built MVP' }
        ],
        // appliedJobs will be added after jobs are created
        source: 'external',
        resumeUrl: 'https://example.com/resume1.pdf'
      },
      {
        name: 'Grace Uwimana',
        email: 'grace.uwimana@yahoo.com',
        phone: '+250-735-987-654',
        location: 'Kigali, Rwanda',
        experience: { years: 4, level: 'mid' },
        skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
        education: [
          { degree: 'Master of Science', field: 'Data Science', institution: 'Carnegie Mellon University Africa', year: 2020 }
        ],
        workHistory: [
          { company: 'Bank of Kigali', position: 'Backend Developer', duration: '2020-Present', description: 'API development' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume2.pdf'
      },
      {
        name: 'Emmanuel Niyonzima',
        email: 'emmanuel.niyonzima@gmail.com',
        phone: '+250-789-456-123',
        location: 'Kigali, Rwanda',
        experience: { years: 8, level: 'senior' },
        skills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes', 'AWS'],
        education: [
          { degree: 'Bachelor of Engineering', field: 'Software Engineering', institution: 'Kigali Institute of Science and Technology', year: 2016 }
        ],
        workHistory: [
          { company: 'Rwanda Development Board', position: 'Lead Engineer', duration: '2019-Present', description: 'Led microservices migration' },
          { company: 'Airtel Rwanda', position: 'Senior Java Developer', duration: '2016-2019', description: 'Backend development' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume3.pdf'
      },
      {
        name: 'Chantal Mukamana',
        email: 'chantal.mukamana@gmail.com',
        phone: '+250-722-345-678',
        location: 'Kigali, Rwanda',
        experience: { years: 3, level: 'mid' },
        skills: ['Product Management', 'Agile', 'Jira', 'Data Analysis', 'SQL'],
        education: [
          { degree: 'Bachelor of Business', field: 'Marketing', institution: 'University of Kigali', year: 2021 }
        ],
        workHistory: [
          { company: 'M-Pesa Rwanda', position: 'Associate PM', duration: '2021-Present', description: 'Feature prioritization' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume4.pdf'
      },
      {
        name: 'Patrick Gahigi',
        email: 'patrick.gahigi@gmail.com',
        phone: '+250-788-234-567',
        location: 'Kigali, Rwanda',
        experience: { years: 2, level: 'entry' },
        skills: ['JavaScript', 'React', 'CSS', 'HTML', 'Git'],
        education: [
          { degree: 'Bachelor of Science', field: 'Information Technology', institution: 'University of Rwanda', year: 2022 }
        ],
        workHistory: [
          { company: 'IremboGov', position: 'Junior Developer', duration: '2022-Present', description: 'Client websites' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume5.pdf'
      },
      {
        name: 'Diane Uwase',
        email: 'diane.uwase@yahoo.com',
        phone: '+250-735-123-890',
        location: 'Kigali, Rwanda',
        experience: { years: 7, level: 'senior' },
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'User Research', 'Design Systems'],
        education: [
          { degree: 'Bachelor of Fine Arts', field: 'Graphic Design', institution: 'Kigali College of Arts', year: 2017 }
        ],
        workHistory: [
          { company: 'Andela Rwanda', position: 'Senior UX Designer', duration: '2020-Present', description: 'Led design system' },
          { company: 'Yego Innovision', position: 'UX Designer', duration: '2017-2020', description: 'Mobile app design' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume6.pdf'
      },
      {
        name: 'Samuel Ntaganda',
        email: 'samuel.ntaganda@gmail.com',
        phone: '+250-789-567-890',
        location: 'Kigali, Rwanda',
        experience: { years: 5, level: 'mid' },
        skills: ['DevOps', 'AWS', 'Docker', 'Jenkins', 'Terraform'],
        education: [
          { degree: 'Bachelor of Science', field: 'Computer Engineering', institution: 'University of Rwanda', year: 2019 }
        ],
        workHistory: [
          { company: 'Bank of Kigali', position: 'DevOps Engineer', duration: '2019-Present', description: 'CI/CD pipeline' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume7.pdf'
      },
      {
        name: 'Claudine Mukandayisenga',
        email: 'claudine.mukandayisenga@gmail.com',
        phone: '+250-722-890-123',
        location: 'Kigali, Rwanda',
        experience: { years: 10, level: 'executive' },
        skills: ['Leadership', 'Strategy', 'Team Building', 'Agile', 'Product Development'],
        education: [
          { degree: 'MBA', field: 'Business Administration', institution: 'University of Kigali', year: 2015 },
          { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'University of Rwanda', year: 2013 }
        ],
        workHistory: [
          { company: 'Andela Rwanda', position: 'VP of Engineering', duration: '2021-Present', description: 'Engineering leadership' },
          { company: 'Rwanda ICT Chamber', position: 'Engineering Manager', duration: '2018-2021', description: 'Team scaling' },
          { company: 'HeHe Labs', position: 'Senior Developer', duration: '2015-2018', description: 'Full stack development' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume8.pdf'
      },
      {
        name: 'Eric Mutabazi',
        email: 'eric.mutabazi@gmail.com',
        phone: '+250-788-345-678',
        location: 'Musanze, Rwanda',
        experience: { years: 4, level: 'mid' },
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', 'Pandas'],
        education: [
          { degree: 'Master of Science', field: 'Artificial Intelligence', institution: 'Carnegie Mellon University Africa', year: 2021 }
        ],
        workHistory: [
          { company: 'Zipline Rwanda', position: 'Data Scientist', duration: '2021-Present', description: 'ML models for delivery optimization' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume9.pdf'
      },
      {
        name: 'Josiane Bimenyimana',
        email: 'josiane.bimenyimana@yahoo.com',
        phone: '+250-735-456-789',
        location: 'Butare, Rwanda',
        experience: { years: 1, level: 'entry' },
        skills: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'WordPress'],
        education: [
          { degree: 'Bachelor of Science', field: 'Web Development', institution: 'University of Rwanda', year: 2023 }
        ],
        workHistory: [
          { company: 'Freelance', position: 'Web Developer', duration: '2023-Present', description: 'Small business websites' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume10.pdf'
      },

      // Nigerian applicants
      {
        name: 'Chukwuemeka Okafor',
        email: 'chukwuemeka.okafor@gmail.com',
        phone: '+234-803-456-7890',
        location: 'Lagos, Nigeria',
        experience: { years: 7, level: 'senior' },
        skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
        education: [
          { degree: 'Bachelor of Engineering', field: 'Computer Engineering', institution: 'University of Lagos', year: 2017 }
        ],
        workHistory: [
          { company: 'Paystack', position: 'Senior Backend Engineer', duration: '2020-Present', description: 'Payment processing systems' },
          { company: 'Andela', position: 'Full Stack Developer', duration: '2017-2020', description: 'Client projects' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume11.pdf'
      },
      {
        name: 'Funke Adebayo',
        email: 'funke.adebayo@yahoo.com',
        phone: '+234-809-123-4567',
        location: 'Abuja, Nigeria',
        experience: { years: 5, level: 'mid' },
        skills: ['Product Management', 'Agile', 'Scrum', 'Data Analysis', 'SQL'],
        education: [
          { degree: 'Master of Business Administration', field: 'Technology Management', institution: 'Lagos Business School', year: 2019 }
        ],
        workHistory: [
          { company: 'Flutterwave', position: 'Product Manager', duration: '2021-Present', description: 'Fintech product development' },
          { company: 'Interswitch', position: 'Associate Product Manager', duration: '2019-2021', description: 'Payment solutions' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume12.pdf'
      },
      {
        name: 'Adeola Johnson',
        email: 'adeola.johnson@gmail.com',
        phone: '+234-810-987-6543',
        location: 'Port Harcourt, Nigeria',
        experience: { years: 3, level: 'mid' },
        skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
        education: [
          { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'University of Port Harcourt', year: 2021 }
        ],
        workHistory: [
          { company: 'Andela', position: 'Backend Developer', duration: '2021-Present', description: 'API development and maintenance' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume13.pdf'
      },
      {
        name: 'Ibrahim Musa',
        email: 'ibrahim.musa@gmail.com',
        phone: '+234-806-234-5678',
        location: 'Kano, Nigeria',
        experience: { years: 9, level: 'executive' },
        skills: ['Cloud Architecture', 'AWS', 'Azure', 'DevOps', 'Team Leadership'],
        education: [
          { degree: 'Master of Science', field: 'Cloud Computing', institution: 'Covenant University', year: 2015 },
          { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'Ahmadu Bello University', year: 2013 }
        ],
        workHistory: [
          { company: 'Microsoft Nigeria', position: 'Cloud Solutions Architect', duration: '2019-Present', description: 'Enterprise cloud solutions' },
          { company: 'Glo Nigeria', position: 'Head of Infrastructure', duration: '2016-2019', description: 'Network and cloud infrastructure' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume14.pdf'
      },
      {
        name: 'Ngozi Eze',
        email: 'ngozi.eze@yahoo.com',
        phone: '+234-805-678-9012',
        location: 'Enugu, Nigeria',
        experience: { years: 2, level: 'entry' },
        skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
        education: [
          { degree: 'Bachelor of Arts', field: 'Graphic Design', institution: 'University of Nigeria', year: 2022 }
        ],
        workHistory: [
          { company: 'Freelance', position: 'UI Designer', duration: '2022-Present', description: 'Mobile app and web design' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume15.pdf'
      },
      {
        name: 'Tunde Adekunle',
        email: 'tunde.adekunle@gmail.com',
        phone: '+234-814-345-6789',
        location: 'Ibadan, Nigeria',
        experience: { years: 6, level: 'senior' },
        skills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes', 'MongoDB'],
        education: [
          { degree: 'Bachelor of Engineering', field: 'Software Engineering', institution: 'Obafemi Awolowo University', year: 2018 }
        ],
        workHistory: [
          { company: 'Interswitch', position: 'Senior Java Developer', duration: '2020-Present', description: 'Payment gateway development' },
          { company: 'SystemSpecs', position: 'Software Developer', duration: '2018-2020', description: 'Banking software solutions' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume16.pdf'
      },

      // East African applicants (Kenya, Uganda, Tanzania)
      {
        name: 'Joseph Mwangi',
        email: 'joseph.mwangi@gmail.com',
        phone: '+254-712-345-678',
        location: 'Nairobi, Kenya',
        experience: { years: 5, level: 'mid' },
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'GraphQL'],
        education: [
          { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'University of Nairobi', year: 2019 }
        ],
        workHistory: [
          { company: 'Safaricom', position: 'Full Stack Developer', duration: '2021-Present', description: 'M-Pesa platform development' },
          { company: 'M-Pesa', position: 'Frontend Developer', duration: '2019-2021', description: 'Mobile money applications' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume17.pdf'
      },
      {
        name: 'Grace Wanjiru',
        email: 'grace.wanjiru@yahoo.com',
        phone: '+254-722-456-789',
        location: 'Mombasa, Kenya',
        experience: { years: 4, level: 'mid' },
        skills: ['Data Science', 'Python', 'Machine Learning', 'TensorFlow', 'Pandas'],
        education: [
          { degree: 'Master of Science', field: 'Data Science', institution: 'Strathmore University', year: 2020 }
        ],
        workHistory: [
          { company: 'Twiga Foods', position: 'Data Scientist', duration: '2020-Present', description: 'Supply chain analytics' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume18.pdf'
      },
      {
        name: 'David Kamau',
        email: 'david.kamau@gmail.com',
        phone: '+254-734-567-890',
        location: 'Kisumu, Kenya',
        experience: { years: 8, level: 'senior' },
        skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
        education: [
          { degree: 'Bachelor of Science', field: 'Information Technology', institution: 'Kenyatta University', year: 2016 }
        ],
        workHistory: [
          { company: 'Amazon Web Services', position: 'Solutions Architect', duration: '2020-Present', description: 'Cloud architecture consulting' },
          { company: 'Cellulant', position: 'DevOps Engineer', duration: '2016-2020', description: 'Payment platform infrastructure' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume19.pdf'
      },
      {
        name: 'Sarah Njeri',
        email: 'sarah.njeri@gmail.com',
        phone: '+254-711-234-567',
        location: 'Nakuru, Kenya',
        experience: { years: 3, level: 'mid' },
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        education: [
          { degree: 'Bachelor of Design', field: 'Interaction Design', institution: 'Nairobi Design Institute', year: 2021 }
        ],
        workHistory: [
          { company: 'Jumia Kenya', position: 'UX Designer', duration: '2021-Present', description: 'E-commerce platform design' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume20.pdf'
      },
      {
        name: 'Michael Okello',
        email: 'michael.okello@gmail.com',
        phone: '+256-772-123-456',
        location: 'Kampala, Uganda',
        experience: { years: 6, level: 'senior' },
        skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
        education: [
          { degree: 'Bachelor of Science', field: 'Software Engineering', institution: 'Makerere University', year: 2018 }
        ],
        workHistory: [
          { company: 'MTN Uganda', position: 'Senior Backend Developer', duration: '2020-Present', description: 'Mobile money platform' },
          { company: 'Stanbic Bank Uganda', position: 'Software Developer', duration: '2018-2020', description: 'Banking applications' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume21.pdf'
      },
      {
        name: 'Rebecca Namulondo',
        email: 'rebecca.namulondo@yahoo.com',
        phone: '+256-752-456-789',
        location: 'Entebbe, Uganda',
        experience: { years: 4, level: 'mid' },
        skills: ['Product Management', 'Agile', 'Data Analysis', 'SQL', 'Jira'],
        education: [
          { degree: 'Master of Business Administration', field: 'Project Management', institution: 'Uganda Management Institute', year: 2020 }
        ],
        workHistory: [
          { company: 'Airtel Uganda', position: 'Product Manager', duration: '2020-Present', description: 'Digital products development' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume22.pdf'
      },
      {
        name: 'James Katumba',
        email: 'james.katumba@gmail.com',
        phone: '+256-782-345-678',
        location: 'Jinja, Uganda',
        experience: { years: 2, level: 'entry' },
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git'],
        education: [
          { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'Kyambogo University', year: 2022 }
        ],
        workHistory: [
          { company: 'Freelance', position: 'Full Stack Developer', duration: '2022-Present', description: 'Web development projects' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume23.pdf'
      },
      {
        name: 'Aisha Hassan',
        email: 'aisha.hassan@gmail.com',
        phone: '+255-754-123-456',
        location: 'Dar es Salaam, Tanzania',
        experience: { years: 5, level: 'mid' },
        skills: ['Mobile Development', 'React Native', 'Flutter', 'Firebase', 'iOS', 'Android'],
        education: [
          { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'University of Dar es Salaam', year: 2019 }
        ],
        workHistory: [
          { company: 'Tigo Tanzania', position: 'Mobile App Developer', duration: '2021-Present', description: 'Mobile banking applications' },
          { company: 'NMB Bank', position: 'Junior Mobile Developer', duration: '2019-2021', description: 'Banking app development' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume24.pdf'
      },
      {
        name: 'Mohamed Ali',
        email: 'mohamed.ali@yahoo.com',
        phone: '+255-765-456-789',
        location: 'Arusha, Tanzania',
        experience: { years: 7, level: 'senior' },
        skills: ['Cloud Computing', 'AWS', 'Azure', 'DevOps', 'Python', 'Terraform'],
        education: [
          { degree: 'Master of Science', field: 'Cloud Architecture', institution: 'Arusha Technical College', year: 2017 }
        ],
        workHistory: [
          { company: 'CRDB Bank', position: 'Cloud Engineer', duration: '2020-Present', description: 'Banking cloud migration' },
          { company: 'Vodacom Tanzania', position: 'Senior DevOps Engineer', duration: '2017-2020', description: 'Telecom infrastructure' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume25.pdf'
      },
      {
        name: 'Fatuma Mwanga',
        email: 'fatuma.mwanga@gmail.com',
        phone: '+255-756-789-012',
        location: 'Mwanza, Tanzania',
        experience: { years: 3, level: 'mid' },
        skills: ['Data Analysis', 'Python', 'SQL', 'Excel', 'Tableau', 'Power BI'],
        education: [
          { degree: 'Bachelor of Science', field: 'Statistics', institution: 'University of Dar es Salaam', year: 2021 }
        ],
        workHistory: [
          { company: 'Tanzania Revenue Authority', position: 'Data Analyst', duration: '2021-Present', description: 'Tax data analysis and reporting' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume26.pdf'
      },

      // Additional applicants for more diversity
      {
        name: 'Clementine HAKUZIMANA',
        email: 'clementine.hakuzimana@gmail.com',
        phone: '+250-788-111-222',
        location: 'Kigali, Rwanda',
        experience: { years: 4, level: 'mid' },
        skills: ['Project Management', 'Agile', 'Scrum', 'Risk Management', 'Microsoft Project'],
        education: [
          { degree: 'Master of Science', field: 'Project Management', institution: 'University of Rwanda', year: 2020 }
        ],
        workHistory: [
          { company: 'Rwanda Energy Group', position: 'Project Manager', duration: '2020-Present', description: 'Infrastructure projects' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume27.pdf'
      },
      {
        name: 'Thierry Uwihoreye',
        email: 'thierry.uwihoreye@gmail.com',
        phone: '+250-735-333-444',
        location: 'Kigali, Rwanda',
        experience: { years: 6, level: 'senior' },
        skills: ['Software Architecture', 'Microservices', 'Java', 'Spring Boot', 'PostgreSQL'],
        education: [
          { degree: 'Master of Science', field: 'Software Engineering', institution: 'Carnegie Mellon University Africa', year: 2018 }
        ],
        workHistory: [
          { company: 'BCR Rwanda', position: 'Senior Software Architect', duration: '2019-Present', description: 'Banking systems architecture' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume28.pdf'
      },
      {
        name: 'Sarah Kagoyire',
        email: 'sarah.kagoyire@yahoo.com',
        phone: '+250-722-555-666',
        location: 'Rubavu, Rwanda',
        experience: { years: 3, level: 'mid' },
        skills: ['Digital Marketing', 'Social Media', 'Content Creation', 'SEO', 'Google Analytics'],
        education: [
          { degree: 'Bachelor of Arts', field: 'Marketing', institution: 'University of Kigali', year: 2021 }
        ],
        workHistory: [
          { company: 'Rwanda Tourism', position: 'Digital Marketing Specialist', duration: '2021-Present', description: 'Tourism promotion campaigns' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume29.pdf'
      },
      {
        name: 'Olivier Nshimiyimana',
        email: 'olivier.nshimiyimana@gmail.com',
        phone: '+250-789-777-888',
        location: 'Huye, Rwanda',
        experience: { years: 2, level: 'entry' },
        skills: ['Graphic Design', 'Adobe Photoshop', 'Illustrator', 'Video Editing', 'Branding'],
        education: [
          { degree: 'Bachelor of Fine Arts', field: 'Graphic Design', institution: 'Kigali College of Arts', year: 2022 }
        ],
        workHistory: [
          { company: 'Freelance', position: 'Graphic Designer', duration: '2022-Present', description: 'Brand design for startups' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume30.pdf'
      },
      {
        name: 'Esther Mukamwiza',
        email: 'esther.mukamwiza@gmail.com',
        phone: '+250-735-999-000',
        location: 'Muhanga, Rwanda',
        experience: { years: 5, level: 'mid' },
        skills: ['Human Resources', 'Recruitment', 'Training', 'Employee Relations', 'HRIS'],
        education: [
          { degree: 'Master of Human Resources', field: 'HR Management', institution: 'University of Rwanda', year: 2019 }
        ],
        workHistory: [
          { company: 'Rwanda Revenue Authority', position: 'HR Officer', duration: '2020-Present', description: 'Recruitment and training' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume31.pdf'
      },
      {
        name: 'Abdul Karim',
        email: 'abdul.karim@gmail.com',
        phone: '+250-788-111-333',
        location: 'Kigali, Rwanda',
        experience: { years: 7, level: 'senior' },
        skills: ['Network Engineering', 'Cisco', 'Firewalls', 'VPN', 'Network Security'],
        education: [
          { degree: 'Bachelor of Engineering', field: 'Network Engineering', institution: 'Kigali Institute of Science and Technology', year: 2017 }
        ],
        workHistory: [
          { company: 'Rwanda Utilities', position: 'Network Engineer', duration: '2018-Present', description: 'Corporate network infrastructure' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume32.pdf'
      },
      {
        name: 'Mariam Bakare',
        email: 'mariam.bakare@yahoo.com',
        phone: '+234-809-222-333',
        location: 'Lagos, Nigeria',
        experience: { years: 4, level: 'mid' },
        skills: ['Business Development', 'Sales', 'CRM', 'Negotiation', 'Market Research'],
        education: [
          { degree: 'Master of Business Administration', field: 'Marketing', institution: 'Lagos Business School', year: 2020 }
        ],
        workHistory: [
          { company: 'Globacom Nigeria', position: 'Business Development Manager', duration: '2021-Present', description: 'Enterprise sales and partnerships' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume33.pdf'
      },
      {
        name: 'Chidi Okonkwo',
        email: 'chidi.okonkwo@gmail.com',
        phone: '+234-803-444-555',
        location: 'Enugu, Nigeria',
        experience: { years: 8, level: 'senior' },
        skills: ['Blockchain', 'Solidity', 'Web3', 'Smart Contracts', 'Cryptocurrency'],
        education: [
          { degree: 'Master of Science', field: 'Blockchain Technology', institution: 'University of Nigeria', year: 2016 }
        ],
        workHistory: [
          { company: 'Binance Nigeria', position: 'Blockchain Developer', duration: '2019-Present', description: 'DeFi platform development' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume34.pdf'
      },
      {
        name: 'Amina Yusuf',
        email: 'amina.yusuf@yahoo.com',
        phone: '+234-805-666-777',
        location: 'Kano, Nigeria',
        experience: { years: 3, level: 'mid' },
        skills: ['Customer Service', 'Support', 'Communication', 'Problem Solving', 'CRM'],
        education: [
          { degree: 'Bachelor of Arts', field: 'Communication', institution: 'Ahmadu Bello University', year: 2021 }
        ],
        workHistory: [
          { company: 'Jumia Nigeria', position: 'Customer Success Manager', duration: '2021-Present', description: 'Customer support and retention' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume35.pdf'
      },
      {
        name: 'Peter Kamau',
        email: 'peter.kamau@gmail.com',
        phone: '+254-712-888-999',
        location: 'Nairobi, Kenya',
        experience: { years: 6, level: 'senior' },
        skills: ['Financial Analysis', 'Investment Banking', 'Excel', 'Financial Modeling', 'Risk Assessment'],
        education: [
          { degree: 'Master of Finance', field: 'Financial Analysis', institution: 'University of Nairobi', year: 2018 }
        ],
        workHistory: [
          { company: 'Equity Bank Kenya', position: 'Senior Financial Analyst', duration: '2019-Present', description: 'Investment analysis and portfolio management' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume36.pdf'
      },
      {
        name: 'Grace Ochieng',
        email: 'grace.ochieng@yahoo.com',
        phone: '+254-722-333-444',
        location: 'Mombasa, Kenya',
        experience: { years: 2, level: 'entry' },
        skills: ['Social Work', 'Community Development', 'Counseling', 'Case Management'],
        education: [
          { degree: 'Bachelor of Social Work', field: 'Community Development', institution: 'Kenyatta University', year: 2022 }
        ],
        workHistory: [
          { company: 'UNHCR Kenya', position: 'Social Worker', duration: '2022-Present', description: 'Refugee assistance programs' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume37.pdf'
      },
      {
        name: 'John Omondi',
        email: 'john.omondi@gmail.com',
        phone: '+254-734-555-666',
        location: 'Kisumu, Kenya',
        experience: { years: 5, level: 'mid' },
        skills: ['Agriculture', 'Farm Management', 'Agronomy', 'Supply Chain', 'Quality Control'],
        education: [
          { degree: 'Bachelor of Science', field: 'Agriculture', institution: 'Egerton University', year: 2019 }
        ],
        workHistory: [
          { company: 'Twiga Foods', position: 'Agricultural Manager', duration: '2020-Present', description: 'Farm supply chain management' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume38.pdf'
      },
      {
        name: 'Hassan Kimbugwe',
        email: 'hassan.kimbugwe@gmail.com',
        phone: '+256-772-777-888',
        location: 'Kampala, Uganda',
        experience: { years: 9, level: 'executive' },
        skills: ['Executive Leadership', 'Strategic Planning', 'Business Development', 'Team Management'],
        education: [
          { degree: 'MBA', field: 'Business Administration', institution: 'Makerere University', year: 2015 },
          { degree: 'Bachelor of Commerce', field: 'Accounting', institution: 'Makerere University', year: 2012 }
        ],
        workHistory: [
          { company: 'Stanbic Bank Uganda', position: 'Managing Director', duration: '2020-Present', description: 'Bank leadership and strategy' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume39.pdf'
      },
      {
        name: 'Miriam Nantongo',
        email: 'miriam.nantongo@yahoo.com',
        phone: '+256-752-888-999',
        location: 'Entebbe, Uganda',
        experience: { years: 3, level: 'mid' },
        skills: ['Nursing', 'Healthcare', 'Patient Care', 'Medical Records', 'First Aid'],
        education: [
          { degree: 'Bachelor of Nursing', field: 'Healthcare', institution: 'Makerere University', year: 2021 }
        ],
        workHistory: [
          { company: 'Mulago Hospital', position: 'Registered Nurse', duration: '2021-Present', description: 'Patient care and medical assistance' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume40.pdf'
      },
      {
        name: 'David Ssekandi',
        email: 'david.ssekandi@gmail.com',
        phone: '+256-782-999-000',
        location: 'Jinja, Uganda',
        experience: { years: 4, level: 'mid' },
        skills: ['Teaching', 'Mathematics', 'Science', 'Curriculum Development', 'Educational Technology'],
        education: [
          { degree: 'Bachelor of Education', field: 'Mathematics', institution: 'Kyambogo University', year: 2020 }
        ],
        workHistory: [
          { company: 'St. Mary\'s College Jinja', position: 'Mathematics Teacher', duration: '2020-Present', description: 'Secondary school mathematics education' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume41.pdf'
      },
      {
        name: 'Zawadi Mwalimu',
        email: 'zawadi.mwalimu@gmail.com',
        phone: '+255-754-111-222',
        location: 'Dar es Salaam, Tanzania',
        experience: { years: 6, level: 'senior' },
        skills: ['Legal', 'Contract Law', 'Corporate Law', 'Compliance', 'Legal Research'],
        education: [
          { degree: 'Bachelor of Laws', field: 'Corporate Law', institution: 'University of Dar es Salaam', year: 2018 }
        ],
        workHistory: [
          { company: 'CRDB Bank', position: 'Corporate Lawyer', duration: '2019-Present', description: 'Banking regulations and contracts' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume42.pdf'
      },
      {
        name: 'Salum Machibya',
        email: 'salum.machibya@yahoo.com',
        phone: '+255-765-222-333',
        location: 'Arusha, Tanzania',
        experience: { years: 3, level: 'mid' },
        skills: ['Tourism', 'Hospitality', 'Customer Service', 'Tour Guiding', 'Languages'],
        education: [
          { degree: 'Bachelor of Tourism', field: 'Hospitality Management', institution: 'University of Dar es Salaam', year: 2021 }
        ],
        workHistory: [
          { company: 'Serengeti National Park', position: 'Tour Guide', duration: '2021-Present', description: 'Wildlife tourism and hospitality' }
        ],
        source: 'external',
        resumeUrl: 'https://example.com/resume43.pdf'
      },
      {
        name: 'Neema Mwangi',
        email: 'neema.mwangi@gmail.com',
        phone: '+255-756-333-444',
        location: 'Mwanza, Tanzania',
        experience: { years: 2, level: 'entry' },
        skills: ['Journalism', 'Writing', 'Photography', 'Social Media', 'Content Creation'],
        education: [
          { degree: 'Bachelor of Journalism', field: 'Media Studies', institution: 'University of Dar es Salaam', year: 2022 }
        ],
        workHistory: [
          { company: 'Daily News Tanzania', position: 'Junior Reporter', duration: '2022-Present', description: 'News reporting and content creation' }
        ],
        source: 'umurava',
        resumeUrl: 'https://example.com/resume44.pdf'
      }
    ]);
    console.log(`Created ${applicants.length} applicants`);

    // Add realistic job applications
    console.log('Adding job applications...');
    
    // Frontend developers apply for frontend roles
    await Applicant.updateMany(
      { name: { $in: ['Jean-Pierre Mugisha', 'Diane Uwase', 'Joseph Mwangi', 'Sarah Njeri'] } },
      { $push: { appliedJobs: [jobs[0]._id] } } // Senior Frontend Developer
    );
    
    // Backend developers apply for backend roles
    await Applicant.updateMany(
      { name: { $in: ['Jean-Pierre Mugisha', 'Grace Uwimana', 'Michael Okello', 'David Kamau'] } },
      { $push: { appliedJobs: [jobs[1]._id] } } // Backend Engineer
    );
    
    // Full stack developers apply for full stack roles
    await Applicant.updateMany(
      { name: { $in: ['Jean-Pierre Mugisha', 'Adeola Johnson', 'John Omondi'] } },
      { $push: { appliedJobs: [jobs[8]._id] } } // Full Stack Developer
    );
    
    // Data scientists apply for data roles
    await Applicant.updateMany(
      { name: { $in: ['Grace Uwimana', 'Eric Mutabazi', 'Grace Wanjiru'] } },
      { $push: { appliedJobs: [jobs[5]._id] } } // Data Scientist
    );
    
    // DevOps engineers apply for DevOps roles
    await Applicant.updateMany(
      { name: { $in: ['Samuel Ntaganda', 'David Kamau', 'Mohamed Ali'] } },
      { $push: { appliedJobs: [jobs[4]._id] } } // DevOps Engineer
    );
    
    // Mobile developers apply for mobile roles
    await Applicant.updateMany(
      { name: { $in: ['Aisha Hassan', 'Chidi Okonkwo'] } },
      { $push: { appliedJobs: [jobs[6]._id] } } // Mobile App Developer
    );
    
    // Cybersecurity applicants apply for security roles
    await Applicant.updateMany(
      { name: { $in: ['Abdul Karim', 'Ibrahim Musa', 'David Kamau'] } },
      { $push: { appliedJobs: [jobs[13]._id] } } // Cybersecurity Analyst
    );
    
    // Product managers apply for PM roles
    await Applicant.updateMany(
      { name: { $in: ['Chantal Mukamana', 'Funke Adebayo', 'Rebecca Namulondo'] } },
      { $push: { appliedJobs: [jobs[2]._id] } } // Product Manager
    );
    
    // UX designers apply for design roles
    await Applicant.updateMany(
      { name: { $in: ['Diane Uwase', 'Ngozi Eze', 'Sarah Njeri'] } },
      { $push: { appliedJobs: [jobs[3]._id] } } // UX Designer
    );
    
    console.log('Job applications added successfully!');

    console.log('\nSeed data created successfully!');
    console.log('Jobs:', jobs.map(j => j.title).join(', '));
    console.log('Applicants:', applicants.map(a => a.name).join(', '));
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
