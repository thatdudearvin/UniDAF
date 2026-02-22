import { NotificationType } from '@prisma/client';
import prisma from '../config/database';

export interface NotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
}

export interface Observer {
  update(data: NotificationData): Promise<void>;
}

export class NotificationSubject {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  async notify(data: NotificationData): Promise<void> {
    for (const observer of this.observers) {
      await observer.update(data);
    }
  }
}

export class DatabaseNotificationObserver implements Observer {
  async update(data: NotificationData): Promise<void> {
    await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
      },
    });
  }
}

export class WebSocketNotificationObserver implements Observer {
  private io: any;

  constructor(io: any) {
    this.io = io;
  }

  async update(data: NotificationData): Promise<void> {
    this.io.to(data.userId).emit('notification', {
      type: data.type,
      title: data.title,
      message: data.message,
      timestamp: new Date(),
    });
  }
}

// Singleton notification service
export class NotificationService {
  private static instance: NotificationService;
  private subject: NotificationSubject;

  private constructor() {
    this.subject = new NotificationSubject();
    this.subject.subscribe(new DatabaseNotificationObserver());
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setWebSocketObserver(io: any): void {
    this.subject.subscribe(new WebSocketNotificationObserver(io));
  }

  async sendNotification(data: NotificationData): Promise<void> {
    await this.subject.notify(data);
  }
}