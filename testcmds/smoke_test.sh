#!/usr/bin/env bash

# disable prompting
export MAXIMO_CLI_NO_PROMPT=Y
export MAXIMO_HOME="."

fail() {
  echo "FAIL: $1"
  exit 1
}

pass() {
  echo "PASS: $1" 
}

verifyFile() {
  echo "VERIFY: $1"
  if [ ! -e "$1" ] ; then
    fail "$2"
  fi
}

verifyMerge() {
  echo "CHECK-MERGE: $1"
  if [ ! -e "$1" ] ; then
    pass "$2"
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

echo "CREATING Maximo extension"
maximodev-cli create ext app —-ext_id=psdi.app.asset.Asset —-ext_prefix=${ADDON_PREFIX}  -—ext_java_package=${ADDON_PACKAGE}  --maximo_home=${MAXIMO_HOME}  -—add_presetation || fail "Create Maximo's extension"
verifyFile "applications/maximo/maximouiweb/src/bpaaa/prod1/webclient/beans/BpaaaAssetAppBean.java" "Fail creating Maximo's extension"
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/BpaaaAsset.java"
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/BpaaaAssetSet.java"
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/BpaaaAssetRemote.java"
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/BpaaaAssetSetRemote.java"
echo "PASSED: Create Maximo extension"

echo "CREATING Field class extension"
maximodev-cli create ext fld --ext_mbo=ASSET --ext_field=ASSETNUM --ext_fqn_field=psdi.app.asset.FldAssetnum
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/FldBpaaa_prod1Assetnum.java"
echo "PASSED: Extend fied classes"

echo "CREATING Application service extension"
maximodev-cli create ext svc --service_name=ASSET --service_fqn=psdi.app.asset.AssetService  --add_remote_service=y --remote_service_fqn=psdi.app.asset.AssetServiceRemote
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/Bpaaa_prod1AssetService.java"
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/Bpaaa_prod1AssetServiceRemote.java"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_02.dbc" "Create Application Service Failed"
echo "PASSED: Extend application service"

echo "CREATING {{mbo_class_name}} App"
maximodev-cli create sample-classic-app --add_sample
verifyFile "resources/presentations/bpaaaart.xml" "Create {{mbo_class_name}} Failed"

echo "CREATING Next/Sample DBC"
maximodev-cli create dbc-script
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_05.dbc" "Create DBC Failed"


echo "CREATING JAVA MBO"
#Check for script file name 
maximodev-cli create java-mbo --mbo_name=TEST --mbo_type=standard --java_package=bpaaa.prod1.test --mbo_class_name=TestMBO --service_name=ASSET --overwrite
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_06.dbc" "Create DBC Failed"

echo "CREATING JAVA STATEFUL MBO"
#Check for script file name 
maximodev-cli create java-mbo --mbo_name=TEST --mbo_type=stateful --java_package=bpaaa.prod1.test --mbo_class_name=TestStatefulMBO --service_name=ASSET --overwrite
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_07.dbc" "Create DBC Failed"

echo "CREATING JAVA NONPERSISTENT MBO"
#Check for script file name 
maximodev-cli create java-mbo --mbo_name=TEST --mbo_type=nonpersistent --java_package=bpaaa.prod1.test --mbo_class_name=TestNonPersistentMBO --service_name=ASSET --overwrite
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_08.dbc" "Create DBC Failed"

echo "CREATING SCRIPT FIELD VALIDATOR"
maximodev-cli create script-field-validator  --script_language=python --script_description="Test" --object_name="WORKORDER" --attribute_name="WONUM" --automation_script_name=TESTSCRIPT
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_11.dbc.in" "Create Script Field Validator Failed"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_11.dbc.py" "Create Script Field Validator Failed"

echo "CREATING CLASSIC MINIAPP"
maximodev-cli create classic-miniapp --jsclass_name=TestMiniApp --id=testminiapp --java_package=bpaaa.prod1.miniapp --java_class_name=TestMiniAppImpl
verifyFile "applications/maximo/maximouiweb/src/bpaaa/prod1/miniapp/TestMiniAppImpl.java" "Create MiniApp Failed"


echo "CREATING UPDATE PRODUCTXML"
maximodev-cli update product-xml
verifyFile "applications/maximo/properties/product/bpaaa_prod1.xml" "Update Product Xml Failed"

echo "Doing a BUILD"
maximodev-cli build
verifyFile "dist/applications/maximo/properties/product/bpaaa_prod1.xml" "Build Failed"

echo "MERGE SCRIPT FILES"
maximodev-cli merge dbc --script_base="V1000_07.dbc"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_07.dbc" "Create Script Field Validator Failed"
verifyMerge "tools/maximo/en/bpaaa_prod1/V1000_08.dbc" "File merged"
verifyMerge "tools/maximo/en/bpaaa_prod1/V1000_09.dbc" "File merged"

echo "CREATING UPDATE PRODUCTXML - After merge files"
maximodev-cli update product-xml
verifyFile "applications/maximo/properties/product/bpaaa_prod1.xml" "Update Product Xml Failed"

export MAXIMODEV_CLI_BETA=1
echo "Doing ZIP"
maximodev-cli create zip --package_name=test-package
verifyFile "dist/test-package.zip"

#TOOD: this one needs lots of clean up
#echo "CREATING conditional UI"
#maximodev-cli

echo "done"
