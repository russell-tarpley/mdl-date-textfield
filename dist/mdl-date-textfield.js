(function() {
    'use strict';

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
        this.maxRows = this.Constant_.NO_MAX_ROWS;
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
    MaterialDateTextfield.prototype.Constant_ = {
        NO_MAX_ROWS: -1,
        MAX_ROWS_ATTRIBUTE: 'maxrows'
    };

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
        IS_UPGRADED: 'is-upgraded',
        HAS_PLACEHOLDER: 'has-placeholder'
    };

    /**
   * Handle input being entered.
   *
   * @param {Event} event The event that fired.
   * @private
   */
    MaterialDateTextfield.prototype.onKeyDown_ = function (event) {
        var currentRowCount = event.target.value.split('\n').length;
        if (event.keyCode === 13) {
            if (currentRowCount >= this.maxRows) {
                event.preventDefault();
            }
        }
    };

    /**
     * Handle focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    MaterialDateTextfield.prototype.onFocus_ = function (event) {
        var value = this.input_.value;
        var hit = value.indexOf('/');
        while (hit > -1) {
            value = value.replace('/', '');
            hit = value.indexOf('/');
        }
        this.input_.value = value;
        this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
    };

    /**
     * Handle lost focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    MaterialDateTextfield.prototype.onBlur_ = function (event) {
        this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
    };

    MaterialDateTextfield.prototype.onChange_ = function (event) {
        //Verify Input and Format Accordingly
        var strip = ['/', '-', '.'];
        var value = this.input_.value;
        //remove all formatting characters that may have been entered
        for (var x = 0, len = strip.length; x < len; x++) {
            var hit = value.indexOf(strip[x]);
            while (hit > -1) {
                value = value.replace(strip[x], '');
                hit = value.indexOf(strip[x]);
            }
        }
        if (value.length !== 8) {
            //Invalid entry
            this.element_.classList.add(this.CssClasses_.IS_INVALID);
        } else {
            //format value
            var newValue = [value.slice(0, 2), '/', value.slice(2, 4), '/', value.slice(4)].join('');
            value = newValue;
        }
        this.input_.value = value;
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
            if (this.input_.validity.valid) {
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

                this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
                this.boundFocusHandler = this.onFocus_.bind(this);
                this.boundBlurHandler = this.onBlur_.bind(this);
                this.boundResetHandler = this.onReset_.bind(this);
                this.boundChangeHandler = this.onChange_.bind(this);
                this.input_.addEventListener('input', this.boundUpdateClassesHandler);
                this.input_.addEventListener('focus', this.boundFocusHandler);
                this.input_.addEventListener('blur', this.boundBlurHandler);
                this.input_.addEventListener('reset', this.boundResetHandler);
                this.input_.addEventListener('change', this.boundChangeHandler);

                if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
                    // TODO: This should handle pasting multi line text.
                    // Currently doesn't.
                    this.boundKeyDownHandler = this.onKeyDown_.bind(this);
                    this.input_.addEventListener('keydown', this.boundKeyDownHandler);
                }
                var invalid = this.element_.classList
                  .contains(this.CssClasses_.IS_INVALID);
                this.updateClasses_();
                this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
                if (invalid) {
                    this.element_.classList.add(this.CssClasses_.IS_INVALID);
                }
                if (this.input_.hasAttribute('autofocus')) {
                    this.element_.focus();
                    this.checkFocus();
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