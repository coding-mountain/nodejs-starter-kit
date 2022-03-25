import { ValidationException } from '@app/exceptions';
import {
  isValidEmail,
  isValidPhone,
  isAlphabetic,
  isAlphaNumeric,
  isAlphabeticWithSpace,
  isValidDate,
} from '@app/libs/validator/utils';

interface Obj {
  [index: string]: any;
}

interface Err {
  [index: string]: string;
}

interface Message {
  [index: string]: string;
}

type KnownFieldList = (string | [string, KnownFieldList])[];

class Validator {
  protected rules: Obj;

  protected inputs: Obj;

  protected message: Message;

  protected separator: string;

  protected errors: Err;

  protected isRan: boolean;

  protected knownFields: KnownFieldList;

  constructor(
    inputs: Obj = {},
    rules: Obj = {},
    knownFields: KnownFieldList = [],
    message: Message = {},
    separator: string = '|'
  ) {
    this.inputs = inputs;
    this.rules = rules;
    this.message = message;
    this.separator = separator;
    this.errors = {};
    this.isRan = false;
    this.knownFields = knownFields;
  }

  getError(key: string) {
    return this.errors[key];
  }

  firstError() {
    const keys: Array<string> = Object.keys(this.errors);
    return this.errors[keys[0]] || '';
  }

  setError(key: string, message: string) {
    this.errors[key] = this.message[key] || message;
  }

  isOk() {
    return !this.isFailed();
  }

  isFailed() {
    if (!this.isRan) {
      this.run();
    }
    return Object.keys(this.errors).length;
  }

  /*
  example
  fields ={
    name:'ram',
    contact:[
      {
        type:'landline',
        number:'9876543210'
      },
      {
        type:'mobile',
        number:'9876543210'
      }
    ],
    hobby:['play','sing'],
    parents:{
      father:"ram senior"
      mother:"sita"
    }
  }

  knownFields = [
    'name',
    ['contact',['type','number']],
    ['hobby',['!']]   // "!" means ignore childern
    ['parents',['father','mother']]
  ]
*/
  checkUnknownFields(fields: Record<any, any>, knownFields: KnownFieldList) {
    if (!knownFields.length) {
      return;
    }
    let flatKnownFields: KnownFieldList = [];
    flatKnownFields = flatKnownFields.concat(...knownFields);
    const fieldKeys = Object.keys(fields);
    for (const key of fieldKeys) {
      const currentKeyIndex = flatKnownFields.indexOf(key);
      if (currentKeyIndex < 0) {
        this.setError(key, `Unknown parameter: ${key}`);
      } else if (typeof fields[key] === 'object') {
        const nestedKnownFields = flatKnownFields[currentKeyIndex + 1];
        if (nestedKnownFields[0] !== '!') {
          if (typeof nestedKnownFields === 'string') {
            throw new Error('Expected nested Known Fields but got string');
          }
          if (Array.isArray(fields[key]) && Array.isArray(nestedKnownFields)) {
            for (const item of fields[key]) {
              this.checkUnknownFields(item, nestedKnownFields as KnownFieldList);
            }
          } else if (typeof nestedKnownFields === 'object') {
            this.checkUnknownFields(fields[key], nestedKnownFields as KnownFieldList);
          }
        }
      }
    }
  }

  hasInput(key: string) {
    const value = this.getInput(key);
    return value !== undefined && value !== null && value !== '';
  }

  getInput(key: string) {
    const keys = key.split('.');
    if (keys.length > 1) {
      let value: any;
      for (const k of keys) {
        if (!value) {
          value = this.inputs[k];
        } else {
          value = value[k];
        }
      }
      return value;
    }
    return this.inputs[key];
  }

  setInput(key: string, value: any) {
    this.inputs[key] = value;
  }

  values() {
    return this.inputs;
  }

  static isSingleValue(string: string) {
    return string.startsWith('[') && string.endsWith(']');
  }

  public run() {
    this.checkUnknownFields(this.inputs, this.knownFields);
    for (const key of Object.keys(this.rules)) {
      const rules = this.extractRules(this.rules[key]);
      this.validate(key, rules);
    }
    this.isRan = true;
  }

  private extractRules(rule: string | Array<string>) {
    let ruleArray: Array<String> = [];
    if (typeof rule === 'string') {
      ruleArray = rule.split(this.separator).map((x) => x.trim());
    }

    const res: Obj[] = [];
    for (const ruleString of ruleArray) {
      const ruleAndParams: Array<string> = ruleString.split(':').map((s) => s.trim());
      if (ruleAndParams.length > 2) {
        throw new ValidationException('dont support multiple ":" in rule');
      }
      const [ruleKey, param] = ruleAndParams;

      let paramsArray: Array<string> = [];
      if (!param) {
        paramsArray = [];
      } else if (Validator.isSingleValue(param)) {
        paramsArray = [param.slice(1, -1)];
      } else if (param.includes(',')) {
        paramsArray = param.split(',');
      } else {
        paramsArray = [param];
      }
      res.push({ key: ruleKey, params: paramsArray });
    }

    return res;
  }

