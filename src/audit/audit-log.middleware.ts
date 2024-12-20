
import { InjectQueue } from '@nestjs/bull';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Queue } from 'bull';
import * as config from 'config';
import { NextFunction, Request, Response } from 'express';
import { UserEntity } from '../auth/entity/user.entity';

@Injectable()
export class AuditLogMiddleware implements NestMiddleware {
  constructor(
    @InjectQueue(config.get('audit.queueName'))
    private readonly auditQueue: Queue,
  ) { }

  private getEntityType(path: string) {
    if (path.includes("order")) return "Order";
    else if (path.includes("team")) return "Technician-Team";
    else if (path.includes("auth")) return "Auth";
    else return "Unknown";
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'GET') {
      // Capture the start time
      const startTime = Date.now();

      // Log the request data after the response is sent
      res.on('finish', async () => {
        const duration = Date.now() - startTime;

        const userId = (req.user as UserEntity)?.id || 'anonymous'; // Assume you have user info in req.user
        const entityId = req.params.id || 'unknown'; // If the route involves a specific entity
        const entityType = this.getEntityType(req.route.path); // Assume entity type from route
        const eventType = `${req.method} ${req.route.path}`; // Combine method and route
        const notes = `Request processed in ${duration}ms`;

        // Add the job to the audit queue
        await this.auditQueue.add({
          userId,
          entityId,
          entityType,
          eventType,
          notes,
        });
      });
    }

    next();
  }
}
