import { Animation, Browser, ChildProperty, Collection, Component, Event, EventHandler, Internationalization, KeyboardEvents, L10n, NotifyPropertyChanges, Property, addClass, append, attributes, cldrData, closest, createElement, detach, extend, formatUnit, getDefaultDateObject, getUniqueID, getValue, isNullOrUndefined, isUndefined, merge, prepend, remove, removeClass, rippleEffect, select, setStyleAttribute, setValue } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { Input } from '@syncfusion/ej2-inputs';
import { Button } from '@syncfusion/ej2-buttons';
import { ListBase, cssClass } from '@syncfusion/ej2-lists';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//class constant defination.
const OTHERMONTH = 'e-other-month';
const ROOT = 'e-calendar';
const DEVICE = 'e-device';
const HEADER = 'e-header';
const RTL = 'e-rtl';
const CONTENT = 'e-content';
const YEAR = 'e-year';
const MONTH = 'e-month';
const DECADE = 'e-decade';
const ICON = 'e-icons';
const PREVICON = 'e-prev';
const NEXTICON = 'e-next';
const PREVSPAN = 'e-date-icon-prev';
const NEXTSPAN = 'e-date-icon-next ';
const ICONCONTAINER = 'e-icon-container';
const DISABLED = 'e-disabled';
const OVERLAY = 'e-overlay';
const WEEKEND = 'e-weekend';
const WEEKNUMBER = 'e-week-number';
const SELECTED = 'e-selected';
const FOCUSEDDATE = 'e-focused-date';
const OTHERMONTHROW = 'e-month-hide';
const TODAY = 'e-today';
const TITLE = 'e-title';
const LINK = 'e-day';
const CELL = 'e-cell';
const WEEKHEADER = 'e-week-header';
const ZOOMIN = 'e-zoomin';
const FOOTER = 'e-footer-container';
const BTN = 'e-btn';
const FLAT = 'e-flat';
const PRIMARY = 'e-primary';
const dayMilliSeconds = 86400000;
const minutesMilliSeconds = 60000;
/**
 *
 * @private
 */
let CalendarBase = class CalendarBase extends Component {
    /**
     * Initialized new instance of Calendar Class.
     * Constructor for creating the widget
     * @param  {CalendarModel} options?
     * @param  {string|HTMLElement} element?
     */
    constructor(options, element) {
        super(options, element);
        this.effect = '';
        this.keyConfigs = {
            controlUp: 'ctrl+38',
            controlDown: 'ctrl+40',
            moveDown: 'downarrow',
            moveUp: 'uparrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            select: 'enter',
            home: 'home',
            end: 'end',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            shiftPageUp: 'shift+pageup',
            shiftPageDown: 'shift+pagedown',
            controlHome: 'ctrl+home',
            controlEnd: 'ctrl+end',
            altUpArrow: 'alt+uparrow',
            spaceBar: 'space'
        };
    }
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    render() {
        this.globalize = new Internationalization(this.locale);
        this.todayDisabled = false;
        this.todayDate = new Date(new Date().setHours(0, 0, 0, 0));
        if (this.getModuleName() === 'calendar') {
            this.element.classList.add(ROOT);
            if (this.enableRtl) {
                this.element.classList.add(RTL);
            }
            if (Browser.isDevice) {
                this.element.classList.add(DEVICE);
            }
            attributes(this.element, {
                'data-role': 'calendar'
            });
        }
        else {
            this.calendarElement = createElement('div');
            this.calendarElement.classList.add(ROOT);
            if (this.enableRtl) {
                this.calendarElement.classList.add(RTL);
            }
            if (Browser.isDevice) {
                this.calendarElement.classList.add(DEVICE);
            }
            attributes(this.calendarElement, {
                'role': 'calendar'
            });
        }
        this.createHeader();
        this.createContent();
        this.wireEvents();
    }
    validateDate(value) {
        this.setProperties({ min: this.checkDateValue(new Date('' + this.min)) }, true);
        this.setProperties({ max: this.checkDateValue(new Date('' + this.max)) }, true);
        this.currentDate = this.currentDate ? this.currentDate : new Date(new Date().setHours(0, 0, 0, 0));
        if (!isNullOrUndefined(value) && this.min <= this.max && value >= this.min && value <= this.max) {
            this.currentDate = new Date('' + value);
        }
    }
    minMaxUpdate(value) {
        if (!(+this.min <= +this.max)) {
            this.setProperties({ min: this.min }, true);
            addClass([this.element], OVERLAY);
        }
        else {
            removeClass([this.element], OVERLAY);
        }
        this.min = isNullOrUndefined(this.min) || !(+this.min) ? this.min = new Date(1900, 0, 1) : this.min;
        this.max = isNullOrUndefined(this.max) || !(+this.max) ? this.max = new Date(2099, 11, 31) : this.max;
        if (+this.min <= +this.max && value && +value <= +this.max && +value >= +this.min) {
            this.currentDate = new Date('' + value);
        }
        else {
            if (+this.min <= +this.max && !value && +this.currentDate > +this.max) {
                this.currentDate = new Date('' + this.max);
            }
            else {
                if (+this.currentDate < +this.min) {
                    this.currentDate = new Date('' + this.min);
                }
            }
        }
    }
    createHeader() {
        let ariaPrevAttrs = {
            'aria-disabled': 'false',
            'aria-label': 'previous month'
        };
        let ariaNextAttrs = {
            'aria-disabled': 'false',
            'aria-label': 'next month'
        };
        let ariaTitleAttrs = {
            'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'title'
        };
        this.headerElement = createElement('div', { className: HEADER });
        let iconContainer = createElement('div', { className: ICONCONTAINER });
        this.previousIcon = createElement('button', { className: '' + PREVICON, attrs: { type: 'button' } });
        rippleEffect(this.previousIcon, {
            duration: 400,
            selector: '.e-prev',
            isCenterRipple: true
        });
        attributes(this.previousIcon, ariaPrevAttrs);
        this.nextIcon = createElement('button', { className: '' + NEXTICON, attrs: { type: 'button' } });
        rippleEffect(this.nextIcon, {
            selector: '.e-next',
            duration: 400,
            isCenterRipple: true
        });
        attributes(this.nextIcon, ariaNextAttrs);
        this.headerTitleElement = createElement('div', { className: '' + LINK + ' ' + TITLE });
        attributes(this.headerTitleElement, ariaTitleAttrs);
        this.headerElement.appendChild(this.headerTitleElement);
        this.previousIcon.appendChild(createElement('span', { className: '' + PREVSPAN + ' ' + ICON }));
        this.nextIcon.appendChild(createElement('span', { className: '' + NEXTSPAN + ' ' + ICON }));
        iconContainer.appendChild(this.previousIcon);
        iconContainer.appendChild(this.nextIcon);
        this.headerElement.appendChild(iconContainer);
        if (this.getModuleName() === 'calendar') {
            this.element.appendChild(this.headerElement);
        }
        else {
            this.calendarElement.appendChild(this.headerElement);
        }
    }
    createContent() {
        this.contentElement = createElement('div', { className: CONTENT });
        this.table = createElement('table', { attrs: { tabIndex: '0', 'role': 'grid', 'aria-activedescendant': '' } });
        if (this.getModuleName() === 'calendar') {
            this.element.appendChild(this.contentElement);
        }
        else {
            this.calendarElement.appendChild(this.contentElement);
        }
        this.contentElement.appendChild(this.table);
        this.createContentHeader();
        this.createContentBody();
        if (this.showTodayButton) {
            this.createContentFooter();
        }
    }
    getCultureValues() {
        let culShortNames = [];
        let cldrObj;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrObj = (getValue('days.stand-alone.short', getDefaultDateObject()));
        }
        else {
            cldrObj = (this.getCultureObjects(cldrData, '' + this.locale));
        }
        for (let obj of Object.keys(cldrObj)) {
            culShortNames.push(getValue(obj, cldrObj));
        }
        return culShortNames;
    }
    createContentHeader() {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.element.querySelectorAll('.e-content .e-week-header')[0])) {
                detach(this.element.querySelectorAll('.e-content .e-week-header')[0]);
            }
        }
        else {
            if (!isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content .e-week-header')[0])) {
                detach(this.calendarElement.querySelectorAll('.e-content .e-week-header')[0]);
            }
        }
        let daysCount = 6;
        let html = '';
        let shortNames;
        if (this.firstDayOfWeek > 6 || this.firstDayOfWeek < 0) {
            this.setProperties({ firstDayOfWeek: 0 }, true);
        }
        this.tableHeadElement = createElement('thead', { className: WEEKHEADER });
        if (this.weekNumber) {
            html += '<th class="e-week-number"></th>';
            if (this.getModuleName() === 'calendar') {
                addClass([this.element], '' + WEEKNUMBER);
            }
            else {
                addClass([this.calendarElement], '' + WEEKNUMBER);
            }
        }
        shortNames = this.shiftArray(((this.getCultureValues().length > 0 && this.getCultureValues())), this.firstDayOfWeek);
        for (let days = 0; days <= daysCount; days++) {
            html += '<th  class="">' + shortNames[days] + '</th>';
        }
        html = '<tr>' + html + '</tr>';
        this.tableHeadElement.innerHTML = html;
        this.table.appendChild(this.tableHeadElement);
    }
    createContentBody() {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.element.querySelectorAll('.e-content tbody')[0])) {
                detach(this.element.querySelectorAll('.e-content tbody')[0]);
            }
        }
        else {
            if (!isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content tbody')[0])) {
                detach(this.calendarElement.querySelectorAll('.e-content tbody')[0]);
            }
        }
        switch (this.start) {
            case 'Year':
                this.renderYears();
                break;
            case 'Decade':
                this.renderDecades();
                break;
            default:
                this.renderMonths();
        }
    }
    updateFooter() {
        this.todayElement.textContent = this.l10.getConstant('today');
    }
    createContentFooter() {
        if (this.showTodayButton) {
            let minimum = new Date(+this.min);
            let maximum = new Date(+this.max);
            let l10nLocale = { today: 'Today' };
            this.globalize = new Internationalization(this.locale);
            this.l10 = new L10n(this.getModuleName(), l10nLocale, this.locale);
            this.todayElement = createElement('button');
            rippleEffect(this.todayElement);
            this.updateFooter();
            addClass([this.todayElement], [BTN, TODAY, FLAT, PRIMARY]);
            if ((!(+new Date(minimum.setHours(0, 0, 0, 0)) <= +this.todayDate &&
                +this.todayDate <= +new Date(maximum.setHours(0, 0, 0, 0)))) || (this.todayDisabled)) {
                addClass([this.todayElement], DISABLED);
            }
            this.footer = createElement('div', { className: FOOTER });
            this.footer.appendChild(this.todayElement);
            if (this.getModuleName() === 'calendar') {
                this.element.appendChild(this.footer);
            }
            if (this.getModuleName() === 'datepicker') {
                this.calendarElement.appendChild(this.footer);
            }
            if (this.getModuleName() === 'datetimepicker') {
                this.calendarElement.appendChild(this.footer);
            }
            if (!this.todayElement.classList.contains(DISABLED)) {
                EventHandler.add(this.todayElement, 'click', this.todayButtonClick, this);
            }
        }
    }
    wireEvents() {
        EventHandler.add(this.headerTitleElement, 'click', this.navigateTitle, this);
        if (this.getModuleName() === 'calendar') {
            this.keyboardModule = new KeyboardEvents(this.element, {
                eventName: 'keydown',
                keyAction: this.keyActionHandle.bind(this),
                keyConfigs: this.keyConfigs
            });
        }
        else {
            this.keyboardModule = new KeyboardEvents(this.calendarElement, {
                eventName: 'keydown',
                keyAction: this.keyActionHandle.bind(this),
                keyConfigs: this.keyConfigs
            });
        }
    }
    todayButtonClick(value) {
        if (this.showTodayButton) {
            if (this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                this.navigateTo(this.depth, new Date('' + value));
            }
            else {
                this.navigateTo('Month', new Date('' + value));
            }
            this.effect = '';
        }
    }
    keyActionHandle(e, value) {
        let view = this.getViewNumber(this.currentView());
        let focusedDate = this.tableBodyElement.querySelector('tr td.e-focused-date');
        let selectedDate = this.tableBodyElement.querySelector('tr td.e-selected');
        let depthValue = this.getViewNumber(this.depth);
        let levelRestrict = (view === depthValue && this.getViewNumber(this.start) >= depthValue);
        this.effect = '';
        switch (e.action) {
            case 'moveLeft':
                this.KeyboardNavigate(-1, view, e, this.max, this.min);
                e.preventDefault();
                break;
            case 'moveRight':
                this.KeyboardNavigate(1, view, e, this.max, this.min);
                e.preventDefault();
                break;
            case 'moveUp':
                if (view === 0) {
                    this.KeyboardNavigate(-7, view, e, this.max, this.min); // move the current date to the previous seven days.
                }
                else {
                    this.KeyboardNavigate(-4, view, e, this.max, this.min); // move the current year to the previous four days.
                }
                e.preventDefault();
                break;
            case 'moveDown':
                if (view === 0) {
                    this.KeyboardNavigate(7, view, e, this.max, this.min);
                }
                else {
                    this.KeyboardNavigate(4, view, e, this.max, this.min);
                }
                e.preventDefault();
                break;
            case 'select':
                if (e.target === this.todayElement) {
                    this.todayButtonClick(value);
                }
                else {
                    let element = !isNullOrUndefined(focusedDate) ? focusedDate : selectedDate;
                    if (!isNullOrUndefined(element) && !element.classList.contains(DISABLED)) {
                        if (levelRestrict) {
                            let d = new Date(parseInt('' + (element).id, 0));
                            this.selectDate(e, d, (element), value);
                        }
                        else {
                            this.contentClick(null, --view, (element), value);
                        }
                    }
                }
                break;
            case 'controlUp':
                this.title();
                e.preventDefault();
                break;
            case 'controlDown':
                if (!isNullOrUndefined(focusedDate) || !isNullOrUndefined(selectedDate) && !levelRestrict) {
                    this.contentClick(null, --view, (focusedDate || selectedDate), value);
                }
                e.preventDefault();
                break;
            case 'home':
                this.currentDate = this.firstDay(this.currentDate);
                detach(this.tableBodyElement);
                this.renderMonths(e);
                e.preventDefault();
                break;
            case 'end':
                this.currentDate = this.lastDay(this.currentDate);
                detach(this.tableBodyElement);
                this.renderMonths(e);
                e.preventDefault();
                break;
            case 'pageUp':
                this.addMonths(this.currentDate, -1);
                this.navigateTo('Month', this.currentDate);
                e.preventDefault();
                break;
            case 'pageDown':
                this.addMonths(this.currentDate, 1);
                this.navigateTo('Month', this.currentDate);
                e.preventDefault();
                break;
            case 'shiftPageUp':
                this.addYears(this.currentDate, -1);
                this.navigateTo('Month', this.currentDate);
                e.preventDefault();
                break;
            case 'shiftPageDown':
                this.addYears(this.currentDate, 1);
                this.navigateTo('Month', this.currentDate);
                e.preventDefault();
                break;
            case 'controlHome':
                this.navigateTo('Month', new Date(this.currentDate.getFullYear(), 0, 1));
                e.preventDefault();
                break;
            case 'controlEnd':
                this.navigateTo('Month', new Date(this.currentDate.getFullYear(), 11, 31));
                e.preventDefault();
                break;
        }
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    }
    KeyboardNavigate(number, currentView, e, max, min) {
        let date = new Date('' + this.currentDate);
        switch (currentView) {
            case 2:
                this.addYears(this.currentDate, number);
                if (this.isMinMaxRange(this.currentDate)) {
                    detach(this.tableBodyElement);
                    this.renderDecades(e);
                }
                else {
                    this.currentDate = date;
                }
                break;
            case 1:
                this.addMonths(this.currentDate, number);
                if (this.isMinMaxRange(this.currentDate)) {
                    detach(this.tableBodyElement);
                    this.renderYears(e);
                }
                else {
                    this.currentDate = date;
                }
                break;
            case 0:
                this.addDay(this.currentDate, number, e, max, min);
                if (this.isMinMaxRange(this.currentDate)) {
                    detach(this.tableBodyElement);
                    this.renderMonths(e);
                }
                else {
                    this.currentDate = date;
                }
                break;
        }
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender(value) {
        this.navigatePreviousHandler = this.navigatePrevious.bind(this);
        this.navigateNextHandler = this.navigateNext.bind(this);
        this.navigateHandler = (e) => {
            this.triggerNavigate(e);
        };
    }
    ;
    minMaxDate(localDate) {
        let currentDate = new Date(new Date(+localDate).setHours(0, 0, 0, 0));
        let minDate = new Date(new Date(+this.min).setHours(0, 0, 0, 0));
        let maxDate = new Date(new Date(+this.max).setHours(0, 0, 0, 0));
        if (+currentDate === +minDate || +currentDate === +maxDate) {
            if (+localDate < +this.min) {
                localDate = new Date(+this.min);
            }
            if (+localDate > +this.max) {
                localDate = new Date(+this.max);
            }
        }
        return localDate;
    }
    renderMonths(e, value) {
        let numCells = this.weekNumber ? 8 : 7;
        let tdEles = this.renderDays(this.currentDate, e, value);
        this.createContentHeader();
        this.renderTemplate(tdEles, numCells, MONTH, e, value);
    }
    renderDays(currentDate, e, value) {
        let tdEles = [];
        let cellsCount = 42;
        let localDate = new Date('' + currentDate);
        let minMaxDate;
        let numCells = this.weekNumber ? 8 : 7;
        // 8 and 7 denotes the number of columns to be specified.
        let currentMonth = localDate.getMonth();
        this.titleUpdate(currentDate, 'days');
        let d = localDate;
        localDate = new Date(d.getFullYear(), d.getMonth(), 0, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
        while (localDate.getDay() !== this.firstDayOfWeek) {
            this.setStartDate(localDate, -1 * dayMilliSeconds);
        }
        for (let day = 0; day < cellsCount; ++day) {
            let weekEle = createElement('td', { className: CELL });
            let weekAnchor = createElement('span');
            if (day % 7 === 0 && this.weekNumber) {
                weekAnchor.textContent = '' + this.getWeek(localDate);
                weekEle.appendChild(weekAnchor);
                addClass([weekEle], '' + WEEKNUMBER);
                tdEles.push(weekEle);
            }
            minMaxDate = new Date(+localDate);
            localDate = this.minMaxDate(localDate);
            let dateFormatOptions = { type: 'dateTime', skeleton: 'full' };
            let date = this.globalize.parseDate(this.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
            let tdEle = this.dayCell(localDate);
            let title = this.globalize.formatDate(localDate, { type: 'date', skeleton: 'full' });
            let dayLink = createElement('span');
            dayLink.textContent = this.globalize.formatDate(localDate, { type: 'date', skeleton: 'd' });
            let disabled = (this.min > localDate) || (this.max < localDate);
            if (disabled) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
            }
            else {
                dayLink.setAttribute('title', '' + title);
            }
            if (currentMonth !== localDate.getMonth()) {
                addClass([tdEle], OTHERMONTH);
            }
            if (localDate.getDay() === 0 || localDate.getDay() === 6) {
                addClass([tdEle], WEEKEND);
            }
            tdEle.appendChild(dayLink);
            this.renderDayCellArgs = {
                date: localDate,
                isDisabled: false,
                element: tdEle,
                isOutOfRange: disabled
            };
            let argument = this.renderDayCellArgs;
            this.renderDayCellEvent(argument);
            if (argument.isDisabled) {
                if (value && +value === +argument.date) {
                    this.setProperties({ value: null }, true);
                }
            }
            if (this.renderDayCellArgs.isDisabled && !tdEle.classList.contains(SELECTED)) {
                addClass([tdEle], DISABLED);
                addClass([tdEle], OVERLAY);
                if (+this.renderDayCellArgs.date === +this.todayDate) {
                    this.todayDisabled = true;
                }
            }
            let otherMnthBool = tdEle.classList.contains(OTHERMONTH);
            let disabledCls = tdEle.classList.contains(DISABLED);
            if (!disabledCls) {
                EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            // to set the value as null while setting the disabled date onProperty change.
            // if (args.isDisabled && +this.value === +args.date) {
            //     this.setProperties({ value: null }, true);
            // }
            if (!otherMnthBool && !disabledCls && this.getDateVal(localDate, value)) {
                addClass([tdEle], SELECTED);
            }
            else {
                if (currentDate.getDate() === localDate.getDate() && !otherMnthBool && !disabledCls) {
                    addClass([tdEle], FOCUSEDDATE);
                }
                else {
                    if (currentDate >= this.max && parseInt(tdEle.id, 0) === +this.max && !otherMnthBool && !disabledCls) {
                        addClass([tdEle], FOCUSEDDATE);
                    }
                    if (currentDate <= this.min && parseInt(tdEle.id, 0) === +this.min && !otherMnthBool && !disabledCls) {
                        addClass([tdEle], FOCUSEDDATE);
                    }
                }
            }
            if (date.getMonth() === new Date().getMonth() && date.getDate() === new Date().getDate()) {
                if (date.getFullYear() === new Date().getFullYear()) {
                    addClass([tdEle], TODAY);
                }
            }
            tdEles.push(this.renderDayCellArgs.element);
            localDate = new Date(+minMaxDate);
            this.addDay(localDate, 1, null, this.max, this.min);
        }
        return tdEles;
    }
    renderYears(e, value) {
        this.removeTableHeadElement();
        let numCells = 4;
        let tdEles = [];
        let valueUtil = isNullOrUndefined(value);
        let curDate = new Date('' + this.currentDate);
        let mon = curDate.getMonth();
        let yr = curDate.getFullYear();
        let localDate = curDate;
        let curYrs = localDate.getFullYear();
        let minYr = new Date('' + this.min).getFullYear();
        let minMonth = new Date('' + this.min).getMonth();
        let maxYr = new Date('' + this.max).getFullYear();
        let maxMonth = new Date('' + this.max).getMonth();
        localDate.setMonth(0);
        this.titleUpdate(this.currentDate, 'months');
        let disabled = (this.min > localDate) || (this.max < localDate);
        localDate.setDate(1);
        for (let month = 0; month < 12; ++month) {
            let tdEle = this.dayCell(localDate);
            let dayLink = createElement('span');
            let localMonth = (value && (value).getMonth() === localDate.getMonth());
            let select$$1 = (value && (value).getFullYear() === yr && localMonth);
            dayLink.textContent = this.globalize.formatDate(localDate, { type: 'dateTime', skeleton: 'MMM' });
            if ((this.min && (curYrs < minYr || (month < minMonth && curYrs === minYr))) || (this.max && (curYrs > maxYr || (month > maxMonth && curYrs >= maxYr)))) {
                addClass([tdEle], DISABLED);
            }
            else if (!valueUtil && select$$1) {
                addClass([tdEle], SELECTED);
            }
            else {
                if (localDate.getMonth() === mon && this.currentDate.getMonth() === mon) {
                    addClass([tdEle], FOCUSEDDATE);
                }
            }
            localDate.setDate(1);
            localDate.setMonth(localDate.getMonth() + 1);
            if (!tdEle.classList.contains(DISABLED)) {
                EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.renderTemplate(tdEles, numCells, YEAR, e, value);
    }
    renderDecades(e, value) {
        this.removeTableHeadElement();
        let numCells = 4;
        let yearCell = 12;
        let tdEles = [];
        let localDate = new Date('' + this.currentDate);
        localDate.setMonth(0);
        localDate.setDate(1);
        let localYr = localDate.getFullYear();
        let startYr = new Date('' + (localYr - localYr % 10));
        let endYr = new Date('' + (localYr - localYr % 10 + (10 - 1)));
        let startHdrYr = this.globalize.formatDate(startYr, { type: 'dateTime', skeleton: 'y' });
        let endHdrYr = this.globalize.formatDate(endYr, { type: 'dateTime', skeleton: 'y' });
        this.headerTitleElement.textContent = startHdrYr + ' - ' + (endHdrYr);
        let start = new Date(localYr - (localYr % 10) - 1, 0, 1);
        let startYear = start.getFullYear();
        for (let rowIterator = 0; rowIterator < yearCell; ++rowIterator) {
            let year = startYear + rowIterator;
            localDate.setFullYear(year);
            let tdEle = this.dayCell(localDate);
            attributes(tdEle, { 'role': 'gridcell' });
            let dayLink = createElement('span');
            dayLink.textContent = this.globalize.formatDate(localDate, { type: 'dateTime', skeleton: 'y' });
            if (year < new Date('' + this.min).getFullYear() || year > new Date('' + this.max).getFullYear()) {
                addClass([tdEle], DISABLED);
            }
            else if (!isNullOrUndefined(value) && localDate.getFullYear() === (value).getFullYear()) {
                addClass([tdEle], SELECTED);
            }
            else {
                if (localDate.getFullYear() === this.currentDate.getFullYear() && !tdEle.classList.contains(DISABLED)) {
                    addClass([tdEle], FOCUSEDDATE);
                }
            }
            if (!tdEle.classList.contains(DISABLED)) {
                EventHandler.add(tdEle, 'click', this.clickHandler, this);
            }
            tdEle.appendChild(dayLink);
            tdEles.push(tdEle);
        }
        this.renderTemplate(tdEles, numCells, 'e-decade', e, value);
    }
    dayCell(localDate) {
        let dateFormatOptions = { skeleton: 'full', type: 'dateTime' };
        let date = this.globalize.parseDate(this.globalize.formatDate(localDate, dateFormatOptions), dateFormatOptions);
        let value = date.valueOf();
        let attrs = {
            className: CELL, attrs: { 'id': '' + getUniqueID('' + value), 'aria-selected': 'false', 'role': 'gridcell' }
        };
        return createElement('td', attrs);
    }
    firstDay(date) {
        let collection = this.tableBodyElement.querySelectorAll('td' + ':not(.' + OTHERMONTH + '');
        if (collection.length) {
            for (let i = 0; i < collection.length; i++) {
                if (!collection[i].classList.contains(DISABLED)) {
                    date = new Date(parseInt(collection[i].id, 0));
                    break;
                }
            }
        }
        return date;
    }
    lastDay(date) {
        let lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let timeOffset = Math.abs(lastDate.getTimezoneOffset() - this.firstDay(date).getTimezoneOffset());
        if (timeOffset) {
            lastDate.setHours(this.firstDay(date).getHours() + (timeOffset / 60));
        }
        return this.findLastDay(lastDate);
    }
    ;
    checkDateValue(value) {
        return (!isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    }
    findLastDay(date) {
        let collection = this.tableBodyElement.querySelectorAll('td' + ':not(.' + OTHERMONTH + '');
        if (collection.length) {
            for (let i = collection.length - 1; i >= 0; i--) {
                if (!collection[i].classList.contains(DISABLED)) {
                    date = new Date(parseInt(collection[i].id, 0));
                    break;
                }
            }
        }
        return date;
    }
    removeTableHeadElement() {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.element.querySelectorAll('.e-content table thead')[0])) {
                detach(this.tableHeadElement);
            }
        }
        else {
            if (!isNullOrUndefined(this.calendarElement.querySelectorAll('.e-content table thead')[0])) {
                detach(this.tableHeadElement);
            }
        }
    }
    renderTemplate(elements, count, classNm, e, value) {
        let view = this.getViewNumber(this.currentView());
        let trEle;
        this.tableBodyElement = createElement('tbody');
        this.table.appendChild(this.tableBodyElement);
        removeClass([this.contentElement, this.headerElement], [MONTH, DECADE, YEAR]);
        addClass([this.contentElement, this.headerElement], [classNm]);
        let weekNumCell = 41;
        let numberCell = 35;
        let otherMonthCell = 6;
        let row = count;
        let rowIterator = 0;
        for (let dayCell = 0; dayCell < elements.length / count; ++dayCell) {
            trEle = createElement('tr', { attrs: { 'role': 'row' } });
            for (rowIterator = 0 + rowIterator; rowIterator < row; rowIterator++) {
                if (!elements[rowIterator].classList.contains('e-week-number') && !isNullOrUndefined(elements[rowIterator].children[0])) {
                    addClass([elements[rowIterator].children[0]], [LINK]);
                    rippleEffect(elements[rowIterator].children[0], {
                        duration: 600,
                        isCenterRipple: true
                    });
                }
                trEle.appendChild(elements[rowIterator]);
                if (!this.weekNumber && rowIterator === otherMonthCell && elements[otherMonthCell].classList.contains(OTHERMONTH)) {
                    addClass([trEle], OTHERMONTHROW);
                }
                if (this.weekNumber) {
                    if (rowIterator === weekNumCell && elements[weekNumCell].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                }
                else {
                    if (rowIterator === numberCell && elements[numberCell].classList.contains(OTHERMONTH)) {
                        addClass([trEle], OTHERMONTHROW);
                    }
                }
            }
            row = row + count;
            rowIterator = rowIterator + 0;
            this.tableBodyElement.appendChild(trEle);
        }
        this.table.querySelector('tbody').className = this.effect;
        this.iconHandler();
        if (view !== this.getViewNumber(this.currentView()) || (view === 0 && view !== this.getViewNumber(this.currentView()))) {
            this.navigateHandler(e);
        }
        this.setAriaActiveDescendant();
    }
    clickHandler(e, value) {
        this.clickEventEmitter(e);
        let eve = e.currentTarget;
        let view = this.getViewNumber(this.currentView());
        if (eve.classList.contains(OTHERMONTH)) {
            this.contentClick(e, 0, null, value);
        }
        else if (view === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
            this.contentClick(e, 1, null, value);
        }
        else if (2 === view) {
            this.contentClick(e, 1, null, value);
        }
        else if (!eve.classList.contains(OTHERMONTH) && view === 0) {
            this.selectDate(e, this.getIdValue(e, null), null, value);
        }
        else {
            this.contentClick(e, 0, eve, value);
        }
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    }
    // Content click event handler required for extended components
    clickEventEmitter(e) {
        e.preventDefault();
    }
    contentClick(e, view, element, value) {
        let currentView = this.getViewNumber(this.currentView());
        let d = this.getIdValue(e, element);
        switch (view) {
            case 0:
                if (currentView === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                    detach(this.tableBodyElement);
                    this.currentDate = d;
                    this.effect = ZOOMIN;
                    this.renderMonths(e);
                }
                else {
                    this.currentDate.setMonth(d.getMonth());
                    if (d.getMonth() > 0 && this.currentDate.getMonth() !== d.getMonth()) {
                        this.currentDate.setDate(0);
                    }
                    this.currentDate.setFullYear(d.getFullYear());
                    this.effect = ZOOMIN;
                    detach(this.tableBodyElement);
                    this.renderMonths(e);
                }
                break;
            case 1:
                if (currentView === this.getViewNumber(this.depth) && this.getViewNumber(this.start) >= this.getViewNumber(this.depth)) {
                    this.selectDate(e, d, null, value);
                }
                else {
                    this.currentDate.setFullYear(d.getFullYear());
                    this.effect = ZOOMIN;
                    detach(this.tableBodyElement);
                    this.renderYears(e);
                }
        }
    }
    switchView(view, e) {
        switch (view) {
            case 0:
                detach(this.tableBodyElement);
                this.renderMonths(e);
                break;
            case 1:
                detach(this.tableBodyElement);
                this.renderYears(e);
                break;
            case 2:
                detach(this.tableBodyElement);
                this.renderDecades(e);
        }
    }
    /**
     * To get component name
     * @private
     */
    getModuleName() {
        return 'calendar';
    }
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    getPersistData() {
        let keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        this.effect = '';
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        if (this.getModuleName() === 'calendar') {
                            this.element.classList.add('e-rtl');
                        }
                        else {
                            this.calendarElement.classList.add('e-rtl');
                        }
                    }
                    else {
                        if (this.getModuleName() === 'calendar') {
                            this.element.classList.remove('e-rtl');
                        }
                        else {
                            this.calendarElement.classList.remove('e-rtl');
                        }
                    }
                    break;
                case 'min':
                case 'max':
                    prop === 'min' ? this.setProperties({ min: this.checkDateValue(new Date('' + newProp.min)) }, true) :
                        this.setProperties({ max: this.checkDateValue(new Date('' + newProp.max)) }, true);
                    this.setProperties({ start: this.currentView() }, true);
                    detach(this.tableBodyElement);
                    this.minMaxUpdate();
                    this.createContentBody();
                    if ((this.todayDate < this.min || this.max < this.todayDate) && (this.footer) && (this.todayElement)) {
                        detach(this.todayElement);
                        detach(this.footer);
                        this.todayElement = this.footer = undefined;
                        this.createContentFooter();
                    }
                    else {
                        if (this.todayElement.classList.contains('e-disabled') && (this.footer) && (this.todayElement)) {
                            removeClass([this.todayElement], DISABLED);
                        }
                    }
                    break;
                case 'start':
                case 'weekNumber':
                case 'firstDayOfWeek':
                    this.createContentHeader();
                    this.createContentBody();
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.createContentHeader();
                    this.createContentBody();
                    this.l10.setLocale(this.locale);
                    this.updateFooter();
                    break;
                case 'showTodayButton':
                    if (newProp.showTodayButton) {
                        this.createContentFooter();
                    }
                    else {
                        detach(this.todayElement);
                        detach(this.footer);
                        this.todayElement = this.footer = undefined;
                    }
                    this.setProperties({ showTodayButton: newProp.showTodayButton }, true);
                    break;
            }
        }
    }
    setValueUpdate() {
        detach(this.tableBodyElement);
        this.setProperties({ start: this.currentView() }, true);
        this.createContentBody();
    }
    titleUpdate(date, view) {
        let globalize = new Internationalization(this.locale);
        switch (view) {
            case 'days':
                this.headerTitleElement.textContent = globalize.formatDate(date, { type: 'dateTime', skeleton: 'yMMMM' });
                break;
            case 'months':
                this.headerTitleElement.textContent = globalize.formatDate(date, { type: 'dateTime', skeleton: 'y' });
        }
    }
    setActiveDescendant() {
        let id;
        let focusedEle = this.tableBodyElement.querySelector('tr td.e-focused-date');
        let selectedEle = this.tableBodyElement.querySelector('tr td.e-selected');
        let title = this.globalize.formatDate(this.currentDate, { type: 'date', skeleton: 'full' });
        if (selectedEle || focusedEle) {
            (focusedEle || selectedEle).setAttribute('aria-selected', 'true');
            (focusedEle || selectedEle).setAttribute('aria-label', 'The current focused date is ' + '' + title);
            id = (focusedEle || selectedEle).getAttribute('id');
        }
        return id;
    }
    iconHandler() {
        new Date('' + this.currentDate).setDate(1);
        switch (this.currentView()) {
            case 'Month':
                this.previousIconHandler(this.compareMonth(new Date('' + this.currentDate), this.min) < 1);
                this.nextIconHandler(this.compareMonth(new Date('' + this.currentDate), this.max) > -1);
                break;
            case 'Year':
                this.previousIconHandler(this.compareYear(new Date('' + this.currentDate), this.min) < 1);
                this.nextIconHandler(this.compareYear(new Date('' + this.currentDate), this.max) > -1);
                break;
            case 'Decade':
                this.previousIconHandler(this.compareDecade(new Date('' + this.currentDate), this.min) < 1);
                this.nextIconHandler(this.compareDecade(new Date('' + this.currentDate), this.max) > -1);
        }
    }
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy() {
        if (this.getModuleName() === 'calendar') {
            removeClass([this.element], [ROOT]);
        }
        else {
            if (this.calendarElement) {
                removeClass([this.element], [ROOT]);
            }
        }
        if (this.getModuleName() === 'calendar') {
            EventHandler.remove(this.headerTitleElement, 'click', this.navigateTitle);
            if (this.todayElement) {
                EventHandler.remove(this.todayElement, 'click', this.todayButtonClick);
            }
            this.previousIconHandler(true);
            this.nextIconHandler(true);
            this.keyboardModule.destroy();
            this.element.removeAttribute('data-role');
        }
        this.element.innerHTML = '';
        super.destroy();
    }
    title(e) {
        let currentView = this.getViewNumber(this.currentView());
        this.effect = ZOOMIN;
        this.switchView(++currentView, e);
    }
    getViewNumber(stringVal) {
        if (stringVal === 'Month') {
            return 0;
        }
        else if (stringVal === 'Year') {
            return 1;
        }
        else {
            return 2;
        }
    }
    navigateTitle(e) {
        e.preventDefault();
        this.title(e);
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    }
    previous() {
        this.effect = '';
        let currentView = this.getViewNumber(this.currentView());
        switch (this.currentView()) {
            case 'Month':
                this.addMonths(this.currentDate, -1);
                this.switchView(currentView);
                break;
            case 'Year':
                this.addYears(this.currentDate, -1);
                this.switchView(currentView);
                break;
            case 'Decade':
                this.addYears(this.currentDate, -10);
                this.switchView(currentView);
                break;
        }
    }
    navigatePrevious(e) {
        e.preventDefault();
        this.previous();
        this.triggerNavigate(e);
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    }
    next() {
        this.effect = '';
        let currentView = this.getViewNumber(this.currentView());
        switch (this.currentView()) {
            case 'Month':
                this.addMonths(this.currentDate, 1);
                this.switchView(currentView);
                break;
            case 'Year':
                this.addYears(this.currentDate, 1);
                this.switchView(currentView);
                break;
            case 'Decade':
                this.addYears(this.currentDate, 10);
                this.switchView(currentView);
                break;
        }
    }
    navigateNext(eve) {
        eve.preventDefault();
        this.next();
        this.triggerNavigate(eve);
        if (this.getModuleName() === 'calendar') {
            this.table.focus();
        }
    }
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    navigateTo(view, date) {
        if (+date >= +this.min && +date <= +this.max) {
            this.currentDate = date;
        }
        if (+date <= +this.min) {
            this.currentDate = new Date('' + this.min);
        }
        if (+date >= +this.max) {
            this.currentDate = new Date('' + this.max);
        }
        if (this.getModuleName() === 'daterangepicker') {
            this.currentDate = date;
        }
        if ((this.getViewNumber(this.depth) >= this.getViewNumber(view))) {
            if ((this.getViewNumber(this.depth) <= this.getViewNumber(this.start))
                || this.getViewNumber(this.depth) === this.getViewNumber(view)) {
                view = this.depth;
            }
        }
        this.switchView(this.getViewNumber(view));
    }
    /**
     * Gets the current view of the Calendar.
     * @returns string
     */
    currentView() {
        if (this.contentElement.classList.contains(YEAR)) {
            return 'Year';
        }
        else if (this.contentElement.classList.contains(DECADE)) {
            return 'Decade';
        }
        else {
            return 'Month';
        }
    }
    getDateVal(date, value) {
        return (!isNullOrUndefined(value) && date.getDate() === (value).getDate()
            && date.getMonth() === (value).getMonth() && date.getFullYear() === (value).getFullYear());
    }
    getCultureObjects(ld, c) {
        return getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.days.format.short', ld);
    }
    ;
    getWeek(d) {
        let currentDate = new Date('' + d).valueOf();
        let date = new Date(d.getFullYear(), 0, 1).valueOf();
        let a = (currentDate - date);
        return Math.ceil((((a) / dayMilliSeconds) + new Date(date).getDay() + 1) / 7);
    }
    setStartDate(date, time) {
        let tzOffset = date.getTimezoneOffset();
        let d = new Date(date.getTime() + time);
        let tzOffsetDiff = d.getTimezoneOffset() - tzOffset;
        date.setTime(d.getTime() + tzOffsetDiff * minutesMilliSeconds);
    }
    addMonths(date, i) {
        let day = date.getDate();
        date.setDate(1);
        date.setMonth(date.getMonth() + i);
        date.setDate(Math.min(day, this.getMaxDays(date)));
    }
    addYears(date, i) {
        let day = date.getDate();
        date.setDate(1);
        date.setFullYear(date.getFullYear() + i);
        date.setDate(Math.min(day, this.getMaxDays(date)));
    }
    getIdValue(e, element) {
        let eve;
        if (e) {
            eve = e.currentTarget;
        }
        else {
            eve = element;
        }
        let dateFormatOptions = { type: 'dateTime', skeleton: 'full' };
        let dateString = this.globalize.formatDate(new Date(parseInt('' + eve.getAttribute('id'), 0)), dateFormatOptions);
        let date = this.globalize.parseDate(dateString, dateFormatOptions);
        let value = date.valueOf() - date.valueOf() % 1000;
        return new Date(value);
        //return this.globalize.parseDate(dateString, dateFormatOptions);
    }
    selectDate(e, date, node, value) {
        let element = node || e.currentTarget;
        if (this.currentView() === 'Decade') {
            this.setDateDecade(this.currentDate, date.getFullYear());
        }
        else if (this.currentView() === 'Year') {
            this.setDateYear(this.currentDate, date);
        }
        else {
            this.setProperties({ value: new Date('' + date) }, true);
            this.currentDate = new Date('' + date);
        }
        let tableBodyElement = closest(element, '.' + ROOT);
        if (isNullOrUndefined(tableBodyElement)) {
            tableBodyElement = this.tableBodyElement;
        }
        if (!isNullOrUndefined(tableBodyElement.querySelector('.' + SELECTED))) {
            removeClass([tableBodyElement.querySelector('.' + SELECTED)], SELECTED);
        }
        if (!isNullOrUndefined(tableBodyElement.querySelector('.' + FOCUSEDDATE))) {
            removeClass([tableBodyElement.querySelector('.' + FOCUSEDDATE)], FOCUSEDDATE);
        }
        addClass([element], SELECTED);
    }
    setAriaActiveDescendant() {
        attributes(this.table, {
            'aria-activedescendant': '' + this.setActiveDescendant()
        });
    }
    previousIconHandler(disabled) {
        if (disabled) {
            EventHandler.remove(this.previousIcon, 'click', this.navigatePreviousHandler);
            addClass([this.previousIcon], '' + DISABLED);
            addClass([this.previousIcon], '' + OVERLAY);
            this.previousIcon.setAttribute('aria-disabled', 'true');
        }
        else {
            EventHandler.add(this.previousIcon, 'click', this.navigatePreviousHandler);
            removeClass([this.previousIcon], '' + DISABLED);
            removeClass([this.previousIcon], '' + OVERLAY);
            this.previousIcon.setAttribute('aria-disabled', 'false');
        }
    }
    renderDayCellEvent(args) {
        extend(this.renderDayCellArgs, { name: 'renderDayCell' });
        this.trigger('renderDayCell', args);
    }
    navigatedEvent(eve) {
        extend(this.navigatedArgs, { name: 'navigated', event: eve });
        this.trigger('navigated', this.navigatedArgs);
    }
    triggerNavigate(event) {
        this.navigatedArgs = { view: this.currentView(), date: this.currentDate };
        this.navigatedEvent(event);
    }
    nextIconHandler(disabled) {
        if (disabled) {
            EventHandler.remove(this.nextIcon, 'click', this.navigateNextHandler);
            addClass([this.nextIcon], DISABLED);
            addClass([this.nextIcon], OVERLAY);
            this.nextIcon.setAttribute('aria-disabled', 'true');
        }
        else {
            EventHandler.add(this.nextIcon, 'click', this.navigateNextHandler);
            removeClass([this.nextIcon], DISABLED);
            removeClass([this.nextIcon], OVERLAY);
            this.nextIcon.setAttribute('aria-disabled', 'false');
        }
    }
    compare(startDate, endDate, modifier) {
        let start = endDate.getFullYear();
        let end;
        let result;
        end = start;
        result = 0;
        if (modifier) {
            start = start - start % modifier;
            end = start - start % modifier + modifier - 1;
        }
        if (startDate.getFullYear() > end) {
            result = 1;
        }
        else if (startDate.getFullYear() < start) {
            result = -1;
        }
        return result;
    }
    isMinMaxRange(date) {
        return +date >= +this.min && +date <= +this.max;
    }
    compareYear(start, end) {
        return this.compare(start, end, 0);
    }
    compareDecade(start, end) {
        return this.compare(start, end, 10);
    }
    shiftArray(array, i) {
        return array.slice(i).concat(array.slice(0, i));
    }
    addDay(date, i, e, max, min) {
        let column = i;
        let value = new Date(+date);
        if (!isNullOrUndefined(this.tableBodyElement) && !isNullOrUndefined(e)) {
            while (this.findNextTD(new Date(+date), column, max, min)) {
                column += i;
            }
            let rangeValue = new Date(value.setDate(value.getDate() + column));
            column = (+rangeValue > +max || +rangeValue < +min) ? column === i ? i - i : i : column;
        }
        date.setDate(date.getDate() + column);
    }
    findNextTD(date, column, max, min) {
        let value = new Date(date.setDate(date.getDate() + column));
        let collection = [];
        let isDisabled = false;
        if ((!isNullOrUndefined(value) && value.getMonth()) === (!isNullOrUndefined(this.currentDate) && this.currentDate.getMonth())) {
            let tdEles = this.renderDays(value, null);
            collection = tdEles.filter((element) => {
                return element.classList.contains(DISABLED);
            });
        }
        else {
            collection = this.tableBodyElement.querySelectorAll('td.' + DISABLED);
        }
        if (+value <= (+(max)) && +value >= (+(min))) {
            if (collection.length) {
                for (let i = 0; i < collection.length; i++) {
                    isDisabled = (+value === +new Date(parseInt(collection[i].id, 0))) ? true : false;
                    if (isDisabled) {
                        break;
                    }
                }
            }
        }
        return isDisabled;
    }
    getMaxDays(d) {
        let date;
        let month;
        let tmpDate = new Date('' + d);
        date = 28;
        month = tmpDate.getMonth();
        while (tmpDate.getMonth() === month) {
            ++date;
            tmpDate.setDate(date);
        }
        return date - 1;
    }
    setDateDecade(date, year) {
        date.setFullYear(year);
        this.setProperties({ value: new Date('' + date) }, true);
    }
    ;
    setDateYear(date, value) {
        date.setFullYear(value.getFullYear(), value.getMonth(), date.getDate());
        if (value.getMonth() !== date.getMonth()) {
            date.setDate(0);
        }
        this.setProperties({ value: new Date('' + date) }, true);
        this.currentDate = new Date('' + value);
    }
    compareMonth(start, end) {
        let result;
        if (start.getFullYear() > end.getFullYear()) {
            result = 1;
        }
        else if (start.getFullYear() < end.getFullYear()) {
            result = -1;
        }
        else {
            result = start.getMonth() === end.getMonth() ? 0 : start.getMonth() > end.getMonth() ? 1 : -1;
        }
        return result;
    }
};
__decorate([
    Property(new Date(1900, 0, 1))
], CalendarBase.prototype, "min", void 0);
__decorate([
    Property(new Date(2099, 11, 31))
], CalendarBase.prototype, "max", void 0);
__decorate([
    Property(0)
], CalendarBase.prototype, "firstDayOfWeek", void 0);
__decorate([
    Property('Month')
], CalendarBase.prototype, "start", void 0);
__decorate([
    Property('Month')
], CalendarBase.prototype, "depth", void 0);
__decorate([
    Property(false)
], CalendarBase.prototype, "weekNumber", void 0);
__decorate([
    Property(true)
], CalendarBase.prototype, "showTodayButton", void 0);
__decorate([
    Event()
], CalendarBase.prototype, "created", void 0);
__decorate([
    Event()
], CalendarBase.prototype, "destroyed", void 0);
__decorate([
    Event()
], CalendarBase.prototype, "navigated", void 0);
__decorate([
    Event()
], CalendarBase.prototype, "renderDayCell", void 0);
CalendarBase = __decorate([
    NotifyPropertyChanges
], CalendarBase);
/**
 * Represents the Calendar component that allows the user to select a date.
 * ```html
 * <div id="calendar"/>
 * ```
 * ```typescript
 * <script>
 *   var calendarObj = new Calendar({ value: new Date() });
 *   calendarObj.appendTo("#calendar");
 * </script>
 * ```
 */
