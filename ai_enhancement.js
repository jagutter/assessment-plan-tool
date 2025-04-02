// AI Enhancement Prototype for Assessment Plan Tool
// This module provides automated analysis and feedback on user inputs

// Main AI analysis controller
class AssessmentAI {
  constructor() {
    this.knowledgeBase = new KnowledgeBase();
    this.analyzers = {
      learningOutcomes: new LearningOutcomeAnalyzer(this.knowledgeBase),
      curriculumMapping: new CurriculumMappingAnalyzer(this.knowledgeBase),
      assessmentMethods: new AssessmentMethodAnalyzer(this.knowledgeBase),
      dataCollection: new DataCollectionAnalyzer(this.knowledgeBase),
      actionPlanning: new ActionPlanningAnalyzer(this.knowledgeBase)
    };
    
    this.initializeEventListeners();
  }
  
  initializeEventListeners() {
    // Add AI feedback buttons to each module
    document.querySelectorAll('.module-section').forEach(section => {
      const feedbackBtn = document.createElement('button');
      feedbackBtn.className = 'ai-feedback-btn';
      feedbackBtn.innerHTML = '<i class="ai-icon"></i> Get AI Feedback';
      feedbackBtn.addEventListener('click', (e) => this.handleFeedbackRequest(e));
      section.appendChild(feedbackBtn);
    });
    
    // Add real-time analysis for text inputs
    document.querySelectorAll('textarea, input[type="text"]').forEach(input => {
      input.addEventListener('blur', (e) => this.analyzeInput(e.target));
    });
  }
  
  handleFeedbackRequest(event) {
    const section = event.target.closest('.module-section');
    const moduleType = this.determineModuleType(section);
    const inputs = this.collectInputsFromSection(section);
    
    const feedback = this.generateFeedback(moduleType, inputs);
    this.displayFeedback(section, feedback);
  }
  
  determineModuleType(section) {
    // Determine which module the section belongs to based on content or data attributes
    if (section.querySelector('#learning-outcome-1')) return 'learningOutcomes';
    if (section.querySelector('#curriculum-map')) return 'curriculumMapping';
    if (section.querySelector('[id^="assessment-details-"]')) return 'assessmentMethods';
    if (section.querySelector('#data-collection-matrix')) return 'dataCollection';
    if (section.querySelector('#action-plans-container')) return 'actionPlanning';
    return 'general';
  }
  
  collectInputsFromSection(section) {
    const inputs = {};
    section.querySelectorAll('input[type="text"], textarea, select').forEach(element => {
      if (element.id) {
        inputs[element.id] = element.value;
      }
    });
    return inputs;
  }
  
  analyzeInput(inputElement) {
    // Skip empty inputs
    if (!inputElement.value.trim()) return;
    
    // Determine what type of input this is
    const inputType = this.determineInputType(inputElement);
    
    // Get the appropriate analyzer
    const analyzer = this.getAnalyzerForInput(inputType);
    
    // Generate feedback
    const feedback = analyzer.analyzeSingleInput(inputElement.id, inputElement.value);
    
    // Display inline feedback if we have any
    if (feedback && feedback.suggestions.length > 0) {
      this.displayInlineFeedback(inputElement, feedback);
    } else {
      this.removeInlineFeedback(inputElement);
    }
  }
  
  determineInputType(inputElement) {
    const id = inputElement.id;
    
    if (id.includes('outcome') && !id.includes('align')) return 'learningOutcome';
    if (id.includes('curriculum') || id.includes('map')) return 'curriculumMapping';
    if (id.includes('assessment') || id.includes('method')) return 'assessmentMethod';
    if (id.includes('data') || id.includes('collection')) return 'dataCollection';
    if (id.includes('action') || id.includes('plan')) return 'actionPlanning';
    
    // Default to general analysis
    return 'general';
  }
  
  getAnalyzerForInput(inputType) {
    switch(inputType) {
      case 'learningOutcome':
        return this.analyzers.learningOutcomes;
      case 'curriculumMapping':
        return this.analyzers.curriculumMapping;
      case 'assessmentMethod':
        return this.analyzers.assessmentMethods;
      case 'dataCollection':
        return this.analyzers.dataCollection;
      case 'actionPlanning':
        return this.analyzers.actionPlanning;
      default:
        // Use a general analyzer for other input types
        return {
          analyzeSingleInput: () => ({ quality: 'neutral', suggestions: [] })
        };
    }
  }
  
  generateFeedback(moduleType, inputs) {
    // Get the appropriate analyzer for this module
    const analyzer = this.analyzers[moduleType] || {
      analyzeAll: () => ({ overallQuality: 'neutral', feedbackItems: [] })
    };
    
    // Generate comprehensive feedback
    return analyzer.analyzeAll(inputs);
  }
  
