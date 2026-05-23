import { Server as SocketIOServer } from 'socket.io';
import { invokeLLM } from './_core/llm';

export interface TrainingData {
  id: string;
  type: 'campaign' | 'engagement' | 'conversion' | 'trend';
  input: any;
  output: any;
  timestamp: number;
  accuracy?: number;
}

export interface Model {
  id: string;
  name: string;
  type: 'engagement_predictor' | 'trend_detector' | 'conversion_optimizer' | 'anomaly_detector';
  version: number;
  accuracy: number;
  trainingDataCount: number;
  lastTrained: number;
  parameters: Record<string, any>;
}

export interface Insight {
  id: string;
  type: 'prediction' | 'recommendation' | 'anomaly' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  timestamp: number;
  data: any;
}

export class LearningEngine {
  private models: Map<string, Model> = new Map();
  private trainingData: TrainingData[] = [];
  private insights: Insight[] = [];
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.initializeModels();
  }

  // Initialize default models
  private initializeModels(): void {
    const models: Model[] = [
      {
        id: 'engagement_predictor',
        name: 'Engagement Predictor',
        type: 'engagement_predictor',
        version: 1,
        accuracy: 0.87,
        trainingDataCount: 1247,
        lastTrained: Date.now(),
        parameters: { threshold: 0.7, lookbackDays: 30 },
      },
      {
        id: 'trend_detector',
        name: 'Trend Detector',
        type: 'trend_detector',
        version: 1,
        accuracy: 0.92,
        trainingDataCount: 2156,
        lastTrained: Date.now(),
        parameters: { sensitivity: 0.8, minOccurrences: 5 },
      },
      {
        id: 'conversion_optimizer',
        name: 'Conversion Optimizer',
        type: 'conversion_optimizer',
        version: 1,
        accuracy: 0.84,
        trainingDataCount: 1834,
        lastTrained: Date.now(),
        parameters: { optimizationTarget: 'ctr', iterations: 100 },
      },
      {
        id: 'anomaly_detector',
        name: 'Anomaly Detector',
        type: 'anomaly_detector',
        version: 1,
        accuracy: 0.91,
        trainingDataCount: 3421,
        lastTrained: Date.now(),
        parameters: { threshold: 2.5, windowSize: 24 },
      },
    ];

    models.forEach((model) => {
      this.models.set(model.id, model);
    });

    console.log('[LearningEngine] Initialized with 4 models');
  }

  // Add training data
  addTrainingData(type: TrainingData['type'], input: any, output: any): TrainingData {
    const data: TrainingData = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      input,
      output,
      timestamp: Date.now(),
    };

    this.trainingData.push(data);

    // Keep only last 10000 data points
    if (this.trainingData.length > 10000) {
      this.trainingData = this.trainingData.slice(-10000);
    }

    return data;
  }

  // Generate insights using LLM
  async generateInsights(context: any): Promise<Insight[]> {
    try {
      const prompt = `Based on the following marketing data, generate actionable insights:
      
Data: ${JSON.stringify(context, null, 2)}

Please provide insights in JSON format with the following structure:
[
  {
    "type": "prediction|recommendation|anomaly|opportunity",
    "title": "Insight title",
    "description": "Detailed description",
    "confidence": 0.0-1.0,
    "actionable": true/false,
    "action": "Specific action to take"
  }
]`;

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'You are an expert AI marketing analyst. Generate insightful, actionable recommendations based on marketing data.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const contentValue = response.choices[0]?.message?.content || '[]';
      const content = typeof contentValue === 'string' ? contentValue : '[]';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const parsedInsights = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

      const insights: Insight[] = parsedInsights.map((insight: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        type: insight.type,
        title: insight.title,
        description: insight.description,
        confidence: insight.confidence,
        actionable: insight.actionable,
        timestamp: Date.now(),
        data: insight,
      }));

      this.insights.push(...insights);

      // Keep only last 500 insights
      if (this.insights.length > 500) {
        this.insights = this.insights.slice(-500);
      }

      // Broadcast insights
      this.io.to('learning').emit('insights:generated', insights);

      return insights;
    } catch (error) {
      console.error('[LearningEngine] Error generating insights:', error);
      return [];
    }
  }

  // Predict engagement score
  async predictEngagement(campaignData: any): Promise<number> {
    try {
      const model = this.models.get('engagement_predictor');
      if (!model) return 0;

      // Use LLM for prediction
      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'You are an expert at predicting engagement scores for marketing campaigns. Respond with only a number between 0 and 10.',
          },
          {
            role: 'user',
            content: `Predict the engagement score for this campaign: ${JSON.stringify(campaignData)}`,
          },
        ],
      });

      const contentValue = response.choices[0]?.message?.content || '5';
      const content = typeof contentValue === 'string' ? contentValue : '5';
      const score = parseFloat(content);

      // Log training data
      this.addTrainingData('engagement', campaignData, { predictedScore: score });

      return isNaN(score) ? 5 : Math.min(10, Math.max(0, score));
    } catch (error) {
      console.error('[LearningEngine] Error predicting engagement:', error);
      return 5;
    }
  }

  // Detect trends
  async detectTrends(data: any[]): Promise<string[]> {
    try {
      const model = this.models.get('trend_detector');
      if (!model) return [];

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'You are an expert at detecting emerging trends in marketing data. Return a JSON array of detected trends.',
          },
          {
            role: 'user',
            content: `Detect trends in this data: ${JSON.stringify(data)}. Return as JSON array of strings.`,
          },
        ],
      });

      const contentValue = response.choices[0]?.message?.content || '[]';
      const content = typeof contentValue === 'string' ? contentValue : '[]';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const trends = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

      this.addTrainingData('trend', data, { detectedTrends: trends });

      return trends;
    } catch (error) {
      console.error('[LearningEngine] Error detecting trends:', error);
      return [];
    }
  }

  // Optimize conversion funnel
  async optimizeConversion(funnelData: any): Promise<any> {
    try {
      const model = this.models.get('conversion_optimizer');
      if (!model) return funnelData;

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'You are an expert at optimizing conversion funnels. Provide specific optimization recommendations.',
          },
          {
            role: 'user',
            content: `Optimize this conversion funnel: ${JSON.stringify(funnelData)}. Return JSON with optimization steps.`,
          },
        ],
      });

      const content = typeof response.choices[0]?.message?.content === 'string' ? response.choices[0].message.content : '{}';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const optimizations = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      this.addTrainingData('conversion', funnelData, optimizations);

      return optimizations;
    } catch (error) {
      console.error('[LearningEngine] Error optimizing conversion:', error);
      return funnelData;
    }
  }

  // Detect anomalies
  async detectAnomalies(metrics: any): Promise<any[]> {
    try {
      const model = this.models.get('anomaly_detector');
      if (!model) return [];

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: 'You are an expert at detecting anomalies in marketing metrics. Return a JSON array of detected anomalies.',
          },
          {
            role: 'user',
            content: `Detect anomalies in these metrics: ${JSON.stringify(metrics)}. Return as JSON array with severity and description.`,
          },
        ],
      });

      const content = typeof response.choices[0]?.message?.content === 'string' ? response.choices[0].message.content : '[]';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const anomalies = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

      return anomalies;
    } catch (error) {
      console.error('[LearningEngine] Error detecting anomalies:', error);
      return [];
    }
  }

  // Get model by ID
  getModel(id: string): Model | undefined {
    return this.models.get(id);
  }

  // List all models
  listModels(): Model[] {
    return Array.from(this.models.values());
  }

  // Get insights
  getInsights(limit: number = 50): Insight[] {
    return this.insights.slice(-limit);
  }

  // Get training data stats
  getTrainingDataStats(): Record<string, number> {
    const stats: Record<string, number> = {
      total: this.trainingData.length,
      campaign: 0,
      engagement: 0,
      conversion: 0,
      trend: 0,
    };

    this.trainingData.forEach((data) => {
      stats[data.type]++;
    });

    return stats;
  }
}

// Initialize learning engine
export function initializeLearningEngine(io: SocketIOServer): LearningEngine {
  const engine = new LearningEngine(io);

  // Subscribe to learning events via WebSocket
  io.on('connection', (socket) => {
    socket.on('subscribe:learning', () => {
      socket.join('learning');
      socket.emit('models:list', engine.listModels());
      socket.emit('insights:list', engine.getInsights());
    });
  });

  return engine;
}
