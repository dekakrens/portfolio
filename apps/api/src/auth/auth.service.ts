import {
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { scryptSync, randomBytes, timingSafeEqual, createHmac } from 'node:crypto';
import { DRIZZLE_DB, type AppDatabase } from '../database/database.module.js';
import * as schema from '../database/schema.js';

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  exp: number;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  private readonly secretKey =
    process.env.JWT_SECRET || 'dekakrens_super_secure_jwt_token_secret_2026';

  constructor(@Inject(DRIZZLE_DB) private readonly db: AppDatabase) {}

  async onModuleInit() {
    await this.ensureDefaultAdmin();
  }

  hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = scryptSync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  verifyPassword(password: string, combinedHash: string): boolean {
    try {
      const [salt, key] = combinedHash.split(':');
      if (!salt || !key) return false;
      const keyBuffer = Buffer.from(key, 'hex');
      const derivedKey = scryptSync(password, salt, 64);
      return timingSafeEqual(keyBuffer, derivedKey);
    } catch {
      return false;
    }
  }

  generateToken(user: { id: string; email: string; name: string; role: string }): string {
    const payload: AuthPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString(
      'base64url',
    );
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = createHmac('sha256', this.secretKey)
      .update(`${header}.${body}`)
      .digest('base64url');

    return `${header}.${body}.${signature}`;
  }

  verifyToken(token: string): AuthPayload {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new UnauthorizedException('Malformed authentication token');
      }

      const [header, body, signature] = parts;
      const expectedSig = createHmac('sha256', this.secretKey)
        .update(`${header}.${body}`)
        .digest('base64url');

      const sigBuf = Buffer.from(signature);
      const expSigBuf = Buffer.from(expectedSig);

      if (
        sigBuf.length !== expSigBuf.length ||
        !timingSafeEqual(sigBuf, expSigBuf)
      ) {
        throw new UnauthorizedException('Invalid token signature');
      }

      const payload: AuthPayload = JSON.parse(
        Buffer.from(body, 'base64url').toString('utf-8'),
      );

      if (Date.now() > payload.exp) {
        throw new UnauthorizedException('Authentication token has expired');
      }

      return payload;
    } catch (err: any) {
      throw new UnauthorizedException(err.message || 'Invalid token');
    }
  }

  async login(email: string, passwordPlain: string) {
    const trimmedEmail = email.trim().toLowerCase();

    // Query admin user by email
    const [admin] = await this.db
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, trimmedEmail))
      .limit(1);

    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = this.verifyPassword(passwordPlain, admin.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.generateToken(admin);

    return {
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async ensureDefaultAdmin() {
    try {
      const defaultEmail = 'dekakrens@gmail.com';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'dekakrens2026!';

      const [existing] = await this.db
        .select()
        .from(schema.adminUsers)
        .where(eq(schema.adminUsers.email, defaultEmail))
        .limit(1);

      if (!existing) {
        this.logger.log(`Creating default admin user for ${defaultEmail}...`);
        const passwordHash = this.hashPassword(defaultPassword);
        await this.db.insert(schema.adminUsers).values({
          email: defaultEmail,
          passwordHash,
          name: 'Deny Kurniawan',
          role: 'admin',
        });
        this.logger.log(`Default admin user created successfully.`);
      }
    } catch (err: any) {
      this.logger.warn(`Could not verify default admin: ${err.message}`);
    }
  }
}
