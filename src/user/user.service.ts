import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel : Model<UserDocument>){}

   async create(createUserDTO:CreateUserDTO) : Promise<User>{
        const createdUser =new  this.userModel(createUserDTO)
        return  createdUser.save()
    }
    
    
}
