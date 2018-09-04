package {{java_package}}};

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.util.MXApplicationException;
import psdi.util.MXException;

/**
 * Set of {{mbo_class_name}}} State objects
 * 
 */
public class {{mbo_class_name}}StateSet extends MboSet implements
        {{mbo_class_name}}StateSetRemote {

    /**
     * Construct the set of script State.
     * 
     * @param ms The MboServerInterface used to access internals of the
     *        MXServer.
     */
    public {{mbo_class_name}}StateSet(MboServerInterface ms) throws MXException,
            RemoteException {
        super(ms);
    }

    /**
     * Initialize the set.
     */
    public void init() throws MXException, RemoteException {
        // This set cannot be changed by outside users
        setFlag(READONLY, true);

        super.init();
    }

    /**
     * Factory method to create Script State.
     * 
     * @param ms the {{mbo_class_name}}State MboSet.
     * @return a {{mbo_class_name}} State Mbo.
     */
    protected Mbo getMboInstance(MboSet ms) throws MXException, RemoteException {
        return new {{mbo_class_name}}State(ms);
    }

    /**
     * In order to create new {{mbo_class_name}}State, this set needs to be owned by a
     * {{mbo_class_name}} Mbo
     * 
     * @exception MXApplicationException Thrown with "autoscr",
     *            "{{mbo_class_name}}StateNoAdd" if not owned by a {{mbo_class_name}} object.
     */
    public void canAdd() throws MXException {
        // Only way to add is when you have a VAE owning it
        if (!(getOwner() instanceof {{mbo_class_name}})) {
            throw new MXApplicationException("autoscr", "{{mbo_class_name}}StateNoAdd");
        }
    }
}
