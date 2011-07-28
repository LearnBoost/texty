
/*!
 * Caret
 * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
 * MIT Licensed
 */

/**
 * Initialize a new `Caret` with the given `text` object.
 *
 * @param {Text} text
 * @api public
 */

Caret = function Caret(text) {
  this.text = text;
  this.pos = 0;
  this.color('#888');
  this.softLeft = /([A-Z][a-z0-9]*|[a-z0-9]+|_+| +)$/;
  this.softRight = /^([A-Z][a-z0-9]*|[a-z0-9]+|_+| +)/;
  this.hardLeft = /(\w+| +)$/;
  this.hardRight = /^(\w+| +)/;
  this.show();
};

/**
 * Show the caret.
 *
 * @return {Caret} for chaining
 * @api public
 */

Caret.prototype.show = function(){
  this.visible = true;
  return this;
};

/**
 * Hide the caret.
 *
 * @return {Caret} for chaining
 * @api public
 */

Caret.prototype.hide = function(){
  this.visible = false;
  return this;
};

/**
 * Set the caret `color`.
 *
 * @param {String} color
 * @return {Caret} for chaining
 * @api public
 */

Caret.prototype.color = function(color){
  if (!color) return this;
  this._color = color;
  return this;
};

/**
 * Move the caret by `n`, relative to
 * the current position.
 *
 * @param {Number} n
 * @return {Caret} for chaining
 * @api public
 */

Caret.prototype.move = function(n){
  var len = this.text._text.length;
  this.pos += n;
  if (this.pos < 0) this.pos = 0
  else if (this.pos > len) this.pos = len;
  return this;
};

/**
 * Move the caret left by `n` or 1.
 *
 * @param {Number} n
 * @return {Caret} for chaining
 * @api public
 */

Caret.prototype.moveLeft = function(n){
  return this.move(-(n || 1));
};

/**
 * Move the caret right by `n` or 1.
 *
 * @param {Number} n
 * @return {Caret} for chaining
 * @api public
 */

Caret.prototype.moveRight = function(n){
  return this.move(n || 1);
};

/**
 * Move the caret up a line, attempting
 * to maintain the current column.
 *
 * @param {Number} n
 * @return {Caret} for chaining
 * @api public
 */

Caret.prototype.moveUp = function(){
  var lines = this.text._text.slice(0, this.pos).split('\n')
    , curr = lines.pop()
    , prev = lines.pop() || ''
    , n = prev.slice(curr.length).length;
  return this.moveLeft(curr.length + n + 1);
};

/**
 * Move the caret down a line, attempting
 * to maintain the current column.
 *
 * @param {Number} n
 * @return {Caret} for chaining
 * @api public
 */

Caret.prototype.moveDown = function(){
  var lines = this.text._text.slice(this.pos).split('\n')
    , curr = lines.shift()
    , next = lines.shift() || ''
    , n = next.slice(curr.length).length;
  return this.moveRight(curr.length + n + 1);
};

/**
 * Move the caret relative to the point (`x`, `y`).
 *
 * @param {Number} x
 * @param {Number} y
 * @return {Caret} for chaining
 * @api public
 */

Caret.prototype.moveTo = function(x, y){
  if (2 == arguments.length) {
    this.moveTo(this.text.indexOf(x, y));
  } else {
    this.pos = x;
  }
  return this;
};

/**
 * Move splitting on `regexp` and `direction`,
 * returning the number of chars
 * jumped, which is at _least_ `1`.
 *
 * @param {RegExp} regexp
 * @param {Number} direction
 * @return {Number}
 * @api public
 */

Caret.prototype.moveWithPattern = function(regexp, direction){
  var text = this.text._text
    , captures
    , n = 1;

  if (-1 == direction) {
    text = text.slice(0, this.pos);
  } else {
    text = text.slice(this.pos);
  }

  if (captures = regexp.exec(text)) n = captures[1].length;

  this.move(-1 == direction ? -n : n);

  return n;
};

/**
 * Perform a "soft" move left,
 * returning the number of chars
 * advanced.
 *
 * @return {Number}
 * @api public
 */

Caret.prototype.moveLeftSoft = function(){
  return this.moveWithPattern(this.softLeft, -1);
};

/**
 * Perform a "soft" move right,
 * returning the number of chars
 * advanced.
 *
 * @return {Number}
 * @api public
 */

Caret.prototype.moveRightSoft = function(){
  return this.moveWithPattern(this.softRight, 1);
};

/**
 * Perform a "hard" move left,
 * returning the number of chars
 * advanced.
 *
 * @return {Number}
 * @api public
 */

Caret.prototype.moveLeftHard = function(){
  return this.moveWithPattern(this.hardLeft, -1);
};

/**
 * Perform a "hard" move right,
 * returning the number of chars
 * advanced.
 *
 * @return {Number}
 * @api public
 */

Caret.prototype.moveRightHard = function(){
  return this.moveWithPattern(this.hardRight, 1);
};
