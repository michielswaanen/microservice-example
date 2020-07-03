import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser}) => {
    return(
        <div>
            <Header currentUser={currentUser} />
            <div className="container">
                <Component currentUser={currentUser} {...pageProps}  />
            </div>
        </div>
    );
};

AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const {data} = await client.get('/api/users/current-user');

    // Invoke the getInitialProps function from the Component (page) that will be loaded
    // getInitialProps must be done automatically since the AppComponent,
    // which is the parent, overrides the getInitialProps from it's children
    //
    // Checking if the component (page, child) has getInitialProps defined, otherwise don't invoke it.
    let pageProps = {};
    if(appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }

    return {
        pageProps,
        ...data
    };
};

export default AppComponent;