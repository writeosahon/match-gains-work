import { Animation, Browser, ChildProperty, Collection, Complex, Component, Draggable, Droppable, Event, EventHandler, KeyboardEvents, L10n, NotifyPropertyChanges, Property, Touch, addClass, append, attributes, classList, closest, compile, createElement, detach, formatUnit, getInstance, getUniqueID, getValue, isNullOrUndefined, isUndefined, isVisible, matches, removeClass, rippleEffect, select, selectAll, setStyleAttribute, setValue } from '@syncfusion/ej2-base';
import { Popup, calculatePosition, createSpinner, fit, getScrollableParent, getZindexPartial, hideSpinner, isCollide, showSpinner } from '@syncfusion/ej2-popups';
import { Button, createCheckBox, rippleMouseHandler } from '@syncfusion/ej2-buttons';
import { ListBase } from '@syncfusion/ej2-lists';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Input } from '@syncfusion/ej2-inputs';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CLS_ROOT = 'e-hscroll';
const CLS_RTL = 'e-rtl';
const CLS_DISABLE = 'e-overlay';
const CLS_HSCROLLBAR = 'e-hscroll-bar';
const CLS_HSCROLLCON = 'e-hscroll-content';
const CLS_NAVARROW = 'e-nav-arrow';
const CLS_NAVRIGHTARROW = 'e-nav-right-arrow';
const CLS_NAVLEFTARROW = 'e-nav-left-arrow';
const CLS_HSCROLLNAV = 'e-scroll-nav';
const CLS_HSCROLLNAVRIGHT = 'e-scroll-right-nav';
const CLS_HSCROLLNAVLEFT = 'e-scroll-left-nav';
const CLS_DEVICE = 'e-scroll-device';
/**
 * HScroll module is introduces horizontal scroller when content exceeds the current viewing area.
 * It can be useful for the components like Toolbar, Tab which needs horizontal scrolling alone.
 * Hidden content can be view by touch moving or icon click.
 * ```html
 * <div id="scroll"/>
 * <script>
 *   var scrollObj = new HScroll();
 *   scrollObj.appendTo("#scroll");
 * </script>
 * ```
 */
let HScroll = class HScroll extends Component {
    /**
     * Initializes a new instance of the HScroll class.
     * @param options  - Specifies HScroll model properties as options.
     * @param element  - Specifies the element for which horizontal scrolling applies.
     */
    constructor(options, element) {
        super(options, element);
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        this.browser = Browser.info.name;
        this.browserCheck = this.browser === 'mozilla';
        this.isDevice = Browser.isDevice;
        let element = this.element;
        this.ieCheck = this.browser === 'edge' || this.browser === 'msie';
        this.initialize();
        if (element.id === '') {
            element.id = getUniqueID('hscroll');
            this.uniqueId = true;
        }
        element.style.display = 'block';
        if (this.enableRtl) {
            element.classList.add(CLS_RTL);
        }
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
        this.touchModule = new Touch(this.element, { scroll: this.touchHandler.bind(this) });
        if (!this.isDevice) {
            this.createNavIcon(this.element);
            EventHandler.add(this.scrollEle, 'scroll', this.scrollHandler, this);
        }
        else {
            this.element.classList.add(CLS_DEVICE);
        }
    }
    initialize() {
        let scrollEle = createElement('div', { className: CLS_HSCROLLCON });
        let scrollDiv = createElement('div', { className: CLS_HSCROLLBAR });
        scrollDiv.setAttribute('tabindex', '-1');
        let ele = this.element;
        let innerEle = [].slice.call(ele.children);
        for (let ele of innerEle) {
            scrollEle.appendChild(ele);
        }
        scrollDiv.appendChild(scrollEle);
        ele.appendChild(scrollDiv);
        scrollDiv.style.overflowX = 'hidden';
        this.scrollEle = scrollDiv;
        this.scrollItems = scrollEle;
    }
    getPersistData() {
        let keyEntity = ['scrollStep'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'hScroll';
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    destroy() {
        let ele = this.element;
        ele.style.display = '';
        ele.classList.remove(CLS_ROOT);
        let nav = selectAll('.e-' + ele.id + '_nav.' + CLS_HSCROLLNAV, ele);
        for (let elem of [].slice.call(this.scrollItems.children)) {
            ele.appendChild(elem);
        }
        if (this.uniqueId) {
            this.element.removeAttribute('id');
        }
        detach(this.scrollEle);
        if (nav.length > 0) {
            detach(nav[0]);
            detach(nav[1]);
        }
        EventHandler.remove(this.scrollEle, 'scroll', this.scrollHandler);
        this.touchModule.destroy();
        this.touchModule = null;
        super.destroy();
    }
    createNavIcon(element) {
        let id = element.id.concat('_nav');
        let clsRight = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVRIGHT);
        let nav = createElement('div', { id: id.concat('_right'), className: clsRight });
        nav.setAttribute('aria-disabled', 'false');
        let navItem = createElement('div', { className: CLS_NAVRIGHTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        let clsLeft = 'e-' + element.id.concat('_nav ' + CLS_HSCROLLNAV + ' ' + CLS_HSCROLLNAVLEFT);
        let navEle = createElement('div', { id: id.concat('_left'), className: clsLeft + ' ' + CLS_DISABLE });
        navEle.setAttribute('aria-disabled', 'true');
        let navLeftItem = createElement('div', { className: CLS_NAVLEFTARROW + ' ' + CLS_NAVARROW + ' e-icons' });
        navEle.appendChild(navLeftItem);
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        element.appendChild(nav);
        element.insertBefore(navEle, element.firstChild);
        if (this.ieCheck) {
            nav.classList.add('e-ie-align');
            navEle.classList.add('e-ie-align');
        }
        this.eventBinding([nav, navEle]);
    }
    onKeyPress(e) {
        if (e.key === 'Enter') {
            let timeoutFun = () => {
                this.keyTimeout = true;
                this.eleScrolling(10, e.target);
            };
            this.keyTimer = window.setTimeout(() => {
                timeoutFun();
            }, 100);
        }
    }
    onKeyUp(e) {
        if (e.key !== 'Enter') {
            return;
        }
        if (this.keyTimeout) {
            this.keyTimeout = false;
        }
        else {
            e.target.click();
        }
        clearTimeout(this.keyTimer);
    }
    eventBinding(ele) {
        ele.forEach((el) => {
            new Touch(el, { tapHold: this.tabHoldHandler.bind(this), tapHoldThreshold: 500 });
            el.addEventListener('keydown', this.onKeyPress.bind(this));
            el.addEventListener('keyup', this.onKeyUp.bind(this));
            el.addEventListener('mouseup', this.repeatScroll.bind(this));
            el.addEventListener('touchend', this.repeatScroll.bind(this));
            el.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
            EventHandler.add(el, 'click', this.clickEventHandler, this);
        });
    }
    repeatScroll() {
        clearInterval(this.timeout);
    }
    tabHoldHandler(e) {
        let trgt = e.originalEvent.target;
        trgt = this.contains(trgt, CLS_HSCROLLNAV) ? trgt.firstElementChild : trgt;
        let scrollDis = 10;
        let timeoutFun = () => {
            this.eleScrolling(scrollDis, trgt);
        };
        this.timeout = window.setInterval(() => {
            timeoutFun();
        }, 50);
    }
    contains(ele, className) {
        return ele.classList.contains(className);
    }
    eleScrolling(scrollDis, trgt) {
        let element = this.scrollEle;
        let rootEle = this.element;
        let classList$$1 = trgt.classList;
        if (classList$$1.contains(CLS_HSCROLLNAV)) {
            classList$$1 = trgt.querySelector('.' + CLS_NAVARROW).classList;
        }
        if (this.contains(rootEle, CLS_RTL) && this.browserCheck) {
            scrollDis = -scrollDis;
        }
        let scrlLeft = element.scrollLeft;
        if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
            if (classList$$1.contains(CLS_NAVRIGHTARROW)) {
                element.scrollLeft = scrlLeft + scrollDis;
            }
            else {
                element.scrollLeft = scrlLeft - scrollDis;
            }
        }
        else {
            if (classList$$1.contains(CLS_NAVLEFTARROW)) {
                element.scrollLeft = scrlLeft + scrollDis;
            }
            else {
                element.scrollLeft = scrlLeft - scrollDis;
            }
        }
    }
    clickEventHandler(e) {
        this.eleScrolling(this.scrollStep, e.target);
    }
    touchHandler(e) {
        let ele = this.scrollEle;
        let distance;
        distance = e.distanceX;
        if ((this.ieCheck) && this.contains(this.element, CLS_RTL)) {
            distance = -distance;
        }
        if (e.scrollDirection === 'Left') {
            ele.scrollLeft = ele.scrollLeft + distance;
        }
        else if (e.scrollDirection === 'Right') {
            ele.scrollLeft = ele.scrollLeft - distance;
        }
    }
    arrowDisabling(addDisable, removeDisable) {
        addDisable.classList.add(CLS_DISABLE);
        addDisable.setAttribute('aria-disabled', 'true');
        addDisable.removeAttribute('tabindex');
        clearInterval(this.timeout);
        removeDisable.classList.remove(CLS_DISABLE);
        removeDisable.setAttribute('aria-disabled', 'false');
        removeDisable.setAttribute('tabindex', '0');
        this.repeatScroll();
    }
    scrollHandler(e) {
        let target = e.target;
        let width = target.offsetWidth;
        let rootEle = this.element;
        let navLeftEle = this.element.querySelector('.' + CLS_HSCROLLNAVLEFT);
        let navRightEle = this.element.querySelector('.' + CLS_HSCROLLNAVRIGHT);
        let scrollLeft = target.scrollLeft;
        if (scrollLeft <= 0) {
            scrollLeft = -scrollLeft;
        }
        if (scrollLeft === 0) {
            if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
                this.arrowDisabling(navLeftEle, navRightEle);
            }
            else {
                this.arrowDisabling(navRightEle, navLeftEle);
            }
        }
        else if (Math.ceil(width + scrollLeft + .1) >= target.scrollWidth) {
            if ((!this.contains(rootEle, CLS_RTL) || this.browserCheck) || this.ieCheck) {
                this.arrowDisabling(navRightEle, navLeftEle);
            }
            else {
                this.arrowDisabling(navLeftEle, navRightEle);
            }
        }
        else {
            let disEle = this.element.querySelector('.' + CLS_HSCROLLNAV + '.' + CLS_DISABLE);
            if (disEle) {
                disEle.classList.remove(CLS_DISABLE);
                disEle.setAttribute('aria-disabled', 'false');
                disEle.setAttribute('tabindex', '0');
            }
        }
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     * @param  {HScrollModel} newProp
     * @param  {HScrollModel} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'scrollStep':
                    break;
                case 'enableRtl':
                    newProp.enableRtl ? this.element.classList.add(CLS_RTL) : this.element.classList.remove(CLS_RTL);
                    break;
            }
        }
    }
};
__decorate([
    Property(40)
], HScroll.prototype, "scrollStep", void 0);
HScroll = __decorate([
    NotifyPropertyChanges
], HScroll);

/**
 * Navigation Common modules
 */

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CLS_ITEMS = 'e-toolbar-items';
const CLS_ITEM = 'e-toolbar-item';
const CLS_RTL$1 = 'e-rtl';
const CLS_SEPARATOR = 'e-separator';
const CLS_POPUPICON = 'e-popup-up-icon';
const CLS_POPUPDOWN = 'e-popup-down-icon';
const CLS_TEMPLATE = 'e-template';
const CLS_DISABLE$1 = 'e-overlay';
const CLS_POPUPTEXT = 'e-toolbar-text';
const CLS_TBARTEXT = 'e-popup-text';
const CLS_TBAROVERFLOW = 'e-overflow-show';
const CLS_POPOVERFLOW = 'e-overflow-hide';
const CLS_TBARBTN = 'e-tbar-btn';
const CLS_TBARNAV = 'e-hor-nav';
const CLS_TBARSCRLNAV = 'e-scroll-nav';
const CLS_TBARRIGHT = 'e-toolbar-right';
const CLS_TBARLEFT = 'e-toolbar-left';
const CLS_TBARCENTER = 'e-toolbar-center';
const CLS_TBARPOS = 'e-tbar-pos';
const CLS_TBARSCROLL = 'e-hscroll-content';
const CLS_POPUPNAV = 'e-hor-nav';
const CLS_POPUPCLASS = 'e-toolbar-pop';
const CLS_POPUP = 'e-toolbar-popup';
const CLS_TBARBTNTEXT = 'e-tbar-btn-text';
const CLS_TBARNAVACT = 'e-nav-active';
const CLS_TBARIGNORE = 'e-ignore';
const CLS_POPPRI = 'e-popup-alone';
const CLS_HIDDEN = 'e-hidden';
/**
 * An item object that is used to configure Toolbar commands.
 */
class Item extends ChildProperty {
}
__decorate$1([
    Property('')
], Item.prototype, "id", void 0);
__decorate$1([
    Property('')
], Item.prototype, "text", void 0);
__decorate$1([
    Property('auto')
], Item.prototype, "width", void 0);
__decorate$1([
    Property('')
], Item.prototype, "cssClass", void 0);
__decorate$1([
    Property(false)
], Item.prototype, "showAlwaysInPopup", void 0);
__decorate$1([
    Property('')
], Item.prototype, "prefixIcon", void 0);
__decorate$1([
    Property('')
], Item.prototype, "suffixIcon", void 0);
__decorate$1([
    Property('None')
], Item.prototype, "overflow", void 0);
__decorate$1([
    Property('')
], Item.prototype, "template", void 0);
__decorate$1([
    Property('Button')
], Item.prototype, "type", void 0);
__decorate$1([
    Property('Both')
], Item.prototype, "showTextOn", void 0);
__decorate$1([
    Property(null)
], Item.prototype, "htmlAttributes", void 0);
__decorate$1([
    Property('')
], Item.prototype, "tooltipText", void 0);
__decorate$1([
    Property('Left')
], Item.prototype, "align", void 0);
/**
 * The Toolbar control contains a group of commands that are aligned horizontally.
 * ```html
 * <div id="toolbar"/>
 * <script>
 *   var toolbarObj = new Toolbar();
 *   toolbarObj.appendTo("#toolbar");
 * </script>
 * ```
 */
