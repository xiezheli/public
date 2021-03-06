module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1561368116980, function(require, module, exports) {
// Requiring modules

module.exports = function (attach) {
  var methods = require('./methods');

  if (attach) {
    require('./native')(methods);
  }

  return methods
};

}, function(modId) {var map = {"./methods":1561368116981,"./native":1561368116985}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1561368116981, function(require, module, exports) {
// The Inflector transforms words from singular to plural, class names to table names, modularized class names to ones without,
// and class names to foreign keys. The default inflections for pluralization, singularization, and uncountable words are kept
// in inflections.coffee
//
// If you discover an incorrect inflection and require it for your application, you'll need
// to correct it yourself (explained below).

var util = require('./util');

var inflect = module.exports;

// Import [inflections](inflections.html) instance
inflect.inflections = require('./inflections')

// Gives easy access to add inflections to this class
inflect.inflect = function (fn) {
  fn(inflect.inflections);
};

// By default, _camelize_ converts strings to UpperCamelCase. If the argument to _camelize_
// is set to _false_ then _camelize_ produces lowerCamelCase.
//
// _camelize_ will also convert '/' to '.' which is useful for converting paths to namespaces.
//
//     "bullet_record".camelize()             // => "BulletRecord"
//     "bullet_record".camelize(false)        // => "bulletRecord"
//     "bullet_record/errors".camelize()      // => "BulletRecord.Errors"
//     "bullet_record/errors".camelize(false) // => "bulletRecord.Errors"
//
// As a rule of thumb you can think of _camelize_ as the inverse of _underscore_,
// though there are cases where that does not hold:
//
//     "SSLError".underscore.camelize // => "SslError"
inflect.camelize = function(lower_case_and_underscored_word, first_letter_in_uppercase) {
  var result;
  if (first_letter_in_uppercase == null) first_letter_in_uppercase = true;
  result = util.string.gsub(lower_case_and_underscored_word, /\/(.?)/, function($) {
    return "." + (util.string.upcase($[1]));
  });
  result = util.string.gsub(result, /(?:_)(.)/, function($) {
    return util.string.upcase($[1]);
  });
  if (first_letter_in_uppercase) {
    return util.string.upcase(result);
  } else {
    return util.string.downcase(result);
  }
};

// Makes an underscored, lowercase form from the expression in the string.
//
// Changes '.' to '/' to convert namespaces to paths.
//
//     "BulletRecord".underscore()         // => "bullet_record"
//     "BulletRecord.Errors".underscore()  // => "bullet_record/errors"
//
// As a rule of thumb you can think of +underscore+ as the inverse of +camelize+,
// though there are cases where that does not hold:
//
//     "SSLError".underscore().camelize() // => "SslError"
inflect.underscore = function (camel_cased_word) {
  var self;
  self = util.string.gsub(camel_cased_word, /\./, '/');
  self = util.string.gsub(self, /([A-Z]+)([A-Z][a-z])/, "$1_$2");
  self = util.string.gsub(self, /([a-z\d])([A-Z])/, "$1_$2");
  self = util.string.gsub(self, /-/, '_');
  return self.toLowerCase();
};

// Replaces underscores with dashes in the string.
//
//     "puni_puni".dasherize()   // => "puni-puni"
inflect.dasherize = function (underscored_word) {
  return util.string.gsub(underscored_word, /_/, '-');
};

// Removes the module part from the expression in the string.
//
//     "BulletRecord.String.Inflections".demodulize() // => "Inflections"
//     "Inflections".demodulize()                     // => "Inflections"
inflect.demodulize = function (class_name_in_module) {
  return util.string.gsub(class_name_in_module, /^.*\./, '');
};

// Creates a foreign key name from a class name.
// _separate_class_name_and_id_with_underscore_ sets whether
// the method should put '_' between the name and 'id'.
//
//     "Message".foreign_key()      // => "message_id"
//     "Message".foreign_key(false) // => "messageid"
//     "Admin::Post".foreign_key()  // => "post_id"
inflect.foreign_key = function (class_name, separate_class_name_and_id_with_underscore) {
  if (separate_class_name_and_id_with_underscore == null) {
    separate_class_name_and_id_with_underscore = true;
  }
  return inflect.underscore(inflect.demodulize(class_name)) + (separate_class_name_and_id_with_underscore ? "_id" : "id");
};

// Turns a number into an ordinal string used to denote the position in an
// ordered sequence such as 1st, 2nd, 3rd, 4th.
//
//     ordinalize(1)     // => "1st"
//     ordinalize(2)     // => "2nd"
//     ordinalize(1002)  // => "1002nd"
//     ordinalize(1003)  // => "1003rd"
//     ordinalize(-11)   // => "-11th"
//     ordinalize(-1021) // => "-1021st"
inflect.ordinalize = function (number) {
  var _ref;
  number = parseInt(number);
  if ((_ref = Math.abs(number) % 100) === 11 || _ref === 12 || _ref === 13) {
    return "" + number + "th";
  } else {
    switch (Math.abs(number) % 10) {
      case 1:
        return "" + number + "st";
      case 2:
        return "" + number + "nd";
      case 3:
        return "" + number + "rd";
      default:
        return "" + number + "th";
    }
  }
};

// Checks a given word for uncountability
//
//     "money".uncountability()     // => true
//     "my money".uncountability()  // => true
inflect.uncountability = function (word) {
  return inflect.inflections.uncountables.some(function(ele, ind, arr) {
    return word.match(new RegExp("(\\b|_)" + ele + "$", 'i')) != null;
  });
};

// Returns the plural form of the word in the string.
//
//     "post".pluralize()             // => "posts"
//     "octopus".pluralize()          // => "octopi"
//     "sheep".pluralize()            // => "sheep"
//     "words".pluralize()            // => "words"
//     "CamelOctopus".pluralize()     // => "CamelOctopi"
inflect.pluralize = function (word) {
  var plural, result;
  result = word;
  if (word === '' || inflect.uncountability(word)) {
    return result;
  } else {
    for (var i = 0; i < inflect.inflections.plurals.length; i++) {
      plural = inflect.inflections.plurals[i];
      result = util.string.gsub(result, plural[0], plural[1]);
      if (word.match(plural[0]) != null) break;
    }
    return result;
  }
};

// The reverse of _pluralize_, returns the singular form of a word in a string.
//
//     "posts".singularize()            // => "post"
//     "octopi".singularize()           // => "octopus"
//     "sheep".singularize()            // => "sheep"
//     "word".singularize()             // => "word"
//     "CamelOctopi".singularize()      // => "CamelOctopus"
inflect.singularize = function (word) {
  var result, singular;
  result = word;
  if (word === '' || inflect.uncountability(word)) {
    return result;
  } else {
    for (var i = 0; i < inflect.inflections.singulars.length; i++) {
      singular = inflect.inflections.singulars[i];
      result = util.string.gsub(result, singular[0], singular[1]);
      if (word.match(singular[0])) break;
    }
    return result;
  }
};

// Capitalizes the first word and turns underscores into spaces and strips a
// trailing "_id", if any. Like _titleize_, this is meant for creating pretty output.
//
//     "employee_salary".humanize()   // => "Employee salary"
//     "author_id".humanize()         // => "Author"
inflect.humanize = function (lower_case_and_underscored_word) {
  var human, result;
  result = lower_case_and_underscored_word;
  for (var i = 0; i < inflect.inflections.humans.length; i++) {
    human = inflect.inflections.humans[i];
    result = util.string.gsub(result, human[0], human[1]);
  }
  result = util.string.gsub(result, /_id$/, "");
  result = util.string.gsub(result, /_/, " ");
  return util.string.capitalize(result, true);
};

// Capitalizes all the words and replaces some characters in the string to create
// a nicer looking title. _titleize_ is meant for creating pretty output. It is not
// used in the Bullet internals.
//
//
//     "man from the boondocks".titleize()   // => "Man From The Boondocks"
//     "x-men: the last stand".titleize()    // => "X Men: The Last Stand"
inflect.titleize = function (word) {
  var self;
  self = inflect.humanize(inflect.underscore(word));
  return util.string.capitalize(self);
};

// Create the name of a table like Bullet does for models to table names. This method
// uses the _pluralize_ method on the last word in the string.
//
//     "RawScaledScorer".tableize()   // => "raw_scaled_scorers"
//     "egg_and_ham".tableize()       // => "egg_and_hams"
//     "fancyCategory".tableize()     // => "fancy_categories"
inflect.tableize = function (class_name) {
  return inflect.pluralize(inflect.underscore(class_name));
};

// Create a class name from a plural table name like Bullet does for table names to models.
// Note that this returns a string and not a Class.
//
//     "egg_and_hams".classify()   // => "EggAndHam"
//     "posts".classify()          // => "Post"
//
// Singular names are not handled correctly:
//
//     "business".classify()       // => "Busines"
inflect.classify = function (table_name) {
  return inflect.camelize(inflect.singularize(util.string.gsub(table_name, /.*\./, '')));
}

}, function(modId) { var map = {"./util":1561368116982,"./inflections":1561368116983}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1561368116982, function(require, module, exports) {
// Some utility functions in js

var u = module.exports = {
  array: {
    // Returns a copy of the array with the value removed once
    //
    //     [1, 2, 3, 1].del 1 #=> [2, 3, 1]
    //     [1, 2, 3].del 4    #=> [1, 2, 3]
    del: function (arr, val) {
      var index = arr.indexOf(val);

      if (index != -1) {
        if (index == 0) {
         return arr.slice(1)
        } else {
          return arr.slice(0, index).concat(arr.slice(index+1));
        }
      } else {
        return arr;
      }
    },

    // Returns the first element of the array
    //
    //     [1, 2, 3].first() #=> 1
    first: function(arr) {
      return arr[0];
    },

    // Returns the last element of the array
    //
    //     [1, 2, 3].last()  #=> 3
    last: function(arr) {
      return arr[arr.length-1];
    }
  },
  string: {
    // Returns a copy of str with all occurrences of pattern replaced with either replacement or the return value of a function.
    // The pattern will typically be a Regexp; if it is a String then no regular expression metacharacters will be interpreted
    // (that is /\d/ will match a digit, but ‘\d’ will match a backslash followed by a ‘d’).
    //
    // In the function form, the current match object is passed in as a parameter to the function, and variables such as
    // $[1], $[2], $[3] (where $ is the match object) will be set appropriately. The value returned by the function will be
    // substituted for the match on each call.
    //
    // The result inherits any tainting in the original string or any supplied replacement string.
    //
    //     "hello".gsub /[aeiou]/, '*'      #=> "h*ll*"
    //     "hello".gsub /[aeiou]/, '<$1>'   #=> "h<e>ll<o>"
    //     "hello".gsub /[aeiou]/, ($) {
    //       "<#{$[1]}>"                    #=> "h<e>ll<o>"
    //
    gsub: function (str, pattern, replacement) {
      var i, match, matchCmpr, matchCmprPrev, replacementStr, result, self;
      if (!((pattern != null) && (replacement != null))) return u.string.value(str);
      result = '';
      self = str;
      while (self.length > 0) {
        if ((match = self.match(pattern))) {
          result += self.slice(0, match.index);
          if (typeof replacement === 'function') {
            match[1] = match[1] || match[0];
            result += replacement(match);
          } else if (replacement.match(/\$[1-9]/)) {
            matchCmprPrev = match;
            matchCmpr = u.array.del(match, void 0);
            while (matchCmpr !== matchCmprPrev) {
              matchCmprPrev = matchCmpr;
              matchCmpr = u.array.del(matchCmpr, void 0);
            }
            match[1] = match[1] || match[0];
            replacementStr = replacement;
            for (i = 1; i <= 9; i++) {
              if (matchCmpr[i]) {
                replacementStr = u.string.gsub(replacementStr, new RegExp("\\\$" + i), matchCmpr[i]);
              }
            }
            result += replacementStr;
          } else {
            result += replacement;
          }
          self = self.slice(match.index + match[0].length);
        } else {
          result += self;
          self = '';
        }
      }
      return result;
    },

    // Returns a copy of the String with the first letter being upper case
    //
    //     "hello".upcase #=> "Hello"
    upcase: function(str) {
      var self = u.string.gsub(str, /_([a-z])/, function ($) {
        return "_" + $[1].toUpperCase();
      });

      self = u.string.gsub(self, /\/([a-z])/, function ($) {
        return "/" + $[1].toUpperCase();
      });

      return self[0].toUpperCase() + self.substr(1);
    },

    // Returns a copy of capitalized string
    //
    //     "employee salary" #=> "Employee Salary"
    capitalize: function (str, spaces) {
      if (!str.length) {
        return str;
      }

      var self = str.toLowerCase();

      if (!spaces) {
        self = u.string.gsub(self, /\s([a-z])/, function ($) {
          return " " + $[1].toUpperCase();
        });
      }

      return self[0].toUpperCase() + self.substr(1);
    },

    // Returns a copy of the String with the first letter being lower case
    //
    //     "HELLO".downcase #=> "hELLO"
    downcase: function(str) {
      var self = u.string.gsub(str, /_([A-Z])/, function ($) {
        return "_" + $[1].toLowerCase();
      });

      self = u.string.gsub(self, /\/([A-Z])/, function ($) {
        return "/" + $[1].toLowerCase();
      });

      return self[0].toLowerCase() + self.substr(1);
    },

    // Returns a string value for the String object
    //
    //     "hello".value() #=> "hello"
    value: function (str) {
      return str.substr(0);
    }
  }
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1561368116983, function(require, module, exports) {
// A singleton instance of this class is yielded by Inflector.inflections, which can then be used to specify additional
// inflection rules. Examples:
//
//     BulletSupport.Inflector.inflect ($) ->
//       $.plural /^(ox)$/i, '$1en'
//       $.singular /^(ox)en/i, '$1'
//
//       $.irregular 'octopus', 'octopi'
//
//       $.uncountable "equipment"
//
// New rules are added at the top. So in the example above, the irregular rule for octopus will now be the first of the
// pluralization and singularization rules that is runs. This guarantees that your rules run before any of the rules that may
// already have been loaded.

var util = require('./util');

var Inflections = function () {
  this.plurals = [];
  this.singulars = [];
  this.uncountables = [];
  this.humans = [];
  require('./defaults')(this);
  return this;
};

// Specifies a new pluralization rule and its replacement. The rule can either be a string or a regular expression.
// The replacement should always be a string that may include references to the matched data from the rule.
Inflections.prototype.plural = function (rule, replacement) {
  if (typeof rule == 'string') {
    this.uncountables = util.array.del(this.uncountables, rule);
  }
  this.uncountables = util.array.del(this.uncountables, replacement);
  this.plurals.unshift([rule, replacement]);
};

// Specifies a new singularization rule and its replacement. The rule can either be a string or a regular expression.
// The replacement should always be a string that may include references to the matched data from the rule.
Inflections.prototype.singular = function (rule, replacement) {
  if (typeof rule == 'string') {
    this.uncountables = util.array.del(this.uncountables, rule);
  }
  this.uncountables = util.array.del(this.uncountables, replacement);
  this.singulars.unshift([rule, replacement]);
};

// Specifies a new irregular that applies to both pluralization and singularization at the same time. This can only be used
// for strings, not regular expressions. You simply pass the irregular in singular and plural form.
//
//     irregular 'octopus', 'octopi'
//     irregular 'person', 'people'
Inflections.prototype.irregular =  function (singular, plural, fullMatchRequired) {
  this.uncountables = util.array.del(this.uncountables, singular);
  this.uncountables = util.array.del(this.uncountables, plural);
  var prefix = "";
  if (fullMatchRequired) {
    prefix = "^";
  }
  if (singular[0].toUpperCase() == plural[0].toUpperCase()) {
    this.plural(new RegExp("(" + prefix + singular[0] + ")" + singular.slice(1) + "$", "i"), '$1' + plural.slice(1));
    this.plural(new RegExp("(" + prefix + plural[0] + ")" + plural.slice(1) + "$", "i"), '$1' + plural.slice(1));
    this.singular(new RegExp("(" + prefix + plural[0] + ")" + plural.slice(1) + "$", "i"), '$1' + singular.slice(1));
  } else {
    this.plural(new RegExp(prefix + (singular[0].toUpperCase()) + singular.slice(1) + "$"), plural[0].toUpperCase() + plural.slice(1));
    this.plural(new RegExp(prefix + (singular[0].toLowerCase()) + singular.slice(1) + "$"), plural[0].toLowerCase() + plural.slice(1));
    this.plural(new RegExp(prefix + (plural[0].toUpperCase()) + plural.slice(1) + "$"), plural[0].toUpperCase() + plural.slice(1));
    this.plural(new RegExp(prefix + (plural[0].toLowerCase()) + plural.slice(1) + "$"), plural[0].toLowerCase() + plural.slice(1));
    this.singular(new RegExp(prefix + (plural[0].toUpperCase()) + plural.slice(1) + "$"), singular[0].toUpperCase() + singular.slice(1));
    this.singular(new RegExp(prefix + (plural[0].toLowerCase()) + plural.slice(1) + "$"), singular[0].toLowerCase() + singular.slice(1));
  }
};

// Specifies a humanized form of a string by a regular expression rule or by a string mapping.
// When using a regular expression based replacement, the normal humanize formatting is called after the replacement.
// When a string is used, the human form should be specified as desired (example: 'The name', not 'the_name')
//
//     human /(.*)_cnt$/i, '$1_count'
//     human "legacy_col_person_name", "Name"
Inflections.prototype.human = function (rule, replacement) {
  this.humans.unshift([rule, replacement]);
}

// Add uncountable words that shouldn't be attempted inflected.
//
//     uncountable "money"
//     uncountable ["money", "information"]
Inflections.prototype.uncountable = function (words) {
  this.uncountables = this.uncountables.concat(words);
}

// Clears the loaded inflections within a given scope (default is _'all'_).
// Give the scope as a symbol of the inflection type, the options are: _'plurals'_,
// _'singulars'_, _'uncountables'_, _'humans'_.
//
//     clear 'all'
//     clear 'plurals'
Inflections.prototype.clear = function (scope) {
  if (scope == null) scope = 'all';
  switch (scope) {
    case 'all':
      this.plurals = [];
      this.singulars = [];
      this.uncountables = [];
      this.humans = [];
    default:
      this[scope] = [];
  }
}

// Clears the loaded inflections and initializes them to [default](../inflections.html)
Inflections.prototype.default = function () {
  this.plurals = [];
  this.singulars = [];
  this.uncountables = [];
  this.humans = [];
  require('./defaults')(this);
  return this;
};

module.exports = new Inflections();

}, function(modId) { var map = {"./util":1561368116982,"./defaults":1561368116984}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1561368116984, function(require, module, exports) {
// Default inflections
module.exports = function (inflect) {

  inflect.plural(/$/, 's');
  inflect.plural(/s$/i, 's');
  inflect.plural(/(ax|test)is$/i, '$1es');
  inflect.plural(/(octop|vir)us$/i, '$1i');
  inflect.plural(/(octop|vir)i$/i, '$1i');
  inflect.plural(/(alias|status)$/i, '$1es');
  inflect.plural(/(bu)s$/i, '$1ses');
  inflect.plural(/(buffal|tomat)o$/i, '$1oes');
  inflect.plural(/([ti])um$/i, '$1a');
  inflect.plural(/([ti])a$/i, '$1a');
  inflect.plural(/sis$/i, 'ses');
  inflect.plural(/(?:([^fa])fe|(?:(oa)f)|([lr])f)$/i, '$1ves');
  inflect.plural(/(hive)$/i, '$1s');
  inflect.plural(/([^aeiouy]|qu)y$/i, '$1ies');
  inflect.plural(/(x|ch|ss|sh)$/i, '$1es');
  inflect.plural(/(matr|vert|ind)(?:ix|ex)$/i, '$1ices');
  inflect.plural(/([m|l])ouse$/i, '$1ice');
  inflect.plural(/([m|l])ice$/i, '$1ice');
  inflect.plural(/^(ox)$/i, '$1en');
  inflect.plural(/^(oxen)$/i, '$1');
  inflect.plural(/(quiz)$/i, '$1zes');

  inflect.singular(/s$/i, '');
  inflect.singular(/(n)ews$/i, '$1ews');
  inflect.singular(/([ti])a$/i, '$1um');
  inflect.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, '$1sis');
  inflect.singular(/(^analy)ses$/i, '$1sis');
  inflect.singular(/([^f])ves$/i, '$1fe');
  inflect.singular(/(hive)s$/i, '$1');
  inflect.singular(/(tive)s$/i, '$1');
  inflect.singular(/(oave)s$/i, 'oaf');
  inflect.singular(/([lr])ves$/i, '$1f');
  inflect.singular(/([^aeiouy]|qu)ies$/i, '$1y');
  inflect.singular(/(s)eries$/i, '$1eries');
  inflect.singular(/(m)ovies$/i, '$1ovie');
  inflect.singular(/(x|ch|ss|sh)es$/i, '$1');
  inflect.singular(/([m|l])ice$/i, '$1ouse');
  inflect.singular(/(bus)es$/i, '$1');
  inflect.singular(/(o)es$/i, '$1');
  inflect.singular(/(shoe)s$/i, '$1');
  inflect.singular(/(cris|ax|test)es$/i, '$1is');
  inflect.singular(/(octop|vir)i$/i, '$1us');
  inflect.singular(/(alias|status)es$/i, '$1');
  inflect.singular(/^(ox)en/i, '$1');
  inflect.singular(/(vert|ind)ices$/i, '$1ex');
  inflect.singular(/(matr)ices$/i, '$1ix');
  inflect.singular(/(quiz)zes$/i, '$1');
  inflect.singular(/(database)s$/i, '$1');

  inflect.irregular('child', 'children');
  inflect.irregular('person', 'people');
  inflect.irregular('man', 'men');
  inflect.irregular('child', 'children');
  inflect.irregular('sex', 'sexes');
  inflect.irregular('move', 'moves');
  inflect.irregular('cow', 'kine');
  inflect.irregular('zombie', 'zombies');
  inflect.irregular('oaf', 'oafs', true);
  inflect.irregular('jefe', 'jefes');
  inflect.irregular('save', 'saves');
  inflect.irregular('safe', 'safes');
  inflect.irregular('fife', 'fifes');

  inflect.uncountable(['equipment', 'information', 'rice', 'money', 'species', 'series', 'fish', 'sheep', 'jeans', 'sushi']);
}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1561368116985, function(require, module, exports) {
module.exports = function (obj) {

  var addProperty = function (method, func) {
    String.prototype.__defineGetter__(method, func);
  }

  var stringPrototypeBlacklist = [
    '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', 'charAt', 'constructor',
    'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf', 'charCodeAt',
    'indexOf', 'lastIndexof', 'length', 'localeCompare', 'match', 'replace', 'search', 'slice', 'split', 'substring',
    'toLocaleLowerCase', 'toLocaleUpperCase', 'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight', 'gsub'
  ];

  Object.keys(obj).forEach(function (key) {
    if (key != 'inflect' && key != 'inflections') {
      if (stringPrototypeBlacklist.indexOf(key) !== -1) {
        console.log('warn: You should not override String.prototype.' + key);
      } else {
        addProperty(key, function () {
          return obj[key](this);
        });
      }
    }
  });

}

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1561368116980);
})()
//# sourceMappingURL=index.js.map