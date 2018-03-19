package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.util.MXException;

public class {{addon_prefix}}Set extends MboSet implements {{addon_prefix}}SetRemote {

	public {{addon_prefix}}Set(MboServerInterface ms) throws RemoteException {
		super(ms);
	}

	@Override
	protected Mbo getMboInstance(MboSet ms) throws MXException, RemoteException {
		return new {{addon_prefix}}(ms);
	}
}
