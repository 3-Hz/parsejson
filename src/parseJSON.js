var parseJSON = function(json) {
  let i = 0;
  return parseValue();

  function parseValue() {
    skipWhiteSpace();
    const value =
      parseString() ??
      parseNumber() ??
      parseObject() ??
      parseArray() ??
      parseKeyword('true', true) ??
      parseKeyword('false', false) ??
      parseKeyword('null', null);
    skipWhiteSpace();
    return value;
  };

  function parseObject() {
    if (json[i] === '{') {
      i++;
      skipWhiteSpace();

      const result = {};

      let initial = true;

      while (json[i] !== '}') {
        checkForUnexpectedEndOfInput()
        if (!initial) {
          skipComma();
          skipWhiteSpace();
        }
        const key = parseString();
        skipWhiteSpace();
        skipColon();
        const value = parseValue();
        result[key] = value;
        initial = false;
      }
      i++;
      return result;
    }
  };

  function parseArray() {
    if (json[i] === '[') {
      i++;
      skipWhiteSpace();

      const result = [];

      let initial = true;

      while (json[i] !== ']') {
        checkForUnexpectedEndOfInput()
        if (!initial) {
          skipComma();
        }
        const value = parseValue();
        result.push(value);
        initial = false;
      }
      i++;
      return result;
    }
  };

  function parseString() {
    if (json[i] === '"') {
      i++;
      let result = '';
      while (json[i] !== '"') {
        checkForUnexpectedEndOfInput()
        if (json[i] === '\\') {
          const char = json[i + 1];
          if (
            char === '"' ||
            char === '\\' ||
            char === '/' ||
            char === 'b' ||
            char === 'f' ||
            char === 'n' ||
            char === 'r' ||
            char === 't'
          ) {
            result += char;
            i++;
          } else if (char === 'u') {
            if (
              isHexadecimal(json[i + 2]) &&
              isHexadecimal(json[i + 3]) &&
              isHexadecimal(json[i + 4]) &&
              isHexadecimal(json[i + 5])
            ) {
              result += String.fromCharCode(
                parseInt(json.slice(i + 2, i + 6), 16)
              );
              i += 5;
            }
          }
        } else {
          result +=  json[i];
        }
        i++;
      }
      i++;
      return result;
    }
  };

  function parseNumber() {
    let start = i;
    if (json[i] === '-') {
      i++;
    }
    if (json[i] === '0') {
      i++;
    } else if (json[i] >= '1' && json[i] <= '9') {
      i++;
      while (json[i] >= '0' && json[i] <= '9') {
        checkForUnexpectedEndOfInput()
        i++;
      }
    }

    if (json[i] === '.') {
      i++;
      while (json[i] >= '0' && json[i] <= '9') {
        checkForUnexpectedEndOfInput()
        i++;
      }
    }
    if (json[i] === 'e' || json[i] === 'E') {
      i++;
      if (json[i] === '-' || json[i] === '+') {
        i++;
      }
      while (json[i] >= '0' && json[i] <= '9') {
        checkForUnexpectedEndOfInput()
        i++;
      }
    }
    if (i > start) {
      return Number(json.slice(start, i));
    }
  };

  function parseKeyword(name, value) {
    if (json.slice(i, i + name.length) === name) {
      i += name.length;
      return value;
    }
  };

  function checkForUnexpectedEndOfInput() {
    if (json[i] === undefined) {
      throw new Error('SyntaxError');
    }
  };

  function isHexadecimal(char) {
    return (
      (char >= '0' && char <= '9') ||
      (char.toLowerCase() >= 'a' && char.toLowerCase() <= 'f')
    );
  };

  function skipComma() {
    if (json[i] !== ',') {
      throw new Error('SyntaxError');
    }
    i++;
  };

  function skipColon() {
    if (json[i] !== ':') {
      throw new Error('SyntaxError');
    }
    i++;
  };

  function skipWhiteSpace() {
    while (json[i] === ' ' || json[i] === '\r' || json[i] === '\n' || json[i] === '\t') {
      i++;
    }
  };
};