# Hotel HR & Payroll System — NestJS + TypeORM + PostgreSQL

Multi-tenant backend scaffold. One module per entity, each with its own
TypeORM entity, controller, service, and DTOs — 16 modules total.

## Structure

```
src/
  main.ts
  app.module.ts                 <- auto-generated, imports every module + TypeORM config
  config/
    typeorm.config.ts           <- DataSource config, reads DATABASE_URL from .env
  common/
    guards/hotel-scope.guard.ts       <- reads JWT, attaches hotelId to the request
    decorators/current-hotel.decorator.ts  <- @CurrentHotel() param decorator
  models/                        <- one TypeORM @Entity class per table (16 files)
    hotel.entity.ts
    employee.entity.ts
    ...
  modules/
    hotels/
      hotels.module.ts           <- TypeOrmModule.forFeature([Hotel])
      hotels.controller.ts       <- REST endpoints: POST/GET/GET:id/PATCH:id/DELETE:id
      hotels.service.ts          <- @InjectRepository(Hotel) queries
      dto/
        create-hotel.dto.ts
        update-hotel.dto.ts
    users/ departments/ employees/ employment-assignments/ salary-history/
    bonus-deductions/ attendance-records/ leave-requests/ loans/ advances/
    payroll-periods/ payroll-runs/ payroll-items/ employee-bank-accounts/
    employee-documents/          <- same pattern in each
  scripts/generate.js            <- the generator that produced models/ and modules/
                                     (re-run any time you add/rename an entity —
                                     note it will overwrite existing files, so copy
                                     out any hand-edited DTOs like employees/ first)
```

## Setup

```bash
npm install
cp .env.example .env         # set DATABASE_URL to your Postgres instance
npm run start:dev
```

`synchronize: true` is on for development (see `src/config/typeorm.config.ts`), so
tables are created automatically from the entities on first run — no manual
migration needed to get started. Turn `synchronize` off and use
`npm run migration:generate` / `npm run migration:run` before production.

Server starts on `http://localhost:3000`. Every entity is a standard REST resource:

```
GET    /employees
POST   /employees
GET    /employees/:id
PATCH  /employees/:id
DELETE /employees/:id
```

## DTO validation

Every module got a generic passthrough DTO (`field?: any`) so the whole project
compiles and runs immediately. **`src/modules/employees/dto/create-employee.dto.ts`
is the one fully-typed example** — real fields, `class-validator` decorators
(`@IsString`, `@IsOptional`, `@IsIn`, `@IsDateString`, etc.), matching the
`Employee` entity. Apply that same pattern to the other 15 as you lock down
their validation rules.

## Multi-tenancy (important — read before wiring up auth)

Every hotel-owned entity's service/controller accepts a `hotelId` and filters all
reads/writes by it via TypeORM's `where: { hotelId }`. `@CurrentHotel()` reads
`request.hotelId`, set by `HotelScopeGuard` from the JWT payload
(`{ hotelId, role, sub }`).

**The guard is currently commented out** (`// @UseGuards(HotelScopeGuard)`) in every
controller because there's no auth/login module yet — build that next:

1. An `auth` module: HR selects a hotel, logs in, receives a JWT with
   `hotelId`, `role`, and `sub` baked in.
2. Uncomment `@UseGuards(HotelScopeGuard)` on every controller once that's wired up.
3. `superadmin` role can override the hotel scope via an `x-hotel-id` header —
   already supported in the guard.

## Employee transfer between hotels

`Employee.hotelId` always holds the *current* hotel. When an employee transfers:

1. Close the current `EmploymentAssignment` row (`endDate = now`).
2. Create a new `EmploymentAssignment` row with the new `hotelId`.
3. Update `Employee.hotelId` / `departmentId` to the new values.

Because `employeeId` never changes, the new hotel's HR can query
`salary-history`, `payroll-items`, `attendance-records`, etc. by `employeeId` and
see the complete history — including records created while at the old hotel.

## Payroll flow

1. HR opens a `PayrollPeriod` (year/month) for the hotel.
2. Bonuses, deductions, loan installments, and leave entered during that month get
   tagged with `payrollPeriodId`.
3. HR triggers a `PayrollRun` for the period. Your payroll service (to be built)
   should: pull each employee's current `SalaryHistory` row, sum that period's
   `BonusDeduction` rows, compute overtime from `AttendanceRecord`, compute
   loan/advance installments, compute Egypt social insurance + tax, and write one
   `PayrollItem` row per employee.
4. Next month = new `PayrollPeriod`. Nothing is deleted — "this month's total" is
   just a filtered sum, and full year/history stays queryable.

## Next steps not yet scaffolded

- `auth` module (login, JWT issuance, hotel selection)
- Payroll calculation service (overtime rate, Egypt tax brackets, social
  insurance %, loan installment logic)
- Role-based guards beyond hotel scoping
- Fully-typed, validated DTOs on the remaining 15 entities (Employee is done —
  use it as the template)
- Entity relations (`@ManyToOne`/`@OneToMany`) — columns currently store raw FK
  ids (`hotelId`, `employeeId`, etc.) without TypeORM relation decorators, which
  keeps things simple and avoids eager-loading surprises. Add `@ManyToOne`
  relations only where you actually need joined queries.
