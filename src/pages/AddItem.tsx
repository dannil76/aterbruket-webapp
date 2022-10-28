import React, { FC } from 'react';

const AddItemForm = React.lazy(() => import('../components/Forms/AddItemForm'));

const AddItem: FC = () => {
    return (
        <main style={{ marginBottom: '0px' }}>
            <AddItemForm />
        </main>
    );
};

export default AddItem;
