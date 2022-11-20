import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app/app.module';
import { DbService } from 'src/db/db.service';
import * as pactum from 'pactum';

const jwt = new JwtService({ secret: process.env.JWT_SECRET });
const tokenData = process.env.TOKEN_DATA;
if (!tokenData) throw new Error('Missing TOKEN_DATA in .env');
const token = jwt.sign(JSON.parse(tokenData), { algorithm: 'HS512' });

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication(new FastifyAdapter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.get(DbService).clean();

    await app.init();
    await app.listen(process.env.PORT || 3000);

    pactum.request.setBaseUrl(`http://localhost:${process.env.PORT || 3000}`);
  });

  afterAll(async () => await app?.close());

  describe('Users module', () => {
    beforeEach(() => pactum.request.setBearerToken(token));

    describe('POST /users/preferred-time', () => {
      const R = '/users/preferred-time';

      it('should not save without token', async () => {
        pactum.request.setBearerToken('');
        return pactum.spec().post(R).expectStatus(401);
      });

      it('should not save without time', async () => {
        await pactum.spec().post(R).expectStatus(400);
      });

      it('should not fail with duplicate times', async () => {
        const body = { time: '20:00:00' };
        await pactum.spec().post(R).withBody(body).expectStatus(201).expectJsonLike(body);
        await pactum.spec().post(R).withBody(body).expectStatus(201).expectJsonLike(body);
      });

      it('should save the preferred time (Happy Path)', async () => {
        const body = { time: '18:30:00' };
        return pactum.spec().post(R).withBody(body).expectStatus(201).expectJsonLike(body);
      });
    });
  });
});
