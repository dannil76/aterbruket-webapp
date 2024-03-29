import React, { FC } from 'react';
import { Advert } from '../../../graphql/models';
import { Card, SubTitle, AddressCard, ContactCard } from '../Common';

interface Props {
    advert: Advert | undefined;
}

const ReturnContent: FC<Props> = ({ advert }) => {
    if (!advert) {
        return <></>;
    }

    return (
        <>
            {advert.returnInformation && (
                <section>
                    <h4 className="dark">Hur du lämnar tillbaka</h4>
                    <Card>
                        <div className="cardBody">
                            <SubTitle>Så här går det till</SubTitle>
                            <p>{advert.returnInformation}</p>
                        </div>
                    </Card>
                </section>
            )}
            {advert.missingItemsInformation && (
                <section>
                    <h4 className="dark">Om något går sönder</h4>
                    <p className="description">
                        {advert.missingItemsInformation}
                    </p>
                </section>
            )}

            <section>
                <h4 className="dark">Här lämnas prylen</h4>
                <AddressCard advert={advert} />
            </section>

            <section>
                <h4 className="dark">Kontaktperson</h4>
                <ContactCard advert={advert} />
            </section>
        </>
    );
};

export default ReturnContent;
