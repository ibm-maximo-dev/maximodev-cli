# Command Line Tools for Development with IBM Maximo Asset Mangement
[![Build Status](https://travis.ibm.com/maximo-ohio/maximo-cli.svg?token=yJyC5zQ7wEuSAyYtDC53&branch=master)](https://travis.ibm.com/maximo-ohio/maximo-cli)

The `maximo-cli` is a set of command line tools for developing with Maximo Asset Management, which accelerates tasks, such as creating add-ons, MBOs, field validations, etc.  

`maximo-cli` requires that [NodeJS](https://nodejs.org/en/) **version 8+** be installed.  If you do not have NodeJS **version 8** installed, then install/upgrade it first.

The vision for `maximo-cli` is to provide a set of lifecycle tools for the developer, allowing them to create, build, test, deploy, and package an add-on, while offering other additional tools are useful in the development lifecycle of Maximo Asset Management.

`maximo-cli` requires direct access to your development Maximo instance's home directory.   If you are using Java support, or if you calling some commands, like `presentation-diff`, then direct access is required. Otherwise, these features will not work correctly.  You can use many features of `maximo-cli` without a local Maximo instance, but, be warned, some tasks will fail (especially Java compiling) without local filesystem access to a Maximo instance.

## Installation

For normal users, you can install `maximo-cli` from the public `npm` repository.
```bash
npm install maximo-cli -g
```

If you are enhancing `maximo-cli`, you can check out the sources, and then install it globally, for testing.  This will install it globally, but link back to your development sources.  (This assumes that your development sources for `maximo-cli` are in `~/git/maximo-cli`)
```bash
npm install file:~/git/maximo-cli -g
```

## Quick Start
The following commands illustrate how to create a new add-on, with java support, and creating the sample classic app in your project, build, it and deploy it into a local Maximo environment.

When prompted, enter `BPAAA` for the prefix, and `bpaaa_myproduct` for the product.  Be sure to also select `y` for `Java Support` and `y` for `Initialize eclipse projects`.  You also need to enter the full location to where your local Maximo installation folder exists (when prompted for `maximo home`).

```bash
$ npm install maximo-cli -g
$ maximo-cli create addon
$ cd bpaa_myproduct
$ maximo-cli create sample-classic-app
$ maximo-cli build
$ maximo-cli dist
$ maximo-cli deploy
```

After this process, a new add-on is created in the `dist` folder and deployed into your local Maximo environment.  If you navigate to your local Maximo and run `updatedb` it will process the scripts for your add-on, and add the `Music` demo application to Maximo.


## Commands
If you run `maximo-cli` without any parameters, a list of top level commands that can be run is shown, such as `create`, `init`, `update`, `build`, `package`, `deploy`, etc.  Each of those top level action have sub commands as well.  For each level, you can pass `--help` to get help on a command or sub-command.  While every command can take a number of `--` args, these commands also prompt and guide you.  So, you can call a command without any args and you are prompted for responses.

### maximo-cli create addon

`create addon` is used to start a new add-on.  When you run this command, you are asked questions like, what is your add-on prefix, product name, description, etc.  You are also asked if you want to enable java support and if so, you are asked for information about your java package, and if you want to enable `Eclipse` integration.  After answering all questions, a new directory is created in your current directory using the name of your add-on.  In the new directory, several files are created, including a product XML and if java support was enabled, then [gradle](https://gradle.org/) scripts that enable you to compile your custom Java classes are added.  This process creates an `addon.properties` in your add-on root directory that contains all the information about your add-on.  This properties file is used extensively in other `maximo-cli` commands.

### maximo-cli init addon
`init addon` is similar to `create addon` but assumes you have an add-on in your current directory without `addon.properties`.  `init addon` asks you questions about your add-on, and then creates the `addon.properties` in the current directory.  You can use this as well to update settings about your add-on, but, I do not recommend changing things like your add-on prefix or product name, since that changes how the product XML and dbc scripts are resolved.

### maximo-cli init java
`init java` initializes Java and Gradle in your current add-on directory.  This can be used if you originally created an add-on without Java support, but later you changed your mind, and you now want to add Java support to your add-on. 

### maximo-cli create product-xml
`create product-xml` creates a product XML in your add-on directory.  This would only be required if you didn't already have a product XML file and you needed to create one.  You can also use this command to replace your product XML with a new copy.  Keep in mind, this action is destructive, if you replace your existing product XML.

### maximo-cli create dbc-script
`create dbc-script` looks in your product's script directory, and creates a new script with a number that is the next number in in your script sequence.  For example, if your last script was `V7601_22.dbc`, then this command would create `V7601_23.dbc`.  The new script is an XML script stub where you can later edit it and add your statements.

### maximo-cli create java-field-validator
`create java-field-validator` creates a simple Java field validation class and corresponding dbc file, and updates the product XML.  The goal here is to show how to build a field validation class and how to register it.  You may need to tweak the output scripts to register it to the correct object, field, etc.

### maximo-cli create script-field-validator
`create script-field-validator`, like the `java-field-valiator`, creates a field validator and registers it to an object and field.  The difference being that this field valiator uses the `automation scripting` framework and does not require Java.

### maximo-cli create sample-classic-app
`create sample-classic-app` prompts you for some information and creates a new sample application in your add-on location.  This sample app is mainly used to help you scaffold a new application, or for you to see how to build a complete working sample application within your add-on.  By using `create sample-classic-app`, dbc scripts and Java files are added, and creates a fully working application.  You can then `build` and `deploy` your add-on to see the application working within your Maximo environment.

### maximo-cli update product-xml
`update product-xml` is a command that updates the last script number in your product XML by inspecting and finding the last script in your product scripts area.  This command assumes that your product XML is a `template` file, which was created by  `maximo-cli`.

### maximo-cli set
`maximo-cli set` is a command that can be used to update your `addon.properties`.  If you need to set or change your Maximo home page, you can use the following command `maximo-cli set maximo-home`.  The `set` command prompts a question, and then proceed to update the `addon.properties`.  Currently, only setting or updating the `maximo_home` is supported, but in the future more options may be added.

### maximo-cli build
`maximo-cli build` builds and copies your add-on artifacts to a `dist` directory.  If you have a `Java` project, then `gradle` is executed to build all the java parts.  This build process also updates your product XML with the last script number, creates a `.mxs` file of your presentation files, and optionally creates a delta of changes in the `BASE/resources/presentations` directory if the directory exists with base presentation files.  After a build is complete, all files in the `dist` folder can be packaged or copied to a Maximo instance.

## Wrapper Commands
Wrapper commands are `maximo-cli` commands that wrap existing tools in Maximo Asset Management.  These scripts require that the `MAXIMO_HOME` environment variable be set, OR, that your `addon.properties` contains the `maximo_home` property set to a valid  installation/dev directory.

### maximo-cli run-dbc
`run-dbc` is a utility wrapper around the `runscriptfile` command in Maximo Asset Management.  It differs in that `run-dbc`  accepts the full path to a script instead of having to pass a script directory and script filename without the extension.  `run-dbc` also prompts you to automatically show the log file if the script fails.

### maximo-cli create presentation-diff
`create presentation-diff` is a utility wrapper around the `MXDiff` tool that can create a delta presentation dbc script of your changes, provided you give it an original file and your modified file.   This can be used to automate your presentation updates by adding them to a dbc script that is processed during an `updatedb` cycle.


## Understanding Template Files
`maximo-cli` makes use to some templated files during development.  For example, your master product XML might be called `properties/product/myaddon.xml.in` (note the `.in` suffix).  `.in` files are template input files.  These files are processed during other commands, where the real file is generated.  For example, during a `maximo-cli update product-xml` command, the  `myaddon.xml.in` template file is processed and updated with the last script number, and a new file called `myaddon.xml` is generated.  When template files exist, they are source files, and their generated counterparts should never be edited, but rather the `.in` version of that file should be edited.  So when you see a `.in` file, you should be aware that some command generates its non `.in` version.

## Importing Projects into Eclipse
If you enabled Java support, then, you will have a `build.gradle` file in your project's root directory.  `Gradle` has support for automatically creating project files for `Eclipse`.

```bash
./gradlew cleanEclipse eclipse
```

The `cleanEclipse` task removes any existing eclipse projects.   The `eclipse` task creates projects that can be imported into `Eclipse`.

To import the projects, create an Eclipse workspace, select the **File->Import->Existing Projects Into Workspace** action, click **Next**, and then navigate to the root of your project.  It should list five projects; `businessobjects`, `maximouiweb`, `properties`, `resources`, and `tools`.  Click **Finish**. 

## Links to references
For more information on developing add-ons and using dbc scripts, see the [Database Configuration Scripts](https://developer.ibm.com/static/site-id/155/maximodev/dbcguide/) document.

<!--
These are ideas for other cli tools

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

deploy
- copies files into maximo dev tree

package
- create .zip file
-->
