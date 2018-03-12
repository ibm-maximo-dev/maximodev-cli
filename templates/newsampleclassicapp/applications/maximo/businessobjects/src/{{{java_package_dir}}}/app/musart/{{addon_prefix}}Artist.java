package {{java_package}}.app.musart;

import java.rmi.RemoteException;
import java.util.Vector;

import psdi.mbo.Mbo;
import psdi.mbo.MboRemote;
import psdi.mbo.MboSet;
import psdi.mbo.MboSetRemote;
import psdi.util.MXApplicationException;
import psdi.util.MXException;

public class {{addon_prefix}}Artist extends Mbo implements {{addon_prefix}}ArtistRemote {

	public {{addon_prefix}}Artist(MboSet ms) throws RemoteException {
		super(ms);
	}
	
	@Override
	public void canDelete() throws MXException, RemoteException {
		super.canDelete();
		if (!this.getMboSet("{{addon_prefix}}MUSIC").isEmpty()){
			Object[] params = new Object[]{this.getString("name")};
			throw new MXApplicationException("{{addon_prefix}}artist", "CannotDeleteArtistWithMusic", params);
		}
	}
	
	public void associateSelectedMusic(MboSetRemote musicSet) throws MXException, RemoteException{
		Vector selectedMusics = musicSet.getSelection();
		for (Object music: selectedMusics){
			((MboRemote)music).setValue("artistnum", this.getString("artistnum"), NOACCESSCHECK);
		}
	}

}
