import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Library Management API running';
  }

  @Get('health')
  getHealth(): string {
    return 'OK';
  }

  @Get('info')
  getInfos(): string {
    return 'guruttopurno infos';
  }
}
