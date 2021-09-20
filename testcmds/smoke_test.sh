#!/usr/bin/env bash

# disable prompting
export MAXIMO_CLI_NO_PROMPT=Y
# enables RC commnands
export MAXIMODEV_CLI_BETA=1

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
  if [ ! -e "$1" ]; then
    fail "$2"
  fi
}

verifyMerge() {
  echo "CHECK-MERGE: $1"
  if [ ! -e "$1" ]; then
    pass "$2"
  fi
}

# install masmanagedev-cli
# npm install file:`readlink -f ..` -g

# remove any existing directory
if [ -e 'bpaaa_prod1' ]; then
  rm -rf bpaaa_prod1
fi

if [ -e 'tools' ]; then
  rm -rf tools
fi

# Just test that all the top level commands respond
masmanagedev-cli || fail "masmanagedev-cli failed"
for cmd in create build init set update run-dbc deploy docker; do
  echo ""
  echo "Testing $cmd"
  masmanagedev-cli $cmd --help || fail "masmanagedev-cli set failed"
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
masmanagedev-cli create addon --addon_prefix=${ADDON_PREFIX} --addon_name=${ADDON_NAME} --author=${ADDON_AUTHOR} --desc=${ADDON_DESC} --ver=${ADDON_VER} --java_support --eclipse --java_package=${ADDON_PACKAGE} --maximo_home=${MAXIMO_HOME} --output_directory=${OUTPUT_DIR} || fail "Create Addon Failed"

cd ${OUTPUT_DIR}/${ADDON_NAME} || fail "Failed to change to Addon Directory"
echo "PASSED: Create Addon"

echo "CREATING Maximo extension"
masmanagedev-cli create ext app —-ext_id=psdi.app.asset.Asset —-ext_prefix=${ADDON_PREFIX} -—ext_java_package=${ADDON_PACKAGE} --maximo_home=${MAXIMO_HOME} -—add_presetation || fail "Create Maximo's extension"
verifyFile "applications/maximo/maximouiweb/src/bpaaa/prod1/webclient/beans/BpaaaAssetAppBean.java" "Fail creating Maximo's extension"
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/BpaaaAsset.java"
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/BpaaaAssetSet.java"
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/BpaaaAssetRemote.java"
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/BpaaaAssetSetRemote.java"
echo "PASSED: Create Maximo extension"

echo "CREATING Field class extension"
masmanagedev-cli create ext fld --ext_mbo=ASSET --ext_field=ASSETNUM --ext_fqn_field=psdi.app.asset.FldAssetnum
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/FldBpaaa_prod1Assetnum.java"
echo "PASSED: Extend fied classes"

echo "CREATING Application service extension"
masmanagedev-cli create ext svc --service_name=ASSET --service_fqn=psdi.app.asset.AssetService --add_remote_service=y --remote_service_fqn=psdi.app.asset.AssetServiceRemote
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/Bpaaa_prod1AssetService.java"
verifyFile "applications/maximo/businessobjects/src/bpaaa/prod1/Bpaaa_prod1AssetServiceRemote.java"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_02.dbc" "Create Application Service Failed"
echo "PASSED: Extend application service"

echo "CREATING {{mbo_class_name}} App"
masmanagedev-cli create sample-classic-app --add_sample
verifyFile "resources/presentations/bpaaaart.xml" "Create {{mbo_class_name}} Failed"

echo "CREATING Next/Sample DBC"
masmanagedev-cli create dbc-script
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_05.dbc" "Create DBC Failed"

echo "CREATING JAVA MBO"
#Check for script file name
masmanagedev-cli create java-mbo --mbo_name=TEST --mbo_type=standard --java_package=bpaaa.prod1.test --mbo_class_name=TestMBO --service_name=ASSET --overwrite
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_06.dbc" "Create DBC Failed"

echo "CREATING JAVA STATEFUL MBO"
#Check for script file name
masmanagedev-cli create java-mbo --mbo_name=TEST --mbo_type=stateful --java_package=bpaaa.prod1.test --mbo_class_name=TestStatefulMBO --service_name=ASSET --overwrite
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_07.dbc" "Create DBC Failed"

echo "CREATING JAVA NONPERSISTENT MBO"
#Check for script file name
masmanagedev-cli create java-mbo --mbo_name=TEST --mbo_type=nonpersistent --java_package=bpaaa.prod1.test --mbo_class_name=TestNonPersistentMBO --service_name=ASSET --overwrite
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_08.dbc" "Create DBC Failed"

echo "CREATING SCRIPT FIELD VALIDATOR"
masmanagedev-cli create script-field-validator --script_language=python --script_description="Test" --object_name="WORKORDER" --attribute_name="WONUM" --automation_script_name=TESTSCRIPT
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_11.dbc.in" "Create Script Field Validator Failed"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_11.dbc.py" "Create Script Field Validator Failed"

echo "CREATING CLASSIC MINIAPP"
masmanagedev-cli create classic-miniapp --jsclass_name=TestMiniApp --id=testminiapp --java_package=bpaaa.prod1.miniapp --java_class_name=TestMiniAppImpl
verifyFile "applications/maximo/maximouiweb/src/bpaaa/prod1/miniapp/TestMiniAppImpl.java" "Create MiniApp Failed"

