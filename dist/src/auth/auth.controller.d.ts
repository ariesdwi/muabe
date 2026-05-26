import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
        };
    }>;
    registerAdmin(dto: RegisterAdminDto): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
    }>;
    getMe(userId: string): Promise<any>;
}
