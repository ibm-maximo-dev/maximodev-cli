package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.MboSet;
import psdi.mbo.MboSetRemote;
import psdi.mbo.StatefulMbo;
import psdi.mbo.StatusHandler;
import psdi.util.MXException;

public class {{mbo_class_name}} extends StatefulMbo implements {{mbo_class_name}}Remote{

	public {{mbo_class_name}}(MboSet ms) throws RemoteException {
		super(ms);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected StatusHandler getStatusHandler() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected MboSetRemote getStatusHistory() throws MXException, RemoteException {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String getStatusListName() {
		// TODO Auto-generated method stub
		return null;
	}

}
