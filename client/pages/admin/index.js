
import withAdmin from '../withadmin';
import Layout from '../../components/Layout';

const User = ({ user }) => <Layout>{JSON.stringify(user)}</Layout>;

export default withAdmin(User);