  displayInlineFeedback(inputElement, feedback) {
    // Remove any existing feedback
    this.removeInlineFeedback(inputElement);
    
    // Create feedback element
    const feedbackElement = document.createElement('div');
    feedbackElement.className = `ai-inline-feedback ${feedback.quality}`;
    
    // Add feedback icon
    const icon = document.createElement('span');
    icon.className = 'ai-feedback-icon';
    icon.textContent = feedback.quality === 'good' ? '✓' : feedback.quality === 'poor' ? '!' : 'i';
    feedbackElement.appendChild(icon);
    
    // Add feedback text
    const text = document.createElement('div');
    text.className = 'ai-feedback-text';
    
    // Add first suggestion
    if (feedback.suggestions.length > 0) {
      text.textContent = feedback.suggestions[0];
    }
    
    // Add "more" button if there are multiple suggestions
    if (feedback.suggestions.length > 1) {
      const moreBtn = document.createElement('button');
      moreBtn.className = 'ai-more-btn';
      moreBtn.textContent = 'More suggestions';
      moreBtn.addEventListener('click', () => {
        const modal = this.createSuggestionsModal(feedback.suggestions);
        document.body.appendChild(modal);
      });
      text.appendChild(document.createElement('br'));
      text.appendChild(moreBtn);
    }
    
    feedbackElement.appendChild(text);
    
    // Insert after input element
    inputElement.parentNode.insertBefore(feedbackElement, inputElement.nextSibling);
  }
  
  removeInlineFeedback(inputElement) {
    const existingFeedback = inputElement.nextElementSibling;
    if (existingFeedback && existingFeedback.classList.contains('ai-inline-feedback')) {
      existingFeedback.remove();
    }
  }
  
  createSuggestionsModal(suggestions) {
    const modal = document.createElement('div');
    modal.className = 'ai-suggestions-modal';
    
    const content = document.createElement('div');
    content.className = 'ai-modal-content';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'ai-modal-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => modal.remove());
    
    const heading = document.createElement('h3');
    heading.textContent = 'AI Suggestions';
    
    const list = document.createElement('ul');
    suggestions.forEach(suggestion => {
      const item = document.createElement('li');
      item.textContent = suggestion;
      list.appendChild(item);
    });
    
    content.appendChild(closeBtn);
    content.appendChild(heading);
    content.appendChild(list);
    modal.appendChild(content);
    
    // Close when clicking outside the modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
    
    return modal;
  }
  
  displayFeedback(section, feedback) {
    // Remove any existing feedback panel
    const existingPanel = section.querySelector('.ai-feedback-panel');
    if (existingPanel) existingPanel.remove();
    
    // Create feedback panel
    const panel = document.createElement('div');
    panel.className = `ai-feedback-panel ${feedback.overallQuality}`;
    
    // Add header
    const header = document.createElement('div');
    header.className = 'ai-feedback-header';
    
    const title = document.createElement('h4');
    title.textContent = 'AI Assessment Feedback';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ai-close-btn';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => panel.remove());
    
    header.appendChild(title);
    header.appendChild(closeBtn);
    panel.appendChild(header);
    
    // Add overall assessment
    const overall = document.createElement('div');
    overall.className = 'ai-overall-assessment';
    
    const qualityLabel = document.createElement('span');
    qualityLabel.className = 'ai-quality-label';
    qualityLabel.textContent = this.getQualityLabel(feedback.overallQuality);
    
    const qualityDescription = document.createElement('p');
    qualityDescription.textContent = this.getQualityDescription(feedback.overallQuality);
    
    overall.appendChild(qualityLabel);
    overall.appendChild(qualityDescription);
    panel.appendChild(overall);
    
    // Add feedback items
    if (feedback.feedbackItems && feedback.feedbackItems.length > 0) {
      const itemsList = document.createElement('ul');
      itemsList.className = 'ai-feedback-items';
      
      feedback.feedbackItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = `ai-feedback-item ${item.type}`;
        
        const itemTitle = document.createElement('strong');
        itemTitle.textContent = item.title;
        
        const itemText = document.createElement('p');
        itemText.textContent = item.description;
        
        listItem.appendChild(itemTitle);
        listItem.appendChild(itemText);
        
        // Add suggestion if available
        if (item.suggestion) {
          const suggestion = document.createElement('div');
          suggestion.className = 'ai-suggestion';
          suggestion.innerHTML = `<strong>Suggestion:</strong> ${item.suggestion}`;
          listItem.appendChild(suggestion);
        }
        
        itemsList.appendChild(listItem);
      });
      
      panel.appendChild(itemsList);
    }
    
    // Add to section
    section.appendChild(panel);
  }
  
  getQualityLabel(quality) {
    switch(quality) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Needs Improvement';
      case 'poor':
        return 'Needs Significant Revision';
      default:
        return 'Analysis Complete';
    }
  }
  
  getQualityDescription(quality) {
    switch(quality) {
      case 'excellent':
        return 'This section meets all best practices for effective assessment planning.';
      case 'good':
        return 'This section is strong but has a few areas that could be enhanced.';
      case 'fair':
        return 'This section needs improvement in several areas to meet assessment best practices.';
      case 'poor':
        return 'This section requires significant revision to be effective for assessment purposes.';
      default:
        return 'Review the feedback below for specific suggestions.';
    }
  }
}

