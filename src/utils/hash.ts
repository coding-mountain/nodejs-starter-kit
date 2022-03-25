import { genSalt, hash, compareSync } from 'bcrypt';

class Hash {
  static saltRounds: number = 10;

  /**
   * create password hash
   *
   * @param   {string<string>}   password  [password of user]
   *
   * @return  {Promise<string>}            [return hashed password]
   */
  static async create(password: string): Promise<string> {
    const salt = await genSalt(Hash.saltRounds);
    return hash(password, salt);
  }

  /**
   * [compare description]
   *
   * @param   {string}   compareText  [compareText description]
   * @param   {string}   hashText     [hashText description]
   *
   * @return  {boolean}               [return description]
   */
  static compare(compareText: string, hashText: string): boolean {
    return compareSync(compareText, hashText);
  }
}

export default Hash;
