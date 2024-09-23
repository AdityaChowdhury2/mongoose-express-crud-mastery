import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface DeepFreezeObject {
  [key: string]: string | number | DeepFreezeObject;
}

function deepFreeze<T>(obj: T): T {
  if (typeof obj === 'object' && obj !== null) {
    Object.keys(obj).forEach((key) => {
      const value = (obj as unknown as DeepFreezeObject)[key];
      if (
        typeof value === 'object' &&
        value !== null &&
        !Object.isFrozen(value)
      ) {
        deepFreeze(value);
      }
    });
    return Object.freeze(obj);
  }
  return obj;
}

// const getMySqlUri = (): string => {
//   const {
//     MYSQL_HOST,
//     MYSQL_PORT,
//     MYSQL_DB_NAME,
//     MYSQL_USER,
//     MYSQL_PASSWORD,
//     MYSQL_URI,
//   } = process.env;
//   if (
//     MYSQL_HOST &&
//     MYSQL_PORT &&
//     MYSQL_DB_NAME &&
//     MYSQL_USER &&
//     MYSQL_PASSWORD &&
//     MYSQL_URI
//   ) {
//     return MYSQL_URI.replace('<username>', MYSQL_USER)
//       .replace('<password>', MYSQL_PASSWORD)
//       .replace('<host>', MYSQL_HOST)
//       .replace('<port>', MYSQL_PORT)
//       .replace('<database>', MYSQL_DB_NAME);
//   }
//   return '';
// };

const getMongoUri = (): string => {
  const { DB_USER, DB_PASSWORD, DB_URI } = process.env;
  if (!DB_USER || !DB_PASSWORD || !DB_URI) {
    throw new Error('DB_USER, DB_PASSWORD, DB_URI are required');
  }
  return `${DB_URI.replace('<username>', DB_USER).replace('<password>', DB_PASSWORD)}`;
};

export default deepFreeze({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  db: {
    // uri: getMySqlUri(),
    uri: getMongoUri(),
  },
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND as string,
});
