import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UpdateUserDto, ChangePasswordDto } from '@modules/users/dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        const existingUser = await this.userModel.findOne({
            email: createUserDto.email,
            isDeleted: false,
        });

        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });

        return user.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find({ isDeleted: false }).select('-password -refreshToken').exec();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel
            .findOne({ _id: id, isDeleted: false })
            .select('-password -refreshToken')
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({ email, isDeleted: false }).exec();
    }

    async findOneDocument(id: string): Promise<UserDocument> {
        const user = await this.userModel
            .findOne({ _id: id, isDeleted: false })
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel
            .findOneAndUpdate(
                { _id: id, isDeleted: false },
                { $set: updateUserDto },
                { new: true },
            )
            .select('-password -refreshToken')
            .exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<void> {
        const user = await this.userModel.findOne({ _id: id, isDeleted: false }).exec();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.password,
        );

        if (!isPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        user.password = hashedPassword;
        await user.save();
    }

    async remove(id: string): Promise<void> {
        const result = await this.userModel
            .updateOne({ _id: id, isDeleted: false }, { $set: { isDeleted: true } })
            .exec();

        if (result.matchedCount === 0) {
            throw new NotFoundException('User not found');
        }
    }

    async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
        const hashedToken = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
        await this.userModel.updateOne(
            { _id: userId },
            { $set: { refreshToken: hashedToken } },
        ).exec();
    }
}
