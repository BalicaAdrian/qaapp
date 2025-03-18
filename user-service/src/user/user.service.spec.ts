import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

describe('UserService', () => {
    let module: TestingModule;
    let service: UserService;
    let userRepository: Repository<User>;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory:',
                    entities: [User],
                    synchronize: true,
                    dropSchema: true,
                }),
                TypeOrmModule.forFeature([User]),
            ],
            providers: [UserService],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterAll(async () => {
        await module.close();
    });

    beforeEach(async () => {
        await userRepository.clear();
    });

    describe('getTotalUsers', () => {
        it('should return the total number of users', async () => {
            await userRepository.save([
                { email: 'user1@test.com', name: 'User 1', password: 'password123' },
                { email: 'user2@test.com', name: 'User 2', password: 'password123' },
                { email: 'user3@test.com', name: 'User 3', password: 'password123' },
            ]);

            const result = await service.getTotalUsers();
            expect(result).toBe(3);
        });

        it('should return 0 when no users exist', async () => {
            const result = await service.getTotalUsers();
            expect(result).toBe(0);
        });

        it('should throw RpcException on database error', async () => {
            await module.close();

            await expect(service.getTotalUsers()).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'Failed to calculate users',
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                    }),
                }),
            );

            module = await Test.createTestingModule({
                imports: [
                    TypeOrmModule.forRoot({
                        type: 'sqlite',
                        database: ':memory:',
                        entities: [User],
                        synchronize: true,
                        dropSchema: true,
                    }),
                    TypeOrmModule.forFeature([User]),
                ],
                providers: [UserService],
            }).compile();

            service = module.get<UserService>(UserService);
            userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        });
    });

    describe('getUserById', () => {
        let testUser: User;

        beforeEach(async () => {
            testUser = await userRepository.save({
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            });
        });

        it('should return a user by id', async () => {
            const result = await service.getUserById(testUser.id);
            expect(result).toBeDefined();
            expect(result.email).toBe(testUser.email);
            expect(result.name).toBe(testUser.name);
        });

        it('should throw RpcException when user not found', async () => {
            await expect(service.getUserById('non-existent-id')).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'User not found',
                        status: HttpStatus.NOT_FOUND,
                    }),
                }),
            );
        });
    });

    describe('getUserByEmail', () => {
        let testUser: User;

        beforeEach(async () => {
            testUser = await userRepository.save({
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            });
        });

        it('should return a user by email', async () => {
            const result = await service.getUserByEmail(testUser.email);
            expect(result).toBeDefined();
            expect(result.id).toBe(testUser.id);
            expect(result.name).toBe(testUser.name);
        });

        it('should throw RpcException when user not found', async () => {
            await expect(service.getUserByEmail('nonexistent@example.com')).rejects.toThrowError(
                expect.objectContaining({
                    error: expect.objectContaining({
                        message: 'User not found',
                        status: HttpStatus.NOT_FOUND,
                    }),
                }),
            );
        });
    });

    describe('createUser', () => {
        const newUserData = {
            email: 'new@example.com',
            name: 'New User',
            password: 'password123',
        };

        it('should create a new user', async () => {
            const result = await service.createUser(newUserData);
            expect(result).toBeDefined();
            expect(result.email).toBe(newUserData.email);
            expect(result.name).toBe(newUserData.name);

            const savedUser = await userRepository.findOne({ where: { email: newUserData.email } });
            expect(savedUser).toBeDefined();
            expect(savedUser?.email).toBe(newUserData.email);
        });

        it('should throw RpcException when creating user with duplicate email', async () => {
           
            const firstUser = await service.createUser({
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123',
            });

            const duplicateUserData = {
                email: 'test@example.com', 
                name: 'Another User',
                password: 'different123',
            };

            await expect(service.createUser(duplicateUserData)).rejects.toThrow(/Failed to create user|SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email/);
            
            const usersWithEmail = await userRepository.find({
                where: { email: 'test@example.com' }
            });
            expect(usersWithEmail.length).toBe(1);
        });
    });

});