let Toolbar = class Toolbar extends Component {
    /**
     * Initializes a new instance of the Toolbar class.
     * @param options  - Specifies Toolbar model properties as options.
     * @param element  - Specifies the element that is rendered as a Toolbar.
     */
    constructor(options, element) {
        super(options, element);
        /**
         * Contains the keyboard configuration of the Toolbar.
         */
        this.keyConfigs = {
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            moveDown: 'downarrow',
            popupOpen: 'enter',
            popupClose: 'escape',
            tab: 'tab',
            home: 'home',
            end: 'end',
        };
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void.
     */
    destroy() {
        let ele = this.element;
        super.destroy();
        this.unwireEvents();
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        }
        if (this.trgtEle) {
            ele.appendChild(this.ctrlTem);
        }
        this.clearProperty();
        this.popObj = null;
        this.tbarAlign = null;
        this.remove(this.element, 'e-toolpop');
        ele.removeAttribute('style');
        ['aria-disabled', 'aria-orientation', 'aria-haspopup', 'role'].forEach((attrb) => {
            this.element.removeAttribute(attrb);
        });
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        this.trigger('beforeCreate');
        this.scrollModule = null;
        this.popObj = null;
        this.tbarItemsCol = this.items;
        this.popupPriCount = 0;
        if (this.enableRtl) {
            this.add(this.element, CLS_RTL$1);
        }
    }
    wireEvents() {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        window.addEventListener('resize', this.resize.bind(this));
        this.keyModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs
        });
        EventHandler.add(this.element, 'keydown', this.docKeyDown, this);
        this.element.setAttribute('tabIndex', '0');
    }
    docKeyDown(e) {
        if (e.target.tagName === 'INPUT') {
            return;
        }
        if (e.keyCode === 9 && e.target.classList.contains('e-hor-nav') === true && isVisible(this.popObj.element)) {
            this.popObj.hide({ name: 'SlideUp', duration: 100 });
        }
        let keyCheck = (e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 35 || e.keyCode === 36);
        if (keyCheck) {
            e.preventDefault();
        }
    }
    unwireEvents() {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        this.destroyHScroll();
        this.keyModule.destroy();
        EventHandler.remove(document, 'scroll', this.docEvent);
        EventHandler.remove(this.element, 'keydown', this.docKeyDown);
        EventHandler.remove(document, 'click', this.docEvent);
    }
    clearProperty() {
        this.tbarEle = [];
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
    }
    docEvent(e) {
        let popEle = closest(e.target, '.e-popup');
        if (this.popObj && isVisible(this.popObj.element) && !popEle) {
            this.popObj.hide({ name: 'SlideUp', duration: 100 });
        }
    }
    destroyHScroll() {
        if (this.scrollModule) {
            if (this.tbarAlign) {
                this.add(this.scrollModule.element, CLS_TBARPOS);
            }
            this.scrollModule.destroy();
            this.scrollModule = null;
        }
    }
    destroyItems() {
        [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM)).forEach((el) => {
            detach(el);
        });
        let tbarItems = this.element.querySelector('.' + CLS_ITEMS);
        if (this.tbarAlign) {
            [].slice.call(tbarItems.children).forEach((el) => {
                detach(el);
            });
            this.tbarAlign = false;
            this.remove(tbarItems, CLS_TBARPOS);
        }
        this.clearProperty();
    }
    destroyMode() {
        if (this.scrollModule) {
            this.remove(this.scrollModule.element, CLS_RTL$1);
            this.destroyHScroll();
        }
        if (this.popObj) {
            this.popupRefresh(this.popObj.element, true);
        }
    }
    add(ele, val) {
        ele.classList.add(val);
    }
    remove(ele, val) {
        ele.classList.remove(val);
    }
    elementFocus(ele) {
        let fChild = ele.firstElementChild;
        if (fChild) {
            fChild.focus();
            this.activeEleSwitch(ele);
        }
        else {
            ele.focus();
        }
    }
    clstElement(tbrNavChk, trgt) {
        let clst;
        if (tbrNavChk && this.popObj && isVisible(this.popObj.element)) {
            clst = this.popObj.element.querySelector('.' + CLS_ITEM);
        }
        else if (this.element === trgt || tbrNavChk) {
            clst = this.element.querySelector('.' + CLS_ITEM);
        }
        else {
            clst = closest(trgt, '.' + CLS_ITEM);
        }
        return clst;
    }
    keyHandling(clst, e, trgt, navChk, scrollChk) {
        let popObj = this.popObj;
        let rootEle = this.element;
        let popAnimate = { name: 'SlideUp', duration: 100 };
        switch (e.action) {
            case 'moveRight':
                if (rootEle === trgt) {
                    this.elementFocus(clst);
                }
                else if (!navChk) {
                    this.eleFocus(clst, 'next');
                }
                break;
            case 'moveLeft':
                if (!navChk) {
                    this.eleFocus(clst, 'previous');
                }
                break;
            case 'home':
            case 'end':
                let ele;
                let nodes;
                if (clst) {
                    let popupCheck = closest(clst, '.e-popup');
                    if (popupCheck) {
                        if (isVisible(this.popObj.element)) {
                            nodes = popupCheck.children;
                            if (e.action === 'home') {
                                ele = nodes[0];
                            }
                            else {
                                ele = nodes[nodes.length - 1];
                            }
                        }
                    }
                    else {
                        nodes = this.element.querySelectorAll('.' + CLS_ITEMS + ' .' + CLS_ITEM);
                        if (e.action === 'home') {
                            ele = nodes[0];
                        }
                        else {
                            ele = nodes[nodes.length - 1];
                        }
                    }
                    if (ele) {
                        this.elementFocus(ele);
                    }
                }
                break;
            case 'moveUp':
            case 'moveDown':
                let value = e.action === 'moveUp' ? 'previous' : 'next';
                if (popObj && closest(trgt, '.e-popup')) {
                    let popEle = popObj.element;
                    let popFrstEle = popEle.firstElementChild;
                    if ((value === 'previous' && popFrstEle === clst) || (value === 'next' && popEle.lastElementChild === clst)) {
                        return;
                    }
                    else {
                        this.eleFocus(clst, value);
                    }
                }
                else if (e.action === 'moveDown' && popObj && isVisible(popObj.element)) {
                    this.elementFocus(clst);
                }
                break;
            case 'tab':
                if (!scrollChk && !navChk) {
                    let ele = clst.firstElementChild;
                    if (rootEle === trgt) {
                        if (this.activeEle) {
                            this.activeEle.focus();
                        }
                        else {
                            this.activeEleRemove(ele);
                            ele.focus();
                        }
                        this.element.removeAttribute('tabindex');
                    }
                }
                break;
            case 'popupClose':
                if (popObj) {
                    popObj.hide(popAnimate);
                }
                break;
            case 'popupOpen':
                if (!navChk) {
                    return;
                }
                if (popObj && !isVisible(popObj.element)) {
                    popObj.element.style.top = rootEle.offsetHeight + 'px';
                    popObj.show({ name: 'SlideDown', duration: 100 });
                }
                else {
                    popObj.hide(popAnimate);
                }
                break;
        }
    }
    keyActionHandler(e) {
        let trgt = e.target;
        if (trgt.tagName === 'INPUT') {
            return;
        }
        e.preventDefault();
        let clst;
        let tbrNavChk = trgt.classList.contains(CLS_TBARNAV);
        let tbarScrollChk = trgt.classList.contains(CLS_TBARSCRLNAV);
        clst = this.clstElement(tbrNavChk, trgt);
        if (clst || tbarScrollChk) {
            this.keyHandling(clst, e, trgt, tbrNavChk, tbarScrollChk);
        }
    }
    eleFocus(closest$$1, pos) {
        let sib = Object(closest$$1)[pos + 'ElementSibling'];
        let contains = (el) => {
            return el.classList.contains(CLS_SEPARATOR) || el.classList.contains(CLS_DISABLE$1);
        };
        if (sib) {
            let skipEle = contains(sib);
            if (skipEle) {
                if (Object(sib)[pos + 'ElementSibling']) {
                    sib = Object(sib)[pos + 'ElementSibling'];
                    skipEle = contains(sib);
                    if (skipEle) {
                        this.eleFocus(sib, pos);
                        return;
                    }
                }
            }
            this.elementFocus(sib);
        }
        else if (this.tbarAlign) {
            let elem = Object(closest$$1.parentElement)[pos + 'ElementSibling'];
            if (!isNullOrUndefined(elem) && elem.children.length === 0) {
                elem = Object(elem)[pos + 'ElementSibling'];
            }
            if (!isNullOrUndefined(elem) && elem.children.length > 0) {
                if (pos === 'next') {
                    let el = elem.querySelector('.' + CLS_ITEM);
                    if (contains(el)) {
                        this.eleFocus(el, pos);
                    }
                    else {
                        el.firstElementChild.focus();
                        this.activeEleSwitch(el);
                    }
                }
                else {
                    let el = elem.lastElementChild;
                    if (contains(el)) {
                        this.eleFocus(el, pos);
                    }
                    else {
                        this.elementFocus(el);
                    }
                }
            }
        }
    }
    clickHandler(e) {
        let trgt = e.target;
        let clsList = trgt.classList;
        let ele = this.element;
        let isPopupElement = !isNullOrUndefined(closest(trgt, '.' + CLS_POPUPCLASS));
        let popupNav = closest(trgt, ('.' + CLS_TBARNAV));
        if (!popupNav) {
            popupNav = trgt;
        }
        if (!ele.children[0].classList.contains('e-hscroll') && (clsList.contains(CLS_TBARNAV))) {
            clsList = trgt.querySelector('.e-icons').classList;
        }
        if (clsList.contains(CLS_POPUPICON) || clsList.contains(CLS_POPUPDOWN)) {
            this.popupClickHandler(ele, popupNav, CLS_RTL$1);
        }
        let itemObj;
        let clst = closest(e.target, '.' + CLS_ITEM);
        if ((isNullOrUndefined(clst) || clst.classList.contains(CLS_DISABLE$1)) && !popupNav.classList.contains(CLS_TBARNAV)) {
            return;
        }
        if (clst) {
            itemObj = this.items[this.tbarEle.indexOf(clst)];
        }
        let eventArgs = { originalEvent: e, item: itemObj };
        this.trigger('clicked', eventArgs);
        if (isPopupElement && !eventArgs.cancel) {
            this.popObj.hide({ name: 'SlideUp', duration: 100 });
        }
    }
    ;
    popupClickHandler(ele, popupNav, CLS_RTL) {
        let popObj = this.popObj;
        if (isVisible(popObj.element)) {
            popupNav.classList.remove(CLS_TBARNAVACT);
            popObj.hide({ name: 'SlideUp', duration: 100 });
        }
        else {
            if (ele.classList.contains(CLS_RTL)) {
                popObj.enableRtl = true;
                popObj.position = { X: 'left', Y: 'top' };
            }
            if (popObj.offsetX === 0 && !ele.classList.contains(CLS_RTL)) {
                popObj.enableRtl = false;
                popObj.position = { X: 'right', Y: 'top' };
            }
            popObj.dataBind();
            popObj.refreshPosition();
            popObj.element.style.top = this.element.offsetHeight + 'px';
            popupNav.classList.add(CLS_TBARNAVACT);
            popObj.show({ name: 'SlideDown', duration: 100 });
        }
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
        this.initialize();
        this.renderControl();
        this.wireEvents();
    }
    initialize() {
        let width = formatUnit(this.width);
        let height = formatUnit(this.height);
        if (Browser.info.name !== 'msie' || this.height !== 'auto') {
            setStyleAttribute(this.element, { 'height': height });
        }
        setStyleAttribute(this.element, { 'width': width });
        let ariaAttr = {
            'role': 'toolbar', 'aria-disabled': 'false', 'aria-haspopup': 'false', 'aria-orientation': 'horizontal',
        };
        attributes(this.element, ariaAttr);
    }
    renderControl() {
        this.trgtEle = (this.element.children.length > 0) ? this.element.querySelector('div') : null;
        this.tbarAlgEle = { lefts: [], centers: [], rights: [] };
        this.renderItems();
        this.renderOverflowMode();
        if (this.tbarAlign) {
            this.itemPositioning();
        }
        if (this.popObj && this.popObj.element.childElementCount > 1 && this.checkPopupRefresh(this.element, this.popObj.element)) {
            this.popupRefresh(this.popObj.element, false);
        }
    }
    initHScroll(element, innerItems) {
        if (!this.scrollModule && this.checkOverflow(element, innerItems[0])) {
            if (this.tbarAlign) {
                this.element.querySelector('.' + CLS_ITEMS + ' .' + CLS_TBARCENTER).removeAttribute('style');
            }
            this.scrollModule = new HScroll({ scrollStep: 50, enableRtl: this.enableRtl }, innerItems[0]);
            this.remove(this.scrollModule.element, CLS_TBARPOS);
            setStyleAttribute(this.element, { overflow: 'hidden' });
        }
    }
    itemWidthCal(items) {
        let width = 0;
        [].slice.call(selectAll('.' + CLS_ITEM, items)).forEach((el) => {
            if (isVisible(el)) {
                width += (el.offsetWidth + parseFloat(window.getComputedStyle(el).marginRight));
            }
        });
        return width;
    }
    checkOverflow(element, innerItem) {
        if (isNullOrUndefined(element) || isNullOrUndefined(innerItem) || !isVisible(element)) {
            return false;
        }
        let eleWidth = element.offsetWidth;
        let itemWidth;
        if (this.tbarAlign || this.scrollModule) {
            itemWidth = this.itemWidthCal(this.scrollModule ? innerItem.querySelector('.e-hscroll-content') : innerItem);
        }
        else {
            itemWidth = innerItem.offsetWidth;
        }
        let popNav = element.querySelector('.' + CLS_TBARNAV);
        let scrollNav = element.querySelector('.' + CLS_TBARSCRLNAV);
        if (itemWidth > eleWidth - (popNav ? popNav.offsetWidth : (scrollNav ? scrollNav.offsetWidth * 2 : 0))) {
            return true;
        }
        else {
            return false;
        }
    }
    /** @hidden */
    refreshOverflow() {
        this.resize();
    }
    renderOverflowMode() {
        let ele = this.element;
        let innerItems = ele.querySelector('.' + CLS_ITEMS);
        let priorityCheck = this.popupPriCount > 0;
        if (ele && ele.children.length > 0) {
            this.offsetWid = ele.offsetWidth;
            this.remove(this.element, 'e-toolpop');
            switch (this.overflowMode) {
                case 'Scrollable':
                    this.destroyHScroll();
                    this.initHScroll(ele, ele.getElementsByClassName(CLS_ITEMS));
                    break;
                case 'Popup':
                    this.add(this.element, 'e-toolpop');
                    if (this.tbarAlign) {
                        this.removePositioning();
                    }
                    if (this.checkOverflow(ele, innerItems) || priorityCheck) {
                        this.createPopupEle(ele, [].slice.call(selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, ele)));
                        this.element.querySelector('.' + CLS_TBARNAV).setAttribute('tabIndex', '0');
                    }
                    if (this.tbarAlign) {
                        this.add(innerItems, CLS_TBARPOS);
                        this.itemPositioning();
                    }
                    break;
            }
        }
    }
    createPopupEle(ele, innerEle) {
        let innerNav = ele.querySelector('.' + CLS_TBARNAV);
        if (!innerNav) {
            this.createPopupIcon(ele);
        }
        innerNav = ele.querySelector('.' + CLS_TBARNAV);
        let eleWidth = (ele.offsetWidth - (innerNav.offsetWidth));
        this.element.classList.remove('e-rtl');
        setStyleAttribute(this.element, { direction: 'initial' });
        this.checkPriority(ele, innerEle, eleWidth, true);
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        }
        this.element.style.removeProperty('direction');
        this.createPopup();
    }
    pushingPoppedEle(tbarObj, popupPri, ele, eleHeight) {
        let element = tbarObj.element;
        let nodes = selectAll('.' + CLS_TBAROVERFLOW, ele);
        let nodeIndex = 0;
        let poppedEle = [].slice.call(selectAll('.' + CLS_POPUP, element.querySelector('.' + CLS_ITEMS)));
        let nodePri = 0;
        poppedEle.forEach((el, index) => {
            nodes = selectAll('.' + CLS_TBAROVERFLOW, ele);
            if (el.classList.contains(CLS_TBAROVERFLOW) && nodes.length > 0) {
                if (tbarObj.tbResize && nodes.length > index) {
                    ele.insertBefore(el, nodes[index]);
                    ++nodePri;
                }
                else {
                    ele.insertBefore(el, ele.children[nodes.length]);
                    ++nodePri;
                }
            }
            else if (el.classList.contains(CLS_TBAROVERFLOW)) {
                ele.insertBefore(el, ele.firstChild);
                ++nodePri;
            }
            else if (tbarObj.tbResize && el.classList.contains(CLS_POPOVERFLOW) && ele.children.length > 0 && nodes.length === 0) {
                ele.insertBefore(el, ele.firstChild);
                ++nodePri;
            }
            else if (el.classList.contains(CLS_POPOVERFLOW)) {
                popupPri.push(el);
            }
            else if (tbarObj.tbResize) {
                ele.insertBefore(el, ele.childNodes[nodeIndex + nodePri]);
                ++nodeIndex;
            }
            else {
                ele.appendChild(el);
            }
            setStyleAttribute(el, { display: '', height: eleHeight + 'px' });
        });
        popupPri.forEach((el) => {
            ele.appendChild(el);
        });
        let tbarEle = selectAll('.' + CLS_ITEM, element.querySelector('.' + CLS_ITEMS));
        for (let i = tbarEle.length - 1; i >= 0; i--) {
            let tbarElement = tbarEle[i];
            if (tbarElement.classList.contains(CLS_SEPARATOR)) {
                setStyleAttribute(tbarElement, { display: 'none' });
            }
            else {
                break;
            }
        }
    }
    createPopup() {
        let element = this.element;
        let eleHeight;
        let eleItem;
        eleItem = element.querySelector('.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + ' ):not(.' + CLS_POPUP + ' )');
        eleHeight = (element.style.height === 'auto' || element.style.height === '') ? null : eleItem.offsetHeight;
        let ele;
        let popupPri = [];
        if (element.querySelector('#' + element.id + '_popup.' + CLS_POPUPCLASS)) {
            ele = element.querySelector('#' + element.id + '_popup.' + CLS_POPUPCLASS);
        }
        else {
            ele = createElement('div', { id: element.id + '_popup', className: CLS_POPUPCLASS });
        }
        this.pushingPoppedEle(this, popupPri, ele, eleHeight);
        this.popupInit(element, ele);
    }
    popupInit(element, ele) {
        if (!this.popObj) {
            element.appendChild(ele);
            setStyleAttribute(this.element, { overflow: '' });
            let popup = new Popup(null, {
                relateTo: this.element,
                offsetY: (element.offsetHeight),
                enableRtl: this.enableRtl,
                open: this.popupOpen.bind(this),
                close: this.popupClose,
                position: this.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }
            });
            popup.appendTo(ele);
            EventHandler.add(document, 'scroll', this.docEvent.bind(this));
            EventHandler.add(document, 'click ', this.docEvent.bind(this));
            popup.element.style.maxHeight = popup.element.offsetHeight + 'px';
            popup.hide();
            this.popObj = popup;
            this.element.setAttribute('aria-haspopup', 'true');
        }
        else {
            let popupEle = this.popObj.element;
            setStyleAttribute(popupEle, { maxHeight: '', display: 'block' });
            setStyleAttribute(popupEle, { maxHeight: popupEle.offsetHeight + 'px', display: '' });
        }
    }
    popupOpen(e) {
        let popObj = this.popObj;
        let popupEle = this.popObj.element;
        let toolEle = this.popObj.element.parentElement;
        let popupNav = toolEle.querySelector('.' + CLS_TBARNAV);
        setStyleAttribute(popObj.element, { height: 'auto', maxHeight: '' });
        popObj.element.style.maxHeight = popObj.element.offsetHeight + 'px';
        let popupElePos = popupEle.offsetTop + popupEle.offsetHeight + calculatePosition(toolEle).top;
        let popIcon = popupNav.firstElementChild;
        popupNav.classList.add(CLS_TBARNAVACT);
        classList(popIcon, [CLS_POPUPICON], [CLS_POPUPDOWN]);
        let scrollVal = isNullOrUndefined(window.scrollY) ? 0 : window.scrollY;
        if ((window.innerHeight + scrollVal) < popupElePos) {
            let overflowHeight = (popupEle.offsetHeight - ((popupElePos - window.innerHeight - scrollVal) + 5));
            popObj.height = overflowHeight + 'px';
            for (let i = 0; i <= popupEle.childElementCount; i++) {
                let ele = popupEle.children[i];
                if (ele.offsetTop + ele.offsetHeight > overflowHeight) {
                    overflowHeight = ele.offsetTop;
                    break;
                }
            }
            setStyleAttribute(popObj.element, { maxHeight: overflowHeight + 'px' });
        }
    }
    popupClose(e) {
        let element = this.element.parentElement;
        let popupNav = element.querySelector('.' + CLS_TBARNAV);
        let popIcon = popupNav.firstElementChild;
        popupNav.classList.remove(CLS_TBARNAVACT);
        classList(popIcon, [CLS_POPUPDOWN], [CLS_POPUPICON]);
    }
    checkPriority(ele, inEle, eleWidth, pre) {
        let popPriority = this.popupPriCount > 0;
        let len = inEle.length;
        let eleWid = eleWidth;
        let sepCheck = 0;
        let itemCount = 0;
        let itemPopCount = 0;
        let checkClass = (ele, val) => {
            let rVal = false;
            val.forEach((cls) => {
                if (ele.classList.contains(cls)) {
                    rVal = true;
                }
            });
            return rVal;
        };
        for (let i = len - 1; i >= 0; i--) {
            let mrgn = parseFloat((window.getComputedStyle(inEle[i])).marginRight);
            mrgn += parseFloat((window.getComputedStyle(inEle[i])).marginLeft);
            let fstEleCheck = inEle[i] === this.tbarEle[0];
            if (fstEleCheck) {
                this.tbarEleMrgn = mrgn;
            }
            let eleWid = fstEleCheck ? (inEle[i].offsetWidth + mrgn) : inEle[i].offsetWidth;
            if (checkClass(inEle[i], [CLS_POPPRI]) && popPriority) {
                inEle[i].classList.add(CLS_POPUP);
                setStyleAttribute(inEle[i], { display: 'none', minWidth: eleWid + 'px' });
                itemPopCount++;
            }
            if ((inEle[i].offsetLeft + inEle[i].offsetWidth + mrgn) > eleWidth) {
                if (inEle[i].classList.contains(CLS_SEPARATOR)) {
                    if (sepCheck > 0 && itemCount === itemPopCount) {
                        let sepEle = inEle[i + itemCount + (sepCheck - 1)];
                        if (checkClass(sepEle, [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                            setStyleAttribute(sepEle, { display: 'none' });
                        }
                    }
                    sepCheck++;
                    itemCount = 0;
                    itemPopCount = 0;
                }
                else {
                    itemCount++;
                }
                if (inEle[i].classList.contains(CLS_TBAROVERFLOW) && pre) {
                    eleWidth -= (inEle[i].offsetWidth + (mrgn));
                }
                else if (!checkClass(inEle[i], [CLS_SEPARATOR, CLS_TBARIGNORE])) {
                    inEle[i].classList.add(CLS_POPUP);
                    setStyleAttribute(inEle[i], { display: 'none', minWidth: eleWid + 'px' });
                    itemPopCount++;
                }
                else {
                    eleWidth -= (inEle[i].offsetWidth + (mrgn));
                }
            }
        }
        if (pre) {
            let popedEle = selectAll('.' + CLS_ITEM + ':not(.' + CLS_POPUP + ')', this.element);
            this.checkPriority(ele, popedEle, eleWid, false);
        }
    }
    createPopupIcon(element) {
        let id = element.id.concat('_nav');
        let className = 'e-' + element.id.concat('_nav ' + CLS_POPUPNAV);
        let nav = createElement('div', { id: id, className: className });
        if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
            nav.classList.add('e-ie-align');
        }
        let navItem = createElement('div', { className: CLS_POPUPDOWN + ' e-icons' });
        nav.appendChild(navItem);
        nav.setAttribute('tabindex', '0');
        element.appendChild(nav);
    }
    tbarPriRef(inEle, indx, sepPri, el, des, elWid, wid, ig) {
        let ignoreCount = ig;
        let popEle = this.popObj.element;
        let query = '.' + CLS_ITEM + ':not(.' + CLS_SEPARATOR + '):not(.' + CLS_TBAROVERFLOW + ')';
        let priEleCnt = selectAll('.' + CLS_POPUP + ':not(.' + CLS_TBAROVERFLOW + ')', popEle).length;
        let checkClass = (ele, val) => {
            return ele.classList.contains(val);
        };
        if (selectAll(query, inEle).length === 0) {
            let eleSep = inEle.children[indx - (indx - sepPri) - 1];
            let ignoreCheck = (!isNullOrUndefined(eleSep) && checkClass(eleSep, CLS_TBARIGNORE));
            if ((!isNullOrUndefined(eleSep) && checkClass(eleSep, CLS_SEPARATOR) && !isVisible(eleSep)) || ignoreCheck) {
                let sepDisplay = 'none';
                eleSep.style.display = 'inherit';
                let eleSepWidth = eleSep.offsetWidth + (parseFloat(window.getComputedStyle(eleSep).marginRight) * 2);
                let prevSep = eleSep.previousElementSibling;
                if ((elWid + eleSepWidth) < wid || des) {
                    inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - (indx - sepPri)]);
                    if (!isNullOrUndefined(prevSep)) {
                        prevSep.style.display = '';
                    }
                }
                else {
                    if (prevSep.classList.contains(CLS_SEPARATOR)) {
                        prevSep.style.display = sepDisplay;
                    }
                }
                eleSep.style.display = '';
            }
            else {
                inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - (indx - sepPri)]);
            }
        }
        else {
            inEle.insertBefore(el, inEle.children[(indx + ignoreCount) - priEleCnt]);
        }
    }
    popupRefresh(popupEle, destroy) {
        let ele = this.element;
        let popNav = ele.querySelector('.' + CLS_TBARNAV);
        let innerEle = ele.querySelector('.' + CLS_ITEMS);
        if (isNullOrUndefined(popNav)) {
            return;
        }
        innerEle.removeAttribute('style');
        popupEle.style.display = 'block';
        let width = ele.offsetWidth - (popNav.offsetWidth + innerEle.offsetWidth);
        this.popupEleRefresh(width, popupEle, destroy);
        popupEle.style.display = '';
        if (popupEle.children.length === 0 && popNav && this.popObj) {
            detach(popNav);
            popNav = null;
            this.popObj.destroy();
            detach(this.popObj.element);
            this.popObj = null;
            ele.setAttribute('aria-haspopup', 'false');
            ele.classList.remove('e-toolpop');
        }
    }
    ignoreEleFetch(index, innerEle) {
        let ignoreEle = [].slice.call(innerEle.querySelectorAll('.' + CLS_TBARIGNORE));
        let ignoreInx = [];
        let count = 0;
        if (ignoreEle.length > 0) {
            ignoreEle.forEach((ele) => {
                ignoreInx.push([].slice.call(innerEle.children).indexOf(ele));
            });
        }
        else {
            return 0;
        }
        ignoreInx.forEach((val) => {
            if (val <= index) {
                count++;
            }
        });
        return count;
    }
    checkPopupRefresh(root, popEle) {
        popEle.style.display = 'block';
        let elWid = this.popupEleWidth(popEle.firstElementChild);
        popEle.firstElementChild.style.removeProperty('Position');
        let tbarWidth = root.offsetWidth - root.querySelector('.' + CLS_TBARNAV).offsetWidth;
        let tbarItemsWid = root.querySelector('.' + CLS_ITEMS).offsetWidth;
        popEle.style.removeProperty('display');
        if (tbarWidth > (elWid + tbarItemsWid)) {
            return true;
        }
        return false;
    }
    popupEleWidth(el) {
        el.style.position = 'absolute';
        let elWidth = el.offsetWidth;
        let btnText = el.querySelector('.' + CLS_TBARBTNTEXT);
        if (el.classList.contains('e-tbtn-align') || el.classList.contains(CLS_TBARTEXT)) {
            let btn = el.children[0];
            if (!isNullOrUndefined(btnText) && el.classList.contains(CLS_TBARTEXT)) {
                btnText.style.display = 'none';
            }
            else if (!isNullOrUndefined(btnText) && el.classList.contains(CLS_POPUPTEXT)) {
                btnText.style.display = 'block';
            }
            btn.style.minWidth = '0%';
            elWidth = parseFloat(el.style.minWidth);
            btn.style.minWidth = '';
            if (!isNullOrUndefined(btnText)) {
                btnText.style.display = '';
            }
        }
        return elWidth;
    }
    popupEleRefresh(width, popupEle, destroy) {
        let popPriority = this.popupPriCount > 0;
        let eleSplice = this.tbarEle;
        let priEleCnt;
        let index;
        let checkOverflow;
        let innerEle = this.element.querySelector('.' + CLS_ITEMS);
        let ignoreCount = 0;
        for (let el of [].slice.call(popupEle.children)) {
            if (el.classList.contains(CLS_POPPRI) && popPriority && !destroy) {
                continue;
            }
            let elWidth = this.popupEleWidth(el);
            if (el === this.tbarEle[0]) {
                elWidth += this.tbarEleMrgn;
            }
            el.style.position = '';
            if (elWidth < width || destroy) {
                el.style.minWidth = '';
                if (!el.classList.contains(CLS_POPOVERFLOW)) {
                    el.classList.remove(CLS_POPUP);
                }
                index = this.tbarEle.indexOf(el);
                if (this.tbarAlign) {
                    let pos = this.items[index].align;
                    index = this.tbarAlgEle[(pos + 's').toLowerCase()].indexOf(el);
                    eleSplice = this.tbarAlgEle[(pos + 's').toLowerCase()];
                    innerEle = this.element.querySelector('.' + CLS_ITEMS + ' .' + 'e-toolbar-' + pos.toLowerCase());
                }
                let sepBeforePri = 0;
                eleSplice.slice(0, index).forEach((el) => {
                    if (el.classList.contains(CLS_TBAROVERFLOW) || el.classList.contains(CLS_SEPARATOR)) {
                        if (el.classList.contains(CLS_SEPARATOR)) {
                            el.style.display = '';
                            width -= el.offsetWidth;
                        }
                        sepBeforePri++;
                    }
                });
                ignoreCount = this.ignoreEleFetch(index, innerEle);
                if (el.classList.contains(CLS_TBAROVERFLOW)) {
                    this.tbarPriRef(innerEle, index, sepBeforePri, el, destroy, elWidth, width, ignoreCount);
                    width -= el.offsetWidth;
                }
                else if (index === 0) {
                    innerEle.insertBefore(el, innerEle.firstChild);
                    width -= el.offsetWidth;
                }
                else {
                    priEleCnt = selectAll('.' + CLS_TBAROVERFLOW, this.popObj.element).length;
                    innerEle.insertBefore(el, innerEle.children[(index + ignoreCount) - priEleCnt]);
                    width -= el.offsetWidth;
                }
                el.style.height = '';
            }
            else {
                break;
            }
        }
        checkOverflow = this.checkOverflow(this.element, this.element.getElementsByClassName(CLS_ITEMS)[0]);
        if (checkOverflow && !destroy) {
            this.renderOverflowMode();
        }
    }
    removePositioning() {
        let item = this.element.querySelector('.' + CLS_ITEMS);
        if (isNullOrUndefined(item) || !item.classList.contains(CLS_TBARPOS)) {
            return;
        }
        this.remove(item, CLS_TBARPOS);
        let innerItem = [].slice.call(item.childNodes);
        innerItem[1].removeAttribute('style');
        innerItem[2].removeAttribute('style');
    }
    refreshPositioning() {
        let item = this.element.querySelector('.' + CLS_ITEMS);
        this.add(item, CLS_TBARPOS);
        this.itemPositioning();
    }
    itemPositioning() {
        let item = this.element.querySelector('.' + CLS_ITEMS);
        if (isNullOrUndefined(item) || !item.classList.contains(CLS_TBARPOS)) {
            return;
        }
        let popupNav = this.element.querySelector('.' + CLS_TBARNAV);
        let innerItem;
        if (this.scrollModule) {
            innerItem = [].slice.call(item.querySelector('.' + CLS_TBARSCROLL).children);
        }
        else {
            innerItem = [].slice.call(item.childNodes);
        }
        let margin = innerItem[0].offsetWidth + innerItem[2].offsetWidth;
        let tbarWid = this.element.offsetWidth;
        if (popupNav) {
            tbarWid -= popupNav.offsetWidth;
            let popWid = popupNav.offsetWidth + 'px';
            innerItem[2].removeAttribute('style');
            this.enableRtl ? innerItem[2].style.left = popWid : innerItem[2].style.right = popWid;
        }
        if (tbarWid <= margin) {
            return;
        }
        let value = (((tbarWid - margin)) - innerItem[1].offsetWidth) / 2;
        innerItem[1].removeAttribute('style');
        let mrgn = (innerItem[0].offsetWidth + value) + 'px';
        this.enableRtl ? innerItem[1].style.marginRight = mrgn : innerItem[1].style.marginLeft = mrgn;
    }
    tbarItemAlign(item, itemEle, pos) {
        if (item.showAlwaysInPopup && item.overflow !== 'Show') {
            return;
        }
        let alignDiv = [];
        alignDiv.push(createElement('div', { className: CLS_TBARLEFT }));
        alignDiv.push(createElement('div', { className: CLS_TBARCENTER }));
        alignDiv.push(createElement('div', { className: CLS_TBARRIGHT }));
        if (pos === 0 && item.align !== 'Left') {
            alignDiv.forEach((ele) => {
                itemEle.appendChild(ele);
            });
            this.tbarAlign = true;
            this.add(itemEle, CLS_TBARPOS);
        }
        else if (item.align !== 'Left') {
            let alignEle = itemEle.childNodes;
            let leftAlign = alignDiv[0];
            [].slice.call(alignEle).forEach((el) => {
                this.tbarAlgEle.lefts.push(el);
                leftAlign.appendChild(el);
            });
            itemEle.appendChild(leftAlign);
            itemEle.appendChild(alignDiv[1]);
            itemEle.appendChild(alignDiv[2]);
            this.tbarAlign = true;
            this.add(itemEle, CLS_TBARPOS);
        }
    }
    ctrlTemplate() {
        this.ctrlTem = this.trgtEle.cloneNode(true);
        this.add(this.trgtEle, CLS_ITEMS);
        this.tbarEle = [];
        let innerEle = [].slice.call(this.trgtEle.children);
        innerEle.forEach((ele) => {
            if (ele.tagName === 'DIV') {
                this.tbarEle.push(ele);
                ele.setAttribute('aria-disabled', 'false');
                this.add(ele, CLS_ITEM);
            }
        });
    }
    renderItems() {
        let ele = this.element;
        let itemEleDom;
        let innerItem;
        let innerPos;
        let items = this.items;
        if (ele && ele.children.length > 0) {
            itemEleDom = ele.querySelector('.' + CLS_ITEMS);
        }
        if (this.trgtEle != null) {
            this.ctrlTemplate();
        }
        else if (ele && items.length > 0) {
            if (!itemEleDom) {
                itemEleDom = createElement('div', { className: CLS_ITEMS });
            }
            for (let i = 0; i < items.length; i++) {
                innerItem = this.renderSubComponent(items[i]);
                if (this.tbarEle.indexOf(innerItem) === -1) {
                    this.tbarEle.push(innerItem);
                }
                if (!this.tbarAlign) {
                    this.tbarItemAlign(items[i], itemEleDom, i);
                }
                innerPos = itemEleDom.querySelector('.e-toolbar-' + items[i].align.toLowerCase());
                if (innerPos) {
                    if (!(items[i].showAlwaysInPopup && items[i].overflow !== 'Show')) {
                        this.tbarAlgEle[(items[i].align + 's').toLowerCase()].push(innerItem);
                    }
                    innerPos.appendChild(innerItem);
                }
                else {
                    itemEleDom.appendChild(innerItem);
                }
            }
            ele.appendChild(itemEleDom);
        }
    }
    setAttr(attr, element) {
        let key = Object.keys(attr);
        let keyVal;
        for (let i = 0; i < key.length; i++) {
            keyVal = key[i];
            keyVal === 'class' ? this.add(element, attr[keyVal]) : element.setAttribute(keyVal, attr[keyVal]);
        }
    }
    /**
     * Enables or disables the specified Toolbar item.
     * @param  {HTMLElement|NodeList} items - DOM element or an array of items to be enabled or disabled.
     * @param  {boolean} isEnable  - Boolean value that determines whether the command should be enabled or disabled.
     * By default, `isEnable` is set to true.
     * @returns void.
     */
    enableItems(items, isEnable) {
        let elements = items;
        let len = elements.length;
        if (isNullOrUndefined(isEnable)) {
            isEnable = true;
        }
        let enable = (isEnable, ele) => {
            if (isEnable) {
                ele.classList.remove(CLS_DISABLE$1);
                ele.setAttribute('aria-disabled', 'false');
            }
            else {
                ele.classList.add(CLS_DISABLE$1);
                ele.setAttribute('aria-disabled', 'true');
            }
        };
        if (len && len > 1) {
            for (let ele of [].slice.call(elements)) {
                enable(isEnable, ele);
            }
            isEnable ? removeClass(elements, CLS_DISABLE$1) : addClass(elements, CLS_DISABLE$1);
        }
        else {
            let ele;
            ele = (len && len === 1) ? elements[0] : items;
            enable(isEnable, ele);
        }
    }
    /**
     * Adds new items to the Toolbar that accepts an array as Toolbar items.
     * @param  {ItemsModel[]} items - DOM element or an array of items to be added to the Toolbar.
     * @param  {number} index - Number value that determines where the command is to be added. By default, index is 0.
     * @returns void.
     */
    addItems(items, index) {
        let innerItems;
        let itemsDiv = this.element.querySelector('.' + CLS_ITEMS);
        let innerEle;
        let itemAgn = 'Left';
        if (isNullOrUndefined(index)) {
            index = 0;
        }
        items.forEach((e) => {
            if (!isNullOrUndefined(e.align) && e.align !== 'Left' && itemAgn === 'Left') {
                itemAgn = e.align;
            }
        });
        for (let item of items) {
            if (isNullOrUndefined(item.type)) {
                item.type = 'Button';
            }
            innerItems = selectAll('.' + CLS_ITEM, this.element);
            item.align = itemAgn;
            innerEle = this.renderSubComponent(item);
            if (this.tbarEle.length >= index && innerItems.length > 0) {
                this.destroyMode();
                let algIndex = item.align[0] === 'L' ? 0 : item.align[0] === 'C' ? 1 : 2;
                let ele;
                if (!this.tbarAlign && itemAgn !== 'Left') {
                    this.tbarItemAlign(item, itemsDiv, 1);
                    this.tbarAlign = true;
                    ele = closest(innerItems[0], '.' + CLS_ITEMS).children[algIndex];
                    ele.appendChild(innerEle);
                    this.tbarAlgEle[(item.align + 's').toLowerCase()].push(innerEle);
                    this.refreshPositioning();
                }
                else if (this.tbarAlign) {
                    ele = closest(innerItems[0], '.' + CLS_ITEMS).children[algIndex];
                    ele.insertBefore(innerEle, ele.children[index]);
                    this.tbarAlgEle[(item.align + 's').toLowerCase()].splice(index, 0, innerEle);
                    this.refreshPositioning();
                }
                else {
                    innerItems[0].parentNode.insertBefore(innerEle, innerItems[index]);
                }
                this.items.splice(index, 0, item);
                this.tbarEle.splice(index, 0, innerEle);
                index++;
                this.offsetWid = itemsDiv.offsetWidth;
            }
        }
        itemsDiv.style.width = '';
        this.renderOverflowMode();
    }
    /**
     * Removes the items from the Toolbar. Acceptable arguments are index of item/HTMLElement/node list.
     * @param  {number|HTMLElement|NodeList|HTMLElement[]} args
     * Index or DOM element or an Array of item which is to be removed from the Toolbar.
     * @returns void.
     */
    removeItems(args) {
        let elements = args;
        let index;
        let innerItems = [].slice.call(selectAll('.' + CLS_ITEM, this.element));
        if (typeof (elements) === 'number') {
            index = parseInt(args.toString(), 10);
            this.removeItemByIndex(index, innerItems);
        }
        else {
            if (elements && elements.length > 1) {
                for (let ele of [].slice.call(elements)) {
                    index = this.tbarEle.indexOf(ele);
                    this.removeItemByIndex(index, innerItems);
                    innerItems = selectAll('.' + CLS_ITEM, this.element);
                }
            }
            else {
                let ele = (elements && elements.length && elements.length === 1) ? elements[0] : args;
                index = innerItems.indexOf(ele);
                this.removeItemByIndex(index, innerItems);
            }
        }
        this.resize();
    }
    removeItemByIndex(index, innerItems) {
        if (this.tbarEle[index] && innerItems[index]) {
            let eleIdx = this.tbarEle.indexOf(innerItems[index]);
            if (this.tbarAlign) {
                let indexAgn;
                indexAgn = this.tbarAlgEle[(this.items[eleIdx].align + 's').toLowerCase()].indexOf(this.tbarEle[eleIdx]);
                this.tbarAlgEle[(this.items[eleIdx].align + 's').toLowerCase()].splice(indexAgn, 1);
            }
            detach(innerItems[index]);
            this.items.splice(eleIdx, 1);
            this.tbarEle.splice(eleIdx, 1);
        }
    }
    templateRender(templateProp, innerEle, item) {
        let itemType = item.type;
        let eleObj = templateProp;
        let isComponent;
        if (typeof (templateProp) === 'object') {
            isComponent = typeof (eleObj.appendTo) === 'function';
        }
        if (typeof (templateProp) === 'string' || !isComponent) {
            let templateFn;
            let val = templateProp;
            val = (typeof (templateProp) === 'string') ? templateProp.trim() : templateProp;
            try {
                if (document.querySelectorAll(val).length) {
                    let ele = document.querySelector(val);
                    let tempStr = ele.outerHTML.trim();
                    templateFn = compile(tempStr);
                    detach(ele);
                    item.template = tempStr;
                }
            }
            catch (e) {
                templateFn = compile(val);
            }
            let tempArray;
            if (!isNullOrUndefined(templateFn)) {
                tempArray = templateFn({}, this, 'template');
            }
            if (!isNullOrUndefined(tempArray) && tempArray.length > 0) {
                [].slice.call(tempArray).forEach((ele) => {
                    if (!isNullOrUndefined(ele.tagName)) {
                        ele.style.display = '';
                    }
                    innerEle.appendChild(ele);
                });
            }
        }
        else if (itemType === 'Input') {
            let ele = createElement('input');
            item.id ? (ele.id = item.id) : (ele.id = getUniqueID('tbr-ipt'));
            innerEle.appendChild(ele);
            eleObj.appendTo(ele);
        }
        this.add(innerEle, CLS_TEMPLATE);
        this.tbarEle.push(innerEle);
    }
    buttonRendering(item, innerEle) {
        let dom = createElement('button', { className: CLS_TBARBTN });
        dom.setAttribute('type', 'button');
        let textStr = item.text;
        let iconCss;
        let iconPos;
        item.id ? (dom.id = item.id) : dom.id = getUniqueID('e-tbr-btn');
        let btnTxt = createElement('div', { className: 'e-tbar-btn-text' });
        if (textStr) {
            btnTxt.innerHTML = textStr;
            dom.appendChild(btnTxt);
            dom.classList.add('e-tbtn-txt');
        }
        else {
            this.add(innerEle, 'e-tbtn-align');
        }
        if (item.prefixIcon || item.suffixIcon) {
            if ((item.prefixIcon && item.suffixIcon) || item.prefixIcon) {
                iconCss = item.prefixIcon + ' e-icons';
                iconPos = 'Left';
            }
            else {
                iconCss = item.suffixIcon + ' e-icons';
                iconPos = 'Right';
            }
        }
        new Button({ iconCss: iconCss, iconPosition: iconPos }, dom);
        if (item.width) {
            setStyleAttribute(dom, { 'width': formatUnit(item.width) });
        }
        return dom;
    }
    renderSubComponent(item) {
        let innerEle;
        let dom;
        innerEle = createElement('div', { className: CLS_ITEM });
        innerEle.setAttribute('aria-disabled', 'false');
        if (!this.tbarEle) {
            this.tbarEle = [];
        }
        if (item.htmlAttributes) {
            this.setAttr(item.htmlAttributes, innerEle);
        }
        if (item.tooltipText) {
            innerEle.setAttribute('title', item.tooltipText);
        }
        if (item.cssClass) {
            innerEle.className = innerEle.className + ' ' + item.cssClass;
        }
        if (item.template) {
            this.templateRender(item.template, innerEle, item);
        }
        else {
            switch (item.type) {
                case 'Button':
                    dom = this.buttonRendering(item, innerEle);
                    dom.setAttribute('tabindex', '-1');
                    innerEle.appendChild(dom);
                    innerEle.addEventListener('click', this.itemClick.bind(this));
                    break;
                case 'Separator':
                    this.add(innerEle, CLS_SEPARATOR);
                    break;
            }
        }
        if (item.showTextOn) {
            let sTxt = item.showTextOn;
            if (sTxt === 'Toolbar') {
                this.add(innerEle, CLS_POPUPTEXT);
                this.add(innerEle, 'e-tbtn-align');
            }
            else if (sTxt === 'Overflow') {
                this.add(innerEle, CLS_TBARTEXT);
            }
        }
        if (item.overflow) {
            let overflow = item.overflow;
            if (overflow === 'Show') {
                this.add(innerEle, CLS_TBAROVERFLOW);
            }
            else if (overflow === 'Hide') {
                if (!innerEle.classList.contains(CLS_SEPARATOR)) {
                    this.add(innerEle, CLS_POPOVERFLOW);
                }
            }
        }
        if (item.overflow !== 'Show' && item.showAlwaysInPopup && !innerEle.classList.contains(CLS_SEPARATOR)) {
            this.add(innerEle, CLS_POPPRI);
            this.popupPriCount++;
        }
        return innerEle;
    }
    itemClick(e) {
        this.activeEleSwitch(e.currentTarget);
    }
    activeEleSwitch(ele) {
        this.activeEleRemove(ele.firstElementChild);
        this.activeEle.focus();
    }
    activeEleRemove(curEle) {
        if (!isNullOrUndefined(this.activeEle)) {
            this.activeEle.setAttribute('tabindex', '-1');
        }
        this.activeEle = curEle;
        if (isNullOrUndefined(this.trgtEle) && !curEle.parentElement.classList.contains(CLS_TEMPLATE)) {
            curEle.removeAttribute('tabindex');
        }
        else {
            this.activeEle.setAttribute('tabindex', '0');
        }
    }
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'toolbar';
    }
    itemsRerender(newProp) {
        this.items = this.tbarItemsCol;
        this.destroyMode();
        this.destroyItems();
        this.items = newProp;
        this.tbarItemsCol = this.items;
        this.renderItems();
        this.renderOverflowMode();
    }
    resize() {
        let ele = this.element;
        this.tbResize = true;
        if (this.tbarAlign) {
            this.itemPositioning();
        }
        if (this.popObj) {
            this.popObj.hide();
        }
        let checkOverflow = this.checkOverflow(ele, ele.getElementsByClassName(CLS_ITEMS)[0]);
        if (!checkOverflow) {
            this.destroyHScroll();
        }
        if (checkOverflow && this.scrollModule && (this.offsetWid === ele.offsetWidth)) {
            return;
        }
        if (this.offsetWid > ele.offsetWidth || checkOverflow) {
            this.renderOverflowMode();
        }
        if (this.popObj) {
            if (this.tbarAlign) {
                this.removePositioning();
            }
            this.popupRefresh(this.popObj.element, false);
            if (this.tbarAlign) {
                this.refreshPositioning();
            }
        }
        this.offsetWid = ele.offsetWidth;
        this.tbResize = false;
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     * @param  {ToolbarModel} newProp
     * @param  {ToolbarModel} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let tEle = this.element;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'items':
                    if (!(newProp.items instanceof Array && oldProp.items instanceof Array)) {
                        let changedProb = Object.keys(newProp.items);
                        for (let i = 0; i < changedProb.length; i++) {
                            let index = parseInt(Object.keys(newProp.items)[i], 10);
                            let property = Object.keys(newProp.items[index])[0];
                            let oldProperty = Object(oldProp.items[index])[property];
                            let newProperty = Object(newProp.items[index])[property];
                            if (this.tbarAlign || property === 'align') {
                                this.refresh();
                                break;
                            }
                            let popupPriCheck = property === 'showAlwaysInPopup' && !newProperty;
                            if ((popupPriCheck) || (this.items[index].showAlwaysInPopup) && property === 'overflow' && this.popupPriCount !== 0) {
                                --this.popupPriCount;
                            }
                            this.destroyMode();
                            let itemCol = [].slice.call(selectAll('.' + CLS_ITEMS + ' .' + CLS_ITEM, tEle));
                            detach(itemCol[index]);
                            this.tbarEle.splice(index, 1);
                            this.addItems([this.items[index]], index);
                            this.items.splice(index, 1);
                            if (this.items[index].template) {
                                this.tbarEle.splice(this.items.length, 1);
                            }
                        }
                    }
                    else {
                        this.itemsRerender(newProp.items);
                    }
                    break;
                case 'width':
                    let wid = tEle.offsetWidth;
                    setStyleAttribute(tEle, { 'width': formatUnit(newProp.width) });
                    this.renderOverflowMode();
                    if (this.popObj && wid < tEle.offsetWidth) {
                        this.popupRefresh(this.popObj.element, false);
                    }
                    break;
                case 'height':
                    setStyleAttribute(this.element, { 'height': formatUnit(newProp.height) });
                    break;
                case 'overflowMode':
                    this.destroyMode();
                    this.renderOverflowMode();
                    if (this.enableRtl) {
                        this.add(tEle, CLS_RTL$1);
                    }
                    this.refreshOverflow();
                    break;
                case 'enableRtl':
                    newProp.enableRtl ? this.add(tEle, CLS_RTL$1) : this.remove(tEle, CLS_RTL$1);
                    if (!isNullOrUndefined(this.scrollModule)) {
                        newProp.enableRtl ? this.add(this.scrollModule.element, CLS_RTL$1) : this.remove(this.scrollModule.element, CLS_RTL$1);
                    }
                    if (!isNullOrUndefined(this.popObj)) {
                        newProp.enableRtl ? this.add(this.popObj.element, CLS_RTL$1) : this.remove(this.popObj.element, CLS_RTL$1);
                    }
                    if (this.tbarAlign) {
                        this.itemPositioning();
                    }
                    break;
            }
        }
    }
    /**
     * Shows or hides the Toolbar item that is in the specified index.
     * @param  {number} index - Index value of target item.
     * @param  {boolean} value - Based on this Boolean value, item will be hide (true) or show (false). By default, value is false.
     * @returns void.
     */
    hideItem(index, value) {
        if (this.tbarEle[index]) {
            let innerItems = [].slice.call(selectAll('.' + CLS_ITEM, this.element));
            if (value === true) {
                innerItems[index].classList.add(CLS_HIDDEN);
            }
            else {
                innerItems[index].classList.remove(CLS_HIDDEN);
            }
            this.refreshOverflow();
        }
    }
};
__decorate$1([
    Collection([], Item)
], Toolbar.prototype, "items", void 0);
__decorate$1([
    Property('auto')
], Toolbar.prototype, "width", void 0);
__decorate$1([
    Property('auto')
], Toolbar.prototype, "height", void 0);
__decorate$1([
    Property('Scrollable')
], Toolbar.prototype, "overflowMode", void 0);
__decorate$1([
    Property(false)
], Toolbar.prototype, "enableRtl", void 0);
__decorate$1([
    Event()
], Toolbar.prototype, "clicked", void 0);
__decorate$1([
    Event()
], Toolbar.prototype, "created", void 0);
__decorate$1([
    Event()
], Toolbar.prototype, "destroyed", void 0);
__decorate$1([
    Event()
], Toolbar.prototype, "beforeCreate", void 0);
Toolbar = __decorate$1([
    NotifyPropertyChanges
], Toolbar);

/**
 * Toolbar modules
 */

var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CLS_ACRDN_ROOT = 'e-acrdn-root';
const CLS_ROOT$1 = 'e-accordion';
const CLS_ITEM$1 = 'e-acrdn-item';
const CLS_ITEMFOCUS = 'e-item-focus';
const CLS_ITEMHIDE = 'e-hide';
const CLS_HEADER = 'e-acrdn-header';
const CLS_HEADERICN = 'e-acrdn-header-icon';
const CLS_HEADERCTN = 'e-acrdn-header-content';
const CLS_CONTENT = 'e-acrdn-panel';
const CLS_CTENT = 'e-acrdn-content';
const CLS_TOOGLEICN = 'e-toggle-icon';
const CLS_COLLAPSEICN = 'e-tgl-collapse-icon e-icons';
const CLS_EXPANDICN = 'e-expand-icon';
const CLS_RTL$2 = 'e-rtl';
const CLS_CTNHIDE = 'e-content-hide';
const CLS_SLCT = 'e-select';
const CLS_SLCTED = 'e-selected';
const CLS_ACTIVE = 'e-active';
const CLS_ANIMATE = 'e-animate';
const CLS_DISABLE$2 = 'e-overlay';
const CLS_TOGANIMATE = 'e-toggle-animation';
const CLS_NEST = 'e-nested';
const CLS_EXPANDSTATE = 'e-expand-state';
class AccordionActionSettings extends ChildProperty {
}
__decorate$2([
    Property('SlideDown')
], AccordionActionSettings.prototype, "effect", void 0);
__decorate$2([
    Property(400)
], AccordionActionSettings.prototype, "duration", void 0);
__decorate$2([
    Property('linear')
], AccordionActionSettings.prototype, "easing", void 0);
class AccordionAnimationSettings extends ChildProperty {
}
__decorate$2([
    Complex({ effect: 'SlideUp', duration: 400, easing: 'linear' }, AccordionActionSettings)
], AccordionAnimationSettings.prototype, "collapse", void 0);
__decorate$2([
    Complex({ effect: 'SlideDown', duration: 400, easing: 'linear' }, AccordionActionSettings)
], AccordionAnimationSettings.prototype, "expand", void 0);
/**
 * An item object that is used to configure Accordion items.
 */
class AccordionItem extends ChildProperty {
}
__decorate$2([
    Property(undefined)
], AccordionItem.prototype, "content", void 0);
__decorate$2([
    Property(undefined)
], AccordionItem.prototype, "header", void 0);
__decorate$2([
    Property(undefined)
], AccordionItem.prototype, "cssClass", void 0);
__decorate$2([
    Property(undefined)
], AccordionItem.prototype, "iconCss", void 0);
__decorate$2([
    Property(false)
], AccordionItem.prototype, "expanded", void 0);
/**
 * The Accordion is a vertically collapsible content panel that displays one or more panels at a time within the available space.
 * ```html
 * <div id='accordion'/>
 * <script>
 *   var accordionObj = new Accordion();
 *   accordionObj.appendTo('#accordion');
 * </script>
 * ```
 */
