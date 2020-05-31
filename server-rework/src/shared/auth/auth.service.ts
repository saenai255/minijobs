import {Inject, Service} from 'typedi';
import JWTConfiguration, {JWTConfigurationToken} from '../config/types/jwt.config';
import JWTToken from './types/jwt-token.interface';
import {sign, verify} from 'jsonwebtoken';
import axios from 'axios';
import FacebookProfile from './types/facebook-profile.dto';
import User from '../modules/user/model/user.model';
import {Response} from 'express';
import UserRepository, {UserRepositoryToken} from "../modules/user/repository/user.repository";

@Service()
export default class AuthService {
    constructor(
        @Inject(JWTConfigurationToken) private jwtConfig: JWTConfiguration,
        @Inject(UserRepositoryToken) private userRepository: UserRepository
    ) {}

    public decodeToken(token: string): Promise<JWTToken> {
        return new Promise((resolve, reject) => {
            verify(token, this.jwtConfig.secret, (err, decoded) =>
                err ? reject() : resolve(decoded)
            );
        });
    }

    public encodeToken(token: JWTToken): Promise<string> {
        return new Promise((resolve, reject) =>
            sign(token, this.jwtConfig.secret, (err, token: string) =>
                err ? reject(err) : resolve(token)
            )
        );
    }

    public async login(accessToken: string): Promise<User> {
        const profile = await this.getFacebookProfile(accessToken);
        return this.getOrCreateUser(profile);
    }

    private async getOrCreateUser(data: FacebookProfile): Promise<User> {
        const userOptional = await this.userRepository.findBy('email', data.email);
        if (userOptional.exists()) {
            return userOptional.get();
        }

        return this.userRepository.save({
            id: null,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            ownRatings: [],
            picture: '',
            permissions: []
        });
    }

    private getFacebookProfile(accessToken: string): Promise<FacebookProfile> {
        return axios
            .get<FacebookProfile>(
                'https://graph.facebook.com/v4.0/me?fields=name,first_name,last_name,picture,email&access_token=' +
                    accessToken
            )
            .then(res => res.data);
    }

    async setAuthCookie(user: User, response: Response) {
        const token = await this.encodeToken({
            email: user.email,
            expires: new Date().getTime() + this.jwtConfig.maxAge
        });

        response.cookie(this.jwtConfig.cookieName, token, {
            maxAge: this.jwtConfig.maxAge,
            httpOnly: true,
            sameSite: 'lax'
        });
    }
}