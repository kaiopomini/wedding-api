import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { HasRoles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { Public } from 'src/common/decorators';
import { ConfirmInviteDto } from './dto/confirm-invite.dto';

@ApiTags('Invites')
@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @HasRoles(Role.ADMIN, Role.MODERATOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('access-token')
  @UseInterceptors(FormatResponseInterceptor)
  create(@Body() createInviteDto: CreateInviteDto) {
    return this.invitesService.create(createInviteDto);
  }

  @Get()
  findAll() {
    return this.invitesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitesService.findOne(id);
  }

  @Patch('/confirm/:id')
  @Public()
  @UseInterceptors(FormatResponseInterceptor)
  update(
    @Param('id') id: string,
    @Body()
    confirmInviteDto: ConfirmInviteDto,
  ) {
    return this.invitesService.update(id, confirmInviteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invitesService.remove(id);
  }
}
