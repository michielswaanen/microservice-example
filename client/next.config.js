// If you modify this file don't forget to kill the client pod
// it won't reflect the changes because it's not listening to this file.
// command: kubectl delete pod <pod-name>
module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;
        return config;
    }
}