package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;
import psdi.util.MXException;
import {{ext_id}};
import {{ext_id}}Remote;

public class {{ext_prefix_T}}{{ext_id_T}} extends {{ext_id_T}} implements {{ext_id_T}}Remote {

	public {{ext_prefix_T}}{{ext_id_T}}(MboSet ms) throws MXException, RemoteException {
		super(ms);
	}
	
}
