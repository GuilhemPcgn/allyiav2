import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    void this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