  private validate(field: string, rules: Obj[]) {
    for (const { key, params } of rules) {
      const func = this[`$${key}` as Exclude<keyof Validator, 'checkUnknownFields'>];

      if (typeof func !== 'function') {
        throw new Error(`Invalid rule "${key}"`);
      }

      if (!func.bind(this)(field, params)) {
        break;
      }
    }
  }

  // custom rules

  // value is required
  $required(key: string): boolean {
    if (!this.hasInput(key) && this.getInput(key) !== 0) {
      this.setError(key, `${key} is required`);
      return false;
    }
    return true;
  }

  // value must be email
  $email(key: string): boolean {
    if (this.hasInput(key) && !isValidEmail(this.getInput(key))) {
      this.setError(key, 'Invalid email address');
      return false;
    }

    return true;
  }

  // value must be phone
  $phone(key: string): boolean {
    if (this.hasInput(key) && !isValidPhone(this.getInput(key))) {
      this.setError(key, 'Invalid Phone');
      return false;
    }
    return true;
  }

  $anyOne(key: string, params: Array<string>): boolean {
    if (this.hasInput(key) && !params.includes(this.getInput(key))) {
      this.setError(key, `Invalid value for ${key}`);
      return false;
    }
    return true;
  }

  $min(key: string, params: Array<string>): boolean {
    if (!params) throw new Error('maximum number is required');

    if (!this.hasInput(key)) return false;

    if (Number(params[0]) > this.getInput(key).length) {
      this.setError(key, `${key} must be at least ${params[0]} characters long`);
      return false;
    }

    return true;
  }

  $max(key: string, params: Array<string>): boolean {
    if (!params) throw new Error('minimum number is required');

    if (!this.hasInput(key)) return false;

    if (Number(params[0]) < this.getInput(key).length) {
      this.setError(key, `${key} must be less then or equals to ${params[0]} characters`);
      return false;
    }

    return true;
  }

  $regex(key: string, params: Array<string>): boolean {
    if (!params) throw new Error('regex is required');

    const regex = new RegExp(params[0]);

    if (this.hasInput(key) && !regex.test(this.getInput(key))) {
      this.setError(key, `${key} is invalid`);
      return false;
    }

    return true;
  }

  $alphabet(key: string): boolean {
    if (this.hasInput(key) && !isAlphabetic(this.getInput(key))) {
      this.setError(key, `${key} can only contain alphabets`);
      return false;
    }
    return true;
  }

  $alphanumeric(key: string): boolean {
    if (this.hasInput(key) && !isAlphaNumeric(this.getInput(key))) {
      this.setError(key, `${key} must be alphanumeric`);
      return false;
    }
    return true;
  }

  $array(key: string) {
    if (this.hasInput(key) && (!Array.isArray(this.getInput(key)) || !this.getInput(key).length)) {
      this.setError(key, `${key} is required`);
      return false;
    }
    return true;
  }

  $alphabetWithSpace(key: string): boolean {
    if (this.hasInput(key) && !isAlphabeticWithSpace(this.getInput(key))) {
      this.setError(key, `${key} can only contain alphabets`);
      return false;
    }
    return true;
  }

  $object(key: string): boolean {
    if (this.hasInput(key) && typeof this.getInput(key) !== 'object') {
      this.setError(key, `${key} must be an object`);
      return false;
    }
    return true;
  }

  $number(key: string): boolean {
    const value = Number(this.getInput(key));
    if (this.hasInput(key) && Number.isNaN(value)) {
      this.setError(key, `${key} must be number`);
      return false;
    }
    return true;
  }

  $lt(key: string, params: Array<string>): boolean {
    const value = Number(this.getInput(key));
    if (this.hasInput(key) && value >= Number(params[0])) {
      this.setError(key, `${key} must be less than ${params[0]}`);
      return false;
    }
    return true;
  }

  $gt(key: string, params: Array<string>): boolean {
    const value = Number(this.getInput(key));
    if (this.hasInput(key) && value <= Number(params[0])) {
      this.setError(key, `${key} must be greater than ${params[0]}`);
      return false;
    }
    return true;
  }

  $date(key: string): boolean {
    if (this.hasInput(key) && !isValidDate(this.getInput(key))) {
      this.setError(key, `${key} must be date`);
      return false;
    }
    return true;
  }

  $url(key: string, params: Array<string>): boolean {
    const value = String(this.getInput(key));
    const urlRegex =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/; // eslint-disable-line no-useless-escape
    const regex = new RegExp(params ? params[0] : '');
    if (this.hasInput(key) && (!value.match(urlRegex) || !regex.test(this.getInput(key)))) {
      this.setError(key, `${key} must be url`);
      return false;
    }
    return true;
  }

  $string(key: string): boolean {
    if (this.hasInput(key) && typeof this.getInput(key) !== 'string') {
      this.setError(key, `${key} must be string`);
      return false;
    }
    return true;
  }

  $boolean(key: string): boolean {
    if (this.hasInput(key) && typeof this.getInput(key) !== 'boolean') {
      this.setError(key, `${key} must be boolean`);
      return false;
    }
    return true;
  }
}

export default Validator;
