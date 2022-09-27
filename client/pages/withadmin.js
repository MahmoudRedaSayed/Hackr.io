
import { getCookie } from "../helpers/auth";
import axios from "axios"
const withAdmin = Page => {
    const WithAuthAdmin = props => <Page {...props} />;
    WithAuthAdmin.getInitialProps = async context => {
        const token = getCookie('token', context.req);
        let user = null;
        if (token) {
            try {
                const response = await axios.get(`http://localhost:5000/api/users`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                        contentType: 'application/json'
                    }
                });
                user = response.data;
            } catch (error) {
                console.log(error)
                if (error.response.status === 401) {
                    user = null;
                }
            }
        }

        if (user === null) {
            redirect
            context.res.writeHead(302, {
                Location: '/'
            });
            context.res.end();
        } else {
            return {
                ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
                user,
                token
            };
        }
        
    };

    return WithAuthAdmin;
};

export default withAdmin;