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
     * Handle focus.
     *
     * @param {Event} event The event that fired.
     * @private
     */
    MaterialDateTextfield.prototype.onFocus_ = function (event) {
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
        var pattern = /^(\d{1,2})\/?-?(\d{1,2})\/?-?(\d{4})/;
        //Test the input string for basic format (optional '/' '-')
        if (!pattern.test(this.input_.value)) {
            this.element_.classList.add(this.CssClasses_.IS_INVALID);
            return false;
        }
        
        var matches = pattern.exec(this.input_.value);
        var day = parseInt(matches[2], 10);
        var month = parseInt(matches[1], 10);
        var year = parseInt(matches[3], 10);
        
        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month == 0 || month > 12) {
            this.element_.classList.add(this.CssClasses_.IS_INVALID);
            return false;
        }
            
        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        if (day > 0 && day <= monthLength[month - 1]) {
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

                var invalid = this.element_.classList.contains(this.CssClasses_.IS_INVALID);
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