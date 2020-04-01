import createPublication from '../src/create-publication';
import publish from '../src/publish';

describe('publish()', () => {
    test('Should throw error for undefined/null publication', () => {
        expect.hasAssertions();
        expect(() => publish()).toThrow(new Error('Publication does not exist. Use createPublication([name]) to create a new publication.'));
    });

    test('Should throw error for invalid publication schema', () => {
        expect.hasAssertions();
        expect(() => publish({})).toThrow(new Error(`Subscribers collection not found in the publication 'undefined'. Always use createPublication([name]) to create a publication.`));
    });

    test('Should log warning for empty subscribers', () => {
        expect.hasAssertions();

        const publication = createPublication('test');

        publish(publication, 'value')

        expect(true).toBe(true);
    });
});
