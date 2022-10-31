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

export default function mapEvent(
    event: AwsAdvert | undefined,
): Advert | undefined {
    if (!event) {
        return undefined;
    }

    const id = getString(event.id, 'id');
    logDebug(`Try to map event ${id}`);

    let missingAccessories = [];
    if (event.missingAccessories) {
        const models = getList<ModelRecord<MissingAccessory>>(
            event.missingAccessories,
            'missingAccessories',
        );
        missingAccessories = models.map((model) => {
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
        });
    }
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
        reservedBySub: event.reservedBySub
            ? getString(event.reservedBySub, 'reservedBySub')
            : undefined,
        title: getString(event.title, 'title'),
        version: getNumber(event.version, 'version'),
        status: getEnum(event.status, 'status'),
        updatedAt: getDate(event.updatedAt, 'updatedAt'),
        missingAccessories,
    } as Advert;
}