// Knowledge base containing assessment best practices and patterns
class KnowledgeBase {
  constructor() {
    this.bloomsVerbs = {
      remember: ['define', 'identify', 'list', 'name', 'recall', 'recognize', 'state', 'repeat'],
      understand: ['describe', 'discuss', 'explain', 'interpret', 'paraphrase', 'summarize', 'classify', 'compare'],
      apply: ['apply', 'demonstrate', 'implement', 'use', 'solve', 'illustrate', 'calculate', 'execute'],
      analyze: ['analyze', 'differentiate', 'distinguish', 'examine', 'categorize', 'compare', 'contrast', 'investigate'],
      evaluate: ['evaluate', 'assess', 'critique', 'judge', 'appraise', 'recommend', 'justify', 'defend'],
      create: ['create', 'design', 'develop', 'formulate', 'construct', 'produce', 'compose', 'generate']
    };
    
    this.vagueVerbs = ['understand', 'know', 'learn', 'appreciate', 'realize', 'be aware of', 'be familiar with', 'grasp'];
    
    this.assessmentMethodsByOutcomeType = {
      knowledge: ['exams', 'quizzes', 'papers', 'presentations', 'concept maps'],
      skills: ['performances', 'projects', 'demonstrations', 'portfolios', 'case studies', 'simulations'],
      attitudes: ['reflections', 'surveys', 'observations', 'interviews', 'focus groups']
    };
    
    this.commonAssessmentIssues = {
      tooMany: 'Having too many outcomes can make assessment unmanageable.',
      tooFew: 'Having too few outcomes may not adequately represent program expectations.',
      unmeasurable: 'Outcomes should be measurable through direct observation of student work.',
      misaligned: 'Outcomes should align with program goals and institutional priorities.',
      incomplete: 'Assessment plans should address all program learning outcomes.',
      imbalanced: 'Assessment methods should provide a balanced view of student learning.'
    };
  }
  
  getBloomsLevel(verb) {
    verb = verb.toLowerCase();
    for (const [level, verbs] of Object.entries(this.bloomsVerbs)) {
      if (verbs.includes(verb)) return level;
    }
    return null;
  }
  
  isVagueVerb(verb) {
    return this.vagueVerbs.includes(verb.toLowerCase());
  }
  
  getSuggestedAssessmentMethods(outcomeType) {
    return this.assessmentMethodsByOutcomeType[outcomeType] || [];
  }
  
  getIssueDescription(issueKey) {
    return this.commonAssessmentIssues[issueKey] || '';
  }
}

// Analyzer for learning outcomes
class LearningOutcomeAnalyzer {
  constructor(knowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }
  
  analyzeSingleInput(inputId, text) {
    // Skip if not a learning outcome
    if (!inputId.includes('outcome') || !text) {
      return { quality: 'neutral', suggestions: [] };
    }
    
    const suggestions = [];
    let quality = 'good';
    
    // Extract the action verb (first word after "students will be able to")
    const match = text.match(/students will be able to\s+(\w+)/i);
    if (match) {
      const verb = match[1].toLowerCase();
      
      // Check if verb is vague
      if (this.knowledgeBase.isVagueVerb(verb)) {
        suggestions.push(`The verb "${verb}" is vague and difficult to measure. Consider using a more specific, observable verb like "analyze," "evaluate," or "demonstrate."`);
        quality = 'poor';
      }
      
      // Check Bloom's level
      const bloomsLevel = this.knowledgeBase.getBloomsLevel(verb);
      if (bloomsLevel) {
        if (bloomsLevel === 'remember' || bloomsLevel === 'understand') {
          suggestions.push(`The verb "${verb}" is at a lower cognitive level (${bloomsLevel}). For program-level outcomes, consider using higher-level verbs like "analyze," "evaluate," or "create."`);
          quality = quality === 'poor' ? 'poor' : 'fair';
        }
      } else {
        suggestions.push(`The verb "${verb}" is not recognized in Bloom's Taxonomy. Consider using a standard action verb that clearly indicates the expected cognitive level.`);
        quality = 'fair';
      }
    } else {
      suggestions.push('Learning outcomes should follow the format: "Upon completion of this program, students will be able to [ACTION VERB] [SPECIFIC KNOWLEDGE, SKILL, OR VALUE]."');
      quality = 'poor';
    }
    
    // Check for measurability
    if (text.length < 30) {
      suggestions.push('This outcome appears too brief. Include specific, measurable details about what students should be able to do.');
      quality = 'poor';
    }
    
    // Check for multiple outcomes in one statement
    if (text.includes(' and ') && text.includes(',')) {
      suggestions.push('This statement may contain multiple outcomes. Consider separating into distinct outcomes for clarity and easier assessment.');
      quality = quality === 'poor' ? 'poor' : 'fair';
    }
    
    return { quality, suggestions };
  }
  
