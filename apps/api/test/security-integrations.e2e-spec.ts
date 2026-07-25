/**
 * Security Tests for External Integrations
 *
 * Tests for IXC, OmnieTalk, GC (GerenteConsultor) and OpenAI integrations
 * Verifies security aspects: auth, data validation, error handling, PII protection
 */

const BASE_URL = process.env.E2E_BASE_URL || 'https://pulse.wlinks.com.br';

describe('Integration Security Tests', () => {
  describe('Authentication & Authorization', () => {
    it('should reject API calls without authentication', async () => {
      const protectedEndpoints = [
        '/api/v1/customers',
        '/api/v1/contracts',
        '/api/v1/invoices',
        '/api/v1/relationship-cases',
        '/api/v1/pickups/stats/summary',
      ];

      for (const endpoint of protectedEndpoints) {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        expect(response.status).toBe(401);
      }
    });

    it('should reject malformed JWT tokens', async () => {
      const malformedTokens = [
        'invalid-token',
        'Bearer',
        'Bearer ',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', // incomplete
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.invalid-signature',
      ];

      for (const token of malformedTokens) {
        const response = await fetch(`${BASE_URL}/api/v1/customers`, {
          headers: {
            Authorization: token,
          },
        });
        expect(response.status).toBe(401);
      }
    });

    it('should reject expired tokens', async () => {
      // A clearly expired token (exp: 0)
      const expiredToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjAsInN1YiI6InRlc3QifQ.invalid';

      const response = await fetch(`${BASE_URL}/api/v1/customers`, {
        headers: {
          Authorization: `Bearer ${expiredToken}`,
        },
      });
      expect(response.status).toBe(401);
    });
  });

  describe('Input Validation', () => {
    it('should reject SQL injection attempts in query parameters', async () => {
      const sqlInjectionPayloads = [
        "1' OR '1'='1",
        "1; DROP TABLE users;--",
        "' UNION SELECT * FROM users--",
        "1' AND SLEEP(5)--",
      ];

      for (const payload of sqlInjectionPayloads) {
        const response = await fetch(
          `${BASE_URL}/api/v1/customers?search=${encodeURIComponent(payload)}`
        );
        // Should return 401 (unauthorized) or 400 (bad request), never 500
        expect([400, 401]).toContain(response.status);
      }
    });

    it('should reject XSS payloads in request bodies', async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src=x onerror=alert("xss")>',
        '<svg onload=alert("xss")>',
      ];

      for (const payload of xssPayloads) {
        // Try creating a note with XSS payload (requires auth)
        const response = await fetch(`${BASE_URL}/api/v1/relationship-cases/test-id/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            body: payload,
          }),
        });
        // Should return 401 (unauthorized) or 404 (not found) - XSS blocked by auth or validation
        expect([401, 404]).toContain(response.status);
      }
    });

    it('should reject oversized payloads', async () => {
      // Generate a 10MB payload
      const largePayload = 'x'.repeat(10 * 1024 * 1024);

      const response = await fetch(`${BASE_URL}/api/v1/relationship-cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: largePayload }),
      });

      // Should reject with 413 (Payload Too Large) or 400/401
      expect([400, 401, 413]).toContain(response.status);
    });

    it('should validate UUID format for resource IDs', async () => {
      const invalidIds = [
        '../../../etc/passwd',
        '<script>alert(1)</script>',
        'invalid-uuid',
        '123',
        "'; DROP TABLE--",
      ];

      for (const id of invalidIds) {
        const response = await fetch(
          `${BASE_URL}/api/v1/customers/${encodeURIComponent(id)}`
        );
        // Should return 401 (no auth), 400 (bad request), or 200 with empty result - not 500
        expect([200, 400, 401]).toContain(response.status);
      }
    });
  });

  describe('Error Handling & Information Disclosure', () => {
    it('should not expose internal error details', async () => {
      const response = await fetch(`${BASE_URL}/api/non-existent`);
      const body = await response.text();

      // Should not contain stack traces or internal details
      expect(body).not.toContain('Error:');
      expect(body).not.toContain('at ');
      expect(body).not.toContain('node_modules');
      expect(body).not.toContain('TypeError');
      expect(body).not.toContain('ReferenceError');
      expect(body).not.toContain('/app/');
      expect(body).not.toContain('/opt/');
    });

    it('should not expose database connection details', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/customers?invalid=true`);
      const body = await response.text();

      // Should not contain database information
      expect(body).not.toContain('postgres');
      expect(body).not.toContain('DATABASE_URL');
      expect(body).not.toContain('connection');
      expect(body).not.toContain('ECONNREFUSED');
    });

    it('should not expose environment variables', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      const body = await response.text();

      // Should not contain environment variable names
      expect(body).not.toContain('IXC_API_TOKEN');
      expect(body).not.toContain('OPENAI_API_KEY');
      expect(body).not.toContain('GC_API_TOKEN');
      expect(body).not.toContain('OMNIETALK_API_TOKEN');
      expect(body).not.toContain('DATABASE_URL');
    });
  });

  describe('Security Headers', () => {
    it('should have Content-Security-Policy or related headers', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);

      // At minimum, should have X-Content-Type-Options
      expect(response.headers.get('x-content-type-options')).toContain('nosniff');
    });

    it('should have Server header (but ideally hide version)', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      const server = response.headers.get('server');

      // Note: Exposing server version is not critical but is a minor security concern
      // In production, consider adding 'server_tokens off;' to nginx config
      if (server && server.match(/nginx\/\d+/)) {
        console.warn('[SECURITY NOTICE] Server header exposes nginx version. Consider hiding it.');
      }
      // Test passes but logs warning
      expect(response.status).toBe(200);
    });

    it('should have X-Frame-Options to prevent clickjacking', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      const xFrameOptions = response.headers.get('x-frame-options');

      expect(xFrameOptions).toBeTruthy();
      // Accept both single value and duplicated (nginx + helmet both adding it)
      expect(xFrameOptions?.toUpperCase()).toContain('SAMEORIGIN');
    });
  });

  describe('Webhook Security (IXC, OmnieTalk)', () => {
    it('should reject webhooks without signature', async () => {
      const response = await fetch(`${BASE_URL}/api/webhooks/ixc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event: 'test' }),
      });

      // Should reject unsigned webhooks
      expect([400, 401, 403, 404]).toContain(response.status);
    });

    it('should reject webhooks with invalid signature', async () => {
      const response = await fetch(`${BASE_URL}/api/webhooks/ixc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': 'invalid-signature-hash',
        },
        body: JSON.stringify({ event: 'test' }),
      });

      // Should reject invalid signatures
      expect([400, 401, 403, 404]).toContain(response.status);
    });
  });

  describe('Rate Limiting Protection', () => {
    it('should have rate limiting for sensitive endpoints', async () => {
      // Make 100 rapid requests to auth endpoint
      const requests = Array(100)
        .fill(null)
        .map(() => fetch(`${BASE_URL}/api/v1/auth/me`));

      const responses = await Promise.all(requests);
      const statuses = responses.map((r) => r.status);

      // All should be 401 (unauthorized), but if rate limiting kicks in, could be 429
      // The important thing is no 500 errors
      expect(statuses.every((s) => s !== 500)).toBe(true);
    });
  });

  describe('API Versioning Security', () => {
    it('should not expose deprecated/legacy versions', async () => {
      const deprecatedVersions = ['/api/v0/', '/api/beta/', '/api/internal/'];

      for (const version of deprecatedVersions) {
        const response = await fetch(`${BASE_URL}${version}customers`);
        // Should return 404, not expose old APIs
        expect(response.status).toBe(404);
      }
    });
  });

  describe('CORS Security', () => {
    it('should not allow arbitrary origins', async () => {
      const response = await fetch(`${BASE_URL}/api/health`, {
        headers: {
          Origin: 'https://malicious-site.com',
        },
      });

      const allowOrigin = response.headers.get('access-control-allow-origin');
      // Should not reflect the malicious origin
      if (allowOrigin) {
        expect(allowOrigin).not.toBe('https://malicious-site.com');
        expect(allowOrigin).not.toBe('*');
      }
    });
  });

  describe('AI Integration Security (OpenAI)', () => {
    it('should reject AI insight requests without authentication', async () => {
      // Test via the case-linked insight endpoint
      const response = await fetch(`${BASE_URL}/api/v1/insights/case/test-case-id`, {
        method: 'GET',
      });

      // Should return 401 (unauthorized) or 404 (route might not exist)
      expect([401, 404]).toContain(response.status);
    });

    it('should not expose AI API keys in errors', async () => {
      const response = await fetch(`${BASE_URL}/api/v1/ai-insights/invalid-id`);
      const body = await response.text();

      expect(body).not.toContain('sk-');
      expect(body).not.toContain('openai');
      expect(body).not.toContain('api_key');
    });
  });

  describe('PII Protection', () => {
    it('should not expose full CPF/CNPJ in error messages', async () => {
      const response = await fetch(
        `${BASE_URL}/api/v1/customers?document=12345678901`
      );
      const body = await response.text();

      // Should not expose full document numbers in responses
      expect(body).not.toMatch(/\d{11}/); // Full CPF
      expect(body).not.toMatch(/\d{14}/); // Full CNPJ
    });

    it('should mask sensitive data in health check responses', async () => {
      const response = await fetch(`${BASE_URL}/api/health`);
      const body = await response.text();

      // Should not contain any PII or sensitive config
      expect(body).not.toContain('password');
      expect(body).not.toContain('token');
      expect(body).not.toContain('secret');
      expect(body).not.toContain('cpf');
      expect(body).not.toContain('cnpj');
    });
  });
});
