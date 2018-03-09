package {{java_package}}.app.musart;

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.util.MXException;

public class {{addon_prefix}}MusicSet extends MboSet implements {{addon_prefix}}MusicSetRemote {

	public {{addon_prefix}}MusicSet(MboServerInterface ms) throws RemoteException {
		super(ms);
	}

	@Override
	protected Mbo getMboInstance(MboSet ms) throws MXException, RemoteException {
		return new {{addon_prefix}}Music(ms);
	}

}