  analyzeAll(inputs) {
    const outcomes = [];
    const feedbackItems = [];
    
    // Collect all learning outcomes
    for (const [id, value] of Object.entries(inputs)) {
      if (id.includes('learning-outcome') && value) {
        outcomes.push(value);
      }
    }
    
    // Analyze number of outcomes
    if (outcomes.length < 3) {
      feedbackItems.push({
        type: 'warning',
        title: 'Too Few Learning Outcomes',
        description: 'Most academic programs benefit from having 5-8 program learning outcomes to comprehensively address key competencies.',
        suggestion: 'Consider adding more outcomes to cover all essential knowledge, skills, and values in your discipline.'
      });
    } else if (outcomes.length > 8) {
      feedbackItems.push({
        type: 'warning',
        title: 'Too Many Learning Outcomes',
        description: 'Having more than 8 program learning outcomes can make assessment unmanageable and dilute focus.',
        suggestion: 'Consider consolidating related outcomes or prioritizing the most essential ones.'
      });
    }
    
    // Analyze individual outcomes
    let vagueVerbCount = 0;
    let lowLevelVerbCount = 0;
    let wellFormedCount = 0;
    
    outcomes.forEach((outcome, index) => {
      const analysis = this.analyzeSingleInput(`learning-outcome-${index+1}`, outcome);
      
      if (analysis.suggestions.some(s => s.includes('vague'))) {
        vagueVerbCount++;
      }
      
      if (analysis.suggestions.some(s => s.includes('lower cognitive level'))) {
        lowLevelVerbCount++;
      }
      
      if (analysis.quality === 'good') {
        wellFormedCount++;
      }
    });
    
    // Add feedback based on patterns
    if (vagueVerbCount > 0) {
      feedbackItems.push({
        type: 'error',
        title: 'Vague Verbs Detected',
        description: `${vagueVerbCount} of your outcomes use vague verbs that are difficult to measure.`,
        suggestion: 'Replace vague verbs like "understand" or "appreciate" with specific, observable verbs from Bloom\'s Taxonomy.'
      });
    }
    
    if (lowLevelVerbCount > outcomes.length / 2) {
      feedbackItems.push({
        type: 'warning',
        title: 'Predominantly Lower-Level Outcomes',
        description: 'Most of your outcomes focus on lower cognitive levels (remember, understand).',
        suggestion: 'For program-level outcomes, incorporate higher-level cognitive skills like analysis, evaluation, and creation.'
      });
    }
    
    // Check for balance across domains
    const hasKnowledgeOutcomes = outcomes.some(o => o.toLowerCase().includes('knowledge') || o.toLowerCase().includes('understand') || o.toLowerCase().includes('explain'));
    const hasSkillOutcomes = outcomes.some(o => o.toLowerCase().includes('skill') || o.toLowerCase().includes('perform') || o.toLowerCase().includes('demonstrate'));
    const hasValueOutcomes = outcomes.some(o => o.toLowerCase().includes('value') || o.toLowerCase().includes('appreciate') || o.toLowerCase().includes('ethical'));
    
    if (!hasKnowledgeOutcomes || !hasSkillOutcomes) {
      feedbackItems.push({
        type: 'suggestion',
        title: 'Domain Balance',
        description: 'Comprehensive program assessment addresses both knowledge and skill outcomes.',
        suggestion: 'Ensure your outcomes address both what students should know and what they should be able to do.'
      });
    }
    
    // Determine overall quality
    let overallQuality = 'neutral';
    if (wellFormedCount === outcomes.length && outcomes.length >= 3 && outcomes.length <= 8) {
      overallQuality = 'excellent';
    } else if (wellFormedCount >= outcomes.length * 0.7) {
      overallQuality = 'good';
    } else if (wellFormedCount >= outcomes.length * 0.4) {
      overallQuality = 'fair';
    } else {
      overallQuality = 'poor';
    }
    
    return { overallQuality, feedbackItems };
  }
}

// Analyzer for curriculum mapping
class CurriculumMappingAnalyzer {
  constructor(knowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }
  
  analyzeSingleInput(inputId, value) {
    // Curriculum mapping typically uses a matrix rather than individual inputs
    return { quality: 'neutral', suggestions: [] };
  }
  
  analyzeAll(inputs) {
    const feedbackItems = [];
    
    // Extract outcomes and courses from inputs
    const outcomes = [];
    const courses = [];
    
    for (const [id, value] of Object.entries(inputs)) {
      if (id.includes('outcome-') && !id.includes('select') && value) {
        outcomes.push(value);
      }
      if (id.includes('course-') && value) {
        courses.push(value);
      }
    }
    
    // Check if we have enough data to analyze
    if (outcomes.length === 0 || courses.length === 0) {
      return {
        overallQuality: 'neutral',
        feedbackItems: [{
          type: 'info',
          title: 'Insufficient Data',
          description: 'Please add program learning outcomes and courses to generate curriculum mapping feedback.',
          suggestion: 'Complete the outcomes and courses sections before generating a curriculum map.'
        }]
      };
    }
    
    // Analyze curriculum structure
    if (courses.length < 5) {
      feedbackItems.push({
        type: 'info',
        title: 'Limited Curriculum Representation',
        description: 'Your curriculum map includes relatively few courses.',
        suggestion: 'Consider adding more courses to ensure comprehensive coverage of your program curriculum.'
      });
    }
    
    // Simulate gap analysis (in a real implementation, this would analyze the actual mapping data)
    feedbackItems.push({
      type: 'suggestion',
      title: 'Curriculum Coverage Analysis',
      description: 'Ensure each outcome is addressed in multiple courses throughout the curriculum.',
      suggestion: 'Look for outcomes with limited coverage and identify courses where they could be incorporated.'
    });
    
    // Simulate progression analysis
    feedbackItems.push({
      type: 'suggestion',
      title: 'Learning Progression',
      description: 'Effective curricula show a clear progression (Introduce → Reinforce → Master) for each outcome.',
      suggestion: 'Review your map to ensure outcomes are developed sequentially across courses.'
    });
    
    // Simulate assessment points identification
    feedbackItems.push({
      type: 'suggestion',
      title: 'Assessment Points',
      description: 'Identify key courses for collecting assessment data on each outcome.',
      suggestion: 'Select 2-3 strategic points in the curriculum to assess each outcome, including at least one near program completion.'
    });
    
    return {
      overallQuality: 'good',
      feedbackItems
    };
  }
}

