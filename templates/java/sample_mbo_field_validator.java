package {{java_package}};

import java.rmi.RemoteException;

import psdi.mbo.*;
import psdi.util.*;
import psdi.app.asset.FldAssetnum;

/**
 * Simple field validate that ensure that only letters and numbers can be used in the field.
 *
 * {{description}}
 * @author {{author}}
 */
public class {{java_class_name}} extends FldAssetnum {
    public {{java_class_name}}(MboValue mbv) throws MXException, RemoteException {
        super(mbv);
    }

    public void validate() throws MXException, RemoteException {
        super.validate();

        if (!getMboValue().isNull() && !getMboValue().getString().matches("[a-zA-Z0-9]+")) {
            throw new MXApplicationException("{{addon_prefix}}", "letters_numbers_only");
        }
    }
}