let Accordion = class Accordion extends Component {
    /**
     * Initializes a new instance of the Accordion class.
     * @param options  - Specifies Accordion model properties as options.
     * @param element  - Specifies the element that is rendered as an Accordion.
     */
    constructor(options, element) {
        super(options, element);
        /**
         * Contains the keyboard configuration of the Accordion.
         */
        this.keyConfigs = {
            moveUp: 'uparrow',
            moveDown: 'downarrow',
            enter: 'enter',
            space: 'space',
            home: 'home',
            end: 'end',
        };
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    destroy() {
        let ele = this.element;
        super.destroy();
        this.unwireEvents();
        this.isDestroy = true;
        this.templateEle.forEach((eleStr) => {
            document.body.appendChild(this.element.querySelector(eleStr)).style.display = 'none';
        });
        while (ele.firstChild) {
            ele.removeChild(ele.firstChild);
        }
        if (this.trgtEle) {
            while (this.ctrlTem.firstChild) {
                ele.appendChild(this.ctrlTem.firstChild);
            }
        }
        ele.removeAttribute('style');
        ['aria-disabled', 'aria-multiselectable', 'role'].forEach((attrb) => {
            this.element.removeAttribute(attrb);
        });
    }
    preRender() {
        let nested = closest(this.element, '.' + CLS_CONTENT);
        this.isNested = false;
        this.templateEle = [];
        if (!this.isDestroy) {
            this.isDestroy = false;
        }
        if (!isNullOrUndefined(nested)) {
            nested.classList.add(CLS_NEST);
            this.isNested = true;
        }
        else {
            this.element.classList.add(CLS_ACRDN_ROOT);
        }
        if (this.enableRtl) {
            this.add(this.element, CLS_RTL$2);
        }
        if (!this.enablePersistence || isNullOrUndefined(this.expandedItems)) {
            this.expandedItems = [];
        }
    }
    add(ele, val) {
        ele.classList.add(val);
    }
    remove(ele, val) {
        ele.classList.remove(val);
    }
    /**
     * To initialize the control rendering
     * @private
     */
    render() {
        this.initialize();
        this.renderControl();
        this.wireEvents();
    }
    initialize() {
        let width = formatUnit(this.width);
        let height = formatUnit(this.height);
        setStyleAttribute(this.element, { 'width': width, 'height': height });
        let ariaAttr = {
            'aria-disabled': 'false', 'role': 'presentation', 'aria-multiselectable': 'true'
        };
        if (this.expandedItems.length > 0) {
            this.initExpand = this.expandedItems;
        }
        attributes(this.element, ariaAttr);
        if (this.expandMode === 'Single') {
            this.element.setAttribute('aria-multiselectable', 'false');
        }
    }
    renderControl() {
        this.trgtEle = (this.element.children.length > 0) ? select('div', this.element) : null;
        this.renderItems();
        this.initItemExpand();
    }
    unwireEvents() {
        EventHandler.remove(this.element, 'click', this.clickHandler);
        if (!isNullOrUndefined(this.keyModule)) {
            this.keyModule.destroy();
        }
    }
    wireEvents() {
        EventHandler.add(this.element, 'click', this.clickHandler, this);
        if (!this.isNested && !this.isDestroy) {
            rippleEffect(this.element, { selector: '.' + CLS_HEADER });
        }
        if (!this.isNested) {
            this.keyModule = new KeyboardEvents(this.element, {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        }
    }
    focusIn(e) {
        e.target.parentElement.classList.add(CLS_ITEMFOCUS);
    }
    focusOut(e) {
        e.target.parentElement.classList.remove(CLS_ITEMFOCUS);
    }
    ctrlTemplate() {
        this.ctrlTem = this.element.cloneNode(true);
        let innerEles = this.element.children;
        let content;
        addClass(innerEles, [CLS_ITEM$1]);
        [].slice.call(innerEles).forEach((el) => {
            el.id = getUniqueID('acrdn_item');
            if (el.children.length > 0) {
                this.add(el.children[0], CLS_HEADER);
                let header = el.children[0];
                attributes(header, { 'tabindex': '0', 'role': 'heading', 'aria-level': innerEles.length.toString() });
                header.id = getUniqueID('acrdn_header');
                EventHandler.add(header, 'focus', this.focusIn, this);
                EventHandler.add(header, 'blur', this.focusOut, this);
                let headerEle = header.firstElementChild;
                if (headerEle) {
                    headerEle.classList.add(CLS_HEADERCTN);
                }
                content = el.children[1];
                if (content) {
                    content.id = getUniqueID('acrdn_panel');
                    header.setAttribute('aria-controls', content.id);
                    content.style.display = '';
                    el.classList.add(CLS_SLCT);
                    el.children[0].appendChild(this.toggleIconGenerate());
                    classList(content, [CLS_CONTENT, CLS_CTNHIDE], []);
                    attributes(content, { 'aria-labelledby': header.id, 'aria-hidden': 'true' });
                    content = content.firstElementChild;
                    if (content) {
                        content.classList.add(CLS_CTENT);
                        content.style.display = '';
                    }
                }
            }
        });
    }
    toggleIconGenerate() {
        let tglIcon = createElement('div', { className: CLS_TOOGLEICN });
        let hdrColIcon = createElement('span', { className: CLS_COLLAPSEICN });
        tglIcon.appendChild(hdrColIcon);
        return tglIcon;
    }
    initItemExpand() {
        let len = this.initExpand.length;
        if (len === 0) {
            return;
        }
        if (this.expandMode === 'Single') {
            this.expandItem(true, this.initExpand[len - 1]);
        }
        else {
            for (let i = 0; i < len; i++) {
                this.expandItem(true, this.initExpand[i]);
            }
        }
    }
    renderItems() {
        let ele = this.element;
        let innerItem;
        if (isNullOrUndefined(this.initExpand)) {
            this.initExpand = [];
        }
        let items = this.items;
        if (!isNullOrUndefined(this.trgtEle)) {
            this.ctrlTemplate();
        }
        else if (ele && items.length > 0) {
            items.forEach((item, index) => {
                innerItem = this.renderInnerItem(item, index);
                ele.appendChild(innerItem);
                if (innerItem.childElementCount > 0) {
                    EventHandler.add(innerItem.querySelector('.' + CLS_HEADER), 'focus', this.focusIn, this);
                    EventHandler.add(innerItem.querySelector('.' + CLS_HEADER), 'blur', this.focusOut, this);
                }
            });
        }
    }
    clickHandler(e) {
        let trgt = e.target;
        let eventArgs = {};
        let index;
        let tglIcon;
        let acrdEle = closest(trgt, '.' + CLS_ROOT$1);
        if (acrdEle !== this.element) {
            return;
        }
        trgt.classList.add('e-target');
        let acrdnItem = closest(trgt, '.' + CLS_ITEM$1);
        let acrdnHdr = closest(trgt, '.' + CLS_HEADER);
        let acrdnCtn = closest(trgt, '.' + CLS_CONTENT);
        if (acrdnItem && (isNullOrUndefined(acrdnHdr) || isNullOrUndefined(acrdnCtn))) {
            acrdnHdr = acrdnItem.children[0];
            acrdnCtn = acrdnItem.children[1];
        }
        if (acrdnHdr) {
            tglIcon = select('.' + CLS_TOOGLEICN, acrdnHdr);
        }
        let acrdnCtnItem;
        if (acrdnCtn) {
            acrdnCtnItem = closest(acrdnCtn, '.' + CLS_ITEM$1);
        }
        let acrdActive = [];
        index = this.getIndexByItem(acrdnItem);
        if (acrdnCtnItem) {
            eventArgs.item = this.items[this.getIndexByItem(acrdnCtnItem)];
        }
        eventArgs.originalEvent = e;
        let ctnCheck = !isNullOrUndefined(tglIcon) && isNullOrUndefined(this.trgtEle) && acrdnItem.childElementCount <= 1;
        if (ctnCheck && (isNullOrUndefined(acrdnCtn) || !isNullOrUndefined(select('.' + CLS_HEADER + ' .' + CLS_TOOGLEICN, acrdnCtnItem)))) {
            acrdnItem.appendChild(this.contentRendering(index));
            this.ariaAttrUpdate(acrdnItem);
        }
        this.trigger('clicked', eventArgs);
        let cntclkCheck = (acrdnCtn && !isNullOrUndefined(select('.e-target', acrdnCtn)));
        cntclkCheck = cntclkCheck && (isNullOrUndefined(select('.' + CLS_ROOT$1, acrdnCtn)) || !(closest(trgt, '.' + CLS_ROOT$1) === this.element));
        trgt.classList.remove('e-target');
        if (trgt.classList.contains(CLS_CONTENT) || trgt.classList.contains(CLS_CTENT) || cntclkCheck) {
            return;
        }
        [].slice.call(this.element.children).forEach((el) => {
            if (el.classList.contains(CLS_ACTIVE)) {
                acrdActive.push(el);
            }
        });
        let acrdAniEle = [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM$1 + ' [' + CLS_ANIMATE + ']'));
        if (acrdAniEle.length > 0) {
            for (let el of acrdAniEle) {
                acrdActive.push(el.parentElement);
            }
        }
        let sameContentCheck = acrdActive.indexOf(acrdnCtnItem) !== -1 && acrdnCtn.getAttribute('e-animate') === 'true';
        let sameHeader = false;
        if (!isNullOrUndefined(acrdnItem) && !isNullOrUndefined(acrdnHdr)) {
            let acrdnCtn = select('.' + CLS_CONTENT, acrdnItem);
            let acrdnRoot = closest(acrdnItem, '.' + CLS_ACRDN_ROOT);
            let expandState = acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
            if (isNullOrUndefined(acrdnCtn)) {
                return;
            }
            sameHeader = (expandState === acrdnItem);
            if (isVisible(acrdnCtn) && (!sameContentCheck || acrdnCtnItem.classList.contains(CLS_SLCTED))) {
                this.collapse(acrdnCtn);
            }
            else {
                if ((acrdActive.length > 0) && this.expandMode === 'Single' && !sameContentCheck) {
                    acrdActive.forEach((el) => {
                        this.collapse(select('.' + CLS_CONTENT, el));
                        el.classList.remove(CLS_EXPANDSTATE);
                    });
                }
                this.expand(acrdnCtn);
            }
            if (!isNullOrUndefined(expandState) && !sameHeader) {
                expandState.classList.remove(CLS_EXPANDSTATE);
            }
        }
    }
    eleMoveFocus(action, root, trgt) {
        let clst;
        let clstItem = closest(trgt, '.' + CLS_ITEM$1);
        if (trgt === root) {
            clst = ((action === 'moveUp' ? trgt.lastElementChild : trgt).querySelector('.' + CLS_HEADER));
        }
        else if (trgt.classList.contains(CLS_HEADER)) {
            clstItem = (action === 'moveUp' ? clstItem.previousElementSibling : clstItem.nextElementSibling);
            if (clstItem) {
                clst = select('.' + CLS_HEADER, clstItem);
            }
        }
        if (clst) {
            clst.focus();
        }
    }
    keyActionHandler(e) {
        let trgt = e.target;
        if (trgt.tagName === 'INPUT' || trgt.tagName === 'TEXTAREA') {
            return;
        }
        e.preventDefault();
        let clst;
        let root = this.element;
        let content;
        switch (e.action) {
            case 'moveUp':
                this.eleMoveFocus(e.action, root, trgt);
                break;
            case 'moveDown':
                this.eleMoveFocus(e.action, root, trgt);
                break;
            case 'space':
            case 'enter':
                content = trgt.nextElementSibling;
                if (!isNullOrUndefined(content) && content.classList.contains(CLS_CONTENT)) {
                    if (content.getAttribute('e-animate') !== 'true') {
                        trgt.click();
                    }
                }
                else {
                    trgt.click();
                }
                break;
            case 'home':
            case 'end':
                clst = e.action === 'home' ? root.firstElementChild.children[0] : root.lastElementChild.children[0];
                clst.focus();
                break;
        }
    }
    headerEleGenerate() {
        let header = createElement('div', { className: CLS_HEADER, id: getUniqueID('acrdn_header') });
        let ariaAttr = {
            'tabindex': '0', 'role': 'heading', 'aria-expanded': 'false', 'aria-selected': 'false',
            'aria-disabled': 'false', 'aria-level': this.items.length.toString()
        };
        attributes(header, ariaAttr);
        return header;
    }
    renderInnerItem(item, index) {
        let innerEle;
        innerEle = createElement('div', { className: CLS_ITEM$1 });
        innerEle.id = getUniqueID('acrdn_item');
        if (item.header) {
            let ctnEle = this.headerEleGenerate();
            let hdrEle = createElement('div', { className: CLS_HEADERCTN });
            ctnEle.appendChild(hdrEle);
            ctnEle.appendChild(this.fetchElement(hdrEle, item.header, index, true));
            innerEle.appendChild(ctnEle);
        }
        let hdr = select('.' + CLS_HEADER, innerEle);
        if (item.expanded && !isNullOrUndefined(index) && (!this.enablePersistence)) {
            if (this.initExpand.indexOf(index) === -1) {
                this.initExpand.push(index);
            }
        }
        if (item.cssClass) {
            innerEle.classList.add(item.cssClass);
        }
        if (item.iconCss) {
            let hdrIcnEle = createElement('div', { className: CLS_HEADERICN });
            let icon = createElement('span', { className: item.iconCss + ' e-icons' });
            hdrIcnEle.appendChild(icon);
            if (isNullOrUndefined(hdr)) {
                hdr = this.headerEleGenerate();
                hdr.appendChild(hdrIcnEle);
                innerEle.appendChild(hdr);
            }
            else {
                hdr.insertBefore(hdrIcnEle, hdr.childNodes[0]);
            }
        }
        if (item.content) {
            let hdrIcon = this.toggleIconGenerate();
            if (isNullOrUndefined(hdr)) {
                hdr = this.headerEleGenerate();
                innerEle.appendChild(hdr);
            }
            hdr.appendChild(hdrIcon);
            this.add(innerEle, CLS_SLCT);
        }
        return innerEle;
    }
    fetchElement(ele, value, index, isHeader) {
        let templateFn;
        let temString;
        try {
            if (document.querySelectorAll(value).length) {
                let eleVal = document.querySelector(value);
                temString = eleVal.outerHTML.trim();
                ele.appendChild(eleVal);
                eleVal.style.display = '';
            }
        }
        catch (e) {
            templateFn = compile(value);
        }
        if (!isNullOrUndefined(templateFn) && templateFn().length > 0 && !(isNullOrUndefined(templateFn()[0].tagName) && templateFn().length === 1)) {
            [].slice.call(templateFn()).forEach((el) => {
                if (!isNullOrUndefined(el.tagName)) {
                    el.style.display = '';
                }
                ele.appendChild(el);
            });
        }
        else if (ele.childElementCount === 0) {
            ele.innerHTML = value;
        }
        if (!isNullOrUndefined(temString)) {
            this.templateEle.push(value);
        }
        return ele;
    }
    ariaAttrUpdate(itemEle) {
        let header = select('.' + CLS_HEADER, itemEle);
        let content = select('.' + CLS_CONTENT, itemEle);
        header.setAttribute('aria-controls', content.id);
        content.setAttribute('aria-labelledby', header.id);
    }
    contentRendering(index) {
        let content = this.items[index].content;
        let itemcnt = createElement('div', { className: CLS_CONTENT + ' ' + CLS_CTNHIDE, id: getUniqueID('acrdn_panel') });
        attributes(itemcnt, { 'aria-hidden': 'true' });
        let ctn = createElement('div', { className: CLS_CTENT });
        itemcnt.appendChild(this.fetchElement(ctn, content, index, false));
        return itemcnt;
    }
    expand(trgt) {
        let eventArgs;
        let trgtItemEle = closest(trgt, '.' + CLS_ITEM$1);
        if (isNullOrUndefined(trgt) || (isVisible(trgt) && trgt.getAttribute('e-animate') !== 'true') || trgtItemEle.classList.contains(CLS_DISABLE$2)) {
            return;
        }
        let acrdnRoot = closest(trgtItemEle, '.' + CLS_ACRDN_ROOT);
        let expandState = acrdnRoot.querySelector('.' + CLS_EXPANDSTATE);
        let animation = {
            name: this.animation.expand.effect,
            duration: this.animation.expand.duration,
            timingFunction: this.animation.expand.easing
        };
        let icon = select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
        eventArgs = { element: trgtItemEle,
            item: this.items[this.getIndexByItem(trgtItemEle)],
            isExpanded: true };
        let eff = animation.name;
        this.trigger('expanding', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        icon.classList.add(CLS_TOGANIMATE);
        this.expandedItemsPush(trgtItemEle);
        if (!isNullOrUndefined(expandState)) {
            expandState.classList.remove(CLS_EXPANDSTATE);
        }
        trgtItemEle.classList.add(CLS_EXPANDSTATE);
        if ((animation.name === 'None')) {
            this.expandProgress('begin', icon, trgt, trgtItemEle, eventArgs);
            this.expandProgress('end', icon, trgt, trgtItemEle, eventArgs);
            return;
        }
        this.expandAnimation(eff, icon, trgt, trgtItemEle, animation, eventArgs);
    }
    expandAnimation(ef, icn, trgt, trgtItemEle, animate, args) {
        let height;
        let trgtHgt;
        if (ef === 'SlideDown') {
            animate.begin = () => {
                this.expandProgress('begin', icn, trgt, trgtItemEle, args);
                trgt.style.position = 'absolute';
                height = trgtItemEle.offsetHeight;
                trgtHgt = trgt.offsetHeight;
                trgt.style.maxHeight = (trgt.offsetHeight) + 'px';
                trgtItemEle.style.maxHeight = '';
            };
            animate.progress = () => {
                trgtItemEle.style.minHeight = (height + trgt.offsetHeight) + 'px';
            };
            animate.end = () => {
                setStyleAttribute(trgt, { 'position': '', 'maxHeight': '' });
                trgtItemEle.style.minHeight = '';
                this.expandProgress('end', icn, trgt, trgtItemEle, args);
            };
        }
        else {
            animate.begin = () => {
                this.expandProgress('begin', icn, trgt, trgtItemEle, args);
            };
            animate.end = () => {
                this.expandProgress('end', icn, trgt, trgtItemEle, args);
            };
        }
        new Animation(animate).animate(trgt);
    }
    expandProgress(progress, icon, trgt, trgtItemEle, eventArgs) {
        this.remove(trgt, CLS_CTNHIDE);
        this.add(trgtItemEle, CLS_SLCTED);
        this.add(icon, CLS_EXPANDICN);
        if (progress === 'end') {
            this.add(trgtItemEle, CLS_ACTIVE);
            trgt.setAttribute('aria-hidden', 'false');
            attributes(trgt.previousElementSibling, { 'aria-selected': 'true', 'aria-expanded': 'true' });
            icon.classList.remove(CLS_TOGANIMATE);
            this.trigger('expanded', eventArgs);
        }
    }
    expandedItemsPush(item) {
        let index = this.getIndexByItem(item);
        if (this.expandedItems.indexOf(index) === -1) {
            this.expandedItems.push(index);
        }
    }
    getIndexByItem(item) {
        return [].slice.call(this.element.children).indexOf(item);
    }
    expandedItemsPop(item) {
        let index = this.getIndexByItem(item);
        this.expandedItems.splice(this.expandedItems.indexOf(index), 1);
    }
    collapse(trgt) {
        let eventArgs;
        let trgtItemEle = closest(trgt, '.' + CLS_ITEM$1);
        if (isNullOrUndefined(trgt) || !isVisible(trgt) || trgtItemEle.classList.contains(CLS_DISABLE$2)) {
            return;
        }
        let animation = {
            name: this.animation.collapse.effect,
            duration: this.animation.collapse.duration,
            timingFunction: this.animation.collapse.easing,
        };
        let icon = select('.' + CLS_TOOGLEICN, trgtItemEle).firstElementChild;
        eventArgs = { element: trgtItemEle,
            item: this.items[this.getIndexByItem(trgtItemEle)],
            isExpanded: false };
        let eff = animation.name;
        this.trigger('expanding', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.expandedItemsPop(trgtItemEle);
        trgtItemEle.classList.add(CLS_EXPANDSTATE);
        icon.classList.add(CLS_TOGANIMATE);
        if ((animation.name === 'None')) {
            this.collapseProgress('begin', icon, trgt, trgtItemEle, eventArgs);
            this.collapseProgress('end', icon, trgt, trgtItemEle, eventArgs);
            return;
        }
        this.collapseAnimation(eff, trgt, trgtItemEle, icon, animation, eventArgs);
    }
    collapseAnimation(ef, trgt, trgtItEl, icn, animate, args) {
        let height;
        let trgtHeight;
        let itemHeight;
        let remain;
        if (ef === 'SlideUp') {
            animate.begin = () => {
                itemHeight = trgtItEl.offsetHeight;
                trgtItEl.style.minHeight = itemHeight + 'px';
                trgt.style.position = 'absolute';
                height = trgtItEl.offsetHeight;
                trgtHeight = trgt.offsetHeight;
                trgt.style.maxHeight = trgtHeight + 'px';
                this.collapseProgress('begin', icn, trgt, trgtItEl, args);
            };
            animate.progress = () => {
                remain = ((height - (trgtHeight - trgt.offsetHeight)));
                if (remain < itemHeight) {
                    trgtItEl.style.minHeight = remain + 'px';
                }
            };
            animate.end = () => {
                trgt.style.display = 'none';
                this.collapseProgress('end', icn, trgt, trgtItEl, args);
                trgtItEl.style.minHeight = '';
                setStyleAttribute(trgt, { 'position': '', 'maxHeight': '', 'display': '' });
            };
        }
        else {
            animate.begin = () => {
                this.collapseProgress('begin', icn, trgt, trgtItEl, args);
            };
            animate.end = () => {
                this.collapseProgress('end', icn, trgt, trgtItEl, args);
            };
        }
        new Animation(animate).animate(trgt);
    }
    collapseProgress(progress, icon, trgt, trgtItemEle, eventArgs) {
        this.remove(icon, CLS_EXPANDICN);
        this.remove(trgtItemEle, CLS_SLCTED);
        if (progress === 'end') {
            this.add(trgt, CLS_CTNHIDE);
            icon.classList.remove(CLS_TOGANIMATE);
            this.remove(trgtItemEle, CLS_ACTIVE);
            trgt.setAttribute('aria-hidden', 'true');
            attributes(trgt.previousElementSibling, { 'aria-selected': 'false', 'aria-expanded': 'false' });
            this.trigger('expanded', eventArgs);
        }
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'accordion';
    }
    itemAttribUpdate() {
        let itemEle = [].slice.call(this.element.children);
        let itemLen = this.items.length;
        itemEle.forEach((ele) => {
            select('.' + CLS_HEADER, ele).setAttribute('aria-level', '' + itemLen);
        });
    }
    /**
     * Adds new item to the Accordion with the specified index of the Accordion.
     * @param  {AccordionItemModel} item - Item array that is to be added to the Accordion.
     * @param  {number} index - Number value that determines where the item should be added.
     * By default, item is added at the last index if the index is not specified.
     * @returns void
     */
    addItem(item, index) {
        let ele = this.element;
        if (isNullOrUndefined(index)) {
            index = this.items.length;
        }
        if (ele.childElementCount >= index) {
            this.items.splice(index, 0, item);
            let innerItemEle = this.renderInnerItem(item, index);
            if (ele.childElementCount === index) {
                ele.appendChild(innerItemEle);
            }
            else {
                ele.insertBefore(innerItemEle, ele.children[index]);
            }
            EventHandler.add(innerItemEle.querySelector('.' + CLS_HEADER), 'focus', this.focusIn, this);
            EventHandler.add(innerItemEle.querySelector('.' + CLS_HEADER), 'blur', this.focusOut, this);
            this.itemAttribUpdate();
        }
        this.expandedItems = [];
        this.expandedItemRefresh(ele);
        if (item.expanded) {
            this.expandItem(true, index);
        }
    }
    expandedItemRefresh(ele) {
        [].slice.call(ele.children).forEach((el) => {
            if (el.classList.contains(CLS_SLCTED)) {
                this.expandedItemsPush(el);
            }
        });
    }
    /**
     * Dynamically removes item from Accordion.
     * @param  {number} index - Number value that determines which item should be removed.
     * @returns void.
     */
    removeItem(index) {
        let ele = this.element.children[index];
        if (isNullOrUndefined(ele)) {
            return;
        }
        detach(ele);
        this.items.splice(index, 1);
        this.itemAttribUpdate();
        this.expandedItems = [];
        this.expandedItemRefresh(this.element);
    }
    /**
     * Sets focus to the specified index item header in Accordion.
     * @param  {number} index - Number value that determines which item should be focused.
     * @returns void.
     */
    select(index) {
        let ele = this.element.children[index];
        if (isNullOrUndefined(ele) || isNullOrUndefined(select('.' + CLS_HEADER, ele))) {
            return;
        }
        ele.children[0].focus();
    }
    /**
     * Shows or hides the specified item from Accordion.
     * @param  {number} index - Number value that determines which item should be hidden/shown.
     * @param  {Boolean} isHidden - Boolean value that determines the action either hide (true) or show (false). Default value is false.
     *  If the `isHidden` value is false, the item is shown or else item it is hidden.
     * @returns void.
     */
    hideItem(index, isHidden) {
        let ele = this.element.children[index];
        if (isNullOrUndefined(ele)) {
            return;
        }
        if (isNullOrUndefined(isHidden)) {
            isHidden = true;
        }
        isHidden ? this.add(ele, CLS_ITEMHIDE) : this.remove(ele, CLS_ITEMHIDE);
    }
    /**
     * Enables/Disables the specified Accordion item.
     * @param  {number} index - Number value that determines which item should be enabled/disabled.
     * @param  {boolean} isEnable - Boolean value that determines the action as enable (true) or disable (false).
     * If the `isEnable` value is true, the item is enabled or else it is disabled.
     * @returns void.
     */
    enableItem(index, isEnable) {
        let ele = this.element.children[index];
        if (isNullOrUndefined(ele)) {
            return;
        }
        let eleHeader = ele.firstElementChild;
        if (isEnable) {
            this.remove(ele, CLS_DISABLE$2);
            attributes(eleHeader, { 'tabindex': '0', 'aria-disabled': 'false' });
            eleHeader.focus();
        }
        else {
            if (ele.classList.contains(CLS_ACTIVE)) {
                this.expandItem(false, index);
                this.eleMoveFocus('movedown', this.element, eleHeader);
            }
            this.add(ele, CLS_DISABLE$2);
            eleHeader.setAttribute('aria-disabled', 'true');
            eleHeader.removeAttribute('tabindex');
        }
    }
    /**
     * Expands/Collapses the specified Accordion item.
     * @param  {boolean} isExpand - Boolean value that determines the action as expand or collapse.
     * @param  {number} index - Number value that determines which item should be expanded/collapsed.`index` is optional parameter.
     *  Without Specifying index, based on the `isExpand` value all Accordion item can be expanded or collapsed.
     * @returns void.
     */
    expandItem(isExpand, index) {
        let root = this.element;
        if (isNullOrUndefined(index)) {
            if (this.expandMode === 'Single' && isExpand) {
                let ele = root.children[root.childElementCount - 1];
                this.itemExpand(isExpand, ele, this.getIndexByItem(ele));
            }
            else {
                [].slice.call(this.element.children).forEach((el) => {
                    this.itemExpand(isExpand, el, this.getIndexByItem(el));
                });
            }
        }
        else {
            let ele = this.element.children[index];
            if (isNullOrUndefined(ele) || !ele.classList.contains(CLS_SLCT) || (ele.classList.contains(CLS_ACTIVE) && isExpand)) {
                return;
            }
            else {
                if (this.expandMode === 'Single') {
                    this.expandItem(false);
                }
                this.itemExpand(isExpand, ele, index);
            }
        }
    }
    itemExpand(isExpand, ele, index) {
        let ctn = ele.children[1];
        if (ele.classList.contains(CLS_DISABLE$2)) {
            return;
        }
        if (isNullOrUndefined(ctn) && isExpand) {
            ctn = this.contentRendering(index);
            ele.appendChild(ctn);
            this.ariaAttrUpdate(ele);
        }
        else if (isNullOrUndefined(ctn)) {
            return;
        }
        isExpand ? this.expand(ctn) : this.collapse(ctn);
    }
    destroyItems() {
        [].slice.call(this.element.querySelectorAll('.' + CLS_ITEM$1)).forEach((el) => { detach(el); });
    }
    updateItem(item, index) {
        if (!isNullOrUndefined(item)) {
            let itemObj = this.items[index];
            this.items.splice(index, 1);
            detach(item);
            this.addItem(itemObj, index);
        }
    }
    getPersistData() {
        let keyEntity = ['expandedItems'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     * @param  {AccordionModel} newProp
     * @param  {AccordionModel} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        let acrdn = this.element;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'items':
                    if (!(newProp.items instanceof Array && oldProp.items instanceof Array)) {
                        let changedProp = Object.keys(newProp.items);
                        for (let i = 0; i < changedProp.length; i++) {
                            let index = parseInt(Object.keys(newProp.items)[i], 10);
                            let property = Object.keys(newProp.items[index])[0];
                            let oldVal = Object(oldProp.items[index])[property];
                            let newVal = Object(newProp.items[index])[property];
                            let item = selectAll('.' + CLS_ITEM$1, this.element)[index];
                            if (property === 'header' || property === 'iconCss' || property === 'expanded') {
                                this.updateItem(item, index);
                            }
                            if (property === 'cssClass' && !isNullOrUndefined(item)) {
                                item.classList.remove(oldVal);
                                item.classList.add(newVal);
                            }
                            if (property === 'content' && !isNullOrUndefined(item) && item.children.length === 2) {
                                if (item.classList.contains(CLS_SLCTED)) {
                                    this.expandItem(false, index);
                                }
                                detach(item.querySelector('.' + CLS_CONTENT));
                            }
                        }
                    }
                    else {
                        this.destroyItems();
                        this.renderItems();
                        this.initItemExpand();
                    }
                    break;
                case 'enableRtl':
                    newProp.enableRtl ? this.add(acrdn, CLS_RTL$2) : this.remove(acrdn, CLS_RTL$2);
                    break;
                case 'height':
                    setStyleAttribute(this.element, { 'height': formatUnit(newProp.height) });
                    break;
                case 'width':
                    setStyleAttribute(this.element, { 'width': formatUnit(newProp.width) });
                    break;
                case 'expandMode':
                    if (newProp.expandMode === 'Single') {
                        this.element.setAttribute('aria-multiselectable', 'false');
                        if (this.expandedItems.length > 1) {
                            this.expandItem(false);
                        }
                    }
                    else {
                        this.element.setAttribute('aria-multiselectable', 'true');
                    }
                    break;
            }
        }
    }
};
__decorate$2([
    Collection([], AccordionItem)
], Accordion.prototype, "items", void 0);
__decorate$2([
    Property('100%')
], Accordion.prototype, "width", void 0);
__decorate$2([
    Property('auto')
], Accordion.prototype, "height", void 0);
__decorate$2([
    Property('Multiple')
], Accordion.prototype, "expandMode", void 0);
__decorate$2([
    Complex({}, AccordionAnimationSettings)
], Accordion.prototype, "animation", void 0);
__decorate$2([
    Event()
], Accordion.prototype, "clicked", void 0);
__decorate$2([
    Event()
], Accordion.prototype, "expanding", void 0);
__decorate$2([
    Event()
], Accordion.prototype, "expanded", void 0);
__decorate$2([
    Event()
], Accordion.prototype, "created", void 0);
__decorate$2([
    Event()
], Accordion.prototype, "destroyed", void 0);
Accordion = __decorate$2([
    NotifyPropertyChanges
], Accordion);

/**
 * Accordion all modules
 */

var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const DOWNARROW = 'downarrow';
const ENTER = 'enter';
const ESCAPE = 'escape';
const FOCUSED = 'e-focused';
const HEADER = 'e-menu-header';
const LEFTARROW = 'leftarrow';
const RIGHTARROW = 'rightarrow';
const RTL = 'e-rtl';
const SELECTED = 'e-selected';
const SEPARATOR = 'e-separator';
const UPARROW = 'uparrow';
const WRAPPER = 'e-contextmenu-wrapper';
const CARET = 'e-caret';
const ITEM = 'e-menu-item';
const DISABLED = 'e-disabled';
const HIDE = 'e-menu-hide';
const ICONS = 'e-icons';
/**
 * Specifies context menu items.
 */
class MenuItem extends ChildProperty {
}
__decorate$3([
    Property('')
], MenuItem.prototype, "iconCss", void 0);
__decorate$3([
    Property('')
], MenuItem.prototype, "id", void 0);
__decorate$3([
    Property(false)
], MenuItem.prototype, "separator", void 0);
__decorate$3([
    Collection([], MenuItem)
], MenuItem.prototype, "items", void 0);
__decorate$3([
    Property('')
], MenuItem.prototype, "text", void 0);
__decorate$3([
    Property('')
], MenuItem.prototype, "url", void 0);
/**
 * The ContextMenu is a graphical user interface that appears on the user right click/touch hold operation.
 * ```html
 * <div id = 'target'></div>
 * <ul id = 'contextmenu'></ul>
 * ```
 * ```typescript
 * <script>
 * var contextMenuObj = new ContextMenu({items: [{ text: 'Cut' }, { text: 'Copy' },{ text: 'Paste' }], target: '#target'});
 * </script>
 * ```
 */
let ContextMenu = class ContextMenu extends Component {
    /**
     * Constructor for creating the widget.
     * @private
     */
    constructor(options, element) {
        super(options, element);
        this.animation = new Animation({});
        this.navIdx = [];
        this.isTapHold = false;
    }
    /**
     * Initialized animation with parent menu animation settings.
     * @private
     */
    preRender() {
        if (this.element.tagName === 'EJS-CONTEXTMENU') {
            this.element.style.display = 'none';
            this.element.classList.remove('e-' + this.getModuleName());
            this.element.classList.remove('e-control');
            let ejInst = getValue('ej2_instances', this.element);
            let ul = createElement('ul');
            this.ngElement = this.element;
            this.element = ul;
            this.element.classList.add('e-control');
            this.element.classList.add('e-' + this.getModuleName());
            setValue('ej2_instances', ejInst, this.element);
            if (!this.element.id) {
                this.element.id = getUniqueID(this.getModuleName());
            }
        }
    }
    /**
     * Initialize the control rendering
     * @private
     */
    render() {
        this.initWrapper();
        this.renderItems();
        this.wireEvents();
    }
    initWrapper() {
        let wrapper = this.getWrapper();
        if (!wrapper) {
            wrapper = createElement('div', { className: WRAPPER });
            document.body.appendChild(wrapper);
        }
        if (this.cssClass) {
            wrapper.classList.add(this.cssClass);
        }
        if (this.enableRtl) {
            wrapper.classList.add(RTL);
        }
        attributes(this.element, { 'role': 'menu', 'tabindex': '0' });
        wrapper.appendChild(this.element);
        this.element.style.zIndex = getZindexPartial(this.element).toString();
    }
    renderItems() {
        if (!this.items.length) {
            this.items = ListBase.createJsonFromElement(this.element);
            this.element.innerHTML = '';
        }
        let ul = this.createItems(this.items);
        append(Array.prototype.slice.call(ul.children), this.element);
        this.element.classList.add('e-menu-parent');
    }
    wireEvents() {
        let wrapper = this.getWrapper();
        if (this.target) {
            let target;
            let targetElems = selectAll(this.target);
            for (let i = 0, len = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (Browser.isIos) {
                    new Touch(target, { tapHold: this.touchHandler.bind(this) });
                }
                else {
                    EventHandler.add(target, 'contextmenu', this.cmenuHandler, this);
                }
            }
            this.targetElement = target;
            for (let parent of getScrollableParent(this.targetElement)) {
                EventHandler.add(parent, 'scroll', this.scrollHandler, this);
            }
        }
        if (!Browser.isDevice) {
            EventHandler.add(wrapper, 'mouseover', this.moverHandler, this);
            EventHandler.add(document, 'mousedown', this.mouseDownHandler, this);
        }
        this.delegateClickHandler = this.clickHandler.bind(this);
        EventHandler.add(document, 'click', this.delegateClickHandler, this);
        new KeyboardEvents(wrapper, {
            keyAction: this.keyBoardHandler.bind(this),
            keyConfigs: {
                downarrow: DOWNARROW,
                uparrow: UPARROW,
                enter: ENTER,
                leftarrow: LEFTARROW,
                rightarrow: RIGHTARROW,
                escape: ESCAPE
            }
        });
        rippleEffect(wrapper, { selector: '.' + ITEM });
    }
    mouseDownHandler(e) {
        if (closest(e.target, '.' + WRAPPER) !== this.getWrapper()) {
            this.closeMenu(this.navIdx.length, e);
        }
    }
    keyBoardHandler(e) {
        e.preventDefault();
        switch (e.action) {
            case DOWNARROW:
            case UPARROW:
                this.upDownKeyHandler(e);
                break;
            case RIGHTARROW:
                this.rightEnterKeyHandler(e);
                break;
            case LEFTARROW:
                this.leftEscKeyHandler(e);
                break;
            case ENTER:
                this.rightEnterKeyHandler(e);
                break;
            case ESCAPE:
                this.leftEscKeyHandler(e);
                break;
        }
    }
    upDownKeyHandler(e) {
        let wrapper = this.getWrapper();
        let cul = wrapper.children[this.navIdx.length];
        let defaultIdx = e.action === DOWNARROW ? 0 : cul.childElementCount - 1;
        let fliIdx = defaultIdx;
        let fli = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            fliIdx = this.getIdx(cul, fli);
            fli.classList.remove(FOCUSED);
            e.action === DOWNARROW ? fliIdx++ : fliIdx--;
            if (fliIdx === (e.action === DOWNARROW ? cul.childElementCount : -1)) {
                fliIdx = defaultIdx;
            }
        }
        let cli = cul.children[fliIdx];
        fliIdx = this.isValidLI(cli, fliIdx, e.action);
        cul.children[fliIdx].classList.add(FOCUSED);
        cul.children[fliIdx].focus();
    }
    isValidLI(cli, index, action) {
        let wrapper = this.getWrapper();
        let cul = wrapper.children[this.navIdx.length];
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            ((action === DOWNARROW) || (action === RIGHTARROW)) ? index++ : index--;
        }
        cli = cul.children[index];
        if (cli.classList.contains(SEPARATOR) || cli.classList.contains(DISABLED) || cli.classList.contains(HIDE)) {
            index = this.isValidLI(cli, index, action);
        }
        return index;
    }
    rightEnterKeyHandler(e) {
        let eventArgs;
        let wrapper = this.getWrapper();
        let cul = wrapper.children[this.navIdx.length];
        let fli = this.getLIByClass(cul, FOCUSED);
        if (fli) {
            let fliIdx = this.getIdx(cul, fli);
            let navIdx = this.navIdx.concat(fliIdx);
            let index;
            let item = this.getItem(navIdx);
            if (item.items.length) {
                this.navIdx.push(fliIdx);
                this.openMenu(fli, item, null, null, e);
                fli.classList.remove(FOCUSED);
                fli.classList.add(SELECTED);
                if (e.action === ENTER) {
                    eventArgs = { element: fli, item: item };
                    this.trigger('select', eventArgs);
                }
                fli.focus();
                cul = wrapper.children[this.navIdx.length];
                index = this.isValidLI(cul.children[0], 0, e.action);
                cul.children[index].classList.add(FOCUSED);
                cul.children[index].focus();
            }
            else {
                if (e.action === ENTER) {
                    fli.classList.remove(FOCUSED);
                    fli.classList.add(SELECTED);
                    eventArgs = { element: fli, item: item };
                    this.trigger('select', eventArgs);
                    this.closeMenu(null, e);
                }
            }
        }
    }
    leftEscKeyHandler(e) {
        if (this.navIdx.length) {
            let wrapper = this.getWrapper();
            this.closeMenu(this.navIdx.length, e);
            let cul = wrapper.children[this.navIdx.length];
            let sli = this.getLIByClass(cul, SELECTED);
            if (sli) {
                sli.setAttribute('aria-expanded', 'false');
                sli.classList.remove(SELECTED);
                sli.classList.add(FOCUSED);
                sli.focus();
            }
        }
        else {
            if (e.action === ESCAPE) {
                this.closeMenu(null, e);
            }
        }
    }
    scrollHandler(e) {
        this.closeMenu(null, e);
    }
    touchHandler(e) {
        this.isTapHold = true;
        this.cmenuHandler(e.originalEvent);
    }
    cmenuHandler(e) {
        e.preventDefault();
        this.closeMenu(null, e);
        if (this.canOpen(e.target)) {
            if (e.changedTouches) {
                this.openMenu(null, null, e.changedTouches[0].pageY + 1, e.changedTouches[0].pageX + 1, e);
            }
            else {
                this.openMenu(null, null, e.pageY + 1, e.pageX + 1, e);
            }
        }
    }
    /**
     * Closes the ContextMenu if it is opened.
     */
    close() {
        this.closeMenu();
    }
    closeMenu(ulIndex = 0, e = null) {
        if (this.isMenuVisible()) {
            let ul;
            let item;
            let items;
            let closeArgs;
            let beforeCloseArgs;
            let wrapper = this.getWrapper();
            for (let cnt = wrapper.childElementCount; cnt > ulIndex; cnt--) {
                item = this.navIdx.length ? this.getItem(this.navIdx) : null;
                items = item ? item.items : this.items;
                ul = wrapper.children[cnt - 1];
                beforeCloseArgs = { element: ul, parentItem: item, items: items, event: e, cancel: false };
                this.trigger('beforeClose', beforeCloseArgs);
                if (!beforeCloseArgs.cancel) {
                    this.toggleAnimation(ul, false);
                    this.navIdx.length = ulIndex ? ulIndex - 1 : ulIndex;
                    closeArgs = { element: ul, parentItem: item, items: items };
                    this.trigger('onClose', closeArgs);
                }
            }
        }
    }
    isMenuVisible() {
        return (this.navIdx.length > 0 || (this.element.classList.contains('e-contextmenu') && isVisible(this.element).valueOf()));
    }
    canOpen(target) {
        let canOpen = true;
        if (this.filter) {
            canOpen = false;
            let filter = this.filter.split(' ');
            for (let i = 0, len = target.classList.length; i < len; i++) {
                if (filter.indexOf(target.classList[i]) > -1) {
                    canOpen = true;
                    break;
                }
            }
        }
        return canOpen;
    }
    /**
     * This method is used to open the ContextMenu in specified position.
     * @param top To specify ContextMenu vertical positioning.
     * @param left To specify ContextMenu horizontal positioning.
     * @returns void
     */
    open(top, left) {
        this.openMenu(null, null, top, left);
    }
    openMenu(li, item, top = 0, left = 0, e = null) {
        let ul;
        let navIdx;
        let wrapper = this.getWrapper();
        if (li) {
            ul = this.createItems(item.items);
            if (Browser.isDevice) {
                wrapper.lastChild.style.display = 'none';
                let data = { text: item.text, iconCss: ICONS + ' e-previous' };
                let hdata = new MenuItem(this.items[0], null, data, true);
                let hli = this.createItems([hdata]).children[0];
                hli.classList.add(HEADER);
                ul.insertBefore(hli, ul.children[0]);
            }
            ul.style.zIndex = this.element.style.zIndex;
            wrapper.appendChild(ul);
        }
        else {
            ul = this.element;
        }
        navIdx = this.getIndex(li ? li.textContent : null);
        let items = li ? item.items : this.items;
        let eventArgs = { element: ul, items: items, parentItem: item, event: e, cancel: false };
        this.trigger('beforeOpen', eventArgs);
        if (eventArgs.cancel) {
            this.navIdx.pop();
        }
        else {
            this.setPosition(li, ul, top, left);
            this.toggleAnimation(ul);
        }
    }
    setPosition(li, ul, top, left) {
        let px = 'px';
        this.toggleVisiblity(ul);
        if (ul === this.element) {
            let collide = isCollide(ul, null, left, top);
            if (collide.indexOf('right') > -1) {
                left = left - ul.offsetWidth;
            }
            if (collide.indexOf('bottom') > -1) {
                let offset = fit(ul, null, { X: false, Y: true }, { top: top, left: left });
                top = offset.top - 20;
            }
            collide = isCollide(ul, null, left, top);
            if (collide.indexOf('left') > -1) {
                let offset = fit(ul, null, { X: true, Y: false }, { top: top, left: left });
                left = offset.left;
            }
        }
        else {
            if (Browser.isDevice) {
                top = Number(this.element.style.top.replace(px, ''));
                left = Number(this.element.style.left.replace(px, ''));
            }
            else {
                let x = this.enableRtl ? 'left' : 'right';
                let offset = calculatePosition(li, x, 'top');
                top = offset.top;
                left = offset.left;
                let collide = isCollide(ul, null, this.enableRtl ? left - ul.offsetWidth : left, top);
                let xCollision = collide.indexOf('left') > -1 || collide.indexOf('right') > -1;
                if (xCollision) {
                    offset = calculatePosition(li, this.enableRtl ? 'right' : 'left', 'top');
                    left = offset.left;
                }
                if (this.enableRtl || xCollision) {
                    left = (this.enableRtl && xCollision) ? left : left - ul.offsetWidth;
                }
                if (collide.indexOf('bottom') > -1) {
                    offset = fit(ul, null, { X: false, Y: true }, { top: top, left: left });
                    top = offset.top;
                }
            }
        }
        this.toggleVisiblity(ul, false);
        ul.style.top = top + px;
        ul.style.left = left + px;
    }
    toggleVisiblity(ul, isVisible$$1 = true) {
        ul.style.visibility = isVisible$$1 ? 'hidden' : '';
        ul.style.display = isVisible$$1 ? 'block' : 'none';
    }
    createItems(items) {
        let showIcon = this.hasField(items, 'iconCss');
        let listBaseOptions = {
            showIcon: showIcon,
            moduleName: 'menu',
            itemCreating: (args) => {
                args.curData.htmlAttributes = {
                    role: 'menuitem',
                    tabindex: '-1'
                };
            },
            itemCreated: (args) => {
                if (args.curData.separator) {
                    args.item.classList.add(SEPARATOR);
                    args.item.removeAttribute('role');
                }
                if (showIcon && !args.curData.iconCss && !args.curData.separator) {
                    args.item.classList.add('e-blankicon');
                }
                if (args.curData.items && args.curData.items.length) {
                    let span = createElement('span', { className: ICONS + ' ' + CARET });
                    args.item.appendChild(span);
                    args.item.setAttribute('aria-haspopup', 'true');
                    args.item.setAttribute('aria-expanded', 'false');
                    args.item.removeAttribute('role');
                    args.item.classList.add('e-menu-caret-icon');
                }
                let eventArgs = { item: args.curData, element: args.item };
                this.trigger('beforeItemRender', eventArgs);
            }
        };
        let ul = ListBase.createList(this.toRawObject(items.slice()), listBaseOptions, true);
        ul.setAttribute('tabindex', '0');
        return ul;
    }
    toRawObject(items) {
        let item;
        let menuItems = [];
        for (let i = 0, len = items.length; i < len; i++) {
            item = items[i].properties;
            menuItems.push(item);
        }
        return menuItems;
    }
    moverHandler(e) {
        let wrapper = this.getWrapper();
        let trgt = e.target;
        let cli = this.getLI(trgt);
        if (cli && closest(cli, '.' + WRAPPER)) {
            let fli = select('.' + FOCUSED, wrapper);
            if (fli) {
                fli.classList.remove(FOCUSED);
            }
            cli.classList.add(FOCUSED);
            if (!this.showItemOnClick) {
                this.clickHandler(e);
            }
        }
    }
    hasField(items, field) {
        for (let i = 0, len = items.length; i < len; i++) {
            if (items[i][field]) {
                return true;
            }
        }
        return false;
    }
    getWrapper() {
        return closest(this.element, '.' + WRAPPER);
    }
    clickHandler(e) {
        if (this.isTapHold) {
            this.isTapHold = false;
        }
        else {
            let wrapper = this.getWrapper();
            let trgt = e.target;
            let cli = this.getLI(trgt);
            let cliWrapper = cli ? closest(cli, '.' + WRAPPER) : null;
            let isInstLI = cli && cliWrapper && wrapper.firstElementChild.id === cliWrapper.firstElementChild.id;
            if (isInstLI && e.type === 'click' && !cli.classList.contains(HEADER)) {
                this.setLISelected(cli);
                let navIdx = this.getIndex(cli.textContent);
                let item = this.getItem(navIdx);
                let eventArgs = { element: cli, item: item };
                this.trigger('select', eventArgs);
            }
            if (isInstLI && (e.type === 'mouseover' || Browser.isDevice || this.showItemOnClick)) {
                let ul;
                if (cli.classList.contains(HEADER)) {
                    ul = wrapper.children[this.navIdx.length - 1];
                    this.toggleAnimation(ul);
                    let sli = this.getLIByClass(ul, SELECTED);
                    if (sli) {
                        sli.classList.remove(SELECTED);
                    }
                    detach(cli.parentNode);
                    this.navIdx.pop();
                }
                else {
                    if (!cli.classList.contains(SEPARATOR)) {
                        let showSubMenu = true;
                        let cul = cli.parentNode;
                        let cliIdx = this.getIdx(cul, cli);
                        if (!Browser.isDevice) {
                            let culIdx = this.getIdx(wrapper, cul);
                            if (this.navIdx[culIdx] === cliIdx) {
                                showSubMenu = false;
                            }
                            if (culIdx !== this.navIdx.length && (e.type !== 'mouseover' || showSubMenu)) {
                                let sli = this.getLIByClass(cul, SELECTED);
                                if (sli) {
                                    sli.classList.remove(SELECTED);
                                }
                                this.closeMenu(culIdx + 1, e);
                            }
                        }
                        if (showSubMenu) {
                            let idx = this.navIdx.concat(cliIdx);
                            let item = this.getItem(idx);
                            if (item.items.length) {
                                if (e.type === 'mouseover') {
                                    this.setLISelected(cli);
                                }
                                cli.setAttribute('aria-expanded', 'true');
                                this.navIdx.push(cliIdx);
                                this.openMenu(cli, item, null, null, e);
                            }
                            else {
                                if (e.type !== 'mouseover') {
                                    this.closeMenu(null, e);
                                }
                            }
                        }
                    }
                }
            }
            else {
                if (trgt.tagName !== 'UL' || trgt.parentElement !== wrapper) {
                    if (!cli || !cli.querySelector('.' + CARET)) {
                        this.closeMenu(null, e);
                    }
                }
            }
        }
    }
    setLISelected(li) {
        let sli = this.getLIByClass(li.parentElement, SELECTED);
        if (sli) {
            sli.classList.remove(SELECTED);
        }
        li.classList.remove(FOCUSED);
        li.classList.add(SELECTED);
    }
    getLIByClass(ul, classname) {
        for (let i = 0, len = ul.children.length; i < len; i++) {
            if (ul.children[i].classList.contains(classname)) {
                return ul.children[i];
            }
        }
        return null;
    }
    getItem(navIdx) {
        navIdx = navIdx.slice();
        let idx = navIdx.pop();
        let items = this.getItems(navIdx);
        return items[idx];
    }
    getItems(navIdx) {
        let items = this.items;
        for (let i = 0; i < navIdx.length; i++) {
            items = items[navIdx[i]].items;
        }
        return items;
    }
    getIdx(ul, li, skipHdr = true) {
        let idx = Array.prototype.indexOf.call(ul.children, li);
        if (skipHdr && ul.children[0].classList.contains(HEADER)) {
            idx--;
        }
        return idx;
    }
    getLI(elem) {
        if (elem.tagName === 'LI') {
            return elem;
        }
        return closest(elem, 'li');
    }
    /**
     * Called internally if any of the property value changed
     * @private
     * @param {ContextMenuModel} newProp
     * @param {ContextMenuModel} oldProp
     * @returns void
     */
    onPropertyChanged(newProp, oldProp) {
        let wrapper = this.getWrapper();
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        wrapper.classList.remove(oldProp.cssClass);
                    }
                    if (newProp.cssClass) {
                        wrapper.classList.add(newProp.cssClass);
                    }
                    break;
                case 'enableRtl':
                    wrapper.classList.toggle(RTL);
                    break;
                case 'filter':
                    this.closeMenu();
                    this.filter = newProp.filter;
                    break;
                case 'showItemOnClick':
                    this.unWireEvents();
                    this.showItemOnClick = newProp.showItemOnClick;
                    this.wireEvents();
                    break;
                case 'target':
                    this.unWireEvents();
                    this.target = newProp.target;
                    this.wireEvents();
                    break;
                case 'items':
                    let idx;
                    let navIdx;
                    let item;
                    let keys = Object.keys(newProp.items);
                    for (let i = 0; i < keys.length; i++) {
                        navIdx = this.getChangedItemIndex(newProp, [], Number(keys[i]));
                        if (navIdx.length <= this.getWrapper().children.length) {
                            idx = navIdx.pop();
                            item = this.getItems(navIdx);
                            this.insertAfter([item[idx]], item[idx].text);
                            this.removeItem(item, navIdx, idx);
                        }
                        navIdx.length = 0;
                    }
                    break;
            }
        }
    }
    getChangedItemIndex(newProp, index, idx) {
        index.push(idx);
        let key = Object.keys(newProp.items[idx]).pop();
        if (key === 'items') {
            let item = newProp.items[idx];
            this.getChangedItemIndex(item, index, Number(Object.keys(item.items).pop()));
        }
        else {
            if (key === 'isParentArray' && index.length > 1) {
                index.pop();
            }
        }
        return index;
    }
    removeItem(item, navIdx, idx) {
        item.splice(idx, 1);
        let uls = this.getWrapper().children;
        if (navIdx.length < uls.length) {
            detach(uls[navIdx.length].children[idx]);
        }
    }
    /**
     * Used to unwire the bind events.
     * @private
     */
    unWireEvents() {
        let wrapper = this.getWrapper();
        if (this.target) {
            let target;
            let touchModule;
            let targetElems = selectAll(this.target);
            for (let i = 0, len = targetElems.length; i < len; i++) {
                target = targetElems[i];
                if (Browser.isIos) {
                    touchModule = getInstance(target, Touch);
                    if (touchModule) {
                        touchModule.destroy();
                    }
                }
                else {
                    EventHandler.remove(target, 'contextmenu', this.cmenuHandler);
                }
            }
            for (let parent of getScrollableParent(this.targetElement)) {
                EventHandler.remove(parent, 'scroll', this.scrollHandler);
            }
        }
        if (!Browser.isDevice) {
            EventHandler.remove(wrapper, 'mouseover', this.moverHandler);
            EventHandler.remove(document, 'mousedown', this.mouseDownHandler);
        }
        EventHandler.remove(document, 'click', this.delegateClickHandler);
        let keyboardModule = getInstance(wrapper, KeyboardEvents);
        if (keyboardModule) {
            keyboardModule.destroy();
        }
    }
    toggleAnimation(ul, isMenuOpen = true) {
        if (this.animationSettings.effect === 'None' || !isMenuOpen) {
            this.end(ul, isMenuOpen);
        }
        else {
            this.animation.animate(ul, {
                name: this.animationSettings.effect,
                duration: this.animationSettings.duration,
                timingFunction: this.animationSettings.easing,
                begin: (options) => {
                    options.element.style.display = 'block';
                    options.element.style.maxHeight = options.element.getBoundingClientRect().height + 'px';
                },
                end: (options) => {
                    this.end(options.element, isMenuOpen);
                }
            });
        }
    }
    end(ul, isMenuOpen) {
        if (isMenuOpen) {
            ul.style.display = 'block';
            ul.style.maxHeight = '';
            let item = this.navIdx.length ? this.getItem(this.navIdx) : null;
            let eventArgs = { element: ul, parentItem: item, items: item ? item.items : this.items };
            this.trigger('onOpen', eventArgs);
            if (ul.querySelector('.' + FOCUSED)) {
                ul.querySelector('.' + FOCUSED).focus();
            }
            else {
                let ele;
                ele = this.getWrapper().children[this.getIdx(this.getWrapper(), ul) - 1];
                if (ele) {
                    ele.querySelector('.' + SELECTED).focus();
                }
                else {
                    this.element.focus();
                }
            }
        }
        else {
            if (ul === this.element) {
                let fli = this.getLIByClass(this.element, FOCUSED);
                if (fli) {
                    fli.classList.remove(FOCUSED);
                }
                let sli = this.getLIByClass(this.element, SELECTED);
                if (sli) {
                    sli.classList.remove(SELECTED);
                }
                ul.style.display = 'none';
            }
            else {
                detach(ul);
            }
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    getPersistData() {
        return '';
    }
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'contextmenu';
    }
    getIndex(data, items = this.items, navIdx = [], isCallBack = false) {
        let item;
        for (let i = 0, len = items.length; i < len; i++) {
            item = items[i];
            if (item.text === data) {
                navIdx.push(i);
                break;
            }
            else if (item.items.length) {
                navIdx = this.getIndex(data, item.items, navIdx, true);
                if (navIdx[navIdx.length - 1] === -1) {
                    if (i !== len - 1) {
                        navIdx.pop();
                    }
                }
                else {
                    navIdx.unshift(i);
                    break;
                }
            }
            else {
                if (i === len - 1) {
                    navIdx.push(-1);
                }
            }
        }
        return (!isCallBack && navIdx[0] === -1) ? [] : navIdx;
    }
    /**
     * This method is used to enable or disable the menu items in the ContextMenu based on the items and enable argument.
     * @param items Text items that needs to be enabled/disabled.
     * @param enable Set `true`/`false` to enable/disable the list items.
     * @returns void
     */
    enableItems(items, enable = true) {
        let ul;
        let idx;
        let navIdx;
        let disabled = DISABLED;
        let wrapper = this.getWrapper();
        for (let i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i]);
            idx = navIdx.pop();
            ul = wrapper.children[navIdx.length];
            if (ul) {
                if (enable) {
                    if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[idx + 1].classList.remove(disabled);
                    }
                    else {
                        ul.children[idx].classList.remove(disabled);
                    }
                }
                else {
                    if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[idx + 1].classList.add(disabled);
                    }
                    else {
                        ul.children[idx].classList.add(disabled);
                    }
                }
            }
        }
    }
    /**
     * This method is used to show the menu items in the ContextMenu based on the items text.
     * @param items Text items that needs to be shown.
     * @returns void
     */
    showItems(items) {
        this.showHideItems(items, false);
    }
    /**
     * This method is used to hide the menu items in the ContextMenu based on the items text.
     * @param items Text items that needs to be hidden.
     * @returns void
     */
    hideItems(items) {
        this.showHideItems(items, true);
    }
    showHideItems(items, ishide) {
        let ul;
        let idx;
        let navIdx;
        let wrapper = this.getWrapper();
        for (let i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i]);
            idx = navIdx.pop();
            ul = wrapper.children[navIdx.length];
            if (ul) {
                if (ishide) {
                    if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[idx + 1].classList.add(HIDE);
                    }
                    else {
                        ul.children[idx].classList.add(HIDE);
                    }
                }
                else {
                    if (Browser.isDevice && !ul.classList.contains('e-contextmenu')) {
                        ul.children[idx + 1].classList.remove(HIDE);
                    }
                    else {
                        ul.children[idx].classList.remove(HIDE);
                    }
                }
            }
        }
    }
    /**
     * It is used to remove the menu items from the ContextMenu based on the items text.
     * @param items Text items that needs to be removed.
     * @returns void
     */
    removeItems(items) {
        let idx;
        let navIdx;
        let iitems;
        for (let i = 0; i < items.length; i++) {
            navIdx = this.getIndex(items[i]);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            this.removeItem(iitems, navIdx, idx);
        }
    }
    /**
     * It is used to insert the menu items after the specified menu item text.
     * @param items Items that needs to be inserted.
     * @param text Text item after that the element to be inserted.
     * @returns void
     */
    insertAfter(items, text) {
        this.insertItems(items, text);
    }
    /**
     * It is used to insert the menu items before the specified menu item text.
     * @param items Items that needs to be inserted.
     * @param text Text item before that the element to be inserted.
     * @returns void
     */
    insertBefore(items, text) {
        this.insertItems(items, text, false);
    }
    insertItems(items, text, isAfter = true) {
        let li;
        let idx;
        let navIdx;
        let iitems;
        let menuitem;
        let showIcon;
        for (let i = 0; i < items.length; i++) {
            navIdx = this.getIndex(text);
            idx = navIdx.pop();
            iitems = this.getItems(navIdx);
            menuitem = new MenuItem(iitems[0], null, items[i], true);
            iitems.splice(isAfter ? idx + 1 : idx, 0, menuitem);
            let uls = this.getWrapper().children;
            if (navIdx.length < uls.length) {
                idx = isAfter ? idx + 1 : idx;
                showIcon = this.hasField(iitems, 'iconCss');
                li = this.createItems(iitems).children[idx];
                uls[navIdx.length].insertBefore(li, uls[navIdx.length].children[idx]);
            }
        }
    }
    /**
     * Destroys the widget.
     * @returns void
     */
    destroy() {
        let wrapper = this.getWrapper();
        if (wrapper) {
            super.destroy();
            this.unWireEvents();
            if (this.ngElement) {
                this.ngElement.style.display = 'block';
            }
            else {
                this.closeMenu();
                this.element.innerHTML = '';
                ['top', 'left', 'display', 'z-index'].forEach((key) => {
                    this.element.style.removeProperty(key);
                });
                ['role', 'tabindex', 'class', 'style'].forEach((key) => {
                    if (['class', 'style'].indexOf(key) === -1 || !this.element.getAttribute(key)) {
                        this.element.removeAttribute(key);
                    }
                });
                wrapper.parentNode.insertBefore(this.element, wrapper);
            }
            detach(wrapper);
        }
    }
};
__decorate$3([
    Property('')
], ContextMenu.prototype, "cssClass", void 0);
__decorate$3([
    Property('')
], ContextMenu.prototype, "filter", void 0);
__decorate$3([
    Property(false)
], ContextMenu.prototype, "showItemOnClick", void 0);
__decorate$3([
    Collection([], MenuItem)
], ContextMenu.prototype, "items", void 0);
__decorate$3([
    Property('')
], ContextMenu.prototype, "target", void 0);
__decorate$3([
    Property({ duration: 400, easing: 'ease', effect: 'SlideDown' })
], ContextMenu.prototype, "animationSettings", void 0);
__decorate$3([
    Event()
], ContextMenu.prototype, "beforeItemRender", void 0);
__decorate$3([
    Event()
], ContextMenu.prototype, "beforeOpen", void 0);
__decorate$3([
    Event()
], ContextMenu.prototype, "onOpen", void 0);
__decorate$3([
    Event()
], ContextMenu.prototype, "beforeClose", void 0);
__decorate$3([
    Event()
], ContextMenu.prototype, "onClose", void 0);
__decorate$3([
    Event()
], ContextMenu.prototype, "select", void 0);
ContextMenu = __decorate$3([
    NotifyPropertyChanges
], ContextMenu);

