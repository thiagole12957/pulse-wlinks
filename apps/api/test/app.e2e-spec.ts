import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/health (GET) should return healthy status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('status');
          expect(res.body.status).toBe('ok');
        });
    });

    it('/health/ready (GET) should return ready status', () => {
      return request(app.getHttpServer())
        .get('/health/ready')
        .expect(200)
        .expect((res: request.Response) => {
          expect(res.body).toHaveProperty('status');
        });
    });

    it('/health/live (GET) should return live status', () => {
      return request(app.getHttpServer())
        .get('/health/live')
        .expect(200);
    });
  });

  describe('API Documentation', () => {
    it('/api-docs (GET) should return OpenAPI documentation', () => {
      return request(app.getHttpServer())
        .get('/api-docs')
        .expect(200);
    });
  });

  describe('Security Headers', () => {
    it('should have security headers set', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res: request.Response) => {
          // Check for helmet security headers
          expect(res.headers).toHaveProperty('x-dns-prefetch-control');
          expect(res.headers).toHaveProperty('x-frame-options');
          expect(res.headers).toHaveProperty('x-content-type-options');
        });
    });
  });

  describe('Protected Routes', () => {
    it('/api/v1/queue (GET) should require authentication', () => {
      return request(app.getHttpServer())
        .get('/api/v1/queue')
        .expect(401);
    });

    it('/api/v1/customers (GET) should require authentication', () => {
      return request(app.getHttpServer())
        .get('/api/v1/customers')
        .expect(401);
    });

    it('/api/v1/cases (GET) should require authentication', () => {
      return request(app.getHttpServer())
        .get('/api/v1/cases')
        .expect(401);
    });
  });

  describe('Invalid Routes', () => {
    it('should return 404 for non-existent routes', () => {
      return request(app.getHttpServer())
        .get('/api/v1/non-existent-route')
        .expect(404);
    });
  });
});
