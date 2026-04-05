import pdfParse from 'pdf-parse';
import { IApplicant } from '../models';

export class ResumeParser {
  static async parsePDFResume(buffer: Buffer): Promise<Partial<IApplicant>> {
    try {
      const data = await pdfParse(buffer);
      const text = data.text;
      
      return this.extractApplicantData(text);
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse resume PDF');
    }
  }

  private static extractApplicantData(text: string): Partial<IApplicant> {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const applicant: Partial<IApplicant> = {
      skills: [],
      education: [],
      workHistory: [],
      experience: { years: 0, level: 'entry' }
    };

    // Extract name (usually first line with proper capitalization)
    const nameLine = lines.find(line => 
      /^[A-Z][a-z]+ [A-Z][a-z]+/.test(line) && 
      line.split(' ').length <= 4
    );
    if (nameLine) {
      applicant.name = nameLine;
    }

    // Extract email
    const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      applicant.email = emailMatch[0];
    }

    // Extract phone
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      applicant.phone = phoneMatch[0];
    }

    // Extract skills (common tech skills)
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C++',
      'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Azure', 'Docker',
      'Kubernetes', 'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Next.js', 'Redux',
      'Tailwind CSS', 'Bootstrap', 'Webpack', 'Jest', 'Cypress', 'CI/CD', 'DevOps'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
    applicant.skills = [...new Set(foundSkills)]; // Remove duplicates

    // Extract education
    const educationPatterns = [
      /(?:Bachelor|Master|PhD|B\.Sc|M\.Sc|B\.A|M\.A|B\.Tech|M\.Tech)[^,\n]*/gi,
      /(?:University|College|Institute)[^,\n]*/gi
    ];

    const educationMatches: string[] = [];
    educationPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        educationMatches.push(...matches);
      }
    });

    applicant.education = educationMatches.slice(0, 3).map((edu, index) => ({
      degree: edu.split(',')[0] || edu,
      field: 'Computer Science', // Default field
      institution: 'Unknown',
      year: 2020 + index // Default year
    }));

    // Extract work experience
    const experienceSection = this.extractSection(text, ['EXPERIENCE', 'WORK HISTORY', 'EMPLOYMENT', 'WORK EXPERIENCE']);
    if (experienceSection) {
      const workEntries = this.parseWorkExperience(experienceSection);
      applicant.workHistory = workEntries;
      
      // Calculate total experience
      const totalYears = this.calculateTotalExperience(workEntries);
      applicant.experience = {
        years: totalYears,
        level: this.getExperienceLevel(totalYears)
      };
    }

    // Extract location
    const locationPatterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})\b/,
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b,\s*[A-Z]{2}/
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match && !match[0].includes('Experience') && !match[0].includes('Education')) {
        applicant.location = match[0];
        break;
      }
    }

    return applicant;
  }

  private static extractSection(text: string, sectionHeaders: string[]): string | null {
    const lines = text.split('\n').map(line => line.trim());
    let startIndex = -1;
    let endIndex = lines.length;

    // Find section start
    for (let i = 0; i < lines.length; i++) {
      if (sectionHeaders.some(header => lines[i].toUpperCase().includes(header))) {
        startIndex = i;
        break;
      }
    }

    if (startIndex === -1) return null;

    // Find section end (next major section)
    const majorSections = ['EDUCATION', 'SKILLS', 'EXPERIENCE', 'PROJECTS', 'CERTIFICATIONS', 'AWARDS'];
    for (let i = startIndex + 1; i < lines.length; i++) {
      if (majorSections.some(section => lines[i].toUpperCase().includes(section))) {
        endIndex = i;
        break;
      }
    }

    return lines.slice(startIndex, endIndex).join('\n');
  }

  private static parseWorkExperience(experienceText: string): Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }> {
    const workEntries = [];
    const lines = experienceText.split('\n').filter(line => line.trim());
    
    let currentEntry: any = null;
    
    for (const line of lines) {
      // Look for date patterns (2020-2023, 2021 - Present, etc.)
      const datePattern = /\b(19|20)\d{2}[^-\d]*[-–—][^-\d]*(19|20)\d{2}|Present\b/i;
      const hasDate = datePattern.test(line);
      
      if (hasDate && line.length > 10) {
        // Save previous entry if exists
        if (currentEntry) {
          workEntries.push(currentEntry);
        }
        
        // Start new entry
        const parts = line.split(datePattern);
        const dateMatch = line.match(datePattern);
        
        currentEntry = {
          position: parts[0].trim(),
          duration: dateMatch ? dateMatch[0] : 'Unknown',
          company: parts[1]?.trim() || 'Unknown Company',
          description: ''
        };
      } else if (currentEntry && line.trim()) {
        // Add to description
        currentEntry.description += line + ' ';
      }
    }
    
    // Add last entry
    if (currentEntry) {
      workEntries.push(currentEntry);
    }
    
    return workEntries.slice(0, 5); // Limit to 5 most recent positions
  }

  private static calculateTotalExperience(workHistory: any[]): number {
    let totalYears = 0;
    
    workHistory.forEach(entry => {
      const duration = entry.duration;
      const yearMatch = duration.match(/(19|20)\d{2}/g);
      
      if (yearMatch && yearMatch.length >= 2) {
        const startYear = parseInt(yearMatch[0]);
        const endYear = yearMatch[1].toLowerCase().includes('present') ? 
          new Date().getFullYear() : parseInt(yearMatch[1]);
        totalYears += Math.max(0, endYear - startYear);
      }
    });
    
    return Math.min(totalYears, 50); // Cap at 50 years
  }

  private static getExperienceLevel(years: number): 'entry' | 'mid' | 'senior' | 'executive' {
    if (years < 2) return 'entry';
    if (years < 5) return 'mid';
    if (years < 10) return 'senior';
    return 'executive';
  }
}
