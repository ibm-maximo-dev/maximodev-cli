package psdi.tr.app.musart;

import java.rmi.RemoteException;

import psdi.mbo.Mbo;
import psdi.mbo.MboSet;
import psdi.util.MXException;

public class TRMusic extends Mbo implements TRMusicRemote {

	public TRMusic(MboSet ms) throws RemoteException {
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