/**
 * ContextMenu modules
 */

var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CLS_TAB = 'e-tab';
const CLS_HEADER$1 = 'e-tab-header';
const CLS_CONTENT$1 = 'e-content';
const CLS_NEST$1 = 'e-nested';
const CLS_ITEMS$1 = 'e-items';
const CLS_ITEM$2 = 'e-item';
const CLS_TEMPLATE$1 = 'e-template';
const CLS_RTL$3 = 'e-rtl';
const CLS_ACTIVE$1 = 'e-active';
const CLS_DISABLE$3 = 'e-disable';
const CLS_HIDDEN$1 = 'e-hidden';
const CLS_FOCUS = 'e-focused';
const CLS_ICONS = 'e-icons';
const CLS_ICON = 'e-icon';
const CLS_ICON_CLOSE = 'e-close-icon';
const CLS_CLOSE_SHOW = 'e-close-show';
const CLS_TEXT = 'e-tab-text';
const CLS_INDICATOR = 'e-indicator';
const CLS_WRAP = 'e-tab-wrap';
const CLS_TEXT_WRAP = 'e-text-wrap';
const CLS_TAB_ICON = 'e-tab-icon';
const CLS_TB_ITEMS = 'e-toolbar-items';
const CLS_TB_ITEM = 'e-toolbar-item';
const CLS_TB_POP = 'e-toolbar-pop';
const CLS_TB_POPUP = 'e-toolbar-popup';
const CLS_POPUP_OPEN = 'e-popup-open';
const CLS_POPUP_CLOSE = 'e-popup-close';
const CLS_PROGRESS = 'e-progress';
const CLS_IGNORE = 'e-ignore';
const CLS_OVERLAY = 'e-overlay';
class TabActionSettings extends ChildProperty {
}
__decorate$4([
    Property('SlideLeftIn')
], TabActionSettings.prototype, "effect", void 0);
__decorate$4([
    Property(600)
], TabActionSettings.prototype, "duration", void 0);
__decorate$4([
    Property('ease')
], TabActionSettings.prototype, "easing", void 0);
class TabAnimationSettings extends ChildProperty {
}
__decorate$4([
    Complex({ effect: 'SlideLeftIn', duration: 600, easing: 'ease' }, TabActionSettings)
], TabAnimationSettings.prototype, "previous", void 0);
__decorate$4([
    Complex({ effect: 'SlideRightIn', duration: 600, easing: 'ease' }, TabActionSettings)
], TabAnimationSettings.prototype, "next", void 0);
/**
 * Objects used for configuring the Tab item header properties.
 */
class Header extends ChildProperty {
}
__decorate$4([
    Property('')
], Header.prototype, "text", void 0);
__decorate$4([
    Property('')
], Header.prototype, "iconCss", void 0);
__decorate$4([
    Property('left')
], Header.prototype, "iconPosition", void 0);
/**
 * An array of object that is used to configure the Tab.
 */
class TabItem extends ChildProperty {
}
__decorate$4([
    Complex({}, Header)
], TabItem.prototype, "header", void 0);
__decorate$4([
    Property('')
], TabItem.prototype, "content", void 0);
__decorate$4([
    Property('')
], TabItem.prototype, "cssClass", void 0);
__decorate$4([
    Property(false)
], TabItem.prototype, "disabled", void 0);
/**
 * Tab is a content panel to show multiple contents in a single space, one at a time.
 * Each Tab item has an associated content, that will be displayed based on the active Tab header item.
 * ```html
 * <div id="tab"></div>
 * <script>
 *   var tabObj = new Tab();
 *   tab.appendTo("#tab");
 * </script>
 * ```
 */
