package psdi.tr.webclient.beans.musart;

import java.rmi.RemoteException;

import psdi.mbo.MboRemote;
import psdi.mbo.MboSetRemote;
import psdi.util.MXApplicationException;
import psdi.util.MXException;
import psdi.webclient.system.beans.DataBean;

public class TRArtistMusicBean extends DataBean {

	public int associateMusic() throws MXException, RemoteException{
		MboRemote artist = app.getAppBean().getMbo();
		MboSetRemote musicWithoutArtistSet = artist.getMboSet("TRMUSICWITHOUTARTIST");
		if (musicWithoutArtistSet.isEmpty()){
			throw new MXApplicationException("trartist","NoMusicToSelect");
		}
		return EVENT_CONTINUE;
	}

}
