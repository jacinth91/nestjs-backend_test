import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/user.dto';
import { Logger } from '@nestjs/common';
@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDTO: CreateUserDTO): Promise<User> {
        this.logger.log('New User initialization')
        const existingUser = await this.userModel.findOne({ email: createUserDTO.email }).exec()
        if (existingUser) {
            this.logger.log('User already in Database')
            throw new ConflictException('Username already exists')
        }
        this.logger.log(`New User create for${createUserDTO.email}`)
        const createdUser = new this.userModel(createUserDTO)
        return createdUser.save()
    }


    async findOne(email: string): Promise<User | undefined> {
        return this.userModel.findOne({ email }).exec();
    }

}
