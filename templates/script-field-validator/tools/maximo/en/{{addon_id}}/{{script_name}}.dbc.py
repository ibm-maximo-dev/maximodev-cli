# Script to merge into dbc.in
# this is not a real script, and you will need update/create the contents according to your needs
if status=='COMP':
    mbo.setValue("ActStart", mbo.getDate("SchedStart") )
    mbo.setValue("ActFinish", mbo.getDate("SchedFinish") )