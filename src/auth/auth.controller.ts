import { BadRequestException, Body, ConflictException, Controller, HttpCode, HttpException, HttpStatus, Post, Request, UnauthorizedException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.interface';
import { CreateUserDTO } from 'src/user/dto/user.dto';
import { HttpExceptionFilter } from 'src/common/filters/http-exception';
import { error } from 'console';
import { LoginUserDTO } from 'src/user/dto/login.user.dto';

@Controller('auth')
@UseFilters(new HttpExceptionFilter())
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() logingUser: LoginUserDTO) {
        try {
            const user =await this.authService.validateUser(logingUser.email, logingUser.password);
            if (!user) {
                throw new UnauthorizedException('Invalid Credentails');
            }
            return {
                status: 'success',
                message: 'Login successful',
                access_token: await this.authService.login(user),
            }

        } catch (error) {
            if(error instanceof UnauthorizedException){
                throw new UnauthorizedException('Invalid credentials');
            }
            throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
        }

    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(@Body() createUserDTO: CreateUserDTO) {
        try {
            const user = this.authService.register(createUserDTO)
            return {
                status: 'success',
                message: 'User registered successfully',
                user,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            if (error instanceof ConflictException) {
                throw new ConflictException('Username already exists');
            }
            if (error instanceof BadRequestException) {
                throw new BadRequestException('Registration failed');
            }

        }

        throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

