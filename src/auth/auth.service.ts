import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/user.interface';
import { CreateUserDTO } from 'src/user/dto/user.dto';
import { Logger } from '@nestjs/common';
@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor
    (
        private readonly userService : UserService,
        private readonly jwtService : JwtService

    ){}


    async validateUser(email:string,pass:string):Promise<any>{
        this.logger.log(`Validating user :${email}`)
        const user = await this.userService.findOne(email);
        console.log(user.password)
        if(user && await bcrypt.compare(pass,user.password)){
            this.logger.log(`User Validated :${email}`)
            const {password ,...result} = user;
            return result;
        }
        this.logger.warn(`Invalid credentials for user: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
    }


    async login(user:User){
        this.logger.log(`Logging in user: ${user.email}`);
        const data = {username:user.username,sub:user.email}
        return{
            access_token:this.jwtService.sign(data)
        }
    }

    async register(createUserDTO:CreateUserDTO){
        this.logger.log(`Registering user: ${createUserDTO.email}`);
        const existUser = this.userService.findOne(createUserDTO.email)
        if(existUser){
            this.logger.log('User Already exsist');
            throw new ConflictException('Already exsits')
        }
        const hashPassword = await bcrypt.hash(createUserDTO.password,10);
        console.log(hashPassword,'pass')
        createUserDTO.password = hashPassword
        
        return this.userService.create(createUserDTO)

    }




    }



