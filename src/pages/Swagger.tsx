import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const Swagger = () => {

    return (
        <div className="swagger-wrapper">
            <SwaggerUI
                url="http://localhost:8080/v3/api-docs"
                docExpansion="list"
                withCredentials={true}
                requestInterceptor={(req) => {
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; XSRF-TOKEN=`);
                    let token = '';
                    if (parts.length === 2) token = parts.pop()?.split(';').shift() || '';

                    if (token) {
                        req.headers['X-XSRF-TOKEN'] = token;
                    }
                    return req;
                }}
            />
        </div>
    );
};

export default Swagger;