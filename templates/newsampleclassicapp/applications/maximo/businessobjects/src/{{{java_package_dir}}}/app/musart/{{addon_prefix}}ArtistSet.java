package {{java_package}}.app.musart;

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboServerInterface;
import psdi.mbo.MboSet;
import psdi.util.MXException;

public class {{addon_prefix}}ArtistSet extends MboSet implements {{addon_prefix}}ArtistSetRemote {

	public {{addon_prefix}}ArtistSet(MboServerInterface ms) throws RemoteException {
		super(ms);
	}

	@Override
	protected Mbo getMboInstance(MboSet ms) throws MXException, RemoteException {
		return new {{addon_prefix}}Artist(ms);
	}

}
