#!/usr/bin/env bash

# disable prompting
export MAXIMO_CLI_NO_PROMPT=Y
export MAXIMO_HOME="."

fail() {
  echo "FAIL: $1"
  exit 1
}

verifyFile() {
  echo "VERIFY: $1"
  if [ ! -e "$1" ] ; then
    fail "$2"
  fi
}



# install maximodev-cli
# npm install file:`readlink -f ..` -g

# remove any existing directory
if [ -e 'bpaaa_prod1' ] ; then
  rm -rf bpaaa_prod1
fi

if [ -e 'tools' ] ; then
  rm -rf tools
fi

# Just test that all the top level commands respond
maximodev-cli || fail "maximodev-cli failed"
for cmd in create build init set update run-dbc deploy docker ; do
  echo ""
  echo "Testing $cmd"
  maximodev-cli $cmd --help || fail "maximodev-cli set failed"
  echo "*************************************"
done

ADDON_PREFIX=bpaaa
ADDON_NAME=bpaaa_prod1
ADDON_AUTHOR=sls
ADDON_DESC=test
ADDON_VER=1.0.0.0
ADDON_PACKAGE=bpaaa.prod1
OUTPUT_DIR=.



echo "CREATING addon"
maximodev-cli create addon --addon_prefix=${ADDON_PREFIX} --addon_name=${ADDON_NAME} --author=${ADDON_AUTHOR} --desc=${ADDON_DESC} --ver=${ADDON_VER} --java_support --eclipse --java_package=${ADDON_PACKAGE} --maximo_home=${MAXIMO_HOME} --output_directory=${OUTPUT_DIR} || fail "Create Addon Failed"

cd ${OUTPUT_DIR}/${ADDON_NAME} || fail "Failed to change to Addon Directory"
echo "PASSED: Create Addon"

echo "CREATING Sample App"
maximodev-cli create sample-classic-app --add_sample
verifyFile "resources/presentations/bpaaaart.xml" "Create Sample Failed"

echo "CREATING Next/Sample DBC"
maximodev-cli create dbc-script
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_05.dbc" "Create DBC Failed"


echo "CREATING JAVA MBO"
#Check for script file name 
maximodev-cli create java-mbo --mbo_name=TEST --java_package=bpaaa.prod1.test --mbo_class_name=TestMBO --service_name=ASSET --overwrite
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_06.dbc" "Create DBC Failed"

echo "CREATING SCRIPT FIELD VALIDATOR"
maximodev-cli create script-field-validator  --script_language=python --script_description="Test" --object_name="WORKORDER" --attribute_name="WONUM" --automation_script_name=TESTSCRIPT
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_07.dbc.in" "Create Script Field Validator Failed"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_07.dbc.py" "Create Script Field Validator Failed"

echo "CREATING CLASSIC MINIAPP"
maximodev-cli create classic-miniapp --jsclass_name=TestMiniApp --id=testminiapp --java_package=bpaaa.prod1.miniapp --java_class_name=TestMiniAppImpl
verifyFile "applications/maximo/maximouiweb/src/bpaaa/prod1/miniapp/TestMiniAppImpl.java" "Create MiniApp Failed"

echo "CREATING UPDATE PRODUCTXML"
maximodev-cli update product-xml
verifyFile "applications/maximo/properties/product/bpaaa_prod1.xml" "Update Product Xml Failed"

echo "Doing a BUILD"
maximodev-cli build
verifyFile "dist/applications/maximo/properties/product/bpaaa_prod1.xml" "Build Failed"

echo "Doing ZIP"
maximodev-cli create zip

#TOOD: this one needs lots of clean up
#echo "CREATING conditional UI"
#maximodev-cli

echo "done"
