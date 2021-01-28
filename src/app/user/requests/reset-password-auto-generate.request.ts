import { IsNotEmpty } from 'class-validator';

export class ResetPasswordAutoGenerateRequest {
    @IsNotEmpty({ message: 'User id is required.' })
    user_id: number;
}
