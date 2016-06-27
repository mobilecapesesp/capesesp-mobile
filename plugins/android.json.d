{
    "prepare_queue": {
        "installed": [],
        "uninstalled": []
    },
    "config_munge": {
        "files": {
            "res/xml/config.xml": {
                "parents": {
                    "/*": [
                        {
                            "xml": "<feature name=\"OrientationLock\"><param name=\"android-package\" value=\"com.plugin.phonegap.OrientationLock\" /></feature>",
                            "count": 1
                        },
                        {
                            "xml": "<feature name=\"YoikScreenOrientation\"><param name=\"android-package\" value=\"net.yoik.cordova.plugins.screenorientation.YoikScreenOrientation\" /></feature>",
                            "count": 1
                        }
                    ]
                }
            }
        }
    },
    "installed_plugins": {
        "com.phonegap.plugins.OrientationLock": {
            "PACKAGE_NAME": "com.phonegap.helloworld"
        },
        "net.yoik.cordova.plugins.screenorientation": {
            "PACKAGE_NAME": "com.phonegap.helloworld"
        },
        "org.adlotto.cordova.recheck-screen-orientation": {
            "PACKAGE_NAME": "com.phonegap.helloworld"
        }
    },
    "dependent_plugins": {}
}