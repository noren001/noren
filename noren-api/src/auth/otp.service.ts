import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class OtpService {
  private store: Map<string, { value: string; expiresAt: number }> = new Map();

  private set(key: string, value: string, ttlSeconds: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  private get(key: string): string | null {
    const data = this.store.get(key);
    if (!data) return null;
    if (Date.now() > data.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return data.value;
  }

  private del(key: string): void {
    this.store.delete(key);
  }

  async generateOtp(mobile: string): Promise<{ code: string }> {
    const code = crypto.randomInt(100000, 999999).toString();
    const key = `otp:${mobile}`;

    this.set(key, code, 120);

    console.log(`🔑 OTP for ${mobile}: ${code}`);

    return { code };
  }

  async verifyOtp(mobile: string, code: string): Promise<boolean> {
    const key = `otp:${mobile}`;
    const storedCode = this.get(key);

    if (!storedCode) return false;
    if (storedCode !== code) return false;

    this.del(key);
    return true;
  }

  async setTempToken(mobile: string, token: string): Promise<void> {
    const key = `temp_token:${mobile}`;
    this.set(key, token, 600); // 10 دقیقه
  }

  async getTempToken(mobile: string): Promise<string | null> {
    const key = `temp_token:${mobile}`;
    return this.get(key);
  }

  async deleteTempToken(mobile: string): Promise<void> {
    const key = `temp_token:${mobile}`;
    this.del(key);
  }
}