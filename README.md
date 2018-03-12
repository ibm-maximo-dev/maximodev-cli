# Maximo Command Line Tools for Development

The `maximo-cli` is a set of command line tools for developing with `Maximo`, helping accelerate some tasks, such as creating add-ons, MBOs, field validations, etc.  

`maximo-cli` requires that [NodeJS](https://nodejs.org/en/) be installed.  If you do not have NodeJS installed, then install it first.

The vision for `maximo-cli` is provide a set of lifecycle tools to the developer, allowing them to create, build, test, deploy, and package an add-on, while offering other additional tools are useful in the development lifecycle of Maximo.

`maximo-cli` will require direct access to your development Maximo instance's home directory.   If you are using Java support, or if you calling some commands, like `presentation-diff`, then direct access is required, or this features will not work correctly.  You can use many features of `maximo-cli` without a local Maximo instance, but, be warned, some things will fail (especially Java compiling) without local filesytem access to a Maximo instance.

## Installation

For normal users, you can install `maximo-cli` from the public `npm` repository.
```bash
npm install maximo-cli -g
```

If you are enhancing `maximo-cli` you can check out the sources, and then, install it globally, for testing.  This will install it globally, but link back to your development sources.  (This assumes that your development sources for `maximo-cli` are in `~/git/maximo-cli`)
```bash
npm install file:~/git/maximo-cli -g
```

## Commands
If you run `maximo-cli` without any parameters, it will show a list of top level commands that can be run, such, as, `create`, `init`, `update`, `build`, `package`, `deploy`, etc.  Each of those top level action will have sub commands as well.  For each level you can pass `--help` to get help on a command or sub-command.  While every command can take a number of `--` args, these commands will also prompt and guide you.  So, you can call a command without any args and it will prompt you for responses.

### maximo-cli create addon

`create addon` is used to start a brand new addon.  When you run it, will ask questions like, what is your addon prefix, product name, description, etc.  It will also ask if you want to enable java support and if so, it will ask for things like your java package, and if you want to enable `Eclipse` integration.  After answering all questions, it will create a new directory in your current directory using the name of your addon.  And in that directory, it will create several files, including a product xml and if java support was enabled, then it will add [gradle](https://gradle.org/) scripts that enable you to compile your custom Java classes.  This process creates an `addon.properties` in your addon root directory, that contains all the information about your addon.  This properties file is used extensively in other `maximo-cli` commands.

### maximo-cli init addon
`init addon` is similar to `create addon` with the distinction being that it assumes you have an addon in your current directory, but you are missing the `addon.properties`.  `init addon` will prompt you for a bunch of questions about your addon, and then, create the `addon.properties` in the current directory.  You can use this as well to update settings about your addon, but, I do not recommend changing things like your addon prefix or product name, since that will change how the product xml and dbc scripts are resolved.

### maximo-cli init java
`init java` will initialize Java and Gradle in your current addon directory.  This might be used if you originally created an addon without Java support, but later you changed your mind, and you now you need/want to add Java support to your addon. 

### maximo-cli create product-xml
`create product-xml` will create a product xml in your addon directory.  This would only be required if you didn't already have a product xml file and you needed to create one.  It can also be used to replace your product xml with a new copy.  Keep in mind, this action is destructive, if you replace your existing product xml.

### maximo-cli create dbc-script
`create dbc-script` will look in your product's script directory, and create a new script with a number that is the next number in in your script sequence.  For example, if your last script was `V7601_22.dbc`, then this command would create `V7601_23.dbc`.  The newly created script will be an xml script stub where you can later edit it and add your statements.

### maximo-cli create presentation-diff
`create presentation-diff` is a utility that can create a delta presentation dbc script of your changes, provided you give it an original file and your modified file.   This can be used to automate your presentation updates by adding them to a dbc script that is processed during an `updatedb` cycle.

### maxio-cli create java-field-validator
`create java-field-validator` will create a simple Java field validation class and corresponding dbc file, and/or, update the product xml.  The goal here is to show how to build a field validation class and how to register it.  You may need to tweak the output scripts to register it to the correct object, field, etc.

### maximo-cli create script-field-validator
`create script-field-validator`, like the `java-field-valiator` will create a field validator and register it to an object and field.  The difference being that this field valiator will use the `automation scripting` framework and will not require Java.

### maximo-cli create sample-classic-app
`create sample-classic-app` prompts your for some information, and it will create a new sample application in your add-on location.  This sample app is mainly used to help you scaffold a new application, or for you to see how to build a complete working sample application within your addon.  It adds dbc scripts and Java files, and it is a fully working applications.  You can then `build` and `deploy` your addon to see it working within your Maximo environment.

### maximo-cli update product-xml
`update product-xml` is a utility that will update the last script number in your product xml by inspecting and finding the last script in your product scripts area.   This assumes that your product xml is a `template` file, which, it will be is your used `maximo-cli` to create it.

## maximo-cli set
`maximo-cli set` is a command that can be used to update your `addon.properties`.  For example if you need to set/change your Java Home or your Maximo Home, you can use the following commands, respectively; `maximo-cli set java-home`  or `maximo-cli set maximo-home`.  These `set` commands will prompt a question, and then proceed to update the `addon.properties`

## Understanding Template Files
`maximo-cli` makes use to some templated files during development.  For example your master product xml might be called `properties/product/myaddon.xml.in` (note the `.in` suffix).  `.in` files are template input files.  These files are processed during other commands, where the real file will be generated.  For example during a `maximo-cli update product-xml` command, `myaddon.xml.in` is processed and updated with the last script number, and, a new file, `myaddon.xml` is generated.  When template files exist, they are source files, and their generated counterparts should never be edited, but rather the `.in` version of that file should be edited.  So when you see a `.in` file, you should be aware that some command will generate its non `.in` version.

## Links to references
For more information on developing add-ons and using dbc scripts, see the [Database Configuration Scripts](https://developer.ibm.com/static/site-id/155/maximodev/dbcguide/) document.

<!--
These are ideas for other cli tools

create java-field-validator
- ask mbo
- ask attribute
- ask classname
- ask package
- create dbc file
- create java file
- install gradle if missing

create script-field-validator
- ask mbo
- ask attribute
- ask name
- create dbc file

create alndomain
- ask items
- create dbc

create syndomain
- ask items
- create dbc 

export autoscript NAME
- call boris' script

export presentation-diff FILE
- create mxs file using file with same name from BASE/ or from maximo install dir

build
- compile all files
- move all files to the dist area

deploy
- copies files into maximo dev tree

package
- create .zip file
-->