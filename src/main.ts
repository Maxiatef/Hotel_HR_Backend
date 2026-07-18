import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Security headers with Helmet
  app.use(helmet());

  // API prefix
  app.setGlobalPrefix('api');

  // CORS configuration
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Swagger/OpenAPI setup
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
    .addTag('auth', '🔐 Authentication — login, register, change password')
    .addTag('hotels', '🏨 Hotel management')
    .addTag('users', '👤 User accounts and role management')
    .addTag('departments', '🏢 Department management')
    .addTag('employees', '👷 Employee profiles and records')
    .addTag('employment-assignments', '📋 Employment assignments and hotel transfers')
    .addTag('salary-history', '💰 Employee salary history')
    .addTag('bonus-deductions', '➕➖ Bonuses and deductions')
    .addTag('attendance-records', '📅 Daily attendance tracking')
    .addTag('leave-requests', '🌴 Leave request management')
    .addTag('loans', '🏦 Employee loans')
    .addTag('advances', '💵 Salary advance requests')
    .addTag('payroll-periods', '📆 Payroll period management')
    .addTag('payroll-runs', '⚙️ Payroll run processing and calculation')
    .addTag('payroll-items', '🧾 Payroll calculation line items')
    .addTag('employee-bank-accounts', '🏧 Employee bank accounts')
    .addTag('employee-documents', '📄 Employee documents and file uploads')
    .addTag('geofence-zones', '📍 Geofence zones for attendance clock-in validation')
    .addTag('health', '✅ Server health checks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
    },
    customSiteTitle: 'Hotel HR API Docs',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}
bootstrap();
