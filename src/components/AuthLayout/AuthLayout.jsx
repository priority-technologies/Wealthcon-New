import './AuthLayout.scss';
import { Fragment } from 'react';
import Login from '../../app/(auth)/login/page';
import WealthconLogo from '@/components/Logo/WealthconLogo';

const AuthLayout = ({ className, data }) => {
    const classes = `${className || ''}`;

    return (
        <Fragment>
            <div className="md:grid block grid-cols-10 ">
                <div className="login-sidebar md:h-screen content-center md:py-0 py-10 md:col-span-6">
                    <div className='m-auto'>
                        <WealthconLogo size={160} />
                    </div>
                </div>
                <div className="bg-primary-content md:h-screen content-center block md:py-0 py-10 md:col-span-4">
                    <div className='m-auto w-96'>
                      <Login />
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default AuthLayout;
