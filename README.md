init addon ID
- ask id
- create addon.properties

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

create classic app
- create pres xml
- create dbc file
- create bean class
- install gradle

export autoscript NAME
- call boris' script

export presentation-diff FILE
- create mxs file using file with same name from BASE/ or from maximo install dir

build
- compile all files
- move all files to the dist area

deploy
- copies files into maximo dev tree
