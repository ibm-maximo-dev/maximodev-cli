package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.MboSet;
import psdi.mbo.MboSetRemote;
import psdi.mbo.StatefulMbo;
import psdi.mbo.StatusHandler;
import psdi.util.MXException;
import {{java_package}}.{{mbo_class_name}}StateHandler;

public class {{mbo_class_name}} extends StatefulMbo implements {{mbo_class_name}}Remote{

	/**
	 * This Mbo constructor
	 */
	public {{mbo_class_name}}(MboSet ms) throws RemoteException {
		super(ms);
	}
	/**
	 * Returns the Status Handler object instantiate through the {{mbo_class_name}}StateHandler object. 
	 */
	@Override
	protected StatusHandler getStatusHandler() {
		// Associate this Mbo whit its Status Handler object.
		return new {{mbo_class_name}}StateHandler(this);
	}

	@Override
	protected MboSetRemote getStatusHistory() throws MXException, RemoteException {
		// TODO Auto-generated method stub
		return getMboSet({{mbo_class_name}}SetRemote.STATE);
	}
	/**
	 * This method return the Synonym domain ID associated with this Stateful Mbo.
	 * please refers to the script generated thourgh the <code>maximodev-cli create mbo --mbo_type=stateful</code>,
	 * to check MaxValues and domain construction for futher details. 
	 */
	@Override
	public String getStatusListName() {
		return "{{mbo_name}}STATUS";
	}

}