let Tab = class Tab extends Component {
    /**
     * Initializes a new instance of the Tab class.
     * @param options  - Specifies Tab model properties as options.
     * @param element  - Specifies the element that is rendered as a Tab.
     */
    constructor(options, element) {
        super(options, element);
        this.prevIndex = 0;
        this.show = { name: 'SlideDown', duration: 100 };
        this.hide = { name: 'SlideUp', duration: 100 };
        this.animateOptions = {};
        this.animObj = new Animation(this.animateOptions);
        this.maxHeight = 0;
        this.title = 'Close';
        /**
         * Contains the keyboard configuration of the Tab.
         */
        this.keyConfigs = {
            tab: 'tab',
            home: 'home',
            end: 'end',
            enter: 'enter',
            space: 'space',
            delete: 'delete',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            moveDown: 'downarrow'
        };
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers, attributes and classes.
     * @returns void
     */
    destroy() {
        if (!isNullOrUndefined(this.tbObj)) {
            this.tbObj.destroy();
        }
        this.unWireEvents();
        ['role', 'aria-disabled', 'aria-activedescendant', 'tabindex', 'aria-orientation'].forEach((val) => {
            this.element.removeAttribute(val);
        });
        this.expTemplateContent();
        if (!this.isTemplate) {
            this.element.innerHTML = '';
        }
        else {
            let cntEle = select('.' + CLS_TAB + ' > .' + CLS_CONTENT$1, this.element);
            this.element.classList.remove(CLS_TEMPLATE$1);
            if (!isNullOrUndefined(cntEle)) {
                cntEle.innerHTML = this.cnt;
            }
        }
        super.destroy();
        this.trigger('destroyed');
    }
    /**
     * Initialize component
     * @private
     */
    preRender() {
        let nested = closest(this.element, '.' + CLS_CONTENT$1);
        this.isNested = false;
        this.isPopup = false;
        this.initRender = true;
        this.isSwipeed = false;
        this.templateEle = [];
        if (!isNullOrUndefined(nested)) {
            nested.parentElement.classList.add(CLS_NEST$1);
            this.isNested = true;
        }
        let name = Browser.info.name;
        let css = (name === 'msie') ? 'e-ie' : (name === 'edge') ? 'e-edge' : (name === 'safari') ? 'e-safari' : '';
        setStyleAttribute(this.element, { 'width': formatUnit(this.width), 'height': formatUnit(this.height) });
        this.setCssClass(this.element, this.cssClass, true);
        attributes(this.element, { role: 'tablist', 'aria-disabled': 'false', 'aria-activedescendant': '' });
        this.setCssClass(this.element, css, true);
    }
    /**
     * Initialize the component rendering
     * @private
     */
    render() {
        this.renderContainer();
        this.wireEvents();
        this.initRender = false;
    }
    renderContainer() {
        let ele = this.element;
        if (this.items.length > 0 && ele.children.length === 0) {
            ele.appendChild(createElement('div', { className: CLS_CONTENT$1 }));
            this.setOrientation(this.headerPlacement, createElement('div', { className: CLS_HEADER$1 }));
            this.isTemplate = false;
        }
        else if (this.element.children.length > 0) {
            this.isTemplate = true;
            ele.classList.add(CLS_TEMPLATE$1);
            let header = ele.querySelector('.' + CLS_HEADER$1);
            if (header && this.headerPlacement === 'Bottom') {
                this.setOrientation(this.headerPlacement, header);
            }
        }
        if (!isNullOrUndefined(select('.' + CLS_HEADER$1, this.element)) && !isNullOrUndefined(select('.' + CLS_CONTENT$1, this.element))) {
            this.renderHeader();
            this.tbItems = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS, this.element);
            if (!isNullOrUndefined(this.tbItems)) {
                rippleEffect(this.tbItems, { selector: '.e-tab-wrap' });
            }
            this.renderContent();
            if (selectAll('.' + CLS_TB_ITEM, this.element).length > 0) {
                this.tbItems = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS, this.element);
                this.bdrLine = createElement('div', { className: CLS_INDICATOR + ' ' + CLS_HIDDEN$1 + ' ' + CLS_IGNORE });
                let scrCnt = select('.e-hscroll-content', this.tbItems);
                if (!isNullOrUndefined(scrCnt)) {
                    scrCnt.insertBefore(this.bdrLine, scrCnt.firstChild);
                }
                else {
                    this.tbItems.insertBefore(this.bdrLine, this.tbItems.firstChild);
                }
                this.setContentHeight(true);
                this.select(this.selectedItem);
            }
            this.setRTL(this.enableRtl);
        }
    }
    renderHeader() {
        let tabItems = [];
        this.hdrEle = select('.' + CLS_HEADER$1, this.element);
        this.btnCls = createElement('span', { className: CLS_ICONS + ' ' + CLS_ICON_CLOSE, attrs: { title: this.title } }).outerHTML;
        if (!this.isTemplate) {
            tabItems = this.parseObject(this.items, 0);
        }
        else {
            let count = this.hdrEle.children.length;
            let hdrItems = [];
            for (let i = 0; i < count; i++) {
                hdrItems.push(this.hdrEle.children.item(i).innerHTML);
            }
            if (count > 0) {
                this.hdrEle.innerHTML = '';
                this.hdrEle.appendChild(createElement('div', { className: CLS_ITEMS$1 }));
                hdrItems.forEach((item, index) => {
                    let attr = {
                        className: CLS_ITEM$2, id: CLS_ITEM$2 + '_' + index,
                        attrs: { role: 'tab', 'aria-controls': CLS_CONTENT$1 + '_' + index, 'aria-selected': 'false' }
                    };
                    let txt = createElement('span', { className: CLS_TEXT, innerHTML: item, attrs: { 'role': 'presentation' } }).outerHTML;
                    let cont = createElement('div', { className: CLS_TEXT_WRAP, innerHTML: txt + this.btnCls }).outerHTML;
                    let wrap = createElement('div', { className: CLS_WRAP, innerHTML: cont, attrs: { tabIndex: '-1' } });
                    select('.' + CLS_ITEMS$1, this.element).appendChild(createElement('div', attr));
                    selectAll('.' + CLS_ITEM$2, this.element)[index].appendChild(wrap);
                });
            }
        }
        this.tbObj = new Toolbar({
            width: '100%',
            overflowMode: this.overflowMode,
            items: (tabItems.length !== 0) ? tabItems : [],
            clicked: this.clickHandler.bind(this)
        });
        this.tbObj.appendTo(this.hdrEle);
        attributes(this.element, { 'aria-orientation': 'horizontal' });
        this.setCloseButton(this.showCloseButton);
        this.setProperties({ headerPlacement: (this.element.children.item(0).classList.contains(CLS_HEADER$1)) ? 'Top' : 'Bottom' }, true);
    }
    renderContent() {
        this.cntEle = select('.' + CLS_CONTENT$1, this.element);
        let hdrItem = selectAll('.' + CLS_TB_ITEM, this.element);
        if (this.isTemplate) {
            this.cnt = (this.cntEle.children.length > 0) ? this.cntEle.innerHTML : '';
            let contents = this.cntEle.children;
            for (let i = 0; i < hdrItem.length; i++) {
                if (contents.length - 1 >= i) {
                    contents.item(i).className += CLS_ITEM$2;
                    attributes(contents.item(i), { 'role': 'tabpanel', 'aria-labelledby': CLS_ITEM$2 + '_' + i });
                    contents.item(i).id = CLS_CONTENT$1 + '_' + i;
                }
            }
        }
    }
    parseObject(items, index) {
        let inHTML = '';
        let tbCount = selectAll('.' + CLS_TB_ITEM, this.element).length;
        let tItems = [];
        items.forEach((item, i) => {
            let pos = (isNullOrUndefined(item.header.iconPosition)) ? '' : item.header.iconPosition;
            let css = (isNullOrUndefined(item.header.iconCss)) ? '' : item.header.iconCss;
            let txt = item.header.text;
            let id = ((tbCount === 0) ? i : (this.isReplace === true) ? (i + index) : tbCount + i);
            let disabled = (item.disabled) ? ' ' + CLS_DISABLE$3 + ' ' + CLS_OVERLAY : '';
            let tHtml = ((txt instanceof Object) ? txt.outerHTML : txt);
            let txtEmpty = (!isNullOrUndefined(tHtml) && tHtml !== '');
            let tEle = (txtEmpty) ? createElement('div', {
                className: CLS_TEXT, innerHTML: tHtml, attrs: { 'role': 'presentation' }
            }).outerHTML : '';
            let icon = createElement('span', {
                className: CLS_ICONS + ' ' + CLS_TAB_ICON + ' ' + CLS_ICON + '-' + pos + ' ' + css
            }).outerHTML;
            if ((txt === '' || txt === undefined) && css === '') {
                return;
            }
            else {
                if ((txt !== '' && txt !== undefined) && css !== '') {
                    inHTML = (pos === 'left' || pos === 'top') ? icon + '' + tEle : tEle + '' + icon;
                }
                else {
                    inHTML = (css === '') ? tEle : icon;
                }
            }
            let wrapAttrs = (item.disabled) ? {} : { tabIndex: '-1' };
            let tCont = createElement('div', { className: CLS_TEXT_WRAP, innerHTML: inHTML + '' + this.btnCls }).outerHTML;
            let wrap = createElement('div', { className: CLS_WRAP, innerHTML: tCont, attrs: wrapAttrs });
            let attrObj = {
                id: CLS_ITEM$2 + '_' + id, role: 'tab', 'aria-selected': 'false'
            };
            let tItem = { htmlAttributes: attrObj, template: wrap.outerHTML };
            tItem.cssClass = item.cssClass + ' ' + disabled + ' ' + ((css !== '') ? 'e-i' + pos : '') + ' ' + ((!txtEmpty) ? CLS_ICON : '');
            if (pos === 'top' || pos === 'bottom') {
                this.element.classList.add('e-vertical-icon');
            }
            tItems.push(tItem);
        });
        return tItems;
    }
    removeActiveClass(id) {
        let hdrActEle = selectAll(':root .' + CLS_HEADER$1 + ' .' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1, this.element)[0];
        if (this.headerPlacement === 'Bottom') {
            hdrActEle = selectAll(':root .' + CLS_HEADER$1 + ' .' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1, this.element.children[1])[0];
        }
        if (!isNullOrUndefined(hdrActEle)) {
            hdrActEle.classList.remove(CLS_ACTIVE$1);
            let no = this.extIndex(hdrActEle.id);
            let trg = this.findEle(select('.' + CLS_CONTENT$1, this.element).children, CLS_CONTENT$1 + '_' + no);
        }
    }
    checkPopupOverflow(ele) {
        this.tbPop = select('.' + CLS_TB_POP, this.element);
        let popIcon = select('.e-hor-nav', this.element);
        let tbrItems = select('.' + CLS_TB_ITEMS, this.element);
        if ((this.enableRtl && ((popIcon.offsetLeft + popIcon.offsetWidth) > tbrItems.offsetLeft))
            || (!this.enableRtl && popIcon.offsetLeft < tbrItems.offsetWidth)) {
            ele.classList.add(CLS_TB_POPUP);
            this.tbPop.insertBefore(ele.cloneNode(true), selectAll('.' + CLS_TB_POPUP, this.tbPop)[0]);
            ele.outerHTML = '';
        }
        return true;
    }
    popupHandler(target) {
        let ripEle = target.querySelector('.e-ripple-element');
        if (!isNullOrUndefined(ripEle)) {
            ripEle.outerHTML = '';
            target.querySelector('.' + CLS_WRAP).classList.remove('e-ripple');
        }
        this.tbItem = selectAll('.' + CLS_TB_ITEMS + ' .' + CLS_TB_ITEM, this.hdrEle);
        let lastChild = this.tbItem[this.tbItem.length - 1];
        if (this.tbItem.length !== 0) {
            target.classList.remove(CLS_TB_POPUP);
            this.tbItems.appendChild(target.cloneNode(true));
            this.actEleId = target.id;
            target.outerHTML = '';
            if (this.checkPopupOverflow(lastChild)) {
                let prevEle = this.tbItems.lastChild.previousElementSibling;
                this.checkPopupOverflow(prevEle);
            }
            this.isPopup = true;
        }
        return selectAll('.' + CLS_TB_ITEM, this.tbItems).length - 1;
    }
    setCloseButton(val) {
        let trg = select('.' + CLS_HEADER$1, this.element);
        (val === true) ? trg.classList.add(CLS_CLOSE_SHOW) : trg.classList.remove(CLS_CLOSE_SHOW);
        this.tbObj.refreshOverflow();
        this.refreshActElePosition();
    }
    prevCtnAnimation(prev, current) {
        let animation;
        let checkRTL = this.enableRtl || this.element.classList.contains(CLS_RTL$3);
        if (this.isPopup || prev <= current) {
            if (this.animation.previous.effect === 'SlideLeftIn') {
                animation = { name: 'SlideLeftOut',
                    duration: this.animation.previous.duration, timingFunction: this.animation.previous.easing };
            }
            else {
                animation = null;
            }
        }
        else {
            if (this.animation.next.effect === 'SlideRightIn') {
                animation = { name: 'SlideRightOut',
                    duration: this.animation.next.duration, timingFunction: this.animation.next.easing };
            }
            else {
                animation = null;
            }
        }
        return animation;
    }
    triggerPrevAnimation(oldCnt, prevIndex) {
        let animateObj = this.prevCtnAnimation(prevIndex, this.selectedItem);
        if (!isNullOrUndefined(animateObj)) {
            animateObj.begin = () => {
                setStyleAttribute(oldCnt, { 'position': 'absolute' });
                oldCnt.classList.add(CLS_PROGRESS);
                oldCnt.classList.add('e-view');
            };
            animateObj.end = () => {
                oldCnt.style.display = 'none';
                oldCnt.classList.remove(CLS_ACTIVE$1);
                oldCnt.classList.remove(CLS_PROGRESS);
                oldCnt.classList.remove('e-view');
                setStyleAttribute(oldCnt, { 'display': '', 'position': '' });
                if (oldCnt.childElementCount === 0) {
                    detach(oldCnt);
                }
            };
            new Animation(animateObj).animate(oldCnt);
        }
        else {
            oldCnt.classList.remove(CLS_ACTIVE$1);
        }
    }
    triggerAnimation(id, value) {
        let prevIndex = this.prevIndex;
        let itemCollection = [].slice.call(this.element.querySelector('.' + CLS_CONTENT$1).children);
        let oldCnt;
        itemCollection.forEach((item) => {
            if (item.id === this.prevActiveEle) {
                oldCnt = item;
            }
        });
        let prevEle = this.tbItem[prevIndex];
        let no = this.extIndex(this.tbItem[this.selectedItem].id);
        let newCnt = this.getTrgContent(this.cntEle, no);
        if (isNullOrUndefined(oldCnt) && !isNullOrUndefined(prevEle)) {
            let idNo = this.extIndex(prevEle.id);
            oldCnt = this.getTrgContent(this.cntEle, idNo);
        }
        if (this.initRender || value === false || this.animation === {} || isNullOrUndefined(this.animation)) {
            if (oldCnt && oldCnt !== newCnt) {
                oldCnt.classList.remove(CLS_ACTIVE$1);
            }
            return;
        }
        let cnt = select('.' + CLS_CONTENT$1, this.element);
        let animateObj;
        if (this.prevIndex > this.selectedItem && !this.isPopup) {
            let openEff = this.animation.previous.effect;
            animateObj = {
                name: ((openEff === 'None') ? '' : ((openEff !== 'SlideLeftIn') ? openEff : 'SlideLeftIn')),
                duration: this.animation.previous.duration,
                timingFunction: this.animation.previous.easing
            };
        }
        else if (this.isPopup || this.prevIndex < this.selectedItem || this.prevIndex === this.selectedItem) {
            let clsEff = this.animation.next.effect;
            animateObj = {
                name: ((clsEff === 'None') ? '' : ((clsEff !== 'SlideRightIn') ? clsEff : 'SlideRightIn')),
                duration: this.animation.next.duration,
                timingFunction: this.animation.next.easing
            };
        }
        animateObj.progress = () => {
            cnt.classList.add(CLS_PROGRESS);
            this.setActiveBorder();
        };
        animateObj.end = () => {
            cnt.classList.remove(CLS_PROGRESS);
            newCnt.classList.add(CLS_ACTIVE$1);
        };
        if (!this.initRender) {
            this.triggerPrevAnimation(oldCnt, prevIndex);
        }
        this.prevActiveEle = newCnt.id;
        this.isPopup = false;
        if (animateObj.name === '') {
            newCnt.classList.add(CLS_ACTIVE$1);
        }
        else {
            new Animation(animateObj).animate(newCnt);
        }
    }
    keyPressed(trg) {
        let trgParent = closest(trg, '.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEM);
        let trgIndex = this.getEleIndex(trgParent);
        if (!isNullOrUndefined(this.popEle) && trg.classList.contains('e-hor-nav')) {
            (this.popEle.classList.contains(CLS_POPUP_OPEN)) ? this.popObj.hide(this.hide) : this.popObj.show(this.show);
        }
        else if (trg.classList.contains('e-scroll-nav')) {
            trg.click();
        }
        else {
            if (!isNullOrUndefined(trgParent) && trgParent.classList.contains(CLS_ACTIVE$1) === false) {
                this.select(trgIndex);
                if (!isNullOrUndefined(this.popEle)) {
                    this.popObj.hide(this.hide);
                }
            }
        }
    }
    getEleIndex(item) {
        return Array.prototype.indexOf.call(selectAll('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEM, this.element), item);
    }
    extIndex(id) {
        return id.replace(CLS_ITEM$2 + '_', '');
    }
    expTemplateContent() {
        this.templateEle.forEach((eleStr) => {
            document.body.appendChild(this.element.querySelector(eleStr)).style.display = 'none';
        });
    }
    templateCompile(ele, cnt) {
        let tempEle = createElement('div');
        let templateFn = compile(cnt);
        if (!isNullOrUndefined(templateFn) && templateFn().length > 0) {
            [].slice.call(templateFn()).forEach((el) => {
                tempEle.appendChild(el);
            });
            ele.appendChild(tempEle);
        }
    }
    getContent(ele, index, callType) {
        let eleStr;
        let cnt = this.items[Number(index)].content;
        if (typeof cnt === 'string' || isNullOrUndefined(cnt.innerHTML)) {
            if (cnt[0] === '.' || cnt[0] === '#') {
                if (document.querySelectorAll(cnt).length) {
                    let eleVal = document.querySelector(cnt);
                    eleStr = eleVal.outerHTML.trim();
                    if (callType === 'clone') {
                        ele.appendChild(eleVal.cloneNode(true));
                    }
                    else {
                        ele.appendChild(eleVal);
                        eleVal.style.display = '';
                    }
                }
                else {
                    this.templateCompile(ele, cnt);
                }
            }
            else {
                this.templateCompile(ele, cnt);
            }
        }
        else {
            ele.appendChild(cnt);
        }
        if (!isNullOrUndefined(eleStr)) {
            if (this.templateEle.indexOf(cnt.toString()) === -1) {
                this.templateEle.push(cnt.toString());
            }
        }
    }
    getTrgContent(cntEle, no) {
        let ele;
        if (this.element.classList.contains(CLS_NEST$1)) {
            ele = select('.' + CLS_NEST$1 + '> .' + CLS_CONTENT$1 + ' > #' + CLS_CONTENT$1 + '_' + no, this.element);
        }
        else {
            ele = this.findEle(cntEle.children, CLS_CONTENT$1 + '_' + no);
        }
        return ele;
    }
    findEle(items, key) {
        let ele;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === key) {
                ele = items[i];
                break;
            }
        }
        return ele;
    }
    setOrientation(place, ele) {
        (place === 'Bottom') ? this.element.appendChild(ele) : this.element.insertBefore(ele, select('.' + CLS_CONTENT$1, this.element));
    }
    setCssClass(ele, cls, val) {
        if (cls === '') {
            return;
        }
        let list = cls.split(' ');
        for (let i = 0; i < list.length; i++) {
            if (val) {
                ele.classList.add(list[i]);
            }
            else {
                ele.classList.remove(list[i]);
            }
        }
    }
    setContentHeight(val) {
        if (isNullOrUndefined(this.cntEle)) {
            return;
        }
        let hdrEle = select('.' + CLS_HEADER$1, this.element);
        if (this.heightAdjustMode === 'None') {
            if (this.height === 'auto') {
                return;
            }
            else {
                setStyleAttribute(this.cntEle, { 'height': (this.element.offsetHeight - hdrEle.offsetHeight) + 'px' });
            }
        }
        else if (this.heightAdjustMode === 'Fill') {
            setStyleAttribute(this.element, { 'height': '100%' });
            setStyleAttribute(this.cntEle, { 'height': 'auto' });
        }
        else if (this.heightAdjustMode === 'Auto') {
            let cnt = selectAll('.' + CLS_CONTENT$1 + ' > .' + CLS_ITEM$2, this.element);
            if (this.isTemplate === true) {
                for (let i = 0; i < cnt.length; i++) {
                    cnt[i].setAttribute('style', 'display:block; visibility: visible');
                    this.maxHeight = Math.max(this.maxHeight, this.getHeight(cnt[i]));
                    cnt[i].style.removeProperty('display');
                    cnt[i].style.removeProperty('visibility');
                }
            }
            else {
                this.cntEle = select('.' + CLS_CONTENT$1, this.element);
                if (val === true) {
                    this.cntEle.appendChild(createElement('div', {
                        id: (CLS_CONTENT$1 + '_' + 0), className: CLS_ITEM$2 + ' ' + CLS_ACTIVE$1,
                        attrs: { 'role': 'tabpanel', 'aria-labelledby': CLS_ITEM$2 + '_' + 0 }
                    }));
                }
                let ele = this.cntEle.children.item(0);
                for (let i = 0; i < this.items.length; i++) {
                    this.getContent(ele, i, 'clone');
                    this.maxHeight = Math.max(this.maxHeight, this.getHeight(ele));
                    ele.innerHTML = '';
                }
                this.templateEle = [];
                this.getContent(ele, 0, 'render');
                ele.classList.remove(CLS_ACTIVE$1);
            }
            setStyleAttribute(this.cntEle, { 'height': this.maxHeight + 'px' });
        }
        else {
            setStyleAttribute(this.cntEle, { 'height': 'auto' });
        }
    }
    getHeight(ele) {
        let cs = window.getComputedStyle(ele);
        return ele.offsetHeight + parseFloat(cs.getPropertyValue('padding-top')) + parseFloat(cs.getPropertyValue('padding-bottom')) +
            parseFloat(cs.getPropertyValue('margin-top')) + parseFloat(cs.getPropertyValue('margin-bottom'));
    }
    setActiveBorder() {
        let trg = select('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1, this.element);
        if (this.headerPlacement === 'Bottom') {
            trg = select('.' + CLS_TB_ITEM + '.' + CLS_ACTIVE$1, this.element.children[1]);
        }
        if (trg === null) {
            return;
        }
        let root = closest(trg, '.' + CLS_TAB);
        if (this.element !== root) {
            return;
        }
        let hsCnt = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS + ' .e-hscroll-content', this.element.children[0]);
        this.tbItems = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS, this.element);
        let bar = select('.' + CLS_HEADER$1 + ' .' + CLS_INDICATOR, this.element);
        if (this.headerPlacement === 'Bottom') {
            hsCnt = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS + ' .e-hscroll-content', this.element.children[1]);
        }
        let tbWidth = (isNullOrUndefined(hsCnt)) ? this.tbItems.offsetWidth : hsCnt.offsetWidth;
        if (tbWidth !== 0) {
            setStyleAttribute(bar, { 'left': trg.offsetLeft + 'px', 'right': tbWidth - (trg.offsetLeft + trg.offsetWidth) + 'px' });
        }
        else {
            setStyleAttribute(bar, { 'left': 'auto', 'right': 'auto' });
        }
        if (!isNullOrUndefined(this.bdrLine)) {
            this.bdrLine.classList.remove(CLS_HIDDEN$1);
        }
    }
    setActive(value) {
        this.tbItem = selectAll('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEM, this.element);
        let trg = this.tbItem[value];
        if (value >= 0) {
            this.setProperties({ selectedItem: value }, true);
        }
        if (value < 0 || isNaN(value) || this.tbItem.length === 0) {
            return;
        }
        if (trg.classList.contains(CLS_ACTIVE$1)) {
            this.setActiveBorder();
            return;
        }
        if (!this.isTemplate) {
            let prev = this.tbItem[this.prevIndex];
            if (!isNullOrUndefined(prev)) {
                prev.removeAttribute('aria-controls');
            }
            attributes(trg, { 'aria-controls': CLS_CONTENT$1 + '_' + value });
        }
        let id = trg.id;
        this.removeActiveClass(id);
        trg.classList.add(CLS_ACTIVE$1);
        trg.setAttribute('aria-selected', 'true');
        let no = Number(this.extIndex(id));
        attributes(this.element, { 'aria-activedescendant': id });
        if (this.isTemplate) {
            if (select('.' + CLS_CONTENT$1, this.element).children.length > 0) {
                let trg = this.findEle(select('.' + CLS_CONTENT$1, this.element).children, CLS_CONTENT$1 + '_' + no);
                if (!isNullOrUndefined(trg)) {
                    trg.classList.add(CLS_ACTIVE$1);
                }
                this.triggerAnimation(id, this.enableAnimation);
            }
        }
        else {
            this.cntEle = select('.' + CLS_TAB + ' > .' + CLS_CONTENT$1, this.element);
            let item = this.getTrgContent(this.cntEle, this.extIndex(id));
            if (isNullOrUndefined(item)) {
                this.cntEle.appendChild(createElement('div', {
                    id: CLS_CONTENT$1 + '_' + this.extIndex(id), className: CLS_ITEM$2 + ' ' + CLS_ACTIVE$1,
                    attrs: { role: 'tabpanel', 'aria-labelledby': CLS_ITEM$2 + '_' + this.extIndex(id) }
                }));
                let eleTrg = this.getTrgContent(this.cntEle, this.extIndex(id));
                this.getContent(eleTrg, Number(this.extIndex(id)), 'render');
            }
            else {
                item.classList.add(CLS_ACTIVE$1);
            }
            this.triggerAnimation(id, this.enableAnimation);
        }
        this.setActiveBorder();
        let curActItem = select('.' + CLS_HEADER$1 + ' #' + id, this.element);
        this.refreshItemVisibility(curActItem);
        curActItem.firstChild.focus();
        let eventArg = {
            previousItem: this.prevItem,
            previousIndex: this.prevIndex,
            selectedItem: trg,
            selectedIndex: value,
            isSwiped: this.isSwipeed
        };
        this.trigger('selected', eventArg);
    }
    setItems(items) {
        this.isReplace = true;
        this.tbItems = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS, this.element);
        this.tbObj.items = this.parseObject(items, 0);
        this.tbObj.dataBind();
        this.isReplace = false;
    }
    setRTL(value) {
        this.tbObj.enableRtl = value;
        this.tbObj.dataBind();
        this.setCssClass(this.element, CLS_RTL$3, value);
        this.refreshActiveBorder();
    }
    refreshActiveBorder() {
        if (!isNullOrUndefined(this.bdrLine)) {
            this.bdrLine.classList.add(CLS_HIDDEN$1);
        }
        this.setActiveBorder();
    }
    wireEvents() {
        window.addEventListener('resize', this.refreshActElePosition.bind(this));
        EventHandler.add(this.element, 'mouseover', this.hoverHandler, this);
        EventHandler.add(this.element, 'keydown', this.spaceKeyDown, this);
        if (!isNullOrUndefined(this.cntEle)) {
            this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) });
        }
        this.keyModule = new KeyboardEvents(this.element, { keyAction: this.keyHandler.bind(this), keyConfigs: this.keyConfigs });
        this.tabKeyModule = new KeyboardEvents(this.element, {
            keyAction: this.keyHandler.bind(this),
            keyConfigs: { openPopup: 'shift+f10', tab: 'tab', shiftTab: 'shift+tab' },
            eventName: 'keydown'
        });
    }
    unWireEvents() {
        this.keyModule.destroy();
        this.tabKeyModule.destroy();
        if (!isNullOrUndefined(this.cntEle)) {
            this.touchModule.destroy();
        }
        window.removeEventListener('resize', this.refreshActElePosition.bind(this));
        this.element.removeEventListener('mouseover', this.hoverHandler.bind(this));
    }
    clickHandler(args) {
        this.element.classList.remove(CLS_FOCUS);
        let trg = args.originalEvent.target;
        let trgParent = closest(trg, '.' + CLS_TB_ITEM);
        let trgIndex = this.getEleIndex(trgParent);
        if (trg.classList.contains(CLS_ICON_CLOSE)) {
            this.removeTab(trgIndex);
        }
        else {
            this.isPopup = false;
            if (!isNullOrUndefined(trgParent) && trgIndex !== this.selectedItem) {
                this.select(trgIndex);
            }
        }
    }
    swipeHandler(e) {
        if (e.velocity < 3 && isNullOrUndefined(e.originalEvent.changedTouches)) {
            return;
        }
        this.isSwipeed = true;
        if (e.swipeDirection === 'Right') {
            this.select(this.selectedItem - 1);
        }
        else {
            if (e.swipeDirection === 'Left' && (this.selectedItem !== selectAll('.' + CLS_TB_ITEM, this.element).length - 1)) {
                this.select(this.selectedItem + 1);
            }
        }
        this.isSwipeed = false;
    }
    spaceKeyDown(e) {
        if ((e.keyCode === 32 && e.which === 32) || (e.keyCode === 35 && e.which === 35)) {
            let clstHead = closest(e.target, '.' + CLS_HEADER$1);
            if (!isNullOrUndefined(clstHead)) {
                e.preventDefault();
            }
        }
    }
    keyHandler(e) {
        if (this.element.classList.contains(CLS_DISABLE$3)) {
            return;
        }
        this.element.classList.add(CLS_FOCUS);
        let trg = e.target;
        let actEle = select('.' + CLS_HEADER$1 + ' .' + CLS_ACTIVE$1, this.element);
        let tabItem = selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_TB_POPUP + ')', this.element);
        this.popEle = select('.' + CLS_TB_POP, this.element);
        if (!isNullOrUndefined(this.popEle)) {
            this.popObj = this.popEle.ej2_instances[0];
        }
        switch (e.action) {
            case 'space':
            case 'enter':
                if (trg.parentElement.classList.contains(CLS_DISABLE$3)) {
                    return;
                }
                if (e.action === 'enter' && trg.classList.contains('e-hor-nav')) {
                    break;
                }
                this.keyPressed(trg);
                break;
            case 'tab':
            case 'shiftTab':
                if (trg.classList.contains(CLS_WRAP)
                    && closest(trg, '.' + CLS_TB_ITEM).classList.contains(CLS_ACTIVE$1) === false) {
                    trg.setAttribute('tabindex', '-1');
                }
                if (this.popObj && isVisible(this.popObj.element)) {
                    this.popObj.hide(this.hide);
                }
                actEle.children.item(0).setAttribute('tabindex', '0');
                break;
            case 'moveLeft':
            case 'moveRight':
                let item = closest(document.activeElement, '.' + CLS_TB_ITEM);
                if (!isNullOrUndefined(item)) {
                    this.refreshItemVisibility(item);
                }
                break;
            case 'openPopup':
                e.preventDefault();
                if (!isNullOrUndefined(this.popEle) && this.popEle.classList.contains(CLS_POPUP_CLOSE)) {
                    this.popObj.show(this.show);
                }
                break;
            case 'delete':
                let trgParent = closest(trg, '.' + CLS_TB_ITEM);
                if (this.showCloseButton === true && !isNullOrUndefined(trgParent)) {
                    let nxtSib = trgParent.nextSibling;
                    if (!isNullOrUndefined(nxtSib) && nxtSib.classList.contains(CLS_TB_ITEM)) {
                        nxtSib.firstChild.focus();
                    }
                    this.removeTab(this.getEleIndex(trgParent));
                }
                this.setActiveBorder();
                break;
        }
    }
    refreshActElePosition() {
        let activeEle = select('.' + CLS_TB_ITEM + '.' + CLS_TB_POPUP + '.' + CLS_ACTIVE$1, this.element);
        if (!isNullOrUndefined(activeEle)) {
            this.select(this.getEleIndex(activeEle));
        }
        this.refreshActiveBorder();
    }
    refreshItemVisibility(target) {
        let scrCnt = select('.e-hscroll-content', this.tbItems);
        if (!isNullOrUndefined(scrCnt)) {
            let scrBar = select('.e-hscroll-bar', this.tbItems);
            let scrStart = scrBar.scrollLeft;
            let scrEnd = scrStart + scrBar.offsetWidth;
            let eleStart = target.offsetLeft;
            let eleWidth = target.offsetWidth;
            let eleEnd = target.offsetLeft + target.offsetWidth;
            if ((scrStart < eleStart) && (scrEnd < eleEnd)) {
                let eleViewRange = scrEnd - eleStart;
                scrBar.scrollLeft = scrStart + (eleWidth - eleViewRange);
            }
            else {
                if ((scrStart > eleStart) && (scrEnd > eleEnd)) {
                    let eleViewRange = eleEnd - scrStart;
                    scrBar.scrollLeft = scrStart - (eleWidth - eleViewRange);
                }
            }
        }
        else {
            return;
        }
    }
    hoverHandler(e) {
        let trg = e.target;
        if (!isNullOrUndefined(trg.classList) && trg.classList.contains(CLS_ICON_CLOSE)) {
            trg.setAttribute('title', new L10n('tab', { closeButtonTitle: this.title }, this.locale).getConstant('closeButtonTitle'));
        }
    }
    /**
     * Enables or disables the specified Tab item. On passing value as `false`, the item will be disabled.
     * @param  {number} index - Index value of target Tab item.
     * @param  {boolean} value - Boolean value that determines whether the command should be enabled or disabled.
     * By default, isEnable is true.
     * @returns void.
     */
    enableTab(index, value) {
        let tbItems = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNullOrUndefined(tbItems)) {
            return;
        }
        if (value === true) {
            tbItems.classList.remove(CLS_DISABLE$3, CLS_OVERLAY);
            tbItems.firstChild.setAttribute('tabindex', '-1');
        }
        else {
            tbItems.classList.add(CLS_DISABLE$3, CLS_OVERLAY);
            tbItems.firstChild.removeAttribute('tabindex');
            if (tbItems.classList.contains(CLS_ACTIVE$1)) {
                this.select(index + 1);
            }
        }
        tbItems.setAttribute('aria-disabled', (value === true) ? 'false' : 'true');
    }
    /**
     * Adds new items to the Tab that accepts an array as Tab items.
     * @param  {TabItemsModel[]} items - An array of item that is added to the Tab.
     * @param  {number} index - Number value that determines where the items to be added. By default, index is 0.
     * @returns void.
     */
    addTab(items, index) {
        this.trigger('adding', { addedItems: items });
        if (isNullOrUndefined(index)) {
            index = selectAll('.' + CLS_TB_ITEM).length - 1;
        }
        if (this.isTemplate === true || selectAll('.' + CLS_TB_ITEM).length - 1 < index || index < 0 || isNaN(index)) {
            return;
        }
        this.bdrLine.classList.add(CLS_HIDDEN$1);
        this.tbItems = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS, this.element);
        let tabItems = this.parseObject(items, index);
        items.forEach((item, place) => {
            if (this.isReplace === true) {
                let hdrItem = select('.' + CLS_TB_ITEMS + ' #' + CLS_ITEM$2 + '_' + index, this.element);
                detach(hdrItem);
                this.items.splice((index + place), 0, item);
            }
            else {
                this.items.push(item);
            }
        });
        this.tbObj.addItems(tabItems, index);
        this.trigger('added', { addedItems: items });
        if (this.selectedItem === index) {
            this.select(index);
        }
        else {
            this.setActiveBorder();
        }
    }
    /**
     * Removes the items in the Tab from the specified index.
     * @param  {number} index - Index of target item that is going to be removed.
     * @returns void.
     */
    removeTab(index) {
        let trg = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        let removingArgs = { removedItem: trg, removedIndex: index };
        this.trigger('removing', removingArgs);
        if (isNullOrUndefined(trg)) {
            return;
        }
        this.tbObj.removeItems(index);
        this.refreshActiveBorder();
        let no = this.extIndex(trg.id);
        let cntTrg = this.findEle(select('.' + CLS_CONTENT$1, this.element).children, CLS_CONTENT$1 + '_' + no);
        if (!isNullOrUndefined(cntTrg)) {
            cntTrg.outerHTML = '';
        }
        let removedArgs = { removedItem: trg, removedIndex: index };
        this.trigger('removed', removedArgs);
        if (trg.classList.contains(CLS_ACTIVE$1)) {
            index = (index > selectAll('.' + CLS_TB_ITEM + ':not(.' + CLS_TB_POPUP + ')', this.element).length - 1) ? index - 1 : index;
            this.enableAnimation = false;
            this.select(index);
        }
        if (selectAll('.' + CLS_TB_ITEM, this.element).length === 0) {
            this.hdrEle.style.display = 'none';
        }
        this.enableAnimation = true;
    }
    /**
     * Shows or hides the Tab that is in the specified index.
     * @param  {number} index - Index value of target item.
     * @param  {boolean} value - Based on this Boolean value, item will be hide (false) or show (true). By default, value is true.
     * @returns void.
     */
    hideTab(index, value) {
        let item = selectAll('.' + CLS_TB_ITEM, this.element)[index];
        if (isNullOrUndefined(item)) {
            return;
        }
        if (isNullOrUndefined(value)) {
            value = true;
        }
        this.bdrLine.classList.add(CLS_HIDDEN$1);
        if (value === true) {
            item.classList.add(CLS_HIDDEN$1);
            if (item.classList.contains(CLS_ACTIVE$1)) {
                this.select((index !== 0) ? index - 1 : index + 1);
            }
        }
        else {
            item.classList.remove(CLS_HIDDEN$1);
        }
        this.setActiveBorder();
        item.setAttribute('aria-hidden', '' + value);
    }
    /**
     * Specifies the index or HTMLElement to select an item from the Tab.
     * @param  {number | HTMLElement} args - Index or DOM element is used for selecting an item from the Tab.
     * @returns void.
     */
    select(args) {
        this.tbItems = select('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEMS, this.element);
        this.tbItem = selectAll('.' + CLS_HEADER$1 + ' .' + CLS_TB_ITEM, this.element);
        this.prevItem = this.tbItem[this.prevIndex];
        if (!isNullOrUndefined(this.prevItem) && !this.prevItem.classList.contains(CLS_DISABLE$3)) {
            this.prevItem.children.item(0).setAttribute('tabindex', '-1');
        }
        let eventArg = {
            previousItem: this.prevItem,
            previousIndex: this.prevIndex,
            selectedItem: this.tbItem[this.selectedItem],
            selectedIndex: this.selectedItem,
            isSwiped: this.isSwipeed
        };
        this.trigger('selecting', eventArg);
        if (eventArg.cancel) {
            return;
        }
        if (typeof args === 'number') {
            if (!isNullOrUndefined(this.tbItem[args]) && this.tbItem[args].classList.contains(CLS_DISABLE$3)) {
                for (let i = args + 1; i < this.items.length; i++) {
                    if (this.items[i].disabled === false) {
                        args = i;
                        break;
                    }
                    else {
                        args = 0;
                    }
                }
            }
            if (this.tbItem.length > args && args >= 0 && !isNaN(args)) {
                this.prevIndex = this.selectedItem;
                if (this.tbItem[args].classList.contains(CLS_TB_POPUP)) {
                    this.setActive(this.popupHandler(this.tbItem[args]));
                }
                else {
                    this.setActive(args);
                }
            }
            else {
                this.setActive(0);
            }
        }
        else if (args instanceof (HTMLElement)) {
            this.setActive(this.getEleIndex(args));
        }
    }
    /**
     * Specifies the value to disable/enable the Tab component.
     * When set to `true`, the component will be disabled.
     * @param  {boolean} value - Based on this Boolean value, Tab will be enabled (false) or disabled (true).
     * @returns void.
     */
    disable(value) {
        this.setCssClass(this.element, CLS_DISABLE$3, value);
        this.element.setAttribute('aria-disabled', '' + value);
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    getPersistData() {
        return this.addOnPersist(['selectedItem', 'actEleId']);
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'tab';
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     * @param  {TabModel} newProp
     * @param  {TabModel} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    setStyleAttribute(this.element, { width: formatUnit(newProp.width) });
                    break;
                case 'height':
                    setStyleAttribute(this.element, { height: formatUnit(newProp.height) });
                    this.setContentHeight(false);
                    break;
                case 'cssClass':
                    this.setCssClass(this.element, newProp.cssClass, true);
                    break;
                case 'items':
                    if (!(newProp.items instanceof Array && oldProp.items instanceof Array)) {
                        let changedProp = Object.keys(newProp.items);
                        for (let i = 0; i < changedProp.length; i++) {
                            let index = parseInt(Object.keys(newProp.items)[i], 10);
                            let property = Object.keys(newProp.items[index])[0];
                            let oldVal = Object(oldProp.items[index])[property];
                            let newVal = Object(newProp.items[index])[property];
                            let hdrItem = select('.' + CLS_TB_ITEMS + ' #' + CLS_ITEM$2 + '_' + index, this.element);
                            let cntItem = select('.' + CLS_CONTENT$1 + ' #' + CLS_CONTENT$1 + '_' + index, this.element);
                            if (property === 'header') {
                                let arr = [];
                                arr.push(this.items[index]);
                                this.items.splice(index, 1);
                                this.tbObj.items.splice(index, 1);
                                this.isReplace = true;
                                this.addTab(arr, index);
                                this.isReplace = false;
                            }
                            if (property === 'content' && !isNullOrUndefined(cntItem)) {
                                let strVal = typeof newVal === 'string' || isNullOrUndefined(newVal.innerHTML);
                                if (strVal && (newVal[0] === '.' || newVal[0] === '#') && newVal.length) {
                                    let eleVal = document.querySelector(newVal);
                                    cntItem.appendChild(eleVal);
                                    eleVal.style.display = '';
                                }
                                else if (newVal === '' && oldVal[0] === '#') {
                                    document.body.appendChild(this.element.querySelector(oldVal)).style.display = 'none';
                                    cntItem.innerHTML = newVal;
                                }
                                else {
                                    cntItem.innerHTML = newVal;
                                }
                            }
                            if (property === 'cssClass') {
                                if (!isNullOrUndefined(hdrItem)) {
                                    hdrItem.classList.remove(oldVal);
                                    hdrItem.classList.add(newVal);
                                }
                                if (!isNullOrUndefined(cntItem)) {
                                    cntItem.classList.remove(oldVal);
                                    cntItem.classList.add(newVal);
                                }
                            }
                            if (property === 'disabled') {
                                this.enableTab(index, ((newVal === true) ? false : true));
                            }
                        }
                    }
                    else {
                        if (isNullOrUndefined(this.tbObj)) {
                            this.renderContainer();
                            if (!isNullOrUndefined(this.cntEle)) {
                                this.touchModule = new Touch(this.cntEle, { swipe: this.swipeHandler.bind(this) });
                            }
                        }
                        else {
                            this.setItems(newProp.items);
                            if (this.templateEle.length > 0) {
                                this.expTemplateContent();
                            }
                            this.templateEle = [];
                            select('.' + CLS_TAB + ' > .' + CLS_CONTENT$1, this.element).innerHTML = '';
                            this.select(this.selectedItem);
                        }
                    }
                    break;
                case 'showCloseButton':
                    this.setCloseButton(newProp.showCloseButton);
                    break;
                case 'selectedItem':
                    this.selectedItem = oldProp.selectedItem;
                    this.select(newProp.selectedItem);
                    break;
                case 'headerPlacement':
                    let tempHdrEle = select('.' + CLS_HEADER$1, this.element);
                    this.setOrientation(newProp.headerPlacement, tempHdrEle);
                    this.select(this.selectedItem);
                    break;
                case 'enableRtl':
                    this.setRTL(newProp.enableRtl);
                    break;
                case 'overflowMode':
                    this.tbObj.overflowMode = newProp.overflowMode;
                    this.tbObj.dataBind();
                    this.refreshActElePosition();
                    break;
                case 'heightAdjustMode':
                    this.setContentHeight(false);
                    this.select(this.selectedItem);
                    break;
            }
        }
    }
};
__decorate$4([
    Collection([], TabItem)
], Tab.prototype, "items", void 0);
__decorate$4([
    Property('100%')
], Tab.prototype, "width", void 0);
__decorate$4([
    Property('auto')
], Tab.prototype, "height", void 0);
__decorate$4([
    Property('')
], Tab.prototype, "cssClass", void 0);
__decorate$4([
    Property(0)
], Tab.prototype, "selectedItem", void 0);
__decorate$4([
    Property('Top')
], Tab.prototype, "headerPlacement", void 0);
__decorate$4([
    Property('Content')
], Tab.prototype, "heightAdjustMode", void 0);
__decorate$4([
    Property('Scrollable')
], Tab.prototype, "overflowMode", void 0);
__decorate$4([
    Property(false)
], Tab.prototype, "enableRtl", void 0);
__decorate$4([
    Property(false)
], Tab.prototype, "enablePersistence", void 0);
__decorate$4([
    Property(false)
], Tab.prototype, "showCloseButton", void 0);
__decorate$4([
    Complex({}, TabAnimationSettings)
], Tab.prototype, "animation", void 0);
__decorate$4([
    Event()
], Tab.prototype, "created", void 0);
__decorate$4([
    Event()
], Tab.prototype, "adding", void 0);
__decorate$4([
    Event()
], Tab.prototype, "added", void 0);
__decorate$4([
    Event()
], Tab.prototype, "selecting", void 0);
__decorate$4([
    Event()
], Tab.prototype, "selected", void 0);
__decorate$4([
    Event()
], Tab.prototype, "removing", void 0);
__decorate$4([
    Event()
], Tab.prototype, "removed", void 0);
__decorate$4([
    Event()
], Tab.prototype, "destroyed", void 0);
Tab = __decorate$4([
    NotifyPropertyChanges
], Tab);

