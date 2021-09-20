
package {{test_java_package}};

import static org.junit.Assert.assertEquals;

import java.rmi.RemoteException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.junit.BeforeClass;
import org.junit.Test;

import com.ibm.icu.impl.Assert;
import com.ibm.tivoli.maximo.fwm.unittest.util.MXUnitTestUtil;

import psdi.app.workorder.WO;
import psdi.mbo.DBShortcut;
import psdi.mbo.MboRemote;
import psdi.mbo.MboSetRemote;
import psdi.mbo.SqlFormat;
import psdi.server.MXServer;
import psdi.unittest.AssertionsUtil;
import psdi.unittest.Depends;
import psdi.util.MXApplicationException;
import psdi.util.MXException;

/**
 * The parameter belong is necessary to allow this test to run.
 *
 * -Dcom.ibm.xtq.processor.overrideSecureProcessing=true
 *
 * @author masmanagedev-cli
 * @version 1.0
 *
 */
public class {{test_name}}Test {

	@BeforeClass
	public static void setupBeforeClass() throws Exception {
		MXUnitTestUtil.getInstance().getMXServer();
		{{test_name}}Test.loadData();
	}

	/**
	 * You can load your data from here as well. Depnending on your test approach.
	 */
	private static void loadData() {
		// TODO Implement the load data
	}



	@Test
	@Depends("setupBeforeClass")
	public void testExample() {
        /**
		 * Uncomment the code bellow will load a WO from exampla data set represented through the string parameter of a FQN for a WO representation.
		* */
		//WO wo = (WO) AssertionsUtil.assertLoadTestData("{{test_java_package}}.datasource.{{test_name}}Dataset.basicDataSet");
		//TODO - Implement your tests.
		Assert.assrt(true);
	}
}
