const compare = (
  param1: string | boolean | number,
  operator: string,
  param2: string | boolean | number
): boolean => {
  switch (operator) {
    case ">":
      return param1 > param2;
    case "<":
      return param1 < param2;
    case ">=":
      return param1 >= param2;
    case "<=":
      return param1 <= param2;
    case "==":
      return param1 == param2;
    case "!=":
      return param1 != param2;
    case "===":
      return param1 === param2;
    case "!==":
      return param1 !== param2;
    default:
      return false;
  }
};

export default compare;
