package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.util.MXException;

public class {{mbo_class_name}}Set extends MboSet implements {{mbo_class_name}}SetRemote {

	public {{mbo_class_name}}Set(MboServerInterface ms) throws RemoteException {
		super(ms);
	}

	@Override
	protected Mbo getMboInstance(MboSet ms) throws MXException, RemoteException {
		return new {{mbo_class_name}}(ms);
	}
}
