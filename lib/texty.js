
/*!
 * Texty
 * Copyright (c) 2010 LearnBoost <tj@learnboost.com>
 * MIT Licensed
 */

// TODO: cleanup
// TODO: optimize if needed (should be fine)
// TODO: substr -> slice

/**
 * Initialize a new `Text` object
 * with optional `str`.
 *
 * @param {String} str
 * @api public
 */

Text = function Text(str) {
  this.caret = new Caret(this);
  this.hide()
    .listStyle('none')
    .text(str || '')
    .size(20)
    .font('Helvetica')
    .color('#000')
    .selectionBackground('#DFF3FC')
    .lineHeight(1);
};

/**
 * When invoked the text will inherit
 * styles from CSS.
 *
 * @api public
 */

Text.prototype.inheritCSS = function(){
  var s = selectorStyle;

  // text
  this.size(parseInt(s('.text', 'font-size'), 10))
    .font(s('.text', 'font-family'))
    .color(s('.text', 'color'))
    .selectionBackground(s('.text .selection', 'background-color'));

  // lines
  this.listStyle(s('.text .line', 'list-style-type'))
    .lineHeight(parseInt(s('.text .line', 'line-height'), 10));

  // caret
  this.caret.color(s('.text .caret', 'color'));
};

/**
 * Set line-height to `n`.
 *
 * @param {Number} n
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.lineHeight = function(n){
  this._lineHeight = n;
  return this;
};

/**
 * Return the string primitive.
 *
 * @return {String}
 * @api public
 */

Text.prototype.toString = function(){
  return this.text();
};

/**
 * Set list `style` to one of:
 *
 *  - `none`
 *  - `decimal` enable line numbering
 *  - `disc` solid circle
 *  - `circle` stroked circle
 *  - `square` solid square
 *
 * @param {String} style
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.listStyle = function(style){
  if (0 == arguments.length) return this._listStyle;
  if (!style) return this;
  this._listStyle = style;
  return this;
};

/**
 * Get or set the text to `str`.
 *
 * @param {String} str
 * @return {Text|String}
 * @api public
 */

Text.prototype.text = function(str){
  if (arguments.length) {
    this._text = str;
    return this;
  } else {
    return this._text;
  }
};

/**
 * Set the text `color`.
 *
 * @param {String} color
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.color = function(color){
  if (!color) return this;
  this._textColor = color;
  return this;
};

/**
 * Set the selection background `color`.
 *
 * @param {String} color
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.selectionBackground = function(color){
  if (!color) return this;
  this._selectionBackgroundColor = color;
  return this;
};

/**
 * Remove `n` chars relative to the caret position.
 *
 * @param {Number} n
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.remove = function(n){
  return this.removeAt(n, this.caret.pos);
};

/**
 * Remove `n` chars relative to `pos`.
 *
 * @param {Number} n
 * @param {Number} pos
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.removeAt = function(n, pos){
  this._text = this._text.substr(0, pos - n) + this._text.substr(pos);
  return this.caret.move(-n);
};

/**
 * Remove range of characters `from`-`to`.
 *
 * @param {Number} from
 * @param {Number} to
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.removeRange = function(from, to){
  this._text = this._text.substr(0, from) + this._text.substr(to);
  return this.deselect().caret.moveTo(from);
};

/**
 * Return selection object containing:
 *
 *  - `string` the text selected
 *  - `from` the start offset
 *  - `to` the end offset
 *
 * @return {Object}
 * @api public
 */

Text.prototype.selection = function(){
  if (!this.selected) return;
  var from = this.selected.from
    , to = this.selected.to;
  return {
      string: this._text.slice(from, to)
    , from: from
    , to: to
  }
};

/**
 * Remove the text currently selected, throwing
 * an error if no text is selected, otherwise
 * returning the object documented in `Text#selection()`.
 *
 * To check for a selection, use `if (text.selected)`.
 *
 * @return {Object}
 * @api public
 */

Text.prototype.removeSelection = function(){
  if (!this.selected) throw new Error('no selection is made');
  var from = this.selected.from
    , to = this.selected.to;
  return this.removeRange(from, to);
};

