import { jsPDF as JSPDF } from 'jspdf';
import QRCode from 'qrcode.react';
import React, { FC } from 'react';
import styled from 'styled-components';

const QRCodeCont = styled.div`
    display: flex;
    margin-bottom: 1em;
    margin-top: 25px;
    align-items: center;
    flex-direction: column;

    #labelDiv {
        border: 1px solid black;
        border-radius: 9.5px;
        box-shadow: 0px 0px 2px rgba(98, 98, 98, 0.18),
            0px 1px 2px rgba(98, 98, 98, 0.18);
    }

    .pDownload {
        color: grey;
        font-style: italic;
        font-size: 0.8em;
        text-align: center;
        margin-bottom: 8px;
    }
`;

interface IProps {
    id: string;
    recycleId?: string | null | undefined;
    itemTitle?: string | null | undefined;
}

const QRCodeContainer: FC<IProps> = ({ id, recycleId, itemTitle }: IProps) => {
    if (!recycleId || !itemTitle) {
        return <></>;
    }

    const downloadLabel = () => {
        const doc = new JSPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [108, 81],
        });

        const pdfDiv: HTMLElement | null = document.getElementById('labelDiv');

        if (pdfDiv !== null) {
            doc.html(pdfDiv, {
                callback: () => {
                    doc.save(`${id}.pdf`);
                },
            });
        }
    };

    return (
        <QRCodeCont>
            <p className="pDownload">
                Klicka på etiketten nedan för att ladda ner den som PDF
            </p>
            <div
                tabIndex={0}
                role="link"
                onKeyPress={downloadLabel}
                onClick={downloadLabel}
                id="labelDiv"
                style={{
                    lineHeight: '6px',
                    width: 108,
                    height: 80,
                    fontSize: '9px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        paddingTop: 5,
                        paddingLeft: 5,
                        marginBottom: 3,
                    }}
                >
                    <QRCode value={id} level="L" size={59} />
                    {recycleId && (
                        <span
                            style={{
                                paddingLeft: 5,
                            }}
                        >
                            {recycleId}
                        </span>
                    )}
                </div>
                <span
                    style={{
                        paddingLeft: 5,
                    }}
                >
                    {itemTitle}
                </span>
            </div>
        </QRCodeCont>
    );
};

QRCodeContainer.defaultProps = {
    recycleId: undefined,
    itemTitle: 'helsingborg.se/haffa',
};

export default QRCodeContainer;
