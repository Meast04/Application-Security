import { set } from 'date-fns';
import { Shoppingcart } from '../../model/shoppingcart';
import { User } from '../../model/user';

test('given: valid values for a user, when: user is constructed, then: user is created with those values', () => {
    // given valid values for a user
    const validEmail = 'john.doe@mail.com';
    const validPassword = 'JohnD123!';
    const validRole = 'user';

    // when user is constructed
    const user = new User({
        email: validEmail,
        password: validPassword,
        role: validRole,
        shoppingcarts: [],
    });

    // then user is created with those values
    expect(user.getEmail()).toEqual(validEmail);
    expect(user.getPassword()).toEqual(validPassword);
    expect(user.getRole()).toEqual(validRole);
});

test('given: invalid email for a user, when: a user is constructed, then: error is thrown', () => {
    // given invalid values for a user
    const invalidEmail = '';
    const validPassword = 'JohnD123!';
    const validRole = 'user';

    // when user is constructed
    const user = () =>
        new User({
            email: invalidEmail,
            password: validPassword,
            role: validRole,
            shoppingcarts: [],
        });

    expect(user).toThrow('Email is required');
});

test('given: invalid password for a user, when: a user is constructed, then: error is thrown', () => {
    // given invalid values for a user
    const validEmail = 'john.doe@mail.com';
    const invalidPassword = '';
    const validRole = 'user';

    // when user is constructed
    const user = () =>
        new User({
            email: validEmail,
            password: invalidPassword,
            role: validRole,
            shoppingcarts: [],
        });

    expect(user).toThrow('Password is required');
});

test('given: valid user, when: adding a shopping cart to a user, then: shopping cart is added to that user', () => {
    // given valid user
    const user = new User({
        email: 'john.doe@mail.com',
        password: 'JohnD123!',
        role: 'admin',
        shoppingcarts: [],
    });
    const shoppingcart = new Shoppingcart({
        name: 'Groceries',
        deliveryDate: set(new Date(Date.now() + 86400000), { hours: 12, minutes: 0 }),
        items: [],
    });

    // when adding a shopping cart to a user
    user.addShoppingcart(shoppingcart);

    // then shopping cart is added to that user
    expect(user.getShoppingcarts()).toContain(shoppingcart);
    expect(user.getShoppingcarts()).toHaveLength(1);
});

test('given: valid user, when: adding a user to a shopping cart that is already added, then: error is thrown and user is not added', () => {
    // given valid user
    const user = new User({
        email: 'john.doe@mail.com',
        password: 'JohnD123!',
        role: 'admin',
        shoppingcarts: [],
    });
    const shoppingcart = new Shoppingcart({
        name: 'Groceries',
        deliveryDate: set(new Date(Date.now() + 86400000), { hours: 12, minutes: 0 }),
        items: [],
    });

    user.addShoppingcart(shoppingcart);

    // adding a user to a shopping cart that is already added
    const addShoppingcartToUser = () => user.addShoppingcart(shoppingcart);

    // then error is thrown and user is not added
    expect(addShoppingcartToUser).toThrow('This shopping cart is already added to this user');
    expect(user.getShoppingcarts()).toContain(shoppingcart);
    expect(user.getShoppingcarts()).toHaveLength(1);
});
