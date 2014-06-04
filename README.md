Home-Buyer
==========

> Home Buyer chrome extension allows for easy exporting of real estate information to google spreadsheets.

### Development
Developing this plugin requires [node.js](http://nodejs.org/) and [Grunt](http://gruntjs.com/)

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide.  You will only need the first part to install Grunt.

Once you have node, npm and grunt installed, run this:

```shell
npm install
```

Once all the dependencies are installed, run this:

```shell
grunt
```

> Grunt handles all the automated build and testing.  It is your friend.  It generates the `build` directory and the `chrome-extension.zip` file.  The chrome-extension.zip file is needed to publish to the chrome webstore.  The build folder has the compiled requirejs files.  You could load the chrome extension from the build folder or from the zip file to test how the plugin runs in production.  However it's a lot easier to debug from the app folder.

### Load the extension in chrome

1. Visit chrome://extensions in your browser (or open up the Chrome menu by clicking the icon to the far right of the Omnibox:  The menu's icon is three horizontal bars.. and select Extensions under the Tools menu to get to the same place).

2. Ensure that the Developer mode checkbox in the top right-hand corner is checked.

3. Click Load unpacked extension… to pop up a file-selection dialog.

4. Navigate to the directory in which your extension files live, and select it.

If the extension is valid, it'll be loaded up and active right away! If it's invalid, an error message will be displayed at the top of the page. Correct the error, and try again.

Thanks for contributing, cheers!