import { Item } from '../../model/item';
import { Category } from '../../types';

test('given: valid values for a item, when: item is constructed, then: item is created with those values', () => {
    // given valid values for a item
    const validName = 'Paprika';
    const validPrice = 0.49;
    const validPathToImage = '/public/paprika.png';
    const validCategory = 'fruits' as Category;

    // when item is constructed
    const item = new Item({
        name: validName,
        price: validPrice,
        pathToImage: validPathToImage,
        category: validCategory,
    });

    // then item is created with those values
    expect(item.getName()).toEqual(validName);
    expect(item.getPrice()).toEqual(validPrice);
    expect(item.getPathToImage()).toEqual(validPathToImage);
    expect(item.getCategory()).toEqual(validCategory);
});

test('given: invalid name for a item, when: item is constructed, then: error is thrown', () => {
    // given invalid name for a item
    const invalidName = '';
    const validPrice = 0.49;
    const validPathToImage = '/public/paprika.png';
    const validCategory = 'vegetables' as Category;

    // when item is constructed
    const item = () =>
        new Item({
            name: invalidName,
            price: validPrice,
            pathToImage: validPathToImage,
            category: validCategory,
        });

    // then error is thrown
    expect(item).toThrow('Name is required');
});

test('given: invalid price for a item, when: item is constructed, then: error is thrown', () => {
    // given invalid name for a item
    const validName = 'Paprika';
    const invalidPrice = NaN;
    const validPathToImage = '/public/paprika.png';
    const validCategory = 'fruits' as Category;

    // when item is constructed
    const item = () =>
        new Item({
            name: validName,
            price: invalidPrice,
            pathToImage: validPathToImage,
            category: validCategory,
        });

    // then error is thrown
    expect(item).toThrow('Price is required');
});

test('given: negative price for a item, when: item is constructed, then: error is thrown', () => {
    // given invalid price for a item
    const validName = 'Paprika';
    const invalidPrice = -0.49;
    const validPathToImage = '/public/paprika.png';
    const validCategory = 'vegetables' as Category;

    // when item is constructed
    const item = () =>
        new Item({
            name: validName,
            price: invalidPrice,
            pathToImage: validPathToImage,
            category: validCategory,
        });

    // then error is thrown
    expect(item).toThrow('Price should be a positive number');
});

test('given: invalid path to image for a item, when: item is constructed, then: error is thrown', () => {
    // given invalid path to image for a item
    const validName = 'Paprika';
    const validPrice = 0.49;
    const invalidPathToImage = '';
    const validCategory = 'vegetables' as Category;

    // when item is constructed
    const item = () =>
        new Item({
            name: validName,
            price: validPrice,
            pathToImage: invalidPathToImage,
            category: validCategory,
        });

    // then error is thrown
    expect(item).toThrow('Path to image is required');
});

test('given: invalid category for a item, when: item is constructed, then: error is thrown', () => {
    // given invalid path to image for a item
    const validName = 'Paprika';
    const validPrice = 0.49;
    const validPathToImage = '/public/paprika.png';
    const invalidCategory = '' as Category;

    // when item is constructed
    const item = () =>
        new Item({
            name: validName,
            price: validPrice,
            pathToImage: validPathToImage,
            category: invalidCategory,
        });

    // then error is thrown
    expect(item).toThrow('Category is required');
});
