import { GoogleGenerativeAI } from '@google/generative-ai';
import { IJob, IApplicant } from '../models';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private maxRetries: number;
  private retryDelay: number;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required for AI screening');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    this.maxRetries = 2;
    this.retryDelay = 10000; // 10 seconds for faster recovery
  }

  private generateScreeningPrompt(job: IJob, applicants: IApplicant[]): string {
    const jobDetails = `
Job Title: ${job.title}
Description: ${job.description}
Required Skills: ${job.skills.join(', ')}
Requirements: ${job.requirements.join(', ')}
Experience Level: ${job.experienceLevel}
Location: ${job.location}
Department: ${job.department}
    `;

    const applicantsList = applicants.map((applicant, index) => `
Applicant ${index + 1}:
Name: ${applicant.name}
Email: ${applicant.email}
Experience: ${applicant.experience.years} years (${applicant.experience.level})
Skills: ${applicant.skills.join(', ')}
Education: ${applicant.education.map(edu => `${edu.degree} in ${edu.field} from ${edu.institution}`).join(', ')}
Work History: ${applicant.workHistory.map(work => `${work.position} at ${work.company} (${work.duration})`).join(', ')}
Location: ${applicant.location}
    `).join('\n');

    return `
You are an expert HR AI assistant specializing in talent screening and evaluation. 

TASK: Analyze the following job description and multiple applicants, then provide a comprehensive ranking and evaluation for each applicant.

JOB DETAILS:
${jobDetails}

APPLICANTS TO EVALUATE:
${applicantsList}

EVALUATION CRITERIA:
1. Skills alignment (40% weight)
2. Experience relevance (30% weight)
3. Education background (15% weight)
4. Overall fit for role (15% weight)

For each applicant, provide:
1. Match Score (0-100)
2. Rank (1 being highest)
3. Strengths (minimum 3 specific, evidence-based bullet points)
4. Gaps/Risks (minimum 2 specific, actionable bullet points)
5. Recommendation: "highly-recommended", "recommended", "consider", or "not-recommended"
6. Detailed reasoning (3-4 sentences with specific evidence from their profile)
7. SkillAlignment: Detailed skill-by-skill analysis with specific scores

REASONING REQUIREMENTS:
- Be specific and evidence-based
- Reference actual skills, experience, or education from the profile
- Explain WHY they match or don't match requirements
- Include quantifiable metrics where possible
- Avoid generic statements

EXAMPLES OF GOOD REASONING:
"Candidate demonstrates strong React expertise with 5 years experience, matching 8/10 required skills. Their senior-level experience at Tech Corp includes similar responsibilities, making them an excellent fit for the senior developer role."

"Despite having 3 years of experience, candidate lacks critical cloud skills (AWS, Docker) specified in requirements. While their frontend skills are solid, the gap in DevOps capabilities creates significant risk for this full-stack position."

RESPONSE FORMAT:
Return ONLY a valid JSON array with the following structure:
[
  {
    "applicantIndex": 1,
    "matchScore": 85,
    "rank": 1,
    "strengths": ["Strong technical skills in required technologies", "Relevant experience at similar companies", "Excellent educational background"],
    "gaps": ["Limited leadership experience", "No experience with specific tool X"],
    "recommendation": "highly-recommended",
    "reasoning": "Candidate demonstrates strong technical proficiency and relevant experience, making them an excellent fit for the role.",
    "skillAlignment": {
      "skill1": {"required": true, "present": true, "score": 90},
      "skill2": {"required": true, "present": false, "score": 0}
    }
  }
]

IMPORTANT:
- Be objective and consistent in your evaluation
- Consider the specific requirements and experience level mentioned in the job
- Ensure the total ranking is logical (no ties in ranks)
- Return valid JSON only, no additional text or explanations
    `;
  }

  async screenCandidates(job: IJob, applicants: IApplicant[]): Promise<any[]> {
    console.log(`[GeminiService] Starting AI screening for ${applicants.length} candidates`);
    
    let lastError: any;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`[GeminiService] Gemini API attempt ${attempt}/${this.maxRetries}`);
        const prompt = this.generateScreeningPrompt(job, applicants);
        
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean the response to ensure it's valid JSON
        const jsonText = text.replace(/```json\n?|\n?```/g, '').trim();
        
        try {
          const parsedResults = JSON.parse(jsonText);
          console.log(`[GeminiService] Successfully analyzed ${parsedResults.length} candidates`);
          return this.validateAndEnhanceResults(parsedResults, applicants);
        } catch (parseError) {
          console.error('Failed to parse Gemini response:', parseError);
          throw new Error('Invalid response format from AI service');
        }
      } catch (error: any) {
        lastError = error;
        
        // Check if it's a rate limit error (429)
        if (error.message && error.message.includes('429')) {
          const isLastAttempt = attempt === this.maxRetries;
          
          if (!isLastAttempt) {
            console.log(`[GeminiService] Rate limit hit. Waiting ${this.retryDelay}ms before retry...`);
            await this.sleep(this.retryDelay);
            continue;
          } else {
            console.error('[GeminiService] All retry attempts exhausted due to rate limits');
            throw new Error('Gemini AI rate limit exceeded. Please wait 30 seconds and try again.');
          }
        } else if (error.message && error.message.includes('404')) {
          // Model not found - likely API key or model issue
          console.error('[GeminiService] Model not found or API key issue. Falling back to local scoring.');
          throw new Error('Gemini AI model not available. Using local scoring service instead.');
        } else {
          // For non-rate-limit errors, don't retry
          console.error('Gemini API error:', error);
          throw new Error(`Gemini AI service error: ${error.message}`);
        }
      }
    }
    
    // This should never be reached, but TypeScript requires it
    throw new Error('Gemini AI screening failed after all retry attempts');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private validateAndEnhanceResults(results: any[], applicants: IApplicant[]): any[] {
    // Validate that we have results for all applicants
    if (results.length !== applicants.length) {
      throw new Error('Gemini AI did not return results for all applicants');
    }

    // Enhance results with additional data
    return results.map((result, index) => {
      const applicant = applicants[index];
      
      // Generate skill alignment scores
      const skillAlignment = this.calculateSkillAlignment(result.skillAlignment || {}, applicant.skills);
      
      return {
        ...result,
        applicantEmail: applicant.email,
        applicantName: applicant.name,
        skillAlignment,
        // Ensure required fields are present
        matchScore: Math.min(100, Math.max(0, result.matchScore || 0)),
        rank: result.rank || index + 1,
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        gaps: Array.isArray(result.gaps) ? result.gaps : [],
        recommendation: result.recommendation || 'consider',
        reasoning: result.reasoning || 'Evaluation completed by AI screening system',
      };
    });
  }

  private calculateSkillAlignment(aiAlignment: any, applicantSkills: string[]): any {
    const alignment: any = {};
    
    // Process AI-provided alignment
    Object.keys(aiAlignment).forEach(skill => {
      alignment[skill] = {
        required: aiAlignment[skill]?.required || false,
        present: aiAlignment[skill]?.present || false,
        score: Math.min(100, Math.max(0, aiAlignment[skill]?.score || 0))
      };
    });
    
    // Add any missing skills from applicant
    applicantSkills.forEach(skill => {
      if (!alignment[skill]) {
        alignment[skill] = {
          required: false,
          present: true,
          score: 75 // Default score for unlisted but present skills
        };
      }
    });
    
    return alignment;
  }

  async generateJobSummary(job: IJob): Promise<string> {
    try {
      const prompt = `
Generate a concise, professional summary for the following job posting:

Job Title: ${job.title}
Department: ${job.department}
Experience Level: ${job.experienceLevel}
Location: ${job.location}
Description: ${job.description}
Required Skills: ${job.skills.join(', ')}
Requirements: ${job.requirements.join(', ')}

Provide a 2-3 sentence summary that highlights the key aspects of this role and the ideal candidate profile.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating job summary:', error);
      return 'Professional summary not available.';
    }
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }
}
