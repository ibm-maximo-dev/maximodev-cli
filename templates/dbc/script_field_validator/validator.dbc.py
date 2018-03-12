if status=='COMP':
    mbo.setValue("ActStart", mbo.getDate("SchedStart"))
    mbo.setValue("ActFinish", mbo.getDate("SchedFinish"))