/**

    `mp-calendar` it's a web components providing calendar date functionality, events support build with Polymer 2.0.

    ### Example

        <mp-calendar day-labels='["Su","Mo","Tu","We","Th","Fr","Sa"]'
                     disable-prev-days
                     show-days-in-month=42
                     disabled-dates="[8, 17, 29]"
                     disabled-weeks="[5]"
                     disabled-days='["Tu"]'
                     events-data="events.json">
        </mp-calendar>

    ### Properties

        Property            | Type      | Default                                   | Description
        ------------------- | --------- | ------------------------------------------| -----------
        chosen              | String    | None                                      | selected day, format set to 'YYYY-MM-DD'.
        date                | Object    | {"month": NaN, "day": null, "date": d}    | The currently selected date.
        day-labels          | Array     | Full name days of the Week                | This property can be used to localize the elements day labels. Do not change the order.
        disabled-dates      | Array     | None                                      | Disable week days. Set the disabled dates. ex. disabled-dates="[4, 10, 12, 19, 30]"
        disabled-days       | Object    | None                                      | Disable week days. Set the disabled days. This will read the days from dayLabels. If you use custom dayLabels use the same values here. ex. if dayLabels default then disabled-days='["Monday", "Thursday"]'. if dayLabels custom then => day-labels='["Su","Mo","Tu","We","Th","Fr","Sa"]' disabled-days='["Mo", "Th"]'.
        disabled-in-months  | Array     | None                                      | In which month, days or weeks should be disabled. If not set the disabledDates & disabledWeeks will disabled for all months. ex. disabled-in-months="[5, 6]". The disabledDates & disabledWeeks will effective on May & June.
        disabled-weeks      | Array     | None                                      | Disable weeks, starting from 0 to 4 for default. If showDaysInMonth = 42 then total weeks = 5 ex. disabled-weeks="[3]". This will disable the 3th week.
        disable-prev-days   | Boolean   | false                                     | Disable previous month days
        event-day-color     | String    | #b56ce2                                   | Border color for the day that have more than 3 events, values can set to name, rgb or hex.
        events-file         | String    | None                                      | Specify the events json file. ex. events-data="events.json".
        first-day-of-week   | Number    | 0                                         | Set the first day of the week. Sunday is 0, Monday is 1 and so on.
        month-labels        | Array     | Full month names                          | This property can be used to localize the elements month labels.
        show-days-in-month  | Number    | 35                                        | How many day will be visible on each month, including previous and next month days.
        theme               | String    | Specify the calendar theme

    ### Styling

        Property                | Description
        ----------------------- | -----------
        --main-bg               | Calendar's main background color
        --header-bg             | Calendar's header background color
        --main-header-color     | Calendar's header color
        --header-icon-bg        | Calendar's icons background
        --header-icon-opacity   | header's icon opacity on hover event
        --labels-color          | The color of the days
        --border-width          | Calendar's border width
        --border-right-width    | Calendar's right border (if you set it to 0 then the dates will have top and bottom border)
        --border-color          | Calendar's border color
        --prev-days-bg          | Calendar's previous month dates background color
        --prev-days-color       | Calendar's previous month dates color
        --curr-days-bg          | Calendar's current month dates background
        --curr-days-color       | Calendar's current month dates color
        --next-days-bg          | Calendar's next month dates background
        --next-days-color       | Calendar's next month dates color
        --disabled-color        | Calendar's disabled dates color
        --disabled-text-shadow  | Calendar's disabled dates text shadow effect
        --selected-day-bg       | Calendar's selected day background color
        --today-boxshadow-color | Calendar's current date shadow style, it's adding a small border style effect
        --selected-day-hover-bg | Calendar's selected day background color on hover

    @demo demo/index.html
*/

import '@polymer/polymer/polymer-legacy.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import './mp-calendar-theme.js';

'use-strict';

