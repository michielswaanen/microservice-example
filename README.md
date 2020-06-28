# microservices-boilerplate

## Required Installs
1. Docker
2. Kubernetes
3. NPM
4. Skaffold

## Prerequisite
We use the `posts.com` domain name to point to the Kubernetes cluster.

Go to:
```
Windows:
C:\Windows\System32\drivers\etc\hosts

Mac/Linux:
/etc/hosts
```
Paste `127.0.0.1 ticketing.dev` at the bottom of the `hosts` file.

## Start Application

Run this project using `skaffold dev` (may need to run 2 times)

## Terminate Application

Just type `CTRL+C` to terminate Skaffold.
Check if Skaffold deleted all the pods, services and deployments by running `kubectl get all`.
If this is not the case, run `kubectl delete all -all`
