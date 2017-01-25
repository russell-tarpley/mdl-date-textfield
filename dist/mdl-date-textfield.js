(function () {
    'use strict';
    //String startsWith polyfill for IE 11
    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function (searchString, position) {
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }
    /**
     * Class constructor for Date Textfield MDL component.
     * Implements MDL component design pattern defined at:
     * https://github.com/jasonmayes/mdl-component-design-pattern
     *
     * @constructor
     * @param {HTMLElement} element The element that will be upgraded.
     */
    var MaterialDateTextfield = function MaterialDateTextfield(element) {
        this.element_ = element;
        // Initialize instance.
        this.init();
    };
    window['MaterialDateTextfield'] = MaterialDateTextfield;

    /**
     * Store constants in one place so they can be updated easily.
     *
     * @enum {string | number}
     * @private
     */
    MaterialDateTextfield.prototype.Constant_ = {};

    /**
     * Store strings for class names defined by this component that are used in
     * JavaScript. This allows us to simply change it in one place should we
     * decide to modify at a later date.
     *
     * @enum {string}
     * @private
     */
    MaterialDateTextfield.prototype.CssClasses_ = {
        LABEL: 'mdl-date-textfield__label',
        INPUT: 'mdl-date-textfield__input',
        IS_DIRTY: 'is-dirty',
        IS_FOCUSED: 'is-focused',
        IS_DISABLED: 'is-disabled',
        IS_INVALID: 'is-invalid',
        IS_UPGRADED: 'is-upgraded'
    };
    //Adapted from lodash
    //Added here to avoid extra dependency
    MaterialDateTextfield.prototype.flatMap = function (xs, f) {
        var results = [];
        for (var i = 0; i < xs.length; i++) {
            var result = f(xs[i]);
            for (var j = 0; j < result.length; j++) {
                results.push(result[j]);
            }
        }
        return results;
    };
    MaterialDateTextfield.prototype.range = function(n,m){
        var results = [];
        for (; n < m; n++) {
            results.push(n);
        }
        return results;
    };
    MaterialDateTextfield.prototype.zipWith = function (xs, ys, f) {
        var results = [];
        var n = Math.min(xs.length, ys.length);
        for (var i = 0; i < n; i++) {
            results.push(f(xs[i], ys[i]));
        }
        return results;
    };


    //Routines
    MaterialDateTextfield.prototype.pattern_ = function () { };
    MaterialDateTextfield.prototype.pattern_.literal = function (value) {
        var lit = new MaterialDateTextfield.prototype.pattern_();
        lit.literal = true;
        lit.value = value;
        return lit;
    };
    MaterialDateTextfield.prototype.pattern_.sequence = function (left, right) {
        var seq = new MaterialDateTextfield.prototype.pattern_();
        seq.sequence = true;
        seq.left = left;
        seq.right = right;
        return seq;
    };
    MaterialDateTextfield.prototype.pattern_.choice = function (xs) {
        var ch = new MaterialDateTextfield.prototype.pattern_();
        ch.choice = xs;
        return ch;
    };

    //Matching
    MaterialDateTextfield.prototype.match_ = function () { };
    MaterialDateTextfield.prototype.match_.continue = function (string) {
        var cont = new MaterialDateTextfield.prototype.match_();
        cont.continue = true;
        cont.value = string;
        return cont;
    };
    MaterialDateTextfield.prototype.match_.success = function () {
        var succ = new MaterialDateTextfield.prototype.match_();
        succ.success = true;
        return succ;
    };
    MaterialDateTextfield.prototype.match_.failure = function () {
        var fail = new MaterialDateTextfield.prototype.match_();
        fail.failure = true;
        return fail;
    };
    MaterialDateTextfield.prototype.match_.incomplete = function () {
        var inc = new MaterialDateTextfield.prototype.match_();
        inc.incomplete = true;
        return inc;
    };
    
    //Execution
    MaterialDateTextfield.prototype.run_ = function (input, pattern) {
        if (pattern.literal) {
            if (input === pattern.value) {
                return [MaterialDateTextfield.prototype.match_.success()];
            }
            else if (input.startsWith(pattern.value)) {
                return [MaterialDateTextfield.prototype.match_.continue(input.substr(pattern.value.length))];
            }
            else if (pattern.value.startsWith(input)) {
                return [MaterialDateTextfield.prototype.match_.incomplete()];
            }
            else {
                return [MaterialDateTextfield.prototype.match_.failure()];
            }
        }
        else if (pattern.choice) {
            return MaterialDateTextfield.prototype.flatMap(pattern.choice, function (x) { return MaterialDateTextfield.prototype.run_(input, x); });
        }
        else if (pattern.sequence) {
            return MaterialDateTextfield.prototype.flatMap(MaterialDateTextfield.prototype.run_(input, pattern.left), function (result) {
                if (result.failure) {
                    return [];
                }
                else if (result.success) {
                    return MaterialDateTextfield.prototype.run_('', pattern.right);
                }
                else if (result.incomplete) {
                    return [result];
                }
                else if (result.continue) {
                    return MaterialDateTextfield.prototype.run_(result.value, pattern.right);
                }
                else {
                    throw pattern;
                }
            });
        }
        else {
            throw pattern;
        }
    };

    MaterialDateTextfield.prototype.complete_ = function (input, pattern) {
        return this.run_(input, pattern).some(function (x) { return x.success; });
    };

    MaterialDateTextfield.prototype.partial_ = function (input, pattern) {
        return this.run_(input, pattern).some(function (x) { return x.incomplete; });
    };

    MaterialDateTextfield.prototype.zeroFill_ = function (x) {
        const s = x.toString();
        const patterns = (s.length === 1 ? [s, '0' + x] : [s]).map(MaterialDateTextfield.prototype.pattern_.literal);
        return MaterialDateTextfield.prototype.pattern_.choice(patterns);
    };

    MaterialDateTextfield.prototype.Months = MaterialDateTextfield.prototype.range(1, 13).map(MaterialDateTextfield.prototype.zeroFill_);
    MaterialDateTextfield.prototype.Days = MaterialDateTextfield.prototype.range(1, 29).map(MaterialDateTextfield.prototype.zeroFill_);
    MaterialDateTextfield.prototype.Years = MaterialDateTextfield.prototype.pattern_.choice(MaterialDateTextfield.prototype.range(1900, 2101).map(function (x) { return MaterialDateTextfield.prototype.pattern_.literal(x.toString()); }));
    MaterialDateTextfield.prototype.Delimiters = MaterialDateTextfield.prototype.pattern_.choice(['-', '/', ''].map(MaterialDateTextfield.prototype.pattern_.literal));
    MaterialDateTextfield.prototype.DaysInAMonth = MaterialDateTextfield.prototype.zipWith(MaterialDateTextfield.prototype.Months, [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    function (month, days) { return { month: month, days: days }; });
    MaterialDateTextfield.prototype.AdditionalDays = MaterialDateTextfield.prototype.pattern_.choice(
        MaterialDateTextfield.prototype.flatMap(MaterialDateTextfield.prototype.DaysInAMonth, function (pair) {
            return MaterialDateTextfield.prototype.range(29, pair.days + 1)
              .map(function (x) {
                  return [pair.month, MaterialDateTextfield.prototype.Delimiters, MaterialDateTextfield.prototype.pattern_.literal(x.toString())]
                    .reduce(MaterialDateTextfield.prototype.pattern_.sequence);
              });
        }));
    MaterialDateTextfield.prototype.isLeapYear = function (n) {
        return (n % 4) === 0 && ((n % 100) !== 0 || (n % 400) === 0);
    };
    MaterialDateTextfield.prototype.LeapDays = MaterialDateTextfield.prototype.pattern_.choice(
        MaterialDateTextfield.prototype.range(1900, 2101)
        .filter(MaterialDateTextfield.prototype.isLeapYear)
        .map(function (x) {
            return [MaterialDateTextfield.prototype.zeroFill_(2), MaterialDateTextfield.prototype.Delimiters, MaterialDateTextfield.prototype.pattern_.literal('29'), MaterialDateTextfield.prototype.Delimiters, MaterialDateTextfield.prototype.pattern_.literal(x.toString())]
        .reduce(MaterialDateTextfield.prototype.pattern_.sequence);
    }));

    MaterialDateTextfield.prototype.DatePattern = MaterialDateTextfield.prototype.pattern_.choice([
         [MaterialDateTextfield.prototype.pattern_.choice(MaterialDateTextfield.prototype.Months), MaterialDateTextfield.prototype.Delimiters, MaterialDateTextfield.prototype.pattern_.choice(MaterialDateTextfield.prototype.Days), MaterialDateTextfield.prototype.Delimiters, MaterialDateTextfield.prototype.Years].reduce(MaterialDateTextfield.prototype.pattern_.sequence),
    [MaterialDateTextfield.prototype.AdditionalDays, MaterialDateTextfield.prototype.Delimiters, MaterialDateTextfield.prototype.Years].reduce(MaterialDateTextfield.prototype.pattern_.sequence),
    MaterialDateTextfield.prototype.LeapDays
    ]);

    /**
     * Handle focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    MaterialDateTextfield.prototype.onFocus_ = function (event) {
        this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
        //Strip any slashes prior to matching
        while (this.input_.value.indexOf("/") !== -1) {
            this.input_.value = this.input_.value.replace("/", "");
        }
    };

    /**
     * Handle lost focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    MaterialDateTextfield.prototype.onInput_ = function (event) {
        console.log("partial", this.partial_(this.input_.value, this.DatePattern), "complete", this.complete_(this.input_.value, this.DatePattern));
        this.updateClasses_();
    };

    /**
     * Handle blur event
     * @param {Event} event The event that fired
     * @private
     */
    MaterialDateTextfield.prototype.onBlur_ = function (event) {
        this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
        this.updateClasses_();
        //Handle Formatting when valid and value exists
        if (!this.element_.classList.contains(this.CssClasses_.IS_INVALID) && this.element_.classList.contains(this.CssClasses_.IS_DIRTY)) {
            if (this.complete_(this.input_.value, this.DatePattern)) {
                //Update input value adding slashes
                var pattern = /^(\d{1,2})\/?-?(\d{1,2})\/?-?(\d{4})/;
                var matches = pattern.exec(this.input_.value);
                var day = parseInt(matches[2], 10);
                var month = parseInt(matches[1], 10);
                var year = parseInt(matches[3], 10);
                if (matches[1].length < 2) {
                    matches[1] = "0" + matches[1];
                }
                if (matches[2].length < 2) {
                    matches[2] = "0" + matches[2];
                }
                this.input_.value = matches[1] + "/" + matches[2] + "/" + matches[3];
            } else {
                this.element_.classList.add(this.CssClasses_.IS_INVALID);
            }
        }
    };

    /**
     * Handle reset event from out side.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    MaterialDateTextfield.prototype.onReset_ = function (event) {
        this.updateClasses_();
    };

    /**
     * Handle class updates.
     *
     * @private
     */
    MaterialDateTextfield.prototype.updateClasses_ = function () {
        this.checkDisabled();
        this.checkValidity();
        this.checkDirty();
        this.checkFocus();
    };

    // Public methods.

    /**
     * Check the disabled state and update field accordingly.
     *
     * @public
     */
    MaterialDateTextfield.prototype.checkDisabled = function () {
        if (this.input_.disabled) {
            this.element_.classList.add(this.CssClasses_.IS_DISABLED);
        } else {
            this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
        }
    };
    MaterialDateTextfield.prototype['checkDisabled'] =
        MaterialDateTextfield.prototype.checkDisabled;

    /**
    * Check the focus state and update field accordingly.
    *
    * @public
    */
    MaterialDateTextfield.prototype.checkFocus = function () {
        if (Boolean(this.element_.querySelector(':focus'))) {
            this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
        } else {
            this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
        }
    };
    MaterialDateTextfield.prototype['checkFocus'] =
      MaterialDateTextfield.prototype.checkFocus;

    /**
     * Check the validity state and update field accordingly.
     *
     * @public
     */
    MaterialDateTextfield.prototype.checkValidity = function () {
        if (this.input_.validity) {
            if (this.input_.validity.valid && (this.partial_(this.input_.value, this.DatePattern) || this.complete_(this.input_.value, this.DatePattern))) {
                this.element_.classList.remove(this.CssClasses_.IS_INVALID);
            } else {
                this.element_.classList.add(this.CssClasses_.IS_INVALID);
            }
        }
    };
    MaterialDateTextfield.prototype['checkValidity'] =
        MaterialDateTextfield.prototype.checkValidity;

    /**
     * Check the dirty state and update field accordingly.
     *
     * @public
     */
    MaterialDateTextfield.prototype.checkDirty = function () {
        if (this.input_.value && this.input_.value.length > 0) {
            this.element_.classList.add(this.CssClasses_.IS_DIRTY);
        } else {
            this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
        }
    };
    MaterialDateTextfield.prototype['checkDirty'] =
        MaterialDateTextfield.prototype.checkDirty;

    /**
     * Disable text field.
     *
     * @public
     */
    MaterialDateTextfield.prototype.disable = function () {
        this.input_.disabled = true;
        this.updateClasses_();
    };
    MaterialDateTextfield.prototype['disable'] = MaterialDateTextfield.prototype.disable;

    /**
     * Enable text field.
     *
     * @public
     */
    MaterialDateTextfield.prototype.enable = function () {
        this.input_.disabled = false;
        this.updateClasses_();
    };
    MaterialDateTextfield.prototype['enable'] = MaterialDateTextfield.prototype.enable;

    /**
     * Update text field value.
     *
     * @param {string} value The value to which to set the control (optional).
     * @public
     */
    MaterialDateTextfield.prototype.change = function (value) {

        this.input_.value = value || '';
        this.updateClasses_();
    };
    MaterialDateTextfield.prototype['change'] = MaterialDateTextfield.prototype.change;

    /**
   * Initialize element.
   */
    MaterialDateTextfield.prototype.init = function () {

        if (this.element_) {
            this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
            this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);

            if (this.input_) {
                if (this.input_.hasAttribute(
                    /** @type {string} */(this.Constant_.MAX_ROWS_ATTRIBUTE))) {
                    this.maxRows = parseInt(this.input_.getAttribute(
                        /** @type {string} */(this.Constant_.MAX_ROWS_ATTRIBUTE)), 10);
                    if (isNaN(this.maxRows)) {
                        this.maxRows = this.Constant_.NO_MAX_ROWS;
                    }
                }

                if (this.input_.hasAttribute('placeholder')) {
                    this.element_.classList.add(this.CssClasses_.HAS_PLACEHOLDER);
                }

                this.boundInputHandler = this.onInput_.bind(this);
                this.boundFocusHandler = this.onFocus_.bind(this);
                this.boundBlurHandler = this.onBlur_.bind(this);
                this.boundResetHandler = this.onReset_.bind(this);
                this.input_.addEventListener('input', this.boundInputHandler);
                this.input_.addEventListener('focus', this.boundFocusHandler);
                this.input_.addEventListener('blur', this.boundBlurHandler);
                this.input_.addEventListener('reset', this.boundResetHandler);

                this.onInput_();
                this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
                if (this.input_.hasAttribute('autofocus')) {
                    this.element_.focus();
                    this.checkFocus();
                }
                if (this.element_.classList.contains(this.CssClasses_.IS_DIRTY)) {
                    this.onBlur_();
                }
            }
        }
    };

    // The component registers itself. It can assume componentHandler is available
    // in the global scope.
    componentHandler.register({
        constructor: MaterialDateTextfield,
        classAsString: 'MaterialDateTextfield',
        cssClass: 'mdl-js-date-textfield',
        widget: true
    });
})();