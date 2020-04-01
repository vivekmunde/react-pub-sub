import validatePublicationSchema from '../src/validate-publication-schema';

describe('validatePublicationSchema()', () => {
    test('Should throw error for undefined/null publication', () => {
        expect.hasAssertions();
        expect(() => validatePublicationSchema()).toThrow(new Error('Publication does not exist. Use createPublication([name]) to create a new publication.'));
        expect(() => validatePublicationSchema(null)).toThrow(new Error('Publication does not exist. Use createPublication([name]) to create a new publication.'));
    });

    test('Should throw error for invalid publication schema', () => {
        expect.hasAssertions();
        expect(() => validatePublicationSchema({})).toThrow(new Error(`Subscribers collection not found in the publication 'undefined'. Always use createPublication([name]) to create a publication.`));
    });

    test('Should return true for valid publication schema', () => {
        expect.hasAssertions();
        expect(validatePublicationSchema({ subscribers: [] })).toBe(true);
    });
});
