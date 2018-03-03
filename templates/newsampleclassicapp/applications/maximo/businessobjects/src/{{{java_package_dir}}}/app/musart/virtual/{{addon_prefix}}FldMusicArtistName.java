package {{java_package}}.app.musart.virtual;

import java.rmi.RemoteException;

import psdi.mbo.MAXTableDomain;
import psdi.mbo.MboRemote;
import psdi.mbo.MboSetRemote;
import psdi.mbo.MboValue;
import psdi.util.MXException;

public class {{addon_prefix}}FldMusicArtistName extends MAXTableDomain {

	public {{addon_prefix}}FldMusicArtistName(MboValue mbv) {
		super(mbv);
		setRelationship("{{addon_prefix}}ARTIST", "name=:artistname");
		setLookupKeyMapInOrder(new String[]{"artistnum","artistname"}, new String[]{"artistnum","name"});
	}
	
	
	@Override
	public void action() throws MXException, RemoteException {
		super.action();
		if (mboValue.isNull()){
			mboValue.getMbo().setValueNull("artistnum");
		}
		/*
		else{
			MboSetRemote artistSet = mboValue.getMbo().getMboSet("$TRARTISTNAMEREL", "TRARTIST", "name='" + mboValue.getString() + "'");
			MboRemote artist = artistSet.getMbo(0);
			if (artist!=null){
				mboValue.getMbo().setValue("artistnum", artist.getString("artistnum"));
			}
		}
		*/
	}
	
	@Override
	public void initValue() throws MXException, RemoteException {
		super.initValue();

		MboSetRemote artistSet = mboValue.getMbo().getMboSet("{{addon_prefix}}ARTIST");
		MboRemote artist = artistSet.getMbo(0);
		String artistName = artist.getString("name");
		mboValue.setValue(artistName, NOACTION);
		
		//OR
		artistName = mboValue.getMbo().getString("{{addon_prefix_lower}}artist.name");
		mboValue.setValue(artistName, NOACCESSCHECK | NOACTION | NOVALIDATION);
		mboValue.setValue(artistName, NOACCESSCHECK | NOVALIDATION_AND_NOACTION);
		
		/*
		artistSet.isEmpty();
		artistSet.count(); - evitar
		
		//Percorrendo MBO Sets
		
		MboRemote artistX = null;
		for (int index=0; (artistX = artistSet.getMbo(index))!=null; index++){
			//Acao
		}
		
		for (int index=0; artistSet.getMbo(index)!=null; index++){
			MboRemote artistY = artistSet.getMbo(index);
			//Acao
		}
		*/
		
		
	}
	
}
