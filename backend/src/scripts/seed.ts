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
        location: 'Remote',
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
        location: 'New York, NY',
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
        location: 'San Francisco, CA',
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
        location: 'Remote',
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
        location: 'Austin, TX',
        experienceLevel: 'senior',
        employmentType: 'full-time',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
        requirements: ['AWS certification preferred', 'Kubernetes experience', 'Infrastructure as Code'],
        status: 'active'
      }
    ]);
    console.log(`Created ${jobs.length} jobs`);

    // Create sample applicants
    const applicants = await Applicant.create([
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0101',
        location: 'New York, NY',
        experience: { years: 6, level: 'senior' },
        skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
        education: [
          { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'MIT', year: 2018 }
        ],
        workHistory: [
          { company: 'TechCorp', position: 'Senior Developer', duration: '2020-Present', description: 'Led frontend team' },
          { company: 'StartupXYZ', position: 'Full Stack Developer', duration: '2018-2020', description: 'Built MVP' }
        ],
        source: 'external',
        status: 'active',
        resumeUrl: 'https://example.com/resume1.pdf'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-0102',
        location: 'San Francisco, CA',
        experience: { years: 4, level: 'mid' },
        skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
        education: [
          { degree: 'Master of Science', field: 'Data Science', institution: 'Stanford', year: 2020 }
        ],
        workHistory: [
          { company: 'DataSystems', position: 'Backend Developer', duration: '2020-Present', description: 'API development' }
        ],
        source: 'umurava',
        status: 'active',
        resumeUrl: 'https://example.com/resume2.pdf'
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        phone: '+1-555-0103',
        location: 'Seattle, WA',
        experience: { years: 8, level: 'senior' },
        skills: ['Java', 'Spring Boot', 'Microservices', 'Kubernetes', 'AWS'],
        education: [
          { degree: 'Bachelor of Engineering', field: 'Software Engineering', institution: 'UC Berkeley', year: 2016 }
        ],
        workHistory: [
          { company: 'Enterprise Solutions', position: 'Lead Engineer', duration: '2019-Present', description: 'Led microservices migration' },
          { company: 'BigTech Inc', position: 'Senior Java Developer', duration: '2016-2019', description: 'Backend development' }
        ],
        source: 'external',
        status: 'active',
        resumeUrl: 'https://example.com/resume3.pdf'
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        phone: '+1-555-0104',
        location: 'Miami, FL',
        experience: { years: 3, level: 'mid' },
        skills: ['Product Management', 'Agile', 'Jira', 'Data Analysis', 'SQL'],
        education: [
          { degree: 'Bachelor of Business', field: 'Marketing', institution: 'University of Florida', year: 2021 }
        ],
        workHistory: [
          { company: 'ProductCo', position: 'Associate PM', duration: '2021-Present', description: 'Feature prioritization' }
        ],
        source: 'external',
        status: 'active',
        resumeUrl: 'https://example.com/resume4.pdf'
      },
      {
        name: 'David Kim',
        email: 'david.kim@email.com',
        phone: '+1-555-0105',
        location: 'Austin, TX',
        experience: { years: 2, level: 'entry' },
        skills: ['JavaScript', 'React', 'CSS', 'HTML', 'Git'],
        education: [
          { degree: 'Bachelor of Science', field: 'Information Technology', institution: 'UT Austin', year: 2022 }
        ],
        workHistory: [
          { company: 'WebAgency', position: 'Junior Developer', duration: '2022-Present', description: 'Client websites' }
        ],
        source: 'umurava',
        status: 'active',
        resumeUrl: 'https://example.com/resume5.pdf'
      },
      {
        name: 'Lisa Thompson',
        email: 'lisa.t@email.com',
        phone: '+1-555-0106',
        location: 'Denver, CO',
        experience: { years: 7, level: 'senior' },
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'User Research', 'Design Systems'],
        education: [
          { degree: 'Bachelor of Fine Arts', field: 'Graphic Design', institution: 'RISD', year: 2017 }
        ],
        workHistory: [
          { company: 'DesignStudio', position: 'Senior UX Designer', duration: '2020-Present', description: 'Led design system' },
          { company: 'CreativeAgency', position: 'UX Designer', duration: '2017-2020', description: 'Mobile app design' }
        ],
        source: 'external',
        status: 'active',
        resumeUrl: 'https://example.com/resume6.pdf'
      },
      {
        name: 'James Wilson',
        email: 'james.w@email.com',
        phone: '+1-555-0107',
        location: 'Chicago, IL',
        experience: { years: 5, level: 'mid' },
        skills: ['DevOps', 'AWS', 'Docker', 'Jenkins', 'Terraform'],
        education: [
          { degree: 'Bachelor of Science', field: 'Computer Engineering', institution: 'UIUC', year: 2019 }
        ],
        workHistory: [
          { company: 'CloudTech', position: 'DevOps Engineer', duration: '2019-Present', description: 'CI/CD pipeline' }
        ],
        source: 'external',
        status: 'active',
        resumeUrl: 'https://example.com/resume7.pdf'
      },
      {
        name: 'Anna Martinez',
        email: 'anna.m@email.com',
        phone: '+1-555-0108',
        location: 'Los Angeles, CA',
        experience: { years: 10, level: 'executive' },
        skills: ['Leadership', 'Strategy', 'Team Building', 'Agile', 'Product Development'],
        education: [
          { degree: 'MBA', field: 'Business Administration', institution: 'UCLA', year: 2015 },
          { degree: 'Bachelor of Science', field: 'Computer Science', institution: 'USC', year: 2013 }
        ],
        workHistory: [
          { company: 'TechGiant', position: 'VP of Engineering', duration: '2021-Present', description: 'Engineering leadership' },
          { company: 'ScaleUp Inc', position: 'Engineering Manager', duration: '2018-2021', description: 'Team scaling' },
          { company: 'StartupABC', position: 'Senior Developer', duration: '2015-2018', description: 'Full stack development' }
        ],
        source: 'external',
        status: 'active',
        resumeUrl: 'https://example.com/resume8.pdf'
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
