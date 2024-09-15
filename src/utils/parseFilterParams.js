const parseNameType = (nameType) => {
  const isString = typeof nameType === 'string';

  if (!isString) {
    return;
  }
  const isNameType = (nameType) =>
    ['HTML&CSS', 'JS', 'React', 'TS', 'Node.js'].includes(nameType);

  if (isNameType(nameType)) {
    return nameType;
  }
};

// * В том випадку якщо є числа
// const parseNumber = (number) => {
//   const isString = typeof number === 'string';

//   if (!isString) {
//     return;
//   }

//   const parsedNumber = parseInt(number);

//   if (Number.isNaN(parsedNumber)) {
//     return;
//   }

//   return parsedNumber;
// };

const parseFilterParams = (query) => {
  const { nameType } = query;

  const parsedNameType = parseNameType(nameType);

  return {
    nameType: parsedNameType,
  };
};

export default parseFilterParams;