echo "Doing a BUILD"
masmanagedev-cli build
verifyFile "dist/applications/maximo/properties/product/bpaaa_prod1.xml" "Build Failed"

echo "MERGE SCRIPT FILES"
masmanagedev-cli merge dbc --script_base="V1000_07.dbc"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_07.dbc" "Create Script Field Validator Failed"
verifyMerge "tools/maximo/en/bpaaa_prod1/V1000_08.dbc" "File merged"
verifyMerge "tools/maximo/en/bpaaa_prod1/V1000_09.dbc" "File merged"

echo "CREATING UPDATE PRODUCTXML - After merge files"
masmanagedev-cli update product-xml
verifyFile "applications/maximo/properties/product/bpaaa_prod1.xml" "Update Product Xml Failed"

echo "CREATE DOMAINS"
masmanagedev-cli create dm str --domain_id=SYNTEST --domain_structure=SYNONYM --domain_description="Create synonym domain for smoke tests" --doamin_maxtype=UPPER --domain_overwrite=y --domain_length=28
masmanagedev-cli create dm str --domain_id=ALNTEST --domain_structure=ALN --domain_description="Create aln domain for smoke tests" --doamin_maxtype=ALN --domain_overwrite=y --domain_length=28
masmanagedev-cli create dm str --domain_id=NUMTEST --domain_structure=NUMERIC --domain_description="Create numeric domain for smoke tests" --doamin_maxtype=INTEGER --domain_overwrite=y --domain_length=28
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_08.dbc" "Create Script for synonym domain failed"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_09.dbc" "Create Script for numeric and aln domains failed"

echo "ADDING VALUES TO THE DOMAINS - (SYNONYM TESTS)"
masmanagedev-cli create dm add-value syn --value_domainid=SYNTEST --value_default=y --value_scriptname=V1000_10.dbc --value_domainvalue=DRAFT --value_internal=DRAFT --value_description="DRAFT value for the SYNONYM somoke test"
masmanagedev-cli create dm add-value syn --value_domainid=SYNTEST --value_default=n --value_scriptname=V1000_10.dbc --value_domainvalue=EDITING --value_internal=EDITING --value_description="DRAFT value for the SYNONYM somoke test"
masmanagedev-cli create dm add-value syn --value_domainid=SYNTEST --value_default=n --value_scriptname=V1000_10.dbc --value_domainvalue=DONE --value_internal=DONE --value_description="DONE value for the SYNONYM somoke test"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_10.dbc" "Create Script for synonym domain failed"

echo "ADDING VALUES TO THE DOMAINS - (ALN TESTS)"
masmanagedev-cli create dm add-value al --value_domainid=ALNTEST --value_scriptname=V1000_11.dbc --value_domainvalue=A --value_description="DRAFT value for the ALN somoke test"
masmanagedev-cli create dm add-value al --value_domainid=ALNTEST --value_scriptname=V1000_11.dbc --value_domainvalue=B --value_description="DRAFT value for the ALN somoke test"
masmanagedev-cli create dm add-value al --value_domainid=ALNTEST --value_scriptname=V1000_11.dbc --value_domainvalue=C --value_description="DONE value for the ALN somoke test"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_11.dbc" "Create Script for synonym domain failed"

echo "ADDING VALUES TO THE DOMAINS - (NUMERIC TESTS)"
masmanagedev-cli create dm add-value num --value_domainid=NUMTEST --value_scriptname=V1000_12.dbc --value_domainvalue=1 --value_description="DRAFT value for the NUMERIC somoke test"
masmanagedev-cli create dm add-value num --value_domainid=NUMTEST --value_scriptname=V1000_12.dbc --value_domainvalue=2 --value_description="DRAFT value for the NUMERIC somoke test"
masmanagedev-cli create dm add-value num --value_domainid=NUMTEST --value_scriptname=V1000_12.dbc --value_domainvalue=3 --value_description="DONE value for the NUMERIC somoke test"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_12.dbc" "Create Script for synonym domain failed"

echo "Doing a BUILD"
masmanagedev-cli build
verifyFile "dist/applications/maximo/properties/product/bpaaa_prod1.xml" "Build Failed"

echo "MERGE SCRIPT FILES"
masmanagedev-cli merge dbc --script_base="V1000_10.dbc"
verifyFile "tools/maximo/en/bpaaa_prod1/V1000_10.dbc" "Create Script Field Validator Failed"
verifyMerge "tools/maximo/en/bpaaa_prod1/V1000_11.dbc" "File merged"
verifyMerge "tools/maximo/en/bpaaa_prod1/V1000_12.dbc" "File merged"

echo "CREATING UPDATE PRODUCTXML - After merge files"
masmanagedev-cli update product-xml
verifyFile "applications/maximo/properties/product/bpaaa_prod1.xml" "Update Product Xml Failed"

echo "Doing ZIP"
masmanagedev-cli create zip --package_name=test-package
verifyFile "dist/test-package.zip"

#TOOD: this one needs lots of clean up
#echo "CREATING conditional UI"
#masmanagedev-cli

echo "done"
