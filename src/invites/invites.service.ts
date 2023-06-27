import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { ConfirmInviteDto } from './dto/confirm-invite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvitesService {
  constructor(private prisma: PrismaService) {}

  async create(createInviteDto: CreateInviteDto) {
    const newInvite = await this.prisma.invite.create({
      data: {
        invitedName: createInviteDto.invitedName,
      },
    });
    return { data: newInvite };
  }

  findAll() {
    return `This action returns all invites`;
  }

  findOne(id: string) {
    return `This action returns a #${id} invite`;
  }

  async update(id: string, confirmInviteDto: ConfirmInviteDto) {
    return this.prisma.$transaction(async (prismaClient) => {
      const invite = await prismaClient.invite.findUnique({
        where: { id },
        include: { guests: true },
      });

      if (!invite) {
        throw new NotFoundException(`Invite with ID ${id} not found.`);
      }

      const createdGuests = [];

      for (const guestData of confirmInviteDto.guests) {
        const createdGuest = await prismaClient.guest.create({
          data: {
            name: guestData.name,
            age: guestData.age,
            inviteId: invite.id, // Assigning the inviteId
          },
        });

        createdGuests.push(createdGuest);
      }

      const createdGuest = await prismaClient.guest.create({
        data: {
          name: invite.invitedName,
          age: 99,
          inviteId: invite.id, // Assigning the inviteId
        },
      });

      createdGuests.push(createdGuest);

      const idsToDelete = invite.guests?.map((guest) => guest.id);

      await prismaClient.guest.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });

      const updatedInvite = await prismaClient.invite.update({
        where: { id },
        data: {
          confirmed: true,
          guests: {
            connect: createdGuests.map((guest) => ({ id: guest.id })),
          },
        },
      });

      return { data: updatedInvite };
    });
  }

  remove(id: string) {
    return `This action removes a #${id} invite`;
  }
}
