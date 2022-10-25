import React, { FC } from 'react';
import styled from 'styled-components';
import { IAdvert } from '../../../interfaces/IAdvert';
import { Card, SubTitle, AddressCard, ContactCard } from '../Common';

interface Props {
    advert: IAdvert;
}

const DifficultyIcon = styled.span<{ level?: string }>`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: gray;

    ${(props) => {
        switch (props.level) {
            case 'medium':
                return `background-color: #EFBB1F;`;
            case 'hard':
                return `background-color: #E14751;`;
            case 'easy':
            default:
                return `background-color:#84C035;`;
        }
    }}
`;

const DefaultContent: FC<Props> = ({ advert }) => {
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
                            <td>Delning</td>
                        </tr>

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

                {advert?.accessories && advert.accessories.length > 0 && (
                    <>
                        <div>
                            <h4 className="dark">Ingår i paketet</h4>
                        </div>
                        <table>
                            <tbody>
                                {advert.accessories.map((accessory: string) => (
                                    <tr key={accessory}>
                                        <td>
                                            <h4>{accessory}</h4>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </section>

            <section>
                <h4 className="dark">Här finns prylen</h4>
                <AddressCard advert={advert} />
            </section>

            <section>
                <h4 className="dark">Hur du haffar ut prylen</h4>
                <Card>
                    <div className="cardBody">
                        <SubTitle>
                            <DifficultyIcon
                                level={advert.borrowDifficultyLevel}
                            />
                            Hur svår att haffa ut?
                        </SubTitle>
                        <p>
                            {advert.borrowDifficultyLevel === 'easy' &&
                                'Det går att komma in själv ”från gatan” och hitta prylen för att skanna dess QR-kod utan någon annan inblandad.'}
                            {advert.borrowDifficultyLevel === 'medium' &&
                                'Prylen finns i ett rum som bara de som jobbar där har tillgång till, någon behöver öppna dörren för dig etc.'}
                            {advert.borrowDifficultyLevel === 'hard' &&
                                'Prylen finns i ett låst skåp bakom en låst dörr. Du behöver få tag i en viss person för att få hjälp att komma in.'}
                        </p>

                        <SubTitle>Så Här går det till</SubTitle>
                        <p>{advert.pickUpInstructions ?? ''}</p>
                    </div>
                </Card>
            </section>

            <section>
                <h4 className="dark">Kontaktperson</h4>
                <ContactCard advert={advert} />
            </section>
        </>
    );
};

export default DefaultContent;
