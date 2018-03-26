package {{java_package}};


import {{java_package}}.{{mbo_class_name}}ServiceRemote;


import java.rmi.RemoteException;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.TimeZone;
import java.util.Vector;

import psdi.mbo.KeyValue;
import psdi.mbo.MaxMessage;
import psdi.mbo.Mbo;
import psdi.mbo.MboData;
import psdi.mbo.MboRemote;
import psdi.mbo.MboSetRemote;
import psdi.mbo.MboValueData;
import psdi.mbo.MboValueInfoStatic;
import psdi.security.UserInfo;
import psdi.server.AppService;
import psdi.server.MXServer;
import psdi.txn.MXTransaction;
import psdi.util.ApplicationError;
import psdi.util.MXException;
import psdi.util.MaxType;

public class {{mbo_class_name}}Service extends AppService implements {{mbo_class_name}}ServiceRemote {

	public {{mbo_class_name}}Service() throws RemoteException {
		super();
	}

	public {{mbo_class_name}}Service(MXServer mxserver) throws RemoteException{
		super(mxserver);
	}

	@Override
    public boolean isModified() throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean toBeSaved() throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean toBeDeleted() throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean toBeAdded() throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean toBeUpdated() throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean thisToBeUpdated() throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean isModified(String attribute) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void setForDM(boolean forDM) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public boolean isForDM() throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean isNew() throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void delete() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void undelete() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public KeyValue getKeyValue() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public boolean isAutoKeyed(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void setAutokeyFields() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public String getString(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public boolean getBoolean(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public byte getByte(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int getInt(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public long getLong(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public float getFloat(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public double getDouble(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public Date getDate(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public byte[] getBytes(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote getMboSet(String name) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Vector getMboDataSet(String relationship) throws RemoteException, MXException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public boolean isNull(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void setValueNull(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, String val) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, boolean val) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, byte val) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, short val) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, int val) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, long val) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, float val) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, double val) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, byte[] val) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, Date val) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public MaxType getMboInitialValue(String name) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboValueData getMboValueData(String attribute) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboValueData getMboValueData(String attribute, boolean ignoreFieldFlags)
            throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboValueData[] getMboValueData(String[] attribute) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboData getMboData(String[] attributes) throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboValueData[] getMboValueDataForDownload(String[] attributes) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote getList(String attribute) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote smartFill(String attribute, String value, boolean exact) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote smartFind(String attribute, String value, boolean exact) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote smartFindByObjectName(String sourceObj, String targetAttrName, String value, boolean exact)
            throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote smartFindByObjectNameDirect(String sourceObj, String targetAttrName, String value,
            boolean exact) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Object[] getMatchingAttrs(String sourceName, String targetAttrName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote smartFind(String objectName, String attribute, String value, boolean exact)
            throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote smartFindByObjectName(String sourceObj, String targetAttrName, String value, boolean exact,
            String[][] cachedKeyMap) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void checkMethodAccess(String methodName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void validate() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public Hashtable validateAttributes() throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public boolean isZombie() throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void setValueNull(String attributeName, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, String val, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, boolean val, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, byte val, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, short val, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, int val, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, long val, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, float val, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, double val, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, byte[] val, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, Date val, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String attributeName, MaxType value, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setFieldFlags(String name, long flags) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setFieldFlag(String name, long flag, boolean state) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setFieldFlag(String name, long flag, boolean state, MXException mxe) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setFieldFlag(String[] names, long flag, boolean state) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setFieldFlag(String[] names, long flag, boolean state, MXException mxe) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setFieldFlag(String[] names, boolean inclusive, long flag, boolean state) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setFieldFlag(String[] names, boolean inclusive, long flag, boolean state, MXException mxe)
            throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setFlags(long flags) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setFlag(long flags, boolean state) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setFlag(long flags, boolean state, MXException mxe) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void delete(long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void add() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public boolean toBeValidated() throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public String getUserName() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboRemote copy() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboRemote copy(MboSetRemote mboset) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboRemote copy(MboSetRemote mboset, long accessModifier) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboRemote copyFake(MboSetRemote mboset) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void setCopyDefaults() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public MboRemote getOwner() throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote getThisMboSet() throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public long getFlags() throws RemoteException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public boolean isFlagSet(long flag) throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public MXTransaction getMXTransaction() throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void generateAutoKey() throws RemoteException, MXException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public UserInfo getUserInfo() throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void startCheckpoint() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void rollbackToCheckpoint() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void copyValue(MboRemote sourceMbo, String attrSource, String attrTarget, long flags)
            throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void copyValue(MboRemote sourceMbo, String[] attrSource, String[] attrTarget, long flags)
            throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void select() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void unselect() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public boolean isSelected() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public MboRemote duplicate() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void propagateKeyValue(String keyName, String keyValue) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public boolean hasHierarchyLink() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void setPropagateKeyFlag(boolean flag) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public boolean getPropagateKeyFlag() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void setPropagateKeyFlag(String[] objectName, boolean flag) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public boolean excludeObjectForPropagate(String name) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void setESigFieldModified(boolean esigFieldModified) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public Object getDatabaseValue(String attribute) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public boolean isBasedOn(String objectName) throws RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void clear() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public String[] getSiteOrg() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void setValue(String targetAttrName, MboRemote sourceMbo) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setValue(String targetAttrName, MboSetRemote sourceMboSet) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public long getUniqueIDValue() throws RemoteException, MXException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public String getUniqueIDName() throws RemoteException, MXException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboValueInfoStatic getMboValueInfoStatic(String attribute) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboValueInfoStatic[] getMboValueInfoStatic(String[] attribute) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getStringInBaseLanguage(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getOrgForGL(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public int getDocLinksCount() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public String getLinesRelationship() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getMessage(String errGrp, String errKey) throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getMessage(String errGrp, String errKey, Object[] params) throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getMessage(String errGrp, String errKey, Object param) throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getMessage(MXException exception) throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MaxMessage getMaxMessage(String errGrp, String errKey) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void setMLValue(String attributeName, String langCode, String value, long accessModifier)
            throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public String getString(String attributeName, String langCode) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getStringTransparent(String attributeName, String langCode) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboRemote createComm() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote getMboSet(String name, String objectName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote getMboSet(String name, String objectName, String relationship)
            throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getMatchingAttr(String attribute) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getMatchingAttr(String sourceObjectName, String attribute) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboRemote blindCopy(MboSetRemote mboset) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getOrgSiteForMaxvar(String maxvarName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getStringInSpecificLocale(String attribute, Locale l, TimeZone tz)
            throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void sigOptionAccessAuthorized(String optionname) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public String getInsertSite() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getInsertOrganization() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getInsertCompanySetId() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getInsertItemSetId() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getRecordIdentifer() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public boolean isMasterTenant(String tableName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean sigopGranted(String optionname) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean sigopGranted(String app, String optionname) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public HashMap sigopGranted(Set optionnames) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public HashMap evaluateCtrlConditions(HashSet options) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public HashMap evaluateCtrlConditions(HashSet options, String app) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void setNewMbo(boolean flag) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setModified(boolean modified) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setDeleted(boolean modified) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public boolean evaluateCondition(String conditionNum) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void addToDeleteForInsertList(String mboName) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public Vector getDeleteForInsertList() throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MaxType getInitialValue(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String[] getDomainIDs(String attributeName) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Object[] getCommLogOwnerNameAndUniqueId() throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public MboSetRemote getExistingMboSet(String relationship) throws RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void addMboSetForRequiredCheck(MboSetRemote fauxMboSet) throws RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public List<MboRemote> getMboList(String mrp) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void setApplicationError(String attribute, ApplicationError appError) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setApplicationRequired(String attribute, boolean required) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setReferencedMbo(String token, MboRemote refMbo) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void setReferencedMbo(String token, Mbo refMbo) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public boolean isLocked() throws RemoteException, MXException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean isLocked(boolean cache) throws RemoteException, MXException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean isMboLockedByMe() throws RemoteException, MXException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public String getLockedByDisplayName() throws RemoteException, MXException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public boolean hasLockSaveRights(String app) throws RemoteException, MXException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void setIgnoreRecordLockCheck(boolean ignoreRecordLock) throws RemoteException, MXException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public boolean getIgnoreLockCheck() throws RemoteException, MXException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public boolean isOptionGranted(String app, String option) throws RemoteException, MXException {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public void lock(boolean lockNow) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void unlock(boolean lockNow) throws MXException, RemoteException {
        // TODO Auto-generated method stub
        
    }
	
	
}
