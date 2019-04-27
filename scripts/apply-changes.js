const PLUGIN_NAME = "cordova-plugin-window-background";

const V6 = "cordova-android@6";
const V9 = "cordova-android@9";

var FILE_PATHS = {};

FILE_PATHS[V6] = {
    "android.manifest": "platforms/android/AndroidManifest.xml",
    "android.styles": "platforms/android/res/values/cordova-plugin-window-background-styles.xml"
};

FILE_PATHS[V9] = {
    "android.manifest": "platforms/android/app/src/main/AndroidManifest.xml",
    "android.styles": "platforms/android/app/src/main/res/values/cordova-plugin-window-background-styles.xml"
};

var deferral, fs, path, parser, platformVersion;

function log(message) {
    console.log(PLUGIN_NAME + ": " + message);
}

function onError(error) {
    log("ERROR: " + error);
    deferral.resolve();
}

function getCordovaAndroidVersion() {
    var cordovaVersion = require(path.resolve(process.cwd(), 'platforms/android/cordova/version'));

    if (parseInt(cordovaVersion.version) <= 6) {
        cordovaVersion = V6;
    } else {
        cordovaVersion = V9;
    }

    return cordovaVersion;
}

function run() {
    try {
        fs = require('fs');
        path = require('path');
        parser = require('xml2js');
    } catch (e) {
        throw ("Failed to load dependencies. If using cordova@6 CLI, ensure this plugin is installed with the --fetch option: " + e.toString());
    }

    platformVersion = getCordovaAndroidVersion();

    var data = fs.readFileSync(path.resolve(process.cwd(), 'config.xml'));

    parser.parseString(data, attempt(function (err, result) {

        if (err) throw err;

        var color, plugins = result.widget.plugin;

        for (var n = 0, len = plugins.length; n < len; n++) {
            var plugin = plugins[n];
            if (plugin.$.name === PLUGIN_NAME && plugin.variable && plugin.variable.length > 0) {
                color = plugin.variable.pop().$.value;
                break;
            }
        }

        if (color) {
            var manifestPath = path.resolve(process.cwd(), FILE_PATHS[platformVersion]["android.manifest"]);
            var contents = fs.readFileSync(manifestPath).toString();
            fs.writeFileSync(manifestPath, contents.replace(/(android:theme="@[^=]+")()/g, 'android:theme="@style/AppTheme"'), 'utf8');

            var stylesPath = path.resolve(process.cwd(), FILE_PATHS[platformVersion]["android.styles"]);
            fs.writeFileSync(stylesPath, '<resources><style name="AppTheme" parent="@android:style/Theme.DeviceDefault.NoActionBar"><item name="android:windowBackground">@color/windowBackgroundColor</item></style><color name="windowBackgroundColor">' + color + '</color></resources>');

        } else {
            log("No custom color found in config.xml - using plugin default");
        }

        deferral.resolve();

    }));
}

function attempt(fn) {
    return function () {
        try {
            fn.apply(this, arguments);
        } catch (e) {
            onError("EXCEPTION: " + e.toString());
        }
    }
}

module.exports = function () {
    deferral = require('q').defer();
    attempt(run)();
    return deferral.promise;
};