let Calendar = class Calendar extends CalendarBase {
    /**
     * Initialized new instance of Calendar Class.
     * Constructor for creating the widget
     * @param  {CalendarModel} options?
     * @param  {string|HTMLElement} element?
     */
    constructor(options, element) {
        super(options, element);
    }
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    render() {
        this.validateDate();
        this.minMaxUpdate();
        super.render();
    }
    validateDate() {
        if (typeof this.value === 'string') {
            this.setProperties({ value: this.checkDateValue(new Date('' + this.value)) }, true); // persist the value property.
        }
        super.validateDate(this.value);
        if (!isNullOrUndefined(this.value) && this.min <= this.max && this.value >= this.min && this.value <= this.max) {
            this.currentDate = new Date('' + this.value);
        }
        if (isNaN(+this.value)) {
            this.setProperties({ value: null }, true);
        }
    }
    minMaxUpdate() {
        if (this.getModuleName() === 'calendar') {
            if (!isNullOrUndefined(this.value) && this.value <= this.min && this.min <= this.max) {
                this.setProperties({ value: this.min }, true);
                this.changedArgs = { value: this.value };
            }
            else {
                if (!isNullOrUndefined(this.value) && this.value >= this.max && this.min <= this.max) {
                    this.setProperties({ value: this.max }, true);
                    this.changedArgs = { value: this.value };
                }
            }
        }
        if (this.getModuleName() !== 'calendar') {
            if (!isNullOrUndefined(this.value) && this.value < this.min && this.min <= this.max) {
                super.minMaxUpdate(this.min);
            }
            else {
                if (!isNullOrUndefined(this.value) && this.value > this.max && this.min <= this.max) {
                    super.minMaxUpdate(this.max);
                }
            }
        }
        else {
            super.minMaxUpdate(this.value);
        }
    }
    todayButtonClick() {
        if (this.showTodayButton) {
            let tempValue = new Date();
            if (this.value) {
                tempValue.setHours(this.value.getHours());
                tempValue.setMinutes(this.value.getMinutes());
                tempValue.setSeconds(this.value.getSeconds());
            }
            else {
                tempValue = new Date(tempValue.getFullYear(), tempValue.getMonth(), tempValue.getDate(), 0, 0, 0);
            }
            this.setProperties({ value: tempValue }, true);
            super.todayButtonClick(new Date(+this.value));
        }
    }
    keyActionHandle(e) {
        super.keyActionHandle(e, this.value);
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        this.changeHandler = (e) => {
            this.triggerChange(e);
        };
        super.preRender(this.value);
    }
    ;
    createContent() {
        this.previousDate = this.value;
        super.createContent();
    }
    minMaxDate(localDate) {
        return super.minMaxDate(localDate);
    }
    renderMonths(e) {
        super.renderMonths(e, this.value);
    }
    renderDays(currentDate, e) {
        return super.renderDays(currentDate, e, this.value);
    }
    renderYears(e) {
        super.renderYears(e, this.value);
    }
    renderDecades(e) {
        super.renderDecades(e, this.value);
    }
    renderTemplate(elements, count, classNm, e) {
        super.renderTemplate(elements, count, classNm, e, this.value);
        this.changedArgs = { value: this.value };
        this.changeHandler();
    }
    clickHandler(e) {
        let eve = e.currentTarget;
        if (eve.classList.contains(OTHERMONTH)) {
            this.value = this.getIdValue(e, null);
        }
        super.clickHandler(e, this.value);
    }
    switchView(view, e) {
        super.switchView(view, e);
    }
    /**
     * To get component name
     * @private
     */
    getModuleName() {
        super.getModuleName();
        return 'calendar';
    }
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    getPersistData() {
        super.getPersistData();
        let keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        this.effect = '';
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    if (typeof newProp.value === 'string') {
                        this.setProperties({ value: new Date('' + newProp.value) }, true);
                    }
                    else {
                        newProp.value = new Date('' + newProp.value);
                    }
                    if (isNaN(+this.value)) {
                        this.setProperties({ value: oldProp.value }, true);
                    }
                    this.validateDate();
                    this.minMaxUpdate();
                    super.setValueUpdate();
                    break;
                default:
                    super.onPropertyChanged(newProp, oldProp);
            }
        }
    }
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy() {
        super.destroy();
    }
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    navigateTo(view, date) {
        this.minMaxUpdate();
        super.navigateTo(view, date);
    }
    /**
     * Gets the current view of the Calendar.
     * @returns string
     */
    currentView() {
        return super.currentView();
    }
    selectDate(e, date, element) {
        super.selectDate(e, date, element, this.value);
        this.changedArgs = { value: this.value };
        this.changeHandler(e);
    }
    changeEvent(e) {
        this.trigger('change', this.changedArgs);
        this.previousDate = new Date(+this.value);
    }
    triggerChange(e) {
        this.changedArgs.event = this.changedArgs.e = e || null;
        this.changedArgs.isInteracted = !isNullOrUndefined(e);
        if (!isNullOrUndefined(this.value)) {
            this.setProperties({ value: this.value }, true);
        }
        if (+this.value !== Number.NaN && +this.value !== +this.previousDate) {
            this.changeEvent(e);
        }
    }
};
__decorate([
    Property(null)
], Calendar.prototype, "value", void 0);
__decorate([
    Event()
], Calendar.prototype, "change", void 0);
Calendar = __decorate([
    NotifyPropertyChanges
], Calendar);

/**
 * Calendar modules
 */

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../calendar/calendar-model.d.ts'/>
//class constant defination
const DATEWRAPPER = 'e-date-wrapper';
const ROOT$1 = 'e-datepicker';
const POPUPWRAPPER = 'e-popup-wrapper';
const INPUTWRAPPER = 'e-input-group-icon';
const POPUP = 'e-popup';
const INPUTCONTAINER = 'e-input-group';
const INPUTFOCUS = 'e-input-focus';
const INPUTROOT = 'e-input';
const ERROR = 'e-error';
const ACTIVE = 'e-active';
const OVERFLOW = 'e-date-overflow';
const DATEICON = 'e-date-icon';
const ICONS = 'e-icons';
const OPENDURATION = 300;
const OFFSETVALUE = 4;
/**
 * Represents the DatePicker component that allows user to select
 * or enter a date value.
 * ```html
 * <input id="datepicker"/>
 * ```
 * ```typescript
 * <script>
 *   var datePickerObject = new DatePicker({ value: new Date() });
 *   datePickerObject.appendTo("#datepicker");
 * </script>
 * ```
 */
let DatePicker = class DatePicker extends Calendar {
    /**
     * Constructor for creating the widget.
     */
    constructor(options, element) {
        super(options, element);
        this.previousElementValue = '';
        this.isDateIconClicked = false;
        this.keyConfigs = {
            altUpArrow: 'alt+uparrow',
            altDownArrow: 'alt+downarrow',
            escape: 'escape',
            enter: 'enter',
            controlUp: 'ctrl+38',
            controlDown: 'ctrl+40',
            moveDown: 'downarrow',
            moveUp: 'uparrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            select: 'enter',
            home: 'home',
            end: 'end',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            shiftPageUp: 'shift+pageup',
            shiftPageDown: 'shift+pagedown',
            controlHome: 'ctrl+home',
            controlEnd: 'ctrl+end',
            tab: 'tab'
        };
        this.calendarKeyConfigs = {
            escape: 'escape',
            enter: 'enter',
            tab: 'tab'
        };
    }
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    render() {
        this.initialize();
        this.bindEvents();
    }
    initialize() {
        this.createInput();
        this.updateInput();
        this.previousElementValue = this.inputElement.value;
        this.previousDate = new Date(+this.value);
    }
    createInput() {
        let ariaAttrs = {
            'aria-live': 'assertive', 'aria-atomic': 'true',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        };
        if (this.getModuleName() === 'datepicker') {
            let l10nLocale = { placeholder: null };
            this.globalize = new Internationalization(this.locale);
            this.l10n = new L10n('datepicker', l10nLocale, this.locale);
            this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        }
        this.inputWrapper = Input.createInput({
            element: this.inputElement,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: this.cssClass,
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
            },
            buttons: [INPUTWRAPPER + ' ' + DATEICON + ' ' + ICONS]
        });
        this.setWidth(this.width);
        if (this.inputElement.name !== '') {
            this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute('name'));
        }
        else {
            this.inputElement.setAttribute('name', '' + this.element.id);
        }
        attributes(this.inputElement, ariaAttrs);
        if (!this.enabled) {
            this.inputElement.setAttribute('aria-disabled', 'true');
        }
        else {
            this.inputElement.setAttribute('aria-disabled', 'false');
        }
        Input.addAttributes({ 'aria-label': 'select' }, this.inputWrapper.buttons[0]);
        addClass([this.inputWrapper.container], DATEWRAPPER);
    }
    updateInput() {
        if (this.value && !this.isCalendar()) {
            this.disabledDates();
        }
        if (+new Date('' + this.value)) {
            if (typeof this.value === 'string') {
                this.value = this.checkDateValue(new Date('' + this.value));
                let dateOptions;
                if (this.getModuleName() === 'datetimepicker') {
                    dateOptions = {
                        format: !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat,
                        type: 'dateTime', skeleton: 'yMd'
                    };
                }
                else {
                    dateOptions = { format: this.format, type: 'dateTime', skeleton: 'yMd' };
                }
                let dateString = this.globalize.formatDate(this.value, dateOptions);
                this.setProperties({ value: this.globalize.parseDate(dateString, dateOptions) }, true);
            }
        }
        else {
            this.setProperties({ value: null }, true);
        }
        if (this.strictMode) {
            //calls the Calendar processDate protected method to update the date value according to the strictMode true behaviour.
            super.validateDate();
            this.minMaxUpdates();
            super.minMaxUpdate();
        }
        if (!isNullOrUndefined(this.value)) {
            let dateValue = this.value;
            let dateString;
            let tempFormat = !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat;
            if (this.getModuleName() === 'datetimepicker') {
                dateString = this.globalize.formatDate(this.value, { format: tempFormat, type: 'dateTime', skeleton: 'yMd' });
            }
            else {
                dateString = this.globalize.formatDate(this.value, { format: this.format, type: 'dateTime', skeleton: 'yMd' });
            }
            if ((+dateValue <= +this.max) && (+dateValue >= +this.min)) {
                Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
            }
            else {
                let value = (+dateValue >= +this.max || !+this.value) || (!+this.value || +dateValue <= +this.min);
                if (!this.strictMode && value) {
                    Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
                }
            }
        }
        if (isNullOrUndefined(this.value) && this.strictMode) {
            Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        }
        this.changedArgs = { value: this.value };
        this.errorClass();
    }
    ;
    minMaxUpdates() {
        if (!isNullOrUndefined(this.value) && this.value < this.min && this.min <= this.max && this.strictMode) {
            this.setProperties({ value: this.min }, true);
            this.changedArgs = { value: this.value };
        }
        else {
            if (!isNullOrUndefined(this.value) && this.value > this.max && this.min <= this.max && this.strictMode) {
                this.setProperties({ value: this.max }, true);
                this.changedArgs = { value: this.value };
            }
        }
    }
    bindEvents() {
        if (this.enabled) {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateIconHandler, this);
            EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
            EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
            // To prevent the twice triggering.
            EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
            if (this.showClearButton) {
                EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
            }
        }
        else {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateIconHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
            if (this.showClearButton) {
                EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
            }
        }
        this.keyboardModules = new KeyboardEvents(this.inputElement, {
            eventName: 'keydown',
            keyAction: this.inputKeyActionHandle.bind(this),
            keyConfigs: this.keyConfigs
        });
    }
    inputChangeHandler(e) {
        e.stopPropagation();
    }
    bindClearEvent() {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    }
    resetHandler(e) {
        e.preventDefault();
        this.clear(e);
    }
    clear(event) {
        this.setProperties({ value: null }, true);
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        this.updateInput();
        this.changeEvent(event);
    }
    dateIconHandler(e) {
        e.preventDefault();
        if (!this.readonly) {
            if (this.isCalendar()) {
                this.hide(e);
            }
            else {
                this.isDateIconClicked = true;
                this.show(null, e);
                if (!Browser.isDevice) {
                    if (this.getModuleName() === 'datetimepicker') {
                        this.inputElement.focus();
                    }
                    this.inputElement.focus();
                    addClass([this.inputWrapper.container], [INPUTFOCUS]);
                }
                addClass(this.inputWrapper.buttons, ACTIVE);
            }
        }
    }
    CalendarKeyActionHandle(e) {
        switch (e.action) {
            case 'escape':
                if (this.isCalendar()) {
                    this.hide(e);
                }
                else {
                    this.inputWrapper.container.children[this.index].blur();
                }
                break;
            case 'enter':
                if (!this.isCalendar()) {
                    this.show(null, e);
                }
                else {
                    if (+this.value !== +this.currentDate && !this.isCalendar()) {
                        this.inputWrapper.container.children[this.index].focus();
                    }
                }
                if (this.getModuleName() === 'datetimepicker') {
                    this.inputElement.focus();
                }
                break;
            case 'tab':
                this.hide(e);
        }
    }
    inputFocusHandler() {
        let focusArguments = {
            model: this
        };
        this.isDateIconClicked = false;
        this.trigger('focus', focusArguments);
    }
    inputBlurHandler(e) {
        this.strictModeUpdate();
        this.updateInput();
        this.changeTrigger(e);
        this.errorClass();
        if (this.isCalendar() && document.activeElement === this.inputElement) {
            this.hide(e);
        }
        if (this.getModuleName() === 'datepicker') {
            let blurArguments = {
                model: this
            };
            this.trigger('blur', blurArguments);
        }
        if (this.isCalendar()) {
            this.calendarKeyboardModules = new KeyboardEvents(this.calendarElement.children[1].firstElementChild, {
                eventName: 'keydown',
                keyAction: this.CalendarKeyActionHandle.bind(this),
                keyConfigs: this.calendarKeyConfigs
            });
        }
    }
    documentHandler(e) {
        if (!Browser.isDevice) {
            e.preventDefault();
        }
        let target = e.target;
        if (!(closest(target, '.e-datepicker.e-popup-wrapper'))
            && !(closest(target, '.' + INPUTCONTAINER) === this.inputWrapper.container)
            && (!target.classList.contains('e-day'))) {
            this.hide(e);
        }
    }
    inputKeyActionHandle(e) {
        switch (e.action) {
            case 'altUpArrow':
                this.hide(e);
                this.inputElement.focus();
                break;
            case 'altDownArrow':
                this.strictModeUpdate();
                this.updateInput();
                if (this.getModuleName() === 'datepicker') {
                    this.show(null, e);
                }
                break;
            case 'escape':
                this.hide(e);
                break;
            case 'enter':
                this.strictModeUpdate();
                this.updateInput();
                this.changeTrigger(e);
                this.errorClass();
                if (!this.isCalendar() && document.activeElement === this.inputElement) {
                    this.hide(e);
                }
                break;
            case 'tab':
                this.strictModeUpdate();
                this.updateInput();
                this.changeTrigger(e);
                this.errorClass();
                this.hide(e);
                break;
            default:
                this.previousDate = (!isNullOrUndefined(this.value) && new Date('' + this.value) || null);
                if (this.isCalendar()) {
                    super.keyActionHandle(e);
                }
        }
    }
    strictModeUpdate() {
        let format;
        if (this.getModuleName() === 'datetimepicker') {
            format = !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat;
        }
        else {
            format = isNullOrUndefined(this.format) ? this.format : this.format.replace('dd', 'd');
        }
        if (!isNullOrUndefined(format)) {
            let len = format.split('M').length - 1;
            if (len < 3) {
                format = format.replace('MM', 'M');
            }
        }
        let dateOptions;
        if (this.getModuleName() === 'datetimepicker') {
            dateOptions = {
                format: !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat,
                type: 'dateTime', skeleton: 'yMd'
            };
        }
        else {
            dateOptions = { format: format, type: 'dateTime', skeleton: 'yMd' };
        }
        let date = this.globalize.parseDate(this.inputElement.value, dateOptions);
        if (this.strictMode && date) {
            Input.setValue(this.globalize.formatDate(date, dateOptions), this.inputElement, this.floatLabelType, this.showClearButton);
            if (this.inputElement.value !== this.previousElementValue) {
                this.setProperties({ value: date }, true);
            }
        }
        else if (!this.strictMode) {
            if (this.inputElement.value !== this.previousElementValue) {
                this.setProperties({ value: date }, true);
            }
        }
        if (this.strictMode && !date && this.inputElement.value === '') {
            this.setProperties({ value: null }, true);
        }
        if (isNaN(+this.value)) {
            this.setProperties({ value: null }, true);
        }
        if (isNullOrUndefined(this.value)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
        }
    }
    createCalendar() {
        this.popupWrapper = createElement('div', { className: '' + ROOT$1 + ' ' + POPUPWRAPPER });
        if (!isNullOrUndefined(this.cssClass)) {
            this.popupWrapper.classList.add(this.cssClass);
        }
        document.body.appendChild(this.popupWrapper);
        if (Browser.isDevice) {
            this.modelHeader();
            this.modal = createElement('div');
            this.modal.className = '' + ROOT$1 + ' e-date-modal';
            document.body.className += ' ' + OVERFLOW;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
        //this.calendarElement represent the Calendar object from the Calendar class.
        this.calendarElement.querySelector('table tbody').className = '';
        this.popupObj = new Popup(this.popupWrapper, {
            content: this.calendarElement,
            relateTo: Browser.isDevice ? document.body : this.inputWrapper.container,
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            offsetY: OFFSETVALUE,
            targetType: 'container',
            enableRtl: this.enableRtl,
            zIndex: this.zIndex,
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            open: () => {
                if (this.getModuleName() !== 'datetimepicker') {
                    if (document.activeElement !== this.inputElement && !Browser.isDevice) {
                        this.calendarElement.children[1].firstElementChild.focus();
                        this.calendarKeyboardModules = new KeyboardEvents(this.calendarElement.children[1].firstElementChild, {
                            eventName: 'keydown',
                            keyAction: this.CalendarKeyActionHandle.bind(this),
                            keyConfigs: this.calendarKeyConfigs
                        });
                        this.calendarKeyboardModules = new KeyboardEvents(this.inputWrapper.container.children[this.index], {
                            eventName: 'keydown',
                            keyAction: this.CalendarKeyActionHandle.bind(this),
                            keyConfigs: this.calendarKeyConfigs
                        });
                    }
                }
            }, close: () => {
                if (!Browser.isDevice) {
                    if (this.isDateIconClicked) {
                        this.inputWrapper.container.children[this.index].focus();
                    }
                }
                if (this.value) {
                    this.disabledDates();
                }
                if (this.popupObj) {
                    this.popupObj.destroy();
                }
                detach(this.popupWrapper);
                this.popupObj = this.popupWrapper = null;
                this.setAriaAttributes();
            }
        });
        this.popupObj.element.classList.add(this.cssClass);
        this.setAriaAttributes();
    }
    modelHeader() {
        let modelHeader = createElement('div', { className: 'e-model-header' });
        let yearHeading = createElement('h1', { className: 'e-model-year' });
        let h2 = createElement('div');
        let daySpan = createElement('span', { className: 'e-model-day' });
        let monthSpan = createElement('span', { className: 'e-model-month' });
        yearHeading.textContent = '' + this.globalize.formatDate(this.value || new Date(), { format: 'y', skeleton: 'dateTime' });
        daySpan.textContent = '' + this.globalize.formatDate(this.value || new Date(), { format: 'E', skeleton: 'dateTime' }) + ', ';
        monthSpan.textContent = '' + this.globalize.formatDate(this.value || new Date(), { format: 'MMM d', skeleton: 'dateTime' });
        modelHeader.appendChild(yearHeading);
        h2.appendChild(daySpan);
        h2.appendChild(monthSpan);
        modelHeader.appendChild(h2);
        this.calendarElement.insertBefore(modelHeader, this.calendarElement.firstElementChild);
    }
    changeTrigger(e) {
        if (this.inputElement.value !== this.previousElementValue) {
            if (((this.previousDate && this.previousDate.valueOf()) !== (this.value && this.value.valueOf()))) {
                this.changedArgs.value = this.value;
                this.changedArgs.event = this.changedArgs.e = e || null;
                this.changedArgs.element = this.element;
                this.changedArgs.isInteracted = !isNullOrUndefined(e);
                this.trigger('change', this.changedArgs);
                this.previousElementValue = this.inputElement.value;
                this.previousDate = new Date('' + this.value);
            }
        }
    }
    navigatedEvent() {
        this.trigger('navigated', this.navigatedArgs);
    }
    changeEvent(e) {
        this.selectCalendar(e);
        this.changedArgs.e = this.changedArgs.event = e;
        this.changedArgs.element = this.element;
        this.changedArgs.isInteracted = !isNullOrUndefined(e);
        this.trigger('change', this.changedArgs);
        this.previousDate = this.value && new Date(+this.value);
        this.hide(e);
        this.previousElementValue = this.inputElement.value;
        this.errorClass();
    }
    selectCalendar(e) {
        let date;
        let tempFormat;
        if (this.getModuleName() === 'datetimepicker') {
            tempFormat = !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat;
        }
        else {
            tempFormat = this.format;
        }
        if (this.value) {
            if (this.getModuleName() === 'datetimepicker') {
                date = this.globalize.formatDate(this.changedArgs.value, { format: tempFormat, type: 'dateTime', skeleton: 'yMd' });
            }
            else {
                date = this.globalize.formatDate(this.changedArgs.value, { format: this.format, type: 'dateTime', skeleton: 'yMd' });
            }
        }
        if (!isNullOrUndefined(date)) {
            Input.setValue(date, this.inputElement, this.floatLabelType, this.showClearButton);
        }
    }
    isCalendar() {
        if (this.popupWrapper && this.popupWrapper.classList.contains('' + POPUPWRAPPER)) {
            return true;
        }
        return false;
    }
    setWidth(width) {
        if (typeof width === 'number') {
            this.inputWrapper.container.style.width = formatUnit(this.width);
        }
        else if (typeof width === 'string') {
            this.inputWrapper.container.style.width = (width.match(/px|%|em/)) ? (this.width) : (formatUnit(this.width));
        }
        else {
            this.inputWrapper.container.style.width = '100%';
        }
    }
    /**
     * Shows the Calendar.
     * @returns void
     */
    show(type, e) {
        if ((this.enabled && this.readonly) || !this.enabled || this.popupObj) {
            return;
        }
        else {
            let prevent = true;
            let outOfRange;
            if (!isNullOrUndefined(this.value) && !(+this.value >= +this.min && +this.value <= +this.max)) {
                outOfRange = new Date('' + this.value);
                this.setProperties({ 'value': null }, true);
            }
            else {
                outOfRange = this.value || null;
            }
            if (!this.isCalendar()) {
                super.render();
                this.setProperties({ 'value': outOfRange || null }, true);
                this.previousDate = outOfRange;
                this.createCalendar();
            }
            this.preventArgs = {
                preventDefault: () => {
                    prevent = false;
                },
                popup: this.popupObj,
                e: e || null,
                cancel: false
            };
            this.trigger('open', this.preventArgs);
            if (prevent && !this.preventArgs.cancel) {
                addClass(this.inputWrapper.buttons, ACTIVE);
                document.body.appendChild(this.popupObj.element);
                this.popupObj.refreshPosition(this.inputElement);
                let openAnimation = {
                    name: 'FadeIn',
                    duration: Browser.isDevice ? 0 : OPENDURATION,
                };
                this.popupObj.show(new Animation(openAnimation));
                this.setAriaAttributes();
            }
            else {
                detach(this.popupWrapper);
                this.popupObj.destroy();
                this.popupWrapper = this.popupObj = null;
            }
            EventHandler.add(document, 'mousedown touchstart', this.documentHandler, this);
        }
    }
    /**
     * Hide the Calendar.
     * @returns void
     */
    hide(e) {
        if (!isNullOrUndefined(this.popupWrapper)) {
            let prevent = true;
            this.preventArgs = {
                preventDefault: () => {
                    prevent = false;
                },
                popup: this.popupObj,
                e: e || null,
                cancel: false
            };
            removeClass(this.inputWrapper.buttons, ACTIVE);
            removeClass([document.body], OVERFLOW);
            if (this.isCalendar()) {
                this.trigger('close', this.preventArgs);
            }
            if (this.isCalendar() && (prevent && !this.preventArgs.cancel)) {
                this.popupObj.hide();
                this.keyboardModule.destroy();
                removeClass(this.inputWrapper.buttons, ACTIVE);
            }
            this.setAriaAttributes();
            this.previousElementValue = this.inputElement.value;
            if (Browser.isDevice && this.modal) {
                this.modal.style.display = 'none';
                this.modal.outerHTML = '';
                this.modal = null;
            }
            EventHandler.remove(document, 'mousedown touchstart', this.documentHandler);
        }
    }
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    focusIn(triggerEvent) {
        if (document.activeElement !== this.inputElement && this.enabled) {
            this.inputElement.focus();
            addClass([this.inputWrapper.container], [INPUTFOCUS]);
            let focusArguments = {
                model: this
            };
            this.trigger('focus', focusArguments);
        }
    }
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    focusOut() {
        if (document.activeElement === this.inputElement) {
            this.inputElement.blur();
            removeClass([this.inputWrapper.container], [INPUTFOCUS]);
            let blurArguments = {
                model: this
            };
            this.trigger('blur', blurArguments);
        }
    }
    /**
     * Gets the current view of the DatePicker.
     * @returns string
     */
    currentView() {
        let currentView;
        if (this.calendarElement) {
            // calls the Calendar currentView public method
            currentView = super.currentView();
        }
        return currentView;
    }
    /**
     * This method used to navigate to the month/year/decade view of the DatePicker.
     * @param  {string} view - Specifies the view of the calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     */
    navigateTo(view, date) {
        if (this.calendarElement) {
            // calls the Calendar navigateTo public method
            super.navigateTo(view, date);
        }
    }
    /**
     * To destroy the widget.
     * @returns void
     */
    destroy() {
        super.destroy();
        this.keyboardModules.destroy();
        if (this.popupObj && this.popupObj.element.classList.contains(POPUP)) {
            super.destroy();
        }
        let ariaAttrs = {
            'aria-live': 'assertive', 'aria-atomic': 'true', 'aria-disabled': 'true',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        };
        if (this.inputElement) {
            Input.removeAttributes(ariaAttrs, this.inputElement);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            this.ensureInputAttribute();
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) {
                detach(this.popupWrapper);
            }
            this.popupObj = this.popupWrapper = null;
            this.keyboardModule.destroy();
        }
        if (this.ngTag === null) {
            if (this.inputElement) {
                this.inputWrapper.container.insertAdjacentElement('afterend', this.inputElement);
                removeClass([this.inputElement], [INPUTROOT]);
            }
            removeClass([this.element], [ROOT$1]);
            detach(this.inputWrapper.container);
        }
    }
    ensureInputAttribute() {
        for (let i = 0; i < this.inputElement.attributes.length; i++) {
            let prop = this.inputElement.attributes[i].name;
            if (isNullOrUndefined(this.inputEleCopy.getAttribute(prop))) {
                if (prop.toLowerCase() === 'value' || isNullOrUndefined(this.inputEleCopy.getAttribute('value'))) {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(prop);
            }
        }
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        this.inputEleCopy = this.element.cloneNode(true);
        this.inputElement = this.element;
        this.index = this.showClearButton ? 2 : 1;
        this.ngTag = null;
        if (this.element.tagName === 'EJS-DATEPICKER' || this.element.tagName === 'EJS-DATETIMEPICKER') {
            this.ngTag = this.element.tagName;
            this.inputElement = createElement('input');
            this.element.appendChild(this.inputElement);
        }
        if (this.element.getAttribute('id')) {
            if (this.ngTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        }
        else {
            if (this.getModuleName() === 'datetimepicker') {
                this.element.id = getUniqueID('ej2-datetimepicker');
                if (this.ngTag !== null) {
                    attributes(this.inputElement, { 'id': this.element.id + '_input' });
                }
            }
            else {
                this.element.id = getUniqueID('ej2-datepicker');
                if (this.ngTag !== null) {
                    attributes(this.inputElement, { 'id': this.element.id + '_input' });
                }
            }
        }
        this.checkHtmlAttributes();
        super.preRender();
    }
    ;
    checkHtmlAttributes() {
        this.globalize = new Internationalization(this.locale);
        let attributes$$1 = ['value', 'min', 'max', 'disabled', 'readonly', 'style', 'name', 'placeholder', 'type'];
        let options;
        if (this.getModuleName() === 'datetimepicker') {
            options = {
                format: !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat,
                type: 'dateTime', skeleton: 'yMd'
            };
        }
        else {
            options = { format: this.format, type: 'dateTime', skeleton: 'yMd' };
        }
        for (let prop of attributes$$1) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        let enabled = this.inputElement.getAttribute(prop) === 'disabled' ||
                            this.inputElement.getAttribute(prop) === '';
                        this.setProperties({ enabled: !enabled }, true);
                        break;
                    case 'readonly':
                        let readonly = this.inputElement.getAttribute(prop) === 'readonly' ||
                            this.inputElement.getAttribute(prop) === '';
                        this.setProperties({ readonly: readonly }, true);
                        break;
                    case 'placeholder':
                        if (this.placeholder === null) {
                            let placeholder = this.inputElement.getAttribute(prop);
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, true);
                        }
                        break;
                    case 'style':
                        this.inputElement.setAttribute('style', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'value':
                        if (!this.value) {
                            let value = this.inputElement.getAttribute(prop);
                            this.setProperties(setValue(prop, this.globalize.parseDate(value, options), {}), true);
                        }
                        break;
                    case 'min':
                        if (+this.min === +new Date(1900, 0, 1)) {
                            this.setProperties(setValue(prop, this.globalize.parseDate(this.inputElement.getAttribute(prop)), {}), true);
                        }
                        break;
                    case 'max':
                        if (+this.max === +new Date(2099, 11, 31)) {
                            this.setProperties(setValue(prop, this.globalize.parseDate(this.inputElement.getAttribute(prop)), {}), true);
                        }
                        break;
                    case 'type':
                        if (this.inputElement.getAttribute(prop) !== 'text') {
                            this.inputElement.setAttribute('type', 'text');
                        }
                        break;
                }
            }
        }
    }
    /**
     * To get component name.
     * @private
     */
    getModuleName() {
        return 'datepicker';
    }
    disabledDates() {
        let valueCopy = new Date('' + this.value);
        let previousValCopy = this.previousDate;
        //calls the Calendar render method to check the disabled dates through renderDayCell event and update the input value accordingly.
        this.minMaxUpdates();
        super.render();
        this.previousDate = previousValCopy;
        let date = valueCopy && +(valueCopy);
        let dateIdString = '*[id^="/id"]'.replace('/id', '' + date);
        if (!this.strictMode) {
            if (typeof this.value === 'string' || ((typeof this.value === 'object') && (+this.value) !== (+valueCopy))) {
                this.setProperties({ value: valueCopy }, true);
            }
        }
        if (!isNullOrUndefined(this.calendarElement.querySelectorAll(dateIdString)[0])) {
            if (this.calendarElement.querySelectorAll(dateIdString)[0].classList.contains('e-disabled')) {
                if (!this.strictMode) {
                    this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
                }
            }
        }
        let inputVal;
        if (this.getModuleName() === 'datetimepicker') {
            inputVal = this.globalize.formatDate(valueCopy, {
                format: !isNullOrUndefined(this.format) ? this.format : this.dateTimeFormat,
                type: 'dateTime', skeleton: 'yMd'
            });
        }
        else {
            inputVal = this.globalize.formatDate(valueCopy, { format: this.format, type: 'dateTime', skeleton: 'yMd' });
        }
        Input.setValue(inputVal, this.inputElement, this.floatLabelType, this.showClearButton);
    }
    setAriaAttributes() {
        if (this.isCalendar()) {
            Input.addAttributes({ 'aria-expanded': 'true' }, this.inputElement);
            attributes(this.inputElement, {
                'aria-activedescendant': '' + this.setActiveDescendant()
            });
        }
        else {
            Input.addAttributes({ 'aria-expanded': 'false' }, this.inputElement);
            attributes(this.inputElement, {
                'aria-activedescendant': 'null'
            });
        }
    }
    errorClass() {
        let dateIdString = '*[id^="/id"]'.replace('/id', '' + (+this.value));
        let isDisabledDate = this.calendarElement &&
            this.calendarElement.querySelectorAll(dateIdString)[0] &&
            this.calendarElement.querySelectorAll(dateIdString)[0].classList.contains('e-disabled');
        if ((!isNullOrUndefined(this.value) && !(+this.value >= +this.min && +this.value <= +this.max))
            || (!this.strictMode && this.inputElement.value !== '' && isNullOrUndefined(this.value) || isDisabledDate)) {
            addClass([this.inputWrapper.container], ERROR);
        }
        else {
            removeClass([this.inputWrapper.container], ERROR);
        }
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let options = { format: this.format, type: 'dateTime', skeleton: 'yMd' };
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    if (typeof newProp.value === 'string') {
                        newProp.value = this.globalize.parseDate(newProp.value, options);
                        this.setProperties({ value: newProp.value }, true);
                    }
                    this.previousElementValue = this.inputElement.value;
                    if (isNullOrUndefined(this.value)) {
                        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                        this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
                    }
                    this.updateInput();
                    this.changeTrigger(null);
                    break;
                case 'format':
                    this.updateInput();
                    break;
                case 'placeholder':
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.inputElement);
                    if (!this.enabled) {
                        this.inputElement.setAttribute('aria-disabled', 'true');
                    }
                    else {
                        this.inputElement.setAttribute('aria-disabled', 'false');
                    }
                    this.bindEvents();
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.placeholder, this.inputElement);
                    this.updateInput();
                    break;
                case 'enableRtl':
                    Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.inputWrapper.container]);
                    if (this.popupWrapper) {
                        addClass([this.popupWrapper], [newProp.cssClass]);
                    }
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'strictMode':
                    this.updateInput();
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                default:
                    if (this.calendarElement) {
                        super.onPropertyChanged(newProp, oldProp);
                    }
                    break;
            }
            this.hide(null);
        }
    }
};
__decorate$1([
    Property(null)
], DatePicker.prototype, "width", void 0);
__decorate$1([
    Property(null)
], DatePicker.prototype, "cssClass", void 0);
__decorate$1([
    Property(false)
], DatePicker.prototype, "strictMode", void 0);
__decorate$1([
    Property(null)
], DatePicker.prototype, "format", void 0);
__decorate$1([
    Property(true)
], DatePicker.prototype, "enabled", void 0);
__decorate$1([
    Property(true)
], DatePicker.prototype, "showClearButton", void 0);
__decorate$1([
    Property(false)
], DatePicker.prototype, "enablePersistence", void 0);
__decorate$1([
    Property(1000)
], DatePicker.prototype, "zIndex", void 0);
__decorate$1([
    Property(false)
], DatePicker.prototype, "readonly", void 0);
__decorate$1([
    Property(null)
], DatePicker.prototype, "placeholder", void 0);
__decorate$1([
    Property('Never')
], DatePicker.prototype, "floatLabelType", void 0);
__decorate$1([
    Event()
], DatePicker.prototype, "open", void 0);
__decorate$1([
    Event()
], DatePicker.prototype, "close", void 0);
__decorate$1([
    Event()
], DatePicker.prototype, "blur", void 0);
__decorate$1([
    Event()
], DatePicker.prototype, "focus", void 0);
__decorate$1([
    Event()
], DatePicker.prototype, "created", void 0);
__decorate$1([
    Event()
], DatePicker.prototype, "destroyed", void 0);
DatePicker = __decorate$1([
    NotifyPropertyChanges
], DatePicker);

