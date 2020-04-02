import createPublication from '../src/create-publication';
import subscribe from '../src/subscribe';

describe('subscribe()', () => {
    test('Should throw error for undefined/null publication', () => {
        expect.hasAssertions();
        expect(() => subscribe()).toThrow(new Error('Publication does not exist. Use createPublication([name]) to create a new publication.'));
    });

    test('Should throw error for invalid publication schema', () => {
        expect.hasAssertions();
        expect(() => subscribe({})).toThrow(new Error(`Subscribers collection not found in the publication 'undefined'. Always use createPublication([name]) to create a publication.`));
    });

    test('Should handle multiple calls to unsubscribe', () => {
        expect.hasAssertions();

        const publication = createPublication('test');

        const subscriber = jest.fn(val => val);

        const unsubscribe = subscribe(publication, subscriber);

        unsubscribe();
        unsubscribe();

        expect(publication.subscribers.length).toBe(0);
    });

});
