package {{java_package}}.app.musart;

import java.rmi.RemoteException;
import java.util.Date;

import psdi.mbo.MboValue;
import psdi.mbo.MboValueAdapter;
import psdi.server.MXServer;
import psdi.util.MXApplicationException;
import psdi.util.MXException;

public class {{addon_prefix}}FldArtistBirthDate extends MboValueAdapter {

	public {{addon_prefix}}FldArtistBirthDate(MboValue mbv) {
		super(mbv);
	}
	
	@Override
	public void validate() throws MXException, RemoteException {
		super.validate();
		
		//Date birthDate = mboValue.getMbo().getDate("birthdate");
		Date birthDate = mboValue.getDate();
		
		//Return server date
		Date serverDate = MXServer.getMXServer().getDate();
		
		if (birthDate.after(serverDate)){
			throw new MXApplicationException("trartist", "DateCannotBeFuture");
		}
		
	}

}
