package {{java_package}}.app.musart;

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;
import psdi.util.MXException;

public class {{addon_prefix}}Music extends Mbo implements {{addon_prefix}}MusicRemote {

	public {{addon_prefix}}Music(MboSet ms) throws RemoteException {
		super(ms);
	}
	
	@Override
	public void init() throws MXException {
		super.init();
		if (!toBeAdded()){
			setFieldFlag("title", READONLY, true);
		}
	}
	
}
