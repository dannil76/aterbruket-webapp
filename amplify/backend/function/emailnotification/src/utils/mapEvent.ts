import {
    Advert as AwsAdvert,
    MissingAccessory,
    ModelRecord,
    StringRecord,
} from 'models/awsEvent';
import { Advert } from 'models/haffaAdvert';
import {
    getDate,
    getEnum,
    getList,
    getModel,
    getNumber,
    getString,
} from './eventHelper';
import { logDebug } from './logHelper';

export default function mapEvent(event: AwsAdvert): Advert {
    const id = getString(event.id, 'id');
    logDebug(`Try to map event ${id}`);
    return {
        id,
        address: getString(event.address, 'address'),
        advertType: getEnum(event.advertType, 'advertType'),
        city: getString(event.city, 'city'),
        contactPerson: getString(event.contactPerson, 'contactPerson'),
        department: getString(event.department, 'department'),
        email: getString(event.email, 'email'),
        phoneNumber: getString(event.phoneNumber, 'phoneNumber'),
        postalCode: getString(event.postalCode, 'postalCode'),
        reservedBySub: getString(event.reservedBySub, 'reservedBySub'),
        title: getString(event.title, 'title'),
        version: getNumber(event.version, 'version'),
        missingAccessories: getList<ModelRecord<MissingAccessory>>(
            event.missingAccessories,
            'missingAccessories',
        ).map((model) => {
            const missing = getModel(model, 'missingAccessory');
            return {
                accessories: getList<StringRecord>(missing.accessories).map(
                    (accessory) => getString(accessory, 'accessory'),
                ),
                lastReturnedBy: getString(
                    missing.lastReturnedBy,
                    'lastReturnedBy',
                ),
                reportedBy: getString(missing.reportedBy, 'reportedBy'),
                reportedDate: getDate(missing.reportedDate, 'reportedDate'),
            };
        }),
    } as Advert;
}
