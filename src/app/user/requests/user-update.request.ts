import { IsNotEmpty } from 'class-validator';

export class UserUpdateRequest {
    @IsNotEmpty({ message: 'First Name is required.' })
    first_name: string;

    last_name: string;

    birthday? : Date;

    gender_type? : number;
}
