
import { getCookie } from "../helpers/auth";
import axios from "axios"
const withUser = Page => {
    const WithAuthUser = props => <Page {...props} />;
    WithAuthUser.getInitialProps = async context => {
        const token = getCookie('token', context.req);
        let user = null;
        let userLinks = [];
        if (token) {
            try {
                const response = await axios.get(`http://localhost:5000/api/users`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                        contentType: 'application/json'
                    }
                });
                console.log("the response",response.data);
                user = response.data.user;
                userLinks=response.data.links
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
                userLinks,
                token
            };
        }
        
    };

    return WithAuthUser;
};

export default withUser;