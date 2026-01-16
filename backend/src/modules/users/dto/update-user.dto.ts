import { IsString, IsOptional, MinLength, Matches, IsBoolean, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    fullName?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {
        message: i18nValidationMessage('validation.MIN_LENGTH'),
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: i18nValidationMessage('validation.PASSWORD_COMPLEXITY'),
    })
    newPassword: string;
}
