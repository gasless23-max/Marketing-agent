import { Server as SocketIOServer } from 'socket.io';
import { LearningEngine } from './learningEngine';
import { nanoid } from 'nanoid';

export interface AutonomousTask {
  id: string;
  name: string;
  type: 'campaign_launch' | 'content_generation' | 'optimization' | 'monitoring' | 'analysis';
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  config: Record<string, any>;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  result?: any;
  error?: string;
  progress: number;
}

export interface TaskSchedule {
  id: string;
  taskId: string;
  frequency: 'once' | 'hourly' | 'daily' | 'weekly';
  nextRun: number;
  lastRun?: number;
  active: boolean;
}

export class AutonomousTaskExecutor {
  private tasks: Map<string, AutonomousTask> = new Map();
  private schedules: Map<string, TaskSchedule> = new Map();
  private io: SocketIOServer;
  private learningEngine: LearningEngine;
  private executionQueue: string[] = [];
  private maxConcurrentTasks = 5;
  private runningTasks = 0;

  constructor(io: SocketIOServer, learningEngine: LearningEngine) {
    this.io = io;
    this.learningEngine = learningEngine;
    this.startTaskProcessor();
    this.startScheduleProcessor();
  }

  // Create a new autonomous task
  createTask(
    name: string,
    type: AutonomousTask['type'],
    config: Record<string, any>,
    priority: AutonomousTask['priority'] = 'medium'
  ): AutonomousTask {
    const task: AutonomousTask = {
      id: nanoid(),
      name,
      type,
      status: 'pending',
      priority,
      config,
      createdAt: Date.now(),
      progress: 0,
    };

    this.tasks.set(task.id, task);
    this.executionQueue.push(task.id);

    // Sort queue by priority
    this.sortExecutionQueue();

    console.log(`[TaskExecutor] Created task: ${name} (${task.id})`);
    this.io.to('tasks').emit('task:created', task);

    return task;
  }

  // Schedule a task for recurring execution
  scheduleTask(
    taskId: string,
    frequency: TaskSchedule['frequency'],
    active: boolean = true
  ): TaskSchedule {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    const schedule: TaskSchedule = {
      id: nanoid(),
      taskId,
      frequency,
      nextRun: this.calculateNextRun(frequency),
      active,
    };

    this.schedules.set(schedule.id, schedule);
    console.log(`[TaskExecutor] Scheduled task ${taskId} with frequency: ${frequency}`);

    return schedule;
  }

  // Execute a task
  private async executeTask(task: AutonomousTask): Promise<void> {
    try {
      task.status = 'running';
      task.startedAt = Date.now();
      task.progress = 0;

      this.io.to('tasks').emit('task:started', task);

      switch (task.type) {
        case 'campaign_launch':
          await this.executeCampaignLaunch(task);
          break;
        case 'content_generation':
          await this.executeContentGeneration(task);
          break;
        case 'optimization':
          await this.executeOptimization(task);
          break;
        case 'monitoring':
          await this.executeMonitoring(task);
          break;
        case 'analysis':
          await this.executeAnalysis(task);
          break;
      }

      task.status = 'completed';
      task.completedAt = Date.now();
      task.progress = 100;

      console.log(`[TaskExecutor] Completed task: ${task.name}`);
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      task.completedAt = Date.now();

      console.error(`[TaskExecutor] Failed task ${task.name}:`, error);
    }

    this.tasks.set(task.id, task);
    this.io.to('tasks').emit('task:completed', task);
  }

