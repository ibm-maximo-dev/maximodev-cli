package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;
import psdi.util.MXException;

public class {{mbo_name}} extends Mbo implements {{mbo_name}}Remote {

	public {{mbo_name}}(MboSet ms) throws RemoteException {
		super(ms);
	}
	
}