/**
 * Remove all characters.
 *
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.clear = function(){
  return this.text('');
};

/**
 * Insert `str` at the curent caret position.
 *
 * @param {String} str
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.insert = function(str){
  return this.insertAt(str, this.caret.pos);
};

/**
 * Insert `str` at `pos`.
 *
 * @param {String} str
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.insertAt = function(str, pos){
  this._text = this._text.substr(0, pos)
    + str + this._text.substr(pos);
  return this.caret.move(str.length);
};

/**
 * Return the char index relative to the point (`x`, `y`).
 *
 * @param {Number} x
 * @param {Number} y
 * @return {Number} index
 * @api public
 */

Text.prototype.indexOf = function(x, y){
  var text = this.text()
    , width = this._width
    , size = this._size
    , lines = text.split('\n')
    , height = lines.length * size
    , charWidth = width / text.length
    , len = lines.length
    , x = x - this.x
    , y = y - this.y
    , pad = 10;

  // x-axis out of bounds
  if (x < -pad || x > width + pad) return 0;

  // y-axis out of bounds
  if (y < -pad || y > height + pad) return 0;

  // cap y
  if (y < size) y = size;
  y = Math.ceil(y / size);
  if (y > len) y = len;

  // index
  var preceding = lines.slice(0, y - 1).join('\n').length;
  if (y) ++preceding;
  var i = preceding + x / charWidth | 0;

  return i;
};

/**
 * Select range from point (`x`, `y`) to (`x2`, `y2`).
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} x2
 * @param {Number} y2
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.select = function(x, y, x2, y2){
  var from = this.indexOf(x, y)
    , to = this.indexOf(x2, y2); 
  return this.selectRange(from, to).caret.moveTo(x2, y2).text;
};

/**
 * Select word at point (`x`, `y`).
 *
 * @param {Number} x
 * @param {Number} y
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.selectWordAt = function(x, y){
  var i = this.indexOf(x, y);
  this.caret.moveTo(i);
  var left = this.caret.moveLeftHard();
  this.selectLeft(left);
  this.caret.moveTo(i);
  var right = this.caret.moveRightHard();
  this.selectRight(right);
  this.caret.moveTo(i);
  return this;
};

/**
 * Select `n` chars to the left, initiating
 * the range or adding to the current selection.
 *
 * @param {Number} n
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.selectLeft = function(n){
  var pos = this.caret.pos
    , n = n || 1
    , selection;

  if (selection = this.selection()) {
    this.selectRange(selection.from - n, selection.to);
  } else {
    this.selectRange(pos, pos + n);
  }

  return this;
};

/**
 * Select `n` chars to the right, initiating
 * the range or adding to the current selection.
 *
 * @param {Number} n
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.selectRight = function(n){
  var pos = this.caret.pos
    , n = n || 1
    , selection;

  if (selection = this.selection()) {
    this.selectRange(selection.from, selection.to + n);
  } else {
    this.selectRange(pos - n, pos);
  }

  return this;
};

/**
 * Select all the text.
 *
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.selectAll = function(){
  return this.selectRange(0, this._text.length);
};

/**
 * Select range of text via indexes `from`-`to`.
 *
 * @param {Number} from
 * @param {Number} to
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.selectRange = function(from, to){
  var len = this._text.length
    , tmp;

  if (from > to) tmp = from, from = to, to = tmp;

  this.selected = {
      from: from > 0 ? from : 0
    , to: to < len ? to : len
  };

  return this;
};

/**
 * Deselect any text previously selected, if any.
 *
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.deselect = function(){
  this.selected = null;
  return this;
};

/**
 * Move to point (`x`, `y`).
 *
 * @param {Number} x
 * @param {Number} y
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.moveTo = function(x, y){
  this.x = x;
  this.y = y;
  return this;
};

/**
 * Hide the text.
 *
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.hide = function(){
  this.visible = false;
  return this;
};

/**
 * Show the text.
 *
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.show = function(){
  this.visible = true;
  return this;
};

/**
 * Set the font `families`.
 *
 * @param {String} families
 * @return {Text}
 * @api public
 */

Text.prototype.font = function(families){
  if (0 == arguments.length) return this._families;
  if (!families) return this;
  this._families = families;
  return this;
};

/**
 * Set font size to `n`.
 *
 * @param {Number} n
 * @return {Text} for chaining
 * @api public
 */

