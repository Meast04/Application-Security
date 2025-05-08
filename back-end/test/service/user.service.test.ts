import userDb from '../../repository/user.db';
import userService from '../../service/user.service';
import { UserInput } from '../../types';

let mockUserDbGetAllUsers: jest.Mock;

beforeEach(() => {
    mockUserDbGetAllUsers = jest.fn();
});

test('given: a filled userDb, when: getting all users from userService, then: all users are returned', async () => {
    // given a filled userDB
    const user1: UserInput = {
        email: 'john.doe@mail.com',
        password: 'password',
        role: 'user',
    };

    const users: UserInput[] = [user1];

    userDb.getAll = mockUserDbGetAllUsers.mockReturnValue(users);

    // when getting all users from userService
    await userService.getAllUsers(user1.role);

    // then all users are returned
    expect(mockUserDbGetAllUsers).toHaveBeenCalled();
    expect(mockUserDbGetAllUsers).toHaveReturnedWith(users);
});
