package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboRemote;
import psdi.mbo.MboSet;
import psdi.util.MXApplicationException;
import psdi.util.MXException;

/**
 * Mbo to represent Script state object.
 * 
 */
public class {{mbo_class_name}}State extends Mbo implements {{mbo_class_name}}StateRemote {


    /**
     * @param ms the {{mbo_class_name}}State MboSet.
     */
    public {{mbo_class_name}}State(MboSet ms) throws MXException, RemoteException {
        super(ms);
    }

    /**
     * Initailze the object to be read only.
     */
    public void init() throws MXException {
        setFlag(READONLY, true);
        super.init();
    }

    /**
     * Add a new {{mbo_class_name}}State object. This cannot be called except by the
     * Script object.
     * 
     * @exception MXApplicationException {{mbo_class_name}}StateNoAdd when its owner is
     *            not {{mbo_class_name}}
     */

    public void add() throws MXException, RemoteException {

        MboRemote owner = getOwner();

        if (owner == null || !(owner instanceof {{mbo_class_name}}Remote)) {
            throw new MXApplicationException("{{addon_id}}", "{{mbo_class_name}}StateNoAdd");
        }

        // Copy these values from the record 
        setValue("{{mbo_class_name}}", owner.getString("{{mbo_class_name}}"),NOVALIDATION_AND_NOACTION);
        setValue("status", owner.getString("status"), NOVALIDATION_AND_NOACTION);
        setValue("changedate", owner.getDate("statusdate"),NOVALIDATION_AND_NOACTION);
        setValue("changeby", owner.getString("changeby"),NOVALIDATION_AND_NOACTION);
        setValue("siteid", owner.getString("siteid"), NOACCESSCHECK | NOVALIDATION_AND_NOACTION);
        setValue("orgid", owner.getString("orgid"), NOACCESSCHECK| NOVALIDATION_AND_NOACTION);

    }

    /**
     * Checks to make sure that the owner is the Script object
     * before proceeding to the delete method.
     * 
     * @exception MXApplicationException("{{addon_id}}","{{mbo_class_name}}StateNoDelete") if
     *            owner is not the Script object
     */

    public void canDelete() throws MXException, RemoteException {
        MboRemote owner = getOwner();

        if (owner == null || !(owner instanceof {{mbo_class_name}}Remote)) {
            throw new MXApplicationException("{{addon_id}}","{{mbo_class_name}}StateNoDelete");
        }
    }
}
