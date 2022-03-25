import Validator from '@app/libs/validator';
import { assert } from 'chai';

describe('ValidatorService', () => {
  describe('required', () => {
    it('invalid', () => {
      const validator = new Validator({}, { key: 'required' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'key is required', '"key is required" should be error message');
    });

    it('valid', () => {
      const validator = new Validator({ key: 'asdf' }, { key: 'required' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });
  });

  describe('alphabet', () => {
    it('invalid', () => {
      const validator = new Validator({ key: 'asdf1' }, { key: 'alphabet' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'key can only contain alphabets',
        '"key can only contain alphabets" should be error message'
      );
    });

    it('valid', () => {
      const validator = new Validator({ key: 'asdf' }, { key: 'alphabet' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });
  });

  describe('email', () => {
    it('invalid', () => {
      const validator = new Validator({ key: 'user@admin' }, { key: 'email' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'Invalid email address',
        '"Invalid email address" should be error message'
      );
    });

    it('valid', () => {
      const validator = new Validator({ key: 'user@example.com' }, { key: 'email' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });
  });

  describe('phone', () => {
    it('less than 10 digits should be invalid', () => {
      const validator = new Validator({ key: '987654321' }, { key: 'phone' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'Invalid Phone', '"Invalid Phone" should be error message');
    });

    it('starting with 95', () => {
      const validator = new Validator({ key: '9543211234' }, { key: 'phone' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'Invalid Phone', '"Invalid Phone" should be error message');
    });

    it('starting with 90', () => {
      const validator = new Validator({ key: '9043211234' }, { key: 'phone' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'Invalid Phone', '"Invalid Phone" should be error message');
    });

    it('starting 98 valid', () => {
      const validator = new Validator({ key: '9876543210' }, { key: 'phone' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });
    it('starting 97 valid', () => {
      const validator = new Validator({ key: '9876543210' }, { key: 'phone' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });
    it('starting 96 valid', () => {
      const validator = new Validator({ key: '9876543210' }, { key: 'phone' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });
  });

  describe('anyOne', () => {
    it('value does not match should be invalid', () => {
      const validator = new Validator({ key: 'a' }, { key: 'anyOne:b' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'Invalid value for key',
        '"Invalid value for key" should be error message'
      );
    });

    it('value does not match with any params should be invalid', () => {
      const validator = new Validator({ key: 'a' }, { key: 'anyOne:b,c' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'Invalid value for key',
        '"Invalid value for key" should be error message'
      );
    });

    it('should be valid', () => {
      const validator = new Validator({ key: 'a' }, { key: 'anyOne:a' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('match with one of 2 should be valid', () => {
      const validator = new Validator({ key: 'a' }, { key: 'anyOne:a,b' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });
  });

  describe('min', () => {
    it('string should be valid', () => {
      const validator = new Validator(
        { key: 'string' },
        {
          key: 'min:2',
        }
      );
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('string should be invalid', () => {
      const validator = new Validator(
        { key: 'string' },
        {
          key: 'min:9',
        }
      );
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'key must be at least 9 characters long',
        'message should be "key must be at least 9 characters long" '
      );
    });

    it('array should be valid', () => {
      const validator = new Validator(
        { key: [1, 1] },
        {
          key: 'min:2',
        }
      );
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('array should be invalid', () => {
      const validator = new Validator(
        { key: [1, 1] },
        {
          key: 'min:9',
        }
      );
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'key must be at least 9 characters long',
        'message should be "key must be at least 9 characters long" '
      );
    });
  });

  describe('max', () => {
    it('string should be invalid', () => {
      const validator = new Validator(
        { key: 'string' },
        {
          key: 'max:2',
        }
      );
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'key must be less then or equals to 2 characters',
        'message should be "key must be less then or equals to 9 characters" '
      );
    });

    it('string should be valid', () => {
      const validator = new Validator(
        { key: 'string' },
        {
          key: 'max:9',
        }
      );
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('array should be invalid', () => {
      const validator = new Validator(
        { key: [1, 1, 1] },
        {
          key: 'max:2',
        }
      );
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'key must be less then or equals to 2 characters',
        'message should be "key must be less then or equals to 9 characters" '
      );
    });

    it('array should be invalid', () => {
      const validator = new Validator(
        { key: [1, 1] },
        {
          key: 'max:9',
        }
      );
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });
  });

  describe('regex', () => {
    it('should be valid', () => {
      const validator = new Validator({ key: 'asdf' }, { key: 'regex:asdf' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('should be invalid', () => {
      const validator = new Validator({ key: 'asdf' }, { key: 'regex:asdfjk' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'key is invalid');
    });
  });

  describe('alphanumeric', () => {
    it('aplhabets should be valid', () => {
      const validator = new Validator({ key: 'name' }, { key: 'alphanumeric' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('number should be valid', () => {
      const validator = new Validator({ key: '1111' }, { key: 'alphanumeric' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('alphanumeric should be valid', () => {
      const validator = new Validator({ key: 'adsf1111' }, { key: 'alphanumeric' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('special caractors should be valid', () => {
      const validator = new Validator({ key: '@ ' }, { key: 'alphanumeric' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'key must be alphanumeric',
        'message should be "key must be alphanumeric'
      );
    });
  });

  describe('array', () => {
    it('should be valid', () => {
      const validator = new Validator({ key: [1] }, { key: 'array' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('should be invalid', () => {
      const validator = new Validator({ key: { a: 1 } }, { key: 'array' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'key is required', 'message should be "key is required');
    });

    it('empty array should be invalid', () => {
      const validator = new Validator({ key: [] }, { key: 'array' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'key is required', 'message should be "key is required');
    });
  });

  describe('alphabetWithSpace', () => {
    it('aplhabets should be valid', () => {
      const validator = new Validator({ key: 'name' }, { key: 'alphabetWithSpace' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('alphabet with space should be valid', () => {
      const validator = new Validator({ key: 'ram ram' }, { key: 'alphabetWithSpace' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('aplhanumeric should be invalid', () => {
      const validator = new Validator({ key: 'adsf1111' }, { key: 'alphabetWithSpace' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'key can only contain alphabets',
        'message should be "key can only contain alphabets"'
      );
    });
  });

  describe('object', () => {
    it('should be valid', () => {
      const validator = new Validator({ key: { a: 1 } }, { key: 'object' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('should be invalid', () => {
      const validator = new Validator({ key: 'asd' }, { key: 'object' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'key must be an object', 'message should be "key must be an object');
    });
  });

  describe('number', () => {
    it('should be valid', () => {
      const validator = new Validator({ key: 98 }, { key: 'number' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('should be valid', () => {
      const validator = new Validator({ key: '98' }, { key: 'number' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('0 should be valid', () => {
      const validator = new Validator({ key: 0 }, { key: 'number' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('should be invalid', () => {
      const validator = new Validator({ key: 'asdf' }, { key: 'number' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'key must be number', 'message should be "key must be number');
    });
  });

  describe('lt', () => {
    it('should be valid', () => {
      const validator = new Validator({ key: 1 }, { key: 'lt:2' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('should be invalid', () => {
      const validator = new Validator({ key: 1 }, { key: 'lt:1' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'key must be less than 1', 'message should be "key must be less than 1');
    });
  });

  describe('gt', () => {
    it('should be valid', () => {
      const validator = new Validator({ key: 2 }, { key: 'gt:1' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('should be invalid', () => {
      const validator = new Validator({ key: 1 }, { key: 'gt:1' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(
        validator.firstError() === 'key must be greater than 1',
        'message should be "key must be greater than 1'
      );
    });
  });

  describe('gt', () => {
    it('should be valid', () => {
      const validator = new Validator({ key: 'https://www.facebook.com' }, { key: 'url' });
      const isValid = !validator.isFailed();
      assert.isTrue(isValid);
    });

    it('should be invalid', () => {
      const validator = new Validator({ key: 'asdfsdfasdf' }, { key: 'url' });
      const isValid = !validator.isFailed();
      assert.isFalse(isValid);
      assert.isTrue(validator.firstError() === 'key must be url', 'message should be "key must be url');
    });
  });
});
