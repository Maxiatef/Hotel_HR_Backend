import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from '../src/app.module';

let serverPromise: Promise<express.Express> | undefined;

const SWAGGER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Hotel HR API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>
    body { margin: 0; padding: 0; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/api/docs-json',
      dom_id: '#swagger-ui',
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
    });
  </script>
</body>
</html>`;

async function configureApp(app: NestExpressApplication) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "unpkg.com"],
        imgSrc: ["'self'", "data:", "unpkg.com"],
        connectSrc: ["'self'", "unpkg.com"],
      },
    },
  }));
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Hotel HR & Payroll System API')
    .setDescription(
      `## Multi-tenant Hotel HR & Payroll System\n\n` +
        `### Authentication\n` +
        `1. Call **POST /api/auth/login** or **POST /api/auth/register** to get a JWT token.\n` +
        `2. Click the **Authorize** button at the top and enter: \`Bearer <your_token>\`\n` +
        `3. All protected endpoints will use this token automatically.\n\n` +
        `### Multi-tenancy\n` +
        `Every request is scoped to the authenticated user's hotel. ` +
        `\`super_admin\` users can pass an \`x-hotel-id\` header to act on behalf of another hotel.\n\n` +
        `### Roles\n` +
        `\`super_admin\` › \`hotel_admin\` › \`hr_manager\` › \`payroll_officer\` › \`manager\` › \`employee\` / \`auditor\``
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      'JWT',
    )
    .addTag('auth', 'Authentication — login, register')
    .addTag('hotels', 'Hotel management')
    .addTag('users', 'User accounts and role management')
    .addTag('departments', 'Department management')
    .addTag('employees', 'Employee profiles and records')
    .addTag('employment-assignments', 'Employment assignments and hotel transfers')
    .addTag('salary-history', 'Employee salary history')
    .addTag('bonus-deductions', 'Bonuses and deductions')
    .addTag('attendance-records', 'Daily attendance tracking')
    .addTag('leave-requests', 'Leave request management')
    .addTag('loans', 'Employee loans')
    .addTag('advances', 'Salary advance requests')
    .addTag('payroll-periods', 'Payroll period management')
    .addTag('payroll-runs', 'Payroll run processing and calculation')
    .addTag('payroll-items', 'Payroll calculation line items')
    .addTag('employee-bank-accounts', 'Employee bank accounts')
    .addTag('employee-documents', 'Employee documents and file uploads')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/docs', (_req: any, res: any) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(SWAGGER_HTML);
  });
  httpAdapter.get('/docs-json', (_req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(document));
  });
}

async function createServer() {
  const server = express();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(server));

  await configureApp(app);
  await app.init();

  return server;
}

export default async function handler(request: unknown, response: unknown) {
  serverPromise ??= createServer();
  const server = await serverPromise;

  return server(request as never, response as never);
}