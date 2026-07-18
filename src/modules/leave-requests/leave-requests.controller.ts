import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentHotel } from '../../common/decorators/current-hotel.decorator';
import { CurrentEmployee } from '../../common/decorators/current-employee.decorator';
import { HotelScopeGuard } from '../../common/guards/hotel-scope.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { LeaveRequestService } from './leave-requests.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { RejectLeaveDto } from './dto/reject-leave.dto';

@ApiTags('leave-requests')
@ApiBearerAuth('JWT')
@UseGuards(HotelScopeGuard)
@Controller('leave-requests')
export class LeaveRequestController {
  constructor(private readonly service: LeaveRequestService) {}

  @Get('me')
  findMine(
    @CurrentHotel() hotelId: string,
    @CurrentEmployee() employeeId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findMine(
      hotelId,
      employeeId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Post('me')
  createMine(
    @CurrentHotel() hotelId: string,
    @CurrentEmployee() employeeId: string,
    @Body() dto: CreateLeaveRequestDto,
  ) {
    return this.service.create(hotelId, { ...dto, employeeId, hotelId });
  }

  @Post()
  create(@CurrentHotel() hotelId: string, @Body() dto: CreateLeaveRequestDto) {
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
  update(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: UpdateLeaveRequestDto) {
    return this.service.update(id, hotelId, dto);
  }

  @Patch(':id/approve')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  @ApiOperation({ summary: 'Approve a leave request' })
  @ApiResponse({ status: 200, description: 'Leave request approved' })
  approve(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.approve(id, hotelId);
  }

  @Patch(':id/reject')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  @ApiOperation({ summary: 'Reject a leave request with an optional reason' })
  @ApiResponse({ status: 200, description: 'Leave request rejected' })
  reject(@Param('id') id: string, @CurrentHotel() hotelId: string, @Body() dto: RejectLeaveDto) {
    return this.service.reject(id, hotelId, dto);
  }

  @Delete(':id')
  @Roles('super_admin', 'hotel_admin', 'hr_manager')
  remove(@Param('id') id: string, @CurrentHotel() hotelId: string) {
    return this.service.remove(id, hotelId);
  }
}
