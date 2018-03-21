package {{java_package}};

import java.rmi.RemoteException;

import {{java_package}}.{{service_name}}ServiceRemote;
import psdi.server.AppService;
import psdi.server.MXServer;

public class {{service_name}}Service extends AppService implements {{service_name}}ServiceRemote {

	public {{service_name}}() throws RemoteException {
		super();
	}

	public {{service_name}}(MXService mxserver) throws RemoteException{
		super(mxserver);
	}
	
}