/**
 * Datepicker modules
 */

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path='../calendar/calendar-model.d.ts'/>
const DATERANGEWRAPPER = 'e-date-range-wrapper';
const INPUTCONTAINER$1 = 'e-input-group';
const DATERANGEICON = 'e-input-group-icon e-range-icon e-icons';
const POPUP$1 = 'e-popup';
const LEFTCALENDER = 'e-left-calendar';
const RIGHTCALENDER = 'e-right-calendar';
const LEFTCONTAINER = 'e-left-container';
const RIGHTCONTAINER = 'e-right-container';
const ROOT$2 = 'e-daterangepicker';
const ERROR$1 = 'e-error';
const ACTIVE$1 = 'e-active';
const STARTENDCONTAINER = 'e-start-end';
const STARTDATE = 'e-start-date';
const ENDDATE = 'e-end-date';
const STARTBUTTON = 'e-start-btn';
const INPUTFOCUS$1 = 'e-input-focus';
const ENDBUTTON = 'e-end-btn';
const RANGEHOVER = 'e-range-hover';
const OTHERMONTH$1 = 'e-other-month';
const STARTLABEL = 'e-start-label';
const ENDLABEL = 'e-end-label';
const DISABLED$1 = 'e-disabled';
const SELECTED$1 = 'e-selected';
const CALENDAR = 'e-calendar';
const NEXTICON$1 = 'e-next';
const PREVICON$1 = 'e-prev';
const HEADER$1 = 'e-header';
const TITLE$1 = 'e-title';
const ICONCONTAINER$1 = 'e-icon-container';
const RANGECONTAINER = 'e-date-range-container';
const RANGEHEADER = 'e-range-header';
const PRESETS = 'e-presets';
const FOOTER$1 = 'e-footer';
const RANGEBORDER = 'e-range-border';
const TODAY$1 = 'e-today';
const FOCUSDATE = 'e-focused-date';
const CONTENT$1 = 'e-content';
const DAYSPAN = 'e-day-span';
const WEEKNUMBER$1 = 'e-week-number';
const DATEDISABLED = 'e-date-disabled';
const ICONDISABLED = 'e-icon-disabled';
const CALENDARCONTAINER = 'e-calendar-container';
const SEPARATOR = 'e-separator';
const APPLY = 'e-apply';
const CANCEL = 'e-cancel';
const DEVICE$1 = 'e-device';
const OVERLAY$1 = 'e-overlay';
const CHANGEICON = 'e-change-icon e-icons';
const LISTCLASS = cssClass.li;
const RTL$2 = 'e-rtl';
const HOVER = 'e-hover';
const OVERFLOW$1 = 'e-range-overflow';
const OFFSETVALUE$1 = 4;
const PRIMARY$1 = 'e-primary';
const FLAT$1 = 'e-flat';
class Presets extends ChildProperty {
}
__decorate$2([
    Property()
], Presets.prototype, "label", void 0);
__decorate$2([
    Property()
], Presets.prototype, "start", void 0);
__decorate$2([
    Property()
], Presets.prototype, "end", void 0);
/**
 * Represents the DateRangePicker component that allows user to select the date range from the calendar
 * or entering the range through the input element.
 * ```html
 * <input id="daterangepicker"/>
 * ```
 * ```typescript
 * <script>
 *   var dateRangePickerObj = new DateRangePicker({ startDate: new Date("05/07/2017"), endDate: new Date("10/07/2017") });
 *   dateRangePickerObj.appendTo("#daterangepicker");
 * </script>
 * ```
 */
