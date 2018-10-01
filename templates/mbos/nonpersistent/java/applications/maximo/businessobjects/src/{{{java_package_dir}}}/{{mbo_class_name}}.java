package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.MboSet;
import psdi.mbo.NonPersistentMbo;

public class {{mbo_class_name}} extends NonPersistentMbo implements {{mbo_class_name}}Remote {

	public {{mbo_class_name}}(MboSet ms) throws RemoteException {
		super(ms);
		// TODO Auto-generated constructor stub
	}

}