Text.prototype.size = function(n){
  if (0 == arguments.length) return this._size;
  if (!n) return this;
  this._size = n;
  return this;
};

/**
 * Draw selection.
 *
 * We split the lines, checking the offset
 * within the first, filling the entire line
 * width for the "middle" lines, and
 * special-casing the "last" selected line
 * to fill the correct offset much like the first.
 *
 * @api private
 */

Text.prototype.drawSelection = function(ctx, x, y, height, text){
  var selection = this.selection()
    , from = selection.from
    , to = selection.to
    , before = text.slice(0, from).split('\n')
    , beforeLen = before.length
    , last = before[beforeLen - 1]
    , selected = text.slice(from, to).split('\n')
    , selectionLen = selected.length
    , px = height / 2
    , ox = x
    , oy = y
    , width
    , line;

  ctx.fillStyle = this._selectionBackgroundColor;

  // first
  y += (beforeLen - 1) * height;
  width = ctx.measureText(selected[0]).width;
  last = ctx.measureText(last).width;
  ctx.fillRect(x + last, y - px, width, height);

  // mid
  for (var i = 1, len = selectionLen - 1; i < len; ++i) {
    y += height;
    width = ctx.measureText(selected[i]).width;
    ctx.fillRect(x, y - px, width, height);
  }
  
  // last
  if (selectionLen < 2) return;
  y += height;
  last = selected[selectionLen - 1];
  width = ctx.measureText(last).width;
  ctx.fillRect(x, y - px, width, height);
};

/**
 * Draw the caret.
 *
 * Splits the lines up to the caret pos,
 * allowing us to grab the line containing it,
 * after which we measure text to provide
 * the appropriate offset.
 *
 * @api private
 */

Text.prototype.drawCaret = function(ctx, x, y, height, text){
  if (!this.caret.visible) return;
  var lines = text.substr(0, this.caret.pos).split('\n')
    , len = lines.length
    , line = lines[len - 1]
    , px = height / 2
    , caret = ctx.measureText(line).width + 2
    , y = y + --len * height;
  ctx.strokeStyle = this.caret._color;
  ctx.beginPath();
  ctx.moveTo(x + caret, y - px - 2);
  ctx.lineTo(x + caret, y + px + 2);
  ctx.stroke();
};

/**
 * Draw text.
 *
 * Iterates through the lines, rendering
 * them while progressing the `y` offset.
 *
 * @api private
 */

Text.prototype.drawText = function(ctx, x, y, height, text){
  var lines = text.split('\n')
    , ox = x;
  ctx.fillStyle = this._textColor;
  ctx.textBaseline = 'middle';
  ctx.font = this._size + 'px ' + this._families;
  for (var i = 0, len = lines.length; i < len; ++i) {
    ctx.fillText(lines[i], x, y);
    x = ox;
    y += height;
  }
};

/**
 * Draw line decoration.
 *
 * @api private
 */

Text.prototype.drawLineDecoration = function(ctx, x, y, height, text, c){
  var len = text.split('\n').length
    , em = ctx.measureText('M').width;

  ctx.save();
  ctx.font = (this._size * .65) + 'px ' + this._families;
  x -= em;
  for (var i = 0; i < len; ++i) {
    ctx.fillText('function' == typeof c
      ? c(i)
      : c, x, y);
    y += height;
  }
  ctx.restore();
};

/**
 * Draw text, the caret, and possible selection to the given `ctx`.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @return {Text} text
 * @api public
 */

Text.prototype.draw = function(ctx){
  if (!this.visible) return this;
  var text = this._text
    , lineHeight = this._lineHeight
    , height = this._size + lineHeight
    , x = this.x
    , y = this.y;

  this._width = ctx.measureText(text).width;
  if (this.selected) this.drawSelection(ctx, x, y, height, text);
  this.drawCaret(ctx, x, y, height, text);
  this.drawText(ctx, x, y, height, text);

  // list style
  var decoration;
  switch (this._listStyle) {
    case 'decimal': decoration = function(i){ return ++i + '.'; }; break;
    case 'square': decoration = '■'; break;
    case 'circle': decoration = '○'; break;
    case 'disc'  : decoration = '●'; break;
  }
  if (decoration) this.drawLineDecoration(ctx, x, y, height, text, decoration);

  return this;
};