let DateRangePicker = class DateRangePicker extends CalendarBase {
    /**
     * Constructor for creating the widget
     */
    constructor(options, element) {
        super(options, element);
        this.isCustomRange = false;
        this.isCustomWindow = false;
        this.presetsItem = [];
        this.liCollections = [];
        this.previousEleValue = '';
        this.isKeyPopup = false;
        this.dateDisabled = false;
        this.isRangeIconClicked = false;
        this.isMaxDaysClicked = false;
        this.disabledDays = [];
        this.preventBlur = false;
        this.preventFocus = false;
    }
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    render() {
        this.initialize();
    }
    /**
     * Initialize the event handler
     * @returns void
     * @private
     */
    preRender() {
        this.presetKeyConfig = {
            moveUp: 'uparrow',
            moveDown: 'downarrow',
            enter: 'enter',
            tab: 'tab',
            spaceBar: 'space'
        };
        this.keyInputConfigs = {
            altDownArrow: 'alt+downarrow',
            escape: 'escape',
            enter: 'enter',
            tab: 'tab',
        };
        this.defaultConstant = {
            placeholder: '',
            startLabel: 'Start Date',
            endLabel: 'End Date',
            customRange: 'Custom Range',
            applyText: 'Apply',
            cancelText: 'Cancel',
            selectedDays: 'Selected Days',
            days: 'days'
        };
        /**
         * Mobile View
         */
        this.isMobile = window.matchMedia('(max-width:550px)').matches;
        this.inputElement = this.element;
        this.angularTag = null;
        if (this.element.tagName === 'EJS-DATERANGEPICKER') {
            this.angularTag = this.element.tagName;
            this.inputElement = createElement('input');
            this.element.appendChild(this.inputElement);
        }
        this.cloneElement = this.element.cloneNode(true);
        if (this.element.getAttribute('id')) {
            if (this.angularTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        }
        else {
            this.element.id = getUniqueID('ej2-datetimepicker');
            if (this.angularTag !== null) {
                attributes(this.inputElement, { 'id': this.element.id + '_input' });
            }
        }
        this.initProperty();
        super.preRender();
        this.navNextFunction = this.navNextMonth.bind(this);
        this.navPrevFunction = this.navPrevMonth.bind(this);
        this.deviceNavNextFunction = this.deviceNavNext.bind(this);
        this.deviceNavPrevFunction = this.deviceNavPrevious.bind(this);
        this.initStartDate = this.checkDateValue(this.startDate);
        this.initEndDate = this.checkDateValue(this.endDate);
    }
    ;
    updateValue() {
        let dateOptions = { format: this.format, type: 'date', skeleton: 'yMd' };
        if (this.value && this.value.length > 0) {
            if (this.value[0] instanceof Date && !isNaN(+this.value[0])) {
                this.setProperties({ startDate: this.value[0] }, true);
            }
            else if (typeof this.value[0] === 'string') {
                this.setProperties({ startDate: this.globalize.parseDate('' + this.value[0], dateOptions) }, true);
            }
            else {
                this.setProperties({ startDate: null }, true);
                this.setValue();
            }
            if (this.value[1] instanceof Date && !isNaN(+this.value[1])) {
                this.setProperties({ endDate: this.value[1] }, true);
            }
            else if (typeof this.value[1] === 'string') {
                this.setProperties({ endDate: this.globalize.parseDate('' + this.value[1], dateOptions) }, true);
                this.setValue();
            }
            else {
                this.setProperties({ endDate: null }, true);
                this.setValue();
            }
        }
        else if (isNullOrUndefined(this.value)
            && isNullOrUndefined(this.startDate) && isNullOrUndefined(this.endDate)) {
            this.setProperties({ endDate: null }, true);
            this.setProperties({ startDate: null }, true);
            this.setValue();
        }
    }
    initProperty() {
        this.globalize = new Internationalization(this.locale);
        this.updateValue();
        this.setProperties({ value: null }, true);
    }
    initialize() {
        merge(this.keyConfigs, { shiftTab: 'shift+tab' });
        this.setProperties({ startDate: this.checkDateValue(new Date('' + this.startDate)) }, true); // persis the value propeerty.
        this.setProperties({ endDate: this.checkDateValue(new Date('' + this.endDate)) }, true);
        this.setValue();
        this.setProperties({ min: this.checkDateValue(new Date('' + this.min)) }, true);
        this.setProperties({ max: this.checkDateValue(new Date('' + this.max)) }, true);
        this.checkHtmlAttributes();
        this.l10n = new L10n('daterangepicker', this.defaultConstant, this.locale);
        this.l10n.setLocale(this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        this.processPresets();
        this.createInput();
        this.bindEvents();
    }
    processPresets() {
        let i = 0;
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
            for (let range of this.presets) {
                let id = range.label.replace(/\s+/g, '') + '_' + (++i);
                if (typeof range.end === 'string' && typeof range.end === 'string') {
                    this.presetsItem.push({
                        id: id, text: range.label, end: new Date('' + range.end), start: new Date('' + range.start)
                    });
                }
                else {
                    this.presetsItem.push({ id: id, text: range.label, start: range.start, end: range.end });
                }
            }
            let startDate = isNullOrUndefined(this.startDate) ? null : new Date(+this.startDate);
            let endDate = isNullOrUndefined(this.endDate) ? null : new Date(+this.endDate);
            this.presetsItem.push({ id: 'custom_range', text: this.l10n.getConstant('customRange'), start: startDate, end: endDate });
            if (!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate)) {
                this.isCustomRange = true;
                this.activeIndex = this.presetsItem.length - 1;
            }
        }
    }
    bindEvents() {
        if (this.enabled) {
            EventHandler.add(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler, this);
            EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
            EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
            EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
            if (this.showClearButton) {
                EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
            }
            if (!this.isMobile) {
                this.inputKeyboardModule = new KeyboardEvents(this.inputElement, {
                    eventName: 'keydown', keyAction: this.inputHandler.bind(this), keyConfigs: this.keyInputConfigs
                });
            }
        }
        else {
            EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown', this.rangeIconHandler);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
            EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
            if (this.showClearButton) {
                EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler);
            }
            if (!this.isMobile) {
                if (!isNullOrUndefined(this.inputKeyboardModule)) {
                    this.inputKeyboardModule.destroy();
                }
            }
        }
    }
    inputChangeHandler(e) {
        e.stopPropagation();
    }
    bindClearEvent() {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.resetHandler, this);
        }
    }
    resetHandler(e) {
        e.preventDefault();
        this.clear();
        this.changeTrigger(e);
        this.clearRange();
        this.hide();
    }
    clear() {
        if (this.startDate !== null) {
            this.setProperties({ startDate: null }, true);
        }
        if (this.endDate !== null) {
            this.setProperties({ endDate: null }, true);
        }
        if (this.value !== null) {
            this.setProperties({ value: null }, true);
        }
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        if (!(isNullOrUndefined(this.applyButton))) {
            this.applyButton.disabled = this.applyButton.element.disabled = true;
        }
    }
    rangeIconHandler(e) {
        e.preventDefault();
        this.targetElement = null;
        this.effect = '';
        if (this.isPopupOpen()) {
            this.applyFunction(e);
        }
        else {
            this.isRangeIconClicked = true;
            if (!this.isMobile) {
                this.inputWrapper.container.children[0].focus();
            }
            this.show();
            if (!this.isMobile) {
                if (!isNullOrUndefined(this.leftCalendar)) {
                    this.isRangeIconClicked = false;
                    this.calendarFocus();
                    this.isRangeIconClicked = true;
                }
                addClass([this.inputWrapper.container], [INPUTFOCUS$1]);
            }
        }
    }
    checkHtmlAttributes() {
        this.globalize = new Internationalization(this.locale);
        let attributes$$1;
        attributes$$1 = ['startDate', 'endDate', 'minDays', 'maxDays', 'min', 'max', 'disabled',
            'readonly', 'style', 'name', 'placeholder', 'type'];
        let format = { format: this.format, type: 'date', skeleton: 'yMd' };
        for (let prop of attributes$$1) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        let disabled = this.inputElement.getAttribute(prop) === 'disabled' ||
                            this.inputElement.getAttribute(prop) === '';
                        this.setProperties({ enabled: !disabled }, true);
                        break;
                    case 'readonly':
                        let readonly = this.inputElement.getAttribute(prop) === 'readonly' ||
                            this.inputElement.getAttribute(prop) === '';
                        this.setProperties({ readonly: readonly }, true);
                        break;
                    case 'placeholder':
                        if (isNullOrUndefined(this.placeholder) || this.placeholder.trim() === '') {
                            this.setProperties({ placeholder: this.inputElement.getAttribute(prop) }, true);
                        }
                        break;
                    case 'style':
                        this.inputElement.setAttribute('style', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'min':
                        if (isNullOrUndefined(this.min) || +this.min === +new Date(1900, 0, 1)) {
                            let dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.setProperties(setValue(prop, dateValue, {}), true);
                        }
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', '' + this.inputElement.getAttribute(prop));
                        break;
                    case 'max':
                        if (isNullOrUndefined(this.max) || +this.max === +new Date(2099, 11, 31)) {
                            let dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.setProperties(setValue(prop, dateValue, {}), true);
                        }
                        break;
                    case 'startDate':
                        if (isNullOrUndefined(this.startDate)) {
                            let dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.setProperties(setValue(prop, dateValue, {}), true);
                            this.setValue();
                        }
                        break;
                    case 'endDate':
                        if (isNullOrUndefined(this.endDate)) {
                            let dateValue = this.globalize.parseDate(this.inputElement.getAttribute(prop), format);
                            this.setProperties(setValue(prop, dateValue, {}), true);
                            this.setValue();
                        }
                        break;
                    case 'minDays':
                        if (isNullOrUndefined(this.minDays)) {
                            this.setProperties(setValue(prop, parseInt(this.inputElement.getAttribute(prop), 10), {}), true);
                        }
                        break;
                    case 'maxDays':
                        if (isNullOrUndefined(this.maxDays)) {
                            this.setProperties(setValue(prop, parseInt(this.inputElement.getAttribute(prop), 10), {}), true);
                        }
                        break;
                    case 'type':
                        if (this.inputElement.getAttribute(prop) !== 'text') {
                            this.inputElement.setAttribute('type', 'text');
                        }
                        break;
                }
            }
        }
    }
    createPopup() {
        for (let i = 0; i < this.presetsItem.length; i++) {
            if ((i !== (this.presetsItem.length - 1)) && this.presetsItem[i].id === 'custom_range') {
                this.presetsItem.splice(i, 1);
            }
        }
        this.activeIndex = this.presetsItem.length - 1;
        this.isCustomRange = true;
        for (let i = 0; i <= this.presetsItem.length - 2; i++) {
            let startDate = this.presetsItem[i].start;
            let endDate = this.presetsItem[i].end;
            if (this.startDate && this.endDate) {
                if ((+startDate.setMilliseconds(0) === +this.startDate.setMilliseconds(0)) &&
                    (+endDate.setMilliseconds(0) === +this.endDate.setMilliseconds(0))) {
                    this.activeIndex = i;
                    this.isCustomRange = false;
                }
            }
        }
        this.popupWrapper = createElement('div', { id: this.element.id + '_popup', className: ROOT$2 + ' ' + POPUP$1 });
        let isPreset = (!this.isCustomRange || this.isMobile);
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && isPreset) {
            this.isCustomWindow = false;
            this.createPresets();
            document.body.appendChild(this.popupWrapper);
            this.listRippleEffect();
            this.renderPopup();
        }
        else {
            this.isCustomWindow = true;
            this.renderControl();
        }
    }
    renderControl() {
        this.createControl();
        this.bindCalendarEvents();
        this.updateRange((this.isMobile ? [this.calendarElement] : [this.leftCalendar, this.rightCalendar]));
        if (!isNullOrUndefined(this.endDate) && !isNullOrUndefined(this.startDate)) {
            this.disabledDateRender();
        }
        this.updateHeader();
    }
    clearCalendarEvents() {
        EventHandler.clearEvents(this.leftCalPrevIcon);
        EventHandler.clearEvents(this.leftCalNextIcon);
        EventHandler.clearEvents(this.rightCalPrevIcon);
        EventHandler.clearEvents(this.rightCalNextIcon);
    }
    updateNavIcons() {
        this.previousIcon = this.rightCalPrevIcon;
        this.nextIcon = this.leftCalNextIcon;
        this.nextIconHandler(this.compareMonths(new Date('' + this.leftCalCurrentDate), this.rightCalCurrentDate) < 1);
        this.previousIconHandler(this.compareMonths(new Date('' + this.leftCalCurrentDate), this.rightCalCurrentDate) < 1);
    }
    calendarIconEvent() {
        this.clearCalendarEvents();
        if (this.leftCalPrevIcon && !this.leftCalPrevIcon.classList.contains(DISABLED$1)) {
            EventHandler.add(this.leftCalPrevIcon, 'mousedown', this.navPrevFunction);
        }
        if (this.leftCalNextIcon && !this.leftCalNextIcon.classList.contains(DISABLED$1)) {
            EventHandler.add(this.leftCalNextIcon, 'mousedown', this.navNextFunction);
        }
        if (this.rightCalPrevIcon && !this.rightCalPrevIcon.classList.contains(DISABLED$1)) {
            EventHandler.add(this.rightCalPrevIcon, 'mousedown', this.navPrevFunction);
        }
        if (this.rightCalNextIcon && !this.rightCalNextIcon.classList.contains(DISABLED$1)) {
            EventHandler.add(this.rightCalNextIcon, 'mousedown', this.navNextFunction);
        }
    }
    bindCalendarEvents() {
        if (!this.isMobile) {
            this.updateNavIcons();
            this.calendarIconEvent();
            this.calendarIconRipple();
            this.headerTitleElement = this.popupObj.element.querySelector('.' + RIGHTCALENDER + ' .' + HEADER$1 + ' .' + TITLE$1);
            this.headerTitleElement = this.popupObj.element.querySelector('.' + LEFTCALENDER + ' .' + HEADER$1 + ' .' + TITLE$1);
            this.leftKeyboardModule = new KeyboardEvents(this.leftCalendar, {
                eventName: 'keydown',
                keyAction: this.keyInputHandler.bind(this),
                keyConfigs: this.keyConfigs
            });
            this.rightKeyboardModule = new KeyboardEvents(this.rightCalendar, {
                eventName: 'keydown',
                keyAction: this.keyInputHandler.bind(this),
                keyConfigs: this.keyConfigs
            });
        }
        else {
            this.deviceCalendarEvent();
            EventHandler.add(this.startButton.element, 'click', this.deviceHeaderClick, this);
            EventHandler.add(this.endButton.element, 'click', this.deviceHeaderClick, this);
        }
        this.bindCalendarCellEvents();
        this.removeFocusedDate();
    }
    calendarIconRipple() {
        rippleEffect(this.leftCalPrevIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.leftCalNextIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
        rippleEffect(this.rightCalPrevIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.rightCalNextIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
    }
    deviceCalendarEvent() {
        EventHandler.clearEvents(this.nextIcon);
        EventHandler.clearEvents(this.previousIcon);
        rippleEffect(this.nextIcon, { selector: '.e-prev', duration: 400, isCenterRipple: true });
        rippleEffect(this.previousIcon, { selector: '.e-next', duration: 400, isCenterRipple: true });
        if (this.nextIcon && !this.nextIcon.classList.contains(DISABLED$1)) {
            EventHandler.add(this.nextIcon, 'mousedown', this.deviceNavNextFunction);
        }
        if (this.previousIcon && !this.previousIcon.classList.contains(DISABLED$1)) {
            EventHandler.add(this.previousIcon, 'mousedown', this.deviceNavPrevFunction);
        }
    }
    deviceNavNext(e) {
        let calendar = closest(e.target, '.' + CALENDAR);
        this.updateDeviceCalendar(calendar);
        this.navigateNext(e);
        this.deviceNavigation();
    }
    deviceNavPrevious(e) {
        let calendar = closest(e.target, '.' + CALENDAR);
        this.updateDeviceCalendar(calendar);
        this.navigatePrevious(e);
        this.deviceNavigation();
    }
    updateDeviceCalendar(calendar) {
        if (calendar) {
            this.previousIcon = calendar.querySelector('.' + PREVICON$1);
            this.nextIcon = calendar.querySelector('.' + NEXTICON$1);
            this.calendarElement = calendar;
            this.deviceCalendar = calendar;
            this.contentElement = calendar.querySelector('.' + CONTENT$1);
            this.tableBodyElement = select('.' + CONTENT$1 + ' tbody', calendar);
            this.table = calendar.querySelector('.' + CONTENT$1).getElementsByTagName('table')[0];
            this.headerTitleElement = calendar.querySelector('.' + HEADER$1 + ' .' + TITLE$1);
            this.headerElement = calendar.querySelector('.' + HEADER$1);
        }
    }
    deviceHeaderClick(event) {
        let element = event.currentTarget;
        if (element.classList.contains(STARTBUTTON) && !isNullOrUndefined(this.startDate)) {
            this.endButton.element.classList.remove(ACTIVE$1);
            this.startButton.element.classList.add(ACTIVE$1);
            let calendar = this.popupObj.element.querySelector('.' + CALENDAR);
            this.updateDeviceCalendar(calendar);
            if (isNullOrUndefined(this.calendarElement.querySelector('.' + STARTDATE + ':not(.e-other-month)'))) {
                this.currentDate = new Date(+this.startDate);
                remove(this.tableBodyElement);
                this.renderMonths();
                this.deviceNavigation();
            }
            this.removeClassDisabled();
        }
        else if (!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate)) {
            this.startButton.element.classList.remove(ACTIVE$1);
            this.endButton.element.classList.add(ACTIVE$1);
            let calendar = this.popupObj.element.querySelector('.' + CALENDAR);
            this.updateDeviceCalendar(calendar);
            if (isNullOrUndefined(this.calendarElement.querySelector('.' + ENDDATE + ':not(.e-other-month)'))) {
                this.currentDate = new Date(+this.endDate);
                remove(this.tableBodyElement);
                this.renderMonths();
                this.deviceNavigation();
            }
            this.updateMinMaxDays(this.popupObj.element.querySelector('.' + CALENDAR));
            this.selectableDates();
        }
    }
    inputFocusHandler() {
        this.preventBlur = false;
        let focusArguments = {
            model: this
        };
        if (!this.preventFocus) {
            this.trigger('focus', focusArguments);
        }
    }
    inputBlurHandler(e) {
        if (!this.preventBlur) {
            let value = this.inputElement.value;
            if (!isNullOrUndefined(this.presetsItem)) {
                if (this.presetsItem.length > 0 && this.previousEleValue !== this.inputElement.value) {
                    this.activeIndex = this.presetsItem.length - 1;
                    this.isCustomRange = true;
                }
            }
            if (!isNullOrUndefined(value) && value.trim() !== '') {
                let range = value.split(' ' + this.separator + ' ');
                if (range.length > 1) {
                    let dateOptions = { format: this.format, type: 'date', skeleton: 'yMd' };
                    let startDate = this.globalize.parseDate(range[0].trim(), dateOptions);
                    let endDate = this.globalize.parseDate(range[1].trim(), dateOptions);
                    if (!isNullOrUndefined(startDate) && !isNaN(+startDate) && !isNullOrUndefined(endDate) && !isNaN(+endDate)) {
                        this.setProperties({ startDate: startDate }, true);
                        this.setProperties({ endDate: endDate }, true);
                        this.setValue();
                        this.refreshControl();
                        this.changeTrigger(e);
                        if (!this.preventBlur && document.activeElement !== this.inputElement) {
                            this.preventFocus = false;
                            let blurArguments = {
                                model: this
                            };
                            this.trigger('blur', blurArguments);
                        }
                        return;
                    }
                    else {
                        if (!this.strictMode) {
                            this.setProperties({ startDate: null }, true);
                            this.setProperties({ endDate: null }, true);
                            this.setValue();
                        }
                    }
                }
                else {
                    if (!this.strictMode) {
                        this.setProperties({ startDate: null }, true);
                        this.setProperties({ endDate: null }, true);
                        this.setValue();
                    }
                }
            }
            if (!this.strictMode) {
                this.clearRange();
                this.setProperties({ startDate: null }, true);
                this.setProperties({ endDate: null }, true);
                this.setValue();
            }
            else {
                Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
                this.updateInput();
            }
            this.errorClass();
            this.changeTrigger(e);
            if (!this.preventBlur && document.activeElement !== this.inputElement) {
                this.preventFocus = false;
                let blurArguments = {
                    model: this
                };
                this.trigger('blur', blurArguments);
            }
        }
    }
    clearRange() {
        this.previousStartValue = this.previousEndValue = null;
        this.currentDate = null;
    }
    errorClass() {
        let inputStr = this.inputElement.value.trim();
        if (inputStr !== '' && ((isNullOrUndefined(this.endDate) && isNullOrUndefined(this.startDate) && inputStr !== '') ||
            ((!isNullOrUndefined(this.startDate) && +this.startDate < +this.min)
                || ((!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate)) && +this.startDate > +this.endDate)
                || (!isNullOrUndefined(this.endDate) && +this.endDate > +this.max))
            || ((this.startDate && this.isDateDisabled(this.startDate))
                || (this.endDate && this.isDateDisabled(this.endDate))))) {
            addClass([this.inputWrapper.container], ERROR$1);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        }
        else {
            if (this.inputWrapper) {
                removeClass([this.inputWrapper.container], ERROR$1);
                attributes(this.inputElement, { 'aria-invalid': 'false' });
            }
        }
    }
    keyCalendarUpdate(isLeftCalendar, ele) {
        this.removeFocusedDate();
        if (isLeftCalendar) {
            this.leftCalCurrentDate = new Date(+this.currentDate);
            ele = this.leftCalendar;
        }
        else {
            this.rightCalCurrentDate = new Date(+this.currentDate);
            ele = this.rightCalendar;
        }
        this.updateCalendarElement(ele);
        this.table.focus();
        return ele;
    }
    navInCalendar(e, isLeftCalendar, leftLimit, rightLimit, ele) {
        let date;
        let min = this.min;
        let max;
        if (!isNullOrUndefined(this.maxDays) && this.isMaxDaysClicked && !isNullOrUndefined(this.startDate)) {
            max = new Date(new Date(+this.startDate).setDate(this.startDate.getDate() + (this.maxDays - 1)));
        }
        else {
            max = this.max;
        }
        switch (e.action) {
            case 'moveRight':
                date = new Date(+this.currentDate);
                this.addDay(date, 1, e, max, min);
                if (isLeftCalendar && +date === +rightLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.KeyboardNavigate(1, 0, e, max, min);
                this.keyNavigation(ele, e);
                break;
            case 'moveLeft':
                date = new Date(+this.currentDate);
                this.addDay(date, -1, e, max, min);
                if (!isLeftCalendar && +date === +leftLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.KeyboardNavigate(-1, 0, e, max, min);
                this.keyNavigation(ele, e);
                break;
            case 'moveUp':
                date = new Date(+this.currentDate);
                this.addDay(date, -7, e, max, min);
                if (!isLeftCalendar && +date <= +leftLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.KeyboardNavigate(-7, 0, e, max, min);
                this.keyNavigation(ele, e);
                break;
            case 'moveDown':
                date = new Date(+this.currentDate);
                this.addDay(date, 7, e, max, min);
                if (isLeftCalendar && +date >= +rightLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.KeyboardNavigate(7, 0, e, max, min);
                this.keyNavigation(ele, e);
                break;
            case 'home':
                this.currentDate = this.firstDay(this.currentDate);
                remove(this.tableBodyElement);
                this.renderMonths();
                this.keyNavigation(ele, e);
                break;
            case 'end':
                this.currentDate = this.lastDay(this.currentDate);
                remove(this.tableBodyElement);
                this.renderMonths();
                this.keyNavigation(ele, e);
                break;
        }
    }
    // tslint:disable-next-line:max-func-body-length
    keyInputHandler(e) {
        let date;
        let rightDateLimit = new Date(this.rightCalCurrentDate.getFullYear(), this.rightCalCurrentDate.getMonth(), 1);
        let leftDateLimit = new Date(this.leftCalCurrentDate.getFullYear(), this.leftCalCurrentDate.getMonth() + 1, 0);
        let ele = closest(e.target, '.' + RIGHTCALENDER);
        ele = isNullOrUndefined(ele) ? this.leftCalendar : ele;
        let isLeftCalendar = ele.classList.contains(LEFTCALENDER);
        this.updateCalendarElement(ele);
        let focusedDate = ele.querySelector('tr td.' + FOCUSDATE);
        let startDate = ele.querySelector('tr td.' + STARTDATE);
        let endDate = ele.querySelector('tr td.' + ENDDATE);
        if (!isNullOrUndefined(focusedDate)) {
            this.currentDate = this.currentDate;
        }
        else if (!isNullOrUndefined(endDate) && !this.dateDisabled) {
            this.currentDate = new Date(+this.endDate);
        }
        else if (!isNullOrUndefined(startDate) && !this.dateDisabled) {
            this.currentDate = new Date(+this.startDate);
        }
        else if (!this.dateDisabled) {
            this.currentDate.setDate(1);
        }
        this.effect = '';
        switch (e.action) {
            case 'altUpArrow':
                if (this.isPopupOpen()) {
                    this.hide();
                    this.preventFocus = true;
                    if (!this.isMobile) {
                        this.inputElement.focus();
                        addClass([this.inputWrapper.container], [INPUTFOCUS$1]);
                    }
                }
                break;
            case 'select':
                let element = !isNullOrUndefined(focusedDate) ? focusedDate : startDate;
                if (!isNullOrUndefined(element) && !element.classList.contains(DISABLED$1)) {
                    this.selectRange(e, (element));
                }
                e.preventDefault();
                break;
            case 'controlHome':
                let yearDate = new Date(this.currentDate.getFullYear(), 0, 1);
                if (!isLeftCalendar && +yearDate < +leftDateLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.navigateTo('Month', new Date(this.currentDate.getFullYear(), 0, 1));
                this.keyNavigation(ele, e);
                break;
            case 'controlEnd':
                yearDate = new Date(this.currentDate.getFullYear(), 11, 31);
                if (isLeftCalendar && +yearDate > +rightDateLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.navigateTo('Month', new Date(this.currentDate.getFullYear(), 11, 31));
                this.keyNavigation(ele, e);
                break;
            case 'pageUp':
                date = new Date(+this.currentDate);
                this.addMonths(date, -1);
                if (!isLeftCalendar && +date <= +leftDateLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.addMonths(this.currentDate, -1);
                this.navigateTo('Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'pageDown':
                date = new Date(+this.currentDate);
                this.addMonths(date, 1);
                if (isLeftCalendar && +date >= +rightDateLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.addMonths(this.currentDate, 1);
                this.navigateTo('Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'shiftPageUp':
                date = new Date(+this.currentDate);
                this.addYears(date, -1);
                if (!isLeftCalendar && +date <= +leftDateLimit) {
                    ele = this.keyCalendarUpdate(true, ele);
                }
                this.addYears(this.currentDate, -1);
                this.navigateTo('Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'shiftPageDown':
                date = new Date(+this.currentDate);
                this.addYears(date, 1);
                if (isLeftCalendar && +date >= +rightDateLimit) {
                    ele = this.keyCalendarUpdate(false, ele);
                }
                this.addYears(this.currentDate, 1);
                this.navigateTo('Month', this.currentDate);
                this.keyNavigation(ele, e);
                break;
            case 'shiftTab':
                if (!isNullOrUndefined(this.presetElement)) {
                    this.presetElement.setAttribute('tabindex', '0');
                    this.presetElement.focus();
                    this.removeFocusedDate();
                }
                e.preventDefault();
                break;
            case 'spaceBar':
                if (this.applyButton && !this.applyButton.disabled) {
                    this.applyFunction(e);
                }
                break;
            default:
                this.navInCalendar(e, isLeftCalendar, leftDateLimit, rightDateLimit, ele);
                this.checkMinMaxDays();
        }
        this.presetHeight();
    }
    keyNavigation(calendar, e) {
        this.bindCalendarCellEvents(calendar);
        if (calendar.classList.contains(LEFTCALENDER)) {
            this.leftCalCurrentDate = new Date(+this.currentDate);
        }
        else {
            this.rightCalCurrentDate = new Date(+this.currentDate);
        }
        this.updateNavIcons();
        this.calendarIconEvent();
        this.updateRange([calendar]);
        this.dateDisabled = this.isDateDisabled(this.currentDate);
        e.preventDefault();
    }
    inputHandler(e) {
        switch (e.action) {
            case 'altDownArrow':
                if (!this.isPopupOpen()) {
                    this.show();
                    this.isRangeIconClicked = false;
                    if (!this.isMobile) {
                        if (!isNullOrUndefined(this.leftCalendar)) {
                            this.calendarFocus();
                        }
                    }
                    this.isKeyPopup = true;
                }
                break;
            case 'escape':
                if (this.isPopupOpen()) {
                    this.hide();
                }
                break;
            case 'enter':
                if (document.activeElement === this.inputElement) {
                    this.inputBlurHandler(e);
                    this.hide();
                }
                break;
            case 'tab':
                if (document.activeElement === this.inputElement && this.isPopupOpen()) {
                    this.hide();
                    e.preventDefault();
                }
                break;
        }
    }
    bindCalendarCellEvents(calendar) {
        let tdCells;
        if (calendar) {
            tdCells = calendar.querySelectorAll('.' + CALENDAR + ' td');
        }
        else {
            tdCells = this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td');
        }
        for (let cell of tdCells) {
            EventHandler.clearEvents(cell);
            let disabledCell;
            disabledCell = cell.classList.contains(DISABLED$1) || cell.classList.contains(DATEDISABLED);
            if (!disabledCell && !cell.classList.contains(WEEKNUMBER$1)) {
                EventHandler.add(cell, 'mousedown', this.selectRange, this);
                if (!this.isMobile) {
                    EventHandler.add(cell, 'mouseover', this.hoverSelection, this);
                }
            }
        }
    }
    removeFocusedDate() {
        let isDate = !isNullOrUndefined(this.startDate) || !isNullOrUndefined(this.endDate);
        let focusedDate;
        focusedDate = this.popupObj.element.querySelectorAll('.' + CALENDAR + ' .' + FOCUSDATE);
        if ((this.leftCalendar && this.leftCalendar.querySelector('.e-content').classList.contains('e-month')
            && this.rightCalendar && this.rightCalendar.querySelector('.e-content').classList.contains('e-month')) ||
            this.calendarElement && this.calendarElement.querySelector('.e-content').classList.contains('e-month')) {
            for (let ele of focusedDate) {
                if (!ele.classList.contains(TODAY$1) || (ele.classList.contains(TODAY$1) && (isDate))) {
                    ele.classList.remove(FOCUSDATE);
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(ENDDATE)) {
                        ele.removeAttribute('aria-label');
                    }
                }
            }
        }
    }
    hoverSelection(event, element) {
        let currentElement = element || event.currentTarget;
        let currentDate = this.getIdValue(null, currentElement);
        if ((!isNullOrUndefined(this.startDate) && +this.startDate >= +this.min && +this.startDate <= +this.max)
            || (!isNullOrUndefined(this.endDate) && +this.endDate >= +this.min && +this.endDate <= +this.max)) {
            if ((!this.isDateDisabled(this.endDate) && !this.isDateDisabled(this.startDate)
                && isNullOrUndefined(this.startDate) && isNullOrUndefined(this.endDate))
                || (!isNullOrUndefined(this.startDate) && isNullOrUndefined(this.endDate))) {
                let tdCells;
                tdCells = this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td');
                for (let ele of tdCells) {
                    let isDisabledCell = (!ele.classList.contains(DISABLED$1) || ele.classList.contains(DATEDISABLED));
                    if (!ele.classList.contains(WEEKNUMBER$1) && isDisabledCell) {
                        let eleDate = this.getIdValue(null, ele);
                        let startDateValue = new Date(+this.startDate);
                        let eleDateValue = new Date(+eleDate);
                        if (eleDateValue.setHours(0, 0, 0, 0) >= startDateValue.setHours(0, 0, 0, 0) && +eleDate <= +currentDate) {
                            addClass([ele], RANGEHOVER);
                        }
                        else {
                            removeClass([ele], [RANGEHOVER]);
                        }
                    }
                }
            }
        }
    }
    updateRange(elementCollection) {
        if (!isNullOrUndefined(this.startDate)) {
            for (let calendar of elementCollection) {
                let tdCells = calendar.querySelectorAll('.' + CALENDAR + ' td');
                for (let ele of tdCells) {
                    if (!ele.classList.contains(WEEKNUMBER$1) && !ele.classList.contains(DISABLED$1)) {
                        let eleDate = this.getIdValue(null, ele);
                        if (!isNullOrUndefined(this.endDate)) {
                            if (+eleDate >= +this.startDate && +eleDate <= +this.endDate && +this.startDate !== +this.endDate &&
                                +this.startDate >= +this.min && +this.endDate <= +this.max
                                && !(this.isDateDisabled(this.startDate) || this.isDateDisabled(this.endDate))) {
                                addClass([ele], RANGEHOVER);
                            }
                        }
                        else {
                            removeClass([ele], [RANGEHOVER]);
                        }
                        if (!ele.classList.contains(OTHERMONTH$1)) {
                            let startDateValue = new Date(+this.startDate);
                            let eleDateValue = new Date(+eleDate);
                            if (eleDateValue.setHours(0, 0, 0, 0) === startDateValue.setHours(0, 0, 0, 0)
                                && eleDateValue.setHours(0, 0, 0, 0) >= startDateValue.setHours(0, 0, 0, 0) &&
                                +this.startDate >= +this.min
                                && !this.inputWrapper.container.classList.contains('e-error')
                                && !(this.isDateDisabled(this.startDate) || this.isDateDisabled(this.endDate))) {
                                addClass([ele], [STARTDATE, SELECTED$1, RANGEHOVER]);
                                this.addSelectedAttributes(ele, this.startDate, true);
                            }
                            if (!isNullOrUndefined(this.endDate) && +eleDate === +this.endDate
                                && +eleDate <= +this.endDate &&
                                +this.startDate >= +this.min
                                && !this.inputWrapper.container.classList.contains('e-error')
                                && !(this.isDateDisabled(this.startDate) || this.isDateDisabled(this.endDate))) {
                                addClass([ele], [ENDDATE, SELECTED$1]);
                                this.addSelectedAttributes(ele, this.endDate, false);
                            }
                            if (+eleDate === +this.startDate && !isNullOrUndefined(this.endDate) && +eleDate === +this.endDate) {
                                this.addSelectedAttributes(ele, this.endDate, false, true);
                            }
                        }
                    }
                }
            }
        }
    }
    checkMinMaxDays() {
        if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) || (!isNullOrUndefined(this.maxDays) && this.maxDays > 0)) {
            if (!this.isMobile) {
                this.updateMinMaxDays(this.popupObj.element.querySelector('.' + LEFTCALENDER));
                this.updateMinMaxDays(this.popupObj.element.querySelector('.' + RIGHTCALENDER));
            }
            else {
                this.updateMinMaxDays(this.popupObj.element.querySelector('.' + CALENDAR));
            }
        }
    }
    rangeArgs(e) {
        let inputValue;
        let range;
        let startDate = !isNullOrUndefined(this.startDate) ?
            this.globalize.formatDate(this.startDate, { format: this.format, type: 'date', skeleton: 'yMd' }) : null;
        let endDate = !isNullOrUndefined(this.endDate) ?
            this.globalize.formatDate(this.endDate, { format: this.format, type: 'date', skeleton: 'yMd' }) : null;
        if (!isNullOrUndefined(this.endDate) && !isNullOrUndefined(this.startDate)) {
            inputValue = startDate + ' ' + this.separator + ' ' + endDate;
            range = (Math.round(Math.abs((this.startDate.getTime() - this.endDate.getTime()) / (1000 * 60 * 60 * 24))) + 1);
        }
        else {
            inputValue = '';
            range = 0;
        }
        let args = {
            value: this.value,
            startDate: this.startDate,
            endDate: this.endDate,
            daySpan: range,
            e: e || null,
            element: this.element,
            isInteracted: !isNullOrUndefined(e),
            text: inputValue
        };
        return args;
    }
    otherMonthSelect(ele, isStartDate, sameDate) {
        let value = +this.getIdValue(null, ele);
        let dateIdString = '*[id^="/id"]:not(.e-other-month)'.replace('/id', '' + value);
        let tdCell = this.popupObj.element.querySelector(dateIdString);
        if (!isNullOrUndefined(tdCell)) {
            if (isStartDate) {
                addClass([tdCell], [STARTDATE, SELECTED$1]);
                this.addSelectedAttributes(tdCell, this.startDate, true);
            }
            else {
                addClass([tdCell], [ENDDATE, SELECTED$1]);
                this.addSelectedAttributes(tdCell, this.endDate, true);
            }
            if (sameDate) {
                this.addSelectedAttributes(ele, this.endDate, false, true);
            }
        }
    }
    // tslint:disable-next-line:max-func-body-length
    selectRange(event, element) {
        event.preventDefault();
        let date;
        date = event instanceof MouseEvent ? this.getIdValue(event, null) : this.getIdValue(null, element);
        if (!isNullOrUndefined(this.endDate) && !isNullOrUndefined(this.startDate)) {
            if (!this.isMobile || this.isMobile && !this.endButton.element.classList.contains(ACTIVE$1)) {
                this.removeSelection();
            }
        }
        else if (this.isMobile && this.startButton.element.classList.contains(ACTIVE$1)) {
            this.removeSelection();
        }
        let ele = element || event.currentTarget;
        if (isNullOrUndefined(this.startDate)) {
            if (!isNullOrUndefined(this.previousStartValue)) {
                date.setHours(this.previousStartValue.getHours());
                date.setMinutes(this.previousStartValue.getMinutes());
                date.setSeconds(this.previousStartValue.getSeconds());
            }
            this.setProperties({ startDate: new Date('' + date) }, true);
            this.setProperties({ endDate: null }, true);
            this.setValue();
            addClass([ele], STARTDATE);
            this.addSelectedAttributes(ele, this.startDate, true);
            if (ele.classList.contains(OTHERMONTH$1)) {
                this.otherMonthSelect(ele, true);
            }
            this.checkMinMaxDays();
            this.applyButton.disabled = true;
            this.applyButton.element.disabled = true;
            if (this.isMobile) {
                this.endButton.element.classList.add(ACTIVE$1);
                this.startButton.element.classList.remove(ACTIVE$1);
                this.endButton.element.removeAttribute('disabled');
                this.selectableDates();
            }
            this.trigger('select', this.rangeArgs(event));
        }
        else {
            if (+date === +this.startDate || +date > +this.startDate) {
                if (+date === +this.startDate && !isNullOrUndefined(this.minDays) && this.minDays > 1) {
                    return;
                }
                this.setProperties({ endDate: null }, true);
                this.setValue();
                if (this.isMobile || element) {
                    this.hoverSelection(event, element);
                }
                if (!isNullOrUndefined(this.previousEndValue)) {
                    date.setHours(this.previousEndValue.getHours());
                    date.setMinutes(this.previousEndValue.getMinutes());
                    date.setSeconds(this.previousEndValue.getSeconds());
                }
                this.setProperties({ endDate: new Date('' + date) }, true);
                this.setValue();
                let endEle = this.popupObj.element.querySelectorAll('.' + ENDDATE);
                if (this.isMobile) {
                    this.startButton.element.classList.remove(ACTIVE$1);
                    this.endButton.element.classList.add(ACTIVE$1);
                    for (let ele of endEle) {
                        ele.removeAttribute('aria-label');
                        if (!ele.classList.contains(STARTDATE)) {
                            ele.setAttribute('aria-selected', 'false');
                            removeClass([ele], [ENDDATE, SELECTED$1]);
                        }
                        else {
                            this.addSelectedAttributes(ele, this.startDate, true);
                            removeClass([ele], [ENDDATE]);
                        }
                    }
                }
                addClass([ele], ENDDATE);
                if (+this.endDate === +this.startDate) {
                    this.addSelectedAttributes(ele, this.endDate, false, true);
                }
                else {
                    this.addSelectedAttributes(ele, this.endDate, false);
                }
                if (ele.classList.contains(OTHERMONTH$1)) {
                    if (+this.endDate === +this.startDate) {
                        this.otherMonthSelect(ele, false, true);
                    }
                    else {
                        this.otherMonthSelect(ele, false);
                    }
                }
                endEle = this.popupObj.element.querySelectorAll('.' + ENDDATE);
                for (let ele of endEle) {
                    if (ele.classList.contains(STARTDATE)) {
                        removeClass([ele], [RANGEHOVER]);
                    }
                }
                this.applyButton.disabled = false;
                this.applyButton.element.disabled = false;
                if (!this.isMobile) {
                    this.removeClassDisabled();
                }
                this.disabledDateRender();
                this.trigger('select', this.rangeArgs(event));
            }
            else if (+date < +this.startDate) {
                this.removeClassDisabled();
                this.setProperties({ startDate: new Date('' + date) }, true);
                this.setValue();
                this.removeSelectedAttributes();
                removeClass(this.popupObj.element.querySelectorAll('.' + STARTDATE), [STARTDATE, SELECTED$1]);
                addClass([ele], STARTDATE);
                this.addSelectedAttributes(ele, this.startDate, true);
                if (ele.classList.contains(OTHERMONTH$1)) {
                    this.otherMonthSelect(ele, true);
                }
                this.checkMinMaxDays();
            }
        }
        addClass([ele], SELECTED$1);
        this.updateHeader();
        this.removeFocusedDate();
    }
    selectableDates() {
        if (!isNullOrUndefined(this.startDate)) {
            let tdCells = this.calendarElement.querySelectorAll('.' + CALENDAR + ' td');
            let isStartDate = false;
            if (this.currentView() === 'Month') {
                for (let ele of tdCells) {
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(WEEKNUMBER$1)) {
                        if (!ele.classList.contains(DISABLED$1)) {
                            let eleDate = this.getIdValue(null, ele);
                            if (+eleDate < +this.startDate) {
                                addClass([ele], [DATEDISABLED, DISABLED$1, OVERLAY$1]);
                                EventHandler.clearEvents(ele);
                                continue;
                            }
                            else {
                                break;
                            }
                        }
                    }
                    if (ele.classList.contains(STARTDATE) && !ele.classList.contains(OTHERMONTH$1)) {
                        isStartDate = true;
                        break;
                    }
                }
                if (isStartDate) {
                    if (!this.previousIcon.classList.contains(DISABLED$1)) {
                        addClass([this.previousIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
                    }
                }
            }
            else {
                for (let ele of tdCells) {
                    let startMonth = this.startDate.getMonth();
                    let startYear = this.startDate.getFullYear();
                    let element = this.getIdValue(null, ele);
                    if (!this.startButton.element.classList.contains(ACTIVE$1) && ((this.currentView() === 'Year' &&
                        (element.getMonth() < startMonth)) || (this.currentView() === 'Decade' && (element.getFullYear() < startYear)))) {
                        addClass([ele], [DISABLED$1]);
                    }
                    else {
                        break;
                    }
                }
                if (tdCells[0].classList.contains(DISABLED$1)) {
                    this.previousIconHandler(true);
                }
                else if (tdCells[tdCells.length - 1].classList.contains(DISABLED$1)) {
                    this.nextIconHandler(true);
                }
            }
        }
    }
    updateMinMaxDays(calendar) {
        if (!isNullOrUndefined(this.startDate) && (isNullOrUndefined(this.endDate) || this.isMobile)) {
            if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) || (!isNullOrUndefined(this.maxDays) && this.maxDays > 0)) {
                let minDate = new Date(new Date(+this.startDate).setDate(this.startDate.getDate() + (this.minDays - 1)));
                let maxDate = new Date(new Date(+this.startDate).setDate(this.startDate.getDate() + (this.maxDays - 1)));
                minDate = (!isNullOrUndefined(this.minDays) && this.minDays > 0) ? minDate : null;
                maxDate = (!isNullOrUndefined(this.maxDays) && this.maxDays > 0) ? maxDate : null;
                let tdCells = calendar.querySelectorAll('.' + CALENDAR + ' td');
                let maxEle;
                for (let ele of tdCells) {
                    if (!ele.classList.contains(STARTDATE) && !ele.classList.contains(WEEKNUMBER$1)) {
                        let eleDate = this.getIdValue(null, ele);
                        if (!isNullOrUndefined(minDate) && +eleDate === +minDate && ele.classList.contains(DISABLED$1)) {
                            minDate.setDate(minDate.getDate() + 1);
                        }
                        if (!ele.classList.contains(DISABLED$1)) {
                            if (+eleDate <= +this.startDate) {
                                continue;
                            }
                            if (!isNullOrUndefined(minDate) && +eleDate < +minDate) {
                                addClass([ele], [DATEDISABLED, DISABLED$1, OVERLAY$1]);
                                EventHandler.clearEvents(ele);
                            }
                            if (!isNullOrUndefined(maxDate) && +eleDate > +maxDate) {
                                addClass([ele], [DATEDISABLED, DISABLED$1, OVERLAY$1]);
                                this.isMaxDaysClicked = true;
                                EventHandler.clearEvents(ele);
                                if (isNullOrUndefined(maxEle) && !ele.classList.contains(OTHERMONTH$1)) {
                                    maxEle = ele;
                                }
                            }
                        }
                    }
                }
                if (!isNullOrUndefined(maxEle)) {
                    if (this.isMobile) {
                        if (!this.nextIcon.classList.contains(DISABLED$1)) {
                            addClass([this.nextIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
                        }
                    }
                    else {
                        let calendar = closest(maxEle, '.' + RIGHTCALENDER);
                        calendar = isNullOrUndefined(calendar) ? this.leftCalendar : calendar;
                        let isLeftCalendar = calendar.classList.contains(LEFTCALENDER);
                        if (!isLeftCalendar) {
                            if (!this.rightCalNextIcon.classList.contains(DISABLED$1)) {
                                addClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
                            }
                        }
                        else {
                            if (!this.rightCalNextIcon.classList.contains(DISABLED$1)) {
                                addClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
                            }
                            if (!this.leftCalNextIcon.classList.contains(DISABLED$1)) {
                                addClass([this.leftCalNextIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
                            }
                            if (!this.rightCalPrevIcon.classList.contains(DISABLED$1)) {
                                addClass([this.rightCalPrevIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
                            }
                        }
                    }
                }
            }
        }
        else {
            this.isMaxDaysClicked = false;
        }
    }
    removeClassDisabled() {
        let tdCells;
        tdCells = this.popupObj.element.querySelectorAll('.' + CALENDAR + ' td' + '.' + DATEDISABLED);
        for (let ele of tdCells) {
            if (ele.classList.contains(DATEDISABLED)) {
                removeClass([ele], [DATEDISABLED, DISABLED$1, OVERLAY$1]);
                EventHandler.add(ele, 'click', this.selectRange, this);
                if (!this.isMobile) {
                    EventHandler.add(ele, 'mouseover', this.hoverSelection, this);
                }
            }
        }
        if (this.isMobile) {
            if (this.nextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.nextIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
            }
            if (this.previousIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.previousIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
            }
        }
        else {
            if (this.rightCalNextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.rightCalNextIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
            }
            if (this.rightCalPrevIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.rightCalPrevIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
            }
            if (this.leftCalNextIcon.classList.contains(ICONDISABLED)) {
                removeClass([this.leftCalNextIcon], [ICONDISABLED, DISABLED$1, OVERLAY$1]);
            }
        }
    }
    updateHeader() {
        let format = { type: 'date', skeleton: 'yMMMd' };
        if (!isNullOrUndefined(this.endDate) && !isNullOrUndefined(this.startDate)) {
            let range = (Math.round(Math.abs((this.startDate.getTime() - this.endDate.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if (!isNullOrUndefined(this.disabledDayCnt)) {
                range = range - this.disabledDayCnt;
                this.disabledDayCnt = null;
            }
            this.popupObj.element.querySelector('.' + DAYSPAN).textContent = range.toString() + ' ' + this.l10n.getConstant('days');
        }
        else {
            this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
        }
        if (!this.isMobile) {
            if (!isNullOrUndefined(this.endDate) && !isNullOrUndefined(this.startDate)) {
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.globalize.formatDate(this.endDate, format);
            }
            else {
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.l10n.getConstant('endLabel');
            }
            if (!isNullOrUndefined(this.startDate)) {
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.globalize.formatDate(this.startDate, format);
            }
            else {
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.l10n.getConstant('startLabel');
            }
        }
        else {
            if (!isNullOrUndefined(this.startDate)) {
                this.startButton.element.textContent = this.globalize.formatDate(this.startDate, format);
            }
            else {
                this.startButton.element.textContent = this.l10n.getConstant('startLabel');
            }
            if (!isNullOrUndefined(this.endDate) && !isNullOrUndefined(this.startDate)) {
                this.endButton.element.textContent = this.globalize.formatDate(this.endDate, format);
            }
            else {
                this.endButton.element.textContent = this.l10n.getConstant('endLabel');
            }
        }
        if (((!isNullOrUndefined(this.startDate) && +this.startDate < +this.min)
            || ((!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate))
                && +this.startDate > +this.endDate)
            || (!isNullOrUndefined(this.endDate) && +this.endDate > +this.max))
            || (this.isDateDisabled(this.startDate) || this.isDateDisabled(this.endDate))) {
            if (!this.isMobile) {
                this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
                this.popupObj.element.querySelector('.' + STARTLABEL).textContent = this.l10n.getConstant('startLabel');
                this.popupObj.element.querySelector('.' + ENDLABEL).textContent = this.l10n.getConstant('endLabel');
            }
            else {
                this.startButton.element.textContent = this.l10n.getConstant('startLabel');
                this.endButton.element.textContent = this.l10n.getConstant('endLabel');
                this.popupObj.element.querySelector('.' + DAYSPAN).textContent = this.l10n.getConstant('selectedDays');
            }
        }
    }
    removeSelection() {
        this.setProperties({ startDate: null }, true);
        this.setProperties({ endDate: null }, true);
        this.setValue();
        this.removeSelectedAttributes();
        if (this.popupObj.element.querySelectorAll('.' + SELECTED$1).length > 0) {
            removeClass(this.popupObj.element.querySelectorAll('.' + SELECTED$1), [STARTDATE, ENDDATE, SELECTED$1]);
        }
        if (this.popupObj.element.querySelectorAll('.' + FOCUSDATE).length > 0) {
            removeClass(this.popupObj.element.querySelectorAll('.' + FOCUSDATE), FOCUSDATE);
        }
        if (this.popupObj.element.querySelectorAll('.' + RANGEHOVER).length > 0) {
            removeClass(this.popupObj.element.querySelectorAll('.' + RANGEHOVER), [RANGEHOVER]);
        }
    }
    addSelectedAttributes(ele, date, isStartDate, sameDate) {
        if (ele) {
            let title = this.globalize.formatDate(date, { type: 'date', skeleton: 'full' });
            if (!isNullOrUndefined(sameDate) && sameDate) {
                ele.setAttribute('aria-label', 'The current start and end date is ' + '' + title);
            }
            else {
                ele.setAttribute('aria-label', 'The current ' + (isStartDate ? 'start' : 'end') + ' date is ' + '' + title);
            }
            ele.setAttribute('aria-selected', 'true');
        }
    }
    removeSelectedAttributes() {
        let start = this.popupObj.element.querySelectorAll('.' + STARTDATE);
        for (let ele of start) {
            ele.setAttribute('aria-selected', 'false');
            ele.removeAttribute('aria-label');
        }
        let end = this.popupObj.element.querySelectorAll('.' + ENDDATE);
        for (let ele of end) {
            ele.setAttribute('aria-selected', 'false');
            ele.removeAttribute('aria-label');
        }
    }
    updateCalendarElement(calendar) {
        if (calendar.classList.contains(LEFTCALENDER)) {
            this.calendarElement = this.leftCalendar;
            this.currentDate = this.leftCalCurrentDate;
            this.previousIcon = this.leftCalPrevIcon;
            this.nextIcon = this.leftCalNextIcon;
        }
        else {
            this.calendarElement = this.rightCalendar;
            this.currentDate = this.rightCalCurrentDate;
            this.previousIcon = this.rightCalPrevIcon;
            this.nextIcon = this.rightCalNextIcon;
        }
        this.contentElement = calendar.querySelector('.' + CONTENT$1);
        this.tableBodyElement = select('.' + CONTENT$1 + ' tbody', calendar);
        this.table = calendar.querySelector('.' + CONTENT$1).getElementsByTagName('table')[0];
        this.headerTitleElement = calendar.querySelector('.' + HEADER$1 + ' .' + TITLE$1);
        this.headerElement = calendar.querySelector('.' + HEADER$1);
    }
    navPrevMonth(e) {
        e.preventDefault();
        let ele = closest(e.target, '.' + LEFTCALENDER);
        ele = isNullOrUndefined(ele) ? closest(e.target, '.' + RIGHTCALENDER) : ele;
        this.updateCalendarElement(ele);
        this.navigatePrevious(e);
        if (!isNullOrUndefined(this.startDate) && isNullOrUndefined(this.endDate)) {
            this.updateMinMaxDays(ele);
        }
        this.updateControl(ele);
    }
    deviceNavigation(ele) {
        this.deviceCalendarEvent();
        this.updateRange([this.popupObj.element.querySelector('.' + CALENDAR)]);
        if ((!isNullOrUndefined(this.endDate) && this.endButton.element.classList.contains(ACTIVE$1))) {
            this.updateMinMaxDays(this.popupObj.element.querySelector('.' + CALENDAR));
        }
        if (this.endButton.element.classList.contains(ACTIVE$1)) {
            this.selectableDates();
        }
        if (this.currentView() === 'Month') {
            this.bindCalendarCellEvents();
        }
        this.removeFocusedDate();
        this.popupObj.refreshPosition(this.inputElement);
        this.popupObj.show();
    }
    updateControl(calendar) {
        if (calendar.classList.contains(RIGHTCALENDER)) {
            this.rightCalCurrentDate = new Date(+this.currentDate);
        }
        else {
            this.leftCalCurrentDate = new Date(+this.currentDate);
        }
        this.updateNavIcons();
        this.calendarIconEvent();
        if ((this.leftCalendar.querySelector('.e-content').classList.contains('e-month')
            && this.rightCalendar.querySelector('.e-content').classList.contains('e-month'))
            || this.isMobile) {
            this.bindCalendarCellEvents();
        }
        this.removeFocusedDate();
        this.updateRange([calendar]);
        this.presetHeight();
        if (!(this.isMobile || this.enableRtl)) {
            this.popupObj.offsetX = -this.popupWrapper.getBoundingClientRect().width;
            this.popupObj.show();
        }
    }
    navNextMonth(event) {
        event.preventDefault();
        let ele = closest(event.target, '.' + LEFTCALENDER);
        ele = isNullOrUndefined(ele) ? closest(event.target, '.' + RIGHTCALENDER) : ele;
        this.updateCalendarElement(ele);
        this.navigateNext(event);
        if (!isNullOrUndefined(this.startDate) && isNullOrUndefined(this.endDate)) {
            this.updateMinMaxDays(ele);
        }
        this.updateControl(ele);
    }
    compareMonths(start, end) {
        let result;
        if ((this.currentView() === 'Year' || this.currentView() === 'Decade') &&
            start.getFullYear() === end.getFullYear()) {
            result = -1;
        }
        else if (start.getFullYear() > end.getFullYear()) {
            result = -1;
        }
        else if (start.getFullYear() < end.getFullYear()) {
            if (start.getFullYear() + 1 === end.getFullYear() && start.getMonth() === 11 && end.getMonth() === 0) {
                result = -1;
            }
            else {
                result = 1;
            }
        }
        else {
            result = start.getMonth() === end.getMonth() ? 0 : start.getMonth() + 1 === end.getMonth() ? -1 : 1;
        }
        return result;
    }
    isPopupOpen() {
        if (!isNullOrUndefined(this.popupObj) && this.popupObj.element.classList.contains(POPUP$1)) {
            return true;
        }
        return false;
    }
    createRangeHeader() {
        let labelContainer = createElement('div', { className: STARTENDCONTAINER });
        if (!this.isMobile) {
            let startLabel = createElement('a', { className: STARTLABEL });
            let endLabel = createElement('a', { className: ENDLABEL });
            let changeIcon = createElement('span', { className: CHANGEICON });
            attributes(startLabel, { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'Start Date', 'role': 'button' });
            attributes(endLabel, { 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-label': 'End Date', 'role': 'button' });
            labelContainer.appendChild(startLabel);
            labelContainer.appendChild(changeIcon);
            labelContainer.appendChild(endLabel);
            startLabel.textContent = this.l10n.getConstant('startLabel');
            endLabel.textContent = this.l10n.getConstant('endLabel');
        }
        else {
            let endBtn = createElement('button', { className: ENDBUTTON });
            let startBtn = createElement('button', { className: STARTBUTTON });
            this.startButton = new Button({ content: this.l10n.getConstant('startLabel') }, startBtn);
            this.endButton = new Button({ content: this.l10n.getConstant('endLabel') }, endBtn);
            labelContainer.appendChild(startBtn);
            labelContainer.appendChild(endBtn);
        }
        return labelContainer;
    }
    disableInput() {
        if (this.strictMode) {
            if (!isNullOrUndefined(this.previousStartValue) && !isNullOrUndefined(this.previousEndValue)) {
                this.setProperties({ startDate: this.previousStartValue }, true);
                this.setProperties({ endDate: this.previousEndValue }, true);
                this.setValue();
                this.updateInput();
            }
        }
        else {
            this.updateInput();
            this.clearRange();
            this.setProperties({ startDate: null }, true);
            this.setProperties({ endDate: null }, true);
            this.setValue();
            this.errorClass();
        }
        this.setProperties({ enabled: false }, true);
        Input.setEnabled(this.enabled, this.inputElement);
        this.bindEvents();
    }
    validateMinMax() {
        this.min = isNullOrUndefined(this.min) || !(+this.min) ? this.min = new Date(1900, 0, 1) : this.min;
        this.max = isNullOrUndefined(this.max) || !(+this.max) ? this.max = new Date(2099, 11, 31) : this.max;
        if (!(this.min <= this.max)) {
            this.disableInput();
            return;
        }
        if (!isNullOrUndefined(this.minDays) && !isNullOrUndefined(this.maxDays)) {
            if (this.maxDays > 0 && this.minDays > 0 && (this.minDays > this.maxDays)) {
                this.maxDays = null;
            }
        }
        if (!isNullOrUndefined(this.minDays) && this.minDays < 0) {
            this.minDays = null;
        }
        if (!isNullOrUndefined(this.maxDays) && this.maxDays < 0) {
            this.maxDays = null;
        }
    }
    validateRangeStrict() {
        if (!isNullOrUndefined(this.startDate)) {
            if (+this.startDate < +this.min) {
                this.setProperties({ startDate: this.min }, true);
                this.setValue();
            }
            else if (+this.startDate > +this.max) {
                this.setProperties({ startDate: this.max }, true);
            }
        }
        if (!isNullOrUndefined(this.endDate)) {
            if (+this.endDate > +this.max) {
                this.setProperties({ endDate: this.max }, true);
                this.setValue();
            }
            else if (+this.endDate < +this.min) {
                this.setProperties({ endDate: this.min }, true);
                this.setValue();
            }
        }
        if ((!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate)) && +this.startDate > +this.endDate) {
            this.setProperties({ endDate: this.max }, true);
            this.setValue();
        }
        this.validateMinMaxDays();
    }
    validateRange() {
        this.validateMinMaxDays();
    }
    validateMinMaxDays() {
        if (!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate)) {
            let range = (Math.round(Math.abs((this.startDate.getTime() - this.endDate.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            if ((!isNullOrUndefined(this.minDays) && this.minDays > 0) && !(range >= this.minDays)) {
                if (this.strictMode) {
                    let date = new Date(+this.startDate);
                    date.setDate(date.getDate() + (this.minDays - 1));
                    if (+date > +this.max) {
                        this.setProperties({ endDate: this.max }, true);
                        this.setValue();
                    }
                    else {
                        this.setProperties({ endDate: date }, true);
                        this.setValue();
                    }
                }
                else {
                    this.setProperties({ startDate: null }, true);
                    this.setProperties({ endDate: null }, true);
                    this.setValue();
                }
            }
            if ((!isNullOrUndefined(this.maxDays) && this.maxDays > 0) && !(range <= this.maxDays)) {
                if (this.strictMode) {
                    this.endDate = new Date(+this.startDate);
                    this.endDate.setDate(this.endDate.getDate() + (this.maxDays - 1));
                    this.setProperties({ endDate: this.endDate }, true);
                    this.setValue();
                }
                else {
                    this.setProperties({ startDate: null }, true);
                    this.setProperties({ endDate: null }, true);
                    this.setValue();
                }
            }
        }
    }
    renderCalendar() {
        this.calendarElement = createElement('div');
        this.calendarElement.classList.add(CALENDAR);
        if (this.enableRtl) {
            this.calendarElement.classList.add(RTL$2);
        }
        attributes(this.calendarElement, { 'role': 'calendar' });
        super.createHeader();
        super.createContent();
    }
    isSameMonth(start, end) {
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return true;
        }
        return false;
    }
    startMonthCurrentDate() {
        if (this.isSameMonth(this.min, this.max) || +this.currentDate > +this.max || this.isSameMonth(this.currentDate, this.max)) {
            this.currentDate = new Date(+this.max);
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        }
        else if (this.currentDate < this.min) {
            this.currentDate = new Date('' + this.min);
        }
    }
    selectNextMonth() {
        if (!isNullOrUndefined(this.endDate) && !isNullOrUndefined(this.startDate) && !this.isSameMonth(this.endDate, this.currentDate)
            && !this.isDateDisabled(this.endDate) && !this.isDateDisabled(this.startDate)) {
            this.currentDate = new Date(+this.endDate);
        }
        else {
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            return;
        }
        if ((!isNullOrUndefined(this.startDate) && +this.startDate < +this.min)
            || (!isNullOrUndefined(this.endDate) && +this.endDate > +this.max)
            || ((!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate)) && +this.startDate > +this.endDate)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.currentDate.setDate(1);
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
    }
    selectStartMonth() {
        if (!isNullOrUndefined(this.startDate)) {
            if (!isNullOrUndefined(this.max) && this.isSameMonth(this.startDate, this.max)) {
                this.currentDate = new Date(+this.max);
                this.currentDate.setDate(1);
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            }
            else if (!(this.startDate >= this.min && this.startDate <= this.max)
                || this.isDateDisabled(this.startDate)) {
                this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            }
            else {
                this.currentDate = new Date(+this.startDate);
            }
        }
        else {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
            this.startMonthCurrentDate();
        }
        if ((!isNullOrUndefined(this.endDate) && +this.endDate > +this.max)
            || (!isNullOrUndefined(this.startDate) && +this.startDate < +this.min)
            || ((!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate)) && +this.startDate > +this.endDate)) {
            this.currentDate = new Date(new Date().setHours(0, 0, 0, 0));
        }
        this.startMonthCurrentDate();
    }
    createCalendar() {
        let calendarContainer = createElement('div', { className: CALENDARCONTAINER });
        if (!this.isMobile) {
            this.selectStartMonth();
            this.renderCalendar();
            this.leftCalCurrentDate = new Date(+this.currentDate);
            this.calendarElement.classList.add(LEFTCALENDER);
            this.leftCalPrevIcon = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + PREVICON$1);
            this.leftCalNextIcon = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + NEXTICON$1);
            this.leftTitle = this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + TITLE$1);
            remove(this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + ICONCONTAINER$1));
            this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER$1).appendChild(this.leftCalNextIcon);
            this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER$1).appendChild(this.leftCalPrevIcon);
            prepend([this.leftCalPrevIcon], this.calendarElement.querySelector('.' + LEFTCALENDER + ' .' + HEADER$1));
            this.leftCalendar = this.calendarElement;
            let leftContainer = createElement('div', { className: LEFTCONTAINER });
            let rightContainer = createElement('div', { className: RIGHTCONTAINER });
            leftContainer.appendChild(this.leftCalendar);
            calendarContainer.appendChild(leftContainer);
            if (!this.isMobile) {
                EventHandler.add(this.leftTitle, 'click', this.leftNavTitle, this);
            }
            this.selectNextMonth();
            this.renderCalendar();
            this.rightCalCurrentDate = new Date(+this.currentDate);
            addClass([this.calendarElement], RIGHTCALENDER);
            this.rightCalendar = this.calendarElement;
            removeClass([this.leftCalendar && this.leftCalendar.querySelector('.e-content tbody')], 'e-zoomin');
            removeClass([this.rightCalendar && this.rightCalendar.querySelector('.e-content tbody')], 'e-zoomin');
            this.rightCalPrevIcon = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + PREVICON$1);
            this.rightCalNextIcon = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + NEXTICON$1);
            this.rightTitle = this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + TITLE$1);
            remove(this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + ICONCONTAINER$1));
            this.calendarElement.querySelector('table').setAttribute('tabindex', '-1');
            this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER$1).appendChild(this.rightCalNextIcon);
            this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER$1).appendChild(this.rightCalPrevIcon);
            prepend([this.rightCalPrevIcon], this.calendarElement.querySelector('.' + RIGHTCALENDER + ' .' + HEADER$1));
            rightContainer.appendChild(this.rightCalendar);
            calendarContainer.appendChild(rightContainer);
            if (!this.isMobile) {
                EventHandler.add(this.rightTitle, 'click', this.rightNavTitle, this);
            }
        }
        else {
            if (!isNullOrUndefined(this.startDate)) {
                this.currentDate = new Date(+this.startDate);
            }
            super.validateDate();
            super.minMaxUpdate();
            super.render();
            let prevIcon = this.calendarElement.querySelector('.' + CALENDAR + ' .' + PREVICON$1);
            let nextIcon = this.calendarElement.querySelector('.' + CALENDAR + ' .' + NEXTICON$1);
            remove(this.calendarElement.querySelector('.' + CALENDAR + ' .' + ICONCONTAINER$1));
            this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER$1).appendChild(nextIcon);
            this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER$1).appendChild(prevIcon);
            prepend([prevIcon], this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER$1));
            this.deviceCalendar = this.calendarElement;
            calendarContainer.appendChild(this.calendarElement);
            this.headerTitleElement = this.calendarElement.querySelector('.' + CALENDAR + ' .' + HEADER$1 + ' .' + TITLE$1);
        }
        return calendarContainer;
    }
    leftNavTitle(e) {
        if (this.isPopupOpen()) {
            this.calendarElement = this.leftCalendar;
            this.table = this.leftCalendar.querySelector('table');
            this.headerTitleElement = this.leftCalendar.querySelector('.e-title');
            this.tableBodyElement = this.leftCalendar.querySelector('tbody');
            this.tableHeadElement = this.leftCalendar.querySelector('thead');
            this.contentElement = this.leftCalendar.querySelector('.e-content');
            this.updateCalendarElement(this.leftCalendar);
            super.navigateTitle(e);
            this.updateNavIcons();
        }
    }
    rightNavTitle(e) {
        if (this.isPopupOpen()) {
            this.calendarElement = this.rightCalendar;
            this.table = this.rightCalendar.querySelector('table');
            this.headerTitleElement = this.rightCalendar.querySelector('.e-title');
            this.tableBodyElement = this.rightCalendar.querySelector('tbody');
            this.tableHeadElement = this.rightCalendar.querySelector('thead');
            this.contentElement = this.rightCalendar.querySelector('.e-content');
            this.updateCalendarElement(this.rightCalendar);
            super.navigateTitle(e);
            this.updateNavIcons();
        }
    }
    clickEventEmitter(e) {
        if (!this.isMobile) {
            if (closest(e.target, '.e-calendar.e-left-calendar')) {
                this.calendarElement = this.leftCalendar;
                this.updateCalendarElement(this.leftCalendar);
            }
            else {
                this.calendarElement = this.rightCalendar;
                this.updateCalendarElement(this.rightCalendar);
            }
        }
    }
    /**
     * Gets the current view of the Calendar.
     * @returns string
     * @hidden
     */
    currentView() {
        return super.currentView();
    }
    navigatedEvent(e) {
        let element;
        if (this.isMobile && this.currentView() === 'Month') {
            this.bindCalendarCellEvents();
            this.deviceNavigation();
            this.removeFocusedDate();
        }
        else if (this.isMobile && (this.currentView() === 'Decade' || this.currentView() === 'Year')) {
            this.selectableDates();
        }
        else {
            if (!this.isMobile && this.currentView() === 'Month') {
                element = this.calendarElement.classList.contains('e-left-calendar') ? this.leftCalendar : this.rightCalendar;
                if (element === this.leftCalendar && e && !e.target.classList.contains('e-icons')) {
                    this.leftCalCurrentDate = new Date(+this.currentDate);
                    this.rightCalCurrentDate = new Date(new Date(+this.currentDate).setMonth(new Date(+this.currentDate).getMonth() + 1));
                    this.currentDate = this.leftCalCurrentDate;
                    this.updateCalendarElement(this.leftCalendar);
                    this.updateControl(this.leftCalendar);
                    this.updateCalendarElement(this.rightCalendar);
                    this.navigateTo('Month', this.rightCalCurrentDate);
                    this.updateControl(this.rightCalendar);
                    this.updateNavIcons();
                    this.calendarIconEvent();
                    this.calendarIconRipple();
                }
                else if (e && !e.target.classList.contains('e-icons')) {
                    this.rightCalCurrentDate = new Date(+this.currentDate);
                    this.leftCalCurrentDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 1));
                    this.currentDate = this.rightCalCurrentDate;
                    this.updateCalendarElement(this.rightCalendar);
                    this.updateControl(this.rightCalendar);
                    this.updateCalendarElement(this.leftCalendar);
                    this.navigateTo('Month', this.leftCalCurrentDate);
                    this.updateControl(this.leftCalendar);
                    this.updateNavIcons();
                    this.calendarIconEvent();
                    this.calendarIconRipple();
                }
            }
            else if (!this.isMobile && (this.currentView() === 'Decade' || this.currentView() === 'Year')) {
                this.updateNavIcons();
                this.calendarIconEvent();
            }
        }
    }
    createControl() {
        let controlContainer = createElement('div', { className: RANGECONTAINER });
        let headerContainer = createElement('div', { className: RANGEHEADER });
        let labelContainer = this.createRangeHeader();
        headerContainer.appendChild(labelContainer);
        let daySpan = createElement('div', { className: DAYSPAN });
        attributes(daySpan, { 'aria-label': 'Selected Days' });
        daySpan.textContent = this.l10n.getConstant('selectedDays');
        headerContainer.appendChild(daySpan);
        let separator = createElement('div', { className: SEPARATOR });
        let calendarContainer = this.createCalendar();
        controlContainer.appendChild(headerContainer);
        controlContainer.appendChild(separator);
        controlContainer.appendChild(calendarContainer);
        let footerSection = createElement('div', { className: FOOTER$1 });
        let cancelBtn = createElement('button', { className: CANCEL + ' ' + FLAT$1 });
        let applyBtn = createElement('button', { className: APPLY + ' ' + FLAT$1 + ' ' + PRIMARY$1 });
        footerSection.appendChild(applyBtn);
        footerSection.appendChild(cancelBtn);
        let enable = !isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate);
        this.cancelButton = new Button({ content: this.l10n.getConstant('cancelText') }, cancelBtn);
        this.applyButton = new Button({ content: this.l10n.getConstant('applyText'), disabled: !enable }, applyBtn);
        EventHandler.add(applyBtn, 'click', this.applyFunction, this);
        EventHandler.add(cancelBtn, 'click', this.cancelFunction, this);
        this.popupWrapper.appendChild(controlContainer);
        document.body.appendChild(this.popupWrapper);
        if (!this.isMobile) {
            if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
                this.createPresets();
                this.listRippleEffect();
                addClass([controlContainer], RANGEBORDER);
                addClass([this.popupWrapper], 'e-preset-wrapper');
                let presets = this.popupWrapper.querySelector('.' + PRESETS);
                presets.style.height = this.popupWrapper.querySelector('.' + RANGECONTAINER).getBoundingClientRect().height + 'px';
            }
        }
        this.popupWrapper.appendChild(footerSection);
        if (this.isMobile) {
            this.deviceHeaderUpdate();
        }
        this.renderPopup();
    }
    cancelFunction(eve) {
        if (document.activeElement !== this.inputElement) {
            this.preventFocus = true;
            if (!this.isMobile) {
                this.inputElement.focus();
                addClass([this.inputWrapper.container], [INPUTFOCUS$1]);
            }
        }
        eve.preventDefault();
        if (!this.isMobile && this.isKeyPopup) {
            this.inputElement.focus();
            this.isKeyPopup = false;
        }
        this.setProperties({ startDate: null }, true);
        this.setProperties({ endDate: null }, true);
        this.hide();
    }
    deviceHeaderUpdate() {
        if (isNullOrUndefined(this.startDate) && isNullOrUndefined(this.endDate)) {
            this.endButton.element.setAttribute('disabled', '');
            this.startButton.element.classList.add(ACTIVE$1);
        }
        else if (!isNullOrUndefined(this.startDate)) {
            this.startButton.element.classList.add(ACTIVE$1);
        }
    }
    applyFunction(eve) {
        if (document.activeElement !== this.inputElement) {
            this.preventFocus = true;
            if (!this.isMobile) {
                this.inputElement.focus();
                addClass([this.inputWrapper.container], [INPUTFOCUS$1]);
            }
        }
        eve.preventDefault();
        if (!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate)) {
            this.previousStartValue = new Date(+this.startDate);
            this.previousEndValue = new Date(+this.endDate);
            this.previousEleValue = this.inputElement.value;
            Input.setValue(this.rangeArgs(eve).text, this.inputElement, this.floatLabelType, this.showClearButton);
            this.changeTrigger(eve);
            this.hide();
            this.errorClass();
        }
        else {
            this.hide();
        }
        if (!this.isMobile) {
            this.isKeyPopup = false;
            if (this.isRangeIconClicked) {
                this.inputWrapper.container.children[1].focus();
                this.popupKeyboardModule = new KeyboardEvents(this.inputWrapper.container.children[1], {
                    eventName: 'keydown',
                    keyAction: this.popupKeyActionHandle.bind(this),
                    keyConfigs: this.keyInputConfigs
                });
            }
        }
    }
    onMouseClick(event, item) {
        let target = item || event.target;
        let li = closest(target, '.' + LISTCLASS);
        let isClick = li && li.classList.contains(ACTIVE$1);
        if (li && li.classList.contains(LISTCLASS)) {
            this.setListSelection(li, event);
        }
        if (!this.isMobile) {
            this.preventFocus = true;
            if (li && li.classList.contains(LISTCLASS) && li.getAttribute('id') === 'custom_range') {
                this.leftCalendar.children[1].firstElementChild.focus();
            }
            else {
                if (!isClick && event.type === 'keydown') {
                    this.inputElement.focus();
                }
            }
        }
    }
    onMouseOver(event) {
        let li = closest(event.target, '.' + LISTCLASS);
        if (li && li.classList.contains(LISTCLASS) && !li.classList.contains(HOVER)) {
            addClass([li], HOVER);
        }
    }
    onMouseLeave(event) {
        let item = closest(event.target, '.' + HOVER);
        if (!isNullOrUndefined(item)) {
            removeClass([item], HOVER);
        }
    }
    setListSelection(li, event) {
        if (li && (!li.classList.contains(ACTIVE$1) || (this.isMobile && li.classList.contains(ACTIVE$1)))) {
            if (this.isMobile && li.classList.contains(ACTIVE$1)) {
                this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
                let values = this.presetsItem[this.activeIndex];
                if (values.id === 'custom_range') {
                    this.renderCustomPopup();
                    return;
                }
                return;
            }
            this.removeListSelection();
            this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
            addClass([li], ACTIVE$1);
            li.setAttribute('aria-selected', 'true');
            let values = this.presetsItem[this.activeIndex];
            if (values.id === 'custom_range') {
                this.renderCustomPopup();
            }
            else {
                this.applyPresetRange(values);
            }
        }
    }
    removeListSelection() {
        let item = this.presetElement.querySelector('.' + ACTIVE$1);
        if (!isNullOrUndefined(item)) {
            removeClass([item], ACTIVE$1);
            item.removeAttribute('aria-selected');
        }
    }
    setValue() {
        if (isNullOrUndefined(this.startDate) && isNullOrUndefined(this.endDate)) {
            this.setProperties({ value: null }, true);
        }
        else {
            this.setProperties({ value: [this.startDate, this.endDate] }, true);
        }
    }
    applyPresetRange(values) {
        this.hide();
        this.presetsItem[this.presetsItem.length - 1].start = null;
        this.presetsItem[this.presetsItem.length - 1].end = null;
        this.setProperties({ startDate: values.start }, true);
        this.setProperties({ endDate: values.end }, true);
        this.setValue();
        this.refreshControl();
        this.trigger('select', this.rangeArgs(null));
        this.changeTrigger();
        this.previousEleValue = this.inputElement.value;
        this.isCustomRange = false;
        this.leftCalendar = this.rightCalendar = null;
        if (this.isKeyPopup) {
            this.isRangeIconClicked = false;
            this.inputElement.focus();
        }
    }
    renderCustomPopup() {
        this.isCustomWindow = true;
        this.popupObj.hide();
        this.popupWrapper = createElement('div', { id: this.element.id + '_popup', className: ROOT$2 + ' ' + POPUP$1 });
        this.renderControl();
        this.isCustomRange = true;
        if (!this.isMobile) {
            this.calendarFocus();
        }
    }
    listRippleEffect() {
        for (let li of this.liCollections) {
            rippleEffect(li);
        }
    }
    createPresets() {
        if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
            this.presetElement = createElement('div', { className: PRESETS, attrs: { 'tabindex': '0' } });
            let listTag = ListBase.createList(this.presetsItem, null, true);
            attributes(listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
            this.presetElement.appendChild(listTag);
            this.popupWrapper.appendChild(this.presetElement);
            this.liCollections = this.presetElement.querySelectorAll('.' + LISTCLASS);
            this.wireListEvents();
            if (this.isMobile) {
                this.presetElement.style.width = this.inputWrapper.container.getBoundingClientRect().width + 'px';
            }
            if (!isNullOrUndefined(this.activeIndex) && this.activeIndex > -1) {
                addClass([this.liCollections[this.activeIndex]], ACTIVE$1);
            }
        }
    }
    wireListEvents() {
        EventHandler.add(this.presetElement, 'click', this.onMouseClick, this);
        if (!this.isMobile) {
            EventHandler.add(this.presetElement, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.presetElement, 'mouseout', this.onMouseLeave, this);
        }
    }
    unWireListEvents() {
        if (!isNullOrUndefined(this.presetElement)) {
            EventHandler.remove(this.presetElement, 'click', this.onMouseClick);
            if (!this.isMobile) {
                EventHandler.remove(this.presetElement, 'mouseover', this.onMouseOver);
                EventHandler.remove(this.presetElement, 'mouseout', this.onMouseLeave);
            }
        }
    }
    // tslint:disable-next-line:max-func-body-length
    renderPopup() {
        this.popupWrapper.classList.add('e-control');
        let popupWidth = this.popupWrapper.getBoundingClientRect().width;
        if (!isNullOrUndefined(this.cssClass) && this.cssClass.trim() !== '') {
            this.popupWrapper.classList.add(this.cssClass);
        }
        if (this.isMobile && this.isCustomWindow) {
            this.modal = createElement('div');
            document.body.appendChild(this.modal);
        }
        this.popupObj = new Popup(this.popupWrapper, {
            relateTo: this.isMobile && this.isCustomWindow ? document.body :
                (!isNullOrUndefined(this.targetElement) ? this.targetElement : this.inputWrapper.container),
            position: (this.isMobile ?
                (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && !this.isCustomWindow ?
                    { X: 'left', Y: 'bottom' } : { X: 'center', Y: 'center' }) :
                this.enableRtl ? { X: 'left', Y: 'bottom' } : { X: 'right', Y: 'bottom' }),
            offsetX: this.isMobile || this.enableRtl ? 0 : -popupWidth,
            offsetY: OFFSETVALUE$1,
            collision: this.isMobile ?
                (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && !this.isCustomWindow ?
                    { X: 'fit' } : { X: 'fit', Y: 'fit' }) : { X: 'fit' },
            targetType: this.isMobile && this.isCustomWindow ? 'container' : 'relative',
            enableRtl: this.enableRtl,
            zIndex: this.zIndex,
            open: () => {
                attributes(this.inputElement, { 'aria-expanded': 'true' });
                addClass([this.inputWrapper.buttons[0]], ACTIVE$1);
                if (!this.isMobile) {
                    if (this.cancelButton) {
                        this.btnKeyboardModule = new KeyboardEvents(this.cancelButton.element, {
                            eventName: 'keydown',
                            keyAction: this.hide.bind(this),
                            keyConfigs: { tab: 'tab' }
                        });
                    }
                    if (!isNullOrUndefined(this.leftCalendar)) {
                        if (!this.isRangeIconClicked) {
                            this.calendarFocus();
                        }
                    }
                    if (!isNullOrUndefined(this.presetElement)) {
                        this.presetKeyboardModule = new KeyboardEvents(this.presetElement, {
                            eventName: 'keydown',
                            keyAction: this.presetKeyActionHandler.bind(this),
                            keyConfigs: this.presetKeyConfig
                        });
                        if (isNullOrUndefined(this.leftCalendar)) {
                            this.preventBlur = true;
                            this.presetElement.focus();
                        }
                        else {
                            this.presetElement.setAttribute('tabindex', '-1');
                        }
                    }
                    this.popupKeyBoardHandler();
                }
                if (this.isMobile && !Browser.isDevice) {
                    EventHandler.add(document, 'keydown', this.popupCloseHandler, this);
                }
            },
            close: () => {
                attributes(this.inputElement, { 'aria-expanded': 'false' });
                removeClass([this.inputWrapper.buttons[0]], ACTIVE$1);
                if (!this.isMobile) {
                    if (this.isRangeIconClicked) {
                        this.inputWrapper.container.children[1].focus();
                    }
                }
                if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label)) {
                    this.unWireListEvents();
                }
                if (!isNullOrUndefined(this.popupObj)) {
                    remove(this.popupObj.element);
                    this.popupObj.destroy();
                    this.popupObj = null;
                }
                if (this.isMobile && !Browser.isDevice) {
                    EventHandler.remove(document, 'keydown', this.popupCloseHandler);
                }
            }
        });
        document.body.appendChild(this.popupObj.element);
        if (this.isMobile) {
            this.popupObj.element.classList.add(DEVICE$1);
            if (!this.isMobile) {
                this.popupObj.element.classList.add('e-bigger');
            }
        }
        if (this.isMobile && this.isCustomWindow) {
            addClass([this.modal], [DEVICE$1, ROOT$2, 'e-range-modal']);
            document.body.className += ' ' + OVERFLOW$1;
            this.modal.style.display = 'block';
        }
        this.presetHeight();
        if (!(this.isMobile || this.enableRtl)) {
            this.popupObj.offsetX = -this.popupWrapper.getBoundingClientRect().width;
        }
        this.popupObj.refreshPosition(this.inputElement);
        this.popupObj.show();
        EventHandler.add(document, 'mousedown touchstart', this.documentHandler, this);
    }
    popupCloseHandler(e) {
        switch (e.keyCode) {
            case 27:
                this.hide();
                break;
        }
    }
    calendarFocus() {
        let startDate = this.popupObj && this.popupObj.element.querySelector('.' + STARTDATE);
        if (startDate) {
            let ele = closest(startDate, '.' + RIGHTCALENDER);
            ele = isNullOrUndefined(ele) ? this.leftCalendar : ele;
            if (this.isRangeIconClicked) {
                this.inputWrapper.container.focus();
            }
            else {
                this.preventBlur = true;
                ele.children[1].firstElementChild.focus();
            }
            addClass([startDate], FOCUSDATE);
        }
        else {
            if (this.isRangeIconClicked) {
                this.inputWrapper.container.focus();
            }
            else {
                this.preventBlur = true;
                this.leftCalendar.children[1].firstElementChild.focus();
            }
        }
    }
    presetHeight() {
        let presets = this.popupObj && this.popupObj.element.querySelector('.' + PRESETS);
        let rangeContainer = this.popupObj && this.popupObj.element.querySelector('.' + RANGECONTAINER);
        if (!isNullOrUndefined(presets) && !isNullOrUndefined(rangeContainer)) {
            presets.style.height = rangeContainer.getBoundingClientRect().height + 'px';
        }
    }
    presetKeyActionHandler(e) {
        switch (e.action) {
            case 'moveDown':
                this.listMoveDown(e);
                this.setScrollPosition();
                e.preventDefault();
                break;
            case 'moveUp':
                this.listMoveUp(e);
                this.setScrollPosition();
                e.preventDefault();
                break;
            case 'enter':
                let hvrItem = this.getHoverLI();
                let actItem = this.getActiveLI();
                if (!isNullOrUndefined(this.leftCalendar) && !isNullOrUndefined(actItem)) {
                    if (isNullOrUndefined(hvrItem) || (!isNullOrUndefined(actItem) && actItem === hvrItem)) {
                        this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(actItem);
                        let values = this.presetsItem[this.activeIndex];
                        if (values.id === 'custom_range') {
                            this.calendarFocus();
                            actItem.classList.remove(HOVER);
                            e.preventDefault();
                            return;
                        }
                    }
                }
                if (!isNullOrUndefined(hvrItem) || !isNullOrUndefined(actItem)) {
                    this.onMouseClick(e, hvrItem || actItem);
                }
                e.preventDefault();
                break;
            case 'tab':
                if (this.leftCalendar) {
                    let item = this.getHoverLI();
                    if (!isNullOrUndefined(item)) {
                        item.classList.remove(HOVER);
                    }
                }
                else {
                    this.hide();
                    e.preventDefault();
                }
                break;
        }
    }
    listMoveDown(e) {
        let hvrItem = this.getHoverLI();
        let actItem = this.getActiveLI();
        if (!isNullOrUndefined(hvrItem)) {
            let li = hvrItem.nextElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                removeClass([hvrItem], HOVER);
                addClass([li], HOVER);
            }
        }
        else if (!isNullOrUndefined(actItem)) {
            let li = actItem.nextElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                addClass([li], HOVER);
            }
        }
        else {
            addClass([this.liCollections[0]], HOVER);
        }
    }
    listMoveUp(e) {
        let hvrItem = this.getHoverLI();
        let actItem = this.getActiveLI();
        if (!isNullOrUndefined(hvrItem)) {
            let li = hvrItem.previousElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                removeClass([hvrItem], HOVER);
                addClass([li], HOVER);
            }
        }
        else if (!isNullOrUndefined(actItem)) {
            let li = actItem.previousElementSibling;
            if (!isNullOrUndefined(li) && li.classList.contains(LISTCLASS)) {
                addClass([li], HOVER);
            }
        }
    }
    getHoverLI() {
        let item = this.presetElement.querySelector('.' + HOVER);
        return item;
    }
    getActiveLI() {
        let item = this.presetElement.querySelector('.' + ACTIVE$1);
        return item;
    }
    popupKeyBoardHandler() {
        this.popupKeyboardModule = new KeyboardEvents(this.popupWrapper, {
            eventName: 'keydown',
            keyAction: this.popupKeyActionHandle.bind(this),
            keyConfigs: { escape: 'escape' }
        });
        this.popupKeyboardModule = new KeyboardEvents(this.inputWrapper.container.children[1], {
            eventName: 'keydown',
            keyAction: this.popupKeyActionHandle.bind(this),
            keyConfigs: this.keyInputConfigs
        });
    }
    setScrollPosition() {
        let listHeight = this.presetElement.getBoundingClientRect().height;
        let hover = this.presetElement.querySelector('.' + HOVER);
        let active = this.presetElement.querySelector('.' + ACTIVE$1);
        let element = !isNullOrUndefined(hover) ? hover : active;
        if (!isNullOrUndefined(element)) {
            let nextEle = element.nextElementSibling;
            let height = nextEle ? nextEle.offsetTop : element.offsetTop;
            let liHeight = element.getBoundingClientRect().height;
            if ((height + element.offsetTop) > listHeight) {
                this.presetElement.scrollTop = nextEle ? (height - (listHeight / 2 + liHeight / 2)) : height;
            }
            else {
                this.presetElement.scrollTop = 0;
            }
        }
    }
    popupKeyActionHandle(e) {
        switch (e.action) {
            case 'escape':
                if (this.isPopupOpen()) {
                    if (this.isKeyPopup) {
                        this.inputElement.focus();
                        this.isKeyPopup = false;
                    }
                    this.hide();
                }
                else {
                    this.inputWrapper.container.children[1].blur();
                }
                break;
            case 'enter':
                if (!this.isPopupOpen()) {
                    this.show();
                }
                else {
                    this.inputWrapper.container.children[1].focus();
                }
                break;
            case 'tab':
                this.hide();
        }
    }
    documentHandler(e) {
        if (isNullOrUndefined(this.popupObj)) {
            return;
        }
        let target = e.target;
        if (!this.inputWrapper.container.contains(target) ||
            (!isNullOrUndefined(this.popupObj) && !closest(target, this.popupWrapper.id))) {
            e.preventDefault();
        }
        if ((isNullOrUndefined(this.targetElement) ||
            (!isNullOrUndefined(this.targetElement) && !(target === this.targetElement))) &&
            !(closest(target, '#' + this.popupObj.element.id))
            && !(closest(target, '.' + INPUTCONTAINER$1) === this.inputWrapper.container)
            && !(closest(target, '.e-daterangepicker.e-popup') && (!target.classList.contains('e-day')))) {
            this.preventBlur = false;
            if (this.isPopupOpen()) {
                if (!this.isMobile) {
                    this.isRangeIconClicked = false;
                }
                this.applyFunction(e);
                if (isNullOrUndefined(this.startDate) || isNullOrUndefined(this.endDate)) {
                    this.clear();
                    this.clearRange();
                }
            }
        }
    }
    createInput() {
        this.inputWrapper = Input.createInput({
            floatLabelType: this.floatLabelType,
            element: this.inputElement,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: this.cssClass,
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
            },
            buttons: [DATERANGEICON]
        });
        attributes(this.inputElement, {
            'aria-readonly': this.readonly ? 'true' : 'false', 'tabindex': '1', 'aria-haspopup': 'true',
            'aria-activedescendant': 'null', 'aria-owns': this.element.id + '_popup', 'aria-expanded': 'false',
            'role': 'daterangepicker', 'autocomplete': 'off', 'aria-disabled': !this.enabled ? 'true' : 'false',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false'
        });
        Input.addAttributes({ 'aria-label': 'select' }, this.inputWrapper.buttons[0]);
        if (!isNullOrUndefined(this.placeholder) && this.placeholder.trim() !== '') {
            Input.addAttributes({ 'aria-placeholder': this.placeholder }, this.inputElement);
        }
        this.setEleWidth(this.width);
        addClass([this.inputWrapper.container], DATERANGEWRAPPER);
        if (isNullOrUndefined(this.element.getAttribute('name'))) {
            attributes(this.inputElement, { 'name': this.element.id });
        }
        if (this.inputElement.type === 'hidden') {
            this.inputWrapper.container.style.display = 'none';
        }
        this.refreshControl();
        this.previousEleValue = this.inputElement.value;
    }
    setEleWidth(width) {
        if (typeof width === 'string') {
            this.inputWrapper.container.style.width = (this.width);
        }
        else if (typeof width === 'number') {
            this.inputWrapper.container.style.width = formatUnit(this.width);
        }
        else {
            this.inputWrapper.container.style.width = '100%';
        }
    }
    refreshControl() {
        this.validateMinMax();
        if (this.strictMode) {
            this.validateRangeStrict();
        }
        let isDisabled = this.disabledDates();
        if (this.strictMode && (isDisabled)) {
            this.setProperties({ startDate: this.previousStartValue }, true);
            this.setProperties({ endDate: this.previousEndValue }, true);
            this.setValue();
        }
        this.updateInput();
        if (!this.strictMode) {
            this.validateRange();
        }
        if (!this.strictMode && (isDisabled)) {
            this.clearRange();
        }
        if (!isNullOrUndefined(this.endDate) && !isNullOrUndefined(this.startDate) && !isDisabled) {
            this.disabledDateRender();
        }
        this.errorClass();
        this.previousStartValue = isNullOrUndefined(this.startDate) || isNaN(+this.startDate) ? null : new Date(+this.startDate);
        this.previousEndValue = isNullOrUndefined(this.endDate) || isNaN(+this.endDate) ? null : new Date(+this.endDate);
    }
    updateInput() {
        if (!isNullOrUndefined(this.endDate) && !isNullOrUndefined(this.startDate)) {
            let startDate = this.globalize.formatDate(this.startDate, { format: this.format, type: 'date', skeleton: 'yMd' });
            let endDate = this.globalize.formatDate(this.endDate, { format: this.format, type: 'date', skeleton: 'yMd' });
            Input.setValue(startDate + ' ' + this.separator + ' ' + endDate, this.inputElement, this.floatLabelType, this.showClearButton);
            this.previousStartValue = new Date(+this.startDate);
            this.previousEndValue = new Date(+this.endDate);
        }
    }
    isDateDisabled(date) {
        let value = new Date(+date);
        if (+value < +this.min || +value > +this.max) {
            return true;
        }
        this.virtualRenderCellArgs = {
            date: value,
            isDisabled: false,
        };
        let args = this.virtualRenderCellArgs;
        this.virtualRenderCellEvent(args);
        if (args.isDisabled) {
            return true;
        }
        return false;
    }
    disabledDateRender() {
        this.disabledDays = [];
        this.disabledDayCnt = null;
        let localDate = new Date(+this.startDate);
        let count = 0;
        while (+localDate <= +this.endDate) {
            this.virtualRenderCellArgs = {
                date: localDate,
                isDisabled: false,
            };
            let args = this.virtualRenderCellArgs;
            this.virtualRenderCellEvent(args);
            if (args.isDisabled) {
                this.disabledDays.push(new Date(+args.date));
                if (+localDate > +this.startDate && +localDate < +this.endDate) {
                    count++;
                }
            }
            this.addDay(localDate, 1, null, this.max, this.min);
        }
        this.disabledDayCnt = count;
    }
    virtualRenderCellEvent(args) {
        extend(this.virtualRenderCellArgs, { name: 'renderDayCell' });
        this.trigger('renderDayCell', args);
    }
    disabledDates() {
        let isStartDisabled = false;
        let isEndDisabled = false;
        if (!isNullOrUndefined(this.endDate) && !isNullOrUndefined(this.startDate)) {
            this.setProperties({ value: null }, true);
            isStartDisabled = this.isDateDisabled(this.startDate);
            isEndDisabled = this.isDateDisabled(this.endDate);
            this.currentDate = null;
            this.setProperties({ value: null }, true);
            this.setValue();
        }
        return (isStartDisabled || isEndDisabled);
    }
    changeTrigger(e) {
        if (this.previousEleValue !== this.inputElement.value) {
            if (+this.initStartDate !== +this.startDate || +this.initEndDate !== +this.endDate) {
                this.trigger('change', this.rangeArgs(e));
            }
        }
        this.previousEleValue = this.inputElement.value;
        this.initStartDate = this.checkDateValue(this.startDate);
        this.initEndDate = this.checkDateValue(this.endDate);
    }
    /**
     * This method is used to navigate to the month/year/decade view of the Calendar.
     * @param  {string} view - Specifies the view of the Calendar.
     * @param  {Date} date - Specifies the focused date in a view.
     * @returns void
     * @hidden
     */
    navigateTo(view, value) {
        super.navigateTo(view, value);
    }
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    focusIn() {
        if (document.activeElement !== this.inputElement && this.enabled) {
            addClass([this.inputWrapper.container], [INPUTFOCUS$1]);
            this.inputElement.focus();
            let focusArguments = {
                model: this
            };
            this.trigger('focus', focusArguments);
        }
    }
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    focusOut() {
        let isBlur = this.preventBlur;
        if (document.activeElement === this.inputElement) {
            removeClass([this.inputWrapper.container], [INPUTFOCUS$1]);
            this.preventBlur = false;
            this.inputElement.blur();
            this.preventBlur = isBlur;
        }
    }
    /**
     * To destroy the widget.
     * @returns void
     */
    destroy() {
        this.hide();
        let ariaAttrs = {
            'aria-readonly': this.readonly ? 'true' : 'false', 'tabindex': '1', 'aria-haspopup': 'true',
            'aria-activedescendant': 'null', 'aria-owns': this.element.id + '_popup', 'aria-expanded': 'false',
            'role': 'daterangepicker', 'autocomplete': 'off', 'aria-disabled': !this.enabled ? 'true' : 'false',
            'autocorrect': 'off', 'autocapitalize': 'off', 'aria-invalid': 'false', 'spellcheck': 'false'
        };
        if (this.inputElement) {
            removeClass([this.inputElement], [ROOT$2]);
            EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
            Input.removeAttributes(ariaAttrs, this.inputElement);
            this.ensureInputAttribute();
            this.inputElement.classList.remove('e-input');
            if (!isNullOrUndefined(this.inputWrapper)) {
                EventHandler.remove(this.inputWrapper.buttons[0], 'click', this.rangeIconHandler);
                if (this.angularTag === null) {
                    this.inputWrapper.container.parentElement.appendChild(this.inputElement);
                }
                detach(this.inputWrapper.container);
            }
        }
        if (!isNullOrUndefined(this.inputKeyboardModule) && !this.isMobile) {
            this.inputKeyboardModule.destroy();
        }
        if (this.popupObj) {
            if (!this.isMobile) {
                this.clearCalendarEvents();
            }
        }
        super.destroy();
        this.inputWrapper = this.popupWrapper = this.popupObj = this.cloneElement = this.presetElement = null;
    }
    ensureInputAttribute() {
        for (let attr = 0; attr < this.inputElement.attributes.length; attr++) {
            let prop = this.inputElement.attributes[attr].name;
            if (isNullOrUndefined(this.cloneElement.getAttribute(prop))) {
                if (prop.toLowerCase() === 'value' || isNullOrUndefined(this.cloneElement.getAttribute('value'))) {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(prop);
            }
        }
    }
    /**
     * To get component name
     * @returns string
     * @private
     */
    getModuleName() {
        return 'daterangepicker';
    }
    /**
     * Return the properties that are maintained upon browser refresh.
     * @returns string
     */
    getPersistData() {
        let keyEntity = ['startDate', 'endDate', 'value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Return the selected range and day span in the DateRangePicker.
     * @returns Object
     */
    getSelectedRange() {
        let range;
        if (!isNullOrUndefined(this.startDate) && !isNullOrUndefined(this.endDate)) {
            range = (Math.round(Math.abs((this.startDate.getTime() - this.endDate.getTime()) / (1000 * 60 * 60 * 24))) + 1);
            this.disabledDateRender();
            if (!isNullOrUndefined(this.disabledDayCnt)) {
                range = range - this.disabledDayCnt;
                this.disabledDayCnt = null;
            }
        }
        else {
            range = 0;
        }
        return { startDate: this.startDate, endDate: this.endDate, daySpan: range };
    }
    /**
     * To open the Popup container in the DateRangePicker component.
     * @returns void
     */
    show(element) {
        if ((this.enabled && this.readonly) || !this.enabled || this.popupObj) {
            return;
        }
        else {
            if (!this.isPopupOpen()) {
                if (element) {
                    this.targetElement = element;
                }
                let args = {
                    popup: this.popupObj || null,
                    cancel: false,
                    date: this.inputElement.value,
                    model: this,
                    e: event
                };
                this.trigger('open', args);
                if (!args.cancel) {
                    this.createPopup();
                    let isPreset = (!this.isCustomRange || (this.isMobile && this.isCustomRange));
                    if (!isUndefined(this.presets[0].start && this.presets[0].end && this.presets[0].label) && isPreset) {
                        this.setScrollPosition();
                    }
                }
            }
        }
    }
    /**
     * To close the Popup container in the DateRangePicker component.
     * @returns void
     */
    hide() {
        if (this.popupObj) {
            if (isNullOrUndefined(this.previousEndValue) && isNullOrUndefined(this.previousStartValue)) {
                this.clearRange();
            }
            else {
                if (!isNullOrUndefined(this.previousStartValue)) {
                    this.setProperties({ startDate: new Date('' + this.previousStartValue) }, true);
                    this.setValue();
                    this.currentDate = new Date('' + this.startDate);
                }
                else {
                    this.setProperties({ startDate: null }, true);
                    this.setValue();
                }
                if (!isNullOrUndefined(this.previousEndValue)) {
                    this.setProperties({ endDate: new Date('' + this.previousEndValue) }, true);
                    this.setValue();
                }
                else {
                    this.setProperties({ endDate: null }, true);
                    this.setValue();
                }
            }
            if (this.isPopupOpen()) {
                let args = {
                    cancel: false,
                    popup: this.popupObj,
                    date: this.inputElement.value,
                    model: this,
                    e: event
                };
                this.trigger('close', args);
                if (!args.cancel) {
                    if (this.isMobile) {
                        if (!isNullOrUndefined(this.startButton) && !isNullOrUndefined(this.endButton)) {
                            EventHandler.remove(this.startButton.element, 'click', this.deviceHeaderClick);
                            EventHandler.remove(this.endButton.element, 'click', this.deviceHeaderClick);
                        }
                    }
                    if (this.popupObj) {
                        this.popupObj.hide();
                    }
                    if (!this.isMobile) {
                        if (!isNullOrUndefined(this.leftKeyboardModule) && !isNullOrUndefined(this.rightKeyboardModule)) {
                            this.leftKeyboardModule.destroy();
                            this.rightKeyboardModule.destroy();
                        }
                        if (!isNullOrUndefined(this.presetElement)) {
                            this.presetKeyboardModule.destroy();
                        }
                        if (!isNullOrUndefined(this.cancelButton)) {
                            this.btnKeyboardModule.destroy();
                        }
                    }
                    this.targetElement = null;
                    removeClass([document.body], OVERFLOW$1);
                    EventHandler.remove(document, 'mousedown touchstart', this.documentHandler);
                    if (this.isMobile && this.modal) {
                        this.modal.style.display = 'none';
                        this.modal.outerHTML = '';
                        this.modal = null;
                    }
                    this.isKeyPopup = this.dateDisabled = false;
                }
            }
        }
    }
    setLocale() {
        this.globalize = new Internationalization(this.locale);
        this.l10n.setLocale(this.locale);
        this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
        Input.setPlaceholder(this.placeholder, this.inputElement);
        this.updateInput();
        this.changeTrigger();
    }
    refreshChange() {
        this.refreshControl();
        this.changeTrigger();
    }
    setDate() {
        Input.setValue('', this.inputElement, this.floatLabelType, this.showClearButton);
        this.refreshChange();
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    onPropertyChanged(newProp, oldProp) {
        let format = { format: this.format, type: 'date', skeleton: 'yMd' };
        for (let prop of Object.keys(newProp)) {
            this.hide();
            switch (prop) {
                case 'width':
                    this.setEleWidth(this.width);
                    break;
                case 'separator':
                    this.previousEleValue = this.inputElement.value;
                    this.setProperties({ separator: newProp.separator }, true);
                    this.updateInput();
                    this.changeTrigger();
                    break;
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.setProperties({ placeholder: newProp.placeholder }, true);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement);
                    this.inputElement.setAttribute('aria-readonly', '' + this.readonly);
                    break;
                case 'cssClass':
                    if (this.popupWrapper) {
                        addClass([this.popupWrapper], [newProp.cssClass]);
                    }
                    addClass([this.inputWrapper.container], [newProp.cssClass]);
                    this.setProperties({ cssClass: newProp.cssClass }, true);
                    break;
                case 'enabled':
                    this.setProperties({ enabled: newProp.enabled }, true);
                    Input.setEnabled(this.enabled, this.inputElement);
                    this.bindEvents();
                    break;
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.updateInput();
                    this.changeTrigger();
                    break;
                case 'locale':
                    this.setProperties({ locale: newProp.locale }, true);
                    this.setLocale();
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'startDate':
                    if (typeof newProp.startDate === 'string') {
                        newProp.startDate = this.globalize.parseDate(newProp.startDate, format);
                    }
                    this.setProperties({ startDate: newProp.startDate }, true);
                    this.setValue();
                    this.setDate();
                    break;
                case 'endDate':
                    if (typeof newProp.endDate === 'string') {
                        newProp.endDate = this.globalize.parseDate(newProp.endDate, format);
                    }
                    this.setProperties({ endDate: this.checkDateValue(new Date('' + newProp.endDate)) }, true);
                    this.setValue();
                    this.setDate();
                    break;
                case 'value':
                    this.setProperties({ value: newProp.value }, true);
                    if (isNullOrUndefined(this.value)) {
                        this.setProperties({ startDate: null }, true);
                        this.setProperties({ endDate: null }, true);
                        this.setProperties({ value: null }, true);
                    }
                    this.updateValue();
                    this.setValue();
                    this.setDate();
                    break;
                case 'minDays':
                    this.setProperties({ minDays: newProp.minDays }, true);
                    this.refreshChange();
                    break;
                case 'maxDays':
                    this.setProperties({ maxDays: newProp.maxDays }, true);
                    this.refreshChange();
                    break;
                case 'min':
                    this.setProperties({ min: this.checkDateValue(new Date('' + newProp.min)) }, true);
                    this.previousEleValue = this.inputElement.value;
                    this.refreshChange();
                    break;
                case 'max':
                    this.setProperties({ max: this.checkDateValue(new Date('' + newProp.max)) }, true);
                    this.refreshChange();
                    break;
                case 'strictMode':
                    this.setProperties({ strictMode: newProp.strictMode }, true);
                    this.refreshChange();
                    break;
                case 'presets':
                    this.setProperties({ presets: newProp.presets }, true);
                    this.processPresets();
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
            }
        }
    }
};
__decorate$2([
    Property(null)
], DateRangePicker.prototype, "value", void 0);
__decorate$2([
    Property(false)
], DateRangePicker.prototype, "enablePersistence", void 0);
__decorate$2([
    Property(false)
], DateRangePicker.prototype, "enableRtl", void 0);
__decorate$2([
    Property(new Date(1900, 0, 1))
], DateRangePicker.prototype, "min", void 0);
__decorate$2([
    Property(new Date(2099, 11, 31))
], DateRangePicker.prototype, "max", void 0);
__decorate$2([
    Property('en-US')
], DateRangePicker.prototype, "locale", void 0);
__decorate$2([
    Property(0)
], DateRangePicker.prototype, "firstDayOfWeek", void 0);
__decorate$2([
    Property(false)
], DateRangePicker.prototype, "weekNumber", void 0);
__decorate$2([
    Event()
], DateRangePicker.prototype, "created", void 0);
__decorate$2([
    Event()
], DateRangePicker.prototype, "destroyed", void 0);
__decorate$2([
    Event()
], DateRangePicker.prototype, "change", void 0);
__decorate$2([
    Event()
], DateRangePicker.prototype, "navigated", void 0);
__decorate$2([
    Event()
], DateRangePicker.prototype, "renderDayCell", void 0);
__decorate$2([
    Property(null)
], DateRangePicker.prototype, "startDate", void 0);
__decorate$2([
    Property(null)
], DateRangePicker.prototype, "endDate", void 0);
__decorate$2([
    Collection([{}], Presets)
], DateRangePicker.prototype, "presets", void 0);
__decorate$2([
    Property('')
], DateRangePicker.prototype, "width", void 0);
__decorate$2([
    Property(1000)
], DateRangePicker.prototype, "zIndex", void 0);
__decorate$2([
    Property(true)
], DateRangePicker.prototype, "showClearButton", void 0);
__decorate$2([
    Property(true)
], DateRangePicker.prototype, "showTodayButton", void 0);
__decorate$2([
    Property('Month')
], DateRangePicker.prototype, "start", void 0);
__decorate$2([
    Property('Month')
], DateRangePicker.prototype, "depth", void 0);
__decorate$2([
    Property('')
], DateRangePicker.prototype, "cssClass", void 0);
__decorate$2([
    Property('-')
], DateRangePicker.prototype, "separator", void 0);
__decorate$2([
    Property(null)
], DateRangePicker.prototype, "minDays", void 0);
__decorate$2([
    Property(null)
], DateRangePicker.prototype, "maxDays", void 0);
__decorate$2([
    Property(false)
], DateRangePicker.prototype, "strictMode", void 0);
__decorate$2([
    Property(null)
], DateRangePicker.prototype, "format", void 0);
__decorate$2([
    Property(true)
], DateRangePicker.prototype, "enabled", void 0);
__decorate$2([
    Property(false)
], DateRangePicker.prototype, "readonly", void 0);
__decorate$2([
    Property('Never')
], DateRangePicker.prototype, "floatLabelType", void 0);
__decorate$2([
    Property(null)
], DateRangePicker.prototype, "placeholder", void 0);
__decorate$2([
    Event()
], DateRangePicker.prototype, "open", void 0);
__decorate$2([
    Event()
], DateRangePicker.prototype, "close", void 0);
__decorate$2([
    Event()
], DateRangePicker.prototype, "select", void 0);
__decorate$2([
    Event()
], DateRangePicker.prototype, "focus", void 0);
__decorate$2([
    Event()
], DateRangePicker.prototype, "blur", void 0);
DateRangePicker = __decorate$2([
    NotifyPropertyChanges
], DateRangePicker);

/**
 * DateRangePicker modules
 */

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const WRAPPERCLASS = 'e-time-wrapper';
const POPUP$2 = 'e-popup';
const ERROR$2 = 'e-error';
const POPUPDIMENSION = '240px';
const DAY = new Date().getDate();
const MONTH$1 = new Date().getMonth();
const YEAR$1 = new Date().getFullYear();
const ROOT$3 = 'e-timepicker';
const CONTENT$2 = 'e-content';
const SELECTED$2 = 'e-active';
const HOVER$1 = 'e-hover';
const NAVIGATION = 'e-navigation';
const DISABLED$2 = 'e-disabled';
const ICONANIMATION = 'e-icon-anim';
const FOCUS = 'e-input-focus';
const LISTCLASS$1 = cssClass.li;
const HALFPOSITION = 2;
const ANIMATIONDURATION = 50;
var TimePickerBase;
(function (TimePickerBase) {
    function createListItems(min, max, globalize, timeFormat, step) {
        let start;
        let end;
        let interval = step * 60000;
        let listItems = [];
        let timeCollections = [];
        start = +(min.setMilliseconds(0));
        end = +(max.setMilliseconds(0));
        while (end >= start) {
            timeCollections.push(start);
            listItems.push(globalize.formatDate(new Date(start), { format: timeFormat, type: 'time' }));
            start += interval;
        }
        let listTag = ListBase.createList(listItems, null, true);
        return { collection: timeCollections, list: listTag };
    }
    TimePickerBase.createListItems = createListItems;
})(TimePickerBase || (TimePickerBase = {}));
/**
 * TimePicker is an intuitive interface component which provides an options to select a time value
 * from popup list or to set a desired time value.
 * ```
 * <input id='timepicker' type='text'/>
 * <script>
 *   var timePickerObj = new TimePicker({ value: new Date() });
 *   timePickerObj.appendTo('#timepicker');
 * </script>
 * ```
 */
let TimePicker = class TimePicker extends Component {
    /**
     * Constructor for creating the widget
     */
    constructor(options, element) {
        super(options, element);
        this.liCollections = [];
        this.timeCollections = [];
        this.disableItemCollection = [];
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        this.keyConfigure = {
            enter: 'enter',
            escape: 'escape',
            end: 'end',
            tab: 'tab',
            home: 'home',
            down: 'downarrow',
            up: 'uparrow',
            left: 'leftarrow',
            right: 'rightarrow',
            open: 'alt+downarrow',
            close: 'alt+uparrow'
        };
        this.cloneElement = this.element.cloneNode(true);
        this.inputElement = this.element;
        this.angularTag = null;
        if (this.element.tagName === 'EJS-TIMEPICKER') {
            this.angularTag = this.element.tagName;
            this.inputElement = createElement('input');
            this.element.appendChild(this.inputElement);
        }
    }
    // element creation
    render() {
        this.initialize();
        this.createInputElement();
        this.setEnable();
        this.validateInterval();
        this.bindEvents();
        this.validateDisable();
        this.setValue(this.getFormattedValue(this.value));
    }
    validateDisable() {
        this.setMinMax(this.initMin, this.initMax);
        this.popupCreation();
        this.popupObj.hide();
        if ((!isNaN(+this.value) && this.value !== null)) {
            if (!this.valueIsDisable(this.value)) {
                //disable value given in value property so reset the date based on current date
                if (this.strictMode) {
                    this.resetState();
                }
                this.initValue = null;
                this.initMax = this.getDateObject(this.initMax);
                this.initMin = this.getDateObject(this.initMin);
                this.timeCollections = this.liCollections = [];
                this.setMinMax(this.initMin, this.initMax);
            }
        }
    }
    initialize() {
        this.globalize = new Internationalization(this.locale);
        this.defaultCulture = new Internationalization('en');
        // persist the value property.
        this.setProperties({ value: this.checkDateValue(new Date('' + this.value)) }, true);
        this.setProperties({ min: this.checkDateValue(new Date('' + this.min)) }, true);
        this.setProperties({ max: this.checkDateValue(new Date('' + this.max)) }, true);
        this.checkAttributes(); //check the input element attributes
        let localeText = { placeholder: this.placeholder };
        this.l10n = new L10n('timepicker', localeText, this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        this.initValue = this.checkDateValue(this.value);
        this.initMin = this.checkDateValue(this.min);
        this.initMax = this.checkDateValue(this.max);
        this.isNavigate = this.isPreventBlur = this.isTextSelected = false;
        this.activeIndex = this.valueWithMinutes = this.prevDate = null;
        if (!isNullOrUndefined(this.element.getAttribute('id'))) {
            if (this.angularTag !== null) {
                this.inputElement.id = this.element.getAttribute('id') + '_input';
            }
        }
        else {
            //for angular case
            this.element.id = getUniqueID('ej2_timepicker');
            if (this.angularTag !== null) {
                attributes(this.inputElement, { 'id': this.element.id + '_input' });
            }
        }
        if (isNullOrUndefined(this.inputElement.getAttribute('name'))) {
            attributes(this.inputElement, { 'name': this.element.id });
        }
    }
    checkDateValue(value) {
        return (!isNullOrUndefined(value) && value instanceof Date && !isNaN(+value)) ? value : null;
    }
    createInputElement() {
        this.inputWrapper = Input.createInput({
            element: this.inputElement,
            floatLabelType: this.floatLabelType,
            properties: {
                readonly: this.readonly,
                placeholder: this.placeholder,
                cssClass: this.cssClass,
                enabled: this.enabled,
                enableRtl: this.enableRtl,
                showClearButton: this.showClearButton,
            },
            buttons: [' e-input-group-icon e-time-icon e-icons']
        });
        this.inputWrapper.container.style.width = this.setWidth(this.width);
        attributes(this.inputElement, {
            'aria-haspopup': 'true', 'aria-autocomplete': 'list', 'tabindex': '0', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-disabled': 'false', 'aria-invalid': 'false'
        });
        if (!this.isNullOrEmpty(this.inputStyle)) {
            Input.addAttributes({ 'style': this.inputStyle }, this.inputElement);
        }
        addClass([this.inputWrapper.container], WRAPPERCLASS);
    }
    // destroy function
    destroy() {
        this.hide();
        this.unBindEvents();
        let ariaAttribute = {
            'aria-haspopup': 'true', 'aria-autocomplete': 'list', 'tabindex': '0', 'aria-activedescendant': 'null',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false', 'aria-disabled': 'true', 'aria-invalid': 'false'
        };
        if (this.inputElement) {
            Input.removeAttributes(ariaAttribute, this.inputElement);
            if (this.angularTag === null) {
                this.inputWrapper.container.parentElement.appendChild(this.inputElement);
            }
            this.ensureInputAttribute();
            this.enableElement([this.inputElement]);
            this.inputElement.classList.remove('e-input');
            if (isNullOrUndefined(this.cloneElement.getAttribute('disabled'))) {
                Input.setEnabled(true, this.inputElement, this.floatLabelType);
            }
        }
        if (this.inputWrapper.container) {
            remove(this.inputWrapper.container);
        }
        this.inputWrapper = this.popupWrapper = this.cloneElement = undefined;
        this.liCollections = this.timeCollections = this.disableItemCollection = [];
        if (!isNullOrUndefined(this.rippleFn)) {
            this.rippleFn();
        }
        super.destroy();
    }
    ensureInputAttribute() {
        for (let i = 0; i < this.inputElement.attributes.length; i++) {
            let prop = this.inputElement.attributes[i].name;
            if (isNullOrUndefined(this.cloneElement.getAttribute(prop))) {
                if (prop.toLowerCase() === 'value' || isNullOrUndefined(this.cloneElement.getAttribute('value'))) {
                    this.inputElement.value = '';
                }
                this.inputElement.removeAttribute(prop);
            }
        }
    }
    //popup creation
    popupCreation() {
        this.popupWrapper = createElement('div', {
            className: ROOT$3 + ' ' + POPUP$2,
            attrs: { 'id': this.element.id + '_popup', 'style': 'visibility:hidden' }
        });
        if (!isNullOrUndefined(this.cssClass)) {
            this.popupWrapper.classList.add(this.cssClass);
        }
        if (!isNullOrUndefined(this.step) && this.step > 0) {
            this.generateList();
            append([this.listWrapper], this.popupWrapper);
        }
        document.body.appendChild(this.popupWrapper);
        this.addSelection();
        this.renderPopup();
        this.setScrollPosition();
    }
    getPopupHeight() {
        let height = parseInt(POPUPDIMENSION, 10);
        let popupHeight = this.popupWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    }
    generateList() {
        this.createListItems();
        this.wireListEvents();
        let rippleModel = { duration: 300, selector: '.' + LISTCLASS$1 };
        this.rippleFn = rippleEffect(this.listWrapper, rippleModel);
        this.liCollections = this.listWrapper.querySelectorAll('.' + LISTCLASS$1);
    }
    popupCalculation() {
        let left = 0;
        if (Browser.isDevice) {
            let firstItem = this.isEmptyList() ? this.listTag : this.liCollections[0];
            left = -(parseInt(getComputedStyle(firstItem).textIndent, 10) -
                (this.enableRtl ? parseInt(getComputedStyle(this.inputElement).paddingRight, 10) :
                    parseInt(getComputedStyle(this.inputElement).paddingLeft, 10)));
        }
        return left;
    }
    isEmptyList() {
        return !isNullOrUndefined(this.liCollections) && this.liCollections.length === 0 ||
            isNullOrUndefined(this.liCollections);
    }
    renderPopup() {
        this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
        let offset = Browser.isDevice ? this.setPopupPosition() : 2;
        this.popupObj = new Popup(this.popupWrapper, {
            width: this.setPopupWidth(this.width),
            zIndex: this.zIndex,
            targetType: 'relative',
            collision: { X: 'flip', Y: 'flip' },
            relateTo: this.inputWrapper.container,
            position: { X: 'left', Y: 'bottom' },
            enableRtl: this.enableRtl,
            offsetY: offset,
            offsetX: this.popupCalculation(),
            open: () => {
                this.popupWrapper.style.visibility = 'visible';
                addClass([this.inputWrapper.buttons[0]], SELECTED$2);
            }, close: () => {
                removeClass([this.inputWrapper.buttons[0]], SELECTED$2);
                this.unWireListEvents();
                this.inputElement.setAttribute('aria-activedescendant', 'null');
                remove(this.popupObj.element);
                this.popupObj.destroy();
                this.popupWrapper.innerHTML = '';
                this.listWrapper = this.popupWrapper = this.listTag = undefined;
            }
        });
        if (!Browser.isDevice) {
            this.popupObj.collision = { X: 'none', Y: 'flip' };
        }
        this.popupObj.element.style.maxHeight = POPUPDIMENSION;
    }
    //util function
    getFormattedValue(value) {
        if (isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        else {
            return this.globalize.formatDate(value, { skeleton: 'medium', type: 'time' });
        }
    }
    getDateObject(text) {
        if (!this.isNullOrEmpty(text)) {
            let dateValue = this.createDateObj(text);
            let value = !this.isNullOrEmpty(this.initValue);
            if (this.checkDateValue(dateValue)) {
                let date = value ? this.initValue.getDate() : DAY;
                let month = value ? this.initValue.getMonth() : MONTH$1;
                let year = value ? this.initValue.getFullYear() : YEAR$1;
                return new Date(year, month, date, dateValue.getHours(), dateValue.getMinutes(), dateValue.getSeconds());
            }
        }
        return null;
    }
    checkErrorState(val) {
        let value = this.getDateObject(val);
        if (this.validateState(value)) {
            removeClass([this.inputWrapper.container], ERROR$2);
            attributes(this.inputElement, { 'aria-invalid': 'false' });
        }
        else {
            addClass([this.inputWrapper.container], ERROR$2);
            attributes(this.inputElement, { 'aria-invalid': 'true' });
        }
    }
    validateInterval() {
        if (!isNullOrUndefined(this.step) && this.step > 0) {
            this.enableElement([this.inputWrapper.buttons[0]]);
        }
        else {
            this.disableTimeIcon();
        }
    }
    disableTimeIcon() {
        this.disableElement([this.inputWrapper.buttons[0]]);
        this.hide();
    }
    disableElement(element) {
        addClass(element, DISABLED$2);
    }
    enableElement(element) {
        removeClass(element, DISABLED$2);
    }
    selectInputText() {
        this.inputElement.setSelectionRange(0, (this.inputElement).value.length);
    }
    getMeridianText() {
        let meridian;
        if (this.locale === 'en' || this.locale === 'en-US') {
            meridian = getValue('dayPeriods.format.wide', getDefaultDateObject());
        }
        else {
            meridian = getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.dayPeriods.format.abbreviated', cldrData);
        }
        return meridian;
    }
    getCursorSelection() {
        let input = (this.inputElement);
        let start = 0;
        let end = 0;
        if (!isNaN(input.selectionStart)) {
            start = input.selectionStart;
            end = input.selectionEnd;
        }
        return { start: Math.abs(start), end: Math.abs(end) };
    }
    getActiveElement() {
        if (!isNullOrUndefined(this.popupWrapper)) {
            return this.popupWrapper.querySelectorAll('.' + SELECTED$2);
        }
        else {
            return null;
        }
    }
    isNullOrEmpty(value) {
        if (isNullOrUndefined(value) || (typeof value === 'string' && value.trim() === '')) {
            return true;
        }
        else {
            return false;
        }
    }
    setWidth(width) {
        if (typeof width === 'number') {
            width = formatUnit(width);
        }
        else if (typeof width === 'string') {
            width = (width.match(/px|%|em/)) ? width : formatUnit(width);
        }
        else {
            width = '100%';
        }
        return width;
    }
    setPopupWidth(width) {
        width = this.setWidth(width);
        if (width.indexOf('%') > -1) {
            let inputWidth = this.containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        if (Browser.isDevice) {
            let firstItem = this.isEmptyList() ? this.listTag : this.liCollections[0];
            width = (parseInt(width, 10) + (parseInt(getComputedStyle(firstItem).textIndent, 10) -
                parseInt(getComputedStyle(this.inputElement).textIndent, 10) +
                parseInt(getComputedStyle(this.inputElement.parentElement).borderLeftWidth, 10)) * 2) + 'px';
        }
        return width;
    }
    setScrollPosition() {
        let listHeight = this.getPopupHeight();
        let element;
        element = this.selectedElement;
        if (!isNullOrUndefined(element)) {
            this.findScrollTop(element);
        }
        else if (this.popupWrapper && this.checkDateValue(this.scrollTo)) {
            this.setScrollTo();
        }
    }
    findScrollTop(element) {
        let listHeight = this.getPopupHeight();
        let nextEle = element.nextElementSibling;
        let height = nextEle ? nextEle.offsetTop : element.offsetTop;
        let liHeight = element.getBoundingClientRect().height;
        if ((height + element.offsetTop) > listHeight) {
            this.popupWrapper.scrollTop = nextEle ? (height - (listHeight / HALFPOSITION + liHeight / HALFPOSITION)) : height;
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
    }
    setScrollTo() {
        let element;
        if (!isNullOrUndefined(this.popupWrapper)) {
            let items = this.popupWrapper.querySelectorAll('.' + LISTCLASS$1);
            if (items.length) {
                let initialTime = this.timeCollections[0];
                let scrollTime = this.getDateObject(this.checkDateValue(this.scrollTo)).getTime();
                element = items[Math.round((scrollTime - initialTime) / (this.step * 60000))];
            }
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
        if (!isNullOrUndefined(element)) {
            this.findScrollTop(element);
        }
        else {
            this.popupWrapper.scrollTop = 0;
        }
    }
    getText() {
        return (isNullOrUndefined(this.checkDateValue(this.value))) ? '' : this.getValue(this.value);
    }
    getValue(value) {
        return (isNullOrUndefined(this.checkDateValue(value))) ? null : this.globalize.formatDate(value, {
            format: this.cldrTimeFormat(), type: 'time'
        });
    }
    cldrDateFormat() {
        let cldrDate;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrDate = (getValue('dateFormats.short', getDefaultDateObject()));
        }
        else {
            cldrDate = (this.getCultureDateObject(cldrData, '' + this.locale));
        }
        return cldrDate;
    }
    cldrTimeFormat() {
        let cldrTime;
        if (this.isNullOrEmpty(this.format)) {
            if (this.locale === 'en' || this.locale === 'en-US') {
                cldrTime = (getValue('timeFormats.short', getDefaultDateObject()));
            }
            else {
                cldrTime = (this.getCultureTimeObject(cldrData, '' + this.locale));
            }
        }
        else {
            cldrTime = this.format;
        }
        return cldrTime;
    }
    dateToNumeric() {
        let cldrTime;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrTime = (getValue('timeFormats.medium', getDefaultDateObject()));
        }
        else {
            cldrTime = (getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.medium', cldrData));
        }
        return cldrTime;
    }
    getExactDateTime(value) {
        if (isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        else {
            return this.globalize.formatDate(value, { format: this.dateToNumeric(), type: 'time' });
        }
    }
    setValue(value) {
        let time = this.checkValue(value);
        if (!this.strictMode && !this.validateState(time)) {
            this.initValue = this.valueWithMinutes = null;
            this.validateMinMax(this.value, this.min, this.max);
        }
        else {
            if (this.isNullOrEmpty(time)) {
                this.initValue = null;
                this.validateMinMax(this.value, this.min, this.max);
            }
            else {
                this.initValue = this.compareFormatChange(time);
            }
        }
        this.updateInput(true, this.initValue);
    }
    compareFormatChange(value) {
        if (isNullOrUndefined(value)) {
            return null;
        }
        return (value !== this.getText()) ? this.getDateObject(value) : this.getDateObject(this.value);
    }
    updatePlaceHolder() {
        Input.setPlaceholder(this.l10n.getConstant('placeholder'), this.inputElement);
    }
    //event related functions
    popupHandler(e) {
        if (this.isPopupOpen()) {
            this.closePopup(0, e);
        }
        else {
            if (!Browser.isDevice) {
                this.inputElement.focus();
            }
            this.show(e);
            addClass([this.inputWrapper.container], FOCUS);
        }
    }
    mouseDownHandler() {
        if (!this.readonly) {
            let curPos = this.getCursorSelection();
            this.inputElement.setSelectionRange(0, 0);
            EventHandler.add(this.inputElement, 'mouseup', this.mouseUpHandler, this);
        }
    }
    mouseUpHandler(event) {
        if (!this.readonly) {
            event.preventDefault();
            EventHandler.remove(this.inputElement, 'mouseup', this.mouseUpHandler);
            let curPos = this.getCursorSelection();
            if (!(curPos.start === 0 && curPos.end === this.inputElement.value.length)) {
                if (this.inputElement.value.length > 0) {
                    this.cursorDetails = this.focusSelection();
                }
                this.inputElement.setSelectionRange(this.cursorDetails.start, this.cursorDetails.end);
            }
        }
    }
    focusSelection() {
        let regex = new RegExp('^[a-zA-Z0-9]+$');
        let split = this.inputElement.value.split('');
        split.push(' ');
        let curPos = this.getCursorSelection();
        let start = 0;
        let end = 0;
        let isSeparator = false;
        if (!this.isTextSelected) {
            for (let i = 0; i < split.length; i++) {
                if (!regex.test(split[i])) {
                    end = i;
                    isSeparator = true;
                }
                if (isSeparator) {
                    if (curPos.start >= start && curPos.end <= end) {
                        end = end;
                        this.isTextSelected = true;
                        break;
                    }
                    else {
                        start = i + 1;
                        isSeparator = false;
                    }
                }
            }
        }
        else {
            start = curPos.start;
            end = curPos.end;
            this.isTextSelected = false;
        }
        return { start: start, end: end };
    }
    inputHandler(event) {
        if (!this.readonly && this.enabled) {
            if (event.action !== 'right' && event.action !== 'left' && event.action !== 'tab') {
                event.preventDefault();
            }
            switch (event.action) {
                case 'home':
                case 'end':
                case 'up':
                case 'down':
                    this.keyHandler(event);
                    break;
                case 'enter':
                    if (this.isNavigate) {
                        this.selectedElement = this.liCollections[this.activeIndex];
                        this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
                        this.updateValue(this.valueWithMinutes, event);
                    }
                    else {
                        this.updateValue(this.inputElement.value, event);
                    }
                    this.hide();
                    addClass([this.inputWrapper.container], FOCUS);
                    this.isNavigate = false;
                    break;
                case 'open':
                    this.show(event);
                    break;
                case 'escape':
                    Input.setValue(this.objToString(this.value), this.inputElement, this.floatLabelType, this.showClearButton);
                    this.previousState(this.value);
                    this.hide();
                    break;
                case 'close':
                    this.hide();
                    break;
                default:
                    this.isNavigate = false;
                    break;
            }
        }
    }
    onMouseClick(event) {
        let target = event.target;
        let li = this.selectedElement = closest(target, '.' + LISTCLASS$1);
        this.setSelection(li, event);
        if (li && li.classList.contains(LISTCLASS$1)) {
            this.hide();
            if (!Browser.isDevice) {
                addClass([this.inputWrapper.container], FOCUS);
            }
        }
    }
    closePopup(delay, e) {
        if (this.isPopupOpen() && this.popupWrapper) {
            let args = {
                popup: this.popupObj,
                e: event || null,
                cancel: false,
                name: 'open'
            };
            this.trigger('close', args);
            if (!args.cancel) {
                let animModel = {
                    name: 'FadeOut',
                    duration: ANIMATIONDURATION,
                    delay: delay ? delay : 0
                };
                this.popupObj.hide(new Animation(animModel));
                removeClass([this.inputWrapper.container], [ICONANIMATION]);
                attributes(this.inputElement, { 'aria-expanded': 'false' });
                EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
            }
        }
    }
    checkValueChange(event, isNavigation) {
        if (!this.strictMode && !this.validateState(this.valueWithMinutes)) {
            this.initValue = this.valueWithMinutes = null;
            this.setProperties({ value: this.compareFormatChange(this.inputElement.value) }, true);
            this.prevValue = this.inputElement.value;
            if (+this.prevDate !== +this.value) {
                this.changeEvent(event);
            }
        }
        else {
            if (!isNavigation) {
                if ((this.prevValue !== this.inputElement.value) || isNullOrUndefined(this.checkDateValue(this.value))) {
                    this.valueProcess(event, this.compareFormatChange(this.inputElement.value));
                }
            }
            else {
                let value = this.getDateObject(new Date(this.timeCollections[this.activeIndex]));
                if (+this.prevDate !== +value) {
                    this.valueProcess(event, value);
                }
            }
        }
    }
    onMouseOver(event) {
        let currentLi = closest(event.target, '.' + LISTCLASS$1);
        this.setHover(currentLi, HOVER$1);
    }
    setHover(li, className) {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(className)) {
            this.removeHover(className);
            addClass([li], className);
            if (className === NAVIGATION) {
                li.setAttribute('aria-selected', 'true');
            }
        }
    }
    setSelection(li, event) {
        if (this.isValidLI(li) && !li.classList.contains(SELECTED$2)) {
            this.checkValue(li.getAttribute('data-value'));
            this.selectedElement = li;
            this.activeIndex = Array.prototype.slice.call(this.liCollections).indexOf(li);
            this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
            addClass([this.selectedElement], SELECTED$2);
            this.selectedElement.setAttribute('aria-selected', 'true');
            this.checkValueChange(event, true);
        }
    }
    onMouseLeave() {
        this.removeHover(HOVER$1);
    }
    scrollHandler() {
        if (this.getModuleName() === 'timepicker' && Browser.isDevice) {
            return;
        }
        else {
            this.hide();
        }
    }
    setMinMax(minVal, maxVal) {
        if (isNullOrUndefined(this.checkDateValue(minVal))) {
            this.initMin = this.getDateObject('12:00:00 AM');
        }
        if (isNullOrUndefined(this.checkDateValue(maxVal))) {
            this.initMax = this.getDateObject('11:59:59 PM');
        }
    }
    //protected function
    validateMinMax(dateVal, minVal, maxVal) {
        let value = dateVal instanceof Date ? dateVal : this.getDateObject(dateVal);
        if (!isNullOrUndefined(this.checkDateValue(value))) {
            dateVal = this.strictOperation(this.initMin, this.initMax, dateVal, value);
        }
        else if (+(this.createDateObj(this.getFormattedValue(this.initMin))) >
            +(this.createDateObj(this.getFormattedValue(this.initMax)))) {
            this.disableTimeIcon();
        }
        if (this.strictMode) {
            dateVal = this.valueIsDisable(dateVal) ? dateVal : null;
        }
        this.checkErrorState(dateVal);
        return dateVal;
    }
    valueIsDisable(value) {
        if (this.disableItemCollection.length > 0) {
            if (this.disableItemCollection.length === this.timeCollections.length) {
                return false;
            }
            let time = value instanceof Date ? this.objToString(value) : value;
            for (let index = 0; index < this.disableItemCollection.length; index++) {
                if (time === this.disableItemCollection[index]) {
                    return false;
                }
            }
        }
        return true;
    }
    validateState(val) {
        if (!this.strictMode) {
            if (this.valueIsDisable(val)) {
                let value = typeof val === 'string' ? this.setCurrentDate(this.getDateObject(val)) :
                    this.setCurrentDate(this.getDateObject(val));
                let maxValue = this.setCurrentDate(this.getDateObject(this.initMax));
                let minValue = this.setCurrentDate(this.getDateObject(this.initMin));
                if (!isNullOrUndefined(this.checkDateValue(value))) {
                    if ((+(value) > +(maxValue)) || (+(value) < +(minValue))) {
                        return false;
                    }
                }
                else {
                    if ((+(maxValue) < +(minValue)) || this.inputElement.value !== '') {
                        return false;
                    }
                }
            }
            else {
                return false;
            }
        }
        return true;
    }
    strictOperation(minimum, maximum, dateVal, val) {
        let maxValue = this.createDateObj(this.getFormattedValue(maximum));
        let minValue = this.createDateObj(this.getFormattedValue(minimum));
        let value = this.createDateObj(this.getFormattedValue(val));
        if (this.strictMode) {
            if (+minValue > +maxValue) {
                this.disableTimeIcon();
                this.initValue = this.getDateObject(maxValue);
                Input.setValue(this.getValue(this.initValue), this.inputElement, this.floatLabelType, this.showClearButton);
                return this.inputElement.value;
            }
            else if (+minValue >= +value) {
                return this.getDateObject(minValue);
            }
            else if (+value >= +maxValue || +minValue === +maxValue) {
                return this.getDateObject(maxValue);
            }
        }
        else {
            if (+minValue > +maxValue) {
                this.disableTimeIcon();
                if (!isNaN(+this.createDateObj(dateVal))) {
                    return dateVal;
                }
            }
        }
        return dateVal;
    }
    bindEvents() {
        EventHandler.add(this.inputWrapper.buttons[0], 'click', this.popupHandler, this);
        EventHandler.add(this.inputElement, 'blur', this.inputBlurHandler, this);
        EventHandler.add(this.inputElement, 'focus', this.inputFocusHandler, this);
        EventHandler.add(this.inputElement, 'change', this.inputChangeHandler, this);
        if (this.showClearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.clearHandler, this);
        }
        if (!Browser.isDevice) {
            this.inputEvent = new KeyboardEvents(this.inputWrapper.container, {
                keyAction: this.inputHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
            if (this.showClearButton) {
                EventHandler.add(this.inputElement, 'mousedown touchstart', this.mouseDownHandler, this);
            }
        }
    }
    inputChangeHandler(e) {
        e.stopPropagation();
    }
    unBindEvents() {
        EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.popupHandler);
        EventHandler.remove(this.inputElement, 'blur', this.inputBlurHandler);
        EventHandler.remove(this.inputElement, 'focus', this.inputFocusHandler);
        EventHandler.remove(this.inputElement, 'change', this.inputChangeHandler);
        if (this.inputEvent) {
            this.inputEvent.destroy();
        }
        EventHandler.remove(this.inputElement, 'mousedown touchstart', this.mouseDownHandler);
        EventHandler.remove(this.inputWrapper.clearButton, 'mousedown touchstart', this.clearHandler);
    }
    bindClearEvent() {
        if (this.showClearButton && this.inputWrapper.clearButton) {
            EventHandler.add(this.inputWrapper.clearButton, 'mousedown touchstart', this.clearHandler, this);
        }
    }
    clearHandler(e) {
        e.preventDefault();
        this.clear(e);
        if (this.popupWrapper) {
            this.popupWrapper.scrollTop = 0;
        }
    }
    clear(event) {
        this.setProperties({ value: null }, true);
        this.initValue = null;
        this.resetState();
        this.changeEvent(event);
    }
    setZIndex() {
        if (this.popupObj) {
            this.popupObj.zIndex = this.zIndex;
            this.popupObj.dataBind();
        }
    }
    checkAttributes() {
        let attributes$$1 = ['step', 'disabled', 'readonly', 'style', 'name', 'value', 'min', 'max', 'placeholder'];
        let value;
        for (let prop of attributes$$1) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'disabled':
                        let enabled = isNullOrUndefined(this.inputElement.getAttribute(prop));
                        this.setProperties({ enabled: enabled }, true);
                        break;
                    case 'readonly':
                        let readonly = !isNullOrUndefined(this.inputElement.getAttribute(prop));
                        this.setProperties({ readonly: readonly }, true);
                        break;
                    case 'style':
                        this.inputStyle = this.inputElement.getAttribute(prop);
                        break;
                    case 'name':
                        this.inputElement.setAttribute('name', this.inputElement.getAttribute(prop));
                        break;
                    case 'step':
                        this.step = parseInt(this.inputElement.getAttribute(prop), 10);
                        break;
                    case 'placeholder':
                        this.placeholder = this.inputElement.getAttribute(prop);
                        break;
                    case 'min':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!isNullOrUndefined(this.checkDateValue(value))) {
                            this.setProperties({ min: value }, true);
                        }
                        break;
                    case 'max':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!isNullOrUndefined(this.checkDateValue(value))) {
                            this.setProperties({ max: value }, true);
                        }
                        break;
                    case 'value':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!isNullOrUndefined(this.checkDateValue(value))) {
                            this.initValue = value;
                            this.updateInput(false, this.initValue);
                        }
                        break;
                }
            }
        }
    }
    setCurrentDate(value) {
        if (isNullOrUndefined(this.checkDateValue(value))) {
            return null;
        }
        return new Date(YEAR$1, MONTH$1, DAY, value.getHours(), value.getMinutes(), value.getSeconds());
    }
    getTextFormat() {
        let time = 0;
        if (this.cldrTimeFormat().split(' ')[0] === 'a' || this.cldrTimeFormat().indexOf('a') === 0) {
            time = 1;
        }
        else if (this.cldrTimeFormat().indexOf('a') < 0) {
            let strArray = this.cldrTimeFormat().split(' ');
            for (let i = 0; i < strArray.length; i++) {
                if (strArray[i].toLowerCase().indexOf('h') >= 0) {
                    time = i;
                    break;
                }
            }
        }
        return time;
    }
    updateValue(value, event) {
        let val;
        if (this.isNullOrEmpty(value)) {
            this.resetState();
        }
        else {
            val = this.checkValue(value);
            if (this.strictMode) {
                // this case set previous value to the text box when set invalid date
                let inputVal = (val === null && value.trim().length > 0) ?
                    this.previousState(this.prevDate) : this.inputElement.value;
                Input.setValue(inputVal, this.inputElement, this.floatLabelType, this.showClearButton);
            }
        }
        this.checkValueChange(event, typeof value === 'string' ? false : true);
    }
    previousState(date) {
        let value = this.getDateObject(date);
        for (let i = 0; i < this.timeCollections.length; i++) {
            if (+value === this.timeCollections[i]) {
                this.activeIndex = i;
                this.selectedElement = this.liCollections[i];
                this.valueWithMinutes = new Date(this.timeCollections[i]);
                break;
            }
        }
        return this.prevValue;
    }
    resetState() {
        this.removeSelection();
        Input.setValue('', this.inputElement, this.floatLabelType, false);
        this.valueWithMinutes = this.activeIndex = null;
        if (!this.strictMode) {
            this.checkErrorState(null);
        }
    }
    objToString(val) {
        if (isNullOrUndefined(this.checkDateValue(val))) {
            return null;
        }
        else {
            return this.globalize.formatDate(val, { format: this.cldrTimeFormat(), type: 'time' });
        }
    }
    checkValue(value) {
        if (!this.isNullOrEmpty(value)) {
            let date = value instanceof Date ? value : this.getDateObject(value);
            return this.validateValue(date, value);
        }
        this.resetState();
        return this.valueWithMinutes = null;
    }
    validateValue(date, value) {
        let time;
        let val = this.validateMinMax(value, this.min, this.max);
        let newval = this.createDateObj(val);
        if (this.getFormattedValue(newval) !== this.getFormattedValue(this.value)) {
            this.valueWithMinutes = isNullOrUndefined(newval) ? null : newval;
            time = this.objToString(this.valueWithMinutes);
        }
        else {
            if (this.strictMode) {
                //for strict mode case, when value not present within a range. Reset the nearest range value.
                date = newval;
            }
            this.valueWithMinutes = this.checkDateValue(date);
            time = this.objToString(this.valueWithMinutes);
        }
        if (!this.strictMode && isNullOrUndefined(time)) {
            let value = val.trim().length > 0 ? val : '';
            Input.setValue(value, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        else {
            Input.setValue(time, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        return time;
    }
    findNextElement(event) {
        let textVal = (this.inputElement).value;
        let value = isNullOrUndefined(this.valueWithMinutes) ? this.createDateObj(textVal) :
            this.getDateObject(this.valueWithMinutes);
        let timeVal = null;
        let count = this.liCollections.length;
        if (!isNullOrUndefined(this.checkDateValue(value)) || !isNullOrUndefined(this.activeIndex)) {
            if (event.action === 'home') {
                let index = this.validLiElement(0);
                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                this.activeIndex = index;
            }
            else if (event.action === 'end') {
                let index = this.validLiElement(this.timeCollections.length - 1, true);
                timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                this.activeIndex = index;
            }
            else {
                if (event.action === 'down') {
                    for (let i = 0; i < count; i++) {
                        if (+value < this.timeCollections[i]) {
                            let index = this.validLiElement(i);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                        else if (i === count - 1) {
                            let index = this.validLiElement(0);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                    }
                }
                else {
                    for (let i = count - 1; i >= 0; i--) {
                        if (+value > this.timeCollections[i]) {
                            let index = this.validLiElement(i, true);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                        else if (i === 0) {
                            let index = this.validLiElement(count - 1);
                            timeVal = +(this.createDateObj(new Date(this.timeCollections[index])));
                            this.activeIndex = index;
                            break;
                        }
                    }
                }
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.elementValue(isNullOrUndefined(timeVal) ? null : new Date(timeVal));
        }
        else {
            let index = this.validLiElement(0, event.action === 'down' ? false : true);
            this.activeIndex = index;
            this.selectedElement = this.liCollections[index];
            this.elementValue(new Date(this.timeCollections[index]));
        }
    }
    elementValue(value) {
        if (!isNullOrUndefined(this.checkDateValue(value))) {
            this.checkValue(value);
        }
    }
    validLiElement(index, backward) {
        let elementIndex = null;
        let items = isNullOrUndefined(this.popupWrapper) ? this.liCollections :
            this.popupWrapper.querySelectorAll('.' + LISTCLASS$1);
        let isCheck = true;
        if (items.length) {
            if (backward) {
                for (let i = index; i >= 0; i--) {
                    if (!items[i].classList.contains(DISABLED$2)) {
                        elementIndex = i;
                        break;
                    }
                    else if (i === 0) {
                        if (isCheck) {
                            index = i = items.length;
                            isCheck = false;
                        }
                    }
                }
            }
            else {
                for (let i = index; i <= items.length - 1; i++) {
                    if (!items[i].classList.contains(DISABLED$2)) {
                        elementIndex = i;
                        break;
                    }
                    else if (i === items.length - 1) {
                        if (isCheck) {
                            index = i = -1;
                            isCheck = false;
                        }
                    }
                }
            }
        }
        return elementIndex;
    }
    keyHandler(event) {
        if (isNullOrUndefined(this.step) || this.step <= 0 || this.inputWrapper.buttons[0].classList.contains(DISABLED$2)) {
            return;
        }
        let count = this.timeCollections.length;
        if (isNullOrUndefined(this.getActiveElement()) || this.getActiveElement().length === 0) {
            if (this.liCollections.length > 0) {
                if (isNullOrUndefined(this.value) && isNullOrUndefined(this.activeIndex)) {
                    let index = this.validLiElement(0, event.action === 'down' ? false : true);
                    this.activeIndex = index;
                    this.selectedElement = this.liCollections[index];
                    this.elementValue(new Date(this.timeCollections[index]));
                }
                else {
                    this.findNextElement(event);
                }
            }
            else {
                this.findNextElement(event);
            }
        }
        else {
            let nextItem;
            if ((event.keyCode >= 37) && (event.keyCode <= 40)) {
                let index = (event.keyCode === 40 || event.keyCode === 39) ? ++this.activeIndex : --this.activeIndex;
                this.activeIndex = index = this.activeIndex === (count) ? 0 : this.activeIndex;
                this.activeIndex = index = this.activeIndex < 0 ? (count - 1) : this.activeIndex;
                this.activeIndex = index = this.validLiElement(this.activeIndex, (event.keyCode === 40 || event.keyCode === 39) ?
                    false : true);
                nextItem = isNullOrUndefined(this.timeCollections[index]) ? this.timeCollections[0] : this.timeCollections[index];
            }
            else if (event.action === 'home') {
                let index = this.validLiElement(0);
                this.activeIndex = index;
                nextItem = this.timeCollections[index];
            }
            else if (event.action === 'end') {
                let index = this.validLiElement(count - 1, true);
                this.activeIndex = index;
                nextItem = this.timeCollections[index];
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.elementValue(new Date(nextItem));
        }
        this.isNavigate = true;
        this.setHover(this.selectedElement, NAVIGATION);
        this.setActiveDescendant();
        this.selectInputText();
        if (this.isPopupOpen() && this.selectedElement !== null && (!event || event.type !== 'click')) {
            this.setScrollPosition();
        }
    }
    setPopupPosition() {
        let offsetValue;
        let popupHeight = this.getPopupHeight();
        let element = this.getActiveElement();
        let liHeight = this.liCollections[0].getBoundingClientRect().height;
        let listHeight = popupHeight / HALFPOSITION;
        let height = element.length === 0 ? this.liCollections[0].offsetTop : element[0].offsetTop;
        let lastItemOffsetValue = this.liCollections[this.liCollections.length - 1].offsetTop;
        let ulPadding = (parseInt(getComputedStyle(this.listTag).paddingTop, 10));
        if (lastItemOffsetValue - listHeight < height) {
            let count = popupHeight / liHeight;
            offsetValue = (count - (this.liCollections.length - this.activeIndex)) * liHeight - ulPadding - HALFPOSITION;
        }
        else if ((height + liHeight) > listHeight) {
            offsetValue = listHeight - liHeight / HALFPOSITION;
        }
        else {
            offsetValue = height;
        }
        offsetValue = offsetValue + HALFPOSITION + ((liHeight - this.containerStyle.height) / HALFPOSITION);
        return -offsetValue;
    }
    getCultureTimeObject(ld, c) {
        return getValue('main.' + c + '.dates.calendars.gregorian.timeFormats.short', ld);
    }
    getCultureDateObject(ld, c) {
        return getValue('main.' + c + '.dates.calendars.gregorian.dateFormats.short', ld);
    }
    wireListEvents() {
        EventHandler.add(this.listWrapper, 'click', this.onMouseClick, this);
        if (!Browser.isDevice) {
            EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
        }
    }
    unWireListEvents() {
        if (this.listWrapper) {
            EventHandler.remove(this.listWrapper, 'click', this.onMouseClick);
            if (!Browser.isDevice) {
                EventHandler.remove(this.listWrapper, 'mouseover', this.onMouseOver);
                EventHandler.remove(this.listWrapper, 'mouseout', this.onMouseLeave);
            }
        }
    }
    valueProcess(event, value) {
        let result = (isNullOrUndefined(this.checkDateValue(value))) ? null : value;
        if (+this.prevDate !== +result) {
            this.initValue = result;
            this.changeEvent(event);
        }
    }
    changeEvent(e) {
        this.addSelection();
        this.updateInput(true, this.initValue);
        let eventArgs = {
            e: (e || null),
            value: this.value,
            text: (this.inputElement).value,
            isInteracted: !isNullOrUndefined(e),
            element: this.element
        };
        eventArgs.value = this.valueWithMinutes || this.getDateObject(this.inputElement.value);
        this.prevDate = this.valueWithMinutes || this.getDateObject(this.inputElement.value);
        this.trigger('change', eventArgs);
    }
    updateInput(isUpdate, date) {
        if (isUpdate) {
            this.prevValue = this.getValue(date);
        }
        this.prevDate = this.valueWithMinutes = date;
        this.setProperties({ value: date }, true);
    }
    setActiveDescendant() {
        if (!isNullOrUndefined(this.selectedElement)) {
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedElement.getAttribute('id') });
        }
        else {
            attributes(this.inputElement, { 'aria-activedescendant': 'null' });
        }
    }
    removeSelection() {
        this.removeHover(HOVER$1);
        if (!isNullOrUndefined(this.popupWrapper)) {
            let items = this.popupWrapper.querySelectorAll('.' + SELECTED$2);
            if (items.length) {
                removeClass(items, SELECTED$2);
                items[0].removeAttribute('aria-selected');
            }
        }
    }
    removeHover(className) {
        let hoveredItem = this.getHoverItem(className);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, className);
            if (className === NAVIGATION) {
                hoveredItem[0].removeAttribute('aria-selected');
            }
        }
    }
    getHoverItem(className) {
        let hoveredItem;
        if (!isNullOrUndefined(this.popupWrapper)) {
            hoveredItem = this.popupWrapper.querySelectorAll('.' + className);
        }
        return hoveredItem;
    }
    setActiveClass() {
        if (!isNullOrUndefined(this.popupWrapper)) {
            let items = this.popupWrapper.querySelectorAll('.' + LISTCLASS$1);
            if (items.length) {
                for (let i = 0; i < items.length; i++) {
                    if (this.timeCollections[i] === +this.getDateObject(this.valueWithMinutes)) {
                        items[i].setAttribute('aria-selected', 'true');
                        this.selectedElement = items[i];
                        this.activeIndex = i;
                        break;
                    }
                }
            }
        }
    }
    addSelection() {
        this.selectedElement = null;
        this.removeSelection();
        this.setActiveClass();
        if (!isNullOrUndefined(this.selectedElement)) {
            addClass([this.selectedElement], SELECTED$2);
            this.selectedElement.setAttribute('aria-selected', 'true');
        }
    }
    isValidLI(li) {
        return (li && li.classList.contains(LISTCLASS$1) && !li.classList.contains(DISABLED$2));
    }
    createDateObj(val) {
        let today = this.globalize.formatDate(new Date(), { skeleton: 'short', type: 'date' });
        let value = null;
        if (typeof val === 'string') {
            if (val.toUpperCase().indexOf('AM') > -1 || val.toUpperCase().indexOf('PM') > -1) {
                today = this.defaultCulture.formatDate(new Date(), { skeleton: 'short', type: 'date' });
                value = isNaN(+new Date(today + ' ' + val)) ? null : new Date(new Date(today + ' ' + val).setMilliseconds(0));
                if (isNullOrUndefined(value)) {
                    value = this.TimeParse(today, val);
                }
            }
            else {
                value = this.TimeParse(today, val);
            }
        }
        else if (val instanceof Date) {
            value = val;
        }
        return value;
    }
    TimeParse(today, val) {
        let value;
        value = this.globalize.parseDate(today + ' ' + val, {
            format: this.cldrDateFormat() + ' ' + this.cldrTimeFormat(), type: 'datetime'
        });
        value = isNullOrUndefined(value) ? this.globalize.parseDate(today + ' ' + val, {
            format: this.cldrDateFormat() + ' ' + this.dateToNumeric(), type: 'datetime'
        }) : value;
        value = isNullOrUndefined(value) ? value : new Date(value.setMilliseconds(0));
        return value;
    }
    createListItems() {
        this.listWrapper = createElement('div', { className: CONTENT$2, attrs: { 'tabindex': '0' } });
        let start;
        let end;
        let interval = this.step * 60000;
        let listItems = [];
        this.timeCollections = [];
        this.disableItemCollection = [];
        start = +(this.getDateObject(this.initMin).setMilliseconds(0));
        end = +(this.getDateObject(this.initMax).setMilliseconds(0));
        while (end >= start) {
            this.timeCollections.push(start);
            listItems.push(this.globalize.formatDate(new Date(start), { format: this.cldrTimeFormat(), type: 'time' }));
            start += interval;
        }
        let listBaseOptions = {
            itemCreated: (args) => {
                let eventArgs = {
                    element: args.item,
                    text: args.text, value: this.getDateObject(args.text), isDisabled: false
                };
                this.trigger('itemRender', eventArgs);
                if (eventArgs.isDisabled) {
                    eventArgs.element.classList.add(DISABLED$2);
                }
                if (eventArgs.element.classList.contains(DISABLED$2)) {
                    this.disableItemCollection.push(eventArgs.element.getAttribute('data-value'));
                }
            }
        };
        this.listTag = ListBase.createList(listItems, listBaseOptions, true);
        attributes(this.listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
        append([this.listTag], this.listWrapper);
    }
    documentClickHandler(event) {
        if (!Browser.isDevice) {
            event.preventDefault();
        }
        let target = event.target;
        if (!(closest(target, '#' + this.popupObj.element.id)) && target !== this.inputElement
            && target !== (this.inputWrapper && this.inputWrapper.buttons[0]) &&
            target !== (this.inputWrapper && this.inputWrapper.clearButton) &&
            target !== (this.inputWrapper && this.inputWrapper.container)) {
            if (this.isPopupOpen()) {
                this.hide();
            }
        }
        else if (target !== this.inputElement) {
            if (!Browser.isDevice) {
                this.isPreventBlur = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.inputElement);
                event.preventDefault();
            }
        }
    }
    setEnableRtl() {
        Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
        if (this.popupObj) {
            this.popupObj.enableRtl = this.enableRtl;
            this.popupObj.dataBind();
        }
    }
    setEnable() {
        Input.setEnabled(this.enabled, this.inputElement, this.floatLabelType);
        if (this.enabled) {
            removeClass([this.inputWrapper.container], DISABLED$2);
            attributes(this.inputElement, { 'aria-disabled': 'false' });
        }
        else {
            this.hide();
            addClass([this.inputWrapper.container], DISABLED$2);
            attributes(this.inputElement, { 'aria-disabled': 'true' });
        }
    }
    getProperty(date, val) {
        if (val === 'min') {
            this.initMin = this.checkDateValue(new Date('' + date.min));
            this.setProperties({ min: this.initMin }, true);
        }
        else {
            this.initMax = this.checkDateValue(new Date('' + date.max));
            this.setProperties({ max: this.initMax }, true);
        }
        if (this.inputElement.value === '') {
            this.validateMinMax(this.value, this.min, this.max);
        }
        else {
            this.checkValue(this.inputElement.value);
        }
        this.checkValueChange(null, false);
    }
    inputBlurHandler(e) {
        // IE popup closing issue when click over the scrollbar
        if (this.isPreventBlur && this.isPopupOpen()) {
            this.inputElement.focus();
            return;
        }
        this.closePopup(0, e);
        removeClass([this.inputWrapper.container], [FOCUS]);
        let blurArguments = {
            model: this
        };
        this.trigger('blur', blurArguments);
        if (this.getText() !== this.inputElement.value) {
            this.updateValue((this.inputElement).value, e);
        }
        else if (this.inputElement.value.trim().length === 0) {
            this.resetState();
        }
        this.cursorDetails = null;
        this.isNavigate = false;
    }
    /**
     * Focuses out the TimePicker textbox element.
     * @returns void
     */
    focusOut() {
        if (document.activeElement === this.inputElement) {
            this.inputElement.blur();
            let blurArguments = {
                model: this
            };
            this.trigger('blur', blurArguments);
        }
    }
    isPopupOpen() {
        if (this.popupWrapper && this.popupWrapper.classList.contains('' + ROOT$3)) {
            return true;
        }
        return false;
    }
    inputFocusHandler() {
        let focusArguments = {
            model: this
        };
        if (!this.readonly && !Browser.isDevice) {
            this.selectInputText();
        }
        this.trigger('focus', focusArguments);
    }
    /**
     * Focused the TimePicker textbox element.
     * @returns void
     */
    focusIn() {
        if (document.activeElement !== this.inputElement && this.enabled) {
            this.inputElement.focus();
            let focusArguments = {
                model: this
            };
            this.trigger('focus', focusArguments);
        }
    }
    /**
     * Hides the TimePicker popup.
     * @returns void
     */
    hide() {
        this.closePopup(100, null);
    }
    /**
     * Opens the popup to show the list items.
     * @returns void
     */
    show(event) {
        if ((this.enabled && this.readonly) || !this.enabled || this.popupWrapper) {
            return;
        }
        else {
            let args = {
                popup: this.popupObj || null,
                cancel: false,
                e: event || null,
                name: 'open'
            };
            this.trigger('open', args);
            if (!args.cancel && !this.isPopupOpen() && !this.inputWrapper.buttons[0].classList.contains(DISABLED$2)) {
                this.popupCreation();
                if (!args.cancel) {
                    let openAnimation = {
                        name: 'FadeIn',
                        duration: ANIMATIONDURATION,
                    };
                    this.popupObj.refreshPosition(this.inputElement);
                    this.popupObj.show(new Animation(openAnimation));
                    this.setActiveDescendant();
                    attributes(this.inputElement, { 'aria-expanded': 'true' });
                }
                EventHandler.add(document, 'mousedown touchstart', this.documentClickHandler, this);
            }
        }
    }
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    getPersistData() {
        let keyEntity = ['value'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * To get component name
     * @private
     */
    getModuleName() {
        return 'timepicker';
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.inputElement.setAttribute('aria-placeholder', newProp.placeholder);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement, this.floatLabelType);
                    if (this.readonly) {
                        this.hide();
                    }
                    break;
                case 'cssClass':
                    addClass([this.inputWrapper.container], [newProp.cssClass]);
                    if (this.popupWrapper) {
                        addClass([this.popupWrapper], [newProp.cssClass]);
                    }
                    this.setProperties({ cssClass: newProp.cssClass }, true);
                    break;
                case 'enabled':
                    this.setProperties({ enabled: newProp.enabled }, true);
                    this.setEnable();
                    break;
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    this.setEnableRtl();
                    break;
                case 'zIndex':
                    this.setProperties({ zIndex: newProp.zIndex }, true);
                    this.setZIndex();
                    break;
                case 'min':
                case 'max':
                    this.getProperty(newProp, prop);
                    break;
                case 'showClearButton':
                    Input.setClearButton(this.showClearButton, this.inputElement, this.inputWrapper);
                    this.bindClearEvent();
                    break;
                case 'locale':
                    this.setProperties({ locale: newProp.locale }, true);
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.updatePlaceHolder();
                    this.setValue(this.value);
                    break;
                case 'width':
                    setStyleAttribute(this.inputWrapper.container, { 'width': this.setWidth(newProp.width) });
                    this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.setValue(this.value);
                    break;
                case 'value':
                    if (typeof newProp.value === 'string') {
                        this.setProperties({ value: this.checkDateValue(new Date(newProp.value)) }, true);
                        newProp.value = this.value;
                    }
                    else {
                        newProp.value = this.checkDateValue(new Date('' + newProp.value));
                    }
                    this.initValue = newProp.value;
                    newProp.value = this.compareFormatChange(this.checkValue(newProp.value));
                    this.checkValueChange(null, false);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                case 'strictMode':
                    if (newProp.strictMode) {
                        this.checkErrorState(null);
                    }
                    this.setProperties({ strictMode: newProp.strictMode }, true);
                    this.checkValue((this.inputElement).value);
                    this.checkValueChange(null, false);
                    break;
                case 'scrollTo':
                    if (this.checkDateValue(new Date('' + newProp.scrollTo))) {
                        if (this.popupWrapper) {
                            this.setScrollTo();
                        }
                        this.setProperties({ scrollTo: newProp.scrollTo }, true);
                    }
                    else {
                        this.setProperties({ scrollTo: null }, true);
                    }
                    break;
            }
        }
    }
};
__decorate$3([
    Property(null)
], TimePicker.prototype, "width", void 0);
__decorate$3([
    Property(null)
], TimePicker.prototype, "cssClass", void 0);
__decorate$3([
    Property(false)
], TimePicker.prototype, "strictMode", void 0);
__decorate$3([
    Property(null)
], TimePicker.prototype, "format", void 0);
__decorate$3([
    Property(true)
], TimePicker.prototype, "enabled", void 0);
__decorate$3([
    Property(false)
], TimePicker.prototype, "readonly", void 0);
__decorate$3([
    Property('Never')
], TimePicker.prototype, "floatLabelType", void 0);
__decorate$3([
    Property(null)
], TimePicker.prototype, "placeholder", void 0);
__decorate$3([
    Property(1000)
], TimePicker.prototype, "zIndex", void 0);
__decorate$3([
    Property(false)
], TimePicker.prototype, "enablePersistence", void 0);
__decorate$3([
    Property(true)
], TimePicker.prototype, "showClearButton", void 0);
__decorate$3([
    Property(30)
], TimePicker.prototype, "step", void 0);
__decorate$3([
    Property(null)
], TimePicker.prototype, "scrollTo", void 0);
__decorate$3([
    Property(null)
], TimePicker.prototype, "value", void 0);
__decorate$3([
    Property(null)
], TimePicker.prototype, "min", void 0);
__decorate$3([
    Property(null)
], TimePicker.prototype, "max", void 0);
__decorate$3([
    Property(false)
], TimePicker.prototype, "enableRtl", void 0);
__decorate$3([
    Event()
], TimePicker.prototype, "change", void 0);
__decorate$3([
    Event()
], TimePicker.prototype, "created", void 0);
__decorate$3([
    Event()
], TimePicker.prototype, "destroyed", void 0);
__decorate$3([
    Event()
], TimePicker.prototype, "open", void 0);
__decorate$3([
    Event()
], TimePicker.prototype, "itemRender", void 0);
__decorate$3([
    Event()
], TimePicker.prototype, "close", void 0);
__decorate$3([
    Event()
], TimePicker.prototype, "blur", void 0);
__decorate$3([
    Event()
], TimePicker.prototype, "focus", void 0);
TimePicker = __decorate$3([
    NotifyPropertyChanges
], TimePicker);

/**
 * TimePicker modules
 */

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
///<reference path='../datepicker/datepicker-model.d.ts'/>
//class constant defination
const DATEWRAPPER$1 = 'e-date-wrapper';
const DATEPICKERROOT = 'e-datepicker';
const DATETIMEWRAPPER = 'e-datetime-wrapper';
const DAY$1 = new Date().getDate();
const MONTH$2 = new Date().getMonth();
const YEAR$2 = new Date().getFullYear();
const HOUR = new Date().getHours();
const MINUTE = new Date().getMinutes();
const SECOND = new Date().getSeconds();
const MILLISECOND = new Date().getMilliseconds();
const ROOT$4 = 'e-datetimepicker';
const DATETIMEPOPUPWRAPPER = 'e-datetimepopup-wrapper';
const INPUTWRAPPER$1 = 'e-input-group-icon';
const POPUP$3 = 'e-popup';
const TIMEICON = 'e-time-icon';
const INPUTFOCUS$2 = 'e-input-focus';
const POPUPDIMENSION$1 = '250px';
const ICONANIMATION$1 = 'e-icon-anim';
const DISABLED$3 = 'e-disabled';
const ERROR$3 = 'e-error';
const CONTENT$3 = 'e-content';
const NAVIGATION$1 = 'e-navigation';
const ACTIVE$2 = 'e-active';
const HOVER$2 = 'e-hover';
const ICONS$1 = 'e-icons';
const HALFPOSITION$1 = 2;
const LISTCLASS$2 = cssClass.li;
const ANIMATIONDURATION$1 = 100;
const OVERFLOW$2 = 'e-time-overflow';
/**
 * Represents the DateTimePicker component that allows user to select
 * or enter a date time value.
 * ```html
 * <input id="dateTimePicker"/>
 * ```
 * ```typescript
 * <script>
 *   var dateTimePickerObject = new DateTimePicker({ value: new Date() });
 *   dateTimePickerObject.appendTo("#dateTimePicker");
 * </script>
 * ```
 */
let DateTimePicker = class DateTimePicker extends DatePicker {
    /**
     * Constructor for creating the widget
     */
    constructor(options, element) {
        super(options, element);
        this.valueWithMinutes = null;
        this.previousDateTime = null;
    }
    focusHandler() {
        addClass([this.inputWrapper.container], INPUTFOCUS$2);
    }
    /**
     * Sets the focus to widget for interaction.
     * @returns void
     */
    focusIn() {
        super.focusIn();
    }
    /**
     * Remove the focus from widget, if the widget is in focus state.
     * @returns void
     */
    focusOut() {
        if (document.activeElement === this.inputElement) {
            this.inputElement.blur();
            removeClass([this.inputWrapper.container], [INPUTFOCUS$2]);
        }
    }
    blurHandler() {
        // IE popup closing issue when click over the scrollbar
        if (this.isTimePopupOpen() && this.isPreventBlur) {
            this.inputElement.focus();
            return;
        }
        removeClass([this.inputWrapper.container], INPUTFOCUS$2);
        let blurArguments = {
            model: this
        };
        this.trigger('blur', blurArguments);
    }
    /**
     * To destroy the widget.
     * @returns void
     */
    destroy() {
        if (this.popupObject && this.popupObject.element.classList.contains(POPUP$3)) {
            this.dateTimeWrapper = undefined;
            this.liCollections = this.timeCollections = [];
            if (!isNullOrUndefined(this.rippleFn)) {
                this.rippleFn();
            }
        }
        let ariaAttribute = {
            'aria-live': 'assertive', 'aria-atomic': 'true', 'aria-invalid': 'false',
            'aria-haspopup': 'true', 'aria-activedescendant': 'null',
            'autocorrect': 'off', 'autocapitalize': 'off', 'spellcheck': 'false',
            'aria-owns': this.element.id + '_options', 'aria-expanded': 'false', 'role': 'combobox', 'autocomplete': 'off'
        };
        if (this.inputElement) {
            Input.removeAttributes(ariaAttribute, this.inputElement);
            this.inputElement.removeAttribute('aria-placeholder');
        }
        if (this.isCalendar()) {
            if (this.popupWrapper) {
                detach(this.popupWrapper);
            }
            this.popupObject = this.popupWrapper = null;
            this.keyboardHandler.destroy();
        }
        this.unBindInputEvents();
        super.destroy();
    }
    /**
     * To Initialize the control rendering.
     * @return void
     * @private
     */
    render() {
        this.timekeyConfigure = {
            enter: 'enter',
            escape: 'escape',
            end: 'end',
            tab: 'tab',
            home: 'home',
            down: 'downarrow',
            up: 'uparrow',
            left: 'leftarrow',
            right: 'rightarrow',
            open: 'alt+downarrow',
            close: 'alt+uparrow'
        };
        this.valueWithMinutes = null;
        this.previousDateTime = null;
        this.isPreventBlur = false;
        this.cloneElement = this.element.cloneNode(true);
        this.dateTimeFormat = this.cldrDateTimeFormat();
        this.initValue = this.value;
        this.checkAttributes();
        let localeText = { placeholder: this.placeholder };
        this.l10n = new L10n('datetimepicker', localeText, this.locale);
        this.setProperties({ placeholder: this.placeholder || this.l10n.getConstant('placeholder') }, true);
        super.render();
        this.createInputElement();
        this.bindInputEvents();
        this.setValue();
    }
    setValue() {
        this.initValue = this.validateMinMaxRange(this.value);
        if (!this.strictMode && this.isDateObject(this.initValue)) {
            let value = this.validateMinMaxRange(this.initValue);
            Input.setValue(this.getFormattedValue(value), this.inputElement, this.floatLabelType, this.showClearButton);
            this.setProperties({ value: value }, true);
        }
        else {
            if (isNullOrUndefined(this.value)) {
                this.initValue = null;
                this.setProperties({ value: null }, true);
            }
        }
        this.valueWithMinutes = this.value;
        super.updateInput();
    }
    validateMinMaxRange(value) {
        let result = value;
        if (this.isDateObject(value)) {
            result = this.validateValue(value);
        }
        else {
            if (+this.min > +this.max) {
                this.disablePopupButton(true);
            }
        }
        this.checkValidState(result);
        return result;
    }
    checkValidState(value) {
        this.isValidState = true;
        if (!this.strictMode) {
            if ((+(value) > +(this.max)) || (+(value) < +(this.min))) {
                this.isValidState = false;
            }
        }
        this.checkErrorState();
    }
    checkErrorState() {
        if (this.isValidState) {
            removeClass([this.inputWrapper.container], ERROR$3);
        }
        else {
            addClass([this.inputWrapper.container], ERROR$3);
        }
        attributes(this.inputElement, { 'aria-invalid': this.isValidState ? 'false' : 'true' });
    }
    validateValue(value) {
        let dateVal = value;
        if (this.strictMode) {
            if (+this.min > +this.max) {
                this.disablePopupButton(true);
                dateVal = this.max;
            }
            else if (+value < +this.min) {
                dateVal = this.min;
            }
            else if (+value > +this.max) {
                dateVal = this.max;
            }
        }
        else {
            if (+this.min > +this.max) {
                this.disablePopupButton(true);
                dateVal = value;
            }
        }
        return dateVal;
    }
    disablePopupButton(isDisable) {
        if (isDisable) {
            addClass([this.inputWrapper.buttons[0], this.timeIcon], DISABLED$3);
            this.hide();
        }
        else {
            removeClass([this.inputWrapper.buttons[0], this.timeIcon], DISABLED$3);
        }
    }
    getFormattedValue(value) {
        if (!isNullOrUndefined(value)) {
            let dateOptions = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd' };
            return this.globalize.formatDate(value, dateOptions);
        }
        else {
            return null;
        }
    }
    isDateObject(value) {
        return (!isNullOrUndefined(value) && !isNaN(+value)) ? true : false;
    }
    createInputElement() {
        removeClass([this.inputElement], DATEPICKERROOT);
        removeClass([this.inputWrapper.container], DATEWRAPPER$1);
        addClass([this.inputWrapper.container], DATETIMEWRAPPER);
        addClass([this.inputElement], ROOT$4);
        this.renderTimeIcon();
    }
    renderTimeIcon() {
        this.timeIcon = Input.appendSpan(INPUTWRAPPER$1 + ' ' + TIMEICON + ' ' + ICONS$1, this.inputWrapper.container);
    }
    bindInputEvents() {
        EventHandler.add(this.timeIcon, 'mousedown touchstart', this.timeHandler, this);
        EventHandler.add(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateHandler, this);
        EventHandler.add(this.inputElement, 'blur', this.blurHandler, this);
        EventHandler.add(this.inputElement, 'focus', this.focusHandler, this);
        this.keyboardHandler = new KeyboardEvents(this.inputElement, {
            eventName: 'keydown',
            keyAction: this.inputKeyAction.bind(this),
            keyConfigs: this.keyConfigs
        });
    }
    unBindInputEvents() {
        EventHandler.remove(this.timeIcon, 'mousedown touchstart', this.timeHandler);
        EventHandler.remove(this.inputWrapper.buttons[0], 'mousedown touchstart', this.dateHandler);
        if (this.inputElement) {
            EventHandler.remove(this.inputElement, 'blur', this.blurHandler);
            EventHandler.remove(this.inputElement, 'focus', this.focusHandler);
        }
        if (this.keyboardHandler) {
            this.keyboardHandler.destroy();
        }
    }
    cldrTimeFormat() {
        let cldrTime;
        if (this.isNullOrEmpty(this.timeFormat)) {
            if (this.locale === 'en' || this.locale === 'en-US') {
                cldrTime = (getValue('timeFormats.short', getDefaultDateObject()));
            }
            else {
                cldrTime = (this.getCultureTimeObject(cldrData, '' + this.locale));
            }
        }
        else {
            cldrTime = this.timeFormat;
        }
        return cldrTime;
    }
    cldrDateTimeFormat() {
        let cldrTime;
        let culture = new Internationalization(this.locale);
        let dateFormat = culture.getDatePattern({ skeleton: 'yMd' });
        if (this.isNullOrEmpty(this.format)) {
            cldrTime = dateFormat + ' ' + this.getCldrFormat('time');
        }
        else {
            cldrTime = this.format;
        }
        return cldrTime;
    }
    getCldrFormat(type) {
        let cldrDateTime;
        if (this.locale === 'en' || this.locale === 'en-US') {
            cldrDateTime = (getValue('timeFormats.short', getDefaultDateObject()));
        }
        else {
            cldrDateTime = (this.getCultureTimeObject(cldrData, '' + this.locale));
        }
        return cldrDateTime;
    }
    isNullOrEmpty(value) {
        if (isNullOrUndefined(value) || (typeof value === 'string' && value.trim() === '')) {
            return true;
        }
        else {
            return false;
        }
    }
    getCultureTimeObject(ld, c) {
        return getValue('main.' + '' + this.locale + '.dates.calendars.gregorian.timeFormats.short', ld);
    }
    timeHandler(e) {
        if (e.currentTarget === this.timeIcon) {
            e.preventDefault();
        }
        if (this.enabled && !this.readonly) {
            if (this.isDatePopupOpen()) {
                super.hide(e);
            }
            if (this.isTimePopupOpen()) {
                this.closePopup(e);
            }
            else {
                if (!Browser.isDevice) {
                    this.inputElement.focus();
                }
                this.popupCreation('time', e);
            }
        }
        addClass([this.inputWrapper.container], [INPUTFOCUS$2]);
    }
    dateHandler(e) {
        if (e.currentTarget === this.inputWrapper.buttons[0]) {
            e.preventDefault();
        }
        if (this.enabled && !this.readonly) {
            if (this.isTimePopupOpen()) {
                this.closePopup(e);
            }
            if (!isNullOrUndefined(this.popupWrapper)) {
                this.popupCreation('date', e);
            }
        }
    }
    show(type, e) {
        if ((this.enabled && this.readonly) || !this.enabled) {
            return;
        }
        else {
            if (type === 'time' && !this.dateTimeWrapper) {
                if (this.isDatePopupOpen()) {
                    this.hide(e);
                }
                this.popupCreation('time', e);
            }
            else if (!this.popupObj) {
                if (this.isTimePopupOpen()) {
                    this.hide(e);
                }
                super.show();
                this.popupCreation('date', e);
            }
        }
    }
    toggle(e) {
        if (this.isDatePopupOpen()) {
            super.hide(e);
            this.show('time', null);
        }
        else if (this.isTimePopupOpen()) {
            this.hide(e);
            super.show(null, e);
            this.popupCreation('date', null);
        }
        else {
            this.show(null, e);
        }
    }
    listCreation() {
        let value = isNullOrUndefined(this.value) ? this.inputElement.value !== '' ?
            this.globalize.parseDate(this.inputElement.value, { format: this.cldrDateTimeFormat(), type: 'datetime' }) :
            new Date() : this.value;
        this.valueWithMinutes = value;
        this.listWrapper = createElement('div', { className: CONTENT$3, attrs: { 'tabindex': '0' } });
        let min = this.startTime(value);
        let max = this.endTime(value);
        let listDetails = TimePickerBase.createListItems(min, max, this.globalize, this.cldrTimeFormat(), this.step);
        this.timeCollections = listDetails.collection;
        this.listTag = listDetails.list;
        attributes(this.listTag, { 'role': 'listbox', 'aria-hidden': 'false', 'id': this.element.id + '_options' });
        append([listDetails.list], this.listWrapper);
        this.wireTimeListEvents();
        let rippleModel = { duration: 300, selector: '.' + LISTCLASS$2 };
        this.rippleFn = rippleEffect(this.listWrapper, rippleModel);
        this.liCollections = this.listWrapper.querySelectorAll('.' + LISTCLASS$2);
    }
    popupCreation(type, e) {
        if (type === 'date') {
            if (!this.readonly && this.popupWrapper) {
                addClass([this.popupWrapper], DATETIMEPOPUPWRAPPER);
                attributes(this.popupWrapper, { 'id': this.element.id + '_datepopup' });
            }
        }
        else {
            if (!this.readonly) {
                this.dateTimeWrapper = createElement('div', {
                    className: ROOT$4 + ' ' + POPUP$3,
                    attrs: { 'id': this.element.id + '_timepopup', 'style': 'visibility:hidden ; display:block' }
                });
                if (!isNullOrUndefined(this.cssClass)) {
                    this.dateTimeWrapper.classList.add(this.cssClass);
                }
                if (!isNullOrUndefined(this.step) && this.step > 0) {
                    this.listCreation();
                    append([this.listWrapper], this.dateTimeWrapper);
                }
                document.body.appendChild(this.dateTimeWrapper);
                this.addTimeSelection();
                this.renderPopup();
                this.setTimeScrollPosition();
                this.openPopup(e);
                this.popupObject.refreshPosition(this.inputElement);
            }
        }
    }
    openPopup(e) {
        this.preventArgs = {
            cancel: false,
            popup: this.popupObject,
            e: e || null
        };
        this.trigger('open', this.preventArgs);
        if (!this.preventArgs.cancel && !this.readonly) {
            let openAnimation = {
                name: 'FadeIn',
                duration: ANIMATIONDURATION$1,
            };
            this.popupObject.show(new Animation(openAnimation));
            addClass([this.inputWrapper.container], [ICONANIMATION$1]);
            attributes(this.inputElement, { 'aria-expanded': 'true' });
            EventHandler.add(document, 'mousedown touchstart', this.documentClickHandler, this);
        }
    }
    documentClickHandler(event) {
        if (!Browser.isDevice) {
            event.preventDefault();
        }
        let target = event.target;
        if (!(closest(target, '#' + (this.popupObject && this.popupObject.element.id))) && target !== this.inputElement
            && target !== this.timeIcon && target !== this.inputWrapper.container) {
            if (this.isTimePopupOpen()) {
                this.hide(event);
            }
        }
        else if (target !== this.inputElement) {
            if (!Browser.isDevice) {
                this.isPreventBlur = (Browser.isIE || Browser.info.name === 'edge') && (document.activeElement === this.inputElement);
                event.preventDefault();
            }
        }
    }
    isTimePopupOpen() {
        return (this.dateTimeWrapper && this.dateTimeWrapper.classList.contains('' + ROOT$4)) ? true : false;
    }
    isDatePopupOpen() {
        return (this.popupWrapper && this.popupWrapper.classList.contains('' + DATETIMEPOPUPWRAPPER)) ? true : false;
    }
    renderPopup() {
        this.containerStyle = this.inputWrapper.container.getBoundingClientRect();
        if (Browser.isDevice) {
            this.timeModal = createElement('div');
            this.timeModal.className = '' + ROOT$4 + ' e-time-modal';
            document.body.className += ' ' + OVERFLOW$2;
            this.timeModal.style.display = 'block';
            document.body.appendChild(this.timeModal);
        }
        let offset = 4;
        this.popupObject = new Popup(this.dateTimeWrapper, {
            width: this.setPopupWidth(),
            zIndex: this.zIndex,
            targetType: 'container',
            collision: Browser.isDevice ? { X: 'fit', Y: 'fit' } : { X: 'flip', Y: 'flip' },
            relateTo: Browser.isDevice ? document.body : this.inputWrapper.container,
            position: Browser.isDevice ? { X: 'center', Y: 'center' } : { X: 'left', Y: 'bottom' },
            enableRtl: this.enableRtl,
            offsetY: offset,
            open: () => {
                this.dateTimeWrapper.style.visibility = 'visible';
                addClass([this.timeIcon], ACTIVE$2);
                if (!Browser.isDevice) {
                    this.inputEvent = new KeyboardEvents(this.inputWrapper.container, {
                        keyAction: this.TimeKeyActionHandle.bind(this), keyConfigs: this.timekeyConfigure, eventName: 'keydown'
                    });
                }
            }, close: () => {
                removeClass([this.timeIcon], ACTIVE$2);
                this.unWireTimeListEvents();
                this.inputElement.setAttribute('aria-activedescendant', 'null');
                remove(this.popupObject.element);
                this.popupObject.destroy();
                this.dateTimeWrapper.innerHTML = '';
                this.listWrapper = this.dateTimeWrapper = undefined;
                if (this.inputEvent) {
                    this.inputEvent.destroy();
                }
            }
        });
        this.popupObject.element.style.maxHeight = POPUPDIMENSION$1;
    }
    setDimension(width) {
        if (typeof width === 'number') {
            width = formatUnit(width);
        }
        else if (typeof width === 'string') {
            width = width;
        }
        else {
            width = '100%';
        }
        return width;
    }
    setPopupWidth() {
        let width = this.setDimension(this.width);
        if (width.indexOf('%') > -1) {
            let inputWidth = this.containerStyle.width * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    }
    wireTimeListEvents() {
        EventHandler.add(this.listWrapper, 'click', this.onMouseClick, this);
        if (!Browser.isDevice) {
            EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
            EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
        }
    }
    unWireTimeListEvents() {
        if (this.listWrapper) {
            EventHandler.remove(this.listWrapper, 'click', this.onMouseClick);
            EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
            if (!Browser.isDevice) {
                EventHandler.add(this.listWrapper, 'mouseover', this.onMouseOver, this);
                EventHandler.add(this.listWrapper, 'mouseout', this.onMouseLeave, this);
            }
        }
    }
    onMouseOver(event) {
        let currentLi = closest(event.target, '.' + LISTCLASS$2);
        this.setTimeHover(currentLi, HOVER$2);
    }
    onMouseLeave() {
        this.removeTimeHover(HOVER$2);
    }
    setTimeHover(li, className) {
        if (this.enabled && this.isValidLI(li) && !li.classList.contains(className)) {
            this.removeTimeHover(className);
            addClass([li], className);
        }
    }
    getPopupHeight() {
        let height = parseInt(POPUPDIMENSION$1, 10);
        let popupHeight = this.dateTimeWrapper.getBoundingClientRect().height;
        return popupHeight > height ? height : popupHeight;
    }
    changeEvent(e) {
        if (+this.previousDateTime !== +this.value) {
            super.changeEvent(e);
            if (!Browser.isDevice) {
                this.inputElement.focus();
            }
            this.valueWithMinutes = this.value;
            this.setInputValue('date');
        }
    }
    updateValue(e) {
        this.setInputValue('time');
        if (+this.previousDateTime !== +this.value) {
            this.changedArgs = {
                value: this.value, e: e || null,
                isInteracted: !isNullOrUndefined(e),
                element: this.element
            };
            this.addTimeSelection();
            this.trigger('change', this.changedArgs);
            this.previousDateTime = this.value;
        }
    }
    setTimeScrollPosition() {
        let popupHeight = this.getPopupHeight();
        let popupElement;
        popupElement = this.selectedElement;
        if (!isNullOrUndefined(popupElement)) {
            let nextEle = popupElement.nextElementSibling;
            let height = nextEle ? nextEle.offsetTop : popupElement.offsetTop;
            let liHeight = popupElement.getBoundingClientRect().height;
            if ((height + popupElement.offsetTop) > popupHeight) {
                this.dateTimeWrapper.scrollTop = nextEle ? (height - (popupHeight / HALFPOSITION$1 + liHeight / HALFPOSITION$1)) : height;
            }
            else {
                this.dateTimeWrapper.scrollTop = 0;
            }
        }
    }
    setInputValue(type) {
        if (type === 'date') {
            this.inputElement.value = this.previousElementValue = this.getFormattedValue(this.getFullDateTime());
            this.setProperties({ value: this.getFullDateTime() }, true);
        }
        else {
            let tempVal = this.getFormattedValue(new Date(this.timeCollections[this.activeIndex]));
            Input.setValue(tempVal, this.inputElement, this.floatLabelType, this.showClearButton);
            this.previousElementValue = this.inputElement.value;
            this.setProperties({ value: new Date(this.timeCollections[this.activeIndex]) }, true);
        }
    }
    getFullDateTime() {
        let value = null;
        if (this.isDateObject(this.valueWithMinutes)) {
            value = this.combineDateTime(this.valueWithMinutes);
        }
        else {
            value = this.previousDate;
        }
        return this.validateMinMaxRange(value);
    }
    combineDateTime(value) {
        if (this.isDateObject(value)) {
            let day = this.previousDate.getDate();
            let month = this.previousDate.getMonth();
            let year = this.previousDate.getFullYear();
            let hour = value.getHours();
            let minutes = value.getMinutes();
            let seconds = value.getSeconds();
            return new Date(year, month, day, hour, minutes, seconds);
        }
        else {
            return this.previousDate;
        }
    }
    onMouseClick(event) {
        let target = event.target;
        let li = this.selectedElement = closest(target, '.' + LISTCLASS$2);
        if (li && li.classList.contains(LISTCLASS$2)) {
            this.timeValue = li.getAttribute('data-value');
            this.hide(event);
        }
        this.setSelection(li, event);
    }
    setSelection(li, event) {
        if (this.isValidLI(li) && !li.classList.contains(ACTIVE$2)) {
            let value = li.getAttribute('data-value');
            this.selectedElement = li;
            let index = Array.prototype.slice.call(this.liCollections).indexOf(li);
            this.activeIndex = index;
            this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
            addClass([this.selectedElement], ACTIVE$2);
            this.selectedElement.setAttribute('aria-selected', 'true');
            this.updateValue(event);
        }
    }
    setTimeActiveClass() {
        let collections = isNullOrUndefined(this.dateTimeWrapper) ? this.listWrapper : this.dateTimeWrapper;
        if (!isNullOrUndefined(collections)) {
            let items = collections.querySelectorAll('.' + LISTCLASS$2);
            if (items.length) {
                for (let i = 0; i < items.length; i++) {
                    if (this.timeCollections[i] === +(this.valueWithMinutes)) {
                        items[i].setAttribute('aria-selected', 'true');
                        this.selectedElement = items[i];
                        this.activeIndex = i;
                        this.setTimeActiveDescendant();
                        break;
                    }
                }
            }
        }
    }
    setTimeActiveDescendant() {
        if (!isNullOrUndefined(this.selectedElement)) {
            attributes(this.inputElement, { 'aria-activedescendant': this.selectedElement.getAttribute('id') });
        }
        else {
            attributes(this.inputElement, { 'aria-activedescendant': 'null' });
        }
    }
    addTimeSelection() {
        this.selectedElement = null;
        this.removeTimeSelection();
        this.setTimeActiveClass();
        if (!isNullOrUndefined(this.selectedElement)) {
            addClass([this.selectedElement], ACTIVE$2);
            this.selectedElement.setAttribute('aria-selected', 'true');
        }
    }
    removeTimeSelection() {
        this.removeTimeHover(HOVER$2);
        if (!isNullOrUndefined(this.dateTimeWrapper)) {
            let items = this.dateTimeWrapper.querySelectorAll('.' + ACTIVE$2);
            if (items.length) {
                removeClass(items, ACTIVE$2);
                items[0].removeAttribute('aria-selected');
            }
        }
    }
    removeTimeHover(className) {
        let hoveredItem = this.getTimeHoverItem(className);
        if (hoveredItem && hoveredItem.length) {
            removeClass(hoveredItem, className);
        }
    }
    getTimeHoverItem(className) {
        let collections = isNullOrUndefined(this.dateTimeWrapper) ? this.listWrapper : this.dateTimeWrapper;
        let hoveredItem;
        if (!isNullOrUndefined(collections)) {
            hoveredItem = collections.querySelectorAll('.' + className);
        }
        return hoveredItem;
    }
    isValidLI(li) {
        return (li && li.classList.contains(LISTCLASS$2) && !li.classList.contains(DISABLED$3));
    }
    calculateStartEnd(value, range, method) {
        let day = value.getDate();
        let month = value.getMonth();
        let year = value.getFullYear();
        let hours = value.getHours();
        let minutes = value.getMinutes();
        let seconds = value.getSeconds();
        let milliseconds = value.getMilliseconds();
        if (range) {
            if (method === 'starttime') {
                return new Date(year, month, day, 0, 0, 0);
            }
            else {
                return new Date(year, month, day, 23, 59, 59);
            }
        }
        else {
            return new Date(year, month, day, hours, minutes, seconds, milliseconds);
        }
    }
    startTime(date) {
        let tempStartValue;
        let start;
        let tempMin = this.min;
        let value;
        value = date === null ? new Date() : date;
        if ((+value.getDate() === +tempMin.getDate() && +value.getMonth() === +tempMin.getMonth() &&
            +value.getFullYear() === +tempMin.getFullYear()) || ((+new Date(value.getFullYear(), value.getMonth(), value.getDate())) <=
            +new Date(tempMin.getFullYear(), tempMin.getMonth(), tempMin.getDate()))) {
            start = false;
            tempStartValue = this.min;
        }
        else if (+value < +this.max && +value > +this.min) {
            start = true;
            tempStartValue = value;
        }
        else if (+value >= +this.max) {
            start = true;
            tempStartValue = this.max;
        }
        return this.calculateStartEnd(tempStartValue, start, 'starttime');
    }
    endTime(date) {
        let tempEndValue;
        let end;
        let tempMax = this.max;
        let value;
        value = date === null ? new Date() : date;
        if ((+value.getDate() === +tempMax.getDate() && +value.getMonth() === +tempMax.getMonth() &&
            +value.getFullYear() === +tempMax.getFullYear()) || (+new Date(value.getUTCFullYear(), value.getMonth(), value.getDate()) >=
            +new Date(tempMax.getFullYear(), tempMax.getMonth(), tempMax.getDate()))) {
            end = false;
            tempEndValue = this.max;
        }
        else if (+value < +this.max && +value > +this.min) {
            end = true;
            tempEndValue = value;
        }
        else if (+value <= +this.min) {
            end = true;
            tempEndValue = this.min;
        }
        return this.calculateStartEnd(tempEndValue, end, 'endtime');
    }
    hide(e) {
        if (this.popupObj || this.dateTimeWrapper) {
            this.preventArgs = {
                cancel: false,
                popup: this.popupObj || this.popupObject,
                e: e || null
            };
            if (isNullOrUndefined(this.popupObj)) {
                this.trigger('close', this.preventArgs);
            }
            if (!this.preventArgs.cancel) {
                if (this.isDatePopupOpen()) {
                    super.hide(e);
                }
                else if (this.isTimePopupOpen()) {
                    this.closePopup(e);
                    removeClass([document.body], OVERFLOW$2);
                    if (Browser.isDevice && this.timeModal) {
                        this.timeModal.style.display = 'none';
                        this.timeModal.outerHTML = '';
                        this.timeModal = null;
                    }
                    this.setTimeActiveDescendant();
                }
            }
        }
    }
    closePopup(e) {
        if (this.isTimePopupOpen() && this.popupObject) {
            let animModel = {
                name: 'FadeOut',
                duration: ANIMATIONDURATION$1,
                delay: 0
            };
            this.popupObject.hide(new Animation(animModel));
            this.inputWrapper.container.classList.remove(ICONANIMATION$1);
            attributes(this.inputElement, { 'aria-expanded': 'false' });
            EventHandler.remove(document, 'mousedown touchstart', this.documentClickHandler);
        }
        if (Browser.isDevice) {
            removeClass([this.inputWrapper.container], INPUTFOCUS$2);
        }
    }
    preRender() {
        super.preRender();
    }
    ;
    getProperty(date, val) {
        if (val === 'min') {
            this.setProperties({ min: this.validateValue(date.min) }, true);
        }
        else {
            this.setProperties({ max: this.validateValue(date.max) }, true);
        }
    }
    checkAttributes() {
        let attributes$$1 = ['style', 'name', 'step', 'disabled', 'readonly', 'value', 'min', 'max', 'placeholder', 'type'];
        let value;
        for (let prop of attributes$$1) {
            if (!isNullOrUndefined(this.inputElement.getAttribute(prop))) {
                switch (prop) {
                    case 'name':
                        this.inputElement.setAttribute('name', this.inputElement.getAttribute(prop));
                        break;
                    case 'step':
                        this.step = parseInt(this.inputElement.getAttribute(prop), 10);
                        break;
                    case 'readonly':
                        let readonly = !isNullOrUndefined(this.inputElement.getAttribute(prop));
                        this.setProperties({ readonly: readonly }, true);
                        break;
                    case 'placeholder':
                        this.placeholder = this.inputElement.getAttribute(prop);
                        break;
                    case 'min':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                            this.setProperties({ min: value }, true);
                        }
                        break;
                    case 'disabled':
                        let enabled = isNullOrUndefined(this.inputElement.getAttribute(prop));
                        this.setProperties({ enabled: enabled }, true);
                        break;
                    case 'max':
                        value = new Date(this.inputElement.getAttribute(prop));
                        if (!this.isNullOrEmpty(value) && !isNaN(+value)) {
                            this.setProperties({ max: value }, true);
                        }
                        break;
                }
            }
        }
    }
    getTimeActiveElement() {
        if (!isNullOrUndefined(this.dateTimeWrapper)) {
            return this.dateTimeWrapper.querySelectorAll('.' + ACTIVE$2);
        }
        else {
            return null;
        }
    }
    createDateObj(val) {
        return val instanceof Date ? val : null;
    }
    getDateObject(text) {
        if (!this.isNullOrEmpty(text)) {
            let dateValue = this.createDateObj(text);
            let value = this.valueWithMinutes;
            let status = !isNullOrUndefined(value);
            if (this.checkDateValue(dateValue)) {
                let date = status ? value.getDate() : DAY$1;
                let month = status ? value.getMonth() : MONTH$2;
                let year = status ? value.getFullYear() : YEAR$2;
                let hour = status ? value.getHours() : HOUR;
                let minute = status ? value.getMinutes() : MINUTE;
                let second = status ? value.getSeconds() : SECOND;
                let millisecond = status ? value.getMilliseconds() : MILLISECOND;
                return new Date(year, month, date, hour, minute, second, millisecond);
            }
        }
        return null;
    }
    findNextTimeElement(event) {
        let textVal = (this.inputElement).value;
        let value = isNullOrUndefined(this.valueWithMinutes) ? this.createDateObj(textVal) :
            this.getDateObject(this.valueWithMinutes);
        let dateTimeVal = null;
        let listCount = this.liCollections.length;
        if (!isNullOrUndefined(this.checkDateValue(value)) || !isNullOrUndefined(this.activeIndex)) {
            if (event.action === 'home') {
                dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[0])));
                this.activeIndex = 0;
            }
            else if (event.action === 'end') {
                dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[this.timeCollections.length - 1])));
                this.activeIndex = this.timeCollections.length - 1;
            }
            else {
                if (event.action === 'down') {
                    for (let i = 0; i < listCount; i++) {
                        if (+value < this.timeCollections[i]) {
                            dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[i])));
                            this.activeIndex = i;
                            break;
                        }
                    }
                }
                else {
                    for (let i = listCount - 1; i >= 0; i--) {
                        if (+value > this.timeCollections[i]) {
                            dateTimeVal = +(this.createDateObj(new Date(this.timeCollections[i])));
                            this.activeIndex = i;
                            break;
                        }
                    }
                }
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.timeElementValue(isNullOrUndefined(dateTimeVal) ? null : new Date(dateTimeVal));
        }
    }
    setTimeValue(date, value) {
        let time;
        let val = this.validateMinMaxRange(value);
        let newval = this.createDateObj(val);
        if (this.getFormattedValue(newval) !== (!isNullOrUndefined(this.value) ? this.getFormattedValue(this.value) : null)) {
            this.valueWithMinutes = isNullOrUndefined(newval) ? null : newval;
            time = new Date(+this.valueWithMinutes);
        }
        else {
            if (this.strictMode) {
                //for strict mode case, when value not present within a range. Reset the nearest range value.
                date = newval;
            }
            this.valueWithMinutes = this.checkDateValue(date);
            time = new Date(+this.valueWithMinutes);
        }
        let dateString = this.globalize.formatDate(time, {
            format: !isNullOrUndefined(this.format) ? this.format : this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd'
        });
        if (!this.strictMode && isNullOrUndefined(time)) {
            Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        else {
            Input.setValue(dateString, this.inputElement, this.floatLabelType, this.showClearButton);
        }
        return time;
    }
    timeElementValue(value) {
        if (!isNullOrUndefined(this.checkDateValue(value)) && !this.isNullOrEmpty(value)) {
            let date = value instanceof Date ? value : this.getDateObject(value);
            return this.setTimeValue(date, value);
        }
        return null;
    }
    timeKeyHandler(event) {
        if (isNullOrUndefined(this.step) || this.step <= 0) {
            return;
        }
        let listCount = this.timeCollections.length;
        if (isNullOrUndefined(this.getTimeActiveElement()) || this.getTimeActiveElement().length === 0) {
            if (this.liCollections.length > 0) {
                if (isNullOrUndefined(this.value) && isNullOrUndefined(this.activeIndex)) {
                    this.activeIndex = 0;
                    this.selectedElement = this.liCollections[0];
                    this.timeElementValue(new Date(this.timeCollections[0]));
                }
                else {
                    this.findNextTimeElement(event);
                }
            }
        }
        else {
            let nextItemValue;
            if ((event.keyCode >= 37) && (event.keyCode <= 40)) {
                let index = (event.keyCode === 40 || event.keyCode === 39) ? ++this.activeIndex : --this.activeIndex;
                this.activeIndex = index = this.activeIndex === (listCount) ? 0 : this.activeIndex;
                this.activeIndex = index = this.activeIndex < 0 ? (listCount - 1) : this.activeIndex;
                nextItemValue = isNullOrUndefined(this.timeCollections[index]) ? this.timeCollections[0] : this.timeCollections[index];
            }
            else if (event.action === 'home') {
                this.activeIndex = 0;
                nextItemValue = this.timeCollections[0];
            }
            else if (event.action === 'end') {
                this.activeIndex = listCount - 1;
                nextItemValue = this.timeCollections[listCount - 1];
            }
            this.selectedElement = this.liCollections[this.activeIndex];
            this.timeElementValue(new Date(nextItemValue));
        }
        this.isNavigate = true;
        this.setTimeHover(this.selectedElement, NAVIGATION$1);
        this.setTimeActiveDescendant();
        if (this.isTimePopupOpen() && this.selectedElement !== null && (!event || event.type !== 'click')) {
            this.setTimeScrollPosition();
        }
    }
    TimeKeyActionHandle(event) {
        if (this.enabled) {
            if (event.action !== 'right' && event.action !== 'left' && event.action !== 'tab') {
                event.preventDefault();
            }
            switch (event.action) {
                case 'up':
                case 'down':
                case 'home':
                case 'end':
                    this.timeKeyHandler(event);
                    break;
                case 'enter':
                    if (this.isNavigate) {
                        this.selectedElement = this.liCollections[this.activeIndex];
                        this.valueWithMinutes = new Date(this.timeCollections[this.activeIndex]);
                        this.setInputValue('time');
                        if (+this.previousDateTime !== +this.value) {
                            this.changedArgs.value = this.value;
                            this.addTimeSelection();
                            this.previousDateTime = this.value;
                        }
                    }
                    else {
                        this.updateValue(event);
                    }
                    this.hide(event);
                    addClass([this.inputWrapper.container], INPUTFOCUS$2);
                    this.isNavigate = false;
                    break;
                case 'escape':
                    this.hide(event);
                    break;
                default:
                    this.isNavigate = false;
                    break;
            }
        }
    }
    inputKeyAction(event) {
        switch (event.action) {
            case 'altDownArrow':
                this.strictModeUpdate();
                this.updateInput();
                this.toggle(event);
                break;
        }
    }
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'value':
                    let options = { format: this.cldrDateTimeFormat(), type: 'dateTime', skeleton: 'yMd' };
                    if (typeof newProp.value === 'string') {
                        this.setProperties({ value: this.globalize.parseDate(newProp.value, options) }, true);
                        newProp.value = this.globalize.parseDate(newProp.value, options);
                    }
                    newProp.value = this.validateValue(newProp.value);
                    Input.setValue(this.getFormattedValue(newProp.value), this.inputElement, this.floatLabelType, this.showClearButton);
                    this.valueWithMinutes = newProp.value;
                    this.setProperties({ value: newProp.value }, true);
                    this.previousDateTime = new Date(this.inputElement.value);
                    this.updateInput();
                    this.changeTrigger(null);
                    break;
                case 'min':
                case 'max':
                    this.getProperty(newProp, prop);
                    this.updateInput();
                    break;
                case 'enableRtl':
                    Input.setEnableRtl(this.enableRtl, [this.inputWrapper.container]);
                    break;
                case 'cssClass':
                    Input.setCssClass(newProp.cssClass, [this.inputWrapper.container]);
                    if (this.dateTimeWrapper) {
                        addClass([this.dateTimeWrapper], [newProp.cssClass]);
                    }
                    break;
                case 'locale':
                    this.globalize = new Internationalization(this.locale);
                    this.l10n.setLocale(this.locale);
                    this.setProperties({ placeholder: this.l10n.getConstant('placeholder') }, true);
                    Input.setPlaceholder(this.l10n.getConstant('placeholder'), this.inputElement);
                    this.dateTimeFormat = this.cldrDateTimeFormat();
                    super.updateInput();
                    break;
                case 'format':
                    this.setProperties({ format: newProp.format }, true);
                    this.setValue();
                    break;
                case 'placeholder':
                    Input.setPlaceholder(newProp.placeholder, this.inputElement);
                    this.inputElement.setAttribute('aria-placeholder', newProp.placeholder);
                    break;
                case 'enabled':
                    Input.setEnabled(this.enabled, this.inputElement);
                    this.bindEvents();
                    break;
                case 'strictMode':
                    this.updateInput();
                    break;
                case 'width':
                    this.setWidth(newProp.width);
                    break;
                case 'readonly':
                    Input.setReadonly(this.readonly, this.inputElement);
                    break;
                case 'floatLabelType':
                    this.floatLabelType = newProp.floatLabelType;
                    Input.removeFloating(this.inputWrapper);
                    Input.addFloating(this.inputElement, this.floatLabelType, this.placeholder);
                    break;
                default:
                    super.onPropertyChanged(newProp, oldProp);
                    break;
            }
            this.hide(null);
        }
    }
    /**
     * To get component name.
     * @private
     */
    getModuleName() {
        return 'datetimepicker';
    }
};
__decorate$4([
    Property(null)
], DateTimePicker.prototype, "timeFormat", void 0);
__decorate$4([
    Property(30)
], DateTimePicker.prototype, "step", void 0);
__decorate$4([
    Property(1000)
], DateTimePicker.prototype, "zIndex", void 0);
__decorate$4([
    Property(false)
], DateTimePicker.prototype, "enablePersistence", void 0);
__decorate$4([
    Property(true)
], DateTimePicker.prototype, "showClearButton", void 0);
__decorate$4([
    Property(null)
], DateTimePicker.prototype, "placeholder", void 0);
__decorate$4([
    Property(false)
], DateTimePicker.prototype, "strictMode", void 0);
__decorate$4([
    Event()
], DateTimePicker.prototype, "open", void 0);
__decorate$4([
    Event()
], DateTimePicker.prototype, "close", void 0);
__decorate$4([
    Event()
], DateTimePicker.prototype, "blur", void 0);
__decorate$4([
    Event()
], DateTimePicker.prototype, "focus", void 0);
__decorate$4([
    Event()
], DateTimePicker.prototype, "created", void 0);
__decorate$4([
    Event()
], DateTimePicker.prototype, "destroyed", void 0);
DateTimePicker = __decorate$4([
    NotifyPropertyChanges
], DateTimePicker);

/**
 * DateTimePicker modules
 */

/**
 * Calendar all modules
 */

export { CalendarBase, Calendar, DatePicker, Presets, DateRangePicker, TimePickerBase, TimePicker, DateTimePicker };
//# sourceMappingURL=ej2-calendars.es2015.js.map
