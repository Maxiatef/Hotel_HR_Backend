import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeDocument } from '../../models/employee-document.entity';
import { EmployeeDocumentController } from './employee-documents.controller';
import { EmployeeDocumentService } from './employee-documents.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeDocument])],
  controllers: [EmployeeDocumentController],
  providers: [EmployeeDocumentService],
  exports: [EmployeeDocumentService],
})
export class EmployeeDocumentModule {}