class mpCalendar extends GestureEventListeners(PolymerElement) {
    static get template() {
        return html`
            <style include="mp-calendar-theme"></style>

            <iron-a11y-keys id="a11y" target="{{target}}" keys="up down left right tab space" on-keys-pressed="{{chosen}}"></iron-a11y-keys>

            <div id="content">
                <div id="header">
                    <div class="month-display">
                        <div id="prev-month" on-click="prevMonthHandler">
                            <svg class="calendar-icon-left" viewBox="0 0 32 32" width="32px" height="32px">
                                <path d="M7.701,14.276l9.586-9.585c0.879-0.878,2.317-0.878,3.195,0l0.801,0.8c0.878,0.877,0.878,2.316,0,3.194  L13.968,16l7.315,7.315c0.878,0.878,0.878,2.317,0,3.194l-0.801,0.8c-0.878,0.879-2.316,0.879-3.195,0l-9.586-9.587  C7.229,17.252,7.02,16.62,7.054,16C7.02,15.38,7.229,14.748,7.701,14.276z"></path>
                            </svg>
                        </div>

                        <div id="currentMonth">
                            <span class="currentMonthDate">
                                <select id="monthSelection" value="{{monthValue::change}}" title="Click to change month">
                                    <template is="dom-repeat" items="[[monthLabels]]" as="month">
                                        <option value="[[index]]">[[month]]</option>
                                    </template>
                                </select>

                                <select id="yearSelection" value="{{yearValue::change}}" title="Click to change year">
                                    <template is="dom-repeat" items="[[yearList]]" as="year">
                                        <option value="[[year]]">[[year]]</option>
                                    </template>
                                </select>
                            </span>
                            <span class="todayDate" on-click="goToCurrentDate" title="Click to go on the today date">
                                <div class="show-inner-date">{{calendarDay}}</div>
                                <svg class="calendar-icon-todayDay" viewBox="0 0 1792 1792" width="28px" height="28px">
                                    <path d="M192 1664h1408v-1024h-1408v1024zm384-1216v-288q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v288q0 14 9 23t23 9h64q14 0 23-9t9-23zm768 0v-288q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v288q0 14 9 23t23 9h64q14 0 23-9t9-23zm384-64v1280q0 52-38 90t-90 38h-1408q-52 0-90-38t-38-90v-1280q0-52 38-90t90-38h128v-96q0-66 47-113t113-47h64q66 0 113 47t47 113v96h384v-96q0-66 47-113t113-47h64q66 0 113 47t47 113v96h128q52 0 90 38t38 90z"></path>
                                </svg>
                            </span>
                        </div>

                        <div id="next-month" on-click="nextMonthHandler">
                            <svg height="32px" class="calendar-icon-left" viewBox="0 0 32 32" width="32px">
                                <path d="M24.291,14.276L14.705,4.69c-0.878-0.878-2.317-0.878-3.195,0l-0.8,0.8c-0.878,0.877-0.878,2.316,0,3.194  L18.024,16l-7.315,7.315c-0.878,0.878-0.878,2.317,0,3.194l0.8,0.8c0.878,0.879,2.317,0.879,3.195,0l9.586-9.587  c0.472-0.471,0.682-1.103,0.647-1.723C24.973,15.38,24.763,14.748,24.291,14.276z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                <div id="mpCalendar">
                    <div class="mp-cld-labels">
                        <dom-repeat items="[[dayLabels]]">
                            <template>
                                <span class="mp-cld-label">[[item]]</span>
                            </template>
                        </dom-repeat>
                    </div>
                    <div id="cldDays" class="mp-cld-days"></div>
                </div>
            </div>
        `;
    }

    static get is() {
        return 'mp-calendar';
    }

