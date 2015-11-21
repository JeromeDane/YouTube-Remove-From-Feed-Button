# Remove from Feed Button for YouTube

Easily remove videos from your YouTube subscription feed. Ads a (x) button to the right of each video so you can remove them with a single click.

![screen shot](https://github.com/JeromeDane/YouTube-Remove-From-Feed-Button/blob/master/screenshots/screenshot-640x400.png?raw=true)

If you like this extension, you can always **[buy me a cup of coffee](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KF2QJ87Q37PFJ)**.

For updates on this and other projects, follow me on one of the following sites:

[Google+](https://plus.google.com/107905455800180378660/posts) |
[Facebook](https://www.facebook.com/Dane.Jerome) |
[Twitter](https://twitter.com/JeromeDane)

Note: The round "Delete" icon in this extension's icon is by Black Bear Blanc.

## Install (use this project)

There are several options for using this project:

* Install as a [browser extension for Chrome](https://chrome.google.com/webstore/detail/remove-from-feed-button-f/ogclfblkiagkkfpdbbbphchgfkieecml)
* Install as a [user script](https://greasyfork.org/en/scripts/13182-remove-from-feed-button-for-youtube) ([mirror](https://openuserjs.org/scripts/JeromeD/Remove_from_Feed_Button_for_YouTube)) using something like [Greasemonkey](https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/) or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?)

## Hack This Code

1. Clone this repository to your local machine
2. Make sure you have [NodeJS](https://nodejs.org) installed
3. Navigate to the root of this project on your local machine in your command line interface
4. Run `npm install` to install all required dependencies
5. Make desired changes to files in `src/`
6. Build the source code as described below

If you make useful changes, please create a pull request so I can get them merged back into the master branch and official distribution channels for this project.

### Building Source Code

The following gulp build tasks can be used by running them on in your command line interface:

* `gulp script` - Compile a userscript version of this code to `dist/userscript`
* `gulp chrome:build` - Create `build/chrome` directory and files which can be loaded as an unpacked extension
* `gulp chrome:dist` - Create a zip file in `dist/chrome/chrome-extensionv[version].zip`
* `gulp clean` - Removes `dist/` and `build/` folders, along with their contents

#### Watching for Changes in Source Code

You can watch the source code for changes and automatically re-build the related files by starting the following gulp tasks:

* `gulp script:watch` - Watch for changes in the `src/` folder, and automatically update `build/userscript/`
* `gulp chrome:watch` - Watch for changes in the `src/` folder, and automatically update `build/chrome/`

#### Troubleshooting

If you get an error about `gulp` not being in your path when you run the commands above, you can try installing `gulp` globally on your machine by typing `npm install -g gulp`. If you still have problems (especially on windows machines), you may need to add the path to the gulp binary to your system path. Google will tell you how. ;-)

### Auto Reload Chrome Extension

Using `gulp chrome-watch` with [Chrome Extension Auto Reload](https://github.com/JeromeDane/chrome-extension-auto-reload) installed and running allows you to load this project as an unpacked extension from `build/chrome` and have it automatically reload any time the files in `src/` are changed. This saves you having to go to the Chrome extensions tab and hit reload every time you make any changes.

## License

[Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by-nc-sa/3.0/)

You can share or modify this work as long as you:

1. Link back to this page
2. Don't use this or derivatives of this for commercial use
3. Share your changes so that others can benifit from your improvements.
