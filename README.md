[![Build Status](https://travis-ci.org/mpachnis/mp-calendar.svg?branch=master)](https://travis-ci.org/mpachnis/mp-calendar) [![Build Status](https://saucelabs.com/buildstatus/mpachnis)](https://saucelabs.com/beta/builds/1b8db28b460f4b9a9a9a73bf21d58b93) [![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/mpachnis/mp-calendar)


## &lt;mp-calendar&gt;


## Demo

[mp-calendar docs & demo](https://www.webcomponents.org/element/mpachnis/mp-calendar)


## Install the component using [Bower](http://bower.io/):

```bash
$ bower install --save mp-calendar
```

## Usage

1. Import Web Components' polyfill:

```html
<script src="bower_components/webcomponentsjs/webcomponents-lite.js"></script>
```

2. Import Custom Element:

```html
<link rel="import" href="bower_components/mp-calendar/mp-calendar.html">
```

3. Start using it!
<!--
```
<custom-element-demo>
    <template>
        <script src="../webcomponentsjs/webcomponents-lite.js"></script>
        <link rel="import" href="mp-calendar.html">
        <next-code-block></next-code-block>
    </template>
</custom-element-demo>
```
-->

```html

<mp-calendar day-labels='["Su","Mo","Tu","We","Th","Fr","Sa"]'
             disable-prev-days
             show-days-in-month=42
             disabled-dates="[8, 17, 29]"
             disabled-days='["Tu"]'
             disabled-weeks="[5]">
</mp-calendar>

```

## License

MIT License
