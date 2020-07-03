import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url,
                { ...body, ...props }
            );

            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;
        } catch (errors) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooopssss...</h4>
                    <ul className="my-0">
                        { errors.response.data.errors.map(err => <li key={ err.field }>{ err.message }</li>) }
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, errors };
}