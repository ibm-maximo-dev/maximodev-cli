package psdi.tr.app.musart;

import psdi.mbo.MAXTableDomain;
import psdi.mbo.MboValue;

public class TRFldMusicArtistNum extends MAXTableDomain {

	public TRFldMusicArtistNum(MboValue mbv) {
		super(mbv);
		setRelationship("TRARTIST", "artistnum=:artistnum");
		setListCriteria("artistnum <> 'JOAO'");
		setLookupKeyMapInOrder(new String[]{"artistnum"}, new String[]{"artistnum"});
	}
	
}
