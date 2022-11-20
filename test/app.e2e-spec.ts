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

    describe('PreferredTime', () => {
      const R = '/users/preferred-time';
      describe('POST /users/preferred-time', () => {
        beforeAll(async () => await app.get(DbService).clean());
        afterAll(async () => await app.get(DbService).clean());

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
          return pactum.spec().post(R).withBody(body).expectStatus(201).expectJsonLike(body);
        });

        it('should save the preferred time (Happy Path)', async () => {
          const body = { time: '18:30:00' };
          return pactum.spec().post(R).withBody(body).expectStatus(201).expectJsonLike(body);
        });
      });

      describe('GET /users/preferred-time', () => {
        beforeAll(async () => await app.get(DbService).clean());
        afterAll(async () => await app.get(DbService).clean());

        it('should fail without token', async () => {
          pactum.request.setBearerToken('');
          return pactum.spec().get(R).expectStatus(401);
        });

        it('should get an empty list of times', async () => {
          return pactum.spec().get(R).expectStatus(200).expectJson([]);
        });

        it('should get an non-empty list of times', async () => {
          await pactum
            .spec()
            .post(R)
            .withBody({ time: '18:00:00' })
            .expectStatus(201)
            .expectJsonLike({ time: '18:00:00' });

          await pactum
            .spec()
            .post(R)
            .withBody({ time: '18:30:00' })
            .expectStatus(201)
            .expectJsonLike({ time: '18:30:00' });

          await pactum
            .spec()
            .post(R)
            .withBody({ time: '19:00:00' })
            .expectStatus(201)
            .expectJsonLike({ time: '19:00:00' });

          return pactum
            .spec()
            .get(R)
            .expectStatus(200)
            .expectJson(['18:00:00', '18:30:00', '19:00:00']);
        });
      });

      describe('DELETE /users/preferred-time', () => {
        beforeAll(async () => await app.get(DbService).clean());
        afterAll(async () => await app.get(DbService).clean());

        it('should fail without token', async () => {
          pactum.request.setBearerToken('');
          return pactum.spec().delete(R).expectStatus(401);
        });

        it('should fail without time', async () => {
          return pactum.spec().delete(R).expectStatus(400);
        });

        it('should not fail if time does not exist', async () => {
          return pactum
            .spec()
            .delete(R)
            .withBody({ time: '18:30:00' })
            .expectStatus(200)
            .expectBody('');
        });

        it('should delete preferred time', async () => {
          const body = { time: '18:30:00' };
          await pactum.spec().post(R).withBody(body);

          return pactum.spec().delete(R).withBody(body).expectStatus(200).expectJsonLike(body);
        });
      });
    });
  });
});
