package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.util.MXException;

public class {{mbo_name}}Set extends MboSet implements {{mbo_name}}SetRemote {

	public {{mbo_name}}Set(MboServerInterface ms) throws RemoteException {
		super(ms);
	}

	@Override
	protected Mbo getMboInstance(MboSet ms) throws MXException, RemoteException {
		return new {{mbo_name}}(ms);
	}
}
