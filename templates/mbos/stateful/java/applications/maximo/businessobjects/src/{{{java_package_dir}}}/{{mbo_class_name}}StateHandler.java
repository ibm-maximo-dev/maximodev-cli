
package {{java_package}};

import java.rmi.RemoteException;
import java.util.Date;

import psdi.mbo.StatefulMbo;
import psdi.mbo.StatusHandler;
import psdi.security.ProfileRemote;
import psdi.util.MXAccessException;
import psdi.util.MXApplicationException;
import psdi.util.MXException;
import psdi.util.logging.MXLogger;
import psdi.util.logging.MXLoggerFactory;

/**
 * Handles all the state changes for a Script object
 * 
 */

public class {{mbo_class_name}}StateHandler extends StatusHandler {

    private static final Class CLASS = {{mbo_class_name}}StateHandler.class;

    private StatefulMbo parent = null;

    /**
     * Constructor
     */
    public {{mbo_class_name}}StateHandler(StatefulMbo sm) {
        super(sm);
        // Save for later!
        parent = sm;
    }

    /**
     * Checks to see if the user is authorized to make a state changes. In other
     * words , it checks if the user has the required privilege to change the
     * state. After ensuring that the user has the required privilege, this
     * methods checks if the state change is legal.
     * 
     * @param currentExternalState The current external State of the script
     * @param desiredExternalState The desired external State of the script
     * 
     * @see checkUserSecurity
     * @see possibleStateChange
     */
    public void checkStatusChangeAuthorization(String desiredExternalState)
            throws MXException, RemoteException {
        String desiredMaxState = parent.getTranslator().toInternalString(
                "CLISTATUS", desiredExternalState);

        // Check if the user is authorized to change to the desired State.
        checkUserSecurity(desiredMaxState);

    }

    /**
     * Check out the users security rights to call the specified State. Note the
     * State passed in is the <b>INTERNAL</b> State code. <BR>
     * 
     * Note that the SigOption Option Name doesn't always match the State name.
     * 
     * @exception MXAccessException Throws an access exception "notauthorized"
     *            if the check fails.
     * @param State The State to check if we can change to.
     */
    public void checkUserSecurity(String desiredMaxState) throws MXException,
            RemoteException {

        // Get the user's security options
        String application = parent.getThisMboSet().getApp();
        if (application == null || application.equals("")) {
            // no application, no need to check privileges - i.e. internal
            // process
            return;
        }

        ProfileRemote p = parent.getMboServer().getProfile(parent.getUserInfo());

        if (!p.getAppOptionAuth(application, " ", parent.getString("siteid"))) {
            throw new MXAccessException("access", "notauthorized");
        }

    }

    /**
     * Defines which State changes are legal. If a State change is not legal, an
     * MXAccessException is thrown. 
     * 
     * @param currentState the script's current State
     * @param desiredState the State to change to
     * @param accessModifier If this flag is set to NOACCESSCHECK, a work flow
     *        controlled purchase requisition may change State.
     * @exception MXApplicationException ({{addon_id}}, invalidState) is thrown if the
     *            desired State is not legal.
     */
    public void canChangeStatus(String currentState, String desiredState,
            long accessModifier) throws MXException, RemoteException {
                // Implement your status controle here. 
    }

    /**
     * Changes the State from the current state to a desired state.
     * 
     * @param currentState the script's current State
     * @param desiredState the State to change to
     * @param date the date as of the State change is to be made
     * @param memo memo text
     */
    public void changeStatus(String currentState, String desiredState,
            java.util.Date date, String memo) throws MXException,
            RemoteException {

        //Get 
		MXLogger myLogger = MXLoggerFactory.getLogger("maximo.application.{{mbo_class_name}}");

        if (parent.getDate("Statusdate") != null) {
            // Check that the date specified is not less than the last State
            // change
            if (date.getTime() < parent.getDate("Statusdate").getTime()) {
                throw new MXApplicationException("{{addon_id}}", "Statusdate");
            }
        }

        // Get the synonym values
        String currentMaxState = parent.getTranslator().toInternalString(
                "CLISTATUS", currentState);
        String desiredMaxState = parent.getTranslator().toInternalString(
                "CLISTATUS", desiredState);
       
		if (myLogger.isDebugEnabled())
		{
			myLogger.debug("currentMaxState = "
	                + currentMaxState + ", desiredMaxState = " + desiredMaxState);
		}

        // Set the script's State and Statusdate
        if (!currentMaxState.equals(desiredMaxState)) {
            parent.setValue("Status", desiredState, NOACCESSCHECK);
            parent.setValue("Statusdate", date, NOACCESSCHECK);
        }

        // Note the State-change record (Script State entry) is done
        // automatically in StatefulMbo.class
    }

    /**
     * This method is called by the framework's changeState method. Any post
     * processing that needs to be done after State changes must be included in
     * this method.
     */
    public void postStatusChange(String currentState, String State,
            Date asOfDate, String memo) throws MXException, RemoteException {

    }
}
