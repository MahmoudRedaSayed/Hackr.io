
import Layout from '../../components/Layout';
import withUser from '../withuser';

const User = ({ user }) => <Layout>{JSON.stringify(user)}</Layout>;

export default withUser(User);
