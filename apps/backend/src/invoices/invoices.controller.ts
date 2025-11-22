import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvoicesController {
  constructor(private service: InvoicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  findAll(@Query('clientId') clientId?: string) {
    return this.service.findAll(clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new invoice' })
  create(@Body() createDto: any) {
    return this.service.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update invoice' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.service.update(id, updateDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  updateStatus(@Param('id') id: string, @Body() body: { status: any }) {
    return this.service.updateStatus(id, body.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete invoice' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
