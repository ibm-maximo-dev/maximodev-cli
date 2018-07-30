package {{ext_java_package}};

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.util.MXException;
import {{ext_id}}Set;
import {{ext_id}}SetRemote;

public class {{ext_prefix_T}}{{ext_id_T}}Set extends {{ext_id_T}}Set implements {{ext_prefix_T}}{{ext_id_T}}SetRemote {

	public {{ext_prefix_T}}{{ext_id_T}}Set(MboServerInterface ms) throws MXException, RemoteException {
		super(ms);
	}

	@Override
	protected Mbo getMboInstance(MboSet ms) throws MXException, RemoteException {
		return new {{ext_prefix_T}}{{ext_id_T}}(ms);
	}
}
