import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { EmployeeDocumentService } from './employee-documents.service';
import { CreateEmployeeDocumentDto } from './dto/create-employee-document.dto';
import { UpdateEmployeeDocumentDto } from './dto/update-employee-document.dto';

@ApiTags('employee-documents')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('employee-documents')
export class EmployeeDocumentController {
  constructor(private readonly service: EmployeeDocumentService) {}

  @Post()
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateEmployeeDocumentDto) {
    return this.service.create(hotelId, dto);
  }

  @Get()
  findAll(
    @CurrentHotel() hotelId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.service.findAll(
      hotelId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 25,
      sortBy,
      sortOrder as 'ASC' | 'DESC',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.findOne(id, hotelId);
  }

  @Patch(':id')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateEmployeeDocumentDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Post('upload')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        cb(null, allowed.includes(file.mimetype));
      },
    }),
  )
  upload(
    @CurrentHotel() hotelId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('employeeId') employeeId: string,
    @Body('documentType') documentType: string,
    @Body('expiryDate') expiryDate?: string,
  ) {
    const fileUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    return this.service.create(hotelId, { employeeId, documentType, fileUrl, expiryDate: expiryDate || undefined });
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