// Analyzer for assessment methods
class AssessmentMethodAnalyzer {
  constructor(knowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }
  
  analyzeSingleInput(inputId, value) {
    if (!inputId.includes('assessment') || !value) {
      return { quality: 'neutral', suggestions: [] };
    }
    
    const suggestions = [];
    let quality = 'good';
    
    // Check for specificity
    if (value.length < 20) {
      suggestions.push('This description is quite brief. Provide more specific details about how the assessment will be conducted.');
      quality = 'fair';
    }
    
    // Check for common assessment terms
    const hasAssessmentTerms = /rubric|criteria|standard|measure|evaluate|score/i.test(value);
    if (!hasAssessmentTerms) {
      suggestions.push('Consider including specific information about assessment criteria or standards for evaluation.');
      quality = quality === 'fair' ? 'poor' : 'fair';
    }
    
    return { quality, suggestions };
  }
  
  analyzeAll(inputs) {
    const feedbackItems = [];
    const assessmentDetails = [];
    
    // Collect assessment details
    for (const [id, value] of Object.entries(inputs)) {
      if (id.includes('assessment-details') && value) {
        assessmentDetails.push(value);
      }
    }
    
    // Check for direct assessment methods
    const hasDirect = Object.entries(inputs).some(([id, value]) => 
      id.includes('direct') && value === 'on'
    );
    
    if (!hasDirect) {
      feedbackItems.push({
        type: 'error',
        title: 'Missing Direct Assessment',
        description: 'Your plan does not include direct assessment methods, which are essential for measuring student learning.',
        suggestion: 'Include at least one direct assessment method (e.g., course-embedded assessments, capstone projects, portfolios) for each outcome.'
      });
    }
    
    // Check for method variety
    const methodCount = Object.entries(inputs).filter(([id, value]) => 
      (id.includes('direct') || id.includes('indirect')) && value === 'on'
    ).length;
    
    if (methodCount < 2) {
      feedbackItems.push({
        type: 'warning',
        title: 'Limited Assessment Methods',
        description: 'Using only one assessment method provides limited evidence of student learning.',
        suggestion: 'Incorporate multiple assessment methods to triangulate findings and provide a more complete picture of student achievement.'
      });
    }
    
    // Check assessment details
    if (assessmentDetails.length === 0) {
      feedbackItems.push({
        type: 'warning',
        title: 'Missing Assessment Details',
        description: 'Your plan lacks specific details about how assessments will be implemented.',
        suggestion: 'For each assessment method, describe the specific tools, criteria, and processes that will be used.'
      });
    } else {
      // Check for rubric mentions
      const mentionsRubric = assessmentDetails.some(detail => 
        detail.toLowerCase().includes('rubric')
      );
      
      if (!mentionsRubric) {
        feedbackItems.push({
          type: 'suggestion',
          title: 'Consider Using Rubrics',
          description: 'Rubrics provide clear criteria for evaluating student work and increase assessment reliability.',
          suggestion: 'Develop rubrics for key assignments or projects that align with your learning outcomes.'
        });
      }
    }
    
    // Determine overall quality
    let overallQuality = 'neutral';
    
    if (hasDirect && methodCount >= 3 && assessmentDetails.length > 0) {
      overallQuality = 'excellent';
    } else if (hasDirect && methodCount >= 2) {
      overallQuality = 'good';
    } else if (hasDirect || methodCount >= 2) {
      overallQuality = 'fair';
    } else {
      overallQuality = 'poor';
    }
    
    return { overallQuality, feedbackItems };
  }
}

// Analyzer for data collection
class DataCollectionAnalyzer {
  constructor(knowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }
  
  analyzeSingleInput(inputId, value) {
    if (!value) return { quality: 'neutral', suggestions: [] };
    
    const suggestions = [];
    let quality = 'good';
    
    // Check data collection point specificity
    if (inputId.includes('point') && value.length < 10) {
      suggestions.push('Specify exactly when data will be collected (e.g., "Final exam week, Fall semester" rather than just "End of course").');
      quality = 'fair';
    }
    
    // Check responsible party designation
    if (inputId.includes('responsible') && !value.includes(' ')) {
      suggestions.push('Include both name and role for the responsible party (e.g., "Dr. Smith, Program Coordinator" rather than just "Smith").');
      quality = 'fair';
    }
    
    return { quality, suggestions };
  }
  
