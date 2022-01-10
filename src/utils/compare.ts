const compare = (param1: string|boolean|number, operator: string, param2: string|boolean|number) => {
  switch (operator) {
    case '>': return param1 > param2;
    case '<': return param1 < param2;
    case '>=': return param1 >= param2;
    case '<=': return param1 <= param2;
    case '==': return param1 == param2;
    case '!=': return param1 != param2;
    case '===': return param1 === param2;
    case '!==': return param1 !== param2;
  }
}

export default compare;
