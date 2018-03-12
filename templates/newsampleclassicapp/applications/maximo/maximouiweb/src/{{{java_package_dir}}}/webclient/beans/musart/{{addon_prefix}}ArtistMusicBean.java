package {{java_package}}.webclient.beans.musart;

import java.rmi.RemoteException;

import psdi.mbo.MboRemote;
import psdi.mbo.MboSetRemote;
import psdi.util.MXApplicationException;
import psdi.util.MXException;
import psdi.webclient.system.beans.DataBean;

public class {{addon_prefix}}ArtistMusicBean extends DataBean {

	public int associateMusic() throws MXException, RemoteException{
		MboRemote artist = app.getAppBean().getMbo();
		MboSetRemote musicWithoutArtistSet = artist.getMboSet("{{addon_prefix}}MUSICWITHOUTARTIST");
		if (musicWithoutArtistSet.isEmpty()){
			throw new MXApplicationException("{{addon_prefix_lower}}trartist","NoMusicToSelect");
		}
		return EVENT_CONTINUE;
	}

}
