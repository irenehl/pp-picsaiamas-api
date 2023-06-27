import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { BaseService } from 'src/common/service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(data: Prisma.UserCreateInput) {
    const isUnique = (await this.findOne({ email: data.email })) !== undefined;

    if (!isUnique)
      throw new BadRequestException('User already exists with that email');

    const password = await bcrypt.hash(data.password, 10);

    return this.exclude(
      await this.prisma.user.create({
        data: {
          ...data,
          password,
        },
      }),
      ['password'],
    );
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(query: Prisma.UserWhereUniqueInput, withPass = false) {
    return this.exclude(
      await this.prisma.user.findUnique({
        where: query,
      }),
      withPass ? ['password'] : [],
    );
  }

  async validate(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.findUnique({ where });
  }

  update(update: Prisma.UserUpdateInput, where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.update({
      where,
      data: update,
    });
  }

  remove(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.delete({ where });
  }
}
