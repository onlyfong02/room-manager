import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
    validate(confirmPassword: string, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return confirmPassword === relatedValue;
    }

    defaultMessage() {
        return 'validation.PASSWORDS_NOT_MATCH';
    }
}

export class RegisterDto {
    @IsEmail({}, {
        message: i18nValidationMessage('validation.EMAIL'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.NOT_EMPTY'),
    })
    email: string;

    @IsString({
        message: i18nValidationMessage('validation.STRING'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.NOT_EMPTY'),
    })
    @MinLength(8, {
        message: i18nValidationMessage('validation.MIN_LENGTH'),
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: i18nValidationMessage('validation.PASSWORD_COMPLEXITY'),
    })
    password: string;

    @IsString({
        message: i18nValidationMessage('validation.STRING'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.NOT_EMPTY'),
    })
    @Validate(MatchPasswordConstraint, ['password'], {
        message: i18nValidationMessage('validation.PASSWORDS_NOT_MATCH'),
    })
    confirmPassword: string;

    @IsString({
        message: i18nValidationMessage('validation.STRING'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.NOT_EMPTY'),
    })
    fullName: string;

    @IsString({
        message: i18nValidationMessage('validation.STRING'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.NOT_EMPTY'),
    })
    phone: string;
}

export class LoginDto {
    @IsEmail({}, {
        message: i18nValidationMessage('validation.EMAIL'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.NOT_EMPTY'),
    })
    email: string;

    @IsString({
        message: i18nValidationMessage('validation.STRING'),
    })
    @IsNotEmpty({
        message: i18nValidationMessage('validation.NOT_EMPTY'),
    })
    password: string;
}