/**
 * Tab modules
 */

var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const ROOT = 'e-treeview';
const COLLAPSIBLE = 'e-icon-collapsible';
const EXPANDABLE = 'e-icon-expandable';
const LISTITEM = 'e-list-item';
const LISTTEXT = 'e-list-text';
const PARENTITEM = 'e-list-parent';
const HOVER = 'e-hover';
const ACTIVE = 'e-active';
const LOAD = 'e-icons-spinner';
const PROCESS = 'e-process';
const ICON = 'e-icons';
const TEXTWRAP = 'e-text-content';
const INPUT = 'e-input';
const INPUTGROUP = 'e-input-group';
const TREEINPUT = 'e-tree-input';
const EDITING = 'e-editing';
const RTL$1 = 'e-rtl';
const DRAGITEM = 'e-drag-item';
const DROPPABLE = 'e-droppable';
const DRAGGING = 'e-dragging';
const SIBLING = 'e-sibling';
const DROPIN = 'e-drop-in';
const DROPNEXT = 'e-drop-next';
const DROPOUT = 'e-drop-out';
const NODROP = 'e-no-drop';
const FULLROWWRAP = 'e-fullrow-wrap';
const FULLROW = 'e-fullrow';
const SELECTED$1 = 'e-selected';
const EXPANDED = 'e-expanded';
const NODECOLLAPSED = 'e-node-collapsed';
const DISABLE = 'e-disable';
const DROPCOUNT = 'e-drop-count';
const CHECK = 'e-check';
const INDETERMINATE = 'e-stop';
const CHECKBOXWRAP = 'e-checkbox-wrapper';
const CHECKBOXFRAME = 'e-frame';
const CHECKBOXRIPPLE = 'e-ripple-container';
const FOCUS = 'e-node-focus';
const IMAGE = 'e-list-img';
const BIGGER = 'e-bigger';
const SMALL = 'e-small';
const treeAriaAttr = {
    treeRole: 'tree',
    itemRole: 'treeitem',
    listRole: 'group',
    itemText: '',
    wrapperRole: '',
};
/**
 * Configures the fields to bind to the properties of node in the TreeView component.
 */
class FieldsSettings extends ChildProperty {
}
__decorate$5([
    Property('child')
], FieldsSettings.prototype, "child", void 0);
__decorate$5([
    Property([])
], FieldsSettings.prototype, "dataSource", void 0);
__decorate$5([
    Property('expanded')
], FieldsSettings.prototype, "expanded", void 0);
__decorate$5([
    Property('hasChildren')
], FieldsSettings.prototype, "hasChildren", void 0);
__decorate$5([
    Property('htmlAttributes')
], FieldsSettings.prototype, "htmlAttributes", void 0);
__decorate$5([
    Property('iconCss')
], FieldsSettings.prototype, "iconCss", void 0);
__decorate$5([
    Property('id')
], FieldsSettings.prototype, "id", void 0);
__decorate$5([
    Property('imageUrl')
], FieldsSettings.prototype, "imageUrl", void 0);
__decorate$5([
    Property('isChecked')
], FieldsSettings.prototype, "isChecked", void 0);
__decorate$5([
    Property('parentID')
], FieldsSettings.prototype, "parentID", void 0);
__decorate$5([
    Property(null)
], FieldsSettings.prototype, "query", void 0);
__decorate$5([
    Property('selected')
], FieldsSettings.prototype, "selected", void 0);
__decorate$5([
    Property(null)
], FieldsSettings.prototype, "tableName", void 0);
__decorate$5([
    Property('text')
], FieldsSettings.prototype, "text", void 0);
__decorate$5([
    Property('tooltip')
], FieldsSettings.prototype, "tooltip", void 0);
__decorate$5([
    Property('navigateUrl')
], FieldsSettings.prototype, "navigateUrl", void 0);
/**
 * Configures animation settings for the TreeView component.
 */
class ActionSettings extends ChildProperty {
}
__decorate$5([
    Property('SlideDown')
], ActionSettings.prototype, "effect", void 0);
__decorate$5([
    Property(400)
], ActionSettings.prototype, "duration", void 0);
__decorate$5([
    Property('linear')
], ActionSettings.prototype, "easing", void 0);
/**
 * Configures the animation settings for expanding and collapsing nodes in TreeView.
 */
class NodeAnimationSettings extends ChildProperty {
}
__decorate$5([
    Complex({ effect: 'SlideUp', duration: 400, easing: 'linear' }, ActionSettings)
], NodeAnimationSettings.prototype, "collapse", void 0);
__decorate$5([
    Complex({ effect: 'SlideDown', duration: 400, easing: 'linear' }, ActionSettings)
], NodeAnimationSettings.prototype, "expand", void 0);
/**
 * The TreeView component is used to represent hierarchical data in a tree like structure with advanced
 * functions to perform edit, drag and drop, selection with check-box, and more.
 * ```html
 *  <div id="tree"></div>
 * ```
 * ```typescript
 *  let treeObj: TreeView = new TreeView();
 *  treeObj.appendTo('#tree');
 * ```
 */
