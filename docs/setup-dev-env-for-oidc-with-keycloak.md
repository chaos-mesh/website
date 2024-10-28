---
title: Setup Development Environment for OIDC with Keycloak
---

This document describe how to setup a local development environment with Keycloak, for OIDC integration. Different from the [Configure Development Environment](configure-development-environment.md), the development of OIDC requires a little more complex setup, and this document will guide you through the process.

Before you start, it is recommended to first read the [Configure Development Environment](configure-development-environment.md) document.

## Prerequisites

- [make](https://www.gnu.org/software/make/)
- [docker](https://docs.docker.com/install/)
- [golang](https://go.dev/doc/install), `v1.20` or later versions
- [gcc](https://gcc.gnu.org/)
- [helm](https://helm.sh/), `v3.16.2` or later versions
- [minikube](https://minikube.sigs.k8s.io/docs/start/)
- [nodejs](https://nodejs.org/en/) and [pnpm](https://pnpm.io/), for developing Chaos Dashboard

## Setup minikube Kubernetes Cluster, compile and install Chaos Mesh

1. Clone the Chaos Mesh repository to your local server:

   ```bash
   git clone https://github.com/chaos-mesh/chaos-mesh.git
   cd chaos-mesh
   ```

2. Compile Chaos Mesh container images directly in minikube:

   ```bash
   minikube start --mount --mount-string "$(pwd):$(pwd)"
   eval $(minikube -p minikube docker-env)
   UI=1 DEBUGGER=1 make image
   ```

3. Install Chaos Mesh:

   ```bash
   export CHAOS_MESH_HOST=chaos-mesh.$(minikube ip).nip.io
   helm upgrade --install chaos-mesh-debug ./helm/chaos-mesh --namespace=chaos-mesh-debug --create-namespace --set chaosDlv.enable=true --set controllerManager.leaderElection.enabled=false --set dashboard.ingress.enabled=true --set dashboard.ingress.hosts\[0\].name=$CHAOS_MESH_HOST
   ```

### Setup Local Provisioned OIDC Provider with Keycloak

[Keycloak](https://keycloak.org) is an open-source identity and access management solution, which s also a CNCF incubating project. Keycloak could be a feature-rich, general-purpose OIDC Provider, it makes it easy to secure applications and services with little to no code. With Keycloak, we could integrate OIDC with the minikube Kubernetes Cluster, just what we do it with EKS and GKE.

1. Install Keycloak:

   ```bash
   export KEYCLOAK_HOST=keycloak.$(minikube ip).nip.io
   helm upgrade --install keycloak \
     --namespace keycloak --create-namespace \
     oci://registry-1.docker.io/bitnamicharts/keycloak \
     --set auth.adminUser=admin,auth.adminPassword=admin \
     --set ingress.enabled=true,ingress.hostname=$KEYCLOAK_HOST,ingress.tls=true,ingress.selfSigned=true \
     --wait
   ```

2. Make Keycloak accessible:

   Start a new terminal, and run the following command:

   ```bash
   echo "http://chaos-mesh.$(minikube ip).nip.io"
   echo "https://keycloak.$(minikube ip).nip.io"
   minikube addons enable ingress
   minikube tunnel
   ```

   Then open a browser, visit printed URL like `https://keycloak.<replace-minkube-ip-here>.nip.io`, and login with the username `admin` and password `admin`.

   Please notice that the `minikube tunnel` command will block the terminal, so you need to keep it running. Then back to the previous terminal, continue next steps.

3. Setup OIDC for minkube kubernetes clueter, by patching `kube-apiserver`

   Manually configuring Keycloak would be a little bit complex, so we would provide several scripts to setup Keyclock, and patch `kube-apiserver` of minikube Kubernetes Cluster to enable OIDC for the cluster.

   Enter minikube node by `miniube ssh`, then switch to root user by `sudo -i`, and run the following commands:

   ```bash
   # setup kubectl
   export PATH=$PATH:/var/lib/minikube/binaries/$(ls /var/lib/minikube/binaries | head -n 1)
   export KUBECONFIG=/etc/kubernetes/admin.conf

   # get keycloak host
   export KEYCLOAK_HOST=$(kubectl get ingress -n keycloak | grep keycloak | awk '{print $3}')

   # save ca cert
   mkdir -p /etc/kubernetes/keycloak
   kubectl -n keycloak get secret $(kubectl -n keycloak get secret | grep keycloak | grep tls | awk '{print $1}') -o jsonpath='{.data.ca\.crt}' | base64 --decode > /etc/kubernetes/keycloak/ca.crt

   # setup keycloak admin CLI
   mkdir -p /usr/share/man/man1
   apt update && apt install openjdk-21-jdk -y
   curl -O -L https://github.com/keycloak/keycloak/releases/download/26.0.0/keycloak-26.0.0.tar.gz
   tar zxvf keycloak-26.0.0.tar.gz
   export PATH=$PATH:$PWD/keycloak-26.0.0/bin
   keytool -importcert -file /etc/kubernetes/keycloak/ca.crt -keystore /etc/kubernetes/keycloak/ca.jks -alias keycloak-ca -storepass chaos-mesh -noprompt
   kcadm.sh config truststore  /etc/kubernetes/keycloak/ca.jks --trustpass chaos-mesh
   kcadm.sh config credentials --server https://$KEYCLOAK_HOST --realm master --user admin --password admin

   # create new realm
   kcadm.sh create realms -s realm=kubernetes-oidc -s enabled=true

   # create custom user in this realm
   export USERNAME=random-user-$(openssl rand -hex 3)
   kcadm.sh create users -r kubernetes-oidc -s username=$USERNAME -s enabled=true
   user_id=$(kcadm.sh get users -r kubernetes-oidc -q username=$USERNAME --fields id --format csv | tail -n 1 | sed 's/"//g')
   kcadm.sh set-password -r kubernetes-oidc --userid $user_id --new-password password

   # create oidc client
   CLIENT_NAME=kubernetes-oidc-$(openssl rand -hex 4)
   # FIXME!! need use confidential client secret
   kcadm.sh create clients -r kubernetes-oidc -s clientId=$CLIENT_NAME -s enabled=true -s 'redirectUris=["*"]'
   client_id=$(kcadm.sh get clients -r kubernetes-oidc -q clientId=$CLIENT_NAME --fields id --format csv | tail -n 1 | sed 's/"//g')
   client_secret=$(kcadm.sh get clients/$client_id/client-secret -r kubernetes-oidc --fields value --format csv | tail -n 1 | sed 's/"//g')


   # install yq
   export VERSION=v4.33.2 BINARY=yq_linux_amd64 && curl -L -o - https://github.com/mikefarah/yq/releases/download/${VERSION}/${BINARY}.tar.gz |\
     tar xz && mv ${BINARY} /usr/bin/yq

   # patch kube apiserver
   systemctl stop kubelet

   yq -i '.spec.containers[0].command += [
     "--oidc-issuer-url=https://'${KEYCLOAK_HOST}'/realms/kubernetes-oidc",
     "--oidc-client-id='${CLIENT_NAME}'",
     "--oidc-ca-file=/keycloak-ca.crt"
   ]' /etc/kubernetes/manifests/kube-apiserver.yaml

   yq -i '.spec.volumes += [{
     "name": "keycloak-ca",
     "hostPath": {
       "path": "/etc/kubernetes/keycloak",
       "type": "DirectoryOrCreate"
     }
   }]' /etc/kubernetes/manifests/kube-apiserver.yaml

   yq -i '.spec.containers[0].volumeMounts += [{
     "name": "keycloak-ca",
     "mountPath": "/keycloak-ca.crt",
     "subPath": "ca.crt",
     "readOnly": true
   }]' /etc/kubernetes/manifests/kube-apiserver.yaml

   systemctl start kubelet

   # print message for user
   echo "Keycloak OIDC Client ID: $CLIENT_NAME"
   echo "Keycloak OIDC Client Secret: $client_secret"
   echo "username: $USERNAME, password: password"
   ```

   We have completed the setup of Keycloak, and patched `kube-apiserver` of minikube Kubernetes Cluster to enable OIDC for the cluster.

   Please note the `Client ID`, `Client Secret`, `username` and `password`, we would use it to login with Keyclock. Now we could left `minikube ssh`, continue to the next steps.

4. Login with OIDC

   We need [int128/kubelogin](https://github.com/int128/kubelogin) to login with OIDC, and we could use the following command to install it:

   ```bash
   # install krew and oidc-login
   apt update && apt install -y git &&
   OS="$(uname | tr '[:upper:]' '[:lower:]')" &&
   ARCH="$(uname -m | sed -e 's/x86_64/amd64/' -e 's/\(arm\)\(64\)\?.*/\1\2/' -e 's/aarch64$/arm64/')" &&
   KREW="krew-${OS}_${ARCH}" &&
   curl -LO "https://github.com/kubernetes-sigs/krew/releases/latest/download/${KREW}.tar.gz" &&
   tar zxvf "${KREW}.tar.gz" &&
   ./"${KREW}" install krew
   export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$PATH"

   kubectl krew install oidc-login
   ```

   Then we could login with OIDC:

   ```bash
   KEYCLOAK_HOST=keycloak.$(minikube ip).nip.io
   client_id="<replace-me-with-client-id-in-step-3>"
   client_secret="<replace-me-with-client-secret-in-step-3>"

   kubectl -n keycloak get secret $(kubectl -n keycloak get secret | grep keycloak | grep tls | awk '{print $1}') -o jsonpath='{.data.ca\.crt}' | base64 --decode > ca.crt
   kubectl oidc-login setup \
     --oidc-issuer-url https://${KEYCLOAK_HOST}/realms/kubernetes-oidc \
     --oidc-client-id $client_id \
     --oidc-client-secret $client_secret \
     --certificate-authority ca.crt
   ```
