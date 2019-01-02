/*!
 * Copyright (c) 2019 Eddie Antonio Santos <easantos@ualberta.ca>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * <spoiler-text> component.
 */
'use strict'

class SpoilerTextElement extends HTMLElement {
  constructor() {
    super()
    this._visible = false;
  }

  connectedCallback() {
    let visible = this.getAttribute('visible') || false;
    /* Setting this attribute does magic! */
    this.visible = visible;

    // Will need to create a button beside for accessibility
    //
    // <button aria-controls="spoiler-text"> Show spoiler </button>

    // Hover over will show the text
    this.addEventListener('mouseover', _event => { this.visible = true })
    this.addEventListener('mouseout', _event => { this.visible = false });

    // Touching the element will toggle the state.
    this.addEventListener('touchstart', _event => { this.visible = !this.visible })
  }

  get visible() {
    return this._visible
  }

  set visible(value) {
    if (!(value === true || value === false)) {
      throw new TypeError('visible must be set to true or false')
    }

    this._visible = value;
    this.setAttribute('aria-hidden', this.hidden);
  }

  get hidden() {
    return !this._visible;
  }
}


customElements.define('spoiler-text', SpoilerTextElement)
;(() => {
  let style = document.createElement('style')
  style.innerHTML = `
    spoiler-text {
      color: transparent;
      outline: 1px grey dotted;
    }
    spoiler-text[aria-hidden="false"] { color: inherit }
  `
  document.head.appendChild(style)
})()