let TreeView = class TreeView extends Component {
    constructor(options, element) {
        super(options, element);
        this.mouseDownStatus = false;
    }
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'treeview';
    }
    /**
     * Initialize the event handler
     */
    preRender() {
        this.checkActionNodes = [];
        this.dragStartAction = false;
        this.isAnimate = false;
        this.keyConfigs = {
            escape: 'escape',
            end: 'end',
            enter: 'enter',
            f2: 'f2',
            home: 'home',
            moveDown: 'downarrow',
            moveLeft: 'leftarrow',
            moveRight: 'rightarrow',
            moveUp: 'uparrow',
            ctrlDown: 'ctrl+downarrow',
            ctrlUp: 'ctrl+uparrow',
            ctrlEnter: 'ctrl+enter',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
            ctrlA: 'ctrl+A',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftEnter: 'shift+enter',
            shiftHome: 'shift+home',
            shiftEnd: 'shift+end',
            csDown: 'ctrl+shift+downarrow',
            csUp: 'ctrl+shift+uparrow',
            csEnter: 'ctrl+shift+enter',
            csHome: 'ctrl+shift+home',
            csEnd: 'ctrl+shift+end',
            space: 'space',
        };
        this.listBaseOption = {
            expandCollapse: true,
            fields: this.fields.properties,
            showIcon: true,
            expandIconClass: EXPANDABLE,
            ariaAttributes: treeAriaAttr,
            expandIconPosition: 'Left',
            itemCreated: (e) => {
                this.beforeNodeCreate(e);
            },
        };
        this.listBaseOption.fields.url = this.fields.navigateUrl;
        this.aniObj = new Animation({});
        this.treeList = [];
        this.isLoaded = false;
        this.setTouchClass();
        if (isNullOrUndefined(this.selectedNodes)) {
            this.setProperties({ selectedNodes: [] }, true);
        }
        if (isNullOrUndefined(this.checkedNodes)) {
            this.setProperties({ checkedNodes: [] }, true);
        }
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     * @hidden
     */
    getPersistData() {
        let keyEntity = ['selectedNodes', 'checkedNodes'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
        this.isAnimate = true;
        this.initialize();
        this.setDataBinding();
        this.setExpandOnType();
        this.setRipple();
        this.wireEditingEvents(this.allowEditing);
        this.setDragAndDrop(this.allowDragAndDrop);
        this.wireEvents();
    }
    initialize() {
        this.element.setAttribute('role', 'tree');
        this.element.setAttribute('tabindex', '0');
        this.element.setAttribute('aria-activedescendant', this.element.id + '_active');
        this.setCssClass(null, this.cssClass);
        this.setEnableRtl();
        this.setFullRow(this.fullRowSelect);
        this.nodeTemplateFn = this.templateComplier(this.nodeTemplate);
    }
    setEnableRtl() {
        this.enableRtl ? addClass([this.element], RTL$1) : removeClass([this.element], RTL$1);
    }
    setRipple() {
        let tempStr = '.' + FULLROW + ',.' + TEXTWRAP;
        let rippleModel = {
            selector: tempStr,
            ignore: '.' + TEXTWRAP + ' > .' + ICON + ',.' + INPUTGROUP + ',.' + INPUT + ', .' + CHECKBOXWRAP
        };
        this.rippleFn = rippleEffect(this.element, rippleModel);
        let iconModel = {
            selector: '.' + TEXTWRAP + ' > .' + ICON,
            isCenterRipple: true,
        };
        this.rippleIconFn = rippleEffect(this.element, iconModel);
    }
    setFullRow(isEnabled) {
        isEnabled ? addClass([this.element], FULLROWWRAP) : removeClass([this.element], FULLROWWRAP);
    }
    setMultiSelect(isEnabled) {
        let firstUl = select('.' + PARENTITEM, this.element);
        if (isEnabled) {
            firstUl.setAttribute('aria-multiselectable', 'true');
        }
        else {
            firstUl.removeAttribute('aria-multiselectable');
        }
    }
    templateComplier(template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (e) {
                return compile(template);
            }
        }
        return undefined;
    }
    setDataBinding() {
        this.treeList.push('false');
        if (this.fields.dataSource instanceof DataManager) {
            this.fields.dataSource.executeQuery(this.getQuery(this.fields)).then((e) => {
                this.treeList.pop();
                this.treeData = e.result;
                this.isNumberTypeId = this.getType();
                this.setRootData();
                this.renderItems(true);
                if (this.treeList.length === 0 && !this.isLoaded) {
                    this.finalize();
                }
            });
        }
        else {
            this.treeList.pop();
            if (isNullOrUndefined(this.fields.dataSource)) {
                this.rootData = this.treeData = [];
            }
            else {
                this.treeData = this.fields.dataSource;
                this.setRootData();
            }
            this.renderItems(false);
        }
        if (this.treeList.length === 0 && !this.isLoaded) {
            this.finalize();
        }
    }
    getQuery(mapper, value = null) {
        let columns = [];
        let query;
        if (!mapper.query) {
            query = new Query();
            let prop = this.getActualProperties(mapper);
            for (let col of Object.keys(prop)) {
                if (col !== 'dataSource' && col !== 'tableName' && col !== 'child' && !!mapper[col]
                    && columns.indexOf(mapper[col]) === -1) {
                    columns.push(mapper[col]);
                }
            }
            query.select(columns);
            if (prop.hasOwnProperty('tableName')) {
                query.from(mapper.tableName);
            }
        }
        else {
            query = mapper.query.clone();
        }
        ListBase.addSorting(this.sortOrder, mapper.text, query);
        if (!isNullOrUndefined(value) && !isNullOrUndefined(mapper.parentID)) {
            query.where(mapper.parentID, 'equal', (this.isNumberTypeId ? parseFloat(value) : value));
        }
        return query;
    }
    getType() {
        return this.treeData[0] ? ((typeof getValue(this.fields.id, this.treeData[0]) === 'number') ? true : false) : false;
    }
    setRootData() {
        this.dataType = this.getDataType(this.treeData, this.fields);
        if (this.dataType === 1) {
            this.groupedData = this.getGroupedData(this.treeData, this.fields.parentID);
            let rootItems = this.getChildNodes(this.treeData, undefined, true);
            if (isNullOrUndefined(rootItems)) {
                this.rootData = [];
            }
            else {
                this.rootData = rootItems;
            }
        }
        else {
            this.rootData = this.treeData;
        }
    }
    renderItems(isSorted) {
        this.listBaseOption.ariaAttributes.level = 1;
        this.ulElement = ListBase.createList(isSorted ? this.rootData : this.getSortedData(this.rootData), this.listBaseOption);
        this.element.appendChild(this.ulElement);
        this.finalizeNode(this.element);
    }
    beforeNodeCreate(e) {
        if (this.showCheckBox) {
            let checkboxEle = createCheckBox(true, { cssClass: this.touchClass });
            let icon = select('div.' + ICON, e.item);
            let id = e.item.getAttribute('data-uid');
            e.item.childNodes[0].insertBefore(checkboxEle, e.item.childNodes[0].childNodes[isNullOrUndefined(icon) ? 0 : 1]);
            let checkValue = getValue(e.fields.isChecked, e.curData);
            if (this.checkedNodes.indexOf(id) > -1) {
                select('.' + CHECKBOXFRAME, checkboxEle).classList.add(CHECK);
                checkboxEle.setAttribute('aria-checked', 'true');
                this.addCheck(e.item);
            }
            else if (!isNullOrUndefined(checkValue) && checkValue.toString() === 'true') {
                select('.' + CHECKBOXFRAME, checkboxEle).classList.add(CHECK);
                checkboxEle.setAttribute('aria-checked', 'true');
                this.addCheck(e.item);
            }
            else {
                checkboxEle.setAttribute('aria-checked', 'false');
            }
            let frame = select('.' + CHECKBOXFRAME, checkboxEle);
            EventHandler.add(frame, 'mousedown', this.frameMouseHandler, this);
            EventHandler.add(frame, 'mouseup', this.frameMouseHandler, this);
        }
        if (this.fullRowSelect) {
            this.createFullRow(e.item);
        }
        if (this.allowMultiSelection && !e.item.classList.contains(SELECTED$1)) {
            e.item.setAttribute('aria-selected', 'false');
        }
        let fields = e.fields;
        this.addActionClass(e, fields.selected, SELECTED$1);
        this.addActionClass(e, fields.expanded, EXPANDED);
        if (!isNullOrUndefined(this.nodeTemplateFn)) {
            let textEle = e.item.querySelector('.' + LISTTEXT);
            textEle.innerHTML = '';
            append(this.nodeTemplateFn(e.curData), textEle);
        }
        let eventArgs = {
            node: e.item,
            nodeData: e.curData,
            text: e.text,
        };
        this.trigger('drawNode', eventArgs);
    }
    frameMouseHandler(e) {
        let rippleSpan = select('.' + CHECKBOXRIPPLE, e.target.parentElement);
        rippleMouseHandler(e, rippleSpan);
    }
    addActionClass(e, action, cssClass) {
        let data = e.curData;
        let actionValue = getValue(action, data);
        if (!isNullOrUndefined(actionValue) && actionValue.toString() !== 'false') {
            e.item.classList.add(cssClass);
        }
    }
    getDataType(ds, mapper) {
        if (this.fields.dataSource instanceof DataManager) {
            for (let i = 0; i < ds.length; i++) {
                if ((typeof mapper.child === 'string') && isNullOrUndefined(getValue(mapper.child, ds[i]))) {
                    return 1;
                }
            }
            return 2;
        }
        for (let i = 0, len = ds.length; i < len; i++) {
            if ((typeof mapper.child === 'string') && !isNullOrUndefined(getValue(mapper.child, ds[i]))) {
                return 2;
            }
            if (!isNullOrUndefined(getValue(mapper.parentID, ds[i])) || !isNullOrUndefined(getValue(mapper.hasChildren, ds[i]))) {
                return 1;
            }
        }
        return 1;
    }
    getGroupedData(dataSource, groupBy) {
        let cusQuery = new Query().group(groupBy);
        let ds = ListBase.getDataSource(dataSource, cusQuery);
        let grpItem = [];
        for (let j = 0; j < ds.length; j++) {
            let itemObj = ds[j].items;
            grpItem.push(itemObj);
        }
        return grpItem;
    }
    getSortedData(list) {
        if (list && this.sortOrder !== 'None') {
            list = ListBase.getDataSource(list, ListBase.addSorting(this.sortOrder, this.fields.text));
        }
        return list;
    }
    finalizeNode(element) {
        let iNodes = selectAll('.' + IMAGE, element);
        for (let k = 0; k < iNodes.length; k++) {
            iNodes[k].setAttribute('alt', IMAGE);
        }
        if (this.isLoaded) {
            let sNodes = selectAll('.' + SELECTED$1, element);
            for (let i = 0; i < sNodes.length; i++) {
                this.selectNode(sNodes[i], null);
                break;
            }
            removeClass(sNodes, SELECTED$1);
        }
        let cNodes = selectAll('.' + LISTITEM + ':not(.' + EXPANDED + ')', element);
        for (let j = 0; j < cNodes.length; j++) {
            let icon = select('div.' + ICON, cNodes[j]);
            if (icon && icon.classList.contains(EXPANDABLE)) {
                cNodes[j].setAttribute('aria-expanded', 'false');
                addClass([cNodes[j]], NODECOLLAPSED);
            }
        }
        let eNodes = selectAll('.' + EXPANDED, element);
        for (let i = 0; i < eNodes.length; i++) {
            this.renderChildNodes(eNodes[i]);
        }
        removeClass(eNodes, EXPANDED);
        this.updateList();
        if (this.isLoaded) {
            this.updateCheckedProp();
        }
    }
    updateCheckedProp() {
        if (this.showCheckBox) {
            let nodes = [].concat([], this.checkedNodes);
            this.checkedNodes.forEach((value, index) => {
                let checkBox = this.element.querySelector('[data-uid="' + value + '"]');
                if (isNullOrUndefined(checkBox)) {
                    nodes = nodes.filter((e) => { return e !== value; });
                }
            });
            this.setProperties({ checkedNodes: nodes }, true);
        }
    }
    ensureParentCheckState(element) {
        if (!isNullOrUndefined(element)) {
            if (element.classList.contains(ROOT)) {
                return;
            }
            let ulElement = element;
            if (element.classList.contains(LISTITEM)) {
                ulElement = select('.' + PARENTITEM, element);
            }
            let checkedNodes = selectAll('.' + CHECK, ulElement);
            let nodes = selectAll('.' + LISTITEM, ulElement);
            let checkBoxEle = element.getElementsByClassName(CHECKBOXWRAP)[0];
            if (nodes.length === checkedNodes.length) {
                this.changeState(checkBoxEle, 'check', null, true, true);
            }
            else if (checkedNodes.length > 0) {
                this.changeState(checkBoxEle, 'indeterminate', null, true, true);
            }
            else if (checkedNodes.length === 0) {
                this.changeState(checkBoxEle, 'uncheck', null, true, true);
            }
            let parentUL = closest(element, '.' + PARENTITEM);
            if (!isNullOrUndefined(parentUL)) {
                let currentParent = closest(parentUL, '.' + LISTITEM);
                this.ensureParentCheckState(currentParent);
            }
        }
    }
    ensureChildCheckState(element, e) {
        if (!isNullOrUndefined(element)) {
            let childElement = select('.' + PARENTITEM, element);
            let checkBoxes;
            if (!isNullOrUndefined(childElement)) {
                checkBoxes = selectAll('.' + CHECKBOXWRAP, childElement);
                let isChecked = element.getElementsByClassName(CHECKBOXFRAME)[0].classList.contains(CHECK);
                let checkedState;
                for (let index = 0; index < checkBoxes.length; index++) {
                    if (!isNullOrUndefined(this.currentLoadData) && !isNullOrUndefined(getValue(this.fields.isChecked, this.currentLoadData[index]))) {
                        checkedState = getValue(this.fields.isChecked, this.currentLoadData[index]) ? 'check' : 'uncheck';
                    }
                    else {
                        let isNodeChecked = checkBoxes[index].getElementsByClassName(CHECKBOXFRAME)[0].classList.contains(CHECK);
                        checkedState = (!this.isLoaded && isNodeChecked) ? 'check' : (isChecked ? 'check' : 'uncheck');
                    }
                    this.changeState(checkBoxes[index], checkedState, e, true, true);
                }
            }
        }
    }
    doCheckBoxAction(nodes, doCheck) {
        if (!isNullOrUndefined(nodes)) {
            for (let i = 0, len = nodes.length; i < len; i++) {
                let liEle = this.getElement(nodes[i]);
                if (isNullOrUndefined(liEle)) {
                    continue;
                }
                let checkBox = select('.' + PARENTITEM + ' .' + CHECKBOXWRAP, liEle);
                this.validateCheckNode(checkBox, !doCheck, liEle, null);
            }
        }
        else {
            let checkBoxes = selectAll('.' + CHECKBOXWRAP, this.element);
            for (let index = 0; index < checkBoxes.length; index++) {
                this.changeState(checkBoxes[index], doCheck ? 'check' : 'uncheck');
            }
        }
    }
    changeState(wrapper, state, e, isPrevent, isAdd) {
        let ariaState;
        let eventArgs;
        let currLi = closest(wrapper, '.' + LISTITEM);
        if (!isPrevent) {
            this.checkActionNodes = [];
            eventArgs = this.getCheckEvent(currLi, state, e);
            this.trigger('nodeChecking', eventArgs);
            if (eventArgs.cancel) {
                return;
            }
        }
        let frameSpan = wrapper.getElementsByClassName(CHECKBOXFRAME)[0];
        if (state === 'check' && !frameSpan.classList.contains(CHECK)) {
            frameSpan.classList.remove(INDETERMINATE);
            frameSpan.classList.add(CHECK);
            this.addCheck(currLi);
            ariaState = 'true';
        }
        else if (state === 'uncheck' && (frameSpan.classList.contains(CHECK) || frameSpan.classList.contains(INDETERMINATE))) {
            removeClass([frameSpan], [CHECK, INDETERMINATE]);
            this.removeCheck(currLi);
            ariaState = 'false';
        }
        else if (state === 'indeterminate' && !frameSpan.classList.contains(INDETERMINATE)) {
            frameSpan.classList.remove(CHECK);
            frameSpan.classList.add(INDETERMINATE);
            this.removeCheck(currLi);
            ariaState = 'mixed';
        }
        ariaState = state === 'check' ? 'true' : state === 'uncheck' ? 'false' : ariaState;
        if (!isNullOrUndefined(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
        if (isAdd) {
            let data = [].concat([], this.checkActionNodes);
            eventArgs = this.getCheckEvent(currLi, state, e);
            if (isUndefined(isPrevent)) {
                eventArgs.data = data;
            }
        }
        if (!isPrevent) {
            if (!isNullOrUndefined(ariaState)) {
                wrapper.setAttribute('aria-checked', ariaState);
                eventArgs.data[0].checked = ariaState;
                this.trigger('nodeChecked', eventArgs);
                this.checkActionNodes = [];
            }
        }
    }
    addCheck(liEle) {
        let id = liEle.getAttribute('data-uid');
        if (!isNullOrUndefined(id) && this.checkedNodes.indexOf(id) === -1) {
            this.checkedNodes.push(id);
        }
    }
    removeCheck(liEle) {
        let index = this.checkedNodes.indexOf(liEle.getAttribute('data-uid'));
        if (index > -1) {
            this.checkedNodes.splice(index, 1);
        }
    }
    getCheckEvent(currLi, action, e) {
        this.checkActionNodes.push(this.getNodeData(currLi));
        let nodeData = this.checkActionNodes;
        return { action: action, cancel: false, isInteracted: isNullOrUndefined(e) ? false : true, node: currLi, data: nodeData };
    }
    finalize() {
        let firstUl = select('.' + PARENTITEM, this.element);
        firstUl.setAttribute('role', treeAriaAttr.treeRole);
        this.setMultiSelect(this.allowMultiSelection);
        let firstNode = select('.' + LISTITEM, this.element);
        if (firstNode) {
            addClass([firstNode], FOCUS);
            this.updateIdAttr(null, firstNode);
        }
        this.doSelectionAction();
        this.updateCheckedProp();
        this.isLoaded = true;
        this.isAnimate = false;
        let eventArgs = { data: this.treeData };
        this.trigger('dataBound', eventArgs);
    }
    doSelectionAction() {
        let sNodes = selectAll('.' + SELECTED$1, this.element);
        let sUids = this.selectedNodes;
        if (sUids.length > 0) {
            this.setProperties({ selectedNodes: [] }, true);
            for (let i = 0; i < sUids.length; i++) {
                let sNode = select('[data-uid="' + sUids[i] + '"]', this.element);
                this.selectNode(sNode, null, true);
                if (!this.allowMultiSelection) {
                    break;
                }
            }
        }
        else {
            this.selectGivenNodes(sNodes);
        }
        removeClass(sNodes, SELECTED$1);
    }
    selectGivenNodes(sNodes) {
        for (let i = 0; i < sNodes.length; i++) {
            this.selectNode(sNodes[i], null, true);
            if (!this.allowMultiSelection) {
                break;
            }
        }
    }
    clickHandler(event) {
        let target = event.originalEvent.target;
        EventHandler.remove(this.element, 'contextmenu', this.preventContextMenu);
        if (!target || this.dragStartAction) {
            return;
        }
        else {
            let classList$$1 = target.classList;
            let li = closest(target, '.' + LISTITEM);
            if (!li) {
                return;
            }
            else {
                this.removeHover();
                this.setFocusElement(li);
                if (this.showCheckBox && !li.classList.contains('e-disable')) {
                    let checkWrapper = closest(target, '.' + CHECKBOXWRAP);
                    if (!isNullOrUndefined(checkWrapper)) {
                        let checkElement = select('.' + CHECKBOXFRAME, checkWrapper);
                        this.validateCheckNode(checkWrapper, checkElement.classList.contains(CHECK), li, event.originalEvent);
                        this.triggerClickEvent(event.originalEvent, li);
                        return;
                    }
                }
                if (classList$$1.contains(EXPANDABLE)) {
                    this.expandAction(li, target, event);
                }
                else if (classList$$1.contains(COLLAPSIBLE)) {
                    this.collapseNode(li, target, event);
                }
                else {
                    if (!classList$$1.contains(PARENTITEM) && !classList$$1.contains(LISTITEM)) {
                        this.toggleSelect(li, event.originalEvent, false);
                    }
                }
                this.triggerClickEvent(event.originalEvent, li);
            }
        }
    }
    nodeCheckingEvent(wrapper, isCheck, e) {
        let currLi = closest(wrapper, '.' + LISTITEM);
        this.checkActionNodes = [];
        let ariaState = !isCheck ? 'true' : 'false';
        if (!isNullOrUndefined(ariaState)) {
            wrapper.setAttribute('aria-checked', ariaState);
        }
        let eventArgs = this.getCheckEvent(currLi, !isCheck ? 'uncheck' : 'check', e);
        this.trigger('nodeChecking', eventArgs);
        return eventArgs;
    }
    nodeCheckedEvent(wrapper, isCheck, e) {
        let currLi = closest(wrapper, '.' + LISTITEM);
        let eventArgs = this.getCheckEvent(wrapper, isCheck ? 'uncheck' : 'check', e);
        eventArgs.data = eventArgs.data.splice(0, eventArgs.data.length - 1);
        this.trigger('nodeChecked', eventArgs);
    }
    triggerClickEvent(e, li) {
        let eventArgs = {
            event: e,
            node: li,
        };
        this.trigger('nodeClicked', eventArgs);
    }
    expandNode(currLi, icon) {
        if (icon.classList.contains(LOAD)) {
            this.hideSpinner(icon);
        }
        removeClass([icon], EXPANDABLE);
        addClass([icon], COLLAPSIBLE);
        let start = 0;
        let end = 0;
        let proxy = this;
        let ul = select('.' + PARENTITEM, currLi);
        let liEle = currLi;
        this.setHeight(liEle, ul);
        if (!this.isAnimate) {
            this.aniObj.animate(ul, {
                name: this.animation.expand.effect,
                duration: this.animation.expand.duration,
                timingFunction: this.animation.expand.easing,
                begin: (args) => {
                    liEle.style.overflow = 'hidden';
                    start = liEle.offsetHeight;
                    end = select('.' + TEXTWRAP, currLi).offsetHeight;
                },
                progress: (args) => {
                    args.element.style.display = 'block';
                    proxy.animateHeight(args, start, end);
                },
                end: (args) => {
                    args.element.style.display = 'block';
                    this.expandedNode(liEle, ul, icon);
                }
            });
        }
        else {
            this.expandedNode(liEle, ul, icon);
        }
    }
    expandedNode(currLi, ul, icon) {
        ul.style.display = 'block';
        currLi.style.display = 'block';
        currLi.style.overflow = '';
        currLi.style.height = '';
        removeClass([icon], PROCESS);
        currLi.setAttribute('aria-expanded', 'true');
        removeClass([currLi], NODECOLLAPSED);
        if (this.isLoaded && this.expandArgs) {
            this.expandArgs = this.getExpandEvent(currLi, null);
            this.trigger('nodeExpanded', this.expandArgs);
        }
    }
    collapseNode(currLi, icon, e) {
        if (icon.classList.contains(PROCESS)) {
            return;
        }
        else {
            addClass([icon], PROCESS);
        }
        let colArgs;
        if (this.isLoaded) {
            colArgs = this.getExpandEvent(currLi, e);
            this.trigger('nodeCollapsing', colArgs);
            if (colArgs.cancel) {
                removeClass([icon], PROCESS);
                return;
            }
        }
        removeClass([icon], COLLAPSIBLE);
        addClass([icon], EXPANDABLE);
        let start = 0;
        let end = 0;
        let proxy = this;
        let ul = select('.' + PARENTITEM, currLi);
        let liEle = currLi;
        addClass([currLi], NODECOLLAPSED);
        this.aniObj.animate(ul, {
            name: this.animation.collapse.effect,
            duration: this.animation.collapse.duration,
            timingFunction: this.animation.collapse.easing,
            begin: (args) => {
                liEle.style.overflow = 'hidden';
                start = select('.' + TEXTWRAP, currLi).offsetHeight;
                end = liEle.offsetHeight;
            },
            progress: (args) => {
                proxy.animateHeight(args, start, end);
            },
            end: (args) => {
                liEle.style.overflow = '';
                args.element.style.display = 'none';
                liEle.style.height = '';
                removeClass([icon], PROCESS);
                currLi.setAttribute('aria-expanded', 'false');
                if (this.isLoaded) {
                    this.trigger('nodeCollapsed', colArgs);
                }
            }
        });
    }
    setHeight(currLi, ul) {
        ul.style.display = 'block';
        ul.style.visibility = 'hidden';
        currLi.style.height = currLi.offsetHeight + 'px';
        ul.style.display = 'none';
        ul.style.visibility = '';
    }
    animateHeight(args, start, end) {
        let remaining = (args.duration - args.timeStamp) / args.duration;
        let currentHeight = (end - start) * remaining + start;
        args.element.parentElement.style.height = currentHeight + 'px';
    }
    renderChildNodes(parentLi, expandChild) {
        let eicon = select('div.' + ICON, parentLi);
        if (isNullOrUndefined(eicon)) {
            return;
        }
        this.showSpinner(eicon);
        let childItems;
        if (this.fields.dataSource instanceof DataManager) {
            let level = this.parents(parentLi, '.' + PARENTITEM).length;
            let mapper = this.getChildFields(this.fields, level, 1);
            if (isNullOrUndefined(mapper) || isNullOrUndefined(mapper.dataSource)) {
                detach(eicon);
                parentLi.removeAttribute('aria-expanded');
                return;
            }
            this.treeList.push('false');
            mapper.dataSource.executeQuery(this.getQuery(mapper, parentLi.getAttribute('data-uid'))).then((e) => {
                this.treeList.pop();
                childItems = e.result;
                this.currentLoadData = childItems;
                if (isNullOrUndefined(childItems) || childItems.length === 0) {
                    detach(eicon);
                    parentLi.removeAttribute('aria-expanded');
                }
                else {
                    let prop = this.getActualProperties(mapper);
                    this.listBaseOption.fields = prop;
                    this.listBaseOption.fields.url = prop.navigateUrl;
                    let id = parentLi.getAttribute('data-uid');
                    let nodeData = this.getNodeObject(id);
                    setValue('child', childItems, nodeData);
                    this.listBaseOption.ariaAttributes.level = parseFloat(parentLi.getAttribute('aria-level')) + 1;
                    parentLi.appendChild(ListBase.createList(childItems, this.listBaseOption));
                    this.expandNode(parentLi, eicon);
                    this.ensureCheckNode(parentLi);
                    this.finalizeNode(parentLi);
                    this.renderSubChild(parentLi, expandChild);
                }
                if (this.treeList.length === 0 && !this.isLoaded) {
                    this.finalize();
                }
            });
        }
        else {
            childItems = this.getChildNodes(this.treeData, parentLi.getAttribute('data-uid'));
            this.currentLoadData = childItems;
            if (isNullOrUndefined(childItems) || childItems.length === 0) {
                detach(eicon);
                parentLi.removeAttribute('aria-expanded');
                return;
            }
            else {
                this.listBaseOption.ariaAttributes.level = parseFloat(parentLi.getAttribute('aria-level')) + 1;
                parentLi.appendChild(ListBase.createList(this.getSortedData(childItems), this.listBaseOption));
                this.expandNode(parentLi, eicon);
                this.ensureCheckNode(parentLi);
                this.finalizeNode(parentLi);
                this.renderSubChild(parentLi, expandChild);
            }
        }
    }
    ensureCheckNode(element) {
        if (this.showCheckBox) {
            this.ensureChildCheckState(element);
            this.ensureParentCheckState(element);
        }
        this.currentLoadData = null;
    }
    getFields(mapper, nodeLevel, dataLevel) {
        if (nodeLevel === dataLevel) {
            return mapper;
        }
        else {
            return this.getFields(this.getChildMapper(mapper), nodeLevel, dataLevel + 1);
        }
    }
    getChildFields(mapper, nodeLevel, dataLevel) {
        if (nodeLevel === dataLevel) {
            return this.getChildMapper(mapper);
        }
        else {
            return this.getChildFields(this.getChildMapper(mapper), nodeLevel, dataLevel + 1);
        }
    }
    getChildMapper(mapper) {
        return (typeof mapper.child === 'string' || isNullOrUndefined(mapper.child)) ? mapper : mapper.child;
    }
    getChildNodes(obj, parentId, isRoot = false) {
        let childNodes;
        if (isNullOrUndefined(obj)) {
            return childNodes;
        }
        else if (this.dataType === 1) {
            return this.getChildGroup(this.groupedData, parentId, isRoot);
        }
        else {
            if (typeof this.fields.child === 'string') {
                for (let i = 0, objlen = obj.length; i < objlen; i++) {
                    let dataId = getValue(this.fields.id, obj[i]);
                    if (dataId && dataId.toString() === parentId) {
                        return getValue(this.fields.child, obj[i]);
                    }
                    else if (!isNullOrUndefined(getValue(this.fields.child, obj[i]))) {
                        childNodes = this.getChildNodes(getValue(this.fields.child, obj[i]), parentId);
                        if (childNodes !== undefined) {
                            break;
                        }
                    }
                }
            }
        }
        return childNodes;
    }
    getChildGroup(data, parentId, isRoot) {
        let childNodes;
        if (isNullOrUndefined(data)) {
            return childNodes;
        }
        for (let i = 0, objlen = data.length; i < objlen; i++) {
            if (!isNullOrUndefined(data[i][0]) && !isNullOrUndefined(getValue(this.fields.parentID, data[i][0]))) {
                if (getValue(this.fields.parentID, data[i][0]).toString() === parentId) {
                    return data[i];
                }
            }
            else if (isRoot) {
                return data[i];
            }
            else {
                return [];
            }
        }
        return childNodes;
    }
    renderSubChild(element, expandChild) {
        if (expandChild) {
            let cIcons = selectAll('.' + EXPANDABLE, element);
            for (let i = 0, len = cIcons.length; i < len; i++) {
                let icon = cIcons[i];
                let curLi = closest(icon, '.' + LISTITEM);
                this.expandArgs = this.getExpandEvent(curLi, null);
                this.trigger('nodeExpanding', this.expandArgs);
                this.renderChildNodes(curLi, expandChild);
            }
        }
    }
    toggleSelect(li, e, multiSelect) {
        if (!li.classList.contains('e-disable')) {
            if (this.allowMultiSelection && ((e && e.ctrlKey) || multiSelect) && this.isActive(li)) {
                this.unselectNode(li, e);
            }
            else {
                this.selectNode(li, e, multiSelect);
            }
        }
    }
    isActive(li) {
        return li.classList.contains(ACTIVE) ? true : false;
    }
    selectNode(li, e, multiSelect) {
        if (isNullOrUndefined(li) || (!this.allowMultiSelection && this.isActive(li) && !isNullOrUndefined(e))) {
            this.setFocusElement(li);
            return;
        }
        let eventArgs;
        if (this.isLoaded) {
            eventArgs = this.getSelectEvent(li, 'select', e);
            this.trigger('nodeSelecting', eventArgs);
            if (eventArgs.cancel) {
                return;
            }
        }
        if (!this.allowMultiSelection || (!multiSelect && (!e || (e && !e.ctrlKey)))) {
            this.removeSelectAll();
        }
        if (this.allowMultiSelection && e && e.shiftKey) {
            if (!this.startNode) {
                this.startNode = li;
            }
            let startIndex = this.liList.indexOf(this.startNode);
            let endIndex = this.liList.indexOf(li);
            if (startIndex > endIndex) {
                let temp = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for (let i = startIndex; i <= endIndex; i++) {
                let currNode = this.liList[i];
                if (isVisible(currNode)) {
                    this.addSelect(currNode);
                }
            }
        }
        else {
            this.startNode = li;
            this.addSelect(li);
        }
        this.setFocusElement(li);
        if (this.isLoaded) {
            this.trigger('nodeSelected', eventArgs);
        }
    }
    unselectNode(li, e) {
        let eventArgs;
        if (this.isLoaded) {
            eventArgs = this.getSelectEvent(li, 'un-select', e);
            this.trigger('nodeSelecting', eventArgs);
            if (eventArgs.cancel) {
                return;
            }
        }
        this.removeSelect(li);
        this.setFocusElement(li);
        if (this.isLoaded) {
            this.trigger('nodeSelected', eventArgs);
        }
    }
    setFocusElement(li) {
        if (!isNullOrUndefined(li)) {
            let focusedNode = this.getFocusedNode();
            if (focusedNode) {
                removeClass([focusedNode], FOCUS);
            }
            addClass([li], FOCUS);
            this.updateIdAttr(focusedNode, li);
        }
    }
    addSelect(liEle) {
        liEle.setAttribute('aria-selected', 'true');
        addClass([liEle], ACTIVE);
        let id = liEle.getAttribute('data-uid');
        if (!isNullOrUndefined(id) && this.selectedNodes.indexOf(id) === -1) {
            this.selectedNodes.push(id);
        }
    }
    removeSelect(liEle) {
        if (this.allowMultiSelection) {
            liEle.setAttribute('aria-selected', 'false');
        }
        else {
            liEle.removeAttribute('aria-selected');
        }
        removeClass([liEle], ACTIVE);
        let index = this.selectedNodes.indexOf(liEle.getAttribute('data-uid'));
        if (index > -1) {
            this.selectedNodes.splice(index, 1);
        }
    }
    removeSelectAll() {
        let selectedLI = this.element.querySelectorAll('.' + ACTIVE);
        for (let ele of selectedLI) {
            if (this.allowMultiSelection) {
                ele.setAttribute('aria-selected', 'false');
            }
            else {
                ele.removeAttribute('aria-selected');
            }
        }
        removeClass(selectedLI, ACTIVE);
        this.setProperties({ selectedNodes: [] }, true);
    }
    getSelectEvent(currLi, action, e) {
        let nodeData = this.getNodeData(currLi);
        return { action: action, cancel: false, isInteracted: isNullOrUndefined(e) ? false : true, node: currLi, nodeData: nodeData };
    }
    setExpandOnType() {
        this.expandOnType = (this.expandOn === 'Auto') ? (Browser.isDevice ? 'Click' : 'DblClick') : this.expandOn;
    }
    expandHandler(e) {
        let target = e.originalEvent.target;
        if (!target || target.classList.contains(INPUT) || target.classList.contains(ROOT) ||
            target.classList.contains(PARENTITEM) || target.classList.contains(LISTITEM) ||
            target.classList.contains(ICON) || this.showCheckBox && closest(target, '.' + CHECKBOXWRAP)) {
            return;
        }
        else {
            this.expandCollapseAction(closest(target, '.' + LISTITEM), e);
        }
    }
    expandCollapseAction(currLi, e) {
        let icon = select('div.' + ICON, currLi);
        if (!icon || icon.classList.contains(PROCESS)) {
            return;
        }
        else {
            let classList$$1 = icon.classList;
            if (classList$$1.contains(EXPANDABLE)) {
                this.expandAction(currLi, icon, e);
            }
            else {
                this.collapseNode(currLi, icon, e);
            }
        }
    }
    expandAction(currLi, icon, e, expandChild) {
        if (icon.classList.contains(PROCESS)) {
            return;
        }
        else {
            addClass([icon], PROCESS);
        }
        if (this.isLoaded) {
            this.expandArgs = this.getExpandEvent(currLi, e);
            this.trigger('nodeExpanding', this.expandArgs);
            if (this.expandArgs.cancel) {
                removeClass([icon], PROCESS);
                return;
            }
        }
        let ul = select('.' + PARENTITEM, currLi);
        if (ul && ul.nodeName === 'UL') {
            this.expandNode(currLi, icon);
        }
        else {
            this.renderChildNodes(currLi, expandChild);
        }
    }
    keyActionHandler(e) {
        let target = e.target;
        let focusedNode = this.getFocusedNode();
        if (target && target.classList.contains(INPUT)) {
            let inpEle = target;
            if (e.action === 'enter') {
                inpEle.blur();
                this.element.focus();
                addClass([focusedNode], HOVER);
            }
            else if (e.action === 'escape') {
                inpEle.value = this.oldText;
                inpEle.blur();
                this.element.focus();
                addClass([focusedNode], HOVER);
            }
            return;
        }
        e.preventDefault();
        let eventArgs = {
            cancel: false,
            event: e,
            node: focusedNode,
        };
        this.trigger('keyPress', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        switch (e.action) {
            case 'space':
                if (this.showCheckBox) {
                    this.checkNode(e);
                }
                break;
            case 'moveRight':
                this.openNode(this.enableRtl ? false : true, e);
                break;
            case 'moveLeft':
                this.openNode(this.enableRtl ? true : false, e);
                break;
            case 'shiftDown':
                this.shiftKeySelect(true, e);
                break;
            case 'moveDown':
            case 'ctrlDown':
            case 'csDown':
                this.navigateNode(true);
                break;
            case 'shiftUp':
                this.shiftKeySelect(false, e);
                break;
            case 'moveUp':
            case 'ctrlUp':
            case 'csUp':
                this.navigateNode(false);
                break;
            case 'home':
            case 'shiftHome':
            case 'ctrlHome':
            case 'csHome':
                this.navigateRootNode(true);
                break;
            case 'end':
            case 'shiftEnd':
            case 'ctrlEnd':
            case 'csEnd':
                this.navigateRootNode(false);
                break;
            case 'enter':
            case 'ctrlEnter':
            case 'shiftEnter':
            case 'csEnter':
                this.toggleSelect(focusedNode, e);
                break;
            case 'f2':
                if (this.allowEditing) {
                    this.createTextbox(focusedNode, e);
                }
                break;
            case 'ctrlA':
                if (this.allowMultiSelection) {
                    let sNodes = selectAll('.' + LISTITEM + ':not(.' + ACTIVE + ')', this.element);
                    this.selectGivenNodes(sNodes);
                }
                break;
        }
    }
    navigateToFocus(isUp) {
        let focusNode = this.getFocusedNode().querySelector('.' + TEXTWRAP);
        let pos = focusNode.getBoundingClientRect();
        let parent = this.getScrollParent(this.element);
        if (!isNullOrUndefined(parent)) {
            let parentPos = parent.getBoundingClientRect();
            if (pos.bottom > parentPos.bottom) {
                parent.scrollTop += pos.bottom - parentPos.bottom;
            }
            else if (pos.top < parentPos.top) {
                parent.scrollTop -= parentPos.top - pos.top;
            }
        }
        let isVisible$$1 = this.isVisibleInViewport(focusNode);
        if (!isVisible$$1) {
            focusNode.scrollIntoView(isUp);
        }
    }
    isVisibleInViewport(txtWrap) {
        let pos = txtWrap.getBoundingClientRect();
        return (pos.top >= 0 && pos.left >= 0 && pos.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            pos.right <= (window.innerWidth || document.documentElement.clientWidth));
    }
    getScrollParent(node) {
        if (isNullOrUndefined(node)) {
            return null;
        }
        return (node.scrollHeight > node.clientHeight) ? node : this.getScrollParent(node.parentElement);
    }
    shiftKeySelect(isTowards, e) {
        if (this.allowMultiSelection) {
            let focusedNode = this.getFocusedNode();
            let nextNode = isTowards ? this.getNextNode(focusedNode) : this.getPrevNode(focusedNode);
            this.removeHover();
            this.setFocusElement(nextNode);
            this.toggleSelect(nextNode, e, false);
            this.navigateToFocus(!isTowards);
        }
        else {
            this.navigateNode(isTowards);
        }
    }
    checkNode(e) {
        let focusedNode = this.getFocusedNode();
        let checkWrap = select('.' + CHECKBOXWRAP, focusedNode);
        let isChecked = select(' .' + CHECKBOXFRAME, checkWrap).classList.contains(CHECK);
        this.validateCheckNode(checkWrap, isChecked, focusedNode, e);
    }
    validateCheckNode(checkWrap, isCheck, li, e) {
        let eventArgs = this.nodeCheckingEvent(checkWrap, isCheck, e);
        if (eventArgs.cancel) {
            return;
        }
        this.changeState(checkWrap, isCheck ? 'uncheck' : 'check', e, true);
        this.ensureChildCheckState(li);
        this.ensureParentCheckState(closest(closest(li, '.' + PARENTITEM), '.' + LISTITEM));
        this.nodeCheckedEvent(checkWrap, isCheck, e);
    }
    openNode(toBeOpened, e) {
        let focusedNode = this.getFocusedNode();
        let icon = select('div.' + ICON, focusedNode);
        if (toBeOpened) {
            if (!icon) {
                return;
            }
            else if (icon.classList.contains(EXPANDABLE)) {
                this.expandAction(focusedNode, icon, e);
            }
            else {
                this.focusNextNode(focusedNode, true);
            }
        }
        else {
            if (icon && icon.classList.contains(COLLAPSIBLE)) {
                this.collapseNode(focusedNode, icon, e);
            }
            else {
                let parentLi = closest(closest(focusedNode, '.' + PARENTITEM), '.' + LISTITEM);
                if (!parentLi) {
                    return;
                }
                else {
                    this.setFocus(focusedNode, parentLi);
                    this.navigateToFocus(true);
                }
            }
        }
    }
    navigateNode(isTowards) {
        let focusedNode = this.getFocusedNode();
        this.focusNextNode(focusedNode, isTowards);
    }
    navigateRootNode(isBackwards) {
        let focusedNode = this.getFocusedNode();
        let rootNode = isBackwards ? this.getRootNode() : this.getEndNode();
        this.setFocus(focusedNode, rootNode);
        this.navigateToFocus(isBackwards);
    }
    getFocusedNode() {
        let fNode = select('.' + LISTITEM + '.' + FOCUS, this.element);
        return isNullOrUndefined(fNode) ? select('.' + LISTITEM, this.element) : fNode;
    }
    focusNextNode(li, isTowards) {
        let nextNode = isTowards ? this.getNextNode(li) : this.getPrevNode(li);
        this.setFocus(li, nextNode);
        this.navigateToFocus(!isTowards);
        if (nextNode.classList.contains('e-disable')) {
            this.focusNextNode(nextNode, isTowards);
        }
    }
    getNextNode(li) {
        let index = this.liList.indexOf(li);
        let nextNode;
        let i;
        do {
            index++;
            if (index === this.liList.length && li.classList.contains('e-disable')) {
                for (i = index - 1; i > 0; i--) {
                    if (!this.liList[i].classList.contains('e-disable')) {
                        index = i;
                        break;
                    }
                }
            }
            nextNode = this.liList[index];
            if (isNullOrUndefined(nextNode)) {
                return li;
            }
        } while (!isVisible(nextNode));
        return nextNode;
    }
    getPrevNode(li) {
        let index = this.liList.indexOf(li);
        let prevNode;
        let i;
        do {
            index--;
            if (index < 0 && li.classList.contains('e-disable')) {
                for (i = 1; i < this.liList.length; i++) {
                    if (!this.liList[i].classList.contains('e-disable')) {
                        index = i;
                        break;
                    }
                }
            }
            prevNode = this.liList[index];
            if (isNullOrUndefined(prevNode)) {
                return li;
            }
        } while (!isVisible(prevNode));
        return prevNode;
    }
    getRootNode() {
        let index = 0;
        let rootNode;
        do {
            rootNode = this.liList[index];
            index++;
        } while (!isVisible(rootNode));
        return rootNode;
    }
    getEndNode() {
        let index = this.liList.length - 1;
        let endNode;
        do {
            endNode = this.liList[index];
            index--;
        } while (!isVisible(endNode));
        return endNode;
    }
    setFocus(preNode, nextNode) {
        removeClass([preNode], [HOVER, FOCUS]);
        addClass([nextNode], [HOVER, FOCUS]);
        this.updateIdAttr(preNode, nextNode);
    }
    updateIdAttr(preNode, nextNode) {
        this.element.removeAttribute('aria-activedescendant');
        if (preNode) {
            preNode.removeAttribute('id');
        }
        nextNode.setAttribute('id', this.element.id + '_active');
        this.element.setAttribute('aria-activedescendant', this.element.id + '_active');
    }
    focusIn() {
        if (!this.mouseDownStatus) {
            addClass([this.getFocusedNode()], HOVER);
        }
        this.mouseDownStatus = false;
    }
    focusOut() {
        removeClass([this.getFocusedNode()], HOVER);
    }
    onMouseOver(e) {
        let target = e.target;
        let classList$$1 = target.classList;
        let currentLi = closest(target, '.' + LISTITEM);
        if (!currentLi || classList$$1.contains(PARENTITEM) || classList$$1.contains(LISTITEM)) {
            this.removeHover();
            return;
        }
        else {
            if (currentLi && !currentLi.classList.contains('e-disable')) {
                this.setHover(currentLi);
            }
        }
    }
    setHover(li) {
        if (!li.classList.contains(HOVER)) {
            this.removeHover();
            addClass([li], HOVER);
        }
    }
    ;
    onMouseLeave(e) {
        this.removeHover();
    }
    removeHover() {
        let hoveredNode = selectAll('.' + HOVER, this.element);
        if (hoveredNode && hoveredNode.length) {
            removeClass(hoveredNode, HOVER);
        }
    }
    ;
    getNodeData(currLi, fromDS) {
        if (!isNullOrUndefined(currLi) && currLi.classList.contains(LISTITEM)) {
            let id = currLi.getAttribute('data-uid');
            let text = this.getText(currLi, fromDS);
            let pNode = closest(currLi.parentNode, '.' + LISTITEM);
            let pid = pNode ? pNode.getAttribute('data-uid') : null;
            let selected = currLi.classList.contains(ACTIVE);
            let expanded = (currLi.getAttribute('aria-expanded') === 'true') ? true : false;
            let checked = null;
            if (this.showCheckBox) {
                checked = select('.' + CHECKBOXWRAP, currLi).getAttribute('aria-checked');
            }
            return { id: id, text: text, parentID: pid, selected: selected, expanded: expanded, isChecked: checked };
        }
        return { id: '', text: '', parentID: '', selected: '', expanded: '', isChecked: '' };
    }
    getText(currLi, fromDS) {
        if (fromDS) {
            let nodeData = this.getNodeObject(currLi.getAttribute('data-uid'));
            let level = parseFloat(currLi.getAttribute('aria-level'));
            let nodeFields = this.getFields(this.fields, level, 1);
            return getValue(nodeFields.text, nodeData);
        }
        return select('.' + LISTTEXT, currLi).textContent;
    }
    getExpandEvent(currLi, e) {
        let nodeData = this.getNodeData(currLi);
        return { cancel: false, isInteracted: isNullOrUndefined(e) ? false : true, node: currLi, nodeData: nodeData, event: e };
    }
    reRenderNodes() {
        this.element.innerHTML = '';
        this.setTouchClass();
        this.setProperties({ selectedNodes: [], checkedNodes: [] }, true);
        this.isLoaded = false;
        this.setDataBinding();
    }
    setCssClass(oldClass, newClass) {
        if (!isNullOrUndefined(oldClass) && oldClass !== '') {
            removeClass([this.element], oldClass.split(' '));
        }
        if (!isNullOrUndefined(newClass) && newClass !== '') {
            addClass([this.element], newClass.split(' '));
        }
    }
    editingHandler(e) {
        let target = e.target;
        if (!target || target.classList.contains(ROOT) || target.classList.contains(PARENTITEM) ||
            target.classList.contains(LISTITEM) || target.classList.contains(ICON) ||
            target.classList.contains(INPUT) || target.classList.contains(INPUTGROUP)) {
            return;
        }
        else {
            let liEle = closest(target, '.' + LISTITEM);
            this.createTextbox(liEle, e);
        }
    }
    createTextbox(liEle, e) {
        let oldInpEle = select('.' + TREEINPUT, this.element);
        if (oldInpEle) {
            oldInpEle.blur();
        }
        let textEle = select('.' + LISTTEXT, liEle);
        this.updateOldText(liEle);
        let innerEle = createElement('input', { className: TREEINPUT, attrs: { value: this.oldText } });
        let eventArgs = this.getEditEvent(liEle, null, innerEle.outerHTML);
        this.trigger('nodeEditing', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        let inpWidth = textEle.offsetWidth + 5;
        let style = 'width:' + inpWidth + 'px';
        addClass([liEle], EDITING);
        textEle.innerHTML = eventArgs.innerHtml;
        let inpEle = select('.' + TREEINPUT, textEle);
        this.inputObj = Input.createInput({
            element: inpEle,
            properties: {
                enableRtl: this.enableRtl,
            }
        });
        this.inputObj.container.setAttribute('style', style);
        inpEle.focus();
        let inputEle = inpEle;
        inputEle.setSelectionRange(0, inputEle.value.length);
        this.wireInputEvents(inpEle);
    }
    updateOldText(liEle) {
        let id = liEle.getAttribute('data-uid');
        this.editData = this.getNodeObject(id);
        let level = parseFloat(liEle.getAttribute('aria-level'));
        this.editFields = this.getFields(this.fields, level, 1);
        this.oldText = getValue(this.editFields.text, this.editData);
    }
    inputFocusOut(e) {
        if (!select('.' + TREEINPUT, this.element)) {
            return;
        }
        let target = e.target;
        let newText = target.value;
        let txtEle = closest(target, '.' + LISTTEXT);
        let liEle = closest(target, '.' + LISTITEM);
        detach(this.inputObj.container);
        this.appendNewText(liEle, txtEle, newText, true);
    }
    appendNewText(liEle, txtEle, newText, isInput) {
        let newData = setValue(this.editFields.text, newText, this.editData);
        if (!isNullOrUndefined(this.nodeTemplateFn)) {
            txtEle.innerHTML = '';
            append(this.nodeTemplateFn(newData), txtEle);
        }
        else {
            txtEle.innerHTML = newText;
        }
        if (isInput) {
            removeClass([liEle], EDITING);
            txtEle.focus();
        }
        this.trigger('nodeEdited', this.getEditEvent(liEle, newText, null));
    }
    getElement(ele) {
        if (isNullOrUndefined(ele)) {
            return null;
        }
        else if (typeof ele === 'string') {
            return this.element.querySelector('[data-uid="' + ele + '"]');
        }
        else if (typeof ele === 'object') {
            return ele;
        }
        else {
            return null;
        }
    }
    getEditEvent(liEle, newText, inpEle) {
        let data = this.getNodeData(liEle);
        return { cancel: false, newText: newText, node: liEle, nodeData: data, oldText: this.oldText, innerHtml: inpEle };
    }
    getNodeObject(id) {
        let childNodes;
        if (isNullOrUndefined(id)) {
            return childNodes;
        }
        else if (this.dataType === 1) {
            for (let i = 0, objlen = this.treeData.length; i < objlen; i++) {
                let dataId = getValue(this.fields.id, this.treeData[i]);
                if (!isNullOrUndefined(this.treeData[i]) && !isNullOrUndefined(dataId) && dataId.toString() === id) {
                    return this.treeData[i];
                }
            }
        }
        else {
            return this.getChildNodeObject(this.treeData, this.fields, id);
        }
        return childNodes;
    }
    getChildNodeObject(obj, mapper, id) {
        let newList;
        if (isNullOrUndefined(obj)) {
            return newList;
        }
        for (let i = 0, objlen = obj.length; i < objlen; i++) {
            let dataId = getValue(mapper.id, obj[i]);
            if (obj[i] && dataId && dataId.toString() === id) {
                return obj[i];
            }
            else if (typeof mapper.child === 'string' && !isNullOrUndefined(getValue(mapper.child, obj[i]))) {
                let childData = getValue(mapper.child, obj[i]);
                newList = this.getChildNodeObject(childData, this.getChildMapper(mapper), id);
                if (newList !== undefined) {
                    break;
                }
            }
            else if (this.fields.dataSource instanceof DataManager && !isNullOrUndefined(getValue('child', obj[i]))) {
                let child = 'child';
                newList = this.getChildNodeObject(getValue(child, obj[i]), this.getChildMapper(mapper), id);
                if (newList !== undefined) {
                    break;
                }
            }
        }
        return newList;
    }
    setDragAndDrop(toBind) {
        if (toBind) {
            this.initializeDrag();
        }
        else {
            this.destroyDrag();
        }
    }
    initializeDrag() {
        let virtualEle;
        this.dragObj = new Draggable(this.element, {
            enableTailMode: true,
            dragTarget: '.' + TEXTWRAP,
            helper: (e) => {
                this.dragTarget = e.sender.target;
                let dragRoot = closest(this.dragTarget, '.' + ROOT);
                let dragWrap = closest(this.dragTarget, '.' + TEXTWRAP);
                this.dragLi = closest(this.dragTarget, '.' + LISTITEM);
                if (this.fullRowSelect && !dragWrap && this.dragTarget.classList.contains(FULLROW)) {
                    dragWrap = this.dragTarget.nextElementSibling;
                }
                if (!this.dragTarget || !e.element.isSameNode(dragRoot) || !dragWrap ||
                    this.dragTarget.classList.contains(ROOT) || this.dragTarget.classList.contains(PARENTITEM) ||
                    this.dragTarget.classList.contains(LISTITEM)) {
                    return false;
                }
                let cloneEle = (dragWrap.cloneNode(true));
                if (isNullOrUndefined(select('div.' + ICON, cloneEle))) {
                    let icon = createElement('div', { className: ICON + ' ' + EXPANDABLE });
                    cloneEle.insertBefore(icon, cloneEle.children[0]);
                }
                let cssClass = DRAGITEM + ' ' + ROOT + ' ' + this.cssClass + ' ' + (this.enableRtl ? RTL$1 : '');
                virtualEle = createElement('div', { className: cssClass });
                virtualEle.appendChild(cloneEle);
                let nLen = this.selectedNodes.length;
                if (nLen > 1 && this.allowMultiSelection && this.dragLi.classList.contains(ACTIVE)) {
                    let cNode = createElement('span', { className: DROPCOUNT, innerHTML: '' + nLen });
                    virtualEle.appendChild(cNode);
                }
                document.body.appendChild(virtualEle);
                document.body.style.cursor = '';
                this.dragData = this.getNodeData(this.dragLi);
                return virtualEle;
            },
            dragStart: (e) => {
                addClass([this.element], DRAGGING);
                let eventArgs = this.getDragEvent(e.event, this, null, e.target);
                this.trigger('nodeDragStart', eventArgs);
                if (eventArgs.cancel) {
                    detach(virtualEle);
                    removeClass([this.element], DRAGGING);
                }
                this.dragStartAction = true;
            },
            drag: (e) => {
                this.dragObj.setProperties({ cursorAt: { top: (!isNullOrUndefined(e.event.targetTouches) || Browser.isDevice) ? 60 : -20 } });
                this.dragAction(e, virtualEle);
            },
            dragStop: (e) => {
                removeClass([this.element], DRAGGING);
                this.removeVirtualEle();
                let dropTarget = e.target;
                let dropRoot = (closest(dropTarget, '.' + DROPPABLE));
                if (!dropTarget || !dropRoot || dropTarget.classList.contains(ROOT)) {
                    detach(e.helper);
                    document.body.style.cursor = '';
                }
                let eventArgs = this.getDragEvent(e.event, this, dropTarget, dropTarget);
                this.trigger('nodeDragStop', eventArgs);
                if (eventArgs.cancel) {
                    if (e.helper.parentNode) {
                        detach(e.helper);
                    }
                    document.body.style.cursor = '';
                }
                this.dragStartAction = false;
            }
        });
        this.dropObj = new Droppable(this.element, {
            out: (e) => {
                if (!isNullOrUndefined(e) && !e.target.classList.contains(SIBLING)) {
                    document.body.style.cursor = 'not-allowed';
                }
            },
            over: (e) => {
                document.body.style.cursor = '';
            },
            drop: (e) => {
                this.dropAction(e);
            }
        });
    }
    dragAction(e, virtualEle) {
        let dropRoot = closest(e.target, '.' + DROPPABLE);
        let dropWrap = closest(e.target, '.' + TEXTWRAP);
        let icon = select('div.' + ICON, virtualEle);
        removeClass([icon], [DROPIN, DROPNEXT, DROPOUT, NODROP]);
        this.removeVirtualEle();
        document.body.style.cursor = '';
        let classList$$1 = e.target.classList;
        if (this.fullRowSelect && !dropWrap && !isNullOrUndefined(classList$$1) && classList$$1.contains(FULLROW)) {
            dropWrap = e.target.nextElementSibling;
        }
        if (dropRoot) {
            let dropLi = closest(e.target, '.' + LISTITEM);
            if (!dropRoot.classList.contains(ROOT) || (dropWrap &&
                (!dropLi.isSameNode(this.dragLi) && !this.isDescendant(this.dragLi, dropLi)))) {
                if (dropLi && e && (e.event.offsetY < 7)) {
                    addClass([icon], DROPNEXT);
                    let virEle = createElement('div', { className: SIBLING });
                    let index = this.fullRowSelect ? (1) : (0);
                    dropLi.insertBefore(virEle, dropLi.children[index]);
                }
                else if (dropLi && e && (e.target.offsetHeight > 0 && e.event.offsetY > (e.target.offsetHeight - 10))) {
                    addClass([icon], DROPNEXT);
                    let virEle = createElement('div', { className: SIBLING });
                    let index = this.fullRowSelect ? (2) : (1);
                    dropLi.insertBefore(virEle, dropLi.children[index]);
                }
                else {
                    addClass([icon], DROPIN);
                }
            }
            else if (e.target.nodeName === 'LI' && (!dropLi.isSameNode(this.dragLi) && !this.isDescendant(this.dragLi, dropLi))) {
                addClass([icon], DROPNEXT);
                this.renderVirtualEle(e);
            }
            else if (e.target.classList.contains(SIBLING)) {
                addClass([icon], DROPNEXT);
            }
            else {
                addClass([icon], DROPOUT);
            }
        }
        else {
            addClass([icon], NODROP);
            document.body.style.cursor = 'not-allowed';
        }
        this.trigger('nodeDragging', this.getDragEvent(e.event, this, e.target, e.target));
    }
    dropAction(e) {
        let offsetY = e.event.offsetY;
        let dropTarget = e.target;
        let dragObj = e.dragData.draggable.ej2_instances[0];
        let dragTarget = dragObj.dragTarget;
        let dragLi = (closest(dragTarget, '.' + LISTITEM));
        let dropLi = (closest(dropTarget, '.' + LISTITEM));
        detach(e.droppedElement);
        document.body.style.cursor = '';
        if (!dropLi || dropLi.isSameNode(dragLi) || this.isDescendant(dragLi, dropLi)) {
            return;
        }
        if (dragObj.allowMultiSelection && (dragLi.classList.contains(ACTIVE) || (offsetY < 7 ||
            (e.target.offsetHeight > 0 && offsetY > (e.target.offsetHeight - 10))))) {
            let sNodes = selectAll('.' + ACTIVE, dragObj.element);
            for (let i = 0; i < sNodes.length; i++) {
                if (dropLi.isSameNode(sNodes[i]) || this.isDescendant(sNodes[i], dropLi)) {
                    continue;
                }
                this.appendNode(dropTarget, sNodes[i], dropLi, e, dragObj, offsetY);
            }
        }
        else {
            this.appendNode(dropTarget, dragLi, dropLi, e, dragObj, offsetY);
        }
        this.trigger('nodeDropped', this.getDragEvent(e.event, dragObj, dropTarget, e.target));
    }
    appendNode(dropTarget, dragLi, dropLi, e, dragObj, offsetY) {
        if (dropTarget.nodeName === 'LI') {
            this.dropAsSiblingNode(dragLi, dropLi, e, dragObj);
        }
        else {
            this.dropAsChildNode(dragLi, dropLi, dragObj, null, e, offsetY);
        }
    }
    dropAsSiblingNode(dragLi, dropLi, e, dragObj) {
        let dropUl = closest(dropLi, '.' + PARENTITEM);
        let dragParentUl = closest(dragLi, '.' + PARENTITEM);
        let dragParentLi = closest(dragParentUl, '.' + LISTITEM);
        let pre;
        if (e.target.offsetHeight > 0 && e.event.offsetY > e.target.offsetHeight - 2) {
            pre = false;
        }
        else if (e.event.offsetY < 2) {
            pre = true;
        }
        dropUl.insertBefore(dragLi, pre ? e.target : e.target.nextElementSibling);
        this.updateElement(dragParentUl, dragParentLi);
        this.updateAriaLevel(dragLi);
        if (dragObj.element.id === this.element.id) {
            this.updateList();
        }
        else {
            dragObj.updateInstance();
            this.updateInstance();
        }
    }
    dropAsChildNode(dragLi, dropLi, dragObj, index, e, pos) {
        let dragParentUl = closest(dragLi, '.' + PARENTITEM);
        let dragParentLi = closest(dragParentUl, '.' + LISTITEM);
        let dropParentUl = closest(dropLi, '.' + PARENTITEM);
        if (e && (pos < 7)) {
            dropParentUl.insertBefore(dragLi, dropLi);
        }
        else if (e && (e.target.offsetHeight > 0 && pos > (e.target.offsetHeight - 10))) {
            dropParentUl.insertBefore(dragLi, dropLi.nextElementSibling);
        }
        else {
            let dropUl = this.expandParent(dropLi);
            dropUl.insertBefore(dragLi, dropUl.childNodes[index]);
        }
        this.updateElement(dragParentUl, dragParentLi);
        this.updateAriaLevel(dragLi);
        if (dragObj.element.id === this.element.id) {
            this.updateList();
        }
        else {
            dragObj.updateInstance();
            this.updateInstance();
        }
    }
    expandParent(dropLi) {
        let dropIcon = select('div.' + ICON, dropLi);
        if (dropIcon && dropIcon.classList.contains(EXPANDABLE)) {
            this.expandAction(dropLi, dropIcon, null);
        }
        let dropUl = select('.' + PARENTITEM, dropLi);
        if (isNullOrUndefined(dropUl)) {
            ListBase.generateIcon(dropLi, COLLAPSIBLE, this.listBaseOption);
            let icon = select('div.' + ICON, dropLi);
            removeClass([icon], EXPANDABLE);
            dropUl = ListBase.generateUL([], null, this.listBaseOption);
            dropLi.appendChild(dropUl);
            dropLi.setAttribute('aria-expanded', 'true');
            removeClass([dropLi], NODECOLLAPSED);
        }
        return dropUl;
    }
    updateElement(dragParentUl, dragParentLi) {
        if (dragParentLi && dragParentUl.childElementCount === 0) {
            let dragIcon = select('div.' + ICON, dragParentLi);
            detach(dragParentUl);
            detach(dragIcon);
            dragParentLi.removeAttribute('aria-expanded');
        }
    }
    updateAriaLevel(dragLi) {
        let level = this.parents(dragLi, '.' + PARENTITEM).length;
        dragLi.setAttribute('aria-level', '' + level);
        this.updateChildAriaLevel(select('.' + PARENTITEM, dragLi), level + 1);
    }
    updateChildAriaLevel(element, level) {
        if (!isNullOrUndefined(element)) {
            let cNodes = element.childNodes;
            for (let i = 0, len = cNodes.length; i < len; i++) {
                let liEle = cNodes[i];
                liEle.setAttribute('aria-level', '' + level);
                this.updateChildAriaLevel(select('.' + PARENTITEM, liEle), level + 1);
            }
        }
    }
    renderVirtualEle(e) {
        let pre;
        if (e.event.offsetY > e.target.offsetHeight - 2) {
            pre = false;
        }
        else if (e.event.offsetY < 2) {
            pre = true;
        }
        let virEle = createElement('div', { className: SIBLING });
        let index = this.fullRowSelect ? (pre ? 1 : 2) : (pre ? 0 : 1);
        e.target.insertBefore(virEle, e.target.children[index]);
    }
    removeVirtualEle() {
        let sibEle = select('.' + SIBLING);
        if (sibEle) {
            detach(sibEle);
        }
    }
    destroyDrag() {
        if (this.dragObj && this.dropObj) {
            this.dragObj.destroy();
            this.dropObj.destroy();
        }
    }
    getDragEvent(event, obj, dropTarget, target) {
        let dropLi = dropTarget ? closest(dropTarget, '.' + LISTITEM) : null;
        let dropData = dropLi ? this.getNodeData(dropLi) : null;
        return {
            cancel: false,
            event: event,
            draggedNode: obj.dragLi,
            draggedNodeData: obj.dragData,
            droppedNode: dropLi,
            droppedNodeData: dropData,
            target: target
        };
    }
    addFullRow(toAdd) {
        let len = this.liList.length;
        if (toAdd) {
            for (let i = 0; i < len; i++) {
                this.createFullRow(this.liList[i]);
            }
        }
        else {
            for (let i = 0; i < len; i++) {
                let rowDiv = select('.' + FULLROW, this.liList[i]);
                detach(rowDiv);
            }
        }
    }
    createFullRow(item) {
        let rowDiv = createElement('div', { className: FULLROW });
        item.insertBefore(rowDiv, item.childNodes[0]);
    }
    addMultiSelect(toAdd) {
        if (toAdd) {
            let liEles = selectAll('.' + LISTITEM + ':not([aria-selected="true"])', this.element);
            for (let ele of liEles) {
                ele.setAttribute('aria-selected', 'false');
            }
        }
        else {
            let liEles = selectAll('.' + LISTITEM + '[aria-selected="false"]', this.element);
            for (let ele of liEles) {
                ele.removeAttribute('aria-selected');
            }
        }
    }
    collapseByLevel(element, level, excludeHiddenNodes) {
        if (level > 0 && !isNullOrUndefined(element)) {
            let cNodes = this.getVisibleNodes(excludeHiddenNodes, element.childNodes);
            for (let i = 0, len = cNodes.length; i < len; i++) {
                let liEle = cNodes[i];
                let icon = select('.' + COLLAPSIBLE, select('.' + TEXTWRAP, liEle));
                if (!isNullOrUndefined(icon)) {
                    this.collapseNode(liEle, icon, null);
                }
                this.collapseByLevel(select('.' + PARENTITEM, liEle), level - 1, excludeHiddenNodes);
            }
        }
    }
    collapseAllNodes(excludeHiddenNodes) {
        let cIcons = this.getVisibleNodes(excludeHiddenNodes, selectAll('.' + COLLAPSIBLE, this.element));
        for (let i = 0, len = cIcons.length; i < len; i++) {
            let icon = cIcons[i];
            let liEle = closest(icon, '.' + LISTITEM);
            this.collapseNode(liEle, icon, null);
        }
    }
    expandByLevel(element, level, excludeHiddenNodes) {
        if (level > 0 && !isNullOrUndefined(element)) {
            let eNodes = this.getVisibleNodes(excludeHiddenNodes, element.childNodes);
            for (let i = 0, len = eNodes.length; i < len; i++) {
                let liEle = eNodes[i];
                let icon = select('.' + EXPANDABLE, select('.' + TEXTWRAP, liEle));
                if (!isNullOrUndefined(icon)) {
                    this.expandAction(liEle, icon, null);
                }
                this.expandByLevel(select('.' + PARENTITEM, liEle), level - 1, excludeHiddenNodes);
            }
        }
    }
    expandAllNodes(excludeHiddenNodes) {
        let eIcons = this.getVisibleNodes(excludeHiddenNodes, selectAll('.' + EXPANDABLE, this.element));
        for (let i = 0, len = eIcons.length; i < len; i++) {
            let icon = eIcons[i];
            let liEle = closest(icon, '.' + LISTITEM);
            this.expandAction(liEle, icon, null, true);
        }
    }
    getVisibleNodes(excludeHiddenNodes, nodes) {
        let vNodes = Array.prototype.slice.call(nodes);
        if (excludeHiddenNodes) {
            for (let i = 0; i < vNodes.length; i++) {
                if (!isVisible(vNodes[i])) {
                    vNodes.splice(i, 1);
                    i--;
                }
            }
        }
        return vNodes;
    }
    removeNode(node) {
        let dragParentUl = closest(node, '.' + PARENTITEM);
        let dragParentLi = closest(dragParentUl, '.' + LISTITEM);
        detach(node);
        this.updateElement(dragParentUl, dragParentLi);
        this.updateInstance();
    }
    updateInstance() {
        this.updateList();
        this.updateSelectedNodes();
    }
    updateList() {
        this.liList = Array.prototype.slice.call(selectAll('.' + LISTITEM, this.element));
    }
    updateSelectedNodes() {
        this.setProperties({ selectedNodes: [] }, true);
        let sNodes = selectAll('.' + ACTIVE, this.element);
        this.selectGivenNodes(sNodes);
    }
    doGivenAction(nodes, selector, toExpand) {
        for (let i = 0, len = nodes.length; i < len; i++) {
            let liEle = this.getElement(nodes[i]);
            if (isNullOrUndefined(liEle)) {
                continue;
            }
            let icon = select('.' + selector, select('.' + TEXTWRAP, liEle));
            if (!isNullOrUndefined(icon)) {
                toExpand ? this.expandAction(liEle, icon, null) : this.collapseNode(liEle, icon, null);
            }
        }
    }
    addGivenNodes(nodes, dropLi, index, isRemote) {
        let level = dropLi ? parseFloat(dropLi.getAttribute('aria-level')) + 1 : 1;
        if (isRemote) {
            this.updateMapper(level);
        }
        let li = ListBase.createListItemFromJson(nodes, this.listBaseOption, level);
        let dropUl = dropLi ? this.expandParent(dropLi) : select('.' + PARENTITEM, this.element);
        let refNode = dropUl.childNodes[index];
        for (let i = 0; i < li.length; i++) {
            dropUl.insertBefore(li[i], refNode);
        }
        this.finalizeNode(dropUl);
    }
    updateMapper(level) {
        let mapper = (level === 1) ? this.fields : this.getChildFields(this.fields, level - 1, 1);
        let prop = this.getActualProperties(mapper);
        this.listBaseOption.fields = prop;
        this.listBaseOption.fields.url = prop.navigateUrl;
    }
    doDisableAction(nodes) {
        for (let i = 0, len = nodes.length; i < len; i++) {
            let liEle = this.getElement(nodes[i]);
            if (isNullOrUndefined(liEle)) {
                continue;
            }
            liEle.setAttribute('aria-disabled', 'true');
            addClass([liEle], DISABLE);
        }
    }
    doEnableAction(nodes) {
        for (let i = 0, len = nodes.length; i < len; i++) {
            let liEle = this.getElement(nodes[i]);
            if (isNullOrUndefined(liEle)) {
                continue;
            }
            liEle.removeAttribute('aria-disabled');
            removeClass([liEle], DISABLE);
        }
    }
    setTouchClass() {
        let ele = closest(this.element, '.' + BIGGER);
        this.touchClass = isNullOrUndefined(ele) ? '' : SMALL;
    }
    wireInputEvents(inpEle) {
        EventHandler.add(inpEle, 'blur', this.inputFocusOut, this);
    }
    wireEditingEvents(toBind) {
        if (toBind) {
            let proxy = this;
            this.touchEditObj = new Touch(this.element, {
                tap: (e) => {
                    if (e.tapCount === 2) {
                        e.originalEvent.preventDefault();
                        proxy.editingHandler(e.originalEvent);
                    }
                }
            });
        }
        else {
            if (this.touchEditObj) {
                this.touchEditObj.destroy();
            }
        }
    }
    wireClickEvent(toBind) {
        if (toBind) {
            let proxy = this;
            this.touchClickObj = new Touch(this.element, {
                tap: (e) => {
                    proxy.clickHandler(e);
                }
            });
        }
        else {
            if (this.touchClickObj) {
                this.touchClickObj.destroy();
            }
        }
    }
    wireExpandOnEvent(toBind) {
        if (toBind) {
            let proxy = this;
            this.touchExpandObj = new Touch(this.element, {
                tap: (e) => {
                    if (this.expandOnType === 'Click' || (this.expandOnType === 'DblClick' && e.tapCount === 2)) {
                        proxy.expandHandler(e);
                    }
                }
            });
        }
        else {
            if (this.touchExpandObj) {
                this.touchExpandObj.destroy();
            }
        }
    }
    mouseDownHandler(e) {
        this.mouseDownStatus = true;
        if (e.shiftKey || e.ctrlKey) {
            e.preventDefault();
        }
        if (e.ctrlKey && this.allowMultiSelection) {
            EventHandler.add(this.element, 'contextmenu', this.preventContextMenu, this);
        }
    }
    ;
    preventContextMenu(e) {
        e.preventDefault();
    }
    wireEvents() {
        EventHandler.add(this.element, 'mousedown', this.mouseDownHandler, this);
        this.wireClickEvent(true);
        this.wireExpandOnEvent(true);
        EventHandler.add(this.element, 'focus', this.focusIn, this);
        EventHandler.add(this.element, 'blur', this.focusOut, this);
        EventHandler.add(this.element, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.element, 'mouseout', this.onMouseLeave, this);
        this.keyboardModule = new KeyboardEvents(this.element, {
            keyAction: this.keyActionHandler.bind(this),
            keyConfigs: this.keyConfigs,
            eventName: 'keydown',
        });
    }
    unWireEvents() {
        EventHandler.remove(this.element, 'mousedown', this.mouseDownHandler);
        this.wireClickEvent(false);
        this.wireExpandOnEvent(false);
        EventHandler.remove(this.element, 'focus', this.focusIn);
        EventHandler.remove(this.element, 'blur', this.focusOut);
        EventHandler.remove(this.element, 'mouseover', this.onMouseOver);
        EventHandler.remove(this.element, 'mouseout', this.onMouseLeave);
        this.keyboardModule.destroy();
    }
    parents(element, selector) {
        let matched = [];
        let el = element.parentNode;
        while (!isNullOrUndefined(el)) {
            if (matches(el, selector)) {
                matched.push(el);
            }
            el = el.parentNode;
        }
        return matched;
    }
    isDescendant(parent, child) {
        let node = child.parentNode;
        while (!isNullOrUndefined(node)) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    showSpinner(element) {
        addClass([element], LOAD);
        createSpinner({
            target: element,
            width: Browser.isDevice ? 16 : 14
        });
        showSpinner(element);
    }
    hideSpinner(element) {
        hideSpinner(element);
        element.innerHTML = '';
        removeClass([element], LOAD);
    }
    setCheckedNodes(nodes) {
        nodes = JSON.parse(JSON.stringify(nodes));
        this.uncheckAll();
        if (nodes.length > 0) {
            this.checkAll(nodes);
        }
    }
    /**
     * Called internally if any of the property value changed.
     * @param  {TreeView} newProp
     * @param  {TreeView} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'allowDragAndDrop':
                    this.setDragAndDrop(this.allowDragAndDrop);
                    break;
                case 'allowEditing':
                    this.wireEditingEvents(this.allowEditing);
                    break;
                case 'allowMultiSelection':
                    if (this.selectedNodes.length > 1) {
                        let sNode = this.getElement(this.selectedNodes[0]);
                        this.isLoaded = false;
                        this.removeSelectAll();
                        this.selectNode(sNode, null);
                        this.isLoaded = true;
                    }
                    this.setMultiSelect(this.allowMultiSelection);
                    this.addMultiSelect(this.allowMultiSelection);
                    break;
                case 'checkedNodes':
                    if (this.showCheckBox) {
                        this.checkedNodes = oldProp.checkedNodes;
                        this.setCheckedNodes(newProp.checkedNodes);
                    }
                    break;
                case 'cssClass':
                    this.setCssClass(oldProp.cssClass, newProp.cssClass);
                    break;
                case 'enableRtl':
                    this.setEnableRtl();
                    break;
                case 'expandOn':
                    this.wireExpandOnEvent(false);
                    this.setExpandOnType();
                    this.wireExpandOnEvent(true);
                    break;
                case 'fields':
                    this.listBaseOption.fields = this.fields.properties;
                    this.listBaseOption.fields.url = this.fields.navigateUrl;
                    this.reRenderNodes();
                    break;
                case 'fullRowSelect':
                    this.setFullRow(this.fullRowSelect);
                    this.addFullRow(this.fullRowSelect);
                    break;
                case 'nodeTemplate':
                    this.nodeTemplateFn = this.templateComplier(this.nodeTemplate);
                    this.reRenderNodes();
                    break;
                case 'selectedNodes':
                    this.removeSelectAll();
                    this.setProperties({ selectedNodes: newProp.selectedNodes }, true);
                    this.doSelectionAction();
                    break;
                case 'showCheckBox':
                    this.reRenderNodes();
                    break;
                case 'sortOrder':
                    this.reRenderNodes();
                    break;
            }
        }
    }
    /**
     * Removes the component from the DOM and detaches all its related event handlers. It also removes the attributes and classes.
     */
    destroy() {
        this.element.removeAttribute('aria-activedescendant');
        this.element.removeAttribute('tabindex');
        this.unWireEvents();
        this.wireEditingEvents(false);
        this.rippleFn();
        this.rippleIconFn();
        this.setCssClass(this.cssClass, null);
        this.setDragAndDrop(false);
        this.setFullRow(false);
        this.element.innerHTML = '';
        super.destroy();
    }
    /**
     * Adds the collection of TreeView nodes based on target and index position. If target node is not specified,
     * then the nodes are added as children of the given parentID or in the root level of TreeView.
     * @param  { Object[] } nodes - Specifies the array of JSON data that has to be added.
     * @param  { string | Element } target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  { number } index - Specifies the index to place the newly added nodes in the target element.
     */
    addNodes(nodes, target, index) {
        if (isNullOrUndefined(nodes)) {
            return;
        }
        let dropLi = this.getElement(target);
        nodes = this.getSortedData(nodes);
        if (this.fields.dataSource instanceof DataManager) {
            this.addGivenNodes(nodes, dropLi, index, true);
        }
        else if (this.dataType === 2) {
            this.addGivenNodes(nodes, dropLi, index);
        }
        else {
            if (dropLi) {
                this.addGivenNodes(nodes, dropLi, index);
            }
            else {
                for (let i = 0; i < nodes.length; i++) {
                    let pid = getValue(this.fields.parentID, nodes[i]);
                    dropLi = pid ? this.getElement(pid.toString()) : pid;
                    this.addGivenNodes([nodes[i]], dropLi, index);
                }
            }
        }
    }
    /**
     * Instead of clicking on the TreeView node for editing, we can enable it by using
     * `beginEdit` property. On passing the node ID or element through this property, the edit textBox
     * will be created for the particular node thus allowing us to edit it.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     */
    beginEdit(node) {
        let ele = this.getElement(node);
        if (!isNullOrUndefined(ele)) {
            this.createTextbox(ele, null);
        }
    }
    /**
     * Checks all the unchecked nodes. You can also check specific nodes by passing array of unchecked nodes
     * as argument to this method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     */
    checkAll(nodes) {
        if (this.showCheckBox) {
            this.doCheckBoxAction(nodes, true);
        }
    }
    /**
     * Collapses all the expanded TreeView nodes. You can collapse specific nodes by passing array of nodes as argument to this method.
     * You can also collapse all the nodes excluding the hidden nodes by setting **excludeHiddenNodes** to true. If you want to collapse
     * a specific level of nodes, set **level** as argument to collapseAll method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/ array of TreeView node.
     * @param  {number} level - TreeView nodes will collapse up to the given level.
     * @param  {boolean} excludeHiddenNodes - Whether or not to exclude hidden nodes of TreeView when collapsing all nodes.
     */
    collapseAll(nodes, level, excludeHiddenNodes) {
        if (!isNullOrUndefined(nodes)) {
            this.doGivenAction(nodes, COLLAPSIBLE, false);
        }
        else {
            if (level > 0) {
                this.collapseByLevel(select('.' + PARENTITEM, this.element), level, excludeHiddenNodes);
            }
            else {
                this.collapseAllNodes(excludeHiddenNodes);
            }
        }
    }
    /**
     * Disables the collection of nodes by passing the ID of nodes or node elements in the array.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     */
    disableNodes(nodes) {
        if (!isNullOrUndefined(nodes)) {
            this.doDisableAction(nodes);
        }
    }
    /**
     * Enables the collection of disabled nodes by passing the ID of nodes or node elements in the array.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     */
    enableNodes(nodes) {
        if (!isNullOrUndefined(nodes)) {
            this.doEnableAction(nodes);
        }
    }
    /**
     * Ensures visibility of the TreeView node by using node ID or node element.
     * When many TreeView nodes are present and we need to find a particular node, `ensureVisible` property
     * helps bring the node to visibility by expanding the TreeView and scrolling to the specific node.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView nodes.
     */
    ensureVisible(node) {
        let liEle = this.getElement(node);
        if (isNullOrUndefined(liEle)) {
            return;
        }
        let parents = this.parents(liEle, '.' + LISTITEM);
        this.expandAll(parents);
        setTimeout(() => { liEle.scrollIntoView(true); }, 450);
    }
    /**
     * Expands all the collapsed TreeView nodes. You can expand the specific nodes by passing the array of collapsed nodes
     * as argument to this method. You can also expand all the collapsed nodes by excluding the hidden nodes by setting
     * **excludeHiddenNodes** to true to this method. To expand a specific level of nodes, set **level** as argument to expandAll method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView nodes.
     * @param  {number} level - TreeView nodes will expand up to the given level.
     * @param  {boolean} excludeHiddenNodes - Whether or not to exclude hidden nodes when expanding all nodes.
     */
    expandAll(nodes, level, excludeHiddenNodes) {
        if (!isNullOrUndefined(nodes)) {
            this.doGivenAction(nodes, EXPANDABLE, true);
        }
        else {
            if (level > 0) {
                this.expandByLevel(select('.' + PARENTITEM, this.element), level, excludeHiddenNodes);
            }
            else {
                this.expandAllNodes(excludeHiddenNodes);
            }
        }
    }
    /**
     * Get the node's data such as id, text, parentID, selected, isChecked, and expanded by passing the node element or it's ID.
     * @param  {string | Element} node - Specifies ID of TreeView node/TreeView node.
     */
    getNode(node) {
        let ele = this.getElement(node);
        return this.getNodeData(ele, true);
    }
    /**
     * Moves the collection of nodes within the same TreeView based on target or its index position.
     * @param  {string[] | Element[]} sourceNodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     * @param  {string | Element} target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  {number} index - Specifies the index to place the moved nodes in the target element.
     */
    moveNodes(sourceNodes, target, index) {
        let dropLi = this.getElement(target);
        if (isNullOrUndefined(dropLi)) {
            return;
        }
        for (let i = 0; i < sourceNodes.length; i++) {
            let dragLi = this.getElement(sourceNodes[i]);
            if (isNullOrUndefined(dragLi) || dropLi.isSameNode(dragLi) || this.isDescendant(dragLi, dropLi)) {
                continue;
            }
            this.dropAsChildNode(dragLi, dropLi, this, index);
        }
    }
    /**
     * Removes the collection of TreeView nodes by passing the array of node details as argument to this method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     */
    removeNodes(nodes) {
        if (!isNullOrUndefined(nodes)) {
            for (let i = 0, len = nodes.length; i < len; i++) {
                let liEle = this.getElement(nodes[i]);
                if (isNullOrUndefined(liEle)) {
                    continue;
                }
                this.removeNode(liEle);
            }
        }
    }
    /**
     * Replaces the text of the TreeView node with the given text.
     * @param  {string | Element} target - Specifies ID of TreeView node/TreeView node as target element.
     * @param  {string} newText - Specifies the new text of TreeView node.
     */
    updateNode(target, newText) {
        if (isNullOrUndefined(target) || isNullOrUndefined(newText) || !this.allowEditing) {
            return;
        }
        let liEle = this.getElement(target);
        if (isNullOrUndefined(liEle)) {
            return;
        }
        let txtEle = select('.' + LISTTEXT, liEle);
        this.updateOldText(liEle);
        let eventArgs = this.getEditEvent(liEle, null, null);
        this.trigger('nodeEditing', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.appendNewText(liEle, txtEle, newText, false);
    }
    /**
     * Unchecks all the checked nodes. You can also uncheck the specific nodes by passing array of checked nodes
     * as argument to this method.
     * @param  {string[] | Element[]} nodes - Specifies the array of TreeView nodes ID/array of TreeView node.
     */
    uncheckAll(nodes) {
        if (this.showCheckBox) {
            this.doCheckBoxAction(nodes, false);
        }
    }
};
__decorate$5([
    Property(false)
], TreeView.prototype, "allowDragAndDrop", void 0);
__decorate$5([
    Property(false)
], TreeView.prototype, "allowEditing", void 0);
__decorate$5([
    Property(false)
], TreeView.prototype, "allowMultiSelection", void 0);
__decorate$5([
    Complex({}, NodeAnimationSettings)
], TreeView.prototype, "animation", void 0);
__decorate$5([
    Property()
], TreeView.prototype, "checkedNodes", void 0);
__decorate$5([
    Property('')
], TreeView.prototype, "cssClass", void 0);
__decorate$5([
    Property(false)
], TreeView.prototype, "enablePersistence", void 0);
__decorate$5([
    Property(false)
], TreeView.prototype, "enableRtl", void 0);
__decorate$5([
    Property('Auto')
], TreeView.prototype, "expandOn", void 0);
__decorate$5([
    Complex({}, FieldsSettings)
], TreeView.prototype, "fields", void 0);
__decorate$5([
    Property(true)
], TreeView.prototype, "fullRowSelect", void 0);
__decorate$5([
    Property()
], TreeView.prototype, "nodeTemplate", void 0);
__decorate$5([
    Property()
], TreeView.prototype, "selectedNodes", void 0);
__decorate$5([
    Property('None')
], TreeView.prototype, "sortOrder", void 0);
__decorate$5([
    Property(false)
], TreeView.prototype, "showCheckBox", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "created", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "dataBound", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "drawNode", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "destroyed", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "keyPress", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeChecked", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeChecking", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeClicked", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeCollapsed", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeCollapsing", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeDragging", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeDragStart", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeDragStop", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeDropped", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeEdited", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeEditing", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeExpanded", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeExpanding", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeSelected", void 0);
__decorate$5([
    Event()
], TreeView.prototype, "nodeSelecting", void 0);
TreeView = __decorate$5([
    NotifyPropertyChanges
], TreeView);

/**
 * TreeView modules
 */

var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const CONTROL = 'e-control';
const ROOT$1 = 'e-sidebar';
const DOCKER = 'e-dock';
const CLOSE = 'e-close';
const OPEN = 'e-open';
const TRASITION = 'e-transition';
const DEFAULTBACKDROP = 'e-sidebar-overlay';
const CONTEXTBACKDROP = 'e-backdrop';
const RIGHT = 'e-right';
const LEFT = 'e-left';
const OVER = 'e-over';
const PUSH = 'e-push';
const SLIDE = 'e-slide';
const VISIBILITY = 'e-visibility';
const MAINCONTENTANIMATION = 'e-content-animation';
const DISABLEANIMATION = 'e-disable-animation';
const CONTEXT = 'e-sidebar-context';
const SIDEBARABSOLUTE = 'e-sidebar-absolute';
/**
 * Sidebar is an expandable and collapsible
 * component that typically act as a side container to place the primary or secondary content alongside of the main content.
 * ```html
 * <aside id="sidebar">
 * </aside>
 * ````
 * ````typescript
 * <script>
 *   let sidebarObject = new Sidebar({ });
 *   sidebarObject.appendTo("#sidebar");
 * </script>
 * ```
 */
let Sidebar = class Sidebar extends Component {
    constructor(options, element) {
        super(options, element);
    }
    preRender() {
        this.setWidth();
    }
    render() {
        this.initialize();
        this.wireEvents();
    }
    initialize() {
        this.setContext();
        this.addClass();
        this.setZindex();
        if (this.enableDock) {
            this.setDock();
        }
        this.setMediaQuery();
        this.setType(this.type);
        this.setCloseOnDocumentClick();
    }
    setContext() {
        if (typeof (this.target) === 'string') {
            this.setProperties({ target: document.querySelector('.' + this.target) }, true);
        }
        if (this.target) {
            this.target.insertAdjacentElement('afterbegin', this.element);
            addClass([this.element], SIDEBARABSOLUTE);
            addClass([this.target], CONTEXT);
        }
    }
    setCloseOnDocumentClick() {
        if (this.closeOnDocumentClick) {
            EventHandler.add(document, 'mousedown touchstart', this.documentclickHandler, this);
        }
        else {
            EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        }
    }
    setWidth() {
        if (this.enableDock && this.position === 'Left') {
            setStyleAttribute(this.element, { 'width': formatUnit(this.dockSize) });
        }
        else if (this.enableDock && this.position === 'Right') {
            setStyleAttribute(this.element, { 'width': formatUnit(this.dockSize) });
        }
        else if (!this.enableDock) {
            setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        }
    }
    setZindex() {
        setStyleAttribute(this.element, { 'z-index': '' + this.zIndex });
    }
    addClass() {
        let classELement = document.querySelector('.e-main-content');
        if (!isNullOrUndefined((classELement ||
            this.element.nextElementSibling))) {
            addClass([classELement || this.element.nextElementSibling], [MAINCONTENTANIMATION]);
        }
        if (!this.enableDock && this.type !== 'Auto') {
            addClass([this.element], [VISIBILITY]);
        }
        removeClass([this.element], [OPEN, CLOSE, RIGHT, LEFT, SLIDE, PUSH, OVER]);
        this.element.classList.add(ROOT$1);
        addClass([this.element], (this.position === 'Right') ? RIGHT : LEFT);
        if (this.type === 'Auto' && !Browser.isDevice && !this.enableDock) {
            addClass([this.element], OPEN);
        }
        else {
            addClass([this.element], CLOSE);
        }
    }
    destroyBackDrop() {
        let sibling = document.querySelector('.e-main-content') ||
            this.element.nextElementSibling;
        if (this.target && this.showBackdrop && sibling) {
            removeClass([sibling], CONTEXTBACKDROP);
        }
        else if (this.showBackdrop && this.modal) {
            this.modal.style.display = 'none';
            this.modal.outerHTML = '';
            this.modal = null;
        }
    }
    /**
     * Hide the Sidebar component.
     * @returns void
     */
    hide() {
        if (this.element.classList.contains(CLOSE)) {
            return;
        }
        if (this.element.classList.contains(OPEN)) {
            this.eventArguments = { name: 'change', element: this.element };
            this.trigger('change', this.eventArguments);
        }
        addClass([this.element], CLOSE);
        removeClass([this.element], OPEN);
        this.enableDock ? setStyleAttribute(this.element, { 'width': formatUnit(this.dockSize) }) :
            setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        this.setDock();
        this.setType(this.type);
        let sibling = document.querySelector('.e-main-content') ||
            this.element.nextElementSibling;
        if (!this.enableDock && sibling) {
            sibling.style.transform = 'translateX(' + 0 + 'px)';
            this.position === 'Left' ? sibling.style.marginLeft = '0px' : sibling.style.marginRight = '0px';
        }
        this.eventArguments = { name: 'change', element: this.element };
        this.trigger('close', this.eventArguments);
        this.destroyBackDrop();
        this.setCloseOnDocumentClick();
        this.setAnimation();
        if (this.type === 'Slide') {
            document.body.classList.remove('e-sidebar-overflow');
        }
    }
    /**
     * Shows the Sidebar component.
     * @returns void
     */
    show() {
        removeClass([this.element], VISIBILITY);
        if (this.element.classList.contains(OPEN)) {
            return;
        }
        if (this.element.classList.contains(CLOSE)) {
            this.eventArguments = { name: 'open', element: this.element };
            this.trigger('change', this.eventArguments);
        }
        addClass([this.element], [OPEN, TRASITION]);
        setStyleAttribute(this.element, { 'transform': '' });
        removeClass([this.element], CLOSE);
        setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        let elementWidth = this.element.getBoundingClientRect().width;
        this.setType(this.type);
        this.createBackDrop();
        this.eventArguments.name = 'open';
        this.eventArguments.element = this.element;
        this.trigger('open', this.eventArguments);
        this.setCloseOnDocumentClick();
        this.setAnimation();
        if (this.type === 'Slide') {
            document.body.classList.add('e-sidebar-overflow');
        }
    }
    setAnimation() {
        if (this.animate) {
            removeClass([this.element], DISABLEANIMATION);
        }
        else {
            addClass([this.element], DISABLEANIMATION);
        }
    }
    setDock() {
        if (this.enableDock && this.position === 'Left' && !this.isOpen()) {
            setStyleAttribute(this.element, { 'transform': 'translateX(' + -100 + '%) translateX(' + formatUnit(this.dockSize) + ')' });
        }
        else if (this.enableDock && this.position === 'Right' && !this.isOpen()) {
            setStyleAttribute(this.element, { 'transform': 'translateX(' + 100 + '%) translateX(' + '-' + formatUnit(this.dockSize) + ')' });
        }
        if (this.element.classList.contains(CLOSE) && this.enableDock) {
            setStyleAttribute(this.element, { 'width': formatUnit(this.dockSize) });
        }
    }
    createBackDrop() {
        if (this.target && this.showBackdrop) {
            let sibling = document.querySelector('.e-main-content') ||
                this.element.nextElementSibling;
            addClass([sibling], CONTEXTBACKDROP);
        }
        else if (this.showBackdrop && !this.modal && this.isOpen()) {
            this.modal = createElement('div');
            this.modal.className = DEFAULTBACKDROP;
            this.modal.style.display = 'block';
            document.body.appendChild(this.modal);
        }
    }
    getPersistData() {
        return this.addOnPersist(['type', 'position']);
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'sidebar';
    }
    /**
     * Shows or hides the Sidebar based on the current state.
     * @returns void
     */
    toggle(e) {
        this.element.classList.contains(OPEN) ? this.hide() : this.show();
    }
    /**
     * Specifies the current state of the Sidebar component.
     * @returns boolean
     */
    isOpen() {
        return this.element.classList.contains(OPEN) ? true : false;
    }
    setMediaQuery() {
        if (this.mediaQuery && this.mediaQuery.matches) {
            this.show();
        }
        else if (this.mediaQuery && this.isOpen()) {
            this.hide();
        }
    }
    resize(e) {
        if (this.type === 'Auto') {
            if (Browser.isDevice) {
                addClass([this.element], OVER);
            }
            else {
                addClass([this.element], PUSH);
            }
        }
        this.setMediaQuery();
    }
    documentclickHandler(e) {
        if (closest(e.target, '.' + CONTROL + '' + '.' + ROOT$1)) {
            return;
        }
        this.hide();
    }
    enableGestureHandler(args) {
        if (this.position === 'Left' && args.swipeDirection === 'Right' &&
            (args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)) {
            this.show();
        }
        else if (this.position === 'Left' && args.swipeDirection === 'Left') {
            this.hide();
        }
        else if (this.position === 'Right' && args.swipeDirection === 'Right') {
            this.hide();
        }
        else if (this.position === 'Right' && args.swipeDirection === 'Left'
            && (window.innerWidth - args.startX <= 20 && args.distanceX >= 50 && args.velocity >= 0.5)) {
            this.show();
        }
    }
    setEnableGestures() {
        if (this.enableGestures) {
            this.mainContentEle = new Touch(document.body, { swipe: this.enableGestureHandler.bind(this) });
            this.sidebarEle = new Touch(this.element, { swipe: this.enableGestureHandler.bind(this) });
        }
        else {
            if (this.mainContentEle && this.sidebarEle) {
                this.mainContentEle.destroy();
                this.sidebarEle.destroy();
            }
        }
    }
    wireEvents() {
        this.setEnableGestures();
        window.addEventListener('resize', this.resize.bind(this));
    }
    unWireEvents() {
        window.removeEventListener('resize', this.resize.bind(this));
        EventHandler.remove(document, 'mousedown touchstart', this.documentclickHandler);
        if (this.mainContentEle) {
            this.mainContentEle.destroy();
        }
        if (this.sidebarEle) {
            this.sidebarEle.destroy();
        }
    }
    onPropertyChanged(newProp, oldProp) {
        let sibling = document.querySelector('.e-main-content') ||
            this.element.nextElementSibling;
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'width':
                    this.setWidth();
                    if (!this.isOpen()) {
                        this.setDock();
                    }
                    break;
                case 'animate':
                    this.setAnimation();
                    break;
                case 'type':
                    removeClass([this.element], [VISIBILITY]);
                    this.addClass();
                    this.setType(this.type);
                    break;
                case 'position':
                    this.element.style.transform = '';
                    this.setDock();
                    if (sibling) {
                        this.position === 'Left' ? sibling.style.marginRight = '0px' : sibling.style.marginLeft = '0px';
                    }
                    if (this.position === 'Right') {
                        removeClass([this.element], LEFT);
                        addClass([this.element], RIGHT);
                    }
                    else {
                        removeClass([this.element], RIGHT);
                        addClass([this.element], LEFT);
                    }
                    this.setType(this.type);
                    break;
                case 'showBackdrop':
                    if (this.showBackdrop) {
                        this.createBackDrop();
                    }
                    else {
                        if (this.modal) {
                            this.modal.style.display = 'none';
                            this.modal.outerHTML = '';
                            this.modal = null;
                        }
                    }
                    break;
                case 'target':
                    if (typeof (this.target) === 'string') {
                        this.setProperties({ target: document.querySelector('.' + this.target) }, true);
                    }
                    if (isNullOrUndefined(this.target)) {
                        removeClass([this.element], SIDEBARABSOLUTE);
                        removeClass([oldProp.target], CONTEXT);
                        setStyleAttribute(sibling, { 'margin-left': 0, 'margin-right': 0 });
                        document.body.insertAdjacentElement('afterbegin', this.element);
                    }
                    else {
                        super.refresh();
                    }
                    break;
                case 'closeOnDocumentClick':
                    this.setCloseOnDocumentClick();
                    break;
                case 'enableDock':
                    if (!this.isOpen()) {
                        this.setDock();
                    }
                    break;
                case 'zIndex':
                    this.setZindex();
                    break;
                case 'mediaQuery':
                    this.setMediaQuery();
                    break;
                case 'enableGestures':
                    this.setEnableGestures();
                    break;
            }
        }
    }
    setType(type) {
        let elementWidth = this.element.getBoundingClientRect().width;
        this.setZindex();
        if (this.enableDock) {
            addClass([this.element], DOCKER);
        }
        let sibling = document.querySelector('.e-main-content') ||
            this.element.nextElementSibling;
        if (sibling) {
            sibling.style.transform = 'translateX(' + 0 + 'px)';
            if (!Browser.isDevice && this.type !== 'Auto') {
                this.position === 'Left' ? sibling.style.marginLeft = '0px' : sibling.style.marginRight = '0px';
            }
        }
        let margin = this.position === 'Left' ? elementWidth + 'px' : elementWidth + 'px';
        let eleWidth = this.position === 'Left' ? elementWidth : -(elementWidth);
        removeClass([this.element], [PUSH, OVER, SLIDE]);
        switch (type) {
            case 'Push':
                addClass([this.element], [PUSH]);
                if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                    this.position === 'Left' ? sibling.style.marginLeft = margin : sibling.style.marginRight = margin;
                }
                break;
            case 'Slide':
                addClass([this.element], [SLIDE]);
                if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                    sibling.style.transform = 'translateX(' + eleWidth + 'px)';
                }
                break;
            case 'Over':
                addClass([this.element], [OVER]);
                if (this.enableDock && this.element.classList.contains(CLOSE)) {
                    if (sibling) {
                        this.position === 'Left' ? sibling.style.marginLeft = margin : sibling.style.marginRight = margin;
                    }
                }
                break;
            case 'Auto':
                addClass([this.element], [TRASITION]);
                if (Browser.isDevice) {
                    if (sibling && (this.enableDock) && !this.isOpen()) {
                        this.position === 'Left' ? sibling.style.marginLeft = margin : sibling.style.marginRight = margin;
                        addClass([this.element], PUSH);
                    }
                    else {
                        addClass([this.element], OVER);
                    }
                }
                else {
                    addClass([this.element], PUSH);
                    if (sibling && (this.enableDock || this.element.classList.contains(OPEN))) {
                        this.position === 'Left' ? sibling.style.marginLeft = margin : sibling.style.marginRight = margin;
                    }
                }
                this.createBackDrop();
        }
    }
    /**
     * Removes the control from the DOM and removes all its related events
     * @returns void
     */
    destroy() {
        super.destroy();
        removeClass([this.element], [OPEN, CLOSE, PUSH, SLIDE, OVER, LEFT, RIGHT, TRASITION]);
        if (this.target) {
            removeClass([this.element], SIDEBARABSOLUTE);
            removeClass([this.target], CONTEXT);
        }
        this.destroyBackDrop();
        this.element.style.width = '';
        this.element.style.zIndex = '';
        this.element.style.transform = '';
        let sibling = document.querySelector('.e-main-content')
            || this.element.nextElementSibling;
        if (!isNullOrUndefined(sibling)) {
            sibling.style.margin = '';
            sibling.style.transform = '';
        }
        this.unWireEvents();
    }
};
__decorate$6([
    Property('auto')
], Sidebar.prototype, "dockSize", void 0);
__decorate$6([
    Property(null)
], Sidebar.prototype, "mediaQuery", void 0);
__decorate$6([
    Property(false)
], Sidebar.prototype, "enableDock", void 0);
__decorate$6([
    Property(true)
], Sidebar.prototype, "enableGestures", void 0);
__decorate$6([
    Property(false)
], Sidebar.prototype, "enableRtl", void 0);
__decorate$6([
    Property(true)
], Sidebar.prototype, "animate", void 0);
__decorate$6([
    Property('auto')
], Sidebar.prototype, "height", void 0);
__decorate$6([
    Property(false)
], Sidebar.prototype, "closeOnDocumentClick", void 0);
__decorate$6([
    Property('Left')
], Sidebar.prototype, "position", void 0);
__decorate$6([
    Property(null)
], Sidebar.prototype, "target", void 0);
__decorate$6([
    Property(false)
], Sidebar.prototype, "showBackdrop", void 0);
__decorate$6([
    Property('Auto')
], Sidebar.prototype, "type", void 0);
__decorate$6([
    Property('auto')
], Sidebar.prototype, "width", void 0);
__decorate$6([
    Property(1000)
], Sidebar.prototype, "zIndex", void 0);
__decorate$6([
    Event()
], Sidebar.prototype, "created", void 0);
__decorate$6([
    Event()
], Sidebar.prototype, "close", void 0);
__decorate$6([
    Event()
], Sidebar.prototype, "open", void 0);
__decorate$6([
    Event()
], Sidebar.prototype, "change", void 0);
__decorate$6([
    Event()
], Sidebar.prototype, "destroyed", void 0);
Sidebar = __decorate$6([
    NotifyPropertyChanges
], Sidebar);

/**
 * Sidebar modules
 */

/**
 * Navigation all modules
 */

export { HScroll, Item, Toolbar, AccordionActionSettings, AccordionAnimationSettings, AccordionItem, Accordion, MenuItem, ContextMenu, TabActionSettings, TabAnimationSettings, Header, TabItem, Tab, FieldsSettings, ActionSettings, NodeAnimationSettings, TreeView, Sidebar };
//# sourceMappingURL=ej2-navigations.es2015.js.map