    static get properties() {
        return {
            /**
            * Disable previous month days
            */
            disablePrevDays: Boolean,

            /**
            * Disable next month days
            */
            disableNextDays: Boolean,

            /**
            * How many day will be visible on each month, including previous and next month days
            */
            showDaysInMonth: {
                type: Number,
                value: 35
            },

            /**
            * selected day, you also set a preselect day, format set to 'YYYY-MM-DD'.
            * ex. chosen="2017-06-23"
            */
            chosen: {
                type: String,
                notify: true,
                reflectToAttribute: true,
                observer: "_chosenHandler"
            },

            /**
            * Set the first day of the week: Sunday is 0, Monday is 1, etc.
            */
            firstDayOfWeek: {
                type: Number,
                value: 0
            },

            /**
            * This property can be used to localize the elements day labels. Do not change the order
            */
            dayLabels: {
                type: Array,
                value: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            },

            /**
            * This property can be used to localize the elements month labels.
            */
            monthLabels: {
                type: Array,
                value: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            },

            /**
            * Internal property that holds the current month and year displayed.
            */
            showDate: {
                type: Object,
                value: {
                    year: null,
                    month: null,
                    day: null
                },
                readOnly: true
            },

            /**
            * The currently selected date.
            */
            date: {
                type: Object,
                value: () => {
                    var d = new Date();
                    return {
                        year: d.getFullYear(),
                        month: d.getMonth() + 1,
                        day: null,
                        date: d
                    }
                },
                observer: '_dateChanged'
            },

            /**
            * Disable week days. Set the disabled dates.
            * ex. disabled-dates="[4, 10, 12, 19, 30]".
            */
            disabledDates: {
                type: Array,
                value: []
            },

            /**
            * Disable week days. Set the disabled days. This will read the days from dayLabels. If you use custom dayLabels use the same values here.
            * ex. if dayLabels default then disabled-days='["Monday", "Thursday"]'.
            * if dayLabels custom then => day-labels='["Su","Mo","Tu","We","Th","Fr","Sa"]' disabled-days='["Mo", "Th"]'.
            */
            disabledDays: {
                type: Object,
                value: []
            },

            /**
            * Disable weeks, starting from 0 to 4 for default. If showDaysInMonth = 42 then total weeks = 5
            * ex. disabled-weeks="[3]". This will disable the 3th week.
            */
            disabledWeeks: {
                type: Array,
                value: []
            },

            /**
            * Related to disabled-dates & disabled-weeks.
            * In which months, days or weeks will be disabled.
            * ex. disabled-in-months="[5, 6]". The disabled-dates & disabled-weeks will be disabled on May & June
            */
            disabledInMonths: {
                type: Array,
                value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            },

            /**
            * Set a json file that includes the events
            * ex. events-file="events.json".
            */
            eventsFile: {
                type: String,
                observer: '_loadEvents'
            },

            /**
            * Set an event object
            * ex. events-object='[{"title":"Meeting","content":"Skype call at 15:40","date":"2018-06-22","category":"red"}]'.
            */
            eventsObject: {
                type: Object,
                observer: '_loadEvents'
            },

            /**
            * Specify the color for a day that have more than 4 events.
            * Values can set to name, rgb(a) or hex
            */
            eventDayColor: {
                type: String,
                value: "#b56ce2"
            },

            /**
            * An object to keep all the events
            */
            _eventsData: {
                type: Object,
                value: {}
            },

            /**
            * Specify the calendar theme
            * available themes: light-blue, dark.
            */
            theme: {
                type: String,
                value: ""
            },

            minYear: {
                type: Number,
                value: 5
            },

            maxYear: {
                type: Number,
                value: 5
            },

            monthValue: {
                type: String,
                observer: 'setMonth'
            },

            yearValue: {
                type: String,
                observer: 'setYear'
            }
        }
    }

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback();
        this._addListeners();

        var labelList = JSON.parse(JSON.stringify(this.dayLabels));

        if (this.firstDayOfWeek != 0) {
            this.dayLabels = [];

            for (var i = 0; i < labelList.length; i++) {
                var dayName = (i + this.firstDayOfWeek) % 7;
                this.dayLabels.push(labelList[dayName])
            }
        }

        this.yearList = [];

        var d = new Date();
        var minYear = d.getFullYear() - this.minYear;
        var maxYear = d.getFullYear() + this.maxYear;

