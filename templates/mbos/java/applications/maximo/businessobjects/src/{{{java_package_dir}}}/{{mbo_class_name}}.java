package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;
import psdi.util.MXException;

public class {{mbo_class_name}} extends Mbo implements {{mbo_class_name}}Remote {

	public {{mbo_class_name}}(MboSet ms) throws RemoteException {
		super(ms);
	}
	
}