  analyzeAll(inputs) {
    const feedbackItems = [];
    
    // Check for data management plan
    const hasDataManagement = inputs['data-management'] && inputs['data-management'].length > 50;
    
    if (!hasDataManagement) {
      feedbackItems.push({
        type: 'warning',
        title: 'Incomplete Data Management Plan',
        description: 'Your plan lacks sufficient detail about how assessment data will be managed.',
        suggestion: 'Develop a comprehensive data management plan addressing storage, access, anonymization, and retention.'
      });
    }
    
    // Check for data quality strategies
    const hasQualityStrategies = inputs['quality-strategies'] && inputs['quality-strategies'].length > 50;
    
    if (!hasQualityStrategies) {
      feedbackItems.push({
        type: 'suggestion',
        title: 'Data Quality Assurance',
        description: 'Ensuring data quality is essential for meaningful assessment.',
        suggestion: 'Include specific strategies for ensuring validity and reliability, such as calibration sessions, pilot testing, and clear documentation.'
      });
    }
    
    // Check for analysis plan
    const hasAnalysisPlan = inputs['analysis-plan'] && inputs['analysis-plan'].length > 50;
    
    if (!hasAnalysisPlan) {
      feedbackItems.push({
        type: 'warning',
        title: 'Incomplete Analysis Plan',
        description: 'Your plan lacks sufficient detail about how assessment data will be analyzed.',
        suggestion: 'Specify the quantitative and/or qualitative analysis approaches you will use for each type of assessment data.'
      });
    }
    
    // Check for interpretation guidelines
    const hasInterpretationGuidelines = inputs['interpretation-guidelines'] && inputs['interpretation-guidelines'].length > 50;
    
    if (!hasInterpretationGuidelines) {
      feedbackItems.push({
        type: 'suggestion',
        title: 'Interpretation Framework',
        description: 'A structured approach to interpreting results leads to more meaningful insights.',
        suggestion: 'Develop guidelines for interpreting assessment results, including who will be involved and what framework you will use.'
      });
    }
    
    // Determine overall quality
    let overallQuality = 'neutral';
    
    if (hasDataManagement && hasQualityStrategies && hasAnalysisPlan && hasInterpretationGuidelines) {
      overallQuality = 'excellent';
    } else if ((hasDataManagement || hasQualityStrategies) && (hasAnalysisPlan || hasInterpretationGuidelines)) {
      overallQuality = 'good';
    } else if (hasDataManagement || hasQualityStrategies || hasAnalysisPlan || hasInterpretationGuidelines) {
      overallQuality = 'fair';
    } else {
      overallQuality = 'poor';
    }
    
    return { overallQuality, feedbackItems };
  }
}

// Analyzer for action planning
class ActionPlanningAnalyzer {
  constructor(knowledgeBase) {
    this.knowledgeBase = knowledgeBase;
  }
  
  analyzeSingleInput(inputId, value) {
    if (!value) return { quality: 'neutral', suggestions: [] };
    
    const suggestions = [];
    let quality = 'good';
    
    // Check desired outcome specificity
    if (inputId.includes('desired-outcome') && value.length < 30) {
      suggestions.push('Provide a more specific description of what success will look like. Include measurable indicators when possible.');
      quality = 'fair';
    }
    
    // Check evaluation plan completeness
    if (inputId.includes('evaluation-plan') && value.length < 50) {
      suggestions.push('Expand your evaluation plan to include specific evidence you will collect and criteria for determining success.');
      quality = 'fair';
    }
    
    return { quality, suggestions };
  }
  
  analyzeAll(inputs) {
    const feedbackItems = [];
    
    // Check for assessment findings summary
    const hasFindings = Object.entries(inputs).some(([id, value]) => 
      id.includes('findings') && value && value.length > 20
    );
    
    if (!hasFindings) {
      feedbackItems.push({
        type: 'warning',
        title: 'Missing Assessment Findings',
        description: 'Action plans should be based on specific assessment findings.',
        suggestion: 'Summarize the key assessment results that prompted your action plan.'
      });
    }
    
    // Check for improvement areas
    const hasImprovementAreas = Object.entries(inputs).some(([id, value]) => 
      id.includes('improvement-area') && value && value.length > 10
    );
    
    if (!hasImprovementAreas) {
      feedbackItems.push({
        type: 'warning',
        title: 'Undefined Improvement Areas',
        description: 'Your plan does not clearly identify specific areas for improvement.',
        suggestion: 'Clearly articulate the specific aspects of student learning that need improvement.'
      });
    }
    
    // Check for action steps
    const hasActionSteps = Object.entries(inputs).some(([id, value]) => 
      id.includes('step-description') && value && value.length > 10
    );
    
    if (!hasActionSteps) {
      feedbackItems.push({
        type: 'error',
        title: 'Missing Action Steps',
        description: 'Your plan lacks specific actions to address the identified issues.',
        suggestion: 'Define concrete, actionable steps with assigned responsibilities and timelines.'
      });
    }
    
    // Check for evaluation plan
    const hasEvaluationPlan = Object.entries(inputs).some(([id, value]) => 
      id.includes('evaluation-plan') && value && value.length > 30
    );
    
    if (!hasEvaluationPlan) {
      feedbackItems.push({
        type: 'warning',
        title: 'Missing Evaluation Plan',
        description: 'Your plan does not specify how you will determine if the actions were successful.',
        suggestion: 'Include a clear plan for evaluating the effectiveness of your improvement efforts.'
      });
    }
    
    // Check for implementation strategy
    const hasImplementationStrategy = inputs['implementation-strategy'] && inputs['implementation-strategy'].length > 50;
    
    if (!hasImplementationStrategy) {
      feedbackItems.push({
        type: 'suggestion',
        title: 'Implementation Strategy',
        description: 'A thoughtful implementation strategy increases the likelihood of success.',
        suggestion: 'Develop a strategy for implementing your action plan, including how you will address potential challenges.'
      });
    }
    
    // Determine overall quality
    let overallQuality = 'neutral';
    
    if (hasFindings && hasImprovementAreas && hasActionSteps && hasEvaluationPlan && hasImplementationStrategy) {
      overallQuality = 'excellent';
    } else if (hasImprovementAreas && hasActionSteps && (hasEvaluationPlan || hasImplementationStrategy)) {
      overallQuality = 'good';
    } else if (hasImprovementAreas && hasActionSteps) {
      overallQuality = 'fair';
    } else {
      overallQuality = 'poor';
    }
    
    return { overallQuality, feedbackItems };
  }
}

