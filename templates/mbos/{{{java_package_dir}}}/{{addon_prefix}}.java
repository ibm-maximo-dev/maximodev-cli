package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;
import psdi.util.MXException;

public class {{addon_prefix}} extends Mbo implements {{addon_prefix}}Remote {

	public {{addon_prefix}}(MboSet ms) throws RemoteException {
		super(ms);
	}
	
}
