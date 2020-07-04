import axios from 'axios';

export default ({req}) => {
    if(typeof window === 'undefined') {
        // We are on the server
        const serviceName = 'ingress-nginx-controller';
        const nameSpace = 'ingress-nginx';
        const clusterRoot = `http://${serviceName}.${nameSpace}.svc.cluster.local`;

        console.log("CLUSTER ROOT", clusterRoot);

        return axios.create({
            baseURL: clusterRoot,
            headers: req.headers
            // Take the headers from the browser and send it to ingress-nginx
            // 1. Send the JWT cookie to ingress-nginx (must be done manually
            //    since the server doesn't manage cookies like the browser does)
            // 2. Send the host (ticketing.dev) to ingress-nginx to specify the
            //    routing rules (ingress-srv.yaml > rules: > host: > paths: > ...)
        });
    } else{
        // We are on the browser
        return axios.create({
            baseURL: '/'
        });
    }
};