// Initialize the AI when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const assessmentAI = new AssessmentAI();
  
  // Add to window for debugging
  window.assessmentAI = assessmentAI;
  
  // Add AI assistant button to the header
  const header = document.querySelector('header') || document.body;
  const aiButton = document.createElement('button');
  aiButton.id = 'ai-assistant-btn';
  aiButton.innerHTML = '<i class="ai-icon"></i> AI Assistant';
  aiButton.addEventListener('click', () => {
    // Create and show AI assistant modal
    const modal = document.createElement('div');
    modal.className = 'ai-assistant-modal';
    modal.innerHTML = `
      <div class="ai-assistant-content">
        <span class="ai-modal-close">&times;</span>
        <h3>Assessment AI Assistant</h3>
        <p>How can I help you with your assessment plan?</p>
        <div class="ai-assistant-options">
          <button class="ai-option-btn" data-option="analyze">Analyze my current plan</button>
          <button class="ai-option-btn" data-option="suggest">Suggest improvements</button>
          <button class="ai-option-btn" data-option="examples">Show examples</button>
          <button class="ai-option-btn" data-option="help">Assessment guidance</button>
        </div>
        <div class="ai-assistant-response"></div>
      </div>
    `;
    
    // Add event listeners
    modal.querySelector('.ai-modal-close').addEventListener('click', () => modal.remove());
    
    modal.querySelectorAll('.ai-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const option = e.target.dataset.option;
        const responseDiv = modal.querySelector('.ai-assistant-response');
        
        // Clear previous response
        responseDiv.innerHTML = '';
        
        // Generate response based on option
        switch(option) {
          case 'analyze':
            responseDiv.innerHTML = `
              <h4>Plan Analysis</h4>
              <p>I'll analyze your current assessment plan for strengths and areas for improvement.</p>
              <p>Click the "Get AI Feedback" button in any section to receive specific analysis and suggestions.</p>
            `;
            break;
          case 'suggest':
            responseDiv.innerHTML = `
              <h4>Improvement Suggestions</h4>
              <p>Based on assessment best practices, here are some general suggestions:</p>
              <ul>
                <li>Ensure all learning outcomes are specific and measurable</li>
                <li>Use a variety of assessment methods for each outcome</li>
                <li>Include both direct and indirect assessment measures</li>
                <li>Develop clear criteria for evaluating student work</li>
                <li>Create a manageable assessment schedule</li>
              </ul>
              <p>For more specific suggestions, complete each section and use the "Get AI Feedback" button.</p>
            `;
            break;
          case 'examples':
            responseDiv.innerHTML = `
              <h4>Assessment Examples</h4>
              <p>Here are examples from different disciplines:</p>
              <div class="ai-examples-tabs">
                <button class="ai-tab-btn active" data-tab="outcomes">Learning Outcomes</button>
                <button class="ai-tab-btn" data-tab="methods">Assessment Methods</button>
                <button class="ai-tab-btn" data-tab="rubrics">Rubrics</button>
              </div>
              <div class="ai-tab-content active" id="outcomes-tab">
                <p><strong>Biology:</strong> "Students will be able to design and conduct experiments using appropriate controls and statistical analyses."</p>
                <p><strong>Business:</strong> "Students will be able to analyze ethical dilemmas using multiple ethical frameworks and recommend appropriate courses of action."</p>
                <p><strong>Education:</strong> "Students will be able to develop lesson plans that differentiate instruction for diverse learners."</p>
              </div>
              <div class="ai-tab-content" id="methods-tab">
                <p><strong>Direct Methods:</strong> Capstone projects, portfolios, embedded exam questions, research papers</p>
                <p><strong>Indirect Methods:</strong> Surveys, exit interviews, focus groups, employer feedback</p>
              </div>
              <div class="ai-tab-content" id="rubrics-tab">
                <p>Effective rubrics include specific criteria and clear performance level descriptions.</p>
                <p>Example criteria for a research paper: Problem formulation, Literature review, Methodology, Analysis, Conclusions, Writing quality</p>
              </div>
            `;
            
            // Add tab functionality
            const tabBtns = responseDiv.querySelectorAll('.ai-tab-btn');
            const tabContents = responseDiv.querySelectorAll('.ai-tab-content');
            
            tabBtns.forEach(btn => {
              btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                const tabId = btn.dataset.tab + '-tab';
                document.getElementById(tabId).classList.add('active');
              });
            });
            break;
          case 'help':
            responseDiv.innerHTML = `
              <h4>Assessment Guidance</h4>
              <p>Assessment is the systematic process of collecting and analyzing information to improve student learning.</p>
              <p>Key principles of effective assessment:</p>
              <ul>
                <li><strong>Alignment:</strong> Assessment should align with learning outcomes and instructional activities</li>
                <li><strong>Multiple Measures:</strong> Use various methods to get a complete picture of student learning</li>
                <li><strong>Sustainability:</strong> Design assessment processes that are manageable and meaningful</li>
                <li><strong>Closing the Loop:</strong> Use assessment results to improve teaching and learning</li>
              </ul>
              <p>For more guidance, explore the resources in each module or ask specific questions.</p>
            `;
            break;
        }
      });
    });
    
    document.body.appendChild(modal);
  });
  
  header.appendChild(aiButton);
});

