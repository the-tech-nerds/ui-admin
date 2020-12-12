import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordRequest {
    @IsNotEmpty({ message: 'User id is required.' })
    user_id: number;

    @IsNotEmpty({ message: 'Old password is required.' })
    old_password: string;

    @IsNotEmpty({ message: 'New password is required.' })
    @MinLength(8, { message: 'Password must be atleast 8 characters' })
    new_password: string;

    @IsNotEmpty({ message: 'Password confirmation is required.' })
    new_password_confirm: string;
}
