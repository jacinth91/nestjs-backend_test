import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
    constructor(private userService:UserService){}

    @Post('create')
    async createUser(@Body() createUserDTO:CreateUserDTO){
        return this.userService.create(createUserDTO)
    }

}
