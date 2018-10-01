package {{java_package}};

import psdi.mbo.MboSetRemote;

public interface {{mbo_class_name}}SetRemote extends MboSetRemote {
    /**
     * Name of the MboSet containing the state history
     */
    public static String {{mbo_name}}STATE = "{{mbo_name}}STATE";

}