        for (minYear; minYear <= maxYear; minYear++) {
            this.yearList.push(minYear);
        }
    }

    disconnectedCallback() {
        this._removeListeners();
    }

    ready() {
        super.ready();

        if (this.eventsFile) {
            this._getJSON(this.eventsFile, (json) => {
                this._eventsData = json;
                this._initCalandar(this.showDate.month, this.showDate.year);
                this._checkChosen();
            });
        }
        else {
            this._initCalandar(this.showDate.month, this.showDate.year);
            this._checkChosen();
        }
        this._checkTheme();

        afterNextRender(this, () => {
            this.$.monthSelection.value = this.showDate.month;
            this.$.yearSelection.value = this.showDate.year;
        });
    }

    _addListeners() {
        this.$.mpCalendar.addEventListener('click', this._selectionHandler.bind(this));
    }

    _removeListeners() {
        this.$.mpCalendar.removeEventListener('click', this._selectionHandler.bind(this));
    }

    _checkTheme() {
        switch (this.theme) {
            case 'light-blue':
                this._lightBlueTheme();
                break;
            case 'dark':
                this._darkTheme();
                break;
            case 'light-grey':
                this._lighGreyTheme();
                break;
        }
    }

    _checkChosen() {
        if (this.chosen !== "" && this.chosen !== undefined) {
            var date = new Date(this.chosen);
            this.showDate.year = date.getFullYear();

            this.date = {
                year: this.showDate.year,
                month: date.getMonth() + 1,
                day: date.getDate(),
                date: date,
                isoDate: this.chosen
            }
        }
    }

    _selectionHandler(e) {
        if (e.target.getAttribute('data-date') == null)
            return;

        var dataDate = e.target.getAttribute("data-date");
        var dateObj = new Date(dataDate);

        this.chosen = dataDate;
        this.showDate.year = dateObj.getFullYear();
        this.date = {
            year: this.showDate.year,
            month: dateObj.getMonth() + 1,
            day: dateObj.getDate(),
            date: dateObj,
            isoDate: dataDate
        };
    }

    _chosenHandler(e) {
        var chosenDate = new Date(e);
        var chosenMonth = chosenDate.getMonth();

        if (chosenMonth == this.date.date.getMonth()) {
            var selection = dom(this.$.cldDays).querySelector('.selected');
            if (selection) {
                selection.classList.remove('selected');
            }
            if (e == "" || e == null) {
                this.chosen = "";
            }
            else {
                this.chosen = e;
                var days = dom(this.$.mpCalendar).querySelectorAll('.day');

                days.forEach((e, i) => {
                    if (this.chosen == e.getAttribute('data-date')) {
                        e.classList.add('selected');
                    }
                });
                this.date.day = chosenDate.getDate();
            }
        }
        else {
            this.showDate = {
                month: chosenMonth,
                year: chosenDate.getFullYear()
            };
        }
    }

    prevMonthHandler() {
        this.set('showDate.month', this.showDate.month <= 0 ? 11 : this.showDate.month - 1);
        this.set('showDate.year', this.showDate.month == 11 ? this.showDate.year - 1 : this.showDate.year);
        this.chosen = "";

        this.notifyPath('date.year', this.showDate.year);

        this.currentMonth = this.monthLabels[this.showDate.month];
        this._initCalandar(this.showDate.month, this.showDate.year);
        this.$.monthSelection.value = this.showDate.month;
        this.$.yearSelection.value = this.showDate.year;
        this._fire('prevMonth', this.showDate);
    }

    nextMonthHandler() {
        this.set('showDate.month', this.showDate.month == 11 ? 0 : this.showDate.month + 1);
        this.set('showDate.year', this.showDate.month <= 0 ? this.showDate.year + 1 : this.showDate.year);
        this.chosen = "";

        this.notifyPath('date.year', this.showDate.year);

        this.currentMonth = this.monthLabels[this.showDate.month];
        this._initCalandar(this.showDate.month, this.showDate.year);
        this.$.monthSelection.value = this.showDate.month;
        this.$.yearSelection.value = this.showDate.year;
        this._fire('nextMonth', this.showDate);
    }

    setMonth(month) {
        this._setShowDate = {
            month: parseInt(month),
            year: this.showDate.year
        };

        this.chosen = "";
        this._initCalandar(parseInt(month), parseInt(this.$.yearSelection.value));
        this._fire('monthChanged', this.showDate);
    }

    setYear(year) {
        this._setShowDate = {
            month: this.showDate.month - 1,
            year: parseInt(year)
        };

        this.chosen = "";
        this._initCalandar(parseInt(this.$.monthSelection.value), year);
        this._fire('monthChanged', this.showDate);
    }

    _fire(ev, el) {
        this.dispatchEvent(new CustomEvent(ev, {
            bubbles: true,
            composed: true,
            detail: el
        }));
    }

    _dateChanged(newDate, oldDate) {
        var date = new Date();
        var month = parseInt(newDate.month) || 1;
        var year = parseInt(newDate.year) || date.getFullYear();
        var day = parseInt(newDate.day) || 1;

        this.date.month = month;
        this.date.year = year;
        this.date.day = this.date.day != null ? day : null;

        this._setShowDate({
            month: month - 1,
            year: year
        });

        this.currentMonth = this.monthLabels[this.showDate.month];
        this.calendarDay = this.date.day != null ? day : date.getDate();

        if (!!newDate && !!oldDate) {
            if (newDate.date.getMonth() > oldDate.date.getMonth()) {
                this._initCalandar(this.showDate.month, this.showDate.year);
                this._fire('nextMonth', this.showDate);
            }
            if (newDate.date.getMonth() < oldDate.date.getMonth()) {
                this._initCalandar(this.showDate.month, this.showDate.year);
                this._fire('prevMonth', this.showDate);
            }
            this._fire('dateSelected', this.date);
        }

        this.$.monthSelection.value = this.showDate.month;
        this.$.yearSelection.value = this.showDate.year;
    }

    goToCurrentDate(e) {
        var today = new Date();

        this.date = {
            date: today,
            day: today.getDate(),
            month: today.getMonth() + 1,
            year: today.getFullYear()
        }

        this.chosen = "";
        this._initCalandar(this.showDate.month, this.showDate.year);
        this.$.monthSelection.value = this.showDate.month;
        this.$.yearSelection.value = this.showDate.year;
        this._fire('currMonth', this.date);
    }

    _initCalandar(month, year) {
        var today = new Date();
        var thisDay = today.getDate();
        var thisMonth = today.getMonth() + 1;
        var dayOfMonthStart = new Date(year, month, 1).getDay() == 0 ? 7 : new Date(year, month, 1).getDay(); // which day the month starts (0 - 6)
        var calendarElem = dom(this.$.mpCalendar);
        var previousMonth, previousYear, nextMonth, nextYear, previousMonthDays, disDays;

        this.$.cldDays.innerHTML = '';

        if (month === 0) {
            previousMonth = 11;
            previousYear = year - 1;
        }
        else {
            previousMonth = month - 1;
            previousYear = year
        }
        if (month === 11) {
            nextMonth = 0;
            nextYear = year + 1;
        }
        else {
            nextMonth = month + 1;
            nextYear = year;
        }

        if (month === 0) {
            previousMonthDays = this._numberOfDays(12, year);
        }
        else {
            previousMonthDays = this._numberOfDays(month, year);
        }

        var currentMonthDays = this._numberOfDays(month + 1, year);
        var nextMonthDays = this._numberOfDays(month + 2, year);

        // define default day variables
        var dayN = 1;
        var dayOfNextMonth = 1;
        var days = this.$.cldDays;

        var showDaysInMonth = this.showDaysInMonth;
        if (dayOfMonthStart >= 5 && this.showDaysInMonth < 37 && currentMonthDays > 29) {
            showDaysInMonth = 42
        }
        for (var i = 0; i < showDaysInMonth; i++) {
            var day = document.createElement('span');
            // separated into weeks
            if (i % 7 === 0) {
                var week = document.createElement('div');
                week.className += "mp-cld-week";
                week.setAttribute("week", i / 7);

                // check for disabled weeks
                if (this.disabledWeeks != "" || this.disabledInMonths != "") {
                    this.disabledInMonths.forEach((disMonth) => {
                        if (disMonth == month + 1) {
                            this.disabledWeeks.forEach((disWeek) => {
                                if (disWeek == i / 7) {
                                    week.className += " disabledWeek";
                                }
                            });
                        }
                    });
                }
            }

            if (i < (dayOfMonthStart - this.firstDayOfWeek)) {
                day.className += "mp-cld-day prevMonth";

                if (this.disablePrevDays) {
                    day.innerHTML += "&nbsp;";
                    day.className += " disabled";
                }
                else {
                    var number = this._dayNumber((previousMonthDays - dayOfMonthStart) + (i + 1 + this.firstDayOfWeek), previousMonth + 1, previousYear, day);
                }
            }

            else if (dayN <= currentMonthDays) {
                day.className += "mp-cld-day currMonth";
                var number = this._dayNumber(dayN++, month + 1, year, day);

                // If today
                if ((dayN - 1) == thisDay && month == thisMonth - 1 && this.date.year == year) {
                    day.className += " today";
                }

                // Keep the selected day on month change
                if (this.chosen) {
                    if ((dayN - 1) == this.date.day && month == month && this.date.year == year) {
                        day.className += " selected";
                    }
                }

                // check for disabled days
                if (this.disabledDays != "" && this.disabledInMonths != "") {
                    this.disabledInMonths.forEach((disMonth) => {
                        if (disMonth == month + 1) {
                            this.disabledDays.forEach((disDay, i) => {
                                this.dayLabels.forEach((labDay, d) => {
                                    if (disDay === labDay) {
                                        var date = new Date();
                                        date.setDate(d);
                                        date.setMonth(month);

                                        if (date.getFullYear() != year) {
                                            date.setYear(year);
                                        }

                                        disDays = this._getDisabledDays(d, month, year);

                                        disDays.forEach((date) => {
                                            if (date.getDate() == dayN - 1) {
                                                day.className += " disabledDay";
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    });
                }

                // check for disabled dates
                if (this.disabledDates != "" && this.disabledInMonths != "") {
                    this.disabledInMonths.forEach((disMonth) => {
                        if (disMonth == month + 1) {
                            this.disabledDates.forEach((disDay) => {
                                if (disDay == dayN - 1) {
                                    day.className += " disabledDay";
                                }
                            });
                        }
                    });
                }
            }
            else {
                day.className += "mp-cld-day nextMonth";
                if (this.disableNextDays) {
                    day.innerHTML += "&nbsp;";
                    day.className += " disabled";
                }
                else {
                    var number = this._dayNumber(dayOfNextMonth++, nextMonth + 1, nextYear, day);
                }
            }

            dom(days).appendChild(week);
            dom(week).appendChild(day);
        }
        dom(calendarElem).appendChild(days);

        if (this.eventsFile || this.eventsObject) {
            this._findAllEvents(this._eventsData);
        }
    }

    // get days number of each month
    // The month passed in is 1 for January, 2 for February and so on
    _numberOfDays(month, year) {
        return new Date(year, month, 0).getDate();
    }

    // modify each day with 2 digit number and add attributes
    _dayNumber(dayDate, month, year, dayElem) {
        var span = document.createElement('span');
        var dd = (dayDate < 10 ? '0' : '') + dayDate;
        var mm = (month < 10 ? '0' : '') + month;
        var dataDate = (year + "-" + mm + "-" + dd);

        dayElem.className += " day";
        dayElem.innerHTML += dayDate;
        dayElem.setAttribute("data-date", dataDate);
        dayElem.setAttribute("tabindex", 0);

        return dayElem;
    }

    _getDisabledDays(day, month, year) {
        var disDays = [];
        var monthDays = this._numberOfDays(month, year);

        for (var i = 0; i <= monthDays; i++) {
            var date = new Date(year, month, i, 0);
            if (date.getDay() == day) {
                disDays.push(date);
            }
        }
        return disDays;
    }

    _getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        xhr.open('GET', url, true);
        xhr.send();
    }

    _findAllEvents(events) {
        var today = new Date();
        var dd = (today.getDate() < 10 ? '0' : '') + today.getDate();
        var mm = (today.getMonth() < 10 ? '0' : '') + (today.getMonth() + 1);
        var isoToday = (today.getFullYear() + "-" + mm + "-" + dd);

        events.forEach((item) => {
            var selector = '.day[data-date="' + item.date + '"]';
            var result = this.$.content.querySelector(selector);
            var event = '';
            var dayEvents = [];
            var weight = 0;
            var color = '';

            if (result != undefined || result != null) {
                for (var i in events) {
                    if (events[i].date === result.getAttribute('data-date')) {
                        dayEvents.push(events[i]);
                    }
                }

                // from http://www.bootstrap-year-calendar.com/
                if (dayEvents.length <= 3) {
                    weight = 3
                }
                else {
                    result.style.boxShadow = "inset -4px 0 0 0 " + this.eventDayColor + "";
                }

                if (weight > 0) {
                    var boxShadow = '';

                    for (var i in dayEvents) {
                        if (boxShadow != '') {
                            boxShadow += ',';
                        }

                        if (dayEvents[i].date === isoToday) {
                            boxShadow += "var(--today-boxshadow-color) 0 -2px 0 0 inset, ";
                        }

                        boxShadow += 'inset -' + (parseInt(i) + 1) * weight + 'px 0 0 0 ' + ((dayEvents[i].color == undefined) ? dayEvents[i].category : dayEvents[i].color);
                    }
                    result.style.boxShadow = boxShadow;
                }

                if (result.children.length == 0) {
                    event += '<div class="mp-cld-event"><div class="event">'
                        + '<h3 class="' + item.category + '" ' + (item.color ? ('style="color:' + item.color + '"') : '') + '>' + item.title + ''
                        + '<i>' + item.date + '</i>'
                        + '</h3>'
                        + '<span>' + item.content + '</span>'
                        + '</div></div>';

                    dom(result).innerHTML += event;
                }
                else {
                    for (var i = 0; i < result.children.length; i++) {
                        event += '<span class="separator"></span><div class="event">'
                            + '<h3 class="' + item.category + '" ' + (item.color ? ('style="color:' + item.color + '"') : '') + '>' + item.title + ''
                            + '<i>' + item.date + '</i>'
                            + '</h3>'
                            + '<span>' + item.content + '</span>'
                            + '</div>';

                        dom(result.children[i]).innerHTML += event;
                    }
                }

                setTimeout(() => {
                    this.horizontallyBound(this, result.children[0]);
                });
            }
        });
    }

    // check if event falls out of the parent div
    horizontallyBound(parentDiv, childDiv) {
        var parentRect = parentDiv.getBoundingClientRect();
        var childRect = childDiv.getBoundingClientRect();

        if ((childRect.left + childRect.width) > parentRect.width) {
            childDiv.classList.remove("mp-cld-event");
            childDiv.classList.add("eventLeft");
        }
    }

    _loadEvents() {
        if (this.eventsFile) {
            this._getJSON(this.eventsFile, (json) => {
                this._eventsData = json;
                this._initCalandar(this.showDate.month, this.showDate.year);
                this._checkChosen();
            });
        }
        else {
            this._eventsData = this.eventsObject;
            this._initCalandar(this.showDate.month, this.showDate.year);
            this._checkChosen();
        }
    }

    _lightBlueTheme() {
        this.updateStyles({
            '--main-bg': '#fff',
            '--header-bg': 'rgba(6, 143, 189, .85)',
            '--main-header-color': '#fff',
            '--header-icon-bg': '#fff',
            '--header-icon-opacity': '',
            '--labels-color': '#068fbd',
            '--border-width': '1px',
            '--border-right-width': '0',
            '--border-color': 'rgba(6, 143, 189, .15)',
            '--prev-days-bg': '',
            '--prev-days-color': '#068fbd',
            '--curr-days-bg': '',
            '--curr-days-color': '#068fbd',
            '--next-days-bg': '',
            '--next-days-color': '#068fbd',
            '--disabled-color': 'rgba(6, 143, 189, .3)',
            '--disabled-text-shadow': '0 0 3px rgba(0, 0, 0, .25)',
            '--selected-day-bg': '#078dc0',
            '--today-boxshadow-color': '#077599',
            '--selected-day-hover-bg': 'rgba(6, 143, 189, .7)'
        });
    }

    _darkTheme() {
        this.updateStyles({
            '--main-bg': '#000',
            '--header-bg': '#000',
            '--main-header-color': '#fff',
            '--header-icon-bg': '#f33127',
            '--header-icon-opacity': '',
            '--labels-color': '#fff',
            '--border-width': '1px',
            '--border-color': 'rgba(255, 255, 255, .2)',
            '--prev-days-color': '#fff',
            '--curr-days-bg': '',
            '--curr-days-color': '#fff',
            '--prev-next-days-bg': 'rgba(158, 21, 14, 0.6)',
            '--next-days-color': '#fff',
            '--disabled-color': 'rgba(255, 255, 255, .3)',
            '--disabled-text-shadow': '0 0 2px rgba(255, 255, 255, .35)',
            '--selected-day-bg': '#af221b',
            '--today-boxshadow-color': '#f33127',
            '--selected-day-hover-bg': 'rgba(255, 13, 0, .5)'
        });
    }

    _lighGreyTheme() {
        this.updateStyles({
            '--header-bg': '#fff',
            '--main-header-color': '#424242',
            '--header-icon-bg': '#424242',
            '--header-icon-opacity': '',
            '--inner-date-color': '#2ab327',
            '--labels-color': '#2ab327',
            '--labels-bg': '#fff',
            '--border-width': '0',
            '--border-top-width': '2px',
            '--border-right-width': '2px',
            '--border-color': 'rgba(255, 255, 255, 1)',
            '--prev-days-color': '#424242',
            '--curr-days-bg': '#e8e7e7',
            '--curr-days-color': '#424242',
            '--prev-next-days-bg': '#fff',
            '--next-days-color': '#424242',
            '--disabled-color': 'rgba(255, 255, 255, .3)',
            '--disabled-text-shadow': '0 0 2px rgba(255, 255, 255, .35)',
            '--selected-day-bg': '#2ab327',
            '--selected-day-hover-bg': '#2ab327',
            '--today-boxshadow-color': '#2ab327'
        });
    }
}
customElements.define(mpCalendar.is, mpCalendar);
