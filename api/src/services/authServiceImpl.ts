import jwt from 'jsonwebtoken';
import type { AuthService } from './interfaces/authService.js';
import type { AuthDataDto, TokenDto } from '../models/index.js';
import { Constants } from '../utils/index.js';

export class AuthServiceImpl implements AuthService {
  login(data: AuthDataDto): TokenDto {
    const token = jwt.sign({ id: data.email }, Constants.JWT_SECRET, { expiresIn: '1h' });
    return { token };
  }

  signup(data: AuthDataDto): TokenDto {

    const token = jwt.sign({ id: data.email }, Constants.JWT_SECRET, { expiresIn: '1h' });
    return { token };
  }
} 
