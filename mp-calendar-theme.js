const mpCalendarTheme = document.createElement('template');
mpCalendarTheme.setAttribute('style', 'display: none;');

mpCalendarTheme.innerHTML = `<dom-module id="mp-calendar-theme">
    <template>
        <style>
            :host {
                font-family: "Helvetica Neue", Helvetica;
                display: block;
                box-sizing: border-box;

                --white-color: #fff;
                --light-grey-color: #dcdcdc;
                --grey-color: #757575;
                --light-blue-color: #daecff;
                --dark-grey-color: #464545;
                --dark-blue-color: #032f62;

                --main-bg: #fff;
                --header-bg: #f7f7f7;
                --main-header-color: #757575;
                --header-icon-bg: #006df0;
                --header-icon-opacity: .7;

                --labels-bg: ;
                --labels-color: #757575;
                --border-width: 1px;
                --border-top-width: 1px;
                --border-right-width: 1px;
                --border-bottom-width: 1px;
                --border-left-width: 1px;
                --border-color: #eaeaea;
                --prev-days-bg: #f7f7f7;
                --prev-days-color: #a0a0a0;
                --curr-days-bg: #fff;
                --curr-days-color: #757575;
                --next-days-bg: #f1f1f1;
                --next-days-color: #a0a0a0;
                --prev-next-days-bg: rgba(241, 241, 241, .7);
                --disabled-color: rgba(117, 117, 117, .3);
                --disabled-text-shadow: 0 0 2px rgba(0, 0, 0, .25);

                --selected-day-bg: #006df0;
                --today-boxshadow-color: #006df0;
                --selected-day-color: #006df0;
                --selected-day-hover-bg: rgba(0, 109, 240, .8);

                --border-radius: 4px;

                --layout: {
                    display: flex;
                    display: -ms-flexbox;
                    display: -webkit-flex;
                };

                --layout-horizontal: {
                    @apply(--layout);

                    flex-direction: row;
                    -ms-flex-direction: row;
                    -webkit-flex-direction: row;
                };

                --layout-justified: {
                    justify-content: space-between;
                    -ms-flex-pack: justify;
                    -webkit-justify-content: space-between;
                };

                --no-selection: {
                    user-select: none;
                    -ms-user-select: none;
                    -moz-user-select: none;
                    -khtml-user-select: none;
                    -webkit-user-select: none;
                    -webkit-touch-callout: none;
                };
            }

            #content {
                width: 100%;
                margin: 20px 0;
                background: var(--main-bg);
                border: var(--border-width) solid var(--border-color);
                border-radius: var(--border-radius);
            }

            #header {
                @apply(--no-selection);
                margin: 0;
                font-size: 17px;
                font-weight: bold;
            }

            #header > div {
                @apply(--layout);
                @apply(--layout-justified);
                width: 100%;
                color: var(--main-header-color);
                background: var(--header-bg);
                padding: 7px 0;
                border-radius: 4px 4px 0 0;
            }

            /* month selection */
            #monthSelection, #yearSelection {
                overflow: hidden;
                background: none;
                border: none;
                color: var(--header-icon-bg);
                font-size: 15px;
                font-family: Helvetica, "Helvetica Neue";
                font-weight: bold;
                text-align-last: right;
                cursor: pointer;
                position: relative;
                outline: 0;
                appearance: none;
                -ms-appearance: none;
                -moz-appearance: none;
                -webkit-appearance: none;

            }

                #monthSelection option, #yearSelection option {
                    direction: ltr;
                }

            .mp-cld-labels {
                min-width: 37.5px;
                padding: 0;
                background: var(--labels-bg);
                color: var(--labels-color);
                font-weight: bold;
                border-top: var(--border-top-width) solid var(--border-color);

                @apply(--layout);
                @apply(--week-layout)
            }

            .mp-cld-main, .mp-cld-days {
                width: 100%;
                margin: 0;
                border-top: var(--border-top-width) solid var(--border-color);
            }

            .calendar-icon-left,
            .calendar-icon-right { width: 26px; height: 26px; vertical-align: middle }

            .calendar-icon-left { margin: 0 0 0 5px }
            .calendar-icon-right { margin: 0 5px 0 0 }

            .currentMonthDate, .todayDate {
                vertical-align: middle;
                position: relative;
            }

                .todayDate:hover {
                    cursor: pointer
                }

            .calendar-icon-todayDay {
                width: 20px;
                height: 20px;
                display: inline-block;
                vertical-align: sub
            }

                svg.calendar-icon-left:hover,
                svg.calendar-icon-right:hover,
                svg.calendar-icon-todayDay:hover { cursor: pointer }

                svg.calendar-icon-left,
                svg.calendar-icon-right,
                svg.calendar-icon-todayDay { fill: var(--header-icon-bg); transition: all .3s ease-in-out; }

                    svg.calendar-icon-left:hover,
                    svg.calendar-icon-right:hover,
                    svg.calendar-icon-todayDay:hover {
                        /*fill: var(--header-icon-hover-bg);*/
                        opacity: var(--header-icon-opacity);
                    }

                .show-inner-date {
                    font-size: 10px;
                    width: 20px;
                    height: 60%;
                    color: var(--inner-date-color);
                    position: absolute;
                    top: 7px;
                    right: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

            .mp-cld-labels, .mp-cld-days { margin: 0; padding-left: 0; }

            .mp-cld-label {
                width: 14.285%;
                font-size: 16px;
                color: var(--labels-color);
                line-height: 40px;
                text-align: center;
                border-right: var(--border-right-width) solid var(--border-color);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

                .mp-cld-label:nth-child(7), .mp-cld-day:nth-child(7) {
                    margin-right: 0;
                    border-right: 1px solid transparent;
                }

            .mp-cld-week {
                border-top: var(--border-top-width) solid var(--border-color);
                position: relative
            }

                .mp-cld-week:nth-child(1) {
                    border-top: none
                }

                .mp-cld-week.disabledWeek {
                    position: relative;
                    text-shadow: var(--disabled-text-shadow);
                    pointer-events: none
                }

                .mp-cld-week.disabledWeek > .mp-cld-day {
                    background: none;
                    color: var(--disabled-color);
                }

            .mp-cld-day {
                width: 14.285%;
                margin: 0;
                padding: 10px;
                font-size: 16px;
                text-align: center;
                border-right: var(--border-right-width) solid var(--border-color);
                cursor: pointer;
                display: inline-block;
                box-sizing: border-box;
                transition: all .3s ease-in-out;
            }

            .mp-cld-day.prevMonth,
            .mp-cld-day.currMonth,
            .mp-cld-day.nextMonth {
                position: relative;
                transition: background-color .22s ease-in-out;
            }

            .mp-cld-day.prevMonth {
                background: var(--prev-days-bg);
                color: var(--prev-days-color);
            }
            .mp-cld-day.currMonth {
                color: var(--curr-days-color);
            }

            .mp-cld-day.nextMonth {
                background: var(--next-days-bg);
                color: var(--next-days-color);
            }

                .mp-cld-day.prevMonth span, .mp-cld-day.currMonth span,
                .mp-cld-day.nextMonth span {
                    position: relative;
                }

            .mp-cld-day.prevMonth, .mp-cld-day.nextMonth {
                background: var(--prev-next-days-bg);
            }

                .mp-cld-day.prevMonth:hover,
                .mp-cld-day.currMonth:hover,
                .mp-cld-day.nextMonth:hover {
                    cursor: pointer;
                }

                    .mp-cld-day.prevMonth::before,
                    .mp-cld-day.currMonth::before,
                    .mp-cld-day.nextMonth::before {
                        content: '';
                        width: 5px;
                        height: 5px;
                        background: transparent;
                        margin-left: -2.5px;
                        position: absolute;
                        top: 30px;
                        left: 50%;
                        z-index: 0;
                        border-radius: 50%;
                        transition: all .5s ease-in-out;
                    }

                    .mp-cld-day.prevMonth:hover::before,
                    .mp-cld-day.currMonth:hover::before,
                    .mp-cld-day.nextMonth:hover::before {
                        background: var(--selected-day-bg);
                    }

             .mp-cld-day.today {
                position: relative;
                z-index: 5;
                box-shadow: var(--today-boxshadow-color) 0 -2px 0 0 inset
            }

            .mp-cld-day.currMonth.selected,
            .mp-cld-day.nextMonth.selected {
                background: var(--selected-day-bg) !important;
                color: var(--white-color);
                position: relative;
                cursor: pointer;
                z-index: 5;
                transition: all .4s ease-in-out;
            }

                .mp-cld-day.currMonth.selected:hover {
                    background: var(--selected-day-hover-bg);
                }

                .mp-cld-day.currMonth.selected:hover::before {
                    background: none;
                }

            .mp-cld-day.prevMonth.disabled {
                pointer-events: none;
            }

                .mp-cld-day.prevMonth.disabled:hover {
                    background: var(--prev-days-bg);
                    border-bottom: none;
                    cursor: default;
                }

                    .mp-cld-day.disabled:hover::before {
                        background: none;
                    }

            .mp-cld-day.disabledDay {
                text-shadow: var(--disabled-text-shadow);
                color: var(--disabled-color);
                pointer-events: none
            }

            .mp-cld-number {
                position: relative;
                margin: 0;
                padding: 10px;
            }

            .mp-cld-title {
                position: absolute;
                z-index: 5;
                display: none;
                top: 35px;
                left: 0;
                padding: 5px 10px;
                background: var(--white-color);
                white-space: nowrap;
                border: 1px solid #ccc;
                border-radius: 5px;
                font-size: 12px;
            }

            .mp-cld-number:hover .mp-cld-title { display: block; }

            .mp-cld-title::before {
                content: '';
                position: absolute;
                top: -7.5px; left: 10px;
                width: 0;
                height: 0;
                border-left: 7.5px solid transparent;
                border-right: 7.5px solid transparent;
                border-bottom: 7.5px solid #ccc;
            }

            .mp-cld-number.eventday { font-weight: bold; color: #0080FF; }

                .mp-cld-number.eventday:hover { cursor: pointer; background: #eee; }

                .today .mp-cld-number.eventday:hover { background: #005eff; }

            .mp-cld-day .mp-cld-event, .mp-cld-day .eventLeft {
                width: 120%;
                background: #f1f1f1;
                color: #757575;
                border: 1px solid #ccc;
                padding: 0 5px;
                position: absolute;
                top: 0;
                left: 105%;
                opacity: 0;
                z-index: 100;
                visibility: hidden;
                transition: visibility 0s linear .5s, opacity .5s linear;
                box-sizing: border-box
            }

            .mp-cld-day .eventLeft {
                right: 105%;
                left: inherit;
            }

                .mp-cld-day .mp-cld-event::before,
                .mp-cld-day .mp-cld-event::after,
                .mp-cld-day .eventLeft::before,
                .mp-cld-day .eventLeft::after {
                    width: 0;
                    height: 0;
                    content: '';
                    z-index: 5;
                    position: absolute;
                    left: 50%;
                }

                .mp-cld-day .eventLeft::before,
                .mp-cld-day .eventLeft::after {
                    right: 50%;
                    left: inherit
                }

                .mp-cld-day .mp-cld-event::before {
                    border: 8px solid transparent;
                    border-right-color: #f1f1f1;
                    margin-left: -16px;
                    top: 10px;
                    left: 0;
                    z-index: 6;
                }

                .mp-cld-day .mp-cld-event::after {
                    border: 9px solid transparent;
                    border-right-color: #ccc;
                    margin-left: -17px;
                    top: 9px;
                    left: -1px;
                }

                    .mp-cld-day .eventLeft::before {
                        border: 8px solid transparent;
                        border-left-color: #f1f1f1;
                        margin-right: -16px;
                        top: 10px;
                        right: 0;
                        z-index: 6;
                    }

                    .mp-cld-day .eventLeft::after {
                        border: 9px solid transparent;
                        border-left-color: #ccc;
                        margin-right: -18px;
                        top: 9px;
                        right: 0;
                        left: inherit;
                    }

                .mp-cld-day h3.red { color: #e81c12; }
                .mp-cld-day h3.blue { color: #1153d8; }
                .mp-cld-day h3.green { color: #3c763d; }
                .mp-cld-day h3.orange { color: #e88e0f; }

                .mp-cld-day .mp-cld-event .event h3, .mp-cld-day .eventLeft .event h3 {
                    font-size: 16px;
                    margin: 10px 5px 0;
                    text-align: left;
                    line-height: 16px;
                }

                    .mp-cld-day .mp-cld-event:hover,
                    .mp-cld-day .eventLeft:hover {
                        cursor: auto;
                    }

                    .mp-cld-day .mp-cld-event .event:nth-child(1) > h3,
                    .mp-cld-day .eventLeft .event:nth-child(1) { margin-top: 8px; }

                .mp-cld-day .mp-cld-event .event,
                .mp-cld-day .eventLeft .event { position: relative; }

                .mp-cld-day .mp-cld-event .separator,
                .mp-cld-day .eventLeft .separator { width: 100%; margin: 0 0 15px; position: relative; }

                    .mp-cld-day .mp-cld-event .separator:nth-child(1n+1)::before,
                    .mp-cld-day .mp-cld-event .separator:nth-child(1n+1)::after,
                    .mp-cld-day .eventLeft .separator:nth-child(1n+1)::before,
                    .mp-cld-day .eventLeft .separator:nth-child(1n+1)::after {
                        background-color: #9e9e9e;
                        content: '';
                        height: 1px;
                        position: absolute;
                        bottom: 0;
                        width: 50%;
                        box-sizing: border-box;
                    }

                    .mp-cld-day .mp-cld-event .separator:nth-child(1n+1)::before,
                    .mp-cld-day .eventLeft .separator:nth-child(1n+1)::before {
                        background-image: -webkit-gradient(linear,right top,left top,from(#9e9e9e),to(#f1f1f1));
                        background-image: -webkit-linear-gradient(right,#9e9e9e, #f1f1f1);
                        background-image: -moz-linear-gradient(right,#9e9e9e, #f1f1f1);
                        background-image: -ms-linear-gradient(right,#9e9e9e, #f1f1f1);
                        background-image: -o-linear-gradient(right,#9e9e9e, #f1f1f1);
                        background-image: linear-gradient(right,#9e9e9e, #f1f1f1);
                        left: 0;
                    }

                    .mp-cld-day .mp-cld-event .separator:nth-child(1n+1)::after,
                    .mp-cld-day .eventLeft .separator:nth-child(1n+1)::after {
                        background-image: -webkit-gradient(linear,left top,right top,from(#9e9e9e),to(#f1f1f1));
                        background-image: -webkit-linear-gradient(left,#9e9e9e, #f1f1f1);
                        background-image: -moz-linear-gradient(left,#9e9e9e, #f1f1f1);
                        background-image: -ms-linear-gradient(left,#9e9e9e, #f1f1f1);
                        background-image: -o-linear-gradient(left,#9e9e9e, #f1f1f1);
                        background-image: linear-gradient(left,#9e9e9e, #f1f1f1);
                        right: 0;
                    }

                    .mp-cld-day .mp-cld-event .separator:last-child,
                    .mp-cld-day .eventLeft .separator:last-child { display: none; }

                    .mp-cld-day .mp-cld-event h3 i,
                    .mp-cld-day .eventLeft h3 i {
                        font-size: 11px;
                        font-style: italic;
                        font-weight: normal;
                        margin: 2px 0 0;
                        display: block;
                    }

                .mp-cld-day .mp-cld-event span,
                .mp-cld-day .eventLeft span {
                    font-size: 12px;
                    margin: 5px 5px 10px;
                    text-align: left;
                    display: block;
                }

                .mp-cld-day.prevMonth:hover .mp-cld-event,
                .mp-cld-day.prevMonth:hover .eventLeft,
                .mp-cld-day.currMonth:hover .mp-cld-event,
                .mp-cld-day.currMonth:hover .eventLeft,
                .mp-cld-day.nextMonth:hover .mp-cld-event,
                .mp-cld-day.nextMonth:hover .eventLeft {
                    opacity: 1;
                    visibility: visible;
                    transition-delay: 0s;
                }

                @media (max-width: 800px) {
                    .mp-cld-day .mp-cld-event { width: 200%; left: 115%; }
                    .mp-cld-day .eventLeft { width: 200%; right: 115%; }
                }

                @media (max-width: 414px) {
                    .mp-cld-day .mp-cld-event, .mp-cld-day .eventLeft { width: 350%; }
                    .mp-cld-day .mp-cld-event .event h3,
                    .mp-cld-day .eventLeft .event h3 { font-size: 14px; }
                }
        </style>
    </template>
</dom-module>`;

document.head.appendChild(mpCalendarTheme.content);
