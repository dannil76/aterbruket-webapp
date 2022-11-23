import React, { FC } from 'react';
import showDays from '../../../hooks/showDays';
import { conditions, materials, areaOfUse } from '../../../static/advertMeta';
import { IOption } from '../../../interfaces/IForm';
import {
    Advert,
    ItemAMaterialInput,
    ItemAreaOfUseInput,
} from '../../../graphql/models';
import { AddressCard, ContactCard } from '../Common';

interface Props {
    advert: Advert | undefined;
    remainingInventory: number;
    status: string;
}

const DefaultContent: FC<Props> = ({ advert, remainingInventory, status }) => {
    if (!advert) {
        return <></>;
    }

    const getMetaValues = (
        itemValues: ItemAMaterialInput | ItemAreaOfUseInput,
        allValues: IOption[],
    ) => {
        const values = Object.entries(itemValues)
            .filter(([, value]) => value)
            .map(([key]) => {
                const valueObj = allValues.find((v) => v.key === key);
                return valueObj?.title ? valueObj.title : '';
            });
        return values;
    };

    const itemCondition = conditions.find(
        (condition) => condition.key === advert?.condition,
    );

    const itemMaterialsArray = advert?.material?.[0]
        ? getMetaValues(advert.material[0], materials)
        : [];
    const itemMaterialsString = itemMaterialsArray.join(', ');

    const itemAreaOfUseArray = advert?.areaOfUse?.[0]
        ? getMetaValues(advert.areaOfUse[0], areaOfUse)
        : [];
    const areaOfUseString = itemAreaOfUseArray.join(', ');

    const remaining =
        remainingInventory === 0 ? 'okänt' : `${remainingInventory}`;

    return (
        <>
            <section>
                <h4 className="dark">Beskrivning</h4>
                <p className="description">{advert.description}</p>
            </section>

            <section>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h4>Typ av haffning</h4>
                            </td>
                            <td>Återbruk</td>
                        </tr>

                        <tr>
                            <td>
                                <h4>Lagersaldo</h4>
                            </td>
                            <td>
                                {remaining} <span>{advert.quantityUnit}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h4>Höjd</h4>
                            </td>
                            <td>
                                {advert.height} <span>cm</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h4>Bredd</h4>
                            </td>
                            <td>
                                {advert.width} <span>cm</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h4>Djup</h4>
                            </td>
                            <td>
                                {advert.length} <span>cm</span>
                            </td>
                        </tr>
                        {advert.color && (
                            <tr>
                                <td>
                                    <h4>Färg</h4>
                                </td>
                                <td>{advert.color}</td>
                            </tr>
                        )}
                        {itemMaterialsString && (
                            <tr>
                                <td>
                                    <h4>Material</h4>
                                </td>
                                <td>{itemMaterialsString}</td>
                            </tr>
                        )}
                        {itemCondition?.title && (
                            <tr>
                                <td>
                                    <h4>Skick</h4>
                                </td>
                                <td>{itemCondition?.title}</td>
                            </tr>
                        )}
                        <tr>
                            <td>
                                <h4>Användningsområde</h4>
                            </td>
                            {areaOfUseString ? (
                                <td>{areaOfUseString}</td>
                            ) : (
                                <td />
                            )}
                        </tr>

                        {advert.purchasePrice !== '' && (
                            <tr>
                                <td>
                                    <h4>Inköpspris</h4>
                                </td>
                                <td>
                                    {advert.purchasePrice} <span>kr</span>
                                </td>
                            </tr>
                        )}

                        {status === 'available' && (
                            <tr>
                                <td>
                                    <h4>Har varit tillgänglig i</h4>
                                </td>
                                <td>
                                    {showDays(advert.createdAt)}{' '}
                                    <span>dagar</span>
                                </td>
                            </tr>
                        )}

                        {advert.climateImpact && (
                            <tr>
                                <td>
                                    <h4>Klimatpåverkan</h4>
                                </td>
                                <td>
                                    {advert.climateImpact}{' '}
                                    <span>
                                        kg CO<sub>2</sub>e
                                    </span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            <section>
                <h4 className="dark">Här finns prylen</h4>
                <AddressCard advert={advert} />
            </section>

            <section>
                <h4 className="dark">Kontaktperson</h4>
                <ContactCard advert={advert} />
            </section>
        </>
    );
};

export default DefaultContent;