  // Campaign launch execution
  private async executeCampaignLaunch(task: AutonomousTask): Promise<void> {
    const { platforms, targetAudience, budget, content } = task.config;

    task.progress = 20;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 20 });

    // Validate campaign configuration
    console.log(`[TaskExecutor] Validating campaign: ${task.name}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    task.progress = 40;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 40 });

    // Generate insights using learning engine
    const insights = await this.learningEngine.generateInsights({
      platforms,
      targetAudience,
      budget,
    });

    task.progress = 60;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 60 });

    // Predict engagement
    const engagementScore = await this.learningEngine.predictEngagement({
      platforms,
      content,
      targetAudience,
    });

    task.progress = 80;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 80 });

    // Simulate campaign launch
    console.log(`[TaskExecutor] Launching campaign on platforms: ${platforms.join(', ')}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    task.result = {
      campaignId: nanoid(),
      platforms,
      status: 'launched',
      engagementScore,
      insights,
      launchedAt: Date.now(),
    };
  }

  // Content generation execution
  private async executeContentGeneration(task: AutonomousTask): Promise<void> {
    const { contentType, topic, style, quantity } = task.config;

    task.progress = 30;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 30 });

    console.log(`[TaskExecutor] Generating ${quantity} ${contentType} pieces about ${topic}`);

    // Simulate content generation
    const content = [];
    for (let i = 0; i < quantity; i++) {
      task.progress = 30 + (i / quantity) * 70;
      this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: task.progress });

      content.push({
        id: nanoid(),
        type: contentType,
        topic,
        style,
        generatedAt: Date.now(),
      });

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    task.result = {
      contentCount: quantity,
      content,
      generatedAt: Date.now(),
    };
  }

  // Optimization execution
  private async executeOptimization(task: AutonomousTask): Promise<void> {
    const { campaignId, metric, target } = task.config;

    task.progress = 25;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 25 });

    console.log(`[TaskExecutor] Optimizing ${metric} for campaign ${campaignId}`);

    // Use learning engine to optimize
    const optimizations = await this.learningEngine.optimizeConversion({
      campaignId,
      metric,
      target,
    });

    task.progress = 75;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 75 });

    task.result = {
      campaignId,
      metric,
      optimizations,
      estimatedImprovement: '12-15%',
      appliedAt: Date.now(),
    };
  }

  // Monitoring execution
  private async executeMonitoring(task: AutonomousTask): Promise<void> {
    const { campaignIds, metrics, alertThresholds } = task.config;

    task.progress = 50;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 50 });

    console.log(`[TaskExecutor] Monitoring ${campaignIds.length} campaigns`);

    // Detect anomalies
    const anomalies = await this.learningEngine.detectAnomalies({
      campaigns: campaignIds,
      metrics,
    });

    task.progress = 100;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 100 });

    task.result = {
      campaignIds,
      metricsMonitored: metrics,
      anomaliesDetected: anomalies.length,
      anomalies,
      monitoredAt: Date.now(),
    };
  }

  // Analysis execution
  private async executeAnalysis(task: AutonomousTask): Promise<void> {
    const { dataSource, analysisType } = task.config;

    task.progress = 40;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 40 });

    console.log(`[TaskExecutor] Running ${analysisType} analysis on ${dataSource}`);

    // Detect trends
    const trends = await this.learningEngine.detectTrends([
      { metric: 'engagement', value: 8.7 },
      { metric: 'reach', value: 12300000 },
      { metric: 'conversion', value: 4.2 },
    ]);

    task.progress = 80;
    this.io.to('tasks').emit('task:progress', { taskId: task.id, progress: 80 });

    task.result = {
      dataSource,
      analysisType,
      trendsDetected: trends,
      analysisDate: Date.now(),
    };
  }

  // Task processor - executes tasks from queue
  private startTaskProcessor(): void {
    setInterval(() => {
      if (this.runningTasks < this.maxConcurrentTasks && this.executionQueue.length > 0) {
        const taskId = this.executionQueue.shift();
        if (taskId) {
          const task = this.tasks.get(taskId);
          if (task && task.status === 'pending') {
            this.runningTasks++;
            this.executeTask(task).finally(() => {
              this.runningTasks--;
            });
          }
        }
      }
    }, 1000);
  }

  // Schedule processor - checks and executes scheduled tasks
  private startScheduleProcessor(): void {
    setInterval(() => {
      const now = Date.now();
      this.schedules.forEach((schedule) => {
        if (schedule.active && schedule.nextRun <= now) {
          const originalTask = this.tasks.get(schedule.taskId);
          if (originalTask) {
            // Create a new task instance from the scheduled task
            const newTask = this.createTask(
              originalTask.name,
              originalTask.type,
              originalTask.config,
              originalTask.priority
            );

            schedule.lastRun = now;
            schedule.nextRun = this.calculateNextRun(schedule.frequency);
          }
        }
      });
    }, 60000); // Check every minute
  }

  // Calculate next run time
  private calculateNextRun(frequency: TaskSchedule['frequency']): number {
    const now = Date.now();
    switch (frequency) {
      case 'once':
        return now + 86400000; // 24 hours
      case 'hourly':
        return now + 3600000; // 1 hour
      case 'daily':
        return now + 86400000; // 24 hours
      case 'weekly':
        return now + 604800000; // 7 days
      default:
        return now + 86400000;
    }
  }

  // Sort execution queue by priority
  private sortExecutionQueue(): void {
    this.executionQueue.sort((a, b) => {
      const taskA = this.tasks.get(a);
      const taskB = this.tasks.get(b);
      if (!taskA || !taskB) return 0;

      const priorityMap = { critical: 4, high: 3, medium: 2, low: 1 };
      return (priorityMap[taskB.priority] || 0) - (priorityMap[taskA.priority] || 0);
    });
  }

  // Get task by ID
  getTask(id: string): AutonomousTask | undefined {
    return this.tasks.get(id);
  }

  // List all tasks
  listTasks(status?: AutonomousTask['status']): AutonomousTask[] {
    const tasks = Array.from(this.tasks.values());
    if (status) {
      return tasks.filter((t) => t.status === status);
    }
    return tasks;
  }

  // Get task statistics
  getTaskStats(): Record<string, number> {
    const tasks = Array.from(this.tasks.values());
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      running: tasks.filter((t) => t.status === 'running').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      failed: tasks.filter((t) => t.status === 'failed').length,
    };
  }
}

// Initialize autonomous task executor
export function initializeAutonomousTaskExecutor(
  io: SocketIOServer,
  learningEngine: LearningEngine
): AutonomousTaskExecutor {
  const executor = new AutonomousTaskExecutor(io, learningEngine);

  // Subscribe to task events via WebSocket
  io.on('connection', (socket) => {
    socket.on('subscribe:tasks', () => {
      socket.join('tasks');
      socket.emit('tasks:list', executor.listTasks());
      socket.emit('tasks:stats', executor.getTaskStats());
    });

    socket.on('task:create', (data) => {
      const task = executor.createTask(data.name, data.type, data.config, data.priority);
      socket.emit('task:created', task);
    });

    socket.on('task:get', (taskId) => {
      const task = executor.getTask(taskId);
      socket.emit('task:data', task);
    });
  });

  return executor;
}
