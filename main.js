(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Parameter$GetViewport = function (a) {
	return {$: 'GetViewport', a: a};
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var $author$project$Parameter$Game_Set = function (light) {
	return function (light_path) {
		return function (objects) {
			return function (windowsize) {
				return function (gamestate) {
					return function (uppos) {
						return function (timer) {
							return function (map) {
								return function (todo) {
									return function (maptimer) {
										return function (score) {
											return {gamestate: gamestate, light: light, light_path: light_path, map: map, maptimer: maptimer, objects: objects, score: score, timer: timer, todo: todo, uppos: uppos, windowsize: windowsize};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Parameter$Line_element = F2(
	function (head, tail) {
		return {head: head, tail: tail};
	});
var $author$project$Parameter$Model = function (gameset) {
	return function (seed) {
		return function (events) {
			return function (clickpos) {
				return function (place_state) {
					return function (progress) {
						return function (animatecurtain) {
							return function (button) {
								return function (scoreboard) {
									return function (highscore) {
										return function (instructions) {
											return function (volume) {
												return {animatecurtain: animatecurtain, button: button, clickpos: clickpos, events: events, gameset: gameset, highscore: highscore, instructions: instructions, place_state: place_state, progress: progress, scoreboard: scoreboard, seed: seed, volume: volume};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Parameter$None = {$: 'None'};
var $author$project$Parameter$Openanimation = {$: 'Openanimation'};
var $author$project$Parameter$Playing = {$: 'Playing'};
var $author$project$Parameter$Select_Pos = {$: 'Select_Pos'};
var $author$project$Parameter$Begin = {$: 'Begin'};
var $mdgriffith$elm_style_animation$Animation$Model$Animation = function (a) {
	return {$: 'Animation', a: a};
};
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $mdgriffith$elm_style_animation$Animation$initialState = function (current) {
	return $mdgriffith$elm_style_animation$Animation$Model$Animation(
		{
			interruption: _List_Nil,
			running: false,
			steps: _List_Nil,
			style: current,
			timing: {
				current: $elm$time$Time$millisToPosix(0),
				dt: $elm$time$Time$millisToPosix(0)
			}
		});
};
var $mdgriffith$elm_style_animation$Animation$Model$Easing = function (a) {
	return {$: 'Easing', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Spring = function (a) {
	return {$: 'Spring', a: a};
};
var $elm$core$Basics$pi = _Basics_pi;
var $mdgriffith$elm_style_animation$Animation$Model$AtSpeed = function (a) {
	return {$: 'AtSpeed', a: a};
};
var $mdgriffith$elm_style_animation$Animation$speed = function (speedValue) {
	return $mdgriffith$elm_style_animation$Animation$Model$AtSpeed(speedValue);
};
var $mdgriffith$elm_style_animation$Animation$defaultInterpolationByProperty = function (prop) {
	var linear = function (duration) {
		return $mdgriffith$elm_style_animation$Animation$Model$Easing(
			{duration: duration, ease: $elm$core$Basics$identity, progress: 1, start: 0});
	};
	var defaultSpring = $mdgriffith$elm_style_animation$Animation$Model$Spring(
		{damping: 26, stiffness: 170});
	switch (prop.$) {
		case 'ExactProperty':
			return defaultSpring;
		case 'ColorProperty':
			return linear(
				$elm$time$Time$millisToPosix(400));
		case 'ShadowProperty':
			return defaultSpring;
		case 'Property':
			return defaultSpring;
		case 'Property2':
			return defaultSpring;
		case 'Property3':
			var name = prop.a;
			return (name === 'rotate3d') ? $mdgriffith$elm_style_animation$Animation$speed(
				{perSecond: $elm$core$Basics$pi}) : defaultSpring;
		case 'Property4':
			return defaultSpring;
		case 'AngleProperty':
			return $mdgriffith$elm_style_animation$Animation$speed(
				{perSecond: $elm$core$Basics$pi});
		case 'Points':
			return defaultSpring;
		default:
			return defaultSpring;
	}
};
var $mdgriffith$elm_style_animation$Animation$Model$AngleProperty = F2(
	function (a, b) {
		return {$: 'AngleProperty', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$ColorProperty = F5(
	function (a, b, c, d, e) {
		return {$: 'ColorProperty', a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_style_animation$Animation$Model$ExactProperty = F2(
	function (a, b) {
		return {$: 'ExactProperty', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Path = function (a) {
	return {$: 'Path', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Points = function (a) {
	return {$: 'Points', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Property = F2(
	function (a, b) {
		return {$: 'Property', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Property2 = F3(
	function (a, b, c) {
		return {$: 'Property2', a: a, b: b, c: c};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Property3 = F4(
	function (a, b, c, d) {
		return {$: 'Property3', a: a, b: b, c: c, d: d};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Property4 = F5(
	function (a, b, c, d, e) {
		return {$: 'Property4', a: a, b: b, c: c, d: d, e: e};
	});
var $mdgriffith$elm_style_animation$Animation$Model$ShadowProperty = F3(
	function (a, b, c) {
		return {$: 'ShadowProperty', a: a, b: b, c: c};
	});
var $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc = function (a) {
	return {$: 'AntiClockwiseArc', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc = function (a) {
	return {$: 'ClockwiseArc', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Close = {$: 'Close'};
var $mdgriffith$elm_style_animation$Animation$Model$Curve = function (a) {
	return {$: 'Curve', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$CurveTo = function (a) {
	return {$: 'CurveTo', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Horizontal = function (a) {
	return {$: 'Horizontal', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo = function (a) {
	return {$: 'HorizontalTo', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Line = F2(
	function (a, b) {
		return {$: 'Line', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$LineTo = F2(
	function (a, b) {
		return {$: 'LineTo', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Move = F2(
	function (a, b) {
		return {$: 'Move', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$MoveTo = F2(
	function (a, b) {
		return {$: 'MoveTo', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Quadratic = function (a) {
	return {$: 'Quadratic', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo = function (a) {
	return {$: 'QuadraticTo', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Smooth = function (a) {
	return {$: 'Smooth', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic = function (a) {
	return {$: 'SmoothQuadratic', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo = function (a) {
	return {$: 'SmoothQuadraticTo', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$SmoothTo = function (a) {
	return {$: 'SmoothTo', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Vertical = function (a) {
	return {$: 'Vertical', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$VerticalTo = function (a) {
	return {$: 'VerticalTo', a: a};
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $mdgriffith$elm_style_animation$Animation$Model$mapPathMotion = F2(
	function (fn, cmd) {
		var mapCoords = function (coords) {
			return A2(
				$elm$core$List$map,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return _Utils_Tuple2(
						fn(x),
						fn(y));
				},
				coords);
		};
		switch (cmd.$) {
			case 'Move':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Move,
					fn(m1),
					fn(m2));
			case 'MoveTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$MoveTo,
					fn(m1),
					fn(m2));
			case 'Line':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Line,
					fn(m1),
					fn(m2));
			case 'LineTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$LineTo,
					fn(m1),
					fn(m2));
			case 'Horizontal':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Horizontal(
					fn(motion));
			case 'HorizontalTo':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo(
					fn(motion));
			case 'Vertical':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Vertical(
					fn(motion));
			case 'VerticalTo':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$VerticalTo(
					fn(motion));
			case 'Curve':
				var control1 = cmd.a.control1;
				var control2 = cmd.a.control2;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$Curve(
					{
						control1: _Utils_Tuple2(
							fn(control1.a),
							fn(control1.b)),
						control2: _Utils_Tuple2(
							fn(control2.a),
							fn(control2.b)),
						point: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 'CurveTo':
				var control1 = cmd.a.control1;
				var control2 = cmd.a.control2;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$CurveTo(
					{
						control1: _Utils_Tuple2(
							fn(control1.a),
							fn(control1.b)),
						control2: _Utils_Tuple2(
							fn(control2.a),
							fn(control2.b)),
						point: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 'Quadratic':
				var control = cmd.a.control;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$Quadratic(
					{
						control: _Utils_Tuple2(
							fn(control.a),
							fn(control.b)),
						point: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 'QuadraticTo':
				var control = cmd.a.control;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo(
					{
						control: _Utils_Tuple2(
							fn(control.a),
							fn(control.b)),
						point: _Utils_Tuple2(
							fn(point.a),
							fn(point.b))
					});
			case 'SmoothQuadratic':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic(
					mapCoords(coords));
			case 'SmoothQuadraticTo':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo(
					mapCoords(coords));
			case 'Smooth':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Smooth(
					mapCoords(coords));
			case 'SmoothTo':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothTo(
					mapCoords(coords));
			case 'ClockwiseArc':
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc(
					function () {
						var y = arc.y;
						var x = arc.x;
						var startAngle = arc.startAngle;
						var radius = arc.radius;
						var endAngle = arc.endAngle;
						return _Utils_update(
							arc,
							{
								endAngle: fn(endAngle),
								radius: fn(radius),
								startAngle: fn(startAngle),
								x: fn(x),
								y: fn(y)
							});
					}());
			case 'AntiClockwiseArc':
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc(
					function () {
						var y = arc.y;
						var x = arc.x;
						var startAngle = arc.startAngle;
						var radius = arc.radius;
						var endAngle = arc.endAngle;
						return _Utils_update(
							arc,
							{
								endAngle: fn(endAngle),
								radius: fn(radius),
								startAngle: fn(startAngle),
								x: fn(x),
								y: fn(y)
							});
					}());
			default:
				return $mdgriffith$elm_style_animation$Animation$Model$Close;
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$mapToMotion = F2(
	function (fn, prop) {
		switch (prop.$) {
			case 'ExactProperty':
				var name = prop.a;
				var value = prop.b;
				return A2($mdgriffith$elm_style_animation$Animation$Model$ExactProperty, name, value);
			case 'ColorProperty':
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				var m3 = prop.d;
				var m4 = prop.e;
				return A5(
					$mdgriffith$elm_style_animation$Animation$Model$ColorProperty,
					name,
					fn(m1),
					fn(m2),
					fn(m3),
					fn(m4));
			case 'ShadowProperty':
				var name = prop.a;
				var inset = prop.b;
				var shadow = prop.c;
				var size = shadow.size;
				var red = shadow.red;
				var offsetY = shadow.offsetY;
				var offsetX = shadow.offsetX;
				var green = shadow.green;
				var blur = shadow.blur;
				var blue = shadow.blue;
				var alpha = shadow.alpha;
				return A3(
					$mdgriffith$elm_style_animation$Animation$Model$ShadowProperty,
					name,
					inset,
					{
						alpha: fn(alpha),
						blue: fn(blue),
						blur: fn(blur),
						green: fn(green),
						offsetX: fn(offsetX),
						offsetY: fn(offsetY),
						red: fn(red),
						size: fn(size)
					});
			case 'Property':
				var name = prop.a;
				var m1 = prop.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Property,
					name,
					fn(m1));
			case 'Property2':
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				return A3(
					$mdgriffith$elm_style_animation$Animation$Model$Property2,
					name,
					fn(m1),
					fn(m2));
			case 'Property3':
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				var m3 = prop.d;
				return A4(
					$mdgriffith$elm_style_animation$Animation$Model$Property3,
					name,
					fn(m1),
					fn(m2),
					fn(m3));
			case 'Property4':
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				var m3 = prop.d;
				var m4 = prop.e;
				return A5(
					$mdgriffith$elm_style_animation$Animation$Model$Property4,
					name,
					fn(m1),
					fn(m2),
					fn(m3),
					fn(m4));
			case 'AngleProperty':
				var name = prop.a;
				var m1 = prop.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$AngleProperty,
					name,
					fn(m1));
			case 'Points':
				var ms = prop.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Points(
					A2(
						$elm$core$List$map,
						function (_v1) {
							var x = _v1.a;
							var y = _v1.b;
							return _Utils_Tuple2(
								fn(x),
								fn(y));
						},
						ms));
			default:
				var cmds = prop.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Path(
					A2(
						$elm$core$List$map,
						$mdgriffith$elm_style_animation$Animation$Model$mapPathMotion(fn),
						cmds));
		}
	});
var $mdgriffith$elm_style_animation$Animation$setDefaultInterpolation = function (prop) {
	var interp = $mdgriffith$elm_style_animation$Animation$defaultInterpolationByProperty(prop);
	return A2(
		$mdgriffith$elm_style_animation$Animation$Model$mapToMotion,
		function (m) {
			return _Utils_update(
				m,
				{interpolation: interp});
		},
		prop);
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $mdgriffith$elm_style_animation$Animation$Render$dropWhile = F2(
	function (predicate, list) {
		dropWhile:
		while (true) {
			if (!list.b) {
				return _List_Nil;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					var $temp$predicate = predicate,
						$temp$list = xs;
					predicate = $temp$predicate;
					list = $temp$list;
					continue dropWhile;
				} else {
					return list;
				}
			}
		}
	});
var $mdgriffith$elm_style_animation$Animation$Render$takeWhile = function (predicate) {
	var takeWhileMemo = F2(
		function (memo, list) {
			takeWhileMemo:
			while (true) {
				if (!list.b) {
					return $elm$core$List$reverse(memo);
				} else {
					var x = list.a;
					var xs = list.b;
					if (predicate(x)) {
						var $temp$memo = A2($elm$core$List$cons, x, memo),
							$temp$list = xs;
						memo = $temp$memo;
						list = $temp$list;
						continue takeWhileMemo;
					} else {
						return $elm$core$List$reverse(memo);
					}
				}
			}
		});
	return takeWhileMemo(_List_Nil);
};
var $mdgriffith$elm_style_animation$Animation$Render$span = F2(
	function (p, xs) {
		return _Utils_Tuple2(
			A2($mdgriffith$elm_style_animation$Animation$Render$takeWhile, p, xs),
			A2($mdgriffith$elm_style_animation$Animation$Render$dropWhile, p, xs));
	});
var $mdgriffith$elm_style_animation$Animation$Render$groupWhile = F2(
	function (eq, xs_) {
		if (!xs_.b) {
			return _List_Nil;
		} else {
			var x = xs_.a;
			var xs = xs_.b;
			var _v1 = A2(
				$mdgriffith$elm_style_animation$Animation$Render$span,
				eq(x),
				xs);
			var ys = _v1.a;
			var zs = _v1.b;
			return A2(
				$elm$core$List$cons,
				A2($elm$core$List$cons, x, ys),
				A2($mdgriffith$elm_style_animation$Animation$Render$groupWhile, eq, zs));
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $mdgriffith$elm_style_animation$Animation$Model$propertyName = function (prop) {
	switch (prop.$) {
		case 'ExactProperty':
			var name = prop.a;
			return name;
		case 'ColorProperty':
			var name = prop.a;
			return name;
		case 'ShadowProperty':
			var name = prop.a;
			return name;
		case 'Property':
			var name = prop.a;
			return name;
		case 'Property2':
			var name = prop.a;
			return name;
		case 'Property3':
			var name = prop.a;
			return name;
		case 'Property4':
			var name = prop.a;
			return name;
		case 'AngleProperty':
			var name = prop.a;
			return name;
		case 'Points':
			return 'points';
		default:
			return 'path';
	}
};
var $mdgriffith$elm_style_animation$Animation$Render$isTransformation = function (prop) {
	return A2(
		$elm$core$List$member,
		$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop),
		_List_fromArray(
			['rotate', 'rotateX', 'rotateY', 'rotateZ', 'rotate3d', 'translate', 'translate3d', 'scale', 'scale3d']));
};
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $mdgriffith$elm_style_animation$Animation$Render$warnForDoubleListedProperties = function (props) {
	var _v0 = A2(
		$elm$core$List$map,
		function (propGroup) {
			var _v1 = $elm$core$List$head(propGroup);
			if (_v1.$ === 'Nothing') {
				return '';
			} else {
				var name = _v1.a;
				return ($elm$core$List$length(propGroup) > 1) ? '' : '';
			}
		},
		A2(
			$mdgriffith$elm_style_animation$Animation$Render$groupWhile,
			$elm$core$Basics$eq,
			$elm$core$List$sort(
				A2(
					$elm$core$List$map,
					$mdgriffith$elm_style_animation$Animation$Model$propertyName,
					A2(
						$elm$core$List$filter,
						function (prop) {
							return !$mdgriffith$elm_style_animation$Animation$Render$isTransformation(prop);
						},
						props)))));
	return props;
};
var $mdgriffith$elm_style_animation$Animation$style = function (props) {
	return $mdgriffith$elm_style_animation$Animation$initialState(
		A2(
			$elm$core$List$map,
			$mdgriffith$elm_style_animation$Animation$setDefaultInterpolation,
			$mdgriffith$elm_style_animation$Animation$Render$warnForDoubleListedProperties(props)));
};
var $author$project$Parameter$init_board = {
	board: $mdgriffith$elm_style_animation$Animation$style(_List_Nil),
	menu_button: $mdgriffith$elm_style_animation$Animation$style(_List_Nil),
	newrecord: $mdgriffith$elm_style_animation$Animation$style(_List_Nil),
	reset_button: $mdgriffith$elm_style_animation$Animation$style(_List_Nil),
	score: _Utils_Tuple2(
		$mdgriffith$elm_style_animation$Animation$style(_List_Nil),
		0),
	state: $author$project$Parameter$Begin
};
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 'Seed', a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $author$project$Parameter$Empty = {$: 'Empty'};
var $author$project$Parameter$map_initial_empty = function (n) {
	return (!n) ? _List_Nil : A2(
		$elm$core$List$cons,
		$author$project$Parameter$Empty,
		$author$project$Parameter$map_initial_empty(n - 1));
};
var $author$project$Parameter$right_bound = 12;
var $author$project$Parameter$map_initial = _List_fromArray(
	[
		$author$project$Parameter$map_initial_empty($author$project$Parameter$right_bound)
	]);
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $mdgriffith$elm_style_animation$Animation$initMotion = F2(
	function (position, unit) {
		return {
			interpolation: $mdgriffith$elm_style_animation$Animation$Model$Spring(
				{damping: 26, stiffness: 170}),
			interpolationOverride: $elm$core$Maybe$Nothing,
			position: position,
			target: position,
			unit: unit,
			velocity: 0
		};
	});
var $mdgriffith$elm_style_animation$Animation$custom = F3(
	function (name, value, unit) {
		return A2(
			$mdgriffith$elm_style_animation$Animation$Model$Property,
			name,
			A2($mdgriffith$elm_style_animation$Animation$initMotion, value, unit));
	});
var $mdgriffith$elm_style_animation$Animation$opacity = function (val) {
	return A3($mdgriffith$elm_style_animation$Animation$custom, 'opacity', val, '');
};
var $author$project$Parameter$init_model = function () {
	var t = _List_fromArray(
		[
			_Utils_Tuple2(1, 1)
		]);
	var m = $author$project$Parameter$map_initial;
	var set = $author$project$Parameter$Game_Set(
		_List_fromArray(
			[
				A2(
				$author$project$Parameter$Line_element,
				_Utils_Tuple2(5, -1),
				_Utils_Tuple2(5, 10)),
				A2(
				$author$project$Parameter$Line_element,
				_Utils_Tuple2(4, -1),
				_Utils_Tuple2(4, 10))
			]))(_List_Nil)(_List_Nil)(
		_Utils_Tuple2(0, 10))($author$project$Parameter$Playing)(0)(0)(m)(t)(0)(_List_Nil);
	return $author$project$Parameter$Model(set)(
		$elm$random$Random$initialSeed(2))($author$project$Parameter$None)(
		_Utils_Tuple2(0, 0))($author$project$Parameter$Select_Pos)($author$project$Parameter$Openanimation)(
		$mdgriffith$elm_style_animation$Animation$style(
			_List_fromArray(
				[
					$mdgriffith$elm_style_animation$Animation$opacity(0.0)
				])))(_List_Nil)($author$project$Parameter$init_board)(_List_Nil)(_List_Nil)(1);
}();
var $author$project$Parameter$Rocktype = function (a) {
	return {$: 'Rocktype', a: a};
};
var $elm$random$Random$Generate = function (a) {
	return {$: 'Generate', a: a};
};
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0.a;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = function (a) {
	return {$: 'Generator', a: a};
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0.a;
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v1 = genA(seed0);
				var a = _v1.a;
				var seed1 = _v1.b;
				return _Utils_Tuple2(
					func(a),
					seed1);
			});
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0.a;
		return $elm$random$Random$Generate(
			A2($elm$random$Random$map, func, generator));
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			$elm$random$Random$Generate(
				A2($elm$random$Random$map, tagger, generator)));
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return $elm$random$Random$Generator(
			function (seed0) {
				var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
				var lo = _v0.a;
				var hi = _v0.b;
				var range = (hi - lo) + 1;
				if (!((range - 1) & range)) {
					return _Utils_Tuple2(
						(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
						$elm$random$Random$next(seed0));
				} else {
					var threshhold = (((-range) >>> 0) % range) >>> 0;
					var accountForBias = function (seed) {
						accountForBias:
						while (true) {
							var x = $elm$random$Random$peel(seed);
							var seedN = $elm$random$Random$next(seed);
							if (_Utils_cmp(x, threshhold) < 0) {
								var $temp$seed = seedN;
								seed = $temp$seed;
								continue accountForBias;
							} else {
								return _Utils_Tuple2((x % range) + lo, seedN);
							}
						}
					};
					return accountForBias(seed0);
				}
			});
	});
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0.a;
		return $elm$random$Random$Generator(
			function (seed) {
				return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
			});
	});
var $author$project$Map$map_brick_random = A2(
	$elm$random$Random$list,
	11,
	A2($elm$random$Random$int, 6, 11));
var $author$project$Map$map_brick_generate = A2($elm$random$Random$generate, $author$project$Parameter$Rocktype, $author$project$Map$map_brick_random);
var $author$project$Main$init = function (a) {
	return _Utils_Tuple2(
		$author$project$Parameter$init_model,
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					A2($elm$core$Task$perform, $author$project$Parameter$GetViewport, $elm$browser$Browser$Dom$getViewport),
					$author$project$Map$map_brick_generate
				])));
};
var $author$project$Parameter$Animate = function (a) {
	return {$: 'Animate', a: a};
};
var $author$project$Parameter$Resize = F2(
	function (a, b) {
		return {$: 'Resize', a: a, b: b};
	});
var $author$project$Parameter$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $author$project$Parameter$Key_Down = function (a) {
	return {$: 'Key_Down', a: a};
};
var $author$project$Update$key_down = function (keycode) {
	return $author$project$Parameter$Key_Down(keycode);
};
var $author$project$Parameter$Key_Up = function (a) {
	return {$: 'Key_Up', a: a};
};
var $author$project$Update$key_up = function (keycode) {
	return $author$project$Parameter$Key_Up(keycode);
};
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 'Delta', a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {oldTime: oldTime, request: request, subs: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(_Utils_Tuple0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(_Utils_Tuple0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.request;
		var oldTime = _v0.oldTime;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 'Nothing') {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.subs;
		var oldTime = _v0.oldTime;
		var send = function (sub) {
			if (sub.$ === 'Time') {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 'Time', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (sub.$ === 'Time') {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrameDelta = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Delta(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrameDelta = $elm$browser$Browser$AnimationManager$onAnimationFrameDelta;
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keydown');
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keyup');
var $elm$browser$Browser$Events$Window = {$: 'Window'};
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		$elm$browser$Browser$Events$Window,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $mdgriffith$elm_style_animation$Animation$Model$Tick = function (a) {
	return {$: 'Tick', a: a};
};
var $mdgriffith$elm_style_animation$Animation$isRunning = function (_v0) {
	var model = _v0.a;
	return model.running;
};
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$AnimationManager$onAnimationFrame = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Time(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrame = $elm$browser$Browser$AnimationManager$onAnimationFrame;
var $mdgriffith$elm_style_animation$Animation$subscription = F2(
	function (msg, states) {
		return A2($elm$core$List$any, $mdgriffith$elm_style_animation$Animation$isRunning, states) ? A2(
			$elm$core$Platform$Sub$map,
			msg,
			$elm$browser$Browser$Events$onAnimationFrame($mdgriffith$elm_style_animation$Animation$Model$Tick)) : $elm$core$Platform$Sub$none;
	});
var $author$project$Main$subscriptions = function (model) {
	var scoreboard = function (_v1) {
		var board = _v1.board;
		var state = _v1.state;
		var score = _v1.score;
		var newrecord = _v1.newrecord;
		var reset_button = _v1.reset_button;
		var menu_button = _v1.menu_button;
		return _List_fromArray(
			[board, score.a, newrecord, reset_button, menu_button]);
	}(model.scoreboard);
	var allthings = $elm$core$List$concat(
		A2(
			$elm$core$List$map,
			function (_v0) {
				var anistate = _v0.anistate;
				var helppage = _v0.helppage;
				var buttontype = _v0.buttontype;
				return $elm$core$List$concat(
					_List_fromArray(
						[
							_List_fromArray(
							[anistate]),
							helppage
						]));
			},
			model.button));
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onAnimationFrameDelta($author$project$Parameter$Tick),
				$elm$browser$Browser$Events$onResize($author$project$Parameter$Resize),
				$elm$browser$Browser$Events$onKeyDown(
				A2($elm$json$Json$Decode$map, $author$project$Update$key_down, $elm$html$Html$Events$keyCode)),
				$elm$browser$Browser$Events$onKeyUp(
				A2($elm$json$Json$Decode$map, $author$project$Update$key_up, $elm$html$Html$Events$keyCode)),
				A2(
				$mdgriffith$elm_style_animation$Animation$subscription,
				$author$project$Parameter$Animate,
				_Utils_ap(
					_List_fromArray(
						[model.animatecurtain]),
					_Utils_ap(
						allthings,
						_Utils_ap(scoreboard, model.instructions))))
			]));
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Parameter$Select_Device = {$: 'Select_Device'};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$Map$getij = function (n) {
	switch (n) {
		case 1:
			return _Utils_Tuple2(1, 1);
		case 2:
			return _Utils_Tuple2(3, 4);
		case 3:
			return _Utils_Tuple2(4, 3);
		case 4:
			return _Utils_Tuple2(2, 2);
		case 5:
			return _Utils_Tuple2(6, 4);
		case 6:
			return _Utils_Tuple2(1, 1);
		default:
			return _Utils_Tuple2(0, 0);
	}
};
var $author$project$Parameter$Default = {$: 'Default'};
var $author$project$Parameter$Object = F3(
	function (nodes, object_type, pos) {
		return {nodes: nodes, object_type: object_type, pos: pos};
	});
var $author$project$Parameter$Plant = function (a) {
	return {$: 'Plant', a: a};
};
var $elm$core$Basics$acos = _Basics_acos;
var $elm$core$Basics$pow = _Basics_pow;
var $author$project$Polygoninside$distance = F2(
	function (a, b) {
		var _v0 = b;
		var x2 = _v0.a;
		var y2 = _v0.b;
		var _v1 = a;
		var x1 = _v1.a;
		var y1 = _v1.b;
		return A2(
			$elm$core$Basics$pow,
			A2($elm$core$Basics$pow, x1 - x2, 2) + A2($elm$core$Basics$pow, y1 - y2, 2),
			0.5);
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$Polygoninside$find_center = function (a) {
	var _v0 = $elm$core$List$unzip(a);
	var b = _v0.a;
	var c = _v0.b;
	var x = _Utils_Tuple2(
		$elm$core$List$sum(b) / $elm$core$List$length(b),
		$elm$core$List$sum(c) / $elm$core$List$length(c));
	return x;
};
var $author$project$Polygoninside$intersectjudge = F2(
	function (d, c) {
		var _v0 = c;
		var x3 = _v0.a;
		var y3 = _v0.b;
		var _v1 = d;
		var a = _v1.a;
		var b = _v1.b;
		var _v2 = a;
		var x1 = _v2.a;
		var y1 = _v2.b;
		var _v3 = b;
		var x2 = _v3.a;
		var y2 = _v3.b;
		var judge = function () {
			if (_Utils_eq(x1, x2)) {
				return false;
			} else {
				var y = (((y2 - y1) / (x2 - x1)) * (x3 - x1)) + y1;
				return (_Utils_cmp(y, y3) > -1) && (((x1 - x3) * (x2 - x3)) <= 0);
			}
		}();
		return judge;
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Polygoninside$ispolygoninside = F2(
	function (nodes, pos) {
		var nnodes = _Utils_ap(
			A2($elm$core$List$drop, 1, nodes),
			A2($elm$core$List$take, 1, nodes));
		var num = A3(
			$elm$core$List$foldl,
			F2(
				function (a, p) {
					var ans = a ? (p + 1) : p;
					return ans;
				}),
			0,
			A2(
				$elm$core$List$map,
				function (a) {
					return A2($author$project$Polygoninside$intersectjudge, a, pos);
				},
				A3($elm$core$List$map2, $elm$core$Tuple$pair, nodes, nnodes)));
		return (!(!A2($elm$core$Basics$modBy, 2, num))) && ($elm$core$List$length(nodes) > 2);
	});
var $author$project$Map$getplant = F2(
	function (random_num, obj) {
		var _v0 = obj.object_type;
		if (_v0.$ === 'Stone') {
			var _v1 = function () {
				var _v2 = $elm$core$List$head(
					A2($elm$core$List$drop, random_num + 1, obj.nodes));
				if (_v2.$ === 'Just') {
					var _v3 = _v2.a;
					var x = _v3.a;
					var y = _v3.b;
					return _Utils_Tuple2(x, y);
				} else {
					return _Utils_Tuple2(0, 0);
				}
			}();
			var c = _v1.a;
			var d = _v1.b;
			var _v4 = function () {
				var _v5 = $elm$core$List$head(
					A2($elm$core$List$drop, random_num, obj.nodes));
				if (_v5.$ === 'Just') {
					var _v6 = _v5.a;
					var x = _v6.a;
					var y = _v6.b;
					return _Utils_Tuple2(x, y);
				} else {
					return _Utils_Tuple2(0, 0);
				}
			}();
			var a = _v4.a;
			var b = _v4.b;
			var _v7 = _Utils_Tuple2((((a + c) / 2) + b) - d, (((b + d) / 2) + c) - a);
			var e = _v7.a;
			var f = _v7.b;
			var length = A2(
				$author$project$Polygoninside$distance,
				_Utils_Tuple2(a, b),
				_Utils_Tuple2(c, d));
			var _v8 = _Utils_Tuple2(a + length, b);
			var ra = _v8.a;
			var rb = _v8.b;
			var angle = ($elm$core$Basics$acos(
				(((c - a) * (ra - a)) + ((d - b) * (rb - b))) / A2($elm$core$Basics$pow, length, 2)) * 360) / (2 * $elm$core$Basics$pi);
			var rotangle = ((b - d) > 0) ? (-angle) : angle;
			var thirdnode = A2(
				$author$project$Polygoninside$ispolygoninside,
				obj.nodes,
				_Utils_Tuple2(e, f)) ? _Utils_Tuple2((((a + c) / 2) - b) + d, (((b + d) / 2) - c) + a) : _Utils_Tuple2(e, f);
			var plnodes = _List_fromArray(
				[
					_Utils_Tuple2(a, b),
					_Utils_Tuple2(c, d),
					thirdnode
				]);
			var _v9 = _Utils_Tuple2(
				random_num >= 4,
				A2($elm$core$Basics$modBy, 3, random_num));
			_v9$3:
			while (true) {
				if (_v9.a) {
					switch (_v9.b) {
						case 2:
							return A3(
								$author$project$Parameter$Object,
								plnodes,
								$author$project$Parameter$Plant(
									_Utils_Tuple2(
										_Utils_Tuple2(1, 1),
										rotangle)),
								$author$project$Polygoninside$find_center(plnodes));
						case 1:
							return A3(
								$author$project$Parameter$Object,
								plnodes,
								$author$project$Parameter$Plant(
									_Utils_Tuple2(
										_Utils_Tuple2(2, 1),
										rotangle)),
								$author$project$Polygoninside$find_center(plnodes));
						case 0:
							return A3(
								$author$project$Parameter$Object,
								plnodes,
								$author$project$Parameter$Plant(
									_Utils_Tuple2(
										_Utils_Tuple2(3, 1),
										rotangle)),
								$author$project$Polygoninside$find_center(plnodes));
						default:
							break _v9$3;
					}
				} else {
					break _v9$3;
				}
			}
			return A3(
				$author$project$Parameter$Object,
				_List_fromArray(
					[
						_Utils_Tuple2(0, 0)
					]),
				$author$project$Parameter$Default,
				_Utils_Tuple2(0, 0));
		} else {
			return A3(
				$author$project$Parameter$Object,
				_List_fromArray(
					[
						_Utils_Tuple2(0, 0)
					]),
				$author$project$Parameter$Default,
				_Utils_Tuple2(0, 0));
		}
	});
var $author$project$Parameter$Stone = F2(
	function (a, b) {
		return {$: 'Stone', a: a, b: b};
	});
var $author$project$Polygoninside$multiple = F2(
	function (a, b) {
		return a * b;
	});
var $author$project$Polygoninside$circ_distort = F2(
	function (length, circnodes) {
		var _v0 = $elm$core$List$unzip(circnodes);
		var a = _v0.a;
		var b = _v0.b;
		var na = A3($elm$core$List$map2, $author$project$Polygoninside$multiple, length, a);
		return A3($elm$core$List$map2, $elm$core$Tuple$pair, na, b);
	});
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$Polygoninside$circlegen = function (n) {
	var r = A2($elm$core$List$repeat, n, 1.0);
	var a = A2($elm$core$List$repeat, n, (2 * $elm$core$Basics$pi) / n);
	var na = A2($elm$core$List$indexedMap, $author$project$Polygoninside$multiple, a);
	return A3($elm$core$List$map2, $elm$core$Tuple$pair, r, na);
};
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$sin = _Basics_sin;
var $elm$core$Basics$fromPolar = function (_v0) {
	var radius = _v0.a;
	var theta = _v0.b;
	return _Utils_Tuple2(
		radius * $elm$core$Basics$cos(theta),
		radius * $elm$core$Basics$sin(theta));
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Polygoninside$distort_circ_fit = F2(
	function (_v0, cnodes) {
		var a = _v0.a;
		var b = _v0.b;
		var l = A2($elm$core$Basics$min, a, b) / 2;
		var _v1 = $elm$core$List$unzip(cnodes);
		var r = _v1.a;
		var ang = _v1.b;
		var gl = A3($elm$core$List$foldl, $elm$core$Basics$max, 0, r);
		var k = function () {
			var _v2 = _Utils_cmp(gl, l) < 1;
			if (_v2) {
				return 1;
			} else {
				return l / gl;
			}
		}();
		var nr = A2(
			$elm$core$List$map,
			function (x) {
				return k * x;
			},
			r);
		return A2(
			$elm$core$List$map,
			$elm$core$Basics$fromPolar,
			A3($elm$core$List$map2, $elm$core$Tuple$pair, nr, ang));
	});
var $author$project$Polygoninside$stonegenerate = F3(
	function (num, length, _v0) {
		var a = _v0.a;
		var b = _v0.b;
		return A2(
			$author$project$Polygoninside$distort_circ_fit,
			_Utils_Tuple2(a, b),
			A2(
				$author$project$Polygoninside$circ_distort,
				length,
				$author$project$Polygoninside$circlegen(num)));
	});
var $author$project$Map$getstone = F5(
	function (n, rannum, _v0, maptimer, length) {
		var a = _v0.a;
		var b = _v0.b;
		var _v1 = $author$project$Map$getij(n);
		var viewx = _v1.a;
		var viewy = _v1.b;
		var nodes = A3(
			$author$project$Polygoninside$stonegenerate,
			10,
			length,
			_Utils_Tuple2(viewy, viewx));
		var sto = A2(
			$elm$core$List$map,
			function (_v5) {
				var x = _v5.a;
				var y = _v5.b;
				return _Utils_Tuple2(x + (viewy / 2), y + (viewx / 2));
			},
			nodes);
		var stonodes = A2(
			$elm$core$List$map,
			function (_v4) {
				var x = _v4.a;
				var y = _v4.b;
				return _Utils_Tuple2(x, y + maptimer);
			},
			A2(
				$elm$core$List$map,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return _Utils_Tuple2(((b + x) - 1) - 1, (a + y) - 1);
				},
				sto));
		var stocet = $author$project$Polygoninside$find_center(stonodes);
		var _v2 = n > 1;
		if (_v2) {
			return A3(
				$author$project$Parameter$Object,
				stonodes,
				A2($author$project$Parameter$Stone, n, rannum),
				stocet);
		} else {
			return A3(
				$author$project$Parameter$Object,
				_List_fromArray(
					[
						_Utils_Tuple2(0, 0)
					]),
				$author$project$Parameter$Default,
				_Utils_Tuple2(0, 0));
		}
	});
var $author$project$Map$map_brick_object = F5(
	function (random_num, p, n, maptimer, length) {
		var pos = _Utils_Tuple2(p.a, p.b);
		var stone = A5($author$project$Map$getstone, n, random_num, pos, maptimer, length);
		var plant = A2($author$project$Map$getplant, random_num, stone);
		return _List_fromArray(
			[stone, plant]);
	});
var $author$project$Map$map_find = F3(
	function (map, a, b) {
		var n1 = A2($elm$core$List$drop, a - 1, map);
		var n2 = function () {
			if (n1.b) {
				var x = n1.a;
				return x;
			} else {
				return _List_Nil;
			}
		}();
		var n3 = A2($elm$core$List$drop, b - 1, n2);
		var n4 = function () {
			if (n3.b) {
				var x = n3.a;
				return x;
			} else {
				return $author$project$Parameter$Empty;
			}
		}();
		return n4;
	});
var $author$project$Map$map_check = F3(
	function (map, _v0, _v1) {
		var a = _v0.a;
		var b = _v0.b;
		var c = _v1.a;
		var d = _v1.b;
		if ((a < 1) || ((_Utils_cmp(
			b - 1,
			$elm$core$List$length(map)) > 0) || ((c < 1) || (_Utils_cmp(d - 1, $author$project$Parameter$right_bound) > 0)))) {
			return false;
		} else {
			if (_Utils_eq(a + 1, b) && _Utils_eq(c + 1, d)) {
				var u = A3($author$project$Map$map_find, map, a, c);
				return _Utils_eq(u, $author$project$Parameter$Empty);
			} else {
				if (_Utils_eq(a + 1, b)) {
					var m2 = ((c + d) / 2) | 0;
					return A3(
						$author$project$Map$map_check,
						map,
						_Utils_Tuple2(a, b),
						_Utils_Tuple2(c, m2)) && A3(
						$author$project$Map$map_check,
						map,
						_Utils_Tuple2(a, b),
						_Utils_Tuple2(m2, d));
				} else {
					if (_Utils_eq(c + 1, d)) {
						var m1 = ((a + b) / 2) | 0;
						return A3(
							$author$project$Map$map_check,
							map,
							_Utils_Tuple2(a, m1),
							_Utils_Tuple2(c, d)) && A3(
							$author$project$Map$map_check,
							map,
							_Utils_Tuple2(m1, b),
							_Utils_Tuple2(c, d));
					} else {
						var m2 = ((c + d) / 2) | 0;
						var m1 = ((a + b) / 2) | 0;
						return A3(
							$author$project$Map$map_check,
							map,
							_Utils_Tuple2(a, m1),
							_Utils_Tuple2(c, m2)) && (A3(
							$author$project$Map$map_check,
							map,
							_Utils_Tuple2(m1, b),
							_Utils_Tuple2(c, m2)) && (A3(
							$author$project$Map$map_check,
							map,
							_Utils_Tuple2(a, m1),
							_Utils_Tuple2(m2, d)) && A3(
							$author$project$Map$map_check,
							map,
							_Utils_Tuple2(m1, b),
							_Utils_Tuple2(m2, d))));
					}
				}
			}
		}
	});
var $author$project$Map$map_around = F2(
	function (pos, n) {
		var _v0 = pos;
		var x = _v0.a;
		var y = _v0.b;
		var _v1 = $author$project$Map$getij(n);
		var i = _v1.a;
		var j = _v1.b;
		var a = A3(
			$elm$core$List$foldl,
			F2(
				function (p, q) {
					return _Utils_ap(
						q,
						_List_fromArray(
							[
								_Utils_Tuple2(x - 1, p),
								_Utils_Tuple2(x + i, p)
							]));
				}),
			_List_Nil,
			A2($elm$core$List$range, y - 1, y + j));
		var b = A3(
			$elm$core$List$foldl,
			F2(
				function (p, q) {
					return _Utils_ap(
						q,
						_List_fromArray(
							[
								_Utils_Tuple2(p, y - 1),
								_Utils_Tuple2(p, y + j)
							]));
				}),
			_List_Nil,
			A2($elm$core$List$range, x, (x + i) - 1));
		var c = A2(
			$elm$core$List$filter,
			function (_v2) {
				var p = _v2.a;
				var q = _v2.b;
				return (p > 0) && ((q > 0) && (_Utils_cmp(q, $author$project$Parameter$right_bound + 1) < 0));
			},
			_Utils_ap(a, b));
		return c;
	});
var $author$project$Parameter$Rock = F2(
	function (a, b) {
		return {$: 'Rock', a: a, b: b};
	});
var $author$project$Map$map_fill_deep = F5(
	function (left, right, distance, bricktype, map) {
		if (map.b) {
			var x = map.a;
			var xs = map.b;
			var r = A2($elm$core$List$drop, right, x);
			var m = A3(
				$elm$core$List$foldl,
				F2(
					function (_v1, b) {
						return _Utils_ap(
							b,
							_List_fromArray(
								[
									A2(
									$author$project$Parameter$Rock,
									bricktype,
									_Utils_Tuple2(
										distance,
										$elm$core$List$length(b) + 1))
								]));
					}),
				_List_Nil,
				A2(
					$elm$core$List$drop,
					left - 1,
					A2($elm$core$List$take, right, x)));
			var l = A2($elm$core$List$take, left - 1, x);
			var nl = _List_fromArray(
				[
					_Utils_ap(
					l,
					_Utils_ap(m, r))
				]);
			return _Utils_ap(
				nl,
				A5($author$project$Map$map_fill_deep, left, right, distance + 1, bricktype, xs));
		} else {
			return _List_Nil;
		}
	});
var $author$project$Map$map_fill = F3(
	function (_v0, _v1, n) {
		var map = _v0.a;
		var todolist = _v0.b;
		var x = _v1.a;
		var y = _v1.b;
		var up = A2($elm$core$List$take, x - 1, map);
		var t = _Utils_ap(
			todolist,
			A2(
				$author$project$Map$map_around,
				_Utils_Tuple2(x, y),
				n));
		var _v2 = $author$project$Map$getij(n);
		var i = _v2.a;
		var j = _v2.b;
		var down = A2($elm$core$List$drop, (x + i) - 1, map);
		var mid = A5(
			$author$project$Map$map_fill_deep,
			y,
			(y + j) - 1,
			1,
			n,
			A2(
				$elm$core$List$drop,
				x - 1,
				A2($elm$core$List$take, (x + i) - 1, map)));
		return _Utils_Tuple2(
			_Utils_ap(
				up,
				_Utils_ap(mid, down)),
			t);
	});
var $author$project$Map$haveempty = function (line) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (p, q) {
				return _Utils_eq(p, $author$project$Parameter$Empty) || q;
			}),
		false,
		line);
};
var $author$project$Map$map_last_full_line_guess = F2(
	function (n, map) {
		map_last_full_line_guess:
		while (true) {
			var legal = A3(
				$elm$core$List$foldl,
				F2(
					function (p, q) {
						return $author$project$Map$haveempty(p) || q;
					}),
				false,
				A2($elm$core$List$take, n, map));
			if (!legal) {
				return n;
			} else {
				if (!(n - 1)) {
					return 0;
				} else {
					var $temp$n = n - 1,
						$temp$map = map;
					n = $temp$n;
					map = $temp$map;
					continue map_last_full_line_guess;
				}
			}
		}
	});
var $author$project$Map$map_last_full_line = function (map) {
	var n = $elm$core$List$length(map);
	return A2($author$project$Map$map_last_full_line_guess, n, map);
};
var $author$project$Update_small$generate_rock = F2(
	function (model, l) {
		var set = model.gameset;
		var todolist = set.todo;
		var map = set.map;
		if ($author$project$Map$map_last_full_line(map) > 12) {
			var nset = _Utils_update(
				set,
				{map: map, todo: todolist});
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{gameset: nset}),
				$elm$core$Platform$Cmd$none);
		} else {
			if (todolist.b) {
				var x = todolist.a;
				var xs = todolist.b;
				var nmap = ($elm$core$List$length(map) < 18) ? _Utils_ap(
					map,
					_Utils_ap(
						$author$project$Parameter$map_initial,
						_Utils_ap(
							$author$project$Parameter$map_initial,
							_Utils_ap(
								$author$project$Parameter$map_initial,
								_Utils_ap(
									$author$project$Parameter$map_initial,
									_Utils_ap($author$project$Parameter$map_initial, $author$project$Parameter$map_initial)))))) : map;
				var n = function () {
					var _v5 = $elm$core$List$head(l);
					if (_v5.$ === 'Just') {
						var num = _v5.a;
						return num - 5;
					} else {
						return 0;
					}
				}();
				var length = A2($elm$core$List$drop, 1, l);
				var _v1 = A2(
					$elm$random$Random$step,
					A2($elm$random$Random$int, 0, 8),
					model.seed);
				var random_num = _v1.a;
				var nseed = _v1.b;
				var _v2 = $author$project$Map$getij(n);
				var i = _v2.a;
				var j = _v2.b;
				var _v3 = x;
				var a = _v3.a;
				var c = _v3.b;
				var legal = A3(
					$author$project$Map$map_check,
					nmap,
					_Utils_Tuple2(a, a + i),
					_Utils_Tuple2(c, c + j));
				if (legal) {
					var ob = _Utils_ap(
						A5($author$project$Map$map_brick_object, random_num, x, n, model.gameset.maptimer, length),
						model.gameset.objects);
					var _v4 = A3(
						$author$project$Map$map_fill,
						_Utils_Tuple2(nmap, xs),
						x,
						n);
					var newmap = _v4.a;
					var todo = _v4.b;
					var nset = _Utils_update(
						set,
						{map: newmap, objects: ob, todo: todo});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{gameset: nset, seed: nseed}),
						$author$project$Map$map_brick_generate);
				} else {
					if (A3(
						$author$project$Map$map_check,
						nmap,
						_Utils_Tuple2(a, a + 1),
						_Utils_Tuple2(c, c + 1))) {
						var nset = _Utils_update(
							set,
							{map: nmap, todo: todolist});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{gameset: nset}),
							$author$project$Map$map_brick_generate);
					} else {
						var nset = _Utils_update(
							set,
							{map: nmap, todo: xs});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{gameset: nset}),
							$author$project$Map$map_brick_generate);
					}
				}
			} else {
				var newrow = $elm$core$List$length(map) + 1;
				var newtodolist = A2(
					$elm$core$List$map,
					function (a) {
						return _Utils_Tuple2(newrow, a);
					},
					A2($elm$core$List$range, 1, $author$project$Parameter$right_bound));
				var nset = _Utils_update(
					set,
					{map: map, todo: newtodolist});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{gameset: nset}),
					$elm$core$Platform$Cmd$none);
			}
		}
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Music$pause = _Platform_outgoingPort('pause', $elm$json$Json$Encode$string);
var $author$project$Parameter$Device_Placed = {$: 'Device_Placed'};
var $author$project$Parameter$Mirror = {$: 'Mirror'};
var $author$project$Parameter$Splitter = function (a) {
	return {$: 'Splitter', a: a};
};
var $author$project$Update$set_object = F2(
	function (model, msg) {
		var set = model.gameset;
		var _v0 = model.clickpos;
		var posx = _v0.a;
		var posy = _v0.b;
		var newobject = function () {
			_v1$2:
			while (true) {
				if (msg.$ === 'Key_Down') {
					switch (msg.a) {
						case 81:
							return A3(
								$author$project$Parameter$Object,
								_List_fromArray(
									[
										_Utils_Tuple2(posx - 0.3, posy),
										_Utils_Tuple2(posx + 0.3, posy)
									]),
								$author$project$Parameter$Mirror,
								_Utils_Tuple2(posx, posy));
						case 87:
							return A3(
								$author$project$Parameter$Object,
								_List_fromArray(
									[
										_Utils_Tuple2(posx - 0.3, posy),
										_Utils_Tuple2(posx + 0.3, posy)
									]),
								$author$project$Parameter$Splitter(0),
								_Utils_Tuple2(posx, posy));
						default:
							break _v1$2;
					}
				} else {
					break _v1$2;
				}
			}
			return A3(
				$author$project$Parameter$Object,
				_List_Nil,
				$author$project$Parameter$Mirror,
				_Utils_Tuple2(0, 0));
		}();
		var nset = _Utils_update(
			set,
			{
				objects: _Utils_ap(
					set.objects,
					_List_fromArray(
						[newobject]))
			});
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{gameset: nset, place_state: $author$project$Parameter$Device_Placed}),
			$elm$core$Platform$Cmd$none);
	});
var $elm$json$Json$Encode$float = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $author$project$Music$settime = _Platform_outgoingPort(
	'settime',
	function ($) {
		var a = $.a;
		var b = $.b;
		return A2(
			$elm$json$Json$Encode$list,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$json$Json$Encode$string(a),
					$elm$json$Json$Encode$float(b)
				]));
	});
var $author$project$Music$start = _Platform_outgoingPort('start', $elm$json$Json$Encode$string);
var $author$project$Update$set_mirror = F2(
	function (model, msg) {
		var _v0 = model.place_state;
		if (_v0.$ === 'Select_Device') {
			var sound_msg = $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Music$settime(
						_Utils_Tuple2('place_instrument', 0)),
						$author$project$Music$pause('place_instrument'),
						$author$project$Music$start('place_instrument')
					]));
			var _v1 = A2($author$project$Update$set_object, model, msg);
			var nmodel = _v1.a;
			var cmsg = _v1.b;
			return _Utils_Tuple2(nmodel, sound_msg);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Update$set_splitter = F2(
	function (model, msg) {
		var _v0 = model.place_state;
		if (_v0.$ === 'Select_Device') {
			var sound_msg = $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Music$settime(
						_Utils_Tuple2('place_instrument', 0)),
						$author$project$Music$pause('place_instrument'),
						$author$project$Music$start('place_instrument')
					]));
			var _v1 = A2($author$project$Update$set_object, model, msg);
			var nmodel = _v1.a;
			var nmsg = _v1.b;
			return _Utils_Tuple2(nmodel, sound_msg);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Parameter$Adjust_Angle = {$: 'Adjust_Angle'};
var $author$project$Update$start_rotate = function (model) {
	var _v0 = _Utils_Tuple2(model.progress, model.place_state);
	if ((_v0.a.$ === 'Gaming') && (_v0.b.$ === 'Device_Placed')) {
		var _v1 = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{place_state: $author$project$Parameter$Adjust_Angle}),
			$elm$core$Platform$Cmd$none);
	} else {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$Update_small$stop_rotate = function (model) {
	var _v0 = model.place_state;
	if (_v0.$ === 'Adjust_Angle') {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{place_state: $author$project$Parameter$Device_Placed}),
			$elm$core$Platform$Cmd$none);
	} else {
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$Parameter$Endless = {$: 'Endless'};
var $author$project$Parameter$Fadeout = function (a) {
	return {$: 'Fadeout', a: a};
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Update$filter_plant_2 = function (objects) {
	filter_plant_2:
	while (true) {
		if (!objects.b) {
			return _List_Nil;
		} else {
			var x = objects.a;
			var xs = objects.b;
			var _v1 = x.object_type;
			if (_v1.$ === 'Plant') {
				var _v2 = _v1.a;
				var _v3 = _v2.a;
				var planttype = _v3.a;
				var _v4 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(
						A2($elm$core$List$drop, 1, x.nodes)));
				var x2 = _v4.a;
				var y2 = _v4.b;
				var _v5 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(x.nodes));
				var x1 = _v5.a;
				var y1 = _v5.b;
				if (A2($elm$core$Basics$min, y1, y2) <= 5) {
					var $temp$objects = xs;
					objects = $temp$objects;
					continue filter_plant_2;
				} else {
					return A2(
						$elm$core$List$cons,
						x,
						$author$project$Update$filter_plant_2(xs));
				}
			} else {
				return A2(
					$elm$core$List$cons,
					x,
					$author$project$Update$filter_plant_2(xs));
			}
		}
	}
};
var $author$project$Update$filter_rock = function (objects) {
	filter_rock:
	while (true) {
		if (!objects.b) {
			return _List_Nil;
		} else {
			var x = objects.a;
			var xs = objects.b;
			var _v1 = x.object_type;
			if (_v1.$ === 'Stone') {
				var a = _v1.a;
				var _v2 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(
						A2($elm$core$List$sortBy, $elm$core$Tuple$second, x.nodes)));
				var up_point_x = _v2.a;
				var up_point_y = _v2.b;
				var _v3 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(
						$elm$core$List$reverse(
							A2($elm$core$List$sortBy, $elm$core$Tuple$second, x.nodes))));
				var down_point_x = _v3.a;
				var down_point_y = _v3.b;
				if (down_point_y <= 5) {
					var $temp$objects = xs;
					objects = $temp$objects;
					continue filter_rock;
				} else {
					return A2(
						$elm$core$List$cons,
						x,
						$author$project$Update$filter_rock(xs));
				}
			} else {
				return A2(
					$elm$core$List$cons,
					x,
					$author$project$Update$filter_rock(xs));
			}
		}
	}
};
var $author$project$Light$remove_outrange = F2(
	function (nuppos, model) {
		var set = model.gameset;
		var newobjects = A2(
			$elm$core$List$filter,
			function (x) {
				var nodesytop = A3(
					$elm$core$List$foldl,
					F2(
						function (yy, p) {
							return (_Utils_cmp(yy, p) < 0) ? yy : p;
						}),
					1000000000000000000,
					A2(
						$elm$core$List$map,
						function (xx) {
							return xx.b;
						},
						x.nodes));
				return _Utils_cmp(nodesytop, nuppos - 6) > 0;
			},
			set.objects);
		var nset = _Utils_update(
			set,
			{objects: newobjects});
		return _Utils_update(
			model,
			{gameset: nset});
	});
var $elm$core$Basics$atan2 = _Basics_atan2;
var $elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * $elm$core$Basics$pi) / 180;
};
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Light$rotate_device = function (model) {
	var _v0 = model.place_state;
	if (_v0.$ === 'Adjust_Angle') {
		var set = model.gameset;
		var nobjects = A2(
			$elm$core$List$take,
			$elm$core$List$length(set.objects) - 1,
			set.objects);
		var lastdevice = A2(
			$elm$core$Maybe$withDefault,
			A3(
				$author$project$Parameter$Object,
				_List_Nil,
				$author$project$Parameter$Default,
				_Utils_Tuple2(0, 0)),
			$elm$core$List$head(
				A2(
					$elm$core$List$drop,
					$elm$core$List$length(set.objects) - 1,
					set.objects)));
		var _v1 = lastdevice.pos;
		var centerposx = _v1.a;
		var centerposy = _v1.b;
		var origin_radius_angle = A2(
			$elm$core$List$map,
			function (_v4) {
				var a = _v4.a;
				var b = _v4.b;
				return _Utils_Tuple2(
					$elm$core$Basics$sqrt(
						A2($elm$core$Basics$pow, centerposy - b, 2) + A2($elm$core$Basics$pow, centerposx - a, 2)),
					(A2($elm$core$Basics$atan2, centerposy - b, centerposx - a) / $elm$core$Basics$pi) * 180);
			},
			lastdevice.nodes);
		var newnodes = A2(
			$elm$core$List$map,
			function (_v3) {
				var r = _v3.a;
				var theta = _v3.b;
				return _Utils_Tuple2(
					(r * $elm$core$Basics$cos(
						$elm$core$Basics$degrees(theta) + 0.05)) + centerposx,
					(r * $elm$core$Basics$sin(
						$elm$core$Basics$degrees(theta) + 0.05)) + centerposy);
			},
			origin_radius_angle);
		var newdevice = _Utils_update(
			lastdevice,
			{nodes: newnodes});
		var newobjects = _Utils_ap(
			nobjects,
			_List_fromArray(
				[newdevice]));
		if (_Utils_cmp(lastdevice.pos.b, set.uppos) > 0) {
			var _v2 = lastdevice.object_type;
			if (_v2.$ === 'Splitter') {
				return model;
			} else {
				var nset = _Utils_update(
					set,
					{objects: newobjects});
				return _Utils_update(
					model,
					{gameset: nset});
			}
		} else {
			return model;
		}
	} else {
		return model;
	}
};
var $author$project$Light$line_longer = function (a) {
	var _v0 = a.tail;
	var x2 = _v0.a;
	var y2 = _v0.b;
	var _v1 = a.head;
	var x1 = _v1.a;
	var y1 = _v1.b;
	var k = A2(
		$elm$core$Basics$min,
		100 / A2(
			$elm$core$Basics$pow,
			A2($elm$core$Basics$pow, x2 - x1, 2) + A2($elm$core$Basics$pow, y2 - y1, 2),
			0.5),
		30);
	var _v2 = _Utils_Tuple2(x1 + (k * (x2 - x1)), y1 + (k * (y2 - y1)));
	var x3 = _v2.a;
	var y3 = _v2.b;
	return A2(
		$author$project$Parameter$Line_element,
		_Utils_Tuple2(x1, y1),
		_Utils_Tuple2(x3, y3));
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Polygoninside$cross_product = F2(
	function (a, b) {
		var _v0 = b;
		var x2 = _v0.a;
		var y2 = _v0.b;
		var _v1 = a;
		var x1 = _v1.a;
		var y1 = _v1.b;
		return (x1 * y2) - (y1 * x2);
	});
var $author$project$Polygoninside$intersect = F4(
	function (a, b, c, d) {
		var _v0 = d;
		var x4 = _v0.a;
		var y4 = _v0.b;
		var _v1 = c;
		var x3 = _v1.a;
		var y3 = _v1.b;
		var _v2 = b;
		var x2 = _v2.a;
		var y2 = _v2.b;
		var _v3 = a;
		var x1 = _v3.a;
		var y1 = _v3.b;
		var xintersect = _Utils_cmp(
			$elm$core$Basics$abs(x2 - x1) + $elm$core$Basics$abs(x3 - x4),
			A3(
				$elm$core$List$foldl,
				F2(
					function (x, p) {
						return (_Utils_cmp(x, p) > 0) ? x : p;
					}),
				-1,
				_List_fromArray(
					[
						$elm$core$Basics$abs(x4 - x1),
						$elm$core$Basics$abs(x4 - x2),
						$elm$core$Basics$abs(x3 - x1),
						$elm$core$Basics$abs(x3 - x2)
					]))) > -1;
		var sidejudge1 = A2(
			$author$project$Polygoninside$cross_product,
			_Utils_Tuple2(x1 - x3, y1 - y3),
			_Utils_Tuple2(x3 - x4, y3 - y4)) * A2(
			$author$project$Polygoninside$cross_product,
			_Utils_Tuple2(x2 - x3, y2 - y3),
			_Utils_Tuple2(x3 - x4, y3 - y4));
		var sidejudge2 = A2(
			$author$project$Polygoninside$cross_product,
			_Utils_Tuple2(x1 - x3, y1 - y3),
			_Utils_Tuple2(x1 - x2, y1 - y2)) * A2(
			$author$project$Polygoninside$cross_product,
			_Utils_Tuple2(x1 - x4, y1 - y4),
			_Utils_Tuple2(x1 - x2, y1 - y2));
		var yintersect = _Utils_cmp(
			$elm$core$Basics$abs(y2 - y1) + $elm$core$Basics$abs(y3 - y4),
			A3(
				$elm$core$List$foldl,
				F2(
					function (y, p) {
						return (_Utils_cmp(y, p) > 0) ? y : p;
					}),
				-1,
				_List_fromArray(
					[
						$elm$core$Basics$abs(y4 - y1),
						$elm$core$Basics$abs(y4 - y2),
						$elm$core$Basics$abs(y3 - y1),
						$elm$core$Basics$abs(y3 - y2)
					]))) > -1;
		return xintersect && (yintersect && ((sidejudge1 <= 0) && (sidejudge2 <= 0)));
	});
var $author$project$Polygoninside$intersectrock = F2(
	function (a, light_source) {
		var b = a.nodes;
		var c = _Utils_ap(
			A2($elm$core$List$drop, 1, b),
			A2($elm$core$List$take, 1, b));
		var d = A3(
			$elm$core$List$foldl,
			F2(
				function (s, p) {
					return s || p;
				}),
			false,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var first = _v0.a;
					var second = _v0.b;
					return A4($author$project$Polygoninside$intersect, first, second, light_source.head, light_source.tail);
				},
				A3($elm$core$List$map2, $elm$core$Tuple$pair, b, c)));
		return d;
	});
var $author$project$Polygoninside$intersectpos = F4(
	function (a, b, c, d) {
		var _v0 = d;
		var x4 = _v0.a;
		var y4 = _v0.b;
		var _v1 = c;
		var x3 = _v1.a;
		var y3 = _v1.b;
		var _v2 = b;
		var x2 = _v2.a;
		var y2 = _v2.b;
		var _v3 = a;
		var x1 = _v3.a;
		var y1 = _v3.b;
		var denominator = ((y2 - y1) * (x4 - x3)) - ((x1 - x2) * (y3 - y4));
		var x = (((((x2 - x1) * (x4 - x3)) * (y3 - y1)) + (((y2 - y1) * (x4 - x3)) * x1)) - (((y4 - y3) * (x2 - x1)) * x3)) / denominator;
		var y = (-(((((y2 - y1) * (y4 - y3)) * (x3 - x1)) + (((x2 - x1) * (y4 - y3)) * y1)) - (((x4 - x3) * (y2 - y1)) * y3))) / denominator;
		return _Utils_Tuple2(x, y);
	});
var $author$project$Polygoninside$intersectrockpos = F2(
	function (a, light_source) {
		var b = a.nodes;
		var c = _Utils_ap(
			A2($elm$core$List$drop, 1, b),
			A2($elm$core$List$take, 1, b));
		var d = A3(
			$elm$core$List$foldl,
			F2(
				function (s, p) {
					return (_Utils_cmp(
						A2($author$project$Polygoninside$distance, s, light_source.head),
						A2($author$project$Polygoninside$distance, p, light_source.head)) < 0) ? s : p;
				}),
			_Utils_Tuple2(-100000, -100000),
			A2(
				$elm$core$List$map,
				function (_v0) {
					var first = _v0.a;
					var second = _v0.b;
					return A4($author$project$Polygoninside$intersect, first, second, light_source.head, light_source.tail) ? A4($author$project$Polygoninside$intersectpos, first, second, light_source.head, light_source.tail) : _Utils_Tuple2(-100000, -100000);
				},
				A3($elm$core$List$map2, $elm$core$Tuple$pair, b, c)));
		return d;
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Light$line_change = F2(
	function (newline, object) {
		var _v0 = newline.tail;
		var xx2 = _v0.a;
		var yy2 = _v0.b;
		var _v1 = newline.head;
		var xx1 = _v1.a;
		var yy1 = _v1.b;
		var _v2 = _Utils_Tuple2((2 * xx2) - xx1, (2 * yy2) - yy1);
		var xx = _v2.a;
		var yy = _v2.b;
		var _v3 = function () {
			var _v6 = object.nodes;
			if (_v6.b) {
				var x = _v6.a;
				var xs = _v6.b;
				if (xs.b) {
					var y = xs.a;
					return _Utils_Tuple2(x, y);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(0, 0),
						_Utils_Tuple2(0, 0));
				}
			} else {
				return _Utils_Tuple2(
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(0, 0));
			}
		}();
		var _v4 = _v3.a;
		var x1 = _v4.a;
		var y1 = _v4.b;
		var _v5 = _v3.b;
		var x2 = _v5.a;
		var y2 = _v5.b;
		var bb = x1 - x2;
		var aa = y2 - y1;
		var cc = (y1 * x2) - (y2 * x1);
		var _v8 = function () {
			var ym = ((((A2($elm$core$Basics$pow, aa, 2) - A2($elm$core$Basics$pow, bb, 2)) * yy) - ((2 * bb) * cc)) - (((2 * aa) * bb) * xx)) / (A2($elm$core$Basics$pow, aa, 2) + A2($elm$core$Basics$pow, bb, 2));
			var xm = ((((A2($elm$core$Basics$pow, bb, 2) - A2($elm$core$Basics$pow, aa, 2)) * xx) - ((2 * aa) * cc)) - (((2 * aa) * bb) * yy)) / (A2($elm$core$Basics$pow, aa, 2) + A2($elm$core$Basics$pow, bb, 2));
			return _Utils_Tuple2(xm, ym);
		}();
		var nx = _v8.a;
		var ny = _v8.b;
		return A2(
			$author$project$Parameter$Line_element,
			newline.tail,
			_Utils_Tuple2(nx, ny));
	});
var $author$project$Light$line_change_splitter = F2(
	function (newline, object) {
		var _v0 = newline.tail;
		var x4 = _v0.a;
		var y4 = _v0.b;
		var _v1 = newline.head;
		var x3 = _v1.a;
		var y3 = _v1.b;
		var _v2 = function () {
			var _v5 = object.nodes;
			if (_v5.b) {
				var x = _v5.a;
				var xs = _v5.b;
				if (xs.b) {
					var y = xs.a;
					var ys = xs.b;
					return _Utils_Tuple2(x, y);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(0, 0),
						_Utils_Tuple2(0, 0));
				}
			} else {
				return _Utils_Tuple2(
					_Utils_Tuple2(0, 0),
					_Utils_Tuple2(0, 0));
			}
		}();
		var _v3 = _v2.a;
		var x1 = _v3.a;
		var y1 = _v3.b;
		var _v4 = _v2.b;
		var x2 = _v4.a;
		var y2 = _v4.b;
		return _Utils_Tuple2(
			A2(
				$author$project$Parameter$Line_element,
				_Utils_Tuple2(x1, y1),
				_Utils_Tuple2(x1 - 0.5, y1 + 0.5)),
			A2(
				$author$project$Parameter$Line_element,
				_Utils_Tuple2(x2, y2),
				_Utils_Tuple2(x2 + 0.5, y2 + 0.5)));
	});
var $author$project$Light$line_clear = F2(
	function (a, b) {
		return A2(
			$elm$core$List$filter,
			function (s) {
				var _v0 = s.tail;
				var x2 = _v0.a;
				var y2 = _v0.b;
				var _v1 = s.head;
				var x1 = _v1.a;
				var y1 = _v1.b;
				var x3 = _Utils_eq(y1, y2) ? 0 : (x1 + (((x1 - x2) * (b - y1)) / (y1 - y2)));
				return ((y2 - y1) >= 0) && ((((y1 - b) * (y2 - b)) <= 0) && ((!_Utils_eq(y2, b)) && ((0 <= x3) && (x3 <= 12))));
			},
			a);
	});
var $author$project$Light$line_path_default = F6(
	function (line, newline, upbound, found_object, objects, score) {
		return $elm$core$List$isEmpty(line) ? _Utils_Tuple3(
			_List_fromArray(
				[newline]),
			A2(
				$author$project$Light$line_clear,
				_List_fromArray(
					[newline]),
				upbound),
			_Utils_Tuple2(score, objects)) : _Utils_Tuple3(
			_List_fromArray(
				[newline]),
			line,
			_Utils_Tuple2(score, objects));
	});
var $author$project$Light$line_path_plant = F6(
	function (line, newline, upbound, found_object, objects, score) {
		var newscore = function () {
			var _v3 = found_object.object_type;
			if (_v3.$ === 'Plant') {
				var _v4 = _v3.a;
				var l = _v4.a;
				var _v5 = l;
				var p = _v5.a;
				var q = _v5.b;
				return (q === 1) ? _Utils_ap(
					score,
					_List_fromArray(
						[p])) : score;
			} else {
				return score;
			}
		}();
		var newlightsource = $elm$core$List$isEmpty(line) ? A2(
			$author$project$Light$line_clear,
			_List_fromArray(
				[newline]),
			upbound) : line;
		var new_objects = A2(
			$elm$core$List$map,
			function (a) {
				if (_Utils_eq(a, found_object)) {
					var b = function () {
						var _v0 = a.object_type;
						if (_v0.$ === 'Plant') {
							var _v1 = _v0.a;
							var l = _v1.a;
							var r = _v1.b;
							var _v2 = l;
							var p = _v2.a;
							return _Utils_Tuple2(
								_Utils_Tuple2(p, 2),
								r);
						} else {
							return _Utils_Tuple2(
								_Utils_Tuple2(0, 0),
								0);
						}
					}();
					return _Utils_update(
						a,
						{
							object_type: $author$project$Parameter$Plant(b)
						});
				} else {
					return a;
				}
			},
			objects);
		return _Utils_Tuple3(
			_List_fromArray(
				[newline]),
			newlightsource,
			_Utils_Tuple2(newscore, new_objects));
	});
var $author$project$Light$line_path_stone = F8(
	function (i, j, line, newline, upbound, found_object, objects, score) {
		var newlight = $elm$core$List$isEmpty(line) ? A2(
			$author$project$Light$line_clear,
			_List_fromArray(
				[newline]),
			upbound) : line;
		var new_objects = ((i === 6) && (j >= 7)) ? A2(
			$elm$core$List$filter,
			function (a) {
				var _v0 = a.object_type;
				if (_v0.$ === 'Stone') {
					return !_Utils_eq(found_object, a);
				} else {
					return (A2($author$project$Polygoninside$distance, a.pos, found_object.pos) > 2) || (_Utils_cmp(a.pos.b, upbound) < 0);
				}
			},
			objects) : objects;
		return _Utils_Tuple3(
			_List_fromArray(
				[newline]),
			newlight,
			_Utils_Tuple2(score, new_objects));
	});
var $author$project$Polygoninside$maybeintersectrock = F2(
	function (a, light_source) {
		var _v0 = light_source.tail;
		var x2 = _v0.a;
		var y2 = _v0.b;
		var _v1 = light_source.head;
		var x1 = _v1.a;
		var y1 = _v1.b;
		var b1 = x1 - x2;
		var a1 = y2 - y1;
		var c1 = ((-y1) * b1) - (x1 * a1);
		var _v2 = a.pos;
		var x = _v2.a;
		var y = _v2.b;
		var apdis = $elm$core$Basics$abs(((a1 * x) + (b1 * y)) + c1) / A2(
			$elm$core$Basics$pow,
			A2($elm$core$Basics$pow, a1, 2) + A2($elm$core$Basics$pow, b1, 2),
			0.5);
		return apdis < 3.7;
	});
var $author$project$Light$line_path = F2(
	function (x, upbound) {
		var _v8 = x;
		var light_source = _v8.a;
		var line = _v8.b;
		var score_and_objects = _v8.c;
		var _v9 = score_and_objects;
		var score = _v9.a;
		var objects = _v9.b;
		var target_object0 = A2(
			$elm$core$List$filter,
			function (a) {
				var j = A2($author$project$Polygoninside$intersectrockpos, a, light_source);
				return A2($author$project$Polygoninside$distance, light_source.head, j) > 0.00001;
			},
			A2(
				$elm$core$List$filter,
				function (a) {
					return A2($author$project$Polygoninside$maybeintersectrock, a, light_source) && A2($author$project$Polygoninside$intersectrock, a, light_source);
				},
				objects));
		var _v10 = function () {
			if ($elm$core$List$isEmpty(target_object0)) {
				return $elm$core$List$isEmpty(line) ? _Utils_Tuple3(
					_List_fromArray(
						[light_source]),
					A2(
						$author$project$Light$line_clear,
						_List_fromArray(
							[light_source]),
						upbound),
					_Utils_Tuple2(score, objects)) : _Utils_Tuple3(
					_List_fromArray(
						[light_source]),
					line,
					_Utils_Tuple2(score, objects));
			} else {
				var target_object = A3(
					$elm$core$List$foldl,
					F2(
						function (a, _v12) {
							var p = _v12.a;
							var q = _v12.b;
							var j = A2($author$project$Polygoninside$intersectrockpos, a, light_source);
							return (_Utils_cmp(
								A2($author$project$Polygoninside$distance, j, light_source.head),
								A2($author$project$Polygoninside$distance, q, light_source.head)) < 0) ? _Utils_Tuple2(a, j) : _Utils_Tuple2(p, q);
						}),
					_Utils_Tuple2(
						A3(
							$author$project$Parameter$Object,
							_List_fromArray(
								[
									_Utils_Tuple2(0, 0)
								]),
							A2($author$project$Parameter$Stone, 0, 0),
							_Utils_Tuple2(0, 0)),
						_Utils_Tuple2(-100, -100)),
					target_object0);
				var newline = A2($author$project$Parameter$Line_element, light_source.head, target_object.b);
				var found_object = target_object.a;
				var _v11 = found_object.object_type;
				switch (_v11.$) {
					case 'Stone':
						var i = _v11.a;
						var j = _v11.b;
						return A8($author$project$Light$line_path_stone, i, j, line, newline, upbound, found_object, objects, score);
					case 'Mirror':
						return A6($author$project$Light$line_path_mirror, line, newline, upbound, found_object, objects, score);
					case 'Plant':
						return A6($author$project$Light$line_path_plant, line, newline, upbound, found_object, objects, score);
					case 'Splitter':
						var a = _v11.a;
						return A7($author$project$Light$line_path_splitter, a, line, newline, upbound, found_object, objects, score);
					default:
						return A6($author$project$Light$line_path_default, line, newline, upbound, found_object, objects, score);
				}
			}
		}();
		var ans1 = _v10.a;
		var ans2 = _v10.b;
		var ans3 = _v10.c;
		return _Utils_Tuple3(ans1, ans2, ans3);
	});
var $author$project$Light$line_path_mirror = F6(
	function (line, newline, upbound, found_object, objects, score) {
		var newlightsource = $elm$core$List$isEmpty(line) ? A2(
			$author$project$Light$line_clear,
			_List_fromArray(
				[newline]),
			upbound) : line;
		var _v7 = A2(
			$author$project$Light$line_path,
			_Utils_Tuple3(
				$author$project$Light$line_longer(
					A2($author$project$Light$line_change, newline, found_object)),
				newlightsource,
				_Utils_Tuple2(score, objects)),
			upbound);
		var p = _v7.a;
		var q = _v7.b;
		var r = _v7.c;
		return _Utils_Tuple3(
			_Utils_ap(
				_List_fromArray(
					[newline]),
				p),
			q,
			r);
	});
var $author$project$Light$line_path_splitter = F7(
	function (a, line, newline, upbound, found_object, objects, score) {
		if (!a) {
			var objects0 = A3(
				$elm$core$List$foldr,
				F2(
					function (m, n) {
						var save = _Utils_eq(m, found_object) ? _Utils_update(
							m,
							{
								object_type: $author$project$Parameter$Splitter(1)
							}) : m;
						return A2($elm$core$List$cons, save, n);
					}),
				_List_Nil,
				objects);
			var newlightsource = $elm$core$List$isEmpty(line) ? A2(
				$author$project$Light$line_clear,
				_List_fromArray(
					[newline]),
				upbound) : line;
			var _v0 = A2($author$project$Light$line_change_splitter, newline, found_object);
			var l1 = _v0.a;
			var l2 = _v0.b;
			var isIntersect1 = A3(
				$elm$core$List$foldl,
				F2(
					function (c, p) {
						return c || p;
					}),
				false,
				A2(
					$elm$core$List$map,
					function (b) {
						return A2($author$project$Polygoninside$ispolygoninside, b, l1.head);
					},
					A2(
						$elm$core$List$map,
						function (nodefather) {
							return nodefather.nodes;
						},
						objects0)));
			var isIntersect2 = A3(
				$elm$core$List$foldl,
				F2(
					function (c, p) {
						return c || p;
					}),
				false,
				A2(
					$elm$core$List$map,
					function (b) {
						return A2($author$project$Polygoninside$ispolygoninside, b, l2.head);
					},
					A2(
						$elm$core$List$map,
						function (nodefather) {
							return nodefather.nodes;
						},
						objects0)));
			var _v1 = function () {
				var _v2 = _Utils_Tuple2(isIntersect1, isIntersect2);
				if (!_v2.a) {
					if (!_v2.b) {
						var _v3 = A2(
							$author$project$Light$line_path,
							_Utils_Tuple3(
								$author$project$Light$line_longer(l1),
								newlightsource,
								_Utils_Tuple2(score, objects0)),
							upbound);
						var p1 = _v3.a;
						var q1 = _v3.b;
						var r1 = _v3.c;
						var _v4 = A2(
							$author$project$Light$line_path,
							_Utils_Tuple3(
								$author$project$Light$line_longer(l2),
								newlightsource,
								r1),
							upbound);
						var p2 = _v4.a;
						var q2 = _v4.b;
						var r2 = _v4.c;
						return _Utils_eq(newlightsource, _List_Nil) ? _Utils_Tuple3(
							_Utils_ap(p1, p2),
							_Utils_ap(q1, q2),
							r2) : _Utils_Tuple3(
							_Utils_ap(p1, p2),
							newlightsource,
							r2);
					} else {
						var _v5 = A2(
							$author$project$Light$line_path,
							_Utils_Tuple3(
								$author$project$Light$line_longer(l1),
								newlightsource,
								_Utils_Tuple2(score, objects0)),
							upbound);
						var p1 = _v5.a;
						var q1 = _v5.b;
						var r1 = _v5.c;
						return _Utils_eq(newlightsource, _List_Nil) ? _Utils_Tuple3(p1, q1, r1) : _Utils_Tuple3(p1, newlightsource, r1);
					}
				} else {
					if (_v2.b) {
						return $elm$core$List$isEmpty(line) ? _Utils_Tuple3(
							_List_Nil,
							A2(
								$author$project$Light$line_clear,
								_List_fromArray(
									[newline]),
								upbound),
							_Utils_Tuple2(score, objects0)) : _Utils_Tuple3(
							_List_Nil,
							line,
							_Utils_Tuple2(score, objects0));
					} else {
						var _v6 = A2(
							$author$project$Light$line_path,
							_Utils_Tuple3(
								$author$project$Light$line_longer(l2),
								newlightsource,
								_Utils_Tuple2(score, objects0)),
							upbound);
						var p1 = _v6.a;
						var q1 = _v6.b;
						var r1 = _v6.c;
						return _Utils_eq(newlightsource, _List_Nil) ? _Utils_Tuple3(p1, q1, r1) : _Utils_Tuple3(p1, newlightsource, r1);
					}
				}
			}();
			var ans_line = _v1.a;
			var anslight_source = _v1.b;
			var ans_score_object = _v1.c;
			return _Utils_Tuple3(
				_Utils_ap(
					_List_fromArray(
						[newline]),
					ans_line),
				anslight_source,
				ans_score_object);
		} else {
			if ($elm$core$List$isEmpty(line)) {
				return _Utils_Tuple3(
					_List_fromArray(
						[newline]),
					A2(
						$author$project$Light$line_clear,
						_List_fromArray(
							[newline]),
						upbound),
					_Utils_Tuple2(score, objects));
			} else {
				return _Utils_Tuple3(
					_List_fromArray(
						[newline]),
					line,
					_Utils_Tuple2(score, objects));
			}
		}
	});
var $author$project$Light$update_light_object = F2(
	function (upbound, model) {
		var set = model.gameset;
		var score = set.score;
		var objects = A3(
			$elm$core$List$foldr,
			F2(
				function (m, n) {
					var save = function () {
						var _v4 = m.object_type;
						if (_v4.$ === 'Splitter') {
							var a = _v4.a;
							return _Utils_update(
								m,
								{
									object_type: $author$project$Parameter$Splitter(0)
								});
						} else {
							return m;
						}
					}();
					return A2($elm$core$List$cons, save, n);
				}),
			_List_Nil,
			set.objects);
		var list_light_source = set.light;
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (a, _v1) {
					var p = _v1.a;
					var q = _v1.b;
					var r = _v1.c;
					var _v2 = A2(
						$author$project$Light$line_path,
						_Utils_Tuple3(
							$author$project$Light$line_longer(a),
							_List_Nil,
							r),
						upbound);
					var u = _v2.a;
					var v = _v2.b;
					var w = _v2.c;
					return _Utils_Tuple3(
						_Utils_ap(p, u),
						_Utils_ap(q, v),
						w);
				}),
			_Utils_Tuple3(
				_List_Nil,
				_List_Nil,
				_Utils_Tuple2(score, objects)),
			list_light_source);
		var new_light_path = _v0.a;
		var new_list_light_source = _v0.b;
		var new_score_and_objects = _v0.c;
		var _v3 = new_score_and_objects;
		var newscore = _v3.a;
		var new_objects = _v3.b;
		var nset = _Utils_update(
			set,
			{light: new_list_light_source, light_path: new_light_path, objects: new_objects, score: newscore});
		return _Utils_update(
			model,
			{gameset: nset});
	});
var $author$project$Update$update_endless_tick = F2(
	function (model, elapsed) {
		var set = model.gameset;
		var todolist = set.todo;
		var map = set.map;
		var _v0 = set.light;
		if (!_v0.b) {
			var nset = _Utils_update(
				set,
				{timer: 0});
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						gameset: nset,
						progress: $author$project$Parameter$Fadeout($author$project$Parameter$Endless)
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			var t = A2(
				$elm$core$List$filter,
				function (_v4) {
					var p = _v4.a;
					var q = _v4.b;
					return (p > 0) && ((q > 0) && (_Utils_cmp(q, $author$project$Parameter$right_bound + 1) < 0));
				},
				A2(
					$elm$core$List$map,
					function (_v3) {
						var p = _v3.a;
						var q = _v3.b;
						return _Utils_Tuple2(p - 1, q);
					},
					todolist));
			var nmap = A2($elm$core$List$drop, 1, map);
			var _v1 = set.windowsize;
			var window_x = _v1.a;
			var window_y = _v1.b;
			var isGeneratingMap = _Utils_cmp(
				$elm$core$Basics$floor(((set.uppos * window_y) / 10) / (0.1 * window_y)),
				set.maptimer) > 0;
			var nuppos = ((10 / window_y) * A2($elm$core$Basics$pow, set.timer, 1.05)) / 50;
			var bottompos = 10 + nuppos;
			var newmodel = A2(
				$author$project$Light$update_light_object,
				set.uppos,
				A2(
					$author$project$Light$remove_outrange,
					nuppos,
					$author$project$Light$rotate_device(model)));
			var newobject = $author$project$Update$filter_rock(
				$author$project$Update$filter_plant_2(newmodel.gameset.objects));
			var newset = newmodel.gameset;
			var isLightPlant = !_Utils_eq(
				$elm$core$List$length(set.score),
				$elm$core$List$length(newset.score));
			var cmd = function () {
				var _v2 = _Utils_Tuple2(isLightPlant, isGeneratingMap);
				if (_v2.a) {
					if (_v2.b) {
						return $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Map$map_brick_generate,
									$author$project$Music$settime(
									_Utils_Tuple2('light_plant', 0)),
									$author$project$Music$pause('light_plant'),
									$author$project$Music$start('light_plant')
								]));
					} else {
						return $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Music$settime(
									_Utils_Tuple2('light_plant', 0)),
									$author$project$Music$pause('light_plant'),
									$author$project$Music$start('light_plant')
								]));
					}
				} else {
					if (_v2.b) {
						return $elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[$author$project$Map$map_brick_generate]));
					} else {
						return $elm$core$Platform$Cmd$none;
					}
				}
			}();
			if (isGeneratingMap) {
				var nset = _Utils_update(
					newset,
					{map: nmap, maptimer: newset.maptimer + 1, objects: newobject, timer: newset.timer + elapsed, todo: t, uppos: nuppos});
				return _Utils_Tuple2(
					_Utils_update(
						newmodel,
						{gameset: nset}),
					cmd);
			} else {
				var nset = _Utils_update(
					newset,
					{objects: newobject, timer: newset.timer + elapsed, uppos: nuppos});
				return _Utils_Tuple2(
					_Utils_update(
						newmodel,
						{gameset: nset}),
					cmd);
			}
		}
	});
var $author$project$Update_small$update_resize = F3(
	function (model, wid, hei) {
		var set = model.gameset;
		var nset = _Utils_update(
			set,
			{
				windowsize: _Utils_Tuple2(wid, hei)
			});
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{gameset: nset}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Update_small$update_viewport = F2(
	function (model, viewport) {
		var set = model.gameset;
		var nset = _Utils_update(
			set,
			{
				windowsize: _Utils_Tuple2(viewport.width, viewport.height)
			});
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{gameset: nset}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Music$changeVolume = _Platform_outgoingPort(
	'changeVolume',
	function ($) {
		var a = $.a;
		var b = $.b;
		return A2(
			$elm$json$Json$Encode$list,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$json$Json$Encode$string(a),
					$elm$json$Json$Encode$float(b)
				]));
	});
var $author$project$Update_small$volume_down = function (model) {
	var new_volume = A2($elm$core$Basics$max, 0, model.volume - 0.1);
	return _Utils_Tuple2(
		_Utils_update(
			model,
			{volume: new_volume}),
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Music$changeVolume(
					_Utils_Tuple2('audio-sample', new_volume)),
					$author$project$Music$changeVolume(
					_Utils_Tuple2('place_instrument', new_volume)),
					$author$project$Music$changeVolume(
					_Utils_Tuple2('light_plant', new_volume))
				])));
};
var $author$project$Update_small$volume_up = function (model) {
	var new_volume = A2($elm$core$Basics$min, 1, model.volume + 0.1);
	return _Utils_Tuple2(
		_Utils_update(
			model,
			{volume: new_volume}),
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Music$changeVolume(
					_Utils_Tuple2('audio-sample', new_volume)),
					$author$project$Music$changeVolume(
					_Utils_Tuple2('place_instrument', new_volume)),
					$author$project$Music$changeVolume(
					_Utils_Tuple2('light_plant', new_volume))
				])));
};
var $author$project$Update$update_endless = F2(
	function (model, msg) {
		var set = model.gameset;
		var todolist = set.todo;
		var map = set.map;
		_v0$11:
		while (true) {
			switch (msg.$) {
				case 'GetViewport':
					var viewport = msg.a.viewport;
					return A2($author$project$Update_small$update_viewport, model, viewport);
				case 'Resize':
					var wid = msg.a;
					var hei = msg.b;
					return A3($author$project$Update_small$update_resize, model, wid, hei);
				case 'Key_Up':
					if (msg.a === 32) {
						return $author$project$Update_small$stop_rotate(model);
					} else {
						break _v0$11;
					}
				case 'Key_Down':
					switch (msg.a) {
						case 81:
							return A2($author$project$Update$set_mirror, model, msg);
						case 32:
							return $author$project$Update$start_rotate(model);
						case 87:
							return A2($author$project$Update$set_splitter, model, msg);
						case 38:
							return $author$project$Update_small$volume_up(model);
						case 40:
							return $author$project$Update_small$volume_down(model);
						default:
							break _v0$11;
					}
				case 'Rocktype':
					var l = msg.a;
					return A2($author$project$Update_small$generate_rock, model, l);
				case 'Tick':
					var elapsed = msg.a;
					return A2($author$project$Update$update_endless_tick, model, elapsed);
				case 'Click':
					var a = msg.a;
					var _v1 = set.windowsize;
					var window_x = _v1.a;
					var window_y = _v1.b;
					var _v2 = a.pagePos;
					var viewx = _v2.a;
					var viewy = _v2.b;
					var _v3 = model.clickpos;
					var lastx = _v3.a;
					var lasty = _v3.b;
					var _v4 = function (_v5) {
						var x = _v5.a;
						var y = _v5.b;
						return _Utils_Tuple2((x - (0.2 * window_x)) / (0.06 * window_x), (y + ((set.uppos * window_y) / 10)) / (0.1 * window_y));
					}(
						_Utils_Tuple2(viewx, viewy));
					var gamex = _v4.a;
					var gamey = _v4.b;
					var isIntersect = A3(
						$elm$core$List$foldl,
						F2(
							function (c, p) {
								return c || p;
							}),
						false,
						A2(
							$elm$core$List$map,
							function (b) {
								return A2(
									$author$project$Polygoninside$ispolygoninside,
									b,
									_Utils_Tuple2(gamex, gamey));
							},
							A2(
								$elm$core$List$map,
								function (nodefather) {
									return nodefather.nodes;
								},
								set.objects)));
					return ((gamex <= 10) && ((gamex >= 0) && ((gamey >= 0) && ((_Utils_cmp(gamey, (10 / window_y) * (window_y + ((set.uppos * window_y) / 10))) < 1) && (!isIntersect))))) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{
								clickpos: _Utils_Tuple2(gamex, gamey),
								events: msg,
								place_state: $author$project$Parameter$Select_Device
							}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				default:
					break _v0$11;
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Parameter$Finite = F2(
	function (a, b) {
		return {$: 'Finite', a: a, b: b};
	});
var $author$project$Parameter$ShowScoreBoard = function (a) {
	return {$: 'ShowScoreBoard', a: a};
};
var $mdgriffith$elm_style_animation$Animation$customColor = F2(
	function (name, _v0) {
		var red = _v0.red;
		var green = _v0.green;
		var blue = _v0.blue;
		var alpha = _v0.alpha;
		return A5(
			$mdgriffith$elm_style_animation$Animation$Model$ColorProperty,
			name,
			A2($mdgriffith$elm_style_animation$Animation$initMotion, red, ''),
			A2($mdgriffith$elm_style_animation$Animation$initMotion, green, ''),
			A2($mdgriffith$elm_style_animation$Animation$initMotion, blue, ''),
			A2($mdgriffith$elm_style_animation$Animation$initMotion, alpha, ''));
	});
var $mdgriffith$elm_style_animation$Animation$backgroundColor = function (c) {
	return A2($mdgriffith$elm_style_animation$Animation$customColor, 'background-color', c);
};
var $mdgriffith$elm_style_animation$Animation$borderColor = function (c) {
	return A2($mdgriffith$elm_style_animation$Animation$customColor, 'border-color', c);
};
var $mdgriffith$elm_style_animation$Animation$length = F3(
	function (name, val, unit) {
		return A2(
			$mdgriffith$elm_style_animation$Animation$Model$Property,
			name,
			A2($mdgriffith$elm_style_animation$Animation$initMotion, val, unit));
	});
var $mdgriffith$elm_style_animation$Animation$lengthUnitName = function (unit) {
	switch (unit.$) {
		case 'NoUnit':
			return '';
		case 'Px':
			return 'px';
		case 'Percent':
			return '%';
		case 'Rem':
			return 'rem';
		case 'Em':
			return 'em';
		case 'Ex':
			return 'ex';
		case 'Ch':
			return 'ch';
		case 'Vh':
			return 'vh';
		case 'Vw':
			return 'vw';
		case 'Vmin':
			return 'vmin';
		case 'Vmax':
			return 'vmax';
		case 'Mm':
			return 'mm';
		case 'Cm':
			return 'cm';
		case 'In':
			return 'in';
		case 'Pt':
			return 'pt';
		default:
			return 'pc';
	}
};
var $mdgriffith$elm_style_animation$Animation$borderRadius = function (_v0) {
	var val = _v0.a;
	var len = _v0.b;
	return A3(
		$mdgriffith$elm_style_animation$Animation$length,
		'border-radius',
		val,
		$mdgriffith$elm_style_animation$Animation$lengthUnitName(len));
};
var $mdgriffith$elm_style_animation$Animation$borderWidth = function (_v0) {
	var val = _v0.a;
	var len = _v0.b;
	return A3(
		$mdgriffith$elm_style_animation$Animation$length,
		'border-width',
		val,
		$mdgriffith$elm_style_animation$Animation$lengthUnitName(len));
};
var $mdgriffith$elm_style_animation$Animation$color = function (c) {
	return A2($mdgriffith$elm_style_animation$Animation$customColor, 'color', c);
};
var $mdgriffith$elm_style_animation$Animation$height = function (_v0) {
	var val = _v0.a;
	var len = _v0.b;
	return A3(
		$mdgriffith$elm_style_animation$Animation$length,
		'height',
		val,
		$mdgriffith$elm_style_animation$Animation$lengthUnitName(len));
};
var $mdgriffith$elm_style_animation$Animation$Length = F2(
	function (a, b) {
		return {$: 'Length', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Px = {$: 'Px'};
var $mdgriffith$elm_style_animation$Animation$px = function (myPx) {
	return A2($mdgriffith$elm_style_animation$Animation$Length, myPx, $mdgriffith$elm_style_animation$Animation$Px);
};
var $mdgriffith$elm_style_animation$Animation$scale = function (valX) {
	return A3($mdgriffith$elm_style_animation$Animation$custom, 'scale', valX, '');
};
var $mdgriffith$elm_style_animation$Animation$top = function (_v0) {
	var val = _v0.a;
	var len = _v0.b;
	return A3(
		$mdgriffith$elm_style_animation$Animation$length,
		'top',
		val,
		$mdgriffith$elm_style_animation$Animation$lengthUnitName(len));
};
var $author$project$Scoreboard$board_state = $mdgriffith$elm_style_animation$Animation$style(
	_List_fromArray(
		[
			$mdgriffith$elm_style_animation$Animation$opacity(0.0),
			$mdgriffith$elm_style_animation$Animation$top(
			$mdgriffith$elm_style_animation$Animation$px(0.0)),
			$mdgriffith$elm_style_animation$Animation$color(
			{alpha: 1, blue: 255, green: 255, red: 0}),
			$mdgriffith$elm_style_animation$Animation$scale(1.0),
			$mdgriffith$elm_style_animation$Animation$height(
			$mdgriffith$elm_style_animation$Animation$px(0.0)),
			$mdgriffith$elm_style_animation$Animation$backgroundColor(
			{alpha: 1, blue: 39, green: 39, red: 69}),
			$mdgriffith$elm_style_animation$Animation$borderWidth(
			$mdgriffith$elm_style_animation$Animation$px(5.0)),
			$mdgriffith$elm_style_animation$Animation$borderRadius(
			$mdgriffith$elm_style_animation$Animation$px(5.0)),
			$mdgriffith$elm_style_animation$Animation$borderColor(
			{alpha: 1, blue: 28, green: 33, red: 36})
		]));
var $mdgriffith$elm_style_animation$Animation$Percent = {$: 'Percent'};
var $mdgriffith$elm_style_animation$Animation$percent = function (perc) {
	return A2($mdgriffith$elm_style_animation$Animation$Length, perc, $mdgriffith$elm_style_animation$Animation$Percent);
};
var $author$project$Scoreboard$button_property = _List_fromArray(
	[
		$mdgriffith$elm_style_animation$Animation$opacity(0.0),
		$mdgriffith$elm_style_animation$Animation$color(
		{alpha: 0, blue: 255, green: 255, red: 0}),
		$mdgriffith$elm_style_animation$Animation$scale(1.0),
		$mdgriffith$elm_style_animation$Animation$top(
		$mdgriffith$elm_style_animation$Animation$percent(85)),
		$mdgriffith$elm_style_animation$Animation$height(
		$mdgriffith$elm_style_animation$Animation$percent(10)),
		$mdgriffith$elm_style_animation$Animation$borderColor(
		{alpha: 0, blue: 0, green: 0, red: 0}),
		$mdgriffith$elm_style_animation$Animation$backgroundColor(
		{alpha: 0.0, blue: 0, green: 0, red: 0}),
		$mdgriffith$elm_style_animation$Animation$borderWidth(
		$mdgriffith$elm_style_animation$Animation$px(8.0)),
		$mdgriffith$elm_style_animation$Animation$borderRadius(
		$mdgriffith$elm_style_animation$Animation$px(10.0))
	]);
var $mdgriffith$elm_style_animation$Animation$left = function (_v0) {
	var val = _v0.a;
	var len = _v0.b;
	return A3(
		$mdgriffith$elm_style_animation$Animation$length,
		'left',
		val,
		$mdgriffith$elm_style_animation$Animation$lengthUnitName(len));
};
var $mdgriffith$elm_style_animation$Animation$rotate = function (_v0) {
	var valX = _v0.a;
	return A2(
		$mdgriffith$elm_style_animation$Animation$Model$AngleProperty,
		'rotate',
		A2($mdgriffith$elm_style_animation$Animation$initMotion, valX, 'rad'));
};
var $mdgriffith$elm_style_animation$Animation$Radians = function (a) {
	return {$: 'Radians', a: a};
};
var $mdgriffith$elm_style_animation$Animation$turn = function (a) {
	return $mdgriffith$elm_style_animation$Animation$Radians(a * (2 * $elm$core$Basics$pi));
};
var $author$project$Scoreboard$newrecord_state = $mdgriffith$elm_style_animation$Animation$style(
	_List_fromArray(
		[
			$mdgriffith$elm_style_animation$Animation$opacity(0.0),
			$mdgriffith$elm_style_animation$Animation$top(
			$mdgriffith$elm_style_animation$Animation$percent(0.0)),
			$mdgriffith$elm_style_animation$Animation$color(
			{alpha: 1, blue: 0, green: 0, red: 255}),
			$mdgriffith$elm_style_animation$Animation$scale(2.0),
			$mdgriffith$elm_style_animation$Animation$height(
			$mdgriffith$elm_style_animation$Animation$percent(0.0)),
			$mdgriffith$elm_style_animation$Animation$borderColor(
			{alpha: 0, blue: 0, green: 0, red: 0}),
			$mdgriffith$elm_style_animation$Animation$backgroundColor(
			{alpha: 0.0, blue: 0, green: 0, red: 0}),
			$mdgriffith$elm_style_animation$Animation$rotate(
			$mdgriffith$elm_style_animation$Animation$turn(0.0)),
			$mdgriffith$elm_style_animation$Animation$left(
			$mdgriffith$elm_style_animation$Animation$percent(0.0)),
			$mdgriffith$elm_style_animation$Animation$borderWidth(
			$mdgriffith$elm_style_animation$Animation$px(5.0)),
			$mdgriffith$elm_style_animation$Animation$borderRadius(
			$mdgriffith$elm_style_animation$Animation$px(5.0))
		]));
var $mdgriffith$elm_style_animation$Animation$right = function (_v0) {
	var val = _v0.a;
	var len = _v0.b;
	return A3(
		$mdgriffith$elm_style_animation$Animation$length,
		'right',
		val,
		$mdgriffith$elm_style_animation$Animation$lengthUnitName(len));
};
var $author$project$Scoreboard$score_state = $mdgriffith$elm_style_animation$Animation$style(
	_List_fromArray(
		[
			$mdgriffith$elm_style_animation$Animation$opacity(0.0),
			$mdgriffith$elm_style_animation$Animation$top(
			$mdgriffith$elm_style_animation$Animation$percent(0.2)),
			$mdgriffith$elm_style_animation$Animation$color(
			{alpha: 1, blue: 255, green: 255, red: 255}),
			$mdgriffith$elm_style_animation$Animation$scale(1.0),
			$mdgriffith$elm_style_animation$Animation$height(
			$mdgriffith$elm_style_animation$Animation$px(0.0)),
			$mdgriffith$elm_style_animation$Animation$backgroundColor(
			{alpha: 0.5, blue: 255, green: 255, red: 255})
		]));
var $author$project$Scoreboard$fadeout = F2(
	function (model, elapsed) {
		var set = model.gameset;
		var nscore = ($elm$core$List$sum(set.score) * 10) + (set.maptimer * 5);
		var nprogress = function () {
			var _v1 = model.progress;
			if (_v1.$ === 'Fadeout') {
				var level = _v1.a;
				return $author$project$Parameter$ShowScoreBoard(level);
			} else {
				return $author$project$Parameter$Fadeout(
					A2($author$project$Parameter$Finite, 0, 0));
			}
		}();
		var new_high_score_list = $elm$core$List$reverse(
			$elm$core$List$sort(
				A2($elm$core$List$cons, nscore, model.highscore)));
		var board = {
			board: $author$project$Scoreboard$board_state,
			menu_button: $mdgriffith$elm_style_animation$Animation$style(
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_style_animation$Animation$left(
						$mdgriffith$elm_style_animation$Animation$px(0.0)),
					$author$project$Scoreboard$button_property)),
			newrecord: $author$project$Scoreboard$newrecord_state,
			reset_button: $mdgriffith$elm_style_animation$Animation$style(
				A2(
					$elm$core$List$cons,
					$mdgriffith$elm_style_animation$Animation$right(
						$mdgriffith$elm_style_animation$Animation$px(0.0)),
					$author$project$Scoreboard$button_property)),
			score: _Utils_Tuple2($author$project$Scoreboard$score_state, nscore),
			state: $author$project$Parameter$Begin
		};
		var _v0 = set.windowsize;
		var window_x = _v0.a;
		var window_y = _v0.b;
		if (set.timer >= 3000) {
			var nset = _Utils_update(
				set,
				{timer: 0});
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{gameset: nset, highscore: new_high_score_list, progress: nprogress, scoreboard: board}),
				$elm$core$Platform$Cmd$none);
		} else {
			var nset = _Utils_update(
				set,
				{timer: set.timer + elapsed});
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{gameset: nset}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $elm$core$Basics$round = _Basics_round;
var $mdgriffith$elm_style_animation$Animation$Model$refreshTiming = F2(
	function (now, timing) {
		var dt = $elm$time$Time$posixToMillis(now) - $elm$time$Time$posixToMillis(timing.current);
		return {
			current: now,
			dt: ((dt > 34) || (!$elm$time$Time$posixToMillis(timing.current))) ? $elm$time$Time$millisToPosix(
				$elm$core$Basics$round(16.666)) : $elm$time$Time$millisToPosix(dt)
		};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Model$Repeat = F2(
	function (a, b) {
		return {$: 'Repeat', a: a, b: b};
	});
var $mdgriffith$elm_style_animation$Animation$Model$Step = {$: 'Step'};
var $mdgriffith$elm_style_animation$Animation$Model$Wait = function (a) {
	return {$: 'Wait', a: a};
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $mdgriffith$elm_style_animation$Animation$Model$isCmdDone = function (cmd) {
	var motionDone = function (motion) {
		return (!motion.velocity) && _Utils_eq(motion.position, motion.target);
	};
	switch (cmd.$) {
		case 'Move':
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 'MoveTo':
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 'Line':
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 'LineTo':
			var m1 = cmd.a;
			var m2 = cmd.b;
			return motionDone(m1) && motionDone(m2);
		case 'Horizontal':
			var motion = cmd.a;
			return motionDone(motion);
		case 'HorizontalTo':
			var motion = cmd.a;
			return motionDone(motion);
		case 'Vertical':
			var motion = cmd.a;
			return motionDone(motion);
		case 'VerticalTo':
			var motion = cmd.a;
			return motionDone(motion);
		case 'Curve':
			var control1 = cmd.a.control1;
			var control2 = cmd.a.control2;
			var point = cmd.a.point;
			return motionDone(control1.a) && (motionDone(control1.b) && (motionDone(control2.a) && (motionDone(control2.b) && (motionDone(point.a) && motionDone(point.b)))));
		case 'CurveTo':
			var control1 = cmd.a.control1;
			var control2 = cmd.a.control2;
			var point = cmd.a.point;
			return motionDone(control1.a) && (motionDone(control1.b) && (motionDone(control2.a) && (motionDone(control2.b) && (motionDone(point.a) && motionDone(point.b)))));
		case 'Quadratic':
			var control = cmd.a.control;
			var point = cmd.a.point;
			return motionDone(control.a) && (motionDone(control.b) && (motionDone(point.a) && motionDone(point.b)));
		case 'QuadraticTo':
			var control = cmd.a.control;
			var point = cmd.a.point;
			return motionDone(control.a) && (motionDone(control.b) && (motionDone(point.a) && motionDone(point.b)));
		case 'SmoothQuadratic':
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 'SmoothQuadraticTo':
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v2) {
					var x = _v2.a;
					var y = _v2.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 'Smooth':
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v3) {
					var x = _v3.a;
					var y = _v3.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 'SmoothTo':
			var coords = cmd.a;
			return A2(
				$elm$core$List$all,
				function (_v4) {
					var x = _v4.a;
					var y = _v4.b;
					return motionDone(x) && motionDone(y);
				},
				coords);
		case 'ClockwiseArc':
			var arc = cmd.a;
			return motionDone(arc.x) && (motionDone(arc.y) && (motionDone(arc.radius) && (motionDone(arc.startAngle) && motionDone(arc.endAngle))));
		case 'AntiClockwiseArc':
			var arc = cmd.a;
			return motionDone(arc.x) && (motionDone(arc.y) && (motionDone(arc.radius) && (motionDone(arc.startAngle) && motionDone(arc.endAngle))));
		default:
			return true;
	}
};
var $mdgriffith$elm_style_animation$Animation$Model$isDone = function (property) {
	var motionDone = function (motion) {
		var runningInterpolation = A2($elm$core$Maybe$withDefault, motion.interpolation, motion.interpolationOverride);
		switch (runningInterpolation.$) {
			case 'Spring':
				return (!motion.velocity) && _Utils_eq(motion.position, motion.target);
			case 'Easing':
				var eased = runningInterpolation.a;
				return (eased.progress === 1) || ((!eased.progress) && _Utils_eq(motion.position, motion.target));
			default:
				var speed = runningInterpolation.a;
				return _Utils_eq(motion.position, motion.target);
		}
	};
	switch (property.$) {
		case 'ExactProperty':
			return true;
		case 'ColorProperty':
			var m1 = property.b;
			var m2 = property.c;
			var m3 = property.d;
			var m4 = property.e;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[m1, m2, m3, m4]));
		case 'ShadowProperty':
			var shadow = property.c;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[shadow.offsetX, shadow.offsetY, shadow.size, shadow.blur, shadow.red, shadow.green, shadow.blue, shadow.alpha]));
		case 'Property':
			var m1 = property.b;
			return motionDone(m1);
		case 'Property2':
			var m1 = property.b;
			var m2 = property.c;
			return motionDone(m1) && motionDone(m2);
		case 'Property3':
			var m1 = property.b;
			var m2 = property.c;
			var m3 = property.d;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[m1, m2, m3]));
		case 'Property4':
			var m1 = property.b;
			var m2 = property.c;
			var m3 = property.d;
			var m4 = property.e;
			return A2(
				$elm$core$List$all,
				motionDone,
				_List_fromArray(
					[m1, m2, m3, m4]));
		case 'AngleProperty':
			var m1 = property.b;
			return motionDone(m1);
		case 'Points':
			var ms = property.a;
			return A2(
				$elm$core$List$all,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return motionDone(x) && motionDone(y);
				},
				ms);
		default:
			var cmds = property.a;
			return A2($elm$core$List$all, $mdgriffith$elm_style_animation$Animation$Model$isCmdDone, cmds);
	}
};
var $mdgriffith$elm_style_animation$Animation$Model$matchPoints = F2(
	function (points1, points2) {
		var diff = $elm$core$List$length(points1) - $elm$core$List$length(points2);
		if (diff > 0) {
			var _v0 = $elm$core$List$head(
				$elm$core$List$reverse(points2));
			if (_v0.$ === 'Nothing') {
				return _Utils_Tuple2(points1, points2);
			} else {
				var last2 = _v0.a;
				return _Utils_Tuple2(
					points1,
					_Utils_ap(
						points2,
						A2(
							$elm$core$List$repeat,
							$elm$core$Basics$abs(diff),
							last2)));
			}
		} else {
			if (diff < 0) {
				var _v1 = $elm$core$List$head(
					$elm$core$List$reverse(points1));
				if (_v1.$ === 'Nothing') {
					return _Utils_Tuple2(points1, points2);
				} else {
					var last1 = _v1.a;
					return _Utils_Tuple2(
						_Utils_ap(
							points1,
							A2(
								$elm$core$List$repeat,
								$elm$core$Basics$abs(diff),
								last1)),
						points2);
				}
			} else {
				return _Utils_Tuple2(points1, points2);
			}
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$setPathTarget = F2(
	function (cmd, targetCmd) {
		var setMotionTarget = F2(
			function (motion, targetMotion) {
				var _v27 = motion.interpolation;
				if (_v27.$ === 'Easing') {
					var ease = _v27.a;
					return _Utils_update(
						motion,
						{
							interpolation: $mdgriffith$elm_style_animation$Animation$Model$Easing(
								_Utils_update(
									ease,
									{start: motion.position})),
							target: targetMotion.position
						});
				} else {
					return _Utils_update(
						motion,
						{target: targetMotion.position});
				}
			});
		switch (cmd.$) {
			case 'Move':
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 'Move') {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Move,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 'MoveTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 'MoveTo') {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$MoveTo,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 'Line':
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 'Line') {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Line,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 'LineTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				if (targetCmd.$ === 'LineTo') {
					var t1 = targetCmd.a;
					var t2 = targetCmd.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$LineTo,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return cmd;
				}
			case 'Horizontal':
				var m1 = cmd.a;
				if (targetCmd.$ === 'Horizontal') {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Horizontal(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 'HorizontalTo':
				var m1 = cmd.a;
				if (targetCmd.$ === 'HorizontalTo') {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 'Vertical':
				var m1 = cmd.a;
				if (targetCmd.$ === 'Vertical') {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Vertical(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 'VerticalTo':
				var m1 = cmd.a;
				if (targetCmd.$ === 'VerticalTo') {
					var t1 = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$VerticalTo(
						A2(setMotionTarget, m1, t1));
				} else {
					return cmd;
				}
			case 'Curve':
				var points = cmd.a;
				if (targetCmd.$ === 'Curve') {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Curve(
						{
							control1: _Utils_Tuple2(
								A2(setMotionTarget, points.control1.a, targets.control1.a),
								A2(setMotionTarget, points.control1.b, targets.control1.b)),
							control2: _Utils_Tuple2(
								A2(setMotionTarget, points.control2.a, targets.control2.a),
								A2(setMotionTarget, points.control2.b, targets.control2.b)),
							point: _Utils_Tuple2(
								A2(setMotionTarget, points.point.a, targets.point.a),
								A2(setMotionTarget, points.point.b, targets.point.b))
						});
				} else {
					return cmd;
				}
			case 'CurveTo':
				var points = cmd.a;
				if (targetCmd.$ === 'CurveTo') {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$CurveTo(
						{
							control1: _Utils_Tuple2(
								A2(setMotionTarget, points.control1.a, targets.control1.a),
								A2(setMotionTarget, points.control1.b, targets.control1.b)),
							control2: _Utils_Tuple2(
								A2(setMotionTarget, points.control2.a, targets.control2.a),
								A2(setMotionTarget, points.control2.b, targets.control2.b)),
							point: _Utils_Tuple2(
								A2(setMotionTarget, points.point.a, targets.point.a),
								A2(setMotionTarget, points.point.b, targets.point.b))
						});
				} else {
					return cmd;
				}
			case 'Quadratic':
				var points = cmd.a;
				if (targetCmd.$ === 'Quadratic') {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Quadratic(
						{
							control: _Utils_Tuple2(
								A2(setMotionTarget, points.control.a, targets.control.a),
								A2(setMotionTarget, points.control.b, targets.control.b)),
							point: _Utils_Tuple2(
								A2(setMotionTarget, points.point.a, targets.point.a),
								A2(setMotionTarget, points.point.b, targets.point.b))
						});
				} else {
					return cmd;
				}
			case 'QuadraticTo':
				var points = cmd.a;
				if (targetCmd.$ === 'QuadraticTo') {
					var targets = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo(
						{
							control: _Utils_Tuple2(
								A2(setMotionTarget, points.control.a, targets.control.a),
								A2(setMotionTarget, points.control.b, targets.control.b)),
							point: _Utils_Tuple2(
								A2(setMotionTarget, points.point.a, targets.point.a),
								A2(setMotionTarget, points.point.b, targets.point.b))
						});
				} else {
					return cmd;
				}
			case 'SmoothQuadratic':
				var coords = cmd.a;
				if (targetCmd.$ === 'SmoothQuadratic') {
					var targetCoords = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic(
						A3(
							$elm$core$List$map2,
							F2(
								function (_v14, _v15) {
									var x1 = _v14.a;
									var y1 = _v14.b;
									var x2 = _v15.a;
									var y2 = _v15.b;
									return _Utils_Tuple2(
										A2(setMotionTarget, x1, x2),
										A2(setMotionTarget, y1, y2));
								}),
							coords,
							targetCoords));
				} else {
					return cmd;
				}
			case 'SmoothQuadraticTo':
				var coords = cmd.a;
				if (targetCmd.$ === 'SmoothQuadraticTo') {
					var targetCoords = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo(
						A3(
							$elm$core$List$map2,
							F2(
								function (_v17, _v18) {
									var x1 = _v17.a;
									var y1 = _v17.b;
									var x2 = _v18.a;
									var y2 = _v18.b;
									return _Utils_Tuple2(
										A2(setMotionTarget, x1, x2),
										A2(setMotionTarget, y1, y2));
								}),
							coords,
							targetCoords));
				} else {
					return cmd;
				}
			case 'Smooth':
				var coords = cmd.a;
				if (targetCmd.$ === 'Smooth') {
					var targetCoords = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Smooth(
						A3(
							$elm$core$List$map2,
							F2(
								function (_v20, _v21) {
									var x1 = _v20.a;
									var y1 = _v20.b;
									var x2 = _v21.a;
									var y2 = _v21.b;
									return _Utils_Tuple2(
										A2(setMotionTarget, x1, x2),
										A2(setMotionTarget, y1, y2));
								}),
							coords,
							targetCoords));
				} else {
					return cmd;
				}
			case 'SmoothTo':
				var coords = cmd.a;
				if (targetCmd.$ === 'SmoothTo') {
					var targetCoords = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$SmoothTo(
						A3(
							$elm$core$List$map2,
							F2(
								function (_v23, _v24) {
									var x1 = _v23.a;
									var y1 = _v23.b;
									var x2 = _v24.a;
									var y2 = _v24.b;
									return _Utils_Tuple2(
										A2(setMotionTarget, x1, x2),
										A2(setMotionTarget, y1, y2));
								}),
							coords,
							targetCoords));
				} else {
					return cmd;
				}
			case 'ClockwiseArc':
				var arc = cmd.a;
				if (targetCmd.$ === 'ClockwiseArc') {
					var target = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc(
						function () {
							var y = arc.y;
							var x = arc.x;
							var startAngle = arc.startAngle;
							var radius = arc.radius;
							var endAngle = arc.endAngle;
							return _Utils_update(
								arc,
								{
									endAngle: A2(setMotionTarget, endAngle, target.endAngle),
									radius: A2(setMotionTarget, radius, target.radius),
									startAngle: A2(setMotionTarget, startAngle, target.startAngle),
									x: A2(setMotionTarget, x, target.x),
									y: A2(setMotionTarget, y, target.y)
								});
						}());
				} else {
					return cmd;
				}
			case 'AntiClockwiseArc':
				var arc = cmd.a;
				if (targetCmd.$ === 'AntiClockwiseArc') {
					var target = targetCmd.a;
					return $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc(
						function () {
							var y = arc.y;
							var x = arc.x;
							var startAngle = arc.startAngle;
							var radius = arc.radius;
							var endAngle = arc.endAngle;
							return _Utils_update(
								arc,
								{
									endAngle: A2(setMotionTarget, endAngle, target.endAngle),
									radius: A2(setMotionTarget, radius, target.radius),
									startAngle: A2(setMotionTarget, startAngle, target.startAngle),
									x: A2(setMotionTarget, x, target.x),
									y: A2(setMotionTarget, y, target.y)
								});
						}());
				} else {
					return cmd;
				}
			default:
				return $mdgriffith$elm_style_animation$Animation$Model$Close;
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$setTarget = F3(
	function (overrideInterpolation, current, newTarget) {
		var setMotionTarget = F2(
			function (motion, targetMotion) {
				var newMotion = overrideInterpolation ? _Utils_update(
					motion,
					{
						interpolationOverride: $elm$core$Maybe$Just(targetMotion.interpolation)
					}) : motion;
				var _v13 = newMotion.interpolationOverride;
				if (_v13.$ === 'Nothing') {
					var _v14 = newMotion.interpolation;
					if (_v14.$ === 'Easing') {
						var ease = _v14.a;
						return _Utils_update(
							newMotion,
							{
								interpolation: $mdgriffith$elm_style_animation$Animation$Model$Easing(
									_Utils_update(
										ease,
										{progress: 0, start: motion.position})),
								target: targetMotion.position
							});
					} else {
						return _Utils_update(
							newMotion,
							{target: targetMotion.position});
					}
				} else {
					var override = _v13.a;
					if (override.$ === 'Easing') {
						var ease = override.a;
						return _Utils_update(
							newMotion,
							{
								interpolationOverride: $elm$core$Maybe$Just(
									$mdgriffith$elm_style_animation$Animation$Model$Easing(
										_Utils_update(
											ease,
											{progress: 0, start: motion.position}))),
								target: targetMotion.position
							});
					} else {
						return _Utils_update(
							newMotion,
							{target: targetMotion.position});
					}
				}
			});
		switch (current.$) {
			case 'ExactProperty':
				var name = current.a;
				var value = current.b;
				return A2($mdgriffith$elm_style_animation$Animation$Model$ExactProperty, name, value);
			case 'ColorProperty':
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				var m3 = current.d;
				var m4 = current.e;
				if (newTarget.$ === 'ColorProperty') {
					var t1 = newTarget.b;
					var t2 = newTarget.c;
					var t3 = newTarget.d;
					var t4 = newTarget.e;
					return A5(
						$mdgriffith$elm_style_animation$Animation$Model$ColorProperty,
						name,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2),
						A2(setMotionTarget, m3, t3),
						A2(setMotionTarget, m4, t4));
				} else {
					return current;
				}
			case 'ShadowProperty':
				var name = current.a;
				var inset = current.b;
				var shadow = current.c;
				if (newTarget.$ === 'ShadowProperty') {
					var targetShadow = newTarget.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$ShadowProperty,
						name,
						inset,
						{
							alpha: A2(setMotionTarget, shadow.alpha, targetShadow.alpha),
							blue: A2(setMotionTarget, shadow.blue, targetShadow.blue),
							blur: A2(setMotionTarget, shadow.blur, targetShadow.blur),
							green: A2(setMotionTarget, shadow.green, targetShadow.green),
							offsetX: A2(setMotionTarget, shadow.offsetX, targetShadow.offsetX),
							offsetY: A2(setMotionTarget, shadow.offsetY, targetShadow.offsetY),
							red: A2(setMotionTarget, shadow.red, targetShadow.red),
							size: A2(setMotionTarget, shadow.size, targetShadow.size)
						});
				} else {
					return current;
				}
			case 'Property':
				var name = current.a;
				var m1 = current.b;
				if (newTarget.$ === 'Property') {
					var t1 = newTarget.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Property,
						name,
						A2(setMotionTarget, m1, t1));
				} else {
					return current;
				}
			case 'Property2':
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				if (newTarget.$ === 'Property2') {
					var t1 = newTarget.b;
					var t2 = newTarget.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$Property2,
						name,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2));
				} else {
					return current;
				}
			case 'Property3':
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				var m3 = current.d;
				if (newTarget.$ === 'Property3') {
					var t1 = newTarget.b;
					var t2 = newTarget.c;
					var t3 = newTarget.d;
					return A4(
						$mdgriffith$elm_style_animation$Animation$Model$Property3,
						name,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2),
						A2(setMotionTarget, m3, t3));
				} else {
					return current;
				}
			case 'Property4':
				var name = current.a;
				var m1 = current.b;
				var m2 = current.c;
				var m3 = current.d;
				var m4 = current.e;
				if (newTarget.$ === 'Property4') {
					var t1 = newTarget.b;
					var t2 = newTarget.c;
					var t3 = newTarget.d;
					var t4 = newTarget.e;
					return A5(
						$mdgriffith$elm_style_animation$Animation$Model$Property4,
						name,
						A2(setMotionTarget, m1, t1),
						A2(setMotionTarget, m2, t2),
						A2(setMotionTarget, m3, t3),
						A2(setMotionTarget, m4, t4));
				} else {
					return current;
				}
			case 'AngleProperty':
				var name = current.a;
				var m1 = current.b;
				if (newTarget.$ === 'AngleProperty') {
					var t1 = newTarget.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$AngleProperty,
						name,
						A2(setMotionTarget, m1, t1));
				} else {
					return current;
				}
			case 'Points':
				var currentPts = current.a;
				if (newTarget.$ === 'Points') {
					var targetPts = newTarget.a;
					var _v9 = A2($mdgriffith$elm_style_animation$Animation$Model$matchPoints, currentPts, targetPts);
					var m1s = _v9.a;
					var m2s = _v9.b;
					return $mdgriffith$elm_style_animation$Animation$Model$Points(
						A3(
							$elm$core$List$map2,
							F2(
								function (_v10, _v11) {
									var x1 = _v10.a;
									var y1 = _v10.b;
									var x2 = _v11.a;
									var y2 = _v11.b;
									return _Utils_Tuple2(
										A2(setMotionTarget, x1, x2),
										A2(setMotionTarget, y1, y2));
								}),
							m1s,
							m2s));
				} else {
					return current;
				}
			default:
				var cmds = current.a;
				if (newTarget.$ === 'Path') {
					var targets = newTarget.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Path(
						A3($elm$core$List$map2, $mdgriffith$elm_style_animation$Animation$Model$setPathTarget, cmds, targets));
				} else {
					return current;
				}
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$zipPropertiesGreedy = F2(
	function (initialProps, newTargetProps) {
		var propertyMatch = F2(
			function (prop1, prop2) {
				return _Utils_eq(
					$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop1),
					$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop2));
			});
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, _v2) {
					var stackA = _v2.a;
					var stackB = _v2.b;
					var result = _v2.c;
					var _v3 = $elm$core$List$head(stackA);
					if (_v3.$ === 'Nothing') {
						return _Utils_Tuple3(stackA, stackB, result);
					} else {
						var a = _v3.a;
						var _v4 = A2(
							$elm$core$List$partition,
							propertyMatch(a),
							stackB);
						var matchingBs = _v4.a;
						var nonMatchingBs = _v4.b;
						return _Utils_Tuple3(
							A2($elm$core$List$drop, 1, stackA),
							function () {
								if (!matchingBs.b) {
									return nonMatchingBs;
								} else {
									var b = matchingBs.a;
									var remainingBs = matchingBs.b;
									return _Utils_ap(remainingBs, nonMatchingBs);
								}
							}(),
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(
									a,
									$elm$core$List$head(matchingBs)),
								result));
					}
				}),
			_Utils_Tuple3(initialProps, newTargetProps, _List_Nil),
			A2(
				$elm$core$List$repeat,
				$elm$core$List$length(initialProps),
				0));
		var warnings = _v0.b;
		var props = _v0.c;
		var _v6 = warnings;
		return $elm$core$List$reverse(props);
	});
var $mdgriffith$elm_style_animation$Animation$Model$startTowards = F3(
	function (overrideInterpolation, current, target) {
		return A2(
			$elm$core$List$filterMap,
			function (propPair) {
				if (propPair.b.$ === 'Just') {
					var cur = propPair.a;
					var to = propPair.b.a;
					return $elm$core$Maybe$Just(
						A3($mdgriffith$elm_style_animation$Animation$Model$setTarget, overrideInterpolation, cur, to));
				} else {
					var prop = propPair.a;
					var _v1 = propPair.b;
					return $elm$core$Maybe$Just(prop);
				}
			},
			A2($mdgriffith$elm_style_animation$Animation$Model$zipPropertiesGreedy, current, target));
	});
var $mdgriffith$elm_style_animation$Animation$Model$tolerance = 0.01;
var $elm$core$Basics$truncate = _Basics_truncate;
var $mdgriffith$elm_style_animation$Animation$Model$vTolerance = 0.1;
var $mdgriffith$elm_style_animation$Animation$Model$stepInterpolation = F2(
	function (posix, motion) {
		var interpolationToUse = A2($elm$core$Maybe$withDefault, motion.interpolation, motion.interpolationOverride);
		var dtms = $elm$time$Time$posixToMillis(posix);
		switch (interpolationToUse.$) {
			case 'AtSpeed':
				var perSecond = interpolationToUse.a.perSecond;
				var _v1 = function () {
					if (_Utils_cmp(motion.position, motion.target) < 0) {
						var _new = motion.position + (perSecond * (dtms / 1000));
						return _Utils_Tuple2(
							_new,
							_Utils_cmp(_new, motion.target) > -1);
					} else {
						var _new = motion.position - (perSecond * (dtms / 1000));
						return _Utils_Tuple2(
							_new,
							_Utils_cmp(_new, motion.target) < 1);
					}
				}();
				var newPos = _v1.a;
				var finished = _v1.b;
				return finished ? _Utils_update(
					motion,
					{position: motion.target, velocity: 0.0}) : _Utils_update(
					motion,
					{position: newPos, velocity: perSecond * 1000});
			case 'Spring':
				var stiffness = interpolationToUse.a.stiffness;
				var damping = interpolationToUse.a.damping;
				var fspring = stiffness * (motion.target - motion.position);
				var fdamper = ((-1) * damping) * motion.velocity;
				var dt = dtms / 1000;
				var a = fspring + fdamper;
				var newVelocity = motion.velocity + (a * dt);
				var newPos = motion.position + (newVelocity * dt);
				var dx = $elm$core$Basics$abs(motion.target - newPos);
				return ((_Utils_cmp(dx, $mdgriffith$elm_style_animation$Animation$Model$tolerance) < 0) && (_Utils_cmp(
					$elm$core$Basics$abs(newVelocity),
					$mdgriffith$elm_style_animation$Animation$Model$vTolerance) < 0)) ? _Utils_update(
					motion,
					{position: motion.target, velocity: 0.0}) : _Utils_update(
					motion,
					{position: newPos, velocity: newVelocity});
			default:
				var progress = interpolationToUse.a.progress;
				var duration = interpolationToUse.a.duration;
				var ease = interpolationToUse.a.ease;
				var start = interpolationToUse.a.start;
				var durationMs = $elm$time$Time$posixToMillis(duration);
				var newProgress = (((dtms / durationMs) + progress) < 1) ? ((dtms / durationMs) + progress) : 1;
				var eased = ease(newProgress);
				var distance = motion.target - start;
				var newPos = ((((eased * distance) + start) * 10000) | 0) / 10000;
				var newVelocity = (newProgress === 1) ? 0 : ((newPos - motion.position) / dtms);
				var _v2 = motion.interpolationOverride;
				if (_v2.$ === 'Nothing') {
					return _Utils_update(
						motion,
						{
							interpolation: $mdgriffith$elm_style_animation$Animation$Model$Easing(
								{duration: duration, ease: ease, progress: newProgress, start: start}),
							position: newPos,
							velocity: newVelocity
						});
				} else {
					var override = _v2.a;
					return _Utils_update(
						motion,
						{
							interpolationOverride: $elm$core$Maybe$Just(
								$mdgriffith$elm_style_animation$Animation$Model$Easing(
									{duration: duration, ease: ease, progress: newProgress, start: start})),
							position: newPos,
							velocity: newVelocity
						});
				}
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$stepPath = F2(
	function (dt, cmd) {
		var stepCoords = function (coords) {
			return A2(
				$elm$core$List$map,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return _Utils_Tuple2(
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, x),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, y));
				},
				coords);
		};
		switch (cmd.$) {
			case 'Move':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Move,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 'MoveTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$MoveTo,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 'Line':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$Line,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 'LineTo':
				var m1 = cmd.a;
				var m2 = cmd.b;
				return A2(
					$mdgriffith$elm_style_animation$Animation$Model$LineTo,
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m1),
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, m2));
			case 'Horizontal':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Horizontal(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 'HorizontalTo':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$HorizontalTo(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 'Vertical':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Vertical(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 'VerticalTo':
				var motion = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$VerticalTo(
					A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
			case 'Curve':
				var control1 = cmd.a.control1;
				var control2 = cmd.a.control2;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$Curve(
					{
						control1: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.b)),
						control2: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.b)),
						point: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 'CurveTo':
				var control1 = cmd.a.control1;
				var control2 = cmd.a.control2;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$CurveTo(
					{
						control1: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control1.b)),
						control2: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control2.b)),
						point: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 'Quadratic':
				var control = cmd.a.control;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$Quadratic(
					{
						control: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.b)),
						point: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 'QuadraticTo':
				var control = cmd.a.control;
				var point = cmd.a.point;
				return $mdgriffith$elm_style_animation$Animation$Model$QuadraticTo(
					{
						control: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, control.b)),
						point: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.a),
							A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, point.b))
					});
			case 'SmoothQuadratic':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadratic(
					stepCoords(coords));
			case 'SmoothQuadraticTo':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothQuadraticTo(
					stepCoords(coords));
			case 'Smooth':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$Smooth(
					stepCoords(coords));
			case 'SmoothTo':
				var coords = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$SmoothTo(
					stepCoords(coords));
			case 'ClockwiseArc':
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$ClockwiseArc(
					_Utils_update(
						arc,
						{
							endAngle: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.endAngle),
							radius: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.radius),
							startAngle: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.startAngle),
							x: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.x),
							y: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.y)
						}));
			case 'AntiClockwiseArc':
				var arc = cmd.a;
				return $mdgriffith$elm_style_animation$Animation$Model$AntiClockwiseArc(
					_Utils_update(
						arc,
						{
							endAngle: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.endAngle),
							radius: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.radius),
							startAngle: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.startAngle),
							x: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.x),
							y: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, arc.y)
						}));
			default:
				return $mdgriffith$elm_style_animation$Animation$Model$Close;
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$step = F2(
	function (dt, props) {
		var stepProp = function (property) {
			switch (property.$) {
				case 'ExactProperty':
					var name = property.a;
					var value = property.b;
					return A2($mdgriffith$elm_style_animation$Animation$Model$ExactProperty, name, value);
				case 'Property':
					var name = property.a;
					var motion = property.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$Property,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
				case 'Property2':
					var name = property.a;
					var motion1 = property.b;
					var motion2 = property.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$Property2,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion1),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion2));
				case 'Property3':
					var name = property.a;
					var motion1 = property.b;
					var motion2 = property.c;
					var motion3 = property.d;
					return A4(
						$mdgriffith$elm_style_animation$Animation$Model$Property3,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion1),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion2),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion3));
				case 'Property4':
					var name = property.a;
					var motion1 = property.b;
					var motion2 = property.c;
					var motion3 = property.d;
					var motion4 = property.e;
					return A5(
						$mdgriffith$elm_style_animation$Animation$Model$Property4,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion1),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion2),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion3),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion4));
				case 'AngleProperty':
					var name = property.a;
					var motion = property.b;
					return A2(
						$mdgriffith$elm_style_animation$Animation$Model$AngleProperty,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, motion));
				case 'ColorProperty':
					var name = property.a;
					var red = property.b;
					var green = property.c;
					var blue = property.d;
					var alpha = property.e;
					return A5(
						$mdgriffith$elm_style_animation$Animation$Model$ColorProperty,
						name,
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, red),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, green),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, blue),
						A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, alpha));
				case 'ShadowProperty':
					var name = property.a;
					var inset = property.b;
					var shadow = property.c;
					return A3(
						$mdgriffith$elm_style_animation$Animation$Model$ShadowProperty,
						name,
						inset,
						{
							alpha: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.alpha),
							blue: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.blue),
							blur: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.blur),
							green: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.green),
							offsetX: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.offsetX),
							offsetY: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.offsetY),
							red: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.red),
							size: A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, shadow.size)
						});
				case 'Points':
					var points = property.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Points(
						A2(
							$elm$core$List$map,
							function (_v1) {
								var x = _v1.a;
								var y = _v1.b;
								return _Utils_Tuple2(
									A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, x),
									A2($mdgriffith$elm_style_animation$Animation$Model$stepInterpolation, dt, y));
							},
							points));
				default:
					var cmds = property.a;
					return $mdgriffith$elm_style_animation$Animation$Model$Path(
						A2(
							$elm$core$List$map,
							$mdgriffith$elm_style_animation$Animation$Model$stepPath(dt),
							cmds));
			}
		};
		return A2($elm$core$List$map, stepProp, props);
	});
var $mdgriffith$elm_style_animation$Animation$Model$alreadyThere = F2(
	function (current, target) {
		return A2(
			$elm$core$List$all,
			$mdgriffith$elm_style_animation$Animation$Model$isDone,
			A2(
				$mdgriffith$elm_style_animation$Animation$Model$step,
				$elm$time$Time$millisToPosix(0),
				A3($mdgriffith$elm_style_animation$Animation$Model$startTowards, false, current, target)));
	});
var $mdgriffith$elm_style_animation$Animation$Model$replaceProps = F2(
	function (props, replacements) {
		var replacementNames = A2($elm$core$List$map, $mdgriffith$elm_style_animation$Animation$Model$propertyName, replacements);
		var removed = A2(
			$elm$core$List$filter,
			function (prop) {
				return !A2(
					$elm$core$List$member,
					$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop),
					replacementNames);
			},
			props);
		return _Utils_ap(removed, replacements);
	});
var $mdgriffith$elm_style_animation$Animation$Model$resolveSteps = F3(
	function (currentStyle, steps, dt) {
		resolveSteps:
		while (true) {
			var _v0 = $elm$core$List$head(steps);
			if (_v0.$ === 'Nothing') {
				return _Utils_Tuple3(currentStyle, _List_Nil, _List_Nil);
			} else {
				var currentStep = _v0.a;
				switch (currentStep.$) {
					case 'Wait':
						var n = currentStep.a;
						if ($elm$time$Time$posixToMillis(n) <= 0) {
							var $temp$currentStyle = currentStyle,
								$temp$steps = A2($elm$core$List$drop, 1, steps),
								$temp$dt = dt;
							currentStyle = $temp$currentStyle;
							steps = $temp$steps;
							dt = $temp$dt;
							continue resolveSteps;
						} else {
							return _Utils_Tuple3(
								currentStyle,
								_List_Nil,
								A2(
									$elm$core$List$cons,
									$mdgriffith$elm_style_animation$Animation$Model$Wait(
										$elm$time$Time$millisToPosix(
											$elm$time$Time$posixToMillis(n) - $elm$time$Time$posixToMillis(dt))),
									A2($elm$core$List$drop, 1, steps)));
						}
					case 'Send':
						var msg = currentStep.a;
						var _v2 = A3(
							$mdgriffith$elm_style_animation$Animation$Model$resolveSteps,
							currentStyle,
							A2($elm$core$List$drop, 1, steps),
							dt);
						var newStyle = _v2.a;
						var msgs = _v2.b;
						var remainingSteps = _v2.c;
						return _Utils_Tuple3(
							newStyle,
							A2($elm$core$List$cons, msg, msgs),
							remainingSteps);
					case 'To':
						var target = currentStep.a;
						if (A2($mdgriffith$elm_style_animation$Animation$Model$alreadyThere, currentStyle, target)) {
							return _Utils_Tuple3(
								currentStyle,
								_List_Nil,
								A2($elm$core$List$drop, 1, steps));
						} else {
							var $temp$currentStyle = A3($mdgriffith$elm_style_animation$Animation$Model$startTowards, false, currentStyle, target),
								$temp$steps = A2(
								$elm$core$List$cons,
								$mdgriffith$elm_style_animation$Animation$Model$Step,
								A2($elm$core$List$drop, 1, steps)),
								$temp$dt = dt;
							currentStyle = $temp$currentStyle;
							steps = $temp$steps;
							dt = $temp$dt;
							continue resolveSteps;
						}
					case 'ToWith':
						var target = currentStep.a;
						if (A2($mdgriffith$elm_style_animation$Animation$Model$alreadyThere, currentStyle, target)) {
							return _Utils_Tuple3(
								currentStyle,
								_List_Nil,
								A2($elm$core$List$drop, 1, steps));
						} else {
							var $temp$currentStyle = A3($mdgriffith$elm_style_animation$Animation$Model$startTowards, true, currentStyle, target),
								$temp$steps = A2(
								$elm$core$List$cons,
								$mdgriffith$elm_style_animation$Animation$Model$Step,
								A2($elm$core$List$drop, 1, steps)),
								$temp$dt = dt;
							currentStyle = $temp$currentStyle;
							steps = $temp$steps;
							dt = $temp$dt;
							continue resolveSteps;
						}
					case 'Set':
						var props = currentStep.a;
						var $temp$currentStyle = A2($mdgriffith$elm_style_animation$Animation$Model$replaceProps, currentStyle, props),
							$temp$steps = A2($elm$core$List$drop, 1, steps),
							$temp$dt = dt;
						currentStyle = $temp$currentStyle;
						steps = $temp$steps;
						dt = $temp$dt;
						continue resolveSteps;
					case 'Step':
						var stepped = A2($mdgriffith$elm_style_animation$Animation$Model$step, dt, currentStyle);
						return A2($elm$core$List$all, $mdgriffith$elm_style_animation$Animation$Model$isDone, stepped) ? _Utils_Tuple3(
							A2(
								$elm$core$List$map,
								$mdgriffith$elm_style_animation$Animation$Model$mapToMotion(
									function (m) {
										return _Utils_update(
											m,
											{interpolationOverride: $elm$core$Maybe$Nothing});
									}),
								stepped),
							_List_Nil,
							A2($elm$core$List$drop, 1, steps)) : _Utils_Tuple3(stepped, _List_Nil, steps);
					case 'Loop':
						var substeps = currentStep.a;
						var $temp$currentStyle = currentStyle,
							$temp$steps = _Utils_ap(
							substeps,
							_List_fromArray(
								[
									$mdgriffith$elm_style_animation$Animation$Model$Loop(substeps)
								])),
							$temp$dt = dt;
						currentStyle = $temp$currentStyle;
						steps = $temp$steps;
						dt = $temp$dt;
						continue resolveSteps;
					default:
						var n = currentStep.a;
						var substeps = currentStep.b;
						if (n <= 0) {
							var $temp$currentStyle = currentStyle,
								$temp$steps = A2($elm$core$List$drop, 1, steps),
								$temp$dt = dt;
							currentStyle = $temp$currentStyle;
							steps = $temp$steps;
							dt = $temp$dt;
							continue resolveSteps;
						} else {
							var $temp$currentStyle = currentStyle,
								$temp$steps = _Utils_ap(
								substeps,
								_Utils_ap(
									_List_fromArray(
										[
											A2($mdgriffith$elm_style_animation$Animation$Model$Repeat, n - 1, substeps)
										]),
									A2($elm$core$List$drop, 1, steps))),
								$temp$dt = dt;
							currentStyle = $temp$currentStyle;
							steps = $temp$steps;
							dt = $temp$dt;
							continue resolveSteps;
						}
				}
			}
		}
	});
var $mdgriffith$elm_style_animation$Animation$Model$updateAnimation = F2(
	function (_v0, _v1) {
		var now = _v0.a;
		var model = _v1.a;
		var timing = A2($mdgriffith$elm_style_animation$Animation$Model$refreshTiming, now, model.timing);
		var _v2 = A2(
			$elm$core$List$partition,
			function (_v4) {
				var wait = _v4.a;
				var mySteps = _v4.b;
				return $elm$time$Time$posixToMillis(wait) <= 0;
			},
			A2(
				$elm$core$List$map,
				function (_v3) {
					var wait = _v3.a;
					var mySteps = _v3.b;
					return _Utils_Tuple2(
						$elm$time$Time$millisToPosix(
							$elm$time$Time$posixToMillis(wait) - $elm$time$Time$posixToMillis(timing.dt)),
						mySteps);
				},
				model.interruption));
		var readyInterruption = _v2.a;
		var queuedInterruptions = _v2.b;
		var _v5 = function () {
			var _v6 = $elm$core$List$head(readyInterruption);
			if (_v6.$ === 'Just') {
				var _v7 = _v6.a;
				var wait = _v7.a;
				var interrupt = _v7.b;
				return _Utils_Tuple2(
					interrupt,
					A2(
						$elm$core$List$map,
						$mdgriffith$elm_style_animation$Animation$Model$mapToMotion(
							function (m) {
								return _Utils_update(
									m,
									{interpolationOverride: $elm$core$Maybe$Nothing});
							}),
						model.style));
			} else {
				return _Utils_Tuple2(model.steps, model.style);
			}
		}();
		var steps = _v5.a;
		var style = _v5.b;
		var _v8 = A3($mdgriffith$elm_style_animation$Animation$Model$resolveSteps, style, steps, timing.dt);
		var revisedStyle = _v8.a;
		var sentMessages = _v8.b;
		var revisedSteps = _v8.c;
		return _Utils_Tuple2(
			$mdgriffith$elm_style_animation$Animation$Model$Animation(
				_Utils_update(
					model,
					{
						interruption: queuedInterruptions,
						running: (!(!$elm$core$List$length(revisedSteps))) || (!(!$elm$core$List$length(queuedInterruptions))),
						steps: revisedSteps,
						style: revisedStyle,
						timing: timing
					})),
			$elm$core$Platform$Cmd$batch(
				A2(
					$elm$core$List$map,
					function (m) {
						return A2(
							$elm$core$Task$perform,
							$elm$core$Basics$identity,
							$elm$core$Task$succeed(m));
					},
					sentMessages)));
	});
var $mdgriffith$elm_style_animation$Animation$update = F2(
	function (tick, animation) {
		return A2($mdgriffith$elm_style_animation$Animation$Model$updateAnimation, tick, animation).a;
	});
var $author$project$Update$update_fadeout = F2(
	function (model, msg) {
		var set = model.gameset;
		switch (msg.$) {
			case 'GetViewport':
				var viewport = msg.a.viewport;
				return A2($author$project$Update_small$update_viewport, model, viewport);
			case 'Resize':
				var wid = msg.a;
				var hei = msg.b;
				return A3($author$project$Update_small$update_resize, model, wid, hei);
			case 'Tick':
				var elapsed = msg.a;
				return A2($author$project$Scoreboard$fadeout, model, elapsed);
			case 'Animate':
				var animMsg = msg.a;
				var board = model.scoreboard;
				var _v1 = board.score;
				var curtain = _v1.a;
				var number = _v1.b;
				var nboard = _Utils_update(
					board,
					{
						board: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, board.board),
						menu_button: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, board.menu_button),
						newrecord: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, board.newrecord),
						reset_button: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, board.reset_button),
						score: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$update, animMsg, curtain),
							number)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							animatecurtain: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, model.animatecurtain),
							button: A2(
								$elm$core$List$map,
								function (_v2) {
									var anistate = _v2.anistate;
									var helppage = _v2.helppage;
									var buttontype = _v2.buttontype;
									return {
										anistate: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, anistate),
										buttontype: buttontype,
										helppage: A2(
											$elm$core$List$map,
											function (x) {
												return A2($mdgriffith$elm_style_animation$Animation$update, animMsg, x);
											},
											helppage)
									};
								},
								model.button),
							scoreboard: nboard
						}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Parameter$Gaming = function (a) {
	return {$: 'Gaming', a: a};
};
var $mdgriffith$elm_style_animation$Animation$easing = function (_v0) {
	var duration = _v0.duration;
	var ease = _v0.ease;
	return $mdgriffith$elm_style_animation$Animation$Model$Easing(
		{
			duration: $elm$time$Time$millisToPosix(
				$elm$core$Basics$round(duration)),
			ease: ease,
			progress: 1,
			start: 0
		});
};
var $mdgriffith$elm_style_animation$Animation$extractInitialWait = function (steps) {
	var _v0 = $elm$core$List$head(steps);
	if (_v0.$ === 'Nothing') {
		return _Utils_Tuple2(
			$elm$time$Time$millisToPosix(0),
			_List_Nil);
	} else {
		var step = _v0.a;
		if (step.$ === 'Wait') {
			var till = step.a;
			var _v2 = $mdgriffith$elm_style_animation$Animation$extractInitialWait(
				A2($elm$core$List$drop, 1, steps));
			var additionalTime = _v2.a;
			var remainingSteps = _v2.b;
			return _Utils_Tuple2(
				$elm$time$Time$millisToPosix(
					$elm$time$Time$posixToMillis(till) + $elm$time$Time$posixToMillis(additionalTime)),
				remainingSteps);
		} else {
			return _Utils_Tuple2(
				$elm$time$Time$millisToPosix(0),
				steps);
		}
	}
};
var $mdgriffith$elm_style_animation$Animation$interrupt = F2(
	function (steps, _v0) {
		var model = _v0.a;
		return $mdgriffith$elm_style_animation$Animation$Model$Animation(
			_Utils_update(
				model,
				{
					interruption: A2(
						$elm$core$List$cons,
						$mdgriffith$elm_style_animation$Animation$extractInitialWait(steps),
						model.interruption),
					running: true
				}));
	});
var $mdgriffith$elm_style_animation$Animation$Model$ToWith = function (a) {
	return {$: 'ToWith', a: a};
};
var $mdgriffith$elm_style_animation$Animation$toWith = F2(
	function (interp, props) {
		return $mdgriffith$elm_style_animation$Animation$Model$ToWith(
			A2(
				$elm$core$List$map,
				$mdgriffith$elm_style_animation$Animation$Model$mapToMotion(
					function (m) {
						return _Utils_update(
							m,
							{interpolation: interp});
					}),
				props));
	});
var $author$project$Animate$button_appear = F2(
	function (model, progress) {
		var t = _List_fromArray(
			[
				_Utils_Tuple2(1, 1)
			]);
		var set = model.gameset;
		var m = $author$project$Parameter$map_initial;
		var nset = _Utils_update(
			set,
			{map: m, todo: t});
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					button: A2(
						$elm$core$List$map,
						function (_v0) {
							var anistate = _v0.anistate;
							var helppage = _v0.helppage;
							var buttontype = _v0.buttontype;
							return {
								anistate: A2(
									$mdgriffith$elm_style_animation$Animation$interrupt,
									_List_fromArray(
										[
											A2(
											$mdgriffith$elm_style_animation$Animation$toWith,
											$mdgriffith$elm_style_animation$Animation$easing(
												{
													duration: 300,
													ease: function (a) {
														return a;
													}
												}),
											_List_fromArray(
												[
													$mdgriffith$elm_style_animation$Animation$opacity(1.0)
												]))
										]),
									anistate),
								buttontype: buttontype,
								helppage: helppage
							};
						},
						model.button),
					gameset: nset,
					progress: progress
				}),
			$author$project$Map$map_brick_generate);
	});
var $author$project$Parameter$Reset = function (a) {
	return {$: 'Reset', a: a};
};
var $mdgriffith$elm_style_animation$Animation$Color = F4(
	function (red, green, blue, alpha) {
		return {alpha: alpha, blue: blue, green: green, red: red};
	});
var $mdgriffith$elm_style_animation$Animation$shadow = function (shade) {
	return A3(
		$mdgriffith$elm_style_animation$Animation$Model$ShadowProperty,
		'box-shadow',
		false,
		{
			alpha: A2($mdgriffith$elm_style_animation$Animation$initMotion, shade.color.alpha, 'px'),
			blue: A2($mdgriffith$elm_style_animation$Animation$initMotion, shade.color.blue, 'px'),
			blur: A2($mdgriffith$elm_style_animation$Animation$initMotion, shade.blur, 'px'),
			green: A2($mdgriffith$elm_style_animation$Animation$initMotion, shade.color.green, 'px'),
			offsetX: A2($mdgriffith$elm_style_animation$Animation$initMotion, shade.offsetX, 'px'),
			offsetY: A2($mdgriffith$elm_style_animation$Animation$initMotion, shade.offsetY, 'px'),
			red: A2($mdgriffith$elm_style_animation$Animation$initMotion, shade.color.red, 'px'),
			size: A2($mdgriffith$elm_style_animation$Animation$initMotion, shade.size, 'px')
		});
};
var $mdgriffith$elm_style_animation$Animation$length2 = F3(
	function (name, _v0, _v1) {
		var val = _v0.a;
		var len = _v0.b;
		var val2 = _v1.a;
		var len2 = _v1.b;
		return A3(
			$mdgriffith$elm_style_animation$Animation$Model$Property2,
			name,
			A2($mdgriffith$elm_style_animation$Animation$initMotion, val, len),
			A2($mdgriffith$elm_style_animation$Animation$initMotion, val2, len2));
	});
var $mdgriffith$elm_style_animation$Animation$translate = F2(
	function (_v0, _v1) {
		var valX = _v0.a;
		var len1 = _v0.b;
		var valY = _v1.a;
		var len2 = _v1.b;
		return A3(
			$mdgriffith$elm_style_animation$Animation$length2,
			'translate',
			_Utils_Tuple2(
				valX,
				$mdgriffith$elm_style_animation$Animation$lengthUnitName(len1)),
			_Utils_Tuple2(
				valY,
				$mdgriffith$elm_style_animation$Animation$lengthUnitName(len2)));
	});
var $author$project$Animate$button_zoom_out = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_style_animation$Animation$toWith,
		$mdgriffith$elm_style_animation$Animation$easing(
			{
				duration: 300,
				ease: function (x) {
					return x;
				}
			}),
		_List_fromArray(
			[
				$mdgriffith$elm_style_animation$Animation$opacity(1.0),
				$mdgriffith$elm_style_animation$Animation$color(
				{alpha: 1, blue: 255, green: 255, red: 255}),
				$mdgriffith$elm_style_animation$Animation$scale(1.0),
				$mdgriffith$elm_style_animation$Animation$backgroundColor(
				{alpha: 0.3, blue: 0, green: 0, red: 255}),
				$mdgriffith$elm_style_animation$Animation$borderWidth(
				$mdgriffith$elm_style_animation$Animation$px(2.0)),
				$mdgriffith$elm_style_animation$Animation$borderColor(
				{alpha: 1, blue: 0, green: 200, red: 200}),
				A2(
				$mdgriffith$elm_style_animation$Animation$translate,
				$mdgriffith$elm_style_animation$Animation$px(0),
				$mdgriffith$elm_style_animation$Animation$px(0)),
				$mdgriffith$elm_style_animation$Animation$scale(1),
				$mdgriffith$elm_style_animation$Animation$shadow(
				{
					blur: 2,
					color: A4($mdgriffith$elm_style_animation$Animation$Color, 0, 0, 0, 0.3),
					offsetX: 0,
					offsetY: 1,
					size: 0
				})
			]))
	]);
var $author$project$Animate$find_page = F2(
	function (any, num) {
		return A2(
			$elm$core$Maybe$withDefault,
			$mdgriffith$elm_style_animation$Animation$style(_List_Nil),
			$elm$core$List$head(
				A2($elm$core$List$drop, num - 1, any)));
	});
var $mdgriffith$elm_style_animation$Animation$path = function (commands) {
	return $mdgriffith$elm_style_animation$Animation$Model$Path(commands);
};
var $mdgriffith$elm_style_animation$Animation$width = function (_v0) {
	var val = _v0.a;
	var len = _v0.b;
	return A3(
		$mdgriffith$elm_style_animation$Animation$length,
		'width',
		val,
		$mdgriffith$elm_style_animation$Animation$lengthUnitName(len));
};
var $author$project$Animate$helppage_zoom_out = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_style_animation$Animation$toWith,
		$mdgriffith$elm_style_animation$Animation$easing(
			{
				duration: 300,
				ease: function (a) {
					return a;
				}
			}),
		_List_fromArray(
			[
				$mdgriffith$elm_style_animation$Animation$opacity(0),
				$mdgriffith$elm_style_animation$Animation$width(
				$mdgriffith$elm_style_animation$Animation$px(0.0)),
				$mdgriffith$elm_style_animation$Animation$color(
				{alpha: 1, blue: 255, green: 255, red: 255}),
				$mdgriffith$elm_style_animation$Animation$scale(1.0),
				$mdgriffith$elm_style_animation$Animation$path(_List_Nil),
				$mdgriffith$elm_style_animation$Animation$backgroundColor(
				{alpha: 0.3, blue: 0, green: 0, red: 255}),
				$mdgriffith$elm_style_animation$Animation$borderWidth(
				$mdgriffith$elm_style_animation$Animation$px(5.0)),
				$mdgriffith$elm_style_animation$Animation$borderColor(
				{alpha: 1, blue: 0, green: 200, red: 200}),
				A2(
				$mdgriffith$elm_style_animation$Animation$translate,
				$mdgriffith$elm_style_animation$Animation$px(0),
				$mdgriffith$elm_style_animation$Animation$px(0)),
				$mdgriffith$elm_style_animation$Animation$borderRadius(
				$mdgriffith$elm_style_animation$Animation$px(3.0))
			]))
	]);
var $author$project$Animate$zoomout_button = F2(
	function (model, button_type) {
		var buttons = A2(
			$elm$core$List$map,
			function (_v0) {
				var anistate = _v0.anistate;
				var helppage = _v0.helppage;
				var buttontype = _v0.buttontype;
				return {
					anistate: A2($mdgriffith$elm_style_animation$Animation$interrupt, $author$project$Animate$button_zoom_out, anistate),
					buttontype: buttontype,
					helppage: _List_fromArray(
						[
							A2(
							$mdgriffith$elm_style_animation$Animation$interrupt,
							$author$project$Animate$helppage_zoom_out,
							A2($author$project$Animate$find_page, helppage, 1))
						])
				};
			},
			A2(
				$elm$core$List$filter,
				function (x) {
					return _Utils_eq(x.buttontype, button_type);
				},
				model.button));
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					button: _Utils_ap(
						buttons,
						A2(
							$elm$core$List$filter,
							function (x) {
								return !_Utils_eq(x.buttontype, button_type);
							},
							model.button))
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Scoreboard$mouseleave = F2(
	function (model, button_type) {
		var set = model.gameset;
		var _v0 = model.progress;
		if (_v0.$ === 'ShowScoreBoard') {
			var level = _v0.a;
			if (set.timer > 2500) {
				var newbutton = $mdgriffith$elm_style_animation$Animation$interrupt(
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_style_animation$Animation$toWith,
							$mdgriffith$elm_style_animation$Animation$easing(
								{
									duration: 200,
									ease: function (x) {
										return A2($elm$core$Basics$pow, x, 2);
									}
								}),
							_List_fromArray(
								[
									$mdgriffith$elm_style_animation$Animation$opacity(1.0),
									$mdgriffith$elm_style_animation$Animation$scale(1.0),
									$mdgriffith$elm_style_animation$Animation$backgroundColor(
									{alpha: 1, blue: 39, green: 39, red: 69})
								]))
						]));
				var board = model.scoreboard;
				var new_board = _Utils_eq(
					button_type,
					$author$project$Parameter$Reset(level)) ? _Utils_update(
					board,
					{
						reset_button: newbutton(board.reset_button)
					}) : _Utils_update(
					board,
					{
						menu_button: newbutton(board.menu_button)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{scoreboard: new_board}),
					$elm$core$Platform$Cmd$none);
			} else {
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			}
		} else {
			return A2($author$project$Animate$zoomout_button, model, button_type);
		}
	});
var $author$project$Animate$button_zoom_in = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_style_animation$Animation$toWith,
		$mdgriffith$elm_style_animation$Animation$easing(
			{
				duration: 300,
				ease: function (x) {
					return x;
				}
			}),
		_List_fromArray(
			[
				$mdgriffith$elm_style_animation$Animation$opacity(0.5),
				$mdgriffith$elm_style_animation$Animation$color(
				{alpha: 1, blue: 255, green: 255, red: 0}),
				$mdgriffith$elm_style_animation$Animation$scale(1.05),
				$mdgriffith$elm_style_animation$Animation$backgroundColor(
				{alpha: 1, blue: 255, green: 0, red: 255}),
				$mdgriffith$elm_style_animation$Animation$borderWidth(
				$mdgriffith$elm_style_animation$Animation$px(5.0)),
				$mdgriffith$elm_style_animation$Animation$borderRadius(
				$mdgriffith$elm_style_animation$Animation$px(10.0)),
				$mdgriffith$elm_style_animation$Animation$borderColor(
				{alpha: 1, blue: 0, green: 200, red: 200}),
				A2(
				$mdgriffith$elm_style_animation$Animation$translate,
				$mdgriffith$elm_style_animation$Animation$px(0),
				$mdgriffith$elm_style_animation$Animation$px(0)),
				$mdgriffith$elm_style_animation$Animation$shadow(
				{
					blur: 0,
					color: A4($mdgriffith$elm_style_animation$Animation$Color, 0, 0, 0, 0.3),
					offsetX: 30,
					offsetY: 30,
					size: 15
				})
			]))
	]);
var $author$project$Animate$helppage_zoom_in = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_style_animation$Animation$toWith,
		$mdgriffith$elm_style_animation$Animation$easing(
			{
				duration: 300,
				ease: function (x) {
					return x;
				}
			}),
		_List_fromArray(
			[
				$mdgriffith$elm_style_animation$Animation$opacity(1.0),
				$mdgriffith$elm_style_animation$Animation$width(
				$mdgriffith$elm_style_animation$Animation$px(250.0)),
				$mdgriffith$elm_style_animation$Animation$color(
				{alpha: 1, blue: 255, green: 255, red: 255}),
				$mdgriffith$elm_style_animation$Animation$scale(1.0),
				$mdgriffith$elm_style_animation$Animation$backgroundColor(
				{alpha: 0.3, blue: 0, green: 0, red: 255}),
				$mdgriffith$elm_style_animation$Animation$borderWidth(
				$mdgriffith$elm_style_animation$Animation$px(5.0)),
				$mdgriffith$elm_style_animation$Animation$borderColor(
				{alpha: 1, blue: 0, green: 200, red: 200}),
				A2(
				$mdgriffith$elm_style_animation$Animation$translate,
				$mdgriffith$elm_style_animation$Animation$px(0),
				$mdgriffith$elm_style_animation$Animation$px(0)),
				$mdgriffith$elm_style_animation$Animation$borderRadius(
				$mdgriffith$elm_style_animation$Animation$px(3.0))
			]))
	]);
var $author$project$Animate$zoomin_button = F2(
	function (model, button_type) {
		var buttons = A2(
			$elm$core$List$map,
			function (_v0) {
				var anistate = _v0.anistate;
				var helppage = _v0.helppage;
				var buttontype = _v0.buttontype;
				return {
					anistate: A2($mdgriffith$elm_style_animation$Animation$interrupt, $author$project$Animate$button_zoom_in, anistate),
					buttontype: buttontype,
					helppage: A2(
						$elm$core$List$map,
						function (a) {
							return A2($mdgriffith$elm_style_animation$Animation$interrupt, $author$project$Animate$helppage_zoom_in, a);
						},
						helppage)
				};
			},
			A2(
				$elm$core$List$filter,
				function (x) {
					return _Utils_eq(x.buttontype, button_type);
				},
				model.button));
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					button: _Utils_ap(
						buttons,
						A2(
							$elm$core$List$filter,
							function (x) {
								return !_Utils_eq(x.buttontype, button_type);
							},
							model.button))
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Scoreboard$mouseover = F2(
	function (model, button_type) {
		var set = model.gameset;
		var _v0 = model.progress;
		if (_v0.$ === 'ShowScoreBoard') {
			var level = _v0.a;
			if (set.timer > 2500) {
				var newbutton = $mdgriffith$elm_style_animation$Animation$interrupt(
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_style_animation$Animation$toWith,
							$mdgriffith$elm_style_animation$Animation$easing(
								{
									duration: 200,
									ease: function (x) {
										return A2($elm$core$Basics$pow, x, 2);
									}
								}),
							_List_fromArray(
								[
									$mdgriffith$elm_style_animation$Animation$opacity(1.0),
									$mdgriffith$elm_style_animation$Animation$color(
									{alpha: 1, blue: 255, green: 255, red: 0}),
									$mdgriffith$elm_style_animation$Animation$scale(1.1),
									$mdgriffith$elm_style_animation$Animation$backgroundColor(
									{alpha: 0.5, blue: 0, green: 0, red: 100})
								]))
						]));
				var board = model.scoreboard;
				var new_board = _Utils_eq(
					button_type,
					$author$project$Parameter$Reset(level)) ? _Utils_update(
					board,
					{
						reset_button: newbutton(board.reset_button)
					}) : _Utils_update(
					board,
					{
						menu_button: newbutton(board.menu_button)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{scoreboard: new_board}),
					$elm$core$Platform$Cmd$none);
			} else {
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			}
		} else {
			return A2($author$project$Animate$zoomin_button, model, button_type);
		}
	});
var $author$project$Parameter$Button = F3(
	function (anistate, helppage, buttontype) {
		return {anistate: anistate, buttontype: buttontype, helppage: helppage};
	});
var $author$project$Parameter$Help = {$: 'Help'};
var $author$project$Parameter$StartGame = function (a) {
	return {$: 'StartGame', a: a};
};
var $author$project$Animate$default_menu_button_state = $mdgriffith$elm_style_animation$Animation$style(
	_List_fromArray(
		[
			$mdgriffith$elm_style_animation$Animation$opacity(0.0),
			$mdgriffith$elm_style_animation$Animation$color(
			{alpha: 1, blue: 255, green: 255, red: 255}),
			$mdgriffith$elm_style_animation$Animation$scale(1.0),
			$mdgriffith$elm_style_animation$Animation$backgroundColor(
			{alpha: 0.3, blue: 0, green: 0, red: 255}),
			$mdgriffith$elm_style_animation$Animation$borderWidth(
			$mdgriffith$elm_style_animation$Animation$px(5.0)),
			$mdgriffith$elm_style_animation$Animation$borderColor(
			{alpha: 1, blue: 0, green: 200, red: 200}),
			A2(
			$mdgriffith$elm_style_animation$Animation$translate,
			$mdgriffith$elm_style_animation$Animation$px(0),
			$mdgriffith$elm_style_animation$Animation$px(0)),
			$mdgriffith$elm_style_animation$Animation$shadow(
			{
				blur: 2,
				color: A4($mdgriffith$elm_style_animation$Animation$Color, 0, 0, 0, 0.1),
				offsetX: 0,
				offsetY: 1,
				size: 0
			}),
			$mdgriffith$elm_style_animation$Animation$borderRadius(
			$mdgriffith$elm_style_animation$Animation$px(3.0))
		]));
var $author$project$Animate$help_page = $mdgriffith$elm_style_animation$Animation$style(
	_List_fromArray(
		[
			$mdgriffith$elm_style_animation$Animation$opacity(0),
			$mdgriffith$elm_style_animation$Animation$color(
			{alpha: 1, blue: 255, green: 255, red: 255}),
			$mdgriffith$elm_style_animation$Animation$scale(1.0),
			$mdgriffith$elm_style_animation$Animation$path(_List_Nil),
			$mdgriffith$elm_style_animation$Animation$width(
			$mdgriffith$elm_style_animation$Animation$px(200.0)),
			$mdgriffith$elm_style_animation$Animation$backgroundColor(
			{alpha: 0.3, blue: 0, green: 0, red: 255}),
			$mdgriffith$elm_style_animation$Animation$borderWidth(
			$mdgriffith$elm_style_animation$Animation$px(5.0)),
			$mdgriffith$elm_style_animation$Animation$borderColor(
			{alpha: 1, blue: 0, green: 200, red: 200}),
			A2(
			$mdgriffith$elm_style_animation$Animation$translate,
			$mdgriffith$elm_style_animation$Animation$px(0),
			$mdgriffith$elm_style_animation$Animation$px(0)),
			$mdgriffith$elm_style_animation$Animation$borderRadius(
			$mdgriffith$elm_style_animation$Animation$px(3.0))
		]));
var $mdgriffith$elm_style_animation$Animation$wait = function (till) {
	return $mdgriffith$elm_style_animation$Animation$Model$Wait(till);
};
var $author$project$Animate$set_open_animation = F3(
	function (model, elapsed, _v0) {
		var window_x = _v0.a;
		var window_y = _v0.b;
		var start_instruction_button = A3(
			$author$project$Parameter$Button,
			$author$project$Animate$default_menu_button_state,
			_List_fromArray(
				[$author$project$Animate$help_page]),
			$author$project$Parameter$StartGame(
				A2($author$project$Parameter$Finite, 0, 0)));
		var start_endless_button = A3(
			$author$project$Parameter$Button,
			$author$project$Animate$default_menu_button_state,
			_List_fromArray(
				[$author$project$Animate$help_page]),
			$author$project$Parameter$StartGame($author$project$Parameter$Endless));
		var set = model.gameset;
		var nset = _Utils_update(
			set,
			{timer: set.timer + elapsed});
		var helpbutton = A3(
			$author$project$Parameter$Button,
			$author$project$Animate$default_menu_button_state,
			_List_fromArray(
				[$author$project$Animate$help_page]),
			$author$project$Parameter$Help);
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					animatecurtain: A2(
						$mdgriffith$elm_style_animation$Animation$interrupt,
						_List_fromArray(
							[
								A2(
								$mdgriffith$elm_style_animation$Animation$toWith,
								$mdgriffith$elm_style_animation$Animation$easing(
									{
										duration: 2000,
										ease: function (x) {
											return A2($elm$core$Basics$pow, x, 2);
										}
									}),
								_List_fromArray(
									[
										$mdgriffith$elm_style_animation$Animation$opacity(1.0)
									])),
								$mdgriffith$elm_style_animation$Animation$wait(
								$elm$time$Time$millisToPosix(2000)),
								A2(
								$mdgriffith$elm_style_animation$Animation$toWith,
								$mdgriffith$elm_style_animation$Animation$easing(
									{
										duration: 2000,
										ease: function (x) {
											return A2($elm$core$Basics$pow, x, 2);
										}
									}),
								_List_fromArray(
									[
										$mdgriffith$elm_style_animation$Animation$opacity(0.0)
									]))
							]),
						model.animatecurtain),
					button: _List_fromArray(
						[start_instruction_button, start_endless_button, helpbutton]),
					gameset: nset
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Update_small$return_menu = function (model) {
	var nmodel = function () {
		var newset = $author$project$Parameter$Game_Set(
			_List_fromArray(
				[
					A2(
					$author$project$Parameter$Line_element,
					_Utils_Tuple2(5, -1),
					_Utils_Tuple2(5, 10)),
					A2(
					$author$project$Parameter$Line_element,
					_Utils_Tuple2(4, -1),
					_Utils_Tuple2(4, 10))
				]))(_List_Nil)(_List_Nil)(model.gameset.windowsize)($author$project$Parameter$Playing)(0)(6100)($author$project$Parameter$map_initial)(
			_List_fromArray(
				[
					_Utils_Tuple2(1, 1)
				]))(0)(_List_Nil);
		return $author$project$Parameter$Model(newset)(
			$elm$random$Random$initialSeed(2))($author$project$Parameter$None)(
			_Utils_Tuple2(0, 0))($author$project$Parameter$Select_Pos)($author$project$Parameter$Openanimation)(
			$mdgriffith$elm_style_animation$Animation$style(
				_List_fromArray(
					[
						$mdgriffith$elm_style_animation$Animation$opacity(0.0)
					])))(_List_Nil)($author$project$Parameter$init_board)(_List_Nil)(_List_Nil)(model.volume);
	}();
	var _v0 = A3($author$project$Animate$set_open_animation, nmodel, 0, model.gameset.windowsize);
	var new_model = _v0.a;
	var nmsg = _v0.b;
	return _Utils_Tuple2(
		_Utils_update(
			new_model,
			{progress: $author$project$Parameter$Openanimation}),
		$author$project$Map$map_brick_generate);
};
var $mdgriffith$elm_style_animation$Animation$fill = function (clr) {
	return A2($mdgriffith$elm_style_animation$Animation$customColor, 'fill', clr);
};
var $mdgriffith$elm_style_animation$Animation$radius = function (r) {
	return A3($mdgriffith$elm_style_animation$Animation$custom, 'r', r, '');
};
var $mdgriffith$elm_style_animation$Animation$stroke = function (clr) {
	return A2($mdgriffith$elm_style_animation$Animation$customColor, 'stroke', clr);
};
var $author$project$Instruction$cursor_state = $mdgriffith$elm_style_animation$Animation$style(
	_List_fromArray(
		[
			$mdgriffith$elm_style_animation$Animation$stroke(
			{alpha: 0.8, blue: 100, green: 0, red: 255}),
			$mdgriffith$elm_style_animation$Animation$fill(
			{alpha: 0.3, blue: 100, green: 0, red: 0}),
			$mdgriffith$elm_style_animation$Animation$radius(5),
			$mdgriffith$elm_style_animation$Animation$opacity(0)
		]));
var $author$project$Instruction$default_instruction_state = function (_v0) {
	var posx = _v0.a;
	var posy = _v0.b;
	return $mdgriffith$elm_style_animation$Animation$style(
		_List_fromArray(
			[
				$mdgriffith$elm_style_animation$Animation$opacity(1.0),
				$mdgriffith$elm_style_animation$Animation$color(
				{alpha: 1, blue: 255, green: 255, red: 255}),
				$mdgriffith$elm_style_animation$Animation$scale(1.0),
				$mdgriffith$elm_style_animation$Animation$top(
				$mdgriffith$elm_style_animation$Animation$percent(posy)),
				$mdgriffith$elm_style_animation$Animation$left(
				$mdgriffith$elm_style_animation$Animation$percent(posx)),
				$mdgriffith$elm_style_animation$Animation$height(
				$mdgriffith$elm_style_animation$Animation$percent(0)),
				$mdgriffith$elm_style_animation$Animation$path(_List_Nil),
				$mdgriffith$elm_style_animation$Animation$backgroundColor(
				{alpha: 0.3, blue: 255, green: 0, red: 0}),
				$mdgriffith$elm_style_animation$Animation$borderWidth(
				$mdgriffith$elm_style_animation$Animation$px(10.0)),
				$mdgriffith$elm_style_animation$Animation$borderColor(
				{alpha: 1, blue: 255, green: 255, red: 255}),
				$mdgriffith$elm_style_animation$Animation$borderRadius(
				$mdgriffith$elm_style_animation$Animation$px(3.0))
			]));
};
var $author$project$Instruction$default_text_state = function (_v0) {
	var posx = _v0.a;
	var posy = _v0.b;
	return $mdgriffith$elm_style_animation$Animation$style(
		_List_fromArray(
			[
				$mdgriffith$elm_style_animation$Animation$opacity(0.0),
				$mdgriffith$elm_style_animation$Animation$scale(1.0),
				$mdgriffith$elm_style_animation$Animation$color(
				{alpha: 1, blue: 255, green: 255, red: 255}),
				$mdgriffith$elm_style_animation$Animation$top(
				$mdgriffith$elm_style_animation$Animation$percent(posy)),
				$mdgriffith$elm_style_animation$Animation$left(
				$mdgriffith$elm_style_animation$Animation$percent(posx))
			]));
};
var $author$project$Instruction$level_set_instruction = _List_fromArray(
	[
		$author$project$Instruction$default_instruction_state(
		_Utils_Tuple2(50, 20)),
		$author$project$Instruction$default_text_state(
		_Utils_Tuple2(50, 20)),
		$author$project$Instruction$cursor_state
	]);
var $author$project$Update_level_1$start_finite_level = F2(
	function (model, a) {
		var set = model.gameset;
		var nset = _Utils_update(
			set,
			{
				gamestate: $author$project$Parameter$Playing,
				light: _List_fromArray(
					[
						A2(
						$author$project$Parameter$Line_element,
						_Utils_Tuple2(4.5, -1),
						_Utils_Tuple2(4.5, 10))
					]),
				map: $author$project$Parameter$map_initial,
				timer: 0,
				todo: _List_fromArray(
					[
						_Utils_Tuple2(1, 1)
					])
			});
		var _v0 = model.gameset.windowsize;
		var window_x = _v0.a;
		var window_y = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					gameset: nset,
					instructions: $author$project$Instruction$level_set_instruction,
					progress: $author$project$Parameter$Gaming(
						A2($author$project$Parameter$Finite, a, 0))
				}),
			$author$project$Map$map_brick_generate);
	});
var $author$project$Update_level_1$update_finite_level = F2(
	function (model, msg) {
		_v0$8:
		while (true) {
			switch (msg.$) {
				case 'Mouseclick':
					var button_type = msg.a;
					if (button_type.$ === 'ReturnMenu') {
						return $author$project$Update_small$return_menu(model);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				case 'GetViewport':
					var viewport = msg.a.viewport;
					return A2($author$project$Update_small$update_viewport, model, viewport);
				case 'Resize':
					var wid = msg.a;
					var hei = msg.b;
					return A3($author$project$Update_small$update_resize, model, wid, hei);
				case 'Start':
					if ((msg.a.$ === 'Finite') && (!msg.a.b)) {
						var _v2 = msg.a;
						var a = _v2.a;
						return A2($author$project$Update_level_1$start_finite_level, model, a);
					} else {
						break _v0$8;
					}
				case 'Tick':
					var elapsed = msg.a;
					return A2(
						$author$project$Animate$button_appear,
						model,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 0, 0)));
				case 'Mouseover':
					var button_type = msg.a;
					return A2($author$project$Scoreboard$mouseover, model, button_type);
				case 'Mouseleave':
					var button_type = msg.a;
					return A2($author$project$Scoreboard$mouseleave, model, button_type);
				case 'Animate':
					var animMsg = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								animatecurtain: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, model.animatecurtain),
								button: A2(
									$elm$core$List$map,
									function (_v3) {
										var anistate = _v3.anistate;
										var helppage = _v3.helppage;
										var buttontype = _v3.buttontype;
										return {
											anistate: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, anistate),
											buttontype: buttontype,
											helppage: A2(
												$elm$core$List$map,
												function (x) {
													return A2($mdgriffith$elm_style_animation$Animation$update, animMsg, x);
												},
												helppage)
										};
									},
									model.button)
							}),
						$elm$core$Platform$Cmd$none);
				default:
					break _v0$8;
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Parameter$Helppage = {$: 'Helppage'};
var $author$project$Update$update_helppage = F2(
	function (model, msg) {
		switch (msg.$) {
			case 'Mouseclick':
				var button_type = msg.a;
				if (button_type.$ === 'ReturnMenu') {
					return $author$project$Update_small$return_menu(model);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GetViewport':
				var viewport = msg.a.viewport;
				return A2($author$project$Update_small$update_viewport, model, viewport);
			case 'Resize':
				var wid = msg.a;
				var hei = msg.b;
				return A3($author$project$Update_small$update_resize, model, wid, hei);
			case 'Tick':
				var elapsed = msg.a;
				return A2($author$project$Animate$button_appear, model, $author$project$Parameter$Helppage);
			case 'Mouseover':
				var button_type = msg.a;
				return A2($author$project$Scoreboard$mouseover, model, button_type);
			case 'Mouseleave':
				var button_type = msg.a;
				return A2($author$project$Scoreboard$mouseleave, model, button_type);
			case 'Animate':
				var animMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							animatecurtain: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, model.animatecurtain),
							button: A2(
								$elm$core$List$map,
								function (_v2) {
									var anistate = _v2.anistate;
									var helppage = _v2.helppage;
									var buttontype = _v2.buttontype;
									return {
										anistate: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, anistate),
										buttontype: buttontype,
										helppage: A2(
											$elm$core$List$map,
											function (x) {
												return A2($mdgriffith$elm_style_animation$Animation$update, animMsg, x);
											},
											helppage)
									};
								},
								model.button)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Parameter$Paused = {$: 'Paused'};
var $author$project$Update_level_1$check_click_pos = F3(
	function (_v0, model, msg) {
		var viewx = _v0.a;
		var viewy = _v0.b;
		var set = model.gameset;
		var _v1 = set.windowsize;
		var window_x = _v1.a;
		var window_y = _v1.b;
		var _v2 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, 0),
			$elm$core$List$head(
				A2(
					$elm$core$List$sortBy,
					$elm$core$Tuple$second,
					A2(
						$elm$core$List$map,
						function (x) {
							return x.tail;
						},
						set.light_path))));
		var uppoint_x = _v2.a;
		var uppoint_y = _v2.b;
		var _v3 = function (_v4) {
			var x = _v4.a;
			var y = _v4.b;
			return _Utils_Tuple2((x - (0.2 * window_x)) / (0.06 * window_x), (y + ((set.uppos * window_y) / 10)) / (0.1 * window_y));
		}(
			_Utils_Tuple2(viewx, viewy));
		var gamex = _v3.a;
		var gamey = _v3.b;
		var _v5 = model.progress;
		if (((_v5.$ === 'Gaming') && (_v5.a.$ === 'Finite')) && (_v5.a.a === 1)) {
			var _v6 = _v5.a;
			var n = _v6.b;
			if (n < 4) {
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			} else {
				switch (n) {
					case 4:
						if ((((uppoint_y - gamey) > 0) && ((uppoint_y - gamey) < 1)) && ($elm$core$Basics$abs(gamex - uppoint_x) < 0.3)) {
							var nset = _Utils_update(
								set,
								{gamestate: $author$project$Parameter$Paused});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										clickpos: _Utils_Tuple2(gamex, gamey),
										events: msg,
										gameset: nset,
										place_state: $author$project$Parameter$Select_Device,
										progress: $author$project$Parameter$Gaming(
											A2($author$project$Parameter$Finite, 1, 5))
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					case 5:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 7:
						var nset = _Utils_update(
							set,
							{gamestate: $author$project$Parameter$Paused});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									clickpos: _Utils_Tuple2(gamex, gamey),
									events: msg,
									gameset: nset,
									place_state: $author$project$Parameter$Select_Device,
									progress: $author$project$Parameter$Gaming(
										A2($author$project$Parameter$Finite, 1, 7))
								}),
							$elm$core$Platform$Cmd$none);
					default:
						var nset = _Utils_update(
							set,
							{gamestate: $author$project$Parameter$Playing});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									clickpos: _Utils_Tuple2(gamex, gamey),
									events: msg,
									gameset: nset,
									place_state: $author$project$Parameter$Select_Device
								}),
							$elm$core$Platform$Cmd$none);
				}
			}
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Update_level_1$set_object_level_1 = F2(
	function (model, msg) {
		var set = model.gameset;
		var _v0 = model.clickpos;
		var posx = _v0.a;
		var posy = _v0.b;
		var newobject = function () {
			_v5$2:
			while (true) {
				if (msg.$ === 'Key_Down') {
					switch (msg.a) {
						case 81:
							return A3(
								$author$project$Parameter$Object,
								_List_fromArray(
									[
										_Utils_Tuple2(posx - 0.3, posy),
										_Utils_Tuple2(posx + 0.3, posy)
									]),
								$author$project$Parameter$Mirror,
								_Utils_Tuple2(posx, posy));
						case 87:
							return A3(
								$author$project$Parameter$Object,
								_List_fromArray(
									[
										_Utils_Tuple2(posx - 0.3, posy),
										_Utils_Tuple2(posx + 0.3, posy)
									]),
								$author$project$Parameter$Splitter(0),
								_Utils_Tuple2(posx, posy));
						default:
							break _v5$2;
					}
				} else {
					break _v5$2;
				}
			}
			return A3(
				$author$project$Parameter$Object,
				_List_Nil,
				$author$project$Parameter$Mirror,
				_Utils_Tuple2(0, 0));
		}();
		var nset = _Utils_update(
			set,
			{
				objects: _Utils_ap(
					set.objects,
					_List_fromArray(
						[newobject]))
			});
		var _v1 = model.progress;
		_v1$2:
		while (true) {
			if (((_v1.$ === 'Gaming') && (_v1.a.$ === 'Finite')) && (_v1.a.a === 1)) {
				switch (_v1.a.b) {
					case 5:
						var _v2 = _v1.a;
						if ((msg.$ === 'Key_Down') && (msg.a === 81)) {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										gameset: nset,
										place_state: $author$project$Parameter$Device_Placed,
										progress: $author$project$Parameter$Gaming(
											A2($author$project$Parameter$Finite, 1, 6))
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					case 7:
						var _v4 = _v1.a;
						if (_Utils_eq(
							msg,
							$author$project$Parameter$Key_Down(87))) {
							var nnset = _Utils_update(
								nset,
								{gamestate: $author$project$Parameter$Playing});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										gameset: nnset,
										place_state: $author$project$Parameter$Device_Placed,
										progress: $author$project$Parameter$Gaming(
											A2($author$project$Parameter$Finite, 1, 8))
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							var nnset = _Utils_update(
								nset,
								{gamestate: $author$project$Parameter$Paused});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										gameset: nnset,
										place_state: $author$project$Parameter$Device_Placed,
										progress: $author$project$Parameter$Gaming(
											A2($author$project$Parameter$Finite, 1, 7))
									}),
								$elm$core$Platform$Cmd$none);
						}
					default:
						break _v1$2;
				}
			} else {
				break _v1$2;
			}
		}
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{gameset: nset, place_state: $author$project$Parameter$Device_Placed}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Update_level_1$set_mirror = F2(
	function (model, msg) {
		var _v0 = model.place_state;
		if (_v0.$ === 'Select_Device') {
			var sound_msg = $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Music$settime(
						_Utils_Tuple2('place_instrument1', 0)),
						$author$project$Music$pause('place_instrument1'),
						$author$project$Music$start('place_instrument1')
					]));
			var _v1 = A2($author$project$Update_level_1$set_object_level_1, model, msg);
			var nmodel = _v1.a;
			var nmsg = _v1.b;
			return _Utils_Tuple2(nmodel, sound_msg);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Update_level_1$set_splitter = F2(
	function (model, msg) {
		var _v0 = model.place_state;
		if (_v0.$ === 'Select_Device') {
			var sound_msg = $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Music$settime(
						_Utils_Tuple2('place_instrument1', 0)),
						$author$project$Music$pause('place_instrument1'),
						$author$project$Music$start('place_instrument1')
					]));
			var _v1 = A2($author$project$Update_level_1$set_object_level_1, model, msg);
			var nmodel = _v1.a;
			var nmsg = _v1.b;
			return _Utils_Tuple2(nmodel, sound_msg);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Instruction$default_instruction_fadeout = function (posy) {
	return _List_fromArray(
		[
			$mdgriffith$elm_style_animation$Animation$wait(
			$elm$time$Time$millisToPosix(500)),
			A2(
			$mdgriffith$elm_style_animation$Animation$toWith,
			$mdgriffith$elm_style_animation$Animation$easing(
				{
					duration: 1000,
					ease: function (x) {
						return A2($elm$core$Basics$pow, x, 2);
					}
				}),
			_List_fromArray(
				[
					$mdgriffith$elm_style_animation$Animation$height(
					$mdgriffith$elm_style_animation$Animation$percent(0.0)),
					$mdgriffith$elm_style_animation$Animation$top(
					$mdgriffith$elm_style_animation$Animation$percent(posy))
				]))
		]);
};
var $author$project$Instruction$default_text_fadeout = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_style_animation$Animation$toWith,
		$mdgriffith$elm_style_animation$Animation$easing(
			{
				duration: 500,
				ease: function (x) {
					return A2($elm$core$Basics$pow, x, 2);
				}
			}),
		_List_fromArray(
			[
				$mdgriffith$elm_style_animation$Animation$opacity(0.0)
			]))
	]);
var $author$project$Instruction$level_fadeout_instruction = function (states) {
	var texts = A2($elm$core$List$drop, 1, states);
	var textboard = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Instruction$default_instruction_state(
			_Utils_Tuple2(0, 0)),
		$elm$core$List$head(states));
	return _Utils_ap(
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_style_animation$Animation$interrupt,
				$author$project$Instruction$default_instruction_fadeout(20),
				textboard)
			]),
		A2(
			$elm$core$List$map,
			function (x) {
				return A2($mdgriffith$elm_style_animation$Animation$interrupt, $author$project$Instruction$default_text_fadeout, x);
			},
			texts));
};
var $author$project$Update_level_1$space_press = function (model) {
	var _v0 = _Utils_Tuple2(model.progress, model.place_state);
	_v0$2:
	while (true) {
		if (((_v0.a.$ === 'Gaming') && (_v0.a.a.$ === 'Finite')) && (_v0.a.a.a === 1)) {
			if (_v0.a.a.b === 2) {
				var _v1 = _v0.a.a;
				var set = model.gameset;
				var nset = _Utils_update(
					set,
					{gamestate: $author$project$Parameter$Playing});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							gameset: nset,
							instructions: $author$project$Instruction$level_fadeout_instruction(model.instructions),
							progress: $author$project$Parameter$Gaming(
								A2($author$project$Parameter$Finite, 1, 2))
						}),
					$elm$core$Platform$Cmd$none);
			} else {
				if (_v0.b.$ === 'Device_Placed') {
					var _v2 = _v0.a.a;
					var n = _v2.b;
					var _v3 = _v0.b;
					return (n === 6) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{
								place_state: $author$project$Parameter$Adjust_Angle,
								progress: $author$project$Parameter$Gaming(
									A2($author$project$Parameter$Finite, 1, 7))
							}),
						$elm$core$Platform$Cmd$none) : ((n >= 7) ? _Utils_Tuple2(
						_Utils_update(
							model,
							{place_state: $author$project$Parameter$Adjust_Angle}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none));
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
};
var $author$project$Update_small$default_update_tick = F7(
	function (newset, elapsed, nuppos, nobjects, ngame_state, newmodel, nprogress) {
		var nnewset = _Utils_update(
			newset,
			{gamestate: ngame_state, objects: nobjects, timer: newset.timer + elapsed, uppos: nuppos});
		return _Utils_Tuple2(
			_Utils_update(
				newmodel,
				{gameset: nnewset, progress: nprogress}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Update_small$generate_new_brick = F7(
	function (newset, newmodel, elapsed, nuppos, nmap, t, sound_cmd) {
		var nnewset = _Utils_update(
			newset,
			{map: nmap, maptimer: newset.maptimer + 1, timer: newset.timer + elapsed, todo: t, uppos: nuppos});
		return _Utils_Tuple2(
			_Utils_update(
				newmodel,
				{gameset: nnewset}),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[$author$project$Map$map_brick_generate, sound_cmd])));
	});
var $author$project$Update_level_1$filter_plant = function (objects) {
	filter_plant:
	while (true) {
		if (!objects.b) {
			return _List_Nil;
		} else {
			var x = objects.a;
			var xs = objects.b;
			var _v1 = x.object_type;
			if (_v1.$ === 'Plant') {
				var _v2 = _v1.a;
				var _v3 = _v2.a;
				var planttype = _v3.a;
				if (planttype === 4) {
					return A2(
						$elm$core$List$cons,
						x,
						$author$project$Update_level_1$filter_plant(xs));
				} else {
					var $temp$objects = xs;
					objects = $temp$objects;
					continue filter_plant;
				}
			} else {
				return A2(
					$elm$core$List$cons,
					x,
					$author$project$Update_level_1$filter_plant(xs));
			}
		}
	}
};
var $author$project$Update_level_1$filter_rock = function (objects) {
	filter_rock:
	while (true) {
		if (!objects.b) {
			return _List_Nil;
		} else {
			var x = objects.a;
			var xs = objects.b;
			var _v1 = x.object_type;
			if (_v1.$ === 'Stone') {
				var a = _v1.a;
				var b = _v1.b;
				var _v2 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(
						A2($elm$core$List$sortBy, $elm$core$Tuple$second, x.nodes)));
				var up_point_x = _v2.a;
				var up_point_y = _v2.b;
				var _v3 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(
						$elm$core$List$reverse(
							A2($elm$core$List$sortBy, $elm$core$Tuple$second, x.nodes))));
				var down_point_x = _v3.a;
				var down_point_y = _v3.b;
				if ((up_point_y <= 5) || (down_point_y >= 18)) {
					var $temp$objects = xs;
					objects = $temp$objects;
					continue filter_rock;
				} else {
					if ((a === 6) && (b >= 6)) {
						var $temp$objects = xs;
						objects = $temp$objects;
						continue filter_rock;
					} else {
						return A2(
							$elm$core$List$cons,
							x,
							$author$project$Update_level_1$filter_rock(xs));
					}
				}
			} else {
				return A2(
					$elm$core$List$cons,
					x,
					$author$project$Update_level_1$filter_rock(xs));
			}
		}
	}
};
var $author$project$Update_small$is_add_big_plants = function (newset) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (x, y) {
				var _v0 = x.object_type;
				if ((_v0.$ === 'Plant') && (_v0.a.a.a === 4)) {
					var _v1 = _v0.a;
					var _v2 = _v1.a;
					return true || y;
				} else {
					return false || y;
				}
			}),
		false,
		newset.objects);
};
var $author$project$Update_level_1$get_nobjects = function (newset) {
	return $author$project$Update_small$is_add_big_plants(newset) ? $author$project$Update_level_1$filter_rock(
		$author$project$Update_level_1$filter_plant(newset.objects)) : A2(
		$elm$core$List$cons,
		A3(
			$author$project$Parameter$Object,
			_List_fromArray(
				[
					_Utils_Tuple2(5, 20),
					_Utils_Tuple2(7, 20)
				]),
			$author$project$Parameter$Plant(
				_Utils_Tuple2(
					_Utils_Tuple2(4, 1),
					0)),
			_Utils_Tuple2(6, 20)),
		$author$project$Update_level_1$filter_rock(
			$author$project$Update_level_1$filter_plant(newset.objects)));
};
var $mdgriffith$elm_style_animation$Animation$loop = function (steps) {
	return $mdgriffith$elm_style_animation$Animation$Model$Loop(steps);
};
var $author$project$Instruction$cursor_update = _List_fromArray(
	[
		$mdgriffith$elm_style_animation$Animation$loop(
		_List_fromArray(
			[
				A2(
				$mdgriffith$elm_style_animation$Animation$toWith,
				$mdgriffith$elm_style_animation$Animation$easing(
					{
						duration: 500,
						ease: function (x) {
							return A2($elm$core$Basics$pow, x, 1 / 3);
						}
					}),
				_List_fromArray(
					[
						$mdgriffith$elm_style_animation$Animation$radius(15),
						$mdgriffith$elm_style_animation$Animation$opacity(1)
					])),
				A2(
				$mdgriffith$elm_style_animation$Animation$toWith,
				$mdgriffith$elm_style_animation$Animation$easing(
					{
						duration: 500,
						ease: function (x) {
							return A2($elm$core$Basics$pow, x, 3);
						}
					}),
				_List_fromArray(
					[
						$mdgriffith$elm_style_animation$Animation$radius(10),
						$mdgriffith$elm_style_animation$Animation$opacity(1)
					]))
			]))
	]);
var $author$project$Instruction$default_instruction_fadein = F2(
	function (_v0, height) {
		var posx = _v0.a;
		var posy = _v0.b;
		return _List_fromArray(
			[
				A2(
				$mdgriffith$elm_style_animation$Animation$toWith,
				$mdgriffith$elm_style_animation$Animation$easing(
					{
						duration: 1000,
						ease: function (x) {
							return A2($elm$core$Basics$pow, x, 2);
						}
					}),
				_List_fromArray(
					[
						$mdgriffith$elm_style_animation$Animation$opacity(1.0),
						$mdgriffith$elm_style_animation$Animation$color(
						{alpha: 1, blue: 0, green: 0, red: 255}),
						$mdgriffith$elm_style_animation$Animation$scale(1.0),
						$mdgriffith$elm_style_animation$Animation$top(
						$mdgriffith$elm_style_animation$Animation$percent(posy)),
						$mdgriffith$elm_style_animation$Animation$height(
						$mdgriffith$elm_style_animation$Animation$percent(height)),
						$mdgriffith$elm_style_animation$Animation$left(
						$mdgriffith$elm_style_animation$Animation$percent(posx)),
						$mdgriffith$elm_style_animation$Animation$borderColor(
						{alpha: 0.5, blue: 255, green: 255, red: 255}),
						$mdgriffith$elm_style_animation$Animation$borderWidth(
						$mdgriffith$elm_style_animation$Animation$px(10.0)),
						$mdgriffith$elm_style_animation$Animation$borderRadius(
						$mdgriffith$elm_style_animation$Animation$px(8.0))
					]))
			]);
	});
var $author$project$Instruction$default_text_fadein = function (_v0) {
	var posx = _v0.a;
	var posy = _v0.b;
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_style_animation$Animation$toWith,
			$mdgriffith$elm_style_animation$Animation$easing(
				{
					duration: 1000,
					ease: function (x) {
						return A2($elm$core$Basics$pow, x, 2);
					}
				}),
			_List_fromArray(
				[
					$mdgriffith$elm_style_animation$Animation$color(
					{alpha: 1, blue: 255, green: 255, red: 255}),
					$mdgriffith$elm_style_animation$Animation$scale(1.0),
					$mdgriffith$elm_style_animation$Animation$top(
					$mdgriffith$elm_style_animation$Animation$percent(posy)),
					$mdgriffith$elm_style_animation$Animation$left(
					$mdgriffith$elm_style_animation$Animation$percent(posx))
				])),
			A2(
			$mdgriffith$elm_style_animation$Animation$toWith,
			$mdgriffith$elm_style_animation$Animation$easing(
				{
					duration: 500,
					ease: function (x) {
						return A2($elm$core$Basics$pow, x, 2);
					}
				}),
			_List_fromArray(
				[
					$mdgriffith$elm_style_animation$Animation$opacity(1.0)
				]))
		]);
};
var $author$project$Instruction$level_update_instruction = F2(
	function (height, states) {
		var texts = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Instruction$default_text_state(
				_Utils_Tuple2(0, 0)),
			$elm$core$List$head(
				A2($elm$core$List$drop, 1, states)));
		var textboard = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Instruction$default_instruction_state(
				_Utils_Tuple2(0, 0)),
			$elm$core$List$head(states));
		var cursor = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Instruction$cursor_state,
			$elm$core$List$head(
				A2($elm$core$List$drop, 2, states)));
		return _Utils_ap(
			_List_fromArray(
				[
					A2(
					$mdgriffith$elm_style_animation$Animation$interrupt,
					A2(
						$author$project$Instruction$default_instruction_fadein,
						_Utils_Tuple2(50, 20 - (0.5 * height)),
						height),
					textboard)
				]),
			_Utils_ap(
				_List_fromArray(
					[
						function (x) {
						return A2(
							$mdgriffith$elm_style_animation$Animation$interrupt,
							$author$project$Instruction$default_text_fadein(
								_Utils_Tuple2(50, 20 - (0.5 * height))),
							x);
					}(texts)
					]),
				_List_fromArray(
					[
						A2($mdgriffith$elm_style_animation$Animation$interrupt, $author$project$Instruction$cursor_update, cursor)
					])));
	});
var $author$project$Update_level_1$get_nstate_pause = F4(
	function (model, newset, nobjects, newmodel) {
		var nnewset = _Utils_update(
			newset,
			{objects: nobjects});
		var _v0 = model.progress;
		_v0$2:
		while (true) {
			if (((_v0.$ === 'Gaming') && (_v0.a.$ === 'Finite')) && (_v0.a.a === 1)) {
				switch (_v0.a.b) {
					case 1:
						var _v1 = _v0.a;
						return _Utils_Tuple2(
							_Utils_update(
								newmodel,
								{
									gameset: nnewset,
									instructions: A2($author$project$Instruction$level_update_instruction, 20, model.instructions),
									progress: $author$project$Parameter$Gaming(
										A2($author$project$Parameter$Finite, 1, 2))
								}),
							$elm$core$Platform$Cmd$none);
					case 3:
						var _v2 = _v0.a;
						return _Utils_Tuple2(
							_Utils_update(
								newmodel,
								{
									gameset: nnewset,
									instructions: A2($author$project$Instruction$level_update_instruction, 20, $author$project$Instruction$level_set_instruction),
									progress: $author$project$Parameter$Gaming(
										A2($author$project$Parameter$Finite, 1, 4))
								}),
							$elm$core$Platform$Cmd$none);
					default:
						break _v0$2;
				}
			} else {
				break _v0$2;
			}
		}
		return _Utils_Tuple2(
			_Utils_update(
				newmodel,
				{gameset: nnewset}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Update_level_1$get_state = function (model) {
	var set = model.gameset;
	var timer = set.timer;
	var progress = model.progress;
	var gamestate = set.gamestate;
	var _v0 = _Utils_Tuple3(gamestate, progress, timer);
	_v0$2:
	while (true) {
		if ((((_v0.a.$ === 'Playing') && (_v0.b.$ === 'Gaming')) && (_v0.b.a.$ === 'Finite')) && (_v0.b.a.a === 1)) {
			switch (_v0.b.a.b) {
				case 0:
					var _v1 = _v0.a;
					var _v2 = _v0.b.a;
					return (timer > 100) ? _Utils_Tuple2(
						$author$project$Parameter$Paused,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 1, 1))) : _Utils_Tuple2(
						$author$project$Parameter$Playing,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 1, 0)));
				case 2:
					var _v3 = _v0.a;
					var _v4 = _v0.b.a;
					var _v5 = A2(
						$elm$core$Maybe$withDefault,
						_Utils_Tuple2(0, 0),
						$elm$core$List$head(
							A2(
								$elm$core$List$sortBy,
								$elm$core$Tuple$second,
								A2(
									$elm$core$List$map,
									function (x) {
										return x.tail;
									},
									set.light_path))));
					var uppoint_x = _v5.a;
					var uppoint_y = _v5.b;
					return ((uppoint_y - set.uppos) < 4) ? _Utils_Tuple2(
						$author$project$Parameter$Paused,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 1, 3))) : _Utils_Tuple2(
						$author$project$Parameter$Playing,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 1, 2)));
				default:
					break _v0$2;
			}
		} else {
			break _v0$2;
		}
	}
	return _Utils_Tuple2(gamestate, progress);
};
var $author$project$Update_small$is_end_level = function (set) {
	return (set.uppos > 10) && (!$elm$core$List$isEmpty(
		A2(
			$elm$core$List$filter,
			function (x) {
				var _v0 = x.object_type;
				if (((_v0.$ === 'Plant') && (_v0.a.a.a === 4)) && (_v0.a.a.b === 2)) {
					var _v1 = _v0.a;
					var _v2 = _v1.a;
					return true;
				} else {
					return false;
				}
			},
			set.objects)));
};
var $author$project$Update_level_1$update_level1_tick = F2(
	function (model, elapsed) {
		var set = model.gameset;
		var todolist = set.todo;
		var map = set.map;
		var _v0 = set.light;
		if (!_v0.b) {
			var newset = _Utils_update(
				set,
				{timer: 0});
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						gameset: newset,
						progress: $author$project$Parameter$Fadeout(
							A2($author$project$Parameter$Finite, 1, 0))
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			var t = A2(
				$elm$core$List$filter,
				function (_v5) {
					var p = _v5.a;
					var q = _v5.b;
					return (p > 0) && ((q > 0) && (_Utils_cmp(q, $author$project$Parameter$right_bound + 1) < 0));
				},
				A2(
					$elm$core$List$map,
					function (_v4) {
						var p = _v4.a;
						var q = _v4.b;
						return _Utils_Tuple2(p - 1, q);
					},
					todolist));
			var nmap = A2($elm$core$List$drop, 1, map);
			var _v1 = set.windowsize;
			var window_x = _v1.a;
			var window_y = _v1.b;
			var nuppos = (set.uppos >= 10) ? set.uppos : (((10 / window_y) * A2($elm$core$Basics$pow, set.timer, 1.05)) / 50);
			var newmodel = A2(
				$author$project$Light$update_light_object,
				set.uppos,
				A2(
					$author$project$Light$remove_outrange,
					nuppos,
					$author$project$Light$rotate_device(model)));
			var newset = newmodel.gameset;
			var nobjects = $author$project$Update_level_1$get_nobjects(newset);
			var _v2 = $author$project$Update_level_1$get_state(model);
			var ngame_state = _v2.a;
			var nprogress = _v2.b;
			var _v3 = A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(0, 0),
				$elm$core$List$head(
					$elm$core$List$reverse(
						A2(
							$elm$core$List$sortBy,
							$elm$core$Tuple$second,
							A2(
								$elm$core$List$map,
								function (x) {
									return x.tail;
								},
								set.light_path)))));
			var final_x = _v3.a;
			var final_y = _v3.b;
			if (_Utils_eq(set.gamestate, $author$project$Parameter$Paused)) {
				return A4($author$project$Update_level_1$get_nstate_pause, model, newset, nobjects, newmodel);
			} else {
				if (_Utils_cmp(
					$elm$core$Basics$floor(((set.uppos * window_y) / 10) / (0.1 * window_y)),
					set.maptimer) > 0) {
					return A7($author$project$Update_small$generate_new_brick, newset, newmodel, elapsed, nuppos, map, t, $elm$core$Platform$Cmd$none);
				} else {
					if ($author$project$Update_small$is_end_level(set)) {
						var nnewset = _Utils_update(
							newset,
							{timer: 0});
						return _Utils_Tuple2(
							_Utils_update(
								newmodel,
								{
									gameset: nnewset,
									progress: $author$project$Parameter$Fadeout(
										A2($author$project$Parameter$Finite, 1, 0))
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return A7($author$project$Update_small$default_update_tick, newset, elapsed, nuppos, nobjects, ngame_state, newmodel, nprogress);
					}
				}
			}
		}
	});
var $author$project$Update_level_1$update_level_1 = F2(
	function (model, msg) {
		_v0$12:
		while (true) {
			switch (msg.$) {
				case 'GetViewport':
					var viewport = msg.a.viewport;
					return A2($author$project$Update_small$update_viewport, model, viewport);
				case 'Resize':
					var wid = msg.a;
					var hei = msg.b;
					return A3($author$project$Update_small$update_resize, model, wid, hei);
				case 'Key_Up':
					if (msg.a === 32) {
						return $author$project$Update_small$stop_rotate(model);
					} else {
						break _v0$12;
					}
				case 'Key_Down':
					switch (msg.a) {
						case 81:
							return A2($author$project$Update_level_1$set_mirror, model, msg);
						case 38:
							return $author$project$Update_small$volume_up(model);
						case 40:
							return $author$project$Update_small$volume_down(model);
						case 32:
							return $author$project$Update_level_1$space_press(model);
						case 87:
							return A2($author$project$Update_level_1$set_splitter, model, msg);
						default:
							break _v0$12;
					}
				case 'Rocktype':
					var l = msg.a;
					return A2($author$project$Update_small$generate_rock, model, l);
				case 'Click':
					var a = msg.a;
					return A3($author$project$Update_level_1$check_click_pos, a.pagePos, model, msg);
				case 'Animate':
					var animMsg = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								animatecurtain: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, model.animatecurtain),
								button: A2(
									$elm$core$List$map,
									function (_v1) {
										var anistate = _v1.anistate;
										var helppage = _v1.helppage;
										var buttontype = _v1.buttontype;
										return {
											anistate: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, anistate),
											buttontype: buttontype,
											helppage: A2(
												$elm$core$List$map,
												function (x) {
													return A2($mdgriffith$elm_style_animation$Animation$update, animMsg, x);
												},
												helppage)
										};
									},
									model.button),
								instructions: A2(
									$elm$core$List$map,
									function (x) {
										return A2($mdgriffith$elm_style_animation$Animation$update, animMsg, x);
									},
									model.instructions)
							}),
						$elm$core$Platform$Cmd$none);
				case 'Tick':
					var elapsed = msg.a;
					return A2($author$project$Update_level_1$update_level1_tick, model, elapsed);
				default:
					break _v0$12;
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Update_level_2$check_click_pos = F3(
	function (_v0, model, msg) {
		var viewx = _v0.a;
		var viewy = _v0.b;
		var set = model.gameset;
		var _v1 = set.windowsize;
		var window_x = _v1.a;
		var window_y = _v1.b;
		var _v2 = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, 0),
			$elm$core$List$head(
				A2(
					$elm$core$List$sortBy,
					$elm$core$Tuple$second,
					A2(
						$elm$core$List$map,
						function (x) {
							return x.tail;
						},
						set.light_path))));
		var uppoint_x = _v2.a;
		var uppoint_y = _v2.b;
		var _v3 = function (_v4) {
			var x = _v4.a;
			var y = _v4.b;
			return _Utils_Tuple2((x - (0.2 * window_x)) / (0.06 * window_x), (y + ((set.uppos * window_y) / 10)) / (0.1 * window_y));
		}(
			_Utils_Tuple2(viewx, viewy));
		var gamex = _v3.a;
		var gamey = _v3.b;
		var _v5 = model.progress;
		if (((_v5.$ === 'Gaming') && (_v5.a.$ === 'Finite')) && (_v5.a.a === 2)) {
			var _v6 = _v5.a;
			var n = _v6.b;
			if (n < 5) {
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			} else {
				switch (n) {
					case 7:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 10:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 21:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					case 24:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									clickpos: _Utils_Tuple2(gamex, gamey),
									events: msg,
									place_state: $author$project$Parameter$Select_Device
								}),
							$elm$core$Platform$Cmd$none);
				}
			}
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Update_level_2$press_enter = F2(
	function (model, set) {
		var _v0 = _Utils_Tuple2(model.progress, model.place_state);
		if ((((_v0.a.$ === 'Gaming') && (_v0.a.a.$ === 'Finite')) && (_v0.a.a.a === 2)) && (_v0.a.a.b === 7)) {
			var _v1 = _v0.a.a;
			var nset = _Utils_update(
				set,
				{gamestate: $author$project$Parameter$Playing});
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						gameset: nset,
						progress: $author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 2, 8))
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Update_level_2$press_space = F2(
	function (model, set) {
		var _v0 = _Utils_Tuple2(model.progress, model.place_state);
		_v0$3:
		while (true) {
			if (((_v0.a.$ === 'Gaming') && (_v0.a.a.$ === 'Finite')) && (_v0.a.a.a === 2)) {
				switch (_v0.a.a.b) {
					case 2:
						var _v1 = _v0.a.a;
						var nset = _Utils_update(
							set,
							{gamestate: $author$project$Parameter$Playing});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									gameset: nset,
									instructions: $author$project$Instruction$level_fadeout_instruction(model.instructions),
									progress: $author$project$Parameter$Gaming(
										A2($author$project$Parameter$Finite, 2, 2))
								}),
							$elm$core$Platform$Cmd$none);
					case 4:
						var _v2 = _v0.a.a;
						var nset = _Utils_update(
							set,
							{gamestate: $author$project$Parameter$Playing});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									gameset: nset,
									progress: $author$project$Parameter$Gaming(
										A2($author$project$Parameter$Finite, 2, 5))
								}),
							$elm$core$Platform$Cmd$none);
					case 7:
						var _v3 = _v0.a.a;
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					default:
						break _v0$3;
				}
			} else {
				break _v0$3;
			}
		}
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{place_state: $author$project$Parameter$Adjust_Angle}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Update_level_2$set_object_level_2 = F2(
	function (model, msg) {
		var set = model.gameset;
		var _v0 = model.clickpos;
		var posx = _v0.a;
		var posy = _v0.b;
		var newobject = function () {
			_v1$2:
			while (true) {
				if (msg.$ === 'Key_Down') {
					switch (msg.a) {
						case 81:
							return A3(
								$author$project$Parameter$Object,
								_List_fromArray(
									[
										_Utils_Tuple2(posx - 0.3, posy),
										_Utils_Tuple2(posx + 0.3, posy)
									]),
								$author$project$Parameter$Mirror,
								_Utils_Tuple2(posx, posy));
						case 87:
							return A3(
								$author$project$Parameter$Object,
								_List_fromArray(
									[
										_Utils_Tuple2(posx - 0.3, posy),
										_Utils_Tuple2(posx + 0.3, posy)
									]),
								$author$project$Parameter$Splitter(0),
								_Utils_Tuple2(posx, posy));
						default:
							break _v1$2;
					}
				} else {
					break _v1$2;
				}
			}
			return A3(
				$author$project$Parameter$Object,
				_List_Nil,
				$author$project$Parameter$Mirror,
				_Utils_Tuple2(0, 0));
		}();
		var nset = _Utils_update(
			set,
			{
				objects: _Utils_ap(
					set.objects,
					_List_fromArray(
						[newobject]))
			});
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{gameset: nset, place_state: $author$project$Parameter$Device_Placed}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Update_level_2$set_mirror = F2(
	function (model, msg) {
		var _v0 = model.place_state;
		if (_v0.$ === 'Select_Device') {
			var sound_msg = $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Music$settime(
						_Utils_Tuple2('place_instrument2', 0)),
						$author$project$Music$pause('place_instrument2'),
						$author$project$Music$start('place_instrument2')
					]));
			var _v1 = A2($author$project$Update_level_2$set_object_level_2, model, msg);
			var nmodel = _v1.a;
			var nmsg = _v1.b;
			return _Utils_Tuple2(nmodel, sound_msg);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Update_level_2$set_splitter = F2(
	function (model, msg) {
		var _v0 = model.place_state;
		if (_v0.$ === 'Select_Device') {
			var sound_msg = $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Music$settime(
						_Utils_Tuple2('place_instrument', 0)),
						$author$project$Music$pause('place_instrument'),
						$author$project$Music$start('place_instrument')
					]));
			var _v1 = A2($author$project$Update_level_2$set_object_level_2, model, msg);
			var nmodel = _v1.a;
			var nmsg = _v1.b;
			return _Utils_Tuple2(nmodel, sound_msg);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Update_level_2$filter_plant_2 = function (objects) {
	filter_plant_2:
	while (true) {
		if (!objects.b) {
			return _List_Nil;
		} else {
			var x = objects.a;
			var xs = objects.b;
			var _v1 = x.object_type;
			if (_v1.$ === 'Plant') {
				var _v2 = _v1.a;
				var _v3 = _v2.a;
				var planttype = _v3.a;
				var _v4 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(
						A2($elm$core$List$drop, 1, x.nodes)));
				var x2 = _v4.a;
				var y2 = _v4.b;
				var _v5 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(x.nodes));
				var x1 = _v5.a;
				var y1 = _v5.b;
				if ((A2($elm$core$Basics$max, y1, y2) >= 18) || (A2($elm$core$Basics$min, y1, y2) <= 5)) {
					if (planttype === 4) {
						return A2(
							$elm$core$List$cons,
							x,
							$author$project$Update_level_2$filter_plant_2(xs));
					} else {
						var $temp$objects = xs;
						objects = $temp$objects;
						continue filter_plant_2;
					}
				} else {
					return A2(
						$elm$core$List$cons,
						x,
						$author$project$Update_level_2$filter_plant_2(xs));
				}
			} else {
				return A2(
					$elm$core$List$cons,
					x,
					$author$project$Update_level_2$filter_plant_2(xs));
			}
		}
	}
};
var $author$project$Update_level_2$filter_rock = function (objects) {
	filter_rock:
	while (true) {
		if (!objects.b) {
			return _List_Nil;
		} else {
			var x = objects.a;
			var xs = objects.b;
			var _v1 = x.object_type;
			if (_v1.$ === 'Stone') {
				var a = _v1.a;
				var _v2 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(
						A2($elm$core$List$sortBy, $elm$core$Tuple$second, x.nodes)));
				var up_point_x = _v2.a;
				var up_point_y = _v2.b;
				var _v3 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(
						$elm$core$List$reverse(
							A2($elm$core$List$sortBy, $elm$core$Tuple$second, x.nodes))));
				var down_point_x = _v3.a;
				var down_point_y = _v3.b;
				if ((down_point_y <= 5) || (down_point_y >= 18)) {
					var $temp$objects = xs;
					objects = $temp$objects;
					continue filter_rock;
				} else {
					return A2(
						$elm$core$List$cons,
						x,
						$author$project$Update_level_2$filter_rock(xs));
				}
			} else {
				return A2(
					$elm$core$List$cons,
					x,
					$author$project$Update_level_2$filter_rock(xs));
			}
		}
	}
};
var $author$project$Update_level_2$get_nobjects = function (newmodel) {
	return $author$project$Update_small$is_add_big_plants(newmodel.gameset) ? $author$project$Update_level_2$filter_rock(
		$author$project$Update_level_2$filter_plant_2(newmodel.gameset.objects)) : A2(
		$elm$core$List$cons,
		A3(
			$author$project$Parameter$Object,
			_List_fromArray(
				[
					_Utils_Tuple2(5, 20),
					_Utils_Tuple2(7, 20)
				]),
			$author$project$Parameter$Plant(
				_Utils_Tuple2(
					_Utils_Tuple2(4, 1),
					0)),
			_Utils_Tuple2(6, 20)),
		$author$project$Update_level_2$filter_rock(
			$author$project$Update_level_2$filter_plant_2(newmodel.gameset.objects)));
};
var $author$project$Update_level_2$get_nstate_pause = F2(
	function (newmodel, nobjects) {
		var nset = newmodel.gameset;
		var nnset = _Utils_update(
			nset,
			{objects: nobjects});
		var _v0 = newmodel.progress;
		_v0$3:
		while (true) {
			if (((_v0.$ === 'Gaming') && (_v0.a.$ === 'Finite')) && (_v0.a.a === 2)) {
				switch (_v0.a.b) {
					case 1:
						var _v1 = _v0.a;
						return _Utils_Tuple2(
							_Utils_update(
								newmodel,
								{
									gameset: nnset,
									instructions: A2($author$project$Instruction$level_update_instruction, 20, newmodel.instructions),
									progress: $author$project$Parameter$Gaming(
										A2($author$project$Parameter$Finite, 2, 2))
								}),
							$elm$core$Platform$Cmd$none);
					case 3:
						var _v2 = _v0.a;
						return _Utils_Tuple2(
							_Utils_update(
								newmodel,
								{
									gameset: _Utils_update(
										nnset,
										{score: _List_Nil}),
									instructions: A2($author$project$Instruction$level_update_instruction, 20, $author$project$Instruction$level_set_instruction),
									progress: $author$project$Parameter$Gaming(
										A2($author$project$Parameter$Finite, 2, 4))
								}),
							$elm$core$Platform$Cmd$none);
					case 6:
						var _v3 = _v0.a;
						return _Utils_Tuple2(
							_Utils_update(
								newmodel,
								{
									gameset: nnset,
									instructions: A2($author$project$Instruction$level_update_instruction, 20, $author$project$Instruction$level_set_instruction),
									progress: $author$project$Parameter$Gaming(
										A2($author$project$Parameter$Finite, 2, 7))
								}),
							$elm$core$Platform$Cmd$none);
					default:
						break _v0$3;
				}
			} else {
				break _v0$3;
			}
		}
		return _Utils_Tuple2(
			_Utils_update(
				newmodel,
				{gameset: nnset}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Update_level_2$get_state = function (model) {
	var set = model.gameset;
	var timer = set.timer;
	var progress = model.progress;
	var gamestate = set.gamestate;
	var _v0 = _Utils_Tuple3(gamestate, progress, timer);
	_v0$3:
	while (true) {
		if ((((_v0.a.$ === 'Playing') && (_v0.b.$ === 'Gaming')) && (_v0.b.a.$ === 'Finite')) && (_v0.b.a.a === 2)) {
			switch (_v0.b.a.b) {
				case 0:
					var _v1 = _v0.a;
					var _v2 = _v0.b.a;
					return (timer > 100) ? _Utils_Tuple2(
						$author$project$Parameter$Paused,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 2, 1))) : _Utils_Tuple2(
						$author$project$Parameter$Playing,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 2, 0)));
				case 2:
					var _v3 = _v0.a;
					var _v4 = _v0.b.a;
					var isPlant = A3(
						$elm$core$List$foldl,
						F2(
							function (x, y) {
								var _v5 = x.object_type;
								if (_v5.$ === 'Plant') {
									return true;
								} else {
									return false || y;
								}
							}),
						false,
						set.objects);
					return (isPlant && (set.timer >= 3000)) ? _Utils_Tuple2(
						$author$project$Parameter$Paused,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 2, 3))) : _Utils_Tuple2(
						$author$project$Parameter$Playing,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 2, 2)));
				case 5:
					var _v6 = _v0.a;
					var _v7 = _v0.b.a;
					return (!$elm$core$List$isEmpty(set.score)) ? _Utils_Tuple2(
						$author$project$Parameter$Paused,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 2, 6))) : _Utils_Tuple2(
						$author$project$Parameter$Playing,
						$author$project$Parameter$Gaming(
							A2($author$project$Parameter$Finite, 2, 5)));
				default:
					break _v0$3;
			}
		} else {
			break _v0$3;
		}
	}
	return _Utils_Tuple2(gamestate, progress);
};
var $author$project$Update_level_2$update_level2_tick = F2(
	function (model, elapsed) {
		var set = model.gameset;
		var todolist = set.todo;
		var map = set.map;
		var _v0 = set.light;
		if (!_v0.b) {
			var nset = _Utils_update(
				set,
				{timer: 0});
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						gameset: nset,
						progress: $author$project$Parameter$Fadeout(
							A2($author$project$Parameter$Finite, 2, 0))
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			var t = A2(
				$elm$core$List$filter,
				function (_v5) {
					var p = _v5.a;
					var q = _v5.b;
					return (p > 0) && ((q > 0) && (_Utils_cmp(q, $author$project$Parameter$right_bound + 1) < 0));
				},
				A2(
					$elm$core$List$map,
					function (_v4) {
						var p = _v4.a;
						var q = _v4.b;
						return _Utils_Tuple2(p - 1, q);
					},
					todolist));
			var nmap = A2($elm$core$List$drop, 1, map);
			var _v1 = set.windowsize;
			var window_x = _v1.a;
			var window_y = _v1.b;
			var nuppos = (set.uppos >= 10) ? set.uppos : (((10 / window_y) * A2($elm$core$Basics$pow, set.timer, 1.05)) / 50);
			var bottompos = 10 + nuppos;
			var newmodel = A2(
				$author$project$Light$update_light_object,
				set.uppos,
				A2(
					$author$project$Light$remove_outrange,
					nuppos,
					$author$project$Light$rotate_device(model)));
			var isLightPlant = !_Utils_eq(
				$elm$core$List$length(set.score),
				$elm$core$List$length(newmodel.gameset.score));
			var sound_cmd = isLightPlant ? $elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Music$settime(
						_Utils_Tuple2('light_plant2', 0)),
						$author$project$Music$pause('light_plant2'),
						$author$project$Music$start('light_plant2')
					])) : $elm$core$Platform$Cmd$none;
			var newset = newmodel.gameset;
			var nobjects = $author$project$Update_level_2$get_nobjects(newmodel);
			var _v2 = $author$project$Update_level_2$get_state(model);
			var ngame_state = _v2.a;
			var nprogress = _v2.b;
			var _v3 = A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(0, 0),
				$elm$core$List$head(
					$elm$core$List$reverse(
						A2(
							$elm$core$List$sortBy,
							$elm$core$Tuple$second,
							A2(
								$elm$core$List$map,
								function (x) {
									return x.tail;
								},
								set.light_path)))));
			var final_x = _v3.a;
			var final_y = _v3.b;
			if (_Utils_eq(set.gamestate, $author$project$Parameter$Paused)) {
				return A2($author$project$Update_level_2$get_nstate_pause, newmodel, nobjects);
			} else {
				if (_Utils_cmp(
					$elm$core$Basics$floor(((set.uppos * window_y) / 10) / (0.1 * window_y)),
					set.maptimer) > 0) {
					return A7($author$project$Update_small$generate_new_brick, newset, newmodel, elapsed, nuppos, nmap, t, sound_cmd);
				} else {
					if ($author$project$Update_small$is_end_level(set)) {
						var nnewset = _Utils_update(
							newset,
							{timer: 0});
						return _Utils_Tuple2(
							_Utils_update(
								newmodel,
								{
									gameset: nnewset,
									progress: $author$project$Parameter$Fadeout(
										A2($author$project$Parameter$Finite, 2, 0))
								}),
							sound_cmd);
					} else {
						return A7($author$project$Update_small$default_update_tick, newset, elapsed, nuppos, nobjects, ngame_state, newmodel, nprogress);
					}
				}
			}
		}
	});
var $author$project$Update_level_2$update_level_2 = F2(
	function (model, msg) {
		_v0$13:
		while (true) {
			switch (msg.$) {
				case 'GetViewport':
					var viewport = msg.a.viewport;
					return A2($author$project$Update_small$update_viewport, model, viewport);
				case 'Resize':
					var wid = msg.a;
					var hei = msg.b;
					return A3($author$project$Update_small$update_resize, model, wid, hei);
				case 'Key_Up':
					if (msg.a === 32) {
						return $author$project$Update_small$stop_rotate(model);
					} else {
						break _v0$13;
					}
				case 'Key_Down':
					switch (msg.a) {
						case 38:
							return $author$project$Update_small$volume_up(model);
						case 40:
							return $author$project$Update_small$volume_down(model);
						case 81:
							return A2($author$project$Update_level_2$set_mirror, model, msg);
						case 32:
							return A2($author$project$Update_level_2$press_space, model, model.gameset);
						case 13:
							return A2($author$project$Update_level_2$press_enter, model, model.gameset);
						case 87:
							return A2($author$project$Update_level_2$set_splitter, model, msg);
						default:
							break _v0$13;
					}
				case 'Rocktype':
					var l = msg.a;
					return A2($author$project$Update_small$generate_rock, model, l);
				case 'Click':
					var a = msg.a;
					return A3($author$project$Update_level_2$check_click_pos, a.pagePos, model, msg);
				case 'Animate':
					var animMsg = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								animatecurtain: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, model.animatecurtain),
								button: A2(
									$elm$core$List$map,
									function (_v1) {
										var anistate = _v1.anistate;
										var helppage = _v1.helppage;
										var buttontype = _v1.buttontype;
										return {
											anistate: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, anistate),
											buttontype: buttontype,
											helppage: A2(
												$elm$core$List$map,
												function (x) {
													return A2($mdgriffith$elm_style_animation$Animation$update, animMsg, x);
												},
												helppage)
										};
									},
									model.button),
								instructions: A2(
									$elm$core$List$map,
									function (x) {
										return A2($mdgriffith$elm_style_animation$Animation$update, animMsg, x);
									},
									model.instructions)
							}),
						$elm$core$Platform$Cmd$none);
				case 'Tick':
					var elapsed = msg.a;
					return A2($author$project$Update_level_2$update_level2_tick, model, elapsed);
				default:
					break _v0$13;
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Parameter$Notbegin = {$: 'Notbegin'};
var $author$project$Parameter$ReturnMenu = {$: 'ReturnMenu'};
var $author$project$Animate$finite_buttons = A2(
	$elm$core$List$append,
	_List_fromArray(
		[
			A3($author$project$Parameter$Button, $author$project$Animate$default_menu_button_state, _List_Nil, $author$project$Parameter$ReturnMenu)
		]),
	A2(
		$elm$core$List$map,
		function (x) {
			return A3(
				$author$project$Parameter$Button,
				$author$project$Animate$default_menu_button_state,
				_List_fromArray(
					[$author$project$Animate$help_page]),
				$author$project$Parameter$StartGame(
					A2($author$project$Parameter$Finite, x, 0)));
		},
		_List_fromArray(
			[1, 2, 3])));
var $author$project$Update$start_endless = function (set) {
	var nmodel = $author$project$Parameter$init_model;
	var newset = nmodel.gameset;
	var nset = _Utils_update(
		newset,
		{windowsize: set.windowsize});
	return _Utils_Tuple2(
		_Utils_update(
			nmodel,
			{
				gameset: nset,
				progress: $author$project$Parameter$Gaming($author$project$Parameter$Endless)
			}),
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Map$map_brick_generate,
					$author$project$Music$changeVolume(
					_Utils_Tuple2('audio-sample', 1)),
					$author$project$Music$changeVolume(
					_Utils_Tuple2('place_instrument', 1))
				])));
};
var $author$project$Update$update_tick = F2(
	function (model, elapsed) {
		var set = model.gameset;
		var t = A2(
			$elm$core$List$filter,
			function (_v2) {
				var p = _v2.a;
				var q = _v2.b;
				return (p > 0) && ((q > 0) && (_Utils_cmp(q, $author$project$Parameter$right_bound + 1) < 0));
			},
			A2(
				$elm$core$List$map,
				function (_v1) {
					var p = _v1.a;
					var q = _v1.b;
					return _Utils_Tuple2(p - 1, q);
				},
				set.todo));
		var nmap = A2($elm$core$List$drop, 1, set.map);
		var _v0 = set.windowsize;
		var window_x = _v0.a;
		var window_y = _v0.b;
		var nuppos = ((10 / window_y) * A2($elm$core$Basics$pow, set.timer, 1.05)) / 50;
		var bottompos = 10 + nuppos;
		var newmodel = A2(
			$author$project$Light$update_light_object,
			set.uppos,
			A2(
				$author$project$Light$remove_outrange,
				nuppos,
				$author$project$Light$rotate_device(model)));
		if (_Utils_cmp(
			$elm$core$Basics$floor(((set.uppos * window_y) / 10) / (0.1 * window_y)),
			set.maptimer) > 0) {
			return A7($author$project$Update_small$generate_new_brick, newmodel.gameset, newmodel, elapsed, nuppos, nmap, t, $elm$core$Platform$Cmd$none);
		} else {
			var newset = newmodel.gameset;
			var nset = _Utils_update(
				set,
				{timer: newset.timer + elapsed, uppos: nuppos});
			return _Utils_Tuple2(
				_Utils_update(
					newmodel,
					{gameset: nset}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Update$update_menu = F2(
	function (model, msg) {
		var set = model.gameset;
		var todolist = set.todo;
		var map = set.map;
		_v0$10:
		while (true) {
			switch (msg.$) {
				case 'Tick':
					var elapsed = msg.a;
					return A2($author$project$Update$update_tick, model, elapsed);
				case 'Rocktype':
					var l = msg.a;
					return A2($author$project$Update_small$generate_rock, model, l);
				case 'GetViewport':
					var viewport = msg.a.viewport;
					return A2($author$project$Update_small$update_viewport, model, viewport);
				case 'Resize':
					var wid = msg.a;
					var hei = msg.b;
					return A3($author$project$Update_small$update_resize, model, wid, hei);
				case 'Mouseclick':
					if (msg.a.$ === 'Help') {
						var _v1 = msg.a;
						var nset = _Utils_update(
							set,
							{timer: 0});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{button: $author$project$Animate$finite_buttons, gameset: nset, progress: $author$project$Parameter$Helppage}),
							$elm$core$Platform$Cmd$none);
					} else {
						break _v0$10;
					}
				case 'Start':
					if (msg.a.$ === 'Endless') {
						var _v2 = msg.a;
						return $author$project$Update$start_endless(set);
					} else {
						if ((!msg.a.a) && (!msg.a.b)) {
							var _v3 = msg.a;
							var nset = $author$project$Parameter$Game_Set(
								_List_fromArray(
									[
										A2(
										$author$project$Parameter$Line_element,
										_Utils_Tuple2(4.5, -1),
										_Utils_Tuple2(4.5, 10))
									]))(_List_Nil)(_List_Nil)(set.windowsize)($author$project$Parameter$Notbegin)(0)(0)($author$project$Parameter$map_initial)(
								_List_fromArray(
									[
										_Utils_Tuple2(1, 1)
									]))(0)(_List_Nil);
							return _Utils_Tuple2(
								$author$project$Parameter$Model(nset)(
									$elm$random$Random$initialSeed(2))($author$project$Parameter$None)(
									_Utils_Tuple2(0, 0))($author$project$Parameter$Select_Pos)(
									$author$project$Parameter$Gaming(
										A2($author$project$Parameter$Finite, 0, 0)))(
									$mdgriffith$elm_style_animation$Animation$style(
										_List_fromArray(
											[
												$mdgriffith$elm_style_animation$Animation$opacity(0.0)
											])))($author$project$Animate$finite_buttons)($author$project$Parameter$init_board)(model.highscore)(_List_Nil)(model.volume),
								$author$project$Map$map_brick_generate);
						} else {
							break _v0$10;
						}
					}
				case 'Mouseover':
					var button_type = msg.a;
					return A2($author$project$Scoreboard$mouseover, model, button_type);
				case 'Mouseleave':
					var button_type = msg.a;
					return A2($author$project$Scoreboard$mouseleave, model, button_type);
				case 'Animate':
					var animMsg = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								animatecurtain: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, model.animatecurtain),
								button: A2(
									$elm$core$List$map,
									function (_v4) {
										var anistate = _v4.anistate;
										var helppage = _v4.helppage;
										var buttontype = _v4.buttontype;
										return {
											anistate: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, anistate),
											buttontype: buttontype,
											helppage: A2(
												$elm$core$List$map,
												function (x) {
													return A2($mdgriffith$elm_style_animation$Animation$update, animMsg, x);
												},
												helppage)
										};
									},
									model.button)
							}),
						$elm$core$Platform$Cmd$none);
				default:
					break _v0$10;
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Parameter$Menu = {$: 'Menu'};
var $author$project$Update$update_open_animation = F2(
	function (model, msg) {
		var set = model.gameset;
		switch (msg.$) {
			case 'GetViewport':
				var viewport = msg.a.viewport;
				return A2($author$project$Update_small$update_viewport, model, viewport);
			case 'Resize':
				var wid = msg.a;
				var hei = msg.b;
				return A3($author$project$Update_small$update_resize, model, wid, hei);
			case 'Tick':
				var elapsed = msg.a;
				if (!set.timer) {
					return A3($author$project$Animate$set_open_animation, model, elapsed, set.windowsize);
				} else {
					if (set.timer > 6100) {
						return A2($author$project$Animate$button_appear, model, $author$project$Parameter$Menu);
					} else {
						var nset = _Utils_update(
							set,
							{timer: set.timer + elapsed});
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{gameset: nset}),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 'Animate':
				var animMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							animatecurtain: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, model.animatecurtain),
							button: A2(
								$elm$core$List$map,
								function (_v1) {
									var anistate = _v1.anistate;
									var helppage = _v1.helppage;
									var buttontype = _v1.buttontype;
									return {
										anistate: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, anistate),
										buttontype: buttontype,
										helppage: A2(
											$elm$core$List$map,
											function (x) {
												return A2($mdgriffith$elm_style_animation$Animation$update, animMsg, x);
											},
											helppage)
									};
								},
								model.button)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Update_board$reset_level = F2(
	function (model, level) {
		var t = _List_fromArray(
			[
				_Utils_Tuple2(1, 1)
			]);
		var m = $author$project$Parameter$map_initial;
		if (level.$ === 'Endless') {
			var nset = $author$project$Parameter$Game_Set(
				_List_fromArray(
					[
						A2(
						$author$project$Parameter$Line_element,
						_Utils_Tuple2(5, -1),
						_Utils_Tuple2(5, 10)),
						A2(
						$author$project$Parameter$Line_element,
						_Utils_Tuple2(4, -1),
						_Utils_Tuple2(4, 10))
					]))(_List_Nil)(_List_Nil)(model.gameset.windowsize)($author$project$Parameter$Notbegin)(0)(0)(m)(t)(0)(_List_Nil);
			return _Utils_Tuple2(
				$author$project$Parameter$Model(nset)(
					$elm$random$Random$initialSeed(2))($author$project$Parameter$None)(
					_Utils_Tuple2(0, 0))($author$project$Parameter$Select_Pos)(
					$author$project$Parameter$Gaming(level))(
					$mdgriffith$elm_style_animation$Animation$style(
						_List_fromArray(
							[
								$mdgriffith$elm_style_animation$Animation$opacity(0.0)
							])))(_List_Nil)($author$project$Parameter$init_board)(model.highscore)(_List_Nil)(model.volume),
				$author$project$Map$map_brick_generate);
		} else {
			var a = level.b;
			var nset = $author$project$Parameter$Game_Set(
				_List_fromArray(
					[
						A2(
						$author$project$Parameter$Line_element,
						_Utils_Tuple2(4.5, -1),
						_Utils_Tuple2(4.5, 10))
					]))(_List_Nil)(_List_Nil)(model.gameset.windowsize)($author$project$Parameter$Notbegin)(0)(0)(m)(t)(0)(_List_Nil);
			return _Utils_Tuple2(
				$author$project$Parameter$Model(nset)(
					$elm$random$Random$initialSeed(2))($author$project$Parameter$None)(
					_Utils_Tuple2(0, 0))($author$project$Parameter$Select_Pos)(
					$author$project$Parameter$Gaming(
						A2($author$project$Parameter$Finite, 0, 0)))(
					$mdgriffith$elm_style_animation$Animation$style(
						_List_fromArray(
							[
								$mdgriffith$elm_style_animation$Animation$opacity(0.0)
							])))($author$project$Animate$finite_buttons)($author$project$Parameter$init_board)(model.highscore)(_List_Nil)(model.volume),
				$author$project$Map$map_brick_generate);
		}
	});
var $author$project$Parameter$ButtonRaise = {$: 'ButtonRaise'};
var $author$project$Parameter$Counting = {$: 'Counting'};
var $author$project$Parameter$Dropdown = {$: 'Dropdown'};
var $author$project$Parameter$Recording = {$: 'Recording'};
var $author$project$Scoreboard$drop_down = F3(
	function (board, window_y, curtain) {
		return _Utils_update(
			board,
			{
				board: A2(
					$mdgriffith$elm_style_animation$Animation$interrupt,
					_List_fromArray(
						[
							A2(
							$mdgriffith$elm_style_animation$Animation$toWith,
							$mdgriffith$elm_style_animation$Animation$easing(
								{
									duration: 800,
									ease: function (x) {
										return A2($elm$core$Basics$pow, x, 2);
									}
								}),
							_List_fromArray(
								[
									$mdgriffith$elm_style_animation$Animation$opacity(1.0),
									$mdgriffith$elm_style_animation$Animation$height(
									$mdgriffith$elm_style_animation$Animation$percent(0.8 * window_y))
								]))
						]),
					board.board),
				score: _Utils_Tuple2(
					A2(
						$mdgriffith$elm_style_animation$Animation$interrupt,
						_List_fromArray(
							[
								$mdgriffith$elm_style_animation$Animation$wait(
								$elm$time$Time$millisToPosix(700)),
								A2(
								$mdgriffith$elm_style_animation$Animation$toWith,
								$mdgriffith$elm_style_animation$Animation$easing(
									{
										duration: 300,
										ease: function (x) {
											return A2($elm$core$Basics$pow, x, 2);
										}
									}),
								_List_fromArray(
									[
										$mdgriffith$elm_style_animation$Animation$opacity(1.0),
										$mdgriffith$elm_style_animation$Animation$scale(1.0),
										$mdgriffith$elm_style_animation$Animation$top(
										$mdgriffith$elm_style_animation$Animation$percent(28)),
										$mdgriffith$elm_style_animation$Animation$height(
										$mdgriffith$elm_style_animation$Animation$px(40.0)),
										$mdgriffith$elm_style_animation$Animation$backgroundColor(
										{alpha: 0.5, blue: 255, green: 255, red: 255})
									]))
							]),
						curtain),
					0),
				state: $author$project$Parameter$Dropdown
			});
	});
var $author$project$Scoreboard$new_record_step = function (_v0) {
	var window_x = _v0.a;
	var window_y = _v0.b;
	return _List_fromArray(
		[
			A2(
			$mdgriffith$elm_style_animation$Animation$toWith,
			$mdgriffith$elm_style_animation$Animation$easing(
				{
					duration: 1000,
					ease: function (x) {
						return A2($elm$core$Basics$pow, x, 3);
					}
				}),
			_List_fromArray(
				[
					$mdgriffith$elm_style_animation$Animation$opacity(1.0),
					$mdgriffith$elm_style_animation$Animation$color(
					{alpha: 1, blue: 0, green: 0, red: 255}),
					$mdgriffith$elm_style_animation$Animation$scale(1.0),
					$mdgriffith$elm_style_animation$Animation$top(
					$mdgriffith$elm_style_animation$Animation$percent(30)),
					$mdgriffith$elm_style_animation$Animation$height(
					$mdgriffith$elm_style_animation$Animation$percent(8)),
					$mdgriffith$elm_style_animation$Animation$left(
					$mdgriffith$elm_style_animation$Animation$percent(60)),
					$mdgriffith$elm_style_animation$Animation$rotate(
					$mdgriffith$elm_style_animation$Animation$turn(0.875)),
					$mdgriffith$elm_style_animation$Animation$borderColor(
					{alpha: 0.5, blue: 0, green: 0, red: 255}),
					$mdgriffith$elm_style_animation$Animation$borderWidth(
					$mdgriffith$elm_style_animation$Animation$px(5.0)),
					$mdgriffith$elm_style_animation$Animation$borderRadius(
					$mdgriffith$elm_style_animation$Animation$px(8.0))
				]))
		]);
};
var $author$project$Scoreboard$score_button_step = _List_fromArray(
	[
		A2(
		$mdgriffith$elm_style_animation$Animation$toWith,
		$mdgriffith$elm_style_animation$Animation$easing(
			{
				duration: 1000,
				ease: function (x) {
					return A2($elm$core$Basics$pow, x, 3);
				}
			}),
		_List_fromArray(
			[
				$mdgriffith$elm_style_animation$Animation$opacity(1.0),
				$mdgriffith$elm_style_animation$Animation$color(
				{alpha: 1, blue: 255, green: 255, red: 255}),
				$mdgriffith$elm_style_animation$Animation$backgroundColor(
				{alpha: 1, blue: 39, green: 39, red: 69}),
				$mdgriffith$elm_style_animation$Animation$borderColor(
				{alpha: 0.5, blue: 255, green: 0, red: 0})
			]))
	]);
var $author$project$Scoreboard$show_score_board = F2(
	function (model, elapsed) {
		var set = model.gameset;
		var score = ($elm$core$List$sum(set.score) * 10) + (set.maptimer * 5);
		var nset = _Utils_update(
			set,
			{timer: set.timer + elapsed});
		var board = model.scoreboard;
		var _v0 = set.windowsize;
		var window_x = _v0.a;
		var window_y = _v0.b;
		var _v1 = board.score;
		var curtain = _v1.a;
		var number = _v1.b;
		var newboard = ((set.timer > 0) && _Utils_eq(model.scoreboard.state, $author$project$Parameter$Begin)) ? A3($author$project$Scoreboard$drop_down, board, window_y, curtain) : (((set.timer > 1200) && _Utils_eq(board.state, $author$project$Parameter$Dropdown)) ? _Utils_update(
			board,
			{state: $author$project$Parameter$Counting}) : (_Utils_eq(board.state, $author$project$Parameter$Counting) ? ((_Utils_cmp(number, 31 * ((score / 31) | 0)) < 0) ? _Utils_update(
			board,
			{
				score: _Utils_Tuple2(curtain, number + 31)
			}) : ((_Utils_cmp(number, score) < 0) ? _Utils_update(
			board,
			{
				score: _Utils_Tuple2(curtain, number + 1)
			}) : _Utils_update(
			board,
			{
				newrecord: A2(
					$mdgriffith$elm_style_animation$Animation$interrupt,
					$author$project$Scoreboard$new_record_step(set.windowsize),
					board.newrecord),
				state: $author$project$Parameter$Recording
			}))) : (((set.timer > 2500) && _Utils_eq(board.state, $author$project$Parameter$Recording)) ? _Utils_update(
			board,
			{
				menu_button: A2($mdgriffith$elm_style_animation$Animation$interrupt, $author$project$Scoreboard$score_button_step, board.menu_button),
				reset_button: A2($mdgriffith$elm_style_animation$Animation$interrupt, $author$project$Scoreboard$score_button_step, board.reset_button),
				state: $author$project$Parameter$ButtonRaise
			}) : board)));
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{gameset: nset, scoreboard: newboard}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Update_board$update_score_board = F2(
	function (model, msg) {
		switch (msg.$) {
			case 'Mouseclick':
				var button_type = msg.a;
				switch (button_type.$) {
					case 'ReturnMenu':
						return $author$project$Update_small$return_menu(model);
					case 'Reset':
						var level = button_type.a;
						return A2($author$project$Update_board$reset_level, model, level);
					default:
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'GetViewport':
				var viewport = msg.a.viewport;
				return A2($author$project$Update_small$update_viewport, model, viewport);
			case 'Resize':
				var wid = msg.a;
				var hei = msg.b;
				return A3($author$project$Update_small$update_resize, model, wid, hei);
			case 'Tick':
				var elapsed = msg.a;
				return A2($author$project$Scoreboard$show_score_board, model, elapsed);
			case 'Mouseover':
				var button_type = msg.a;
				return A2($author$project$Scoreboard$mouseover, model, button_type);
			case 'Mouseleave':
				var button_type = msg.a;
				return A2($author$project$Scoreboard$mouseleave, model, button_type);
			case 'Animate':
				var animMsg = msg.a;
				var board = model.scoreboard;
				var _v2 = board.score;
				var curtain = _v2.a;
				var number = _v2.b;
				var nboard = _Utils_update(
					board,
					{
						board: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, board.board),
						menu_button: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, board.menu_button),
						newrecord: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, board.newrecord),
						reset_button: A2($mdgriffith$elm_style_animation$Animation$update, animMsg, board.reset_button),
						score: _Utils_Tuple2(
							A2($mdgriffith$elm_style_animation$Animation$update, animMsg, curtain),
							number)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{scoreboard: nboard}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Update$update = F2(
	function (msg, model) {
		var _v0 = model.progress;
		switch (_v0.$) {
			case 'Openanimation':
				return A2($author$project$Update$update_open_animation, model, msg);
			case 'ShowScoreBoard':
				return A2($author$project$Update_board$update_score_board, model, msg);
			case 'Fadeout':
				return A2($author$project$Update$update_fadeout, model, msg);
			case 'Helppage':
				return A2($author$project$Update$update_helppage, model, msg);
			case 'Menu':
				return A2($author$project$Update$update_menu, model, msg);
			default:
				if (_v0.a.$ === 'Finite') {
					switch (_v0.a.a) {
						case 0:
							var _v1 = _v0.a;
							return A2($author$project$Update_level_1$update_finite_level, model, msg);
						case 1:
							var _v2 = _v0.a;
							return A2($author$project$Update_level_1$update_level_1, model, msg);
						case 2:
							var _v3 = _v0.a;
							return A2($author$project$Update_level_2$update_level_2, model, msg);
						default:
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					var _v4 = _v0.a;
					return A2($author$project$Update$update_endless, model, msg);
				}
		}
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $author$project$Map$range2d = function (size) {
	var rangey = A2($elm$core$List$range, 1, size.b);
	var rangex = A2($elm$core$List$range, 1, size.a);
	var line = function (y) {
		return A2(
			$elm$core$List$map,
			function (x) {
				return A2($elm$core$Tuple$pair, x, y);
			},
			rangex);
	};
	return $elm$core$List$concat(
		A2($elm$core$List$map, line, rangey));
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$core$Debug$toString = _Debug_toString;
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Viewgame$view_border = function (model) {
	var set = model.gameset;
	var _v0 = set.windowsize;
	var window_x = _v0.a;
	var window_y = _v0.b;
	return _List_fromArray(
		[
			A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$width(
					$elm$core$Debug$toString(0.2 * window_x)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$Debug$toString(window_y)),
					$elm$svg$Svg$Attributes$x(
					$elm$core$Debug$toString(0)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$Debug$toString(0)),
					$elm$svg$Svg$Attributes$fill('black')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$width(
					$elm$core$Debug$toString(0.2 * window_x)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$Debug$toString(window_y)),
					$elm$svg$Svg$Attributes$x(
					$elm$core$Debug$toString(0.8 * window_x)),
					$elm$svg$Svg$Attributes$y(
					$elm$core$Debug$toString(0)),
					$elm$svg$Svg$Attributes$fill('black'),
					$elm$svg$Svg$Attributes$opacity('1')
				]),
			_List_Nil)
		]);
};
var $author$project$Map$gridColor = function (brick) {
	if (brick.$ === 'Rock') {
		var a = brick.a;
		switch (a) {
			case 1:
				return 'rgb(19,33,30)';
			case 2:
				return 'rgb(23,33,30)';
			case 3:
				return 'rgb(17,4,16)';
			case 4:
				return 'rgb(14,14,16)';
			case 5:
				return 'rgb(29,14,16)';
			default:
				return 'rgb(14,14,16)';
		}
	} else {
		return 'black';
	}
};
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $author$project$Viewgame$view_brick = F5(
	function (_v0, maptimer, map, uppos, pos) {
		var window_x = _v0.a;
		var window_y = _v0.b;
		var _v1 = pos;
		var x = _v1.a;
		var y = _v1.b;
		return A2(
			$elm$svg$Svg$rect,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$width(
					$elm$core$Debug$toString(0.06 * window_x)),
					$elm$svg$Svg$Attributes$height(
					$elm$core$Debug$toString(0.1 * window_y)),
					$elm$svg$Svg$Attributes$x(
					$elm$core$Debug$toString((((y - 1) * 0.06) * window_x) + (0.14 * window_x))),
					$elm$svg$Svg$Attributes$y(
					$elm$core$Debug$toString(((((x - 1) * 0.1) * window_y) - ((uppos * window_y) / 10)) + ((maptimer * 0.1) * window_y))),
					$elm$svg$Svg$Attributes$fill(
					$author$project$Map$gridColor(
						A3($author$project$Map$map_find, map, x, y))),
					$elm$svg$Svg$Attributes$opacity('1'),
					$elm$svg$Svg$Attributes$stroke(
					$author$project$Map$gridColor(
						A3($author$project$Map$map_find, map, x, y)))
				]),
			_List_Nil);
	});
var $author$project$Viewgame$encode_points = function (points) {
	if (!points.b) {
		return '';
	} else {
		var x = points.a;
		var xs = points.b;
		var _v1 = x;
		var a = _v1.a;
		var b = _v1.b;
		return ($elm$core$Debug$toString(a) + (',' + $elm$core$Debug$toString(b))) + (' ' + $author$project$Viewgame$encode_points(xs));
	}
};
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polyline = $elm$svg$Svg$trustedNode('polyline');
var $elm$svg$Svg$Attributes$strokeOpacity = _VirtualDom_attribute('stroke-opacity');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $author$project$Viewgame$view_light = F4(
	function (window_x, window_y, uppos, lightpath) {
		var viewpoints = A2(
			$elm$core$List$map,
			function (_v0) {
				var a = _v0.a;
				var b = _v0.b;
				return _Utils_Tuple2((0.2 * window_x) + ((a * 0.06) * window_x), ((window_y * 0.1) * b) - ((uppos * window_y) / 10));
			},
			lightpath);
		return A2(
			$elm$svg$Svg$polyline,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke('rgb(255,225,121)'),
					$elm$svg$Svg$Attributes$strokeWidth('3'),
					$elm$svg$Svg$Attributes$fill('none'),
					$elm$svg$Svg$Attributes$strokeOpacity('1.0'),
					$elm$svg$Svg$Attributes$points(
					$author$project$Viewgame$encode_points(viewpoints))
				]),
			_List_Nil);
	});
var $author$project$Viewgame$view_lights = function (model) {
	var lightpaths = A2(
		$elm$core$List$map,
		function (a) {
			return _List_fromArray(
				[a.head, a.tail]);
		},
		model.gameset.light_path);
	var _v0 = model.gameset.windowsize;
	var window_x = _v0.a;
	var window_y = _v0.b;
	return A2(
		$elm$core$List$map,
		A3($author$project$Viewgame$view_light, window_x, window_y, model.gameset.uppos),
		lightpaths);
};
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $author$project$Viewgame$view_transition = F3(
	function (_v0, uppos, _v1) {
		var window_x = _v0.a;
		var window_y = _v0.b;
		var a = _v1.a;
		var b = _v1.b;
		var _v2 = _Utils_Tuple2((0.2 * window_x) + ((a * 0.06) * window_x), ((window_y * 0.1) * b) - ((uppos * window_y) / 10));
		var x = _v2.a;
		var y = _v2.b;
		return _Utils_Tuple2(x, y);
	});
var $elm$svg$Svg$image = $elm$svg$Svg$trustedNode('image');
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $elm$svg$Svg$Attributes$xlinkHref = function (value) {
	return A3(
		_VirtualDom_attributeNS,
		'http://www.w3.org/1999/xlink',
		'xlink:href',
		_VirtualDom_noJavaScriptUri(value));
};
var $author$project$Viewgame$viewplant = F4(
	function (_v0, uppos, object, _v1) {
		var window_x = _v0.a;
		var window_y = _v0.b;
		var _v2 = _v1.a;
		var a = _v2.a;
		var b = _v2.b;
		var c = _v1.b;
		var nodes = object.nodes;
		var viewpoints = A2(
			$elm$core$List$map,
			A2(
				$author$project$Viewgame$view_transition,
				_Utils_Tuple2(window_x, window_y),
				uppos),
			nodes);
		var link = function () {
			var _v10 = _Utils_Tuple2(a, b);
			_v10$8:
			while (true) {
				switch (_v10.b) {
					case 1:
						switch (_v10.a) {
							case 1:
								return './assets/Graphics/p1_1.png';
							case 2:
								return './assets/Graphics/p2_1.png';
							case 3:
								return './assets/Graphics/p3_1.png';
							case 4:
								return './assets/Graphics/p1_1.png';
							default:
								break _v10$8;
						}
					case 2:
						switch (_v10.a) {
							case 1:
								return './assets/Graphics/p1_2.png';
							case 2:
								return './assets/Graphics/p2_2.png';
							case 3:
								return './assets/Graphics/p3_2.png';
							case 4:
								return './assets/Graphics/p1_2.png';
							default:
								break _v10$8;
						}
					default:
						break _v10$8;
				}
			}
			return './assets/Graphics/p1_1.png';
		}();
		var _v3 = function () {
			var _v4 = $elm$core$List$head(
				A2($elm$core$List$drop, 1, viewpoints));
			if (_v4.$ === 'Just') {
				var _v5 = _v4.a;
				var x = _v5.a;
				var y = _v5.b;
				return _Utils_Tuple2(x, y);
			} else {
				return _Utils_Tuple2(0, 0);
			}
		}();
		var x2 = _v3.a;
		var y2 = _v3.b;
		var _v6 = function () {
			var _v7 = $elm$core$List$head(viewpoints);
			if (_v7.$ === 'Just') {
				var _v8 = _v7.a;
				var x = _v8.a;
				var y = _v8.b;
				return _Utils_Tuple2(x, y);
			} else {
				return _Utils_Tuple2(0, 0);
			}
		}();
		var x1 = _v6.a;
		var y1 = _v6.b;
		var length = A2(
			$author$project$Polygoninside$distance,
			_Utils_Tuple2(x1, y1),
			_Utils_Tuple2(x2, y2));
		var _v9 = _Utils_Tuple2(x1, y1 - length);
		var va = _v9.a;
		var vb = _v9.b;
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$image,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$Debug$toString(length)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$Debug$toString(length)),
						$elm$svg$Svg$Attributes$x(
						$elm$core$Debug$toString(va)),
						$elm$svg$Svg$Attributes$y(
						$elm$core$Debug$toString(vb)),
						$elm$svg$Svg$Attributes$xlinkHref(link),
						$elm$svg$Svg$Attributes$transform(
						'rotate(' + ($elm$core$Debug$toString(c) + (',' + ($elm$core$Debug$toString(x1) + (',' + ($elm$core$Debug$toString(y1) + ')'))))))
					]),
				_List_Nil)
			]);
	});
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$dominantBaseline = _VirtualDom_attribute('dominant-baseline');
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$svg$Svg$Attributes$strokeDasharray = _VirtualDom_attribute('stroke-dasharray');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $author$project$Viewgame$viewstone = F3(
	function (_v0, uppos, object) {
		var window_x = _v0.a;
		var window_y = _v0.b;
		var r = (2 * 0.06) * window_x;
		var nodes = object.nodes;
		var viewpoints = A2(
			$elm$core$List$map,
			A2(
				$author$project$Viewgame$view_transition,
				_Utils_Tuple2(window_x, window_y),
				uppos),
			nodes);
		var _v1 = function () {
			var _v2 = object.object_type;
			if (_v2.$ === 'Stone') {
				var a = _v2.a;
				var b = _v2.b;
				return _Utils_Tuple2(a, b);
			} else {
				return _Utils_Tuple2(-1, 0);
			}
		}();
		var n = _v1.a;
		var m = _v1.b;
		var color = function () {
			switch (n) {
				case 1:
					return 'rgb(88,55,53)';
				case 2:
					return 'rgb(91,70,20)';
				case 3:
					return 'rgb(61,82,68)';
				case 4:
					return 'rgb(71,47,68)';
				case 5:
					return 'rgb(61,48,96)';
				case 6:
					return (m >= 6) ? 'rgb(96,20,39)' : 'rgb(94,87,101)';
				default:
					return 'black';
			}
		}();
		var _v3 = A3(
			$author$project$Viewgame$view_transition,
			_Utils_Tuple2(window_x, window_y),
			uppos,
			object.pos);
		var cx = _v3.a;
		var cy = _v3.b;
		if (n === 6) {
			return (m >= 7) ? _List_fromArray(
				[
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill(color),
							$elm$svg$Svg$Attributes$stroke('rgb(70,70,70)'),
							$elm$svg$Svg$Attributes$strokeWidth('5'),
							$elm$svg$Svg$Attributes$points(
							$author$project$Viewgame$encode_points(viewpoints))
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$text_,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$x(
							$elm$core$Debug$toString(cx)),
							$elm$svg$Svg$Attributes$y(
							$elm$core$Debug$toString(cy)),
							$elm$svg$Svg$Attributes$fill('rgb(171,5,66)'),
							$elm$svg$Svg$Attributes$fontSize('40'),
							$elm$svg$Svg$Attributes$textAnchor('middle'),
							$elm$svg$Svg$Attributes$dominantBaseline('central')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('!')
						])),
					A2(
					$elm$svg$Svg$circle,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$cx(
							$elm$core$Debug$toString(cx)),
							$elm$svg$Svg$Attributes$cy(
							$elm$core$Debug$toString(cy)),
							$elm$svg$Svg$Attributes$r(
							$elm$core$Debug$toString(r)),
							$elm$svg$Svg$Attributes$fillOpacity('0'),
							$elm$svg$Svg$Attributes$stroke('rgb(171,5,66)'),
							$elm$svg$Svg$Attributes$strokeOpacity('0.3'),
							$elm$svg$Svg$Attributes$strokeWidth('4'),
							$elm$svg$Svg$Attributes$strokeDasharray('20,10')
						]),
					_List_Nil)
				]) : _List_fromArray(
				[
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill(color),
							$elm$svg$Svg$Attributes$stroke('rgb(70,70,70)'),
							$elm$svg$Svg$Attributes$strokeWidth('5'),
							$elm$svg$Svg$Attributes$points(
							$author$project$Viewgame$encode_points(viewpoints))
						]),
					_List_Nil)
				]);
		} else {
			return _List_fromArray(
				[
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$fill(color),
							$elm$svg$Svg$Attributes$stroke('rgb(70,70,70)'),
							$elm$svg$Svg$Attributes$strokeWidth('5'),
							$elm$svg$Svg$Attributes$points(
							$author$project$Viewgame$encode_points(viewpoints))
						]),
					_List_Nil)
				]);
		}
	});
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $author$project$Viewgame$view_object = F3(
	function (_v0, uppos, object) {
		var window_x = _v0.a;
		var window_y = _v0.b;
		var _v1 = object.object_type;
		switch (_v1.$) {
			case 'Mirror':
				var viewnodes = A2(
					$elm$core$List$map,
					A2(
						$author$project$Viewgame$view_transition,
						_Utils_Tuple2(window_x, window_y),
						uppos),
					object.nodes);
				var _v2 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(
						A2($elm$core$List$drop, 1, viewnodes)));
				var x2 = _v2.a;
				var y2 = _v2.b;
				var _v3 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(viewnodes));
				var x1 = _v3.a;
				var y1 = _v3.b;
				return _List_fromArray(
					[
						A2(
						$elm$svg$Svg$line,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$x1(
								$elm$core$Debug$toString(x1)),
								$elm$svg$Svg$Attributes$y1(
								$elm$core$Debug$toString(y1)),
								$elm$svg$Svg$Attributes$x2(
								$elm$core$Debug$toString(x2)),
								$elm$svg$Svg$Attributes$y2(
								$elm$core$Debug$toString(y2)),
								$elm$svg$Svg$Attributes$fill('black'),
								$elm$svg$Svg$Attributes$stroke('rgb(255,160,14)'),
								$elm$svg$Svg$Attributes$strokeWidth('5')
							]),
						_List_Nil)
					]);
			case 'Splitter':
				var viewnodes = A2(
					$elm$core$List$map,
					A2(
						$author$project$Viewgame$view_transition,
						_Utils_Tuple2(window_x, window_y),
						uppos),
					object.nodes);
				var _v4 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(
						A2($elm$core$List$drop, 1, viewnodes)));
				var x2 = _v4.a;
				var y2 = _v4.b;
				var _v5 = A2(
					$elm$core$Maybe$withDefault,
					_Utils_Tuple2(0, 0),
					$elm$core$List$head(viewnodes));
				var x1 = _v5.a;
				var y1 = _v5.b;
				return _List_fromArray(
					[
						A2(
						$elm$svg$Svg$line,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$x1(
								$elm$core$Debug$toString(x1)),
								$elm$svg$Svg$Attributes$y1(
								$elm$core$Debug$toString(y1)),
								$elm$svg$Svg$Attributes$x2(
								$elm$core$Debug$toString(x2)),
								$elm$svg$Svg$Attributes$y2(
								$elm$core$Debug$toString(y2)),
								$elm$svg$Svg$Attributes$fill('black'),
								$elm$svg$Svg$Attributes$stroke('rgb(255,50,56)'),
								$elm$svg$Svg$Attributes$strokeWidth('5')
							]),
						_List_Nil)
					]);
			case 'Stone':
				return A3(
					$author$project$Viewgame$viewstone,
					_Utils_Tuple2(window_x, window_y),
					uppos,
					object);
			case 'Plant':
				var _v6 = _v1.a;
				var _v7 = _v6.a;
				var a = _v7.a;
				var b = _v7.b;
				var c = _v6.b;
				return A4(
					$author$project$Viewgame$viewplant,
					_Utils_Tuple2(window_x, window_y),
					uppos,
					object,
					_Utils_Tuple2(
						_Utils_Tuple2(a, b),
						c));
			default:
				var nodes = object.nodes;
				var viewpoints = A2(
					$elm$core$List$map,
					A2(
						$author$project$Viewgame$view_transition,
						_Utils_Tuple2(window_x, window_y),
						uppos),
					nodes);
				return _List_fromArray(
					[
						A2(
						$elm$svg$Svg$polygon,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$fill('blue'),
								$elm$svg$Svg$Attributes$stroke('red'),
								$elm$svg$Svg$Attributes$points(
								$author$project$Viewgame$encode_points(viewpoints))
							]),
						_List_Nil)
					]);
		}
	});
var $author$project$Viewgame$view_objects = function (model) {
	var set = model.gameset;
	var objects = set.objects;
	var list_stones = A2(
		$elm$core$List$filter,
		function (a) {
			var _v1 = a.object_type;
			if (_v1.$ === 'Stone') {
				var num = _v1.a;
				return true;
			} else {
				return false;
			}
		},
		objects);
	var list_others = A2(
		$elm$core$List$filter,
		function (a) {
			var _v0 = a.object_type;
			if (_v0.$ === 'Stone') {
				var num = _v0.a;
				return false;
			} else {
				return true;
			}
		},
		objects);
	return $elm$core$List$concat(
		_Utils_ap(
			A2(
				$elm$core$List$map,
				A2($author$project$Viewgame$view_object, set.windowsize, set.uppos),
				list_others),
			A2(
				$elm$core$List$map,
				A2($author$project$Viewgame$view_object, set.windowsize, set.uppos),
				list_stones)));
};
var $author$project$Viewgame$view_select_pos = function (model) {
	var set = model.gameset;
	var placestate = model.place_state;
	var _v0 = set.windowsize;
	var window_x = _v0.a;
	var window_y = _v0.b;
	var _v1 = function (_v2) {
		var a = _v2.a;
		var b = _v2.b;
		return _Utils_Tuple2((0.2 * window_x) + ((a * 0.06) * window_x), ((window_y * 0.1) * b) - ((model.gameset.uppos * window_y) / 10));
	}(model.clickpos);
	var posx = _v1.a;
	var posy = _v1.b;
	if (placestate.$ === 'Select_Device') {
		return A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$cx(
					$elm$core$Debug$toString(posx)),
					$elm$svg$Svg$Attributes$cy(
					$elm$core$Debug$toString(posy)),
					$elm$svg$Svg$Attributes$r('10'),
					$elm$svg$Svg$Attributes$fill('yellow'),
					$elm$svg$Svg$Attributes$stroke('yellow'),
					$elm$svg$Svg$Attributes$strokeOpacity('1.0')
				]),
			_List_Nil);
	} else {
		return A2($elm$svg$Svg$circle, _List_Nil, _List_Nil);
	}
};
var $author$project$Viewgame$view_fade_out = function (model) {
	var set = model.gameset;
	var timer = set.timer;
	var opacity = A2(
		$elm$core$Basics$max,
		$elm$core$Basics$cos((timer * $elm$core$Basics$pi) / 9000),
		0.0);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2(
				$elm$html$Html$Attributes$style,
				'opacity',
				$elm$core$Debug$toString(opacity))
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width('100%'),
						$elm$svg$Svg$Attributes$height('100%')
					]),
				_Utils_ap(
					A2(
						$elm$core$List$map,
						A4($author$project$Viewgame$view_brick, set.windowsize, set.maptimer, set.map, set.uppos),
						$author$project$Map$range2d(
							_Utils_Tuple2(12, $author$project$Parameter$right_bound))),
					_Utils_ap(
						$author$project$Viewgame$view_objects(model),
						_Utils_ap(
							$author$project$Viewgame$view_lights(model),
							_Utils_ap(
								_List_fromArray(
									[
										$author$project$Viewgame$view_select_pos(model)
									]),
								$author$project$Viewgame$view_border(model))))))
			]));
};
var $author$project$Parameter$Click = function (a) {
	return {$: 'Click', a: a};
};
var $elm$html$Html$audio = _VirtualDom_node('audio');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$autoplay = $elm$html$Html$Attributes$boolProperty('autoplay');
var $elm$html$Html$Attributes$controls = $elm$html$Html$Attributes$boolProperty('controls');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$Attributes$loop = $elm$html$Html$Attributes$boolProperty('loop');
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions = {preventDefault: true, stopPropagation: false};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event = F6(
	function (keys, button, clientPos, offsetPos, pagePos, screenPos) {
		return {button: button, clientPos: clientPos, keys: keys, offsetPos: offsetPos, pagePos: pagePos, screenPos: screenPos};
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton = {$: 'BackButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton = {$: 'ErrorButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton = {$: 'ForwardButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton = {$: 'MainButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton = {$: 'MiddleButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton = {$: 'SecondButton'};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId = function (id) {
	switch (id) {
		case 0:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MainButton;
		case 1:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$MiddleButton;
		case 2:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$SecondButton;
		case 3:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$BackButton;
		case 4:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ForwardButton;
		default:
			return $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$ErrorButton;
	}
};
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder = A2(
	$elm$json$Json$Decode$map,
	$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonFromId,
	A2($elm$json$Json$Decode$field, 'button', $elm$json$Json$Decode$int));
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $mpizenberg$elm_pointer_events$Internal$Decode$clientPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$Keys = F3(
	function (alt, ctrl, shift) {
		return {alt: alt, ctrl: ctrl, shift: shift};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $mpizenberg$elm_pointer_events$Internal$Decode$keys = A4(
	$elm$json$Json$Decode$map3,
	$mpizenberg$elm_pointer_events$Internal$Decode$Keys,
	A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'offsetX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'offsetY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$pagePos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Internal$Decode$screenPos = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$field, 'screenX', $elm$json$Json$Decode$float),
	A2($elm$json$Json$Decode$field, 'screenY', $elm$json$Json$Decode$float));
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder = A7($elm$json$Json$Decode$map6, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$Event, $mpizenberg$elm_pointer_events$Internal$Decode$keys, $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$buttonDecoder, $mpizenberg$elm_pointer_events$Internal$Decode$clientPos, $mpizenberg$elm_pointer_events$Internal$Decode$offsetPos, $mpizenberg$elm_pointer_events$Internal$Decode$pagePos, $mpizenberg$elm_pointer_events$Internal$Decode$screenPos);
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions = F3(
	function (event, options, tag) {
		return A2(
			$elm$html$Html$Events$custom,
			event,
			A2(
				$elm$json$Json$Decode$map,
				function (ev) {
					return {
						message: tag(ev),
						preventDefault: options.preventDefault,
						stopPropagation: options.stopPropagation
					};
				},
				$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$eventDecoder));
	});
var $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick = A2($mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onWithOptions, 'click', $mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$defaultOptions);
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$View_finite_level$find_instruction_state = F2(
	function (states, num) {
		return A2(
			$elm$core$Maybe$withDefault,
			$author$project$Instruction$default_instruction_state(
				_Utils_Tuple2(0, 0)),
			$elm$core$List$head(
				A2($elm$core$List$drop, num - 1, states)));
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $mdgriffith$elm_style_animation$Animation$Render$iePrefix = '-ms-';
var $mdgriffith$elm_style_animation$Animation$Render$webkitPrefix = '-webkit-';
var $mdgriffith$elm_style_animation$Animation$Render$prefix = function (stylePair) {
	var propValue = stylePair.b;
	var propName = stylePair.a;
	switch (propName) {
		case 'transform':
			return _List_fromArray(
				[
					stylePair,
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$iePrefix, propName),
					propValue),
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$webkitPrefix, propName),
					propValue)
				]);
		case 'transform-origin':
			return _List_fromArray(
				[
					stylePair,
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$iePrefix, propName),
					propValue),
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$webkitPrefix, propName),
					propValue)
				]);
		case 'filter':
			return _List_fromArray(
				[
					stylePair,
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$iePrefix, propName),
					propValue),
					_Utils_Tuple2(
					_Utils_ap($mdgriffith$elm_style_animation$Animation$Render$webkitPrefix, propName),
					propValue)
				]);
		default:
			return _List_fromArray(
				[stylePair]);
	}
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$Attributes$offset = _VirtualDom_attribute('offset');
var $elm$core$String$fromFloat = _String_fromNumber;
var $mdgriffith$elm_style_animation$Animation$Render$pathCmdValue = function (cmd) {
	var renderPoints = function (coords) {
		return A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				function (_v11) {
					var x = _v11.a;
					var y = _v11.b;
					return $elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position));
				},
				coords));
	};
	switch (cmd.$) {
		case 'Move':
			var x = cmd.a;
			var y = cmd.b;
			return 'm ' + ($elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position)));
		case 'MoveTo':
			var x = cmd.a;
			var y = cmd.b;
			return 'M ' + ($elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position)));
		case 'Line':
			var x = cmd.a;
			var y = cmd.b;
			return 'l ' + ($elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position)));
		case 'LineTo':
			var x = cmd.a;
			var y = cmd.b;
			return 'L ' + ($elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position)));
		case 'Horizontal':
			var a = cmd.a;
			return 'h ' + $elm$core$String$fromFloat(a.position);
		case 'HorizontalTo':
			var a = cmd.a;
			return 'H ' + $elm$core$String$fromFloat(a.position);
		case 'Vertical':
			var a = cmd.a;
			return 'v ' + $elm$core$String$fromFloat(a.position);
		case 'VerticalTo':
			var a = cmd.a;
			return 'V ' + $elm$core$String$fromFloat(a.position);
		case 'Curve':
			var control1 = cmd.a.control1;
			var control2 = cmd.a.control2;
			var point = cmd.a.point;
			var _v1 = point;
			var p1x = _v1.a;
			var p1y = _v1.b;
			var _v2 = control2;
			var c2x = _v2.a;
			var c2y = _v2.b;
			var _v3 = control1;
			var c1x = _v3.a;
			var c1y = _v3.b;
			return 'c ' + ($elm$core$String$fromFloat(c1x.position) + (' ' + ($elm$core$String$fromFloat(c1y.position) + (', ' + ($elm$core$String$fromFloat(c2x.position) + (' ' + ($elm$core$String$fromFloat(c2y.position) + (', ' + ($elm$core$String$fromFloat(p1x.position) + (' ' + $elm$core$String$fromFloat(p1y.position)))))))))));
		case 'CurveTo':
			var control1 = cmd.a.control1;
			var control2 = cmd.a.control2;
			var point = cmd.a.point;
			var _v4 = point;
			var p1x = _v4.a;
			var p1y = _v4.b;
			var _v5 = control2;
			var c2x = _v5.a;
			var c2y = _v5.b;
			var _v6 = control1;
			var c1x = _v6.a;
			var c1y = _v6.b;
			return 'C ' + ($elm$core$String$fromFloat(c1x.position) + (' ' + ($elm$core$String$fromFloat(c1y.position) + (', ' + ($elm$core$String$fromFloat(c2x.position) + (' ' + ($elm$core$String$fromFloat(c2y.position) + (', ' + ($elm$core$String$fromFloat(p1x.position) + (' ' + $elm$core$String$fromFloat(p1y.position)))))))))));
		case 'Quadratic':
			var control = cmd.a.control;
			var point = cmd.a.point;
			var _v7 = point;
			var p1x = _v7.a;
			var p1y = _v7.b;
			var _v8 = control;
			var c1x = _v8.a;
			var c1y = _v8.b;
			return 'q ' + ($elm$core$String$fromFloat(c1x.position) + (' ' + ($elm$core$String$fromFloat(c1y.position) + (', ' + ($elm$core$String$fromFloat(p1x.position) + (' ' + $elm$core$String$fromFloat(p1y.position)))))));
		case 'QuadraticTo':
			var control = cmd.a.control;
			var point = cmd.a.point;
			var _v9 = point;
			var p1x = _v9.a;
			var p1y = _v9.b;
			var _v10 = control;
			var c1x = _v10.a;
			var c1y = _v10.b;
			return 'Q ' + ($elm$core$String$fromFloat(c1x.position) + (' ' + ($elm$core$String$fromFloat(c1y.position) + (', ' + ($elm$core$String$fromFloat(p1x.position) + (' ' + $elm$core$String$fromFloat(p1y.position)))))));
		case 'SmoothQuadratic':
			var points = cmd.a;
			return 't ' + renderPoints(points);
		case 'SmoothQuadraticTo':
			var points = cmd.a;
			return 'T ' + renderPoints(points);
		case 'Smooth':
			var points = cmd.a;
			return 's ' + renderPoints(points);
		case 'SmoothTo':
			var points = cmd.a;
			return 'S ' + renderPoints(points);
		case 'ClockwiseArc':
			var arc = cmd.a;
			var deltaAngle = arc.endAngle.position - arc.startAngle.position;
			if (_Utils_cmp(deltaAngle, 360 - 1.0e-6) > 0) {
				var dy = arc.radius.position * $elm$core$Basics$sin(
					$elm$core$Basics$degrees(arc.startAngle.position));
				var dx = arc.radius.position * $elm$core$Basics$cos(
					$elm$core$Basics$degrees(arc.startAngle.position));
				return 'A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (',0,1,1,' + ($elm$core$String$fromFloat(arc.x.position - dx) + (',' + ($elm$core$String$fromFloat(arc.y.position - dy) + (' A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (',0,1,1,' + ($elm$core$String$fromFloat(arc.x.position + dx) + (',' + $elm$core$String$fromFloat(arc.y.position + dy)))))))))))))));
			} else {
				return 'A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (' 0 ' + (((deltaAngle >= 180) ? '1' : '0') + (' ' + ('1' + (' ' + ($elm$core$String$fromFloat(
					arc.x.position + (arc.radius.position * $elm$core$Basics$cos(
						$elm$core$Basics$degrees(arc.endAngle.position)))) + (',' + $elm$core$String$fromFloat(
					arc.y.position + (arc.radius.position * $elm$core$Basics$sin(
						$elm$core$Basics$degrees(arc.endAngle.position))))))))))))));
			}
		case 'AntiClockwiseArc':
			var arc = cmd.a;
			var deltaAngle = arc.endAngle.position - arc.startAngle.position;
			if (_Utils_cmp(deltaAngle, 360 - 1.0e-6) > 0) {
				var dy = arc.radius.position * $elm$core$Basics$sin(
					$elm$core$Basics$degrees(arc.startAngle.position));
				var dx = arc.radius.position * $elm$core$Basics$cos(
					$elm$core$Basics$degrees(arc.startAngle.position));
				return 'A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (',0,1,0,' + ($elm$core$String$fromFloat(arc.x.position - dx) + (',' + ($elm$core$String$fromFloat(arc.y.position - dy) + (' A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (',0,1,1,' + ($elm$core$String$fromFloat(arc.x.position + dx) + (',' + $elm$core$String$fromFloat(arc.y.position + dy)))))))))))))));
			} else {
				return 'A ' + ($elm$core$String$fromFloat(arc.radius.position) + (',' + ($elm$core$String$fromFloat(arc.radius.position) + (' 0 ' + ((((arc.startAngle.position - arc.endAngle.position) >= 180) ? '1' : '0') + (' ' + ('0' + (' ' + ($elm$core$String$fromFloat(
					arc.x.position + (arc.radius.position * $elm$core$Basics$cos(arc.endAngle.position))) + (',' + $elm$core$String$fromFloat(
					arc.y.position + (arc.radius.position * $elm$core$Basics$sin(arc.endAngle.position)))))))))))));
			}
		default:
			return 'z';
	}
};
var $mdgriffith$elm_style_animation$Animation$Render$propertyValue = F2(
	function (prop, delim) {
		switch (prop.$) {
			case 'ExactProperty':
				var value = prop.b;
				return value;
			case 'ColorProperty':
				var r = prop.b;
				var g = prop.c;
				var b = prop.d;
				var a = prop.e;
				return 'rgba(' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(r.position)) + (',' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(g.position)) + (',' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(b.position)) + (',' + ($elm$core$String$fromFloat(a.position) + ')')))))));
			case 'ShadowProperty':
				var name = prop.a;
				var inset = prop.b;
				var shadow = prop.c;
				return (inset ? 'inset ' : '') + ($elm$core$String$fromFloat(shadow.offsetX.position) + ('px' + (' ' + ($elm$core$String$fromFloat(shadow.offsetY.position) + ('px' + (' ' + ($elm$core$String$fromFloat(shadow.blur.position) + ('px' + (' ' + ((((name === 'text-shadow') || (name === 'drop-shadow')) ? '' : ($elm$core$String$fromFloat(shadow.size.position) + ('px' + ' '))) + ('rgba(' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(shadow.red.position)) + (', ' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(shadow.green.position)) + (', ' + ($elm$core$String$fromInt(
					$elm$core$Basics$round(shadow.blue.position)) + (', ' + ($elm$core$String$fromFloat(shadow.alpha.position) + ')'))))))))))))))))));
			case 'Property':
				var x = prop.b;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.position),
					x.unit);
			case 'Property2':
				var x = prop.b;
				var y = prop.c;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.position),
					_Utils_ap(
						x.unit,
						_Utils_ap(
							delim,
							_Utils_ap(
								$elm$core$String$fromFloat(y.position),
								y.unit))));
			case 'Property3':
				var x = prop.b;
				var y = prop.c;
				var z = prop.d;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.position),
					_Utils_ap(
						x.unit,
						_Utils_ap(
							delim,
							_Utils_ap(
								$elm$core$String$fromFloat(y.position),
								_Utils_ap(
									y.unit,
									_Utils_ap(
										delim,
										_Utils_ap(
											$elm$core$String$fromFloat(z.position),
											z.unit)))))));
			case 'Property4':
				var w = prop.b;
				var x = prop.c;
				var y = prop.d;
				var z = prop.e;
				return _Utils_ap(
					$elm$core$String$fromFloat(w.position),
					_Utils_ap(
						w.unit,
						_Utils_ap(
							delim,
							_Utils_ap(
								$elm$core$String$fromFloat(x.position),
								_Utils_ap(
									x.unit,
									_Utils_ap(
										delim,
										_Utils_ap(
											$elm$core$String$fromFloat(y.position),
											_Utils_ap(
												y.unit,
												_Utils_ap(
													delim,
													_Utils_ap(
														$elm$core$String$fromFloat(z.position),
														z.unit))))))))));
			case 'AngleProperty':
				var x = prop.b;
				return _Utils_ap(
					$elm$core$String$fromFloat(x.position),
					x.unit);
			case 'Points':
				var coords = prop.a;
				return A2(
					$elm$core$String$join,
					' ',
					A2(
						$elm$core$List$map,
						function (_v1) {
							var x = _v1.a;
							var y = _v1.b;
							return $elm$core$String$fromFloat(x.position) + (',' + $elm$core$String$fromFloat(y.position));
						},
						coords));
			default:
				var cmds = prop.a;
				return A2(
					$elm$core$String$join,
					' ',
					A2($elm$core$List$map, $mdgriffith$elm_style_animation$Animation$Render$pathCmdValue, cmds));
		}
	});
var $elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var $elm$svg$Svg$Attributes$ry = _VirtualDom_attribute('ry');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $mdgriffith$elm_style_animation$Animation$Render$renderAttrs = function (prop) {
	if (A2(
		$elm$core$String$startsWith,
		'attr:',
		$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop))) {
		return $elm$core$Maybe$Just(
			A2(
				$elm$html$Html$Attributes$attribute,
				A2(
					$elm$core$String$dropLeft,
					5,
					$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop)),
				A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
	} else {
		switch (prop.$) {
			case 'Points':
				var pts = prop.a;
				return $elm$core$Maybe$Just(
					$elm$svg$Svg$Attributes$points(
						A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
			case 'Path':
				var cmds = prop.a;
				return $elm$core$Maybe$Just(
					$elm$svg$Svg$Attributes$d(
						A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
			case 'Property':
				var name = prop.a;
				var m1 = prop.b;
				switch (name) {
					case 'x':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$x(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'y':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$y(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'cx':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$cx(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'cy':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$cy(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'rx':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$rx(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'ry':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$ry(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'r':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$r(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					case 'offset':
						return $elm$core$Maybe$Just(
							$elm$svg$Svg$Attributes$offset(
								A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' ')));
					default:
						return $elm$core$Maybe$Nothing;
				}
			case 'Property4':
				var name = prop.a;
				var m1 = prop.b;
				var m2 = prop.c;
				var m3 = prop.d;
				var m4 = prop.e;
				return (name === 'viewBox') ? $elm$core$Maybe$Just(
					$elm$svg$Svg$Attributes$viewBox(
						A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' '))) : $elm$core$Maybe$Nothing;
			default:
				return $elm$core$Maybe$Nothing;
		}
	}
};
var $mdgriffith$elm_style_animation$Animation$Render$isAttr = function (prop) {
	return A2(
		$elm$core$String$startsWith,
		'attr:',
		$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop)) || function () {
		switch (prop.$) {
			case 'Points':
				return true;
			case 'Path':
				return true;
			case 'Property':
				var name = prop.a;
				return (name === 'cx') || ((name === 'cy') || ((name === 'x') || ((name === 'y') || ((name === 'rx') || ((name === 'ry') || ((name === 'r') || (name === 'offset')))))));
			case 'Property4':
				var name = prop.a;
				return name === 'viewBox';
			default:
				return false;
		}
	}();
};
var $mdgriffith$elm_style_animation$Animation$Render$isFilter = function (prop) {
	return A2(
		$elm$core$List$member,
		$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop),
		_List_fromArray(
			['filter-url', 'blur', 'brightness', 'contrast', 'grayscale', 'hue-rotate', 'invert', 'saturate', 'sepia', 'drop-shadow']));
};
var $mdgriffith$elm_style_animation$Animation$Render$render3dRotation = function (prop) {
	if (prop.$ === 'Property3') {
		var x = prop.b;
		var y = prop.c;
		var z = prop.d;
		return 'rotateX(' + ($elm$core$String$fromFloat(x.position) + (x.unit + (') rotateY(' + ($elm$core$String$fromFloat(y.position) + (y.unit + (') rotateZ(' + ($elm$core$String$fromFloat(z.position) + (z.unit + ')'))))))));
	} else {
		return '';
	}
};
var $mdgriffith$elm_style_animation$Animation$Render$renderValues = function (_v0) {
	var model = _v0.a;
	var _v1 = A2($elm$core$List$partition, $mdgriffith$elm_style_animation$Animation$Render$isAttr, model.style);
	var attrProps = _v1.a;
	var styleProps = _v1.b;
	var _v2 = A3(
		$elm$core$List$foldl,
		F2(
			function (prop, _v3) {
				var myStyle = _v3.a;
				var myTransforms = _v3.b;
				var myFilters = _v3.c;
				return $mdgriffith$elm_style_animation$Animation$Render$isTransformation(prop) ? _Utils_Tuple3(
					myStyle,
					_Utils_ap(
						myTransforms,
						_List_fromArray(
							[prop])),
					myFilters) : ($mdgriffith$elm_style_animation$Animation$Render$isFilter(prop) ? _Utils_Tuple3(
					myStyle,
					myTransforms,
					_Utils_ap(
						myFilters,
						_List_fromArray(
							[prop]))) : _Utils_Tuple3(
					_Utils_ap(
						myStyle,
						_List_fromArray(
							[prop])),
					myTransforms,
					myFilters));
			}),
		_Utils_Tuple3(_List_Nil, _List_Nil, _List_Nil),
		styleProps);
	var style = _v2.a;
	var transforms = _v2.b;
	var filters = _v2.c;
	var renderedFilters = $elm$core$List$isEmpty(filters) ? _List_Nil : _List_fromArray(
		[
			_Utils_Tuple2(
			'filter',
			A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (prop) {
						var name = $mdgriffith$elm_style_animation$Animation$Model$propertyName(prop);
						return (name === 'filter-url') ? ('url(\"' + (A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ', ') + '\")')) : ($mdgriffith$elm_style_animation$Animation$Model$propertyName(prop) + ('(' + (A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ', ') + ')')));
					},
					filters)))
		]);
	var renderedStyle = A2(
		$elm$core$List$map,
		function (prop) {
			return _Utils_Tuple2(
				$mdgriffith$elm_style_animation$Animation$Model$propertyName(prop),
				A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ' '));
		},
		style);
	var renderedTransforms = $elm$core$List$isEmpty(transforms) ? _List_Nil : _List_fromArray(
		[
			_Utils_Tuple2(
			'transform',
			A2(
				$elm$core$String$join,
				' ',
				A2(
					$elm$core$List$map,
					function (prop) {
						return ($mdgriffith$elm_style_animation$Animation$Model$propertyName(prop) === 'rotate3d') ? $mdgriffith$elm_style_animation$Animation$Render$render3dRotation(prop) : ($mdgriffith$elm_style_animation$Animation$Model$propertyName(prop) + ('(' + (A2($mdgriffith$elm_style_animation$Animation$Render$propertyValue, prop, ', ') + ')')));
					},
					transforms)))
		]);
	return _Utils_Tuple2(
		_Utils_ap(
			renderedTransforms,
			_Utils_ap(renderedFilters, renderedStyle)),
		attrProps);
};
var $mdgriffith$elm_style_animation$Animation$Render$render = function (animation) {
	var _v0 = $mdgriffith$elm_style_animation$Animation$Render$renderValues(animation);
	var style = _v0.a;
	var attrProps = _v0.b;
	var otherAttrs = A2($elm$core$List$filterMap, $mdgriffith$elm_style_animation$Animation$Render$renderAttrs, attrProps);
	var styleAttr = A2(
		$elm$core$List$map,
		function (_v1) {
			var prop = _v1.a;
			var val = _v1.b;
			return A2($elm$html$Html$Attributes$style, prop, val);
		},
		A2($elm$core$List$concatMap, $mdgriffith$elm_style_animation$Animation$Render$prefix, style));
	return _Utils_ap(styleAttr, otherAttrs);
};
var $mdgriffith$elm_style_animation$Animation$render = $mdgriffith$elm_style_animation$Animation$Render$render;
var $author$project$View_finite_level$default_text = function (model) {
	var _v0 = model.gameset.windowsize;
	var window_x = _v0.a;
	var window_y = _v0.b;
	return _Utils_ap(
		$mdgriffith$elm_style_animation$Animation$render(
			A2($author$project$View_finite_level$find_instruction_state, model.instructions, 2)),
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '20%'),
				A2($elm$html$Html$Attributes$style, 'height', '10%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
				A2($elm$html$Html$Attributes$style, 'verticle-align', 'middle'),
				A2(
				$elm$html$Html$Attributes$style,
				'font-size',
				$elm$core$Debug$toString(window_y / 30))
			]));
};
var $author$project$View_finite_level$default_textbox = function (model) {
	return A2(
		$elm$html$Html$div,
		_Utils_ap(
			$mdgriffith$elm_style_animation$Animation$render(
				A2($author$project$View_finite_level$find_instruction_state, model.instructions, 1)),
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'width', '20%'),
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'transform', 'translate(-50%,0)')
				])),
		_List_Nil);
};
var $author$project$View_finite_level$instruction_1_2 = function (model) {
	return _List_fromArray(
		[
			$author$project$View_finite_level$default_textbox(model),
			A2(
			$elm$html$Html$div,
			$author$project$View_finite_level$default_text(model),
			_List_fromArray(
				[
					$elm$html$Html$text('Welcome to the instruction cave, dear Intern. Please look around, your instructions are comming soon. Press [space] to continue.')
				]))
		]);
};
var $author$project$View_finite_level$instruction_1_4 = function (model) {
	var _v0 = A2(
		$elm$core$Maybe$withDefault,
		_Utils_Tuple2(0, 0),
		$elm$core$List$head(
			A2(
				$elm$core$List$sortBy,
				$elm$core$Tuple$second,
				A2(
					$elm$core$List$map,
					function (x) {
						return x.tail;
					},
					model.gameset.light_path))));
	var uppoint_x = _v0.a;
	var uppoint_y = _v0.b;
	var _v1 = A3(
		$author$project$Viewgame$view_transition,
		model.gameset.windowsize,
		model.gameset.uppos,
		_Utils_Tuple2(uppoint_x, uppoint_y - 0.5));
	var viewx = _v1.a;
	var viewy = _v1.b;
	return _List_fromArray(
		[
			$author$project$View_finite_level$default_textbox(model),
			A2(
			$elm$html$Html$div,
			$author$project$View_finite_level$default_text(model),
			_List_fromArray(
				[
					$elm$html$Html$text('Oops, you are stuck on a rock! You need to place a mirror, try clicking at a position.')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'top', '0%'),
					A2($elm$html$Html$Attributes$style, 'left', '0%'),
					A2($elm$html$Html$Attributes$style, 'position', 'fixed')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width('100%'),
							$elm$svg$Svg$Attributes$height('100%'),
							$elm$svg$Svg$Attributes$x('0'),
							$elm$svg$Svg$Attributes$y('0')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$circle,
							_Utils_ap(
								$mdgriffith$elm_style_animation$Animation$render(
									A2($author$project$View_finite_level$find_instruction_state, model.instructions, 3)),
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$cx(
										$elm$core$Debug$toString(viewx)),
										$elm$svg$Svg$Attributes$cy(
										$elm$core$Debug$toString(viewy))
									])),
							_List_Nil)
						])),
					$elm$html$Html$text('cursor test')
				]))
		]);
};
var $author$project$View_finite_level$instruction_1_5 = function (model) {
	return _List_fromArray(
		[
			$author$project$View_finite_level$default_textbox(model),
			A2(
			$elm$html$Html$div,
			$author$project$View_finite_level$default_text(model),
			_List_fromArray(
				[
					$elm$html$Html$text('Press Q to place a mirror.')
				]))
		]);
};
var $author$project$View_finite_level$instruction_1_6 = function (model) {
	return _List_fromArray(
		[
			$author$project$View_finite_level$default_textbox(model),
			A2(
			$elm$html$Html$div,
			$author$project$View_finite_level$default_text(model),
			_List_fromArray(
				[
					$elm$html$Html$text('Good job, now the light is being reflected, try [space] to alter the angle of mirror.')
				]))
		]);
};
var $author$project$View_finite_level$instruction_1_7 = function (model) {
	return _List_fromArray(
		[
			$author$project$View_finite_level$default_textbox(model),
			A2(
			$elm$html$Html$div,
			$author$project$View_finite_level$default_text(model),
			_List_fromArray(
				[
					$elm$html$Html$text('You can also use [w] to set a splitter. The splitter cannot rotate, so be careful.')
				]))
		]);
};
var $author$project$View_finite_level$instruction_1_8 = function (model) {
	return _List_fromArray(
		[
			$author$project$View_finite_level$default_textbox(model),
			A2(
			$elm$html$Html$div,
			$author$project$View_finite_level$default_text(model),
			_List_fromArray(
				[
					$elm$html$Html$text('Great, now try to reach the bottom of this cave.')
				]))
		]);
};
var $author$project$View_finite_level$instruction_2_2 = function (model) {
	return _List_fromArray(
		[
			$author$project$View_finite_level$default_textbox(model),
			A2(
			$elm$html$Html$div,
			$author$project$View_finite_level$default_text(model),
			_List_fromArray(
				[
					$elm$html$Html$text('Let\'s learn about plants in this game. Press [space] to continue.')
				]))
		]);
};
var $author$project$View_finite_level$instruction_2_4 = function (model) {
	return _List_fromArray(
		[
			$author$project$View_finite_level$default_textbox(model),
			A2(
			$elm$html$Html$div,
			$author$project$View_finite_level$default_text(model),
			_List_fromArray(
				[
					$elm$html$Html$text('You may notice that there are plants in the game. Try to light up them and win points. Press [space] to continue.')
				]))
		]);
};
var $author$project$View_finite_level$instruction_2_7 = function (model) {
	return _List_fromArray(
		[
			$author$project$View_finite_level$default_textbox(model),
			A2(
			$elm$html$Html$div,
			$author$project$View_finite_level$default_text(model),
			_List_fromArray(
				[
					$elm$html$Html$text('Good job! Now you can continue and light up as many plants as possible. Press [Enter] to continue.')
				]))
		]);
};
var $author$project$View_finite_level$show_instruction = function (model) {
	var _v0 = _Utils_Tuple2(model.gameset.gamestate, model.progress);
	_v0$9:
	while (true) {
		if ((_v0.b.$ === 'Gaming') && (_v0.b.a.$ === 'Finite')) {
			switch (_v0.b.a.a) {
				case 1:
					switch (_v0.b.a.b) {
						case 2:
							var _v1 = _v0.b.a;
							return $author$project$View_finite_level$instruction_1_2(model);
						case 4:
							if (_v0.a.$ === 'Paused') {
								var _v2 = _v0.a;
								var _v3 = _v0.b.a;
								return $author$project$View_finite_level$instruction_1_4(model);
							} else {
								break _v0$9;
							}
						case 5:
							if (_v0.a.$ === 'Paused') {
								var _v4 = _v0.a;
								var _v5 = _v0.b.a;
								return $author$project$View_finite_level$instruction_1_5(model);
							} else {
								break _v0$9;
							}
						case 6:
							if (_v0.a.$ === 'Paused') {
								var _v6 = _v0.a;
								var _v7 = _v0.b.a;
								return $author$project$View_finite_level$instruction_1_6(model);
							} else {
								break _v0$9;
							}
						case 7:
							if (_v0.a.$ === 'Paused') {
								var _v8 = _v0.a;
								var _v9 = _v0.b.a;
								return $author$project$View_finite_level$instruction_1_7(model);
							} else {
								break _v0$9;
							}
						case 8:
							var _v10 = _v0.b.a;
							return $author$project$View_finite_level$instruction_1_8(model);
						default:
							break _v0$9;
					}
				case 2:
					switch (_v0.b.a.b) {
						case 2:
							var _v11 = _v0.b.a;
							return $author$project$View_finite_level$instruction_2_2(model);
						case 4:
							if (_v0.a.$ === 'Paused') {
								var _v12 = _v0.a;
								var _v13 = _v0.b.a;
								return $author$project$View_finite_level$instruction_2_4(model);
							} else {
								break _v0$9;
							}
						case 7:
							var _v14 = _v0.b.a;
							return $author$project$View_finite_level$instruction_2_7(model);
						default:
							break _v0$9;
					}
				default:
					break _v0$9;
			}
		} else {
			break _v0$9;
		}
	}
	return _List_Nil;
};
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Viewgame$opa = function (n) {
	return (n === 1) ? '1' : '0';
};
var $author$project$Viewgame$view_ghosts = function (model) {
	var set = model.gameset;
	var uppos = set.uppos;
	var p = 5;
	var maptimer = set.maptimer;
	var n = A2($elm$core$Basics$modBy, p, maptimer);
	var ghostlist = _List_fromArray(
		[
			_Utils_Tuple2(5, 5),
			_Utils_Tuple2(4, 4),
			_Utils_Tuple2(3, 3),
			_Utils_Tuple2(1, 2),
			_Utils_Tuple2(5, 8),
			_Utils_Tuple2(8, 9)
		]);
	var _v0 = set.windowsize;
	var window_x = _v0.a;
	var window_y = _v0.b;
	return A2(
		$elm$core$List$map,
		function (a) {
			var _v1 = a;
			var x = _v1.a;
			var y = _v1.b;
			return A2(
				$elm$svg$Svg$image,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width(
						$elm$core$Debug$toString(0.06 * window_x)),
						$elm$svg$Svg$Attributes$height(
						$elm$core$Debug$toString(0.1 * window_y)),
						$elm$svg$Svg$Attributes$x(
						$elm$core$Debug$toString((((y - 1) * 0.06) * window_x) + (0.14 * window_x))),
						$elm$svg$Svg$Attributes$y(
						$elm$core$Debug$toString(((((x - 1) * 0.1) * window_y) - ((uppos * window_y) / 10)) + ((maptimer * 0.1) * window_y))),
						$elm$svg$Svg$Attributes$xlinkHref('./assets/Graphics/ghost.png'),
						$elm$svg$Svg$Attributes$opacity(
						$author$project$Viewgame$opa(n))
					]),
				_List_Nil);
		},
		ghostlist);
};
var $author$project$Viewgame$view_scorebar = function (model) {
	var set = model.gameset;
	var scorelist = $elm$core$List$sum(set.score);
	var score = (scorelist * 10) + (set.maptimer * 5);
	var _v0 = model.gameset.windowsize;
	var window_x = _v0.a;
	var window_y = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'top', '0%'),
				A2($elm$html$Html$Attributes$style, 'left', '0%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'width', '20%'),
						A2($elm$html$Html$Attributes$style, 'height', '20%'),
						A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
						A2($elm$html$Html$Attributes$style, 'left', '0%'),
						A2($elm$html$Html$Attributes$style, 'top', '10%'),
						A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
						A2($elm$html$Html$Attributes$style, 'color', 'rgb(255,225,121)'),
						A2(
						$elm$html$Html$Attributes$style,
						'font-size',
						$elm$core$Debug$toString(window_y / 30) + 'px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Your Score:')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'width', '20%'),
						A2($elm$html$Html$Attributes$style, 'height', '50%'),
						A2($elm$html$Html$Attributes$style, 'top', '20%'),
						A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
						A2($elm$html$Html$Attributes$style, 'left', '0%'),
						A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
						A2($elm$html$Html$Attributes$style, 'color', 'rgb(255,225,121)'),
						A2(
						$elm$html$Html$Attributes$style,
						'font-size',
						$elm$core$Debug$toString(window_y / 20) + 'px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$Debug$toString(score))
					]))
			]));
};
var $author$project$Viewgame$view_game = function (model) {
	var set = model.gameset;
	return _Utils_ap(
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$svg,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$width('100%'),
						$elm$svg$Svg$Attributes$height('100%')
					]),
				_Utils_ap(
					A2(
						$elm$core$List$map,
						A4($author$project$Viewgame$view_brick, set.windowsize, set.maptimer, set.map, set.uppos),
						$author$project$Map$range2d(
							_Utils_Tuple2(12, $author$project$Parameter$right_bound))),
					_Utils_ap(
						$author$project$Viewgame$view_ghosts(model),
						_Utils_ap(
							$author$project$Viewgame$view_objects(model),
							_Utils_ap(
								$author$project$Viewgame$view_lights(model),
								_Utils_ap(
									_List_fromArray(
										[
											$author$project$Viewgame$view_select_pos(model)
										]),
									$author$project$Viewgame$view_border(model)))))))
			]),
		_List_fromArray(
			[
				function () {
				var _v0 = model.progress;
				if ((_v0.$ === 'Gaming') && (_v0.a.$ === 'Endless')) {
					var _v1 = _v0.a;
					return $author$project$Viewgame$view_scorebar(model);
				} else {
					return A2($elm$html$Html$div, _List_Nil, _List_Nil);
				}
			}()
			]));
};
var $author$project$View_finite_level$view_finite_level = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'top', '0')
			]),
		_Utils_ap(
			$author$project$Viewgame$view_game(model),
			_Utils_ap(
				$author$project$View_finite_level$show_instruction(model),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick($author$project$Parameter$Click),
								A2($elm$html$Html$Attributes$style, 'width', '100%'),
								A2($elm$html$Html$Attributes$style, 'height', '100%'),
								A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
								A2($elm$html$Html$Attributes$style, 'left', '0'),
								A2($elm$html$Html$Attributes$style, 'top', '0')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$Debug$toString(model.progress)),
								$elm$html$Html$text(
								$elm$core$Debug$toString(model.gameset.timer)),
								$elm$html$Html$text(
								$elm$core$Debug$toString(
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$List$head(model.gameset.score)))),
								$elm$html$Html$text(
								$elm$core$Debug$toString(
									A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$List$head(
											A2($elm$core$List$drop, 1, model.gameset.score)))))
							])),
						A2(
						$elm$html$Html$audio,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$controls(true),
								$elm$html$Html$Attributes$src('./assets/Sound/gaming_soundtrack.ogg'),
								$elm$html$Html$Attributes$id('audio-sample'),
								$elm$html$Html$Attributes$autoplay(true),
								$elm$html$Html$Attributes$loop(true)
							]),
						_List_Nil),
						A2(
						$elm$html$Html$audio,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$controls(true),
								$elm$html$Html$Attributes$src('./assets/Sound/place_instrument.ogg'),
								$elm$html$Html$Attributes$id('place_instrument'),
								$elm$html$Html$Attributes$autoplay(false)
							]),
						_List_Nil),
						A2(
						$elm$html$Html$audio,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$controls(true),
								$elm$html$Html$Attributes$src('./assets/Sound/light_on_plant.ogg'),
								$elm$html$Html$Attributes$id('light_plant'),
								$elm$html$Html$Attributes$autoplay(false)
							]),
						_List_Nil)
					]))));
};
var $author$project$Parameter$Mouseclick = function (a) {
	return {$: 'Mouseclick', a: a};
};
var $author$project$Parameter$Mouseleave = function (a) {
	return {$: 'Mouseleave', a: a};
};
var $author$project$Parameter$Mouseover = function (a) {
	return {$: 'Mouseover', a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$Animate$find_button = F2(
	function (buttons, b_type) {
		return A2(
			$elm$core$Maybe$withDefault,
			A3(
				$author$project$Parameter$Button,
				$mdgriffith$elm_style_animation$Animation$style(_List_Nil),
				_List_Nil,
				$author$project$Parameter$Reset($author$project$Parameter$Endless)),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (x) {
						return _Utils_eq(x.buttontype, b_type);
					},
					buttons)));
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseleave',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseOver = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseover',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$View_helppage$default_background_text = function (height) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50%'),
			A2($elm$html$Html$Attributes$style, 'height', '12%'),
			A2(
			$elm$html$Html$Attributes$style,
			'top',
			$elm$core$Debug$toString(height) + '%'),
			A2($elm$html$Html$Attributes$style, 'left', '0%'),
			A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
			A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
			A2($elm$html$Html$Attributes$style, 'verticle-align', 'middle'),
			A2($elm$html$Html$Attributes$style, 'font-size', '20px'),
			A2($elm$html$Html$Attributes$style, 'color', 'rgb(255,225,121)')
		]);
};
var $author$project$View_helppage$view_background_msg = _List_fromArray(
	[
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '50%'),
				A2($elm$html$Html$Attributes$style, 'height', '12%'),
				A2($elm$html$Html$Attributes$style, 'top', '12%'),
				A2($elm$html$Html$Attributes$style, 'left', '0%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
				A2($elm$html$Html$Attributes$style, 'verticle-align', 'middle'),
				A2($elm$html$Html$Attributes$style, 'font-size', '30px'),
				A2($elm$html$Html$Attributes$style, 'color', 'rgb(255,225,0)')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Background Story:')
			])),
		A2(
		$elm$html$Html$div,
		$author$project$View_helppage$default_background_text(20),
		_List_fromArray(
			[
				$elm$html$Html$text('In the deepest part of a cave,')
			])),
		A2(
		$elm$html$Html$div,
		$author$project$View_helppage$default_background_text(28),
		_List_fromArray(
			[
				$elm$html$Html$text('grow some valuable rare plants!')
			])),
		A2(
		$elm$html$Html$div,
		$author$project$View_helppage$default_background_text(36),
		_List_fromArray(
			[
				$elm$html$Html$text('Only you can help grow the endangered species.')
			])),
		A2(
		$elm$html$Html$div,
		$author$project$View_helppage$default_background_text(44),
		_List_fromArray(
			[
				$elm$html$Html$text('Manipulate the optical instruments')
			])),
		A2(
		$elm$html$Html$div,
		$author$project$View_helppage$default_background_text(52),
		_List_fromArray(
			[
				$elm$html$Html$text('and cast light on the plants!')
			]))
	]);
var $author$project$View_helppage$default_helppage_text = function (height) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', '50%'),
			A2($elm$html$Html$Attributes$style, 'height', '12%'),
			A2(
			$elm$html$Html$Attributes$style,
			'top',
			$elm$core$Debug$toString(height) + '%'),
			A2($elm$html$Html$Attributes$style, 'left', '50%'),
			A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
			A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
			A2($elm$html$Html$Attributes$style, 'verticle-align', 'middle'),
			A2($elm$html$Html$Attributes$style, 'font-size', '25px'),
			A2($elm$html$Html$Attributes$style, 'color', 'rgb(255,225,121)')
		]);
};
var $author$project$View_helppage$view_help_msg = _List_fromArray(
	[
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '50%'),
				A2($elm$html$Html$Attributes$style, 'height', '12%'),
				A2($elm$html$Html$Attributes$style, 'top', '12%'),
				A2($elm$html$Html$Attributes$style, 'left', '50%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
				A2($elm$html$Html$Attributes$style, 'verticle-align', 'middle'),
				A2($elm$html$Html$Attributes$style, 'font-size', '30px'),
				A2($elm$html$Html$Attributes$style, 'color', 'rgb(255,225,0)')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Game Control:')
			])),
		A2(
		$elm$html$Html$div,
		$author$project$View_helppage$default_helppage_text(20),
		_List_fromArray(
			[
				$elm$html$Html$text('Learning By Playing! Check the Manoeuvre.')
			])),
		A2(
		$elm$html$Html$div,
		$author$project$View_helppage$default_helppage_text(30),
		_List_fromArray(
			[
				$elm$html$Html$text('Click to select a position')
			])),
		A2(
		$elm$html$Html$div,
		$author$project$View_helppage$default_helppage_text(40),
		_List_fromArray(
			[
				$elm$html$Html$text('[q] to set a mirror, [w] for splitter')
			])),
		A2(
		$elm$html$Html$div,
		$author$project$View_helppage$default_helppage_text(50),
		_List_fromArray(
			[
				$elm$html$Html$text('[space] to rotate a mirror')
			])),
		A2(
		$elm$html$Html$div,
		$author$project$View_helppage$default_helppage_text(60),
		_List_fromArray(
			[
				$elm$html$Html$text('[↑] [↓] to control the volume')
			]))
	]);
var $author$project$View_helppage$view_textbox = _List_fromArray(
	[
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '40%'),
				A2($elm$html$Html$Attributes$style, 'height', '62%'),
				A2($elm$html$Html$Attributes$style, 'top', '10%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'left', '5%'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'black'),
				A2($elm$html$Html$Attributes$style, 'opacity', '0.4')
			]),
		_List_Nil),
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '40%'),
				A2($elm$html$Html$Attributes$style, 'height', '62%'),
				A2($elm$html$Html$Attributes$style, 'top', '10%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'left', '55%'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'black'),
				A2($elm$html$Html$Attributes$style, 'opacity', '0.4')
			]),
		_List_Nil)
	]);
var $author$project$View_helppage$view_helppage = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'black')
			]),
		_Utils_ap(
			$author$project$Viewgame$view_game(model),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_Utils_ap(
							$mdgriffith$elm_style_animation$Animation$render(
								A2($author$project$Animate$find_button, model.button, $author$project$Parameter$ReturnMenu).anistate),
							_List_fromArray(
								[
									$elm$html$Html$Events$onMouseOver(
									$author$project$Parameter$Mouseover($author$project$Parameter$ReturnMenu)),
									$elm$html$Html$Events$onMouseLeave(
									$author$project$Parameter$Mouseleave($author$project$Parameter$ReturnMenu)),
									$elm$html$Html$Events$onClick(
									$author$project$Parameter$Mouseclick($author$project$Parameter$ReturnMenu)),
									A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
									A2($elm$html$Html$Attributes$style, 'width', '16%'),
									A2($elm$html$Html$Attributes$style, 'height', '12%'),
									A2($elm$html$Html$Attributes$style, 'top', '75%'),
									A2($elm$html$Html$Attributes$style, 'left', '42%'),
									A2($elm$html$Html$Attributes$style, 'font-size', '15px')
								])),
						_List_fromArray(
							[
								$elm$html$Html$text('Back')
							]))
					]),
				_Utils_ap(
					$author$project$View_helppage$view_help_msg,
					_Utils_ap($author$project$View_helppage$view_background_msg, $author$project$View_helppage$view_textbox)))));
};
var $author$project$Parameter$Start = function (a) {
	return {$: 'Start', a: a};
};
var $author$project$Viewmenu$default_button_attr = function (top) {
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
			A2($elm$html$Html$Attributes$style, 'width', '16%'),
			A2($elm$html$Html$Attributes$style, 'height', '12%'),
			A2(
			$elm$html$Html$Attributes$style,
			'top',
			$elm$core$Debug$toString(top) + '%'),
			A2($elm$html$Html$Attributes$style, 'left', '42%'),
			A2($elm$html$Html$Attributes$style, 'font-size', '25px')
		]);
};
var $author$project$Viewmenu$default_button = F5(
	function (model, button_type, top, text1, text2) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_Utils_ap(
					$mdgriffith$elm_style_animation$Animation$render(
						A2($author$project$Animate$find_button, model.button, button_type).anistate),
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Events$onMouseOver(
								$author$project$Parameter$Mouseover(button_type)),
								$elm$html$Html$Events$onMouseLeave(
								$author$project$Parameter$Mouseleave(button_type)),
								$elm$html$Html$Events$onClick(
								function () {
									switch (button_type.$) {
										case 'Help':
											return $author$project$Parameter$Mouseclick(button_type);
										case 'StartGame':
											var a = button_type.a;
											return $author$project$Parameter$Start(a);
										default:
											return $author$project$Parameter$None;
									}
								}())
							]),
						$author$project$Viewmenu$default_button_attr(top))),
				_List_fromArray(
					[
						$elm$html$Html$text(text1)
					])),
				A2(
				$elm$html$Html$button,
				_Utils_ap(
					$mdgriffith$elm_style_animation$Animation$render(
						A2(
							$author$project$Animate$find_page,
							A2($author$project$Animate$find_button, model.button, button_type).helppage,
							1)),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'height', '12%'),
							A2(
							$elm$html$Html$Attributes$style,
							'top',
							$elm$core$Debug$toString(top) + '%'),
							A2($elm$html$Html$Attributes$style, 'left', '58%')
						])),
				_List_fromArray(
					[
						$elm$html$Html$text(text2)
					]))
			]);
	});
var $author$project$Viewmenu$view_menu = function (model) {
	var _v0 = model.gameset.windowsize;
	var window_x = _v0.a;
	var window_y = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'black')
			]),
		_Utils_ap(
			$author$project$Viewgame$view_game(model),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'height', '100%'),
							A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
							A2($elm$html$Html$Attributes$style, 'left', '0'),
							A2($elm$html$Html$Attributes$style, 'top', '0')
						]),
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$svg$Svg$svg,
								_List_fromArray(
									[
										$elm$svg$Svg$Attributes$width('100%'),
										$elm$svg$Svg$Attributes$height('100%'),
										$elm$svg$Svg$Attributes$x('0'),
										$elm$svg$Svg$Attributes$y('0')
									]),
								_List_fromArray(
									[
										A2(
										$elm$svg$Svg$image,
										_List_fromArray(
											[
												$elm$svg$Svg$Attributes$width('76.5%'),
												$elm$svg$Svg$Attributes$height('45%'),
												$elm$svg$Svg$Attributes$x('11%'),
												$elm$svg$Svg$Attributes$y('8%'),
												$elm$svg$Svg$Attributes$xlinkHref('./assets/Graphics/gametitle.png')
											]),
										_List_Nil)
									]))
							]),
						_Utils_ap(
							A5(
								$author$project$Viewmenu$default_button,
								model,
								$author$project$Parameter$StartGame(
									A2($author$project$Parameter$Finite, 0, 0)),
								45,
								'Manoeuvre!',
								'Learn In Simulate Scene!'),
							_Utils_ap(
								A5(
									$author$project$Viewmenu$default_button,
									model,
									$author$project$Parameter$StartGame($author$project$Parameter$Endless),
									60,
									'Endless!',
									'Explore the real world!!'),
								A5($author$project$Viewmenu$default_button, model, $author$project$Parameter$Help, 75, 'Help', 'help page')))))
				])));
};
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$img = _VirtualDom_node('img');
var $author$project$Viewmenu$view_open_animation = function (model) {
	var _v0 = model.gameset.windowsize;
	var x = _v0.a;
	var y = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'black')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_Utils_ap(
					$mdgriffith$elm_style_animation$Animation$render(model.animatecurtain),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'height', '100%'),
							A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
							A2($elm$html$Html$Attributes$style, 'left', '0'),
							A2($elm$html$Html$Attributes$style, 'top', '0')
						])),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'height', '100%'),
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2(
								$elm$html$Html$Attributes$style,
								'left',
								$elm$core$Debug$toString(
									$elm$core$Basics$round(x / 2)) + 'px'),
								A2($elm$html$Html$Attributes$style, 'top', '0px'),
								A2($elm$html$Html$Attributes$style, 'transform', 'translate(-50%,0)'),
								$elm$html$Html$Attributes$src('./assets/Graphics/Grouplogoname.png'),
								$elm$html$Html$Attributes$class('pic')
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$Viewgame$view_playing = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'top', '0')
			]),
		_Utils_ap(
			$author$project$Viewgame$view_game(model),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$mpizenberg$elm_pointer_events$Html$Events$Extra$Mouse$onClick($author$project$Parameter$Click),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'height', '100%'),
							A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
							A2($elm$html$Html$Attributes$style, 'left', '0'),
							A2($elm$html$Html$Attributes$style, 'top', '0')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$audio,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$controls(true),
							$elm$html$Html$Attributes$src('./assets/Sound/gaming_soundtrack.ogg'),
							$elm$html$Html$Attributes$id('audio-sample'),
							$elm$html$Html$Attributes$autoplay(true),
							$elm$html$Html$Attributes$loop(true)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$audio,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$controls(true),
							$elm$html$Html$Attributes$src('./assets/Sound/place_instrument.ogg'),
							$elm$html$Html$Attributes$id('place_instrument'),
							$elm$html$Html$Attributes$autoplay(false)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$audio,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$controls(true),
							$elm$html$Html$Attributes$src('./assets/Sound/light_on_plant.ogg'),
							$elm$html$Html$Attributes$id('light_plant'),
							$elm$html$Html$Attributes$autoplay(false)
						]),
					_List_Nil)
				])));
};
var $author$project$Viewscore$view_button = F2(
	function (progress, board) {
		var nlevel = function () {
			if (progress.$ === 'ShowScoreBoard') {
				var level = progress.a;
				return level;
			} else {
				return A2($author$project$Parameter$Finite, 0, 0);
			}
		}();
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_Utils_ap(
					$mdgriffith$elm_style_animation$Animation$render(board.reset_button),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'font-size', '25px'),
							A2($elm$html$Html$Attributes$style, 'width', '40%'),
							$elm$html$Html$Events$onMouseOver(
							$author$project$Parameter$Mouseover(
								$author$project$Parameter$Reset(nlevel))),
							$elm$html$Html$Events$onMouseLeave(
							$author$project$Parameter$Mouseleave(
								$author$project$Parameter$Reset(nlevel))),
							$elm$html$Html$Events$onClick(
							$author$project$Parameter$Mouseclick(
								$author$project$Parameter$Reset(nlevel)))
						])),
				_List_fromArray(
					[
						function () {
						if (nlevel.$ === 'Endless') {
							return $elm$html$Html$text('★ Reset ★');
						} else {
							return $elm$html$Html$text('★ Back ★');
						}
					}()
					])),
				A2(
				$elm$html$Html$button,
				_Utils_ap(
					$mdgriffith$elm_style_animation$Animation$render(board.menu_button),
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'font-size', '25px'),
							A2($elm$html$Html$Attributes$style, 'width', '40%'),
							$elm$html$Html$Events$onMouseOver(
							$author$project$Parameter$Mouseover($author$project$Parameter$ReturnMenu)),
							$elm$html$Html$Events$onMouseLeave(
							$author$project$Parameter$Mouseleave($author$project$Parameter$ReturnMenu)),
							$elm$html$Html$Events$onClick(
							$author$project$Parameter$Mouseclick($author$project$Parameter$ReturnMenu))
						])),
				_List_fromArray(
					[
						$elm$html$Html$text('★ Menu ★')
					]))
			]);
	});
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Viewscore$view_flower = function (scores) {
	var type3 = $elm$core$List$length(
		A2(
			$elm$core$List$filter,
			function (x) {
				return x === 3;
			},
			scores));
	var type2 = $elm$core$List$length(
		A2(
			$elm$core$List$filter,
			function (x) {
				return x === 2;
			},
			scores));
	var type1 = $elm$core$List$length(
		A2(
			$elm$core$List$filter,
			function (x) {
				return x === 1;
			},
			scores));
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$width('100%'),
				$elm$svg$Svg$Attributes$height('100%'),
				$elm$svg$Svg$Attributes$x('0px'),
				$elm$svg$Svg$Attributes$y('0px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$image,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$height('10%'),
						$elm$svg$Svg$Attributes$width('40%'),
						$elm$svg$Svg$Attributes$x('0%'),
						$elm$svg$Svg$Attributes$y('20%'),
						$elm$svg$Svg$Attributes$xlinkHref('./assets/Graphics/p1_2.png')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$height('10%'),
						$elm$svg$Svg$Attributes$width('50%'),
						$elm$svg$Svg$Attributes$x('30%'),
						$elm$svg$Svg$Attributes$y('26%'),
						$elm$svg$Svg$Attributes$fill('white'),
						$elm$svg$Svg$Attributes$fontSize('35px'),
						$elm$svg$Svg$Attributes$opacity('0.5'),
						$elm$svg$Svg$Attributes$stroke('black')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(
						'x ' + $elm$core$Debug$toString(type1))
					])),
				A2(
				$elm$svg$Svg$image,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$height('10%'),
						$elm$svg$Svg$Attributes$width('40%'),
						$elm$svg$Svg$Attributes$x('0%'),
						$elm$svg$Svg$Attributes$y('30%'),
						$elm$svg$Svg$Attributes$xlinkHref('./assets/Graphics/p2_2.png')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$height('10%'),
						$elm$svg$Svg$Attributes$width('50%'),
						$elm$svg$Svg$Attributes$x('30%'),
						$elm$svg$Svg$Attributes$y('38%'),
						$elm$svg$Svg$Attributes$fill('white'),
						$elm$svg$Svg$Attributes$fontSize('35px'),
						$elm$svg$Svg$Attributes$opacity('0.5'),
						$elm$svg$Svg$Attributes$stroke('black')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(
						'x ' + $elm$core$Debug$toString(type2))
					])),
				A2(
				$elm$svg$Svg$image,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$height('10%'),
						$elm$svg$Svg$Attributes$width('40%'),
						$elm$svg$Svg$Attributes$x('0%'),
						$elm$svg$Svg$Attributes$y('42%'),
						$elm$svg$Svg$Attributes$xlinkHref('./assets/Graphics/p3_2.png')
					]),
				_List_Nil),
				A2(
				$elm$svg$Svg$text_,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$height('10%'),
						$elm$svg$Svg$Attributes$width('50%'),
						$elm$svg$Svg$Attributes$x('30%'),
						$elm$svg$Svg$Attributes$y('50%'),
						$elm$svg$Svg$Attributes$fill('white'),
						$elm$svg$Svg$Attributes$fontSize('35px'),
						$elm$svg$Svg$Attributes$opacity('0.5'),
						$elm$svg$Svg$Attributes$stroke('black')
					]),
				_List_fromArray(
					[
						$elm$svg$Svg$text(
						'x ' + $elm$core$Debug$toString(type3))
					]))
			]));
};
var $author$project$Viewscore$view_highscore = F3(
	function (scores, total, rank) {
		if (!scores.b) {
			return _List_Nil;
		} else {
			var x = scores.a;
			var xs = scores.b;
			var no = A2($elm$core$Basics$min, total, 3) - $elm$core$List$length(xs);
			var name = _Utils_eq(no, rank + 1) ? '     Me     ' : 'Other Player';
			var canvas = A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'width', '100%'),
						A2(
						$elm$html$Html$Attributes$style,
						'top',
						$elm$core$Debug$toString(55 + (no * 10)) + '%'),
						A2($elm$html$Html$Attributes$style, 'height', '20%'),
						A2($elm$html$Html$Attributes$style, 'font-size', '20px'),
						A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
						A2($elm$html$Html$Attributes$style, 'color', 'yellow')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'NO.' + ($elm$core$Debug$toString(no) + ('  ' + (name + ('  ' + $elm$core$Debug$toString(x))))))
					]));
			return _Utils_ap(
				_List_fromArray(
					[canvas]),
				A3($author$project$Viewscore$view_highscore, xs, total, rank));
		}
	});
var $author$project$Viewscore$view_mainboard = F3(
	function (scores, rank, progress) {
		return _Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'top', '0'),
							A2($elm$html$Html$Attributes$style, 'height', '25%'),
							A2($elm$html$Html$Attributes$style, 'font-size', '60px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
							A2($elm$html$Html$Attributes$style, 'font-family', 'Palace Script MT')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Score Board')
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'top', '23%'),
							A2($elm$html$Html$Attributes$style, 'height', '200px'),
							A2($elm$html$Html$Attributes$style, 'left', '18%'),
							A2($elm$html$Html$Attributes$style, 'font-size', '25px'),
							A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
							A2($elm$html$Html$Attributes$style, 'color', 'white')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('★ Your Score: ★')
						]))
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
								A2($elm$html$Html$Attributes$style, 'width', '100%'),
								A2($elm$html$Html$Attributes$style, 'top', '50%'),
								A2($elm$html$Html$Attributes$style, 'height', '40%'),
								A2($elm$html$Html$Attributes$style, 'font-size', '30px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', 'bolder'),
								A2($elm$html$Html$Attributes$style, 'color', 'white')
							]),
						function () {
							if ((progress.$ === 'ShowScoreBoard') && (progress.a.$ === 'Endless')) {
								var _v1 = progress.a;
								return _List_fromArray(
									[
										$elm$html$Html$text('★ High Score: ★')
									]);
							} else {
								return _List_fromArray(
									[
										$elm$html$Html$text('Teaching Level')
									]);
							}
						}())
					]),
				function () {
					if ((progress.$ === 'ShowScoreBoard') && (progress.a.$ === 'Endless')) {
						var _v3 = progress.a;
						return A3(
							$author$project$Viewscore$view_highscore,
							A2($elm$core$List$take, 3, scores),
							$elm$core$List$length(scores),
							rank);
					} else {
						return _List_Nil;
					}
				}()));
	});
var $author$project$Viewscore$view_new_record = function (board) {
	return A2(
		$elm$html$Html$button,
		_Utils_ap(
			$mdgriffith$elm_style_animation$Animation$render(board.newrecord),
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'width', '150px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '20px'),
					A2($elm$html$Html$Attributes$style, 'background-opacity', '0.0')
				])),
		_List_fromArray(
			[
				$elm$html$Html$text('New Record!')
			]));
};
var $author$project$Viewscore$view_score = function (board) {
	return A2(
		$elm$html$Html$button,
		_Utils_ap(
			$mdgriffith$elm_style_animation$Animation$render(board.score.a),
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'width', '30%'),
					A2($elm$html$Html$Attributes$style, 'left', '55%'),
					A2($elm$html$Html$Attributes$style, 'font-size', '30px'),
					A2($elm$html$Html$Attributes$style, 'background-opacity', '0.0'),
					A2($elm$html$Html$Attributes$style, 'while_space', 'pre-lines')
				])),
		_List_fromArray(
			[
				$elm$html$Html$text(
				$elm$core$Debug$toString(board.score.b))
			]));
};
var $author$project$Viewscore$view_score_board = function (model) {
	var scorelist = $elm$core$List$sum(model.gameset.score);
	var progress = model.progress;
	var currentscore = (scorelist * 10) + (model.gameset.maptimer * 5);
	var rank = $elm$core$List$length(
		A2(
			$elm$core$List$partition,
			function (x) {
				return _Utils_cmp(x, currentscore) > 0;
			},
			model.highscore).a);
	var board = model.scoreboard;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'top', '0')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'width', '100%'),
						A2($elm$html$Html$Attributes$style, 'height', '100%'),
						A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
						A2($elm$html$Html$Attributes$style, 'left', '0'),
						A2($elm$html$Html$Attributes$style, 'top', '0'),
						A2($elm$html$Html$Attributes$style, 'opacity', '0.5')
					]),
				$author$project$Viewgame$view_game(model)),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'width', '100%'),
						A2($elm$html$Html$Attributes$style, 'height', '100%'),
						A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
						A2($elm$html$Html$Attributes$style, 'left', '30%'),
						A2($elm$html$Html$Attributes$style, 'top', '0'),
						A2($elm$html$Html$Attributes$style, 'width', '40%')
					]),
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_Utils_ap(
								$mdgriffith$elm_style_animation$Animation$render(board.board),
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'top', '0')
									])),
							_Utils_ap(
								A3($author$project$Viewscore$view_mainboard, model.highscore, rank, progress),
								_List_fromArray(
									[
										$author$project$Viewscore$view_flower(model.gameset.score)
									]))),
							$author$project$Viewscore$view_score(board)
						]),
					_Utils_ap(
						((!rank) && _Utils_eq(
							progress,
							$author$project$Parameter$ShowScoreBoard($author$project$Parameter$Endless))) ? _List_fromArray(
							[
								$author$project$Viewscore$view_new_record(board)
							]) : _List_Nil,
						A2($author$project$Viewscore$view_button, progress, board))))
			]));
};
var $author$project$View_finite_level$view_lv1_button = function (model) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$button,
			_Utils_ap(
				$mdgriffith$elm_style_animation$Animation$render(
					A2(
						$author$project$Animate$find_button,
						model.button,
						$author$project$Parameter$StartGame(
							A2($author$project$Parameter$Finite, 1, 0))).anistate),
				_List_fromArray(
					[
						$elm$html$Html$Events$onMouseOver(
						$author$project$Parameter$Mouseover(
							$author$project$Parameter$StartGame(
								A2($author$project$Parameter$Finite, 1, 0)))),
						$elm$html$Html$Events$onMouseLeave(
						$author$project$Parameter$Mouseleave(
							$author$project$Parameter$StartGame(
								A2($author$project$Parameter$Finite, 1, 0)))),
						$elm$html$Html$Events$onClick(
						$author$project$Parameter$Start(
							A2($author$project$Parameter$Finite, 1, 0))),
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'width', '16%'),
						A2($elm$html$Html$Attributes$style, 'height', '12%'),
						A2($elm$html$Html$Attributes$style, 'top', '40%'),
						A2($elm$html$Html$Attributes$style, 'left', '42%'),
						A2($elm$html$Html$Attributes$style, 'font-size', '25px')
					])),
			_List_fromArray(
				[
					$elm$html$Html$text('Level 1')
				])),
			A2(
			$elm$html$Html$button,
			_Utils_ap(
				$mdgriffith$elm_style_animation$Animation$render(
					A2(
						$author$project$Animate$find_page,
						A2(
							$author$project$Animate$find_button,
							model.button,
							$author$project$Parameter$StartGame(
								A2($author$project$Parameter$Finite, 1, 0))).helppage,
						1)),
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'height', '12%'),
						A2($elm$html$Html$Attributes$style, 'top', '40%'),
						A2($elm$html$Html$Attributes$style, 'left', '58%')
					])),
			_List_fromArray(
				[
					$elm$html$Html$text('Learn to use Mirror and Splitter')
				]))
		]);
};
var $author$project$View_finite_level$view_lv2_button = function (model) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$button,
			_Utils_ap(
				$mdgriffith$elm_style_animation$Animation$render(
					A2(
						$author$project$Animate$find_button,
						model.button,
						$author$project$Parameter$StartGame(
							A2($author$project$Parameter$Finite, 2, 0))).anistate),
				_List_fromArray(
					[
						$elm$html$Html$Events$onMouseOver(
						$author$project$Parameter$Mouseover(
							$author$project$Parameter$StartGame(
								A2($author$project$Parameter$Finite, 2, 0)))),
						$elm$html$Html$Events$onMouseLeave(
						$author$project$Parameter$Mouseleave(
							$author$project$Parameter$StartGame(
								A2($author$project$Parameter$Finite, 2, 0)))),
						$elm$html$Html$Events$onClick(
						$author$project$Parameter$Start(
							A2($author$project$Parameter$Finite, 2, 0))),
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'width', '16%'),
						A2($elm$html$Html$Attributes$style, 'height', '12%'),
						A2($elm$html$Html$Attributes$style, 'top', '55%'),
						A2($elm$html$Html$Attributes$style, 'left', '42%'),
						A2($elm$html$Html$Attributes$style, 'font-size', '25px')
					])),
			_List_fromArray(
				[
					$elm$html$Html$text('Level 2')
				])),
			A2(
			$elm$html$Html$button,
			_Utils_ap(
				$mdgriffith$elm_style_animation$Animation$render(
					A2(
						$author$project$Animate$find_page,
						A2(
							$author$project$Animate$find_button,
							model.button,
							$author$project$Parameter$StartGame(
								A2($author$project$Parameter$Finite, 2, 0))).helppage,
						1)),
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2($elm$html$Html$Attributes$style, 'height', '12%'),
						A2($elm$html$Html$Attributes$style, 'left', '58%'),
						A2($elm$html$Html$Attributes$style, 'top', '55%')
					])),
			_List_fromArray(
				[
					$elm$html$Html$text('Learn to identify the plants')
				]))
		]);
};
var $author$project$View_finite_level$view_select_finite = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'black')
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$width('100%'),
							$elm$svg$Svg$Attributes$height('100%'),
							$elm$svg$Svg$Attributes$x('0'),
							$elm$svg$Svg$Attributes$y('0')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$image,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$width('100%'),
									$elm$svg$Svg$Attributes$height('100%'),
									$elm$svg$Svg$Attributes$x('0'),
									$elm$svg$Svg$Attributes$y('0'),
									$elm$svg$Svg$Attributes$xlinkHref('./assets/Graphics/background.png')
								]),
							_List_Nil),
							A2(
							$elm$svg$Svg$text_,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('haha')
								]))
						]))
				]),
			_Utils_ap(
				$author$project$View_finite_level$view_lv1_button(model),
				_Utils_ap(
					$author$project$View_finite_level$view_lv2_button(model),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_Utils_ap(
								$mdgriffith$elm_style_animation$Animation$render(
									A2($author$project$Animate$find_button, model.button, $author$project$Parameter$ReturnMenu).anistate),
								_List_fromArray(
									[
										$elm$html$Html$Events$onMouseOver(
										$author$project$Parameter$Mouseover($author$project$Parameter$ReturnMenu)),
										$elm$html$Html$Events$onMouseLeave(
										$author$project$Parameter$Mouseleave($author$project$Parameter$ReturnMenu)),
										$elm$html$Html$Events$onClick(
										$author$project$Parameter$Mouseclick($author$project$Parameter$ReturnMenu)),
										A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
										A2($elm$html$Html$Attributes$style, 'width', '16%'),
										A2($elm$html$Html$Attributes$style, 'height', '12%'),
										A2($elm$html$Html$Attributes$style, 'top', '75%'),
										A2($elm$html$Html$Attributes$style, 'left', '42%'),
										A2($elm$html$Html$Attributes$style, 'font-size', '25px')
									])),
							_List_fromArray(
								[
									$elm$html$Html$text('Back')
								]))
						])))));
};
var $author$project$View$view = function (model) {
	var _v0 = model.progress;
	switch (_v0.$) {
		case 'Gaming':
			if (_v0.a.$ === 'Endless') {
				var _v1 = _v0.a;
				return $author$project$Viewgame$view_playing(model);
			} else {
				if (!_v0.a.a) {
					var _v2 = _v0.a;
					return $author$project$View_finite_level$view_select_finite(model);
				} else {
					var _v3 = _v0.a;
					return $author$project$View_finite_level$view_finite_level(model);
				}
			}
		case 'Openanimation':
			return $author$project$Viewmenu$view_open_animation(model);
		case 'Menu':
			return $author$project$Viewmenu$view_menu(model);
		case 'Helppage':
			return $author$project$View_helppage$view_helppage(model);
		case 'Fadeout':
			return $author$project$Viewgame$view_fade_out(model);
		default:
			return $author$project$Viewscore$view_score_board(model);
	}
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Update$update, view: $author$project$View$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));