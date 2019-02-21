# :art: cordova-plugin-window-background

[![Latest Stable Version](https://img.shields.io/npm/v/cordova-plugin-window-background.svg)](https://www.npmjs.com/package/cordova-plugin-window-background)
[![Total Downloads](https://img.shields.io/npm/dt/cordova-plugin-window-background.svg)](https://npm-stat.com/charts.html?package=cordova-plugin-window-background)

This is a simple plugin for Android which will set the window background color for you app's MainActivity to a color of your choice.
This allows you to avoid the standard dark grey background which will flash for a second before your splash screen appears. Set the color to the same background as your splash screen for a smoother start-up effect.

## Installation

You'll need to set your desired window background color while installing the plugin by supplying the `WINDOW_BACKGROUND_COLOR` variable. Set it to whatever you want, preferably the same color as your splash screen.

    cordova plugin add cordova-plugin-window-background --variable WINDOW_BACKGROUND_COLOR=#ffffff --save
	
Or install directly from this repo:

    cordova plugin add https://github.com/douglaszaltron/cordova-plugin-window-background.git --variable WINDOW_BACKGROUND_COLOR=#ffffff --save

	
## Supported Platforms

- Android (cordova-android 6.0.0+)

## Configuration

A custom `WINDOW_BACKGROUND_COLOR` variable will be added to your app's config.xml after installation with the value you selected (provided you included the `--save` flag).

<plugin name="cordova-plugin-window-background">
    <variable name="WINDOW_BACKGROUND_COLOR" value="#ffffff" />
</plugin>