package {{java_package}};

import java.rmi.RemoteException;

import psdi.app.asset.AssetServiceRemote;
import psdi.mbo.MboRemote;
import psdi.mbo.MboSetRemote;
import psdi.security.UserInfo;
import psdi.server.AppService;
import psdi.server.MXServer;
import psdi.util.MXException;

public class {{user_service_name}} extends AppService implements {{user_service_name}}Remote{

	public {{user_service_name}}(MXServer mxServer) throws RemoteException {
		super(mxServer);
		// TODO Auto-generated constructor stub
	}

}
