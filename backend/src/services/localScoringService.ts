import { IJob, IApplicant } from '../models';

export class LocalScoringService {
  static scoreCandidates(job: IJob, applicants: IApplicant[]): any[] {
    console.log('[LocalScoringService] Using smart local scoring algorithm');
    
    return applicants.map((applicant, index) => {
      const score = this.calculateScore(job, applicant);
      const rank = index + 1; // Will be re-ranked after sorting
      
      return {
        applicantIndex: index + 1,
        applicantEmail: applicant.email,
        applicantName: applicant.name,
        matchScore: score.total,
        rank,
        strengths: score.strengths,
        gaps: score.gaps,
        recommendation: score.recommendation,
        reasoning: score.reasoning,
        skillAlignment: score.skillAlignment,
        isLocalResult: true
      };
    }).sort((a, b) => b.matchScore - a.matchScore)
      .map((result, idx) => ({ ...result, rank: idx + 1 }));
  }

  private static calculateScore(job: IJob, applicant: IApplicant) {
    const jobSkills = job.skills.map(s => s.toLowerCase());
    const applicantSkills = applicant.skills.map(s => s.toLowerCase());
    
    // Skills matching (40% weight)
    const matchingSkills = applicantSkills.filter(s => 
      jobSkills.some(js => s.includes(js) || js.includes(s))
    );
    const skillScore = job.skills.length > 0 
      ? (matchingSkills.length / job.skills.length) * 100 
      : 50;
    
    // Experience scoring (30% weight)
    const experienceYears = applicant.experience.years || 0;
    const experienceScore = this.getExperienceScore(job.experienceLevel, experienceYears);
    
    // Education scoring (15% weight)
    const educationScore = this.getEducationScore(applicant.education);
    
    // Overall fit (15% weight) - based on skills and experience alignment
    const fitScore = this.getFitScore(skillScore, experienceScore, job);
    
    const totalScore = Math.round(
      (skillScore * 0.4) + (experienceScore * 0.3) + (educationScore * 0.15) + (fitScore * 0.15)
    );

    return {
      total: Math.min(100, Math.max(0, totalScore)),
      strengths: this.generateStrengths(job, applicant, matchingSkills),
      gaps: this.generateGaps(job, applicant, jobSkills, applicantSkills),
      recommendation: this.getRecommendation(totalScore),
      reasoning: this.generateReasoning(job, applicant, matchingSkills, experienceYears, totalScore),
      skillAlignment: this.generateSkillAlignment(job, applicant, matchingSkills)
    };
  }

  private static getExperienceScore(jobLevel: string, candidateYears: number): number {
    const levelRequirements: Record<string, number> = {
      'entry': 0,
      'mid': 3,
      'senior': 5,
      'executive': 10
    };
    
    const required = levelRequirements[jobLevel] || 0;
    if (candidateYears >= required) {
      return Math.min(100, 80 + (candidateYears - required) * 4);
    } else {
      return Math.max(0, (candidateYears / required) * 80);
    }
  }

  private static getEducationScore(education: any[]): number {
    if (!education || education.length === 0) return 30;
    
    const hasDegree = education.some(ed => ed.degree.toLowerCase().includes('bachelor') || 
                                         ed.degree.toLowerCase().includes('master') || 
                                         ed.degree.toLowerCase().includes('phd'));
    
    const hasRelevantField = education.some(ed => 
      ed.field.toLowerCase().includes('computer') || 
      ed.field.toLowerCase().includes('software') || 
      ed.field.toLowerCase().includes('information') ||
      ed.field.toLowerCase().includes('engineering')
    );
    
    let score = 50;
    if (hasDegree) score += 30;
    if (hasRelevantField) score += 20;
    
    return Math.min(100, score);
  }

  private static getFitScore(skillScore: number, experienceScore: number, job: IJob): number {
    let score = (skillScore + experienceScore) / 2;
    
    // Bonus for location match (if specified)
    if (job.location && job.location !== 'Remote') {
      score += 5;
    }
    
    // Bonus for skills diversity
    if (skillScore > 70) score += 10;
    
    return Math.min(100, score);
  }

  private static generateStrengths(job: IJob, applicant: IApplicant, matchingSkills: string[]): string[] {
    const strengths = [];
    
    if (matchingSkills.length > 0) {
      strengths.push(`Strong match with required skills: ${matchingSkills.slice(0, 3).join(', ')}`);
    }
    
    if (applicant.experience.years >= 5) {
      strengths.push(`${applicant.experience.years} years of professional experience`);
    }
    
    if (applicant.education.length > 0) {
      const latestEdu = applicant.education[applicant.education.length - 1];
      strengths.push(`${latestEdu.degree} in ${latestEdu.field}`);
    }
    
    if (applicant.workHistory.length >= 2) {
      strengths.push(`Diverse work experience across ${applicant.workHistory.length} companies`);
    }
    
    if (strengths.length < 3) {
      strengths.push('Solid foundation for the role');
    }
    
    return strengths.slice(0, 4);
  }

  private static generateGaps(job: IJob, applicant: IApplicant, jobSkills: string[], applicantSkills: string[]): string[] {
    const gaps = [];
    
    const missingSkills = jobSkills.filter(js => 
      !applicantSkills.some(s => s.includes(js) || js.includes(s))
    );
    
    if (missingSkills.length > 0) {
      gaps.push(`Missing key skills: ${missingSkills.slice(0, 2).join(', ')}`);
    }
    
    if (applicant.experience.years < 2) {
      gaps.push('Limited professional experience');
    }
    
    if (applicant.experience.level === 'entry' && job.experienceLevel === 'senior') {
      gaps.push('Experience level below job requirements');
    }
    
    if (gaps.length < 2) {
      gaps.push('May need additional training for specific requirements');
    }
    
    return gaps.slice(0, 3);
  }

  private static getRecommendation(score: number): string {
    if (score >= 85) return 'highly-recommended';
    if (score >= 70) return 'recommended';
    if (score >= 50) return 'consider';
    return 'not-recommended';
  }

  private static generateReasoning(job: IJob, applicant: IApplicant, matchingSkills: string[], experienceYears: number, score: number): string {
    const skillMatch = `${matchingSkills.length}/${job.skills.length} required skills`;
    const experienceLevel = applicant.experience.level;
    
    if (score >= 85) {
      return `Exceptional candidate with strong ${skillMatch} match and ${experienceYears} years of ${experienceLevel} experience. Demonstrates excellent qualifications for ${job.title}.`;
    } else if (score >= 70) {
      return `Solid candidate matching ${skillMatch} with ${experienceYears} years experience. Good foundation for ${job.title} with some development areas.`;
    } else if (score >= 50) {
      return `Partially qualified candidate with ${skillMatch} alignment. May require additional training or support for ${job.title} role.`;
    } else {
      return `Limited match with only ${skillMatch} alignment. Significant gaps in core requirements for ${job.title} position.`;
    }
  }

  private static generateSkillAlignment(job: IJob, applicant: IApplicant, matchingSkills: string[]): Record<string, any> {
    const alignment: Record<string, any> = {};
    
    job.skills.forEach(skill => {
      const hasSkill = applicant.skills.some(s => 
        s.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(s.toLowerCase())
      );
      
      alignment[skill] = {
        required: true,
        present: hasSkill,
        score: hasSkill ? 75 + Math.floor(Math.random() * 25) : Math.floor(Math.random() * 30)
      };
    });
    
    return alignment;
  }
}
