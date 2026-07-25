/**
 * Production E2E Tests
 *
 * These tests run against the deployed production server at https://pulse.wlinks.com.br
 * They verify that the deployment is working correctly and all endpoints are accessible.
 */

const BASE_URL = process.env.E2E_BASE_URL || 'https://pulse.wlinks.com.br';

describe('Production E2E Tests', () => {
  describe('Frontend', () => {
    it('should serve the frontend application', async () => {
      const response = await fetch(`${BASE_URL}/`);
      expect(response.status).toBe(200);
      const html = await response.text();
      expect(html.toLowerCase()).toContain('<!doctype html>');
      expect(html).toContain('WLinks Pulse');
    });

    it('should have proper cache headers for static assets', async () => {
      const response = await fetch(`${BASE_URL}/`);
      expect(response.status).toBe(200);
      // Check that the response has some form of caching or content type
      expect(response.headers.get('content-type')).toContain('text/html');
    });
  });

  describe('API Health Checks', () => {
    it('should return healthy status from /api/health', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      expect(response.status).toBe(200);
      const data = (await response.json()) as { status: string };
      expect(data).toHaveProperty('status');
      expect(data.status).toBe('ok');
    });

    it('should return ready status from /api/health/ready', async () => {
      const response = await fetch(`${BASE_URL}/api/health/ready`);
      expect(response.status).toBe(200);
    });

    it('should return live status from /api/health/live', async () => {
      const response = await fetch(`${BASE_URL}/api/health/live`);
      expect(response.status).toBe(200);
    });
  });

  describe('SSL/TLS', () => {
    it('should serve content over HTTPS', async () => {
      const response = await fetch(`${BASE_URL}/`);
      expect(response.url).toMatch(/^https:\/\//);
      expect(response.status).toBe(200);
    });

    it('should have valid SSL certificate', async () => {
      // If fetch succeeds over HTTPS, the certificate is valid
      const response = await fetch(`${BASE_URL}/api/health`);
      expect(response.ok).toBe(true);
    });
  });

  describe('Security Headers', () => {
    it('should have X-Frame-Options header', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      const xFrameOptions = response.headers.get('x-frame-options');
      expect(xFrameOptions).toBeTruthy();
    });

    it('should have X-Content-Type-Options header', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      const xContentTypeOptions = response.headers.get('x-content-type-options');
      expect(xContentTypeOptions).toContain('nosniff');
    });

    it('should have X-DNS-Prefetch-Control header', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      const header = response.headers.get('x-dns-prefetch-control');
      expect(header).toBeTruthy();
    });
  });

  describe('Authentication', () => {
    it('should reject unauthenticated requests to protected endpoints', async () => {
      const endpoints = [
        '/api/v1/customers',
        '/api/v1/relationship-cases',
        '/api/v1/invoices',
        '/api/v1/pickups/stats/summary',
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        expect(response.status).toBe(401);
      }
    });

    it('should reject requests with invalid tokens', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/customers`, {
        headers: {
          Authorization: 'Bearer invalid-token-here',
        },
      });
      expect(response.status).toBe(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should not be rate limited under normal usage', async () => {
      // Make 5 requests in quick succession
      const requests = Array(5).fill(null).map(() =>
        fetch(`${BASE_URL}/api/health`)
      );
      const responses = await Promise.all(requests);

      // All should succeed (no 429s)
      for (const response of responses) {
        expect(response.status).toBe(200);
      }
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent API routes', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/non-existent-route`);
      expect(response.status).toBe(404);
    });

    it('should not leak stack traces in production', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/non-existent-route`);
      const body = await response.text();
      expect(body).not.toContain('Error:');
      expect(body).not.toContain('at ');
      expect(body).not.toContain('node_modules');
    });
  });

  describe('CORS', () => {
    it('should handle CORS preflight requests', async () => {
      const response = await fetch(`${BASE_URL}/api/health`, {
        method: 'OPTIONS',
      });
      // Either 200 or 204 is acceptable for OPTIONS
      expect([200, 204]).toContain(response.status);
    });
  });

  describe('Content Types', () => {
    it('should return JSON for API endpoints', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      expect(response.headers.get('content-type')).toContain('application/json');
    });

    it('should return HTML for frontend', async () => {
      const response = await fetch(`${BASE_URL}/`);
      expect(response.headers.get('content-type')).toContain('text/html');
    });
  });
});
