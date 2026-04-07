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
        description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building modern React applications.',
        department: 'Engineering',
        location: 'Kigali, Rwanda',
        experienceLevel: 'senior',
        employmentType: 'full-time',
        skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux'],
        requirements: ['5+ years React experience', 'Strong TypeScript skills', 'Experience with Next.js'],
        status: 'active'
      },
      {
        title: 'Backend Engineer',
        description: 'Join our backend team to build scalable APIs and microservices using Node.js and Express.',
        department: 'Engineering',
        location: 'Kigali, Rwanda',
        experienceLevel: 'mid',
        employmentType: 'full-time',
        skills: ['Node.js', 'Express', 'MongoDB', 'TypeScript', 'Docker'],
        requirements: ['3+ years Node.js experience', 'MongoDB proficiency', 'API design knowledge'],
        status: 'active'
      },
      {
        title: 'Product Manager',
        description: 'Lead product development and strategy for our core SaaS platform.',
        department: 'Product',
        location: 'Kigali, Rwanda',
        experienceLevel: 'senior',
        employmentType: 'full-time',
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research'],
        requirements: ['5+ years PM experience', 'SaaS product experience', 'Strong communication skills'],
        status: 'active'
      },
      {
        title: 'UX Designer',
        description: 'Design intuitive user experiences for our web and mobile applications.',
        department: 'Design',
        location: 'Kigali, Rwanda',
        experienceLevel: 'mid',
        employmentType: 'contract',
        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
        requirements: ['3+ years UX design', 'Portfolio demonstrating UI/UX work', 'Figma expertise'],
        status: 'active'
      },
      {
        title: 'DevOps Engineer',
        description: 'Manage our cloud infrastructure and CI/CD pipelines.',
        department: 'Engineering',
        location: 'Kigali, Rwanda',
        experienceLevel: 'senior',
        employmentType: 'full-time',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
        requirements: ['AWS certification preferred', 'Kubernetes experience', 'Infrastructure as Code'],
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
      }
    ]);
    console.log(`Created ${applicants.length} applicants`);

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