// Add CSS for AI feedback elements
const aiStyles = document.createElement('style');
aiStyles.textContent = `
/* AI Feedback Styling */
.ai-feedback-btn {
  background-color: #4a6fa5;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.ai-feedback-btn:hover {
  background-color: #3a5a8c;
}

.ai-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
}

.ai-icon:before {
  content: "AI";
  font-size: 10px;
  font-weight: bold;
  color: #4a6fa5;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ai-feedback-panel {
  margin-top: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.ai-feedback-panel.excellent {
  border-left: 5px solid #4CAF50;
}

.ai-feedback-panel.good {
  border-left: 5px solid #2196F3;
}

.ai-feedback-panel.fair {
  border-left: 5px solid #FF9800;
}

.ai-feedback-panel.poor {
  border-left: 5px solid #F44336;
}

.ai-feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.ai-feedback-header h4 {
  margin: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.ai-feedback-header h4:before {
  content: "";
  display: inline-block;
  width: 18px;
  height: 18px;
  background-color: #4a6fa5;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
}

.ai-feedback-header h4:after {
  content: "AI";
  font-size: 10px;
  font-weight: bold;
  color: white;
  position: absolute;
  margin-left: 5px;
}

.ai-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.ai-overall-assessment {
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.ai-quality-label {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 3px;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

.excellent .ai-quality-label {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.good .ai-quality-label {
  background-color: #E3F2FD;
  color: #1565C0;
}

.fair .ai-quality-label {
  background-color: #FFF3E0;
  color: #EF6C00;
}

.poor .ai-quality-label {
  background-color: #FFEBEE;
  color: #C62828;
}

.ai-feedback-items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ai-feedback-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.ai-feedback-item:last-child {
  border-bottom: none;
}

.ai-feedback-item.error {
  background-color: #FFEBEE;
}

.ai-feedback-item.warning {
  background-color: #FFF8E1;
}

.ai-feedback-item.suggestion {
  background-color: #E8F5E9;
}

.ai-feedback-item.info {
  background-color: #E3F2FD;
}

.ai-feedback-item strong {
  display: block;
  margin-bottom: 5px;
}

.ai-suggestion {
  margin-top: 10px;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.ai-inline-feedback {
  display: flex;
  align-items: flex-start;
  margin-top: 5px;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
}

.ai-inline-feedback.good {
  background-color: #E8F5E9;
}

.ai-inline-feedback.fair {
  background-color: #FFF3E0;
}

.ai-inline-feedback.poor {
  background-color: #FFEBEE;
}

.ai-feedback-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  margin-right: 8px;
  flex-shrink: 0;
}

.good .ai-feedback-icon {
  background-color: #4CAF50;
  color: white;
}

.fair .ai-feedback-icon {
  background-color: #FF9800;
  color: white;
}

.poor .ai-feedback-icon {
  background-color: #F44336;
  color: white;
}

.ai-feedback-text {
  flex-grow: 1;
}

.ai-more-btn {
  background: none;
  border: none;
  color: #4a6fa5;
  padding: 0;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 5px;
}

.ai-suggestions-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.ai-modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 6px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.ai-modal-close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

/* AI Assistant Styling */
#ai-assistant-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 100;
  display: flex;
  align-items: center;
}

#ai-assistant-btn:hover {
  background-color: #3a5a8c;
}

.ai-assistant-modal {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 350px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  z-index: 1000;
  overflow: hidden;
}

.ai-assistant-content {
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
}

.ai-assistant-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 15px 0;
}

.ai-option-btn {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
}

.ai-option-btn:hover {
  background-color: #e0e0e0;
}

.ai-assistant-response {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.ai-examples-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.ai-tab-btn {
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  opacity: 0.7;
}

.ai-tab-btn.active {
  opacity: 1;
  border-bottom: 2px solid #4a6fa5;
}

.ai-tab-content {
  display: none;
}

.ai-tab-content.active {
  display: block;
}
`;

document.head.appendChild(aiStyles);
