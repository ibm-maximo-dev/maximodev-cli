package {{java_package}}.app.musart;

import psdi.mbo.MAXTableDomain;
import psdi.mbo.MboValue;

public class {{addon_prefix}}FldMusicArtistNum extends MAXTableDomain {

	public {{addon_prefix}}FldMusicArtistNum(MboValue mbv) {
		super(mbv);
		setRelationship("{{addon_prefix}}ARTIST", "artistnum=:artistnum");
		setListCriteria("artistnum <> 'JOAO'");
		setLookupKeyMapInOrder(new String[]{"artistnum"}, new String[]{"artistnum"});
	}
	
}
