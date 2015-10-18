# Remove from Feed Button for YouTube

This simple extension injects mute buttons into posts on Google+ (Google Plus) so 
you can easily mute posts with a single click.

![screen shot](https://github.com/JeromeDane/YouTube-Remove-From-Feed-Button/blob/master/screenshots/screenshot-640x400.png?raw=true)

[Install for Chrome](https://chrome.google.com/webstore/detail/remove-from-feed-for-yout/ogclfblkiagkkfpdbbbphchgfkieecml)

If you like this extension, you can always **[buy me a cup of coffee](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KF2QJ87Q37PFJ)**.

For updates on this and other projects, follow me on one of the following sites:

[Google+](https://plus.google.com/107905455800180378660/posts) |
[Facebook](https://www.facebook.com/Dane.Jerome) |
[Twitter](https://twitter.com/JeromeDane)

Note: The round "Delete" icon in this extension's icon is by Black Bear Blanc.

## Hack This Code

1. Clone this repository to your local machine
2. Make sure you have [NodeJS](https://nodejs.org) installed
3. Navigate to the root of this project on your local machine in your command line interface
4. Run `npm install` to install all required dependencies
5. Make desired changes to files in `src/`
6. Build the source code as described below

### Building Source Code

This project is designed to be build with `gulp`, which is included in the development dependencies. If you get an error about `gulp` not being in your path when you run the commands below, you can try installing `gulp` globally on your machine by typing `npm install -g gulp`. If you still have problems (especially on windows machines), you may need to add the path to the gulp binary to your system path. Google will tell you how. ;-)

The following gulp build tasks can be used by running them on in your command line interface:

* `gulp script` - Compile a userscript version of this code to `dist/userscript`
* `gulp chrome-build` - Create `build/chrome` directory and files which can be loaded as an unpacked extension
* `gulp chrome` - Same as `chrome-build`, plus create a zip file in `dist/chrome/chrome-extensionv[version].zip`

## License 

[Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by-nc-sa/3.0/)

You can share or modify this work as long as you:

1. Link back to this page
2. Don't use this or derivatives of this for commercial use
3. Share your changes so that others can benifit from your improvements. 