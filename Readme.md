
# Texty

  light-weight canvas text editing.

## Implementation

  Texty is _not_ an __IDE__, nor a generic rich text editor, it's purpose is to remain light-weight and provide textbox-like editing for canvas. Texty knows nothing of the DOM, and does not interact with the canvas directly, the only interaction is by passing a `CanvasRenderingContext2d` to the `Text#draw(ctx)` method, all caret movements, selection, etc are performed via method calls, the event handlers themselves are designed by the developer however the _example.html_ file contains an example of these basic interactions.

## License 

(The MIT License)

Copyright (c) 2011 TJ Holowaychuk &lt;tj@learnboost.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.