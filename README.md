# Command Line Tools for Development with IBM Maximo Asset Mangement
<!--
[![Build Status](https://travis.ibm.com/maximo-ohio/maximodev-cli.svg?token=yJyC5zQ7wEuSAyYtDC53&branch=master)](https://travis.ibm.com/maximo-ohio/maximodev-cli)
-->

The `maximodev-cli` is a set of command line tools for developing with Maximo Asset Management that accelerates tasks, such as creating add-ons, MBOs, field validations, etc.  

`maximodev-cli` requires that [NodeJS](https://nodejs.org/en/) **version 8+** be installed. If you do not have NodeJS **version 8** installed, then install or upgrade it first.

The vision for `maximodev-cli` is to provide a set of lifecycle tools for developers, allowing them to create, build, test, deploy, and package an add-on, while offering additional tools that are useful in the development lifecycle of Maximo Asset Management.

`maximodev-cli` requires direct access to your development instance of the Maximo home directory. If you are using Java™ support, or if you are calling some commands, like `presentation-diff`, then direct access is required. Otherwise, these features will not work correctly. You can use many features of `maximodev-cli` without a local Maximo instance, but, be warned, some tasks will fail, especially Java compiling, without local filesystem access to a Maximo instance.

## Installation

For normal users, you can install `maximodev-cli` from the public `npm` repository.
```bash
npm install maximodev-cli -g
```

If you are enhancing `maximodev-cli`, you can check out the sources and then install it globally for testing. This method will install it globally, but link back to your development sources, assuming that your development sources for `maximodev-cli` are in `~/git/maximodev-cli`)
```bash
npm install file:~/git/maximodev-cli -g
```

## Quick start
The following commands illustrate how to create a new add-on with Java support and how to create the sample classic app in your project, build, it, and deploy it into a local Maximo environment.

When prompted, enter `BPAAA` for the prefix, and `bpaaa_myproduct` for the product. Be sure to also select `y` for `Java Support` and `y` for `Initialize eclipse projects`. When prompted for `maximo home`, you also need to enter the full location to where your local Maximo installation folder exists.

```bash
$ npm install maximodev-cli -g
$ maximodev-cli create addon
$ cd bpaa_myproduct
$ maximodev-cli create sample-classic-app
$ maximodev-cli build
$ maximodev-cli deploy
```

This process will take about five minutes. The `create addon` phase will need to install `gradle` and initialize it, which can take a couple minutes. The `build` phase might also take a couple minutes, because it must compile your `java` files against the Maximo classes. Compile times after that should be faster.

After this process, a new add-on is created in the `dist` folder and deployed into your local Maximo environment. If you navigate to your local Maximo directory and run `updatedb`, it will process the scripts for your add-on and add the `Music` demo application to Maximo.


## Commands
If you run `maximodev-cli` without any parameters, a list of top-level commands is shown, such as `create`, `init`, `update`, `build`, `package`, `deploy`, etc. Each of these top-level actions have subcommands as well. For each level, you can pass `--help` to get help on a command or subcommand. While every command can take a number of `--` args, these commands also prompt and guide you. So, you can call a command without any args, and you are prompted for responses.

### maximodev-cli create addon
The `create addon` command is used to start a new add-on. When you run this command, you are asked questions such as what is your add-on prefix, product name, description, etc. You are also asked if you want to enable Java support, and if so, you are asked for information about your Java package and if you want to enable `Eclipse` integration. After answering all questions, a new directory is created in your current directory using the name of your add-on. In the new directory, several files are created, including a product XML, and if Java support was enabled, then [Gradle](https://gradle.org/) scripts that enable you to compile your custom Java classes are added. This process creates an `addon.properties` file in your add-on root directory that contains all the information about your add-on. This properties file is used extensively in other `maximodev-cli` commands.

### maximodev-cli init addon
The `init addon` command is similar to the `create addon` command but assumes you have an add-on in your current directory without the `addon.properties` file. The `init addon` command asks you questions about your add-on and then creates the `addon.properties` file in the current directory. You can also use this command to update settings about your add-on, but it is not recommended for changing things like your add-on prefix or product name because that changes how the product XML and dbc scripts are resolved.

### maximodev-cli init java
The `init java` command initializes Java and Gradle in your current add-on directory. This command can be used if you originally created an add-on without Java support but later you changed your mind, and you now want to add Java support to your add-on. 

### maximodev-cli create product-xml
The `create product-xml` command creates a product XML in your add-on directory. This command is required only if you didn't already have a product XML file, and you needed to create one. You can also use this command to replace your product XML with a new copy. Keep in mind that this action is destructive if you replace your existing product XML.

### maximodev-cli create dbc-script
The `create dbc-script` command looks in your product's script directory and creates a new script with a number that is the next number in in your script sequence. For example, if your last script was named `V7601_22.dbc`, then this command creates `V7601_23.dbc`. The new script is an XML script stub where you can later edit it and add your statements.

### maximodev-cli create java-field-validator
The `create java-field-validator` command creates a simple Java field validation class and corresponding dbc file and updates the product XML file. The goal here is to show how to build a field validation class and how to register it. You might need to tweak the output scripts to register it to the correct object, field, etc.

### maximodev-cli create mbo
The `create mbo` command creates since a simple MBO structure to a `stateful` MBO structure. The objective is allow the user to create fast and without any structure issues, to respect the Remote objects and to provide a simple implementation of more complex kind of MBO. The `create mbo` command supports the creation of a nonpersistent MBO, a stateful MBO, and also standard MBOs by using DBC files that provide the information that is required to create the associated tables, relationships, any applicable domains, and more related elements that are linked with MBO creation. 

To create an MBO, you are prompted to provide the following information:
<ul>
<li>`MBO Name`, wich represents the table name; the `java package` that is used to complete the Full Qualified Name (FQN) of an MBO. </li>
<li>`MBO's class name`, like the `java package`, is the MBO's class name that is used to complete the FQN.</li>
<li>`DBC's name,` which is provided by default according to the work that is done on the particular add-on structure.<li> 
<li>`service name` that will be used by those MBOs. A default approach is associate it to the `ASSET` service for reliability reasons. <li>`override flag`, which indicates whether existing files in the workspace are overridden by the new files.</li>

### maximodev-cli create app-extensions
The `create app-extensions` command allows you to extends some elements of an application, such as an `app`, a `field class`, a specific `mbo`, or a `service`. By opting to use the `create ext app` command, you are able to extend an entire app that contains all the structure. By using this command, you are ensuring that the structures are created based on Maximo development practices. The command updates the `product.xml` file to enable the upgrade tool to identify which apps are extended and also to protect them from an override process. You are also able to extends only part of apps. For example, calling the `create ext field` extends `Field Classes` or `create ext mbo` allows you to extend only MBOs from specified applications. You are also able to extend a `service` by calling the `create ext service` command. 

### maximodev-cli create script-field-validator
The `create script-field-validator` command, like the `java-field-valiator` command, creates a field validator and registers it to an object and field. The difference is that this field valiator uses the `automation scripting` framework and does not require Java. For a further information, run `#maximodev-cli create sfv --help`.

### maximodev-cli create sample-classic-app
The `create sample-classic-app` command prompts you for some information and creates a new sample application in your add-on location. This sample app is mainly used to help you scaffold a new application or for you to see how to build a complete working sample application in your add-on. By using the `create sample-classic-app`command, the dbc scripts and Java files are added, and a fully working application is created. You can then build and deploy your add-on to see the application working in your Maximo environment.

### maximodev-cli update product-xml
The `update product-xml`command updates the last script number in your product XML file by inspecting and finding the last script in your product scripts area. This command assumes that your product XML file is a `template` file that was created by a `maximodev-cli` command.

### maximodev-cli set
The `maximodev-cli set` command can be used to update your `addon.properties` file. If you need to set or change your Maximo home page, you can use the `maximodev-cli set maximo-home` command. The `set` command prompts a question and then updates the `addon.properties` file.  Currently, only setting or updating the `maximo_home` is supported.

### maximodev-cli build
The `maximodev-cli build` command builds and copies your add-on artifacts to a `dist` directory. If you have a Java project, then the `gradle` command is executed to build all the Java parts. This build process also updates your product XML file with the last script number, creates a `.mxs` file of your presentation files, and optionally creates a delta of changes in the `BASE/resources/presentations` directory if the directory exists with base presentation files. After a build is complete, all files in the `dist` folder can be packaged or copied to a Maximo instance.

### maximodev-cli create zip 
The `create zip` command generates a ZIP file that contains the result of the `maximodev build` command and also compresses the content of the `dist` folder into a file that is put into this folder. The puporse of this command is make it easier to deploy the result of development work into a Maximo instance. 

## Wrapper Commands
Wrapper commands are `maximodev-cli` commands that wrap existing tools in Maximo Asset Management. These scripts require that the `MAXIMO_HOME` environment variable be set or that your `addon.properties` file contains the `maximo_home` property set to a valid  installation/dev directory.

### maximodev-cli run-dbc
The `run-dbc` command is a utility wrapper around the `runscriptfile` command in Maximo Asset Management. It differs in that the `run-dbc` command accepts the full path to a script instead of having to pass a script directory and script filename without the extension. The `run-dbc` command also prompts you to automatically show the log file if the script fails.

### maximodev-cli create presentation-diff
The `create presentation-diff` command is a utility wrapper around the `MXDiff` tool that can create a delta presentation dbc script of your changes, if you give it an original file and your modified file. This command can be used to automate your presentation updates by adding them to a dbc script that is processed during an `updatedb` cycle.

### maximodev-cli create condition-ui
The `create condition-ui` command will help you create a new conditional ui dbc script.  Conditional UI is what what the classic UI uses to conditionally show elements in the UI based on a `CONDITION` and a `SIGNOPTION`.   This command helps build both, and link them together.  You will still need to define your correct condition, but, this will help scaffold out what is needed to create a condition, and it's negated condition.


### maximodev-cli merge dbc
The `merge dbc` command cleans up a set of completed work into a single DBC file, which helps you to merge the DBC files that are generated automatically by your development strategy using the maximodev-cli. To run the `merge dbc` command, you must provide a base script that is used to receive all the latest script elements. The `merge dbc` shows a list of DBC files that were created by this particular work and then prompts you to choose the base script. After you provide the script name, the `merge dbc` command merges the latests scripts into the base script that you selected. 


## Understanding template files
`maximodev-cli` makes use of some template files during development. For example, your master product XML file might be called `properties/product/myaddon.xml.in` (note the `.in` suffix). `.in` files are template input files. These files are processed during other commands, where the real file is generated. For example, during a `maximodev-cli update product-xml` command, the `myaddon.xml.in` template file is processed and updated with the last script number, and a new file called `myaddon.xml` is generated. When template files exist, they are source files, and their generated counterparts should never be edited, but rather the `.in` version of that file should be edited. So when you see a `.in` file, be aware that some command generates its non-`.in` version.

## Importing projects into Eclipse
If you enabled Java support, you will have a `build.gradle` file in your project's root directory. Gradle has support for automatically creating project files for Eclipse.

```bash
./gradlew cleanEclipse eclipse
```

The `cleanEclipse` task removes any existing Eclipse projects. The `eclipse` task creates projects that can be imported into `Eclipse`.

To import the projects, create an Eclipse workspace, select the **File->Import->Existing Projects Into Workspace** action, click **Next**, and then navigate to the root of your project. It should list five projects: `businessobjects`, `maximouiweb`, `properties`, `resources`, and `tools`. Click **Finish**. 

## Links to references
For more information on developing add-ons and using dbc scripts, see the [Database Configuration Scripts](https://developer.ibm.com/static/site-id/155/maximodev/dbcguide/) document.

## Issues and Suggestions
This tool is open source, which means that you are free to extend it.  You can even submit Pull Requests if you add a feature, or fix a bug.  If you want to submit issues or suggestions, you can use the [Github Issues tab](https://github.com/ibm-maximo-dev/maximodev-cli/issues).

<!--
These are ideas for other cli tools

create alndomain
- ask items
- create dbc

create syndomain
- ask items
- create dbc 

create relationships 
- ask items 
- create dbc

export autoscript NAME
- call boris' script

deploy
- copies files into maximo dev tree

package
- create .zip file
-->
