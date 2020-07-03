# microservices-boilerplate

## Required Installs
1. Docker
2. Kubernetes
3. NPM
4. Skaffold

## Prerequisite
1. Setup the environment keys:
- `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<SECRET_KEY>`
- `kubectl create secret generic stripeTs-secret --from-literal=STRIPE_KEY=<STRIPE_PRIVATE_KEY>`

2. First time running ingress-nginx? (https://kubernetes.github.io/ingress-nginx/deploy/)
- `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/cloud/deploy.yaml`

3. We use the `posts.com` domain name to point to the Kubernetes cluster.

    Go to:
    ```
    Windows:
    C:\Windows\System32\drivers\etc\hosts

    Mac/Linux:
    /etc/hosts
    ```
    Paste `127.0.0.1 ticketing.dev` at the bottom of the `hosts` file.

## Possible weirdness
1. When you run `skaffold dev` for the first time it's possible that `ingress-nginx-admission` throws an error.
Close `skaffold dev` and execute `kubectl delete -A ValidatingWebhookConfiguration ingress-nginx-admission`. Rerun `skaffold dev`

## Start Application

Run this project using `skaffold dev` (may need to run 2 times)

## Terminate Application

Just type `CTRL+C` to terminate Skaffold.
Check if Skaffold deleted all the pods, services and deployments by running `kubectl get all`.
If this is not the case, run `kubectl delete all --all`
